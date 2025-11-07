import Redis from 'ioredis';
import { config } from '../env';
import logger from '../logger';

class RedisDatabase {
  private client: Redis | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn('Redis already connected');
      return;
    }

    try {
      this.client = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      // Handle connection events
      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('✅ Redis connected successfully');
      });

      this.client.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

      this.client.on('close', () => {
        this.isConnected = false;
        logger.warn('Redis connection closed');
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

      // Test the connection
      await this.client.ping();
    } catch (error) {
      logger.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting Redis:', error);
      throw error;
    }
  }

  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return this.client;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    await this.client.del(key);
  }

  async healthCheck(): Promise<{ status: string; message?: string }> {
    if (!this.isConnected || !this.client) {
      return { status: 'disconnected', message: 'Redis not connected' };
    }

    try {
      await this.client.ping();
      return { status: 'healthy' };
    } catch (error) {
      logger.error('Redis health check failed:', error);
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

export const redisDb = new RedisDatabase();
