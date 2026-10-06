import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { queryTerms, scoreChunk } from "@/lib/rag";
import { lookupFact } from "@/lib/knowledge";

const SARVAM_URL = "https://api.sarvam.ai/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const { college_id, college_domain, question, history } = await req.json();
    if (!question?.trim()) return NextResponse.json({ error: "question required" }, { status: 400 });

    // Recent conversation for context (pronouns, follow-ups, ambiguity). Bounded.
    const past: { role: "user" | "assistant"; content: string }[] = Array.isArray(history)
      ? history
          .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
          .slice(-6)
          .map((m: any) => ({ role: m.role, content: String(m.text).slice(0, 500) }))
      : [];

    const sb = supabaseAdmin();
    let cid = college_id as string | undefined;
    let cname = "your college";
    if (!cid && college_domain) {
      const { data } = await sb.from("colleges").select("id,name").eq("domain", college_domain).maybeSingle();
      cid = data?.id;
      if (data?.name) cname = data.name;
    }
    if (!cid) {
      const { data } = await sb.from("colleges").select("id,name").eq("status", "approved").limit(1).maybeSingle();
      cid = data?.id;
      if (data?.name) cname = data.name;
    }
    if (!cid) return NextResponse.json({ error: "no college" }, { status: 400 });

    // Small talk never needs retrieval — answer directly, no fallback.
    const norm = question.trim().toLowerCase().replace(/[!.,\s]+$/g, "");
    const GREET = new Set(["hi", "hii", "hiii", "hello", "hey", "heyy", "namaste", "good morning", "good afternoon", "good evening"]);
    const THANKS = new Set(["thanks", "thank you", "thankyou", "thanks a lot", "thank you so much"]);
    const BYE = new Set(["bye", "goodbye", "see you", "see you later"]);
    let small: string | null = null;
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    if (GREET.has(norm)) small = pick([
      `Hello! I'm CollegeMate. Ask me anything about ${cname}, like exams, fees, attendance, hostel or placements, and I'll answer from official college documents.`,
      `Hi there! Looking for something about ${cname}? Ask away and I'll find it in the official college documents.`,
      `Hey! I can look up exams, fees, hostel, placements and more for ${cname}. What do you need?`,
    ]);
    else if (THANKS.has(norm)) small = pick([
      "You're welcome! Ask anytime you need something about your college.",
      "Happy to help! Anything else about your college, just ask.",
    ]);
    else if (BYE.has(norm)) small = pick([
      "Goodbye! I'll be here whenever you have a question about your college.",
      "See you soon! Come back anytime with college questions.",
    ]);
    if (small) {
      await sb.from("query_logs").insert({
        college_id: cid,
        question: question.slice(0, 500),
        answer_preview: small.slice(0, 500),
        citations: [],
        confidence: "greeting",
      });
      return NextResponse.json({ answer: small, citations: [], fallback: false });
    }

    const pastUserTexts = past.filter((p) => p.role === "user").map((p) => p.content);
    const histTerms = queryTerms(pastUserTexts.join(" "));
    const qtrim = question.trim();

    // Workspace-structure questions ("what depts do we have") are answered
    // from live directory data, never from canned text.
    if (/(department|dept\b|depts|document|docs?\b|files?|what (do you|does \S+ )?(know|have)|list of|how many|which (branches|courses|departments|docs))/i.test(question)) {
      try {
        const { data: depts } = await sb.from("departments").select("name,code").eq("college_id", cid).order("name").limit(50);
        const { data: docs } = await sb.from("documents").select("title,file_name").eq("college_id", cid).order("created_at", { ascending: false }).limit(50);
        if ((depts && depts.length > 0) || (docs && docs.length > 0)) {
          const dir = [
            `College: ${cname}`,
            `Departments (${depts?.length || 0}): ${(depts || []).map((d: any) => d.code ? `${d.name} (${d.code})` : d.name).join("; ") || "none yet"}`,
            `Documents (${docs?.length || 0}): ${(docs || []).map((d: any) => d.title || d.file_name).join("; ") || "none yet"}`,
          ].join("\n");
          let answer = "";
          try {
            const key2 = process.env.SARVAM_API_KEY || "";
            const model2 = process.env.LLM_MODEL || "sarvam-105b";
            if (!key2) throw new Error("no key");
            const dr = await fetch(SARVAM_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", "api-subscription-key": key2, Authorization: `Bearer ${key2}` },
              body: JSON.stringify({
                model: model2,
                messages: [
                  { role: "system", content: "Answer the QUESTION using ONLY the DIRECTORY below, in one or two plain sentences. Plain text only, no markdown. If DIRECTORY lacks it, reply exactly: NOT_IN_DATA" },
                  { role: "user", content: `DIRECTORY:\n${dir}\n\nQUESTION: ${question}` },
                ],
                max_tokens: 200,
                temperature: 0.1,
              }),
            });
            const dmsg = (await dr.json()).choices?.[0]?.message || {};
            answer = String(dmsg.content || dmsg.reasoning_content || "").trim();
          } catch { answer = ""; }
          if (!answer || answer.includes("NOT_IN_DATA")) {
            answer = `We have ${(depts || []).length} departments: ${(depts || []).map((d: any) => d.code ? `${d.name} (${d.code})` : d.name).join(", ") || "none yet"}.`;
          }
          const citations = [{ doc: `${cname} workspace`, dept: "directory", chunk: -1 }];
          await sb.from("query_logs").insert({
            college_id: cid,
            question: question.slice(0, 500),
            answer_preview: answer.slice(0, 500),
            citations,
            confidence: "high",
          });
          return NextResponse.json({ answer, citations, confidence: "high", fallback: false });
        }
      } catch (e) {
        console.error("directory answer failed", e);
      }
    }

    // Broad/vague queries ("i need", "college info") carry no answerable content:
    // offer a topic menu instead of retrieving random chunks.
    const FILLER = new Set(["i", "need", "want", "give", "tell", "show", "know", "about", "college", "info", "information", "details", "detail", "some", "any", "anything", "everything", "please", "entire", "whole", "full"]);
    const contentTerms = queryTerms(question).filter((t) => !FILLER.has(t));
    if (contentTerms.length === 0) {
      const text = "Sure! Which topic do you need: exams, fees, attendance, hostel, placements or admissions?";
      await sb.from("query_logs").insert({
        college_id: cid,
        question: question.slice(0, 500),
        answer_preview: text.slice(0, 500),
        citations: [],
        confidence: "menu",
      });
      return NextResponse.json({ answer: text, citations: [], fallback: false });
    }

    // Fragments and acknowledgements get a conversational ask-back, never a dead-end fallback.
    const isFrag = /(\.\.\.|…)\s*$/.test(qtrim) || /^(and|what about|how about|why|why not|tell me more|more|continue|explain|elaborate|and then|\?+)\??$/i.test(qtrim);
    const isAck = /^(ok|okay|k|hmm?|yes|yeah?|yep|no|nope|alright|sure)\.?$/i.test(qtrim);
    if (isFrag || isAck) {
      const hint = histTerms.slice(0, 3).join(", ");
      const text = isAck
        ? "Got it. What else would you like to know about your college?"
        : hint
          ? `I want to get you the right answer. Are you still asking about ${hint}? Tell me a little more.`
          : "I want to get you the right answer. Could you say a little more about what you are looking for?";
      await sb.from("query_logs").insert({
        college_id: cid,
        question: question.slice(0, 500),
        answer_preview: text.slice(0, 500),
        citations: [],
        confidence: isAck ? "ack" : "clarify",
      });
      return NextResponse.json({ answer: text, citations: [], fallback: false });
    }

    const terms = Array.from(new Set([...queryTerms(question), ...histTerms])).slice(0, 10);

    // Tier 1: stored facts (verified first, stale flagged) — instant, no LLM.
    try {
      const hit = await lookupFact(sb, cid, question);
      if (hit) {
        const { fact, stale } = hit;
        await sb.from("query_logs").insert({
          college_id: cid,
          question: question.slice(0, 500),
          answer_preview: fact.answer.slice(0, 500),
          citations: [{ doc: fact.source_label || "knowledge base", dept: "stored", fact: fact.id }],
          confidence: stale ? "medium" : "high",
        });
        return NextResponse.json({
          answer: fact.answer,
          citations: [{ doc: fact.source_label || "knowledge base", dept: "stored", fact: fact.id, chunk: -1 }],
          confidence: stale ? "medium" : "high",
          fallback: false,
        });
      }
    } catch (e) {
      console.error("fact lookup failed", e);
    }

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
        answer: "Sorry, I don't have specific information about that at the moment. I'll be able to help once the relevant information is added to my knowledge base.",
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

    const sys = `You are CollegeMate, a helpful college assistant for students. Answer ONLY from the CONTEXT below (the college's verified knowledge base).

HARD RULES
- Never invent, assume, or guess: no made-up names, phone numbers, emails, deadlines, fees, events, clubs, facilities, policies, or procedures. If it is not in CONTEXT, say so.
- Preserve the exact meaning of dates, fees, eligibility, and procedures. If CONTEXT is incomplete or conflicting, state the uncertainty plainly instead of choosing.
- Never claim information is current unless CONTEXT says so.
- For harassment, ragging, threats, discrimination, mental-health, medical, or emergency topics: be supportive, make no accusations or diagnoses, and point to the verified college authority or emergency contact in CONTEXT. If none exists there, say so clearly.
- If the answer is not in CONTEXT, reply exactly: NOT_IN_DATA
- Never respond with a generic deflection ("I can help with X, Y, Z — what do you need?"). Either answer from CONTEXT with citations, or reply NOT_IN_DATA.
- Answer only what was asked; politely decline anything outside college knowledge.
- If the question has multiple plausible meanings with different answers, ask which one is meant instead of guessing.
- If a natural next step exists AND is in CONTEXT, offer it briefly at the end. Never force a follow-up.
- Use the conversation history for context (pronouns, "it", "that workshop") instead of asking the student to repeat.

STYLE
- Warm, respectful, student-friendly plain sentences. Concise by default (2-4 sentences); bullets only when they help.
- Plain text only: no markdown, no emojis, no ALL CAPS, no long disclaimers.
- Use almost no dashes: never use em-dashes or dash-led breaks to join ideas. Use commas or full stops instead. A dash is allowed only when highly required for meaning.
- Name the source document or department inside the answer when it matters (fees, exams, deadlines, contacts).
- Otherwise reply as JSON: {"answer": "<answer>", "used": [source numbers like 1,2], "confidence": "high|medium|low"}`;
    const res = await fetch(SARVAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-subscription-key": key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sys },
          ...past,
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
        answer: "Sorry, I don't have specific information about that at the moment. I'll be able to help once the relevant information is added to my knowledge base.",
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
    // No cited source = no grounded answer. Never serve an uncited answer as fact.
    if (used.length === 0) {
      await sb.from("query_logs").insert({
        college_id: cid,
        question: question.slice(0, 500),
        answer_preview: "Not in official data.",
        citations: [],
        confidence: "none",
      });
      return NextResponse.json({
        answer: "Sorry, I don't have specific information about that at the moment. I'll be able to help once the relevant information is added to my knowledge base.",
        citations: [],
        confidence: "none",
        fallback: true,
      });
    }
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
