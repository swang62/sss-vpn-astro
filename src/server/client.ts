import { hc } from "hono/client";

import type { App } from "@/server";

import { API_CLIENT_URL } from "@/env/client";

export const { api: apiClient } = hc<App>(API_CLIENT_URL);
