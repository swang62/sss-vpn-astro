import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const product = sqliteTable("product", {
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  id: text().primaryKey(),
  name: text(),
  priceId: text().notNull(),
  productId: text().notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export type ProductInsert = Omit<typeof product.$inferInsert, "id">;
