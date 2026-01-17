import { cache } from '@/config';
import { Request, Response, NextFunction } from 'express';

// Generate a cache key including sorted queries
const generateCacheKey = (req: Request) => {
  const queryString = Object.keys(req.query)
    .sort()
    .map((k) => `${k}=${req.query[k]}`)
    .join('&');
  return queryString ? `${req.path}?${queryString}` : req.path;
};

// Middleware factory
export const cacheMiddleware = <T>(ttlSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = generateCacheKey(req);
      const cachedData = cache.get(key);

      if (cachedData) {
        console.log(`[Cache HIT] ${key}`);
        return res.json(cachedData);
      }

      // Override res.json to store response in cache
      const originalJson = res.json.bind(res);
      res.json = (body: T) => {
        cache.set(key, body, ttlSeconds);
        console.log(`[Cache SET] ${key}`);
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      next();
    }
  };
};

// Clear all cache for a resource prefix
export const clearResourceCache = (prefix: string) => {
  const keys = cache.keys().filter((key) => key.startsWith(prefix));
  cache.del(keys);
  console.log(`[Cache CLEARED] ${keys.join(', ')}`);
};
