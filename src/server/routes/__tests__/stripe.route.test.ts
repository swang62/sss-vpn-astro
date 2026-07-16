import { eq } from "drizzle-orm";
import { testClient } from "hono/testing";
import { TEST_STRIPE_CUSTOMER_ID_ADMIN } from "@/__tests__/constants";
import {
  stripeBillingPortalSession,
  stripeCheckoutSession,
  stripeCustomer,
  stripeEvent,
  stripePrice,
  stripeSubscription,
} from "@/__tests__/fixtures/stripe";
import { DATA_PACKAGE_PRICE } from "@/config/constants";
import db, { profile as profileTable } from "@/db";
import { adminUser } from "@/db/seed";
import { parseApi } from "@/lib/api-clients";
import { stripe } from "@/lib/stripe";
import createApp from "@/server/app";

import stripeRouter from "../stripe.route";
import { testAdminMiddleware, testUserMiddleware } from "./shared";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: { retrieve: vi.fn() },
    checkout: { sessions: { create: vi.fn() } },
    billingPortal: { sessions: { create: vi.fn() } },
    subscriptions: { update: vi.fn() },
    prices: { retrieve: vi.fn() },
    webhooks: { constructEventAsync: vi.fn() },
  },
}));

vi.mock("@/lib/axios", () => ({
  axiosHiddify: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const apiNoAuth = testClient(createApp().route("/", stripeRouter)).api;
const apiAdmin = testClient(
  createApp().use(testAdminMiddleware).route("/", stripeRouter)
).api;
const apiUser = testClient(
  createApp().use(testUserMiddleware).route("/", stripeRouter)
).api;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/stripe/user", () => {
  it("no auth", async () => {
    const result = await parseApi(apiNoAuth.user.$get, {});
    expect(result.ok).toBe(false);
  });

  it("returns Stripe customer", async () => {
    vi.mocked(stripe.customers.retrieve).mockResolvedValueOnce(
      stripeCustomer({ id: TEST_STRIPE_CUSTOMER_ID_ADMIN }) as never
    );

    const result = await parseApi(apiAdmin.user.$get, {});
    expect(result.ok).toBe(true);
    expect(result.data?.customer?.id).toBe(TEST_STRIPE_CUSTOMER_ID_ADMIN);
    expect(stripe.customers.retrieve).toHaveBeenCalledWith(
      expect.stringContaining("cus_")
    );
  });
});

describe("POST /api/stripe/checkout", () => {
  it("no auth", async () => {
    const result = await parseApi(apiNoAuth.checkout.$post, {
      json: { monthly: true, plan: "pro" },
    });
    expect(result.ok).toBe(false);
  });

  it("invalid body", async () => {
    const result = await parseApi(apiAdmin.checkout.$post, {
      json: { monthly: "yes" as never },
    });
    expect(result.ok).toBe(false);
  });

  it("creates subscription checkout", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce(
      stripeCheckoutSession() as never
    );

    const result = await parseApi(apiAdmin.checkout.$post, {
      json: { monthly: true, plan: "basic" },
    });
    expect(result.ok).toBe(true);
    expect(result.data?.url).toBe("https://checkout.stripe.com/test");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: expect.any(String), quantity: 1 }],
        mode: "subscription",
      })
    );
  });

  it("premium plan adds router when not purchased", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce(
      stripeCheckoutSession() as never
    );

    await parseApi(apiAdmin.checkout.$post, {
      json: { monthly: false, plan: "premium" },
    });
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          { price: expect.any(String), quantity: 1 },
          { price: expect.any(String), quantity: 1 },
        ],
      })
    );
  });

  it("premium plan skips router if already purchased", async () => {
    await db
      .update(profileTable)
      .set({ purchasedRouter: true })
      .where(eq(profileTable.userId, adminUser.id));
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce(
      stripeCheckoutSession() as never
    );

    await parseApi(apiAdmin.checkout.$post, {
      json: { monthly: false, plan: "premium" },
    });
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: expect.any(String), quantity: 1 }],
      })
    );
  });
});

