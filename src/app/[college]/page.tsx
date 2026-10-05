"use client";
import { use } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCollege } from "@/lib/use-college";

export default function CollegeOverview({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college, loading } = useCollege(slug);
  const [depts, setDepts] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (!college) return;
    fetch(`/api/departments?college_id=${college.id}`).then((r) => r.json()).then((j) => setDepts(j.departments || [])).catch(() => {});
    fetch(`/api/documents?college_id=${college.id}`).then((r) => r.json()).then((j) => setDocs(j.documents || [])).catch(() => {});
    fetch(`/api/activity?college_id=${college.id}&limit=5`).then((r) => r.json()).then((j) => setRecent(j.logs || [])).catch(() => {});
  }, [college]);

  if (loading) return <div className="page"><p className="muted text-[14px]">Loading workspace…</p></div>;
  if (!college) return <div className="page"><h1 className="h2">Unknown college</h1><p className="muted mt-2 text-[14px]">Check the URL or ask super admin at /dashboard.</p></div>;

  return (
    <div>
      <p className="eyebrow">College admin · Overview</p>
      <div className="mt-2 flex flex-wrap items-center gap-2.5">
        <h1 className="h2">{college.name}</h1>
        <span className="badge badge-green"><span className="dot" />{college.status}</span>
      </div>
      <p className="muted mt-1 text-[13px]">{college.city} · admin: {college.admin_email}</p>
      <div className="grid-4 mt-5">
        {[["Departments", depts.length, `/${college.domain}/departments`], ["Documents", docs.length, `/${college.domain}/documents`], ["Recent queries", recent.length, `/${college.domain}/chat`]].map(([a, b, href]) => (
          <Link key={a as string} href={href as string} className="card card-pad card-hover block">
            <div className="muted text-[12.5px]">{a}</div>
            <div className="mt-1 text-2xl font-semibold">{b as number}</div>
          </Link>
        ))}
        <Link href={`/${college.domain}/chat`} className="card card-pad card-hover block">
          <div className="muted text-[12.5px]">Test chat</div>
          <div className="mt-1 text-2xl font-semibold">→</div>
        </Link>
      </div>
      <div className="card card-pad mt-4">
        <div className="text-[15px] font-semibold">Latest questions</div>
        <div className="mt-3 space-y-2">
          {recent.map((l) => (
            <div key={l.id} className="muted text-[13px]">· {l.question} <span className="mono">[{l.confidence}]</span></div>
          ))}
          {recent.length === 0 && <div className="muted text-[13px]">No questions yet — test in the Chat tab.</div>}
        </div>
      </div>
    </div>
  );
}
