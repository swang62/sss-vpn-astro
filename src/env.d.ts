/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  interface Locals {
    session: import("@/lib/api-clients").Session;
    userSession: import("@/lib/api-clients").UserSession;
  }
}
