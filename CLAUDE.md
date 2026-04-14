# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to the SQLite database
npm run db:studio    # Open Drizzle Studio (DB browser UI)
```

There are no tests in this project.

## Architecture

**BabyLog** is a Next.js 16 app for tracking baby feedings and diaper changes. It uses:
- **Drizzle ORM** with **libSQL** (SQLite) for persistence — database file defaults to `./data/baby-log.db`, overridable via `DB_PATH` env var
- **Tailwind CSS v4** + **DaisyUI v5** (`pastel` theme) for all styling — use DaisyUI component classes (`btn`, `card`, `stat`, `alert`, etc.)
- **Chart.js** + **react-chartjs-2** for analytics charts

### Data model

Single table `entries` ([src/db/schema.ts](src/db/schema.ts)):
- `entryDate` / `entryTime` — when the event occurred (stored as text strings)
- `foodType` — `"breast"`, `"bottle"`, or `null` (no feeding logged)
- Bottle-specific: `bottleAmountMl`
- Breast-specific: `breastSide` (`"left"`, `"right"`, `"both"`), `breastDurationMin`
- `pee` / `poop` — booleans for diaper tracking
- `comments` — free text notes

### Routes

| Route | Purpose |
|---|---|
| `/` | Landing/home page (server component) |
| `/log` | Entry form — client component, POSTs to `/api/entries` |
| `/analytics` | Charts and stat cards — client component, GETs from `/api/analytics?days=N` |
| `/api/entries` | GET all entries (desc order), POST new entry |
| `/api/analytics` | GET aggregated stats + daily breakdown for last N days (default 7) |

### Key conventions

- DB client is a singleton exported from [src/db/index.ts](src/db/index.ts) — import `db` from `@/db`
- Schema types are exported from [src/db/schema.ts](src/db/schema.ts): `Entry` (select) and `NewEntry` (insert)
- `@/` path alias resolves to `src/`
- All pages under `src/app/` follow Next.js App Router conventions; interactive pages are `"use client"` components
- Analytics aggregation happens in the API route (server-side), not in the client
