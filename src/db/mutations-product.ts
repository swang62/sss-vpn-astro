import type Stripe from "stripe";

import db, { type ProductInsert, product as productTable } from "@/db";
import { stripe } from "@/lib/server-clients";

export async function updateProduct(
  product: Stripe.Product,
) {
  const priceId = product.default_price as string;
  const price = await stripe.prices.retrieve(priceId);

  // Don't update products without lookup keys or have been deleted
  const lookupKey = price.lookup_key?.toLowerCase().trim();
  if (!lookupKey || !product.active) return;

  const data: ProductInsert = {
    name: product.name,
    priceId,
    productId: product.id,
  };

  await db.insert(productTable).values([{ ...data, id: lookupKey }]).onConflictDoUpdate({
    set: data,
    target: productTable.id,
  });
}
