import { hc } from "hono/client";

import env from "@/lib/env";

import type { App } from ".";

import { SERVER_API_URL } from "./constants";

export const { api: apiServer } = hc<App>(SERVER_API_URL, {
  headers: { Authorization: `Bearer ${env.API_TOKEN}` },
});
