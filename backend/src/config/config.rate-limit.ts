import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});
