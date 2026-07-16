import { deleteDB, migrate, seed, seedMockTables } from "@/db/seed";

export async function setup() {
  await migrate();
  await seed();
  await seedMockTables();
}

export async function teardown() {
  await deleteDB();
}
