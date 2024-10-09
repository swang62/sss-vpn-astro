import { Hono } from "hono";
import { hc } from "hono/client";

import type { Bindings } from "@/lib/types";

import env from "@/lib/env";

import base from "./base.route";
import { corsHandler, notFound, onError, pinoLogger } from "./middleware";

const app = new Hono<Bindings>({ strict: false }).basePath("/api");

// Middleware
app.use(pinoLogger());
app.use(corsHandler());
app.notFound(notFound);
app.onError(onError);

// Routes
const _routes = app.route("/", base);

// Types
export default app;
export type App = typeof _routes;
export const { api } = hc<App>(env.HOST_DOMAIN);
