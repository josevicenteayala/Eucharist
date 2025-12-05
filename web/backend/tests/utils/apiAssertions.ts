/**
 * API Response Assertion Helpers
 *
 * Common assertion utilities for testing API responses
 * following the standard response format defined in the project.
 */

import { Response } from 'supertest';

/**
 * Assert that a response follows the success format
 */
export function assertSuccessResponse(response: Response, expectedStatus: number = 200) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
}

/**
 * Assert that a response follows the error format
 */
export function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedCode?: string,
  expectedMessage?: string
) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('error');
  expect(response.body.error).toHaveProperty('code');
  expect(response.body.error).toHaveProperty('message');

  if (expectedCode) {
    expect(response.body.error.code).toBe(expectedCode);
  }

  if (expectedMessage) {
    expect(response.body.error.message).toBe(expectedMessage);
  }
}

/**
 * Assert CORS headers are present and valid
 */
export function assertCorsHeaders(response: Response, origin: string) {
  expect(response.headers['access-control-allow-origin']).toBe(origin);
  expect(response.headers['access-control-allow-credentials']).toBe('true');
}

/**
 * Assert security headers are present
 */
export function assertSecurityHeaders(response: Response) {
  expect(response.headers).toHaveProperty('x-content-type-options');
  expect(response.headers).toHaveProperty('x-frame-options');
  expect(response.headers).toHaveProperty('x-xss-protection');
}

/**
 * Assert paginated response format
 */
export function assertPaginatedResponse(response: Response, expectedStatus: number = 200) {
  assertSuccessResponse(response, expectedStatus);
  expect(response.body).toHaveProperty('meta');
  expect(response.body.meta).toHaveProperty('page');
  expect(response.body.meta).toHaveProperty('limit');
  expect(response.body.meta).toHaveProperty('total');
  expect(Array.isArray(response.body.data)).toBe(true);
}

/**
 * Assert response has valid timestamp
 */
export function assertValidTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  expect(date.toString()).not.toBe('Invalid Date');
  expect(date.getTime()).toBeGreaterThan(0);
}

/**
 * Assert response data contains required fields
 */
export function assertHasFields(data: Record<string, unknown>, fields: string[]) {
  fields.forEach((field) => {
    expect(data).toHaveProperty(field);
  });
}

/**
 * Assert response time is within acceptable range
 */
export function assertResponseTime(response: Response, maxMs: number = 1000) {
  const responseTime = parseInt(response.headers['x-response-time'] || '0');
  expect(responseTime).toBeLessThanOrEqual(maxMs);
}
