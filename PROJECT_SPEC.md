# Groundhopper Pro - Project Specification

## Overview
A modern, feature-rich European football stadium tracking application for groundhoppers (people who visit football stadiums as a hobby).

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React-Leaflet (free, open-source)
- **State Management**: Zustand (lightweight)
- **UI Components**: Radix UI + custom components

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for photos)
- **API**: Next.js API Routes + Supabase Edge Functions

### Deployment
- **Hosting**: Vercel (recommended for Next.js)
- **CI/CD**: GitHub Actions
- **Domain**: Custom domain via Vercel

### External APIs (optional enhancements)
- **Football Data**: football-data.org or API-Football
- **Weather**: OpenWeatherMap
- **Geocoding**: Nominatim (free) or Mapbox

---

## Database Schema

### Core Tables

```sql
-- Countries
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(3) NOT NULL UNIQUE, -- ISO 3166-1 alpha-3
  flag_emoji VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leagues/Competitions
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(50),
  country_id UUID REFERENCES countries(id),
  division_level INTEGER NOT NULL DEFAULT 1, -- 1 = top division
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clubs
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(50),
  nickname VARCHAR(100), -- e.g., "De Godenzonen" for Ajax
  country_id UUID REFERENCES countries(id),
  current_league_id UUID REFERENCES leagues(id),
  founded_year INTEGER,
  dissolved_year INTEGER, -- NULL if still active
  
  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7), -- Hex color
  secondary_color VARCHAR(7),
  
  -- Social/Web
  website_url TEXT,
  twitter_handle VARCHAR(50),
  instagram_handle VARCHAR(50),
  
  -- Metadata
  wikipedia_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club Kits/Shirts
CREATE TABLE club_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  season VARCHAR(9) NOT NULL, -- e.g., "2024-2025"
  kit_type VARCHAR(20) NOT NULL, -- 'home', 'away', 'third', 'goalkeeper', 'retro'
  image_url TEXT,
  manufacturer VARCHAR(100),
  sponsor VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stadiums
CREATE TABLE stadiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  nickname VARCHAR(100), -- e.g., "De Kuip", "Theatre of Dreams"
  city VARCHAR(100) NOT NULL,
  country_id UUID REFERENCES countries(id),
  
  -- Location
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  address TEXT,
  postal_code VARCHAR(20),
  
  -- Stadium details
  capacity INTEGER,
  built_year INTEGER,
  opened_year INTEGER,
  renovated_years INTEGER[], -- Array of renovation years
  architect VARCHAR(200),
  cost_eur BIGINT, -- Construction cost in EUR
  
  -- Playing surface
  surface_type VARCHAR(50), -- 'natural_grass', 'hybrid', 'artificial'
  pitch_dimensions VARCHAR(20), -- e.g., "105x68"
  
  -- Facilities
  has_roof BOOLEAN DEFAULT false,
  roof_type VARCHAR(50), -- 'full', 'partial', 'retractable', 'none'
  has_athletics_track BOOLEAN DEFAULT false,
  
  -- Record
  record_attendance INTEGER,
  record_attendance_match TEXT,
  record_attendance_date DATE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  demolished_year INTEGER,
  
  -- Media
  photo_exterior_url TEXT,
  photo_aerial_url TEXT,
  photo_interior_url TEXT,
  
  -- Metadata
  wikipedia_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Club-Stadium relationship (clubs can move stadiums)
CREATE TABLE club_stadiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
  start_year INTEGER NOT NULL,
  end_year INTEGER, -- NULL if current
  is_primary BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stadium History/Facts
CREATE TABLE stadium_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
  fact_type VARCHAR(50) NOT NULL, -- 'history', 'trivia', 'record', 'event'
  title VARCHAR(200),
  content TEXT NOT NULL,
  year INTEGER,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### User Tables

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  home_country_id UUID REFERENCES countries(id),
  favorite_club_id UUID REFERENCES clubs(id),
  
  -- Preferences
  preferred_language VARCHAR(5) DEFAULT 'en',
  preferred_theme VARCHAR(10) DEFAULT 'dark', -- 'dark', 'light', 'system'
  preferred_units VARCHAR(10) DEFAULT 'metric', -- 'metric', 'imperial'
  
  -- Privacy
  profile_is_public BOOLEAN DEFAULT true,
  show_visits_publicly BOOLEAN DEFAULT true,
  
  -- Stats (denormalized for performance)
  total_visits INTEGER DEFAULT 0,
  total_countries INTEGER DEFAULT 0,
  total_stadiums INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stadium visits
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id), -- Which club was playing (optional)
  
  -- Visit details
  visit_date DATE NOT NULL,
  match_type VARCHAR(50), -- 'league', 'cup', 'european', 'friendly', 'national_team', 'tour', 'other'
  home_team VARCHAR(200),
  away_team VARCHAR(200),
  score VARCHAR(20), -- e.g., "3-1"
  attendance INTEGER,
  
  -- Personal experience
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  atmosphere_rating INTEGER CHECK (atmosphere_rating >= 1 AND rating <= 5),
  notes TEXT,
  
  -- Seat info
  section VARCHAR(50),
  row VARCHAR(20),
  seat VARCHAR(20),
  ticket_price DECIMAL(10, 2),
  ticket_currency VARCHAR(3),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, stadium_id, visit_date, home_team)
);

-- Visit photos
CREATE TABLE visit_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  photo_type VARCHAR(30), -- 'exterior', 'interior', 'pitch', 'ticket', 'selfie', 'atmosphere', 'other'
  taken_at TIMESTAMPTZ,
  
  -- Location (if available)
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scanned tickets/memorabilia
CREATE TABLE memorabilia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  type VARCHAR(30) NOT NULL, -- 'ticket', 'program', 'scarf', 'badge', 'other'
  image_url TEXT NOT NULL,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Trip Planning Tables

```sql
-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  start_date DATE,
  end_date DATE,
  
  status VARCHAR(20) DEFAULT 'planning', -- 'planning', 'upcoming', 'ongoing', 'completed', 'cancelled'
  
  -- Stats (denormalized)
  total_stadiums INTEGER DEFAULT 0,
  total_countries INTEGER DEFAULT 0,
  total_distance_km INTEGER,
  
  -- Sharing
  is_public BOOLEAN DEFAULT false,
  share_code VARCHAR(20) UNIQUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip stops/stadiums
