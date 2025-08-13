import { push, remove, seed } from "@/db/seed";
import { sleep } from "@/lib/utils";

export async function setup() {
  await push();
  await sleep(1000);
  await seed();
}

export async function teardown() {
  await remove();
}
