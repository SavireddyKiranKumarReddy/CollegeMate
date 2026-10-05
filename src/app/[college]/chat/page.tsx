"use client";
import { use } from "react";
import { useState } from "react";
import { useCollege } from "@/lib/use-college";

type Cit = { doc: string; dept: string; chunk: number };

export default function CollegeChat({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ q: string; a: string; cits: Cit[]; conf?: string; fb?: boolean }[]>([]);
  const [busy, setBusy] = useState(false);

  async function ask(text?: string) {
    const query = (text || q).trim();
    if (!query || busy || !college) return;
    setBusy(true);
    setQ("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_id: college.id, question: query }),
      });
      const j = await r.json();
      setLog((prev) => [...prev, { q: query, a: j.answer || j.error, cits: j.citations || [], conf: j.confidence, fb: j.fallback }]);
    } catch {
      setLog((prev) => [...prev, { q: query, a: "Network error.", cits: [] }]);
    }
    setBusy(false);
  }

  return (
    <div>
      <p className="eyebrow">College admin · Test chat</p>
      <h1 className="h2 mt-2">Chat test <span className="muted font-normal text-[14px]">scoped to {college?.name || "…"}</span></h1>
      <p className="lead mt-2 text-[14px]">Same RAG students get. Upload docs, then verify answers here with citations.</p>
      <div className="card card-pad mt-5 min-h-[240px] space-y-3">
        {log.length === 0 && <div className="empty">Ask anything — e.g. “What is CSE fees?”</div>}
        {log.map((m, i) => (
          <div key={i}>
            <div className="chat-bubble-q text-[14px]"><span className="mono muted mr-2 text-[11px]">YOU</span>{m.q}</div>
            <div className="chat-bubble-a mt-1.5 text-[14px]"><span className="mono muted mr-2 text-[11px]">AI</span>{m.a}</div>
            {(m.cits.length > 0 || m.conf) && (
              <div className="mono muted mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                {m.conf && <span className={`badge ${m.fb ? "badge-amber" : "badge-green"}`}>{m.fb ? "fallback" : m.conf}</span>}
                {m.cits.map((c, j) => <span key={j} className="badge">[{c.doc} · {c.dept} · #{c.chunk}]</span>)}
              </div>
            )}
          </div>
        ))}
        {busy && <p className="mono muted text-[12px]">retrieving + answering…</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Test a question…" onKeyDown={(e) => e.key === "Enter" && ask()} />
        <button className="btn-primary min-w-24" disabled={busy} onClick={() => ask()}>{busy ? "…" : "Ask"}</button>
      </div>
    </div>
  );
}
