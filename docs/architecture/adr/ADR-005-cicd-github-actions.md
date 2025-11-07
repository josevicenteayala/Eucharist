# ADR-005: CI/CD with GitHub Actions

**Status**: Accepted  
**Date**: 2025-10-19  
**Deciders**: Software Architect, Technical Lead, Project Manager

## Context

The Eucharist Understanding Platform requires a continuous integration and deployment (CI/CD) pipeline to:

- Automate testing and quality checks
- Ensure code quality standards
- Deploy to staging and production environments
- Reduce manual deployment errors
- Enable rapid iteration and feedback
- Maintain high availability during deployments

We need to choose a CI/CD platform that integrates well with our GitHub repository, supports our technology stack (Node.js, React, Flutter), and fits within our budget constraints as an open-source project.

## Decision

We will use **GitHub Actions** as our primary CI/CD platform.

### Pipeline Structure

#### Web Application Pipeline

```yaml
name: Web App CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'web/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'web/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm audit
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    needs: [lint, test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
        with:
          name: build
      - name: Deploy to Staging
        run: |
          # Deploy commands (Vercel, Netlify, or custom)
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://eucharist.app
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
        with:
          name: build
      - name: Deploy to Production
        run: |
          # Deploy commands
          echo "Deploying to production..."
```

#### Mobile Application Pipeline

```yaml
name: Mobile App CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'mobile/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'mobile/**'

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
      - run: flutter pub get
      - run: flutter analyze

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter test --coverage
      - uses: codecov/codecov-action@v3

  build-android:
    needs: [analyze, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: build/app/outputs/flutter-apk/

  build-ios:
    needs: [analyze, test]
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter build ios --release --no-codesign
```

### Deployment Strategy

#### Environments

1. **Development**: Feature branch deployments (preview)
2. **Staging**: Develop branch, automatic deployment
3. **Production**: Main branch, manual approval required

#### Deployment Flow

```
Feature Branch → PR → Code Review → Merge to Develop
                                         ↓
                              Deploy to Staging
                                         ↓
                              Integration Tests
                                         ↓
                           Create Release PR
                                         ↓
                         PR Review & Approval
                                         ↓
                              Merge to Main
                                         ↓
                         Manual Deploy Approval
                                         ↓
                           Deploy to Production
                                         ↓
                            Health Checks
                                         ↓
                    Rollback if Issues (automatic)
```

### Key Features

1. **Automated Testing**: Run all tests on every PR
2. **Code Quality**: Lint, format, and security checks
3. **Branch Protection**: Require passing checks before merge
4. **Deployment Approvals**: Manual approval for production
5. **Rollback Capability**: Automatic or manual rollback
6. **Notifications**: Slack/Discord alerts for failures
7. **Artifacts**: Store build artifacts for debugging
8. **Caching**: Cache dependencies for faster builds

## Consequences

### Positive

✅ **Free for Open Source**: GitHub Actions is free for public repositories  
✅ **Native Integration**: Seamless integration with GitHub  
✅ **Easy to Configure**: YAML-based configuration in repository  
✅ **Rich Ecosystem**: Large marketplace of actions  
✅ **Fast Execution**: Good performance with caching  
✅ **Version Control**: Pipeline configuration versioned with code  
✅ **Matrix Builds**: Test across multiple platforms/versions  
✅ **Secrets Management**: Built-in secrets management

### Negative

⚠️ **Learning Curve**: Team needs to learn GitHub Actions syntax  
⚠️ **Vendor Lock-in**: Tied to GitHub (but config is portable)  
⚠️ **Limited Free Minutes**: Private repos have minute limits  
⚠️ **macOS Runners**: More expensive for iOS builds  
⚠️ **Complex Workflows**: Can become complex for advanced scenarios

### Neutral

➖ **Alternative Options**: Could migrate to other CI/CD if needed  
➖ **Self-Hosted Runners**: Option for more control and cost savings  
➖ **Hybrid Approach**: Can combine with other tools if needed

## Alternatives Considered

### 1. Jenkins

**Pros**: Highly customizable, free, self-hosted, plugin ecosystem  
**Cons**: Requires maintenance, complex setup, resource intensive  
**Why Not**: Overhead of maintaining infrastructure, team lacks expertise

### 2. CircleCI

**Pros**: Good performance, easy configuration, Docker support  
**Cons**: Limited free tier, costs can add up, external dependency  
**Why Not**: GitHub Actions offers similar features at lower cost

