"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PROBLEMS = [
  { n: "01", t: "Scattered information", d: "Fees in PDFs, rules in notices, contacts in spreadsheets. Nobody knows the current truth." },
  { n: "02", t: "Buried notices", d: "Important circulars drown in WhatsApp groups, emails and PDFs — students miss what matters." },
  { n: "03", t: "Rules nobody understands", d: "Complicated PDFs and legalese need converting into simple, direct answers." },
  { n: "04", t: "Exam and fee confusion", d: "Exam dates, syllabi, hall tickets, pending fees, fines and payment deadlines — all unclear." },
  { n: "05", t: "Hidden campus life", d: "Labs, library, gym, medical, counselling, sports — plus every club, its purpose and how to join." },
  { n: "06", t: "Missed events and opportunities", d: "Fests, workshops, seminars, internships, placements, hackathons and scholarships pass by unnoticed." },
  { n: "07", t: "Generic AI guesses", d: "Public chatbots answer confidently from the open internet — not your college's actual rules." },
  { n: "08", t: "No source, no trust", d: "Without the original document behind an answer, even a correct answer is hard to trust." },
];

const SOLUTIONS = [
  { n: "01", t: "One knowledge base", d: "Approved academic, administrative, departmental and support information in one searchable system." },
  { n: "02", t: "Answers with sources", d: "Every response names the document and department it came from — nothing made up." },
  { n: "03", t: "Departments stay in control", d: "Each department publishes its own knowledge and updates it anytime from one dashboard." },
  { n: "04", t: "Honest fallbacks", d: "When knowledge runs out, students get a verified contact — never a guess." },
];

const COMPARE: [string, string, string][] = [
  ["College-specific knowledge", "✓", "—"],
  ["Your institutional documents", "✓", "—"],
  ["Source citations", "✓", "Limited"],
  ["Department knowledge", "✓", "—"],
  ["No login for students", "✓", "✓"],
  ["Controlled knowledge scope", "✓", "—"],
];

const QA_SETS: { q: string; a: string; cite: string; tint: string }[][] = [
  [
    { q: "What is the minimum attendance requirement?", a: "75% in each subject, with condonation down to 65% on medical grounds.", cite: "regulations.pdf · p.24", tint: "tint-cream" },
    { q: "Who do I contact for a hostel issue?", a: "The warden's office, Hostel Block A — ext. 214, working days 9am–5pm.", cite: "hostel-handbook.pdf · p.6", tint: "tint-lav" },
    { q: "How do I apply for a bonafide certificate?", a: "Apply on the student portal; certificates are issued within 2 working days.", cite: "admin-guide.pdf · p.7", tint: "tint-pink" },
  ],
  [
    { q: "What is the placement eligibility criteria?", a: "7.0 CGPA with no active backlogs for most visiting recruiters.", cite: "placements.xlsx · p.1", tint: "tint-lav" },
    { q: "What are the library timings?", a: "Open 9am–8pm on all working days, extended hours during examinations.", cite: "library-notice.pdf · p.1", tint: "tint-pink" },
    { q: "Which clubs can I join this semester?", a: "12 active clubs including Cyber Security, Robotics, Photography and NSS.", cite: "clubs.pdf · p.2", tint: "tint-cream" },
  ],
];

