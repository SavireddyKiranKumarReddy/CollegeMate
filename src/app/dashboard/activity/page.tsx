"use client";
import { useEffect, useState } from "react";

export default function Activity() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/activity?limit=50").then((r) => r.json()).then((j) => setLogs(j.logs || [])).catch(() => {});
  }, []);

  return (
    <div>
      <p className="eyebrow">Super admin · Activity</p>
      <h1 className="h2 mt-2">Query logs <span className="muted font-normal text-[15px]">({logs.length})</span></h1>
      <div className="mt-5 grid gap-2">
        {logs.map((l) => (
          <div key={l.id} className="card px-4 py-3">
            <div className="text-[13.5px] font-medium">Q: {l.question}</div>
            <div className="muted mt-1 text-[13px]">A: {(l.answer_preview || "").slice(0, 160)}</div>
            <div className="mono muted mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
              <span className="badge">{l.confidence}</span>
              {(l.citations || []).map((c: any, i: number) => (
                <span key={i} className="badge">[{c.doc} · {c.dept}]</span>
              ))}
              <span>{new Date(l.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {logs.length === 0 && <div className="empty">No questions asked yet. Try /chat.</div>}
      </div>
    </div>
  );
}
