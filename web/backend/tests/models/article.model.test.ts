import { Article } from '../../src/models/mongodb/article.model';
import { mongoDb } from '../../src/config/database/mongodb';

const hasMongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/eucharist';

describe('Article Model', () => {
  if (!hasMongoDB) {
    it.skip('MongoDB tests require database configuration', () => {});
    return;
  }

  beforeAll(async () => {
    await mongoDb.connect();
  }, 10000);

  afterAll(async () => {
    await mongoDb.disconnect();
  }, 10000);

  afterEach(async () => {
    if (mongoDb.isConnectionActive()) {
      await Article.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create a valid article with required fields', async () => {
      const articleData = {
        title: 'Understanding the Real Presence',
        slug: 'understanding-the-real-presence',
        category: 'eucharist-basics',
        tags: ['real-presence', 'theology'],
        difficulty: 'beginner',
        author: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Fr. John Doe',
        },
        content: '# Introduction\n\nThe Real Presence is...',
        excerpt: 'An introduction to the Catholic doctrine of the Real Presence',
        status: 'draft',
      };

      const article = new Article(articleData);
      const savedArticle = await article.save();

      expect(savedArticle._id).toBeDefined();
      expect(savedArticle.title).toBe(articleData.title);
      expect(savedArticle.slug).toBe(articleData.slug);
      expect(savedArticle.version).toBe(1);
      expect(savedArticle.createdAt).toBeDefined();
      expect(savedArticle.updatedAt).toBeDefined();
    });

    it('should fail validation when required fields are missing', async () => {
      const article = new Article({
        title: 'Test Article',
        // Missing required fields
      });

      await expect(article.save()).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      const slug = 'duplicate-slug-test';
      const article1 = new Article({
        title: 'First Article',
        slug,
        category: 'eucharist-basics',
        author: { id: '123', name: 'Test' },
        content: 'Content 1',
        excerpt: 'Excerpt 1',
      });

      const article2 = new Article({
        title: 'Second Article',
        slug,
        category: 'mass-parts',
        author: { id: '456', name: 'Test' },
        content: 'Content 2',
        excerpt: 'Excerpt 2',
      });

      await article1.save();
      await expect(article2.save()).rejects.toThrow();
    });

    it('should validate category enum', async () => {
      const article = new Article({
        title: 'Test Article',
        slug: 'test-category',
        category: 'invalid-category',
        author: { id: '123', name: 'Test' },
        content: 'Content',
        excerpt: 'Excerpt',
      });

      await expect(article.save()).rejects.toThrow();
    });

    it('should validate status enum', async () => {
      const article = new Article({
        title: 'Test Article',
        slug: 'test-status',
        category: 'eucharist-basics',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: 'invalid-status' as any,
        author: { id: '123', name: 'Test' },
        content: 'Content',
        excerpt: 'Excerpt',
      });

      await expect(article.save()).rejects.toThrow();
    });

    it('should validate difficulty enum', async () => {
      const article = new Article({
        title: 'Test Article',
        slug: 'test-difficulty',
        category: 'eucharist-basics',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        difficulty: 'expert' as any,
        author: { id: '123', name: 'Test' },
        content: 'Content',
        excerpt: 'Excerpt',
      });

      await expect(article.save()).rejects.toThrow();
    });
  });

  describe('Optional Fields', () => {
    it('should save article with cover image', async () => {
      const article = new Article({
        title: 'Test Article',
        slug: 'test-cover-image',
        category: 'eucharist-basics',
        author: { id: '123', name: 'Test' },
        content: 'Content',
        excerpt: 'Excerpt',
        coverImage: {
          url: 'https://example.com/image.jpg',
          alt: 'Test image',
          caption: 'A beautiful image',
        },
      });

      const savedArticle = await article.save();
      expect(savedArticle.coverImage?.url).toBe('https://example.com/image.jpg');
      expect(savedArticle.coverImage?.alt).toBe('Test image');
    });

    it('should save article with theological review', async () => {
      const article = new Article({
        title: 'Test Article',
        slug: 'test-review',
        category: 'theology',
        author: { id: '123', name: 'Test' },
        content: 'Content',
        excerpt: 'Excerpt',
        theologicalReview: {
          reviewed: true,
          reviewedBy: 'Fr. Smith',
          reviewedAt: new Date(),
          notes: 'Approved',
        },
      });

      const savedArticle = await article.save();
      expect(savedArticle.theologicalReview?.reviewed).toBe(true);
      expect(savedArticle.theologicalReview?.reviewedBy).toBe('Fr. Smith');
    });

    it('should save article with SEO metadata', async () => {
      const article = new Article({
        title: 'Test Article',
        slug: 'test-seo',
        category: 'eucharist-basics',
        author: { id: '123', name: 'Test' },
        content: 'Content',
        excerpt: 'Excerpt',
        seo: {
          metaTitle: 'SEO Title',
          metaDescription: 'SEO Description',
          keywords: ['eucharist', 'catholic'],
        },
      });

      const savedArticle = await article.save();
      expect(savedArticle.seo?.metaTitle).toBe('SEO Title');
      expect(savedArticle.seo?.keywords).toEqual(['eucharist', 'catholic']);
    });
  });

  describe('Version Increment', () => {
    it('should increment version on update', async () => {
      const article = new Article({
        title: 'Test Article',
        slug: 'test-version',
        category: 'eucharist-basics',
        author: { id: '123', name: 'Test' },
        content: 'Content',
        excerpt: 'Excerpt',
      });

      const savedArticle = await article.save();
      expect(savedArticle.version).toBe(1);

      savedArticle.title = 'Updated Title';
      const updatedArticle = await savedArticle.save();
      expect(updatedArticle.version).toBe(2);
    });
  });

  describe('Indexes', () => {
    it('should have unique slug index', async () => {
      const indexes = await Article.collection.getIndexes();
      // Slug has unique constraint which creates an index
      expect(indexes.slug_1).toBeDefined();
      expect(indexes.slug_1[0][1]).toBe(1);
    });

    it('should have category and status compound index', async () => {
      const indexes = await Article.collection.getIndexes();
      expect(indexes).toHaveProperty('category_1_status_1');
    });

    it('should have tags index', async () => {
      const indexes = await Article.collection.getIndexes();
      expect(indexes).toHaveProperty('tags_1');
    });
  });
});
