# v14 — One-page navigation (home/about/problem/solution/compare/faqs/cta)

Date: 2026-10-05
Tag: v14-one-page
Scope: landing sections + nav/footer. No backend changes.

## What changed
- Landing is now exactly 7 anchors on `/`: `#home` (hero + email capture
  + live counts + chat mock), `#about` (positioning + proof card),
  `#problem` (4 numbered rows), `#solution` (4 capability cards),
  `#compare` (3-column CollegeMate vs Generic AI table), `#faq` (Q&A
  carousel), `#cta` (register band with email prefill).
- Nav refined to Home / About / Problem / Solution / Compare / FAQs +
  black Get started button (→ #cta); same list in mobile menu.
- Footer trimmed to Explore (6 anchors) + Get started (Register, Admin
  login). No product routes linked pre-login except Register/Login.
- App routes (`/chat`, `/demo`, `/college`, `/dashboard`, …) untouched and
  still work — they are simply no longer advertised before login.

## Verification
- `npx tsc --noEmit` → clean; `/` serves all 7 anchors (HTTP 200)