describe("POST /api/stripe/add-data", () => {
  it("no auth", async () => {
    const result = await parseApi(apiNoAuth["add-data"].$post);
    expect(result.ok).toBe(false);
  });

  it("creates data add-on checkout", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce(
      stripeCheckoutSession() as never
    );

    const result = await parseApi(apiAdmin["add-data"].$post);
    expect(result.ok).toBe(true);
    expect(result.data?.url).toBe("https://checkout.stripe.com/test");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: DATA_PACKAGE_PRICE * 100,
            }),
          }),
        ],
        mode: "payment",
      })
    );
  });

  it("rejects trial user (no subscription)", async () => {
    const result = await parseApi(apiUser["add-data"].$post);
    expect(result.ok).toBe(false);
  });
});

describe("POST /api/stripe/buy-router", () => {
  it("no auth", async () => {
    const result = await parseApi(apiNoAuth["buy-router"].$post);
    expect(result.ok).toBe(false);
  });

  it("creates router checkout", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValueOnce(
      stripeCheckoutSession() as never
    );

    const result = await parseApi(apiAdmin["buy-router"].$post);
    expect(result.ok).toBe(true);
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: expect.any(String), quantity: 1 }],
        mode: "payment",
      })
    );
  });
});

describe("POST /api/stripe/customer-portal", () => {
  it("no auth", async () => {
    const result = await parseApi(apiNoAuth["customer-portal"].$post);
    expect(result.ok).toBe(false);
  });

  it("default portal (no plan)", async () => {
    vi.mocked(stripe.billingPortal.sessions.create).mockResolvedValueOnce(
      stripeBillingPortalSession() as never
    );

    const result = await parseApi(apiAdmin["customer-portal"].$post);
    expect(result.ok).toBe(true);
    expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: expect.stringContaining("cus_"),
        return_url: expect.stringContaining("/dashboard/account"),
      })
    );
  });

  it("upgrade portal with plan", async () => {
    vi.mocked(stripe.billingPortal.sessions.create).mockResolvedValueOnce(
      stripeBillingPortalSession() as never
    );

    const result = await parseApi(apiAdmin["customer-portal"].$post, {
      json: { plan: "premium" },
    });
    expect(result.ok).toBe(true);
    expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        flow_data: expect.objectContaining({
          type: "subscription_update_confirm",
        }),
      })
    );
  });
});

describe("POST /api/stripe/renew-plan", () => {
  it("no auth", async () => {
    const result = await parseApi(apiNoAuth["renew-plan"].$post, {
      json: { renew: true },
    });
    expect(result.ok).toBe(false);
  });

  it("updates subscription renew", async () => {
    vi.mocked(stripe.subscriptions.update).mockResolvedValueOnce({} as never);

    const result = await parseApi(apiAdmin["renew-plan"].$post, {
      json: { renew: true },
    });
    expect(result.ok).toBe(true);
    expect(stripe.subscriptions.update).toHaveBeenCalledWith(
      expect.stringContaining("sub_"),
      { cancel_at_period_end: false }
    );
  });

  it("rejects free plan for admin modified to trial", async () => {
    await db
      .update(profileTable)
      .set({
        subscriptionType: "trial",
        subscriptionId: null,
        subscriptionItemId: null,
      })
      .where(eq(profileTable.userId, adminUser.id));

    const result = await parseApi(apiAdmin["renew-plan"].$post, {
      json: { renew: true },
    });
    expect(result.ok).toBe(false);
  });

  it("rejects trial user (no subscription)", async () => {
    const result = await parseApi(apiUser["renew-plan"].$post, {
      json: { renew: true },
    });
    expect(result.ok).toBe(false);
  });
});

