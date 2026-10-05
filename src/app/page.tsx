"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COVERAGE = ["EXAMS", "FEES", "HOSTEL", "PLACEMENTS", "CLUBS", "CONTACTS"];

const AUDIENCES = [
  { t: "Students", d: "Ask anything in plain language and get sourced answers — no queues, no office visits, no shyness.", href: "/chat", tint: "tint-lav", btn: "bg-[#6C63F6] text-white", tag: "ask" },
  { t: "Faculty & Departments", d: "Publish and maintain your department's knowledge from one dashboard. Updates go live instantly.", href: "/faculty", tint: "tint-cream", btn: "bg-[#F7B500] text-[#16130C]", tag: "manage" },
  { t: "Administrators", d: "One controlled knowledge layer per college, with visibility into gaps and unanswered questions.", href: "/college", tint: "tint-pink", btn: "bg-[#F0619C] text-white", tag: "control" },
];

const CAPABILITIES = [
  { t: "Cited answers", d: "Every response names its document and department.", bg: "bg-[#6C63F6]", tint: "tint-lav", icon: <path d="M6 2h8l4 4v16H6V2Z" /> },
  { t: "Open chat", d: "No app, no account, no queue for students.", bg: "bg-[#6C63F6]", tint: "tint-lav", icon: <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" /> },
  { t: "Department scopes", d: "Each department owns and updates its section.", bg: "bg-[#F0619C]", tint: "tint-pink", icon: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" /></> },
  { t: "Gap insights", d: "Unanswered questions surface straight to admins.", bg: "bg-[#F0619C]", tint: "tint-pink", icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /> },
  { t: "College workspaces", d: "Isolated knowledge per institution, always.", bg: "bg-[#F7B500]", tint: "tint-cream", icon: <path d="M12 3 3 8l9 5 9-5-9-5Z" /> },
  { t: "Always available", d: "Answers on the website, 24/7, in your languages.", bg: "bg-[#F7B500]", tint: "tint-cream", icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /></> },
];

const QA_SETS: { q: string; a: string; cite: string; tint: string }[][] = [
  [
    { q: "What is the minimum attendance requirement?", a: "75% in each subject, with condonation down to 65% on medical grounds.", cite: "regulations.pdf · p.24", tint: "tint-cream" },
    { q: "Who do I contact for a hostel issue?", a: "The warden's office, Hostel Block A — ext. 214, working days 9am–5pm.", cite: "hostel-handbook.pdf · p.6", tint: "tint-lav" },
    { q: "How do I apply for a bonafide certificate?", a: "Apply on the student portal; certificates are issued within 2 working days.", cite: "admin-guide.pdf · p.7", tint: "tint-pink" },
  ],
  [
    { q: "What is the placement eligibility criteria?", a: "7.0 CGPA with no active backlogs for most visiting recruiters.", cite: "placements.xlsx · p.1", tint: "tint-lav" },
    { q: "What are the library timings?", a: "Open 9am–8pm on all working days, with extended hours during examinations.", cite: "library-notice.pdf · p.1", tint: "tint-pink" },
    { q: "Which clubs can I join this semester?", a: "12 active clubs including Cyber Security, Robotics, Photography and NSS.", cite: "clubs.pdf · p.2", tint: "tint-cream" },
  ],
];

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [news, setNews] = useState("");
  const [stats, setStats] = useState({ colleges: "…", depts: "…", docs: "…" });
  const [qi, setQi] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".rv"));
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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

  function goRegister(e?: string) {
    const v = (e ?? email).trim();
    router.push(v ? `/register?email=${encodeURIComponent(v)}` : "/register");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "NxtGenSec", url: "https://collegemate.app" },
      { "@type": "SoftwareApplication", name: "CollegeMate", applicationCategory: "EducationalApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } },
      { "@type": "WebSite", name: "CollegeMate", url: "https://collegemate.app" },
    ],
  };

  return (
    <div className="page !pt-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <h1 className="h1 rise max-w-xl">
              College answers, one question away.
            </h1>
            <p className="muted rise mt-4 max-w-md text-[14.5px] leading-relaxed" style={{ animationDelay: "100ms" }}>
              Your college&apos;s official knowledge — exams, fees, hostel, placements, clubs —
              answered instantly in one open chat, with the source behind every answer.
            </p>
            <form
              className="rise mt-6 flex max-w-md gap-2"
              style={{ animationDelay: "180ms" }}
              onSubmit={(e) => { e.preventDefault(); goRegister(); }}
            >
              <input
                className="input !rounded-full !bg-white"
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Type your college email" aria-label="College email"
              />
              <button type="submit" className="btn-primary flex-none">Get started</button>
            </form>
            <div className="rise mt-7 flex gap-8" style={{ animationDelay: "260ms" }}>
              {[[stats.colleges, "Colleges live"], [stats.depts, "Departments"], [stats.docs, "Documents indexed"]].map(([v, c]) => (
                <div key={c}>
                  <div className="font-display text-[22px] font-black tracking-tight">{v === "…" ? "…" : v}</div>
                  <div className="muted text-[11.5px]">{c}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rise relative" style={{ animationDelay: "160ms" }}>
            <span className="absolute -top-6 right-10 select-none text-[28px]" aria-hidden="true">✦</span>
            <span className="absolute right-4 top-16 select-none text-[14px] text-[#9A8F7C]" aria-hidden="true">✦</span>
            <div className="arch mx-auto max-w-sm p-6 pt-10">
              <div className="card-elevated float-soft overflow-hidden !rounded-2xl">
                <div className="mockbar">
                  <span className="mockdot" /><span className="mockdot" /><span className="mockdot" />
                  <span className="mono ml-2 text-[11px] font-bold">CollegeMate</span>
                  <span className="badge badge-green mono ml-auto !text-[10px]"><span className="dot dot-pulse" aria-hidden="true" />Online</span>
                </div>
                <div className="space-y-3 p-4">
                  <div className="chat-msg ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-[#16130C] px-3.5 py-2.5 text-[13px] font-bold text-white" style={{ animationDelay: ".4s" }}>
                    When are the mid-semester exams?
                  </div>
                  <div className="chat-msg w-fit max-w-[95%] rounded-2xl rounded-bl-md bg-[#F4F0E4] px-3.5 py-2.5 text-[13px] leading-relaxed" style={{ animationDelay: ".8s" }}>
                    Mid-semester exams run <strong>March 2–9, 2026</strong>, per the academic calendar.
                    <span className="mono mt-2 block text-[10.5px] text-[#6E6455]">Academics · Calendar 2026</span>
                  </div>
                  <div className="chat-msg flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-[#F4F0E4] px-3.5 py-2.5 text-[13px] text-[#9A8F7C]" style={{ animationDelay: "1.2s" }}>
                    <span className="typing" aria-hidden="true"><span /><span /><span /></span> thinking…
                  </div>
                  <Link href="/demo/mits-madanapalle" className="btn-primary btn-sm w-full">Ask the demo bot</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORDMARK STRIP ================= */}
      <section aria-label="Coverage" className="border-y border-[#EFE6D4] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5">
          {COVERAGE.map((c) => (
            <span key={c} className="font-display text-[15px] font-extrabold tracking-wide text-[#B4A88F]">{c}</span>
          ))}
        </div>
      </section>

      {/* ================= AUDIENCES ================= */}
      <section id="why" className="section scroll-mt-20">
        <h2 className="h2 rv mx-auto max-w-xl text-center">Made for everyone on campus</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {AUDIENCES.map((a, i) => (
            <div key={a.t} className={`card rv border p-5 ${a.tint}`} data-d={i} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="text-[15px] font-extrabold">{a.t}</div>
              <div className="muted mt-1.5 min-h-16 text-[13px] leading-relaxed">{a.d}</div>
              <Link href={a.href} className={`btn-tint mt-4 ${a.btn}`}>Open {a.tag} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ENGAGE ================= */}
      <section className="section">
        <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rv relative mx-auto w-full max-w-xs">
            <div className="arch p-6 pt-10">
              <div className="card-elevated !rounded-2xl p-4">
                <p className="mono text-[10px] tracking-[.14em] text-[#6E6455]">GROUNDED ANSWER</p>
                <p className="mt-2 text-[14px] font-bold leading-snug">75% attendance needed in each subject.</p>
                <div className="mt-3 space-y-1.5">
                  <div className="badge badge-green mono !text-[10px]">✓ cited</div>
                  <div className="badge mono !text-[10px]">regulations.pdf · p.24</div>
                </div>
                <div className="mono mt-3 border-t border-[#EFE6D4] pt-2 text-[10.5px] text-[#9A8F7C]">hostel · exams · fees · clubs</div>
              </div>
            </div>
          </div>
          <div className="rv">
            <h2 className="h2 max-w-md">Ask anything. Get sourced answers.</h2>
            <p className="muted mt-3 max-w-md text-[14px] leading-relaxed">
              Students type naturally and get answers pulled from official college knowledge —
              with the document behind every response. No app, no account, no queue.
            </p>
            <Link href="/demo/mits-madanapalle" className="btn-primary mt-5">Try the live demo</Link>
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section className="section">
        <h2 className="h2 rv mx-auto max-w-xl text-center">Everything a campus needs</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <div key={c.t} className={`card rv card-hover flex gap-3.5 border p-4 ${c.tint}`} data-d={i} style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
              <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white ${c.bg}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">{c.icon}</svg>
              </span>
              <span>
                <span className="block text-[14px] font-extrabold">{c.t}</span>
                <span className="muted mt-0.5 block text-[12.5px] leading-relaxed">{c.d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ASK CAROUSEL ================= */}
      <section id="faq" className="section scroll-mt-20">
        <h2 className="h2 rv mx-auto max-w-md text-center">Real questions, sourced answers</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3" key={qi}>
          {QA_SETS[qi].map((c, i) => (
            <div key={c.q} className={`card rv-in border p-5 ${c.tint}`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="font-display text-2xl font-black text-[#16130C]/15" aria-hidden="true">“</div>
              <div className="-mt-2 text-[14.5px] font-extrabold leading-snug">{c.q}</div>
              <div className="muted mt-2 text-[13px] leading-relaxed">{c.a}</div>
              <div className="mono mt-3 text-[10.5px] text-[#6E6455]">[{c.cite}]</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <button onClick={() => setQi((qi + QA_SETS.length - 1) % QA_SETS.length)} aria-label="Previous questions" className="btn-ghost btn-sm !px-3">←</button>
          <span className="mono muted text-[11px]">{qi + 1} / {QA_SETS.length}</span>
          <button onClick={() => setQi((qi + 1) % QA_SETS.length)} aria-label="Next questions" className="btn-primary btn-sm !px-3">→</button>
        </div>
      </section>

      {/* ================= REGISTER CTA ================= */}
      <section className="section text-center">
        <h2 className="h2 rv mx-auto max-w-xl">BRING COLLEGEMATE TO YOUR CAMPUS.</h2>
        <form
          className="rv mx-auto mt-6 grid max-w-md gap-2"
          onSubmit={(e) => { e.preventDefault(); goRegister(news); }}
        >
          <input
            className="input !rounded-full !bg-white"
            type="email" required value={news} onChange={(e) => setNews(e.target.value)}
            placeholder="College email address" aria-label="College email address"
          />
          <button type="submit" className="btn-primary w-full">Register your college</button>
        </form>
        <p className="mono muted mt-3 text-[11.5px]">Free demo · No installation · Web · Mobile · API</p>
      </section>
    </div>
  );
}
