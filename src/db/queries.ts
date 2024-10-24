import { eq } from "drizzle-orm";

import db, {
  profile as profileTable,
  user as userTable,
  verification as verificationTable,
} from "@/db";

export async function getProfileById(id: string) {
  const profile = await db.query.profile.findFirst({
    where: eq(profileTable.userId, id),
  });

  return profile;
}

export async function getUserByEmail(email: string) {
  if (!email) return;

  const user = await db.query.user.findFirst({
    where: eq(userTable.email, email.toLowerCase()),
  });

  return user;
}

export async function getUserByToken(token?: string) {
  if (!token) return;
  const search = `reset-password:${token}`;
  const row = await db.query.verification.findFirst({
    where: eq(verificationTable.identifier, search),
  });

  if (!row) return;
  const user = await db.query.user.findFirst({
    where: eq(userTable.id, row.value),
  });

  return user;
}

export async function getUserById(id: string) {
  const user = await db.query.user.findFirst({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    where: eq(userTable.id, id),
    with: {
      profile: {
        columns: {
          subscription: true,
        },
      },
    },
  });

  return user;
}
