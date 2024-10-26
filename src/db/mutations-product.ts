import type Stripe from "stripe";

import db, { product as productTable } from "@/db";
import { stripe } from "@/lib/context";

export async function updateProduct(
  product: Stripe.Product,
) {
  const priceId = product.default_price as string;
  const price = await stripe.prices.retrieve(priceId);

  // Don't update products without lookup keys
  const lookupKey = price.lookup_key;
  if (!lookupKey) return;

  const data: typeof productTable.$inferInsert = {
    id: lookupKey.toLowerCase().trim(),
    name: product.name,
    priceId,
    productId: product.id,
  };

  await db.insert(productTable).values([data]).onConflictDoUpdate({
    set: data,
    target: productTable.id,
  });
}
