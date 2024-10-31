import * as t from "drizzle-orm/sqlite-core";

export const product = t.sqliteTable("product", {
  createdAt: t
    .integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  id: t
    .text()
    .primaryKey(),
  name: t
    .text(),
  priceId: t
    .text()
    .notNull(),
  productId: t
    .text()
    .notNull(),
  updatedAt: t
    .integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type ProductInsert = Omit<typeof product.$inferInsert, "id" >;
