FROM node:22-bullseye-slim AS base

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ARG PORT=4321

WORKDIR /app

RUN apt-get update \
  && apt-get install -y wget curl \
  && rm -rf /var/lib/apt/lists/*

#############################
FROM base AS dependencies 

RUN npm -g install pnpm nodemon
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

#############################
FROM dependencies AS build

COPY . .
RUN pnpm build

#############################
FROM build AS runtime

EXPOSE ${PORT}
CMD ["pnpm", "start"]
