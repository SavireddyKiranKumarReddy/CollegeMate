"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { useCollege } from "@/lib/use-college";

export default function FacultyAccess({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);
  const [depts, setDepts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [deptId, setDeptId] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState("");

  async function load() {
    if (!college) return;
    const d = await fetch(`/api/departments?college_id=${college.id}`).then((x) => x.json());
    setDepts(d.departments || []);
    const m = await fetch(`/api/memberships?college_id=${college.id}`).then((x) => x.json());
    setMembers(m.memberships || []);
  }
  useEffect(() => { load(); }, [college]);

  async function grant() {
    if (!email.trim() || !college) return;
    const r = await fetch("/api/memberships", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ college_id: college.id, user_email: email.trim(), role: "faculty", department_id: deptId || null }),
    });
    const j = await r.json();
    setMsg(r.ok ? `Access granted: ${email}` : "Error: " + j.error);
    setEmail("");
    load();
  }

  async function revoke(id: string) {
    await fetch(`/api/memberships?id=${id}`, { method: "DELETE" });
    load();
  }

  function deptLink(deptId: string | null) {
    if (typeof window === "undefined" || !college) return "";
    const q = new URLSearchParams({ college: college.id });
    if (deptId) q.set("dept", deptId);
    return `${window.location.origin}/faculty?${q.toString()}`;
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
  }

  return (
    <div>
      <p className="eyebrow">College admin · Faculty access</p>
      <h1 className="h2 mt-2">Access links <span className="muted font-normal text-[15px]">({members.length})</span></h1>
      <p className="lead mt-2 text-[14px]">Grant by email, or share a per-dept link. Faculty opening the link uploads straight into that department.</p>

      <div className="card card-pad mt-5">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="input flex-1" placeholder="faculty email — prof@mits.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select className="input sm:max-w-56" value={deptId} onChange={(e) => setDeptId(e.target.value)}>
            <option value="">All departments</option>
            {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button className="btn-primary min-w-28" onClick={grant}>Grant</button>
        </div>
      </div>

      <div className="card card-pad mt-3">
        <div className="text-[15px] font-semibold">Department access links</div>
        <div className="mt-3 space-y-2">
          {depts.map((d) => {
            const link = deptLink(d.id);
            return (
              <div key={d.id} className="flex flex-col gap-2 rounded-lg border border-[#E4DFD3] px-3 py-2.5 sm:flex-row sm:items-center">
                <span className="min-w-32 text-[13.5px] font-medium">{d.name}</span>
                <code className="mono muted flex-1 truncate text-[11px]">{link}</code>
                <button className="btn-ghost btn-sm" onClick={() => copy(link)}>{copied === link ? "Copied" : "Copy link"}</button>
              </div>
            );
          })}
          {depts.length === 0 && <div className="empty">Add departments first.</div>}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {members.map((m) => (
          <div key={m.id} className="card flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <div className="text-[13.5px] font-medium">{m.user_email}</div>
              <div className="mono muted mt-0.5 text-[11.5px]">{m.role} · {m.departments?.name || "all departments"}</div>
            </div>
            <button className="btn-ghost btn-sm" onClick={() => revoke(m.id)}>Remove</button>
          </div>
        ))}
        {members.length === 0 && <div className="empty">Nobody granted yet.</div>}
      </div>
      {msg && <p className="muted mt-3 text-[13px]">{msg}</p>}
    </div>
  );
}
