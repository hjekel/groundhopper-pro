-- Groundhopper Pro Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geographic queries

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE division_level AS ENUM ('1', '2', '3', '4', '5', 'cup', 'youth');
CREATE TYPE visit_type AS ENUM ('match', 'tour', 'event', 'other');
CREATE TYPE photo_type AS ENUM ('exterior', 'interior', 'aerial', 'pitch', 'atmosphere', 'ticket', 'note', 'other');
CREATE TYPE trip_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE badge_category AS ENUM ('visits', 'countries', 'divisions', 'special', 'social');

-- ============================================
-- COUNTRIES
-- ============================================
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL,           -- ISO 3166-1 alpha-3
    name VARCHAR(100) NOT NULL,
    name_local VARCHAR(100),                    -- Native name
    flag_emoji VARCHAR(10),
    continent VARCHAR(50) DEFAULT 'Europe',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEAGUES / COMPETITIONS
-- ============================================
CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id),
    name VARCHAR(200) NOT NULL,
    name_local VARCHAR(200),
    short_name VARCHAR(50),
    division division_level NOT NULL,
    tier INTEGER,                               -- 1 = top league, 2 = second, etc.
    logo_url TEXT,
    website TEXT,
    founded_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLUBS
-- ============================================
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name VARCHAR(200) NOT NULL,
    name_full VARCHAR(300),                     -- Full official name
    name_local VARCHAR(200),                    -- Name in local language
    short_name VARCHAR(50),                     -- e.g., "Ajax", "FCB"
    nickname VARCHAR(100),                      -- e.g., "De Godenzonen", "Blaugrana"
    
    -- Location
    country_id UUID REFERENCES countries(id),
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),                        -- Province/state
    
    -- Current league
    current_league_id UUID REFERENCES leagues(id),
    
    -- Visuals
    logo_url TEXT,
    primary_colour VARCHAR(7),                  -- Hex colour
    secondary_colour VARCHAR(7),
    
    -- History
    founded_year INTEGER,
    founded_date DATE,
    founder TEXT,
    
    -- Social/Web
    website TEXT,
    twitter_handle VARCHAR(100),
    instagram_handle VARCHAR(100),
    
    -- Metadata
    wikipedia_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STADIUMS
-- ============================================
CREATE TABLE stadiums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name VARCHAR(200) NOT NULL,
    name_full VARCHAR(300),
    former_names TEXT[],                        -- Array of previous names
    nickname VARCHAR(100),
    
    -- Location
    city VARCHAR(100) NOT NULL,
    country_id UUID REFERENCES countries(id),
    address TEXT,
    postcode VARCHAR(20),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    location GEOGRAPHY(POINT, 4326),            -- PostGIS point for queries
    
    -- Capacity
    capacity INTEGER,
    seated_capacity INTEGER,
    standing_capacity INTEGER,
    away_capacity INTEGER,
    
    -- Construction
    built_year INTEGER,
    opened_date DATE,
    architect TEXT,
    construction_cost TEXT,
    
    -- Renovations (stored as JSONB array)
    renovations JSONB DEFAULT '[]',
    -- Example: [{"year": 2020, "description": "New roof", "cost": "€50M"}]
    
    -- Features
    has_roof BOOLEAN DEFAULT false,
    roof_type VARCHAR(50),                      -- 'full', 'partial', 'retractable'
    pitch_type VARCHAR(50),                     -- 'grass', 'hybrid', 'artificial'
    pitch_dimensions VARCHAR(50),               -- e.g., "105m x 68m"
    has_athletics_track BOOLEAN DEFAULT false,
    
    -- Facilities
    has_museum BOOLEAN DEFAULT false,
    has_tour BOOLEAN DEFAULT false,
    tour_url TEXT,
    has_shop BOOLEAN DEFAULT false,
    shop_url TEXT,
    
    -- Images
    photo_exterior_url TEXT,
    photo_interior_url TEXT,
    photo_aerial_url TEXT,
    
    -- Transport
    public_transport_info TEXT,
    parking_info TEXT,
    
    -- Notable
    notable_events TEXT[],                      -- Array of notable events
    record_attendance INTEGER,
    record_attendance_date DATE,
    record_attendance_match TEXT,
    
    -- Metadata
    wikipedia_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create geography column from lat/lng
CREATE OR REPLACE FUNCTION update_stadium_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stadium_location_trigger
    BEFORE INSERT OR UPDATE ON stadiums
    FOR EACH ROW EXECUTE FUNCTION update_stadium_location();

-- ============================================
-- CLUB-STADIUM RELATIONSHIP
-- ============================================
CREATE TABLE club_stadiums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    is_current BOOLEAN DEFAULT true,
    start_year INTEGER,
    end_year INTEGER,
    is_home BOOLEAN DEFAULT true,              -- vs temporary/shared
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(club_id, stadium_id, start_year)
);

