import { Miracle, IMiracle } from '../models/mongodb/miracle.model';

export class MiracleService {
  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search, country, year, ...filter } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const match: any = { ...filter };

    if (search) {
      match.$text = { $search: search };
    }
    if (country) {
      match['location.country'] = country;
    }
    if (year) {
      match['date.year'] = parseInt(year);
    }

    const [miracles, total] = await Promise.all([
      Miracle.find(match)
        .sort(search ? { score: { $meta: 'textScore' } } : { 'date.year': 1 }) // improved sort order for miracles often chronological
        .skip(skip)
        .limit(parseInt(limit)),
      Miracle.countDocuments(match),
    ]);

    return {
      data: miracles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findBySlug(slug: string) {
    const miracle = await Miracle.findOne({ slug });
    return miracle;
  }

  async create(data: Partial<IMiracle>) {
    const miracle = new Miracle(data);
    return await miracle.save();
  }

  async update(id: string, data: Partial<IMiracle>) {
    const miracle = await Miracle.findByIdAndUpdate(id, data, { new: true });
    return miracle;
  }

  async delete(id: string) {
    const miracle = await Miracle.findByIdAndDelete(id);
    return miracle;
  }
}

export const miracleService = new MiracleService();
