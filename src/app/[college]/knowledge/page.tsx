"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { useCollege } from "@/lib/use-college";

type Fact = {
  id: string; question: string; answer: string; topic: string | null;
  source_label: string | null; status: string; version: number;
  valid_from: string | null; valid_to: string | null;
  department_id: string | null; updated_at: string;
};

const STATUS = ["pending", "verified", "stale", "off"] as const;
function badge(s: string) {
  if (s === "verified") return "badge-green";
  if (s === "pending") return "badge-amber";
  if (s === "stale") return "badge-red";
  return "badge-neutral";
}

export default function Knowledge({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState<Fact | null>(null);
  const [eform, setEform] = useState({ question: "", answer: "", topic: "" });
  const [adding, setAdding] = useState(false);
  const [aform, setAform] = useState({ question: "", answer: "", topic: "", department_id: "" });
  const [hist, setHist] = useState<{ fact: Fact; versions: any[] } | null>(null);

  async function load() {
    if (!college) return;
    const p = new URLSearchParams({ college_id: college.id });
    if (status) p.set("status", status);
    if (q.trim()) p.set("q", q.trim());
    const r = await fetch(`/api/facts?${p.toString()}`).then((x) => x.json()).catch(() => null);
    setFacts(r?.facts || []);
    if (depts.length === 0) {
      const d = await fetch(`/api/departments?college_id=${college.id}`).then((x) => x.json()).catch(() => null);
      setDepts(d?.departments || []);
    }
  }
  useEffect(() => { load(); }, [college, status]);

  async function call(method: string, body?: any, qs?: string) {
    const r = await fetch(`/api/facts${qs || ""}`, {
      method, headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify({ ...body, changed_by: "college_admin" }) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setMsg("Error: " + (j.error || "failed"));
    else { setMsg(""); load(); }
    return { ok: r.ok, j };
  }

  function startEdit(f: Fact) {
    setEditing(f);
    setEform({ question: f.question, answer: f.answer, topic: f.topic || "" });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const { ok } = await call("PATCH", { id: editing.id, ...eform });
    if (ok) setEditing(null);
  }

  async function addManual(e: React.FormEvent) {
    e.preventDefault();
    if (!college || !aform.question.trim() || !aform.answer.trim()) return;
    const { ok } = await call("POST", { college_id: college.id, ...aform, created_by: "college_admin" });
    if (ok) { setAdding(false); setAform({ question: "", answer: "", topic: "", department_id: "" }); }
  }

  async function showHist(f: Fact) {
    const r = await fetch(`/api/facts?history=${f.id}`).then((x) => x.json()).catch(() => null);
    setHist({ fact: f, versions: r?.versions || [] });
  }

  return (
    <div>
      <div className="page-head">
        <p className="eyebrow">College admin · Stored knowledge</p>
        <h1 className="h2">Knowledge <span className="muted font-normal text-[15px]">({facts.length})</span></h1>
        <p className="lead mt-2 text-[14px]">What the AI answers from. Edit, approve, or add here — uploads stay untouched in Documents.</p>
      </div>

      <div className="toolbar">
        <div className="flex flex-wrap gap-2">
          <select className="input max-w-44" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            className="input max-w-64" value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Search questions…" aria-label="Search"
          />
          <button className="btn-ghost btn-sm" onClick={load}>Search</button>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setAdding(!adding)}>{adding ? "Close" : "+ Add fact"}</button>
      </div>
      {msg && <p role="status" className="msg msg-err mt-3">{msg}</p>}

      {adding && (
        <form onSubmit={addManual} className="card card-pad mt-4 space-y-3">
          <div className="text-[14px] font-semibold">Add fact manually <span className="badge badge-green ml-2">goes live verified</span></div>
          <input className="input" value={aform.question} onChange={(e) => setAform({ ...aform, question: e.target.value })} required placeholder="Question students ask…" />
          <textarea className="input" rows={3} value={aform.answer} onChange={(e) => setAform({ ...aform, answer: e.target.value })} required placeholder="Exact answer…" />
          <div className="grid grid-cols-2 gap-3">
            <select className="input" value={aform.department_id} onChange={(e) => setAform({ ...aform, department_id: e.target.value })}>
              <option value="">General (all depts)</option>
              {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input className="input" value={aform.topic} onChange={(e) => setAform({ ...aform, topic: e.target.value })} placeholder="Topic — fees, exams…" />
          </div>
          <button className="btn-primary w-full">Save fact</button>
        </form>
      )}

      <div className="mt-4 space-y-2">
        {facts.map((f) => (
          <div key={f.id} className="card card-pad">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${badge(f.status)}`}><span className="dot" aria-hidden="true" />{f.status}</span>
              {f.topic && <span className="badge badge-neutral mono !text-[10px]">{f.topic}</span>}
              <span className="mono muted ml-auto text-[10.5px]">v{f.version} · {f.source_label || "manual"}</span>
            </div>
            {editing?.id === f.id ? (
              <form onSubmit={saveEdit} className="mt-3 space-y-2">
                <input className="input" value={eform.question} onChange={(e) => setEform({ ...eform, question: e.target.value })} required />
                <textarea className="input" rows={3} value={eform.answer} onChange={(e) => setEform({ ...eform, answer: e.target.value })} required />
                <input className="input" value={eform.topic} onChange={(e) => setEform({ ...eform, topic: e.target.value })} placeholder="Topic" />
                <div className="flex gap-2">
                  <button className="btn-primary btn-sm">Save (versions previous)</button>
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-2 text-[14px] font-semibold">{f.question}</div>
                <div className="muted mt-1 text-[13px] leading-relaxed">{f.answer}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {f.status === "pending" && <button className="btn-primary btn-sm" onClick={() => call("PATCH", { id: f.id, status: "verified" })}>Approve</button>}
                  {f.status === "stale" && <button className="btn-primary btn-sm" onClick={() => call("PATCH", { id: f.id, status: "verified" })}>Re-verify</button>}
                  <button className="btn-ghost btn-sm" onClick={() => startEdit(f)}>Edit</button>
                  <button className="btn-ghost btn-sm" onClick={() => showHist(f)}>History</button>
                  {f.status === "off"
                    ? <button className="btn-ghost btn-sm" onClick={() => call("PATCH", { id: f.id, status: "verified" })}>Activate</button>
                    : <button className="btn-ghost btn-sm" onClick={() => call("PATCH", { id: f.id, status: "off" })}>Deactivate</button>}
                  <button className="btn-danger-ghost" onClick={() => { if (confirm("Delete this fact permanently?")) call("DELETE", undefined, `?id=${f.id}`); }}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        {facts.length === 0 && (
          <div className="empty">
            <div className="empty-title">No stored knowledge yet</div>
            <div className="empty-body">Upload documents and extracted facts appear here for review — or add one manually above.</div>
          </div>
        )}
      </div>

      {hist && (
        <div className="card card-pad mt-4">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-semibold">Version history</div>
            <button className="btn-ghost btn-sm" onClick={() => setHist(null)}>Close</button>
          </div>
          <div className="mono muted mt-1 text-[11px]">current v{hist.fact.version} · {hist.fact.question}</div>
          <div className="mt-3 space-y-2">
            {(hist.versions.length === 0 ? [{ version: hist.fact.version, question: hist.fact.question, answer: hist.fact.answer, changed_by: "—", created_at: hist.fact.updated_at }] : hist.versions).map((v: any, i: number) => (
              <div key={i} className="rounded-lg border border-[#EFE6D4] p-3 text-[13px]">
                <div className="mono muted text-[11px]">v{v.version} · {v.changed_by} · {v.created_at ? new Date(v.created_at).toLocaleString() : ""}</div>
                <div className="mt-1 font-semibold">{v.question}</div>
                <div className="muted">{v.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
