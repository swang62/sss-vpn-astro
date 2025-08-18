FROM node:22-alpine AS base

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
RUN --mount=type=cache,target=/var/cache/apk apk add --update-cache \
      bash openssl wget curl ca-certificates

FROM base AS prod-dependencies 

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
      pnpm install \
        @libsql/client \
        better-auth \
        drizzle-kit \
        drizzle-orm \
        stripe \
        tsx \
        zod

FROM prod-dependencies AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
      pnpm install --frozen-lock

# Monitoring/analytics
ARG PUBLIC_GTM_ID
ARG PUBLIC_SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SOURCE_COMMIT
ARG SITE_URL

# Final production build to /dist
ENV NODE_ENV=production
RUN printenv

COPY . .
RUN --mount=type=secret,id=sentry_token,required \
    SENTRY_TOKEN=$(cat /run/secrets/sentry_token) \
    pnpm build

FROM base AS runtime

ENV NODE_ENV=production
EXPOSE ${PORT}

# Production deps
COPY --from=prod-dependencies /app/node_modules ./node_modules

COPY --from=build /app/*.json ./
COPY --from=build /app/*.yaml ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/build ./build
COPY --from=build /app/src ./src

# Drizzle-kit
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

# Entrypoint
ENTRYPOINT [ "/bin/bash", "-c", "./build/entrypoint.sh" ]
