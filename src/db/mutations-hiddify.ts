import type { PinoLogger } from "hono-pino";
import { HIDDIFY_SERVERS, PLAN_LIMITS, TRIAL_TIME } from "@/config/constants";
import type { HiddifyUser, SubscriptionType } from "@/config/types";
import { axiosHiddify } from "@/lib/axios";
import { retryOnError } from "@/lib/utils";

export async function createHiddifyUser(email: string) {
  const body: Partial<HiddifyUser> = {
    enable: true,
    mode: "no_reset",
    name: email,
    package_days: TRIAL_TIME,
    start_date: new Date().toISOString().substring(0, 10),
    usage_limit_GB: PLAN_LIMITS.trial.data,
  };
  const { data } = await retryOnError(async () => {
    return await axiosHiddify.post<HiddifyUser>(
      `${HIDDIFY_SERVERS.baseUrl}/admin/user`,
      body
    );
  });

  return { hiddifyId: data.uuid };
}

export async function updateHiddifyUser(
  id: string,
  startAt: Date,
  plan: SubscriptionType = "none",
  isAutoRenew: boolean
) {
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
    async () =>
      await axiosHiddify.patch<HiddifyUser>(
        `${HIDDIFY_SERVERS.baseUrl}/admin/user/${id}`,
        body
      )
  );
}

export async function resetUsageLimit(
  id: string,
  plan: SubscriptionType,
  logger: PinoLogger
) {
  const body: Partial<HiddifyUser> = {
    usage_limit_GB: PLAN_LIMITS[plan].data,
  };
  await retryOnError(
    async () =>
      await axiosHiddify.patch<HiddifyUser>(
        `${HIDDIFY_SERVERS.baseUrl}/admin/user/${id}`,
        body
      )
  );

  logger.debug(
    `Reset subscription usage to ${body.usage_limit_GB} for hiddify user:${id}`
  );
}

export async function increaseUsageLimit(id: string, newLimit: number) {
  const body: Partial<HiddifyUser> = {
    usage_limit_GB: newLimit,
  };
  await retryOnError(
    async () =>
      await axiosHiddify.patch<HiddifyUser>(
        `${HIDDIFY_SERVERS.baseUrl}/admin/user/${id}`,
        body
      )
  );
}

export async function cancelHiddifyPlan(id: string) {
  const body: Partial<HiddifyUser> = {
    current_usage_GB: 0, // Doesn't work reliably
    enable: false,
    mode: "no_reset",
    package_days: 0,
    usage_limit_GB: 0,
  };
  await retryOnError(
    async () =>
      await axiosHiddify.patch<HiddifyUser>(
        `${HIDDIFY_SERVERS.baseUrl}/admin/user/${id}`,
        body
      )
  );
}

export async function deleteHiddifyUser(id: string) {
  const { data } = await retryOnError(async () => {
    return await axiosHiddify.delete<{ msg: string }>(
      `${HIDDIFY_SERVERS.baseUrl}/admin/user/${id}`
    );
  });

  return data;
}
