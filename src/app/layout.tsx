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
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2E4BFF] text-[13px] font-extrabold text-white" aria-hidden="true">C</span>
          <span className="font-display text-[15px] font-bold tracking-tight">CollegeMate</span>
        </Link>
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          <Link href="/#product" className="navlink">Product</Link>
          <Link href="/#why" className="navlink">Why CollegeMate</Link>
          <Link href="/#compare" className="navlink">Compare</Link>
          <Link href="/#faq" className="navlink">FAQs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth" className="navlink hidden sm:inline">Login</Link>
          <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm hidden sm:inline-flex">Live Demo</Link>
          <Link href="/register" className="btn-primary btn-sm">Register College</Link>
          <details className="relative lg:hidden">
            <summary className="btn-ghost btn-sm cursor-pointer list-none" aria-label="Open menu">☰</summary>
            <div className="card card-pad absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 p-2">
              <Link href="/#product" className="navlink">Product</Link>
              <Link href="/#why" className="navlink">Why CollegeMate</Link>
              <Link href="/#compare" className="navlink">Compare</Link>
              <Link href="/#faq" className="navlink">FAQs</Link>
              <Link href="/demo/mits-madanapalle" className="navlink">Live Demo</Link>
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
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main-content" className="mx-auto max-w-7xl px-6">{children}</main>
        <footer className="mx-auto max-w-7xl px-6 pb-8 pt-4">
          <div className="border-t border-[#E4DFD3] pt-8">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2E4BFF] text-[13px] font-extrabold text-white">C</span>
                  <span className="font-display text-[15px] font-bold">CollegeMate</span>
                </div>
                <p className="muted mt-3 max-w-xs text-[13px] leading-relaxed">
                  AI-powered institutional knowledge for colleges.
                </p>
              </div>
              <div>
                <div className="eyebrow">Platform</div>
                <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                  <Link href="/#why" className="muted hover:text-[#0E1B2E]">Why CollegeMate</Link>
                  <Link href="/#how" className="muted hover:text-[#0E1B2E]">How it works</Link>
                  <Link href="/#compare" className="muted hover:text-[#0E1B2E]">Compare</Link>
                  <Link href="/#faq" className="muted hover:text-[#0E1B2E]">FAQs</Link>
                  <Link href="/demo/mits-madanapalle" className="muted hover:text-[#0E1B2E]">Live demo</Link>
                </div>
              </div>
              <div>
                <div className="eyebrow">For Institutions</div>
                <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                  <Link href="/register" className="muted hover:text-[#0E1B2E]">Register your college</Link>
                  <Link href="/college" className="muted hover:text-[#0E1B2E]">College Admin</Link>
                  <Link href="/faculty" className="muted hover:text-[#0E1B2E]">Faculty</Link>
                  <Link href="/chat" className="muted hover:text-[#0E1B2E]">Students</Link>
                </div>
              </div>
            </div>
            <div className="muted mt-10 flex flex-col gap-1 border-t border-[#E4DFD3] pt-5 text-[12px] sm:flex-row sm:justify-between">
              <span>Developed by NxtGenSec</span>
              <span>© 2026 CollegeMate</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
