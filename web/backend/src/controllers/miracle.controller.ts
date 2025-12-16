import { Request, Response, NextFunction } from 'express';
import { miracleService } from '../services/miracle.service';

export class MiracleController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await miracleService.findAll(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const miracle = await miracleService.findBySlug(req.params.slug);
      res.json(miracle);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const miracle = await miracleService.create(req.body);
      res.status(201).json(miracle);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const miracle = await miracleService.update(req.params.id, req.body);
      res.json(miracle);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await miracleService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const miracleController = new MiracleController();
