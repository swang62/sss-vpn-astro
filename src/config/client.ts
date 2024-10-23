// Client-side and build/test variables (no process.env)
const isRuntime = !!import.meta.env;

if (import.meta.env?.DEV) console.debug("CLIENT_ENV", import.meta.env);

export const API_CLIENT_URL = isRuntime
  ? import.meta.env.SITE
  : process.env.SITE_URL || "";
export const PUBLIC_GTM_ID = isRuntime ? import.meta.env.PUBLIC_GTM_ID : "";
