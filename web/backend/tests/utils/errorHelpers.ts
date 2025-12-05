/**
 * Error Testing Helpers
 *
 * Utilities for testing error handling and error responses
 */

import { Request, NextFunction } from 'express';

/**
 * Mock Express Response type
 */
export interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  status: jest.Mock;
  json: jest.Mock;
  send: jest.Mock;
  set: jest.Mock;
  get: jest.Mock;
  cookie: jest.Mock;
  clearCookie: jest.Mock;
  redirect: jest.Mock;
  render: jest.Mock;
  sendStatus: jest.Mock;
}

/**
 * Create a mock Express request object
 */
export function createMockRequest(overrides?: Partial<Request>): Partial<Request> {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: 'GET',
    path: '/test',
    url: '/test',
    get: jest.fn(),
    ...overrides,
  };
}

/**
 * Create a mock Express response object
 */
export function createMockResponse(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    headers: {},
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    get: jest.fn(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  };

  // Make status update statusCode
  res.status.mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });

  return res;
}

/**
 * Create a mock Express next function
 */
export function createMockNext(): jest.Mock<NextFunction> {
  return jest.fn() as jest.Mock<NextFunction>;
}

/**
 * Assert that an error was passed to next()
 */
export function assertErrorPassedToNext(next: jest.Mock, expectedError?: Error | string): void {
  expect(next).toHaveBeenCalled();
  const error = next.mock.calls[0][0];
  expect(error).toBeInstanceOf(Error);

  if (typeof expectedError === 'string') {
    expect(error.message).toBe(expectedError);
  } else if (expectedError) {
    expect(error).toBe(expectedError);
  }
}

/**
 * Assert that an error response was sent
 */
export function assertErrorResponse(
  res: MockResponse,
  expectedStatus: number,
  expectedCode?: string
): void {
  expect(res.status).toHaveBeenCalledWith(expectedStatus);
  expect(res.json).toHaveBeenCalled();

  const response = res.json.mock.calls[0][0];
  expect(response).toHaveProperty('success', false);
  expect(response).toHaveProperty('error');
  expect(response.error).toHaveProperty('message');

  if (expectedCode) {
    expect(response.error.code).toBe(expectedCode);
  }
}

/**
 * Create a test error with custom properties
 */
export function createTestError(message: string, properties?: Record<string, unknown>): Error {
  const error = new Error(message);
  Object.assign(error, properties);
  return error;
}

/**
 * Test async error handling
 */
export async function testAsyncError(
  asyncFn: () => Promise<void>,
  expectedError: string | RegExp
): Promise<void> {
  await expect(asyncFn()).rejects.toThrow(expectedError);
}

/**
 * Test that a function throws synchronously
 */
export function testSyncError(fn: () => void, expectedError: string | RegExp): void {
  expect(fn).toThrow(expectedError);
}

/**
 * Mock console methods to suppress error logs in tests
 */
export function suppressConsoleLogs() {
  const originalError = console.error;

  const originalWarn = console.warn;
  // eslint-disable-next-line no-console
  const originalLog = console.log;

  beforeAll(() => {
    console.error = jest.fn();

    console.warn = jest.fn();
    // eslint-disable-next-line no-console
    console.log = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;

    console.warn = originalWarn;
    // eslint-disable-next-line no-console
    console.log = originalLog;
  });
}

/**
 * Capture console output during a test
 */
export function captureConsoleOutput() {
  const logs: string[] = [];
  const errors: string[] = [];
  const warns: string[] = [];

  // eslint-disable-next-line no-console
  const originalLog = console.log;

  const originalError = console.error;

  const originalWarn = console.warn;

  beforeEach(() => {
    logs.length = 0;
    errors.length = 0;
    warns.length = 0;

    // eslint-disable-next-line no-console
    console.log = jest.fn((...args: unknown[]) => {
      logs.push(args.join(' '));
    });

    console.error = jest.fn((...args: unknown[]) => {
      errors.push(args.join(' '));
    });

    console.warn = jest.fn((...args: unknown[]) => {
      warns.push(args.join(' '));
    });
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.log = originalLog;

    console.error = originalError;

    console.warn = originalWarn;
  });

  return { logs, errors, warns };
}
