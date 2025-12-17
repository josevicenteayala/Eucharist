import { redisDb } from '../config/database/redis';
import logger from '../config/logger';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for namespacing
}

class CacheService {
  private defaultTTL = 300; // 5 minutes default
  private defaultPrefix = 'eucharist:';

  /**
   * Generate a cache key with optional prefix
   */
  private generateKey(key: string, prefix?: string): string {
    const finalPrefix = prefix || this.defaultPrefix;
    return `${finalPrefix}${key}`;
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param value - Value to cache (will be JSON stringified)
   * @param options - Cache options (ttl, prefix)
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheKey = this.generateKey(key, options.prefix);
      const ttl = options.ttl || this.defaultTTL;
      const serializedValue = JSON.stringify(value);

      await redisDb.set(cacheKey, serializedValue, ttl);
      logger.debug(`Cache set: ${cacheKey} (TTL: ${ttl}s)`);
    } catch (error) {
      logger.error(`Failed to set cache for key ${key}:`, error);
      // Don't throw - caching failures should not break the application
    }
  }

  /**
   * Get a value from cache
   * @param key - Cache key
   * @param options - Cache options (prefix)
   * @returns Cached value or null if not found/expired
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const cacheKey = this.generateKey(key, options.prefix);
      const value = await redisDb.get(cacheKey);

      if (!value) {
        logger.debug(`Cache miss: ${cacheKey}`);
        return null;
      }

      logger.debug(`Cache hit: ${cacheKey}`);
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Failed to get cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a value from cache
   * @param key - Cache key
   * @param options - Cache options (prefix)
   */
  async del(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const cacheKey = this.generateKey(key, options.prefix);
      await redisDb.del(cacheKey);
      logger.debug(`Cache deleted: ${cacheKey}`);
    } catch (error) {
      logger.error(`Failed to delete cache for key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys matching a pattern
   * @param pattern - Pattern to match (e.g., 'user:*')
   * @param options - Cache options (prefix)
   */
  async delPattern(pattern: string, options: CacheOptions = {}): Promise<void> {
    try {
      const cachePattern = this.generateKey(pattern, options.prefix);
      const client = redisDb.getClient();

      // Use SCAN to find matching keys
      const stream = client.scanStream({
        match: cachePattern,
        count: 100,
      });

      const keys: string[] = [];
      stream.on('data', (resultKeys: string[]) => {
        keys.push(...resultKeys);
      });

      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      if (keys.length > 0) {
        await Promise.all(keys.map((key) => redisDb.del(key)));
        logger.debug(`Cache pattern deleted: ${cachePattern} (${keys.length} keys)`);
      }
    } catch (error) {
      logger.error(`Failed to delete cache pattern ${pattern}:`, error);
    }
  }

  /**
   * Get or set a value in cache (cache-aside pattern)
   * @param key - Cache key
   * @param fetchFn - Function to fetch data if not in cache
   * @param options - Cache options (ttl, prefix)
   * @returns Cached or freshly fetched value
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Cache miss - fetch fresh data
    try {
      const freshData = await fetchFn();
      // Store in cache for next time
      await this.set(key, freshData, options);
      return freshData;
    } catch (error) {
      logger.error(`Failed to fetch data for cache key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if a key exists in cache
   * @param key - Cache key
   * @param options - Cache options (prefix)
   * @returns True if key exists, false otherwise
   */
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const cacheKey = this.generateKey(key, options.prefix);
      const value = await redisDb.get(cacheKey);
      return value !== null;
    } catch (error) {
      logger.error(`Failed to check cache existence for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Increment a numeric value in cache
   * @param key - Cache key
   * @param options - Cache options (prefix)
   * @returns New value after increment
   */
  async increment(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const cacheKey = this.generateKey(key, options.prefix);
      const client = redisDb.getClient();
      const newValue = await client.incr(cacheKey);

      // Set TTL if provided
      if (options.ttl) {
        await client.expire(cacheKey, options.ttl);
      }

      logger.debug(`Cache incremented: ${cacheKey} to ${newValue}`);
      return newValue;
    } catch (error) {
      logger.error(`Failed to increment cache for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set default TTL for cache operations
   * @param ttl - Time to live in seconds
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  /**
   * Set default prefix for cache keys
   * @param prefix - Key prefix
   */
  setDefaultPrefix(prefix: string): void {
    this.defaultPrefix = prefix;
  }
}

export const cacheService = new CacheService();
