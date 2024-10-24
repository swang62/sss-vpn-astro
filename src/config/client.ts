// Client-side and build/test variables (no process.env)
const isRuntime = !!import.meta.env;

if (import.meta.env?.DEV && import.meta.env?.MODE !== "test") {
  console.debug("CLIENT_ENV", import.meta.env);
}

export const SITE_URL = isRuntime
  ? import.meta.env.SITE
  : process.env.SITE_URL || "/";

export const PUBLIC_GTM_ID = isRuntime ? import.meta.env.PUBLIC_GTM_ID : "";