CREATE TABLE trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  stadium_id UUID REFERENCES stadiums(id),
  
  stop_order INTEGER NOT NULL,
  planned_date DATE,
  planned_time TIME,
  
  -- Match info if known
  match_id UUID, -- Link to external match data
  home_team VARCHAR(200),
  away_team VARCHAR(200),
  competition VARCHAR(200),
  
  -- Transport to this stop
  transport_mode VARCHAR(30), -- 'car', 'train', 'plane', 'bus', 'ferry', 'walk', 'bike'
  transport_notes TEXT,
  estimated_travel_time_minutes INTEGER,
  estimated_distance_km INTEGER,
  
  -- Accommodation
  accommodation_name VARCHAR(200),
  accommodation_address TEXT,
  accommodation_check_in TIME,
  
  notes TEXT,
  
  -- Status
  is_visited BOOLEAN DEFAULT false,
  visit_id UUID REFERENCES visits(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Gamification Tables

```sql
-- Achievements/Badges
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  
  -- Requirements
  requirement_type VARCHAR(50) NOT NULL, -- 'visit_count', 'country_count', 'league_complete', 'special'
  requirement_value INTEGER, -- e.g., 10 for "Visit 10 stadiums"
  requirement_data JSONB, -- For complex requirements
  
  -- Rarity
  points INTEGER DEFAULT 10,
  rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);
```

### Supporting Tables

```sql
-- User backups
CREATE TABLE user_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  backup_type VARCHAR(20) DEFAULT 'manual', -- 'manual', 'auto'
  backup_data JSONB NOT NULL,
  file_url TEXT, -- For downloadable exports
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_clubs_country ON clubs(country_id);
CREATE INDEX idx_clubs_league ON clubs(current_league_id);
CREATE INDEX idx_stadiums_country ON stadiums(country_id);
CREATE INDEX idx_stadiums_location ON stadiums USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_stadium ON visits(stadium_id);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_trip_stops_trip ON trip_stops(trip_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorabilia ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_backups ENABLE ROW LEVEL SECURITY;

-- RLS Policies (examples)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own visits"
  ON visits FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (profile_is_public = true);
```

---

## Feature Breakdown

### Phase 1: MVP (Week 1-2)
- [ ] Project setup (Next.js, Tailwind, Supabase)
- [ ] Authentication (login, register, profile)
- [ ] Basic map with all stadiums
- [ ] Stadium detail page
- [ ] Mark stadium as visited
- [ ] Dark/Light theme toggle
- [ ] Basic filters (country, division)

### Phase 2: Core Features (Week 3-4)
- [ ] Visit logging with details
- [ ] Photo upload for visits
- [ ] Search functionality
- [ ] List view with sorting
- [ ] Statistics dashboard
- [ ] Club pages with kits
- [ ] Stadium facts/history

### Phase 3: Trip Planning (Week 5-6)
- [ ] Create/edit trips
- [ ] Add stadiums to trip
- [ ] Route visualization
- [ ] Distance calculations
- [ ] Trip sharing

### Phase 4: Advanced Features (Week 7-8)
- [ ] Achievements system
- [ ] Backup/export functionality
- [ ] Nearby stadiums feature
- [ ] Match calendar integration
- [ ] Weather integration
- [ ] PWA support (offline)

### Phase 5: Social (Optional)
- [ ] Public profiles
- [ ] Follow other groundhoppers
- [ ] Activity feed
- [ ] Leaderboards

---

## File Structure

```
groundhopper-pro/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── page.tsx                 # Home/Map
│   │   ├── stadiums/
│   │   │   ├── page.tsx             # Stadium list
│   │   │   └── [id]/page.tsx        # Stadium detail
│   │   ├── clubs/
│   │   │   ├── page.tsx             # Club list
│   │   │   └── [id]/page.tsx        # Club detail
│   │   ├── trips/
│   │   │   ├── page.tsx             # My trips
│   │   │   ├── new/page.tsx         # Create trip
│   │   │   └── [id]/page.tsx        # Trip detail
│   │   ├── stats/page.tsx           # Statistics
│   │   ├── profile/page.tsx         # User profile
│   │   ├── settings/page.tsx        # Settings
│   │   └── layout.tsx
│   ├── api/
│   │   ├── stadiums/route.ts
│   │   ├── visits/route.ts
│   │   └── trips/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                          # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── theme-toggle.tsx
│   ├── map/
│   │   ├── stadium-map.tsx
│   │   ├── stadium-marker.tsx
│   │   └── map-controls.tsx
│   ├── stadium/
│   │   ├── stadium-card.tsx
│   │   ├── stadium-detail.tsx
│   │   ├── stadium-photos.tsx
│   │   └── stadium-facts.tsx
│   ├── club/
│   │   ├── club-card.tsx
│   │   ├── club-kits.tsx
│   │   └── club-history.tsx
│   ├── visit/
│   │   ├── visit-form.tsx
│   │   ├── visit-card.tsx
│   │   └── photo-upload.tsx
│   ├── trip/
│   │   ├── trip-planner.tsx
│   │   ├── trip-map.tsx
│   │   └── trip-stop.tsx
│   ├── stats/
│   │   ├── stats-overview.tsx
│   │   ├── country-progress.tsx
│   │   └── achievements.tsx
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       ├── footer.tsx
│       └── mobile-nav.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── use-stadiums.ts
│   │   ├── use-visits.ts
│   │   ├── use-trips.ts
│   │   └── use-theme.ts
│   ├── stores/
│   │   ├── filter-store.ts
│   │   └── ui-store.ts
│   └── utils/
│       ├── distance.ts
│       ├── format.ts
│       └── validators.ts
├── public/
│   ├── icons/
│   │   ├── stadium-light.svg
│   │   └── stadium-dark.svg
│   └── images/
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: External APIs
FOOTBALL_DATA_API_KEY=your-key
OPENWEATHER_API_KEY=your-key
MAPBOX_ACCESS_TOKEN=your-token
```

---

## Initial Data Sources

For populating the database with stadium data:

1. **Wikipedia** - Most European stadiums have detailed pages
2. **Transfermarkt** - Club and stadium data
3. **Football-Data.org** - Free API for matches
4. **OpenStreetMap** - Stadium coordinates and boundaries
5. **Wikidata** - Structured data queries

Consider creating a scraper/importer script for initial data population.

---

## Design System

### Colors
```css
/* Light Theme */
--background: 0 0% 100%;
--foreground: 222 47% 11%;
--primary: 142 76% 36%; /* Green - main accent */
--secondary: 217 91% 60%; /* Blue - secondary */
--muted: 210 40% 96%;
--accent: 45 93% 47%; /* Gold - achievements */

/* Dark Theme */
--background: 222 47% 11%;
--foreground: 210 40% 98%;
--primary: 142 69% 58%;
--secondary: 217 91% 65%;
--muted: 217 33% 17%;
--accent: 45 93% 58%;
```

### Theme Toggle Icon
Use a stadium floodlight icon that:
- **Light mode**: Shows lights OFF (sun visible, stadium lights dim)
- **Dark mode**: Shows lights ON (moon visible, stadium lights bright)

---

## Next Steps

1. **Initialize repository** on GitHub
2. **Set up Supabase** project
3. **Run initial migration** for database schema
4. **Deploy to Vercel** for preview deployments
5. **Start with Phase 1** MVP features

---

## Notes for Claude Code

When working with Claude Code:
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use server components where possible
- Implement proper error handling
- Add loading states for async operations
- Use Supabase RLS for security
- Test on mobile viewport sizes
