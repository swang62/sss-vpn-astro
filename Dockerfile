FROM node:22-slim AS base

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=4321
WORKDIR /app

# Setup PNPM
ENV PNPM_HOME="/pnpm"
ENV PNPM_VERSION=10.14.0
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

# Monitoring/analytics
ARG PUBLIC_GTM_ID
ARG PUBLIC_SENTRY_DSN
ARG SENTRY_PROJECT
ARG SOURCE_COMMIT
ARG SITE_URL

# Final production build to /dist
ENV NODE_ENV=production
RUN printenv
RUN --mount=type=secret,id=sentry_token \
    SENTRY_TOKEN=/run/secrets/sentry_token \
    pnpm build

FROM base AS runtime

ENV NODE_ENV=production
EXPOSE ${PORT}

# Astro production build
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

# Drizzle-kit migrations
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src/db ./src/db
COPY --from=build /app/src/config ./src/config
COPY --from=build /app/src/lib ./src/lib

# Entrypoint
ENTRYPOINT [ "./scripts/entrypoint.sh" ]
