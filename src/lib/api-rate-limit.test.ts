import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  enforceApiRateLimit,
  getClientIp,
  shouldRateLimitApiPath,
} from "./api-rate-limit";

describe("shouldRateLimitApiPath", () => {
  it("returns false for non-API routes", () => {
    expect(shouldRateLimitApiPath("/")).toBe(false);
    expect(shouldRateLimitApiPath("/products")).toBe(false);
  });

  it("returns false for webhook routes", () => {
    expect(shouldRateLimitApiPath("/api/webhooks/clerk")).toBe(false);
    expect(shouldRateLimitApiPath("/api/webhooks/stripe")).toBe(false);
  });

  it("returns true for other API routes", () => {
    expect(shouldRateLimitApiPath("/api/products")).toBe(true);
    expect(shouldRateLimitApiPath("/api/products/foo")).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses the first address in x-forwarded-for", () => {
    const req = new NextRequest("http://localhost/api/x", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const req = new NextRequest("http://localhost/api/x", {
      headers: { "x-real-ip": "198.51.100.2" },
    });
    expect(getClientIp(req)).toBe("198.51.100.2");
  });

  it("falls back to 127.0.0.1 when no headers are set", () => {
    const req = new NextRequest("http://localhost/api/x");
    expect(getClientIp(req)).toBe("127.0.0.1");
  });
});

describe("enforceApiRateLimit", () => {
  it("continues when ratelimit is null (no Redis env)", async () => {
    const limit = vi.fn();
    const result = await enforceApiRateLimit(null, "/api/products", "1.2.3.4");
    expect(result).toEqual({ continue: true });
    expect(limit).not.toHaveBeenCalled();
  });

  it("continues when path is not rate-limited", async () => {
    const limit = vi.fn();
    const result = await enforceApiRateLimit(
      { limit },
      "/api/webhooks/clerk",
      "1.2.3.4"
    );
    expect(result).toEqual({ continue: true });
    expect(limit).not.toHaveBeenCalled();
  });

  it("returns 429 when limit reports failure", async () => {
    const limit = vi.fn().mockResolvedValue({
      success: false,
      limit: 60,
      remaining: 0,
      reset: Date.now() + 60_000,
      pending: Promise.resolve(),
    });
    const result = await enforceApiRateLimit(
      { limit },
      "/api/products",
      "1.2.3.4"
    );
    expect(result.continue).toBe(false);
    if (!result.continue) {
      expect(result.response.status).toBe(429);
      expect(await result.response.json()).toEqual({
        error: "Too many requests",
      });
    }
    expect(limit).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledWith("1.2.3.4");
  });

  it("continues when limit allows the request", async () => {
    const limit = vi.fn().mockResolvedValue({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60_000,
      pending: Promise.resolve(),
    });
    const result = await enforceApiRateLimit(
      { limit },
      "/api/products",
      "1.2.3.4"
    );
    expect(result).toEqual({ continue: true });
  });

  it("fails open when limit throws", async () => {
    const limit = vi.fn().mockRejectedValue(new Error("network"));
    const result = await enforceApiRateLimit(
      { limit },
      "/api/products",
      "1.2.3.4"
    );
    expect(result).toEqual({ continue: true });
  });
});
