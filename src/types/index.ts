// Database types - matches Supabase schema

export interface Country {
  id: string;
  name: string;
  code: string;
  code_2: string;
  flag_emoji: string | null;
  continent: string;
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
  // Joined
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
  // Joined
  country?: Country;
  league?: League;
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
  // Joined
  club?: Club;
  country?: Country;
  photos?: StadiumPhoto[];
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
}

// User types

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
  // Joined
  stadium?: Stadium;
}

export interface UserPhoto {
  id: string;
  user_id: string;
  visit_id: string | null;
  stadium_id: string;
  storage_path: string;
  url: string;
  thumbnail_url: string | null;
  photo_type: 'stadium' | 'ticket' | 'programme' | 'selfie' | 'matchday' | 'other';
  caption: string | null;
  taken_at: string | null;
  display_order: number;
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
}

// Trip types

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
  // Joined
  trip_stadiums?: TripStadium[];
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
  // Joined
  stadium?: Stadium;
}

// Achievement types

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  requirement_type: string;
  requirement_value: number | null;
  requirement_data: Record<string, any> | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  // Joined
  achievement?: Achievement;
}

// Stadium places (pubs, restaurants, etc.)

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
}

// Filter types for the app

export interface StadiumFilters {
  country?: string;
  division?: number;
  visited?: boolean;
  search?: string;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
}

// Stats types

export interface UserStats {
  totalStadiums: number;
  totalCountries: number;
  totalLeagues: number;
  totalDistance: number;
  byCountry: {
    country: Country;
    visited: number;
    total: number;
  }[];
  byLeague: {
    league: League;
    visited: number;
    total: number;
  }[];
  recentVisits: Visit[];
  achievements: UserAchievement[];
}
