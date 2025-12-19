import request from 'supertest';
import app from '../src/app';
import { UserModel } from '../src/models/postgres/User';
import { postgresDb } from '../src/config/database/postgres';

describe('Auth Routes Integration', () => {
  beforeAll(async () => {
    await postgresDb.connect();
    // Initialize table first, then clean up
    await UserModel.initializeTable();
    await postgresDb.query('TRUNCATE TABLE users CASCADE');
  });

  afterAll(async () => {
    await postgresDb.disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'integration@test.com',
        password: 'Password123!',
        first_name: 'Integration',
        last_name: 'Test',
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'integration@test.com');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'integration@test.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'integration@test.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });
});
