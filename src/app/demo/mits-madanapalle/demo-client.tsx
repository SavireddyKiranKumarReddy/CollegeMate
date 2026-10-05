"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const EXAMPLES = [
  "What is the minimum attendance requirement?",
  "Who is the CSE HOD?",
  "What are the hostel rules?",
  "How do I apply for a bonafide certificate?",
  "What is the placement eligibility criteria?",
];

export default function DemoClient() {
  const [college, setCollege] = useState<any>(null);
  const [depts, setDepts] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ q: string; a: string }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/colleges").then((x) => x.json()).catch(() => null);
      const c = r?.colleges?.find((x: any) => x.domain === "mits-madanapalle");
      setCollege(c || null);
      if (c) {
        const d = await fetch(`/api/departments?college_id=${c.id}`).then((x) => x.json()).catch(() => null);
        setDepts(d?.departments || []);
        const docsRes = await fetch(`/api/documents?college_id=${c.id}`).then((x) => x.json()).catch(() => null);
        setDocs(docsRes?.documents || []);
      }
    })();
  }, []);

  async function ask(text?: string) {
    const query = (text || q).trim();
    if (!query || busy) return;
    setBusy(true);
    const mine = query;
    setQ("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_domain: "mits-madanapalle", question: mine }),
      });
      const j = await r.json();
      setLog((prev) => [...prev, { q: mine, a: j.answer || j.error || "Something went wrong." }]);
    } catch {
      setLog((prev) => [...prev, { q: mine, a: "Network error. Try again." }]);
    }
    setBusy(false);
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="grid-3">
        <div className="card card-pad">
          <div className="eyebrow">College overview</div>
          <div className="mt-2 text-[16px] font-semibold">{college ? college.name : "Loading…"}</div>
          <div className="muted mt-1 text-[13px]">{college ? `${college.city} · ${college.status}` : "Fetching workspace…"}</div>
        </div>
        <div className="card card-pad">
          <div className="eyebrow">Departments ({depts.length})</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {depts.map((d) => <span key={d.id} className="badge mono !text-[11px]">{d.code || d.name}</span>)}
            {depts.length === 0 && <span className="muted text-[13px]">No departments yet — admin adds them at /college.</span>}
          </div>
        </div>
        <div className="card card-pad">
          <div className="eyebrow">Knowledge sources ({docs.length})</div>
          <div className="muted mt-2 text-[13px]">{docs.length === 0 ? "No documents yet — faculty upload at /faculty." : `${docs.length} documents indexed.`}</div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="eyebrow">Ask CollegeMate</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((e) => (
            <button key={e} onClick={() => ask(e)} className="badge mono !py-2 !text-[12px] hover:border-[#3D3D3D] hover:text-[#FFFFFF]">“{e}”</button>
          ))}
        </div>
        <div className="mt-4 space-y-2.5">
          {log.map((m, i) => (
            <div key={i}>
              <div className="chat-bubble-q text-[13.5px]"><span className="mono muted mr-2 text-[11px]">YOU</span>{m.q}</div>
              <div className="chat-bubble-a muted mt-1.5 text-[13.5px]"><span className="mono muted mr-2 text-[11px]">AI</span>{m.a}</div>
            </div>
          ))}
          {log.length === 0 && <div className="empty">Tap an example question above.</div>}
        </div>
        <div className="mt-3 flex gap-2">
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about this college…" onKeyDown={(e) => e.key === "Enter" && ask()} />
          <button className="btn-primary min-w-24" disabled={busy} onClick={() => ask()}>{busy ? "…" : "Ask"}</button>
        </div>
        <p className="muted mt-3 text-[12.5px]">Full experience: <Link href="/chat" className="underline">open chat →</Link> · Get this for your college: <Link href="/register" className="underline">register →</Link></p>
      </div>
    </div>
  );
}
