/**
 * Test Utilities - Main Export
 *
 * Central export point for all test utilities and helpers.
 *
 * @example
 * ```typescript
 * import { assertSuccessResponse, createMockUser, createEnvScope } from './utils';
 * ```
 */

// API Assertions
export {
  assertSuccessResponse,
  assertErrorResponse,
  assertCorsHeaders,
  assertSecurityHeaders,
  assertPaginatedResponse,
  assertValidTimestamp,
  assertHasFields,
  assertResponseTime,
} from './apiAssertions';

// Mock Data Factories
export {
  createMockUser,
  createMockGospel,
  createMockArticle,
  createMockPrayerIntention,
  createMockError,
  createMockDatabaseHealth,
  createMockArray,
  type MockUser,
  type MockGospel,
  type MockArticle,
  type MockPrayerIntention,
  type MockError,
  type MockDatabaseHealth,
} from './mockData';

// Environment Helpers
export { EnvManager, createEnvScope, withEnv, setupEnvForTests } from './envHelpers';

// HTTP Request Helpers
export {
  createGetRequest,
  createPostRequest,
  createPutRequest,
  createPatchRequest,
  createDeleteRequest,
  createAuthenticatedRequest,
  createCorsRequest,
  createPreflightRequest,
  createRequestWithHeaders,
  testMultipleMethods,
} from './httpHelpers';

// Database Helpers
export {
  createMockDatabase,
  createMockPostgresPool,
  createMockMongoConnection,
  createMockRedisClient,
  setupTestDatabase,
  createMockQueryResult,
  createMockDatabaseError,
  waitForDatabaseReady,
  type MockDatabaseConnection,
} from './databaseHelpers';

// Error Testing Helpers
export {
  createMockRequest,
  createMockResponse,
  createMockNext,
  assertErrorPassedToNext,
  assertErrorResponse as assertErrorResponseFromMock,
  createTestError,
  testAsyncError,
  testSyncError,
  suppressConsoleLogs,
  captureConsoleOutput,
  type MockResponse,
} from './errorHelpers';
