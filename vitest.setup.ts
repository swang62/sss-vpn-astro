import {
  adminUser,
  deleteDB,
  migrate,
  seed,
  seedMockTables,
  testUser,
} from "@/db/seed";

export async function setup() {
  await migrate();
  await seed();
  await seedMockTables();
}

export async function teardown() {
  await deleteDB();
}
