# v5 — Hero copy (no counts)

Date: 2026-10-05
Tag: v5-hero-copy
Scope: hero section of `src/app/page.tsx` only.

## What changed
- Headline → "AI-Powered Knowledge Assistant for Colleges" with the
  "Give every student instant access…" lead and the verified-documents
  paragraph from the approved copy.
- Removed the colleges / departments / documents stats row from the hero
  (and its `/api` fetching + `Stat` helper — now dead code, deleted).
- Hero now reads: audience line (Students · Faculty · Administrators) →
  Web · Mobile · API → Register / Live-demo CTAs → "Ask. Find. Understand."
  benefits card (6 checks) → "Live College Demo" MITS card → command
  switcher → "Free Demo · Live Workspace · No Installation Required".
- Rest of the page (About / Problems / Solution / Compare / FAQs / CTA)
  untouched.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build
