/**
 * Database Schema Type Tests
 *
 * Tests to verify the schema type definitions are properly exported
 * and usable in the application.
 */

import {
  User,
  UserProfile,
  GospelReading,
  Reflection,
  CreateUserInput,
  UpdateUserInput,
  CreateGospelReadingInput,
  CreateReflectionInput,
  UserRole,
  LiturgicalYear,
  ReflectionStatus,
  NotificationSettings,
  UserPreferences,
  UserWithProfile,
  ReflectionWithDetails,
} from '../src/database';

describe('Database Schema Types', () => {
  describe('User Types', () => {
    it('should define User interface correctly', () => {
      const user: User = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        display_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        role: 'user',
        email_verified: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
      };

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
    });

    it('should define CreateUserInput correctly', () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        password_hash: 'hashed_password',
        display_name: 'Test User',
      };

      expect(input.email).toBeDefined();
    });

    it('should define UpdateUserInput correctly', () => {
      const input: UpdateUserInput = {
        display_name: 'Updated Name',
        email_verified: true,
      };

      expect(input.display_name).toBe('Updated Name');
    });

    it('should define UserRole type correctly', () => {
      const roles: UserRole[] = ['user', 'admin', 'moderator', 'contributor'];
      expect(roles).toHaveLength(4);
    });
  });

  describe('UserProfile Types', () => {
    it('should define UserProfile interface correctly', () => {
      const profile: UserProfile = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        bio: 'Test bio',
        location: 'Test City',
        interests: ['faith', 'prayer'],
        prayer_streak: 5,
        last_active_date: new Date(),
        preferences: { theme: 'dark' },
        notification_settings: {
          email: true,
          push: true,
          daily_gospel: true,
          community: true,
        },
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(profile.user_id).toBeDefined();
      expect(profile.interests).toContain('faith');
    });

    it('should define NotificationSettings correctly', () => {
      const settings: NotificationSettings = {
        email: true,
        push: false,
        daily_gospel: true,
        community: false,
      };

      expect(settings.email).toBe(true);
      expect(settings.push).toBe(false);
    });

    it('should define UserPreferences correctly', () => {
      const prefs: UserPreferences = {
        theme: 'light',
        language: 'en',
        timezone: 'America/New_York',
        customSetting: 'custom value',
      };

      expect(prefs.theme).toBe('light');
    });
  });

  describe('GospelReading Types', () => {
    it('should define GospelReading interface correctly', () => {
      const reading: GospelReading = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        date: new Date(),
        liturgical_season: 'Ordinary Time',
        liturgical_year: 'A',
        feast_day: null,
        first_reading: 'Genesis 1:1-5',
        first_reading_citation: 'Gen 1:1-5',
        responsorial_psalm: 'Psalm 23',
        psalm_citation: 'Ps 23',
        second_reading: null,
        second_reading_citation: null,
        gospel: 'John 1:1-14',
        gospel_citation: 'Jn 1:1-14',
        gospel_acclamation: 'Alleluia',
        audio_url: null,
        source: 'USCCB',
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(reading.liturgical_season).toBe('Ordinary Time');
      expect(reading.liturgical_year).toBe('A');
    });

    it('should define LiturgicalYear type correctly', () => {
      const years: LiturgicalYear[] = ['A', 'B', 'C'];
      expect(years).toHaveLength(3);
    });

    it('should define CreateGospelReadingInput correctly', () => {
      const input: CreateGospelReadingInput = {
        date: new Date(),
        liturgical_season: 'Advent',
        first_reading: 'Isaiah 1:1-5',
        first_reading_citation: 'Is 1:1-5',
        responsorial_psalm: 'Psalm 24',
        psalm_citation: 'Ps 24',
        gospel: 'Luke 1:1-10',
        gospel_citation: 'Lk 1:1-10',
      };

      expect(input.liturgical_season).toBe('Advent');
    });
  });

  describe('Reflection Types', () => {
    it('should define Reflection interface correctly', () => {
      const reflection: Reflection = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        gospel_reading_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        title: 'My Reflection',
        content: 'This is my reflection content...',
        is_public: false,
        status: 'draft',
        published_at: null,
        view_count: 0,
        like_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(reflection.title).toBe('My Reflection');
      expect(reflection.status).toBe('draft');
    });

    it('should define ReflectionStatus type correctly', () => {
      const statuses: ReflectionStatus[] = ['draft', 'published', 'archived'];
      expect(statuses).toHaveLength(3);
    });

    it('should define CreateReflectionInput correctly', () => {
      const input: CreateReflectionInput = {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'New Reflection',
        content: 'Content here...',
        is_public: true,
        status: 'published',
      };

      expect(input.title).toBe('New Reflection');
    });
  });

  describe('Combined Types', () => {
    it('should define UserWithProfile correctly', () => {
      const userWithProfile: UserWithProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        password_hash: 'hashed',
        display_name: 'Test User',
        avatar_url: null,
        role: 'user',
        email_verified: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        last_login_at: null,
        profile: {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          bio: 'Bio here',
          location: 'City',
          interests: ['prayer'],
          prayer_streak: 10,
          last_active_date: new Date(),
          preferences: {},
          notification_settings: {
            email: true,
            push: true,
            daily_gospel: true,
            community: true,
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
      };

      expect(userWithProfile.profile?.prayer_streak).toBe(10);
    });

    it('should define ReflectionWithDetails correctly', () => {
      const reflectionDetails: ReflectionWithDetails = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        gospel_reading_id: '123e4567-e89b-12d3-a456-426614174001',
        user_id: '123e4567-e89b-12d3-a456-426614174002',
        title: 'Reflection Title',
        content: 'Content',
        is_public: true,
        status: 'published',
        published_at: new Date(),
        view_count: 100,
        like_count: 50,
        created_at: new Date(),
        updated_at: new Date(),
        author: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          display_name: 'Author Name',
          avatar_url: null,
        },
        gospel_reading: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          date: new Date(),
          gospel_citation: 'Jn 1:1',
        },
      };

      expect(reflectionDetails.author?.display_name).toBe('Author Name');
      expect(reflectionDetails.gospel_reading?.gospel_citation).toBe('Jn 1:1');
    });
  });
});
