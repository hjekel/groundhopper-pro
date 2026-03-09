// Database types for Groundhopper Pro
// These types mirror the Supabase database schema

export interface Country {
  id: string;
  name: string;
  code: string;
  code_2: string;
  flag_emoji: string | null;
  continent: string;
  created_at: string;
}

export interface League {
  id: string;
  country_id: string;
  name: string;
  short_name: string | null;
  division: number;
  league_type: 'domestic' | 'cup' | 'european' | 'international';
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  // Relations
  country?: Country;
}

export interface Club {
  id: string;
  name: string;
  short_name: string | null;
  country_id: string;
  current_league_id: string | null;
  founded_year: number | null;
  city: string | null;
  nickname: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  crest_url: string | null;
  wikipedia_url: string | null;
  official_website: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  country?: Country;
  current_league?: League;
  stadiums?: Stadium[];
  kits?: Kit[];
}

export interface Stadium {
  id: string;
  name: string;
  club_id: string | null;
  country_id: string;
  city: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  capacity: number | null;
  built_year: number | null;
  renovated_year: number | null;
  architect: string | null;
  surface: 'grass' | 'artificial' | 'hybrid';
  former_names: string[] | null;
  notable_events: string | null;
  record_attendance: number | null;
  record_attendance_match: string | null;
  record_attendance_date: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  club?: Club;
  country?: Country;
  photos?: StadiumPhoto[];
  places?: StadiumPlace[];
}

export interface StadiumPhoto {
  id: string;
  stadium_id: string;
  url: string;
  photo_type: 'exterior' | 'aerial' | 'interior' | 'historical' | 'matchday';
  caption: string | null;
  photographer: string | null;
  taken_date: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Kit {
  id: string;
  club_id: string;
  season: string;
  kit_type: 'home' | 'away' | 'third' | 'goalkeeper' | 'european';
  image_url: string | null;
  manufacturer: string | null;
  sponsor: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  home_country_id: string | null;
  favourite_club_id: string | null;
  preferred_theme: 'light' | 'dark' | 'auto';
  profile_visibility: 'public' | 'friends' | 'private';
  show_on_leaderboard: boolean;
  total_stadiums_visited: number;
  total_countries_visited: number;
  total_distance_km: number;
  created_at: string;
  updated_at: string;
  // Relations
  home_country?: Country;
  favourite_club?: Club;
}

export interface Visit {
  id: string;
  user_id: string;
  stadium_id: string;
  visit_date: string | null;
  match_home_team: string | null;
  match_away_team: string | null;
  match_score: string | null;
  match_competition: string | null;
  rating: number | null;
  atmosphere_rating: number | null;
  facilities_rating: number | null;
  stand_name: string | null;
  seat_info: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  stadium?: Stadium;
  photos?: UserPhoto[];
  notes?: UserNote[];
}

export interface UserPhoto {
  id: string;
  user_id: string;
  visit_id: string | null;
  stadium_id: string;
  storage_path: string;
  url: string;
  thumbnail_url: string | null;
  photo_type: 'stadium' | 'ticket' | 'programme' | 'selfie' | 'matchday' | 'other' | null;
  caption: string | null;
  taken_at: string | null;
  display_order: number;
  created_at: string;
}

export interface UserNote {
  id: string;
  user_id: string;
  visit_id: string | null;
  stadium_id: string;
  title: string | null;
  content: string;
  is_scan: boolean;
  scan_type: 'ticket' | 'programme' | 'newspaper' | 'other' | null;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  transport_mode: 'car' | 'train' | 'plane' | 'mixed';
  total_stadiums: number;
  total_distance_km: number | null;
  created_at: string;
  updated_at: string;
  // Relations
  stops?: TripStadium[];
}

export interface TripStadium {
  id: string;
  trip_id: string;
  stadium_id: string;
  day_number: number | null;
  visit_order: number | null;
  planned_date: string | null;
  planned_match: string | null;
  notes: string | null;
  is_confirmed: boolean;
  created_at: string;
  // Relations
  stadium?: Stadium;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  requirement_type: 'stadiums_count' | 'countries_count' | 'league_complete' | string;
  requirement_value: number | null;
  requirement_data: Record<string, any> | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  // Relations
  achievement?: Achievement;
}

export interface StadiumPlace {
  id: string;
  stadium_id: string;
  name: string;
  place_type: 'pub' | 'restaurant' | 'fanshop' | 'museum' | 'transport';
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_meters: number | null;
  description: string | null;
  tip: string | null;
  website: string | null;
  phone: string | null;
  avg_rating: number | null;
  created_at: string;
}

// Insert types (for creating new records)
export type CountryInsert = Omit<Country, 'id' | 'created_at'>;
export type LeagueInsert = Omit<League, 'id' | 'created_at' | 'country'>;
export type ClubInsert = Omit<Club, 'id' | 'created_at' | 'updated_at' | 'country' | 'current_league' | 'stadiums' | 'kits'>;
export type StadiumInsert = Omit<Stadium, 'id' | 'created_at' | 'updated_at' | 'club' | 'country' | 'photos' | 'places'>;
export type VisitInsert = Omit<Visit, 'id' | 'created_at' | 'updated_at' | 'stadium' | 'photos' | 'notes'>;
export type TripInsert = Omit<Trip, 'id' | 'created_at' | 'updated_at' | 'stops'>;
export type UserPhotoInsert = Omit<UserPhoto, 'id' | 'created_at'>;
export type UserNoteInsert = Omit<UserNote, 'id' | 'created_at' | 'updated_at'>;

// Update types
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'home_country' | 'favourite_club'>>;
export type VisitUpdate = Partial<Omit<Visit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'stadium' | 'photos' | 'notes'>>;
export type TripUpdate = Partial<Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'stops'>>;

// Stats types
export interface UserStats {
  total_stadiums: number;
  total_countries: number;
  total_visits: number;
  total_distance_km: number;
  stadiums_by_country: { country: Country; count: number }[];
  stadiums_by_division: { division: number; count: number }[];
  recent_visits: Visit[];
  achievements_earned: number;
  achievements_total: number;
}

export interface LeagueProgress {
  league: League;
  total_stadiums: number;
  visited_stadiums: number;
  percentage: number;
}

// Filter types
export interface StadiumFilters {
  country_id?: string;
  division?: number;
  visited?: 'all' | 'visited' | 'unvisited';
  search?: string;
  min_capacity?: number;
  max_capacity?: number;
}

export interface TripFilters {
  status?: Trip['status'];
  date_from?: string;
  date_to?: string;
}
