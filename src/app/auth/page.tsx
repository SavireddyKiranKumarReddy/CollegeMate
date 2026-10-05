"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type Tab = "login" | "signup" | "register";

export default function Auth() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({ name: "", domain: "", city: "", contact_email: "", notes: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true); setMsg("Logging in…");
    // demo logins (local): super/super, MITS/MITS
    if (email.trim().toLowerCase() === "super" && password === "super") {
      try { localStorage.setItem("cm_demo", "super_admin"); } catch {}
      setMsg("Logged in as super admin. Redirecting to /dashboard…");
      router.push("/dashboard");
      return;
    }
    if (email.trim().toLowerCase() === "mits" && password === "MITS") {
      try { localStorage.setItem("cm_demo", "college_admin:MITS-Madanapalle"); } catch {}
      setMsg("Logged in as MITS admin. Redirecting to workspace…");
      router.push("/mits-madanapalle");
      return;
    }
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setMsg("Login failed: " + error.message);
      return;
    }
    try {
      const r = await fetch(`/api/me?email=${encodeURIComponent(email)}`);
      const j = await r.json();
      setMsg(`Logged in. Redirecting to ${j.redirect || "/dashboard"}…`);
      router.push(j.redirect || "/dashboard");
    } catch {
      router.push("/dashboard");
    }
  }

  async function signUp() {
    setBusy(true); setMsg("Creating account…");
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signUp({ email, password });
    if (error) {
      setBusy(false);
      setMsg("Signup failed: " + error.message);
      return;
    }
    const { error: inErr } = await sb.auth.signInWithPassword({ email, password });
    if (inErr) {
      setBusy(false);
      setMsg("Account created. Please login with your credentials.");
      setTab("login");
      return;
    }
    try {
      const r = await fetch(`/api/me?email=${encodeURIComponent(email)}`);
      const j = await r.json();
      setMsg(`Welcome. Redirecting to ${j.redirect || "/chat"}…`);
      router.push(j.redirect || "/chat");
    } catch {
      router.push("/chat");
    }
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const res = await fetch("/api/colleges", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const j = await res.json();
    setBusy(false);
    if (!res.ok) setMsg("Error: " + (j.error || "failed"));
    else {
      setMsg("Submitted as pending. Super admin will approve and assign your admin.");
      setForm({ name: "", domain: "", city: "", contact_email: "", notes: "" });
    }
  }

  return (
    <div className="page mx-auto max-w-xl">
      <p className="eyebrow">Access</p>
      <h1 className="h2 mt-2">Login / Register</h1>
      <p className="lead mt-2 text-[14px]">One page, two actions. Login with assigned email, or register a new college.</p>

      <div className="card mt-5 flex gap-1 p-1.5" role="tablist" aria-label="Access options">
        {(["login", "signup", "register"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => { setTab(t); setMsg(""); }}
            className={`flex-1 rounded-lg px-4 py-2.5 text-[14px] font-semibold transition ${
              tab === t ? "bg-[#5046E5] text-white" : "muted hover:text-[#17172E]"
            }`}
          >
            {t === "login" ? "Login" : t === "signup" ? "Sign up" : "Register college"}
          </button>
        ))}
      </div>

      {tab === "login" ? (
        <div className="card card-pad mt-3 space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && signIn()} />
          </div>
          <button onClick={signIn} disabled={busy || !email || !password} className="btn-primary w-full">
            {busy ? "Logging in…" : "Login"}
          </button>
          <p className="muted text-[12.5px]">Use the email your admin granted access to.</p>
        </div>
      ) : null}
      {tab === "signup" ? (
        <div className="card card-pad mt-3 space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 6 characters" onKeyDown={(e) => e.key === "Enter" && signUp()} />
          </div>
          <button onClick={signUp} disabled={busy || !email || !password} className="btn-primary w-full">
            {busy ? "Creating…" : "Create account"}
          </button>
          <p className="muted text-[12.5px]">Use the email your admin granted access to — you&apos;ll land on your dashboard automatically.</p>
        </div>
      ) : null}
      {tab === "register" ? (
        <form onSubmit={register} className="card card-pad mt-3 space-y-4">
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
            <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Departments, intake, website…" />
          </div>
          <button className="btn-primary w-full" disabled={busy}>{busy ? "Submitting…" : "Submit for approval"}</button>
        </form>
      ) : null}
      {msg && (
        <p role="status" className={`msg mt-3 ${/failed|error/i.test(msg) ? "msg-err" : /redirecting|welcome|logged in|created|submitted/i.test(msg) ? "msg-ok" : "msg-info"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
