# v13 — Pastel simple (reference skeleton, real data)

Date: 2026-10-05
Tag: v13-pastel-simple
Scope: landing + nav/footer + register prefill. No backend changes.
Reference: education-template screenshot (structure + font feel mirrored;
all copy original, photos replaced with product mock cards).

## What changed
- Theme: Nunito Black display + Nunito body, cream `#FFFBF2`, ink-black
  pill buttons, pastel tints, yellow arch visuals with offset outlines.
- Landing rebuilt: hero (email→register capture, live API counts, arch
  chat mock with sparkles) → capability wordmark strip → 3 pastel audience
  cards → engage arch feature → 6 tinted capability tiles → Q&A carousel
  (working prev/next, 2 sets of sourced pairs) → register CTA band →
  3-column footer with icon buttons.
- Honesty calls: testimonials replaced with sourced Q&A (no invented
  people); counts are live API values, never hardcoded; newsletter became
  a register CTA that prefills `/register?email=` (register reads it on
  mount, no Suspense needed).
- Nav simplified (Home / Why us / Demo / FAQs + Sign up); footer
  simplified to Explore / For colleges.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → green; hero verified serving
