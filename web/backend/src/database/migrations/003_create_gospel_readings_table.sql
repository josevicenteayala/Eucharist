-- Migration: 003_create_gospel_readings_table
-- Description: Create gospel_readings table for daily liturgical readings
-- Date: 2025-12-05
-- Author: Eucharist Platform Team

-- ============================================
-- GOSPEL READINGS TABLE
-- ============================================
-- Stores daily gospel and liturgical readings
-- Each date has one set of readings based on the liturgical calendar

CREATE TABLE IF NOT EXISTS gospel_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    liturgical_season VARCHAR(50) NOT NULL,
    liturgical_year CHAR(1) CHECK (liturgical_year IN ('A', 'B', 'C')),
    feast_day VARCHAR(100),
    first_reading TEXT NOT NULL,
    first_reading_citation VARCHAR(100) NOT NULL,
    responsorial_psalm TEXT NOT NULL,
    psalm_citation VARCHAR(100) NOT NULL,
    second_reading TEXT,
    second_reading_citation VARCHAR(100),
    gospel TEXT NOT NULL,
    gospel_citation VARCHAR(100) NOT NULL,
    gospel_acclamation TEXT,
    audio_url TEXT,
    source VARCHAR(50) DEFAULT 'USCCB',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for gospel_readings table
CREATE INDEX IF NOT EXISTS idx_gospel_readings_season ON gospel_readings(liturgical_season);
CREATE INDEX IF NOT EXISTS idx_gospel_readings_year ON gospel_readings(liturgical_year);
CREATE INDEX IF NOT EXISTS idx_gospel_readings_feast ON gospel_readings(feast_day) WHERE feast_day IS NOT NULL;

-- Comment on table
COMMENT ON TABLE gospel_readings IS 'Daily gospel and liturgical readings from the Catholic lectionary';
COMMENT ON COLUMN gospel_readings.id IS 'Unique identifier for the reading';
COMMENT ON COLUMN gospel_readings.date IS 'Date of the reading (unique)';
COMMENT ON COLUMN gospel_readings.liturgical_season IS 'Liturgical season (e.g., Advent, Lent, Ordinary Time)';
COMMENT ON COLUMN gospel_readings.liturgical_year IS 'Liturgical year cycle (A, B, or C)';
COMMENT ON COLUMN gospel_readings.feast_day IS 'Name of feast day if applicable';
COMMENT ON COLUMN gospel_readings.first_reading IS 'First reading text (usually Old Testament)';
COMMENT ON COLUMN gospel_readings.first_reading_citation IS 'Biblical citation for first reading';
COMMENT ON COLUMN gospel_readings.responsorial_psalm IS 'Responsorial psalm text';
COMMENT ON COLUMN gospel_readings.psalm_citation IS 'Biblical citation for psalm';
COMMENT ON COLUMN gospel_readings.second_reading IS 'Second reading text (usually Epistles, Sundays/Solemnities)';
COMMENT ON COLUMN gospel_readings.second_reading_citation IS 'Biblical citation for second reading';
COMMENT ON COLUMN gospel_readings.gospel IS 'Gospel reading text';
COMMENT ON COLUMN gospel_readings.gospel_citation IS 'Biblical citation for gospel';
COMMENT ON COLUMN gospel_readings.gospel_acclamation IS 'Gospel acclamation verse';
COMMENT ON COLUMN gospel_readings.audio_url IS 'URL to audio recording of readings';
COMMENT ON COLUMN gospel_readings.source IS 'Source of the readings (e.g., USCCB)';
