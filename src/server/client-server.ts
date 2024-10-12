import { hc } from "hono/client";

import env from "@/lib/env";

import type { App } from ".";

import { API_BASE_URL } from "./constants";

export const { api: apiServer } = hc<App>(API_BASE_URL, {
  headers: { Authorization: `Bearer ${env.API_TOKEN}` },
});
