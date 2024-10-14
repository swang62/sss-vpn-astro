import node from "@astrojs/node";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import sentry from "@sentry/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV, process.cwd(), "");

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
      dsn: env.SENTRY_DSN,
      enabled: !!env.SENTRY_TOKEN && !!env.SENTRY_DSN,
      environment: env.NODE_ENV,
      release: env.SOURCE_COMMIT || "default",
      sourceMapsUploadOptions: {
        authToken: env.SENTRY_TOKEN,
        project: env.SENTRY_PROJECT || "default",
      },
    }),
  ],
  output: "hybrid",
  site: env.SITE_URL,
  vite: {
    build: {
      rollupOptions: {
        external: [/vitest.*/, /.*\.test\..*/],
      },
    },
  },
});
