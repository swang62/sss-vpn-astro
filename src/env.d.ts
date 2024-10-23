/// <reference path="../.astro/types.d.ts" />
declare namespace App {
  interface Locals {
    session: import("@/lib/clients").Session;
    userSession: import("@/lib/clients").UserSession;
  }
}
