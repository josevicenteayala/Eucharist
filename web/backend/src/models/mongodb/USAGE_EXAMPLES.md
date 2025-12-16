# MongoDB Models - Usage Examples

This guide provides practical examples of using the MongoDB collections in the Eucharist Platform.

## Setup

```typescript
import { mongoDb } from '../config/database/mongodb';
import { Article, Miracle, Prayer } from './models/mongodb';

// Connect to MongoDB (usually done in app initialization)
await mongoDb.connect();
```

## Articles

### Creating an Article

```typescript
const article = new Article({
  title: 'Understanding Transubstantiation',
  slug: 'understanding-transubstantiation',
  category: 'theology',
  difficulty: 'intermediate',
  author: {
    id: '123e4567-e89b-12d3-a456-426614174000', // PostgreSQL user UUID
    name: 'Fr. John Smith',
    bio: 'Theology professor at Sacred Heart Seminary',
  },
  content: `
# Understanding Transubstantiation

Transubstantiation is the change of the whole substance of bread...

## Historical Development

The term was officially adopted at the Fourth Lateran Council in 1215...
  `,
  excerpt: 'An exploration of the Catholic doctrine of transubstantiation',
  tags: ['theology', 'eucharist', 'doctrine'],
  coverImage: {
    url: 'https://cdn.example.com/transubstantiation.jpg',
    alt: 'Eucharistic host and chalice',
    caption: 'The Real Presence of Christ',
  },
  readingTime: 8,
  status: 'draft',
  seo: {
    metaTitle: 'Understanding Transubstantiation | Catholic Theology',
    metaDescription: 'Learn about the Catholic doctrine of transubstantiation',
    keywords: ['transubstantiation', 'eucharist', 'catholic', 'theology'],
  },
});

await article.save();
```

### Querying Articles

```typescript
// Find published articles in a category
const articles = await Article.find({
  category: 'eucharist-basics',
  status: 'published',
})
  .sort({ publishedAt: -1 })
  .limit(10);

// Find articles by tag
const taggedArticles = await Article.find({
  tags: 'real-presence',
  status: 'published',
});

// Find article by slug
const article = await Article.findOne({ slug: 'understanding-real-presence' });

// Search with pagination
const page = 1;
const limit = 20;
const skip = (page - 1) * limit;

const results = await Article.find({ status: 'published' })
  .sort({ publishedAt: -1 })
  .skip(skip)
  .limit(limit);

const total = await Article.countDocuments({ status: 'published' });
```

### Updating an Article

```typescript
// Update and increment version
const article = await Article.findOne({ slug: 'my-article' });
article.content = 'Updated content...';
article.status = 'review';
await article.save(); // Version automatically incremented

// Theological review approval
article.theologicalReview = {
  reviewed: true,
  reviewedBy: 'Fr. Thomas Aquinas',
  reviewedAt: new Date(),
  notes: 'Doctrinally sound. Approved for publication.',
};
article.status = 'published';
article.publishedAt = new Date();
await article.save();
```

## Miracles

### Creating a Miracle

```typescript
const miracle = new Miracle({
  title: 'The Miracle of Lanciano',
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
    approximateDate: 'Circa 700 AD',
  },
  summary: 'A miraculous transformation of bread and wine into flesh and blood',
  fullStory: `
# The Miracle of Lanciano

In the 8th century, a Basilian monk was celebrating Mass...

## Scientific Investigation

In 1970-1971, Professor Odoardo Linoli conducted scientific tests...
  `,
  scientificEvidence: {
    tested: true,
    testingBody: 'University of Siena, Professor Odoardo Linoli',
    findings: 'The flesh is real human cardiac tissue. The blood is real human blood, type AB.',
    documentation: [
      'https://example.com/linoli-report-1971.pdf',
      'https://example.com/who-study-1981.pdf',
    ],
  },
  images: [
    {
      url: 'https://cdn.example.com/lanciano-host.jpg',
      caption: 'The miraculous host preserved in Lanciano',
      credit: 'Sanctuary of the Eucharistic Miracle',
    },
  ],
  sources: [
    {
      title: 'The Eucharistic Miracles of the World',
      url: 'https://www.miracolieucaristici.org',
      type: 'church-document',
    },
    {
      title: 'Scientific Analysis of the Miracle of Lanciano',
      type: 'article',
    },
  ],
  churchApproval: {
    approved: true,
    approvedBy: 'Archbishop Bruno Forte',
    approvalDate: new Date('1574-01-01'),
  },
  tags: ['italy', 'scientific', 'medieval'],
  publishedAt: new Date(),
});

await miracle.save();
```

### Querying Miracles

```typescript
// Find miracles by country
const italianMiracles = await Miracle.find({ 'location.country': 'Italy' });

// Find miracles by century
const medievalMiracles = await Miracle.find({
  'date.year': { $gte: 1000, $lt: 1500 },
});

// Find miracles with scientific evidence
const scientificMiracles = await Miracle.find({
  'scientificEvidence.tested': true,
});

// Geospatial query - find miracles near a location
const nearbyMiracles = await Miracle.find({
  'location.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [14.3894, 42.2317], // [longitude, latitude]
      },
      $maxDistance: 100000, // 100km in meters
    },
  },
});
```

### Map View Query

```typescript
// Get all miracles with coordinates for map display
const miraclesForMap = await Miracle.find(
  { 'location.coordinates': { $exists: true } },
  {
    title: 1,
    slug: 1,
    'location.city': 1,
    'location.country': 1,
    'location.coordinates': 1,
    summary: 1,
  }
);
```

