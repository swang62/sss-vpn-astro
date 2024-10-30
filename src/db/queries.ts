import { eq } from "drizzle-orm";
import QRCode from "qrcode";

import type { HiddifyUser, SubscriptionType } from "@/config/types";

import { HIDDIFY_SETUP_LINK } from "@/config/server";
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

export async function searchHiddifyUser(email?: string) {
  if (!email) return "";

  const { data } = await axiosHiddify.get<HiddifyUser[]>(`/admin/user`);
  const user = data.find(user => user.name === email);
  return user?.uuid || "";
}

export async function getHiddifyUser(id?: string) {
  if (!id) return null;

  const { data } = await axiosHiddify.get<HiddifyUser>(`/admin/user/${id}`);
  if (!data.uuid) return null;
  return data;
}

export async function getHiddifyQR(email: string, id?: string) {
  if (!id) return { qrcode: "", url: "" };

  const url = `${HIDDIFY_SETUP_LINK}/${id}/#${email}`;
  try {
    const qrcode = await QRCode.toDataURL(url);
    return { qrcode, url };
  } catch (error) {
    console.error(error);
    return { qrcode: "", url: "" };
  }
}
