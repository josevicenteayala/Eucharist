/**
 * Database Migration Runner
 *
 * Utility for running PostgreSQL migrations in order.
 * Migrations are tracked in a migrations table to prevent re-running.
 */

import { Pool, PoolClient } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../../config/logger';

/**
 * Migration record stored in the database
 */
interface MigrationRecord {
  id: number;
  name: string;
  applied_at: Date;
}

/**
 * Creates the migrations tracking table if it doesn't exist
 */
async function ensureMigrationsTable(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

/**
 * Gets the list of already applied migrations
 */
async function getAppliedMigrations(client: PoolClient): Promise<string[]> {
  const result = await client.query<MigrationRecord>('SELECT name FROM migrations ORDER BY id');
  return result.rows.map((row) => row.name);
}

/**
 * Gets all migration files from the migrations directory
 */
function getMigrationFiles(): string[] {
  const migrationsDir = path.join(__dirname);
  const files = fs.readdirSync(migrationsDir);

  return files
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => {
      // Sort by migration number prefix
      const numA = parseInt(a.split('_')[0], 10);
      const numB = parseInt(b.split('_')[0], 10);
      return numA - numB;
    });
}

/**
 * Runs a single migration file
 */
async function runMigration(client: PoolClient, migrationFile: string): Promise<void> {
  const migrationsDir = path.join(__dirname);
  const filePath = path.join(migrationsDir, migrationFile);
  const sql = fs.readFileSync(filePath, 'utf-8');

  await client.query('BEGIN');

  try {
    // Run the migration SQL
    await client.query(sql);

    // Record the migration
    await client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);

    await client.query('COMMIT');
    logger.info(`✅ Applied migration: ${migrationFile}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

/**
 * Runs all pending migrations
 *
 * @param pool - PostgreSQL connection pool
 * @returns Number of migrations applied
 */
export async function runMigrations(pool: Pool): Promise<number> {
  const client = await pool.connect();
  let appliedCount = 0;

  try {
    // Ensure migrations table exists
    await ensureMigrationsTable(client);

    // Get applied and pending migrations
    const appliedMigrations = await getAppliedMigrations(client);
    const allMigrations = getMigrationFiles();
    const pendingMigrations = allMigrations.filter((m) => !appliedMigrations.includes(m));

    if (pendingMigrations.length === 0) {
      logger.info('No pending migrations');
      return 0;
    }

    logger.info(`Found ${pendingMigrations.length} pending migrations`);

    // Run each pending migration
    for (const migration of pendingMigrations) {
      await runMigration(client, migration);
      appliedCount++;
    }

    logger.info(`✅ Successfully applied ${appliedCount} migrations`);
    return appliedCount;
  } finally {
    client.release();
  }
}

/**
 * Gets the migration status
 *
 * @param pool - PostgreSQL connection pool
 * @returns Object with applied and pending migrations
 */
export async function getMigrationStatus(pool: Pool): Promise<{
  applied: string[];
  pending: string[];
}> {
  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);

    const appliedMigrations = await getAppliedMigrations(client);
    const allMigrations = getMigrationFiles();
    const pendingMigrations = allMigrations.filter((m) => !appliedMigrations.includes(m));

    return {
      applied: appliedMigrations,
      pending: pendingMigrations,
    };
  } finally {
    client.release();
  }
}

/**
 * Initializes the database schema by running all migrations
 *
 * @param pool - PostgreSQL connection pool
 */
export async function initializeSchema(pool: Pool): Promise<void> {
  logger.info('Initializing database schema...');
  await runMigrations(pool);
  logger.info('Database schema initialized');
}
