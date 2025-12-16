import { Request, Response, NextFunction } from 'express';
import { prayerService } from '../services/prayer.service';

export class PrayerController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await prayerService.findAll(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const prayer = await prayerService.findBySlug(req.params.slug);
      res.json(prayer);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const prayer = await prayerService.create(req.body);
      res.status(201).json(prayer);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const prayer = await prayerService.update(req.params.id, req.body);
      res.json(prayer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prayerService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const prayerController = new PrayerController();
