import { Hono } from "hono";
import { hc } from "hono/client";

import { BASE_DOMAIN } from "@/constants";

import base from "./base";
import { corsHandler, notFound, onError } from "./middleware";

// Initialize
const app = new Hono({ strict: false }).basePath("/api");

// Middlewares
app.use(corsHandler());
app.notFound(notFound);
app.onError(onError);

// Routes
const _routes = app.route("/", base);

// Types
export default app;
export type App = typeof _routes;

export const { api } = hc<App>(BASE_DOMAIN);
