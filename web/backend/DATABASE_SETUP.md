# Database Setup Guide

This guide provides step-by-step instructions for setting up the three databases required by the Eucharist Platform backend.

## Overview

The backend uses three different databases, each serving a specific purpose:

- **PostgreSQL** - Relational data (users, authentication, relationships)
- **MongoDB** - Flexible content (articles, reflections, media)
- **Redis** - Caching and sessions

## Prerequisites

- macOS, Linux, or Windows with WSL2
- Docker (recommended) or native installations
- Basic command line knowledge

## Quick Start with Docker (Recommended)

The easiest way to set up all databases is using Docker Compose.

### Option 1: Complete Development Environment (Recommended)

Use the root-level `docker-compose.yml` which includes databases AND the backend/frontend services:

```bash
# From repository root
docker compose up -d
```

This starts all services including PostgreSQL, MongoDB, Redis, backend API, and frontend web app.
See [DOCKER.md](../../DOCKER.md) for complete documentation.

### Option 2: Databases Only

If you prefer to run backend/frontend natively, use the docker-compose.yml in the backend directory:

```bash
# From repository root
cd web/backend
docker compose up -d
```

This starts only the three databases (PostgreSQL, MongoDB, Redis).

### Configuration Details

**PostgreSQL**: Port 5432, database `eucharist_db`, user `postgres`, password `postgres`  
**MongoDB**: Port 27017, database `eucharist`  
**Redis**: Port 6379

See the actual `docker-compose.yml` files for complete configuration including health checks and volumes.

### Starting the Databases

```bash
# Option 1: Full stack (from repository root)
docker compose up -d

# Option 2: Databases only (from web/backend)
cd web/backend
docker compose up -d
```

### Verify Databases are Running

```bash
docker compose ps
```

You should see all three database services running and healthy.

### Configure Environment Variables

Update your `.env` file in `web/backend/`:

```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=eucharist_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# MongoDB
MONGODB_URI=mongodb://localhost:27017/eucharist

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Test the Connection

Start your backend server:

```bash
npm run dev
```

Check the health endpoint:

```bash
curl http://localhost:3000/api/v1/health
```

You should see all databases reporting as "healthy".

## Native Installation

If you prefer to install databases natively:

### PostgreSQL

**macOS (Homebrew)**:

```bash
brew install postgresql@16
brew services start postgresql@16
createdb eucharist_db
```

**Ubuntu/Debian**:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb eucharist_db
```

**Windows**:
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### MongoDB

**macOS (Homebrew)**:

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian**:

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

**Windows**:
Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)

### Redis

**macOS (Homebrew)**:

```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian**:

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows**:
Download and install from redis or use WSL2

## Database Management Tools

### PostgreSQL

- **pgAdmin** - Web-based GUI: https://www.pgadmin.org/
- **DBeaver** - Universal database tool: https://dbeaver.io/
- **psql** - Command-line tool (included with PostgreSQL)

```bash
psql -U postgres -d eucharist_db
```

### MongoDB

- **MongoDB Compass** - Official GUI: https://www.mongodb.com/products/compass
- **mongosh** - Modern shell (included with MongoDB)

```bash
mongosh mongodb://localhost:27017/eucharist
```

### Redis

- **RedisInsight** - Official GUI: https://redis.com/redis-enterprise/redis-insight/
- **redis-cli** - Command-line tool (included with Redis)

```bash
redis-cli
```

## Troubleshooting

### PostgreSQL Connection Issues

**Error**: "ECONNREFUSED" or "Connection refused"

```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Check port
lsof -i :5432  # macOS/Linux
```

**Error**: "password authentication failed"

```bash
# Update your .env file with correct password
# Or reset PostgreSQL password
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
```

### MongoDB Connection Issues

**Error**: "MongoNetworkError"

```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Check port
lsof -i :27017  # macOS/Linux
```

### Redis Connection Issues

**Error**: "ECONNREFUSED" or "Redis connection failed"

```bash
# Check if Redis is running
brew services list  # macOS
sudo systemctl status redis-server  # Linux

# Check port
lsof -i :6379  # macOS/Linux

# Test connection
redis-cli ping  # Should return "PONG"
```

### Docker Issues

**Containers won't start**:

```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs postgres
docker-compose logs mongodb
docker-compose logs redis

# Restart containers
docker-compose restart

# Clean restart
docker-compose down
docker-compose up -d
```

**Port conflicts**:
If ports 5432, 27017, or 6379 are already in use:

```bash
# Check what's using the port
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Either stop the conflicting service or change ports in docker-compose.yml
```

## Development Workflows

### Resetting Databases

**PostgreSQL**:

```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE eucharist_db;
CREATE DATABASE eucharist_db;
```

**MongoDB**:

```bash
# Drop database
mongosh mongodb://localhost:27017/eucharist
db.dropDatabase()
```

**Redis**:

```bash
# Clear all data
redis-cli FLUSHALL
```

**Docker**:

```bash
# Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

### Backup and Restore

**PostgreSQL**:

```bash
# Backup
pg_dump -U postgres eucharist_db > backup.sql

# Restore
psql -U postgres eucharist_db < backup.sql
```

**MongoDB**:

```bash
# Backup
mongodump --db eucharist --out ./backup

# Restore
mongorestore --db eucharist ./backup/eucharist
```

**Redis**:

```bash
# Backup (creates dump.rdb)
redis-cli SAVE

# Restore (copy dump.rdb to Redis data directory)
```

## Environment-Specific Configuration

### Development

Use the default configuration in `.env`:

- Local databases on standard ports
- No authentication for PostgreSQL/MongoDB (Docker only)
- Redis without password

### Testing

Create `.env.test` for test databases:

```env
POSTGRES_DB=eucharist_test
MONGODB_URI=mongodb://localhost:27017/eucharist_test
```

### Production

Use secure configuration:

- Strong passwords for all databases
- SSL/TLS connections
- Connection pooling tuned for load
- Backup strategies in place
- Monitoring and alerting configured

## Next Steps

After setting up databases:

1. **Run migrations** (when implemented):

   ```bash
   npm run migrate
   ```

2. **Seed test data** (when implemented):

   ```bash
   npm run seed
   ```

3. **Run tests**:

   ```bash
   npm test
   ```

4. **Start development**:
   ```bash
   npm run dev
   ```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)
- [Project README](./README.md)

## Support

For issues with database setup:

1. Check the troubleshooting section above
2. Review database logs
3. Consult the official documentation
4. Create an issue on GitHub with details
