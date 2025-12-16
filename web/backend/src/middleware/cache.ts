import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';
import logger from '../config/logger';

export interface CacheMiddlewareOptions {
  ttl?: number; // Cache TTL in seconds
  keyPrefix?: string; // Prefix for cache keys
  keyGenerator?: (req: Request) => string; // Custom key generation function
}

/**
 * Middleware to cache GET request responses
 * Automatically caches successful responses and serves from cache on subsequent requests
 */
export function cacheMiddleware(options: CacheMiddlewareOptions = {}) {
  const { ttl = 300, keyPrefix = 'api:', keyGenerator } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator ? keyGenerator(req) : `${req.originalUrl || req.url}`;

      // Try to get cached response
      const cachedResponse = await cacheService.get<{
        status: number;
        data: unknown;
        headers: Record<string, string>;
      }>(cacheKey, { prefix: keyPrefix });

      if (cachedResponse) {
        logger.debug(`Serving cached response for: ${cacheKey}`);
        if (cachedResponse.headers) {
          res.set(cachedResponse.headers);
        }
        return res.status(cachedResponse.status).json(cachedResponse.data);
      }

      // Cache miss - store the original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data: unknown) {
        // Only cache successful responses (2xx status codes)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheService
            .set(
              cacheKey,
              {
                status: res.statusCode,
                data,
                headers: res.getHeaders() as Record<string, string>,
              },
              { ttl, prefix: keyPrefix }
            )
            .catch((error) => {
              logger.error('Failed to cache response:', error);
            });
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      // Continue without caching on error
      next();
    }
  };
}

/**
 * Helper to generate cache key from request parameters
 */
export function generateCacheKey(req: Request): string {
  const { path, query } = req;
  const queryString = Object.keys(query)
    .sort()
    .map((key) => `${key}=${query[key]}`)
    .join('&');

  return queryString ? `${path}?${queryString}` : path;
}

/**
 * Helper to generate user-specific cache key
 */
export function generateUserCacheKey(req: Request): string {
  const userId = (req as unknown as { user?: { id: string } }).user?.id || 'anonymous';
  return `user:${userId}:${generateCacheKey(req)}`;
}
