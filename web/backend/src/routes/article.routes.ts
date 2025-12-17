import { Router } from 'express';
import { articleController } from '../controllers/article.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', articleController.list);
router.get('/:slug', articleController.get);

// Protected routes (Create, Update, Delete)
// Assuming we perform role checks in future, effectively currently just requires generic Auth
router.post('/', authenticate, articleController.create);
router.put('/:id', authenticate, articleController.update);
router.delete('/:id', authenticate, articleController.delete);

export default router;
