"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function FacultyInner() {
  const sp = useSearchParams();
  const [colleges, setColleges] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [collegeId, setCollegeId] = useState(sp.get("college") || "");
  const [deptId, setDeptId] = useState(sp.get("dept") || "");
  const locked = !!(sp.get("college") && sp.get("dept"));
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadColleges() {
    const r = await fetch("/api/colleges");
    const j = await r.json();
    if (r.ok) {
      const a = (j.colleges || []).filter((c: any) => c.status === "approved");
      setColleges(a);
      if (a.length && !collegeId) setCollegeId(a[0].id);
    }
  }
  async function loadDepts(cid: string) {
    if (!cid) return;
    const r = await fetch(`/api/departments?college_id=${cid}`);
    const j = await r.json();
    if (r.ok) setDepts(j.departments || []);
  }
  async function loadDocs(cid: string, did: string) {
    const q = new URLSearchParams();
    if (cid) q.set("college_id", cid);
    if (did) q.set("department_id", did);
    const r = await fetch(`/api/documents?${q.toString()}`);
    const j = await r.json();
    if (r.ok) setDocs(j.documents || []);
  }
  useEffect(() => { loadColleges(); }, []);
  useEffect(() => { loadDepts(collegeId); loadDocs(collegeId, deptId); }, [collegeId]);
  useEffect(() => { if (collegeId) loadDocs(collegeId, deptId); }, [deptId]);

  async function upload() {
    if (!file || !collegeId || !deptId) { setMsg("Select college + department + file."); return; }
    setBusy(true); setMsg("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("college_id", collegeId);
    fd.append("department_id", deptId);
    if (title) fd.append("title", title);
    const r = await fetch("/api/documents", { method: "POST", body: fd });
    const j = await r.json();
    setBusy(false);
    setMsg(r.ok ? `Uploaded: ${j.document.file_name}` : "Error: " + j.error);
    setTitle(""); setFile(null);
    loadDocs(collegeId, deptId);
  }

  return (
    <div className="page">
      <p className="eyebrow">Faculty</p>
      <h1 className="h2 mt-2">Upload sources</h1>
      <p className="lead mt-2 text-[14px]">PDF / Excel / docs go under your department. Chat cites dept + doc + page.</p>
      {locked && <p className="mt-3 inline-block badge badge-green">Scoped link — uploading straight into your department.</p>}

      <div className="card card-pad mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr]">
        <div>
          <label className="label">College</label>
          <select className="input" value={collegeId} onChange={(e) => setCollegeId(e.target.value)}>
            {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Department *</label>
          <select className="input" value={deptId} onChange={(e) => setDeptId(e.target.value)}>
            <option value="">Select…</option>
            {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Title</label>
          <input className="input" placeholder="CSE Fees 2025-26" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>

      <div className="card card-pad mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input className="input" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="btn-primary sm:min-w-44" disabled={busy} onClick={upload}>{busy ? "Uploading…" : "Upload"}</button>
      </div>
      {msg && <p className="muted mt-3 text-[13px]">{msg}</p>}
      {file && <p className="mono muted mt-2 text-[12px]">selected: {file.name} · {(file.size / 1024).toFixed(0)} KB</p>}

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[14px] font-semibold">Documents <span className="muted font-normal">({docs.length})</span></div>
          <span className="badge"><span className="dot" />tenant-isolated</span>
        </div>
        <div className="grid gap-2">
          {docs.map((d) => (
            <div key={d.id} className="card flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <div className="text-[13.5px] font-medium">{d.title || d.file_name}</div>
                <div className="mono muted mt-0.5 text-[11.5px]">{d.file_name} · {d.file_type} · {new Date(d.created_at).toLocaleString()}</div>
              </div>
              <span className="badge badge-green"><span className="dot" />ready</span>
            </div>
          ))}
          {docs.length === 0 && <div className="empty">No documents for this department yet.</div>}
        </div>
      </div>
    </div>
  );
}

export default function Faculty() {
  return (
    <Suspense fallback={<div className="page"><p className="muted text-[14px]">Loading…</p></div>}>
      <FacultyInner />
    </Suspense>
  );
}
