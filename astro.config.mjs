import node from "@astrojs/node";
import preact from "@astrojs/preact";
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
      external: [/.*\.test\..*/, /vitest.*/],
    },
  },
  integrations: [tailwind(), sitemap(), preact({ compat: true, devtools: true })],
  output: "hybrid",
  site: "https://sss-vpn.mildlybrewed.com",
});
