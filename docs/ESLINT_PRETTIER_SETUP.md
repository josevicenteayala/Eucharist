# ESLint and Prettier Setup Guide

This document describes the ESLint and Prettier configuration for the Eucharist Platform project.

## Overview

The project uses ESLint for code quality checking and Prettier for code formatting across all workspaces (root, backend, and frontend).

## Configuration Files

### Root Level

- `eslint.config.js` - ESLint flat config for root-level files
- `.prettierrc` - Prettier configuration (shared settings)
- `.eslintignore` - Files to ignore for ESLint
- `.prettierignore` - Files to ignore for Prettier
- `.lintstagedrc.json` - Lint-staged configuration for pre-commit hooks

### Backend (`web/backend/`)

- `eslint.config.js` - Backend-specific ESLint configuration
- `.prettierrc` - Backend Prettier configuration

### Frontend (`web/frontend/`)

- `eslint.config.js` - Frontend-specific ESLint configuration (React/Next.js)
- `.prettierrc` - Frontend Prettier configuration

## Available Scripts

### Root Level

```bash
# Check code quality across all workspaces
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are properly formatted
npm run format:check
```

### Backend

```bash
cd web/backend

# Lint backend TypeScript files
npm run lint

# Auto-fix backend linting issues
npm run lint:fix

# Format backend files
npm run format

# Check backend file formatting
npm run format:check
```

### Frontend

```bash
cd web/frontend

# Lint frontend TypeScript/React files
npm run lint

# Auto-fix frontend linting issues
npm run lint:fix

# Format frontend files
npm run format

# Check frontend file formatting
npm run format:check
```

## Pre-commit Hooks

The project uses Husky and lint-staged to automatically lint and format files before commits.

### Setup

Pre-commit hooks are automatically installed when you run `npm install` via the `prepare` script.

### What Gets Checked

- **TypeScript/JavaScript files** (`.ts`, `.tsx`, `.js`, `.jsx`): ESLint + Prettier
- **JSON files** (`.json`): Prettier
- **Markdown files** (`.md`): Prettier
- **YAML files** (`.yml`, `.yaml`): Prettier

## ESLint Configuration

### Key Rules

- **TypeScript**: Strict type checking with `@typescript-eslint`
- **Explicit any**: Warning (should be avoided)
- **Unused variables**: Error (must start with `_` if intentionally unused)
- **Console statements**: Warning (only `console.warn` and `console.error` allowed in production code)
- **Prettier integration**: Prettier rules enforced as ESLint errors

### Ignored Patterns

- `node_modules/**`
- `dist/**`
- `build/**`
- `coverage/**`
- `.next/**`
- `out/**`
- Config files (`*.config.js`, `*.config.mjs`, `*.config.ts`)

## Prettier Configuration

### Code Style

- **Semicolons**: Required
- **Quotes**: Single quotes (for JS/TS), double quotes (for JSX attributes)
- **Trailing commas**: ES5 style
- **Print width**: 100 characters
- **Tab width**: 2 spaces
- **End of line**: LF (Unix-style)
- **Arrow function parens**: Always

## IDE Integration

### VS Code

Install these extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### IntelliJ/WebStorm

1. Go to **Settings** > **Languages & Frameworks** > **JavaScript** > **Code Quality Tools** > **ESLint**
2. Enable "Automatic ESLint configuration"
3. Go to **Settings** > **Languages & Frameworks** > **JavaScript** > **Prettier**
4. Set "Run on save for files"

## Troubleshooting

### ESLint not working

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prettier conflicts with ESLint

The project uses `eslint-config-prettier` to disable ESLint formatting rules that conflict with Prettier. If you see conflicts, ensure you're using the latest configuration.

### Pre-commit hook fails

```bash
# Manually fix issues
npm run lint:fix
npm run format

# Then try committing again
git add .
git commit -m "Your message"
```

### Different ESLint versions in workspaces

The project uses npm workspaces. Ensure you're running commands from the correct directory:

- Root commands affect all workspaces
- Workspace commands only affect that specific workspace

## CI/CD Integration

The GitHub Actions CI pipeline runs:

1. `npm run lint` - Check code quality
2. `npm run format:check` - Verify code formatting
3. `npm test` - Run tests
4. `npm run build` - Build the project

All checks must pass before merging to the main branch.

## Migration from Old Config

If migrating from older ESLint configurations:

### From `.eslintrc.json` to `eslint.config.js`

The project now uses ESLint flat config format (ESLint 9+). Key differences:

- Configuration is JavaScript instead of JSON
- Plugins are imported directly
- Rules are defined per file pattern
- More explicit and type-safe

### Breaking Changes

- ESLint 9+ uses flat config by default
- Some plugins may need updates
- Old `.eslintrc.*` files are no longer used

## Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Flat Config Guide](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Husky Documentation](https://typicode.github.io/husky/)

## Support

For issues or questions about the linting setup, please:

1. Check this documentation
2. Review the configuration files
3. Create an issue in the repository
4. Contact the development team

---

**Last Updated**: November 2025
**Maintained By**: Eucharist Platform Development Team
