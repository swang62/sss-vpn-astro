import * as t from "drizzle-orm/sqlite-core";

import type { SubscriptionType } from "@/lib/types";

export const product = t.sqliteTable("product", {
  createdAt: t
    .integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  id: t
    .text("id")
    .$type<SubscriptionType | "router">()
    .notNull(),
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