### 3. GitLab CI/CD

**Pros**: Excellent CI/CD features, integrated platform  
**Cons**: Would require moving from GitHub, learning curve  
**Why Not**: Team is already using GitHub, migration overhead

### 4. Travis CI

**Pros**: Simple configuration, good for open source  
**Cons**: Limited free tier changes, slower builds  
**Why Not**: GitHub Actions has better integration and performance

### 5. Azure Pipelines

**Pros**: Free for open source, cross-platform  
**Cons**: Microsoft-centric, complex for simple projects  
**Why Not**: GitHub Actions is simpler and equally capable

## Implementation Plan

### Phase 1: Basic CI (Week 1)

- [ ] Create basic GitHub Actions workflow
- [ ] Set up linting and testing
- [ ] Configure branch protection rules
- [ ] Add status badges to README

### Phase 2: Enhanced CI (Week 2)

- [ ] Add security scanning (npm audit, Snyk)
- [ ] Set up code coverage reporting
- [ ] Add build artifact generation
- [ ] Configure caching for faster builds

### Phase 3: CD to Staging (Week 3)

- [ ] Set up staging environment
- [ ] Configure automatic deployment to staging
- [ ] Add health checks post-deployment
- [ ] Set up deployment notifications

### Phase 4: Production Deployment (Week 4)

- [ ] Configure production environment
- [ ] Add manual approval step
- [ ] Implement rollback strategy
- [ ] Set up production monitoring

### Phase 5: Mobile CI/CD (Months 4-5)

- [ ] Set up Flutter CI pipeline
- [ ] Configure Android build
- [ ] Configure iOS build (with certificates)
- [ ] Set up app store deployment

## Monitoring & Metrics

### CI/CD Metrics to Track

- **Build Success Rate**: Target >95%
- **Build Time**: Target <10 minutes
- **Deployment Frequency**: Daily to staging, weekly to production
- **Failed Deployments**: <5% of total deployments
- **Rollback Rate**: <2% of deployments
- **Time to Restore**: <1 hour from detection to fix

### Alerts

- Build failures on main/develop branches
- Deployment failures
- Security vulnerabilities detected
- Test coverage drop below 80%
- Production deployment notifications

## Security Considerations

### Secrets Management

- Use GitHub Secrets for API keys and credentials
- Rotate secrets regularly
- Never commit secrets to repository
- Use environment-specific secrets

### Access Control

- Restrict who can approve production deployments
- Use environment protection rules
- Implement required reviewers
- Enable audit logging

### Vulnerability Scanning

- Run npm audit on every build
- Use Snyk for dependency scanning
- Scan Docker images for vulnerabilities
- Keep dependencies up to date

## Cost Analysis

### GitHub Actions Pricing (for reference)

**Public Repository**: Free unlimited minutes  
**Private Repository**:

- Free tier: 2,000 minutes/month
- Pro: $4/month + additional minutes
- Team: $4/user/month + additional minutes

**Our Usage Estimate**:

- Open source project (public repo): $0/month
- Expected minutes: ~500-1000/month
- Cost: $0 (within free tier)

**If scaling to private repo**:

- Estimated minutes: ~3,000/month
- Cost: ~$4-8/month (within free + minimal overage)

## Maintenance

### Regular Tasks

**Weekly**:

- Review failed builds
- Update dependencies
- Check build times

**Monthly**:

- Review and optimize workflows
- Update GitHub Actions to latest versions
- Review security scan results
- Analyze CI/CD metrics

**Quarterly**:

- Comprehensive pipeline review
- Cost analysis (if private)
- Tool evaluation
- Team feedback incorporation

## Success Criteria

- [ ] All PRs run through CI pipeline
- [ ] Test coverage maintained >80%
- [ ] Zero critical security vulnerabilities
- [ ] Automatic deployment to staging working
- [ ] Production deployments smooth (<10 min)
- [ ] Team comfortable with pipeline
- [ ] Build times <10 minutes
- [ ] Build success rate >95%

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Flutter CI/CD with GitHub Actions](https://flutter.dev/docs/deployment/cd)
- [Best Practices for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

## Revision History

- **2025-10-19**: Initial version - Accepted

---

**Next Review**: 2026-01-19 (3 months)  
**Owner**: Software Architect  
**Status**: Active
