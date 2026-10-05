# v8 — Remove live demo

Date: 2026-10-05
Tag: v8-remove-demo
Scope: delete `/demo/mits-madanapalle` route + all UI references. No backend
changes (auth demo backdoors and `/api` untouched).

## What changed
- Deleted `src/app/demo/mits-madanapalle/` (`page.tsx`, `demo-client.tsx`).
- `src/app/sitemap.ts` — demo URL removed.
- `src/app/page.tsx` — Demo tab dropped from command switcher; hero badge
  → "Cited answers · workspace-scoped" (`#solution`); secondary CTAs now
  point at `#solution` / `/chat`; compare table Demo column removed
  (Campus / Self-host / Generic bot remain); compare + CTA buttons point at
  `/register` / `/chat`; "free demo" microcopy → "no installation · cited
  answers".
- `src/app/layout.tsx` — nav Live demo link, footer Live demo link, and
  footer CTA Live demo button removed (→ Student chat `/chat`).

## Verification
- `npx tsc --noEmit` → clean (cleared stale `.next` cache first)
- `npm run build` → all routes build, `/demo/*` gone from output
