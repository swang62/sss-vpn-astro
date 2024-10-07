import type { APIRoute } from "astro";

import app from "@/server";

export const ALL: APIRoute = (context) => app.fetch(context.request);
