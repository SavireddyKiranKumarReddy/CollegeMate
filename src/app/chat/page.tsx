"use client";
import { useEffect, useRef, useState } from "react";

type Cit = { doc: string; dept: string; chunk: number };
type Msg = { role: "q" | "a"; text: string; cits?: Cit[]; conf?: string; fb?: boolean };

const SUGGESTIONS = ["What is CSE fees for 2025?", "What is the minimum attendance requirement?", "What are the hostel rules?", "How do I apply for a bonafide certificate?"];

export default function Chat() {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log, busy]);

  async function ask(text?: string) {
    const query = (text || q).trim();
    if (!query || busy) return;
    setBusy(true);
    setLog((prev) => [...prev, { role: "q", text: query }]);
    setQ("");
    try {
      const history = log.slice(-3).flatMap((m) => [{ role: m.role === "q" ? "user" : "assistant", text: m.text }]);
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_domain: "mits-madanapalle", question: query, history }),
      });
      const j = await r.json();
      setLog((prev) => [...prev, {
        role: "a",
        text: j.answer || j.error || "Something went wrong.",
        cits: j.citations || [],
        conf: j.confidence,
        fb: j.fallback,
      }]);
    } catch {
      setLog((prev) => [...prev, { role: "a", text: "Network error. Check your connection and try again." }]);
    }
    setBusy(false);
  }

  return (
    <div className="page mx-auto max-w-2xl">
      <div className="page-head">
        <p className="eyebrow">Student chat · MITS-Madanapalle</p>
        <h1 className="h2">Ask CollegeMate</h1>
        <p className="lead mt-2 text-[14px]">Scoped to this college only. Every answer carries citations — or an honest fallback.</p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Suggested questions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="btn-ghost btn-sm" disabled={busy} onClick={() => ask(s)}>{s}</button>
        ))}
      </div>

      <div className="card card-pad mt-4 min-h-[260px] space-y-3" aria-live="polite" aria-label="Conversation">
        {log.length === 0 && (
          <div className="empty">
            <div className="empty-title">Ask about fees, attendance, hostel, certificates…</div>
            <div className="empty-body mono text-[12px]">answers cite [doc · dept · chunk]</div>
          </div>
        )}
        {log.map((m, i) => (
          <div key={i}>
            <div className={m.role === "q" ? "chat-bubble-q text-[14px]" : "chat-bubble-a text-[14px] leading-relaxed"}>
              <span className={`chat-role ${m.role === "q" ? "chat-role-q" : "chat-role-a"}`}>
                <span className="dot" aria-hidden="true" />{m.role === "q" ? "YOU" : "COLLEGEMATE"}
              </span>
              <div>{m.text}</div>
            </div>
            {m.role === "a" && (m.cits?.length || m.conf) ? (
              <div className="mono muted mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                {m.conf && <span className={`badge ${m.fb ? "badge-amber" : "badge-green"}`}>{m.fb ? "fallback" : m.conf}</span>}
                {(m.cits || []).map((c, j) => (
                  <span key={j} className="badge">[{c.doc} · {c.dept} · #{c.chunk}]</span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {busy && <p className="mono muted flex items-center gap-2 text-[12px]"><span className="spinner" aria-hidden="true" /> retrieving + answering…</p>}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="input"
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about fees, cutoffs, placements…"
          aria-label="Your question"
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button className="btn-primary min-w-24" disabled={busy || !q.trim()} onClick={() => ask()}>{busy ? "…" : "Ask"}</button>
      </div>
    </div>
  );
}
