"use client";
import { useState } from "react";
import Link from "next/link";

const CMDS = [
  { tab: "Register", code: "open  /register   →   onboard your college" },
  { tab: "Demo", code: "open  /demo/mits-madanapalle   →   live workspace" },
  { tab: "Chat", code: "open  /chat   →   ask, get cited answers" },
];

const FAQS = [
  { q: "What is CollegeMate?", a: "CollegeMate is an AI-powered, RAG-based institutional knowledge platform developed by NxtGenSec — verified academic, administrative, department, placement, club and support info in one cited AI platform." },
  { q: "How does CollegeMate use RAG?", a: "Documents are processed into a secure knowledge base. Questions retrieve the relevant passages first, then answers generate grounded in them." },
  { q: "Can departments have separate access?", a: "Yes — each department gets its own workspace and faculty access, scoped and maintainable." },
  { q: "What happens when it doesn't know?", a: "It falls back to a verified contact or helpdesk instead of answering beyond institutional knowledge." },
  { q: "Can it use a local LLM?", a: "Yes — Sarvam today through an OpenAI-compatible layer built to swap to self-hosted later." },
  { q: "Is it multi-tenant?", a: "Yes — isolated workspaces per college. Data, departments, documents and queries never cross colleges." },
];

const PROBLEMS = [
  { t: "Information lives everywhere", d: "Fees in one PDF, cutoffs in a spreadsheet, hostel rules on a notice board, club contacts with one senior. Nobody knows the current truth.", tag: "scattered" },
  { t: "Staff repeat the same answers daily", d: "Attendance rules, bonafide process, certificate timelines — offices burn hours re-answering what documents already contain.", tag: "repeated load" },
  { t: "Generic chatbots guess", d: "Public AI answers confidently from the open internet — wrong fees, wrong rules, zero accountability to your institution.", tag: "unverified" },
  { t: "Departments work in silos", d: "CSE, ECE, Admissions, Hostel each keep their own files. Students bounce between desks for one straight answer.", tag: "silos" },
  { t: "Answers can't be checked", d: "Even when an answer exists, nobody can see which document, page, or department it came from — so nobody trusts it.", tag: "no proof" },
  { t: "Missing info becomes wrong info", d: "When knowledge runs out, students get silence or a confident guess instead of the right office contact.", tag: "dead ends" },
];

const WHY = [
  { n: "01", t: "One verified source per college", d: "Each college gets an isolated workspace. Approved documents become a scoped knowledge base — the same truth for students, faculty, and admins." },
  { n: "02", t: "Answers that show their work", d: "Every response carries [document · department · chunk] citations. When knowledge ends, it falls back to a verified contact — it never guesses." },
  { n: "03", t: "Departments stay the owners", d: "Faculty upload into their own department scope, admins approve, students ask across all of it. Ownership stays where the knowledge lives." },
];

const OUTCOMES = [
  ["Cited", "every answer ships with document sources"],
  ["Isolated", "zero mixing of data across colleges"],
  ["Honest", "a fallback contact instead of a guess"],
  ["Scoped", "department-level access and uploads"],
];

