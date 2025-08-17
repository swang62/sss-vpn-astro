/// <reference types="vitest" />

import { config } from "dotenv";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV || "test", process.cwd(), ""),
};

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    env: config({ path: "./.env.test" }).parsed,
    globals: true,
    globalSetup: ["./vitest.setup.ts"],
  },
});
