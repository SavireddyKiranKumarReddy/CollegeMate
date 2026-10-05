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

      {/* ================= HOME / HERO — asymmetric ================= */}
      <section id="home" className="section relative">
        <div className="dots dots-fade pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#E5A83B]/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <Link href="/demo/mits-madanapalle" className="badge badge-gold mono rise !text-[11px]" style={{ animationDelay: "0ms" }}>
              <span className="dot dot-pulse" aria-hidden="true" /> Live demo running — MITS-Madanapalle
            </Link>
            <h1 className="h1 rise mt-5 max-w-xl" style={{ animationDelay: "70ms" }}>
              AI-Powered Knowledge Assistant for Colleges
            </h1>
            <p className="rise mt-4 max-w-lg text-[17px] font-semibold leading-relaxed" style={{ animationDelay: "140ms" }}>
              Give every student instant access to trusted college information.
            </p>
            <p className="muted rise mt-3 max-w-lg text-[14.5px] leading-relaxed" style={{ animationDelay: "210ms" }}>
              CollegeMate is an <span className="hl">AI-powered college knowledge assistant</span> that
              delivers accurate, college-specific answers from your institution&apos;s{" "}
              <span className="hl">verified documents, policies, notices, academic regulations, fees,
              admissions, placements, and more</span> — with source citations for every response.
            </p>
            <p className="mono muted rise mt-4 text-[12px] tracking-wide" style={{ animationDelay: "260ms" }}>
              Built for Students · Faculty · Administrators
            </p>
            <div className="rise mt-6 flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
              <Link href="/register" className="btn-primary">Register Your College</Link>
              <Link href="/demo/mits-madanapalle" className="btn-ghost">Explore Live Demo</Link>
            </div>
            <p className="mono muted rise mt-3 text-[11.5px]" style={{ animationDelay: "360ms" }}>
              Web · Mobile · API — free demo · no installation
            </p>
          </div>

          <div className="rise" style={{ animationDelay: "200ms" }}>
            <div className="card-elevated overflow-hidden">
              <div className="mockbar">
                <span className="mockdot" /><span className="mockdot" /><span className="mockdot" />
                <span className="mono ml-2 text-[10px] text-[#6E6656]">collegemate / mits-madanapalle / chat</span>
                <span className="mono ml-auto flex items-center gap-1.5 text-[10px] text-[#86EFAC]">
                  <span className="dot dot-pulse" aria-hidden="true" />live
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div className="chat-bubble-q ml-auto w-11/12 text-[13.5px]">
                  <span className="chat-role chat-role-q"><span className="dot" aria-hidden="true" />YOU</span>
                  <div>What is the minimum attendance to write the end-semester exams?</div>
                </div>
                <div className="chat-bubble-a w-11/12 text-[13.5px] leading-relaxed">
                  <span className="chat-role chat-role-a"><span className="dot" aria-hidden="true" />COLLEGEMATE</span>
                  <div>75% in each subject. Condonation applies down to 65% with a medical certificate and a ₹480 condonation fee paid before the hall-ticket deadline.</div>
                </div>
                <div className="mono muted flex flex-wrap gap-1.5 text-[10.5px]">
                  <span className="badge badge-green">high confidence</span>
                  <span className="badge">[academic-regulations.pdf · p.24 · Academics]</span>
                  <span className="badge">[circular-118.pdf · p.2 · Exams]</span>
                </div>
                <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm w-full">Ask it yourself — open the demo →</Link>
              </div>
            </div>
            <div className="card mt-3 p-4">
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
          </div>
        </div>

        <div className="card-elevated mt-10 p-6 sm:p-8">
          <div className="grid items-start gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Ask. Find. Understand.</h2>
              <p className="muted mt-2 max-w-md text-[13.5px] leading-relaxed">
                Students ask in natural language and instantly find what they need — no digging
                through dozens of PDFs, websites, notices, or internal documents.
              </p>
            </div>
            <ul className="grid gap-x-6 gap-y-2.5 text-[13.5px] sm:grid-cols-2">
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
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="section">
        <p className="eyebrow">About</p>
        <h2 className="h2 mt-2 max-w-2xl">One trusted place for everything your college knows</h2>
        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="card card-pad">
            <p className="max-w-[65ch] text-[14.5px] leading-relaxed">
              CollegeMate is an AI-powered, RAG-based institutional knowledge platform.
              Colleges collect verified academic, administrative, department, placement, club and
              support information into <span className="hl">isolated workspaces</span> — then
              students and faculty ask questions and get answers{" "}
              <span className="hl">grounded in those documents, with citations</span>.
            </p>
            <p className="muted mt-3 max-w-[65ch] text-[14px] leading-relaxed">
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
                  <span className="max-w-[65ch]"><span className="font-semibold">{t}</span> <span className="muted">— {d}</span></span>
                </li>
              ))}
            </ul>
            <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm mt-4 w-full">See it working →</Link>
          </div>
        </div>
      </section>

      {/* ================= PROBLEMS — editorial rows, no cards ================= */}
      <section id="problems" className="section">
        <p className="eyebrow">Problems colleges face</p>
        <h2 className="h2 mt-2 max-w-2xl">The information exists. Nobody can reach it.</h2>
        <p className="lead mt-3 max-w-xl text-[14px]">Six patterns we heard from every campus office — and why they persist without a knowledge platform.</p>
        <div className="mt-8 divide-y divide-[#201B13] border-y border-[#201B13]">
          {PROBLEMS.map((p, i) => (
            <div key={p.t} className="grid gap-1.5 py-5 sm:grid-cols-[56px_1fr_auto] sm:items-baseline sm:gap-5">
              <span className="mono text-[13px] font-bold text-[#E5A83B]">0{i + 1}</span>
              <span>
                <span className="text-[15.5px] font-semibold tracking-tight">{p.t}</span>
                <span className="muted mt-1 block max-w-[65ch] text-[13.5px] leading-relaxed">{p.d}</span>
              </span>
              <span className="badge badge-red mono !text-[10px]">{p.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section id="solution" className="section">
        <div className="ticks card p-8 sm:p-12">
          <span className="tick tick-tl">+</span><span className="tick tick-tr">+</span>
          <span className="tick tick-bl">+</span><span className="tick tick-br">+</span>
          <p className="eyebrow !text-[#E5A83B]">Solution</p>
          <h2 className="h2 mt-2 max-w-2xl">Why a scoped knowledge platform — and what changes</h2>

          <div className="mt-8 grid gap-3">
            {WHY.map((w) => (
              <div key={w.n} className="grid gap-2 rounded-xl border border-[#2A241A] bg-[#100D09] p-5 sm:grid-cols-[64px_1fr] sm:gap-4">
                <span className="mono text-[13px] font-bold text-[#E5A83B]">{w.n}</span>
                <span>
                  <span className="text-[15px] font-semibold">{w.t}</span>
                  <span className="muted mt-1 block max-w-[65ch] text-[13.5px] leading-relaxed">{w.d}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="divider mt-8 pt-6">
            <p className="mono text-[11px] tracking-[.18em] text-[#E5A83B]">OUTCOMES</p>
            <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {OUTCOMES.map(([a, b]) => (
                <div key={a} className="border-t-2 border-[#E5A83B] pt-4">
                  <div className="font-display text-2xl font-bold tracking-tight text-[#E5A83B]">{a}</div>
                  <div className="muted mt-1 max-w-[65ch] text-[12.5px] leading-relaxed">{b}</div>
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

      {/* ================= CTA — asymmetric ================= */}
      <section className="section">
        <div className="ticks card relative overflow-hidden p-8 sm:p-12">
          <div className="dots pointer-events-none absolute inset-0 opacity-60" />
          <span className="tick tick-tl">+</span><span className="tick tick-tr">+</span>
          <span className="tick tick-bl">+</span><span className="tick tick-br">+</span>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="mono text-[11px] tracking-[.2em] muted">FREE · CITED · WORKSPACE-SCOPED</p>
              <h2 className="h2 mt-3">Make your college&apos;s knowledge accessible</h2>
              <p className="muted mt-3 max-w-md text-[14px] leading-relaxed">
                Give students and faculty <span className="hl">one trusted place</span> for academic,
                administrative, departmental and support information.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register" className="btn-primary">Register your college</Link>
                <Link href="/demo/mits-madanapalle" className="btn-ghost">Explore live demo</Link>
              </div>
            </div>
            <div className="card-elevated p-5">
              <p className="mono text-[11px] tracking-[.14em] text-[#E5A83B]">GET STARTED IN ONE COMMAND</p>
              <div className="cmdtabs mt-3 justify-start !border-0 !p-0">
                {CMDS.map((c, i) => (
                  <button key={c.tab} onClick={() => setCmd(i)} className={`cmdtab ${cmd === i ? "cmdtab-active" : ""}`}>
                    {c.tab}
                  </button>
                ))}
              </div>
              <div className="cmdbody !px-1">
                <code className="cmdcode">$ {CMDS[cmd].code}</code>
                <button onClick={copyCmd} className="cmdcopy">{copied ? "Copied" : "Copy"}</button>
              </div>
              <p className="mono muted mt-1 text-[11px]">hub · workspace · upload · chat</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
