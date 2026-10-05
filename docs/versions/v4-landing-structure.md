# v4 — Landing restructure (Home / About / Problems / Solution / Compare / FAQs / CTA)

Date: 2026-10-05
Tag: v4-landing-structure
Scope: landing page + site chrome only. No backend changes.

## What changed
- `src/app/page.tsx` — 7 sections, nothing else:
  - **Home** (hero): unchanged high-converting hero — live badge, stats
    with skeletons, Register/Demo/Chat shortcuts, audience pills. Third
    CTA now scrolls to `#problems`.
  - **About** (new): what CollegeMate is, who it serves, RAG/cited/
    workspace-scoped badges + "Built for institutions" card (run anywhere,
    model-flexible, NxtGenSec) with demo CTA.
  - **Problems** (new): 6 numbered cards — scattered info, repeated staff
    load, guessing bots, silos, uncheckable answers, dead ends.
  - **Solution** (new): "why needed" 01–03 rows (one verified source,
    answers that show their work, departments stay owners) + OUTCOMES band
    (Cited / Isolated / Honest / Scoped) + dual CTA.
  - **Compare / FAQs / CTA**: kept, with "Honest comparison" eyebrow.
- Removed as standalone sections: Workflows grid, Campus plan, Live
  status, Screens tour, Q&A examples (+ their now-unused visual helpers).
  Their substance survives inside About/Solution/Compare.
- `src/app/layout.tsx` — Nav links now Home / About / Problems / Solution /
  Compare / FAQs (+ Login, Live demo on wide screens, Register CTA);
  no-JS mobile Menu via `<details>`; footer Platform column mirrors the
  new sections.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build

## How to view
```powershell
npm run dev
# open http://localhost:3000  — scroll Home → About → Problems → Solution → Compare → FAQs → CTA
```
