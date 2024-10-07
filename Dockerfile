FROM node:22-bullseye-slim AS base

ENV NODE_ENV=production
ENV HOST=0.0.0.0

ARG PORT=4321
WORKDIR /app

################################

ENV LITESTREAM=0.3.13
ARG TARGETARCH
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*
RUN wget https://github.com/benbjohnson/litestream/releases/download/v${LITESTREAM}/litestream-v${LITESTREAM}-linux-${TARGETARCH}.deb \
    && dpkg -i litestream-v${LITESTREAM}-linux-${TARGETARCH}.deb \
    && rm litestream-v${LITESTREAM}-linux-${TARGETARCH}.deb

#############################

RUN npm -g install pnpm nodemon
COPY package.json pnpm-lock.yaml ./

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
