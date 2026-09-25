# Build from the repo root: docker build -f apps/api/Dockerfile -t geekalender-api .
FROM node:24-alpine AS base
WORKDIR /repo
# Every workspace manifest is needed for npm ci to match the lockfile.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

FROM base AS build
RUN npm ci -w @geekalender/api -w @geekalender/shared
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build -w @geekalender/api

FROM base AS prod-deps
RUN npm ci -w @geekalender/api --omit=dev

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=4000
WORKDIR /app
COPY --from=prod-deps /repo/node_modules ./node_modules
# package.json carries "type": "module" so Node loads the ESM bundle.
COPY apps/api/package.json ./
COPY --from=build /repo/apps/api/dist ./dist
USER node
EXPOSE 4000
CMD ["node", "dist/index.js"]
