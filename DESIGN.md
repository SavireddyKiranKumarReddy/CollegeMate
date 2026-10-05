# CollegeMate — DESIGN.md

Aesthetic: **NxtGenSec-aligned security console** — Inter tight (800
headings) + JetBrains Mono operational labels. Neutral-black surfaces,
glass hairlines, one neon-emerald accent `#00E67A` with glow. Asymmetric
layouts, divide-y editorial rows, zero feature-card grids.
(Built under frontend-god-mode layout rules; Inter + full-saturation accent
are deliberate exceptions to match the sibling NxtGenSec brand at
cyber.nxtgensec.org.)

## Palette (single accent + neutral surfaces)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0A` | page ground + emerald hero glow |
| `--panel` / `--panel-2` | `#121212` / `#171717` | card gradient |
| `--border` / soft / strong | `#2E2E2E` / `#1F1F1F` / `#3D3D3D` | hairlines |
| `--text` | `#FFFFFF` | primary type (matches reference) |
| `--muted` / `--muted-2` | `#A3A3A3` / `#737373` | secondary / tertiary |
| `--acc` | `#00E67A` | THE accent — primary buttons (black text), active pills, live dots, outcomes, focus rings, glows |
| status only | green `#6EE7B7` / amber `#FCD34D` / red `#FCA5A5` / blue `#93C5FD` | badges, never decoration |
| `--shadow-glow` | `0 0 24px rgba(0,230,122,.28)` | primary-button neon glow |

## Type

- Display + body: Inter (headings 800, tracking −0.025…−0.03em).
- Mono: JetBrains Mono for eyebrows, stats, commands, citations, status.
- Body line-height ≥ 1.5, prose capped at 65ch.

## Layout signatures

- Containers `max-w-7xl`. Grid, never flex math. Mobile → single column.
- Hero is asymmetric: copy left, live-answer mock + command card right.
- Problems = numbered divide-y editorial rows (no cards).
- Outcomes = emerald top-rule strip, 4 across (no boxes).
- CTA = asymmetric: pitch left, command switcher right.
- Entrance motion: `.rise` (translateY 14px + opacity, spring-ish
  cubic-bezier, staggered delays). `prefers-reduced-motion` kills it.

## Rules for future work

1. New sections: rows/strips/bento — never N equal cards, never centered hero.
2. New colors:neutrals + emerald only; statuses keep the approved trio + amber/blue.
3. New copy: concrete verbs, messy-specific data (`₹480`, `p.24`,
   `circular-118`); banned: Elevate/Seamless/Unleash/Next-Gen, Acme-style
   names, round fake stats, emojis.
4. New interactive UI: skeleton + empty + error states, `aria-expanded` /
   `aria-selected` / `role=status` where applicable, `:focus-visible` free
   via globals.
5. App interior (`/[college]/*`, `/dashboard/*`) still carries old cool-gray
   hairlines (`#232329` family) — migrate to these tokens on next touch.

Last updated: 2026-10-05 (v7 nxtgensec alignment).
