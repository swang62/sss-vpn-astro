/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  interface Locals {
    session: import("@/lib/auth-client").Session;
    userSession: import("@/lib/auth-client").UserSession;
    user: import("@/db").User;
  }
}
