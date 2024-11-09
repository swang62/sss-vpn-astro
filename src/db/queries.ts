import { eq } from "drizzle-orm";

import { HIDDIFY_SERVERS } from "@/config/constants";
import { HIDDIFY_SERVER_IDS, type HiddifyServerId, type HiddifyUser, type SubscriptionType } from "@/config/types";
import db, {
  product as productTable,
  profile as profileTable,
  user as userTable,
  verification as verificationTable,
} from "@/db";
import { axiosHiddify } from "@/lib/server-clients";

/// //////////////////// USER ///////////////////////

export async function getUserByEmail(email?: string) {
  if (!email) return;

  return await db.query.user.findFirst({
    where: eq(userTable.email, email.toLowerCase()),
  });
}

export async function getUserByToken(token?: string) {
  if (!token) return;

  const row = await db.query.verification.findFirst({
    where: eq(verificationTable.identifier, `reset-password:${token}`),
  });
  if (!row) return;

  return await db.query.user.findFirst({
    where: eq(userTable.id, row.value),
  });
}

export async function getUserById(id: string) {
  return await db.query.user.findFirst({
    where: eq(userTable.id, id),
    with: {
      profile: true,
    },
  });
}
export type UserDB = NonNullable<Awaited<ReturnType<typeof getUserById>>>;

/// //////////////////// PROFILE ///////////////////////

export async function getProfileById(id: string) {
  return await db.query.profile.findFirst({
    where: eq(profileTable.userId, id),
  });
}

export async function getProfileByStripeId(stripeCustomerId: string) {
  return await db.query.profile.findFirst({
    where: eq(profileTable.stripeCustomerId, stripeCustomerId),
    with: {
      user: true,
    },
  });
}

/// //////////////////// PRODUCT ///////////////////////

export async function getProductByKey(id?: SubscriptionType | "router") {
  if (!id) return;

  return await db.query.product.findFirst({
    where: eq(productTable.id, id),
  });
}

export async function getProductByPriceId(priceId?: string) {
  if (!priceId) return;

  return await db.query.product.findFirst({
    where: eq(productTable.priceId, priceId),
  });
}

/// //////////////////// HIDDIFY ///////////////////////

export async function findAvailableServer() {
  let id = "1" as HiddifyServerId;
  let minUsers = 10000;
  for (const serverId of HIDDIFY_SERVER_IDS) {
    const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
    const { data } = await axiosHiddify.get<HiddifyUser[]>(`${baseUrl}/admin/user`);
    const activeUsers = data.filter(users => users.enable).length;

    if (activeUsers < minUsers) {
      id = serverId;
      minUsers = activeUsers;
    }
  }

  return id;
}

export async function searchHiddifyUser(email?: string) {
  if (!email) return null;

  for (const serverId of HIDDIFY_SERVER_IDS) {
    const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
    const { data } = await axiosHiddify.get<HiddifyUser[]>(`${baseUrl}/admin/user`);
    const user = data.find(user => user.name === email);
    if (user) {
      return { hiddifyId: user.uuid, hiddifyServerId: serverId };
    }
  }

  return null;
}

export async function getHiddifyUsage(id: string, serverId: HiddifyServerId) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
  const { data } = await axiosHiddify.get<HiddifyUser>(`${baseUrl}/admin/user/${id}`);

  return data?.uuid ? data : null;
}
