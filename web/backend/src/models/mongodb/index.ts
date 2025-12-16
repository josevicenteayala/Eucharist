/**
 * MongoDB Models
 *
 * This module exports Mongoose models for MongoDB collections.
 * These models handle educational content, miracles, and prayers.
 */

export { Article, IArticle, IAuthor, ICoverImage, ISEO, ITheologicalReview } from './article.model';
export {
  Miracle,
  IMiracle,
  ILocation,
  IMiracleDate,
  IScientificEvidence,
  IImage,
  ISource,
  IChurchApproval,
} from './miracle.model';
export { Prayer, IPrayer, PrayerCategory, PrayerUsage, ITranslation } from './prayer.model';
