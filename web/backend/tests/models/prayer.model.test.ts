import { Prayer } from '../../src/models/mongodb/prayer.model';
import { mongoDb } from '../../src/config/database/mongodb';

const hasMongoDB = process.env.MONGODB_URI;

describe('Prayer Model', () => {
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
      await Prayer.deleteMany({});
    }
  });

  describe('Schema Validation', () => {
    it('should create a valid prayer with required fields', async () => {
      const prayerData = {
        title: 'Prayer Before the Blessed Sacrament',
        slug: 'prayer-before-blessed-sacrament',
        category: 'eucharistic',
        usage: ['adoration', 'before-mass'],
        text: 'O Sacrament Most Holy, O Sacrament Divine...',
      };

      const prayer = new Prayer(prayerData);
      const savedPrayer = await prayer.save();

      expect(savedPrayer._id).toBeDefined();
      expect(savedPrayer.title).toBe(prayerData.title);
      expect(savedPrayer.slug).toBe(prayerData.slug);
      expect(savedPrayer.category).toBe('eucharistic');
      expect(savedPrayer.isTraditional).toBe(true); // default value
      expect(savedPrayer.createdAt).toBeDefined();
      expect(savedPrayer.updatedAt).toBeDefined();
    });

    it('should fail validation when required fields are missing', async () => {
      const prayer = new Prayer({
        title: 'Test Prayer',
        // Missing required fields
      });

      await expect(prayer.save()).rejects.toThrow();
    });

    it('should enforce unique slug constraint', async () => {
      const slug = 'duplicate-prayer-slug';
      const prayer1 = new Prayer({
        title: 'First Prayer',
        slug,
        category: 'eucharistic',
        text: 'Prayer text 1',
      });

      const prayer2 = new Prayer({
        title: 'Second Prayer',
        slug,
        category: 'marian',
        text: 'Prayer text 2',
      });

      await prayer1.save();
      await expect(prayer2.save()).rejects.toThrow();
    });

    it('should validate category enum', async () => {
      const prayer = new Prayer({
        title: 'Test Prayer',
        slug: 'test-category',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: 'invalid-category' as any,
        text: 'Prayer text',
      });

      await expect(prayer.save()).rejects.toThrow();
    });

    it('should validate usage enum', async () => {
      const prayer = new Prayer({
        title: 'Test Prayer',
        slug: 'test-usage',
        category: 'traditional',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        usage: ['invalid-usage'] as any,
        text: 'Prayer text',
      });

      await expect(prayer.save()).rejects.toThrow();
    });
  });

  describe('Optional Fields', () => {
    it('should save prayer with Latin text', async () => {
      const prayer = new Prayer({
        title: 'Anima Christi',
        slug: 'anima-christi',
        category: 'eucharistic',
        text: 'Soul of Christ, sanctify me...',
        latinText: 'Anima Christi, sanctifica me...',
      });

      const savedPrayer = await prayer.save();
      expect(savedPrayer.latinText).toBe('Anima Christi, sanctifica me...');
    });

    it('should save prayer with translations', async () => {
      const prayer = new Prayer({
        title: 'Our Father',
        slug: 'our-father',
        category: 'traditional',
        text: 'Our Father, who art in heaven...',
        translations: [
          {
            language: 'es',
            text: 'Padre nuestro, que estás en el cielo...',
            source: 'Vatican Spanish Missal',
          },
          {
            language: 'fr',
            text: 'Notre Père, qui es aux cieux...',
          },
        ],
      });

      const savedPrayer = await prayer.save();
      expect(savedPrayer.translations).toHaveLength(2);
      expect(savedPrayer.translations?.[0].language).toBe('es');
      expect(savedPrayer.translations?.[1].language).toBe('fr');
    });

    it('should save prayer with author and source', async () => {
      const prayer = new Prayer({
        title: 'Prayer of St. Thomas Aquinas',
        slug: 'st-thomas-aquinas-prayer',
        category: 'eucharistic',
        text: 'O Godhead hid, devoutly I adore Thee...',
        author: 'St. Thomas Aquinas',
        source: 'Adoro Te Devote',
        historicalContext: 'Written in the 13th century',
      });

      const savedPrayer = await prayer.save();
      expect(savedPrayer.author).toBe('St. Thomas Aquinas');
      expect(savedPrayer.source).toBe('Adoro Te Devote');
      expect(savedPrayer.historicalContext).toBe('Written in the 13th century');
    });

    it('should save prayer with audio URL', async () => {
      const prayer = new Prayer({
        title: 'Test Prayer',
        slug: 'test-audio',
        category: 'traditional',
        text: 'Prayer text',
        audioUrl: 'https://example.com/prayer-audio.mp3',
      });

      const savedPrayer = await prayer.save();
      expect(savedPrayer.audioUrl).toBe('https://example.com/prayer-audio.mp3');
    });

    it('should save prayer with related prayers', async () => {
      const prayer1 = new Prayer({
        title: 'First Prayer',
        slug: 'first-prayer',
        category: 'traditional',
        text: 'Text 1',
      });
      const savedPrayer1 = await prayer1.save();

      const prayer2 = new Prayer({
        title: 'Second Prayer',
        slug: 'second-prayer',
        category: 'traditional',
        text: 'Text 2',
        relatedPrayers: [savedPrayer1._id],
      });
      const savedPrayer2 = await prayer2.save();

      expect(savedPrayer2.relatedPrayers).toHaveLength(1);
      expect(savedPrayer2.relatedPrayers?.[0]).toEqual(savedPrayer1._id);
    });
  });

  describe('Default Values', () => {
    it('should set default usage to daily', async () => {
      const prayer = new Prayer({
        title: 'Test Prayer',
        slug: 'test-default-usage',
        category: 'traditional',
        text: 'Prayer text',
      });

      const savedPrayer = await prayer.save();
      expect(savedPrayer.usage).toEqual(['daily']);
    });

    it('should set isTraditional to true by default', async () => {
      const prayer = new Prayer({
        title: 'Test Prayer',
        slug: 'test-default-traditional',
        category: 'traditional',
        text: 'Prayer text',
      });

      const savedPrayer = await prayer.save();
      expect(savedPrayer.isTraditional).toBe(true);
    });
  });

  describe('Indexes', () => {
    it('should have unique slug index', async () => {
      const indexes = await Prayer.collection.getIndexes();
      // Slug has unique constraint which creates an index
      expect(indexes.slug_1).toBeDefined();
      expect(indexes.slug_1[0][1]).toBe(1);
    });

    it('should have category index', async () => {
      const indexes = await Prayer.collection.getIndexes();
      expect(indexes).toHaveProperty('category_1');
    });

    it('should have usage index', async () => {
      const indexes = await Prayer.collection.getIndexes();
      expect(indexes).toHaveProperty('usage_1');
    });

    it('should have tags index', async () => {
      const indexes = await Prayer.collection.getIndexes();
      expect(indexes).toHaveProperty('tags_1');
    });

    it('should have isTraditional index', async () => {
      const indexes = await Prayer.collection.getIndexes();
      expect(indexes).toHaveProperty('isTraditional_1');
    });
  });
});
