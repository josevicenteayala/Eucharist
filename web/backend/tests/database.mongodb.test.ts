import { mongoDb } from '../src/config/database/mongodb';

const hasMongoDB = process.env.MONGODB_URI;

describe('MongoDB Database Connection', () => {
  if (!hasMongoDB) {
    it.skip('MongoDB tests require database configuration', () => {});
    return;
  }

  afterEach(async () => {
    await mongoDb.disconnect();
  });

  describe('connect()', () => {
    it('should connect to MongoDB successfully', async () => {
      await expect(mongoDb.connect()).resolves.not.toThrow();
      expect(mongoDb.isConnectionActive()).toBe(true);
    }, 10000);

    it('should handle multiple connect calls gracefully', async () => {
      await mongoDb.connect();
      await expect(mongoDb.connect()).resolves.not.toThrow();
    }, 10000);
  });

  describe('disconnect()', () => {
    it('should disconnect from MongoDB successfully', async () => {
      await mongoDb.connect();
      await expect(mongoDb.disconnect()).resolves.not.toThrow();
      expect(mongoDb.isConnectionActive()).toBe(false);
    }, 10000);

    it('should handle disconnect when not connected', async () => {
      await expect(mongoDb.disconnect()).resolves.not.toThrow();
    });
  });

  describe('getConnection()', () => {
    it('should return mongoose instance when connected', async () => {
      await mongoDb.connect();
      const mongoose = mongoDb.getConnection();
      expect(mongoose).toBeDefined();
    }, 10000);

    it('should throw error when not connected', () => {
      expect(() => mongoDb.getConnection()).toThrow('MongoDB not connected');
    });
  });

  describe('healthCheck()', () => {
    it('should return healthy status when connected', async () => {
      await mongoDb.connect();
      const health = await mongoDb.healthCheck();
      expect(health.status).toBe('healthy');
    }, 10000);

    it('should return disconnected status when not connected', async () => {
      const health = await mongoDb.healthCheck();
      expect(health.status).toBe('disconnected');
      expect(health.message).toBe('MongoDB not connected');
    });
  });
});
