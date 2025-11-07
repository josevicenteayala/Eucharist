/**
 * Environment Variable Test Helpers
 *
 * Utilities for managing environment variables in tests
 * to ensure test isolation and cleanup.
 */

/**
 * Store original environment variables
 */
export class EnvManager {
  private originalEnv: NodeJS.ProcessEnv;

  constructor() {
    this.originalEnv = { ...process.env };
  }

  /**
   * Set environment variable for testing
   */
  set(key: string, value: string | undefined): void {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  /**
   * Set multiple environment variables
   */
  setMultiple(vars: Record<string, string | undefined>): void {
    Object.entries(vars).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * Restore original environment variables
   */
  restore(): void {
    process.env = { ...this.originalEnv };
  }

  /**
   * Get original value of an environment variable
   */
  getOriginal(key: string): string | undefined {
    return this.originalEnv[key];
  }
}

/**
 * Create a scoped environment manager for a test
 * Usage:
 * ```typescript
 * describe('My test', () => {
 *   const env = createEnvScope();
 *
 *   beforeEach(() => {
 *     env.set('NODE_ENV', 'test');
 *   });
 *
 *   afterEach(() => {
 *     env.restore();
 *   });
 * });
 * ```
 */
export function createEnvScope(): EnvManager {
  return new EnvManager();
}

/**
 * Temporarily set environment variables for a specific test
 * Usage:
 * ```typescript
 * it('should work in production', withEnv({ NODE_ENV: 'production' }, () => {
 *   // Test code here
 * }));
 * ```
 */
export function withEnv(
  vars: Record<string, string | undefined>,
  testFn: () => void | Promise<void>
): () => void | Promise<void> {
  return async () => {
    const env = new EnvManager();
    env.setMultiple(vars);
    try {
      await testFn();
    } finally {
      env.restore();
    }
  };
}

/**
 * Mock environment variables for a suite of tests
 */
export function setupEnvForTests(vars: Record<string, string | undefined>) {
  const env = new EnvManager();

  beforeAll(() => {
    env.setMultiple(vars);
  });

  afterAll(() => {
    env.restore();
  });

  return env;
}
