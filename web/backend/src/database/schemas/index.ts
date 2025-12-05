/**
 * PostgreSQL Schema Type Definitions
 *
 * These types represent the database schema for the Eucharist Platform.
 * They provide type safety when working with database operations.
 */

// ============================================
// Enums
// ============================================

/**
 * User roles in the system
 */
export type UserRole = 'user' | 'admin' | 'moderator' | 'contributor';

/**
 * Liturgical year cycle (three-year cycle)
 */
export type LiturgicalYear = 'A' | 'B' | 'C';

/**
 * Reflection publication status
 */
export type ReflectionStatus = 'draft' | 'published' | 'archived';

// ============================================
// Users Table
// ============================================

/**
 * User entity - core authentication and account information
 */
export interface User {
  id: string; // UUID
  email: string;
  password_hash: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  email_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
}

/**
 * Input for creating a new user
 */
export interface CreateUserInput {
  email: string;
  password_hash?: string;
  display_name?: string;
  avatar_url?: string;
  role?: UserRole;
}

/**
 * Input for updating a user
 */
export interface UpdateUserInput {
  email?: string;
  password_hash?: string;
  display_name?: string;
  avatar_url?: string;
  role?: UserRole;
  email_verified?: boolean;
  is_active?: boolean;
  last_login_at?: Date;
}

// ============================================
// User Profiles Table
// ============================================

/**
 * Notification settings structure
 */
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  daily_gospel: boolean;
  community: boolean;
}

/**
 * User preferences structure (extensible)
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  [key: string]: unknown;
}

/**
 * User profile entity - extended user information
 */
export interface UserProfile {
  user_id: string; // UUID, foreign key to users.id
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  prayer_streak: number;
  last_active_date: Date | null;
  preferences: UserPreferences;
  notification_settings: NotificationSettings;
  created_at: Date;
  updated_at: Date;
}

/**
 * Input for creating a user profile
 */
export interface CreateUserProfileInput {
  user_id: string;
  bio?: string;
  location?: string;
  interests?: string[];
  preferences?: UserPreferences;
  notification_settings?: Partial<NotificationSettings>;
}

/**
 * Input for updating a user profile
 */
export interface UpdateUserProfileInput {
  bio?: string;
  location?: string;
  interests?: string[];
  prayer_streak?: number;
  last_active_date?: Date;
  preferences?: UserPreferences;
  notification_settings?: Partial<NotificationSettings>;
}

// ============================================
// Gospel Readings Table
// ============================================

/**
 * Gospel reading entity - daily liturgical readings
 */
export interface GospelReading {
  id: string; // UUID
  date: Date;
  liturgical_season: string;
  liturgical_year: LiturgicalYear | null;
  feast_day: string | null;
  first_reading: string;
  first_reading_citation: string;
  responsorial_psalm: string;
  psalm_citation: string;
  second_reading: string | null;
  second_reading_citation: string | null;
  gospel: string;
  gospel_citation: string;
  gospel_acclamation: string | null;
  audio_url: string | null;
  source: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Input for creating a gospel reading
 */
export interface CreateGospelReadingInput {
  date: Date;
  liturgical_season: string;
  liturgical_year?: LiturgicalYear;
  feast_day?: string;
  first_reading: string;
  first_reading_citation: string;
  responsorial_psalm: string;
  psalm_citation: string;
  second_reading?: string;
  second_reading_citation?: string;
  gospel: string;
  gospel_citation: string;
  gospel_acclamation?: string;
  audio_url?: string;
  source?: string;
}

/**
 * Input for updating a gospel reading
 */
export interface UpdateGospelReadingInput {
  liturgical_season?: string;
  liturgical_year?: LiturgicalYear;
  feast_day?: string;
  first_reading?: string;
  first_reading_citation?: string;
  responsorial_psalm?: string;
  psalm_citation?: string;
  second_reading?: string;
  second_reading_citation?: string;
  gospel?: string;
  gospel_citation?: string;
  gospel_acclamation?: string;
  audio_url?: string;
  source?: string;
}

// ============================================
// Reflections Table
// ============================================

/**
 * Reflection entity - user reflections on gospel readings
 */
export interface Reflection {
  id: string; // UUID
  gospel_reading_id: string | null; // UUID, foreign key to gospel_readings.id
  user_id: string | null; // UUID, foreign key to users.id (null if user deleted)
  title: string;
  content: string;
  is_public: boolean;
  status: ReflectionStatus;
  published_at: Date | null;
  view_count: number;
  like_count: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Input for creating a reflection
 */
export interface CreateReflectionInput {
  gospel_reading_id?: string;
  user_id: string;
  title: string;
  content: string;
  is_public?: boolean;
  status?: ReflectionStatus;
}

/**
 * Input for updating a reflection
 */
export interface UpdateReflectionInput {
  title?: string;
  content?: string;
  is_public?: boolean;
  status?: ReflectionStatus;
  published_at?: Date;
}

// ============================================
// Combined/Joined Types
// ============================================

/**
 * User with their profile
 */
export interface UserWithProfile extends User {
  profile: UserProfile | null;
}

/**
 * Reflection with author and gospel reading info
 */
export interface ReflectionWithDetails extends Reflection {
  author: Pick<User, 'id' | 'display_name' | 'avatar_url'> | null;
  gospel_reading: Pick<GospelReading, 'id' | 'date' | 'gospel_citation'> | null;
}
