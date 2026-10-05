# CollegeMate — DESIGN.md

Aesthetic: **white institutional SaaS** — Sora display + Outfit body +
JetBrains Mono labels. Pure-white canvas, lavender hairlines, indigo
primary `#5046E5` + amber warmth `#F59E0B`. Chat-first hero, editorial
rows, product-as-hero. (Mirrors the information architecture of the
reference Base44 build; all copy is original.)

## Palette

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | page ground + faint indigo hero glow |
| `--bg-soft` / `--panel-2` | `#F5F4FC` | tinted strips, chips, secondary surfaces |
| `--panel` | `#FFFFFF` | cards (flat, thin borders) |
| `--border` / soft / strong | `#E6E5F1` / `#EFEFF7` / `#D3D2E6` | hairlines |
| `--text` | `#17172E` | dark navy-ink type |
| `--muted` / `--muted-2` | `#5F5F7D` / `#8F8FA8` | secondary / tertiary |
| `--acc` | `#5046E5` | THE accent — primary buttons, active pills, numbers, focus rings |
| `--warm` | `#F59E0B` | sparing warmth (badges, highlights) |
| status only | green `#15803D` / amber `#92400E` / red `#B42318` | light-tint badges |

## Type

- Display: Sora (700, tracking −0.022…−0.025em).
- Body: Outfit 400–600, line-height ≥ 1.5, prose capped at 65ch.
- Mono: JetBrains Mono for eyebrows, flows, citations, status.

## Landing architecture (one question per section)

Hero (open chat, no app/account) → coverage strip → shy-student problem →
college-builds-brain (workspace → departments → gap loop) → no-app strip →
why (cited/owned/gap-aware/isolated) → compare → FAQ → CTA.

## Rules for future work

1. New sections: rows/strips — never N equal cards, never centered hero.
2. New colors: white/lavender + indigo only; amber sparingly.
3. New copy: concrete, original wording; banned: Elevate/Seamless/Unleash/
   Next-Gen, Acme-style names, round fake stats, emojis, model names in
   marketing.
4. New interactive UI: skeleton + empty + error states, `aria-expanded` /
   `aria-selected` / `role=status` where applicable, `:focus-visible` free
   via globals.

Last updated: 2026-10-05 (v10 spirited structure).
