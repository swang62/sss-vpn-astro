import {
  capitalize,
  cn,
  dateToString,
  getDaysLeft,
  getHiddifyLinks,
  minutesPassedSince,
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

describe("minutesPassedSince", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("track less than 1min passed, round down", () => {
    const now = new Date("2024-07-12T00:00:59.000Z");
    vi.setSystemTime(now);

    expect(minutesPassedSince("2024-07-12T00:00:00.000Z")).toBe(0);
  });

  it("track 1min passed", () => {
    const now = new Date("2024-07-12T00:01:00.000Z");
    vi.setSystemTime(now);

    expect(minutesPassedSince("2024-07-12T00:00:00.000Z")).toBe(1);
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
