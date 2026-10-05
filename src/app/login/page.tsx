"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("kiransavireddy@gmail.com");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true); setMsg("Logging in…");
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

  return (
    <div className="page mx-auto max-w-md">
      <p className="eyebrow">Access</p>
      <h1 className="h2 mt-2">Login</h1>
      <p className="lead mt-2 text-[14px]">Use your assigned email. Super admin: kiransavireddy@gmail.com</p>
      <div className="card card-pad mt-6 space-y-4">
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
        {msg && <p className="text-[13px] muted leading-relaxed">{msg}</p>}
        <div className="divider pt-4 text-[13px] muted">
          New college? <Link href="/register" className="font-semibold text-[#5046E5] underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
