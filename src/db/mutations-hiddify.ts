import type { HiddifyUser } from "@/config/types";

import { TRIAL_PERIOD } from "@/config/constants";
import { axiosHiddify } from "@/lib/server-clients";

export async function createHiddifyUser(email: string) {
  const body = {
    enable: true,
    mode: "no_reset",
    name: email,
    package_days: TRIAL_PERIOD,
    start_date: new Date().toISOString().substring(0, 10),
    usage_limit_GB: TRIAL_PERIOD,
  };
  const { data } = await axiosHiddify.post<HiddifyUser>("/admin/user", body);

  return data.uuid;
}
