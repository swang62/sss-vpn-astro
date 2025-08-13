import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import inoxToolswhen from "@inox-tools/astro-when";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
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
    inoxToolswhen(),
    icon({
      include: {
        lucide: ["*"],
        mdi: ["*"],
      },
    }),
    react(),
    sentry({
      bundleSizeOptimizations: {
        excludeReplayIframe: true,
        excludeReplayShadowDom: true,
        excludeReplayWorker: true,
      },
      clientInitPath: "./sentry.client.config.js",
      enabled: !!process.env.SENTRY_TOKEN && !!process.env.SENTRY_DSN,
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
          disallow: ["/api/*", "/dashboard", "/dashboard/*", "/debug"],
          userAgent: "*",
        },
      ],
    }),
    sitemap(),
    compressor(), // Must be last
  ],
  output: "server",
  server: {
    host: "0.0.0.0",
    port: 4321,
  },
  site: process.env.SITE_URL,
  vite: {
    build: {
      rollupOptions: {
        external: [/vitest.*/, /.*\.test\..*/],
      },
    },

    plugins: [tailwindcss()],
  },
});
