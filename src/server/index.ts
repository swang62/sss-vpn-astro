import { hc } from "hono/client";

import env from "@/lib/env";

import createApp from "./app";
import base from "./base.route";
import user from "./user.route";

const app = createApp();

// Routes
const _routes = app
  .route("/", base)
  .route("/user", user);

// Types
export default app;
export type App = typeof _routes;
export const { api: apiServer } = hc<App>(env.API_BASE_URL, {
  headers: {
    Authorization: `Bearer ${env.API_TOKEN}`
  }
});
export const { api: apiClient } = hc<App>(env.API_BASE_URL);
