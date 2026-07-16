import { eq } from "drizzle-orm";
import { beforeEach } from "vitest";
import { stripePrice, stripeSubscription } from "@/__tests__/fixtures/stripe";
import db, { profile as profileTable } from "@/db";
import {
  setSubscriptionRenew,
  updateSubscription,
} from "@/db/mutations-subscription";
import { adminUser } from "@/db/seed";
import { axiosHiddify } from "@/lib/axios";
import { stripe } from "@/lib/stripe";

const SUBSCRIPTION_ID = "sub_test";
const PRICE_ID = "price_test";

vi.mock("@/lib/stripe", () => ({
  stripe: { subscriptions: { update: vi.fn() }, prices: { retrieve: vi.fn() } },
}));

vi.mock("@/lib/axios", () => ({
  axiosHiddify: { get: vi.fn(), patch: vi.fn() },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("setSubscriptionRenew", () => {
  it("sets auto-renew true", async () => {
    await setSubscriptionRenew(SUBSCRIPTION_ID, true);
    expect(stripe.subscriptions.update).toHaveBeenCalledWith(SUBSCRIPTION_ID, {
      cancel_at_period_end: false,
    });
  });

  it("sets auto-renew false", async () => {
    await setSubscriptionRenew(SUBSCRIPTION_ID, false);
    expect(stripe.subscriptions.update).toHaveBeenCalledWith(SUBSCRIPTION_ID, {
      cancel_at_period_end: true,
    });
  });
});

describe("updateSubscription", () => {
  it("updates active subscription", async () => {
    const adminProfile = await db.query.profile.findFirst({
      where: eq(profileTable.userId, adminUser.id),
    });
    if (!adminProfile?.stripeCustomerId)
      throw new Error("Admin profile missing stripeCustomerId");

    if (!adminProfile.hiddifyId) {
      await db
        .update(profileTable)
        .set({ hiddifyId: "hid-test" })
        .where(eq(profileTable.userId, adminUser.id));
    }

    // Use a seeded product's priceId so the DB lookup inside updateSubscription succeeds
    const product = await db.query.product.findFirst();
    const priceId = product?.priceId || PRICE_ID;

    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      stripePrice({
        id: priceId,
        lookup_key: "basic",
        product: "prod_basic",
      }) as never
    );
    vi.mocked(axiosHiddify.patch).mockResolvedValueOnce({} as never);

    const sub = stripeSubscription({
      customer: adminProfile.stripeCustomerId,
      items: {
        data: [
          {
            id: "si_test",
            current_period_start: 1000000,
            current_period_end: 2000000,
            price: stripePrice({ id: priceId }),
          },
        ],
      },
    } as never);
    await updateSubscription(sub as never);
    expect(axiosHiddify.patch).toHaveBeenCalled();
  });

  it("skips update for non-active subscription", async () => {
    await updateSubscription(
      stripeSubscription({ status: "past_due" }) as never
    );
    expect(axiosHiddify.patch).not.toHaveBeenCalled();
  });
});
