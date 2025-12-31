import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest } from 'next/server'

// Simple in-memory rate limiter for development (fallback)
const inMemoryStore = new Map<string, { count: number; resetTime: number }>()

function getInMemoryRateLimiter(limit: number, windowMs: number) {
  return {
    async limit(identifier: string) {
      const now = Date.now()
      const record = inMemoryStore.get(identifier)

      if (!record || now > record.resetTime) {
        inMemoryStore.set(identifier, { count: 1, resetTime: now + windowMs })
        return { success: true, remaining: limit - 1, reset: now + windowMs }
      }

      if (record.count >= limit) {
        return { success: false, remaining: 0, reset: record.resetTime }
      }

      record.count++
      return { success: true, remaining: limit - record.count, reset: record.resetTime }
    },
  }
}

// Create rate limiter based on environment
function createRateLimiter(requests: number, windowSeconds: number) {
  // Use Upstash Redis if configured
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
      analytics: true,
      prefix: 'productivite:ratelimit',
    })
  }

  // Fallback to in-memory rate limiter for development
  return getInMemoryRateLimiter(requests, windowSeconds * 1000)
}

// Rate limiters for different endpoints
export const rateLimiters = {
  // API mutations (upvote, etc.) - 30 requests per minute
  api: createRateLimiter(30, 60),
  // Auth endpoints - 10 requests per minute
  auth: createRateLimiter(10, 60),
  // Search - 60 requests per minute
  search: createRateLimiter(60, 60),
}

// Get client identifier (IP address or user ID)
export function getClientIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0]?.trim() || 'anonymous'
  return `ip:${ip}`
}

// Check rate limit and return response if exceeded
export async function checkRateLimit(
  request: NextRequest,
  limiter: typeof rateLimiters.api,
  identifier?: string
) {
  const clientId = identifier || getClientIdentifier(request)
  const result = await limiter.limit(clientId)

  if (!result.success) {
    return {
      limited: true,
      response: {
        error: 'Trop de requêtes. Veuillez réessayer plus tard.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      status: 429,
      headers: {
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.reset),
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
      },
    }
  }

  return {
    limited: false,
    headers: {
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': String(result.reset),
    },
  }
}
