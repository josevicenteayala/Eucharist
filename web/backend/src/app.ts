import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { stream } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { corsOptions } from './config/cors';
import { getHelmetOptions } from './config/helmet';

const app: Application = express();

// Security middleware - Helmet.js sets secure HTTP headers
app.use(helmet(getHelmetOptions()));

// CORS configuration - Control cross-origin resource sharing
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware - integrate Morgan with Winston
if (config.nodeEnv === 'development') {
  app.use(morgan('dev', { stream }));
} else {
  app.use(morgan('combined', { stream }));
}

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Eucharist Platform API',
      version: config.apiVersion,
      documentation: '/api/docs',
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
