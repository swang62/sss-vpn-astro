// Client-side and build/test variables (no process.env)
if (import.meta.env.DEV) console.debug("CLIENT_ENV", import.meta.env);

export const API_CLIENT_URL = import.meta.env.SITE; // config:SITE_URL

export const PUBLIC_GTM_ID = import.meta.env.PUBLIC_GTM_ID;
