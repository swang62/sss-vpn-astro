import * as t from "drizzle-orm/sqlite-core";

export const verification = t.sqliteTable("verification", {
  expiresAt: t.integer("expiresAt", { mode: "timestamp" }).notNull(),
  id: t.text("id").primaryKey(),
  identifier: t.text("identifier").notNull(),
  value: t.text("value").notNull(),
});
