import mongoose from 'mongoose';
import { config } from '../env';
import logger from '../logger';

class MongoDatabase {
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn('MongoDB already connected');
      return;
    }

    try {
      await mongoose.connect(config.mongodb.uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      logger.info('✅ MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('disconnected', () => {
        this.isConnected = false;
        logger.warn('MongoDB disconnected');
      });

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('reconnected', () => {
        this.isConnected = true;
        logger.info('MongoDB reconnected');
      });
    } catch (error) {
      logger.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting MongoDB:', error);
      throw error;
    }
  }

  getConnection(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return mongoose;
  }

  async healthCheck(): Promise<{ status: string; message?: string }> {
    if (!this.isConnected) {
      return { status: 'disconnected', message: 'MongoDB not connected' };
    }

    try {
      const state = mongoose.connection.readyState;
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      if (state === 1) {
        // Perform a simple ping operation
        const db = mongoose.connection.db;
        if (db) {
          await db.admin().ping();
          return { status: 'healthy' };
        } else {
          return { status: 'unhealthy', message: 'Database instance not available' };
        }
      } else {
        return { status: 'unhealthy', message: `Connection state: ${state}` };
      }
    } catch (error) {
      logger.error('MongoDB health check failed:', error);
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  isConnectionActive(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

export const mongoDb = new MongoDatabase();
