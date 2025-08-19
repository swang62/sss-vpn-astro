import createApp from "@/server/app";

import base from "./routes/base.route";
import hiddify from "./routes/hiddify.route";
import stripe from "./routes/stripe.route";
import user from "./routes/user.route";

const app = createApp();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/", base)
  .route("/hiddify", hiddify)
  .route("/stripe", stripe)
  .route("/user", user);

// Types
export default app;
export type App = typeof routes;
