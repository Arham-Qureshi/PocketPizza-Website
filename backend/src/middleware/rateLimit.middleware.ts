import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

function rateLimitBody(message: string) {
  return (req: Request, res: Response): void => {
    res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message },
      requestId: String(req.id ?? ''),
    });
  };
}

export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitBody('Too many requests'),
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const raw = req.body?.email;
    const email = typeof raw === 'string' ? raw.toLowerCase().trim() : 'unknown';
    return `${req.ip}:${email}`;
  },
  handler: rateLimitBody('Too many login attempts'),
});

export const orderCreateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitBody('Too many order attempts'),
});

export const tokenLookupRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitBody('Too many order lookup attempts'),
});

export const refreshRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitBody('Too many refresh attempts'),
});

export const customerSignupRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitBody('Too many signup attempts'),
});

// canonical limiter key for an account: digits only, last 10 — so
// 9876543210 / +919876543210 / 09876543210 / "98765 43210" all share one
// budget instead of each getting a fresh one
export function phoneRateLimitKey(raw: unknown): string {
  if (typeof raw !== 'string') return 'unknown';
  const digits = raw.replace(/\D/g, '');
  return digits.length > 0 ? digits.slice(-10) : 'unknown';
}

export const customerLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${req.ip}:${phoneRateLimitKey(req.body?.phone)}`,
  handler: rateLimitBody('Too many login attempts'),
});

export const customerLoginIpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitBody('Too many login attempts'),
});

// account-scoped: caps attempts against ONE phone regardless of how many
// source IPs are used, so a botnet cannot fan out past the per-ip budgets
// (OWASP: lockout counters must key on the account, not the source ip)
export const customerLoginPhoneRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => phoneRateLimitKey(req.body?.phone),
  handler: rateLimitBody('Too many login attempts'),
});
