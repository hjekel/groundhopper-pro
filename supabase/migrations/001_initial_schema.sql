-- Groundhopper Pro Database Schema
-- Run this in Supabase SQL Editor or as a migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- REFERENCE DATA TABLES
-- ============================================

-- Countries
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,  -- ISO 3166-1 alpha-3
    code_2 VARCHAR(2) NOT NULL UNIQUE, -- ISO 3166-1 alpha-2
    flag_emoji VARCHAR(10),
    continent VARCHAR(50) DEFAULT 'Europe',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leagues/Competitions
CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(50),
    division INTEGER NOT NULL DEFAULT 1,  -- 1 = top division, 2 = second, etc.
    league_type VARCHAR(50) DEFAULT 'domestic', -- domestic, cup, european, international
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(country_id, name)
);

-- Clubs
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(50),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    current_league_id UUID REFERENCES leagues(id) ON DELETE SET NULL,
    
    -- Club info
    founded_year INTEGER,
    city VARCHAR(100),
    nickname VARCHAR(100),
    
    -- Branding
    primary_color VARCHAR(7),   -- Hex color e.g. #FF0000
    secondary_color VARCHAR(7),
    crest_url TEXT,
    
    -- External references
    wikipedia_url TEXT,
    official_website TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club historical leagues (for tracking promotions/relegations)
CREATE TABLE club_league_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
    season VARCHAR(10) NOT NULL,  -- e.g. "2023-24"
    final_position INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stadiums
CREATE TABLE stadiums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    
    -- Location
    city VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    
    -- Stadium info
    capacity INTEGER,
    built_year INTEGER,
    renovated_year INTEGER,
    architect VARCHAR(200),
    surface VARCHAR(50) DEFAULT 'grass', -- grass, artificial, hybrid
    
    -- Historical info
    former_names TEXT[], -- Array of previous names
    notable_events TEXT, -- Historical significance
    record_attendance INTEGER,
    record_attendance_match TEXT,
    record_attendance_date DATE,
    
    -- Media
    thumbnail_url TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stadium photos (multiple per stadium)
CREATE TABLE stadium_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    url TEXT NOT NULL,
    photo_type VARCHAR(50) NOT NULL, -- exterior, aerial, interior, historical, matchday
    caption TEXT,
    photographer VARCHAR(200),
    taken_date DATE,
    is_primary BOOLEAN DEFAULT false,
    
    -- For ordering
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club kits/shirts
CREATE TABLE kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    season VARCHAR(10) NOT NULL, -- e.g. "2023-24"
    kit_type VARCHAR(20) NOT NULL, -- home, away, third, goalkeeper, european
    
    image_url TEXT,
    manufacturer VARCHAR(100),
    sponsor VARCHAR(200),
    
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER TABLES
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    
    -- Preferences
    home_country_id UUID REFERENCES countries(id),
    favourite_club_id UUID REFERENCES clubs(id),
    preferred_theme VARCHAR(10) DEFAULT 'dark', -- light, dark, auto
    
    -- Privacy
    profile_visibility VARCHAR(20) DEFAULT 'private', -- public, friends, private
    show_on_leaderboard BOOLEAN DEFAULT false,
    
    -- Stats (denormalized for performance)
    total_stadiums_visited INTEGER DEFAULT 0,
    total_countries_visited INTEGER DEFAULT 0,
    total_distance_km INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stadium visits
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    -- Visit details
    visit_date DATE,
    match_home_team VARCHAR(200),
    match_away_team VARCHAR(200),
    match_score VARCHAR(20), -- e.g. "2-1"
    match_competition VARCHAR(200),
    
    -- Rating and review
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    atmosphere_rating INTEGER CHECK (atmosphere_rating >= 1 AND atmosphere_rating <= 5),
    facilities_rating INTEGER CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
    
    -- Seat info
    stand_name VARCHAR(100),
    seat_info VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, stadium_id, visit_date)
);

