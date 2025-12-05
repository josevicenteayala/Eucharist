# Database Module

This directory contains the PostgreSQL database schema, migrations, and type definitions for the Eucharist Platform.

## Directory Structure

```
database/
├── index.ts              # Main export file
├── README.md             # This file
├── migrations/           # SQL migration files
│   ├── index.ts          # Migration runner utility
│   ├── 001_create_users_table.sql
│   ├── 002_create_user_profiles_table.sql
│   ├── 003_create_gospel_readings_table.sql
│   └── 004_create_reflections_table.sql
└── schemas/
    └── index.ts          # TypeScript type definitions
```

## Schema Overview

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User authentication and account information |
| `user_profiles` | Extended user profile and preferences |
| `gospel_readings` | Daily liturgical readings from the Catholic lectionary |
| `reflections` | User reflections on gospel readings |

### Entity Relationships

```
users (1) ──── (1) user_profiles
  │
  └── (1) ──── (many) reflections ──── (many) ──── (1) gospel_readings
```

## Running Migrations

### Programmatically

```typescript
import { postgresDb } from '../config/database';
import { runMigrations, getMigrationStatus } from './database';

// Connect to database
await postgresDb.connect();
const pool = postgresDb.getPool();

// Check migration status
const status = await getMigrationStatus(pool);
console.log('Applied:', status.applied);
console.log('Pending:', status.pending);

// Run pending migrations
const count = await runMigrations(pool);
console.log(`Applied ${count} migrations`);
```

### Via npm Script (when available)

```bash
npm run migrate:up    # Run pending migrations
npm run migrate:status  # Check migration status
```

## TypeScript Types

All database entities have corresponding TypeScript interfaces:

```typescript
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserProfile,
  GospelReading,
  Reflection,
  UserRole,
  LiturgicalYear,
  ReflectionStatus,
} from './database';
```

## Database Design Principles

1. **UUID Primary Keys**: All tables use UUID for globally unique identifiers
2. **Timestamps**: All tables include `created_at` and `updated_at` columns
3. **Soft Constraints**: Role and status columns use CHECK constraints
4. **Cascading Deletes**: Profile and reflections cascade when users are deleted
5. **Indexed Queries**: Common query patterns have supporting indexes

## PostgreSQL Specific Features

- **UUID Generation**: Uses `gen_random_uuid()` from pgcrypto extension
- **JSONB Columns**: For flexible preferences and settings storage
- **Array Columns**: For interests (TEXT[]) storage
- **Partial Indexes**: For efficient queries on boolean flags

## Future Tables (Planned)

The following tables are defined in the architecture documentation but not yet implemented:

- `refresh_tokens` - JWT refresh token storage
- `prayer_intentions` - Community prayer requests
- `prayer_logs` - Prayer activity tracking
- `bookmarks` - User bookmarks for content
- `user_progress` - Content progress tracking

See `docs/sdlc/SOFTWARE_ARCHITECT.md` for complete schema definitions.
