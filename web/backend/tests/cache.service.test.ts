import { cacheService } from '../src/services/cache.service';
import { redisDb } from '../src/config/database/redis';

const hasRedis = process.env.REDIS_HOST;

describe('Cache Service', () => {
  if (!hasRedis) {
    it.skip('Cache service tests require Redis configuration', () => {});
    return;
  }

  beforeAll(async () => {
    await redisDb.connect();
  });

  afterAll(async () => {
    await redisDb.disconnect();
  });

  afterEach(async () => {
    // Clean up test keys after each test
    const client = redisDb.getClient();
    const keys = await client.keys('eucharist:test:*');
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redisDb.del(key)));
    }
  });

  describe('set() and get()', () => {
    it('should set and get a simple value', async () => {
      const key = 'test:simple';
      const value = 'test-value';

      await cacheService.set(key, value);
      const retrieved = await cacheService.get<string>(key);

      expect(retrieved).toBe(value);
    });

    it('should set and get an object', async () => {
      const key = 'test:object';
      const value = { name: 'John', age: 30, active: true };

      await cacheService.set(key, value);
      const retrieved = await cacheService.get<typeof value>(key);

      expect(retrieved).toEqual(value);
    });

    it('should set and get an array', async () => {
      const key = 'test:array';
      const value = [1, 2, 3, 4, 5];

      await cacheService.set(key, value);
      const retrieved = await cacheService.get<number[]>(key);

      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent key', async () => {
      const retrieved = await cacheService.get<string>('test:nonexistent');
      expect(retrieved).toBeNull();
    });

    it('should respect TTL and expire keys', async () => {
      const key = 'test:ttl';
      const value = 'expires-soon';

      await cacheService.set(key, value, { ttl: 1 });

      // Immediately after setting, value should exist
      let retrieved = await cacheService.get<string>(key);
      expect(retrieved).toBe(value);

      // After TTL expires, value should be null
      await new Promise((resolve) => setTimeout(resolve, 1100));
      retrieved = await cacheService.get<string>(key);
      expect(retrieved).toBeNull();
    }, 5000);

    it('should use custom prefix', async () => {
      const key = 'test:prefix';
      const value = 'custom-prefix-value';
      const customPrefix = 'custom:';

      await cacheService.set(key, value, { prefix: customPrefix });
      const retrieved = await cacheService.get<string>(key, { prefix: customPrefix });

      expect(retrieved).toBe(value);

      // Should not be found with default prefix
      const notFound = await cacheService.get<string>(key);
      expect(notFound).toBeNull();
    });
  });

  describe('del()', () => {
    it('should delete a key', async () => {
      const key = 'test:delete';
      const value = 'to-be-deleted';

      await cacheService.set(key, value);
      expect(await cacheService.get<string>(key)).toBe(value);

      await cacheService.del(key);
      expect(await cacheService.get<string>(key)).toBeNull();
    });

    it('should handle deleting non-existent key', async () => {
      await expect(cacheService.del('test:nonexistent')).resolves.not.toThrow();
    });
  });

  describe('delPattern()', () => {
    it('should delete multiple keys matching pattern', async () => {
      // Set up test data
      await cacheService.set('test:user:1', { id: 1 });
      await cacheService.set('test:user:2', { id: 2 });
      await cacheService.set('test:user:3', { id: 3 });
      await cacheService.set('test:product:1', { id: 1 });

      // Delete all user keys
      await cacheService.delPattern('test:user:*');

      // User keys should be deleted
      expect(await cacheService.get('test:user:1')).toBeNull();
      expect(await cacheService.get('test:user:2')).toBeNull();
      expect(await cacheService.get('test:user:3')).toBeNull();

      // Product key should still exist
      expect(await cacheService.get('test:product:1')).not.toBeNull();
    });

    it('should handle pattern with no matches', async () => {
      await expect(cacheService.delPattern('test:nomatch:*')).resolves.not.toThrow();
    });
  });

  describe('getOrSet()', () => {
    it('should fetch and cache value on cache miss', async () => {
      const key = 'test:getOrSet';
      let fetchCount = 0;

      const fetchFn = async () => {
        fetchCount++;
        return { data: 'fetched-data', timestamp: Date.now() };
      };

      // First call should fetch
      const result1 = await cacheService.getOrSet(key, fetchFn);
      expect(result1.data).toBe('fetched-data');
      expect(fetchCount).toBe(1);

      // Second call should use cache
      const result2 = await cacheService.getOrSet(key, fetchFn);
      expect(result2).toEqual(result1);
      expect(fetchCount).toBe(1); // Should not fetch again
    });

    it('should return cached value on cache hit', async () => {
      const key = 'test:cached';
      const cachedValue = { data: 'already-cached' };

      // Pre-populate cache
      await cacheService.set(key, cachedValue);

      const fetchFn = async () => {
        throw new Error('Should not be called');
      };

      const result = await cacheService.getOrSet(key, fetchFn);
      expect(result).toEqual(cachedValue);
    });

    it('should propagate errors from fetch function', async () => {
      const key = 'test:error';
      const fetchFn = async () => {
        throw new Error('Fetch failed');
      };

      await expect(cacheService.getOrSet(key, fetchFn)).rejects.toThrow('Fetch failed');
    });
  });

  describe('exists()', () => {
    it('should return true for existing key', async () => {
      const key = 'test:exists';
      await cacheService.set(key, 'value');

      expect(await cacheService.exists(key)).toBe(true);
    });

    it('should return false for non-existent key', async () => {
      expect(await cacheService.exists('test:nonexistent')).toBe(false);
    });

    it('should return false for expired key', async () => {
      const key = 'test:expired';
      await cacheService.set(key, 'value', { ttl: 1 });

      expect(await cacheService.exists(key)).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 1100));
      expect(await cacheService.exists(key)).toBe(false);
    }, 5000);
  });

  describe('increment()', () => {
    it('should increment a counter', async () => {
      const key = 'test:counter';

      const value1 = await cacheService.increment(key);
      expect(value1).toBe(1);

      const value2 = await cacheService.increment(key);
      expect(value2).toBe(2);

      const value3 = await cacheService.increment(key);
      expect(value3).toBe(3);
    });

    it('should increment with TTL', async () => {
      const key = 'test:counter:ttl';

      await cacheService.increment(key, { ttl: 1 });
      expect(await cacheService.exists(key)).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 1100));
      expect(await cacheService.exists(key)).toBe(false);
    }, 5000);

    it('should increment with custom prefix', async () => {
      const key = 'test:counter:prefix';
      const prefix = 'counter:';

      const value = await cacheService.increment(key, { prefix });
      expect(value).toBe(1);
    });
  });

  describe('setDefaultTTL() and setDefaultPrefix()', () => {
    it('should use custom default TTL', async () => {
      const originalTTL = 300;
      cacheService.setDefaultTTL(1);

      const key = 'test:default-ttl';
      await cacheService.set(key, 'value');

      // Value should exist immediately
      expect(await cacheService.get(key)).toBe('value');

      // Value should expire after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1100));
      expect(await cacheService.get(key)).toBeNull();

      // Restore original TTL
      cacheService.setDefaultTTL(originalTTL);
    }, 5000);

    it('should use custom default prefix', async () => {
      const originalPrefix = 'eucharist:';
      cacheService.setDefaultPrefix('custom:');

      const key = 'test:default-prefix';
      await cacheService.set(key, 'value');

      // Should be retrievable with new default prefix
      const retrieved = await cacheService.get(key);
      expect(retrieved).toBe('value');

      // Restore original prefix
      cacheService.setDefaultPrefix(originalPrefix);

      // Should not be found with restored prefix
      const notFound = await cacheService.get(key);
      expect(notFound).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should gracefully handle cache failures', async () => {
      // Disconnect Redis to simulate failure
      await redisDb.disconnect();

      // Operations should not throw, but log errors
      await expect(cacheService.set('key', 'value')).resolves.not.toThrow();
      await expect(cacheService.get('key')).resolves.toBeNull();
      await expect(cacheService.del('key')).resolves.not.toThrow();

      // Reconnect for other tests
      await redisDb.connect();
    });
  });
});
