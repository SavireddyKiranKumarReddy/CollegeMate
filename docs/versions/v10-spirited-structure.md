# v10 — Spirited structure (reference architecture, original copy)

Date: 2026-10-05
Tag: v10-spirited-structure
Scope: landing rebuild + white/indigo theme. Demo restored. No backend changes.
Reference analyzed: `https://spirited-campus-mate-ai.base44.app/` (Base44
React SPA — tokens read from its stylesheet, copy mapped from its bundle).

## What was adopted (structure, not content)
- White canvas, indigo primary (`--acc #5046E5`), amber warmth, Sora
  display, 12px radii, lavender hairlines.
- Chat-first hero: greeting mock + suggestion chips + cited answer, framed
  as open chat with no app/account/queue.
- Story beats: coverage strip → shy-student problem → college-builds-brain
  (workspace day one → departments publish → gap loop) → admin unanswered
  loop → FAQ set (getting started, knowledge contents, ownership, trust,
  no-app, isolation).
- All headlines, body copy and answers rewritten originally for
  CollegeMate — no text lifted from the reference.

## What changed in repo
- `globals.css`: full white/indigo token pass (Sora display stack).
- `page.tsx`: full rewrite to the 9-block structure above.
- `layout.tsx`: Sora font link, indigo marks, navy-ink hovers.
- `sidebar`/`auth`/`login`: indigo active states.
- `demo/` restored from `v7-nxtgensec` (+1 hover fix); sitemap re-added.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → green, `/demo/mits-madanapalle` present
