"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { useCollege } from "@/lib/use-college";

export default function DeptPage({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);
  const [depts, setDepts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    if (!college) return;
    const r = await fetch(`/api/departments?college_id=${college.id}`).then((x) => x.json());
    setDepts(r.departments || []);
  }
  useEffect(() => { load(); }, [college]);

  async function add() {
    if (!name.trim() || !college) return;
    const r = await fetch("/api/departments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ college_id: college.id, name: name.trim(), code: code.trim() }),
    });
    const j = await r.json();
    setMsg(r.ok ? `Added ${name}` : "Error: " + j.error);
    setName(""); setCode("");
    load();
  }

  return (
    <div>
      <p className="eyebrow">College admin · Departments</p>
      <h1 className="h2 mt-2">Departments <span className="muted font-normal text-[15px]">({depts.length})</span></h1>
      <div className="card card-pad mt-5">
        <div className="flex gap-2">
          <input className="input" placeholder="Name — Computer Science" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input max-w-28" placeholder="CSE" value={code} onChange={(e) => setCode(e.target.value)} />
          <button className="btn-primary min-w-24" onClick={add}>Add</button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {depts.map((d) => (
          <div key={d.id} className="card flex items-center justify-between px-4 py-3">
            <span className="text-[14px] font-medium">{d.name}</span>
            <span className="mono muted text-[12px]">{d.code}</span>
          </div>
        ))}
        {depts.length === 0 && <div className="empty">No departments — add CSE, ECE, Admissions…</div>}
      </div>
      {msg && <p className="muted mt-3 text-[13px]">{msg}</p>}
    </div>
  );
}
