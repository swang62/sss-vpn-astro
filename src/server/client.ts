import { hc } from "hono/client";

import type { App } from ".";

import { CLIENT_API_URL } from "./constants";

export const { api: apiClient } = hc<App>(CLIENT_API_URL);
