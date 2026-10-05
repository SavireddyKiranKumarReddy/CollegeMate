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
    <div className="mx-auto max-w-7xl px-6">
      <header className="flex items-center justify-between gap-3 border-b border-[#EFE6D4] py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="CollegeMate home">
          <span className="font-display text-[17px] font-black tracking-tight">CollegeMate</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <Link href="/" className="navlink navlink-active">Home</Link>
          <Link href="/#why" className="navlink">Why us</Link>
          <Link href="/demo/mits-madanapalle" className="navlink">Demo</Link>
          <Link href="/#faq" className="navlink">FAQs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/register" className="btn-primary btn-sm">Sign up</Link>
          <details className="relative lg:hidden">
            <summary className="btn-ghost btn-sm cursor-pointer list-none" aria-label="Open menu">☰</summary>
            <div className="card card-pad absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 p-2">
              <Link href="/" className="navlink">Home</Link>
              <Link href="/#why" className="navlink">Why us</Link>
              <Link href="/demo/mits-madanapalle" className="navlink">Demo</Link>
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
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main-content" className="mx-auto max-w-7xl px-6">{children}</main>
        <footer className="mx-auto max-w-7xl px-6 pb-8 pt-4">
          <div className="border-t border-[#E6E5F1] pt-8">
            <div className="grid gap-8 px-2 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <span className="font-display text-[17px] font-black tracking-tight">CollegeMate</span>
                <div className="mt-3 flex gap-2">
                  {[
                    { href: "/chat", label: "Student chat", icon: <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" /> },
                    { href: "/demo/mits-madanapalle", label: "Live demo", icon: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></> },
                    { href: "/register", label: "Register", icon: <><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></> },
                  ].map((s) => (
                    <Link key={s.href} href={s.href} aria-label={s.label} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16130C] text-white transition-transform hover:-translate-y-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">{s.icon}</svg>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[13px] font-extrabold">Explore</div>
                <div className="mt-3 flex flex-col gap-2 text-[13px]">
                  <Link href="/#why" className="muted transition-colors hover:text-[#16130C]">Why us</Link>
                  <Link href="/demo/mits-madanapalle" className="muted transition-colors hover:text-[#16130C]">Demo</Link>
                  <Link href="/#compare" className="muted transition-colors hover:text-[#16130C]">Compare</Link>
                  <Link href="/#faq" className="muted transition-colors hover:text-[#16130C]">FAQs</Link>
                </div>
              </div>
              <div>
                <div className="text-[13px] font-extrabold">For colleges</div>
                <div className="mt-3 flex flex-col gap-2 text-[13px]">
                  <Link href="/register" className="muted transition-colors hover:text-[#16130C]">Register</Link>
                  <Link href="/college" className="muted transition-colors hover:text-[#16130C]">College admin</Link>
                  <Link href="/faculty" className="muted transition-colors hover:text-[#16130C]">Faculty</Link>
                  <Link href="/auth" className="muted transition-colors hover:text-[#16130C]">Login</Link>
                </div>
              </div>
            </div>
            <div className="muted mt-10 border-t border-[#EFE6D4] pt-5 text-center text-[12px]">
              <span>© 2026 CollegeMate · Developed by NxtGenSec</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
