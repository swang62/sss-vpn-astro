import type { GlobalSetupContext } from "vitest/node";

import { push, remove, seed } from "@/db/seed";

export async function setup({ provide: _provide }: GlobalSetupContext) {
  await push();
  await seed();

  // _provide("randomGlobalVariable", "value");
}

export async function teardown() {
  await remove();
}

declare module "vitest" {
  export interface ProvidedContext {
    randomGlobalVariable: string;
  }
}
