import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import articleRoutes from './article.routes';
import miracleRoutes from './miracle.routes';
import prayerRoutes from './prayer.routes';

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
router.use('/articles', articleRoutes);
router.use('/miracles', miracleRoutes);
router.use('/prayers', prayerRoutes);

export default router;
