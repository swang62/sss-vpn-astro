import type Stripe from "stripe";

import type { ProductInsert } from "@/db";

import { PAID_PLANS, type PaidPlan } from "@/config/types";
import db, { product as productTable } from "@/db";
import { stripe } from "@/lib/payments";

export async function updateProduct(product: Stripe.Product) {
  const priceId = product.default_price as string;
  const price = await stripe.prices.retrieve(priceId);

  // Don't update products without lookup keys or have been deleted
  const lookupKey = price.lookup_key?.toLowerCase().trim();
  if (
    !PAID_PLANS.includes(lookupKey as PaidPlan) ||
    !price.active ||
    price.deleted ||
    !product.active
  ) {
    return;
  }

  const data: ProductInsert = {
    name: product.name,
    priceId,
    productId: product.id,
  };

  await db
    .insert(productTable)
    .values([{ ...data, id: lookupKey as PaidPlan }])
    .onConflictDoUpdate({
      set: data,
      target: productTable.id,
    });
}
