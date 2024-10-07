FROM node:22-bullseye-slim AS base

ENV HOST=0.0.0.0
ENV PORT=4321
ENV LITESTREAM="0.3.13"

WORKDIR /app

################################

ARG TARGETARCH
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*
RUN case "${TARGETARCH}" in \
    'amd64') \
      ARCH='amd64';; \
    'arm64') \
      ARCH='arm64';; \
    'arm') \
      ARCH='armv7';; \
    *) \
      echo "Unsupported architecture: ${TARGETARCH}"; exit 1 ;; \
    esac && \
    wget https://github.com/benbjohnson/litestream/releases/download/v${LITESTREAM}/litestream-v${LITESTREAM}-linux-${ARCH}.deb \
    && dpkg -i litestream-v${LITESTREAM}-linux-${ARCH}.deb \
    && rm litestream-v${LITESTREAM}-linux-${ARCH}.deb

#############################

COPY package.json pnpm-lock.yaml ./
RUN npm -g install pnpm nodemon

#############################

FROM base AS dependencies
RUN pnpm install --prod --frozen-lockfile

FROM base AS dev
RUN pnpm install --frozen-lockfile

FROM dev AS build
COPY . .
RUN pnpm build

#############################

FROM base AS runtime
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/build/litestream.sh ./litestream.sh

EXPOSE ${PORT}
CMD ["sh", "./litestream.sh"]
