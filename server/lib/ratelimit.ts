import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create rate limiters for different endpoint types
export const rateLimiters = {
  // Translation endpoints: 10 requests per minute
  translation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "@ratelimit/translation",
  }),

  // Practice submissions: 5 requests per minute (AI evaluation is expensive)
  practice: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "@ratelimit/practice",
  }),

  // General API: 30 requests per minute
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    analytics: true,
    prefix: "@ratelimit/general",
  }),

  // Public endpoints: 20 requests per minute
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "@ratelimit/public",
  }),
};

/**
 * Get identifier for rate limiting
 * Uses IP address or user ID if authenticated
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from headers (Vercel provides this)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";

  return `ip:${ip}`;
}

/**
 * Check rate limit and return response if exceeded
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open - allow request if rate limiter is down
    return { success: true };
  }
}
