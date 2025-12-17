import { Router } from 'express';
import { prayerController } from '../controllers/prayer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', prayerController.list);
router.get('/:slug', prayerController.get);

// Protected routes
router.post('/', authenticate, prayerController.create);
router.put('/:id', authenticate, prayerController.update);
router.delete('/:id', authenticate, prayerController.delete);

export default router;
