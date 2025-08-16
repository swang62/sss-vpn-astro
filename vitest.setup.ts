import { deleteDB, migrate, seed } from "@/db/seed";

export async function setup() {
  await migrate();
  await seed();
}

export async function teardown() {
  await deleteDB();
}
