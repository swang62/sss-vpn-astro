import createApp from "@/server/app";

import auth from "./routes/auth.route";
import base from "./routes/base.route";
import stripe from "./routes/stripe.route";
import user from "./routes/user.route";

const app = createApp();

// Routes
const _routes = app
  .route("/", base)
  .route("/user", user)
  .route("/auth", auth)
  .route("/stripe", stripe);

// Types
export default app;
export type App = typeof _routes;
