"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  { q: "How does a college get started?", a: "Register your college and we create its workspace with admin credentials. Departments then publish their documents, notices and links — the assistant is ready for students the same day." },
  { q: "What can be added to the knowledge base?", a: "Documents, notices, links and plain notes — exam schedules, fee structures, hostel rules, placement updates, club information, contact directories and more." },
  { q: "Who manages the knowledge base?", a: "Each department owns its own section and can update it anytime from one dashboard. College admins keep oversight of the whole workspace." },
  { q: "How are answers kept trustworthy?", a: "Every answer is retrieved from published college knowledge first, then written with the department and document shown beside it. Anything missing is flagged to admins instead of guessed." },
  { q: "Do students need an app or account?", a: "No. One open chat on the college workspace handles everything — no installs, no sign-ups, no queues." },
  { q: "Is each college's data isolated?", a: "Yes. Every college operates inside its own workspace. Knowledge, departments and questions never cross into another institution." },
];

const COVERAGE = ["Exams", "Fees", "Hostel", "Placements", "Clubs", "Events", "Contacts", "Notices"];

const SHY_POINTS = [
  { n: "01", t: "Questions feel too small to ask", d: "Many students hesitate to walk up to an office or a professor with something they fear sounds like a silly question — so they stay confused instead." },
  { n: "02", t: "Offices run on queues", d: "Counters, office hours and email threads make every small doubt expensive. A two-minute question costs half a day." },
  { n: "03", t: "Information hides in silos", d: "The answer exists — in a PDF, on a notice board, with one staff member — but students can't see it, so they ask around or give up." },
];

const BUILD_STEPS = [
  { n: "01", t: "Workspace on day one", d: "We create your college workspace and issue admin credentials. The open chat goes live immediately." },
  { n: "02", t: "Departments publish", d: "Each department adds its documents, notices and links to its own section — updated anytime, from one dashboard." },
  { n: "03", t: "Gaps get filled", d: "Questions the assistant can't answer surface to admins, who add the missing knowledge once and never answer it twice." },
];

