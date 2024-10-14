/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { config } from "dotenv";
import path from "node:path";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "", process.cwd(), "");

export default getViteConfig(
  {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      env: config({ path: "./.env.test" }).parsed,
      globals: true,
      globalSetup: "./vitest.setup.ts",
    },
  },
  {
    site: env.SITE_URL,
  },
);
