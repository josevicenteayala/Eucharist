import { postgresDb } from './postgres';
import { mongoDb } from './mongodb';
import { redisDb } from './redis';
import logger from '../logger';

export { postgresDb, mongoDb, redisDb };

export async function connectDatabases(): Promise<void> {
  logger.info('Connecting to databases...');

  const promises = [
    postgresDb.connect().catch((error) => {
      logger.error('Failed to connect to PostgreSQL:', error);
      throw error;
    }),
    mongoDb.connect().catch((error) => {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }),
    redisDb.connect().catch((error) => {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }),
  ];

  await Promise.all(promises);
  logger.info('All databases connected successfully');
}

export async function disconnectDatabases(): Promise<void> {
  logger.info('Disconnecting from databases...');

  const promises = [
    postgresDb.disconnect().catch((error) => {
      logger.error('Error disconnecting PostgreSQL:', error);
    }),
    mongoDb.disconnect().catch((error) => {
      logger.error('Error disconnecting MongoDB:', error);
    }),
    redisDb.disconnect().catch((error) => {
      logger.error('Error disconnecting Redis:', error);
    }),
  ];

  await Promise.all(promises);
  logger.info('All databases disconnected');
}

export async function checkDatabasesHealth(): Promise<{
  postgres: { status: string; message?: string };
  mongodb: { status: string; message?: string };
  redis: { status: string; message?: string };
}> {
  const [postgres, mongodb, redis] = await Promise.all([
    postgresDb.healthCheck(),
    mongoDb.healthCheck(),
    redisDb.healthCheck(),
  ]);

  return { postgres, mongodb, redis };
}
