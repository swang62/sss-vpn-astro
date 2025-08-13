import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { HiddifyServerId, SubscriptionType } from "@/config/types";

import { user } from "./user";

export const profile = sqliteTable("profile", {
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  hiddifyId: text()
    .primaryKey()
    .notNull(),
  hiddifyServerId: text()
    .notNull()
    .$type<HiddifyServerId>()
    .default("1"),
  purchasedRouter: integer({ mode: "boolean" })
    .notNull()
    .default(false),
  stripeCustomerId: text()
    .notNull(),
  subscriptionEndAt: integer({ mode: "timestamp_ms" }),
  subscriptionId: text(),
  subscriptionItemId: text(),
  subscriptionStartAt: integer({ mode: "timestamp_ms" }),
  subscriptionType: text()
    .notNull()
    .$type<SubscriptionType>()
    .default("none"),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
  userId: text()
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const ProfileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));

export type ProfileInsert = Omit<typeof profile.$inferInsert, "userId">;
