// Client-side and build/javascript variables
// Does not work in config files!

const isBrowserRuntime = !!import.meta?.env;
if (isBrowserRuntime) {
  if (import.meta?.env.MODE !== "test") {
    console.debug("CLIENT_ENV", import.meta.env);
  }
}

export const PUBLIC_GTM_ID = isBrowserRuntime
  ? import.meta.env.PUBLIC_GTM_ID
  : process.env.PUBLIC_GTM_ID || "";

export const PUBLIC_SENTRY_DSN = isBrowserRuntime
  ? import.meta.env.PUBLIC_SENTRY_DSN
  : process.env.PUBLIC_SENTRY_DSN || "";

export const PUBLIC_TURNSTILE_SITEKEY = isBrowserRuntime
  ? import.meta.env.PUBLIC_TURNSTILE_SITEKEY
  : process.env.PUBLIC_TURNSTILE_SITEKEY || "";

export const NODE_ENV = isBrowserRuntime
  ? import.meta.env.MODE
  : process.env.NODE_ENV;

export const SOURCE_COMMIT = isBrowserRuntime
  ? "default"
  : process.env.SOURCE_COMMIT;

export const SITE_URL = isBrowserRuntime
  ? import.meta.env.SITE
  : process.env.SITE_URL || "/";
