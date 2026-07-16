import { beforeEach } from "vitest";
import {
  cancelHiddifyPlan,
  createHiddifyUser,
  deleteHiddifyUser,
  increaseUsageLimit,
  resetUsageLimit,
  updateHiddifyUser,
} from "@/db/mutations-hiddify";
import { axiosHiddify } from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  axiosHiddify: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockLogger = {
  debug: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
} as never;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createHiddifyUser", () => {
  it("creates user with trial params", async () => {
    vi.mocked(axiosHiddify.post).mockResolvedValueOnce({
      data: { uuid: "new-uuid" },
    } as never);

    const result = await createHiddifyUser("test@example.com");
    expect(result.hiddifyId).toBe("new-uuid");
    expect(axiosHiddify.post).toHaveBeenCalledWith(
      expect.stringContaining("/admin/user"),
      expect.objectContaining({
        name: "test@example.com",
        usage_limit_GB: 3,
        package_days: 3,
      })
    );
  });
});

describe("updateHiddifyUser", () => {
  it("updates with monthly mode for auto-renew", async () => {
    vi.mocked(axiosHiddify.patch).mockResolvedValueOnce({} as never);

    await updateHiddifyUser("hid-1", new Date("2025-01-01"), "pro", true);
    expect(axiosHiddify.patch).toHaveBeenCalledWith(
      expect.stringContaining("/admin/user/hid-1"),
      expect.objectContaining({ mode: "monthly", usage_limit_GB: 300 })
    );
  });

  it("updates with no_reset mode for non-auto-renew", async () => {
    vi.mocked(axiosHiddify.patch).mockResolvedValueOnce({} as never);

    await updateHiddifyUser("hid-1", new Date("2025-01-01"), "basic", false);
    expect(axiosHiddify.patch).toHaveBeenCalledWith(
      expect.stringContaining("/admin/user/hid-1"),
      expect.objectContaining({ mode: "no_reset", usage_limit_GB: 100 })
    );
  });
});

describe("resetUsageLimit", () => {
  it("resets to plan limit", async () => {
    vi.mocked(axiosHiddify.patch).mockResolvedValueOnce({} as never);

    await resetUsageLimit("hid-1", "pro", mockLogger);
    expect(axiosHiddify.patch).toHaveBeenCalledWith(
      expect.stringContaining("/admin/user/hid-1"),
      expect.objectContaining({ usage_limit_GB: 300 })
    );
  });
});

describe("increaseUsageLimit", () => {
  it("sets new usage limit", async () => {
    vi.mocked(axiosHiddify.patch).mockResolvedValueOnce({} as never);

    await increaseUsageLimit("hid-1", 500);
    expect(axiosHiddify.patch).toHaveBeenCalledWith(
      expect.stringContaining("/admin/user/hid-1"),
      expect.objectContaining({ usage_limit_GB: 500 })
    );
  });
});

describe("cancelHiddifyPlan", () => {
  it("disables user with zero limits", async () => {
    vi.mocked(axiosHiddify.patch).mockResolvedValueOnce({} as never);

    await cancelHiddifyPlan("hid-1");
    expect(axiosHiddify.patch).toHaveBeenCalledWith(
      expect.stringContaining("/admin/user/hid-1"),
      expect.objectContaining({
        enable: false,
        usage_limit_GB: 0,
        package_days: 0,
      })
    );
  });
});

describe("deleteHiddifyUser", () => {
  it("deletes user", async () => {
    vi.mocked(axiosHiddify.delete).mockResolvedValueOnce({
      data: { msg: "OK" },
    } as never);

    const result = await deleteHiddifyUser("hid-1");
    expect(result).toEqual({ msg: "OK" });
    expect(axiosHiddify.delete).toHaveBeenCalledWith(
      expect.stringContaining("/admin/user/hid-1")
    );
  });
});
