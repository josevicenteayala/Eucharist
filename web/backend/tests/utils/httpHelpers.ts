/**
 * HTTP Request Test Helpers
 *
 * Utilities for common HTTP request patterns in tests
 */

import request, { Test } from 'supertest';
import { Application } from 'express';

/**
 * Create a GET request with common headers
 */
export function createGetRequest(app: Application, path: string): Test {
  return request(app).get(path).set('Accept', 'application/json');
}

/**
 * Create a POST request with JSON body
 */
export function createPostRequest(
  app: Application,
  path: string,
  body: Record<string, unknown>
): Test {
  return request(app)
    .post(path)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(body);
}

/**
 * Create a PUT request with JSON body
 */
export function createPutRequest(
  app: Application,
  path: string,
  body: Record<string, unknown>
): Test {
  return request(app)
    .put(path)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(body);
}

/**
 * Create a PATCH request with JSON body
 */
export function createPatchRequest(
  app: Application,
  path: string,
  body: Record<string, unknown>
): Test {
  return request(app)
    .patch(path)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(body);
}

/**
 * Create a DELETE request
 */
export function createDeleteRequest(app: Application, path: string): Test {
  return request(app).delete(path).set('Accept', 'application/json');
}

/**
 * Create a request with authentication token
 */
export function createAuthenticatedRequest(
  app: Application,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  token: string,
  body?: Record<string, unknown>
): Test {
  const req = request(app)
    [method.toLowerCase() as Lowercase<typeof method>](path)
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json');

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    req.set('Content-Type', 'application/json').send(body);
  }

  return req;
}

/**
 * Create a request with CORS headers
 */
export function createCorsRequest(
  app: Application,
  method: string,
  path: string,
  origin: string
): Test {
  return request(app)
    [method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options'](path)
    .set('Origin', origin)
    .set('Accept', 'application/json');
}

/**
 * Create an OPTIONS preflight request
 */
export function createPreflightRequest(
  app: Application,
  path: string,
  origin: string,
  requestMethod: string,
  requestHeaders: string[] = []
): Test {
  const req = request(app)
    .options(path)
    .set('Origin', origin)
    .set('Access-Control-Request-Method', requestMethod);

  if (requestHeaders.length > 0) {
    req.set('Access-Control-Request-Headers', requestHeaders.join(','));
  }

  return req;
}

/**
 * Create a request with custom headers
 */
export function createRequestWithHeaders(
  app: Application,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  headers: Record<string, string>,
  body?: Record<string, unknown>
): Test {
  const req = request(app)[method.toLowerCase() as Lowercase<typeof method>](path);

  Object.entries(headers).forEach(([key, value]) => {
    req.set(key, value);
  });

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    req.send(body);
  }

  return req;
}

/**
 * Helper to test multiple request methods on the same endpoint
 */
export async function testMultipleMethods(
  app: Application,
  path: string,
  methods: Array<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>,
  expectedStatus: number
): Promise<void> {
  for (const method of methods) {
    const response = await request(app)[method.toLowerCase() as Lowercase<typeof method>](path);
    expect(response.status).toBe(expectedStatus);
  }
}
