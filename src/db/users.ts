import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { profile } from "./profile";

export const users = table("users", {
  id: t.text()
    .primaryKey()
    .$defaultFn(createId),
  name: t.text(),
});

export const UsersRelations = relations(users, ({ one }) => ({
  profile: one(profile),
}));

export const UsersSchema = createInsertSchema(users, {
  name: schema => schema.name.max(200)
})
  .omit({
    id: true,
  });
