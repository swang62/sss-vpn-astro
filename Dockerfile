FROM node:lts AS base
ENV HOST=0.0.0.0
ENV PORT=4321
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm -g install pnpm nodemon

#############################
FROM base AS dependencies
RUN pnpm install --prod

#############################
FROM base AS devDependencies
RUN pnpm install

FROM devDependencies AS build
COPY . .
RUN npm run build

#############################
FROM base AS runtime
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 4321
CMD ["nodemon", "./dist/server/entry.mjs"]