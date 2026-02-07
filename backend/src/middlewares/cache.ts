import { cache, logger } from '@/config';
import { Request, Response, NextFunction } from 'express';

// Generate a cache key including sorted queries
const generateCacheKey = (req: Request) => {
  const queryString = Object.keys(req.query)
    .sort()
    .map((k) => `${k}=${req.query[k]}`)
    .join('&');
  const url = req.originalUrl.split('?')[0]; // remove existing query string
  const key = queryString ? `${url}?${queryString}` : url;

  return key;
};

// Middleware factory for caching GET requests
export const cacheMiddleware = (ttlSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      logger.info('[Cache SKIPPED]', {
        method: req.method,
        url: req.originalUrl,
        reason: 'Non-GET request',
      });
      return next();
    }

    const key = generateCacheKey(req);

    try {
      const cachedData = cache.get(key);

      if (cachedData !== undefined) {
        return res.json(cachedData as unknown);
      }

      const originalJson = res.json.bind(res);

      // Intercept res.json to store in cache
      res.json = (body: unknown) => {
        cache.set(key, body, ttlSeconds);

        return originalJson(body);
      };

      next();
    } catch (err) {
      logger.error('[Cache ERROR]', {
        method: req.method,
        url: req.originalUrl,
        key,
        error: err,
      });
      next();
    }
  };
};

// Clear all cache for a resource prefix
export const clearResourceCache = (prefix: string) => {
  const keys = cache.keys().filter((key) => key.startsWith(prefix));
  cache.del(keys);
};

// Middleware factory to invalidate cache after successful response
export const invalidateCache =
  (prefix: string | ((req: Request) => string)) =>
  (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = (body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const resource = typeof prefix === 'function' ? prefix(req) : prefix;

        clearResourceCache(resource);
        logger.info('[Cache INVALIDATED]', {
          resource,
          status: res.statusCode,
          bodySize: JSON.stringify(body).length,
          sample: JSON.stringify(body).slice(0, 200),
        });
      } else {
        logger.info('[Cache NOT INVALIDATED]', {
          status: res.statusCode,
          reason: 'Response not successful',
        });
      }

      return originalJson(body);
    };

    next();
  };
