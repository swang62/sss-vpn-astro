import db, { product as productTable } from "@/db";
import { stripe } from "@/lib/context";

const { data } = await stripe.prices.list();

for (const price of data) {
  const priceId = price.id;

  // Don't update products without lookup keys or have been deleted
  const lookupKey = price.lookup_key?.toLowerCase().trim();
  if (!lookupKey || !price.active || price.deleted) continue;

  const data = {
    name: lookupKey,
    priceId,
    productId: price.product as string,
  };

  await db.insert(productTable).values([{ ...data, id: lookupKey }]).onConflictDoUpdate({
    set: data,
    target: productTable.id,
  });
}
