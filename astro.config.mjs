import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import compressor from "astro-compressor";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import sonda from "sonda/astro";
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
        mdi: ["face-cool"],
      },
    }),
    react(),
    sentry({
      authToken: process.env.SENTRY_TOKEN,
      enabled: !!process.env.SENTRY_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
    }),
    robotsTxt({
      policy: [
        {
          disallow: [
            "/_server-islands/*",
            "/api/*",
            "/dashboard",
            "/dashboard/*",
          ],
          userAgent: "*",
        },
      ],
    }),
    sitemap({
      filter: (page) => !page.includes("dashboard"),
    }),
    spotlightjs(),
    compressor(),
    sonda({
      filename: "bundle_analysis_[env]",
      open: false,
      outputDir: ".astro",
      server: false,
    }),
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
    optimizeDeps: {
      include: ["astro/toolbar"],
    },
    plugins: [tailwindcss({ nesting: true })],
    server: {
      allowedHosts: [".ngrok-free.dev", "192.168.8.129"],
    },
    sourcemap: process.env.NODE_ENV !== "production",
  },
});
