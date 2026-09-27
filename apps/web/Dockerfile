# Build from the repo root: docker build -f apps/web/Dockerfile -t geekalender-web .
FROM node:24-alpine AS build
WORKDIR /repo
ENV NEXT_TELEMETRY_DISABLED=1
# Every workspace manifest is needed for npm ci to match the lockfile.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN npm ci -w @geekalender/web -w @geekalender/shared
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/web apps/web
RUN npm run build -w @geekalender/web

FROM node:24-alpine AS runtime
# Lambda Web Adapter: translates Lambda invocations into HTTP requests to the server below.
# Lambda runs it automatically as an extension; outside Lambda (docker, compose) it is never started.
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:1.1.0 /lambda-adapter /opt/extensions/lambda-adapter
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 \
    AWS_LWA_PORT=3000 AWS_LWA_READINESS_CHECK_PATH=/health
WORKDIR /app
# Standalone output mirrors the monorepo layout, so server.js sits under apps/web.
COPY --from=build --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
# Lambda's filesystem is read-only apart from /tmp, so Next's cache directory points there.
RUN ln -s /tmp/cache ./apps/web/.next/cache
USER node
EXPOSE 3000
# /tmp starts empty in each new Lambda environment, so create the cache target on startup.
CMD ["sh", "-c", "mkdir -p /tmp/cache && exec node apps/web/server.js"]
