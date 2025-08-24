import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import inoxToolswhen from "@inox-tools/astro-when";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import tailwindcss from "@tailwindcss/vite";
import compressor from "astro-compressor";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import Sonda from "sonda/astro";
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
        mdi: ["face-cool"],
      },
    }),
    react(),
    sentry({
      enabled: !!process.env.SENTRY_TOKEN,
      sourceMapsUploadOptions: {
        authToken: process.env.SENTRY_TOKEN,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        telemetry: false,
      },
    }),
    robotsTxt({
      policy: [
        {
          allow: "/",
          disallow: [
            "/login",
            "/signup",
            "*password*",
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
    Sonda({
      open: true,
      outputDir: ".astro",
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
    plugins: [tailwindcss({ nesting: true })],
    server: {
      allowedHosts: [
        "dazzling-breeze-21743.pktriot.net",
        "localhost",
        "127.0.0.1",
        "192.168.8.129",
      ],
    },
    sourcemap: true,
  },
});
