import node from "@astrojs/node";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

process.env = { ...process.env, ...loadEnv(process.env.NODE_ENV || "production", process.cwd(), "") };

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  build: {
    assets: "_assets",
  },
  image: {
    domains: ["picsum.photos"],
  },
  integrations: [
    tailwind(),
    sitemap(),
    preact({ compat: true, devtools: true }),
    sentry({
      dsn: process.env.SENTRY_DSN,
      enabled: !!process.env.SENTRY_TOKEN && !!process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.SOURCE_COMMIT || "default",
      sourceMapsUploadOptions: {
        authToken: process.env.SENTRY_TOKEN,
        project: process.env.SENTRY_PROJECT,
      },
    }),
  ],
  output: "hybrid",
  site: process.env.SITE_URL,
  vite: {
    build: {
      rollupOptions: {
        external: [/vitest.*/, /.*\.test\..*/],
      },
    },
  },
});
