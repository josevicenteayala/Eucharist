/**
 * Database Test Helpers
 *
 * Utilities for database testing including setup, teardown, and mocking
 */

/**
 * Mock database connection state
 */
export interface MockDatabaseConnection {
  isConnected: boolean;
  connect: jest.Mock;
  disconnect: jest.Mock;
  query: jest.Mock;
  healthCheck: jest.Mock;
}

/**
 * Create a mock database connection for testing
 */
export function createMockDatabase(
  overrides?: Partial<MockDatabaseConnection>
): MockDatabaseConnection {
  return {
    isConnected: false,
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    query: jest.fn().mockResolvedValue({ rows: [] }),
    healthCheck: jest.fn().mockResolvedValue({
      status: 'healthy',
      message: 'Connected',
    }),
    ...overrides,
  };
}

/**
 * Create a mock PostgreSQL pool
 */
export function createMockPostgresPool() {
  return {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      release: jest.fn(),
    }),
    end: jest.fn().mockResolvedValue(undefined),
    totalCount: 0,
    idleCount: 0,
    waitingCount: 0,
  };
}

/**
 * Create a mock MongoDB connection
 */
export function createMockMongoConnection() {
  return {
    readyState: 1, // 1 = connected
    close: jest.fn().mockResolvedValue(undefined),
    model: jest.fn(),
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'test-id' }),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      toArray: jest.fn().mockResolvedValue([]),
    }),
  };
}

/**
 * Create a mock Redis client
 */
export function createMockRedisClient() {
  const store: Record<string, string> = {};

  return {
    get: jest.fn((key: string) => Promise.resolve(store[key] || null)),
    set: jest.fn().mockImplementation((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve('OK');
    }),
    del: jest.fn().mockImplementation((key: string) => {
      delete store[key];
      return Promise.resolve(1);
    }),
    exists: jest.fn((key: string) => Promise.resolve(key in store ? 1 : 0)),
    expire: jest.fn().mockResolvedValue(1),
    ttl: jest.fn().mockResolvedValue(-1),
    keys: jest.fn().mockResolvedValue(Object.keys(store)),
    flushdb: jest.fn().mockImplementation(() => {
      Object.keys(store).forEach((key) => delete store[key]);
      return Promise.resolve('OK');
    }),
    quit: jest.fn().mockResolvedValue('OK'),
    ping: jest.fn().mockResolvedValue('PONG'),
    status: 'ready',
  };
}

/**
 * Setup test database with cleanup
 */
export function setupTestDatabase() {
  const cleanup: Array<() => Promise<void>> = [];

  const helpers = {
    /**
     * Register a cleanup function to run after tests
     */
    addCleanup(fn: () => Promise<void>): void {
      cleanup.push(fn);
    },

    /**
     * Run all cleanup functions
     */
    async runCleanup(): Promise<void> {
      for (const fn of cleanup.reverse()) {
        await fn();
      }
      cleanup.length = 0;
    },
  };

  afterAll(async () => {
    await helpers.runCleanup();
  });

  return helpers;
}

/**
 * Mock successful database query result
 */
export function createMockQueryResult<T>(data: T[], rowCount?: number) {
  return {
    rows: data,
    rowCount: rowCount ?? data.length,
    command: 'SELECT',
    oid: 0,
    fields: [],
  };
}

/**
 * Mock database error
 */
export function createMockDatabaseError(
  message: string = 'Database error',
  code: string = 'ECONNREFUSED'
): Error {
  const error = new Error(message) as Error & { code?: string };
  error.code = code;
  return error;
}

/**
 * Wait for database connection to be ready
 */
export async function waitForDatabaseReady(
  checkFn: () => boolean,
  timeoutMs: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (!checkFn()) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('Database connection timeout');
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
