import { Request, Response } from 'express';
import { miracleService } from '../services/miracle.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export class MiracleController {
  list = catchAsync(async (req: Request, res: Response) => {
    const result = await miracleService.findAll(req.query);
    res.json(result);
  });

  get = catchAsync(async (req: Request, res: Response) => {
    const miracle = await miracleService.findBySlug(req.params.slug);
    if (!miracle) {
      throw new AppError('Miracle not found', 404);
    }
    res.json(miracle);
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const miracle = await miracleService.create(req.body);
    res.status(201).json(miracle);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const miracle = await miracleService.update(req.params.id, req.body);
    if (!miracle) {
      throw new AppError('Miracle not found', 404);
    }
    res.json(miracle);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const miracle = await miracleService.delete(req.params.id);
    if (!miracle) {
      throw new AppError('Miracle not found', 404);
    }
    res.status(204).send();
  });
}

export const miracleController = new MiracleController();
