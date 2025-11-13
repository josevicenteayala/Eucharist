# Docker Development Environment

This guide explains how to use Docker Compose to run the complete Eucharist Platform development environment.

## Overview

The `docker-compose.yml` file in the root directory provides a complete local development environment with:

- **Backend API** (Node.js + Express + TypeScript)
- **Frontend Web App** (Next.js + React + TypeScript)
- **PostgreSQL** (Relational database)
- **MongoDB** (Content database)
- **Redis** (Cache and sessions)

All services are connected via a Docker network and include health checks for reliability.

## Prerequisites

- **Docker Desktop** (recommended) or Docker Engine + Docker Compose
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Git** (to clone the repository)
- At least **4GB of available RAM** for all services

### Verify Installation

```bash
docker --version
docker compose version
```

## Quick Start

### 1. Start All Services

From the repository root:

```bash
docker compose up
```

Or to run in detached mode (background):

```bash
docker compose up -d
```

### 2. Watch the Logs

If running in detached mode, you can view logs:

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### 3. Access the Applications

Once all services are healthy:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/v1/health

### 4. Stop Services

```bash
# Stop services (keeps data)
docker compose stop

# Stop and remove containers (keeps data)
docker compose down

# Stop and remove everything including data volumes
docker compose down -v
```

## Service Details

### Backend (Port 3000)

- **Container**: `eucharist-backend`
- **Image**: `node:18-alpine`
- **Hot Reload**: Changes to `web/backend` automatically reload
- **Environment**: All database connections configured automatically
- **Health Check**: Pings `/api/v1/health` endpoint

The backend service will:

1. Install npm dependencies on first start (cached in named volume)
2. Connect to all three databases
3. Start the development server with `nodemon`
4. Auto-reload when code changes are detected

### Frontend (Port 3001)

- **Container**: `eucharist-frontend`
- **Image**: `node:18-alpine`
- **Hot Reload**: Changes to `web/frontend` automatically reload
- **Environment**: Configured to connect to backend at `http://localhost:3000`
- **Health Check**: Pings root endpoint

The frontend service will:

1. Install npm dependencies on first start (cached in named volume)
2. Start the Next.js development server
3. Auto-reload when code changes are detected

### PostgreSQL (Port 5432)

- **Container**: `eucharist-postgres`
- **Image**: `postgres:16-alpine`
- **Database**: `eucharist_db`
- **User**: `postgres`
- **Password**: `postgres`
- **Data Volume**: `postgres_data` (persists across restarts)

### MongoDB (Port 27017)

- **Container**: `eucharist-mongodb`
- **Image**: `mongo:7-jammy`
- **Database**: `eucharist`
- **No Authentication**: For development only
- **Data Volume**: `mongodb_data` (persists across restarts)

### Redis (Port 6379)

- **Container**: `eucharist-redis`
- **Image**: `redis:7-alpine`
- **Persistence**: AOF (Append-Only File) enabled
- **Data Volume**: `redis_data` (persists across restarts)

## Development Workflow

### Making Code Changes

All code changes are automatically detected and hot-reloaded:

**Backend Changes**:

1. Edit files in `web/backend/src/`
2. Nodemon detects changes and restarts the server
3. Refresh your API client or browser

**Frontend Changes**:

1. Edit files in `web/frontend/src/`
2. Next.js Fast Refresh updates the browser automatically
3. Changes appear in seconds

### Installing New Dependencies

**Backend**:

```bash
# Option 1: Restart the container (will run npm install)
docker compose restart backend

# Option 2: Run npm install inside the container
docker compose exec backend npm install <package-name>
```

**Frontend**:

```bash
# Option 1: Restart the container
docker compose restart frontend

# Option 2: Run npm install inside the container
docker compose exec frontend npm install <package-name>
```

### Running Commands

Execute commands inside running containers:

```bash
# Backend commands
docker compose exec backend npm run lint
docker compose exec backend npm test
docker compose exec backend npm run build

# Frontend commands
docker compose exec frontend npm run lint
docker compose exec frontend npm test
docker compose exec frontend npm run build

# Database access
docker compose exec postgres psql -U postgres -d eucharist_db
docker compose exec mongodb mongosh eucharist
docker compose exec redis redis-cli
```

### Viewing Service Status

```bash
# List running services
docker compose ps

# Check service health
docker compose ps --format json | jq '.[] | {name: .Name, status: .Status, health: .Health}'
```

## Data Management

### Persistent Data

Data is stored in named Docker volumes and persists across container restarts:

- `postgres_data` - PostgreSQL database files
- `mongodb_data` - MongoDB database files
- `redis_data` - Redis data files
- `backend_node_modules` - Backend npm packages (faster restarts)
- `frontend_node_modules` - Frontend npm packages (faster restarts)

### Backing Up Data

**PostgreSQL**:

```bash
docker compose exec postgres pg_dump -U postgres eucharist_db > backup.sql
```

**MongoDB**:

