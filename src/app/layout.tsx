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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

function Nav() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <header className="flex items-center justify-between gap-3 border-b border-[#EFE6D4] py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="CollegeMate home">
          <img src="/logo.png" alt="CollegeMate logo" width={30} height={30} className="rounded-lg" />
          <span className="font-display text-[17px] font-black tracking-tight">CollegeMate</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <Link href="/#home" className="navlink">Home</Link>
          <Link href="/#about" className="navlink">About</Link>
          <Link href="/#problem" className="navlink">Problem</Link>
          <Link href="/#solution" className="navlink">Solution</Link>
          <Link href="/#compare" className="navlink">Compare</Link>
          <Link href="/#faq" className="navlink">FAQs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/#cta" className="btn-primary btn-sm">Get started</Link>
          <details className="relative lg:hidden">
            <summary className="btn-ghost btn-sm cursor-pointer list-none" aria-label="Open menu">☰</summary>
            <div className="card card-pad absolute right-0 top-full mt-2 flex w-48 flex-col gap-1 p-2">
              <Link href="/#home" className="navlink">Home</Link>
              <Link href="/#about" className="navlink">About</Link>
              <Link href="/#problem" className="navlink">Problem</Link>
              <Link href="/#solution" className="navlink">Solution</Link>
              <Link href="/#compare" className="navlink">Compare</Link>
              <Link href="/#faq" className="navlink">FAQs</Link>
              <Link href="/#cta" className="navlink">Get started</Link>
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
                <Link href="/" className="flex items-center gap-2" aria-label="CollegeMate home">
                  <img src="/logo.png" alt="CollegeMate logo" width={30} height={30} className="rounded-lg" />
                  <span className="font-display text-[17px] font-black tracking-tight">CollegeMate</span>
                </Link>
                <div className="mt-3 flex gap-2">
                  {[
                    { href: "https://x.com/NxtgenSec", label: "X (Twitter)", icon: <path d="M4 4l16 16M20 4 4 20" /> },
                    { href: "https://instagram.com/nxtgensec", label: "Instagram", icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></> },
                    { href: "https://linkedin.com/company/nxtgensec", label: "LinkedIn", icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M8 10.5V17" /><circle cx="8" cy="7.8" r="0.7" fill="currentColor" /><path d="M12 17v-3.8c0-1.6 1-2.7 2.6-2.7 1.4 0 2.4.9 2.4 2.7V17" /></> },
                    { href: "https://youtube.com/@NxtGenSec", label: "YouTube", icon: <><rect x="2.5" y="6" width="19" height="12.5" rx="4" /><path d="M10.5 9.7l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" /></> },
                    { href: "https://github.com/nxtgensec", label: "GitHub", icon: <><path d="m8 8-4.5 4.5L8 17" /><path d="m16 8 4.5 4.5L16 17" /></> },
                    { href: "mailto:hello@collegemate.app", label: "Email", icon: <><rect x="3" y="5.5" width="18" height="13" rx="3" /><path d="m4 7.5 8 6 8-6" /></> },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={s.label} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16130C] text-white transition-transform hover:-translate-y-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">{s.icon}</svg>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[13px] font-extrabold">Explore</div>
                <div className="mt-3 flex flex-col gap-2 text-[13px]">
                  <Link href="/#home" className="muted transition-colors hover:text-[#16130C]">Home</Link>
                  <Link href="/#about" className="muted transition-colors hover:text-[#16130C]">About</Link>
                  <Link href="/#problem" className="muted transition-colors hover:text-[#16130C]">Problem</Link>
                  <Link href="/#solution" className="muted transition-colors hover:text-[#16130C]">Solution</Link>
                  <Link href="/#compare" className="muted transition-colors hover:text-[#16130C]">Compare</Link>
                  <Link href="/#faq" className="muted transition-colors hover:text-[#16130C]">FAQs</Link>
                </div>
              </div>
              <div>
                <div className="text-[13px] font-extrabold">Get started</div>
                <div className="mt-3 flex flex-col gap-2 text-[13px]">
                  <Link href="/#cta" className="muted transition-colors hover:text-[#16130C]">Register</Link>
                  <Link href="/login" className="muted transition-colors hover:text-[#16130C]">Admin login</Link>
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
