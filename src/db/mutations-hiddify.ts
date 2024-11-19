import type { HiddifyServerId, HiddifyUser, SubscriptionType } from "@/config/types";

import { HIDDIFY_SERVERS, PLAN_LIMITS, TRIAL_TIME } from "@/config/constants";
import { axiosHiddify } from "@/lib/server-clients";

import { findAvailableServer } from "./queries";

export async function createHiddifyUser(email: string) {
  const serverId = await findAvailableServer();
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const body = {
    enable: true,
    mode: "no_reset",
    name: email,
    package_days: TRIAL_TIME,
    start_date: new Date().toISOString().substring(0, 10),
    usage_limit_GB: PLAN_LIMITS.trial,
  };
  const { data } = await axiosHiddify.post<HiddifyUser>(`${baseUrl}/admin/user`, body);

  return { hiddifyId: data.uuid, hiddifyServerId: serverId };
}

export async function updateHiddifyUser(
  id: string,
  serverId: HiddifyServerId,
  startAt: Date,
  plan: SubscriptionType,
  isAutoRenew: boolean,
) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
  const mode = isAutoRenew ? "monthly" : "no_reset";
  const package_days = isAutoRenew ? 3650 : 30;

  const body = {
    enable: true,
    mode,
    package_days,
    start_date: new Date(startAt).toISOString().substring(0, 10),
    usage_limit_GB: PLAN_LIMITS[plan],
  };

  await axiosHiddify.patch<HiddifyUser>(`${baseUrl}/admin/user/${id}`, body);
}

export async function increaseUsageLimit(
  id: string,
  serverId: HiddifyServerId,
  newLimit: number,
) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;

  const body = {
    usage_limit_GB: newLimit,
  };

  await axiosHiddify.patch<HiddifyUser>(`${baseUrl}/admin/user/${id}`, body);
}

export async function cancelHiddifyUser(id: string, serverId: HiddifyServerId) {
  const baseUrl = HIDDIFY_SERVERS[serverId].baseUrl;
  const body = {
    current_usage_GB: 0,
    enable: false,
    mode: "no_reset",
    package_days: 0,
    usage_limit_GB: 0,
  };

  await axiosHiddify.patch<HiddifyUser>(`${baseUrl}/admin/user/${id}`, body);
}
