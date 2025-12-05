-- Migration: 002_create_user_profiles_table
-- Description: Create user_profiles table for extended user information
-- Date: 2025-12-05
-- Author: Eucharist Platform Team
-- Depends on: 001_create_users_table

-- ============================================
-- USER PROFILES TABLE
-- ============================================
-- Stores extended profile information and preferences
-- One-to-one relationship with users table

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    location VARCHAR(100),
    interests TEXT[],
    prayer_streak INTEGER DEFAULT 0,
    last_active_date DATE,
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{
        "email": true,
        "push": true,
        "daily_gospel": true,
        "community": true
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching by location
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);

-- Index for activity tracking
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active ON user_profiles(last_active_date);

-- Comment on table
COMMENT ON TABLE user_profiles IS 'Extended user profile information and preferences';
COMMENT ON COLUMN user_profiles.user_id IS 'Foreign key to users table (one-to-one)';
COMMENT ON COLUMN user_profiles.bio IS 'User biography or description';
COMMENT ON COLUMN user_profiles.location IS 'User location (city, country)';
COMMENT ON COLUMN user_profiles.interests IS 'Array of user interests';
COMMENT ON COLUMN user_profiles.prayer_streak IS 'Current consecutive prayer days streak';
COMMENT ON COLUMN user_profiles.last_active_date IS 'Date of last user activity';
COMMENT ON COLUMN user_profiles.preferences IS 'User preferences as JSON';
COMMENT ON COLUMN user_profiles.notification_settings IS 'Notification preferences as JSON';
