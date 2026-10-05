"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  { q: "What is CollegeMate?", a: "CollegeMate is an AI-powered institutional knowledge assistant that helps students, faculty and administrators find answers from verified college information." },
  { q: "How does CollegeMate use RAG?", a: "CollegeMate retrieves relevant information from the college's knowledge base before generating an answer, helping ground responses in institutional sources." },
  { q: "Can each department manage its own knowledge?", a: "Yes. Knowledge can be organized by department and managed according to institutional permissions." },
  { q: "What happens when CollegeMate doesn't know?", a: "It should not invent an answer. It can indicate that the information is unavailable and direct the user to an appropriate verified contact." },
  { q: "Can CollegeMate use a local AI model?", a: "Yes. CollegeMate is designed to remain model-flexible, allowing institutions to explore private or self-hosted models where appropriate." },
  { q: "Is each college's data isolated?", a: "Yes. Each institution should operate within its own isolated workspace and knowledge environment." },
];

const PROBLEMS = [
  { t: "Scattered information", s: "The answer is everywhere.", d: "Fees in PDFs. Rules in notices. Contacts in spreadsheets. Important information is spread across the campus." },
  { t: "Repeated questions", s: "Staff answer the same questions every day.", d: "Attendance, certificates, fees, exams and administrative processes generate thousands of repetitive queries." },
  { t: "Generic AI isn't your college", s: "Public AI doesn't know your institution.", d: "Generic AI can provide plausible answers that don't reflect your college's actual rules, policies or current information." },
  { t: "No source, no confidence", s: "Students need to know where an answer came from.", d: "Without the original document or source, even a correct answer can be difficult to trust." },
];

const CAPABILITIES = [
  { n: "01", t: "One knowledge base", d: "Bring approved academic, administrative, departmental, placement and support information into one searchable system." },
  { n: "02", t: "Answers with sources", d: "CollegeMate retrieves relevant information before generating an answer and shows the documents behind the response." },
  { n: "03", t: "Departments stay in control", d: "Departments can manage their own knowledge while administrators maintain control over the institution's information." },
];

const STEPS = [
  { n: "01", t: "Add", d: "Documents, policies, notices, regulations" },
  { n: "02", t: "Organize", d: "Departments, permissions, knowledge base" },
  { n: "03", t: "Ask", d: "Student question in natural language" },
  { n: "04", t: "Answer", d: "AI response with sources" },
];

const DIFFERENTIATORS = [
  { t: "Cited", s: "Every answer has evidence.", d: "See the document and source behind the information.", visual: "cite" },
  { t: "Isolated", s: "Every college has its own workspace.", d: "Institutional knowledge stays separated between colleges.", visual: "box" },
  { t: "Scoped", s: "Knowledge belongs to the right department.", d: "Admissions, CSE, ECE, Hostel, Examination Cell and others can maintain their own information.", visual: "grid" },
  { t: "Honest", s: "When it doesn't know, it doesn't guess.", d: "CollegeMate can direct students to the right verified contact instead.", visual: "route" },
];

const USERS = [
  { who: "Students", d: "Get quick answers about academics, exams, fees, admissions, placements, hostel, policies and student services.", flow: "Ask → Find → Act" },
  { who: "Faculty & Departments", d: "Maintain department knowledge and reduce repetitive information requests.", flow: "Manage → Update → Assist" },
  { who: "Administrators", d: "Give your institution one controlled knowledge layer with visibility over information and access.", flow: "Control → Verify → Scale" },
];

const DEMO_QUESTIONS = [
  "What is the attendance requirement?",
  "When are semester examinations?",
  "What documents are required for admission?",
];

