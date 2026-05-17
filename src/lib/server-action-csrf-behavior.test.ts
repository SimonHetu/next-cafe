import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

/**
 * Next.js Server Action CSRF uses `isCsrfOriginAllowed` when `Origin` and `Host`
 * (or `x-forwarded-host`) differ; without a matching allowlist entry the action aborts (E80).
 * These tests lock behavior we rely on when configuring `experimental.serverActions.allowedOrigins`.
 */
const require = createRequire(import.meta.url);
const { isCsrfOriginAllowed } = require(
  "next/dist/server/app-render/csrf-protection",
) as {
  isCsrfOriginAllowed: (originDomain: string, allowedOrigins?: string[]) => boolean;
};

describe("Next.js Server Action CSRF allowlist (isCsrfOriginAllowed)", () => {
  it("rejects a host that is not listed when allowlist is empty", () => {
    expect(isCsrfOriginAllowed("evil.example", [])).toBe(false);
  });

  it("allows an exact host match", () => {
    expect(isCsrfOriginAllowed("app.example.com", ["app.example.com"])).toBe(true);
  });

  it("allows subdomain wildcard patterns (used for previews)", () => {
    expect(isCsrfOriginAllowed("my-app.vercel.app", ["*.vercel.app"])).toBe(true);
    expect(isCsrfOriginAllowed("notvercel.evil.com", ["*.vercel.app"])).toBe(false);
  });
});
