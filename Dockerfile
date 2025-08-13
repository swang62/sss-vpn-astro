FROM node:22-slim AS base

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=4321
WORKDIR /app

# Setup PNPM
ENV PNPM_HOME="/pnpm"
ENV PNPM_VERSION=9.12.1
ENV PATH="$PNPM_HOME:$PATH"
RUN npm -g install pnpm@${PNPM_VERSION}

# Setup linux dependencies
RUN --mount=type=cache,target=/var/lib/apt/lists \
    --mount=type=cache,target=/var/cache/apt \
      rm -f /etc/apt/apt.conf.d/docker-clean \
      && apt-get update \
      && apt-get install -y wget curl ca-certificates

FROM base AS dependencies 

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
      pnpm install --prod --frozen-lock

FROM dependencies AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
      pnpm install --frozen-lock
COPY . .

# (Optional) Analytics
ARG PUBLIC_GTM_ID
ARG SENTRY_PROJECT
ARG SENTRY_DSN
ARG SENTRY_TOKEN
ARG SOURCE_COMMIT=$SOURCE_COMMIT
ARG SITE_URL

# Final build
ENV NODE_ENV=production
RUN printenv
RUN pnpm build

#############################
FROM base AS runtime

ENV NODE_ENV=production

COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/src/db ./src/db
COPY --from=build /app/src/config ./src/config

EXPOSE ${PORT}
CMD ["pnpm", "start"]
