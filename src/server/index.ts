import { hc } from "hono/client";

import env from "@/lib/env";

import createApp from "./app";
import base from "./base.route";

const app = createApp();

// Routes
const _routes = app.route("/", base);

// Types
export default app;
export type App = typeof _routes;
export const { api } = hc<App>(env.HOST_DOMAIN);
