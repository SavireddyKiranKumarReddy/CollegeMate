"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------- tiny abstract visuals ---------- */
function VHub() {
  return (
    <div className="space-y-1.5">
      {[88, 64, 76].map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-[#2b2b31]" />
          <div className="mv-bar flex-1" style={{ width: `${w}%` }} />
          <div className={`mono text-[9px] ${i === 0 ? "text-[#86efac]" : "text-[#71717a]"}`}>{i === 0 ? "approve" : "pending"}</div>
        </div>
      ))}
    </div>
  );
}
function VSpace() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {["CSE", "ECE", "ADM", "PLC", "HOS", "LIB"].map((t) => (
        <div key={t} className="mv-chip mono py-1.5 text-center text-[9px] text-[#a1a1aa]">{t}</div>
      ))}
    </div>
  );
}
function VDepts() {
  return (
    <div className="space-y-1.5">
      {[92, 78, 85].map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="mv-line" style={{ width: `${w}%` }} />
          <div className="mono text-[9px] text-[#71717a]">→</div>
        </div>
      ))}
    </div>
  );
}
function VUpload() {
  return (
    <div className="space-y-1.5">
      <div className="mv-chip flex items-center gap-2 px-2 py-1.5">
        <div className="h-5 w-4 rounded-sm bg-[#2b2b31]" />
        <div className="flex-1"><div className="mv-line" style={{ width: "80%" }} /></div>
        <div className="mono text-[9px] text-[#86efac]">ready</div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#222228]">
        <div className="h-full w-3/4 rounded-full bg-white" />
      </div>
    </div>
  );
}
function VChat() {
  return (
    <div className="space-y-1.5">
      <div className="ml-auto w-3/4 rounded-lg rounded-br-sm bg-[#2b2b31] p-1.5"><div className="mv-line" style={{ width: "85%", background: "#3f3f46" }} /></div>
      <div className="w-5/6 rounded-lg rounded-bl-sm border border-[#2b2b31] p-1.5">
        <div className="mv-line" style={{ width: "95%" }} />
        <div className="mono mt-1 text-[8.5px] text-[#86efac]">[fees.pdf · p.3 · CSE]</div>
      </div>
    </div>
  );
}
function VSwap() {
  const bars = [35, 60, 45, 80, 55, 95, 65, 40, 75, 50, 85, 60, 45, 70, 55, 90, 50, 65];
  return (
    <div className="flex h-16 items-end gap-1">
      {bars.map((h, i) => (
        <div key={i} className={`flex-1 rounded-sm ${i === 5 || i === 15 ? "bg-[#e8b34b]" : "bg-[#2e2e35]"}`} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
function VAuth() {
  return (
    <div className="space-y-1.5">
      <div className="mv-chip px-2 py-1.5"><div className="mv-line" style={{ width: "60%" }} /></div>
      <div className="mv-chip px-2 py-1.5"><div className="mv-line" style={{ width: "75%" }} /></div>
      <div className="h-6 rounded-full bg-white" />
    </div>
  );
}

const WORKFLOWS = [
  { v: <VHub />, t: "Super hub", d: "Approve colleges, assign one admin each.", k: "/dashboard", cat: "Admin" },
  { v: <VSpace />, t: "College space", d: "One workspace per college.", k: "/mits-madanapalle", cat: "Admin" },
  { v: <VDepts />, t: "Departments", d: "CSE, ECE, Admissions, Hostel.", k: "/college", cat: "Structure" },
  { v: <VAuth />, t: "Login / Register", d: "Role login, college onboarding.", k: "/auth", cat: "Structure" },
  { v: <VUpload />, t: "Faculty upload", d: "Dept-scoped PDFs + Excel.", k: "/faculty", cat: "Knowledge" },
  { v: <VChat />, t: "Scoped chat", d: "Cited answers, fallback + contact.", k: "/chat", cat: "Knowledge" },
  { v: <VSwap />, t: "Swap LLM", d: "Sarvam-105b → your local model.", k: "/demo/mits-madanapalle", cat: "Knowledge" },
];
const WTABS = ["All", "Admin", "Structure", "Knowledge"];

const FAQS = [
  { q: "What is CollegeMate?", a: "CollegeMate is an AI-powered, RAG-based institutional knowledge platform developed by NxtGenSec — verified academic, administrative, department, placement, club and support info in one cited AI platform." },
  { q: "How does CollegeMate use RAG?", a: "Documents are processed into a secure knowledge base. Questions retrieve the relevant passages first, then answers generate grounded in them." },
  { q: "Can departments have separate access?", a: "Yes — each department gets its own workspace and faculty access, scoped and maintainable." },
  { q: "What happens when it doesn't know?", a: "It falls back to a verified contact or helpdesk instead of answering beyond institutional knowledge." },
  { q: "Can it use a local LLM?", a: "Yes — Sarvam today through an OpenAI-compatible layer built to swap to self-hosted later." },
  { q: "Is it multi-tenant?", a: "Yes — isolated workspaces per college. Data, departments, documents and queries never cross colleges." },
];

const CMDS = [
  { tab: "Register", code: "open  /register   →   onboard your college" },
  { tab: "Demo", code: "open  /demo/mits-madanapalle   →   live workspace" },
  { tab: "Chat", code: "open  /chat   →   ask, get cited answers" },
];

function Screen({ href, cap, children }: { href: string; cap: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="screen">
      <div>
        <div className="mockbar">
          <span className="mockdot" /><span className="mockdot" /><span className="mockdot" />
          <span className="mono ml-2 text-[10px] text-[#71717a]">{href}</span>
        </div>
        <div className="space-y-2 p-3">{children}</div>
      </div>
      <div className="screen-cap"><span>{cap}</span><span>→</span></div>
    </Link>
  );
}
function sk(w: number) {
  return <div className="h-2 rounded-full bg-[#222228]" style={{ width: `${w}%` }} />;
}

function Stat({ value, cap }: { value: string; cap: string }) {
  const loading = value === "…" || value === "—";
  return (
    <div>
      {loading ? (
        <div className="skeleton mx-auto h-7 w-12" aria-label="loading" />
      ) : (
        <div className="stat-num">{value}</div>
      )}
      <div className="stat-cap">{cap}</div>
    </div>
  );
}

export default function Home() {
  const [cmd, setCmd] = useState(0);
  const [copied, setCopied] = useState(false);
  const [wtab, setWtab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stats, setStats] = useState({ colleges: "…", depts: "…", docs: "…" });

  useEffect(() => {
    (async () => {
      try {
        const h = await fetch("/api/health").then((r) => r.json());
        const colleges = h?.collegesCount ?? "—";
        const list = await fetch("/api/colleges").then((r) => r.json()).catch(() => null);
        const first = list?.colleges?.[0];
        let depts = "—", docs = "—";
        if (first) {
          const d = await fetch(`/api/departments?college_id=${first.id}`).then((r) => r.json()).catch(() => null);
          const dc = await fetch(`/api/documents?college_id=${first.id}`).then((r) => r.json()).catch(() => null);
          depts = String(d?.departments?.length ?? 0);
          docs = String(dc?.documents?.length ?? 0);
        }
        setStats({ colleges: String(colleges), depts, docs });
      } catch {}
    })();
  }, []);

  async function copyCmd() {
    try {
      await navigator.clipboard.writeText(CMDS[cmd].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  const cards = WORKFLOWS.filter((w) => WTABS[wtab] === "All" || w.cat === WTABS[wtab]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "NxtGenSec", url: "https://collegemate.app" },
      { "@type": "SoftwareApplication", name: "CollegeMate", applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } },
      { "@type": "WebSite", name: "CollegeMate", url: "https://collegemate.app" },
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ================= HERO ================= */}
      <section className="section relative text-center">
        <div className="dots dots-fade pointer-events-none absolute inset-0" />
        <div className="relative">
          <Link href="/demo/mits-madanapalle" className="badge badge-gold mono !text-[11px]">
            <span className="dot dot-pulse" aria-hidden="true" /> Live demo running — MITS-Madanapalle
          </Link>
          <h1 className="h1 mx-auto mt-5 max-w-3xl">AI-Powered College Knowledge Assistant</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium leading-relaxed text-[#d4d4d8]">
            <span className="hl">college-scoped</span> answers from verified docs — fees, cutoffs,
            placements — with <span className="hl">citations on everything</span>, in{" "}
            <span className="hl">separate workspaces</span>
          </p>

          <div className="card-elevated mx-auto mt-7 max-w-xl p-5 text-left">
            <div className="grid grid-cols-3 gap-4 text-center">
              <Stat value={stats.colleges} cap="colleges live" />
              <Stat value={stats.depts} cap="departments" />
              <Stat value={stats.docs} cap="documents" />
            </div>
            <div className="divider mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 pt-3 text-[11.5px] muted">
              <span className="mono">Web · Mobile · API</span>
            </div>
            <div className="cmdtabs mt-2 justify-center !border-0 !p-0">
              {CMDS.map((c, i) => (
                <button key={c.tab} onClick={() => setCmd(i)} className={`cmdtab ${cmd === i ? "cmdtab-active" : ""}`}>
                  {c.tab}
                </button>
              ))}
            </div>
            <div className="cmdbody !px-1">
              <code className="cmdcode mx-auto">$ {CMDS[cmd].code}</code>
              <button onClick={copyCmd} className="cmdcopy">{copied ? "Copied" : "Copy"}</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {["Students", "Faculty", "Admins", "Departments"].map((t) => (
              <span key={t} className="badge mono !text-[11px]">{t}</span>
            ))}
            <span className="mono text-[11px] muted">+ live demo inside</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="btn-primary">Register your college</Link>
            <Link href="/auth" className="btn-ghost">Login</Link>
            <Link href="/#workflows" className="btn-ghost">Know more →</Link>
          </div>
          <p className="mono muted mt-2.5 text-[11.5px]">free demo · live workspace · no install</p>
        </div>
      </section>

      {/* ================= WORKSPACE PANEL ================= */}
      <section id="workflows" className="section">
        <p className="eyebrow text-center">How it fits together</p>
        <h2 className="h2 mt-2 text-center">One flow, from approval to answer</h2>
        <div className="mx-auto mt-5 flex max-w-fit items-center gap-1 rounded-full border border-[#232329] bg-[#101013] p-1" role="tablist" aria-label="Workflow categories">
          {WTABS.map((s, i) => (
            <button key={s} role="tab" aria-selected={wtab === i} onClick={() => setWtab(i)}
              className={`mono rounded-full px-4 py-1.5 text-[12px] ${wtab === i ? "bg-white font-semibold text-black" : "muted hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="card mt-4 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="mono text-[11.5px] muted">collegemate / {WTABS[wtab].toLowerCase()}</span>
            <span className="mono hidden text-[11.5px] muted sm:inline">{cards.length} steps</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((w, i) => (
              <Link key={w.t} href={w.k} className="card card-hover group block p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="badge badge-neutral mono !text-[10px]">{w.cat}</span>
                  <span className="mono muted text-[10.5px]">0{i + 1}</span>
                </div>
                <div className="mb-3 min-h-16">{w.v}</div>
                <div className="text-[14px] font-semibold">{w.t} <span className="muted transition group-hover:text-white">→</span></div>
                <div className="muted mt-0.5 text-[12.5px]">{w.d}</div>
                <div className="mono muted mt-2 text-[10.5px]">{w.k}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CAMPUS PANEL ================= */}
      <section id="plans" className="section">
        <div className="ticks card p-8 sm:p-12">
          <span className="tick tick-tl">+</span><span className="tick tick-tr">+</span>
          <span className="tick tick-bl">+</span><span className="tick tick-br">+</span>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow !text-[#e8b34b]">● Campus plan</p>
              <h2 className="h2 mt-3">One workspace<br />per college</h2>
              <p className="muted mt-3 max-w-sm text-[14px]">Unlimited departments. Full control.</p>
              <ul className="mt-4 space-y-2 text-[13.5px]">
                {["Own workspace + login", "Dept faculty access", "Cited scoped chat"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><span className="text-[#86efac]">✓</span>{t}</li>
                ))}
              </ul>
              <p className="mono muted mt-3 text-[11px]">UPCOMING · clubs + support desks + self-host</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/register" className="btn-primary btn-sm">Why colleges pick it →</Link>
                <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm">See live demo</Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-xs rounded-2xl border border-[#6b4d1a] bg-gradient-to-b from-[#1c1408] to-[#100c05] p-6">
              <div className="mono text-[10px] tracking-[.18em] text-[#e8b34b]">CAMPUS LICENSE</div>
              <div className="font-display mt-2 text-xl font-bold">CollegeMate Campus</div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[["1+", "college"], ["∞", "depts"], ["cited", "chat"]].map(([a, b]) => (
                  <div key={b}><div className="text-[15px] font-bold">{a}</div><div className="muted text-[11px]">{b}</div></div>
                ))}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-[#e8b34b]">Free</span>
                <span className="muted text-[12px]">demo · custom later</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATUS ================= */}
      <section className="section">
        <p className="eyebrow">System status</p>
        <h2 className="h2 mt-2">Live data, not screenshots</h2>
        <p className="lead mt-2 max-w-lg text-[14px]">Pulled from <span className="kbd">/api/health</span> on every page load.</p>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <div className="card card-pad">
            <Stat value={stats.colleges} cap="college workspace live" />
            <div className="divider mono muted mt-4 pt-3 text-[11.5px]">onboarded · approved · isolated</div>
          </div>
          <div className="card card-pad">
            <Stat value={stats.depts} cap="departments structured" />
            <div className="divider mono muted mt-4 pt-3 text-[11.5px]">scoped faculty access</div>
          </div>
          <div className="card card-pad">
            <Stat value={stats.docs} cap="documents indexed" />
            <div className="divider mono muted mt-4 pt-3 text-[11.5px]">cited in every answer</div>
          </div>
        </div>
        <p className="mono muted mt-3 flex items-center gap-2 text-[11px]"><span className="dot dot-pulse text-[#86efac]" aria-hidden="true" /> Live · refreshes on load</p>
      </section>

      {/* ================= COMPARE ================= */}
      <section id="compare" className="section">
        <p className="eyebrow text-center">Honest comparison</p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <span className="badge mono !text-[11px]">CollegeMate</span>
          <span className="font-display text-xl font-bold">VS</span>
          <span className="badge badge-neutral mono !text-[11px]">Generic bot</span>
        </div>
        <h2 className="h2 mt-3 text-center">Why CollegeMate</h2>
        <div className="card mt-6 overflow-x-auto p-2">
          <table className="cmp min-w-[680px]">
            <thead><tr><th></th><th>Demo</th><th>Campus</th><th>Self-host</th><th>Generic bot</th><th></th></tr></thead>
            <tbody>
              {[
                ["Runs on", "Demo docs", "Your docs", "Your servers", "The internet"],
                ["Start with", "Open demo", "Register", "Deploy", "Prompt"],
                ["Citations", "Yes", "Yes", "Yes", "Rarely"],
                ["Tenancy", "1 college", "Per college", "Yours", "Shared"],
                ["Unknowns", "Fallback", "Fallback", "Fallback", "May go beyond sources"],
                ["Departments", "Scoped", "Scoped", "Scoped", "Usually not"],
                ["LLM", "Sarvam", "Sarvam", "Your model", "Locked in"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td className="hlcol">{r[1]}</td><td className="hlcol">{r[2]}</td><td className="hlcol">{r[3]}</td>
                  <td className="muted">{r[4]}</td><td className="muted">↗</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted px-3 py-2 text-[11.5px]">Every claim maps to a route or table in this build. Checked just now.</p>
          <div className="flex justify-center pb-3">
            <Link href="/demo/mits-madanapalle" className="btn-primary btn-sm">Open the live demo →</Link>
          </div>
        </div>
      </section>

      {/* ================= SCREENS ================= */}
      <section className="section">
        <p className="eyebrow text-center">Product tour</p>
        <h2 className="h2 mt-2 text-center">What you&apos;re opening</h2>
        <p className="muted mono mt-2 text-center text-[11.5px]">6 spaces · live routes, click any card to open it</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Screen href="/dashboard" cap="Super hub">
            {sk(90)}{sk(70)}{sk(82)}
            <div className="flex gap-2 pt-1"><div className="h-6 flex-1 rounded-full bg-white" /><div className="h-6 flex-1 rounded-full border border-[#34343c]" /></div>
          </Screen>
          <Screen href="/mits-madanapalle" cap="College space">
            <div className="flex gap-1.5">{["O", "D", "D", "C"].map((t, i) => (<div key={i} className="mv-chip mono flex-1 py-1 text-center text-[9px] text-[#a1a1aa]">{t}</div>))}</div>
            {sk(88)}{sk(64)}
          </Screen>
          <Screen href="/auth" cap="Login / Register">
            <div className="flex gap-1 rounded-full border border-[#2b2b31] p-1">
              <div className="h-5 flex-1 rounded-full bg-white" /><div className="h-5 flex-1" />
            </div>
            {sk(75)}{sk(90)}
          </Screen>
          <Screen href="/faculty" cap="Faculty upload">
            {sk(75)}
            <div className="h-1.5 overflow-hidden rounded-full bg-[#222228]"><div className="h-full w-3/4 rounded-full bg-white" /></div>
            {sk(92)}
          </Screen>
          <Screen href="/chat" cap="Scoped chat">
            <div className="ml-auto w-3/4 rounded-lg rounded-br-sm bg-[#2b2b31] p-2">{sk(85)}</div>
            <div className="w-5/6 rounded-lg rounded-bl-sm border border-[#2b2b31] p-2">{sk(95)}<div className="mono mt-1 text-[9px] text-[#86efac]">[fees.pdf · p.3 · CSE]</div></div>
          </Screen>
          <Screen href="/demo/mits-madanapalle" cap="Public demo">
            {sk(95)}{sk(70)}{sk(82)}
            <div className="flex gap-2 pt-1"><div className="h-6 flex-1 rounded-full bg-white" /><div className="h-6 flex-1 rounded-full border border-[#34343c]" /></div>
          </Screen>
        </div>
      </section>

      {/* ================= EXAMPLES ================= */}
      <section className="section">
        <p className="eyebrow text-center">Grounded answers</p>
        <h2 className="h2 mt-2 text-center">Ask, get cited answers</h2>
        <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2">
          {[
            ["What is the minimum attendance requirement?", "75% — [regulations.pdf · p.24 · Attendance]", "Academic"],
            ["Who leads the Cyber Security Club?", "Name + contact — [clubs.pdf · p.2 · Clubs]", "Clubs"],
            ["How do I apply for a bonafide?", "Portal + 2 days — [admin.pdf · p.7 · Admin]", "Admin"],
            ["Placement eligibility criteria?", "7.0 CGPA, no backlogs — [placements.xlsx · p.1]", "Placements"],
          ].map(([q, a, src]) => (
            <div key={q} className="card card-hover card-pad">
              <div className="text-[14px] font-semibold">“{q}”</div>
              <div className="muted mt-2 text-[13px]">{a}</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="badge badge-green mono !text-[10px]">{src}</span>
                <span className="mono muted text-[10.5px]">illustrative format</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="section">
        <p className="eyebrow text-center">Quick answers</p>
        <h2 className="h2 mt-2 text-center">Little questions, short answers.</h2>
        <div className="mx-auto mt-6 grid max-w-4xl gap-2.5 sm:grid-cols-2">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`faq-item ${openFaq === i ? "open" : ""}`}>
              <button className="faq-q" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}<span className="muted" aria-hidden="true">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="section">
        <div className="ticks card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="dots pointer-events-none absolute inset-0 opacity-60" />
          <span className="tick tick-tl">+</span><span className="tick tick-tr">+</span>
          <span className="tick tick-bl">+</span><span className="tick tick-br">+</span>
          <div className="relative">
            <p className="mono text-[11px] tracking-[.2em] muted">FREE · CITED · WORKSPACE-SCOPED</p>
            <h2 className="h2 mx-auto mt-3 max-w-xl">Make your college&apos;s knowledge accessible</h2>
            <p className="muted mx-auto mt-3 max-w-md text-[14px]">
              Give students and faculty <span className="hl">one trusted place</span> for academic,
              administrative, departmental and support information.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn-primary">Register your college</Link>
              <Link href="/demo/mits-madanapalle" className="btn-ghost">Explore live demo</Link>
            </div>
            <p className="mono muted mt-4 text-[11.5px]">hub · workspace · upload · chat</p>
          </div>
        </div>
      </section>
    </div>
  );
}
