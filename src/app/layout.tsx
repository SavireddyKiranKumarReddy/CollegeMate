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
    <div className="sticky top-0 z-50 mx-auto max-w-6xl px-6 pt-5">
      <header className="flex items-center justify-between gap-3 rounded-full border border-[#232329] bg-[#101013]/90 py-2.5 pl-4 pr-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2" aria-label="CollegeMate home">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[13px] font-bold text-black" aria-hidden="true">C</span>
          <span className="font-display text-[15px] font-bold tracking-tight">CollegeMate</span>
        </Link>
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          <Link href="/" className="navlink">Home</Link>
          <Link href="/#about" className="navlink">About</Link>
          <Link href="/#problems" className="navlink">Problems</Link>
          <Link href="/#solution" className="navlink">Solution</Link>
          <Link href="/#compare" className="navlink">Compare</Link>
          <Link href="/#faq" className="navlink">FAQs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth" className="navlink hidden sm:inline">Login</Link>
          <Link href="/demo/mits-madanapalle" className="navlink hidden xl:inline">Live demo</Link>
          <Link href="/register" className="btn-primary btn-sm">Register your college</Link>
          <details className="relative lg:hidden">
            <summary className="btn-ghost btn-sm cursor-pointer list-none">Menu</summary>
            <div className="card card-pad absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 p-2">
              <Link href="/" className="navlink">Home</Link>
              <Link href="/#about" className="navlink">About</Link>
              <Link href="/#problems" className="navlink">Problems</Link>
              <Link href="/#solution" className="navlink">Solution</Link>
              <Link href="/#compare" className="navlink">Compare</Link>
              <Link href="/#faq" className="navlink">FAQs</Link>
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
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main-content" className="mx-auto max-w-6xl px-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-6 pb-8 pt-4">
          <div className="border-t border-[#1c1c21] pt-8">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[13px] font-bold text-black">C</span>
                  <span className="font-display text-[15px] font-bold">CollegeMate</span>
                </div>
                <p className="muted mt-3 max-w-xs text-[13px] leading-relaxed">
                  AI-powered, RAG-based institutional knowledge platform. One trusted place for college information.
                </p>
              </div>
              <div>
                <div className="eyebrow">Platform</div>
                <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                  <Link href="/#about" className="muted hover:text-white">About</Link>
                  <Link href="/#problems" className="muted hover:text-white">Problems</Link>
                  <Link href="/#solution" className="muted hover:text-white">Solution</Link>
                  <Link href="/#compare" className="muted hover:text-white">Compare</Link>
                  <Link href="/#faq" className="muted hover:text-white">FAQs</Link>
                  <Link href="/demo/mits-madanapalle" className="muted hover:text-white">Live demo</Link>
                  <Link href="/register" className="muted hover:text-white">Register</Link>
                </div>
              </div>
              <div>
                <div className="eyebrow">Roles</div>
                <div className="mt-3 flex flex-col gap-2 text-[13.5px]">
                  <Link href="/dashboard" className="muted hover:text-white">Super admin</Link>
                  <Link href="/college" className="muted hover:text-white">College admin</Link>
                  <Link href="/faculty" className="muted hover:text-white">Faculty upload</Link>
                  <Link href="/chat" className="muted hover:text-white">Student chat</Link>
                </div>
              </div>
              <div className="card card-pad">
                <div className="text-[13.5px] font-semibold">Make your college&apos;s knowledge accessible</div>
                <p className="muted mt-1.5 text-[12.5px]">Academic, administrative, departmental and support info — cited.</p>
                <div className="mt-3 flex gap-2">
                  <Link href="/register" className="btn-primary btn-sm flex-1">Register</Link>
                  <Link href="/demo/mits-madanapalle" className="btn-ghost btn-sm flex-1">Live demo</Link>
                </div>
              </div>
            </div>
            <div className="font-display mt-10 text-center font-bold leading-none tracking-tight text-[#1d1d21] select-none" style={{ fontSize: "clamp(60px, 14vw, 170px)" }}>
              CollegeMate
            </div>
            <div className="muted mt-4 flex flex-col gap-1 border-t border-[#1c1c21] pt-5 text-[12px] sm:flex-row sm:justify-between">
              <span>© CollegeMate 2026 · Developed by NxtGenSec</span>
              <span className="mono">RAG · cited · workspace-scoped</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
