import { redisDb } from '../src/config/database/redis';

const hasRedis = process.env.REDIS_HOST;

describe('Redis Database Connection', () => {
  if (!hasRedis) {
    it.skip('Redis tests require database configuration', () => {});
    return;
  }

  afterEach(async () => {
    await redisDb.disconnect();
  });

  describe('connect()', () => {
    it('should connect to Redis successfully', async () => {
      await expect(redisDb.connect()).resolves.not.toThrow();
      expect(redisDb.isConnectionActive()).toBe(true);
    });

    it('should handle multiple connect calls gracefully', async () => {
      await redisDb.connect();
      await expect(redisDb.connect()).resolves.not.toThrow();
    });
  });

  describe('disconnect()', () => {
    it('should disconnect from Redis successfully', async () => {
      await redisDb.connect();
      await expect(redisDb.disconnect()).resolves.not.toThrow();
      expect(redisDb.isConnectionActive()).toBe(false);
    });

    it('should handle disconnect when not connected', async () => {
      await expect(redisDb.disconnect()).resolves.not.toThrow();
    });
  });

  describe('getClient()', () => {
    it('should return Redis client when connected', async () => {
      await redisDb.connect();
      const client = redisDb.getClient();
      expect(client).toBeDefined();
    });

    it('should throw error when not connected', () => {
      expect(() => redisDb.getClient()).toThrow('Redis client not initialized');
    });
  });

  describe('set() and get()', () => {
    it('should set and get value successfully', async () => {
      await redisDb.connect();
      await redisDb.set('test-key', 'test-value');
      const value = await redisDb.get('test-key');
      expect(value).toBe('test-value');
      await redisDb.del('test-key');
    });

    it('should set value with TTL', async () => {
      await redisDb.connect();
      await redisDb.set('test-key-ttl', 'test-value', 1);
      const value = await redisDb.get('test-key-ttl');
      expect(value).toBe('test-value');

      await new Promise((resolve) => setTimeout(resolve, 1100));
      const expiredValue = await redisDb.get('test-key-ttl');
      expect(expiredValue).toBeNull();
    }, 5000);

    it('should throw error when not connected', async () => {
      await expect(redisDb.set('key', 'value')).rejects.toThrow('Redis client not initialized');
      await expect(redisDb.get('key')).rejects.toThrow('Redis client not initialized');
    });
  });

  describe('del()', () => {
    it('should delete key successfully', async () => {
      await redisDb.connect();
      await redisDb.set('test-delete', 'value');
      await redisDb.del('test-delete');
      const value = await redisDb.get('test-delete');
      expect(value).toBeNull();
    });

    it('should throw error when not connected', async () => {
      await expect(redisDb.del('key')).rejects.toThrow('Redis client not initialized');
    });
  });

  describe('healthCheck()', () => {
    it('should return healthy status when connected', async () => {
      await redisDb.connect();
      const health = await redisDb.healthCheck();
      expect(health.status).toBe('healthy');
    });

    it('should return disconnected status when not connected', async () => {
      const health = await redisDb.healthCheck();
      expect(health.status).toBe('disconnected');
      expect(health.message).toBe('Redis not connected');
    });
  });
});