-- ============================================
-- KITS / SHIRTS
-- ============================================
CREATE TABLE kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    season VARCHAR(10) NOT NULL,                -- e.g., "2024-25"
    kit_type VARCHAR(20) NOT NULL,              -- 'home', 'away', 'third', 'goalkeeper', 'european'
    manufacturer VARCHAR(100),
    sponsor VARCHAR(200),
    image_url TEXT,
    primary_colour VARCHAR(7),
    secondary_colour VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(club_id, season, kit_type)
);

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Profile
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    
    -- Location
    home_country_id UUID REFERENCES countries(id),
    home_city VARCHAR(100),
    home_latitude DECIMAL(10, 7),
    home_longitude DECIMAL(10, 7),
    
    -- Preferences
    favourite_club_id UUID REFERENCES clubs(id),
    preferred_theme VARCHAR(10) DEFAULT 'dark', -- 'dark', 'light', 'auto'
    preferred_language VARCHAR(5) DEFAULT 'en',
    distance_unit VARCHAR(5) DEFAULT 'km',      -- 'km', 'miles'
    
    -- Privacy
    is_public BOOLEAN DEFAULT true,
    show_on_leaderboard BOOLEAN DEFAULT true,
    
    -- Stats (denormalised for performance)
    total_visits INTEGER DEFAULT 0,
    total_countries INTEGER DEFAULT 0,
    total_clubs INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VISITS
-- ============================================
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id),
    club_id UUID REFERENCES clubs(id),          -- Which club was playing (if match)
    
    -- Visit Details
    visit_date DATE NOT NULL,
    visit_type visit_type DEFAULT 'match',
    
    -- Match Details (if applicable)
    home_team VARCHAR(200),
    away_team VARCHAR(200),
    competition VARCHAR(200),
    score VARCHAR(20),                          -- e.g., "3-1"
    attendance INTEGER,
    
    -- Personal
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    atmosphere_rating INTEGER CHECK (atmosphere_rating >= 1 AND atmosphere_rating <= 5),
    view_rating INTEGER CHECK (view_rating >= 1 AND view_rating <= 5),
    facilities_rating INTEGER CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
    notes TEXT,
    
    -- Seat Info
    seat_section VARCHAR(50),
    seat_row VARCHAR(20),
    seat_number VARCHAR(20),
    
    -- Weather
    weather VARCHAR(50),
    temperature_celsius INTEGER,
    
    -- Trip link
    trip_id UUID,                               -- Will reference trips table
    
    -- Metadata
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PHOTOS
-- ============================================
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id),
    
    -- File
    storage_path TEXT NOT NULL,                 -- Path in Supabase Storage
    original_filename VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(50),
    
    -- Metadata
    photo_type photo_type DEFAULT 'other',
    caption TEXT,
    taken_at TIMESTAMPTZ,
    
    -- Image dimensions
    width INTEGER,
    height INTEGER,
    
    -- Privacy
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCANNED NOTES / DOCUMENTS
-- ============================================
CREATE TABLE scanned_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
    
    -- File
    storage_path TEXT NOT NULL,
    original_filename VARCHAR(255),
    file_type VARCHAR(50),                      -- 'image', 'pdf'
    
    -- Content
    title VARCHAR(200),
    description TEXT,
    ocr_text TEXT,                              -- Extracted text via OCR
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIPS
-- ============================================
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Dates
    start_date DATE,
    end_date DATE,
    
    -- Status
    status trip_status DEFAULT 'planned',
    
    -- Route
    total_distance_km DECIMAL(10, 2),
    travel_mode VARCHAR(20) DEFAULT 'car',      -- 'car', 'train', 'plane', 'mixed'
    
    -- AI-generated content
    ai_suggestions TEXT,
    ai_local_tips TEXT,
    
    -- Privacy
    is_public BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to visits after trips table exists
ALTER TABLE visits ADD CONSTRAINT visits_trip_fkey 
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL;

