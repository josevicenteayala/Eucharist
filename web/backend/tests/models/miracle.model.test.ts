import { Miracle } from '../../src/models/mongodb/miracle.model';
import { mongoDb } from '../../src/config/database/mongodb';

const hasMongoDB = process.env.MONGODB_URI;

describe('Miracle Model', () => {
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
      await Miracle.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create a valid miracle with required fields', async () => {
      const miracleData = {
        title: 'Miracle of Lanciano',
        slug: 'miracle-of-lanciano',
        location: {
          city: 'Lanciano',
          country: 'Italy',
          coordinates: {
            lat: 42.2317,
            lng: 14.3894,
          },
        },
        date: {
          year: 700,
        },
        summary: 'A miraculous transformation of bread and wine into flesh and blood',
        fullStory: '# The Miracle of Lanciano\n\nIn the 8th century...',
      };

      const miracle = new Miracle(miracleData);
      const savedMiracle = await miracle.save();

      expect(savedMiracle._id).toBeDefined();
      expect(savedMiracle.title).toBe(miracleData.title);
      expect(savedMiracle.slug).toBe(miracleData.slug);
      expect(savedMiracle.location.city).toBe('Lanciano');
      expect(savedMiracle.date.year).toBe(700);
      expect(savedMiracle.createdAt).toBeDefined();
      expect(savedMiracle.updatedAt).toBeDefined();
    });

    it('should fail validation when required fields are missing', async () => {
      const miracle = new Miracle({
        title: 'Test Miracle',
        // Missing required fields
      });

      await expect(miracle.save()).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      const slug = 'duplicate-miracle-slug';
      const miracle1 = new Miracle({
        title: 'First Miracle',
        slug,
        location: { city: 'Rome', country: 'Italy' },
        date: { year: 1200 },
        summary: 'Summary 1',
        fullStory: 'Story 1',
      });

      const miracle2 = new Miracle({
        title: 'Second Miracle',
        slug,
        location: { city: 'Paris', country: 'France' },
        date: { year: 1300 },
        summary: 'Summary 2',
        fullStory: 'Story 2',
      });

      await miracle1.save();
      await expect(miracle2.save()).rejects.toThrow();
    });

    it('should validate coordinates range', async () => {
      const miracle = new Miracle({
        title: 'Test Miracle',
        slug: 'test-coordinates',
        location: {
          city: 'Test',
          country: 'Test',
          coordinates: {
            lat: 100, // Invalid: > 90
            lng: 0,
          },
        },
        date: { year: 1500 },
        summary: 'Summary',
        fullStory: 'Story',
      });

      await expect(miracle.save()).rejects.toThrow();
    });
  });

  describe('Optional Fields', () => {
    it('should save miracle with scientific evidence', async () => {
      const miracle = new Miracle({
        title: 'Test Miracle',
        slug: 'test-scientific-evidence',
        location: { city: 'Test', country: 'Test' },
        date: { year: 1500 },
        summary: 'Summary',
        fullStory: 'Story',
        scientificEvidence: {
          tested: true,
          testingBody: 'University of Science',
          findings: 'Confirmed authentic',
          documentation: ['https://example.com/doc1.pdf'],
        },
      });

      const savedMiracle = await miracle.save();
      expect(savedMiracle.scientificEvidence?.tested).toBe(true);
      expect(savedMiracle.scientificEvidence?.testingBody).toBe('University of Science');
    });

    it('should save miracle with images', async () => {
      const miracle = new Miracle({
        title: 'Test Miracle',
        slug: 'test-images',
        location: { city: 'Test', country: 'Test' },
        date: { year: 1500 },
        summary: 'Summary',
        fullStory: 'Story',
        images: [
          {
            url: 'https://example.com/image1.jpg',
            caption: 'The miraculous host',
            credit: 'Vatican Archives',
          },
        ],
      });

      const savedMiracle = await miracle.save();
      expect(savedMiracle.images).toHaveLength(1);
      expect(savedMiracle.images?.[0].url).toBe('https://example.com/image1.jpg');
    });

    it('should save miracle with sources', async () => {
      const miracle = new Miracle({
        title: 'Test Miracle',
        slug: 'test-sources',
        location: { city: 'Test', country: 'Test' },
        date: { year: 1500 },
        summary: 'Summary',
        fullStory: 'Story',
        sources: [
          {
            title: 'Church Document',
            url: 'https://vatican.va/doc',
            type: 'church-document',
          },
          {
            title: 'Historical Book',
            type: 'book',
          },
        ],
      });

      const savedMiracle = await miracle.save();
      expect(savedMiracle.sources).toHaveLength(2);
      expect(savedMiracle.sources?.[0].type).toBe('church-document');
    });

    it('should save miracle with church approval', async () => {
      const miracle = new Miracle({
        title: 'Test Miracle',
        slug: 'test-approval',
        location: { city: 'Test', country: 'Test' },
        date: { year: 1500 },
        summary: 'Summary',
        fullStory: 'Story',
        churchApproval: {
          approved: true,
          approvedBy: 'Bishop Smith',
          approvalDate: new Date('2000-01-01'),
        },
      });

      const savedMiracle = await miracle.save();
      expect(savedMiracle.churchApproval?.approved).toBe(true);
      expect(savedMiracle.churchApproval?.approvedBy).toBe('Bishop Smith');
    });
  });

  describe('Indexes', () => {
    it('should have unique slug index', async () => {
      const indexes = await Miracle.collection.getIndexes();
      // Slug has unique constraint which creates an index
      expect(indexes.slug_1).toBeDefined();
      expect(indexes.slug_1[0][1]).toBe(1);
    });

    it('should have location.country index', async () => {
      const indexes = await Miracle.collection.getIndexes();
      expect(indexes).toHaveProperty('location.country_1');
    });

    it('should have date.year index', async () => {
      const indexes = await Miracle.collection.getIndexes();
      expect(indexes).toHaveProperty('date.year_1');
    });

    it('should have 2dsphere index on coordinates', async () => {
      const indexes = await Miracle.collection.getIndexes();
      expect(indexes).toHaveProperty('location.coordinates_2dsphere');
    });
  });
});
