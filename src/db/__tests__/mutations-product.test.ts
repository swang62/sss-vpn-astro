import { eq } from "drizzle-orm";
import { beforeEach } from "vitest";
import { TEST_PRODUCT_IDS } from "@/__tests__/constants";
import { stripePrice } from "@/__tests__/fixtures/stripe";
import db, { product as productTable } from "@/db";
import { updateProduct } from "@/db/mutations-product";
import { stripe } from "@/lib/stripe";

vi.mock("@/lib/stripe", () => ({
  stripe: { prices: { retrieve: vi.fn() } },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateProduct", () => {
  it("skips when no default_price", async () => {
    await updateProduct({
      id: "prod_new",
      name: "New Plan",
      default_price: null,
      active: true,
    } as never);
    expect(stripe.prices.retrieve).not.toHaveBeenCalled();
  });

  it("skips when lookup key is not a paid plan", async () => {
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      stripePrice({ lookup_key: "trial", active: true }) as never
    );
    await updateProduct({
      id: "prod_new",
      name: "New Plan",
      default_price: "price_new",
      active: true,
    } as never);
    expect(stripe.prices.retrieve).toHaveBeenCalledWith("price_new");
  });

  it("skips when price is deleted", async () => {
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      // @ts-expect-error - `deleted` not in Stripe Price type but used by updateProduct
      stripePrice({ lookup_key: "pro", active: true, deleted: true }) as never
    );
    await updateProduct({
      id: "prod_new",
      name: "New Plan",
      default_price: "price_new",
      active: true,
    } as never);
  });

  it("skips when product is inactive", async () => {
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      stripePrice({ lookup_key: "pro", active: true }) as never
    );
    await updateProduct({
      id: "prod_new",
      name: "New Plan",
      default_price: "price_new",
      active: false,
    } as never);
  });

  it("skips when price is inactive", async () => {
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      stripePrice({ lookup_key: "pro", active: false }) as never
    );
    await updateProduct({
      id: "prod_new",
      name: "New Plan",
      default_price: "price_new",
      active: true,
    } as never);
  });

  it("inserts or updates a valid product", async () => {
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      stripePrice({
        lookup_key: "pro",
        active: true,
        product: TEST_PRODUCT_IDS.pro.productId,
      }) as never
    );

    await updateProduct({
      id: "prod_new",
      name: "New Plan",
      default_price: "price_new",
      active: true,
    } as never);

    const product = await db.query.product.findFirst({
      where: eq(productTable.id, "pro"),
    });
    expect(product?.name).toBe("New Plan");
  });
});
