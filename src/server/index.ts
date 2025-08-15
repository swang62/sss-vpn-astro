import { auth } from "@/lib/auth";
import createApp, { createBaseRouter } from "@/server/app";

import base from "./routes/base.route";
import hiddify from "./routes/hiddify.route";
import stripe from "./routes/stripe.route";
import user from "./routes/user.route";

const app = createApp();

// Required route for better-auth
const authRoute = createBaseRouter()
  .all("/*", c => auth.handler(c.req.raw));

// Routes
const _routes = app
  .route("/", base)
  .route("/auth", authRoute)
  .route("/hiddify", hiddify)
  .route("/stripe", stripe)
  .route("/user", user);

// Types
export default app;
export type App = typeof _routes;
