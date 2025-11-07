import { Router, Request, Response } from 'express';
import { checkDatabasesHealth } from '../config/database';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const databases = await checkDatabasesHealth();

  const overallStatus =
    databases.postgres.status === 'healthy' &&
    databases.mongodb.status === 'healthy' &&
    databases.redis.status === 'healthy'
      ? 'healthy'
      : 'degraded';

  res.json({
    success: true,
    data: {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      databases,
    },
  });
});

export default router;
