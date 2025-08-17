import * as Sentry from "@sentry/astro";

import { NODE_ENV, PUBLIC_SENTRY_DSN, SOURCE_COMMIT } from "@/config/client";

Sentry.init({
  attachStacktrace: true,
  dsn: PUBLIC_SENTRY_DSN,
  environment: NODE_ENV,
  ignoreErrors: ["TypeError: Illegal invocation"],
  registerEsmLoaderHooks: {
    exclude: ["drizzle-orm"],
  },
  release: SOURCE_COMMIT,
  sendDefaultPii: true,
});
