# Talon Web

Next.js frontend for Talon, a quiet habit tracker. The NestJS API is the source of truth for every rule; this app renders it.

## Overview

Talon helps users build daily and weekly habits. Users create habits with schedules, colors, icons, and reminders; mark them complete or skipped each day; track streaks; and review progress through a dashboard and analytics. The frontend is a Next.js App Router application that talks to the API through a same-origin `/api` proxy.

## Features

- Authentication: register, login, logout, password reset, timezone selection.
- Habits: create, edit, archive, restore; daily or weekly schedules; 10 colors; icon picker.
- Completions: Grip (complete) and Slip (skip) with optimistic updates and rollback.
- Dashboard (Perch): today's habits, stat row, skipped list, reminders drawer.
- Analytics: 90-day heatmap, stat cards, leaderboard.
- Settings: profile, password change, timezone, delete account.
- Responsive: mobile sheet sidebar, collapsed rail, full layouts at 768/1024/1440.
- Dark theme only (Obsidian & Acid palette, primary `#c8ff2e`).

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript 5.
- Tailwind CSS v4, shadcn/ui (Radix), tw-animate-css.
- TanStack Query for server state; Recharts for charts; date-fns for dates.
- Vitest (unit), Playwright (E2E + visual).
- pnpm 10, Node 22.

## Requirements

- Node.js 22 (see `.nvmrc`).
- pnpm (see `packageManager` field).
- Running Talon API (see backend README).

## Getting started

```bash
git clone <repo-url>
cd talon-frontend
pnpm install
cp .env.example .env.local
# set API_URL to your API origin
pnpm api:types
pnpm dev
```

Open http://localhost:3001.

## Environment configuration

| Variable | Required | Description |
|---|---|---|
| `API_URL` | yes | Origin of the NestJS API, no trailing slash. Read at build time (rewrite baked into build) and by `pnpm api:types`. |

Public vs server: `API_URL` is server-only (used in next.config rewrite). No `NEXT_PUBLIC_*` variables are used; the browser calls same-origin `/api/*`.

## How the frontend works

- Requests: browser calls `/api/*` on the Next origin; `next.config.ts` rewrites to `API_URL`. Keeps refresh cookie first-party, no CORS.
- API client (`lib/api/client.ts`): unwraps `{success,data}`, throws `ApiError`, retries once after 401.
- Auth: access token in memory only (`lib/auth/token-store.ts`); refresh token is httpOnly cookie; single-flight refresh with delayed retry. `AuthProvider` + `AuthGate` in `app/app/layout.tsx` ensure refresh before render.
- `proxy.ts` only checks cookie existence (UX redirect); API is the auth gate.
- Server components never call the API (`/api` URL is relative).
- Today is decided by the server (user timezone); use `useDashboard().data.date`. Dates are `YYYY-MM-DD`; format via `lib/format.ts`, never `new Date("YYYY-MM-DD")`.
- Cache keys in `lib/api/query-keys.ts`; mutations call `invalidateHabitData`/`invalidateCompletionData`.

## Available commands

| Script | Purpose |
|---|---|
| `dev` / `build` / `start` | Next.js on port 3001 |
| `api:types` | Regenerate API types from `$API_URL/api/docs-json` |
| `typecheck` / `lint` / `format` | Static checks |
| `knip` | Unused files/exports/deps |
| `test` / `test:tz` | Unit tests (tz variant catches date bugs) |
| `test:e2e` | Playwright flows (needs API with relaxed auth throttling) |
| `test:visual` | Screenshots at 390/768/1024/1440 |
| `analyze` | Bundle report |

Before merging: `pnpm typecheck && pnpm lint && pnpm knip && pnpm test && pnpm test:tz && pnpm build && pnpm test:e2e`

## Testing and quality checks

- Unit: Vitest (`tests/unit`).
- E2E: Playwright (`tests/e2e`) against running API.
- Visual: Playwright (`tests/visual`) writes screenshots to `tests/visual/output/`.
- Prereqs: API running with relaxed auth throttle for E2E/visual.

## API types and synchronization

Generated types live in `lib/api/schema.d.ts` (from OpenAPI). Never edit manually. Re-run `pnpm api:types` after API changes.

## Production build and deployment

- `API_URL` must be set at build time (rewrites baked into build).
- Build: `pnpm build`; start: `pnpm start` (port 3001).
- Security headers via `next.config.ts`. No CSP yet (launch item).
- Deploy frontend to Vercel; set `API_URL` per environment (production vs preview).

## Project structure

```
app/            routes: (auth) group, app/ for authenticated shell
components/     ui (shadcn), brand, shared, layout, feature folders
hooks/queries/  one file per API resource
lib/api/        client, errors, endpoints, generated schema, query keys
lib/auth/       token store, refresh, session, provider
tests/          unit (Vitest); e2e + visual (Playwright)
docs/           visual QA checklist
```

## Known limitations

- No CSP, no error reporting (Sentry) yet.
- Light/system themes not implemented (Settings says so).
- Landing footer links (Privacy, Terms, Contact) are placeholders.
- Habit detail lacks notes/per-row time (intentional).

Keep backend docs in `talon-backend/README.md`.
