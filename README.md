# Geekalender

A calendar of geek-culture events and dates.

## Structure

```
apps/api         Express 5 REST API (TypeScript, tsx for dev, tsup for build, node:test)
apps/web         Next.js App Router frontend
packages/shared  Types and constants shared by both apps (consumed as TS source)
```

Data is currently served from an in-memory repository (`apps/api/src/events`). `EventRepository`
is async so a Postgres-backed implementation can replace it without touching routes.

## Commands (from the repo root)

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm install`       | Install all workspaces                     |
| `npm run dev`       | API on :4000 and web on :3000, with reload |
| `npm test`          | API tests                                  |
| `npm run typecheck` | `tsc` in every workspace                   |
| `npm run lint`      | ESLint across the repo                     |
| `npm run build`     | Production builds                          |

Copy `apps/api/.env.example` and `apps/web/.env.example` to `.env` to override defaults.

## API

- `GET /health`
- `GET /api/events?category=<category>&month=<1-12>`
- `GET /api/events/:id`
