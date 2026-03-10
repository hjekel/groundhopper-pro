'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createClient } from '@supabase/supabase-js';
import { Search, X, Check, Star, Calendar, Plus, Loader2, MapPin, ExternalLink, Filter, ChevronDown, BarChart3 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Club suggestions database for smart search (top-level clubs)
const CLUB_SUGGESTIONS: { club: string; stadium: string; city: string; country: string; color: string; aliases?: string[] }[] = [
  // Eredivisie
  { club: 'Ajax', stadium: 'Johan Cruijff ArenA', city: 'Amsterdam', country: 'Nederland', color: '#D2122E', aliases: ['afc ajax'] },
  { club: 'PSV', stadium: 'Philips Stadion', city: 'Eindhoven', country: 'Nederland', color: '#ED1C24', aliases: ['psv eindhoven'] },
  { club: 'Feyenoord', stadium: 'De Kuip', city: 'Rotterdam', country: 'Nederland', color: '#EE0000' },
  { club: 'AZ', stadium: 'AFAS Stadion', city: 'Alkmaar', country: 'Nederland', color: '#CC0000', aliases: ['az alkmaar'] },
  { club: 'FC Twente', stadium: 'De Grolsch Veste', city: 'Enschede', country: 'Nederland', color: '#E4002B' },
  { club: 'FC Utrecht', stadium: 'Stadion Galgenwaard', city: 'Utrecht', country: 'Nederland', color: '#D00027' },
  { club: 'Sparta Rotterdam', stadium: 'Het Kasteel', city: 'Rotterdam', country: 'Nederland', color: '#CC0000' },
  { club: 'sc Heerenveen', stadium: 'Abe Lenstra Stadion', city: 'Heerenveen', country: 'Nederland', color: '#0066B3', aliases: ['heerenveen'] },
  { club: 'FC Groningen', stadium: 'Euroborg', city: 'Groningen', country: 'Nederland', color: '#009639' },
  { club: 'Vitesse', stadium: 'GelreDome', city: 'Arnhem', country: 'Nederland', color: '#FFD700' },
  { club: 'NEC', stadium: 'Goffertstadion', city: 'Nijmegen', country: 'Nederland', color: '#CC0000', aliases: ['nec nijmegen'] },
  { club: 'Go Ahead Eagles', stadium: 'De Adelaarshorst', city: 'Deventer', country: 'Nederland', color: '#E30613' },
  { club: 'PEC Zwolle', stadium: 'MAC³PARK stadion', city: 'Zwolle', country: 'Nederland', color: '#003DA5' },
  { club: 'Fortuna Sittard', stadium: 'Fortuna Sittard Stadion', city: 'Sittard', country: 'Nederland', color: '#006633' },
  { club: 'Heracles Almelo', stadium: 'Erve Asito', city: 'Almelo', country: 'Nederland', color: '#000000', aliases: ['heracles'] },
  { club: 'Willem II', stadium: 'Koning Willem II Stadion', city: 'Tilburg', country: 'Nederland', color: '#CC0000' },
  { club: 'NAC Breda', stadium: 'Rat Verlegh Stadion', city: 'Breda', country: 'Nederland', color: '#FFD700', aliases: ['nac'] },
  { club: 'RKC Waalwijk', stadium: 'Mandemakers Stadion', city: 'Waalwijk', country: 'Nederland', color: '#FFD700', aliases: ['rkc'] },
  // Premier League
  { club: 'Arsenal', stadium: 'Emirates Stadium', city: 'London', country: 'England', color: '#EF0107' },
  { club: 'Manchester City', stadium: 'Etihad Stadium', city: 'Manchester', country: 'England', color: '#6CABDD', aliases: ['man city'] },
  { club: 'Manchester United', stadium: 'Old Trafford', city: 'Manchester', country: 'England', color: '#DA291C', aliases: ['man utd', 'man united'] },
  { club: 'Liverpool', stadium: 'Anfield', city: 'Liverpool', country: 'England', color: '#C8102E', aliases: ['liverpool fc'] },
  { club: 'Chelsea', stadium: 'Stamford Bridge', city: 'London', country: 'England', color: '#034694' },
  { club: 'Tottenham Hotspur', stadium: 'Tottenham Hotspur Stadium', city: 'London', country: 'England', color: '#132257', aliases: ['spurs', 'tottenham'] },
  { club: 'Newcastle United', stadium: "St. James' Park", city: 'Newcastle', country: 'England', color: '#241F20', aliases: ['newcastle'] },
  { club: 'Aston Villa', stadium: 'Villa Park', city: 'Birmingham', country: 'England', color: '#670E36' },
  { club: 'West Ham United', stadium: 'London Stadium', city: 'London', country: 'England', color: '#7A263A', aliases: ['west ham'] },
  { club: 'Brighton & Hove Albion', stadium: 'Amex Stadium', city: 'Brighton', country: 'England', color: '#0057B8', aliases: ['brighton'] },
  { club: 'Crystal Palace', stadium: 'Selhurst Park', city: 'London', country: 'England', color: '#1B458F' },
  { club: 'Wolverhampton Wanderers', stadium: 'Molineux Stadium', city: 'Wolverhampton', country: 'England', color: '#FDB913', aliases: ['wolves'] },
  { club: 'Fulham', stadium: 'Craven Cottage', city: 'London', country: 'England', color: '#000000' },
  { club: 'Everton', stadium: 'Goodison Park', city: 'Liverpool', country: 'England', color: '#003399' },
  { club: 'Brentford', stadium: 'Gtech Community Stadium', city: 'London', country: 'England', color: '#E30613' },
  { club: 'Nottingham Forest', stadium: 'City Ground', city: 'Nottingham', country: 'England', color: '#DD0000' },
  // Bundesliga
  { club: 'Bayern Munich', stadium: 'Allianz Arena', city: 'Munich', country: 'Deutschland', color: '#DC052D', aliases: ['bayern', 'bayern munchen', 'fc bayern'] },
  { club: 'Borussia Dortmund', stadium: 'Signal Iduna Park', city: 'Dortmund', country: 'Deutschland', color: '#FDE100', aliases: ['bvb', 'dortmund'] },
  { club: 'RB Leipzig', stadium: 'Red Bull Arena', city: 'Leipzig', country: 'Deutschland', color: '#DD0741', aliases: ['leipzig'] },
  { club: 'Bayer Leverkusen', stadium: 'BayArena', city: 'Leverkusen', country: 'Deutschland', color: '#E32221', aliases: ['leverkusen'] },
  { club: 'Eintracht Frankfurt', stadium: 'Deutsche Bank Park', city: 'Frankfurt', country: 'Deutschland', color: '#E1000F', aliases: ['frankfurt'] },
  { club: 'VfB Stuttgart', stadium: 'MHPArena', city: 'Stuttgart', country: 'Deutschland', color: '#E32219', aliases: ['stuttgart'] },
  { club: 'Borussia Mönchengladbach', stadium: 'Borussia-Park', city: 'Mönchengladbach', country: 'Deutschland', color: '#000000', aliases: ['gladbach', 'monchengladbach'] },
  { club: 'SC Freiburg', stadium: 'Europa-Park Stadion', city: 'Freiburg', country: 'Deutschland', color: '#E4002B', aliases: ['freiburg'] },
  { club: '1. FC Union Berlin', stadium: 'Stadion An der Alten Försterei', city: 'Berlin', country: 'Deutschland', color: '#EB1923', aliases: ['union berlin'] },
  { club: 'Werder Bremen', stadium: 'Wohninvest Weserstadion', city: 'Bremen', country: 'Deutschland', color: '#1D9053', aliases: ['bremen'] },
  { club: '1. FC Köln', stadium: 'RheinEnergieStadion', city: 'Cologne', country: 'Deutschland', color: '#ED1C24', aliases: ['koln', 'cologne', 'fc koln'] },
  { club: 'FC St. Pauli', stadium: 'Millerntor-Stadion', city: 'Hamburg', country: 'Deutschland', color: '#6C4023', aliases: ['st pauli', 'st. pauli', 'sankt pauli'] },
  { club: 'Hamburger SV', stadium: 'Volksparkstadion', city: 'Hamburg', country: 'Deutschland', color: '#005B9A', aliases: ['hsv', 'hamburg'] },
  { club: 'FC Schalke 04', stadium: 'Veltins-Arena', city: 'Gelsenkirchen', country: 'Deutschland', color: '#004D9D', aliases: ['schalke'] },
  { club: 'Hertha BSC', stadium: 'Olympiastadion', city: 'Berlin', country: 'Deutschland', color: '#005DAA', aliases: ['hertha berlin'] },
  // La Liga
  { club: 'FC Barcelona', stadium: 'Spotify Camp Nou', city: 'Barcelona', country: 'España', color: '#A50044', aliases: ['barca', 'barcelona'] },
  { club: 'Real Madrid', stadium: 'Santiago Bernabéu', city: 'Madrid', country: 'España', color: '#FEBE10', aliases: ['real'] },
  { club: 'Atlético Madrid', stadium: 'Cívitas Metropolitano', city: 'Madrid', country: 'España', color: '#CB3524', aliases: ['atletico', 'atletico madrid'] },
  { club: 'Sevilla FC', stadium: 'Ramón Sánchez Pizjuán', city: 'Sevilla', country: 'España', color: '#D4021D', aliases: ['sevilla'] },
  { club: 'Real Betis', stadium: 'Benito Villamarín', city: 'Sevilla', country: 'España', color: '#00954C', aliases: ['betis'] },
  { club: 'Real Sociedad', stadium: 'Reale Arena', city: 'San Sebastián', country: 'España', color: '#003DA5', aliases: ['sociedad'] },
  { club: 'Athletic Club', stadium: 'San Mamés', city: 'Bilbao', country: 'España', color: '#EE2523', aliases: ['athletic bilbao', 'bilbao'] },
  { club: 'Valencia CF', stadium: 'Mestalla', city: 'Valencia', country: 'España', color: '#EE3524', aliases: ['valencia'] },
  // Serie A
  { club: 'Inter Milan', stadium: 'San Siro', city: 'Milan', country: 'Italia', color: '#0068A8', aliases: ['inter', 'internazionale'] },
  { club: 'AC Milan', stadium: 'San Siro', city: 'Milan', country: 'Italia', color: '#FB090B', aliases: ['milan'] },
  { club: 'Juventus', stadium: 'Allianz Stadium', city: 'Turin', country: 'Italia', color: '#000000', aliases: ['juve'] },
  { club: 'SSC Napoli', stadium: 'Stadio Diego Armando Maradona', city: 'Naples', country: 'Italia', color: '#12A0D7', aliases: ['napoli'] },
  { club: 'AS Roma', stadium: 'Stadio Olimpico', city: 'Rome', country: 'Italia', color: '#8E1F2F', aliases: ['roma'] },
  { club: 'Atalanta', stadium: 'Gewiss Stadium', city: 'Bergamo', country: 'Italia', color: '#1E71B8' },
  // Ligue 1
  { club: 'Paris Saint-Germain', stadium: 'Parc des Princes', city: 'Paris', country: 'France', color: '#004170', aliases: ['psg'] },
  { club: 'Olympique de Marseille', stadium: 'Stade Vélodrome', city: 'Marseille', country: 'France', color: '#2FAEE0', aliases: ['marseille', 'om'] },
  { club: 'Olympique Lyonnais', stadium: 'Groupama Stadium', city: 'Lyon', country: 'France', color: '#1A3E8F', aliases: ['lyon', 'ol'] },
  // Other popular clubs
  { club: 'Celtic', stadium: 'Celtic Park', city: 'Glasgow', country: 'Scotland', color: '#16973B' },
  { club: 'Rangers', stadium: 'Ibrox Stadium', city: 'Glasgow', country: 'Scotland', color: '#0033A0' },
  { club: 'Benfica', stadium: 'Estádio da Luz', city: 'Lisbon', country: 'Portugal', color: '#FF0000', aliases: ['sl benfica'] },
  { club: 'FC Porto', stadium: 'Estádio do Dragão', city: 'Porto', country: 'Portugal', color: '#003A70', aliases: ['porto'] },
  { club: 'Sporting CP', stadium: 'Estádio José Alvalade', city: 'Lisbon', country: 'Portugal', color: '#00843D', aliases: ['sporting'] },
  { club: 'Galatasaray', stadium: 'RAMS Park', city: 'Istanbul', country: 'Turkey', color: '#FFCD00' },
  { club: 'Fenerbahçe', stadium: 'Şükrü Saracoğlu Stadium', city: 'Istanbul', country: 'Turkey', color: '#FFED00', aliases: ['fenerbahce'] },
  { club: 'Beşiktaş', stadium: 'Vodafone Park', city: 'Istanbul', country: 'Turkey', color: '#000000', aliases: ['besiktas'] },
  { club: 'Club Brugge', stadium: 'Jan Breydelstadion', city: 'Bruges', country: 'België', color: '#0066B3', aliases: ['brugge'] },
  { club: 'RSC Anderlecht', stadium: 'Lotto Park', city: 'Brussels', country: 'België', color: '#66008C', aliases: ['anderlecht'] },
  { club: 'Red Bull Salzburg', stadium: 'Red Bull Arena', city: 'Salzburg', country: 'Österreich', color: '#DD0741', aliases: ['salzburg'] },
  { club: 'Rapid Wien', stadium: 'Allianz Stadion', city: 'Vienna', country: 'Österreich', color: '#009639', aliases: ['rapid vienna'] },
];

const createClubIcon = (primaryColor: string, isSparta: boolean = false, isVisited: boolean = false, isWishlist: boolean = false, isCustom: boolean = false) => {
  const color = primaryColor || '#ef4444';
  
  if (isCustom && !isVisited && !isWishlist) {
    const svg = `
      <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-c" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path d="M18 0C8.059 0 0 8.059 0 18c0 9.941 18 26 18 26s18-16.059 18-26C36 8.059 27.941 0 18 0z"
              fill="${color}" filter="url(#shadow-c)" stroke="#8b5cf6" stroke-width="2.5"/>
        <circle cx="18" cy="17" r="8" fill="white"/>
        <text x="18" y="21" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}">+</text>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: 'custom-stadium-marker custom-added',
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      popupAnchor: [0, -44],
    });
  }

  if (isVisited) {
    const svg = `
      <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-v" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path d="M18 0C8.059 0 0 8.059 0 18c0 9.941 18 26 18 26s18-16.059 18-26C36 8.059 27.941 0 18 0z"
              fill="${color}" filter="url(#shadow-v)" stroke="#22c55e" stroke-width="3"/>
        <circle cx="18" cy="17" r="8" fill="white"/>
        <path d="M13 17 L16 20 L23 13" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: 'custom-stadium-marker visited',
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      popupAnchor: [0, -44],
    });
  }

  if (isWishlist) {
    const svg = `
      <svg width="36" height="44" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-w" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path d="M18 0C8.059 0 0 8.059 0 18c0 9.941 18 26 18 26s18-16.059 18-26C36 8.059 27.941 0 18 0z"
              fill="${color}" filter="url(#shadow-w)" stroke="#eab308" stroke-width="2"/>
        <circle cx="18" cy="17" r="8" fill="white"/>
        <polygon points="18,12 19.5,16 24,16 20.5,18.5 22,23 18,20 14,23 15.5,18.5 12,16 16.5,16" fill="#eab308"/>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: 'custom-stadium-marker wishlist',
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      popupAnchor: [0, -44],
    });
  }

  if (isSparta) {
    const svg = `
      <svg width="48" height="56" viewBox="0 0 48 56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="sparta-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feFlood flood-color="#FFD700" flood-opacity="0.6"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="24" cy="22" r="20" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.5" class="sparta-pulse"/>
        <path d="M24 4C13.507 4 5 12.507 5 23c0 10.493 19 29 19 29s19-18.507 19-29C43 12.507 34.493 4 24 4z"
              fill="#CC0000" filter="url(#sparta-glow)" stroke="#FFD700" stroke-width="2"/>
        <circle cx="24" cy="22" r="10" fill="white"/>
        <text x="24" y="26" text-anchor="middle" font-size="12" fill="#CC0000">S</text>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: 'custom-stadium-marker sparta-special',
      iconSize: [48, 56],
      iconAnchor: [24, 56],
      popupAnchor: [0, -56],
    });
  }

  const svg = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-d" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
            fill="${color}" filter="url(#shadow-d)"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-stadium-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
    map.setMaxBounds(bounds);
    map.setMinZoom(3);
    map.setMaxZoom(18);
    map.on('drag', () => map.panInsideBounds(bounds, { animate: false }));
  }, [map]);
  return null;
}

