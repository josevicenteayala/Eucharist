import { Request, Response } from 'express';
import { prayerService } from '../services/prayer.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export class PrayerController {
  list = catchAsync(async (req: Request, res: Response) => {
    const result = await prayerService.findAll(req.query);
    res.json(result);
  });

  get = catchAsync(async (req: Request, res: Response) => {
    const prayer = await prayerService.findBySlug(req.params.slug);
    if (!prayer) {
      throw new AppError('Prayer not found', 404);
    }
    res.json(prayer);
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const prayer = await prayerService.create(req.body);
    res.status(201).json(prayer);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const prayer = await prayerService.update(req.params.id, req.body);
    if (!prayer) {
      throw new AppError('Prayer not found', 404);
    }
    res.json(prayer);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const prayer = await prayerService.delete(req.params.id);
    if (!prayer) {
      throw new AppError('Prayer not found', 404);
    }
    res.status(204).send();
  });
}

export const prayerController = new PrayerController();
