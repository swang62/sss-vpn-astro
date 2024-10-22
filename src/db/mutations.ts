import db, { profile as profileTable } from "@/db";

export async function setupNewUserProfile(id: string) {
  await db
    .insert(profileTable)
    .values([{ subscription: "trial", userId: id }])
    .onConflictDoNothing();
}