-- User photos (their own uploads)
CREATE TABLE user_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    storage_path TEXT NOT NULL, -- Supabase storage path
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    photo_type VARCHAR(50), -- stadium, ticket, programme, selfie, matchday, other
    caption TEXT,
    taken_at TIMESTAMPTZ,
    
    -- For ordering
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User notes/journal entries
CREATE TABLE user_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    title VARCHAR(200),
    content TEXT NOT NULL,
    
    -- For scanned documents
    is_scan BOOLEAN DEFAULT false,
    scan_type VARCHAR(50), -- ticket, programme, newspaper, other
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIP PLANNING TABLES
-- ============================================

-- Trips
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    start_date DATE,
    end_date DATE,
    
    status VARCHAR(20) DEFAULT 'planning', -- planning, confirmed, completed, cancelled
    
    -- Trip settings
    transport_mode VARCHAR(20) DEFAULT 'car', -- car, train, plane, mixed
    
    -- Stats (calculated)
    total_stadiums INTEGER DEFAULT 0,
    total_distance_km INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stadiums in a trip
CREATE TABLE trip_stadiums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    -- Order in trip
    day_number INTEGER,
    visit_order INTEGER,
    
    -- Planned details
    planned_date DATE,
    planned_match TEXT,
    
    -- Notes
    notes TEXT,
    
    -- Status
    is_confirmed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(trip_id, stadium_id)
);

-- ============================================
-- ACHIEVEMENTS / GAMIFICATION
-- ============================================

-- Achievement definitions
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10), -- Emoji
    
    -- Requirements
    requirement_type VARCHAR(50) NOT NULL, -- stadiums_count, countries_count, league_complete, etc.
    requirement_value INTEGER,
    requirement_data JSONB, -- Additional requirements
    
    -- Rarity
    rarity VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare, epic, legendary
    points INTEGER DEFAULT 10,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- LOCAL TIPS / RECOMMENDATIONS
-- ============================================

-- Places near stadiums
CREATE TABLE stadium_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    place_type VARCHAR(50) NOT NULL, -- pub, restaurant, fanshop, museum, transport
    
    address TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    distance_meters INTEGER,
    
    description TEXT,
    tip TEXT, -- Insider tip
    
    website TEXT,
    phone VARCHAR(50),
    
    -- Ratings
    avg_rating DECIMAL(2,1),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_clubs_country ON clubs(country_id);
CREATE INDEX idx_clubs_league ON clubs(current_league_id);
CREATE INDEX idx_stadiums_club ON stadiums(club_id);
CREATE INDEX idx_stadiums_country ON stadiums(country_id);
CREATE INDEX idx_stadiums_location ON stadiums USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_stadium ON visits(stadium_id);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_user_photos_visit ON user_photos(visit_id);
CREATE INDEX idx_user_photos_stadium ON user_photos(stadium_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stadiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read public profiles, edit their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (profile_visibility = 'public' OR auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Visits: users can CRUD their own visits
CREATE POLICY "Users can view own visits" ON visits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visits" ON visits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visits" ON visits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own visits" ON visits
    FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other user tables
CREATE POLICY "Users can manage own photos" ON user_photos
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notes" ON user_notes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trips" ON trips
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trip stadiums" ON trip_stadiums
    FOR ALL USING (
        auth.uid() = (SELECT user_id FROM trips WHERE id = trip_id)
    );

CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clubs_updated_at
    BEFORE UPDATE ON clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stadiums_updated_at
    BEFORE UPDATE ON stadiums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_visits_updated_at
    BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update user stats after visit
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        total_stadiums_visited = (
            SELECT COUNT(DISTINCT stadium_id) FROM visits WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
        ),
        total_countries_visited = (
            SELECT COUNT(DISTINCT s.country_id) 
            FROM visits v
            JOIN stadiums s ON v.stadium_id = s.id
            WHERE v.user_id = COALESCE(NEW.user_id, OLD.user_id)
        )
    WHERE id = COALESCE(NEW.user_id, OLD.user_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_visit
    AFTER INSERT OR DELETE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