```bash
docker compose exec mongodb mongodump --db eucharist --out /data/backup
docker compose cp mongodb:/data/backup ./mongodb-backup
```

**Redis**:

```bash
docker compose exec redis redis-cli SAVE
docker compose cp redis:/data/dump.rdb ./redis-backup.rdb
```

### Resetting Data

**All Databases** (WARNING: Deletes all data):

```bash
docker compose down -v
docker compose up -d
```

**Specific Database**:

```bash
# PostgreSQL
docker compose exec postgres psql -U postgres -c "DROP DATABASE eucharist_db;"
docker compose exec postgres psql -U postgres -c "CREATE DATABASE eucharist_db;"

# MongoDB
docker compose exec mongodb mongosh eucharist --eval "db.dropDatabase()"

# Redis
docker compose exec redis redis-cli FLUSHALL
```

## Troubleshooting

### Containers Won't Start

**Check Docker is running**:

```bash
docker ps
```

**View logs for errors**:

```bash
docker compose logs backend
docker compose logs frontend
```

**Clean restart**:

```bash
docker compose down
docker compose up -d
```

### Port Already in Use

If you see "port is already allocated" errors:

**Check what's using the port**:

```bash
# Linux/macOS
lsof -i :3000
lsof -i :3001
lsof -i :5432
lsof -i :27017
lsof -i :6379

# Windows
netstat -ano | findstr :3000
```

**Solution**:

1. Stop the conflicting service, OR
2. Edit `docker-compose.yml` to use different ports:
   ```yaml
   ports:
     - '3010:3000' # Maps host port 3010 to container port 3000
   ```

### Database Connection Issues

**Backend can't connect to databases**:

1. Check all databases are healthy:

   ```bash
   docker compose ps
   ```

   All services should show `healthy` status.

2. Check database logs:

   ```bash
   docker compose logs postgres
   docker compose logs mongodb
   docker compose logs redis
   ```

3. Verify network connectivity:
   ```bash
   docker compose exec backend ping -c 3 postgres
   docker compose exec backend ping -c 3 mongodb
   docker compose exec backend ping -c 3 redis
   ```

### Backend/Frontend Not Auto-Reloading

**If code changes don't trigger reload**:

1. Check the logs for errors:

   ```bash
   docker compose logs -f backend
   docker compose logs -f frontend
   ```

2. Manually restart the service:

   ```bash
   docker compose restart backend
   docker compose restart frontend
   ```

3. On macOS/Windows, Docker Desktop file sync can be slow. Consider:
   - Using Docker Desktop's "VirtioFS" file sharing (faster)
   - Running services natively (see below) for better performance

### node_modules Issues

If you see module-related errors:

```bash
# Clear and rebuild node_modules
docker compose down
docker volume rm eucharist-platform_backend_node_modules
docker volume rm eucharist-platform_frontend_node_modules
docker compose up -d
```

### Container Keeps Restarting

Check logs for the failing service:

```bash
docker compose logs backend
docker compose logs frontend
```

Common causes:

- Syntax errors in code
- Missing dependencies (run `npm install` inside container)
- Database not ready (check health status)

## Running Services Outside Docker

You may want to run backend/frontend natively for better performance:

### 1. Start Only Databases

Create `docker-compose.databases.yml`:

```yaml
services:
  postgres:
    # ... copy from main docker-compose.yml
  mongodb:
    # ... copy from main docker-compose.yml
  redis:
    # ... copy from main docker-compose.yml
```

Or use the provided backend docker-compose:

```bash
cd web/backend
docker compose up -d
```

### 2. Run Backend Natively

```bash
cd web/backend
npm install
cp .env.example .env
# Edit .env to use localhost for databases
npm run dev
```

### 3. Run Frontend Natively

```bash
cd web/frontend
npm install
cp .env.example .env.local
# Edit .env.local
npm run dev
```

## Production Considerations

⚠️ **This docker-compose.yml is for DEVELOPMENT ONLY**

For production:

- Use proper secrets management (not hardcoded passwords)
- Build optimized production images
- Use separate docker-compose for production
- Enable database authentication
- Configure proper networking and security
- Use managed databases or proper backup strategies
- Enable HTTPS/SSL
- Set appropriate resource limits

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Backend README](web/backend/README.md)
- [Frontend README](web/frontend/README.md)
- [Database Setup Guide](web/backend/DATABASE_SETUP.md)
- [Environment Setup Guide](ENVIRONMENT_SETUP.md)

## Common Commands Reference

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose stop

# Remove containers (keeps data)
docker compose down

# Remove containers and volumes (deletes data)
docker compose down -v

# Restart a service
docker compose restart backend

# Rebuild a service (after Dockerfile changes)
docker compose build backend
docker compose up -d backend

# Execute command in service
docker compose exec backend npm test

# View running services
docker compose ps

# View resource usage
docker stats
```

---

**Last Updated**: November 13, 2025  
**Version**: 1.0.0
