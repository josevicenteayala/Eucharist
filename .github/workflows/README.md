# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing, building, and deployment of the Eucharist Platform.

## Implemented Workflows

### ci.yml - Continuous Integration (Root Level)

**Purpose**: Run checks across the entire monorepo  
**Triggers**: Push to main/develop, Pull requests to main/develop

**Jobs**:

- **format-check**: Validate code formatting with Prettier
- **lint**: Run ESLint on all workspaces
- **test**: Run tests on all workspaces
- **validate-docs**: Check for broken markdown links and required documentation files

### backend-ci.yml - Backend CI Pipeline

**Purpose**: Comprehensive testing and building for Node.js backend  
**Triggers**: Push/PR to main/develop with changes to `web/backend/**`

**Jobs**:

- **lint**: ESLint and Prettier format check
- **test**: Jest tests with coverage reporting, upload to Codecov
- **typecheck**: TypeScript compilation check
- **security**: npm audit for dependency vulnerabilities
- **build**: TypeScript compilation, upload build artifacts

### frontend-ci.yml - Frontend CI Pipeline

**Purpose**: Testing and building for Next.js frontend  
**Triggers**: Push/PR to main/develop with changes to `web/frontend/**`

**Jobs**:

- **lint**: ESLint and Prettier format check
- **typecheck**: TypeScript type checking
- **test**: Jest tests (passes with no tests for now)
- **build**: Next.js production build, upload artifacts

## Planned Workflows (Future Implementation)

### cd.yml - Continuous Deployment

- Deploy to staging on merge to `develop`
- Deploy to production on merge to `main` (with manual approval)
- Database migrations
- Post-deployment smoke tests
- Automated rollback on failure

### mobile-ci.yml - Mobile App CI/CD

- Flutter analyze and test
- Build Android APK
- Build iOS IPA (requires Apple certificates)
- App store deployment automation

### security-scan.yml - Security Scanning

- Scheduled security audits
- Dependency vulnerability scanning with Snyk
- CodeQL analysis
- OWASP dependency check

## Workflow Standards

### Branch Protection

All workflows must pass before merging to protected branches (`main`, `develop`).

### Code Coverage

- Minimum 80% code coverage required
- Coverage reports uploaded to Codecov
- Coverage reports stored as artifacts

### Build Artifacts

- Backend build: Stored for 7 days
- Frontend build: Stored for 7 days
- Test coverage: Stored for 30 days

### Environment Variables

Set in GitHub Secrets:

- `CODECOV_TOKEN`: For coverage reporting
- `SNYK_TOKEN`: For security scanning (future)
- Deployment credentials (when CD is implemented)

## Workflow Triggers

### Push Events

- **main**: Full CI/CD pipeline (when CD implemented)
- **develop**: Full CI, auto-deploy to staging (when CD implemented)

### Pull Request Events

- All PRs to main/develop: CI checks only (no deployment)

### Manual Dispatch

- Not yet implemented
- Future: Manual deployments, on-demand security scans

### Scheduled Events

- Not yet implemented
- Future: Nightly tests, weekly dependency updates

## Running Workflows Locally

### Backend

```bash
cd web/backend
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

### Frontend

```bash
cd web/frontend
npm ci
npm run lint
npx tsc --noEmit
npm test -- --passWithNoTests
npm run build
```

### Root Level

```bash
npm ci
npm run format:check
npm run lint
npm run test
```

## Troubleshooting

### Workflow Fails on Dependencies

- Check if `package-lock.json` is committed
- Verify Node.js version matches (20.x)
- Clear npm cache in workflow if needed

### Linting Failures

- Run `npm run lint:fix` locally
- Run `npm run format` locally
- Commit formatting changes

### Test Failures

- Run tests locally to reproduce
- Check test logs in GitHub Actions artifacts
- Verify environment variables if needed

### Build Failures

- Check TypeScript compilation: `npm run typecheck`
- Verify all dependencies are installed
- Check for missing environment variables

## Performance Optimization

### Caching Strategy

- npm dependencies cached by `cache-dependency-path`
- Cache invalidated when package-lock.json changes
- Build artifacts cached between jobs (when needed)

### Job Optimization

- Jobs run in parallel when possible
- Path filters prevent unnecessary runs
- Workspace-specific changes trigger only relevant workflows

## Monitoring

### Key Metrics to Track

- Build success rate (target: >95%)
- Build duration (target: <10 minutes per workflow)
- Test coverage (target: >80%)
- Security vulnerabilities (target: 0 critical/high)

### Notifications

- Currently: GitHub UI and email notifications
- Future: Slack/Discord integration for failures

## Security Considerations

### Secrets Management

- Never commit secrets to repository
- Use GitHub Secrets for sensitive values
- Rotate secrets regularly
- Use environment-specific secrets for staging/production

### Access Control

- Workflows run with read-only repository access by default
- Write access required only for artifact uploads
- Production deployments require manual approval (when implemented)

### Vulnerability Scanning

- npm audit runs on every build (backend)
- Fails on moderate or higher vulnerabilities
- Future: Snyk integration for advanced scanning

## Contributing

When adding new workflows:

1. Follow existing naming conventions
2. Add comprehensive documentation in this README
3. Use path filters to optimize execution
4. Include proper error handling
5. Test locally with act (GitHub Actions local runner) if possible
6. Update architecture decision records (ADRs) if needed

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ADR-005: CI/CD with GitHub Actions](../../docs/architecture/adr/ADR-005-cicd-github-actions.md)
- [Project Technical Roadmap](../../TECHNICAL_ROADMAP.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)

---

**Last Updated**: 2025-11-13  
**Status**: Active Development  
**Next Steps**: Implement CD workflows for staging/production deployment
