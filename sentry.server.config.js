import * as Sentry from "@sentry/astro";

const dsn = process.env.SENTRY_DSN;

Sentry.init({
  attachStacktrace: true,
  dsn,
  ignoreErrors: ["TypeError: Illegal invocation"],
  registerEsmLoaderHooks: {
    exclude: ["drizzle-orm"],
    onlyIncludeInstrumentedModules: true,
  },
});
