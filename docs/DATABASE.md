# 🗄️ Database Schema - Groundhopper Pro

This document describes the complete database schema for Groundhopper Pro.

## Overview

The database is hosted on Supabase (PostgreSQL) and consists of the following main areas:

1. **User Management** - Profiles, preferences, authentication
2. **Geographic Data** - Countries, cities, coordinates
3. **Football Data** - Leagues, clubs, stadiums, kits
4. **User Activity** - Visits, trips, photos, notes
5. **Gamification** - Achievements, badges, scores

## Entity Relationship Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ profiles │────▶│  visits  │────▶│ stadiums │
└──────────┘     └──────────┘     └──────────┘
     │                                  │
     │           ┌──────────┐          │
     └──────────▶│  trips   │          │
                 └──────────┘          │
                      │                │
                 ┌────▼────┐      ┌────▼────┐
                 │trip_stops│     │  clubs  │
                 └─────────┘     └─────────┘
                                      │
                                 ┌────▼────┐
                                 │ leagues │
                                 └─────────┘
                                      │
                                 ┌────▼────┐
                                 │countries│
                                 └─────────┘
```

## Tables

### profiles

User profiles extending Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (references auth.users) |
| username | text | Unique display name |
| full_name | text | User's full name |
| avatar_url | text | Profile picture URL |
| bio | text | Short biography |
| home_country | text | User's home country code |
| favourite_club_id | uuid | FK to clubs |
| groundhopper_score | integer | Total points earned |
| theme | text | 'light' or 'dark' |
| email_notifications | boolean | Email preferences |
| public_profile | boolean | Show on leaderboards |
| created_at | timestamptz | Account creation date |
| updated_at | timestamptz | Last update |

### countries

European countries with football leagues.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| code | text | ISO 3166-1 alpha-2 (e.g., 'NL') |
| name | text | English name |
| name_local | text | Native name |
| flag_emoji | text | Flag emoji |
| flag_url | text | SVG flag URL |
| region | text | Geographic region |
| football_association | text | FA name |
| fa_founded | integer | Year FA founded |

### leagues

Football leagues/competitions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| country_id | uuid | FK to countries |
| name | text | League name |
| name_local | text | Native name |
| short_name | text | Abbreviation |
| division | integer | Tier level (1-4) |
| logo_url | text | League logo |
| founded | integer | Year founded |
| teams_count | integer | Number of teams |
| season_start_month | integer | Season start (1-12) |
| api_id | text | External API reference |

### clubs

Football clubs.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| league_id | uuid | FK to leagues |
| name | text | Official club name |
| name_local | text | Native name |
| short_name | text | Common abbreviation |
| nickname | text | Fan nickname |
| founded | integer | Year founded |
| primary_colour | text | Main kit colour (hex) |
| secondary_colour | text | Secondary colour (hex) |
| logo_url | text | Club crest URL |
| website | text | Official website |
| wikipedia_url | text | Wikipedia article |
| api_id | text | External API reference |

### stadiums

Stadium information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| club_id | uuid | FK to clubs |
| name | text | Current stadium name |
| former_names | text[] | Array of historical names |
| city | text | City name |
| address | text | Full address |
| latitude | decimal | GPS latitude |
| longitude | decimal | GPS longitude |
| capacity | integer | Current capacity |
| record_attendance | integer | Highest attendance |
| record_attendance_date | date | When record was set |
| record_attendance_match | text | Match description |
| built | integer | Year built |
| renovated | integer[] | Array of renovation years |
| architect | text | Architect name |
| surface | text | 'grass', 'artificial', 'hybrid' |
| roof_type | text | 'none', 'partial', 'retractable', 'full' |
| photo_exterior_url | text | External photo |
| photo_aerial_url | text | Aerial/satellite photo |
| photo_interior_url | text | Inside photo |
| public_transport | text | How to get there |
| parking_info | text | Parking details |
| nearby_pubs | text | Recommended pubs |
| local_tips | text | Insider tips |
| history | text | Stadium history |
| interesting_facts | text[] | Array of facts |

### club_kits

Kit/shirt information per season.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| club_id | uuid | FK to clubs |
| season | text | Season (e.g., '2024-25') |
| kit_type | text | 'home', 'away', 'third', 'goalkeeper', 'european' |
| image_url | text | Kit image |
| manufacturer | text | Kit maker (Nike, Adidas, etc.) |
| sponsor | text | Main shirt sponsor |

### visits

User stadium visits.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to profiles |
| stadium_id | uuid | FK to stadiums |
| visited_at | date | Date of visit |
| match_home_team | text | Home team (if match) |
| match_away_team | text | Away team |
| match_score | text | Final score |
| match_competition | text | Competition name |
| rating | integer | User rating (1-5) |
| notes | text | Personal notes |
| weather | text | Weather conditions |
| companions | text | Who you went with |
| is_public | boolean | Show on public profile |
| created_at | timestamptz | Record created |

### photos

User-uploaded photos.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to profiles |
| visit_id | uuid | FK to visits (optional) |
| stadium_id | uuid | FK to stadiums |
| storage_path | text | Supabase storage path |
| thumbnail_path | text | Thumbnail path |
| caption | text | Photo description |
| photo_type | text | 'exterior', 'interior', 'aerial', 'ticket', 'programme', 'other' |
| taken_at | timestamptz | When photo was taken |
| is_public | boolean | Show to other users |
| created_at | timestamptz | Upload time |

### trips

Planned or completed trips.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to profiles |
| name | text | Trip name |
| description | text | Trip notes |
| start_date | date | Trip start |
| end_date | date | Trip end |
| status | text | 'planning', 'upcoming', 'active', 'completed', 'cancelled' |
| is_public | boolean | Share with others |
| share_code | text | Unique share link code |
| total_distance_km | integer | Calculated distance |
| created_at | timestamptz | Record created |
| updated_at | timestamptz | Last modified |

### trip_stops

Individual stops within a trip.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| trip_id | uuid | FK to trips |
| stadium_id | uuid | FK to stadiums |
| stop_order | integer | Sequence in trip |
| planned_date | date | Planned visit date |
| planned_time | time | Planned arrival time |
| match_id | text | External match API ID |
| notes | text | Stop-specific notes |
| transport_mode | text | 'car', 'train', 'bus', 'plane', 'other' |
| distance_from_previous_km | integer | Distance from last stop |

### achievements

Available achievements/badges.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | Unique identifier |
| name | text | Achievement name |
| description | text | How to earn it |
| icon | text | Icon/emoji |
| category | text | 'visits', 'countries', 'leagues', 'special' |
| points | integer | Points awarded |
| requirement_type | text | 'count', 'specific', 'cumulative' |
| requirement_value | jsonb | Achievement criteria |
| is_secret | boolean | Hidden until earned |

### user_achievements

Achievements earned by users.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to profiles |
| achievement_id | uuid | FK to achievements |
| earned_at | timestamptz | When earned |
| trigger_visit_id | uuid | FK to visits (what triggered it) |

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_stadiums_location ON stadiums USING gist (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_stadiums_club ON stadiums(club_id);
CREATE INDEX idx_clubs_league ON clubs(league_id);
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_stadium ON visits(stadium_id);
CREATE INDEX idx_visits_date ON visits(visited_at DESC);
CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_photos_visit ON photos(visit_id);
```

## Row Level Security (RLS)

All tables have RLS enabled. Key policies:

```sql
-- Users can only see their own visits
CREATE POLICY "Users can view own visits"
  ON visits FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view public visits
CREATE POLICY "Anyone can view public visits"
  ON visits FOR SELECT
  USING (is_public = true);

-- Anyone can view stadium data
CREATE POLICY "Stadiums are public"
  ON stadiums FOR SELECT
  TO authenticated
  USING (true);
```

## Storage Buckets

| Bucket | Purpose | Public |
|--------|---------|--------|
| avatars | User profile pictures | Yes |
| stadium-photos | User stadium photos | Depends on is_public |
| tickets | Scanned tickets/programmes | No |
| club-logos | Official club logos | Yes |
| kit-images | Kit/shirt images | Yes |

## Backup Strategy

- **Automated backups**: Supabase Pro plan includes daily backups
- **Manual export**: Users can export their data via API
- **Data format**: JSON export of all user visits, trips, photos
