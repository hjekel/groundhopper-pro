-- Groundhopper Pro - Extended Features Migration
-- Version 002: Wishlist, Favourite Teams, Club History & Spotlight
-- Run after 001_initial_schema.sql

-- ============================================
-- WISHLIST
-- ============================================

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    
    -- Priority and planning
    priority INTEGER DEFAULT 2 CHECK (priority >= 1 AND priority <= 3), -- 1=must visit, 2=want to visit, 3=someday
    target_season VARCHAR(10), -- e.g., "2025-26"
    
    -- Notes
    notes TEXT,
    reason TEXT, -- Why do you want to visit?
    
    -- Metadata
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, stadium_id)
);

-- ============================================
-- FAVOURITE TEAMS & NOTIFICATIONS
-- ============================================

CREATE TABLE user_favourite_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    
    -- Notification preferences
    notify_home_matches BOOLEAN DEFAULT true,
    notify_away_matches BOOLEAN DEFAULT false,
    notify_nearby_matches BOOLEAN DEFAULT true, -- When playing within X km
    nearby_radius_km INTEGER DEFAULT 100,
    
    -- Display
    is_primary BOOLEAN DEFAULT false, -- Main team (only one)
    display_order INTEGER DEFAULT 0,
    
    -- Season ticket holder?
    has_season_ticket BOOLEAN DEFAULT false,
    season_ticket_stand VARCHAR(100),
    season_ticket_since INTEGER, -- Year
    
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, club_id)
);

-- ============================================
-- CLUB HISTORY & SPOTLIGHT
-- ============================================

-- Extended club information for "Spotlight" feature
CREATE TABLE club_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    
    -- Rich history content
    founding_story TEXT,
    name_origin TEXT, -- Why is the club called this?
    motto VARCHAR(200),
    anthem_name VARCHAR(200),
    anthem_lyrics TEXT,
    
    -- Historical facts
    original_stadium VARCHAR(200),
    original_colors VARCHAR(100),
    
    -- Records
    record_league_position INTEGER,
    record_league_season VARCHAR(10),
    biggest_win VARCHAR(50), -- e.g., "10-1"
    biggest_win_opponent VARCHAR(200),
    biggest_win_date DATE,
    biggest_loss VARCHAR(50),
    biggest_loss_opponent VARCHAR(200),
    biggest_loss_date DATE,
    
    -- European history
    first_european_match DATE,
    first_european_opponent VARCHAR(200),
    best_european_finish VARCHAR(200),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club facts (for the "Did you know?" feature)
