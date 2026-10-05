# v11 — Spirited pixel-build (screenshot reference)

Date: 2026-10-05
Tag: v11-spirited-pixel
Scope: landing + nav/footer + motion layer. No backend changes.
Reference: screenshots of the Base44 CollegeMate build (layout mirrored
1:1; copy kept close in structure, favicons/badge chrome excluded).

## Sections (in order)
1. Nav — About / Problem / Solution / Compare / FAQs + Admin login + Try
   the demo; hamburger on mobile.
2. Hero — lavender wash, RAG pill, "Your entire college, one question
   away." (indigo second line), dual CTA, 3 trust ticks, chat mock with
   Online pill, indigo/grey bubbles, citation chip, typing indicator.
3. About — eyebrow + headline + 2 paragraphs, 3 icon cards with hover lift.
4. Problem — full-bleed indigo band, 4 translucent cards with hover
   brighten + lift.
5. Solution — 3 numbered cards (watermark numerals, icon zoom on hover) +
   "What students ask" chips linking to demo.
6. Compare — CollegeMate vs university chatbots vs college website, tinted
   column, row hovers.
7. FAQ — "Questions, answered.", divider accordion, chevron rotate, smooth
   grid-rows expand.
8. Footer — Explore / For colleges, "© 2026 CollegeMate · RAG-powered by
   Sarvam".

## Motion layer (`globals.css`)
- `.rv` scroll reveals via IntersectionObserver (unstaggered + `data-d`
  stagger), transform/opacity only, disconnect on done.
- `.chat-msg` cascade-in with per-message delays; `.typing` 3-dot bounce;
  `.float-soft` 7s hero-card drift.
- `.acc-body` grid-rows accordion; `.chip` fill-on-hover; `.prob-card`
  glow-lift; `.cmp-row` highlight; button arrows slide (`group-hover`).
- Global `prefers-reduced-motion` kill-switch retained.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → green
