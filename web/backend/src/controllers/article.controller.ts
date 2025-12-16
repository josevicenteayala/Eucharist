import { Request, Response, NextFunction } from 'express';
import { articleService } from '../services/article.service';

export class ArticleController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await articleService.findAll(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await articleService.findBySlug(req.params.slug);
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real app, we'd take current user from req.user to set author
      // For now, assume body has full data or partial
      const article = await articleService.create(req.body);
      res.status(201).json(article);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await articleService.update(req.params.id, req.body);
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await articleService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();
