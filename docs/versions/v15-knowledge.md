# v15 — Knowledge layer (ingest once, answer from stored facts)

Date: 2026-10-05
Tag: v15-knowledge
Scope: new tables + ingest extraction + facts-first router + admin UI.
College-admin-only operation.

## REQUIRED ONE-TIME STEP
Run `supabase/migrations/20261006_knowledge.sql` in the Supabase SQL
editor. Until then, fact lookup/extraction no-op gracefully and chat falls
back to chunk RAG exactly as before.

## How it works
- **Ingest** (`api/documents POST`): after chunking, same-titled older docs'
  verified facts go `stale`; LLM extracts candidate facts → `pending`.
  Best-effort, upload never fails because of it.
- **Answer tiers** (`api/chat POST`): small-talk → **stored facts**
  (verified first, stale serves at medium) → chunk RAG → honest fallback.
  Fact hits skip the LLM entirely and cite `[source doc]`.
- **Section A** (`[college]/documents`): uploads + per-doc fact counts.
- **Section B** (`[college]/knowledge`, new sidebar item): filter/search,
  approve, re-verify, edit (auto-versions previous), deactivate/activate,
  delete, manual add (live verified), per-fact version history.
- Sources are never edited; all changes versioned with author + timestamp.

## Verification
- `npx tsc --noEmit` → clean
- `npm run build` → green
