/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { config } from "dotenv";
import path from "node:path";
import { loadEnv } from "vite";

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV || "test", process.cwd(), ""),
};

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
    site: process.env.SITE_URL,
  },
);
