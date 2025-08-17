import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const verification = sqliteTable("verification", {
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  id: text().primaryKey(),
  identifier: text().notNull(),
  updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  value: text().notNull(),
});

export const VerificationRelations = relations(verification, ({ one }) => ({
  user: one(user, {
    fields: [verification.value],
    references: [user.id],
  }),
}));