## Prayers

### Creating a Prayer

```typescript
const prayer = new Prayer({
  title: 'Anima Christi',
  slug: 'anima-christi',
  category: 'eucharistic',
  usage: ['after-mass', 'adoration'],
  text: `Soul of Christ, sanctify me.
Body of Christ, save me.
Blood of Christ, inebriate me.
Water from the side of Christ, wash me.
Passion of Christ, strengthen me.
O good Jesus, hear me.
Within Thy wounds hide me.
Suffer me not to be separated from Thee.
From the malicious enemy defend me.
In the hour of my death call me,
And bid me come unto Thee,
That with Thy saints I may praise Thee
Forever and ever. Amen.`,
  latinText: `Anima Christi, sanctifica me.
Corpus Christi, salva me.
Sanguis Christi, inebria me.
Aqua lateris Christi, lava me.
Passio Christi, conforta me.
O bone Jesu, exaudi me.
Intra tua vulnera absconde me.
Ne permittas me separari a te.
Ab hoste maligno defende me.
In hora mortis meae voca me.
Et iube me venire ad te,
Ut cum Sanctis tuis laudem te
In saecula saeculorum. Amen.`,
  translations: [
    {
      language: 'es',
      text: 'Alma de Cristo, santifícame...',
      source: 'Spanish Roman Missal',
    },
  ],
  author: 'Attributed to Pope John XXII',
  source: 'Medieval prayer, 14th century',
  historicalContext: 'One of the most beloved prayers after Holy Communion',
  tags: ['post-communion', 'traditional', 'saints'],
  audioUrl: 'https://cdn.example.com/prayers/anima-christi.mp3',
  isTraditional: true,
  publishedAt: new Date(),
});

await prayer.save();
```

### Querying Prayers

```typescript
// Find prayers by category
const eucharisticPrayers = await Prayer.find({ category: 'eucharistic' });

// Find prayers by usage
const adorationPrayers = await Prayer.find({ usage: 'adoration' });

// Find traditional prayers with Latin text
const latinPrayers = await Prayer.find({
  isTraditional: true,
  latinText: { $exists: true },
});

// Find prayers with audio
const prayersWithAudio = await Prayer.find({
  audioUrl: { $exists: true },
});

// Find related prayers
const prayer = await Prayer.findOne({ slug: 'anima-christi' }).populate('relatedPrayers');
```

### Linking Related Prayers

```typescript
const ourFather = await Prayer.findOne({ slug: 'our-father' });
const hailMary = await Prayer.findOne({ slug: 'hail-mary' });
const gloryBe = await Prayer.findOne({ slug: 'glory-be' });

// Link prayers together
ourFather.relatedPrayers = [hailMary._id, gloryBe._id];
await ourFather.save();
```

## Advanced Patterns

### Transaction-like Operations

```typescript
// Create article with error handling
try {
  const article = new Article({
    title: 'New Article',
    slug: 'new-article',
    // ... other fields
  });

  await article.save();

  // Log creation in your application
  console.log('Article created:', article._id);
} catch (error) {
  if (error.code === 11000) {
    // Duplicate slug
    throw new Error('An article with this slug already exists');
  }
  throw error;
}
```

### Aggregation Queries

```typescript
// Count articles by category
const categoryCounts = await Article.aggregate([
  { $match: { status: 'published' } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);

// Find most popular tags
const popularTags = await Article.aggregate([
  { $match: { status: 'published' } },
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
]);

// Miracles by century
const miraclesByCentury = await Miracle.aggregate([
  {
    $project: {
      century: { $floor: { $divide: ['$date.year', 100] } },
    },
  },
  { $group: { _id: '$century', count: { $sum: 1 } } },
  { $sort: { _id: 1 } },
]);
```

### Text Search (after creating text index)

```typescript
// Create text index (run once)
await Article.collection.createIndex({ title: 'text', content: 'text', excerpt: 'text' });

// Search articles
const searchResults = await Article.find(
  { $text: { $search: 'transubstantiation eucharist' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
```

## Error Handling

```typescript
import { Article } from './models/mongodb';
import { Error as MongooseError } from 'mongoose';

try {
  const article = await Article.create({
    // ... data
  });
} catch (error) {
  if (error instanceof MongooseError.ValidationError) {
    // Handle validation errors
    console.error('Validation failed:', error.errors);
  } else if (error.code === 11000) {
    // Handle duplicate key error
    console.error('Duplicate slug');
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

## Best Practices

1. **Always validate slugs** - Ensure slugs are URL-friendly before saving
2. **Use lean queries** - Add `.lean()` for read-only operations to improve performance
3. **Index strategically** - Indexes are already defined, but monitor query patterns
4. **Paginate results** - Always paginate for large result sets
5. **Handle errors** - Wrap database operations in try-catch blocks
6. **Reference user IDs** - Store PostgreSQL user UUIDs in `author.id` fields
7. **Theological review** - Always require review for published theological content
8. **Version control** - Let the model auto-increment versions on updates

## Performance Tips

```typescript
// Use lean() for faster queries when you don't need Mongoose documents
const articles = await Article.find({ status: 'published' }).lean().limit(20);

// Select only needed fields
const articlesMinimal = await Article.find({ status: 'published' })
  .select('title slug excerpt coverImage')
  .limit(20);

// Use explain() to analyze query performance
const explanation = await Article.find({ category: 'theology' }).explain('executionStats');
```

## See Also

- [MongoDB Models README](./README.md) - Complete documentation
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [MongoDB Query Documentation](https://docs.mongodb.com/manual/tutorial/query-documents/)
