"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type College = { id: string; name: string; domain: string; city: string; contact_email: string; status: string; admin_email: string | null };

export default function CollegesAdmin() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [msg, setMsg] = useState("");
  const [assign, setAssign] = useState<Record<string, string>>({});

  async function load() {
    const res = await fetch("/api/colleges");
    const j = await res.json();
    if (res.ok) setColleges(j.colleges || []);
  }
  useEffect(() => { load(); }, []);

  async function act(id: string, action: "approved" | "rejected") {
    const res = await fetch(`/api/colleges/${id}/approve`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action, admin_email: assign[id] || null }),
    });
    const j = await res.json();
    setMsg(res.ok ? `Saved: ${action}.` : "Error: " + j.error);
    load();
  }

  return (
    <div>
      <p className="eyebrow">Super admin · Colleges</p>
      <h1 className="h2 mt-2">Approve & assign</h1>
      {msg && <p className="muted mt-3 text-[13px]">{msg}</p>}
      <div className="mt-5 grid gap-3">
        {colleges.map((c) => (
          <div key={c.id} className="card card-pad">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px] font-semibold">{c.name}</span>
              <span className={`badge ${c.status === "approved" ? "badge-green" : c.status === "rejected" ? "badge-red" : "badge-amber"}`}>
                <span className="dot" />{c.status}
              </span>
            </div>
            <div className="muted mt-1 text-[13px]">{c.city || "—"} · <span className="mono">{c.domain}</span> · {c.contact_email}</div>
            <div className="muted text-[13px]">admin: {c.admin_email || "—"}</div>
            {c.status === "approved" && (
              <Link href={`/${c.domain}`} className="btn-ghost btn-sm mt-3">Open workspace →</Link>
            )}
            <div className="mt-3 flex flex-col gap-2 md:flex-row">
              <input
                className="input" placeholder="admin email to appoint"
                value={assign[c.id] || c.admin_email || ""}
                onChange={(e) => setAssign({ ...assign, [c.id]: e.target.value })}
              />
              <div className="flex gap-2">
                <button className="btn-primary btn-sm" onClick={() => act(c.id, "approved")}>Approve + assign</button>
                <button className="btn-ghost btn-sm" onClick={() => act(c.id, "rejected")}>Reject</button>
              </div>
            </div>
          </div>
        ))}
        {colleges.length === 0 && <div className="empty">No colleges yet.</div>}
      </div>
    </div>
  );
}
