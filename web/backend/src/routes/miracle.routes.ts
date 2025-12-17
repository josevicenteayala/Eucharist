import { Router } from 'express';
import { miracleController } from '../controllers/miracle.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', miracleController.list);
router.get('/:slug', miracleController.get);

// Protected routes
router.post('/', authenticate, miracleController.create);
router.put('/:id', authenticate, miracleController.update);
router.delete('/:id', authenticate, miracleController.delete);

export default router;
