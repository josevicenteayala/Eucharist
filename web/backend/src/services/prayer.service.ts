import { Prayer, IPrayer } from '../models/mongodb/prayer.model';

export class PrayerService {
  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search, category, usage, ...filter } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const match: any = { ...filter };

    if (search) {
      match.$text = { $search: search };
    }
    if (category) {
      match.category = category;
    }
    if (usage) {
      match.usage = usage;
    }

    const [prayers, total] = await Promise.all([
      Prayer.find(match)
        .sort(search ? { score: { $meta: 'textScore' } } : { title: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Prayer.countDocuments(match),
    ]);

    return {
      data: prayers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findBySlug(slug: string) {
    const prayer = await Prayer.findOne({ slug });
    if (!prayer) throw new Error('Prayer not found');
    return prayer;
  }

  async create(data: Partial<IPrayer>) {
    const prayer = new Prayer(data);
    return await prayer.save();
  }

  async update(id: string, data: Partial<IPrayer>) {
    const prayer = await Prayer.findByIdAndUpdate(id, data, { new: true });
    if (!prayer) throw new Error('Prayer not found');
    return prayer;
  }

  async delete(id: string) {
    const prayer = await Prayer.findByIdAndDelete(id);
    if (!prayer) throw new Error('Prayer not found');
    return prayer;
  }
}

export const prayerService = new PrayerService();
