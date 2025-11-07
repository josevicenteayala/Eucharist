import request from 'supertest';
import app from '../src/app';

describe('Health Check Endpoint', () => {
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
