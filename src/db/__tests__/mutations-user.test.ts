import { eq } from "drizzle-orm";
import { beforeEach } from "vitest";
import {
  TEST_HIDDIFY_ID,
  TEST_STRIPE_CUSTOMER_ID,
  TEST_USER_IP,
} from "@/__tests__/constants";
import db, { profile as profileTable, user as userTable } from "@/db";
import { setupNewUser, updateIpAddress, updateUser } from "@/db/mutations-user";
import type { UserDB } from "@/db/queries";
import { adminUser } from "@/db/seed";
import { stripe } from "@/lib/stripe";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: { create: vi.fn(), retrieve: vi.fn(), search: vi.fn() },
  },
}));

vi.mock("@/lib/axios", () => ({
  axiosHiddify: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

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

describe("setupNewUser", () => {
  it("uses existing profile from seed", async () => {
    const userWithProfile: UserDB = {
      ...adminDB,
      profile: {
        hiddifyId: TEST_HIDDIFY_ID,
        stripeCustomerId: TEST_STRIPE_CUSTOMER_ID,
      } as never,
    };
    vi.mocked(stripe.customers.retrieve).mockResolvedValueOnce({
      deleted: false,
      subscriptions: { data: [] },
    } as never);

    await setupNewUser(userWithProfile, TEST_USER_IP);
  });
});
