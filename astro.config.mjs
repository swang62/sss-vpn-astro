import node from "@astrojs/node";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// import { loadEnv } from "vite";
// const { SECRET_CONFIG } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  build: {
    rollupOptions: {
      external: ["**/*.test.*"],
    },
  },
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),

  ],
  output: "server",
  site: "https://sss-vpn.mildlybrewed.com"
});