describe("POST /api/stripe/webhook", () => {
  async function sendWebhook(event: object) {
    const baseApp = createApp().route("/", stripeRouter);
    const res = await baseApp.fetch(
      new Request("http://localhost/api/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "stripe-signature": "test_sig",
        },
        body: JSON.stringify(event),
      })
    );
    return { status: res.status, data: await res.json() };
  }

  it("missing signature returns 400", async () => {
    const baseApp = createApp().route("/", stripeRouter);
    const res = await baseApp.fetch(
      new Request("http://localhost/api/webhook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      })
    );
    expect(res.status).toBe(400);
  });

  it("invoice.paid subscription_cycle resets usage", async () => {
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({
        type: "invoice.paid",
        data: {
          object: {
            billing_reason: "subscription_cycle",
            customer: "cus_SsAOatPHYB9h7v",
          },
        },
      }) as never
    );
    const { status } = await sendWebhook({
      type: "invoice.paid",
      data: {
        object: {
          billing_reason: "subscription_cycle",
          customer: "cus_SsAOatPHYB9h7v",
        },
      },
    });
    expect(status).toBe(200);
  });

  it("invoice.paid subscription_create handles purchases", async () => {
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({
        type: "invoice.paid",
        data: {
          object: {
            billing_reason: "subscription_create",
            customer: "cus_SsAOatPHYB9h7v",
            lines: { data: [] },
          },
        },
      }) as never
    );
    const { status } = await sendWebhook({
      type: "invoice.paid",
      data: {
        object: {
          billing_reason: "subscription_create",
          customer: "cus_SsAOatPHYB9h7v",
          lines: { data: [] },
        },
      },
    });
    expect(status).toBe(200);
  });

  it("checkout.session.completed sets auto-renew", async () => {
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({
        type: "checkout.session.completed",
        data: {
          object: {
            subscription: "sub_new",
            customer: "cus_SsAOatPHYB9h7v",
            custom_fields: [{ key: "auto_renew", dropdown: { value: "yes" } }],
            status: "complete",
          },
        },
      }) as never
    );
    vi.mocked(stripe.subscriptions.update).mockResolvedValueOnce({} as never);
    const { status } = await sendWebhook({
      type: "checkout.session.completed",
      data: {
        object: {
          subscription: "sub_new",
          customer: "cus_SsAOatPHYB9h7v",
          custom_fields: [{ key: "auto_renew", dropdown: { value: "yes" } }],
          status: "complete",
        },
      },
    });
    expect(status).toBe(200);
    expect(stripe.subscriptions.update).toHaveBeenCalledWith("sub_new", {
      cancel_at_period_end: false,
    });
  });

  it("customer.updated syncs name", async () => {
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({
        type: "customer.updated",
        data: { object: { id: "cus_SsAOatPHYB9h7v" } },
      }) as never
    );
    const { status } = await sendWebhook({
      type: "customer.updated",
      data: { object: { id: "cus_SsAOatPHYB9h7v" } },
    });
    expect(status).toBe(200);
  });

  it("customer.subscription.updated", async () => {
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

    const product = await db.query.product.findFirst();
    const priceId = product?.priceId || "price_test";

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
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({
        type: "customer.subscription.updated",
        data: { object: sub },
      }) as never
    );
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      stripePrice({
        id: priceId,
        lookup_key: "basic",
        product: "prod_basic",
      }) as never
    );
    const { status } = await sendWebhook({
      type: "customer.subscription.updated",
      data: { object: sub },
    });
    expect(status).toBe(200);
  });

  it("customer.subscription.deleted", async () => {
    const adminProfile = await db.query.profile.findFirst({
      where: eq(profileTable.userId, adminUser.id),
    });
    if (!adminProfile?.stripeCustomerId)
      throw new Error("Admin profile missing stripeCustomerId");

    const sub = stripeSubscription({
      customer: adminProfile.stripeCustomerId,
      id: "sub_test",
      status: "canceled",
    });
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({
        type: "customer.subscription.deleted",
        data: { object: sub },
      }) as never
    );
    const { status } = await sendWebhook({
      type: "customer.subscription.deleted",
      data: { object: sub },
    });
    expect(status).toBe(200);
  });

  it("product.created syncs product", async () => {
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({
        type: "product.created",
        data: {
          object: {
            id: "prod_new",
            name: "New Plan",
            default_price: "price_new",
            active: true,
          },
        },
      }) as never
    );
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      stripePrice({
        id: "price_new",
        lookup_key: "basic",
        product: "prod_new",
      }) as never
    );
    const { status } = await sendWebhook({
      type: "product.created",
      data: {
        object: {
          id: "prod_new",
          name: "New Plan",
          default_price: "price_new",
          active: true,
        },
      },
    });
    expect(status).toBe(200);
  });

  it("unknown event type returns 200 with failure message", async () => {
    vi.mocked(stripe.webhooks.constructEventAsync).mockResolvedValueOnce(
      stripeEvent({ type: "unknown.event", data: { object: {} } }) as never
    );
    const { status, data } = await sendWebhook({
      type: "unknown.event",
      data: { object: {} },
    });
    expect(status).toBe(200);
    expect(data).toEqual({ message: "Failed to process" });
  });
});
