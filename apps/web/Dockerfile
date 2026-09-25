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
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
# Standalone output mirrors the monorepo layout, so server.js sits under apps/web.
COPY --from=build --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
