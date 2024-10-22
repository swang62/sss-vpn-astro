import { eq } from "drizzle-orm";

import db, { profile as profileTable, user as userTable } from "@/db";

export async function getProfileFromDB(id: string) {
  const profile = await db.query.profile.findFirst({
    where: eq(profileTable.userId, id),
  });

  return profile;
}

export async function getUserFromDB(id: string) {
  const user = await db.query.user.findFirst({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    where: eq(userTable.id, id),
    with: {
      profile: {
        columns: {
          createdAt: false,
          updatedAt: false,
        },
      },
    },
  });

  return user;
}
