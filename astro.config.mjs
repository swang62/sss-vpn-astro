/* eslint-disable node/prefer-global/process */
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const { SENTRY_DSN = "", SENTRY_TOKEN = "" } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  build: {
    rollupOptions: {
      external: [/^vitest.*/],
    },
  },
  image: {
    domains: ["picsum.photos"],
  },
  integrations: [
    tailwind(),
    sitemap(),
    preact({ compat: true, devtools: true }),
    sentry({
      dsn: SENTRY_DSN,
      enabled: !!SENTRY_TOKEN && !!SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.SOURCE_COMMIT || "default",
      sourceMapsUploadOptions: {
        authToken: SENTRY_TOKEN,
        project: "sss-vpn",
      },
    }),
  ],
  output: "hybrid",
  site: "https://sss-vpn.mildlybrewed.com",
});
