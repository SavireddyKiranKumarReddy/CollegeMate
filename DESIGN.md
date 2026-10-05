# CollegeMate — DESIGN.md

Aesthetic: **friendly pastel institutional** — Nunito Black display + Nunito
body + JetBrains Mono labels. Cream canvas `#FFFBF2`, ink-black pills,
yellow arch visuals with offset outlines, pastel tint cards (lavender /
cream / pink / mint). Generous whitespace, simple centered rhythms.

## Palette

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFBF2` | cream page ground |
| `--panel` | `#FFFFFF` | cards, inputs |
| `--border` / soft / strong | `#EFE6D4` / `#F5EEDD` / `#E2D5BC` | hairlines |
| `--text` | `#16130C` | ink type |
| `--muted` / `--muted-2` | `#6E6455` / `#9A8F7C` | secondary / tertiary |
| primary buttons | `#16130C` pills, white text | CTAs, signup |
| `--acc` | `#5046E5` | focus rings, active tabs, chat roles, links |
| pastels | lav `#EFEDFE`, cream `#FFF6DF`, pink `#FFEDF3`, mint `#E9F6EE` | audience/capability/Q&A cards |
| icon tiles | `#6C63F6` / `#F7B500` / `#F0619C` | white glyphs |
| `--yellow` | `#F7B500` | arch visuals |

## Landing architecture (reference skeleton, original copy + real data)
Hero (headline + email→register + live counts + arch chat mock) →
capability wordmark strip → audiences (3 pastels) → engage arch feature →
capabilities (6 tinted tiles) → Q&A carousel (2×3 real-style pairs,
working arrows) → register CTA band → footer.

## Rules for future work

1. Rounded + friendly: Nunito everywhere, pill buttons, 16px radii.
2. No fake social proof: Q&A cards use realistic-format pairs, never
   invented people or reviews.
3. Every control works: carousel arrows cycle, forms route to register
   with email prefill, all links resolve.
4. New interactive UI: skeleton + empty + error states, aria labels,
   `:focus-visible` free via globals.

Last updated: 2026-10-05 (v13 pastel simple).
