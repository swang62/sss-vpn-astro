import {
  capitalize,
  cn,
  dateToString,
  getDaysLeft,
  getHiddifyLinks,
  getPlatform,
  retryOnError,
  secondsSince,
} from "../utils";

describe("getDaysLeft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("no auto-renew, time left", () => {
    const today = new Date("2024-07-05");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-28", "no_reset", 15)).toStrictEqual({
      daysLeft: 8,
      endDate: "Jul 13, 2024",
    });
  });

  it("no auto-renew, no time left on trial or expired/none", () => {
    const today = new Date("2024-07-05");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-02-28", "no_reset", 5)).toStrictEqual({
      daysLeft: 0,
      endDate: "Mar 4, 2024",
    });
  });

  it("no auto-renew, month left", () => {
    const today = new Date("2024-07-05");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-28", "no_reset", 30)).toStrictEqual({
      daysLeft: 23,
      endDate: "Jul 28, 2024",
    });
  });

  it("monthly, start after reset", () => {
    const today = new Date("2024-07-20");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-12", "monthly")).toStrictEqual({
      daysLeft: 23,
      endDate: "Aug 12, 2024",
    });
  });

  it("monthly, start before reset", () => {
    const today = new Date("2024-07-12");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-20", "monthly")).toStrictEqual({
      daysLeft: 8,
      endDate: "Jul 20, 2024",
    });
  });
});

describe("secondsPassedSince", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("track less than 1min passed, round down", () => {
    const now = new Date("2024-07-12T00:01:00.000Z");
    vi.setSystemTime(now);

    expect(secondsSince("2024-07-12T00:00:30.000Z")).toBe(30);
  });
});

describe("dateToString", () => {
  it("format 1st", () => {
    expect(dateToString(1)).toBe(`1st`);
  });
  it("format 2nd", () => {
    expect(dateToString(2)).toBe(`2nd`);
  });
  it("format 3rd", () => {
    expect(dateToString(3)).toBe(`3rd`);
  });
  it("format 17th", () => {
    expect(dateToString(17)).toBe(`17th`);
  });
});

describe("tailwind cn", () => {
  it("tailwind combine classes", () => {
    expect(cn("w-4", "h-4")).toBe("w-4 h-4");
  });
});

describe("capitalize", () => {
  it("all lowercase", () => {
    expect(capitalize("test")).toBe("Test");
  });
  it("empty str", () => {
    expect(capitalize()).toBe("");
  });
  it("all caps", () => {
    expect(capitalize("TEST")).toBe("Test");
  });
});

describe("getHiddifyLinks", () => {
  it("hiddify-1 sublink", () => {
    const link = getHiddifyLinks("fake@email.com", "foo");

    expect(link).toEqual(expect.stringMatching(/link.sss-vpn.com/));
    expect(link).toEqual(expect.stringMatching(/foo\/#fake@email.com$/));
  });
});

describe("retryOnError", () => {
  it("succeeds on first try", async () => {
    const result = await retryOnError(() => Promise.resolve("ok"));
    expect(result).toBe("ok");
  });

  it("retries and succeeds", async () => {
    let attempts = 0;
    const result = await retryOnError(
      async () => {
        attempts++;
        if (attempts < 3) throw new Error("fail");
        return "ok";
      },
      3,
      1
    );
    expect(result).toBe("ok");
    expect(attempts).toBe(3);
  });

  it("throws after exhausting retries", async () => {
    await expect(
      retryOnError(() => Promise.reject(new Error("fail")), 2, 1)
    ).rejects.toThrow("fail");
  });
});

describe("getPlatform", () => {
  it("detects macOS desktop", () => {
    expect(
      getPlatform({ type: undefined } as never, { name: "macOS" } as never)
    ).toBe("mac");
  });

  it("detects Windows desktop", () => {
    expect(
      getPlatform({ type: undefined } as never, { name: "Windows" } as never)
    ).toBe("pc");
  });

  it("detects iOS mobile", () => {
    expect(
      getPlatform({ type: "mobile" } as never, { name: "iOS" } as never)
    ).toBe("ios");
  });

  it("detects Android mobile", () => {
    expect(
      getPlatform({ type: "mobile" } as never, { name: "Android" } as never)
    ).toBe("android");
  });
});
