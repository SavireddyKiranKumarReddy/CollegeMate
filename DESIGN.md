# CollegeMate — DESIGN.md

Aesthetic: **light institutional SaaS** — Bricolage Grotesque display +
Outfit body + JetBrains Mono operational labels. Off-white paper ground,
white surfaces, thin hairlines, one blue/indigo accent `#2E4BFF`. Generous
whitespace, editorial numbered rows, product-as-hero. No Inter primary,
no centered hero, no 3-card rows, no filler copy.

## Palette (single accent + paper neutrals)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F6F5F1` | page ground + faint indigo hero glow |
| `--panel` / `--panel-2` | `#FFFFFF` | cards (flat, thin borders) |
| `--border` / soft / strong | `#E4DFD3` / `#EDE9DD` / `#D5CFC0` | hairlines |
| `--text` | `#0E1B2E` | dark navy type |
| `--muted` / `--muted-2` | `#5A6B84` / `#8A97A9` | secondary / tertiary |
| `--acc` | `#2E4BFF` | THE accent — primary buttons, active pills, numbers, focus rings |
| status only | green `#15803D` / amber `#92400E` / red `#B42318` / blue `#1F3AE0` | light-tint badges, never decoration |
| `--shadow-pop` | `0 12px 32px rgba(16,27,46,.08)` | soft neutral shadows only |

## Type

- Display: Bricolage Grotesque (700, tracking −0.022…−0.025em).
- Body: Outfit 400–600, line-height ≥ 1.5, prose capped at 65ch.
- Mono: JetBrains Mono for eyebrows, flows, citations, status.

## Layout signatures

- Containers `max-w-7xl`. Grid, never flex math. Mobile → single column.
- Landing tells one story per section: hero → strip → problem → transition
  → solution → how-it-works → differentiators → users → demo → compare →
  security → FAQ → CTA.
- Problems/users/security = numbered divide-y rows. Steps = top-rule strip.
  Differentiators = 2×2 with distinct mini-visuals each.
- One vocabulary rule: each concept (cited, workspace, RAG, scoped) is
  explained once, in its own section — never repeated as decoration.
- Entrance motion: `.rise` (translateY 14px + opacity, spring-ish
  cubic-bezier, staggered delays). `prefers-reduced-motion` kills it.

## Rules for future work

1. New sections: rows/strips/bento — never N equal cards, never centered hero.
2. New colors: paper neutrals + indigo only; statuses keep light tints.
3. New copy: concrete verbs, messy-specific data; banned: Elevate/Seamless/
   Unleash/Next-Gen, Acme-style names, round fake stats, emojis, model names
   in marketing.
4. New interactive UI: skeleton + empty + error states, `aria-expanded` /
   `aria-selected` / `role=status` where applicable, `:focus-visible` free
   via globals.

Last updated: 2026-10-05 (v9 light institutional).
