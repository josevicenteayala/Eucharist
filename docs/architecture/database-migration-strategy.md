# Database Migration Strategy

## Overview

This document defines the database migration strategy for the Eucharist Understanding Platform, ensuring safe, reliable, and reversible database changes throughout the application lifecycle.

## Database Systems

We use a hybrid database approach:
1. **PostgreSQL**: Relational data (users, prayers, bookmarks, progress)
2. **MongoDB**: Flexible content (articles, reflections, miracles)
3. **Redis**: Caching and sessions

## Migration Tools

### PostgreSQL Migrations
**Tool**: Sequelize CLI or Knex.js

**Rationale**:
- Version-controlled migrations
- Up/down migration support
- Automatic transaction wrapping
- TypeScript support
- Part of our ORM ecosystem

**Installation**:
```bash
npm install --save-dev sequelize-cli
npm install --save sequelize pg pg-hstore
```

**Configuration**:
```javascript
// config/database.js
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};
```

### MongoDB Migrations
**Tool**: migrate-mongo

**Rationale**:
- Simple migration framework
- Up/down migration support
- MongoDB native driver
- TypeScript compatible

**Installation**:
```bash
npm install --save migrate-mongo
```

### Redis
**Tool**: Manual setup scripts

**Rationale**:
- Redis is primarily for caching (ephemeral data)
- Configuration rather than schema migrations
- No persistent schema to migrate

## Migration Workflow

### Development Workflow

#### 1. Create Migration

**PostgreSQL**:
```bash
npx sequelize-cli migration:generate --name create-users-table
```

**MongoDB**:
```bash
npx migrate-mongo create add-article-tags
```

#### 2. Write Migration

**PostgreSQL Example**:
```typescript
// migrations/20251019000000-create-users-table.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: 'user'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Add indexes
  await queryInterface.addIndex('users', ['email']);
  await queryInterface.addIndex('users', ['role']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('users');
}
```

**MongoDB Example**:
```javascript
// migrations/20251019000000-add-article-tags.js
module.exports = {
  async up(db, client) {
    const articles = db.collection('articles');
    
    // Add tags field to existing articles
    await articles.updateMany(
      { tags: { $exists: false } },
      { $set: { tags: [] } }
    );
    
    // Create index on tags
    await articles.createIndex({ tags: 1 });
  },

  async down(db, client) {
    const articles = db.collection('articles');
    
    // Remove tags field
    await articles.updateMany(
      {},
      { $unset: { tags: "" } }
    );
    
    // Drop index
    await articles.dropIndex('tags_1');
  }
};
```

#### 3. Test Migration Locally

```bash
# Test up migration
npm run migrate:up

# Test application with new schema
npm run dev

# Test down migration
npm run migrate:down

# Test up again
npm run migrate:up
```

#### 4. Commit Migration

```bash
git add migrations/
git commit -m "feat(db): add users table migration"
git push
```

### Staging Deployment

#### Pre-Deployment Checklist
- [ ] Migration tested locally
- [ ] Migration reviewed by team
- [ ] Backup plan documented
- [ ] Rollback tested
- [ ] Down migration verified
- [ ] Performance impact assessed

#### Deployment Steps

1. **Backup Database**
```bash
# PostgreSQL backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# MongoDB backup
mongodump --uri="$MONGO_URI" --out=backup_$(date +%Y%m%d_%H%M%S)
```

2. **Run Migration**
```bash
# PostgreSQL
npm run migrate:up -- --env staging

# MongoDB
npx migrate-mongo up
```

3. **Verify Schema**
```bash
# PostgreSQL - check tables
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\dt"

# MongoDB - check collections
mongosh $MONGO_URI --eval "db.getCollectionNames()"
```

4. **Test Application**
- Smoke test critical endpoints
- Check logs for errors
- Verify data integrity

5. **Monitor**
- Watch application logs
- Monitor error rates
- Check performance metrics

### Production Deployment

#### Additional Requirements
- [ ] Tested in staging for 24+ hours
- [ ] No errors in staging
- [ ] Performance acceptable in staging
- [ ] Team trained on rollback procedure
- [ ] Maintenance window scheduled (if needed)
- [ ] Stakeholders notified

