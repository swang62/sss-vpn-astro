import type { HiddifyUser, SubscriptionType } from "@/config/types";

import { PLAN_LIMITS, TRIAL_TIME } from "@/config/constants";
import { axiosHiddify } from "@/lib/server-clients";

export async function createHiddifyUser(email: string) {
  const body = {
    enable: true,
    mode: "no_reset",
    name: email,
    package_days: TRIAL_TIME,
    start_date: new Date().toISOString().substring(0, 10),
    usage_limit_GB: PLAN_LIMITS.trial,
  };
  const { data } = await axiosHiddify.post<HiddifyUser>("/admin/user", body);

  return data.uuid;
}

export async function updateHiddifyUser(id: string, startAt: Date, plan: SubscriptionType, oldPlan: SubscriptionType, isAutoRenew: boolean) {
  const mode = isAutoRenew ? "monthly" : "no_reset";
  const package_days = isAutoRenew ? 3650 : 30;

  const isDowngrade = (oldPlan === "premium" && ["basic", "pro"].includes(plan))
    || (oldPlan === "pro" && plan === "basic");

  const body = {
    current_usage_GB: isDowngrade ? 0 : null,
    enable: true,
    mode,
    package_days,
    start_date: new Date(startAt).toISOString().substring(0, 10),
    usage_limit_GB: PLAN_LIMITS[plan],
  };
  const { data } = await axiosHiddify.patch<HiddifyUser>(`/admin/user/${id}`, body);

  return data.uuid;
}

export async function cancelHiddifyUser(id: string) {
  const body = {
    current_usage_GB: 0,
    enable: false,
    mode: "no_reset",
    package_days: 0,
    usage_limit_GB: 0,
  };
  const { data } = await axiosHiddify.patch<HiddifyUser>(`/admin/user/${id}`, body);

  return data.uuid;
}
