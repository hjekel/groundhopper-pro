'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createClient } from '@supabase/supabase-js';
import { Search, X, Check, Star, Calendar, Plus, Loader2, MapPin, ExternalLink, Filter, ChevronDown, BarChart3, Navigation, Clock } from 'lucide-react';
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
      tooltipAnchor: [0, -44],
    } as any);
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
      tooltipAnchor: [0, -44],
    } as any);
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
      tooltipAnchor: [0, -44],
    } as any);
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
      tooltipAnchor: [0, -56],
    } as any);
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
    tooltipAnchor: [0, -40],
  } as any);
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

// Haversine distance formula - calculates distance between two GPS coordinates in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// TheSportsDB API data cache for club details (jersey, history, stadium photo)
const clubDetailsCache = new Map<string, { jersey?: string; description?: string; formedYear?: string; stadiumThumb?: string } | null>();

function extractHistoryBullets(description?: string, formedYear?: string, lang?: string): string[] {
  const bullets: string[] = [];
  if (formedYear) {
    bullets.push(lang === 'nl' ? `Opgericht in ${formedYear}` : `Founded in ${formedYear}`);
  }
  if (description) {
    const firstPara = description.split(/\n\n|\r\n\r\n/)[0] || '';
    const sentences = firstPara.match(/[^.!?]+[.!?]+/g) || [];
    const startIdx = formedYear && sentences[0]?.includes(formedYear) ? 1 : 0;
    for (let i = startIdx; i < Math.min(startIdx + 3, sentences.length) && bullets.length < 4; i++) {
      const s = sentences[i]?.trim();
      if (s && s.length > 15 && s.length < 200) bullets.push(s);
    }
  }
  return bullets.slice(0, 4);
}

