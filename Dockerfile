FROM node:22-bullseye AS base
ENV HOST=0.0.0.0
ENV PORT=4321
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm -g install pnpm nodemon

#############################
FROM base AS dependencies
RUN pnpm install --prod

#############################
FROM base AS dev
RUN pnpm install

FROM dev AS build
COPY . .
RUN pnpm build

#############################
FROM base AS runtime
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 4321
CMD ["pnpm", "start"]