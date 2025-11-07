import { Pool, PoolClient } from 'pg';
import { config } from '../env';
import logger from '../logger';

class PostgresDatabase {
  private pool: Pool | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn('PostgreSQL already connected');
      return;
    }

    try {
      this.pool = new Pool({
        host: config.postgres.host,
        port: config.postgres.port,
        database: config.postgres.database,
        user: config.postgres.user,
        password: config.postgres.password,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test the connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isConnected = true;
      logger.info('✅ PostgreSQL connected successfully');
    } catch (error) {
      logger.error('❌ PostgreSQL connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.pool) {
      return;
    }

    try {
      await this.pool.end();
      this.isConnected = false;
      logger.info('PostgreSQL disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting PostgreSQL:', error);
      throw error;
    }
  }

  getPool(): Pool {
    if (!this.pool) {
      throw new Error('PostgreSQL pool not initialized. Call connect() first.');
    }
    return this.pool;
  }

  async query(text: string, params?: unknown[]): Promise<unknown> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool not initialized. Call connect() first.');
    }
    return this.pool.query(text, params);
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool not initialized. Call connect() first.');
    }
    return this.pool.connect();
  }

  async healthCheck(): Promise<{ status: string; message?: string }> {
    if (!this.isConnected || !this.pool) {
      return { status: 'disconnected', message: 'PostgreSQL not connected' };
    }

    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      return { status: 'healthy' };
    } catch (error) {
      logger.error('PostgreSQL health check failed:', error);
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  isConnectionActive(): boolean {
    return this.isConnected;
  }
}

export const postgresDb = new PostgresDatabase();
