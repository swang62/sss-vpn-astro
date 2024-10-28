import * as t from "drizzle-orm/sqlite-core";

export const product = t.sqliteTable("product", {
  createdAt: t
    .integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  id: t
    .text("id")
    .primaryKey(),
  name: t
    .text("name"),
  priceId: t
    .text("priceId")
    .notNull(),
  productId: t
    .text("productId")
    .notNull(),
  updatedAt: t
    .integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type ProductInsert = Omit<typeof product.$inferInsert, "id" >;