CREATE TABLE club_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    
    -- Fact content
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    
    -- Categorisation
    category VARCHAR(50) NOT NULL, -- 'founding', 'records', 'legends', 'stadium', 'rivalry', 'trivia', 'dark_times', 'glory_days'
    era VARCHAR(50), -- 'pre-war', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'
    year INTEGER,
    
    -- Media
    image_url TEXT,
    image_caption TEXT,
    source_url TEXT,
    source_name VARCHAR(200),
    
    -- Display
    is_highlight BOOLEAN DEFAULT false, -- Show prominently
    display_order INTEGER DEFAULT 0,
    
    -- For "obscure facts" feature
    obscurity_level INTEGER DEFAULT 2 CHECK (obscurity_level >= 1 AND obscurity_level <= 3), 
    -- 1=well known, 2=lesser known, 3=obscure/rare
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club legends (famous players & managers)
CREATE TABLE club_legends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    
    -- Person details
    name VARCHAR(200) NOT NULL,
    nickname VARCHAR(100),
    nationality VARCHAR(100),
    birth_date DATE,
    death_date DATE,
    
    -- Role
    role VARCHAR(50) NOT NULL, -- 'player', 'manager', 'chairman', 'founder'
    position VARCHAR(50), -- For players: 'goalkeeper', 'defender', 'midfielder', 'forward'
    
    -- Time at club
    joined_year INTEGER,
    left_year INTEGER,
    
    -- Stats (for players)
    appearances INTEGER,
    goals INTEGER,
    assists INTEGER,
    clean_sheets INTEGER, -- For goalkeepers
    
    -- Achievements at club
    titles_won TEXT[], -- Array of titles
    individual_awards TEXT[],
    
    -- Legacy
    shirt_number INTEGER,
    shirt_retired BOOLEAN DEFAULT false,
    statue_at_stadium BOOLEAN DEFAULT false,
    
    -- Content
    biography TEXT,
    famous_quote TEXT,
    
    -- Media
    photo_url TEXT,
    
    -- Display
    legend_tier INTEGER DEFAULT 2 CHECK (legend_tier >= 1 AND legend_tier <= 3),
    -- 1=all-time great, 2=club legend, 3=notable player
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club trophies
CREATE TABLE club_trophies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    
    competition_name VARCHAR(200) NOT NULL,
    competition_type VARCHAR(50), -- 'league', 'cup', 'european', 'super_cup', 'other'
    
    season VARCHAR(10) NOT NULL, -- e.g., "1958-59"
    year INTEGER,
    
    -- Match details (for cup finals)
    final_opponent VARCHAR(200),
    final_score VARCHAR(20),
    final_venue VARCHAR(200),
    
    -- Notable facts
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club rivalries
CREATE TABLE club_rivalries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    rival_club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    
    rivalry_name VARCHAR(200), -- e.g., "De Klassieker", "Het Kasteel Derby"
    rivalry_type VARCHAR(50), -- 'city', 'regional', 'historical', 'competitive'
    
    -- History
    origin_story TEXT,
    first_meeting_date DATE,
    
    -- Head to head (can be updated)
    total_matches INTEGER DEFAULT 0,
    club_wins INTEGER DEFAULT 0,
    rival_wins INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    
    -- Notable matches
    most_memorable_match TEXT,
    
    -- Intensity
    intensity_level INTEGER DEFAULT 2 CHECK (intensity_level >= 1 AND intensity_level <= 3),
    -- 1=friendly, 2=competitive, 3=fierce
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(club_id, rival_club_id)
);

-- ============================================
-- NEARBY STADIUMS FUNCTION
-- ============================================

-- Function to find stadiums within a radius
CREATE OR REPLACE FUNCTION find_nearby_stadiums(
    lat DECIMAL,
    lng DECIMAL,
    radius_km INTEGER DEFAULT 50,
    limit_count INTEGER DEFAULT 20
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
        ROUND(
            (ST_Distance(
                ST_SetSRID(ST_MakePoint(s.longitude, s.latitude), 4326)::geography,
                ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
            ) / 1000)::DECIMAL, 
            1
        ) as distance_km
    FROM stadiums s
    WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint(s.longitude, s.latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        radius_km * 1000
    )
    AND s.is_active = true
    ORDER BY distance_km
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlists_stadium ON wishlists(stadium_id);
CREATE INDEX idx_user_favourite_teams_user ON user_favourite_teams(user_id);
CREATE INDEX idx_user_favourite_teams_club ON user_favourite_teams(club_id);
CREATE INDEX idx_club_facts_club ON club_facts(club_id);
CREATE INDEX idx_club_facts_category ON club_facts(category);
CREATE INDEX idx_club_legends_club ON club_legends(club_id);
CREATE INDEX idx_club_trophies_club ON club_trophies(club_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favourite_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist" ON wishlists
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favourite teams" ON user_favourite_teams
    FOR ALL USING (auth.uid() = user_id);

-- Club history tables are public read
CREATE POLICY "Club history is public" ON club_history
    FOR SELECT USING (true);

CREATE POLICY "Club facts are public" ON club_facts
    FOR SELECT USING (true);

CREATE POLICY "Club legends are public" ON club_legends
    FOR SELECT USING (true);

CREATE POLICY "Club trophies are public" ON club_trophies
    FOR SELECT USING (true);

CREATE POLICY "Club rivalries are public" ON club_rivalries
    FOR SELECT USING (true);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_club_history_updated_at
    BEFORE UPDATE ON club_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
