/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  interface Locals {
    session: import("@/lib/auth-clients").Session;
    userSession: import("@/lib/auth-clients").UserSession;
    user: import("@/db/queries").UserDB;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_GTM_ID: string;
  readonly PUBLIC_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
