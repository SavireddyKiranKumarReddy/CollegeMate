"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({ name: "", domain: "", city: "", contact_email: "", notes: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const em = new URLSearchParams(window.location.search).get("email");
      if (em) setForm((f) => ({ ...f, contact_email: em }));
    } catch {}
  }, []);

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
      setMsg("Submitted as pending. A super admin will approve it and assign your admin.");
      setForm({ name: "", domain: "", city: "", contact_email: "", notes: "" });
    }
  }

  return (
    <div className="page mx-auto max-w-xl">
      <p className="eyebrow">Onboarding</p>
      <h1 className="h2 mt-2">Register college</h1>
      <p className="lead mt-2 text-[14px]">Get your college workspace reviewed and approved.</p>
      <form onSubmit={submit} className="card card-pad mt-6 space-y-4">
        <div>
          <label className="label">College name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Greenwood Institute of Technology" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Short code</label>
            <input className="input" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="greenwood" />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Maplewood" />
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
        {msg && (
          <p role="status" className={`msg ${/^error/i.test(msg) ? "msg-err" : "msg-ok"}`}>
            {msg}
          </p>
        )}
      </form>
      <p className="mt-5 text-center text-[13.5px] text-[#6E6455]">
        Already have an account?{" "}
        <Link href="/login" className="font-extrabold text-[#16130C] underline underline-offset-4 hover:text-[#5046E5]">
          Click here to login
        </Link>
      </p>
    </div>
  );
}
