"use client";
import { useEffect, useState } from "react";

type Dept = { id: string; college_id: string; name: string; code: string };

export default function CollegeAdmin() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [collegeId, setCollegeId] = useState("");
  const [depts, setDepts] = useState<Dept[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyDept, setFacultyDept] = useState("");
  const [msg, setMsg] = useState("");

  async function loadColleges() {
    const r = await fetch("/api/colleges");
    const j = await r.json();
    if (r.ok) {
      const approved = (j.colleges || []).filter((c: any) => c.status === "approved");
      setColleges(approved);
      if (approved.length && !collegeId) setCollegeId(approved[0].id);
    }
  }
  async function loadDepts(cid: string) {
    if (!cid) return;
    const r = await fetch(`/api/departments?college_id=${cid}`);
    const j = await r.json();
    if (r.ok) setDepts(j.departments || []);
  }
  useEffect(() => { loadColleges(); }, []);
  useEffect(() => { loadDepts(collegeId); }, [collegeId]);

  async function createDept() {
    if (!name.trim()) { setMsg("Enter department name."); return; }
    const r = await fetch("/api/departments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ college_id: collegeId, name: name.trim(), code: code.trim() }),
    });
    const j = await r.json();
    setMsg(r.ok ? `Added: ${name}` : "Error: " + j.error);
    setName(""); setCode("");
    loadDepts(collegeId);
  }

  async function addFaculty() {
    if (!facultyEmail.trim()) { setMsg("Enter faculty email."); return; }
    const r = await fetch("/api/memberships", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ college_id: collegeId, user_email: facultyEmail.trim(), role: "faculty", department_id: facultyDept || null }),
    });
    const j = await r.json();
    setMsg(r.ok ? `Access granted: ${facultyEmail}` : "Error: " + j.error);
    setFacultyEmail("");
  }

  const college = colleges.find((c) => c.id === collegeId);

  return (
    <div className="page">
      <p className="eyebrow">College admin</p>
      <h1 className="h2 mt-2">Workspaces{college ? ` · ${college.name}` : ""}</h1>
      <p className="lead mt-2 text-[14px]">Each college owns its space. Open <span className="kbd">/mits-madanapalle</span> for MITS.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {colleges.map((c) => (
          <a key={c.id} href={`/${c.domain}`} className="btn-ghost btn-sm">Open {c.name} →</a>
        ))}
      </div>

      <div className="card card-pad mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="label">College</label>
          <select className="input" value={collegeId} onChange={(e) => setCollegeId(e.target.value)}>
            {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <span className="badge"><span className="dot" />{depts.length} departments</span>
        </div>
      </div>

      <div className="grid-2 mt-4">
        <div className="card card-pad">
          <div className="text-[15px] font-semibold">Departments</div>
          <p className="muted mt-1 text-[13px]">e.g. CSE, ECE, Admissions, Placements, Hostel</p>
          <div className="mt-3 flex gap-2">
            <input className="input" placeholder="Name — Computer Science" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input max-w-28" placeholder="CSE" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <button className="btn-primary mt-3 w-full" onClick={createDept}>Add department</button>
          <div className="mt-4 space-y-2">
            {depts.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-[#E4DFD3] px-3 py-2 text-[13.5px]">
                <span>{d.name}</span>
                <span className="mono muted text-[12px]">{d.code}</span>
              </div>
            ))}
            {depts.length === 0 && <div className="empty">No departments yet — add your first above.</div>}
          </div>
        </div>
        <div className="card card-pad">
          <div className="text-[15px] font-semibold">Faculty access</div>
          <p className="muted mt-1 text-[13px]">Grant by email. Scope to one dept or college-wide.</p>
          <div className="mt-3 space-y-3">
            <div>
              <label className="label">Faculty email</label>
              <input className="input" placeholder="prof@mits.edu" value={facultyEmail} onChange={(e) => setFacultyEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Department scope</label>
              <select className="input" value={facultyDept} onChange={(e) => setFacultyDept(e.target.value)}>
                <option value="">All departments (college-wide)</option>
                {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <button className="btn-primary w-full" onClick={addFaculty}>Grant access</button>
          </div>
        </div>
      </div>
      {msg && <p className="muted mt-4 text-[13px]">{msg}</p>}
    </div>
  );
}
