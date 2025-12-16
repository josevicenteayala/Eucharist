import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';

const router = Router();

// Health check endpoint
router.use('/health', healthRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// Future routes will be added here:
// router.use('/gospel', gospelRoutes);
// router.use('/content', contentRoutes);
// router.use('/community', communityRoutes);
// router.use('/users', userRoutes);

export default router;
