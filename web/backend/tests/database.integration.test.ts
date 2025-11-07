import {
  connectDatabases,
  disconnectDatabases,
  checkDatabasesHealth,
} from '../src/config/database';

const hasDatabases = process.env.POSTGRES_HOST && process.env.MONGODB_URI && process.env.REDIS_HOST;

describe('Database Integration', () => {
  if (!hasDatabases) {
    it.skip('Integration tests require all databases configured', () => {});
    return;
  }

  afterEach(async () => {
    await disconnectDatabases();
  });

  describe('connectDatabases()', () => {
    it('should connect all databases successfully', async () => {
      await expect(connectDatabases()).resolves.not.toThrow();
    }, 15000);
  });

  describe('disconnectDatabases()', () => {
    it('should disconnect all databases successfully', async () => {
      await connectDatabases();
      await expect(disconnectDatabases()).resolves.not.toThrow();
    }, 15000);

    it('should handle disconnect when not connected', async () => {
      await expect(disconnectDatabases()).resolves.not.toThrow();
    });
  });

  describe('checkDatabasesHealth()', () => {
    it('should return health status for all databases', async () => {
      await connectDatabases();
      const health = await checkDatabasesHealth();

      expect(health).toHaveProperty('postgres');
      expect(health).toHaveProperty('mongodb');
      expect(health).toHaveProperty('redis');

      expect(health.postgres.status).toBe('healthy');
      expect(health.mongodb.status).toBe('healthy');
      expect(health.redis.status).toBe('healthy');
    }, 15000);

    it('should return disconnected status when databases are not connected', async () => {
      const health = await checkDatabasesHealth();

      expect(health.postgres.status).toBe('disconnected');
      expect(health.mongodb.status).toBe('disconnected');
      expect(health.redis.status).toBe('disconnected');
    });
  });
});