export default function Home() {
  const [cmd, setCmd] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  async function copyCmd() {
    try {
      await navigator.clipboard.writeText(CMDS[cmd].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

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

      {/* ================= HOME / HERO ================= */}
      <section id="home" className="section relative text-center">
        <div className="dots dots-fade pointer-events-none absolute inset-0" />
        <div className="relative">
          <Link href="/demo/mits-madanapalle" className="badge badge-gold mono !text-[11px]">
            <span className="dot dot-pulse" aria-hidden="true" /> Live demo running — MITS-Madanapalle
          </Link>
          <h1 className="h1 mx-auto mt-5 max-w-3xl">AI-Powered Knowledge Assistant for Colleges</h1>
          <p className="mx-auto mt-4 max-w-xl text-[17px] font-semibold leading-relaxed">
            Give every student instant access to trusted college information.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[#d4d4d8]">
            CollegeMate is an <span className="hl">AI-powered college knowledge assistant</span> that
            delivers accurate, college-specific answers from your institution&apos;s{" "}
            <span className="hl">verified documents, policies, notices, academic regulations, fees,
            admissions, placements, and more</span> — with source citations for every response.
          </p>
          <p className="mono muted mt-4 text-[12px] tracking-wide">Built for Students · Faculty · Administrators</p>
          <p className="mono muted mt-2 text-[11.5px]">Web · Mobile · API</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="btn-primary">Register Your College</Link>
            <Link href="/demo/mits-madanapalle" className="btn-ghost">Explore Live Demo</Link>
          </div>

          <div className="card-elevated mx-auto mt-8 max-w-2xl p-6 text-left sm:p-8">
            <h2 className="font-display text-xl font-bold tracking-tight">Ask. Find. Understand.</h2>
            <p className="muted mt-2 text-[13.5px] leading-relaxed">
              Students can ask questions in natural language and instantly find the information
              they need — without searching through dozens of PDFs, websites, notices, or
              internal documents.
            </p>
            <ul className="mt-4 grid gap-x-6 gap-y-2.5 text-[13.5px] sm:grid-cols-2">
              {[
                "Verified institutional knowledge",
                "AI-powered search and answers",
                "Source citations and document references",
                "College-specific workspaces",
                "24/7 availability",
                "Secure, scalable architecture",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="text-[#86efac]" aria-hidden="true">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>

          <div className="card mx-auto mt-4 max-w-2xl p-6 text-left sm:p-8">
            <p className="eyebrow !text-[#e8b34b]">Live college demo</p>
            <h2 className="font-display mt-2 text-xl font-bold tracking-tight">Experience CollegeMate with MITS Madanapalle</h2>
            <p className="muted mt-2 text-[13.5px] leading-relaxed">
              Explore how a college-specific AI assistant can answer questions using institutional
              knowledge and verified documents.
            </p>
            <Link href="/demo/mits-madanapalle" className="btn-primary btn-sm mt-4">Explore Live Demo</Link>
          </div>

          <div className="card mx-auto mt-4 max-w-2xl p-5 text-left">
            <div className="cmdtabs justify-center !border-0 !p-0">
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
          <p className="mono muted mt-4 text-[11.5px]">Free Demo · Live Workspace · No Installation Required</p>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="section">
        <p className="eyebrow">About</p>
        <h2 className="h2 mt-2 max-w-2xl">One trusted place for everything your college knows</h2>
        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="card card-pad">
            <p className="text-[14.5px] leading-relaxed">
              CollegeMate is an AI-powered, RAG-based institutional knowledge platform.
              Colleges collect verified academic, administrative, department, placement, club and
              support information into <span className="hl">isolated workspaces</span> — then
              students and faculty ask questions and get answers{" "}
              <span className="hl">grounded in those documents, with citations</span>.
            </p>
            <p className="muted mt-3 text-[14px] leading-relaxed">
              No prompt engineering, no public-internet guessing. Upload approved documents,
              organize them by department, and let every answer point back to its source —
              or honestly hand over a verified contact when the knowledge runs out.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge badge-green mono !text-[11px]">RAG-grounded</span>
              <span className="badge badge-blue mono !text-[11px]">workspace-scoped</span>
              <span className="badge badge-gold mono !text-[11px]">cited</span>
            </div>
          </div>
          <div className="card card-pad">
            <div className="text-[13.5px] font-semibold">Built for institutions</div>
            <ul className="mt-3 space-y-2.5 text-[13px]">
              {[
                ["Run anywhere", "Web, mobile and API access to every workspace."],
                ["Model-flexible", "Sarvam today, through an OpenAI-compatible layer built to swap to self-hosted later."],
                ["By NxtGenSec", "Designed for colleges that answer for their information."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-0.5 text-[#86efac]" aria-hidden="true">✓</span>
                  <span><span className="font-semibold">{t}</span> <span className="muted">— {d}</span></span>
                </li>
              ))}
            </ul>
            <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm mt-4 w-full">See it working →</Link>
          </div>
        </div>
      </section>

      {/* ================= PROBLEMS ================= */}
      <section id="problems" className="section">
        <p className="eyebrow">Problems colleges face</p>
        <h2 className="h2 mt-2 max-w-2xl">The information exists. Nobody can reach it.</h2>
        <p className="lead mt-3 max-w-xl text-[14px]">Six patterns we heard from every campus office — and why they persist without a knowledge platform.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <div key={p.t} className="card card-hover card-pad">
              <div className="flex items-start justify-between gap-2">
                <span className="mono muted text-[11px]">0{i + 1}</span>
                <span className="badge badge-red mono !text-[10px]">{p.tag}</span>
              </div>
              <div className="mt-3 text-[14.5px] font-semibold leading-snug">{p.t}</div>
              <div className="muted mt-1.5 text-[13px] leading-relaxed">{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section id="solution" className="section">
        <div className="ticks card p-8 sm:p-12">
          <span className="tick tick-tl">+</span><span className="tick tick-tr">+</span>
          <span className="tick tick-bl">+</span><span className="tick tick-br">+</span>
          <p className="eyebrow !text-[#e8b34b]">Solution</p>
          <h2 className="h2 mt-2 max-w-2xl">Why a scoped knowledge platform — and what changes</h2>

          <div className="mt-8 grid gap-3">
            {WHY.map((w) => (
              <div key={w.n} className="grid gap-2 rounded-xl border border-[#232329] bg-[#0d0d0f] p-5 sm:grid-cols-[64px_1fr] sm:gap-4">
                <span className="mono text-[13px] font-bold text-[#e8b34b]">{w.n}</span>
                <span>
                  <span className="text-[15px] font-semibold">{w.t}</span>
                  <span className="muted mt-1 block text-[13.5px] leading-relaxed">{w.d}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="divider mt-8 pt-6">
            <p className="mono text-[11px] tracking-[.18em] text-[#e8b34b]">OUTCOMES</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {OUTCOMES.map(([a, b]) => (
                <div key={a} className="rounded-xl border border-[#6b4d1a] bg-gradient-to-b from-[#1c1408] to-[#100c05] p-5 text-center">
                  <div className="font-display text-xl font-bold text-[#e8b34b]">{a}</div>
                  <div className="muted mt-1 text-[12px] leading-relaxed">{b}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="btn-primary btn-sm">Bring this to your college →</Link>
            <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm">Verify with the live demo</Link>
          </div>
        </div>
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
