import { hc } from "hono/client";

import type { App } from ".";

import { API_BASE_URL } from "./constants";

export const { api: apiClient } = hc<App>(API_BASE_URL);
