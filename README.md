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

## Deploying to AWS

Both apps run on AWS Lambda (eu-west-2) as container images from ECR, using the Lambda Web
Adapter, and are served through public Function URLs. The functions `geekalender-api` and
`geekalender-web` already exist; the web function's `API_URL` environment variable points at the
API's Function URL.

Prerequisites: Docker Desktop running, and an AWS session (`aws login --profile geekalender`).

| Command                             | Description                                                 |
| ----------------------------------- | ----------------------------------------------------------- |
| `npm run deploy`                    | Build, push and deploy both functions at the current commit |
| `npm run deploy:api` / `deploy:web` | Deploy one function                                         |
| `npm run deploy -- -Tag <sha>`      | Redeploy an image already in ECR, e.g. to roll back         |

Commit first: images are tagged with the short commit SHA and the script refuses to run with
uncommitted changes to tracked files. Logs: `aws logs tail /aws/lambda/geekalender-web --since 10m`.

## API

- `GET /health`
- `GET /api/events?category=<category>&month=<1-12>`
- `GET /api/events/:id`
