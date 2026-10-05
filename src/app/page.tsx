"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------- tiny stroke icons (no emoji) ---------- */
function I({ d, extra }: { d: React.ReactNode; extra?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={extra || "h-5 w-5"} aria-hidden="true">
      {d}
    </svg>
  );
}
const IconBook = () => <I d={<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" /></>} />;
const IconLayers = () => <I d={<><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></>} />;
const IconChat = () => <I d={<><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" /></>} />;
const IconGlobe = () => <I d={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3Z" /></>} />;
const IconUsers = () => <I d={<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" /><circle cx="17.5" cy="9" r="2.5" /><path d="M16 15.2c2.8.2 4.9 1.9 5.5 4.8" /></>} />;
const IconPhone = () => <I d={<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />} />;
const IconBolt = () => <I d={<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />} />;
const IconShield = () => <I d={<><path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" /><path d="m9 12 2 2 4-4" /></>} />;
const IconDb = () => <I d={<><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>} />;
const IconDoc = () => <I d={<><path d="M6 2h8l4 4v16H6V2Z" /><path d="M14 2v4h4" /><path d="m9.5 14 2 2 3.5-3.5" /></>} />;
const IconCap = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 3 1 9l11 6 11-6-11-6Z" />
    <path d="M5 11.5V16c0 1.7 3.1 3 7 3s7-1.3 7-3v-4.5l-7 3.8-7-3.8Z" />
  </svg>
);
const IconSearch = () => <I extra="h-4 w-4" d={<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>} />;
const IconCheck = () => <I extra="h-4 w-4" d={<path d="m4.5 12.5 5 5 10-11" />} />;

const FAQS = [
  { q: "How do the answers stay accurate?", a: "Answers come only from knowledge your departments publish. When a department updates a document or notice, every future answer reflects the change — nothing is invented in between." },
  { q: "Do students need an account?", a: "No. Students open the college chat and ask directly — no app to install, no sign-up, no queue." },
  { q: "Who manages the knowledge base?", a: "Each department owns its own section and keeps it current from one dashboard. College admins keep oversight across the whole workspace." },
  { q: "Which languages does it support?", a: "CollegeMate answers in the languages Indian students actually use — including English and major regional languages." },
  { q: "What can be added to the knowledge base?", a: "Documents, notices, links and plain notes — exam schedules, fee structures, hostel rules, placements, clubs, events, contacts and more." },
  { q: "How does a college get started?", a: "Register your college and we create its workspace with admin credentials. Departments publish their knowledge, and the assistant goes live the same day." },
];

const ABOUT_CARDS = [
  { icon: <IconBook />, t: "Answers with receipts", d: "Every answer shows the department and document it came from — no guessing, no fake facts." },
  { icon: <IconLayers />, t: "One place for everything", d: "Admissions, exams, clubs, events, hostels, placements — the whole college in a single chat." },
  { icon: <IconChat />, t: "No more hesitation", d: "Students ask anything, anytime, without feeling shy about approaching faculty or offices." },
];

const PROBLEMS = [
  { icon: <IconGlobe />, t: "Buried under too many sites", d: "College data lives across a dozen pages and portals — much of it outdated, half of it unreachable from a simple search." },
  { icon: <IconUsers />, t: "Clubs & events stay invisible", d: "Twelve clubs, five fests, one sports meet — and most students find out only after it's over." },
  { icon: <IconPhone />, t: "No idea who to contact", d: "A fee issue, a hostel complaint, a scholarship doubt — who handles what? Nobody knows the right door to knock." },
  { icon: <IconChat />, t: "Too shy to ask faculty", d: "Many students hesitate to walk up to an office or professor and ask something they fear is a 'silly question'." },
];

const SOLUTIONS = [
  { n: "1", icon: <IconDb />, t: "Your college builds the brain", d: "Each department adds documents, notes and links to its own knowledge-base section — updated anytime, from one simple dashboard." },
  { n: "2", icon: <IconChat />, t: "Students just ask", d: "No app, no account, no queue. One open chat handles everything from exam dates to club events." },
  { n: "3", icon: <IconDoc />, t: "Answers show their sources", d: "Every response names the department and document they came from — nothing made up." },
];

const ASK_CHIPS = ["Exam dates", "Fee structure", "Clubs & events", "Hostel rules", "Placement contacts", "Library timings", "Who to contact for…"];

const COMPARE: [string, string, string, string][] = [
  ["Setup time", "Days — managed by your own college", "Months of vendor onboarding", "No single answer anywhere"],
  ["Cost", "Built for every college", "Enterprise pricing", "Free, but nobody finds anything"],
  ["Who owns the knowledge", "Your departments, updated anytime", "Vendor-managed", "Scattered, stale, often broken"],
  ["Languages", "Multilingual, including regional", "Mostly English", "English only"],
  ["Answer sources", "Shown with every answer", "Varies by vendor", "Not applicable"],
  ["Insight loop", "Unanswered questions surface to admins", "Becomes a ticket queue", "None"],
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".rv"));
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
    <div className="page !pt-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1F0FD] via-white to-white" />
          <div className="absolute -left-24 top-0 h-96 w-72 bg-gradient-to-b from-[#FDEFD4] to-transparent opacity-70 blur-2xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="badge badge-acc mono rise !text-[11px]">
              <span className="text-[10px]">✦</span> RAG-powered · managed by your own college
            </span>
            <h1 className="h1 rise mt-5 max-w-xl" style={{ animationDelay: "70ms" }}>
              Your entire college, <span className="text-[#5046E5]">one question away.</span>
            </h1>
            <p className="muted rise mt-4 max-w-lg text-[15px] leading-relaxed" style={{ animationDelay: "140ms" }}>
              Exam schedules, clubs, events, fee details, who to contact — CollegeMate answers
              instantly from your college&apos;s official knowledge base, and shows the source
              behind every answer.
            </p>
            <div className="rise mt-6 flex flex-wrap items-center gap-4" style={{ animationDelay: "210ms" }}>
              <Link href="/demo/mits-madanapalle" className="btn-primary group">
                <IconSearch /> Ask the demo bot
              </Link>
              <Link href="/#solution" className="group text-[14px] font-semibold text-[#5046E5]">
                See how it works <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="rise mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] font-medium text-[#5F5F7D]" style={{ animationDelay: "280ms" }}>
              <span className="flex items-center gap-1.5"><span className="text-[#5046E5]"><IconShield /></span> Sourced answers</span>
              <span className="flex items-center gap-1.5"><span className="text-[#5046E5]"><IconBolt /></span> No login for students</span>
              <span className="flex items-center gap-1.5"><span className="text-[#5046E5]"><IconBook /></span> Department-owned knowledge</span>
            </div>
          </div>

          <div className="rise" style={{ animationDelay: "180ms" }}>
            <div className="card float-soft overflow-hidden !rounded-2xl !shadow-[0_24px_60px_rgba(23,23,46,0.12)]">
              <div className="flex items-center gap-2.5 border-b border-[#EFEFF7] px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5046E5] text-white"><IconCap /></span>
                <span>
                  <span className="block text-[13px] font-bold leading-tight">CollegeMate</span>
                  <span className="block text-[11px] text-[#8F8FA8]">Demo University assistant</span>
                </span>
                <span className="badge badge-green mono ml-auto !text-[10.5px]"><span className="dot dot-pulse" aria-hidden="true" />Online</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="chat-msg ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-[#5046E5] px-3.5 py-2.5 text-[13px] font-medium text-white" style={{ animationDelay: ".5s" }}>
                  When is the mid-semester exam schedule out?
                </div>
                <div className="chat-msg w-fit max-w-[95%] rounded-2xl rounded-bl-md bg-[#F1F0F7] px-3.5 py-2.5 text-[13px] leading-relaxed" style={{ animationDelay: ".9s" }}>
                  Mid-semester exams run <strong>March 2–9, 2026</strong>. The detailed timetable is published by the Examination Branch two weeks before the exam.
                  <span className="mono mt-2 flex items-center gap-1.5 text-[10.5px] text-[#8F8FA8]">
                    <IconDoc /> Academics · Academic Calendar 2026
                  </span>
                </div>
                <div className="chat-msg ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-[#5046E5] px-3.5 py-2.5 text-[13px] font-medium text-white" style={{ animationDelay: "1.3s" }}>
                  Which clubs can I join this semester?
                </div>
                <div className="chat-msg flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-[#F1F0F7] px-3.5 py-2.5 text-[13px] text-[#8F8FA8]" style={{ animationDelay: "1.7s" }}>
                  <span className="typing" aria-hidden="true"><span /><span /><span /></span> thinking…
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="section scroll-mt-28">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="rv">
            <p className="eyebrow !text-[#5046E5]">About</p>
            <h2 className="h2 mt-3">An AI assistant built for real colleges, not demos.</h2>
            <p className="muted mt-4 max-w-[65ch] text-[14px] leading-relaxed">
              CollegeMate is a RAG-based assistant: each college&apos;s departments keep their
              own official knowledge base — documents, notices and links — and the AI answers
              only from that. Nothing invented, nothing borrowed from the internet. When a
              department updates the knowledge, the answers update with it.
            </p>
            <p className="muted mt-3 max-w-[65ch] text-[14px] leading-relaxed">
              It speaks the languages Indian students actually use — English included.
            </p>
          </div>
          <div className="space-y-3">
            {ABOUT_CARDS.map((c, i) => (
              <div key={c.t} className="card card-hover rv flex gap-3.5 p-4" data-d={i} style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-[#EEEDFD] text-[#5046E5]">{c.icon}</span>
                <span>
                  <span className="block text-[14.5px] font-bold">{c.t}</span>
                  <span className="muted mt-0.5 block text-[13px] leading-relaxed">{c.d}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section id="problem" className="scroll-mt-20 bg-[#4F46E5]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="eyebrow rv !text-[#C7C5F5]">The problem</p>
          <h2 className="h2 rv mt-3 max-w-2xl !text-white">Students can&apos;t find the information their own college already has.</h2>
          <p className="rv mt-3 max-w-2xl text-[14px] leading-relaxed text-[#D8D7F2]">
            Survey after survey confirms it: finding information is among students&apos; top
            frustrations with college websites — info is scattered, incomplete, and hard to navigate.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p, i) => (
              <div key={p.t} className="prob-card rv rounded-xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm" data-d={i} style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white">{p.icon}</span>
                <div className="mt-4 text-[14.5px] font-bold text-white">{p.t}</div>
                <div className="mt-1.5 text-[12.5px] leading-relaxed text-[#D8D7F2]">{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section id="solution" className="section scroll-mt-28 text-center">
        <p className="eyebrow rv !text-[#5046E5]">The solution</p>
        <h2 className="h2 rv mx-auto mt-3 max-w-2xl">RAG: your college&apos;s knowledge, answered conversationally.</h2>
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          {SOLUTIONS.map((s, i) => (
            <div key={s.n} className="card card-hover rv group relative overflow-hidden p-5 pt-6" data-d={i} style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="pointer-events-none absolute -top-3 right-3 font-display text-[88px] font-extrabold leading-none text-[#5046E5]/[0.07] transition-colors group-hover:text-[#5046E5]/[0.13]" aria-hidden="true">{s.n}</span>
              <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEEDFD] text-[#5046E5] transition-transform group-hover:scale-110">{s.icon}</span>
              <div className="relative mt-4 text-[14.5px] font-bold">{s.t}</div>
              <div className="muted relative mt-1.5 text-[13px] leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="rv mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[12.5px] font-medium text-[#5F5F7D]">What students ask:</span>
          {ASK_CHIPS.map((c) => (
            <Link key={c} href="/demo/mits-madanapalle" className="chip badge mono !text-[11.5px]">{c}</Link>
          ))}
        </div>
      </section>

      {/* ================= COMPARE ================= */}
      <section id="compare" className="scroll-mt-20 bg-[#F7F7FC]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-20">
          <p className="eyebrow rv !text-[#5046E5]">Compare</p>
          <h2 className="h2 rv mx-auto mt-3 max-w-xl">Why not just buy a university chatbot?</h2>
          <p className="muted rv mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed">
            Existing players like Ivy.ai, Ocelot and AdmitHub serve big universities well — but
            they&apos;re priced and paced for enterprise. Most colleges never get there.
          </p>
          <div className="card rv mx-auto mt-8 max-w-4xl overflow-x-auto !rounded-2xl p-2 text-left">
            <table className="cmp min-w-[640px]">
              <thead><tr><th></th><th className="!text-[#5046E5]">CollegeMate</th><th>University chatbots</th><th>College website</th></tr></thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r[0]} className="cmp-row">
                    <td>{r[0]}</td>
                    <td className="hlcol !bg-[#EEEDFD]/60">{r[1]}</td>
                    <td className="muted">{r[2]}</td>
                    <td className="muted">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="section scroll-mt-28">
        <h2 className="h2 rv text-center">Questions, answered.</h2>
        <div className="rv mx-auto mt-8 max-w-2xl">
          {FAQS.map((f, i) => (
            <div key={f.q} className="border-b border-[#E6E5F1]">
              <button className="faq-q group !px-1" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="transition-colors group-hover:text-[#5046E5]">{f.q}</span>
                <span className={`muted transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} aria-hidden="true">⌄</span>
              </button>
              <div className={`acc-body ${openFaq === i ? "acc-open" : ""}`}>
                <div className="overflow-hidden"><div className="faq-a !px-1">{f.a}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
