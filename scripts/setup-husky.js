#!/usr/bin/env node

/**
 * Skip Husky installation when running inside CI or when Husky is explicitly disabled.
 * Otherwise, require Husky (if present) and run the install hook. This prevents npm
 * from failing in workspaces where the dependency is not yet available.
 */

const isCI = process.env.CI === 'true';
const huskyDisabled = process.env.HUSKY === '0';

if (isCI || huskyDisabled) {
  process.exit(0);
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('husky').install();
} catch (error) {
  console.warn('Skipping Husky install: husky dependency not available.');
  console.warn(error?.message || error);
}
