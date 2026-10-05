import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { queryTerms, scoreChunk } from "@/lib/rag";

const SARVAM_URL = "https://api.sarvam.ai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { college_id, college_domain, question } = await req.json();
    if (!question?.trim()) return NextResponse.json({ error: "question required" }, { status: 400 });

    const sb = supabaseAdmin();
    let cid = college_id as string | undefined;
    if (!cid && college_domain) {
      const { data } = await sb.from("colleges").select("id").eq("domain", college_domain).maybeSingle();
      cid = data?.id;
    }
    if (!cid) {
      const { data } = await sb.from("colleges").select("id").eq("status", "approved").limit(1).maybeSingle();
      cid = data?.id;
    }
    if (!cid) return NextResponse.json({ error: "no college" }, { status: 400 });

    const terms = queryTerms(question);
    let chunks: any[] = [];
    if (terms.length > 0) {
      const ors = terms.map((t) => `content_preview.ilike.%${t}%`).join(",");
      const { data } = await sb
        .from("document_chunks")
        .select("id, content_preview, chunk_index, document_id, department_id, documents!inner(file_name,title), departments(name)")
        .eq("college_id", cid)
        .or(ors)
        .limit(30);
      chunks = (data || [])
        .map((c: any) => ({ ...c, score: scoreChunk(c.content_preview || "", terms) }))
        .filter((c: any) => c.score > 0)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 5);
    }

    if (chunks.length === 0) {
      await sb.from("query_logs").insert({
        college_id: cid,
        question: question.slice(0, 500),
        answer_preview: "Not in official data.",
        citations: [],
        confidence: "none",
      });
      return NextResponse.json({
        answer: "I don't have this in the college's official data yet. Please contact the college office — or ask faculty to upload the relevant document.",
        citations: [],
        confidence: "none",
        fallback: true,
      });
    }

    const context = chunks
      .map((c: any, i: number) => `[S${i + 1}] doc="${c.documents?.title || c.documents?.file_name}" dept="${c.departments?.name || "general"}" chunk=${c.chunk_index}\n${c.content_preview}`)
      .join("\n\n")
      .slice(0, 12000);

    const key = process.env.SARVAM_API_KEY || "";
    const model = process.env.LLM_MODEL || "sarvam-105b";
    if (!key) return NextResponse.json({ error: "LLM not configured" }, { status: 500 });

    const sys = `You answer ONLY from the CONTEXT below (college's verified documents). Rules:
- If the answer is not in CONTEXT, reply exactly: NOT_IN_DATA
- Otherwise reply as JSON: {"answer": "<2-4 sentence answer>", "used": [source numbers like 1,2], "confidence": "high|medium|low"}`;
    const res = await fetch(SARVAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-subscription-key": key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${question}` },
        ],
        max_tokens: 600,
        temperature: 0.2,
        reasoning_effort: null,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "cited_answer",
            strict: true,
            schema: {
              type: "object",
              properties: {
                answer: { type: "string" },
                used: { type: "array", items: { type: "integer" } },
                confidence: { type: "string" },
              },
              required: ["answer", "used", "confidence"],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    const raw = await res.text();
    if (!res.ok) throw new Error("LLM error: " + raw.slice(0, 300));
    const msg = JSON.parse(raw).choices?.[0]?.message || {};
    const content = (msg.content || msg.reasoning_content || "").trim();
    if (content.trim() === "NOT_IN_DATA" || content.includes("NOT_IN_DATA")) {
      return NextResponse.json({
        answer: "I don't have this in the college's official data yet. Please contact the college office — or ask faculty to upload the relevant document.",
        citations: [],
        confidence: "none",
        fallback: true,
      });
    }
    let parsed: any = {};
    try {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    } catch {
      parsed = { answer: content.slice(0, 1000), used: [], confidence: "low" };
    }
    const used: number[] = Array.isArray(parsed.used) ? parsed.used : [];
    const citations = used
      .map((n: number) => chunks[n - 1])
      .filter(Boolean)
      .map((c: any) => ({
        doc: c.documents?.title || c.documents?.file_name,
        dept: c.departments?.name || "general",
        chunk: c.chunk_index,
      }));
    await sb.from("query_logs").insert({
      college_id: cid,
      question: question.slice(0, 500),
      answer_preview: (parsed.answer || "").slice(0, 500),
      citations,
      confidence: parsed.confidence || "medium",
    });
    return NextResponse.json({ answer: parsed.answer || "", citations, confidence: parsed.confidence || "medium", fallback: false });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
