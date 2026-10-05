"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardOverview() {
  const [health, setHealth] = useState<any>(null);
  const [colleges, setColleges] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then(setHealth).catch(() => {});
    fetch("/api/colleges").then((r) => r.json()).then((j) => setColleges(j.colleges || [])).catch(() => setColleges([]));
  }, []);

  const list = colleges || [];
  const pending = list.filter((c) => c.status === "pending").length;
  const approved = list.filter((c) => c.status === "approved").length;

  const stats: [string, string][] = [
    ["Colleges", colleges === null ? "…" : String(list.length)],
    ["Pending", colleges === null ? "…" : String(pending)],
    ["Approved", colleges === null ? "…" : String(approved)],
    ["DB", health?.dbOk ? "ok" : "…"],
  ];

  return (
    <div>
      <div className="page-head">
        <p className="eyebrow">Super admin · Overview</p>
        <h1 className="h2">Dashboard</h1>
      </div>
      <div className="grid-4">
        {stats.map(([a, b]) => (
          <div key={a} className="card card-pad">
            <div className="muted text-[12.5px]">{a}</div>
            {b === "…" ? (
              <div className="skeleton mt-2 h-8 w-16" aria-label={`${a} loading`} />
            ) : (
              <div className="mt-1 text-2xl font-semibold">{b}</div>
            )}
          </div>
        ))}
      </div>
      <div className="card card-pad mt-4">
        <div className="toolbar">
          <div className="text-[15px] font-semibold">Colleges</div>
          {pending > 0 && (
            <Link href="/dashboard/colleges" className="badge badge-amber">
              <span className="dot dot-pulse" aria-hidden="true" />{pending} awaiting approval
            </Link>
          )}
        </div>
        <div className="mt-3 space-y-2">
          {colleges === null && (
            <>
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
            </>
          )}
          {(colleges || []).map((c) => (
            <Link key={c.id} href={`/${c.domain}`} className="row-item">
              <span className="row-item-main">
                <span className="row-item-title">{c.name}</span>
                <span className="row-item-sub block">{c.domain}{c.city ? ` · ${c.city}` : ""}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className={`badge ${c.status === "approved" ? "badge-green" : c.status === "rejected" ? "badge-red" : "badge-amber"}`}>
                  <span className="dot" aria-hidden="true" />{c.status}
                </span>
                <span className="muted" aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
          {colleges !== null && list.length === 0 && (
            <div className="empty">
              <div className="empty-title">No colleges yet</div>
              <div className="empty-body">New registrations will appear here for approval.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
