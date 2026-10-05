# v2 — Landing page redesign

Date: 2026-10-05
Tag: v2-landing
Scope: `src/app/page.tsx` (landing only) + `.gitignore` hygiene. No backend changes.

## Design intent
Same content and information architecture, better hierarchy and trust
signals. Every section now opens with an eyebrow so the page scans;
loading states stop flashing raw `…`; interactive cards signal clickability.

## What changed
- Hero: gold "Live demo running" pulse badge linking to the demo; stats
  card promoted to `.card-elevated`; new `Stat` component shows shimmer
  skeletons while `/api/health` loads instead of `…`.
- Workflows: section header ("One flow, from approval to answer"), tabs
  get `role=tablist/tab` + `aria-selected`, cards show category badge +
  index + hover arrow (was static `0n · path →` mono line).
- Status: reframed as "System status / Live data, not screenshots" with a
  `/api/health` lead and a pulsing live indicator — visually distinct from
  the hero network-size stats instead of duplicating them.
- Compare: "Honest comparison" eyebrow; Generic bot pill muted so the eye
  lands on CollegeMate first.
- Screens: "Product tour" eyebrow; caption clarifies cards are clickable
  live routes.
- Examples: cards get hover lift; source tags become green badges
  (was trailing `· illustrative format` mono text).
- FAQ: `aria-expanded` + `+`/`−` toggle for screen readers.
- `.gitignore`: added `tsconfig.tsbuildinfo`; untracked the committed one.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build

## How to view
```powershell
npm run dev
# open http://localhost:3000
```

## Next (v3)
App experience: auth consolidation entry points, dashboard overview,
chat contrast + roles + auto-scroll, faculty upload, college workspace
pages, shared `StatusMsg` / `LoadingState` usage — reusing v1 primitives.
