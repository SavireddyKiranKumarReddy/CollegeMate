# v1 — Design System 2.0 (foundation)

Date: 2026-10-05
Tag: v1-design-system
Scope: shared foundation only — no page-level redesigns, no backend changes.

## Design intent
Keep the dark premium identity, fix the fundamentals: elevation, focus,
motion safety, and reusable primitives that v2 (landing) and v3 (app)
will build on. Every existing class name keeps working — this version is
purely additive except for refined values.

## Changed files
- `src/app/globals.css` — full token + primitive pass:
  - New tokens: `--bg-soft`, `--border-strong`, `--gold-soft`, `--blue`,
    `--ring`, `--radius`, `--shadow-pop`; ambient body glow (white + gold).
  - Buttons: hover lift + glow on `.btn-primary`, press states, disabled
    states for both variants; new `.btn-danger-ghost` (replaces ad-hoc
    delete styling); new `.spinner` for loading buttons.
  - Forms: focus ring on `.input`, new `.input-error`, `.hint`,
    `.field-error`, `.msg` / `.msg-ok` / `.msg-err` / `.msg-info` status
    blocks (replace bare muted `msg` lines in v3).
  - Badges: new `.badge-blue` (info), `.badge-neutral`; `.dot-pulse`
    for pending states.
  - Chat: higher-contrast bubbles, new `.chat-role-q` / `.chat-role-a`
    role labels (replace tiny YOU/AI text in v3).
  - New `.skeleton` shimmer, `.card-elevated`, `.row-item` list rows,
    `.h3`, `.caption`, `.actions`, `.toolbar`, `.page-head`,
    `.empty-title` / `.empty-body`.
  - Table row hover on `.cmp`; shadow on `.screen` hover.
  - Global `:focus-visible` ring, custom scrollbar, gold selection,
    `prefers-reduced-motion` reset.
- `src/components/sidebar.tsx` — nested-route active matching
  (`path.startsWith(href + "/")`), `aria-current="page"`, landmark labels.
- `src/app/layout.tsx` — sticky blurred Nav with shadow, skip-to-content
  link, `aria-label` on home link.
- `src/app/dashboard/layout.tsx` — sidebar sub `"kiransavireddy@gmail.com"`
  → `"Control plane"` (no personal email in chrome).

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build (static + dynamic as before)

## How to view
```powershell
npm run dev
# open http://localhost:3000
```
Look for: sticky nav on scroll, Tab-key focus rings, refined buttons/cards.

## Next (v2)
Landing page redesign in `src/app/page.tsx`: hero hierarchy, dedupe stats,
workflow cards, compare table, screens, FAQ polish — using v1 primitives.
