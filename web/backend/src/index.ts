import app from './app';
import { config } from './config/env';
import logger from './config/logger';
import { connectDatabases, disconnectDatabases } from './config/database';
import { UserModel } from './models/postgres/User';

const PORT = config.port;

async function startServer() {
  try {
    // Connect to databases
    await connectDatabases();

    // Initialize Database Tables
    await UserModel.initializeTable();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
      logger.info(`📍 Health check: http://localhost:${PORT}/api/${config.apiVersion}/health`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutdown signal received: closing connections');

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await disconnectDatabases();
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

const server = startServer();

export default server;