function DiffVisual({ kind }: { kind: string }) {
  if (kind === "cite") {
    return (
      <div className="mt-4 rounded-lg border border-[#E4DFD3] bg-[#F6F5F1] p-3" aria-hidden="true">
        <div className="mv-line" style={{ width: "88%" }} />
        <div className="mt-2 flex gap-1.5">
          <span className="badge badge-green mono !text-[10px]">cited</span>
          <span className="badge mono !text-[10px]">regulations.pdf · p.24</span>
        </div>
      </div>
    );
  }
  if (kind === "box") {
    return (
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {["MITS", "SRM", "VIT"].map((c) => (
          <div key={c} className="mv-chip mono flex-1 py-2 text-center text-[10px] text-[#5A6B84]">{c}</div>
        ))}
      </div>
    );
  }
  if (kind === "grid") {
    return (
      <div className="mt-4 grid grid-cols-3 gap-1.5" aria-hidden="true">
        {["CSE", "ECE", "ADM", "HOS", "EXM", "PLC"].map((c) => (
          <div key={c} className="mv-chip mono py-1.5 text-center text-[10px] text-[#5A6B84]">{c}</div>
        ))}
      </div>
    );
  }
  return (
    <div className="mono mt-4 flex items-center gap-2 text-[11px] text-[#5A6B84]" aria-hidden="true">
      <span className="badge badge-amber !text-[10px]">unknown</span>
      <span>→</span>
      <span className="badge mono !text-[10px]">exam cell · ext. 214</span>
    </div>
  );
}

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

      {/* ================= 01 · HERO + PRODUCT PREVIEW ================= */}
      <section className="section relative">
        <div className="dots dots-fade pointer-events-none absolute inset-0" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="eyebrow rise">AI knowledge assistant for colleges</p>
            <h1 className="h1 rise mt-4 max-w-xl" style={{ animationDelay: "70ms" }}>
              Your college has the answers. CollegeMate makes them accessible.
            </h1>
            <p className="muted rise mt-4 max-w-lg text-[15px] leading-relaxed" style={{ animationDelay: "140ms" }}>
              CollegeMate helps students, faculty, and administrators instantly find trusted
              college information from verified documents, policies, notices, academic
              regulations, fees, admissions, placements, and more — with sources for every answer.
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
            <p className="mono muted mb-2 text-[11px] tracking-[.14em]">LIVE DEMO · MITS MADANAPALLE</p>
            <div className="card-elevated overflow-hidden">
              <div className="mockbar">
                <span className="mockdot" /><span className="mockdot" /><span className="mockdot" />
                <span className="mono ml-2 text-[11px] font-semibold">CollegeMate</span>
                <span className="mono ml-auto text-[10px] text-[#8A97A9]">MITS Madanapalle</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="chat-bubble-q ml-auto w-11/12 text-[13.5px]">
                  <span className="chat-role chat-role-q"><span className="dot" aria-hidden="true" />YOU</span>
                  <div>What is the minimum attendance required for end-semester exams?</div>
                </div>
                <div className="chat-bubble-a w-11/12 text-[13.5px] leading-relaxed">
                  <span className="chat-role chat-role-a"><span className="dot" aria-hidden="true" />COLLEGEMATE</span>
                  <div>Students must maintain 75% attendance in each subject.</div>
                </div>
                <div className="rounded-lg border border-[#BFE3CC] bg-[#E9F6EE] p-3">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold text-[#15803D]">
                    <span aria-hidden="true">✓</span> Grounded in college documents
                  </div>
                  <div className="mono mt-1.5 text-[11px] text-[#5A6B84]">Academic Regulations · p.24<br />Examination Circular · p.2</div>
                </div>
                <div className="flex gap-2">
                  <div className="input text-[#A8B0BD]">Ask a question…</div>
                  <span className="btn-primary btn-sm" aria-hidden="true">↑</span>
                </div>
              </div>
            </div>
            <Link href="/demo/mits-madanapalle" className="mono mt-3 inline-block text-[12px] font-semibold text-[#2E4BFF]">
              Ask it yourself → Open the live demo
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section aria-label="Capabilities" className="border-y border-[#E4DFD3]">
        <p className="mono py-4 text-center text-[11.5px] tracking-[.12em] text-[#5A6B84]">
          VERIFIED KNOWLEDGE&nbsp;&nbsp;·&nbsp;&nbsp;SOURCE CITATIONS&nbsp;&nbsp;·&nbsp;&nbsp;COLLEGE WORKSPACES&nbsp;&nbsp;·&nbsp;&nbsp;DEPARTMENT SCOPES&nbsp;&nbsp;·&nbsp;&nbsp;24/7 ACCESS&nbsp;&nbsp;·&nbsp;&nbsp;WEB · MOBILE · API
        </p>
      </section>

      {/* ================= 05 · PROBLEM ================= */}
      <section className="section">
        <p className="eyebrow">The problem</p>
        <h2 className="h2 mt-3 max-w-2xl">The information already exists. Finding it shouldn&apos;t be difficult.</h2>
        <p className="lead mt-3 max-w-xl text-[14.5px]">
          College information is spread across PDFs, notices, websites, spreadsheets,
          departments, and people. Students shouldn&apos;t have to know where the answer
          lives before they can find it.
        </p>
        <div className="mt-8 divide-y divide-[#E4DFD3] border-y border-[#E4DFD3]">
          {PROBLEMS.map((p, i) => (
            <div key={p.t} className="grid gap-1.5 py-6 sm:grid-cols-[56px_1fr] sm:gap-5">
              <span className="mono text-[13px] font-bold text-[#2E4BFF]">0{i + 1}</span>
              <span>
                <span className="text-[16px] font-semibold tracking-tight">{p.t}</span>
                <span className="mt-0.5 block text-[14px] font-medium text-[#0E1B2E]">{p.s}</span>
                <span className="muted mt-1 block max-w-[65ch] text-[13.5px] leading-relaxed">{p.d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 06 · TRANSITION ================= */}
      <section className="section text-center">
        <h2 className="h2 mx-auto max-w-2xl">What if students could simply ask?</h2>
        <div className="mx-auto mt-8 max-w-md">
          <div className="flex flex-wrap justify-center gap-2">
            {["PDFs", "Notices", "Policies", "Websites", "Department documents"].map((t) => (
              <span key={t} className="badge mono !text-[11px]">{t}</span>
            ))}
          </div>
          <div className="my-1 text-lg text-[#2E4BFF]" aria-hidden="true">↓</div>
          <div className="badge badge-acc mono mx-auto !px-5 !py-2 !text-[12px]">COLLEGEMATE</div>
          <div className="my-1 text-lg text-[#2E4BFF]" aria-hidden="true">↓</div>
          <div className="flex flex-col items-center gap-1.5 text-[13.5px] font-medium">
            <span>Ask naturally</span>
            <span aria-hidden="true" className="text-[#8A97A9]">↓</span>
            <span>Get the answer</span>
            <span aria-hidden="true" className="text-[#8A97A9]">↓</span>
            <span>See the source</span>
          </div>
        </div>
      </section>

      {/* ================= 07 · SOLUTION ================= */}
      <section className="section">
        <p className="eyebrow">The solution</p>
        <h2 className="h2 mt-3 max-w-2xl">One trusted knowledge layer for your entire college.</h2>
        <p className="lead mt-3 max-w-xl text-[14.5px]">
          CollegeMate turns your institution&apos;s approved information into a searchable,
          conversational knowledge base that students and faculty can access whenever they need it.
        </p>
        <div className="mt-8 grid gap-3">
          {CAPABILITIES.map((c) => (
            <div key={c.n} className="grid gap-2 rounded-xl border border-[#E4DFD3] bg-white p-5 sm:grid-cols-[64px_1fr] sm:gap-4">
              <span className="mono text-[13px] font-bold text-[#2E4BFF]">{c.n}</span>
              <span>
                <span className="text-[15px] font-semibold">{c.t}</span>
                <span className="muted mt-1 block max-w-[65ch] text-[13.5px] leading-relaxed">{c.d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 08 · HOW IT WORKS ================= */}
      <section id="how" className="section scroll-mt-28">
        <p className="eyebrow">How it works</p>
        <h2 className="h2 mt-3 max-w-2xl">From college documents to trusted answers.</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="border-t-2 border-[#2E4BFF] pt-4">
              <div className="flex items-baseline justify-between">
                <span className="mono text-[12px] font-bold text-[#2E4BFF]">{s.n}</span>
                {i < STEPS.length - 1 && <span className="text-[#8A97A9] max-lg:hidden" aria-hidden="true">→</span>}
              </div>
              <div className="mt-1 text-[15px] font-semibold">{s.t}</div>
              <div className="muted mt-1 text-[12.5px] leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
        <p className="muted mt-6 max-w-[65ch] text-[13px] leading-relaxed">
          Powered by Retrieval-Augmented Generation (RAG), CollegeMate retrieves relevant
          institutional information before generating an answer.
        </p>
      </section>

      {/* ================= 09 · DIFFERENTIATORS ================= */}
      <section id="why" className="section scroll-mt-28">
        <p className="eyebrow">Why CollegeMate</p>
        <h2 className="h2 mt-3 max-w-2xl">Built for institutional knowledge.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {DIFFERENTIATORS.map((d) => (
            <div key={d.t} className="card card-hover card-pad">
              <div className="font-display text-xl font-bold tracking-tight">{d.t}</div>
              <div className="mt-1 text-[14px] font-semibold">{d.s}</div>
              <div className="muted mt-1 text-[13px] leading-relaxed">{d.d}</div>
              <DiffVisual kind={d.visual} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= 10 · USERS ================= */}
      <section className="section">
        <p className="eyebrow">Who it serves</p>
        <h2 className="h2 mt-3 max-w-2xl">One platform. Different needs.</h2>
        <div className="mt-8 divide-y divide-[#E4DFD3] border-y border-[#E4DFD3]">
          {USERS.map((u) => (
            <div key={u.who} className="grid gap-1.5 py-6 sm:grid-cols-[220px_1fr_auto] sm:items-center sm:gap-6">
              <span className="text-[15px] font-semibold">{u.who}</span>
              <span className="muted max-w-[65ch] text-[13.5px] leading-relaxed">{u.d}</span>
              <span className="badge mono !text-[11px]">{u.flow}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 11 · LIVE DEMO ================= */}
      <section className="section">
        <div className="card-elevated grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow">Live demo</p>
            <h2 className="h2 mt-3">See CollegeMate working with a real college workspace.</h2>
            <ul className="mt-5 space-y-2.5 text-[13.5px]">
              {["MITS — Madanapalle workspace", "Department knowledge", "RAG retrieval", "Source citations", "Conversational AI"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="text-[#15803D]" aria-hidden="true">✓</span>{t}
                </li>
              ))}
            </ul>
            <Link href="/demo/mits-madanapalle" className="btn-primary mt-6">Open live demo →</Link>
          </div>
          <div>
            <p className="mono muted text-[11px] tracking-[.14em]">TRY ASKING</p>
            <div className="mt-3 space-y-2">
              {DEMO_QUESTIONS.map((q) => (
                <Link key={q} href="/demo/mits-madanapalle" className="row-item">
                  <span className="row-item-title font-normal">“{q}”</span>
                  <span className="muted" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 12 · COMPARISON ================= */}
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
          Generic AI knows the world. <span className="text-[#2E4BFF]">CollegeMate knows your institution.</span>
        </p>
      </section>

      {/* ================= 13 · SECURITY ================= */}
      <section className="section">
        <p className="eyebrow">Control</p>
        <h2 className="h2 mt-3 max-w-2xl">Your institution&apos;s knowledge deserves control.</h2>
        <div className="mt-8 grid gap-3">
          {[
            ["Isolated workspaces", "Each college operates within its own knowledge environment."],
            ["Controlled access", "Knowledge can be organized by institution, department and role."],
            ["Flexible deployment", "Start with cloud-based AI infrastructure and evolve toward private or self-hosted deployments where required."],
          ].map(([t, d], i) => (
            <div key={t} className="grid gap-2 rounded-xl border border-[#E4DFD3] bg-white p-5 sm:grid-cols-[64px_1fr] sm:gap-4">
              <span className="mono text-[13px] font-bold text-[#2E4BFF]">0{i + 1}</span>
              <span>
                <span className="text-[15px] font-semibold">{t}</span>
                <span className="muted mt-1 block max-w-[65ch] text-[13.5px] leading-relaxed">{d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 14 · FAQ ================= */}
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

      {/* ================= 15 · FINAL CTA ================= */}
      <section className="section text-center">
        <h2 className="h2 mx-auto max-w-2xl">Your college already has the knowledge.</h2>
        <p className="muted mx-auto mt-3 max-w-xl text-[15px]">Give everyone a better way to access it.</p>
        <p className="mono muted mt-3 text-[11.5px] tracking-[.12em]">ACADEMIC · ADMINISTRATIVE · DEPARTMENTAL · STUDENT SERVICES</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary">Register your college →</Link>
          <Link href="/demo/mits-madanapalle" className="btn-ghost">Explore live demo</Link>
        </div>
        <p className="mono muted mt-4 text-[11.5px]">Free demo · No installation · Web · Mobile · API</p>
      </section>
    </div>
  );
}
