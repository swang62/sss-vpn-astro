import { dateToString, getDaysLeft } from "../utils";

describe("getDaysLeft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("no reset, time left", () => {
    const today = new Date("2024-07-05");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-28", "no_reset", 15)).toStrictEqual({ daysLeft: 8, endDate: "Jul 13, 2024" });
  });

  it("no reset, no time left on trial or expired/none", () => {
    const today = new Date("2024-07-05");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-02-28", "no_reset", 5)).toStrictEqual({ daysLeft: 0, endDate: "Mar 4, 2024" });
  });

  it("no reset, month left", () => {
    const today = new Date("2024-07-05");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-28", "no_reset", 30)).toStrictEqual({ daysLeft: 23, endDate: "Jul 28, 2024" });
  });

  it("monthly reset, start after reset", () => {
    const today = new Date("2024-07-20");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-12", "monthly")).toStrictEqual({ daysLeft: 23, endDate: "Aug 12, 2024" });
  });

  it("monthly reset, start before reset", () => {
    const today = new Date("2024-07-12");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-06-20", "monthly")).toStrictEqual({ daysLeft: 8, endDate: "Jul 20, 2024" });
  });
});

describe("dateToString", () => {
  it("1", () => {
    expect(dateToString(1)).toBe(`1st`);
  });
  it("2", () => {
    expect(dateToString(2)).toBe(`2nd`);
  });
  it("3", () => {
    expect(dateToString(3)).toBe(`3rd`);
  });
  it("17", () => {
    expect(dateToString(17)).toBe(`17th`);
  });
});
