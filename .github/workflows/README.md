# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing, building, and deployment.

## Workflows

### ci.yml - Continuous Integration
- Lint code (ESLint, Prettier)
- Run TypeScript compilation
- Run unit tests
- Run integration tests
- Security audits
- Code coverage reports

### cd.yml - Continuous Deployment
- Build applications
- Deploy to staging/production
- Database migrations
- Smoke tests

### tests.yml - Test Automation
- Automated test runs
- E2E tests with Playwright/Cypress
- Mobile tests
- Performance tests

## Workflow Triggers

- **Push to main**: Full CI/CD pipeline
- **Pull requests**: CI checks only
- **Manual dispatch**: Manual deployments
- **Scheduled**: Nightly tests, dependency updates

## Standards

- All PRs must pass CI before merge
- Minimum 80% code coverage required
- Security scans must pass
- No high/critical vulnerabilities
- Build must succeed

## Environment Variables

Store sensitive values in GitHub Secrets:
- Database credentials
- API keys
- Deployment tokens
- Third-party service credentials
