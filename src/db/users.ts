import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";

import { profile } from "./profile";

export const users = table("users", {
  id: t.text()
    .primaryKey()
    .$defaultFn(createId),
  name: t.text(),
});

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profile),
}));
