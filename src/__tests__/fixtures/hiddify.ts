import type { HiddifyUser } from "@/config/types";
import { TEST_HIDDIFY_ID } from "../constants";

export function hiddifyUser(overrides: Partial<HiddifyUser> = {}): HiddifyUser {
  return {
    current_usage_GB: 10,
    enable: true,
    is_active: true,
    last_online: null,
    mode: "monthly",
    name: "test@example.com",
    package_days: 30,
    start_date: "2025-01-01",
    usage_limit_GB: 100,
    uuid: TEST_HIDDIFY_ID,
    ...overrides,
  };
}

export function hiddifyUserList(users: HiddifyUser[] = []): {
  data: HiddifyUser[];
} {
  return { data: users.length ? users : [hiddifyUser()] };
}

export function hiddifyUserResponse(user?: HiddifyUser): { data: HiddifyUser } {
  return { data: user ?? hiddifyUser() };
}

export function hiddifyDeleteResponse(): { data: { msg: string } } {
  return { data: { msg: "OK" } };
}
