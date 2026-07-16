import { setupNewUser } from "@/db/mutations-user";
import { getUserById } from "@/db/queries";
import {
  adminUser,
  deleteDB,
  migrate,
  seed,
  syncProducts,
  testUser,
} from "@/db/seed";

export async function setup() {
  await migrate();
  await seed();
  await syncProducts();

  for (const u of [adminUser, testUser]) {
    const user = await getUserById(u.id);
    if (user?.email) {
      await setupNewUser(user, "192.168.8.129").catch((e) =>
        console.debug("setupNewUser skipped for", u.email, ":", e.message)
      );
    }
  }
}

export async function teardown() {
  await deleteDB();
}
