import { push, remove, seed } from "@/db/seed";

export async function setup() {
  await push();
  await seed();
}

export async function teardown() {
  await remove();
}
