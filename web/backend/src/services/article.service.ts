import { Article, IArticle } from '../models/mongodb/article.model';

export class ArticleService {
  async findAll(query: any = {}) {
    const { page = 1, limit = 10, search, category, tag, ...filter } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const match: any = { ...filter, status: 'published' };

    if (search) {
      match.$text = { $search: search };
    }
    if (category) {
      match.category = category;
    }
    if (tag) {
      match.tags = tag;
    }

    // Admin can see non-published? Logic for now: default to published unless specified otherwise by admin (handled in controller maybe? or separate method)
    // For public API, we usually want published. Let's keep it simple for now and assume this is the public/general list.

    const [articles, total] = await Promise.all([
      Article.find(match)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'name bio'), // Assume author stored primarily in Postgres but we might populate if referenced, here schema has embed author.
      Article.countDocuments(match),
    ]);

    return {
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findBySlug(slug: string) {
    const article = await Article.findOne({ slug, status: 'published' });
    return article;
  }

  // Admin / Protected methods
  async create(data: Partial<IArticle>) {
    const article = new Article(data);
    return await article.save();
  }

  async update(id: string, data: Partial<IArticle>) {
    const article = await Article.findByIdAndUpdate(id, data, { new: true });
    return article;
  }

  async delete(id: string) {
    const article = await Article.findByIdAndDelete(id);
    return article;
  }
}

export const articleService = new ArticleService();
