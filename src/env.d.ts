/// <reference path="../.astro/types.d.ts" />
/// <reference types="simple-stack-form/types" />
declare namespace App {
  interface Locals {
    session: import("@/lib/clients").Session;
    userSession: import("@/lib/clients").UserSession;
  }
}
