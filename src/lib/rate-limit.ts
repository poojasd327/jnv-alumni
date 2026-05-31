/**
 * Simple in-memory rate limiter using a sliding window.
 * For production at scale (50K+ users), replace with Redis (Upstash).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a request is within rate limits.
 * @param key Unique identifier (e.g., `${userId}:${action}`)
 * @param config Rate limit configuration
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + config.windowSeconds * 1000
    store.set(key, { count: 1, resetAt })
    return { success: true, remaining: config.limit - 1, resetAt }
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  }
}

// Preset rate limits for different action types
export const RATE_LIMITS = {
  /** Auth actions: 5 attempts per 15 minutes */
  auth: { limit: 5, windowSeconds: 900 },
  /** Write actions (create/update): 20 per 5 minutes */
  write: { limit: 20, windowSeconds: 300 },
  /** Read/search actions: 60 per minute */
  read: { limit: 60, windowSeconds: 60 },
  /** File uploads: 10 per 5 minutes */
  upload: { limit: 10, windowSeconds: 300 },
  /** Sensitive actions (delete, password change): 3 per 15 minutes */
  sensitive: { limit: 3, windowSeconds: 900 },
} as const
