# v3 — App experience (auth, register, dashboard, chat)

Date: 2026-10-05
Tag: v3-app-experience
Scope: 4 high-traffic pages, UI-only. No API / RAG / auth-logic changes —
all fetch bodies, redirects, and demo backdoors behave exactly as before.

## What changed
- `src/app/dashboard/page.tsx` — rewrite using v1 primitives:
  - Skeleton cards + skeleton rows while `/api/colleges` loads (was `0`
    flash + `No colleges yet` flicker); fetch failure now resolves to `[]`
    instead of hanging on skeletons.
  - Amber "N awaiting approval" pill linking to `/dashboard/colleges`.
  - College rows use `.row-item` with domain/city sub-line; status badges
    get dots + red `rejected` state (was green/amber only).
  - Structured empty state (title + body) instead of one-line text.
- `src/app/chat/page.tsx` — conversation affordances:
  - Labeled roles (`YOU` / `COLLEGEMATE` with dot + `.chat-role-*`) on
    higher-contrast bubbles; `aria-live="polite"` log region.
  - Auto-scroll to latest message; spinner busy indicator; clearer network
    error copy; Ask disabled until input is non-empty.
- `src/app/auth/page.tsx` — trust + a11y:
  - Email field no longer prefilled with a personal address.
  - Hint is generic ("use the email your admin granted access to").
  - Tabs get `role=tablist/tab` + `aria-selected`; status line becomes a
    `role="status"` `.msg-ok/.msg-err/.msg-info` block auto-derived from
    message text.
- `src/app/register/page.tsx` — status messages use `.msg-ok/.msg-err`
  blocks with `role="status"`; approval copy no longer names an individual.

## Deliberately deferred
- `/login` vs `/auth` consolidation, `/college` legacy dedupe, faculty /
  workspace / demo-client unification, toast system, destructive-action
  confirm dialogs — need product decisions; proposed for v4.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → all routes build

## How to view
```powershell
npm run dev
# http://localhost:3000/dashboard  http://localhost:3000/chat
# http://localhost:3000/auth       http://localhost:3000/register
```
