# Coverage Improvement Guide

**Status**: Active  
**Created**: 2025-11-10  
**Owner**: Developer/Tester Agents

## Current Coverage Status

As of November 2025:

- **Current Coverage**: ~51%
- **Target Coverage**: 80% (minimum threshold)
- **Gap**: ~29% coverage needed

### Coverage by Module

| Module               | Lines  | Branches | Functions | Statements | Priority |
| -------------------- | ------ | -------- | --------- | ---------- | -------- |
| src/config/database  | 19.77% | 13.51%   | 23.25%    | 18.85%     | HIGH     |
| src/config/logger.ts | 63.15% | 25%      | 50%       | 63.15%     | MEDIUM   |
| src/config/cors.ts   | 77.77% | 50%      | 66.66%    | 82.35%     | LOW      |
| src/middleware       | 98.21% | 88.23%   | 61.9%     | 98%        | LOW      |
| src/routes           | 100%   | 85.71%   | 100%      | 100%       | LOW      |
| src/app.ts           | 96.15% | 50%      | 100%      | 96.15%     | LOW      |

## Priority Areas for Testing

### 1. Database Configuration (HIGH PRIORITY)

**Files to Test:**

- `src/config/database/mongodb.ts` (14.89% coverage)
- `src/config/database/postgres.ts` (17.77% coverage)
- `src/config/database/redis.ts` (14.28% coverage)
- `src/config/database/index.ts` (41.37% coverage)

**Why Priority:**

- Core infrastructure components
- Critical for application functionality
- Connection handling needs error path testing

**Testing Approach:**

```typescript
// Example test structure needed
describe('MongoDB Configuration', () => {
  describe('connectMongoDB', () => {
    it('should connect successfully with valid URI');
    it('should handle connection errors');
    it('should retry on transient failures');
    it('should set up connection event handlers');
  });

  describe('disconnectMongoDB', () => {
    it('should disconnect gracefully');
    it('should handle disconnect errors');
    it('should clean up resources');
  });
});
```

**Mocking Strategy:**

- Mock mongoose.connect, mongoose.disconnect
- Mock pg.Pool
- Mock Redis client
- Test both success and failure scenarios

### 2. Logger Configuration (MEDIUM PRIORITY)

**File**: `src/config/logger.ts` (63.15% coverage)

**Missing Coverage:**

- Different log levels
- Format variations
- Error handling in transports
- Environment-specific configurations

**Testing Approach:**

```typescript
describe('Logger Configuration', () => {
  describe('Development Mode', () => {
    it('should use colorized format');
    it('should log to console');
    it('should include timestamp');
  });

  describe('Production Mode', () => {
    it('should use JSON format');
    it('should include metadata');
    it('should handle errors gracefully');
  });

  describe('Log Levels', () => {
    it('should respect NODE_ENV log level');
    it('should filter messages by level');
  });
});
```

### 3. Configuration Files (LOW PRIORITY)

**Files**: CORS, Helmet configurations

These have decent coverage already (>60%) but could be improved for completeness.

## Testing Best Practices for Infrastructure Code

### Database Testing

**DO:**

- Mock database connections
- Test connection lifecycle (connect, disconnect, reconnect)
- Test error scenarios (network failures, auth errors)
- Verify connection pool configuration
- Test timeout handling

**DON'T:**

- Use real database connections in unit tests
- Test database vendor functionality (trust the library)
- Create flaky tests dependent on external state

**Example:**

```typescript
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
  },
}));

describe('MongoDB Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect successfully', async () => {
    const mockConnect = mongoose.connect as jest.Mock;
    mockConnect.mockResolvedValue(undefined);

    await connectMongoDB();

    expect(mockConnect).toHaveBeenCalledWith(
      expect.stringContaining('mongodb://'),
      expect.objectContaining({
        serverSelectionTimeoutMS: expect.any(Number),
        socketTimeoutMS: expect.any(Number),
      })
    );
  });

  it('should handle connection errors', async () => {
    const mockConnect = mongoose.connect as jest.Mock;
    mockConnect.mockRejectedValue(new Error('Connection failed'));

    await expect(connectMongoDB()).rejects.toThrow('Connection failed');
  });
});
```

