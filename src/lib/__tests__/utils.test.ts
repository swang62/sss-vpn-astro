import { dateToString, getDaysLeft } from "../utils";

describe("getDaysLeft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("no reset, limited time left", () => {
    const today = new Date("2024-07-29");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-07-28", "no_reset", 5)).toStrictEqual({ daysLeft: 4, endDate: "Aug 2, 2024" });
  });

  it("monthly reset, start after reset", () => {
    const today = new Date("2024-07-20");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-07-12", "monthly").daysLeft).toBe(23);
  });

  it("monthly reset, start before reset", () => {
    const today = new Date("2024-07-12");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-07-20", "monthly")).toStrictEqual({ daysLeft: 8, endDate: "Aug 20, 2024" });
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
