import { hc } from "hono/client";

import env from "@/lib/env";

import createApp from "./app";
import { API_BASE_URL } from "./constants";
import base from "./routes/base.route";
import user from "./routes/user.route";

const app = createApp();

// Routes
const _routes = app.route("/", base).route("/user", user);

// Types
export default app;
export type App = typeof _routes;

export const { api: apiServer } = hc<App>(API_BASE_URL, {
  headers: {
    Authorization: `Bearer ${env.API_TOKEN}`,
  },
});
