/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { config } from "dotenv";
import path from "node:path";

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
    site: "https://sss-vpn.mildlybrewed.com",
  },
);
