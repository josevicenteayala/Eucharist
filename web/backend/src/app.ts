import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
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