#### Deployment Process

1. **Pre-Deployment Communication**
```
Subject: Database Migration - [Date] [Time]

Team,

We will be deploying a database migration on [Date] at [Time].

Changes:
- [Brief description]

Expected downtime: [None/X minutes]

Rollback plan:
- [Brief description]

Point of contact: [Name]
```

2. **Execute Migration** (same as staging)

3. **Post-Deployment Verification**
- Application health checks pass
- Critical user flows work
- No spike in error rates
- Performance metrics normal

4. **Post-Deployment Communication**
```
Subject: Database Migration Complete

Team,

Database migration completed successfully at [Time].

Verification:
✅ Schema updated
✅ Application running
✅ Health checks passing
✅ No errors detected

Status: Monitoring for 1 hour
```

## Migration Best Practices

### General Principles

1. **Idempotent Migrations**: Can be run multiple times safely
2. **Small Changes**: One logical change per migration
3. **Reversible**: Always provide down migration
4. **Tested**: Test both up and down migrations
5. **Documented**: Clear comments explaining the change

### Writing Safe Migrations

#### DO ✅

```typescript
// Add new column with default
await queryInterface.addColumn('users', 'bio', {
  type: DataTypes.TEXT,
  allowNull: true,
  defaultValue: null
});

// Add index (non-blocking on PostgreSQL 11+)
await queryInterface.addIndex('users', ['email'], {
  name: 'idx_users_email',
  concurrently: true
});

// Rename column safely
await queryInterface.renameColumn('users', 'name', 'display_name');
```

#### DON'T ❌

```typescript
// Don't drop columns without down migration
await queryInterface.removeColumn('users', 'old_field');
// Without down: 
// await queryInterface.addColumn('users', 'old_field', ...);

// Don't make breaking changes without transition period
await queryInterface.changeColumn('users', 'email', {
  type: DataTypes.STRING(100), // Was 255, might break data
  allowNull: false // Was nullable, might fail
});

// Don't run data migrations in schema migrations
await queryInterface.sequelize.query(
  "UPDATE users SET role = 'admin' WHERE email LIKE '%@admin.com'"
);
// Use separate data migration script instead
```

### Handling Data Migrations

**Separate Data Migrations from Schema Migrations**

**Schema Migration** (migrations/):
```typescript
// 20251019000000-add-user-role.ts
export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'role', {
    type: DataTypes.STRING(20),
    defaultValue: 'user'
  });
}
```

**Data Migration** (scripts/):
```typescript
// scripts/20251019-set-admin-roles.ts
import { User } from '../models';

export async function run() {
  const admins = await User.findAll({
    where: {
      email: {
        [Op.like]: '%@admin.com'
      }
    }
  });

  for (const admin of admins) {
    await admin.update({ role: 'admin' });
    console.log(`Updated ${admin.email} to admin`);
  }
}

// Run manually: node -r ts-node/register scripts/20251019-set-admin-roles.ts
```

### Large Table Migrations

For tables with millions of rows:

1. **Add Column Without Constraint**
```typescript
// Step 1: Add nullable column
await queryInterface.addColumn('large_table', 'new_field', {
  type: DataTypes.STRING,
  allowNull: true
});
```

2. **Backfill Data in Batches**
```typescript
// Step 2: Backfill (separate script)
const batchSize = 1000;
let offset = 0;

while (true) {
  const rows = await Model.findAll({
    where: { new_field: null },
    limit: batchSize,
    offset: offset
  });

  if (rows.length === 0) break;

  for (const row of rows) {
    await row.update({ new_field: calculateValue(row) });
  }

  offset += batchSize;
  console.log(`Processed ${offset} rows`);
  await sleep(100); // Throttle
}
```

3. **Add Constraint**
```typescript
// Step 3: Add constraint after backfill
await queryInterface.changeColumn('large_table', 'new_field', {
  type: DataTypes.STRING,
  allowNull: false
});
```

## Rollback Strategy

### When to Rollback

- Migration fails mid-execution
- Application errors after deployment
- Performance degradation
- Data integrity issues

### Rollback Process

#### Automatic Rollback (for transaction-wrapped migrations)

