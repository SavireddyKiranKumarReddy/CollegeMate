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
    if (cname === "your college") {
      const { data } = await sb.from("colleges").select("name").eq("id", cid).maybeSingle();
      if (data?.name) cname = data.name;
    }

    // Last-resort redirect: honest, actionable, logged for admin review. Never a dead end.
    const redirectUnanswered = async () => {
      const text = "I don't have that in the college records yet. I have noted your question for the college admin. Meanwhile I can help with exams, fees, attendance, hostel, placements or admissions. Which topic do you need?";
      await sb.from("query_logs").insert({
        college_id: cid,
        question: question.slice(0, 500),
        answer_preview: "Unanswered, sent to admin review.",
        citations: [],
        confidence: "unanswered",
      });
      return NextResponse.json({ answer: text, citations: [], fallback: false });
    };

    // Small talk never needs retrieval — answer directly, no fallback.
    const norm = question.trim().toLowerCase().replace(/[!.,\s]+$/g, "");
    const GREET = new Set(["hi", "hii", "hiii", "hello", "hey", "heyy", "namaste", "good morning", "good afternoon", "good evening"]);
    const THANKS = new Set(["thanks", "thank you", "thankyou", "thanks a lot", "thank you so much"]);
    const BYE = new Set(["bye", "goodbye", "see you", "see you later"]);
    let small: string | null = null;
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    // Greetings are detected by words, so "hey hii" and "hello there" count too.
    const GREET_WORDS = new Set([...GREET, "there", "good", "morning", "afternoon", "evening", "dear", "heyhey"]);
    const words = norm.split(/\s+/).filter(Boolean);
    const isGreeting = words.length > 0 && words.length <= 4 && words.every((w: string) => GREET_WORDS.has(w));
    if (isGreeting) small = pick([
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

    // Identity: answered directly, never retrieved, never a fallback.
    if (/(who are you|your name|about yourself|what are you|introduce yourself)/i.test(question)) {
      const text = `I'm CollegeMate, your college assistant. I answer from official ${cname} documents and always show my sources. Ask me about exams, fees, attendance, hostel, placements or admissions.`;
      await sb.from("query_logs").insert({
        college_id: cid,
        question: question.slice(0, 500),
        answer_preview: text.slice(0, 500),
        citations: [],
        confidence: "identity",
      });
      return NextResponse.json({ answer: text, citations: [], fallback: false });
    }

    // Topic words route to content tiers; generic branches skip them.
    const TOPIC = /\b(fee|fees|exam|exams|hostel|placement|placements|attendance|admission|admissions|scholarship|club|event|contact|library|transport|mess|salary|package|recruiter|counselling|counseling|mentor|ragging|ncc|nss)\b/i;

    // Meta: "what do you know / list your info" → honest coverage listing from live data.
    // Skipped for topic-specific questions (they go to content tiers instead).
    if (!TOPIC.test(question) && /(what (can you|do you)|list|show).*(know|info|knowledge|answer|topics|cover|have)|what can you (answer|do|tell)/i.test(question)) {
      try {
        const { data: all } = await sb.from("knowledge_facts").select("topic").eq("college_id", cid).eq("status", "verified").limit(200);
        const { count: dcount } = await sb.from("departments").select("id", { count: "exact", head: true }).eq("college_id", cid);
        const topics = Array.from(new Set((all || []).map((f: any) => f.topic).filter(Boolean))).slice(0, 8);
        if ((all || []).length > 0) {
          const text = `I currently answer from ${(all || []).length} verified records covering ${topics.join(", ") || "college information"} across ${dcount || 0} departments. Try asking about exams, fees, attendance, hostel, placements or admissions.`;
          await sb.from("query_logs").insert({ college_id: cid, question: question.slice(0, 500), answer_preview: text.slice(0, 500), citations: [], confidence: "high" });
          return NextResponse.json({ answer: text, citations: [], confidence: "high", fallback: false });
        }
      } catch (e) { console.error("meta answer failed", e); }
    }

    // About: "tell me about MITS" → overview composed from verified facts only.
    if (/(tell me about|about (the )?college|about mits|overview of|introduce|what is (this|the) college)/i.test(question)) {
      try {
        const { data: facts } = await sb.from("knowledge_facts").select("id,question,answer,source_label").eq("college_id", cid).eq("status", "verified").limit(12);
        if (facts && facts.length > 0) {
          const ctx = facts.map((f: any, i: number) => `[S${i + 1}] ${f.answer}`).join("\n\n").slice(0, 6000);
          let answer = "";
          let used: number[] = [];
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
                  { role: "system", content: "Describe the college in 3 to 5 plain sentences using ONLY the FACTS below. Plain text, no markdown. Reply as JSON: {\"answer\": \"...\", \"used\": [fact numbers]}. If the facts cannot describe the college, reply exactly: NOT_IN_DATA" },
                  { role: "user", content: `FACTS:\n${ctx}\n\nQUESTION: ${question}` },
                ],
                max_tokens: 600,
                temperature: 0.1,
                reasoning_effort: null,
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "overview", strict: true,
                    schema: { type: "object", properties: { answer: { type: "string" }, used: { type: "array", items: { type: "integer" } } }, required: ["answer", "used"], additionalProperties: false },
                  },
                },
              }),
            });
            const dmsg = (await dr.json()).choices?.[0]?.message || {};
            const parsed = JSON.parse(String(dmsg.content || "{}").replace(/```json|```/g, "").trim());
            answer = String(parsed.answer || "");
            used = Array.isArray(parsed.used) ? parsed.used : [];
          } catch { answer = ""; }
          if (answer && !answer.includes("NOT_IN_DATA")) {
            // Prefer the model's citations; otherwise cite the facts the answer overlaps most.
            let cited = used.map((n: number) => facts[n - 1]).filter(Boolean);
            if (cited.length === 0) {
              const at = queryTerms(`${answer} ${question}`);
              cited = (facts as any[])
                .map((f: any) => ({ f, s: at.filter((t) => `${f.question} ${f.answer}`.toLowerCase().includes(t)).length }))
                .filter((x: any) => x.s > 0)
                .sort((a: any, b: any) => b.s - a.s)
                .slice(0, 3)
                .map((x: any) => x.f);
            }
            if (cited.length === 0) return redirectUnanswered();
            const citations = cited.slice(0, 5).map((f: any) => ({ doc: f.source_label || "knowledge base", dept: "stored", fact: f.id, chunk: -1 }));
            await sb.from("query_logs").insert({ college_id: cid, question: question.slice(0, 500), answer_preview: answer.slice(0, 500), citations, confidence: "high" });
            return NextResponse.json({ answer, citations, confidence: "high", fallback: false });
          }
        }
      } catch (e) { console.error("about answer failed", e); }
    }

    const pastUserTexts = past.filter((p) => p.role === "user").map((p) => p.content);
    const histTerms = queryTerms(pastUserTexts.join(" "));
    const qtrim = question.trim();

    // Workspace-structure questions ("what depts do we have") are answered
    // from live directory data, never from canned text. Academic program
    // questions (cse, ece, branches, courses) skip this and use stored facts.
    // Topic-specific questions ("what do you know about fees") skip it too.
    const ACADEMIC = /\b(cse|ece|eee|mech|mechanical|civil|branch|branches|program|programs|course|courses|btech|mtech|mba|mca|bca|bba)\b/i;
    if (!ACADEMIC.test(question) && !TOPIC.test(question) && /(department|dept\b|depts|document|docs?\b|files?|what (do you|does \S+ )?(know|have)|list of|how many|which (branches|courses|departments|docs))/i.test(question)) {
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
                max_tokens: 300,
                temperature: 0.1,
                reasoning_effort: null,
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

    // Fragments and acknowledgements get a conversational ask-back, never a dead end.
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

    // Broad/vague queries ("i need", "college info") carry no answerable content:
    // offer a topic menu instead of retrieving random chunks.
    const FILLER = new Set(["i", "need", "want", "give", "tell", "show", "know", "about", "college", "student", "students", "info", "information", "details", "detail", "some", "any", "anything", "everything", "please", "entire", "whole", "full"]);
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
      return redirectUnanswered();
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
      return redirectUnanswered();
    }
    let parsed: any = {};
    try {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    } catch {
      parsed = { answer: content.slice(0, 1000), used: [], confidence: "low" };
    }
    const used: number[] = Array.isArray(parsed.used) ? parsed.used : [];
    // No cited source = no grounded answer. Redirect, never serve uncited as fact.
    if (used.length === 0) {
      return redirectUnanswered();
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
