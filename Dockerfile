FROM node:22-bullseye-slim AS base

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ARG PORT=4321

WORKDIR /app

RUN npm -g install pnpm nodemon
RUN apt-get update \
  && apt-get install -y wget curl \
  && rm -rf /var/lib/apt/lists/*

#############################
FROM base AS dependencies 

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

#############################
FROM dependencies AS build

COPY . .
RUN pnpm build

#############################
FROM base AS runtime

COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/src/db ./src/db

EXPOSE ${PORT}
CMD ["nodemon", "./dist/server/entry.mjs"]
