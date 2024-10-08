import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";

export const users = table("users", {
  id: t.text()
    .primaryKey()
    .$defaultFn(createId),
  name: t.text(),
});

export const profile = table(
  "profile",
  {
    created_at: t.text()
      .notNull()
      .default(sql`(current_timestamp)`),
    id: t.text()
      .primaryKey()
      .$defaultFn(createId),
    role: t.text()
      .notNull()
      .$type<"user" | "admin">()
      .default("user"),
    subscription: t.integer({ mode: "boolean" })
      .notNull()
      .default(false),
    subscription_type: t.text()
      .$type<"low" | "high" | "router">(),
    updated_at: t.text()
      .notNull()
      .default(sql`(current_timestamp)`)
      .$onUpdate(() => sql`(current_timestamp)`),
    user_id: t.text().references(() => users.id, { onDelete: "cascade" }),
  }
);

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profile),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(users, { fields: [profile.user_id], references: [users.id] }),
}));
