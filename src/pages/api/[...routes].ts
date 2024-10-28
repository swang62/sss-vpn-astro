import type { APIRoute } from "astro";

import app from "@/server";

export const ALL: APIRoute = ctx => app.fetch(ctx.request);
