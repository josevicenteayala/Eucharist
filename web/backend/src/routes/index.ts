import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// Health check endpoint
router.use('/health', healthRoutes);

// Future routes will be added here:
// router.use('/auth', authRoutes);
// router.use('/gospel', gospelRoutes);
// router.use('/content', contentRoutes);
// router.use('/community', communityRoutes);
// router.use('/users', userRoutes);

export default router;
