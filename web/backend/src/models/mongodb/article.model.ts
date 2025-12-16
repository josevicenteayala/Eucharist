import mongoose, { Schema, Document } from 'mongoose';

/**
 * Theological review metadata
 */
export interface ITheologicalReview {
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
}

/**
 * Author information
 */
export interface IAuthor {
  id: string; // PostgreSQL user UUID
  name: string;
  bio?: string;
}

/**
 * Cover image information
 */
export interface ICoverImage {
  url: string;
  alt: string;
  caption?: string;
}

/**
 * SEO metadata
 */
export interface ISEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

/**
 * Article document interface
 */
export interface IArticle extends Document {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: IAuthor;
  content: string;
  excerpt: string;
  coverImage?: ICoverImage;
  readingTime?: number;
  status: 'draft' | 'review' | 'published';
  theologicalReview?: ITheologicalReview;
  seo?: ISEO;
  relatedArticles?: mongoose.Types.ObjectId[];
  publishedAt?: Date;
  version: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for Articles collection
 */
const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['eucharist-basics', 'mass-parts', 'history', 'theology', 'spirituality', 'practical'],
    },
    tags: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    author: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      bio: {
        type: String,
        trim: true,
      },
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 500,
    },
    coverImage: {
      url: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
      },
      alt: {
        type: String,
        trim: true,
      },
      caption: {
        type: String,
        trim: true,
      },
    },
    readingTime: {
      type: Number,
      min: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published'],
      default: 'draft',
    },
    theologicalReview: {
      reviewed: {
        type: Boolean,
        default: false,
      },
      reviewedBy: String,
      reviewedAt: Date,
      notes: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    relatedArticles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    publishedAt: Date,
    version: {
      type: Number,
      default: 1,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'articles',
  }
);

// Indexes
ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ 'author.id': 1 });
ArticleSchema.index(
  { title: 'text', excerpt: 'text', content: 'text' },
  { weights: { title: 10, excerpt: 5, content: 1 } }
);

// Pre-save middleware to update version
ArticleSchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  next();
});

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
