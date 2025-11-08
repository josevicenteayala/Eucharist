/**
 * Health Check Endpoint Tests - Refactored with Test Utilities
 *
 * This is a demonstration of how the test utilities can be used
 * to simplify and standardize test code.
 *
 * Compare with health.test.ts to see the improvements:
 * - Less boilerplate code
 * - Consistent assertions
 * - Better readability
 * - Reusable patterns
 */

import app from '../src/app';
import {
  createGetRequest,
  assertSuccessResponse,
  assertHasFields,
  assertValidTimestamp,
} from './utils';

describe('Health Check Endpoint - Refactored', () => {
  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await createGetRequest(app, '/api/health');

      assertSuccessResponse(response, 200);
      assertHasFields(response.body.data, [
        'status',
        'timestamp',
        'uptime',
        'environment',
        'databases',
      ]);
    });

    it('should return database health status', async () => {
      const response = await createGetRequest(app, '/api/health');

      const { databases } = response.body.data;
      assertHasFields(databases, ['postgres', 'mongodb', 'redis']);
      assertHasFields(databases.postgres, ['status']);
      assertHasFields(databases.mongodb, ['status']);
      assertHasFields(databases.redis, ['status']);
    });

    it('should return valid timestamp', async () => {
      const response = await createGetRequest(app, '/api/health');
      assertValidTimestamp(response.body.data.timestamp);
    });

    it('should return positive uptime', async () => {
      const response = await createGetRequest(app, '/api/health');
      expect(response.body.data.uptime).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 and health status', async () => {
      const response = await createGetRequest(app, '/api/v1/health');

      assertSuccessResponse(response, 200);
      assertHasFields(response.body.data, [
        'status',
        'timestamp',
        'uptime',
        'environment',
        'databases',
      ]);
    });

    it('should return database health status', async () => {
      const response = await createGetRequest(app, '/api/v1/health');

      const { databases } = response.body.data;
      assertHasFields(databases, ['postgres', 'mongodb', 'redis']);
    });

    it('should return valid timestamp', async () => {
      const response = await createGetRequest(app, '/api/v1/health');
      assertValidTimestamp(response.body.data.timestamp);
    });

    it('should return positive uptime', async () => {
      const response = await createGetRequest(app, '/api/v1/health');
      expect(response.body.data.uptime).toBeGreaterThan(0);
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await createGetRequest(app, '/');

      assertSuccessResponse(response, 200);
      assertHasFields(response.body.data, ['message', 'version']);
      expect(response.body.data.message).toBe('Eucharist Platform API');
    });
  });
});
