"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import { useCollege } from "@/lib/use-college";

export default function CollegeDocs({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);
  const [docs, setDocs] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  async function load() {
    if (!college) return;
    const q = new URLSearchParams({ college_id: college.id });
    if (filter) q.set("department_id", filter);
    const r = await fetch(`/api/documents?${q.toString()}`).then((x) => x.json());
    setDocs(r.documents || []);
    if (depts.length === 0) {
      const d = await fetch(`/api/departments?college_id=${college.id}`).then((x) => x.json());
      setDepts(d.departments || []);
    }
  }
  useEffect(() => { load(); }, [college, filter]);

  async function remove(id: string) {
    if (!confirm("Delete document + its indexed chunks?")) return;
    await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <p className="eyebrow">College admin · Documents</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="h2">Documents <span className="muted font-normal text-[15px]">({docs.length})</span></h1>
        <select className="input max-w-56" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All departments</option>
          {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div className="mt-4 grid gap-2">
        {docs.map((d) => (
          <div key={d.id} className="card flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-medium">{d.title || d.file_name}</div>
              <div className="mono muted mt-0.5 text-[11.5px]">{d.file_name} · {new Date(d.created_at).toLocaleString()}</div>
            </div>
            <div className="flex shrink-0 gap-2">
              <span className="badge badge-green">ready</span>
              <button className="btn-ghost btn-sm" onClick={() => remove(d.id)}>Delete</button>
            </div>
          </div>
        ))}
        {docs.length === 0 && <div className="empty">No documents. Faculty upload via their dept link at /faculty.</div>}
      </div>
    </div>
  );
}
