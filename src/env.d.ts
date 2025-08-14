/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  interface Locals {
    session: import("@/lib/auth-clients").Session;
    userSession: import("@/lib/auth-clients").UserSession;
    user: import("@/db/queries").UserDB;
  }
}