function ClubPopupDetails({ clubName, theme, lang }: { clubName: string; theme: string; lang: string }) {
  const [data, setData] = useState<{ jersey?: string; description?: string; formedYear?: string; stadiumThumb?: string } | null>(
    clubDetailsCache.get(clubName) || null
  );
  const [loading, setLoading] = useState(!clubDetailsCache.has(clubName));

  useEffect(() => {
    if (clubDetailsCache.has(clubName)) {
      setData(clubDetailsCache.get(clubName)!);
      setLoading(false);
      return;
    }
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(clubName)}`)
      .then(r => r.json())
      .then(d => {
        if (d.teams?.[0]) {
          const t = d.teams[0];
          const info = {
            jersey: t.strTeamJersey || undefined,
            description: lang === 'nl' ? (t.strDescriptionNL || t.strDescriptionEN) : (t.strDescriptionEN || ''),
            formedYear: t.intFormedYear || undefined,
            stadiumThumb: t.strStadiumThumb || undefined,
          };
          clubDetailsCache.set(clubName, info);
          setData(info);
        } else {
          clubDetailsCache.set(clubName, null);
        }
        setLoading(false);
      })
      .catch(() => { clubDetailsCache.set(clubName, null); setLoading(false); });
  }, [clubName, lang]);

  if (loading) return (
    <div className="py-2 flex justify-center">
      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!data) return null;

  const bullets = extractHistoryBullets(data.description, data.formedYear, lang);

  return (
    <div>
      {/* Jersey */}
      {data.jersey && (
        <div className={`flex justify-center py-3 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-amber-200/50'}`}>
          <img src={data.jersey} alt="Kit" className="h-24 object-contain drop-shadow-md" onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
        </div>
      )}
      {/* History bullets */}
      {bullets.length > 0 && (
        <div className={`px-4 py-2.5 text-xs space-y-1 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-amber-200/50'}`}>
          <div className={`font-bold text-[10px] uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
            {lang === 'nl' ? '📜 Geschiedenis' : '📜 History'}
          </div>
          {bullets.map((b, i) => (
            <div key={i} className={`flex gap-1.5 leading-tight ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className="text-amber-500 flex-shrink-0">•</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
    country_id?: string;
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
  const [apiSearchResults, setApiSearchResults] = useState<{ club: string; stadium: string; city: string; country: string; color: string; capacity?: string; fromApi?: boolean }[]>([]);
  const [apiSearching, setApiSearching] = useState(false);
  const apiSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterLeague, setFilterLeague] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visited' | 'not_visited' | 'wishlist'>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  // Nearest unvisited feature
  const [showNearestPanel, setShowNearestPanel] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Timeline feature
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    const [visitsRes, wishlistRes, customRes] = await Promise.all([
      supabase.from('stadium_visits').select('stadium_id, first_visit_date, notes').eq('is_wishlist', false),
      supabase.from('bram_wishlist').select('stadium_id, priority, notes'),
      supabase.from('bram_custom_stadiums').select('*')
    ]);
    if (visitsRes.data) setVisits(visitsRes.data.map(v => ({
      stadium_id: v.stadium_id,
      visit_date: v.first_visit_date,
      notes: v.notes
    })));
    if (wishlistRes.data) setWishlist(wishlistRes.data);
    if (customRes.data) setCustomStadiums(customRes.data);
  };

  const toggleVisit = async (stadiumId: string, date?: string) => {
    const existing = visits.find(v => v.stadium_id === stadiumId);
    if (existing) {
      await supabase.from('stadium_visits').delete().eq('stadium_id', stadiumId);
      setVisits(visits.filter(v => v.stadium_id !== stadiumId));
    } else {
      const { data } = await supabase.from('stadium_visits').insert({
        stadium_id: stadiumId,
        first_visit_date: date || null,
        last_visit_date: date || null,
        visit_count: 1,
        is_wishlist: false
      }).select('stadium_id, first_visit_date, notes').single();
      if (data) setVisits([...visits, {
        stadium_id: data.stadium_id,
        visit_date: data.first_visit_date,
        notes: data.notes
      }]);
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

  // Search TheSportsDB API for clubs not in local list
  const searchApiClubs = useCallback(async (query: string) => {
    if (query.length < 3) { setApiSearchResults([]); return; }
    setApiSearching(true);
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.teams) {
        const results = data.teams
          .filter((t: any) => t.strSport === 'Soccer')
          .slice(0, 8)
          .map((t: any) => {
            const loc = t.strStadiumLocation || t.strLocation || '';
            const city = loc.split(',')[0]?.trim() || '';
            return {
              club: t.strTeam,
              stadium: t.strStadium || '',
              city,
              country: t.strCountry || '',
              color: t.strColour1 ? `#${t.strColour1.replace('#', '')}` : '#6b7280',
              capacity: t.intStadiumCapacity || '',
              fromApi: true,
            };
          });
        setApiSearchResults(results);
      } else {
        setApiSearchResults([]);
      }
    } catch {
      setApiSearchResults([]);
    } finally {
      setApiSearching(false);
    }
  }, []);

  // Debounced API search when user types
  useEffect(() => {
    if (apiSearchTimer.current) clearTimeout(apiSearchTimer.current);
    if (clubSuggestionQuery.length >= 3 && showClubSuggestions) {
      apiSearchTimer.current = setTimeout(() => searchApiClubs(clubSuggestionQuery), 400);
    } else {
      setApiSearchResults([]);
    }
    return () => { if (apiSearchTimer.current) clearTimeout(apiSearchTimer.current); };
  }, [clubSuggestionQuery, showClubSuggestions, searchApiClubs]);

  const filteredClubSuggestions = useMemo(() => {
    if (!clubSuggestionQuery || clubSuggestionQuery.length < 2) return [];
    const q = clubSuggestionQuery.toLowerCase();
    const local = CLUB_SUGGESTIONS.filter(s =>
      s.club.toLowerCase().includes(q) ||
      s.stadium.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.aliases?.some(a => a.includes(q))
    ).slice(0, 6);
    // Merge local + API results, deduplicate by club name
    const localNames = new Set(local.map(s => s.club.toLowerCase()));
    const apiExtra = apiSearchResults.filter(s => !localNames.has(s.club.toLowerCase()));
    return [...local, ...apiExtra].slice(0, 8);
  }, [clubSuggestionQuery, apiSearchResults]);

  const selectClubSuggestion = (suggestion: typeof CLUB_SUGGESTIONS[0] & { capacity?: string; fromApi?: boolean }) => {
    setNewStadium(prev => ({
      ...prev,
      club_name: suggestion.club,
      name: suggestion.stadium,
      city: suggestion.city,
      country: suggestion.country,
      primary_color: suggestion.color,
      ...(suggestion.capacity ? { capacity: suggestion.capacity } : {}),
    }));
    setShowClubSuggestions(false);
    setClubSuggestionQuery('');
    setApiSearchResults([]);
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
      '2. Bundesliga': '#D20515', '3. Liga': '#8B0000', 'Premier League': '#3D195B',
      'Championship': '#1E3A5F', 'League One': '#2E8B57', 'League Two': '#4682B4',
      'La Liga': '#EE2A24', 'Serie A': '#008FD7', 'Ligue 1': '#DCD509',
      'Pro League': '#1D1160', 'Challenger Pro League': '#FF6B00',
      'Primeira Liga': '#006400', 'Scottish Premiership': '#1B1464',
      'Süper Lig': '#E30A17', 'NIFL Premiership': '#006400',
      'Superligaen': '#C8102E',
    };

    leagueMap.forEach((val, key) => {
      stats.push({ league: key, total: val.total, visited: val.visited, color: leagueColors[key] || '#6b7280' });
    });

    return stats.sort((a, b) => b.total - a.total);
  }, [allStadiums, visits, lang]);

  const countriesVisited = useMemo(() => {
    const visitedStadiumIds = new Set(visits.map(v => v.stadium_id));
    const countries = new Set<string>();
    allStadiums.forEach(s => {
      if (visitedStadiumIds.has(s.id) && s.club?.country_id) {
        countries.add(s.club.country_id);
      }
    });
    return countries.size;
  }, [allStadiums, visits]);

  // Geolocation handler for "nearest unvisited" feature
  const findNearestUnvisited = () => {
    setGeoLoading(true);
    if (!navigator.geolocation) {
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setGeoLoading(false);
        setShowNearestPanel(true);
      },
      () => {
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  // Computed nearest unvisited stadiums from user location
  const nearestUnvisited = useMemo(() => {
    if (!userLocation) return [];
    return allStadiums
      .filter(s => !visits.some(v => v.stadium_id === s.id))
      .map(s => ({
        ...s,
        distance: haversineDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [userLocation, allStadiums, visits]);

  // Timeline data: visits sorted by date with stadium info
  const timelineData = useMemo(() => {
    return visits
      .filter(v => v.visit_date)
      .map(v => {
        const stadium = allStadiums.find(s => s.id === v.stadium_id);
        return { ...v, stadium, date: new Date(v.visit_date!) };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [visits, allStadiums]);

  // Milestone badges - achievements based on Bram's groundhopping journey
  const milestones = useMemo(() => {
    const earned: { icon: string; label: string; detail: string }[] = [];
    const v = visits.length;
    const c = countriesVisited;
    const l = leagueStats.filter(ls => ls.visited > 0).length;

    if (v >= 1) earned.push({ icon: '🎯', label: tr(lang, 'Eerste Groundhop', 'First Groundhop'), detail: '1' });
    if (v >= 10) earned.push({ icon: '🔟', label: tr(lang, 'Dubbele Cijfers', 'Double Digits'), detail: '10' });
    if (v >= 25) earned.push({ icon: '🏅', label: '25 Club', detail: '25' });
    if (v >= 50) earned.push({ icon: '⭐', label: 'Half Century', detail: '50' });
    if (v >= 100) earned.push({ icon: '💯', label: 'Century Club', detail: '100' });
    if (c >= 2) earned.push({ icon: '✈️', label: tr(lang, 'Internationaal', 'International'), detail: `${c} ${tr(lang, 'landen', 'countries')}` });
    if (c >= 5) earned.push({ icon: '🌍', label: tr(lang, 'Wereldreiziger', 'Globe Trotter'), detail: `${c} ${tr(lang, 'landen', 'countries')}` });
    if (l >= 3) earned.push({ icon: '🏆', label: tr(lang, 'Multi-competitie', 'Multi-league'), detail: `${l} ${tr(lang, 'competities', 'leagues')}` });
    if (l >= 5) earned.push({ icon: '👑', label: tr(lang, 'Competitie Koning', 'League King'), detail: `${l} ${tr(lang, 'competities', 'leagues')}` });

    return earned;
  }, [visits, countriesVisited, leagueStats, lang]);

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
                <div className="relative w-6 h-6 flex-shrink-0">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: stadium.club?.primary_color || '#6b7280' }}
                  />
                  {stadium.club?.crest_url && (
                    <img
                      src={stadium.club.crest_url}
                      alt=""
                      className="absolute inset-0 w-6 h-6 rounded-full object-contain bg-white p-0.5"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
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

            {/* Timeline button */}
            <div className={`p-3 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => setShowTimeline(true)}
                className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                  theme === 'dark'
                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                {tr(lang, 'Bezoek Tijdlijn', 'Visit Timeline')}
              </button>
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
                {showClubSuggestions && (filteredClubSuggestions.length > 0 || apiSearching) && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto ${
                    theme === 'dark' ? 'bg-slate-700 border border-slate-600' : 'bg-white border border-slate-200'
                  }`}>
                    {filteredClubSuggestions.map((s, i) => (
                      <button
                        key={`${s.club}-${i}`}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); selectClubSuggestion(s); }}
                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition ${
                          theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-slate-50'
                        } ${i > 0 ? (theme === 'dark' ? 'border-t border-slate-600/50' : 'border-t border-slate-100') : ''}`}
                      >
                        {'fromApi' in s && s.fromApi ? (
                          <span className="text-base w-6 text-center flex-shrink-0">🌍</span>
                        ) : (
                          <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.club}</div>
                          <div className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {s.stadium ? `${s.stadium} — ` : ''}{s.city}{s.country ? `, ${s.country}` : ''}
                          </div>
                        </div>
                      </button>
                    ))}
                    {apiSearching && (
                      <div className={`px-3 py-2.5 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs">{tr(lang, 'Wereldwijd zoeken...', 'Searching worldwide...')}</span>
                      </div>
                    )}
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

      {/* Visit Timeline Modal */}
      {showTimeline && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTimeline(false)} />
          <div className={`relative w-full max-w-md max-h-[80vh] rounded-xl shadow-2xl flex flex-col ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {tr(lang, 'Bezoek Tijdlijn', 'Visit Timeline')}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {timelineData.length} {tr(lang, 'bezoeken', 'visits')}
                </p>
              </div>
              <button onClick={() => setShowTimeline(false)}>
                <X className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            </div>

            {/* Timeline content */}
            <div className="flex-1 overflow-y-auto p-4">
              {timelineData.length === 0 ? (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{tr(lang, 'Nog geen bezoeken met datum', 'No visits with dates yet')}</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />

                  {timelineData.map((entry, index) => {
                    const prevEntry = index > 0 ? timelineData[index - 1] : null;
                    const showMonthHeader = !prevEntry ||
                      entry.date.getMonth() !== prevEntry.date.getMonth() ||
                      entry.date.getFullYear() !== prevEntry.date.getFullYear();

                    return (
                      <div key={entry.stadium_id + entry.visit_date}>
                        {showMonthHeader && (
                          <div className={`ml-10 mb-2 ${index > 0 ? 'mt-4' : ''}`}>
                            <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {entry.date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            if (entry.stadium) {
                              setSelectedStadium({ lat: entry.stadium.latitude, lng: entry.stadium.longitude });
                              setShowTimeline(false);
                            }
                          }}
                          className={`w-full text-left flex items-start gap-3 py-2 pl-1 transition ${
                            theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                          } rounded-lg`}
                        >
                          {/* Timeline dot with club crest */}
                          <div className="relative z-10 mt-0.5">
                            <div
                              className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                              style={{
                                borderColor: entry.stadium?.club?.primary_color || '#6b7280',
                                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff'
                              }}
                            >
                              {entry.stadium?.club?.crest_url ? (
                                <img
                                  src={entry.stadium.club.crest_url}
                                  alt=""
                                  className="w-5 h-5 rounded-full object-contain"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: entry.stadium?.club?.primary_color || '#6b7280' }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pb-3">
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {entry.stadium?.club?.name || 'Onbekend'}
                            </div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {entry.stadium?.name} — {entry.stadium?.city}
                            </div>
                            <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                              {entry.date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                              {entry.notes && (
                                <span className={`ml-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                  — {entry.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Groundhop Counter Badge */}
      <div className="absolute bottom-8 left-4 z-[1001]">
        <div className={`rounded-2xl shadow-xl px-5 py-3 backdrop-blur-sm border ${
          theme === 'dark'
            ? 'bg-slate-800/90 border-slate-700'
            : 'bg-white/90 border-slate-200'
        }`}>
          <div className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`}>
            {tr(lang, "Bram's Groundhops", "Bram's Groundhops")}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black tabular-nums ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>{visits.length}</span>
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              / {allStadiums.length}
            </span>
          </div>
          <div className={`text-[10px] mt-0.5 flex items-center gap-3 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span>{countriesVisited} {tr(lang, 'landen', 'countries')}</span>
            <span>{leagueStats.filter(l => l.visited > 0).length} {tr(lang, 'competities', 'leagues')}</span>
          </div>
          {/* Milestone badges */}
          {milestones.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-dashed" style={{ borderColor: theme === 'dark' ? '#475569' : '#cbd5e1' }}>
              {milestones.map((m, i) => (
                <span
                  key={i}
                  title={`${m.label} (${m.detail})`}
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    theme === 'dark' ? 'bg-slate-700/80' : 'bg-slate-100'
                  }`}
                >
                  {m.icon}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nearest Unvisited GPS Button */}
      <div className="absolute bottom-8 right-16 z-[1001]">
        <button
          onClick={findNearestUnvisited}
          disabled={geoLoading}
          className={`rounded-full shadow-xl p-3 transition ${
            showNearestPanel
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-slate-800/90 border border-slate-700 text-blue-400 hover:bg-slate-700'
                : 'bg-white/90 border border-slate-200 text-blue-600 hover:bg-slate-50'
          }`}
          title={tr(lang, 'Dichtstbijzijnde onbezocht', 'Nearest unvisited')}
        >
          {geoLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nearest Unvisited Panel */}
      {showNearestPanel && userLocation && (
        <div className={`absolute bottom-24 right-4 z-[1001] w-72 rounded-xl shadow-xl overflow-hidden ${
          theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}>
          <div className={`p-3 flex items-center justify-between border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <div>
              <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {tr(lang, 'Dichtstbijzijnde onbezocht', 'Nearest unvisited')}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                📍 {tr(lang, 'Vanaf jouw locatie', 'From your location')}
              </div>
            </div>
            <button onClick={() => setShowNearestPanel(false)}>
              <X className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
            </button>
          </div>
          <div className="p-2">
            {nearestUnvisited.map((stadium, index) => (
              <button
                key={stadium.id}
                onClick={() => {
                  setSelectedStadium({ lat: stadium.latitude, lng: stadium.longitude });
                  setShowNearestPanel(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition ${
                  theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm font-bold w-5 text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  {index + 1}
                </span>
                <div className="relative w-6 h-6 flex-shrink-0">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: stadium.club?.primary_color || '#6b7280' }}
                  />
                  {stadium.club?.crest_url && (
                    <img
                      src={stadium.club.crest_url}
                      alt=""
                      className="absolute inset-0 w-6 h-6 rounded-full object-contain bg-white p-0.5"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {stadium.club?.name || stadium.name}
                  </div>
                  <div className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stadium.name}
                  </div>
                </div>
                <span className={`text-xs font-medium tabular-nums flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stadium.distance < 1 ? '<1' : Math.round(stadium.distance)} km
                </span>
              </button>
            ))}
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
        closePopupOnClick={true}
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
              {/* Hover tooltip with club name + logo */}
              <Tooltip direction="top" opacity={0.95} className="club-tooltip">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '1px 2px' }}>
                  {stadium.club?.crest_url && (
                    <img src={stadium.club.crest_url} alt="" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' }}>{stadium.club?.name || stadium.name}</span>
                  {isVisited && <span style={{ color: '#22c55e', fontSize: '11px' }}>✓</span>}
                </div>
              </Tooltip>

              {/* Panini-style popup card */}
              <Popup autoClose={true} closeOnEscapeKey={true}>
                <div className={`w-[310px] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {/* Panini header - golden bar with crest */}
                  <div className="bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 px-4 py-2.5 flex items-center gap-3 rounded-t-lg">
                    <div className="w-11 h-11 bg-white rounded-lg p-1 flex-shrink-0 shadow-sm">
                      {stadium.club?.crest_url ? (
                        <img src={stadium.club.crest_url} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: stadium.club?.primary_color || '#6b7280', color: 'white' }}>
                          {stadium.club?.short_name?.substring(0, 2) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base truncate drop-shadow-sm">{stadium.club?.name || 'Unknown'}</h3>
                      <div className="flex items-center gap-2">
                        {stadium.club?.current_league && (
                          <span className="text-amber-100 text-xs">{stadium.club.current_league.name}</span>
                        )}
                        {isCustom && (
                          <span className="text-xs px-1.5 py-0.5 bg-purple-500/30 text-purple-200 rounded">
                            {tr(lang, 'eigen', 'custom')}
                          </span>
                        )}
                      </div>
                    </div>
                    {isVisited && (
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Stadium photo with name overlay */}
                  <div className={`w-full h-40 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    {stadium.image_url ? (
                      <img src={stadium.image_url} alt={stadium.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-5xl ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>🏟️</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2.5">
                      <div className="text-white font-bold text-sm drop-shadow-md">{stadium.name}</div>
                      <div className="text-white/70 text-xs">{stadium.city}{stadium.built_year ? ` · ${tr(lang, 'Gebouwd', 'Built')} ${stadium.built_year}` : ''}</div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className={`px-4 py-2.5 flex items-center justify-between text-xs border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-amber-200/50'}`}>
                    <div className="flex items-center gap-3">
                      {stadium.capacity && (
                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                          <span className="text-amber-500">🏟️</span> {stadium.capacity.toLocaleString()}
                        </span>
                      )}
                      {customData?.country && (
                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                          🌍 {customData.country}
                        </span>
                      )}
                    </div>
                    {isVisited && visitData?.visit_date && (
                      <span className="text-green-500 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {new Date(visitData.visit_date).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB')}
                      </span>
                    )}
                  </div>

                  {/* Club details from TheSportsDB (jersey + history) */}
                  {stadium.club?.name && !isCustom && (
                    <ClubPopupDetails clubName={stadium.club.name} theme={theme} lang={lang} />
                  )}

                  {/* Custom stadium notes */}
                  {customData?.notes && (
                    <div className={`px-4 py-2 text-xs border-b ${theme === 'dark' ? 'text-slate-300 border-slate-700/50' : 'text-slate-600 border-amber-200/50'}`}>
                      <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{tr(lang, 'Notities', 'Notes')}:</span> {customData.notes}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="p-3 space-y-2">
                    {showDatePicker === stadium.id && (
                      <div className={`p-3 rounded-lg mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-amber-50'}`}>
                        <label className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {tr(lang, 'Wanneer bezocht?', 'When did you visit?')}
                        </label>
                        <input
                          type="date"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className={`w-full mt-1 px-3 py-2 rounded text-sm ${
                            theme === 'dark' ? 'bg-slate-600 text-white' : 'bg-white text-slate-900 border border-amber-300'
                          }`}
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => toggleVisit(stadium.id, visitDate)} className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium">
                            {tr(lang, 'Opslaan', 'Save')}
                          </button>
                          <button onClick={() => toggleVisit(stadium.id)} className={`flex-1 py-1.5 rounded text-sm font-medium ${theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}>
                            {tr(lang, 'Zonder datum', 'No date')}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (isVisited) { toggleVisit(stadium.id); } else { setShowDatePicker(stadium.id); setVisitDate(''); }
                      }}
                      className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                        isVisited ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 hover:bg-green-700 text-white'
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
                        className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                          isOnWishlist ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
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
                      className={`w-full py-2 rounded-lg font-medium text-sm text-center border-2 transition flex items-center justify-center gap-2 ${
                        theme === 'dark' ? 'bg-slate-700 text-blue-400 border-blue-500/50 hover:bg-slate-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {isCustom && (
                      <button
                        onClick={() => customData && deleteCustomStadium(customData.id)}
                        className="w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition"
                      >
                        <X className="w-4 h-4" />
                        {tr(lang, 'Verwijderen', 'Delete')}
                      </button>
                    )}
                  </div>

                  {/* In de buurt - Nearby unvisited suggestions */}
                  {(() => {
                    const nearby = allStadiums
                      .filter(s => s.id !== stadium.id && !visits.some(v => v.stadium_id === s.id))
                      .map(s => ({ ...s, distance: haversineDistance(stadium.latitude, stadium.longitude, s.latitude, s.longitude) }))
                      .sort((a, b) => a.distance - b.distance)
                      .slice(0, 3);
                    if (nearby.length === 0) return null;
                    return (
                      <div className={`px-4 pb-3`}>
                        <div className={`rounded-lg p-2.5 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-amber-50'}`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            📍 {tr(lang, 'In de buurt (onbezocht)', 'Nearby (unvisited)')}
                          </div>
                          {nearby.map(ns => (
                            <button
                              key={ns.id}
                              onClick={() => setSelectedStadium({ lat: ns.latitude, lng: ns.longitude })}
                              className={`w-full text-left py-1.5 flex items-center gap-2 text-sm rounded transition ${theme === 'dark' ? 'hover:bg-slate-600/50' : 'hover:bg-amber-100/50'}`}
                            >
                              <div className="relative w-5 h-5 flex-shrink-0">
                                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: ns.club?.primary_color || '#6b7280' }} />
                                {ns.club?.crest_url && (
                                  <img src={ns.club.crest_url} alt="" className="absolute inset-0 w-5 h-5 rounded-full object-contain bg-white p-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                )}
                              </div>
                              <span className={`truncate flex-1 text-xs font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                                {ns.club?.name || ns.name}
                              </span>
                              <span className={`text-xs tabular-nums flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                {ns.distance < 1 ? '<1' : Math.round(ns.distance)} km
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Panini footer */}
                  <div className="bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 px-3 py-1.5 rounded-b-lg text-center">
                    <span className="text-[10px] font-bold tracking-widest text-white/70">GROUNDHOPPER PRO</span>
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
        /* Panini card popup styling */
        html.dark .leaflet-popup-content-wrapper { background: #1e293b; border: 3px solid #b8860b; border-radius: 12px; padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        html.dark .leaflet-popup-tip { background: #b8860b; }
        html.dark .leaflet-popup-content { margin: 0; color: white; }
        html.light .leaflet-popup-content-wrapper { background: white; border: 3px solid #c9a84c; border-radius: 12px; padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
        html.light .leaflet-popup-tip { background: #c9a84c; }
        html.light .leaflet-popup-content { margin: 0; color: #1e293b; }
        .leaflet-popup-close-button { color: white !important; font-size: 18px !important; padding: 6px 10px !important; z-index: 10; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
        /* Tooltip styling */
        html.dark .leaflet-tooltip { background: #1e293b; color: white; border: 1px solid #334155; border-radius: 8px; padding: 4px 8px; font-family: inherit; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        html.dark .leaflet-tooltip-top::before { border-top-color: #334155; }
        html.light .leaflet-tooltip { background: white; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 8px; font-family: inherit; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        html.light .leaflet-tooltip-top::before { border-top-color: #e2e8f0; }
      `}</style>
    </div>
  );
}
