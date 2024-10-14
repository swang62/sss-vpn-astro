import { hc } from "hono/client";

import type { App } from "@/server";

import { API_SERVER_URL, API_TOKEN } from "@/env/server";

export const { api: apiServer } = hc<App>(API_SERVER_URL, {
  headers: { Authorization: `Bearer ${API_TOKEN}` },
});
