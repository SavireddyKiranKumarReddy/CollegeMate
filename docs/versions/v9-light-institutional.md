# v9 — Light institutional simplification (approved architecture)

Date: 2026-10-05
Tag: v9-light-institutional
Scope: landing rewrite + light theme + chrome. Demo route restored from
`v7-nxtgensec`. No backend changes.

## Story
One line: your college has the answers, CollegeMate makes them accessible.
Each section answers exactly one question; repeated vocabulary (cited,
workspace, RAG, scoped) now appears once each, in its home section.

## What changed
- Theme: dark emerald → off-white paper `#F6F5F1`, white surfaces, thin
  `#E4DFD3` hairlines, dark navy `#0E1B2E` type, single indigo `#2E4BFF`.
  Type back to Bricolage display + Outfit body + JetBrains Mono. App
  interior (token-driven) follows automatically; remaining hardcoded dark
  hairlines swept (sidebar, auth tabs, demo client, college pages, login).
- Landing restructured to the approved 14 blocks: hero + live MITS chat
  preview → trust strip → problem (4 rows) → transition flow → solution
  (3 rows) → how-it-works (4-step strip, RAG lives here) → differentiators
  Cited/Isolated/Scoped/Honest (2×2 with distinct visuals) → users (3 rows,
  no emojis) → live demo section → simplified CollegeMate-vs-Generic-AI
  table + killer line → security (careful claims only) → rewritten 6 FAQs
  → minimal CTA → minimal footer.
- Removed per brief: About, stats, command switcher, technical compare
  columns, "FREE · CITED…" / "GET STARTED…" lines, footer jargon line,
  model names in marketing, giant watermark, role emojis.
- Nav: Product / Why CollegeMate / Compare / FAQs + Login + Live Demo +
  Register College; hamburger on mobile. Footer: Platform / For
  Institutions per brief.
- Demo: `/demo/mits-madanapalle` restored (byte-identical from v7) with one
  hover-tint fix; sitemap entry restored.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build, `/demo/mits-madanapalle` present

## How to view
```powershell
npm run dev
# open http://localhost:3000
```