function FlyToStadium({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 14, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
}

// Geocoding function using Nominatim (free, no API key needed)
async function geocodeLocation(query: string): Promise<{ lat: number; lng: number; display_name: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { 'User-Agent': 'GroundhopperPro/1.0' } }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return { 
        lat: parseFloat(data[0].lat), 
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name 
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

interface Stadium {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  city?: string;
  address?: string;
  built_year?: number;
  image_url?: string;
  club?: {
    id: string;
    name: string;
    short_name: string;
    primary_color?: string;
    secondary_color?: string;
    crest_url?: string;
    current_league?: { division: number; name: string } | null;
  } | null;
}

interface CustomStadium {
  id: string;
  name: string;
  club_name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  primary_color?: string;
  notes?: string;
  created_at: string;
}

interface Visit {
  stadium_id: string;
  visit_date: string | null;
  notes?: string;
}

interface WishlistItem {
  stadium_id: string;
  priority: number;
  notes?: string;
}

interface StadiumMapProps {
  stadiums: Stadium[];
  theme: 'dark' | 'light';
  lang: 'nl' | 'en';
}

const tr = (lang: string, nl: string, en: string) => lang === 'nl' ? nl : en;

export default function StadiumMap({ stadiums, theme, lang }: StadiumMapProps) {
  const [mounted, setMounted] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [customStadiums, setCustomStadiums] = useState<CustomStadium[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStadium, setSelectedStadium] = useState<{ lat: number; lng: number } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [visitDate, setVisitDate] = useState('');
  
  // Add stadium modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [foundLocation, setFoundLocation] = useState<{ lat: number; lng: number; display_name: string } | null>(null);
  const [existingMatch, setExistingMatch] = useState<Stadium | null>(null);
  const [newStadium, setNewStadium] = useState({
    name: '',
    club_name: '',
    city: '',
    country: '',
    capacity: '',
    primary_color: '#ef4444',
    notes: ''
  });
  const [showClubSuggestions, setShowClubSuggestions] = useState(false);
  const [clubSuggestionQuery, setClubSuggestionQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterLeague, setFilterLeague] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visited' | 'not_visited' | 'wishlist'>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    const [visitsRes, wishlistRes, customRes] = await Promise.all([
      supabase.from('bram_visits').select('stadium_id, visit_date, notes'),
      supabase.from('bram_wishlist').select('stadium_id, priority, notes'),
      supabase.from('bram_custom_stadiums').select('*')
    ]);
    if (visitsRes.data) setVisits(visitsRes.data);
    if (wishlistRes.data) setWishlist(wishlistRes.data);
    if (customRes.data) setCustomStadiums(customRes.data);
  };

  const toggleVisit = async (stadiumId: string, date?: string) => {
    const existing = visits.find(v => v.stadium_id === stadiumId);
    if (existing) {
      await supabase.from('bram_visits').delete().eq('stadium_id', stadiumId);
      setVisits(visits.filter(v => v.stadium_id !== stadiumId));
    } else {
      const { data } = await supabase.from('bram_visits').insert({ 
        stadium_id: stadiumId, 
        visit_date: date || null 
      }).select().single();
      if (data) setVisits([...visits, data]);
    }
    // Remove from wishlist if marking as visited
    if (!existing && wishlist.find(w => w.stadium_id === stadiumId)) {
      await supabase.from('bram_wishlist').delete().eq('stadium_id', stadiumId);
      setWishlist(wishlist.filter(w => w.stadium_id !== stadiumId));
    }
    setShowDatePicker(null);
  };

  const toggleWishlist = async (stadiumId: string) => {
    // Check if already visited - if so, don't add to wishlist
    if (visits.find(v => v.stadium_id === stadiumId)) {
      return;
    }
    
    const existing = wishlist.find(w => w.stadium_id === stadiumId);
    if (existing) {
      const { error } = await supabase.from('bram_wishlist').delete().eq('stadium_id', stadiumId);
      if (!error) {
        setWishlist(wishlist.filter(w => w.stadium_id !== stadiumId));
      }
    } else {
      const { data, error } = await supabase.from('bram_wishlist').insert({ 
        stadium_id: stadiumId,
        priority: 1
      }).select().single();
      if (!error && data) {
        setWishlist([...wishlist, data]);
      } else {
        console.error('Wishlist error:', error);
      }
    }
  };

  // Search for location before adding
  const handleSearchLocation = async () => {
    if (!newStadium.name || !newStadium.city) {
      setSearchError(tr(lang, 'Vul minimaal stadion naam en stad in', 'Please fill in at least stadium name and city'));
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setFoundLocation(null);
    setExistingMatch(null);

    // Check if stadium already exists in database
    const searchName = newStadium.name.toLowerCase();
    const searchCity = newStadium.city.toLowerCase();
    const searchClub = newStadium.club_name.toLowerCase();
    
    const existing = allStadiums.find(s => 
      s.name.toLowerCase().includes(searchName) ||
      s.name.toLowerCase().includes(searchCity) ||
      s.club?.name.toLowerCase().includes(searchClub) ||
      (s.city?.toLowerCase().includes(searchCity) && s.club?.name.toLowerCase().includes(searchClub))
    );

    if (existing) {
      setExistingMatch(existing);
      setIsSearching(false);
      return;
    }

    // Try to find the location
    const searchQueries = [
      `${newStadium.name} stadium ${newStadium.city}`,
      `${newStadium.name} ${newStadium.city}`,
      `${newStadium.club_name} stadium ${newStadium.city}`,
      `stadium ${newStadium.city}`
    ];

    let location = null;
    for (const query of searchQueries) {
      location = await geocodeLocation(query);
      if (location) break;
    }

    setIsSearching(false);

    if (!location) {
      setSearchError(tr(lang, 
        'Locatie niet gevonden. Probeer een andere stadion naam of stad.', 
        'Location not found. Try a different stadium name or city.'
      ));
      return;
    }

    setFoundLocation(location);
  };

  const handleAddStadium = async () => {
    if (!foundLocation) {
      setSearchError(tr(lang, 'Zoek eerst de locatie op', 'Search for the location first'));
      return;
    }

    const { data, error } = await supabase.from('bram_custom_stadiums').insert({
      name: newStadium.name,
      club_name: newStadium.club_name || null,
      city: newStadium.city,
      country: newStadium.country || null,
      latitude: foundLocation.lat,
      longitude: foundLocation.lng,
      capacity: newStadium.capacity ? parseInt(newStadium.capacity) : null,
      primary_color: newStadium.primary_color,
      notes: newStadium.notes || null
    }).select().single();

    if (error) {
      console.error('Error adding stadium:', error);
      setSearchError(tr(lang, 'Fout bij toevoegen: ' + error.message, 'Error adding: ' + error.message));
      return;
    }

    if (data) {
      setCustomStadiums([...customStadiums, data]);
      setShowAddModal(false);
      resetAddForm();
      // Fly to new stadium
      setSelectedStadium({ lat: data.latitude, lng: data.longitude });
    }
  };

  const resetAddForm = () => {
    setNewStadium({
      name: '',
      club_name: '',
      city: '',
      country: '',
      capacity: '',
      primary_color: '#ef4444',
      notes: ''
    });
    setSearchError('');
    setFoundLocation(null);
    setExistingMatch(null);
    setShowClubSuggestions(false);
    setClubSuggestionQuery('');
  };

  const goToExistingStadium = () => {
    if (existingMatch) {
      setSelectedStadium({ lat: existingMatch.latitude, lng: existingMatch.longitude });
      setShowAddModal(false);
      resetAddForm();
    }
  };

  const deleteCustomStadium = async (id: string) => {
    if (!confirm(tr(lang, 'Weet je zeker dat je dit stadion wilt verwijderen?', 'Are you sure you want to delete this stadium?'))) {
      return;
    }
    await supabase.from('bram_custom_stadiums').delete().eq('id', id);
    setCustomStadiums(customStadiums.filter(s => s.id !== id));
  };

  const filteredClubSuggestions = useMemo(() => {
    if (!clubSuggestionQuery || clubSuggestionQuery.length < 2) return [];
    const q = clubSuggestionQuery.toLowerCase();
    return CLUB_SUGGESTIONS.filter(s =>
      s.club.toLowerCase().includes(q) ||
      s.stadium.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.aliases?.some(a => a.includes(q))
    ).slice(0, 6);
  }, [clubSuggestionQuery]);

  const selectClubSuggestion = (suggestion: typeof CLUB_SUGGESTIONS[0]) => {
    setNewStadium(prev => ({
      ...prev,
      club_name: suggestion.club,
      name: suggestion.stadium,
      city: suggestion.city,
      country: suggestion.country,
      primary_color: suggestion.color,
    }));
    setShowClubSuggestions(false);
    setClubSuggestionQuery('');
    setFoundLocation(null);
    setExistingMatch(null);
  };

  const allStadiums = useMemo(() => {
    const customAsStadiums: Stadium[] = customStadiums.map(cs => ({
      id: `custom-${cs.id}`,
      name: cs.name,
      latitude: cs.latitude,
      longitude: cs.longitude,
      capacity: cs.capacity,
      city: cs.city,
      club: {
        id: `custom-club-${cs.id}`,
        name: cs.club_name || cs.name,
        short_name: (cs.club_name || cs.name).substring(0, 3).toUpperCase(),
        primary_color: cs.primary_color || '#8b5cf6',
        secondary_color: undefined,
        current_league: null
      }
    }));
    return [...stadiums, ...customAsStadiums];
  }, [stadiums, customStadiums]);

  const availableLeagues = useMemo(() => {
    const leagues = new Map<string, string>();
    allStadiums.forEach(s => {
      if (s.club?.current_league) {
        leagues.set(s.club.current_league.name, s.club.current_league.name);
      }
    });
    return Array.from(leagues.values()).sort();
  }, [allStadiums]);

  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    allStadiums.forEach(s => {
      if (s.city) {
        const league = s.club?.current_league;
        if (league) {
          // Derive country from known leagues
          const leagueCountry: Record<string, string> = {
            'Eredivisie': 'Nederland', 'Eerste Divisie': 'Nederland',
            'Premier League': 'England', 'Championship': 'England',
            'Bundesliga': 'Deutschland', '2. Bundesliga': 'Deutschland', '3. Liga': 'Deutschland',
            'La Liga': 'España', 'Serie A': 'Italia', 'Ligue 1': 'France',
            'Pro League': 'België', 'Challenger Pro League': 'België',
            'NIFL Premiership': 'Northern Ireland',
          };
          if (leagueCountry[league.name]) countries.add(leagueCountry[league.name]);
        }
      }
    });
    return Array.from(countries).sort();
  }, [allStadiums]);

  const filteredStadiums = useMemo(() => {
    let result = allStadiums;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.club?.name.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q)
      );
    }

    // League filter
    if (filterLeague !== 'all') {
      result = result.filter(s => s.club?.current_league?.name === filterLeague);
    }

    // Country filter
    if (filterCountry !== 'all') {
      const leaguesByCountry: Record<string, string[]> = {
        'Nederland': ['Eredivisie', 'Eerste Divisie'],
        'England': ['Premier League', 'Championship'],
        'Deutschland': ['Bundesliga', '2. Bundesliga', '3. Liga'],
        'España': ['La Liga'],
        'Italia': ['Serie A'],
        'France': ['Ligue 1'],
        'België': ['Pro League', 'Challenger Pro League'],
        'Northern Ireland': ['NIFL Premiership'],
      };
      const countryLeagues = leaguesByCountry[filterCountry] || [];
      result = result.filter(s => s.club?.current_league && countryLeagues.includes(s.club.current_league.name));
    }

    // Status filter
    if (filterStatus === 'visited') {
      result = result.filter(s => visits.some(v => v.stadium_id === s.id));
    } else if (filterStatus === 'not_visited') {
      result = result.filter(s => !visits.some(v => v.stadium_id === s.id));
    } else if (filterStatus === 'wishlist') {
      result = result.filter(s => wishlist.some(w => w.stadium_id === s.id));
    }

    return result;
  }, [allStadiums, searchQuery, filterLeague, filterCountry, filterStatus, visits, wishlist]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    return filteredStadiums.slice(0, 8);
  }, [filteredStadiums, searchQuery]);

  const leagueStats = useMemo(() => {
    const stats: { league: string; total: number; visited: number; color: string }[] = [];
    const leagueMap = new Map<string, { total: number; visited: number }>();

    allStadiums.forEach(s => {
      const league = s.club?.current_league?.name || tr(lang, 'Eigen toevoegingen', 'Custom stadiums');
      if (!leagueMap.has(league)) leagueMap.set(league, { total: 0, visited: 0 });
      const entry = leagueMap.get(league)!;
      entry.total++;
      if (visits.some(v => v.stadium_id === s.id)) entry.visited++;
    });

    const leagueColors: Record<string, string> = {
      'Eredivisie': '#E30613', 'Eerste Divisie': '#FF8C00', 'Bundesliga': '#D20515',
      'Premier League': '#3D195B', 'La Liga': '#EE2A24', 'Serie A': '#008FD7',
      'Ligue 1': '#DCD509', 'Pro League': '#1D1160', 'Challenger Pro League': '#FF6B00',
      'NIFL Premiership': '#006400', '3. Liga': '#000000',
    };

    leagueMap.forEach((val, key) => {
      stats.push({ league: key, total: val.total, visited: val.visited, color: leagueColors[key] || '#6b7280' });
    });

    return stats.sort((a, b) => b.total - a.total);
  }, [allStadiums, visits, lang]);

  if (!mounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <div className={theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}>
          {tr(lang, 'Kaart laden...', 'Loading map...')}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Search box */}
      <div className="absolute top-20 left-4 z-[1001] w-72">
        <div className={`relative rounded-lg shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder={tr(lang, 'Zoek stadion, club of stad...', 'Search stadium, club or city...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-8 py-2.5 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-slate-800 text-white placeholder-slate-400 border border-slate-700' 
                : 'bg-white text-slate-900 placeholder-slate-500 border border-slate-200'
            }`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
            </button>
          )}
        </div>
        
        {searchResults.length > 0 && (
          <div className={`mt-1 rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            {searchResults.map(stadium => (
              <button
                key={stadium.id}
                onClick={() => {
                  setSelectedStadium({ lat: stadium.latitude, lng: stadium.longitude });
                  setSearchQuery('');
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 ${
                  theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: stadium.club?.primary_color || '#6b7280' }}
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {stadium.club?.name || stadium.name}
                  </div>
                  <div className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stadium.name} - {stadium.city}
                  </div>
                </div>
                {visits.find(v => v.stadium_id === stadium.id) && (
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                {stadium.id.startsWith('custom-') && (
                  <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded flex-shrink-0">
                    {tr(lang, 'eigen', 'custom')}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`mt-2 w-full px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center justify-between transition ${
            showFilters || filterLeague !== 'all' || filterStatus !== 'all' || filterCountry !== 'all'
              ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              : theme === 'dark' ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {tr(lang, 'Filters', 'Filters')}
            {(filterLeague !== 'all' || filterStatus !== 'all' || filterCountry !== 'all') && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                theme === 'dark' || showFilters || filterLeague !== 'all' || filterStatus !== 'all' || filterCountry !== 'all'
                  ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {[filterLeague !== 'all', filterStatus !== 'all', filterCountry !== 'all'].filter(Boolean).length}
              </span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filter panel */}
        {showFilters && (
          <div className={`mt-1 p-3 rounded-lg shadow-lg space-y-3 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            {/* Status filter */}
            <div>
              <label className={`text-xs font-medium mb-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {tr(lang, 'Status', 'Status')}
              </label>
              <div className="flex flex-wrap gap-1">
                {([
                  { value: 'all', label: tr(lang, 'Alle', 'All') },
                  { value: 'visited', label: tr(lang, 'Bezocht', 'Visited') },
                  { value: 'not_visited', label: tr(lang, 'Nog niet', 'Not yet') },
                  { value: 'wishlist', label: tr(lang, 'Wishlist', 'Wishlist') },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterStatus(opt.value)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      filterStatus === opt.value
                        ? opt.value === 'visited' ? 'bg-green-600 text-white'
                          : opt.value === 'wishlist' ? 'bg-yellow-500 text-white'
                          : opt.value === 'not_visited' ? 'bg-slate-600 text-white'
                          : 'bg-blue-600 text-white'
                        : theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.value === 'visited' && '✓ '}{opt.value === 'wishlist' && '★ '}{opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Country filter */}
            <div>
              <label className={`text-xs font-medium mb-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {tr(lang, 'Land', 'Country')}
              </label>
              <select
                value={filterCountry}
                onChange={(e) => { setFilterCountry(e.target.value); setFilterLeague('all'); }}
                className={`w-full px-2.5 py-1.5 rounded text-sm ${
                  theme === 'dark' ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-50 text-slate-900 border-slate-200'
                } border`}
              >
                <option value="all">{tr(lang, 'Alle landen', 'All countries')}</option>
                {availableCountries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* League filter */}
            <div>
              <label className={`text-xs font-medium mb-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {tr(lang, 'Competitie', 'League')}
              </label>
              <select
                value={filterLeague}
                onChange={(e) => setFilterLeague(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded text-sm ${
                  theme === 'dark' ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-50 text-slate-900 border-slate-200'
                } border`}
              >
                <option value="all">{tr(lang, 'Alle competities', 'All leagues')}</option>
                {availableLeagues.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Active filter count + reset */}
            {(filterLeague !== 'all' || filterStatus !== 'all' || filterCountry !== 'all') && (
              <div className="flex items-center justify-between pt-1">
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {filteredStadiums.length} {tr(lang, 'stadions', 'stadiums')}
                </span>
                <button
                  onClick={() => { setFilterLeague('all'); setFilterStatus('all'); setFilterCountry('all'); }}
                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  {tr(lang, 'Reset filters', 'Reset filters')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats and Add button */}
      <div className={`absolute top-20 right-4 z-[1001] flex flex-col items-end gap-2 w-72`}>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-4 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 transition ${
              theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            {tr(lang, 'Stadion toevoegen', 'Add stadium')}
          </button>

          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-4 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 transition ${
              showStats
                ? 'bg-green-600 text-white'
                : theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <Check className="w-3.5 h-3.5 text-green-500" />
            <span className="font-bold">{visits.length}</span>
            <span className={showStats ? 'text-green-200' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>/ {allStadiums.length}</span>
          </button>
        </div>

        {/* Stats Dashboard */}
        {showStats && (
          <div className={`w-full rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`p-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              {/* Overall progress */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tr(lang, 'Totale voortgang', 'Total progress')}
                </span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {allStadiums.length > 0 ? Math.round((visits.length / allStadiums.length) * 100) : 0}%
                </span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${allStadiums.length > 0 ? (visits.length / allStadiums.length) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{visits.length} {tr(lang, 'bezocht', 'visited')}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{wishlist.length} {tr(lang, 'wishlist', 'wishlist')}</span>
                  </span>
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {allStadiums.length - visits.length} {tr(lang, 'te gaan', 'to go')}
                </span>
              </div>
            </div>

            {/* Per league breakdown */}
            <div className="p-3 max-h-60 overflow-y-auto space-y-2.5">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {tr(lang, 'Per competitie', 'By league')}
              </span>
              {leagueStats.map((ls) => (
                <div key={ls.league}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ls.color }} />
                      <span className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {ls.league}
                      </span>
                    </div>
                    <span className={`text-xs tabular-nums ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {ls.visited}/{ls.total}
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${ls.total > 0 ? (ls.visited / ls.total) * 100 : 0}%`,
                        backgroundColor: ls.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Stadium Modal - WITH SEARCH FIRST */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAddModal(false); resetAddForm(); }} />
          <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {tr(lang, '🏟️ Nieuw stadion toevoegen', '🏟️ Add new stadium')}
              </h2>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {tr(lang, 'Vul de gegevens in en klik op "Zoek locatie"', 'Fill in the details and click "Search location"')}
              </p>
            </div>
            
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Error message */}
              {searchError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {searchError}
                </div>
              )}

              {/* Existing stadium found */}
              {existingMatch && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm font-medium mb-2">
                    {tr(lang, '⚠️ Dit stadion staat al in de database!', '⚠️ This stadium is already in the database!')}
                  </p>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong>{existingMatch.club?.name}</strong> - {existingMatch.name}, {existingMatch.city}
                  </p>
                  <button
                    onClick={goToExistingStadium}
                    className="w-full py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium"
                  >
                    {tr(lang, 'Ga naar dit stadion', 'Go to this stadium')}
                  </button>
                </div>
              )}

              {/* Location found */}
              {foundLocation && !existingMatch && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-400 text-sm font-medium mb-1">
                    {tr(lang, '✓ Locatie gevonden!', '✓ Location found!')}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {foundLocation.display_name}
                  </p>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {tr(lang, 'Stadion naam', 'Stadium name')} *
                </label>
                <input
                  type="text"
                  value={newStadium.name}
                  onChange={(e) => { setNewStadium(prev => ({ ...prev, name: e.target.value })); setFoundLocation(null); setExistingMatch(null); }}
                  placeholder={tr(lang, 'bijv. Volksparkstadion', 'e.g. Wembley Stadium')}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-400' 
                      : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>

              <div className="relative">
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {tr(lang, 'Club naam', 'Club name')} <span className={`text-xs font-normal ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>({tr(lang, 'zoek of typ', 'search or type')})</span>
                </label>
                <input
                  type="text"
                  value={showClubSuggestions ? clubSuggestionQuery : newStadium.club_name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setClubSuggestionQuery(val);
                    setShowClubSuggestions(true);
                    setNewStadium(prev => ({ ...prev, club_name: val }));
                    setFoundLocation(null);
                    setExistingMatch(null);
                  }}
                  onFocus={() => { if (newStadium.club_name.length >= 2) { setClubSuggestionQuery(newStadium.club_name); setShowClubSuggestions(true); } }}
                  onBlur={() => { setTimeout(() => setShowClubSuggestions(false), 200); }}
                  placeholder={tr(lang, 'bijv. St. Pauli, Bayern, Ajax...', 'e.g. St. Pauli, Bayern, Ajax...')}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-400'
                      : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                {/* Club suggestions dropdown */}
                {showClubSuggestions && filteredClubSuggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto ${
                    theme === 'dark' ? 'bg-slate-700 border border-slate-600' : 'bg-white border border-slate-200'
                  }`}>
                    {filteredClubSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); selectClubSuggestion(s); }}
                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition ${
                          theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-slate-50'
                        } ${i > 0 ? (theme === 'dark' ? 'border-t border-slate-600/50' : 'border-t border-slate-100') : ''}`}
                      >
                        <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.club}</div>
                          <div className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {s.stadium} — {s.city}, {s.country}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {tr(lang, 'Stad', 'City')} *
                  </label>
                  <input
                    type="text"
                    value={newStadium.city}
                    onChange={(e) => { setNewStadium(prev => ({ ...prev, city: e.target.value })); setFoundLocation(null); setExistingMatch(null); }}
                    placeholder={tr(lang, 'bijv. Hamburg', 'e.g. London')}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-400' 
                        : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                    } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {tr(lang, 'Land', 'Country')}
                  </label>
                  <input
                    type="text"
                    value={newStadium.country}
                    onChange={(e) => setNewStadium(prev => ({ ...prev, country: e.target.value }))}
                    placeholder={tr(lang, 'bijv. Duitsland', 'e.g. Germany')}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-400' 
                        : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                    } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {tr(lang, 'Capaciteit', 'Capacity')}
                  </label>
                  <input
                    type="number"
                    value={newStadium.capacity}
                    onChange={(e) => setNewStadium(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="57000"
                    className={`w-full px-3 py-2.5 rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-400' 
                        : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                    } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {tr(lang, 'Clubkleur', 'Club colour')}
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={newStadium.primary_color}
                      onChange={(e) => setNewStadium(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={newStadium.primary_color}
                      onChange={(e) => setNewStadium(prev => ({ ...prev, primary_color: e.target.value }))}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm ${
                        theme === 'dark' 
                          ? 'bg-slate-700 text-white border-slate-600' 
                          : 'bg-white text-slate-900 border-slate-300'
                      } border`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {tr(lang, 'Notities', 'Notes')}
                </label>
                <textarea
                  value={newStadium.notes}
                  onChange={(e) => setNewStadium(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={tr(lang, 'Optionele notities...', 'Optional notes...')}
                  rows={2}
                  className={`w-full px-3 py-2.5 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-400' 
                      : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
              </div>
            </div>

            <div className={`p-4 border-t space-y-2 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              {/* Search button - always visible */}
              <button
                onClick={handleSearchLocation}
                disabled={isSearching || !newStadium.name || !newStadium.city}
                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${
                  foundLocation && !existingMatch
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {tr(lang, 'Zoeken...', 'Searching...')}
                  </>
                ) : foundLocation && !existingMatch ? (
                  <>
                    <Check className="w-4 h-4" />
                    {tr(lang, 'Locatie gevonden - Opnieuw zoeken?', 'Location found - Search again?')}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    {tr(lang, 'Zoek locatie', 'Search location')}
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => { setShowAddModal(false); resetAddForm(); }}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm ${
                    theme === 'dark' 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {tr(lang, 'Annuleren', 'Cancel')}
                </button>
                <button
                  onClick={handleAddStadium}
                  disabled={!foundLocation || !!existingMatch}
                  className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {tr(lang, 'Toevoegen', 'Add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={[50.0, 10.0]}
        zoom={5}
        className="w-full h-full"
        zoomControl={false}
        worldCopyJump={false}
        maxBoundsViscosity={1.0}
      >
        <MapBounds />
        {selectedStadium && <FlyToStadium lat={selectedStadium.lat} lng={selectedStadium.lng} />}
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={theme === 'dark' 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
          noWrap={true}
        />
        <ZoomControl position="bottomright" />

        {filteredStadiums.map((stadium) => {
          const isSparta = stadium.club?.short_name === 'SPA';
          const isVisited = visits.some(v => v.stadium_id === stadium.id);
          const isOnWishlist = wishlist.some(w => w.stadium_id === stadium.id);
          const isCustom = stadium.id.startsWith('custom-');
          const visitData = visits.find(v => v.stadium_id === stadium.id);
          const customData = isCustom ? customStadiums.find(c => `custom-${c.id}` === stadium.id) : null;

          return (
            <Marker
              key={stadium.id}
              position={[stadium.latitude, stadium.longitude]}
              icon={createClubIcon(stadium.club?.primary_color || '#ef4444', isSparta, isVisited, isOnWishlist, isCustom)}
            >
              <Popup>
                <div className={`min-w-[280px] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {/* Stadium photo banner */}
                  {stadium.image_url && (
                    <div className="w-full h-36 overflow-hidden rounded-t-xl">
                      <img
                        src={stadium.image_url}
                        alt={stadium.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 border-b border-slate-700/30">
                    {/* Club logo with fallback to colored square */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <div
                        className="absolute inset-0 rounded-lg flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: stadium.club?.primary_color || '#6b7280', color: 'white' }}
                      >
                        {stadium.club?.short_name?.substring(0, 2) || '?'}
                      </div>
                      {stadium.club?.crest_url && (
                        <img
                          src={stadium.club.crest_url}
                          alt={stadium.club.name}
                          className="absolute inset-0 w-12 h-12 rounded-lg object-contain bg-white p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{stadium.club?.name || 'Unknown'}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {stadium.name}
                      </p>
                      {stadium.club?.current_league && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500 text-white">
                          {stadium.club.current_league.name}
                        </span>
                      )}
                      {isCustom && (
                        <span className="inline-block mt-1 ml-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {tr(lang, 'Eigen toevoeging', 'Custom added')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{tr(lang, 'Stad', 'City')}</span>
                      <span className="font-medium">{stadium.city || '-'}</span>
                    </div>
                    {stadium.capacity && (
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{tr(lang, 'Capaciteit', 'Capacity')}</span>
                        <span className="font-medium">{stadium.capacity.toLocaleString()}</span>
                      </div>
                    )}
                    {stadium.built_year && (
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{tr(lang, 'Gebouwd', 'Built')}</span>
                        <span className="font-medium">{stadium.built_year}</span>
                      </div>
                    )}
                    {customData?.country && (
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{tr(lang, 'Land', 'Country')}</span>
                        <span className="font-medium">{customData.country}</span>
                      </div>
                    )}
                    {customData?.notes && (
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{tr(lang, 'Notities', 'Notes')}</span>
                        <span className="font-medium text-right max-w-[180px]">{customData.notes}</span>
                      </div>
                    )}
                    {isVisited && visitData?.visit_date && (
                      <div className="flex justify-between text-green-500">
                        <span>{tr(lang, 'Bezocht', 'Visited')}</span>
                        <span className="font-medium">{new Date(visitData.visit_date).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB')}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 pt-0 space-y-2">
                    {showDatePicker === stadium.id && (
                      <div className={`p-3 rounded-lg mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <label className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {tr(lang, 'Wanneer bezocht?', 'When did you visit?')}
                        </label>
                        <input
                          type="date"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className={`w-full mt-1 px-3 py-2 rounded text-sm ${
                            theme === 'dark' ? 'bg-slate-600 text-white' : 'bg-white text-slate-900 border'
                          }`}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => toggleVisit(stadium.id, visitDate)}
                            className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                          >
                            {tr(lang, 'Opslaan', 'Save')}
                          </button>
                          <button
                            onClick={() => toggleVisit(stadium.id)}
                            className={`flex-1 py-1.5 rounded text-sm font-medium ${theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
                          >
                            {tr(lang, 'Zonder datum', 'No date')}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (isVisited) {
                          toggleVisit(stadium.id);
                        } else {
                          setShowDatePicker(stadium.id);
                          setVisitDate('');
                        }
                      }}
                      className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                        isVisited
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isVisited ? (
                        <><Check className="w-4 h-4" /> {tr(lang, 'Bezocht ✓', 'Visited ✓')}</>
                      ) : (
                        <><Calendar className="w-4 h-4" /> {tr(lang, 'Markeer als bezocht', 'Mark as visited')}</>
                      )}
                    </button>

                    {!isVisited && (
                      <button
                        onClick={() => toggleWishlist(stadium.id)}
                        className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                          isOnWishlist
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : theme === 'dark'
                              ? 'bg-slate-600 hover:bg-slate-500 text-white'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isOnWishlist ? 'fill-current' : ''}`} />
                        {isOnWishlist ? tr(lang, 'Op wishlist ★', 'On wishlist ★') : tr(lang, 'Toevoegen aan wishlist', 'Add to wishlist')}
                      </button>
                    )}

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stadium.name + ' ' + (stadium.city || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-lg font-medium text-sm text-center bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      {tr(lang, 'Open in Google Maps', 'Open in Google Maps')}
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {isCustom && (
                      <button
                        onClick={() => customData && deleteCustomStadium(customData.id)}
                        className="w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition"
                      >
                        <X className="w-4 h-4" />
                        {tr(lang, 'Verwijderen', 'Delete')}
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .custom-stadium-marker { background: transparent; border: none; }
        .custom-added { filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.4)); }
        .sparta-special { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5)); z-index: 1000 !important; }
        .sparta-pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        html.dark .leaflet-popup-content-wrapper { background: #1e293b; border-radius: 12px; padding: 0; }
        html.dark .leaflet-popup-tip { background: #1e293b; }
        html.dark .leaflet-popup-content { margin: 0; color: white; }
        html.light .leaflet-popup-content-wrapper { background: white; border-radius: 12px; padding: 0; }
        html.light .leaflet-popup-tip { background: white; }
        html.light .leaflet-popup-content { margin: 0; color: #1e293b; }
        .leaflet-popup-close-button { color: inherit !important; font-size: 20px !important; padding: 8px !important; }
      `}</style>
    </div>
  );
}
