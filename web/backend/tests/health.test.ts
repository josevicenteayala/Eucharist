import request from 'supertest';
import app from '../src/app';
import * as database from '../src/config/database';

// Mock the database module
jest.mock('../src/config/database', () => {
  const originalModule = jest.requireActual('../src/config/database');
  return {
    ...originalModule,
    checkDatabasesHealth: jest.fn(),
  };
});

describe('Health Check Endpoint', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default mock: all databases healthy
    (database.checkDatabasesHealth as jest.Mock).mockResolvedValue({
      postgres: { status: 'healthy' },
      mongodb: { status: 'healthy' },
      redis: { status: 'healthy' },
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('databases');
    });

    it('should return database health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body.data.databases).toHaveProperty('postgres');
      expect(response.body.data.databases).toHaveProperty('mongodb');
      expect(response.body.data.databases).toHaveProperty('redis');

      expect(response.body.data.databases.postgres).toHaveProperty('status');
      expect(response.body.data.databases.mongodb).toHaveProperty('status');
      expect(response.body.data.databases.redis).toHaveProperty('status');
    });

    it('should return valid timestamp', async () => {
      const response = await request(app).get('/api/health');

      const timestamp = new Date(response.body.data.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });

    it('should return positive uptime', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body.data.uptime).toBeGreaterThan(0);
    });

    it('should return healthy status when all databases are healthy', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('healthy');
      expect(response.body.data.databases.postgres.status).toBe('healthy');
      expect(response.body.data.databases.mongodb.status).toBe('healthy');
      expect(response.body.data.databases.redis.status).toBe('healthy');
    });

    it('should return degraded status when postgres is unhealthy', async () => {
      (database.checkDatabasesHealth as jest.Mock).mockResolvedValue({
        postgres: { status: 'unhealthy', message: 'Connection failed' },
        mongodb: { status: 'healthy' },
        redis: { status: 'healthy' },
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('degraded');
      expect(response.body.data.databases.postgres.status).toBe('unhealthy');
      expect(response.body.data.databases.postgres.message).toBe('Connection failed');
    });

    it('should return degraded status when mongodb is disconnected', async () => {
      (database.checkDatabasesHealth as jest.Mock).mockResolvedValue({
        postgres: { status: 'healthy' },
        mongodb: { status: 'disconnected', message: 'MongoDB not connected' },
        redis: { status: 'healthy' },
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('degraded');
      expect(response.body.data.databases.mongodb.status).toBe('disconnected');
    });

    it('should return degraded status when redis is unhealthy', async () => {
      (database.checkDatabasesHealth as jest.Mock).mockResolvedValue({
        postgres: { status: 'healthy' },
        mongodb: { status: 'healthy' },
        redis: { status: 'unhealthy', message: 'Ping failed' },
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('degraded');
      expect(response.body.data.databases.redis.status).toBe('unhealthy');
    });

    it('should return degraded status when all databases are disconnected', async () => {
      (database.checkDatabasesHealth as jest.Mock).mockResolvedValue({
        postgres: { status: 'disconnected', message: 'PostgreSQL not connected' },
        mongodb: { status: 'disconnected', message: 'MongoDB not connected' },
        redis: { status: 'disconnected', message: 'Redis not connected' },
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('degraded');
      expect(response.body.data.databases.postgres.status).toBe('disconnected');
      expect(response.body.data.databases.mongodb.status).toBe('disconnected');
      expect(response.body.data.databases.redis.status).toBe('disconnected');
    });

    it('should return degraded status when multiple databases are unhealthy', async () => {
      (database.checkDatabasesHealth as jest.Mock).mockResolvedValue({
        postgres: { status: 'unhealthy', message: 'Connection timeout' },
        mongodb: { status: 'unhealthy', message: 'Authentication failed' },
        redis: { status: 'healthy' },
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('degraded');
      expect(response.body.data.databases.postgres.status).toBe('unhealthy');
      expect(response.body.data.databases.mongodb.status).toBe('unhealthy');
      expect(response.body.data.databases.redis.status).toBe('healthy');
    });

    it('should return environment from NODE_ENV', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body.data.environment).toBeDefined();
      expect(typeof response.body.data.environment).toBe('string');
    });

    it('should respond quickly (within 1 second)', async () => {
      const startTime = Date.now();
      await request(app).get('/api/health');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(1000);
    });

    it('should include CORS headers when Origin is provided', async () => {
      const response = await request(app).get('/api/health').set('Origin', 'http://localhost:3001');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('databases');
    });

    it('should return database health status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.body.data.databases).toHaveProperty('postgres');
      expect(response.body.data.databases).toHaveProperty('mongodb');
      expect(response.body.data.databases).toHaveProperty('redis');

      expect(response.body.data.databases.postgres).toHaveProperty('status');
      expect(response.body.data.databases.mongodb).toHaveProperty('status');
      expect(response.body.data.databases.redis).toHaveProperty('status');
    });

    it('should return valid timestamp', async () => {
      const response = await request(app).get('/api/v1/health');

      const timestamp = new Date(response.body.data.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });

    it('should return positive uptime', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.body.data.uptime).toBeGreaterThan(0);
    });

    it('should return healthy status when all databases are healthy', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('healthy');
    });

    it('should return degraded status when any database is not healthy', async () => {
      (database.checkDatabasesHealth as jest.Mock).mockResolvedValue({
        postgres: { status: 'healthy' },
        mongodb: { status: 'unhealthy', message: 'Connection error' },
        redis: { status: 'healthy' },
      });

      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('degraded');
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('message', 'Eucharist Platform API');
      expect(response.body.data).toHaveProperty('version');
    });
  });
});
