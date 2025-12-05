-- Migration: 004_create_reflections_table
-- Description: Create reflections table for user reflections on gospel readings
-- Date: 2025-12-05
-- Author: Eucharist Platform Team
-- Depends on: 001_create_users_table, 003_create_gospel_readings_table

-- ============================================
-- REFLECTIONS TABLE
-- ============================================
-- Stores user reflections on gospel readings
-- Links to both users and gospel_readings tables

CREATE TABLE IF NOT EXISTS reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gospel_reading_id UUID REFERENCES gospel_readings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for reflections table
CREATE INDEX IF NOT EXISTS idx_reflections_gospel ON reflections(gospel_reading_id);
CREATE INDEX IF NOT EXISTS idx_reflections_user ON reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_status ON reflections(status);
CREATE INDEX IF NOT EXISTS idx_reflections_public ON reflections(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_reflections_published ON reflections(published_at) WHERE published_at IS NOT NULL;

-- Comment on table
COMMENT ON TABLE reflections IS 'User reflections and meditations on gospel readings';
COMMENT ON COLUMN reflections.id IS 'Unique identifier for the reflection';
COMMENT ON COLUMN reflections.gospel_reading_id IS 'Foreign key to the gospel reading';
COMMENT ON COLUMN reflections.user_id IS 'Foreign key to the author (null if deleted)';
COMMENT ON COLUMN reflections.title IS 'Title of the reflection';
COMMENT ON COLUMN reflections.content IS 'Full reflection content (supports markdown)';
COMMENT ON COLUMN reflections.is_public IS 'Whether the reflection is publicly visible';
COMMENT ON COLUMN reflections.status IS 'Publication status: draft, published, or archived';
COMMENT ON COLUMN reflections.published_at IS 'Timestamp when the reflection was published';
COMMENT ON COLUMN reflections.view_count IS 'Number of times the reflection has been viewed';
COMMENT ON COLUMN reflections.like_count IS 'Number of likes on the reflection';
