import mongoose, { Schema, Document } from 'mongoose';

/**
 * Location information with coordinates
 */
export interface ILocation {
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Date information (may be approximate)
 */
export interface IMiracleDate {
  year: number;
  month?: number;
  approximateDate?: string;
}

/**
 * Scientific evidence information
 */
export interface IScientificEvidence {
  tested: boolean;
  testingBody?: string;
  findings?: string;
  documentation?: string[];
}

/**
 * Image information
 */
export interface IImage {
  url: string;
  caption?: string;
  credit?: string;
}

/**
 * Source reference
 */
export interface ISource {
  title: string;
  url?: string;
  type: 'book' | 'article' | 'video' | 'church-document';
}

/**
 * Church approval information
 */
export interface IChurchApproval {
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

/**
 * Eucharistic Miracle document interface
 */
export interface IMiracle extends Document {
  title: string;
  slug: string;
  location: ILocation;
  date: IMiracleDate;
  summary: string;
  fullStory: string;
  scientificEvidence?: IScientificEvidence;
  images?: IImage[];
  sources?: ISource[];
  churchApproval?: IChurchApproval;
  tags: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for Miracles collection
 */
const MiracleSchema = new Schema<IMiracle>(
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
    location: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type: Number,
          min: -90,
          max: 90,
        },
        lng: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },
    date: {
      year: {
        type: Number,
        required: true,
      },
      month: {
        type: Number,
        min: 1,
        max: 12,
      },
      approximateDate: String,
    },
    summary: {
      type: String,
      required: true,
      maxlength: 500,
    },
    fullStory: {
      type: String,
      required: true,
    },
    scientificEvidence: {
      tested: {
        type: Boolean,
        default: false,
      },
      testingBody: {
        type: String,
        trim: true,
      },
      findings: String,
      documentation: [String],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
          match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
        },
        caption: {
          type: String,
          trim: true,
        },
        credit: {
          type: String,
          trim: true,
        },
      },
    ],
    sources: [
      {
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
        },
        type: {
          type: String,
          enum: ['book', 'article', 'video', 'church-document'],
          required: true,
        },
      },
    ],
    churchApproval: {
      approved: {
        type: Boolean,
        default: false,
      },
      approvedBy: String,
      approvalDate: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    collection: 'miracles',
  }
);

// Indexes
MiracleSchema.index({ 'location.country': 1 });
MiracleSchema.index({ 'date.year': 1 });
MiracleSchema.index({ 'location.coordinates': '2dsphere' });
MiracleSchema.index(
  { title: 'text', summary: 'text', fullStory: 'text' },
  { weights: { title: 10, summary: 5, fullStory: 1 } }
);

export const Miracle = mongoose.model<IMiracle>('Miracle', MiracleSchema);