const DEPTS = ["Admissions", "CSE", "ECE", "Hostel", "Examinations", "Placements", "Library", "Clubs"];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

      {/* ================= HERO — chat-first ================= */}
      <section className="section relative">
        <div className="dots dots-fade pointer-events-none absolute inset-0" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="eyebrow rise">College knowledge · answered</p>
            <h1 className="h1 rise mt-4 max-w-xl" style={{ animationDelay: "70ms" }}>
              Your college has the answers. CollegeMate makes them accessible.
            </h1>
            <p className="muted rise mt-4 max-w-lg text-[15px] leading-relaxed" style={{ animationDelay: "140ms" }}>
              One open chat where students ask anything — exam dates, fees, hostel rules,
              placements, clubs — and get answers pulled from official college knowledge,
              with the source shown every time.
            </p>
            <div className="rise mt-6 flex flex-wrap gap-3" style={{ animationDelay: "210ms" }}>
              <Link href="/register" className="btn-primary">Register your college →</Link>
              <Link href="/demo/mits-madanapalle" className="btn-ghost">Explore live demo</Link>
            </div>
            <p className="mono muted rise mt-4 text-[11.5px]" style={{ animationDelay: "260ms" }}>
              Web · Mobile · API — no installation required
            </p>
          </div>

          <div id="product" className="rise scroll-mt-28" style={{ animationDelay: "180ms" }}>
            <p className="mono muted mb-2 text-[11px] tracking-[.14em]">OPEN CHAT · NO APP · NO ACCOUNT</p>
            <div className="card-elevated overflow-hidden">
              <div className="mockbar">
                <span className="mockdot" /><span className="mockdot" /><span className="mockdot" />
                <span className="mono ml-2 text-[11px] font-semibold">CollegeMate</span>
                <span className="mono ml-auto flex items-center gap-1.5 text-[10px] text-[#15803D]">
                  <span className="dot dot-pulse" aria-hidden="true" />live
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div className="chat-bubble-a w-11/12 text-[13.5px] leading-relaxed">
                  <span className="chat-role chat-role-a"><span className="dot" aria-hidden="true" />COLLEGEMATE</span>
                  <div>Hi! I&apos;m CollegeMate. Ask me anything about this college — exams, clubs, events, contacts. I&apos;ll show the source with every answer.</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Attendance %?", "Hostel timings?", "Bonafide process?"].map((c) => (
                    <span key={c} className="badge mono !text-[11px]">{c}</span>
                  ))}
                </div>
                <div className="chat-bubble-q ml-auto w-11/12 text-[13.5px]">
                  <span className="chat-role chat-role-q"><span className="dot" aria-hidden="true" />YOU</span>
                  <div>Who do I contact for a hostel issue?</div>
                </div>
                <div className="chat-bubble-a w-11/12 text-[13.5px] leading-relaxed">
                  <span className="chat-role chat-role-a"><span className="dot" aria-hidden="true" />COLLEGEMATE</span>
                  <div>Warden&apos;s office, Hostel Block A — ext. 214, 9am–5pm on working days.</div>
                </div>
                <div className="mono muted flex flex-wrap gap-1.5 text-[10.5px]">
                  <span className="badge badge-green">answered from knowledge</span>
                  <span className="badge">[hostel-handbook.pdf · p.6 · Hostel]</span>
                </div>
                <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm w-full">Ask it yourself — open the demo →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COVERAGE ================= */}
      <section aria-label="Coverage" className="border-y border-[#E6E5F1] bg-[#F5F4FC]">
        <div className="py-8 text-center">
          <p className="eyebrow">One place for everything</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 px-6">
            {COVERAGE.map((c) => (
              <span key={c} className="badge mono !px-4 !py-2 !text-[12px]">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHY PROBLEM ================= */}
      <section className="section">
        <p className="eyebrow">The problem</p>
        <h2 className="h2 mt-3 max-w-2xl">Students shouldn&apos;t need courage to get informed.</h2>
        <p className="lead mt-3 max-w-xl text-[14.5px]">
          The information exists. Reaching it is what fails — through hesitation,
          queues, and hiding places.
        </p>
        <div className="mt-8 divide-y divide-[#E6E5F1] border-y border-[#E6E5F1]">
          {SHY_POINTS.map((p) => (
            <div key={p.n} className="grid gap-1.5 py-6 sm:grid-cols-[56px_1fr] sm:gap-5">
              <span className="mono text-[13px] font-bold text-[#5046E5]">{p.n}</span>
              <span>
                <span className="text-[16px] font-semibold tracking-tight">{p.t}</span>
                <span className="muted mt-1 block max-w-[65ch] text-[13.5px] leading-relaxed">{p.d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COLLEGE BUILDS THE BRAIN ================= */}
      <section className="section">
        <p className="eyebrow">How colleges start</p>
        <h2 className="h2 mt-3 max-w-2xl">Your college builds the brain.</h2>
        <p className="lead mt-3 max-w-xl text-[14.5px]">
          No IT project, no content migration. A workspace, department sections,
          and the same day live.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {BUILD_STEPS.map((s) => (
            <div key={s.n} className="border-t-2 border-[#5046E5] pt-4">
              <span className="mono text-[12px] font-bold text-[#5046E5]">{s.n}</span>
              <div className="mt-1 text-[15px] font-semibold">{s.t}</div>
              <div className="muted mt-1 text-[12.5px] leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="card mt-8 p-6 sm:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <h3 className="h3">Departments stay current, anytime.</h3>
              <p className="muted mt-2 max-w-[65ch] text-[13.5px] leading-relaxed">
                Each department owns its section and updates documents, notes and links
                whenever things change. New circular in the morning, correct answers by afternoon.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {DEPTS.map((d) => (
                  <span key={d} className="badge mono !text-[11px]">{d}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#BFE3CC] bg-[#E9F6EE] p-5">
              <p className="mono text-[11px] tracking-[.14em] text-[#15803D]">ADMIN GAP LOOP</p>
              <p className="mt-2 text-[14px] font-semibold text-[#0E3B22]">Unanswered questions surface to admins.</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#3F6B52]">
                Anything the assistant can&apos;t answer is flagged with the exact question.
                Admins add the missing knowledge once — and every future student gets it instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NO APP STRIP ================= */}
      <section aria-label="No install needed" className="border-y border-[#E6E5F1] bg-[#F5F4FC]">
        <p className="mx-auto max-w-3xl px-6 py-8 text-center text-[15px] font-medium leading-relaxed">
          No app, no account, no queue.{" "}
          <span className="muted">One open chat on the college workspace handles everything
          from exam dates to club events.</span>
        </p>
      </section>

      {/* ================= WHY (differentiators, compact) ================= */}
      <section id="why" className="section scroll-mt-28">
        <p className="eyebrow">Why CollegeMate</p>
        <h2 className="h2 mt-3 max-w-2xl">Answers only from your college — never the open internet.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Cited", "Every answer shows the department and document it came from. No guessing, no invented facts."],
            ["Department-owned", "Each department publishes and maintains its own knowledge section."],
            ["Gap-aware", "Admins see exactly which questions failed — and fix the knowledge behind them."],
            ["Isolated", "Every college runs its own workspace. Nothing crosses institutions."],
          ].map(([t, d]) => (
            <div key={t} className="card card-hover card-pad">
              <div className="font-display text-lg font-bold tracking-tight">{t}</div>
              <div className="muted mt-1 text-[13px] leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMPARE ================= */}
      <section id="compare" className="section scroll-mt-28">
        <p className="eyebrow">Comparison</p>
        <h2 className="h2 mt-3 max-w-2xl">Why not a generic AI chatbot?</h2>
        <div className="card mt-6 overflow-x-auto p-2">
          <table className="cmp min-w-[520px]">
            <thead><tr><th></th><th>CollegeMate</th><th>Generic AI</th></tr></thead>
            <tbody>
              {[
                ["College-specific knowledge", "✓", "—"],
                ["Your institutional documents", "✓", "—"],
                ["Source citations", "✓", "Limited"],
                ["Department knowledge", "✓", "—"],
                ["College workspace", "✓", "—"],
                ["Controlled knowledge scope", "✓", "—"],
                ["Institutional fallback", "✓", "—"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td className="hlcol">{r[1]}</td>
                  <td className="muted">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center font-display text-2xl font-bold tracking-tight">
          Generic AI knows the world. <span className="text-[#5046E5]">CollegeMate knows your institution.</span>
        </p>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="section scroll-mt-28">
        <p className="eyebrow text-center">Quick answers</p>
        <h2 className="h2 mt-3 text-center">Frequently asked questions.</h2>
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

      {/* ================= FINAL CTA ================= */}
      <section className="section text-center">
        <h2 className="h2 mx-auto max-w-2xl">Your college already has the knowledge.</h2>
        <p className="muted mx-auto mt-3 max-w-xl text-[15px]">Give everyone a better way to access it.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary">Register your college →</Link>
          <Link href="/demo/mits-madanapalle" className="btn-ghost">Explore live demo</Link>
        </div>
        <p className="mono muted mt-4 text-[11.5px]">Free demo · No installation · Web · Mobile · API</p>
      </section>
    </div>
  );
}
