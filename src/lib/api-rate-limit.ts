import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const API_RATE_LIMIT_MAX = 60;

export function shouldRateLimitApiPath(pathname: string): boolean {
  if (!pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/api/webhooks")) return false;
  return true;
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    request.ip ??
    "127.0.0.1"
  );
}

export function createApiRatelimitFromEnv(): Ratelimit | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(API_RATE_LIMIT_MAX, "60 s"),
    prefix: "ratelimit:api",
  });
}

export type ApiRateLimitResult =
  | { continue: true }
  | { continue: false; response: NextResponse };

export async function enforceApiRateLimit(
  ratelimit: Pick<Ratelimit, "limit"> | null,
  pathname: string,
  ip: string
): Promise<ApiRateLimitResult> {
  if (!ratelimit || !shouldRateLimitApiPath(pathname)) {
    return { continue: true };
  }

  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return {
        continue: false,
        response: NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        ),
      };
    }
  } catch {
    // Upstash unreachable / bad credentials — fail open.
  }

  return { continue: true };
}
