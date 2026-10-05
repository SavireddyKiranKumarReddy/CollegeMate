# v12 — Fixed blueprint grid hero

Date: 2026-10-05
Tag: v12-grid-hero
Scope: hero background only.

## What changed
- New `.bg-grid` utility (`globals.css`): 44px indigo hairline grid with
  `background-attachment: fixed` + radial fade mask (`.bg-grid-fade`).
- Hero layers the fixed grid above its lavender wash, below content: the
  grid stays pinned to the viewport while hero content and later sections
  scroll over it.

## Verification
- Served HTML contains `bg-grid` (dev hot-reload, HTTP 200)
