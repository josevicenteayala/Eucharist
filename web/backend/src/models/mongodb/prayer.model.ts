import mongoose, { Schema, Document } from 'mongoose';

/**
 * Prayer category types
 */
export type PrayerCategory =
  | 'eucharistic'
  | 'marian'
  | 'traditional'
  | 'liturgical'
  | 'devotional'
  | 'saints';

/**
 * Prayer usage context
 */
export type PrayerUsage = 'before-mass' | 'after-mass' | 'adoration' | 'daily' | 'special-occasion';

/**
 * Translation information
 */
export interface ITranslation {
  language: string;
  text: string;
  source?: string;
}

/**
 * Prayer document interface
 */
export interface IPrayer extends Document {
  title: string;
  slug: string;
  category: PrayerCategory;
  usage: PrayerUsage[];
  text: string;
  latinText?: string;
  translations?: ITranslation[];
  author?: string;
  source?: string;
  historicalContext?: string;
  tags: string[];
  audioUrl?: string;
  relatedPrayers?: mongoose.Types.ObjectId[];
  isTraditional: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for Prayers collection
 */
const PrayerSchema = new Schema<IPrayer>(
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
      enum: ['eucharistic', 'marian', 'traditional', 'liturgical', 'devotional', 'saints'],
    },
    usage: {
      type: [String],
      enum: ['before-mass', 'after-mass', 'adoration', 'daily', 'special-occasion'],
      default: ['daily'],
    },
    text: {
      type: String,
      required: true,
    },
    latinText: {
      type: String,
    },
    translations: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        source: {
          type: String,
          trim: true,
        },
        language: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    author: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    historicalContext: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    audioUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    relatedPrayers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Prayer',
      },
    ],
    isTraditional: {
      type: Boolean,
      default: true,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    collection: 'prayers',
  }
);

// Indexes
PrayerSchema.index({ category: 1 });
PrayerSchema.index({ usage: 1 });
PrayerSchema.index({ tags: 1 });
PrayerSchema.index({ isTraditional: 1 });
PrayerSchema.index({ title: 'text', text: 'text' }, { weights: { title: 10, text: 5 } });

export const Prayer = mongoose.model<IPrayer>('Prayer', PrayerSchema);
