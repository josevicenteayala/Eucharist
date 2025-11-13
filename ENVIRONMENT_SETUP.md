# Environment Configuration Guide

This guide explains how to configure environment variables for the Eucharist Platform.

## Overview

The Eucharist Platform uses environment variables to configure different aspects of the application, including:

- Server configuration (port, environment)
- Database connections (PostgreSQL, MongoDB, Redis)
- Authentication (JWT secrets)
- CORS settings
- Logging levels

Environment variables are stored in `.env` files which are **never committed to version control** for security reasons.

## Quick Start

### Backend Configuration

1. Navigate to the backend directory:

   ```bash
   cd web/backend
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and update the values as needed:

   ```bash
   # Basic configuration - usually can keep defaults for development
   NODE_ENV=development
   PORT=3000
   API_VERSION=v1

   # Database configuration - update if you have different settings
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=eucharist_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password_here

   MONGODB_URI=mongodb://localhost:27017/eucharist

   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   # JWT Secret - MUST change in production!
   JWT_SECRET=your-secret-key-change-in-production
   JWT_ACCESS_TOKEN_EXPIRY=15m
   JWT_REFRESH_TOKEN_EXPIRY=7d

   # CORS - update to match your frontend URL
   CORS_ORIGIN=http://localhost:3001

   # Logging
   LOG_LEVEL=info
   ```

### Frontend Configuration

1. Navigate to the frontend directory:

   ```bash
   cd web/frontend
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and update the values:

   ```bash
   # API Configuration - should match backend URL
   NEXT_PUBLIC_API_URL=http://localhost:3000/api

   # Application Configuration
   NEXT_PUBLIC_APP_NAME=Eucharist Platform
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

## Environment Variables Reference

### Backend Variables

#### Server Configuration

| Variable      | Description        | Default       | Required |
| ------------- | ------------------ | ------------- | -------- |
| `NODE_ENV`    | Environment mode   | `development` | No       |
| `PORT`        | Server port        | `3000`        | No       |
| `API_VERSION` | API version prefix | `v1`          | No       |

#### Database - PostgreSQL

| Variable            | Description       | Default        | Required |
| ------------------- | ----------------- | -------------- | -------- |
| `POSTGRES_HOST`     | PostgreSQL host   | `localhost`    | No       |
| `POSTGRES_PORT`     | PostgreSQL port   | `5432`         | No       |
| `POSTGRES_DB`       | Database name     | `eucharist_db` | No       |
| `POSTGRES_USER`     | Database user     | `postgres`     | No       |
| `POSTGRES_PASSWORD` | Database password | ``             | Yes\*    |

\*Required for connecting to PostgreSQL

#### Database - MongoDB

| Variable      | Description            | Default                               | Required |
| ------------- | ---------------------- | ------------------------------------- | -------- |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/eucharist` | No       |

#### Database - Redis

| Variable         | Description    | Default     | Required |
| ---------------- | -------------- | ----------- | -------- |
| `REDIS_HOST`     | Redis host     | `localhost` | No       |
| `REDIS_PORT`     | Redis port     | `6379`      | No       |
| `REDIS_PASSWORD` | Redis password | ``          | No       |

#### JWT Authentication

| Variable                   | Description                | Default                                | Required |
| -------------------------- | -------------------------- | -------------------------------------- | -------- |
| `JWT_SECRET`               | Secret key for JWT signing | `your-secret-key-change-in-production` | Yes      |
| `JWT_ACCESS_TOKEN_EXPIRY`  | Access token expiration    | `15m`                                  | No       |
| `JWT_REFRESH_TOKEN_EXPIRY` | Refresh token expiration   | `7d`                                   | No       |

⚠️ **Security Warning**: Always change `JWT_SECRET` in production! Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### CORS Configuration

| Variable      | Description          | Default                 | Required |
| ------------- | -------------------- | ----------------------- | -------- |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3001` | No       |

Multiple origins can be comma-separated: `http://localhost:3001,http://localhost:3002`

#### Logging

| Variable    | Description                              | Default | Required |
| ----------- | ---------------------------------------- | ------- | -------- |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info`  | No       |

### Frontend Variables

All Next.js public environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser.

| Variable               | Description      | Default                     | Required |
| ---------------------- | ---------------- | --------------------------- | -------- |
| `NEXT_PUBLIC_API_URL`  | Backend API URL  | `http://localhost:3000/api` | Yes      |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Eucharist Platform`        | No       |
| `NEXT_PUBLIC_APP_URL`  | Frontend URL     | `http://localhost:3001`     | No       |

## Environment-Specific Configuration

### Development

Development is the default environment. Use these settings for local development:

- `NODE_ENV=development`
- Database connections to localhost
- Debug logging enabled
- CORS allows localhost origins

### Testing

For running tests, the application uses default values and mocked database connections.

### Production

For production deployment:

1. **MUST change**:
   - `JWT_SECRET` - Use a strong, randomly generated secret
   - Database passwords
   - `CORS_ORIGIN` - Use actual production domain(s)

2. **Should change**:
   - `LOG_LEVEL=warn` or `LOG_LEVEL=error` for production
   - Database hosts to production database servers
   - `NODE_ENV=production`

3. **Security checklist**:
   - [ ] Strong JWT secret generated
   - [ ] Database credentials secured
   - [ ] CORS origins restricted to actual domains
   - [ ] Logging level appropriate (not debug)
   - [ ] Never commit `.env` files

## File Locations

```
web/
├── backend/
│   ├── .env              # Backend environment variables (not in git)
│   └── .env.example      # Backend template (in git)
└── frontend/
    ├── .env.local        # Frontend environment variables (not in git)
    └── .env.example      # Frontend template (in git)
```

## Troubleshooting

### Environment variables not loading

1. Check file name is exactly `.env` (backend) or `.env.local` (frontend)
2. Verify file is in the correct directory (web/backend or web/frontend)
3. Restart the development server after changing environment variables
4. Check for syntax errors in the .env file (no quotes needed for values)

### Database connection errors

1. Verify database is running
2. Check connection credentials in `.env`
3. Ensure database exists (create if needed)
4. Check firewall/network settings if using remote database

### CORS errors in browser

1. Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
2. Include protocol (http:// or https://)
3. No trailing slashes in origin URLs
4. Restart backend server after changing CORS settings

### JWT authentication issues

1. Ensure `JWT_SECRET` is set in backend `.env`
2. Verify token expiry times are in valid format
3. Check that backend and frontend are using same API URL

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore` for a reason
2. **Use strong secrets** - Generate random secrets for production
3. **Restrict CORS origins** - Only allow necessary domains
4. **Secure database credentials** - Use strong passwords, never share
5. **Different secrets per environment** - Don't reuse production secrets in development
6. **Rotate secrets regularly** - Especially after team changes
7. **Use environment-specific files** - Keep development and production configs separate

## CI/CD Configuration

For CI/CD pipelines (GitHub Actions, etc.), set environment variables as secrets in your CI platform, not in `.env` files.

### GitHub Actions Example

```yaml
env:
  NODE_ENV: production
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
```

## Additional Resources

- [Backend README](web/backend/README.md)
- [Frontend README](web/frontend/README.md)
- [Database Setup Guide](web/backend/DATABASE_SETUP.md)
- [Contributing Guide](docs/CONTRIBUTING.md)

## Support

If you encounter issues with environment configuration:

1. Check this guide thoroughly
2. Review the `.env.example` files for all available options
3. Check the logs for specific error messages
4. Create an issue on GitHub with details about the problem

---

**Last Updated**: November 12, 2025  
**Version**: 1.0.0
