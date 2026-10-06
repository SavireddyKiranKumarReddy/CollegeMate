import { queryTerms } from "./rag";

export type FactCandidate = { question: string; answer: string; topic: string };

const SARVAM_URL = "https://api.sarvam.ai/v1/chat/completions";

/** Extract candidate Q/A facts from document text at upload time. Best-effort: [] on any failure. */
export async function extractFacts(text: string, max = 12): Promise<FactCandidate[]> {
  const key = process.env.SARVAM_API_KEY || "";
  const model = process.env.LLM_MODEL || "sarvam-105b";
  const clean = (text || "").slice(0, 15000).trim();
  if (!key || clean.length < 200) return [];
  try {
    const sys = `Extract standalone question-answer facts a college student would ask, grounded ONLY in the DOCUMENT below.
Rules: short questions (one line), answers as stated (keep exact dates, amounts, names). Skip vague or duplicate items. Max ${max} items, most useful first.
Reply as JSON: {"facts": [{"question": "...", "answer": "...", "topic": "fees|exams|hostel|placements|admissions|contacts|rules|other"}]}`;
    const res = await fetch(SARVAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-subscription-key": key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: `DOCUMENT:\n${clean}` },
        ],
        max_tokens: 2000,
        temperature: 0.1,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "fact_list",
            strict: true,
            schema: {
              type: "object",
              properties: {
                facts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { question: { type: "string" }, answer: { type: "string" }, topic: { type: "string" } },
                    required: ["question", "answer", "topic"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["facts"],
              additionalProperties: false,
            },
          },
        },
      }),
    });
    if (!res.ok) return [];
    const msg = (await res.json()).choices?.[0]?.message || {};
    const parsed = JSON.parse(String(msg.content || "{}").replace(/```json|```/g, "").trim());
    const facts = Array.isArray(parsed.facts) ? parsed.facts : [];
    return facts
      .filter((f: any) => f && typeof f.question === "string" && typeof f.answer === "string" && f.question.trim() && f.answer.trim())
      .slice(0, max)
      .map((f: any) => ({ question: f.question.trim().slice(0, 300), answer: f.answer.trim().slice(0, 1000), topic: String(f.topic || "other").slice(0, 40) }));
  } catch {
    return [];
  }
}

export type StoredFact = {
  id: string;
  question: string;
  answer: string;
  topic: string | null;
  source_label: string | null;
  source_document_id: string | null;
  department_id: string | null;
  status: string;
};

/** Facts-first lookup: verified facts win, stale facts serve at lower rank. Null when no confident hit. */
export async function lookupFact(sb: any, college_id: string, question: string): Promise<{ fact: StoredFact; stale: boolean } | null> {
  const terms = queryTerms(question);
  if (terms.length === 0) return null;
  const { data, error } = await sb
    .from("knowledge_facts")
    .select("id,question,answer,topic,source_label,source_document_id,department_id,status")
    .eq("college_id", college_id)
    .in("status", ["verified", "stale"])
    .limit(100);
  if (error || !data) return null;
  let best: StoredFact | null = null;
  let bestScore = 0;
  for (const f of data as StoredFact[]) {
    const hay = `${f.question} ${f.answer} ${f.topic || ""}`.toLowerCase();
    let s = 0;
    for (const t of terms) {
      if (hay.includes(t)) s += t.length > 5 ? 3 : 1;
    }
    // Require real overlap: 2+ term hits, or a single strong (long) hit.
    const hits = terms.filter((t) => hay.includes(t)).length;
    const strong = terms.some((t) => t.length > 5 && hay.includes(t));
    if (!(hits >= 2 || (hits === 1 && strong))) continue;
    if (f.status === "stale") s -= 2;
    if (s > bestScore) { bestScore = s; best = f; }
  }
  if (!best || bestScore < 2) return null;
  return { fact: best, stale: best.status === "stale" };
}
