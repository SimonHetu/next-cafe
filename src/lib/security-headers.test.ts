import { describe, expect, it } from "vitest";

import {
  buildContentSecurityPolicy,
  buildSecurityHeaders,
  type SecurityHeader,
} from "./security-headers";

function headerMap(headers: SecurityHeader[]): Record<string, string> {
  return Object.fromEntries(headers.map((h) => [h.key, h.value]));
}

describe("buildSecurityHeaders", () => {
  it("includes CSP and four other headers outside development", () => {
    const headers = buildSecurityHeaders({ isDev: false });
    const map = headerMap(headers);
    expect(headers).toHaveLength(5);

    expect(map["Strict-Transport-Security"]).toBe(
      "max-age=31536000; includeSubDomains; preload",
    );
    expect(map["X-Frame-Options"]).toBe("DENY");
    expect(map["X-Content-Type-Options"]).toBe("nosniff");
    expect(map["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(map["Content-Security-Policy"]).toBeDefined();
    expect(typeof map["Content-Security-Policy"]).toBe("string");
    expect(map["Content-Security-Policy"]!.length).toBeGreaterThan(50);
  });

  it("omits CSP in development", () => {
    const headers = buildSecurityHeaders({ isDev: true });
    expect(headers).toHaveLength(4);
    expect(headers.map((h) => h.key)).not.toContain("Content-Security-Policy");
  });

  it('uses matcher source "/:path*" when wired from next.config', async () => {
    const nextConfigModule = await import("../../next.config");
    const routes = await nextConfigModule.default.headers!();
    expect(routes).toHaveLength(1);
    expect(routes[0]!.source).toBe("/:path*");
    expect(routes[0]!.headers).toEqual(buildSecurityHeaders());
  });
});

describe("buildContentSecurityPolicy", () => {
  const csp = buildContentSecurityPolicy();

  it("anchors on default-src self and forbids framing this app", () => {
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it("allows wasm for Three.js but not full unsafe-eval in script-src", () => {
    expect(csp).toContain("'wasm-unsafe-eval'");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it("allows Clerk and Turnstile frame sources", () => {
    expect(csp).toContain("frame-src");
    expect(csp).toContain("https://*.clerk.com");
    expect(csp).toContain("https://challenges.cloudflare.com");
  });
});