-- ============================================
-- TRIP STOPS
-- ============================================
CREATE TABLE trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id),
    
    -- Order
    stop_order INTEGER NOT NULL,
    
    -- Timing
    planned_date DATE,
    planned_arrival_time TIME,
    planned_duration_minutes INTEGER,
    
    -- Match info (if known)
    match_id UUID,                              -- Link to matches table if exists
    expected_match TEXT,
    
    -- Notes
    notes TEXT,
    
    -- Distance from previous stop
    distance_from_previous_km DECIMAL(10, 2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS / BADGES
-- ============================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Badge Info
    code VARCHAR(50) UNIQUE NOT NULL,           -- e.g., 'eredivisie_complete'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Visuals
    icon VARCHAR(10),                           -- Emoji or icon name
    colour VARCHAR(7),
    image_url TEXT,
    
    -- Category
    category badge_category NOT NULL,
    
    -- Requirements
    requirement_type VARCHAR(50),               -- 'visit_count', 'country_count', 'league_complete'
    requirement_value INTEGER,
    requirement_data JSONB,                     -- Additional requirements
    
    -- Rarity
    points INTEGER DEFAULT 10,
    is_secret BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER ACHIEVEMENTS
-- ============================================
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- STADIUM FACTS / HISTORY
-- ============================================
CREATE TABLE stadium_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    fact_type VARCHAR(50),                      -- 'history', 'trivia', 'record', 'event'
    title VARCHAR(200),
    content TEXT NOT NULL,
    source TEXT,
    fact_date DATE,
    
    -- AI-generated?
    is_ai_generated BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BACKUP METADATA
-- ============================================
CREATE TABLE user_backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    backup_type VARCHAR(20),                    -- 'full', 'visits', 'photos'
    file_path TEXT,
    file_size INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_clubs_country ON clubs(country_id);
CREATE INDEX idx_clubs_league ON clubs(current_league_id);
CREATE INDEX idx_stadiums_country ON stadiums(country_id);
CREATE INDEX idx_stadiums_location ON stadiums USING GIST(location);
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_stadium ON visits(stadium_id);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_photos_visit ON photos(visit_id);
CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_trip_stops_trip ON trip_stops(trip_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE scanned_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_backups ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own visits
CREATE POLICY "Users can view own visits" ON visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own visits" ON visits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own visits" ON visits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own visits" ON visits FOR DELETE USING (auth.uid() = user_id);

-- Public visits visible to all
CREATE POLICY "Public visits visible to all" ON visits FOR SELECT USING (is_public = true);

-- Similar policies for photos, trips, etc.
CREATE POLICY "Users can manage own photos" ON photos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own trips" ON trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own trip stops" ON trip_stops FOR ALL 
    USING (trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid()));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update user stats after visit
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles SET
        total_visits = (SELECT COUNT(*) FROM visits WHERE user_id = NEW.user_id),
        total_clubs = (SELECT COUNT(DISTINCT club_id) FROM visits WHERE user_id = NEW.user_id),
        total_countries = (
            SELECT COUNT(DISTINCT s.country_id) 
            FROM visits v 
            JOIN stadiums s ON v.stadium_id = s.id 
            WHERE v.user_id = NEW.user_id
        ),
        updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER visits_stats_trigger
    AFTER INSERT OR DELETE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Function to find nearby stadiums
CREATE OR REPLACE FUNCTION find_nearby_stadiums(
    lat DECIMAL,
    lng DECIMAL,
    radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
    stadium_id UUID,
    name VARCHAR,
    city VARCHAR,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.city,
        ROUND((ST_Distance(
            s.location,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
        ) / 1000)::DECIMAL, 2) as distance_km
    FROM stadiums s
    WHERE ST_DWithin(
        s.location,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radius_km * 1000
    )
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (code, name, description, icon, category, requirement_type, requirement_value) VALUES
('first_visit', 'First Steps', 'Visit your first stadium', '👣', 'visits', 'visit_count', 1),
('ten_visits', 'Getting Started', 'Visit 10 stadiums', '🎯', 'visits', 'visit_count', 10),
('fifty_visits', 'Dedicated Hopper', 'Visit 50 stadiums', '⭐', 'visits', 'visit_count', 50),
('hundred_visits', 'Century Club', 'Visit 100 stadiums', '💯', 'visits', 'visit_count', 100),
('five_countries', 'Explorer', 'Visit stadiums in 5 countries', '🌍', 'countries', 'country_count', 5),
('ten_countries', 'Globetrotter', 'Visit stadiums in 10 countries', '✈️', 'countries', 'country_count', 10),
('eredivisie_complete', 'Dutch Master', 'Visit all Eredivisie stadiums', '🇳🇱', 'divisions', 'league_complete', NULL),
('premier_league_complete', 'English Expert', 'Visit all Premier League stadiums', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'divisions', 'league_complete', NULL),
('bundesliga_complete', 'German Groundhopper', 'Visit all Bundesliga stadiums', '🇩🇪', 'divisions', 'league_complete', NULL),
('weekend_warrior', 'Weekend Warrior', 'Visit 3 stadiums in one weekend', '⚡', 'special', 'weekend_count', 3);

-- ============================================
-- SAMPLE COUNTRIES
-- ============================================
INSERT INTO countries (code, name, name_local, flag_emoji) VALUES
('NLD', 'Netherlands', 'Nederland', '🇳🇱'),
('ENG', 'England', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
('DEU', 'Germany', 'Deutschland', '🇩🇪'),
('ESP', 'Spain', 'España', '🇪🇸'),
('ITA', 'Italy', 'Italia', '🇮🇹'),
('FRA', 'France', 'France', '🇫🇷'),
('PRT', 'Portugal', 'Portugal', '🇵🇹'),
('BEL', 'Belgium', 'België', '🇧🇪'),
('SCT', 'Scotland', 'Scotland', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'),
('AUT', 'Austria', 'Österreich', '🇦🇹');
