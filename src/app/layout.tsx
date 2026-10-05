import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const SITE = "https://collegemate.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "CollegeMate — AI-Powered College Knowledge Assistant",
  description:
    "CollegeMate helps colleges organize verified academic, administrative, department, placement and student-support information into a cited AI knowledge platform.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    title: "CollegeMate — AI-Powered College Knowledge Assistant",
    description:
      "Turn your college's scattered information into one trusted, searchable, citation-backed knowledge platform.",
    siteName: "CollegeMate",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "CollegeMate — AI-Powered College Knowledge Assistant",
    description:
      "One trusted place for academic, administrative, departmental and support information.",
  },
  robots: { index: true, follow: true },
};

function Nav() {
  return (
    <div className="sticky top-0 z-50 mx-auto max-w-7xl px-6 pt-5">
      <header className="flex items-center justify-between gap-3 rounded-xl border border-[#E4DFD3] bg-white/90 py-2.5 pl-4 pr-2.5 shadow-[0_8px_24px_rgba(16,27,46,0.06)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2" aria-label="CollegeMate home">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5046E5] text-[13px] font-extrabold text-white" aria-hidden="true">C</span>
          <span className="font-display text-[15px] font-bold tracking-tight">CollegeMate</span>
        </Link>
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          <Link href="/#about" className="navlink">About</Link>
          <Link href="/#problem" className="navlink">Problem</Link>
          <Link href="/#solution" className="navlink">Solution</Link>
          <Link href="/#compare" className="navlink">Compare</Link>
          <Link href="/#faq" className="navlink">FAQs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth" className="navlink hidden sm:inline">Admin login</Link>
          <Link href="/demo/mits-madanapalle" className="btn-primary btn-sm">Try the demo</Link>
          <details className="relative lg:hidden">
            <summary className="btn-ghost btn-sm cursor-pointer list-none" aria-label="Open menu">☰</summary>
            <div className="card card-pad absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 p-2">
              <Link href="/#about" className="navlink">About</Link>
              <Link href="/#problem" className="navlink">Problem</Link>
              <Link href="/#solution" className="navlink">Solution</Link>
              <Link href="/#compare" className="navlink">Compare</Link>
              <Link href="/#faq" className="navlink">FAQs</Link>
              <Link href="/demo/mits-madanapalle" className="navlink">Try the demo</Link>
            </div>
          </details>
        </div>
      </header>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main-content" className="mx-auto max-w-7xl px-6">{children}</main>
        <footer className="mx-auto max-w-7xl px-6 pb-8 pt-4">
          <div className="border-t border-[#E6E5F1] bg-[#F7F7FC] pt-8">
            <div className="grid gap-8 px-2 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5046E5] text-[13px] font-extrabold text-white">C</span>
                  <span className="font-display text-[15px] font-bold">CollegeMate</span>
                </div>
                <p className="muted mt-3 max-w-xs text-[13px] leading-relaxed">
                  The RAG-powered assistant that turns your college&apos;s scattered knowledge into one friendly chat.
                </p>
              </div>
              <div>
                <div className="eyebrow">Explore</div>
                <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                  <Link href="/#about" className="muted transition-colors hover:text-[#5046E5]">About</Link>
                  <Link href="/#problem" className="muted transition-colors hover:text-[#5046E5]">Problem</Link>
                  <Link href="/#solution" className="muted transition-colors hover:text-[#5046E5]">Solution</Link>
                  <Link href="/#compare" className="muted transition-colors hover:text-[#5046E5]">Compare</Link>
                  <Link href="/#faq" className="muted transition-colors hover:text-[#5046E5]">FAQs</Link>
                </div>
              </div>
              <div>
                <div className="eyebrow">For colleges</div>
                <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                  <Link href="/college" className="muted transition-colors hover:text-[#5046E5]">College admin login</Link>
                  <Link href="/dashboard" className="muted transition-colors hover:text-[#5046E5]">Super admin</Link>
                </div>
              </div>
            </div>
            <div className="muted mt-10 border-t border-[#E6E5F1] px-2 pt-5 text-center text-[12px]">
              <span>© 2026 CollegeMate · RAG-powered by Sarvam</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
