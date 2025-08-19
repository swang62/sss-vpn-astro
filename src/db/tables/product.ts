import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { SubscriptionType } from "@/config/types";

export const product = sqliteTable("product", {
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  id: text().$type<SubscriptionType>().primaryKey(),
  name: text(),
  priceId: text().notNull(),
  productId: text().notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type ProductInsert = Omit<typeof product.$inferInsert, "id">;
