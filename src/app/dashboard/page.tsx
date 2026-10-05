"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardOverview() {
  const [health, setHealth] = useState<any>(null);
  const [colleges, setColleges] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then(setHealth).catch(() => {});
    fetch("/api/colleges").then((r) => r.json()).then((j) => setColleges(j.colleges || [])).catch(() => {});
  }, []);

  const pending = colleges.filter((c) => c.status === "pending").length;
  const approved = colleges.filter((c) => c.status === "approved").length;

  return (
    <div>
      <p className="eyebrow">Super admin · Overview</p>
      <h1 className="h2 mt-2">Dashboard</h1>
      <div className="grid-4 mt-5">
        {[["Colleges", colleges.length], ["Pending", pending], ["Approved", approved], ["DB", health?.dbOk ? "ok" : "…"]].map(([a, b]) => (
          <div key={a as string} className="card card-pad">
            <div className="muted text-[12.5px]">{a}</div>
            <div className="mt-1 text-2xl font-semibold">{b as string}</div>
          </div>
        ))}
      </div>
      <div className="card card-pad mt-4">
        <div className="text-[15px] font-semibold">Colleges</div>
        <div className="mt-3 space-y-2">
          {colleges.map((c) => (
            <Link key={c.id} href={`/${c.domain}`} className="flex items-center justify-between rounded-lg border border-[#232329] px-3 py-2.5 text-[13.5px] hover:border-[#3a3a42]">
              <span className="font-medium">{c.name}</span>
              <span className="flex items-center gap-2">
                <span className={`badge ${c.status === "approved" ? "badge-green" : "badge-amber"}`}>{c.status}</span>
                <span className="muted">→</span>
              </span>
            </Link>
          ))}
          {colleges.length === 0 && <div className="empty">No colleges yet.</div>}
        </div>
      </div>
    </div>
  );
}
