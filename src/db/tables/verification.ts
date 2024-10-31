import * as t from "drizzle-orm/sqlite-core";

export const verification = t.sqliteTable("verification", {
  expiresAt: t
    .integer({ mode: "timestamp" })
    .notNull(),
  id: t
    .text()
    .primaryKey(),
  identifier: t
    .text()
    .notNull(),
  value: t
    .text()
    .notNull(),
});
