import { hc } from "hono/client";

import { API_BASE_URL } from "@/lib/constants";
import env from "@/lib/env";

import createApp from "./app";
import base from "./base.route";

const app = createApp();

// Routes
const _routes = app.route("/", base);

// Types
export default app;
export type App = typeof _routes;

export const { api: apiServer } = hc<App>(API_BASE_URL, {
  headers: {
    Authorization: `Bearer ${env.API_TOKEN}`
  }
});
