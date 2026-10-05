# v7 — NxtGenSec alignment (adopt cyber.nxtgensec.org design)

Date: 2026-10-05
Tag: v7-nxtgensec
Scope: shared tokens + chrome + landing accents. No backend changes.
Reference: `https://cyber.nxtgensec.org/` — token values read from its
shipped stylesheet (`--background 0 0% 4%`, `--primary/--accent
152 100% 50%`, `--radius .75rem`, glass hairlines, Inter + JetBrains Mono).

## What changed
- Palette → reference neutrals: `#0A0A0A` ground, `#121212/#171717` cards,
  `#2E2E2E/#1F1F1F/#3D3D3D` hairlines, white type, `#A3A3A3/#737373` muted.
- Accent → neon emerald `#00E67A` (token renamed `--gold` → `--acc`,
  `.badge-gold` → `.badge-acc`): primary buttons with black text + neon
  glow, active pills/tabs, live dots, outcomes rules, emerald focus rings
  and input focus glow, emerald hero glow.
- Type → Inter everywhere (400–800, headings 800 / tracking −0.03em);
  Bricolage + Outfit removed. JetBrains Mono kept.
- Chrome → 12px radii, emerald logo disc, subtler neon header shadow,
  neutral footer hairlines/watermark.
- Landing accents swapped (hero glow, mock labels, divide rules, WHY
  rows, ticks); layout system (asymmetric hero, editorial rows, strips)
  unchanged.
- Pre-flight re-run: no leftover cream/marigold/Outfit/Bricolage tokens.

## Deliberate exception
God-mode bans Inter + full-saturation accents; matching the sibling
NxtGenSec brand overrides both here. Documented in DESIGN.md.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build

## How to view
```powershell
npm run dev
# open http://localhost:3000 — compare with https://cyber.nxtgensec.org/
```
