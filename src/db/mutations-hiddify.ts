import type { PinoLogger } from "hono-pino";

import type { HiddifyServerId, HiddifyUser, SubscriptionType } from "@/config/types";

import { HIDDIFY_SERVERS, PLAN_LIMITS, TRIAL_TIME } from "@/config/constants";
import { axiosHiddify } from "@/lib/server-clients";
import { retryOnError } from "@/lib/utils";

import { findBestHiddifyServer } from "./queries";

export async function createHiddifyUser(email: string) {
  const serverId = await findBestHiddifyServer();
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const body: Partial<HiddifyUser> = {
    enable: true,
    mode: "no_reset",
    name: email,
    package_days: TRIAL_TIME,
    start_date: new Date().toISOString().substring(0, 10),
    usage_limit_GB: PLAN_LIMITS.trial.data,
  };
  const { data } = await retryOnError(async () => {
    return await axiosHiddify.post<HiddifyUser>(`${baseUrl}/admin/user`, body);
  });

  return { hiddifyId: data.uuid, hiddifyServerId: serverId };
}

export async function updateHiddifyUser(
  id: string,
  serverId: HiddifyServerId,
  startAt: Date,
  plan: SubscriptionType,
  isAutoRenew: boolean
) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
  const mode = isAutoRenew ? "monthly" : "no_reset";
  const package_days = isAutoRenew ? 3650 : 30;

  const body: Partial<HiddifyUser> = {
    enable: true,
    mode,
    package_days,
    start_date: new Date(startAt).toISOString().substring(0, 10),
    usage_limit_GB: PLAN_LIMITS[plan].data,
  };
  await retryOnError(
    async () => await axiosHiddify.patch<HiddifyUser>(`${baseUrl}/admin/user/${id}`, body)
  );
}

export async function resetUsageLimit(
  id: string,
  serverId: HiddifyServerId,
  plan: SubscriptionType,
  logger: PinoLogger
) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const body: Partial<HiddifyUser> = {
    usage_limit_GB: PLAN_LIMITS[plan].data,
  };
  await retryOnError(
    async () => await axiosHiddify.patch<HiddifyUser>(`${baseUrl}/admin/user/${id}`, body)
  );

  logger.debug(`Reset subscription usage to ${body.usage_limit_GB} for hiddify user:${id}`);
}

export async function increaseUsageLimit(id: string, serverId: HiddifyServerId, newLimit: number) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const body: Partial<HiddifyUser> = {
    usage_limit_GB: newLimit,
  };
  await retryOnError(
    async () => await axiosHiddify.patch<HiddifyUser>(`${baseUrl}/admin/user/${id}`, body)
  );
}

export async function cancelHiddifyPlan(id: string, serverId: HiddifyServerId) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const body: Partial<HiddifyUser> = {
    current_usage_GB: 0, // Doesn't work reliably
    enable: false,
    mode: "no_reset",
    package_days: 0,
    usage_limit_GB: 0,
  };
  await retryOnError(
    async () => await axiosHiddify.patch<HiddifyUser>(`${baseUrl}/admin/user/${id}`, body)
  );
}

export async function deleteHiddifyUser(id: string, serverId: HiddifyServerId) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const { data } = await retryOnError(async () => {
    return await axiosHiddify.delete<{ msg: string }>(`${baseUrl}/admin/user/${id}`);
  });

  return data;
}
