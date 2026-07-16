import { eq } from "drizzle-orm";
import { beforeEach } from "vitest";
import db, { profile as profileTable, user as userTable } from "@/db";
import { updateIpAddress, updateUser } from "@/db/mutations-user";
import type { UserDB } from "@/db/queries";
import { adminUser } from "@/db/seed";

function asUserDB(u: typeof adminUser): UserDB {
  return {
    ...u,
    profile: null,
    banned: u.banned as never,
    emailVerified: u.emailVerified as never,
    banExpires: null,
    banReason: null,
    image: null,
  } as UserDB;
}

const adminDB = asUserDB(adminUser);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateUser", () => {
  it("updates user name", async () => {
    const result = await updateUser(adminUser.id, "New Name");
    expect(result.name).toBe("New Name");
    await db
      .update(userTable)
      .set({ name: adminUser.name })
      .where(eq(userTable.id, adminUser.id));
  });

  it("truncates long name", async () => {
    const result = await updateUser(adminUser.id, "a".repeat(30));
    expect(result.name.length).toBeLessThanOrEqual(20);
  });
});

describe("updateIpAddress", () => {
  it("updates profile IP", async () => {
    await updateIpAddress(adminDB, "10.0.0.1");
    const profile = await db.query.profile.findFirst({
      where: eq(profileTable.userId, adminUser.id),
    });
    expect(profile?.lastKnownIpAddress).toBe("10.0.0.1");
  });
});
