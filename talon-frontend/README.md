# Talon Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `API_URL` | Origin of the Talon API backend (server-only, no `NEXT_PUBLIC_` prefix) |

The browser calls `/api/*` on the Next origin, which rewrites to `API_URL` via `next.config.ts`.

## Scripts

| Script | Description |
|----------|-------------|
| `pnpm dev` | Start dev server on port 3001 |
| `pnpm build` | Production build |
| `pnpm start` | Start production server on port 3001 |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Run Prettier |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm api:types` | Generate `lib/api/schema.d.ts` from the API OpenAPI spec |
| `pnpm analyze` | Analyze bundle size |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |

## Architecture

- Browser calls `/api/*` on the Next origin (port 3001)
- `next.config.ts` rewrites `/api/:path*` to `${API_URL}/:path*`
- API backend runs on port 3000
- Type import alias: `@/*` maps to project root

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript (strict mode)
- @tanstack/react-query
- Radix UI primitives
- openapi-typescript for API client types

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
