"use client";
import { useState } from "react";

type Cit = { doc: string; dept: string; chunk: number };
type Msg = { role: "q" | "a"; text: string; cits?: Cit[]; conf?: string; fb?: boolean };

const SUGGESTIONS = ["What is CSE fees for 2025?", "What is the minimum attendance requirement?", "What are the hostel rules?", "How do I apply for a bonafide certificate?"];

export default function Chat() {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  async function ask(text?: string) {
    const query = (text || q).trim();
    if (!query || busy) return;
    setBusy(true);
    setLog((prev) => [...prev, { role: "q", text: query }]);
    setQ("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_domain: "mits-madanapalle", question: query }),
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
      setLog((prev) => [...prev, { role: "a", text: "Network error. Try again." }]);
    }
    setBusy(false);
  }

  return (
    <div className="page mx-auto max-w-2xl">
      <p className="eyebrow">Student chat · MITS-Madanapalle</p>
      <h1 className="h2 mt-2">Ask CollegeMate</h1>
      <p className="lead mt-2 text-[14px]">Scoped to this college only. Every answer carries citations — or an honest fallback.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="btn-ghost btn-sm" disabled={busy} onClick={() => ask(s)}>{s}</button>
        ))}
      </div>

      <div className="card card-pad mt-4 min-h-[260px] space-y-3">
        {log.length === 0 && (
          <div className="empty">
            Ask about fees, attendance, hostel, certificates…
            <br />
            <span className="mono text-[12px]">answers cite [doc · dept · chunk]</span>
          </div>
        )}
        {log.map((m, i) => (
          <div key={i}>
            <div className={m.role === "q" ? "chat-bubble-q text-[14px]" : "chat-bubble-a text-[14px] leading-relaxed"}>
              <span className="mono mr-2 text-[11px] muted">{m.role === "q" ? "YOU" : "AI"}</span>
              {m.text}
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
        {busy && <p className="mono muted text-[12px]">retrieving + answering…</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="input"
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about fees, cutoffs, placements…"
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button className="btn-primary min-w-24" disabled={busy} onClick={() => ask()}>{busy ? "…" : "Ask"}</button>
      </div>
    </div>
  );
}
