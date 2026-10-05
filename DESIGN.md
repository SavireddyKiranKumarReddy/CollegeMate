# CollegeMate — DESIGN.md

Aesthetic: **midnight editorial** — Bricolage Grotesque display + Outfit body
+ JetBrains Mono for operational labels. Espresso-ink neutrals, one marigold
accent. Asymmetric layouts, divide-y editorial rows, zero feature-card grids.
(Built under frontend-god-mode rules: no Inter, no centered hero, no 3-card
rows, no pure #000/#FFF, no filler copy.)

## Palette (single accent + tinted neutrals)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#100E0B` | page ground |
| `--panel` / `--panel-2` | `#171310` / `#1D1812` | card gradient |
| `--border` / soft / strong | `#2A241A` / `#201B13` / `#3D3525` | hairlines |
| `--text` | `#F5EFE2` | primary type (warm cream, never pure white) |
| `--muted` / `--muted-2` | `#A79E8B` / `#6E6656` | secondary / tertiary |
| `--gold` | `#E5A83B` | THE accent (eyebrows, live dots, outcomes, focus of attention) |
| surfaces ink | `#171310` | text on cream buttons/pills |
| status only | green `#86EFAC` / red `#FCA5A5` / blue `#93C5FD` | badges, never decoration |
| `--shadow-pop` | `0 12px 40px rgba(10,7,3,.55)` | tinted shadows only |

## Type

- Display: Bricolage Grotesque (700, tracking −0.022…−0.025em). H1 clamp
  38→62px. Never gradient-filled, never oversized for effect.
- Body: Outfit 400–600, line-height ≥ 1.5, prose capped at 65ch.
- Mono: JetBrains Mono for eyebrows, stats, commands, citations, status.

## Layout signatures

- Containers `max-w-7xl`. Grid, never flex math. Mobile → single column.
- Hero is asymmetric: copy left, live-answer mock + command card right.
- Problems = numbered divide-y editorial rows (no cards).
- Outcomes = marigold top-rule strip, 4 across (no boxes).
- CTA = asymmetric: pitch left, command switcher right.
- Entrance motion: `.rise` (translateY 14px + opacity, spring-ish
  cubic-bezier, staggered delays). `prefers-reduced-motion` kills it.

## Rules for future work

1. New sections: rows/strips/bento — never N equal cards, never centered hero.
2. New colors:neutrals + gold only; statuses keep the approved trio.
3. New copy: concrete verbs, messy-specific data (`₹480`, `p.24`,
   `circular-118`); banned: Elevate/Seamless/Unleash/Next-Gen, Acme-style
   names, round fake stats, emojis.
4. New interactive UI: skeleton + empty + error states, `aria-expanded` /
   `aria-selected` / `role=status` where applicable, `:focus-visible` free
   via globals.
5. App interior (`/[college]/*`, `/dashboard/*`) still carries old cool-gray
   hairlines (`#232329` family) — migrate to these tokens on next touch.

Last updated: 2026-10-05 (v6 god-mode).
