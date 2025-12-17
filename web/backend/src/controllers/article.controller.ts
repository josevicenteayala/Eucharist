import { Request, Response } from 'express';
import { articleService } from '../services/article.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export class ArticleController {
  list = catchAsync(async (req: Request, res: Response) => {
    const result = await articleService.findAll(req.query);
    res.json(result);
  });

  get = catchAsync(async (req: Request, res: Response) => {
    const article = await articleService.findBySlug(req.params.slug);
    if (!article) {
      throw new AppError('Article not found', 404);
    }
    res.json(article);
  });

  create = catchAsync(async (req: Request, res: Response) => {
    // In a real app, we'd take current user from req.user to set author
    // For now, assume body has full data or partial
    const article = await articleService.create(req.body);
    res.status(201).json(article);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const article = await articleService.update(req.params.id, req.body);
    if (!article) {
      throw new AppError('Article not found', 404);
    }
    res.json(article);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const article = await articleService.delete(req.params.id);
    if (!article) {
      throw new AppError('Article not found', 404);
    }
    res.status(204).send();
  });
}

export const articleController = new ArticleController();
