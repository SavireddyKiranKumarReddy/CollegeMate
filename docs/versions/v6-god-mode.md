# v6 — God-mode pass (frontend-god-mode skill adopted)

Date: 2026-10-05
Tag: v6-god-mode
Scope: landing + chrome + shared tokens. No backend changes. Skill source:
`https://github.com/Shawnchee/frontend-god-mode` (rules adopted, not vendored).

## Aesthetic (one line)
Midnight editorial — Bricolage display + Outfit body + JetBrains Mono,
espresso-ink neutrals, single marigold accent.

## What changed
- Type: Inter removed everywhere → Outfit body (font link in
  `src/app/layout.tsx` + all stacks in `globals.css`). Bricolage display
  kept. Two families + mono, 65ch prose caps.
- Palette: pure `#fff`/`#000` surfaces eliminated → warm cream `#F5EFE2`
  buttons/pills/logo with espresso ink text; backgrounds/borders warmed to
  espresso (`#100E0B` family); shadows tinted; single accent `#E5A83B`.
  Status trio (green/red/blue) kept for badges only.
- Hero: centered → asymmetric (copy left, live-answer mock + command card
  right); staggered `.rise` entrance (transform/opacity only); realistic
  messy demo data (₹480 condonation fee, `circular-118.pdf · p.2`).
- Problems: 6 cards → numbered divide-y editorial rows with tags.
- Outcomes: 4 gold boxes → marigold top-rule strip, no boxes.
- CTA: centered → asymmetric (pitch left, command switcher right).
- Containers `max-w-6xl` → `max-w-7xl`; footer/nav/sidebar/auth pills all
  re-tinted; footer watermark warmed.
- New `DESIGN.md` at root (skill-mandated persistent design memory).

## Pre-flight (skill checklist) — all pass
No Inter / no purple-blue / no pure black-white surfaces / one accent /
tinted shadows / asymmetric hero / no 3-card rows / no nested cards past
depth 1 / no h-screen / grid only / spring-ish easing, transform+opacity
only / reduced-motion honored / contrast AA / focus rings / real labels /
sequential headings / messy realistic data / no filler copy / no emojis /
skeletons + empty + error states kept / `use client` only where state lives.

## Known follow-up
App interior (`/[college]/*`, `/dashboard/colleges`, `/dashboard/activity`,
`/faculty`, `/college`) still uses old cool-gray hairlines — migrate to
v6 tokens next time those pages are touched (noted in DESIGN.md).

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build

## How to view
```powershell
npm run dev
# open http://localhost:3000
```
