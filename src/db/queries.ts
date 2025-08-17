import { eq } from "drizzle-orm";

import type { HiddifyServerId, HiddifyUser, SubscriptionType } from "@/config/types";

import { HIDDIFY_SERVERS, MAX_BANDWIDTH } from "@/config/constants";
import { HIDDIFY_SERVER_IDS } from "@/config/types";
import db, {
  product as productTable,
  profile as profileTable,
  user as userTable,
  verification as verificationTable,
} from "@/db";
import { axiosHiddify } from "@/lib/server-clients";
import { retryOnError } from "@/lib/utils";

/// //////////////////// USER ///////////////////////

export async function getUserByEmail(email?: string) {
  if (!email) return;

  return await db.query.user.findFirst({
    where: eq(userTable.email, email.toLowerCase()),
  });
}

export async function getUserByResetToken(token?: string) {
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

export async function getUserFullById(id: string) {
  return await db.query.user.findFirst({
    where: eq(userTable.id, id),
    with: {
      account: true,
      profile: true,
      session: true,
      verification: true,
    },
  });
}
export type UserFullDB = NonNullable<Awaited<ReturnType<typeof getUserFullById>>>;

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

export async function findBestHiddifyServer() {
  let id = "1" as HiddifyServerId;
  for (const serverId of HIDDIFY_SERVER_IDS) {
    const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
    const { data } = await retryOnError(async () => {
      return await axiosHiddify.get<HiddifyUser[]>(`${baseUrl}/admin/user`);
    });
    const totalBandwidth = data.filter(users => users.enable).reduce((prev, curr) => prev + curr.usage_limit_GB, 0);
    console.debug(`Total bandwidth for hiddify-${serverId}: ${totalBandwidth}GB`);

    if (totalBandwidth < MAX_BANDWIDTH) {
      id = serverId;
      break;
    }
  }

  return id;
}

export async function searchForHiddifyEmail(email?: string) {
  if (!email) return null;

  for (const serverId of HIDDIFY_SERVER_IDS) {
    const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
    const { data } = await retryOnError(async () => {
      return await axiosHiddify.get<HiddifyUser[]>(`${baseUrl}/admin/user`);
    });
    const user = data.find(user => user.name === email);
    if (user) {
      return { hiddifyId: user.uuid, hiddifyServerId: serverId };
    }
  }

  return null;
}

export async function getHiddifyUserById(id: string, serverId: HiddifyServerId) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const { data } = await retryOnError(async () => {
    return await axiosHiddify.get<HiddifyUser>(`${baseUrl}/admin/user/${id}`);
  });

  return data?.uuid ? data : null;
}
