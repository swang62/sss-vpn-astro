import { dateToString, getDaysLeft } from "../utils";

describe("getDaysLeft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("no reset, limited time left", () => {
    const today = new Date("2024-07-12");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-07-10", "no_reset", 5)).toBe(3);
  });

  it("monthly reset, start after reset", () => {
    const today = new Date("2024-07-20");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-07-12", "monthly")).toBe(23);
  });

  it("monthly reset, start before reset", () => {
    const today = new Date("2024-07-12");
    vi.setSystemTime(today);

    expect(getDaysLeft("2024-07-20", "monthly")).toBe(8);
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
