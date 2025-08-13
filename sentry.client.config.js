import * as Sentry from "@sentry/astro";

Sentry.init({
  attachStacktrace: true,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  ignoreErrors: ["TypeError: Illegal invocation"],
  registerEsmLoaderHooks: {
    exclude: ["drizzle-orm"],
    onlyIncludeInstrumentedModules: true,
  },
  release: process.env.SOURCE_COMMIT || "default",
  sendDefaultPii: true,
});