PostgreSQL migrations are automatically wrapped in transactions, so failed migrations rollback automatically.

#### Manual Rollback

```bash
# PostgreSQL - rollback last migration
npm run migrate:down

# MongoDB - rollback last migration
npx migrate-mongo down

# Verify
npm run migrate:status
```

#### Emergency Rollback

1. **Stop Application** (if needed)
```bash
# Scale down or stop app
kubectl scale deployment eucharist-api --replicas=0
```

2. **Restore from Backup**
```bash
# PostgreSQL restore
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME -c backup_file.dump

# MongoDB restore
mongorestore --uri="$MONGO_URI" --drop backup_dir/
```

3. **Revert Application Code**
```bash
git revert <commit-hash>
git push
# Deploy reverted code
```

4. **Restart Application**
```bash
kubectl scale deployment eucharist-api --replicas=3
```

## Migration Testing

### Unit Tests

```typescript
// tests/migrations/create-users.test.ts
import { Sequelize } from 'sequelize';
import { up, down } from '../../migrations/20251019000000-create-users';

describe('Create Users Table Migration', () => {
  let sequelize: Sequelize;
  let queryInterface;

  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory:');
    queryInterface = sequelize.getQueryInterface();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create users table with correct schema', async () => {
    await up(queryInterface);
    
    const tables = await queryInterface.showAllTables();
    expect(tables).toContain('users');
    
    const columns = await queryInterface.describeTable('users');
    expect(columns).toHaveProperty('id');
    expect(columns).toHaveProperty('email');
  });

  it('should drop users table on down migration', async () => {
    await up(queryInterface);
    await down(queryInterface);
    
    const tables = await queryInterface.showAllTables();
    expect(tables).not.toContain('users');
  });
});
```

### Integration Tests

Test migrations against a test database:

```bash
# Run migrations in test environment
DATABASE_URL=postgresql://test npm run migrate:up

# Run application tests
npm test

# Rollback
DATABASE_URL=postgresql://test npm run migrate:down
```

## Migration Scripts

### Useful Scripts (package.json)

```json
{
  "scripts": {
    "migrate:up": "sequelize-cli db:migrate",
    "migrate:down": "sequelize-cli db:migrate:undo",
    "migrate:down:all": "sequelize-cli db:migrate:undo:all",
    "migrate:status": "sequelize-cli db:migrate:status",
    "migrate:create": "sequelize-cli migration:generate --name",
    
    "mongo:migrate:up": "migrate-mongo up",
    "mongo:migrate:down": "migrate-mongo down",
    "mongo:migrate:status": "migrate-mongo status",
    "mongo:migrate:create": "migrate-mongo create",
    
    "db:backup": "node scripts/backup-database.js",
    "db:seed": "sequelize-cli db:seed:all"
  }
}
```

## Monitoring and Alerts

### Metrics to Track

- Migration execution time
- Migration success/failure rate
- Database size growth
- Query performance before/after migration
- Application error rate during/after migration

### Alerts

Set up alerts for:
- Migration failure
- Application error spike (>10% increase)
- Database connection pool exhaustion
- Slow query detection
- Disk space warnings

## Documentation

### Migration Documentation Template

```markdown
# Migration: [Name]

**Date**: YYYY-MM-DD
**Author**: [Name]
**Status**: Pending/Applied/Rolled Back

## Purpose
[Why is this migration needed?]

## Changes
- Change 1
- Change 2

## Impact
- **Breaking Changes**: Yes/No
- **Downtime Required**: Yes/No (X minutes)
- **Performance Impact**: Low/Medium/High
- **Data Volume**: X rows affected

## Testing
- [ ] Tested locally
- [ ] Tested in staging
- [ ] Performance tested
- [ ] Rollback tested

## Rollback Plan
[How to rollback if needed]

## Notes
[Any additional information]
```

## Conclusion

A solid database migration strategy ensures:
- Safe schema evolution
- Zero data loss
- Minimal downtime
- Quick rollback capability
- Team confidence

Follow this strategy to maintain database integrity while moving fast.

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Owner**: Software Architect  
**Review**: Quarterly or when major changes needed
