import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { users } from "./users";

export const profile = table("profile", {
  created_at: t.text()
    .notNull()
    .default(sql`(current_timestamp)`),
  role: t.text()
    .notNull()
    .$type<"guest" | "sub" | "admin">()
    .default("guest"),
  subscription_type: t.text()
    .$type<"low" | "high" | "router">(),
  updated_at: t.text()
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
  user_id: t.text().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const ProfileRelations = relations(profile, ({ one }) => ({
  user: one(users, {
    fields: [profile.user_id],
    references: [users.id]
  }),
}));

export const ProfileSchema = createInsertSchema(profile)
  .required({
    user_id: true,
  })
  .omit({
    created_at: true,
    updated_at: true,
  });
