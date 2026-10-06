"use client";
import { use } from "react";
import { useEffect, useRef, useState } from "react";
import { useCollege } from "@/lib/use-college";

type Cit = { doc: string; dept: string; chunk: number };
type Msg = { role: "q" | "a"; text: string; cits?: Cit[]; conf?: string; fb?: boolean };

export default function CollegeChat({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);
  const [q, setQ] = useState("");
  const [log, setLog] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log, busy]);

  async function ask(text?: string) {
    const query = (text || q).trim();
    if (!query || busy || !college) return;
    setBusy(true);
    setLog((prev) => [...prev, { role: "q", text: query }]);
    setQ("");
    try {
      const history = log.slice(-3).flatMap((m) => [{ role: m.role === "q" ? "user" : "assistant", text: m.text }]);
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_id: college.id, question: query, history }),
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
    <div>
      <div className="page-head">
        <p className="eyebrow">College admin · Test chat</p>
        <h1 className="h2">Chat test <span className="muted font-normal text-[14px]">scoped to {college?.name || "…"}</span></h1>
        <p className="lead mt-2 text-[14px]">Same RAG students get. Upload docs, then verify answers here with citations.</p>
      </div>
      <div className="card card-pad min-h-[240px] space-y-3" aria-live="polite" aria-label="Test conversation">
        {log.length === 0 && (
          <div className="empty">
            <div className="empty-title">Ask anything</div>
            <div className="empty-body mt-1 text-[13px]">Any question about your college. One trusted answer.</div>
            <div className="empty-body mt-1 text-[13px]">e.g. “What is CSE fees?”</div>
            <div className="empty-body mono mt-1 text-[12px]">answers cite [doc · dept · chunk]</div>
          </div>
        )}
        {log.map((m, i) => (
          <div key={i}>
            {m.role === "q" ? (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#16130C] px-3.5 py-2.5 text-[14px] font-medium text-white">{m.text}</div>
              </div>
            ) : (
              <div className="max-w-[95%] py-1 text-[14px] leading-relaxed">{m.text}</div>
            )}
            {m.role === "a" && (m.cits?.length || m.conf) ? (
              <div className="mono muted mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                {m.conf && <span className={`badge ${m.fb ? "badge-amber" : "badge-green"}`}>{m.fb ? "fallback" : m.conf}</span>}
                {(m.cits || []).map((c, j) => (
                  <span key={j} className="badge">[{c.doc}{c.dept && c.dept !== "stored" ? ` · ${c.dept}` : ""}{c.chunk >= 0 ? ` · #${c.chunk}` : ""}]</span>
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
          placeholder="Test a question…"
          aria-label="Test question"
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button className="btn-primary min-w-24" disabled={busy || !q.trim() || !college} onClick={() => ask()}>{busy ? "…" : "Ask"}</button>
      </div>
    </div>
  );
}
