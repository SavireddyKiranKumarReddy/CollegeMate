# v0 — Baseline (pre-redesign)

Date: 2026-10-05
Branch: main
Tag: v0-baseline

## Snapshot
- Next.js 16.3.8 (Turbopack) + React 19 + Supabase (`@supabase/ssr`, `supabase-js`)
- Existing dark UI: `src/app/globals.css`, `src/app/layout.tsx` (Nav + footer), `src/app/page.tsx` (landing)
- App routes: `/auth`, `/login`, `/register`, `/dashboard`, `/college`, `/faculty`, `/chat`, `/demo/mits-madanapalle`, `/[college]`, `/c/[domain]`, `/super`
- Config: `next.config.js` with `devIndicators: false`
- Env: `.env.local` (NOT committed, in `.gitignore`)

## What was done
1. `git init`, `branch -M main`
2. Verified `.gitignore` covers `.env.local`, `node_modules`, `.next`
3. Baseline commit + push to `https://github.com/SavireddyKiranKumarReddy/CollegeMate` (`main`)

## How to run locally
```powershell
npm install
npm run dev
# open http://localhost:3000
```

## Next
- v1: Design System 2.0 (`globals.css`, Nav/footer chrome, tokens, motion, a11y)
- v2: Landing page redesign (`src/app/page.tsx`)
- v3: App experience (auth, dashboard, chat, sidebar, forms, empty states)