export default function Home() {
  const router = useRouter();
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

  function goRegister(v: string) {
    const t = v.trim();
    router.push(t ? `/register?email=${encodeURIComponent(t)}` : "/register");
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

      {/* ================= HOME ================= */}
      <section id="home" className="relative overflow-hidden scroll-mt-20">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <h1 className="h1 rise max-w-xl">Any question about your college. One trusted answer.</h1>
            <p className="muted rise mt-4 max-w-md text-[14.5px] leading-relaxed" style={{ animationDelay: "100ms" }}>
              Ask about exams, fees, attendance, hostel, placements, admissions, clubs, or
              anything else you need to know. CollegeMate finds the answer from your
              college&apos;s verified information and shows you the source behind it.
            </p>
            <div
              className="rise mt-6 flex max-w-md flex-wrap gap-3"
              style={{ animationDelay: "180ms" }}
            >
              <Link href="/register" className="btn-primary">Register now</Link>
              <Link href="/#about" className="btn-ghost">Know more</Link>
            </div>
            <div className="rise mt-7 flex gap-8" style={{ animationDelay: "260ms" }}>
              {[[stats.colleges, "Colleges live"], [stats.depts, "Departments"], [stats.docs, "Documents indexed"]].map(([v, c]) => (
                <div key={c}>
                  <div className="font-display text-[22px] font-black tracking-tight">{v}</div>
                  <div className="muted text-[11.5px]">{c}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rise relative" style={{ animationDelay: "160ms" }}>
            <span className="absolute -top-6 right-10 select-none text-[28px]" aria-hidden="true">✦</span>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="section scroll-mt-20">
        <p className="rv text-center text-[12px] font-bold tracking-[.2em] text-[#B4A88F]"><span className="underline underline-offset-4">About</span></p>
        <div className="rv mx-auto mt-3 max-w-3xl text-center">
          <h2 className="h2 lg:!text-[48px]">One trusted place for everything your college knows.</h2>
          <p className="muted mx-auto mt-4 max-w-[65ch] text-[16px] leading-relaxed">
            CollegeMate brings your college&apos;s scattered documents, notices, policies, and
            departmental information into one intelligent knowledge platform. Students and
            faculty can ask questions in plain language and get clear, college-specific
            answers with the source behind every response.
          </p>
        </div>
        <h3 className="h3 rv mt-8 text-center !text-[22px]">Built for the way colleges work</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Fast to get started", "Connect your approved college information and start building your knowledge base without complex setup."],
            ["Simple for students", "Students can ask questions naturally without searching through PDFs, websites, notices, or multiple departments."],
            ["Owned by your departments", "Departments can manage and update their own information while administrators maintain institutional control."],
            ["Grounded in your knowledge", "CollegeMate answers from your approved institutional information instead of relying on generic internet results."],
          ].map(([t, d]) => (
            <div key={t} className="card rv border p-5 transition-colors hover:bg-[#FAF6EA]">
              <div className="text-[16px] font-extrabold">{t}</div>
              <div className="muted mt-1 text-[14px] leading-relaxed">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROBLEM ================= */}
      <section id="problem" className="section scroll-mt-20">
        <p className="rv text-center text-[12px] font-bold tracking-[.2em] text-[#B4A88F]"><span className="underline underline-offset-4">Problem</span></p>
        <h2 className="h2 rv mx-auto mt-3 max-w-2xl text-center">Finding answers shouldn&apos;t be the hard part.</h2>
        <div className="mx-auto mt-8 grid max-w-5xl gap-x-10 sm:grid-cols-2">
          {[PROBLEMS.slice(0, 4), PROBLEMS.slice(4)].map((col, ci) => (
            <div key={ci} className="divide-y divide-[#EFE6D4] border-y border-[#EFE6D4]">
              {col.map((p) => (
                <div key={p.n} className="rv grid gap-1.5 py-5 sm:grid-cols-[48px_1fr] sm:gap-4">
                  <span className="mono text-[13px] font-bold text-[#16130C]">{p.n}</span>
                  <span>
                    <span className="text-[15.5px] font-extrabold tracking-tight">{p.t}</span>
                    <span className="muted mt-1 block max-w-[65ch] text-[13.5px] leading-relaxed">{p.d}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section id="solution" className="section scroll-mt-20">
        <p className="rv text-center text-[12px] font-bold tracking-[.2em] text-[#B4A88F]"><span className="underline underline-offset-4">Solution</span></p>
        <h2 className="h2 rv mx-auto mt-3 max-w-2xl text-center">One knowledge layer for the entire college.</h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
          {SOLUTIONS.map((s, i) => (
            <div key={s.n} className="card rv card-hover border p-5" data-d={i} style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
              <span className="mono text-[12px] font-bold text-[#9A8F7C]">{s.n}</span>
              <div className="mt-2 text-[15px] font-extrabold">{s.t}</div>
              <div className="muted mt-1 text-[13px] leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMPARE ================= */}
      <section id="compare" className="section scroll-mt-20">
        <p className="rv text-center text-[12px] font-bold tracking-[.2em] text-[#B4A88F]"><span className="underline underline-offset-4">Compare</span></p>
        <h2 className="h2 rv mx-auto mt-3 max-w-xl text-center">Why not a generic chatbot?</h2>
        <p className="muted rv mx-auto mt-3 max-w-lg text-center text-[13.5px] leading-relaxed">
          Generic AI knows the world. CollegeMate knows your institution.
        </p>
        <div className="card rv mx-auto mt-8 max-w-3xl overflow-hidden !rounded-2xl text-left shadow-[0_8px_30px_rgba(22,19,12,0.06)]">
          <div className="overflow-x-auto">
            <table className="cmp min-w-[560px] border-collapse">
              <colgroup>
                <col style={{ width: "40%" }} />
                <col className="bg-[#FFF6DF]" style={{ width: "30%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="!border-t-0"></th>
                  <th className="!border-t-0 !text-[13px] !font-extrabold !normal-case !tracking-normal">CollegeMate</th>
                  <th className="!border-t-0 !text-[13px] !font-extrabold !normal-case !tracking-normal">Generic AI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r[0]} className="cmp-row">
                    <td className="!text-[13px] font-semibold">{r[0]}</td>
                    <td className="hlcol !text-[13px]">{r[1]}</td>
                    <td className="muted !text-[13px]">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= FAQS ================= */}
      <section id="faq" className="section scroll-mt-20">
        <p className="rv text-center text-[12px] font-bold tracking-[.2em] text-[#B4A88F]"><span className="underline underline-offset-4">FAQs</span></p>
        <h2 className="h2 rv mx-auto mt-3 max-w-md text-center">Real questions, sourced answers</h2>
        <p className="muted rv mx-auto mt-3 max-w-md text-center text-[13.5px]">The kind of things students actually ask.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3" key={qi}>
          {QA_SETS[qi].map((c) => (
            <div key={c.q} className={`card rv-in border p-5 ${c.tint}`}>
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

      {/* ================= CTA ================= */}
      <section id="cta" className="section scroll-mt-20 text-center">
        <h2 className="h2 rv mx-auto max-w-xl">BRING COLLEGEMATE TO YOUR CAMPUS.</h2>
        <p className="muted rv mx-auto mt-3 max-w-md text-[14px]">Register in under a minute. Your workspace goes live the same day.</p>
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