### Logger Testing

**DO:**

- Test different log levels
- Verify log format
- Test error handling
- Mock Winston transports

**DON'T:**

- Test Winston internals
- Write to actual files in tests
- Depend on console output

**Example:**

```typescript
import winston from 'winston';
import logger from './logger';

describe('Logger', () => {
  let mockTransport: jest.Mocked<winston.transport>;

  beforeEach(() => {
    // Mock transport to capture logs
    mockTransport = {
      log: jest.fn(),
    } as any;
    logger.add(mockTransport);
  });

  afterEach(() => {
    logger.remove(mockTransport);
  });

  it('should log info messages', () => {
    logger.info('test message');
    expect(mockTransport.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        message: 'test message',
      }),
      expect.any(Function)
    );
  });
});
```

## Implementation Plan

### Phase 1: Database Configuration Tests (Week 1)

- [ ] Create test file structure
- [ ] Set up mocks for MongoDB
- [ ] Set up mocks for PostgreSQL
- [ ] Set up mocks for Redis
- [ ] Test connection success paths
- [ ] Test connection error paths
- [ ] Test disconnect scenarios
- [ ] Test configuration options

**Expected Coverage Gain**: +25%

### Phase 2: Logger Tests (Week 1)

- [ ] Mock Winston transports
- [ ] Test development mode logging
- [ ] Test production mode logging
- [ ] Test log level filtering
- [ ] Test error handling
- [ ] Test metadata inclusion

**Expected Coverage Gain**: +5%

### Phase 3: Edge Cases and Error Paths (Week 2)

- [ ] Review coverage reports
- [ ] Identify remaining uncovered branches
- [ ] Add tests for edge cases
- [ ] Test timeout scenarios
- [ ] Test resource cleanup

**Expected Coverage Gain**: +5%

### Validation

After each phase:

1. Run `npm run test:coverage`
2. Review HTML coverage report
3. Ensure no regression in existing coverage
4. Verify CI pipeline passes
5. Check Codecov dashboard

## Tools and Commands

### Generate Coverage Report

```bash
cd web/backend
npm run test:coverage
```

### View HTML Report

```bash
# After running coverage
open coverage/lcov-report/index.html
# or on Linux
xdg-open coverage/lcov-report/index.html
```

### Run Specific Test File

```bash
npm test -- mongodb.test.ts
```

### Watch Mode for Development

```bash
npm run test:watch -- mongodb.test.ts
```

### Coverage for Specific File

```bash
npm test -- --coverage --collectCoverageFrom="src/config/database/mongodb.ts"
```

## Success Criteria

- [ ] Overall coverage ≥ 80% for all metrics
- [ ] No single file below 70% (except entry points)
- [ ] All database connection scenarios tested
- [ ] All error paths tested
- [ ] CI pipeline passes with coverage checks
- [ ] Codecov shows green status
- [ ] No flaky tests introduced

## Common Pitfalls to Avoid

1. **Testing Implementation Details**
   - Focus on behavior, not internal mechanics
   - Test the public API, not private methods

2. **Brittle Tests**
   - Don't depend on exact string matches
   - Use flexible matchers (toContain, toMatch)

3. **Over-Mocking**
   - Only mock external dependencies
   - Let internal functions run normally

4. **Poor Test Organization**
   - Group related tests with describe blocks
   - Use clear, descriptive test names

5. **Ignoring Edge Cases**
   - Test boundary conditions
   - Test null/undefined inputs
   - Test error scenarios

## Resources

- [Testing Guide](../../../web/backend/TESTING.md)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Coverage Reports in CI](../../../.github/workflows/backend-ci.yml)

## Questions & Support

- Review existing tests in `tests/` directory for patterns
- Check `TESTING.md` for detailed testing guidelines
- Create issues with `testing` label for questions
- Tag @Tester agent for test design reviews

---

**Last Updated**: 2025-11-10  
**Next Review**: When 80% coverage achieved
