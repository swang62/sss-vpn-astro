import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const verification = sqliteTable("verification", {
  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  id: text().primaryKey(),
  identifier: text().notNull(),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),
  value: text().notNull(),
});
