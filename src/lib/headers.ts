const DEFAULT_SECURITY_HEADERS: Record<string, string> = {
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

export function setHeaders(headers: Headers) {
  for (const [key, value] of Object.entries(DEFAULT_SECURITY_HEADERS)) {
    headers.set(key, value);
  }
}
