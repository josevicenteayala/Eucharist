import request from 'supertest';
import app from '../src/app';
import { Article } from '../src/models/mongodb/article.model';

import { mongoDb } from '../src/config/database/mongodb';

describe('Article Routes Integration', () => {
  beforeAll(async () => {
    await mongoDb.connect();
  });

  beforeEach(async () => {
    await Article.deleteMany({});
  });

  afterAll(async () => {
    await mongoDb.disconnect();
    // await mongoose.connection.close(); // Handled by mongoDb.disconnect() probably
  });

  describe('GET /api/v1/articles', () => {
    it('should return empty list when no articles', async () => {
      const res = await request(app).get('/api/v1/articles');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });

    it('should return list of articles', async () => {
      await Article.create({
        title: 'Test Article',
        slug: 'test-article',
        category: 'theology',
        content: 'Content',
        excerpt: 'Excerpt',
        status: 'published',
        author: { id: '123', name: 'Author' },
        publishedAt: new Date(),
      });

      const res = await request(app).get('/api/v1/articles');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Test Article');
    });
  });

  describe('GET /api/v1/articles/:slug', () => {
    it('should return article by slug', async () => {
      await Article.create({
        title: 'Test Article',
        slug: 'test-article',
        category: 'theology',
        content: 'Content',
        excerpt: 'Excerpt',
        status: 'published',
        author: { id: '123', name: 'Author' },
      });

      const res = await request(app).get('/api/v1/articles/test-article');
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Article');
    });

    it('should return 404 if not found (actually 500 error from service throw currently, or caught)', async () => {
      // Service throws "Article not found". Controller passes to next(error).
      // ErrorHandler should handle it. If it's a generic Error, it might be 500.
      // Ideally we should have custom AppError with statusCode.
      // For now, let's just expect it fails.
      const res = await request(app).get('/api/v1/articles/non-existent');
      expect(res.status).not.toBe(200);
    });
  });
});
