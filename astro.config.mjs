import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import sentry from "@sentry/astro";
import compressor from "astro-compressor";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV || "production", process.cwd(), ""),
};

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  build: {
    assets: "_assets",
  },
  // ORDER MATTERS
  integrations: [
    icon({
      include: {
        lucide: ["*"],
        mdi: ["*"],
      },
    }),
    react(),
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
    sentry({
      bundleSizeOptimizations: {
        excludeReplayIframe: true,
        excludeReplayShadowDom: true,
        excludeReplayWorker: true,
      },
      dsn: process.env.SENTRY_DSN,
      enabled: !!process.env.SENTRY_TOKEN && !!process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.SOURCE_COMMIT || "default",
      serverInitPath: "./sentry.server.config.js",
      sourceMapsUploadOptions: {
        authToken: process.env.SENTRY_TOKEN,
        project: process.env.SENTRY_PROJECT,
      },
    }),
    robotsTxt({
      policy: [
        {
          allow: "/",
          disallow: ["/api/*", "/dashboard", "/dashboard/*"],
          userAgent: "*",
        },
      ],
    }),
    sitemap(),
    compressor({
      brotli: true,
      gzip: false,
    }),
  ],
  output: "server",
  server: {
    port: 4321,
  },
  site: process.env.SITE_URL,
  vite: {
    build: {
      rollupOptions: {
        external: [/vitest.*/, /.*\.test\..*/],
      },
    },
  },
});
