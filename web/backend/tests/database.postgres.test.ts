import { postgresDb } from '../src/config/database/postgres';

const hasPostgres = process.env.POSTGRES_HOST && process.env.POSTGRES_USER;

describe('PostgreSQL Database Connection', () => {
  if (!hasPostgres) {
    it.skip('PostgreSQL tests require database configuration', () => {});
    return;
  }

  afterEach(async () => {
    await postgresDb.disconnect();
  });

  describe('connect()', () => {
    it('should connect to PostgreSQL successfully', async () => {
      await expect(postgresDb.connect()).resolves.not.toThrow();
      expect(postgresDb.isConnectionActive()).toBe(true);
    });

    it('should handle multiple connect calls gracefully', async () => {
      await postgresDb.connect();
      await expect(postgresDb.connect()).resolves.not.toThrow();
    });
  });

  describe('disconnect()', () => {
    it('should disconnect from PostgreSQL successfully', async () => {
      await postgresDb.connect();
      await expect(postgresDb.disconnect()).resolves.not.toThrow();
      expect(postgresDb.isConnectionActive()).toBe(false);
    });

    it('should handle disconnect when not connected', async () => {
      await expect(postgresDb.disconnect()).resolves.not.toThrow();
    });
  });

  describe('getPool()', () => {
    it('should return pool when connected', async () => {
      await postgresDb.connect();
      const pool = postgresDb.getPool();
      expect(pool).toBeDefined();
    });

    it('should throw error when not connected', () => {
      expect(() => postgresDb.getPool()).toThrow('PostgreSQL pool not initialized');
    });
  });

  describe('query()', () => {
    it('should execute query successfully', async () => {
      await postgresDb.connect();
      const result = await postgresDb.query('SELECT 1 as num');
      expect(result).toBeDefined();
    });

    it('should throw error when not connected', async () => {
      await expect(postgresDb.query('SELECT 1')).rejects.toThrow('PostgreSQL pool not initialized');
    });
  });

  describe('getClient()', () => {
    it('should get client and release successfully', async () => {
      await postgresDb.connect();
      const client = await postgresDb.getClient();
      expect(client).toBeDefined();
      client.release();
    });

    it('should throw error when not connected', async () => {
      await expect(postgresDb.getClient()).rejects.toThrow('PostgreSQL pool not initialized');
    });
  });

  describe('healthCheck()', () => {
    it('should return healthy status when connected', async () => {
      await postgresDb.connect();
      const health = await postgresDb.healthCheck();
      expect(health.status).toBe('healthy');
    });

    it('should return disconnected status when not connected', async () => {
      const health = await postgresDb.healthCheck();
      expect(health.status).toBe('disconnected');
      expect(health.message).toBe('PostgreSQL not connected');
    });
  });
});
