# MongoDB Models

This directory contains Mongoose schema models for MongoDB collections used in the Eucharist Platform.

## Collections

### Articles Collection

Educational content about the Eucharist, Mass, Catholic theology, and spirituality.

**Model**: `article.model.ts`  
**Collection Name**: `articles`

**Key Features**:

- Flexible content with Markdown support
- Theological review workflow
- SEO metadata
- Version tracking
- Related articles linking

**Indexes**:

- `slug` (unique)
- `category + status` (compound)
- `tags`
- `publishedAt` (descending)
- `author.id`

**Usage**:

```typescript
import { Article } from './models/mongodb';

const article = new Article({
  title: 'Understanding the Real Presence',
  slug: 'understanding-real-presence',
  category: 'eucharist-basics',
  author: { id: userId, name: 'Fr. John' },
  content: 'Markdown content here...',
  excerpt: 'Brief summary...',
});

await article.save();
```

### Miracles Collection

Eucharistic miracles from around the world with historical and scientific documentation.

**Model**: `miracle.model.ts`  
**Collection Name**: `miracles`

**Key Features**:

- Location with GPS coordinates
- Scientific evidence documentation
- Church approval tracking
- Image galleries
- Source references

**Indexes**:

- `slug` (unique)
- `location.country`
- `date.year`
- `location.coordinates` (2dsphere for geospatial queries)

**Usage**:

```typescript
import { Miracle } from './models/mongodb';

const miracle = new Miracle({
  title: 'Miracle of Lanciano',
  slug: 'miracle-of-lanciano',
  location: {
    city: 'Lanciano',
    country: 'Italy',
    coordinates: { lat: 42.2317, lng: 14.3894 },
  },
  date: { year: 700 },
  summary: 'Brief summary...',
  fullStory: 'Complete story in Markdown...',
});

await miracle.save();
```

### Prayers Collection

Traditional Catholic prayers related to the Eucharist and devotional life.

**Model**: `prayer.model.ts`  
**Collection Name**: `prayers`

**Key Features**:

- Multiple language translations
- Latin text support
- Categorization by type and usage
- Audio pronunciation
- Related prayers linking

**Indexes**:

- `slug` (unique)
- `category`
- `usage`
- `tags`
- `isTraditional`

**Usage**:

```typescript
import { Prayer } from './models/mongodb';

const prayer = new Prayer({
  title: 'Prayer Before the Blessed Sacrament',
  slug: 'prayer-before-blessed-sacrament',
  category: 'eucharistic',
  usage: ['adoration', 'before-mass'],
  text: 'O Sacrament Most Holy...',
  latinText: 'O Sacramentum...',
});

await prayer.save();
```

## Common Patterns

### Theological Review

Articles support a theological review workflow:

```typescript
article.theologicalReview = {
  reviewed: true,
  reviewedBy: 'Fr. Smith',
  reviewedAt: new Date(),
  notes: 'Approved for publication',
};
```

### SEO Optimization

Articles include SEO metadata:

```typescript
article.seo = {
  metaTitle: 'SEO-optimized title',
  metaDescription: 'Description for search engines',
  keywords: ['eucharist', 'catholic', 'theology'],
};
```

### Geospatial Queries

Miracles support location-based queries:

```typescript
// Find miracles within 100km of a point
const nearby = await Miracle.find({
  'location.coordinates': {
    $near: {
      $geometry: { type: 'Point', coordinates: [lng, lat] },
      $maxDistance: 100000, // meters
    },
  },
});
```

## Testing

All models have comprehensive test coverage in `tests/models/`:

- Schema validation
- Unique constraints
- Enum validation
- Optional fields
- Index verification

Run tests:

```bash
npm test -- tests/models/
```

**Note**: Tests require MongoDB connection (configured via `MONGODB_URI` environment variable).

## Database Design Principles

1. **Flexible Schemas**: MongoDB is used for content with varying structures
2. **Rich Text**: All content fields support Markdown
3. **Versioning**: Articles track version numbers for content history
4. **Indexes**: Strategic indexes for common query patterns
5. **Validation**: Mongoose validation ensures data integrity
6. **Timestamps**: All documents automatically track `createdAt` and `updatedAt`

## Relationship with PostgreSQL

**Important**: User data (authentication, profiles, progress) is stored in PostgreSQL, not MongoDB. MongoDB collections reference PostgreSQL users by UUID in `author.id` fields but do not establish foreign key constraints.

See `src/database/README.md` for PostgreSQL schema documentation.

## Future Enhancements

Planned additions:

- Full-text search indexes
- Content versioning history
- Multi-language content variants
- Media attachments handling
- Content recommendation algorithms

## References

- Architecture documentation: `docs/sdlc/SOFTWARE_ARCHITECT.md`
- API specifications: `docs/sdlc/SOFTWARE_ARCHITECT.md#api-design`
- Database strategy: `docs/architecture/adr/ADR-003-postgresql-mongodb-hybrid.md`
