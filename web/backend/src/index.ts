import app from './app';
import { config } from './config/env';

const PORT = config.port;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  // eslint-disable-next-line no-console
  console.log(`📍 Health check: http://localhost:${PORT}/api/${config.apiVersion}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed');
  });
});

export default server;
