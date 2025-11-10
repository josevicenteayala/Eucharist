# Testing and Coverage Guide

This document provides comprehensive guidelines for testing and code coverage in the Eucharist Platform backend.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Code Coverage](#code-coverage)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Overview

The backend uses:

- **Test Framework**: Jest (with ts-jest for TypeScript)
- **HTTP Testing**: Supertest
- **Coverage Tool**: Jest built-in coverage (Istanbul)
- **Minimum Coverage**: 80% across all metrics

## Test Structure

Tests are organized in two ways:

### 1. Tests Directory (`tests/`)

Centralized tests for integration, middleware, and cross-cutting concerns:

```
tests/
├── health.test.ts              # Health endpoint tests
├── errorHandler.test.ts        # Error handling middleware
├── utils/
│   └── utils.test.ts          # Utility function tests
└── examples/
    └── utilityUsageExamples.test.ts
```

### 2. Co-located Tests

Unit tests placed next to source files:

```
src/
├── services/
│   ├── userService.ts
│   └── userService.test.ts     # Co-located unit test
└── utils/
    ├── validator.ts
    └── validator.test.ts
```

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- health.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="health endpoint"
```

### Coverage Reports

After running `npm run test:coverage`:

1. **Terminal Output**: Summary in console
2. **HTML Report**: `coverage/lcov-report/index.html` - Open in browser for detailed view
3. **LCOV File**: `coverage/lcov.info` - For CI/CD tools
4. **Coverage JSON**: `coverage/coverage-final.json` - For Codecov

## Code Coverage

### Coverage Thresholds

The project enforces **80% minimum coverage** for:

- **Lines**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Statements**: 80%

These thresholds are enforced in:

1. Local development (`npm run test:coverage`)
2. Pre-commit hooks
3. CI/CD pipeline (GitHub Actions)

### Understanding Coverage Metrics

**Lines Coverage**

- Percentage of executable code lines that were executed during tests
- Example: If a function has 10 lines and tests execute 8, coverage is 80%

**Branch Coverage**

- Percentage of conditional branches (if/else, switch, ternary) tested
- Example: An if/else statement needs tests for both paths

```typescript
// This needs 2 tests: one where condition is true, one where false
if (user.isActive) {
  return 'active';
} else {
  return 'inactive';
}
```

**Function Coverage**

- Percentage of functions that were called during tests
- Includes methods, arrow functions, and named functions

**Statement Coverage**

- Percentage of statements executed
- Similar to line coverage but counts logical statements

### Files Excluded from Coverage

```javascript
collectCoverageFrom: [
  'src/**/*.ts',                    // Include all TypeScript files
  '!src/**/*.d.ts',                 // Exclude type definitions
  '!src/**/*.interface.ts',         // Exclude interface files
  '!src/index.ts',                  // Exclude entry point
],
```

## Writing Tests

### Test File Naming

- Unit tests: `*.test.ts` or `*.spec.ts`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.test.ts`

### Test Structure

```typescript
import request from 'supertest';
import app from '../src/app';

describe('Feature Name', () => {
  // Setup before all tests
  beforeAll(() => {
    // Database connections, etc.
  });

  // Cleanup after all tests
  afterAll(() => {
    // Close connections
  });

  // Setup before each test
  beforeEach(() => {
    // Reset test data
  });

  // Cleanup after each test
  afterEach(() => {
    // Clear mocks
  });

  describe('Specific functionality', () => {
    it('should do something successfully', async () => {
      // Arrange
      const input = { name: 'test' };

      // Act
      const result = await someFunction(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('test');
    });

    it('should handle errors gracefully', async () => {
      // Test error paths
      await expect(someFunction(null)).rejects.toThrow();
    });
  });
});
```

### Testing HTTP Endpoints

```typescript
import request from 'supertest';
import app from '../src/app';

describe('GET /api/v1/health', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveProperty('status', 'ok');
  });
});
```

### Mocking Dependencies

```typescript
// Mock external dependencies
jest.mock('../src/config/database/mongodb', () => ({
  connectMongoDB: jest.fn().mockResolvedValue(undefined),
  disconnectMongoDB: jest.fn().mockResolvedValue(undefined),
}));

// Mock specific functions
const mockUserService = {
  findById: jest.fn().mockResolvedValue({ id: '1', name: 'Test' }),
};
```

## Best Practices

### 1. Test Pyramid

Follow the test pyramid approach:

```
           /\
          /  \  E2E Tests (Few)
         /----\
        /      \ Integration Tests (Some)
       /--------\
      /          \ Unit Tests (Many)
     /____________\
```

**Unit Tests (70-80%)**

- Fast, isolated, focused
- Test individual functions and classes
- Mock external dependencies

**Integration Tests (15-25%)**

- Test component interactions
- Use real dependencies where practical
- Test API endpoints with real middleware

**E2E Tests (5-10%)**

- Test complete user flows
- Most expensive to maintain
- Critical paths only

### 2. Test Coverage Quality

**Good Coverage ✅**

```typescript
describe('calculateDiscount', () => {
  it('should apply 10% discount for regular users', () => {
    expect(calculateDiscount(100, 'regular')).toBe(90);
  });

  it('should apply 20% discount for premium users', () => {
    expect(calculateDiscount(100, 'premium')).toBe(80);
  });

  it('should handle zero amount', () => {
    expect(calculateDiscount(0, 'regular')).toBe(0);
  });

  it('should throw error for invalid user type', () => {
    expect(() => calculateDiscount(100, 'invalid')).toThrow();
  });
});
```

**Poor Coverage ❌**

```typescript
describe('calculateDiscount', () => {
  it('should work', () => {
    expect(calculateDiscount(100, 'regular')).toBeDefined();
  });
});
```

### 3. Test What Matters

**Do Test:**

- Business logic and algorithms
- Error handling and edge cases
- API contract (request/response format)
- Database queries and data transformations
- Authentication and authorization logic

**Don't Test:**

- Third-party library internals
- TypeScript type definitions
- Simple getters/setters without logic
- Framework code (Express, Jest, etc.)

### 4. Keep Tests Fast

- Mock external services (databases, APIs)
- Use in-memory databases for integration tests
- Parallelize independent tests
- Avoid unnecessary async operations

### 5. Write Maintainable Tests

- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- One assertion concept per test
- Keep tests independent
- Avoid test interdependencies

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`

### Workflow Jobs

1. **Lint**: Code style and formatting
2. **Test**: Run all tests with coverage
3. **TypeCheck**: TypeScript compilation
4. **Security**: npm audit for vulnerabilities
5. **Build**: Compile TypeScript to JavaScript

### Coverage Reports

- Uploaded to Codecov for tracking
- Available as downloadable artifacts
- Coverage badges in README
- PR comments show coverage changes

### Viewing Coverage in CI

1. Go to GitHub Actions
2. Select the workflow run
3. Download "backend-coverage-report" artifact
4. Extract and open `index.html`

## Troubleshooting

### Coverage Not Meeting Threshold

**Problem**: `Jest: "global" coverage threshold for lines (80%) not met: 75%`

**Solutions:**

1. Run coverage locally: `npm run test:coverage`
2. Open HTML report to see uncovered lines
3. Add tests for uncovered code paths
4. Check for dead code that can be removed

### Tests Failing in CI but Passing Locally

**Common Causes:**

- Environment-specific configuration
- Timing/race conditions
- Different Node.js versions
- Database state differences

**Solutions:**

1. Check CI logs for specific errors
2. Ensure environment variables are set
3. Mock time-dependent functions
4. Use proper async/await patterns

### Slow Tests

**Causes:**

- Real database connections
- External API calls
- Large data processing

**Solutions:**

1. Mock external dependencies
2. Use test data factories
3. Parallelize tests with `--maxWorkers`
4. Profile tests: `npm test -- --detectOpenHandles`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Codecov Documentation](https://docs.codecov.com/)

## Questions?

If you have questions about testing or coverage:

1. Check this document
2. Review existing tests for examples
3. Ask in GitHub Discussions
4. Create an issue with the `question` label
