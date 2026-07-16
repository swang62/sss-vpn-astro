import { setHeaders } from "../headers";

describe("setHeaders", () => {
  it("sets security headers", () => {
    const headers = new Headers();
    setHeaders(headers);

    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(headers.get("Permissions-Policy")).toBeTruthy();
  });

  it("preserves existing headers", () => {
    const headers = new Headers({ "x-custom": "value" });
    setHeaders(headers);

    expect(headers.get("x-custom")).toBe("value");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
  });
});
