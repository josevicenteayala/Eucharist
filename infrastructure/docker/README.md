# Docker Configurations

This directory contains Docker configurations for the Eucharist Platform.

## Contents

- `docker-compose.yml` - Multi-container application setup
- `Dockerfile.backend` - Backend service container
- `Dockerfile.frontend` - Frontend service container
- Additional service configurations as needed

## Usage

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

## Services

Docker Compose will configure:

- Backend API server
- Frontend web application
- PostgreSQL database
- MongoDB database
- Redis cache
