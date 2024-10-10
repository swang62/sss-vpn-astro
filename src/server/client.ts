import { hc } from "hono/client";

import { API_BASE_URL } from "@/lib/constants";

import type { App } from "./index";

export const { api: apiClient } = hc<App>(API_BASE_URL);
