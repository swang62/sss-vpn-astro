import { beforeEach } from "vitest";
import { TEST_HIDDIFY_ID } from "@/__tests__/constants";
import { hiddifyUserResponse } from "@/__tests__/fixtures/hiddify";
import { axiosHiddify } from "@/lib/axios";
import createApp from "@/server/app";

import hiddifyRouter from "../hiddify.route";
import { testAdminMiddleware } from "./shared";

vi.mock("@/lib/axios", () => ({
  axiosHiddify: { get: vi.fn() },
}));

function adminFetch(path: string) {
  return createApp()
    .use(testAdminMiddleware)
    .route("/", hiddifyRouter)
    .fetch(new Request(`http://localhost${path}`));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/hiddify/usage", () => {
  it("no auth returns error", async () => {
    const app = createApp().route("/", hiddifyRouter);
    const res = await app.fetch(new Request("http://localhost/api/usage"));
    expect(res.status).toBe(500);
  });

  it("hiddify user not found returns 404", async () => {
    vi.mocked(axiosHiddify.get).mockResolvedValueOnce({
      data: { current_usage_GB: 0 },
    } as never);
    const res = await adminFetch("/api/usage");
    expect(res.status).toBe(404);
  });

  it("hiddify API error returns 500", async () => {
    vi.mocked(axiosHiddify.get).mockRejectedValueOnce(new Error("API error"));
    const res = await adminFetch("/api/usage");
    expect(res.status).toBe(500);
  });

  it("returns usage data", async () => {
    vi.mocked(axiosHiddify.get).mockResolvedValueOnce(
      hiddifyUserResponse() as never
    );

    const res = await adminFetch("/api/usage");
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      usage: { uuid: string; current_usage_GB: number };
    };
    expect(data.usage.uuid).toBe(TEST_HIDDIFY_ID);
    expect(data.usage.current_usage_GB).toBe(10);
  });
});
