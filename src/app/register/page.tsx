"use client";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", domain: "", city: "", contact_email: "", notes: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg("");
    const res = await fetch("/api/colleges", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const j = await res.json();
    setLoading(false);
    if (!res.ok) setMsg("Error: " + (j.error || "failed"));
    else {
      setMsg("Submitted as pending. Super admin (kiransavireddy@gmail.com) will approve and assign your admin.");
      setForm({ name: "", domain: "", city: "", contact_email: "", notes: "" });
    }
  }

  return (
    <div className="page mx-auto max-w-xl">
      <p className="eyebrow">Onboarding</p>
      <h1 className="h2 mt-2">Register college</h1>
      <p className="lead mt-2 text-[14px]">Takes 30 seconds. Approval + admin assignment happens at <span className="kbd">/super</span>.</p>
      <form onSubmit={submit} className="card card-pad mt-6 space-y-4">
        <div>
          <label className="label">College name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. MITS-Madanapalle" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Short code</label>
            <input className="input" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="mits" />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Madanapalle" />
          </div>
        </div>
        <div>
          <label className="label">Contact email *</label>
          <input className="input" type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} required placeholder="admin@college.edu" />
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Departments, intake, website URL…" />
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Submitting…" : "Submit for approval"}</button>
        {msg && <p className="text-[13px] muted leading-relaxed">{msg}</p>}
      </form>
    </div>
  );
}
