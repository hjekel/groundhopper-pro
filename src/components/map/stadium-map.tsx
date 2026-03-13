'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { createClient } from '@supabase/supabase-js';
import { Search, X, Check, Star, Calendar, Plus, Loader2, MapPin, ExternalLink, Filter, ChevronDown, BarChart3, Navigation, Clock, Edit3, Trash2, SortAsc, SortDesc, AlertCircle, Trophy, Share2, Download, Camera, Image } from 'lucide-react';
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
  // Notable clubs (Netflix, etc.)
  { club: 'Wrexham AFC', stadium: 'Racecourse Ground', city: 'Wrexham', country: 'Wales', color: '#E30613', aliases: ['wrexham', 'ryan reynolds'] },
  { club: 'Sunderland AFC', stadium: 'Stadium of Light', city: 'Sunderland', country: 'England', color: '#EB172B', aliases: ['sunderland', 'sunderland til i die'] },
  { club: 'AFC Wimbledon', stadium: 'Plough Lane', city: 'London', country: 'England', color: '#00008B', aliases: ['wimbledon', 'crazy gang'] },
];

// Special club stories (Netflix series, famous owners, etc.)
const CLUB_STORIES: Record<string, { icon: string; label: { nl: string; en: string }; lines: { nl: string[]; en: string[] } }> = {
  'Wrexham AFC': {
    icon: '🎬',
    label: { nl: 'Beroemd verhaal', en: 'Famous story' },
    lines: {
      nl: [
        '🎬 De Disney+ serie "Welcome to Wrexham" volgt de club sinds 2022',
        '⭐ Eigenaren: Hollywood-sterren Ryan Reynolds & Rob McElhenney',
        '📈 Kochten de club in 2020 in de 5e divisie — nu terug in de Football League',
        '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Oudste club van Wales (opgericht 1864) en 3e oudste ter wereld',
        '🌍 Van lokale amateurclub naar wereldwijd bekende naam',
      ],
      en: [
        '🎬 The Disney+ series "Welcome to Wrexham" has followed the club since 2022',
        '⭐ Owners: Hollywood stars Ryan Reynolds & Rob McElhenney',
        '📈 Bought the club in 2020 in the 5th tier — now back in the Football League',
        '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Oldest club in Wales (founded 1864) and 3rd oldest in the world',
        '🌍 From local non-league club to a globally recognised name',
      ],
    },
  },
  'Sunderland AFC': {
    icon: '🎬',
    label: { nl: 'Beroemd verhaal', en: 'Famous story' },
    lines: {
      nl: [
        '🎬 Netflix-serie "Sunderland \'Til I Die" (2018-2020, 3 seizoenen)',
        '📺 Een van de eerste voetbal-docuseries, wereldwijd succes',
        '😢 Volgt de pijn van degradatie en de hoop op terugkeer',
        '🏟️ Stadium of Light: 49.000 zitplaatsen, altijd vol passie',
        '🏆 6x Engels kampioen (lang geleden), maar de fans blijven trouw',
      ],
      en: [
        '🎬 Netflix series "Sunderland \'Til I Die" (2018-2020, 3 seasons)',
        '📺 One of the first football docuseries, a worldwide hit',
        '😢 Follows the heartbreak of relegation and the hope of return',
        '🏟️ Stadium of Light: 49,000 seats, always full of passion',
        '🏆 6x English champions (long ago), but the fans never give up',
      ],
    },
  },
  'Telstar': {
    icon: '🦁',
    label: { nl: 'Plaatselijke trots', en: 'Local pride' },
    lines: {
      nl: [
        '🦁 "De Witte Leeuwen" — trots van de IJmond sinds 1963',
        '⭐ Vernoemd naar de Telstar-satelliet, de eerste live tv-satelliet',
        '🏟️ Kleinste profstadion van Nederland, maar groot in sfeer',
        '⚽ Bekende oud-spelers: Frank Rijkaard begon hier als jeugdspeler',
        '🤍 Altijd in het wit — uniek in het Nederlandse voetbal',
      ],
      en: [
        '🦁 "The White Lions" — pride of the IJmond region since 1963',
        '⭐ Named after the Telstar satellite, the first live TV satellite',
        '🏟️ Smallest professional stadium in the Netherlands, but big in spirit',
        '⚽ Famous alumni: Frank Rijkaard started here in the youth academy',
        '🤍 Always in white — unique in Dutch football',
      ],
    },
  },
};

const createClubIcon = (primaryColor: string, crestUrl?: string | null, isSparta: boolean = false, isVisited: boolean = false, isWishlist: boolean = false, isCustom: boolean = false, label?: string | null, isLostGround: boolean = false) => {
  const color = primaryColor || '#ef4444';

  // Status badge (small corner overlay)
  const badge = isVisited
    ? `<div style="position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"><svg width="7" height="7" viewBox="0 0 12 12"><path d="M2 6L5 9L10 3" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`
    : isWishlist
    ? `<div style="position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#eab308;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"><svg width="7" height="7" viewBox="0 0 12 12"><polygon points="6,1 7.5,4.5 11,4.5 8,7 9.5,11 6,8.5 2.5,11 4,7 1,4.5 4.5,4.5" fill="white"/></svg></div>`
    : isCustom
    ? `<div style="position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#8b5cf6;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"><svg width="7" height="7" viewBox="0 0 12 12"><path d="M6 2V10M2 6H10" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></div>`
    : isLostGround
    ? `<div style="position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#78716c;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"><span style="font-size:8px;line-height:1;">🏚️</span></div>`
    : '';

  const borderCol = isVisited ? '#22c55e' : isWishlist ? '#eab308' : isCustom ? '#8b5cf6' : isLostGround ? '#78716c' : 'white';

  // --- Sparta: larger logo badge with golden ring + glow ---
  if (isSparta) {
    const s = 44;
    const logo = crestUrl
      ? `<img src="${crestUrl}" style="width:30px;height:30px;object-fit:contain;" />`
      : `<span style="font-size:16px;font-weight:bold;color:#CC0000">S</span>`;
    return L.divIcon({
      html: `<div style="position:relative;width:${s}px;height:${s}px;">
        <div style="width:${s}px;height:${s}px;border-radius:50%;background:white;border:3px solid #FFD700;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(255,215,0,0.3);">${logo}</div>
        ${badge}
      </div>`,
      className: 'custom-stadium-marker sparta-special',
      iconSize: [s, s] as any,
      iconAnchor: [s / 2, s / 2] as any,
      popupAnchor: [0, -(s / 2)] as any,
      tooltipAnchor: [0, -(s / 2)] as any,
    } as any);
  }

  // --- All other markers: circular logo badge (crest = the marker) ---
  const s = 34;
  const className = isCustom ? 'custom-stadium-marker custom-added' : isLostGround ? 'custom-stadium-marker lost-ground' : 'custom-stadium-marker';
  const opacity = isLostGround ? 'opacity:0.7;' : '';

  const html = crestUrl
    ? `<div style="position:relative;width:${s}px;height:${s}px;${opacity}">
        <div style="width:${s}px;height:${s}px;border-radius:50%;background:white;border:2.5px solid ${borderCol};display:flex;align-items:center;justify-content:center;overflow:hidden;${isLostGround ? 'filter:grayscale(50%);' : ''}">
          <img src="${crestUrl}" style="width:22px;height:22px;object-fit:contain;" onerror="this.parentElement.style.background='${color}'" />
        </div>
        ${badge}
      </div>`
    : `<div style="position:relative;width:${s}px;height:${s}px;${opacity}">
        <div style="width:${s}px;height:${s}px;border-radius:50%;background:${isLostGround ? '#78716c' : color};border:2.5px solid ${borderCol === 'white' ? 'rgba(255,255,255,0.8)' : borderCol};display:flex;align-items:center;justify-content:center;">${label ? `<span style="font-size:10px;font-weight:800;color:white;text-shadow:0 1px 2px rgba(0,0,0,0.3);letter-spacing:-0.5px;">${label}</span>` : ''}</div>
        ${badge}
      </div>`;

  return L.divIcon({
    html,
    className,
    iconSize: [s, s] as any,
    iconAnchor: [s / 2, s / 2] as any,
    popupAnchor: [0, -(s / 2)] as any,
    tooltipAnchor: [0, -(s / 2)] as any,
  } as any);
};

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_visit', icon: '🏟️', title_nl: 'Eerste Bezoek', title_en: 'First Visit', desc_nl: '1 stadion bezocht', desc_en: '1 stadium visited', check: (v: number) => v >= 1, progress: (v: number) => `${v}/1` },
  { id: 'five', icon: '⚽', title_nl: 'Vijf-klapper', title_en: 'High Five', desc_nl: '5 stadions bezocht', desc_en: '5 stadiums visited', check: (v: number) => v >= 5, progress: (v: number) => `${v}/5` },
  { id: 'ten', icon: '🔟', title_nl: 'Dubbele Cijfers', title_en: 'Double Digits', desc_nl: '10 stadions bezocht', desc_en: '10 stadiums visited', check: (v: number) => v >= 10, progress: (v: number) => `${v}/10` },
  { id: 'twentyfive', icon: '🏅', title_nl: 'Kwart Century', title_en: 'Quarter Century', desc_nl: '25 stadions bezocht', desc_en: '25 stadiums visited', check: (v: number) => v >= 25, progress: (v: number) => `${v}/25` },
  { id: 'halfway', icon: '💯', title_nl: 'Halverwege', title_en: 'Halfway There', desc_nl: '50% van alle stadions', desc_en: '50% of all stadiums', check: (v: number, t: number) => t > 0 && v >= t / 2, progress: (v: number, t: number) => `${Math.round((v / Math.max(t, 1)) * 100)}%` },
  { id: 'two_countries', icon: '🌍', title_nl: 'Grensverlegger', title_en: 'Border Crosser', desc_nl: '2 landen bezocht', desc_en: '2 countries visited', check: (_v: number, _t: number, c: number) => c >= 2, progress: (_v: number, _t: number, c: number) => `${c}/2` },
  { id: 'five_countries', icon: '🗺️', title_nl: 'Europeaan', title_en: 'European', desc_nl: '5 landen bezocht', desc_en: '5 countries visited', check: (_v: number, _t: number, c: number) => c >= 5, progress: (_v: number, _t: number, c: number) => `${c}/5` },
  { id: 'ten_countries', icon: '🌐', title_nl: 'Globetrotter', title_en: 'Globetrotter', desc_nl: '10 landen bezocht', desc_en: '10 countries visited', check: (_v: number, _t: number, c: number) => c >= 10, progress: (_v: number, _t: number, c: number) => `${c}/10` },
  { id: 'league_complete', icon: '⭐', title_nl: 'Competitie Compleet', title_en: 'League Complete', desc_nl: 'Alle stadions in 1 competitie', desc_en: 'All stadiums in 1 league', check: (_v: number, _t: number, _c: number, lc: number) => lc >= 1, progress: (_v: number, _t: number, _c: number, lc: number) => `${lc}/1` },
  { id: 'league_king', icon: '👑', title_nl: 'Competitie Koning', title_en: 'League King', desc_nl: '3 volledige competities', desc_en: '3 complete leagues', check: (_v: number, _t: number, _c: number, lc: number) => lc >= 3, progress: (_v: number, _t: number, _c: number, lc: number) => `${lc}/3` },
  { id: 'sparta', icon: '🔴⚪', title_nl: 'Sparta Fan', title_en: 'Sparta Fan', desc_nl: 'Het Kasteel bezocht', desc_en: 'Visited Het Kasteel', check: (_v: number, _t: number, _c: number, _lc: number, sp: boolean) => sp, progress: (_v: number, _t: number, _c: number, _lc: number, sp: boolean) => sp ? '✅' : '❌' },
  { id: 'diary', icon: '📅', title_nl: 'Dagboek', title_en: 'Diary', desc_nl: '5 bezoeken met datum', desc_en: '5 visits with date', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, dd: number) => dd >= 5, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, dd: number) => `${dd}/5` },
  { id: 'explorer', icon: '🆕', title_nl: 'Ontdekker', title_en: 'Explorer', desc_nl: '1 eigen stadion toegevoegd', desc_en: '1 custom stadium added', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, cs: number) => cs >= 1, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, cs: number) => `${cs}/1` },
  { id: 'wishlist_warrior', icon: '🎯', title_nl: 'Wishlist Warrior', title_en: 'Wishlist Warrior', desc_nl: '5 stadions op wishlist', desc_en: '5 stadiums on wishlist', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, wl: number) => wl >= 5, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, wl: number) => `${wl}/5` },
  { id: 'homeland', icon: '🏠', title_nl: 'Thuisland', title_en: 'Homeland', desc_nl: '10 Nederlandse stadions bezocht', desc_en: '10 Dutch stadiums visited', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, nl: number) => nl >= 10, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, nl: number) => `${nl}/10` },
  // v1.2 achievements
  { id: 'reporter', icon: '📝', title_nl: 'Verslaggever', title_en: 'Reporter', desc_nl: '5 wedstrijden met score gelogd', desc_en: '5 matches with score logged', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, ml: number) => ml >= 5, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, ml: number) => `${ml}/5` },
  { id: 'goalhunter', icon: '⚽', title_nl: 'Doelpuntenjager', title_en: 'Goal Hunter', desc_nl: '20+ doelpunten gezien', desc_en: '20+ goals witnessed', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, _ml: number, tg: number) => tg >= 20, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, _ml: number, tg: number) => `${tg}/20` },
  { id: 'topreviewer', icon: '🌟', title_nl: 'Toprecensent', title_en: 'Top Reviewer', desc_nl: '5 stadions beoordeeld', desc_en: '5 stadiums rated', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, _ml: number, _tg: number, rc: number) => rc >= 5, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, _ml: number, _tg: number, rc: number) => `${rc}/5` },
  { id: 'roadtripper', icon: '🚗', title_nl: 'Roadtripper', title_en: 'Roadtripper', desc_nl: '1.000+ km gereisd', desc_en: '1,000+ km traveled', check: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, _ml: number, _tg: number, _rc: number, km: number) => km >= 1000, progress: (_v: number, _t: number, _c: number, _lc: number, _sp: boolean, _dd: number, _cs: number, _wl: number, _nl: number, _ml: number, _tg: number, _rc: number, km: number) => `${km}/1000` },
];

// Challenge definitions — inspired by The 92 Club
const CHALLENGES = [
  { id: 'eredivisie_club', icon: '🇳🇱', title_nl: 'De 18 Club', title_en: 'The 18 Club', desc_nl: 'Alle Eredivisie stadions', desc_en: 'All Eredivisie stadiums', type: 'league' as const, league: 'Eredivisie' },
  { id: 'nl_prof', icon: '🦁', title_nl: 'Nederlands Prof', title_en: 'Dutch Professional', desc_nl: 'Eredivisie + Eerste Divisie', desc_en: 'Eredivisie + Eerste Divisie', type: 'multi_league' as const, leagues: ['Eredivisie', 'Eerste Divisie'] },
  { id: 'bundesliga_tour', icon: '🇩🇪', title_nl: 'Bundesliga Tour', title_en: 'Bundesliga Tour', desc_nl: 'Alle Bundesliga stadions', desc_en: 'All Bundesliga stadiums', type: 'league' as const, league: 'Bundesliga' },
  { id: 'premier_league_tour', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', title_nl: 'Premier League Tour', title_en: 'Premier League Tour', desc_nl: 'Alle Premier League stadions', desc_en: 'All Premier League stadiums', type: 'league' as const, league: 'Premier League' },
  { id: 'serie_a_tour', icon: '🇮🇹', title_nl: 'Serie A Tour', title_en: 'Serie A Tour', desc_nl: 'Alle Serie A stadions', desc_en: 'All Serie A stadiums', type: 'league' as const, league: 'Serie A' },
  { id: 'la_liga_tour', icon: '🇪🇸', title_nl: 'La Liga Tour', title_en: 'La Liga Tour', desc_nl: 'Alle La Liga stadions', desc_en: 'All La Liga stadiums', type: 'league' as const, league: 'La Liga' },
  { id: 'ligue_1_tour', icon: '🇫🇷', title_nl: 'Ligue 1 Tour', title_en: 'Ligue 1 Tour', desc_nl: 'Alle Ligue 1 stadions', desc_en: 'All Ligue 1 stadiums', type: 'league' as const, league: 'Ligue 1' },
  { id: 'big_ten', icon: '🏟️', title_nl: "Europa's Grootste", title_en: "Europe's Biggest", desc_nl: 'Top 10 grootste stadions bezocht', desc_en: 'Visit the 10 biggest stadiums', type: 'biggest' as const, count: 10 },
  { id: 'century', icon: '💯', title_nl: '100 Club', title_en: '100 Club', desc_nl: '100 stadions bezoeken', desc_en: 'Visit 100 stadiums', type: 'visit_count' as const, target: 100 },
  { id: 'ten_countries', icon: '🌍', title_nl: '10 Landen Tour', title_en: '10 Countries Tour', desc_nl: 'Stadions in 10 landen', desc_en: 'Stadiums in 10 countries', type: 'country_count' as const, target: 10 },
  { id: 'bucket_list', icon: '⭐', title_nl: 'European Bucket List', title_en: 'European Bucket List', desc_nl: '10 iconische Europese stadions', desc_en: '10 iconic European stadiums', type: 'specific_stadiums' as const, stadiumNames: [
    'Spotify Camp Nou', 'Santiago Bernabéu', 'Signal Iduna Park', 'Anfield', 'Old Trafford',
    'San Siro', 'Allianz Arena', 'Stadio Olimpico', 'Celtic Park', 'De Kuip'
  ]},
];

const COMPETITIONS = [
  'Eredivisie', 'Eerste Divisie', 'KNVB Beker', 'Johan Cruijff Schaal',
  'Bundesliga', '2. Bundesliga', 'DFB-Pokal',
  'Premier League', 'FA Cup', 'League Cup',
  'La Liga', 'Copa del Rey', 'Serie A', 'Coppa Italia', 'Ligue 1', 'Coupe de France',
  'Champions League', 'Europa League', 'Conference League',
  'EK', 'WK', 'Oefenwedstrijd',
];

// Star rating inline component
const StarRating = ({ rating, setRating, size = 'md', theme }: { rating: number; setRating?: (r: number) => void; size?: 'sm' | 'md'; theme: string }) => {
  const starSize = size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setRating?.(rating === star ? 0 : star)}
          disabled={!setRating}
          className={`${starSize} transition ${setRating ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${
            star <= rating
              ? 'text-amber-400'
              : theme === 'dark' ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Season helper: "2024/25" for Aug 2024 - Jul 2025
const getSeasonFromDate = (dateStr: string | null): string => {
  if (!dateStr) return 'unknown';
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11
  // Aug(7)-Dec(11) = current year start, Jan(0)-Jul(6) = previous year start
  const startYear = month >= 7 ? year : year - 1;
  const endYear = startYear + 1;
  return `${startYear}/${String(endYear).slice(-2)}`;
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
      // Zoom to 16 for close-up view, open nearest popup after landing
      map.flyTo([lat, lng], 16, { duration: 1.5 });
      const timer = setTimeout(() => {
        // Find the closest marker and open its popup
        let closestMarker: L.Layer | null = null;
        let closestDist = Infinity;
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            const dist = Math.abs(pos.lat - lat) + Math.abs(pos.lng - lng);
            if (dist < closestDist) {
              closestDist = dist;
              closestMarker = layer;
            }
          }
        });
        if (closestMarker && closestDist < 0.01) {
          (closestMarker as L.Marker).openPopup();
        }
      }, 1700);
      return () => clearTimeout(timer);
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

// Stadium photo component - uses TheSportsDB as fallback when no database image
function StadiumPhoto({ clubName, imageUrl, stadiumName, city, builtYear, theme, lang }: {
  clubName?: string; imageUrl?: string; stadiumName: string; city?: string; builtYear?: number; theme: string; lang: string;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(imageUrl || null);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (imageUrl || !clubName || tried) return;
    // Check cache first
    const cached = clubDetailsCache.get(clubName);
    if (cached?.stadiumThumb) { setPhotoUrl(cached.stadiumThumb); return; }
    if (cached !== undefined) { setTried(true); return; }
    // Fetch from TheSportsDB
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(clubName)}`)
      .then(r => r.json())
      .then(d => {
        const t = d.teams?.[0];
        if (t?.strStadiumThumb) {
          setPhotoUrl(t.strStadiumThumb);
          // Also update cache so ClubPopupDetails doesn't refetch
          if (!clubDetailsCache.has(clubName)) {
            clubDetailsCache.set(clubName, {
              jersey: t.strTeamJersey || undefined,
              description: t.strDescriptionEN || '',
              formedYear: t.intFormedYear || undefined,
              stadiumThumb: t.strStadiumThumb,
            });
          }
        }
        setTried(true);
      })
      .catch(() => setTried(true));
  }, [clubName, imageUrl, tried]);

  return (
    <div className={`w-full h-40 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
      {photoUrl ? (
        <img src={photoUrl} alt={stadiumName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <div className={`w-full h-full flex items-center justify-center text-5xl ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>🏟️</div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2.5">
        <div className="text-white font-bold text-sm drop-shadow-md">{stadiumName}</div>
        <div className="text-white/70 text-xs">{city}{builtYear ? ` · ${lang === 'nl' ? 'Gebouwd' : 'Built'} ${builtYear}` : ''}</div>
      </div>
    </div>
  );
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
  notable_events?: string;
  former_names?: string[];
  is_active?: boolean;
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
  built_year?: number;
  primary_color?: string;
  notes?: string;
  is_historic?: boolean;
  demolished_year?: number;
  crest_url?: string;
  image_url?: string;
  created_at: string;
}

interface Visit {
  stadium_id: string;
  visit_date: string | null;
  notes?: string;
  match_home_team?: string;
  match_away_team?: string;
  match_score?: string;
  match_competition?: string;
  rating?: number;
  atmosphere_rating?: number;
  facilities_rating?: number;
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
  addStadiumTrigger?: number;
  timelineTrigger?: number;
  onShowWhatsNew?: () => void;
}

const tr = (lang: string, nl: string, en: string) => lang === 'nl' ? nl : en;

export default function StadiumMap({ stadiums, theme, lang, addStadiumTrigger, timelineTrigger, onShowWhatsNew }: StadiumMapProps) {
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
    notes: '',
    built_year: '',
    is_historic: false,
    demolished_year: ''
  });
  const [showClubSuggestions, setShowClubSuggestions] = useState(false);
  const [clubSuggestionQuery, setClubSuggestionQuery] = useState('');
  const [apiSearchResults, setApiSearchResults] = useState<{ club: string; stadium: string; city: string; country: string; color: string; capacity?: string; fromApi?: boolean }[]>([]);
  const [apiSearching, setApiSearching] = useState(false);
  const apiSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // City search in add modal
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<{ club: string; stadium: string; city: string; country: string; color: string; capacity?: string }[]>([]);
  const [citySearching, setCitySearching] = useState(false);
  const citySearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Bottom stats bar
  const [bottomExpanded, setBottomExpanded] = useState(false);

  // Achievements feature
  const [showAchievements, setShowAchievements] = useState(false);

  // Photo upload feature
  const [visitPhotos, setVisitPhotos] = useState<{ id: string; stadium_id: string; photo_url: string }[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUploadStadium, setPhotoUploadStadium] = useState<string | null>(null);

  // Share feature
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  // Visit manager feature
  const [showVisitManager, setShowVisitManager] = useState(false);
  const [editingVisit, setEditingVisit] = useState<string | null>(null);
  const [editVisitDate, setEditVisitDate] = useState('');
  const [editVisitNotes, setEditVisitNotes] = useState('');
  const [visitManagerSort, setVisitManagerSort] = useState<'date' | 'name'>('date');
  const [visitManagerFilter, setVisitManagerFilter] = useState<'all' | 'no_date'>('all');
  const [visitManagerSeason, setVisitManagerSeason] = useState<string>('all');
  // Match fields for popup date picker
  const [matchHomeTeam, setMatchHomeTeam] = useState('');
  const [matchAwayTeam, setMatchAwayTeam] = useState('');
  const [matchScore, setMatchScore] = useState('');
  const [matchCompetition, setMatchCompetition] = useState('');
  // Match fields for Visit Manager edit
  const [editMatchHome, setEditMatchHome] = useState('');
  const [editMatchAway, setEditMatchAway] = useState('');
  const [editMatchScore, setEditMatchScore] = useState('');
  const [editMatchComp, setEditMatchComp] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editAtmosphereRating, setEditAtmosphereRating] = useState(0);
  const [editFacilitiesRating, setEditFacilitiesRating] = useState(0);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  // Open add modal from header button
  useEffect(() => {
    if (addStadiumTrigger && addStadiumTrigger > 0) setShowAddModal(true);
  }, [addStadiumTrigger]);

  // Open timeline from header button
  useEffect(() => {
    if (timelineTrigger && timelineTrigger > 0) setShowTimeline(true);
  }, [timelineTrigger]);

  const loadData = async () => {
    const [visitsRes, wishlistRes, customRes, photosRes] = await Promise.all([
      supabase.from('stadium_visits').select('stadium_id, first_visit_date, notes, match_home_team, match_away_team, match_score, match_competition, rating, atmosphere_rating, facilities_rating').eq('is_wishlist', false),
      supabase.from('bram_wishlist').select('stadium_id, priority, notes'),
      supabase.from('bram_custom_stadiums').select('*'),
      supabase.from('bram_visit_photos').select('id, stadium_id, photo_url').order('created_at', { ascending: true })
    ]);
    if (visitsRes.data) setVisits(visitsRes.data.map(v => ({
      stadium_id: v.stadium_id,
      visit_date: v.first_visit_date,
      notes: v.notes,
      match_home_team: v.match_home_team,
      match_away_team: v.match_away_team,
      match_score: v.match_score,
      match_competition: v.match_competition,
      rating: v.rating,
      atmosphere_rating: v.atmosphere_rating,
      facilities_rating: v.facilities_rating,
    })));
    if (wishlistRes.data) setWishlist(wishlistRes.data);
    if (customRes.data) setCustomStadiums(customRes.data);
    if (photosRes.data) setVisitPhotos(photosRes.data);
  };

  const toggleVisit = async (stadiumId: string, date?: string) => {
    const existing = visits.find(v => v.stadium_id === stadiumId);
    if (existing) {
      await supabase.from('stadium_visits').delete().eq('stadium_id', stadiumId);
      setVisits(visits.filter(v => v.stadium_id !== stadiumId));
    } else {
      const insertData: Record<string, unknown> = {
        stadium_id: stadiumId,
        first_visit_date: date || null,
        last_visit_date: date || null,
        visit_count: 1,
        is_wishlist: false,
      };
      if (matchHomeTeam) insertData.match_home_team = matchHomeTeam;
      if (matchAwayTeam) insertData.match_away_team = matchAwayTeam;
      if (matchScore) insertData.match_score = matchScore;
      if (matchCompetition) insertData.match_competition = matchCompetition;

      const { data } = await supabase.from('stadium_visits').insert(insertData)
        .select('stadium_id, first_visit_date, notes, match_home_team, match_away_team, match_score, match_competition, rating, atmosphere_rating, facilities_rating').single();
      if (data) setVisits([...visits, {
        stadium_id: data.stadium_id,
        visit_date: data.first_visit_date,
        notes: data.notes,
        match_home_team: data.match_home_team,
        match_away_team: data.match_away_team,
        match_score: data.match_score,
        match_competition: data.match_competition,
        rating: data.rating,
        atmosphere_rating: data.atmosphere_rating,
        facilities_rating: data.facilities_rating,
      }]);
    }
    // Remove from wishlist if marking as visited
    if (!existing && wishlist.find(w => w.stadium_id === stadiumId)) {
      await supabase.from('bram_wishlist').delete().eq('stadium_id', stadiumId);
      setWishlist(wishlist.filter(w => w.stadium_id !== stadiumId));
    }
    setShowDatePicker(null);
    setMatchHomeTeam(''); setMatchAwayTeam(''); setMatchScore(''); setMatchCompetition('');
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

    // Try to find the location (include country in queries for better accuracy)
    const countryHint = newStadium.country ? `, ${newStadium.country}` : '';
    const searchQueries = [
      `${newStadium.name} stadium ${newStadium.city}${countryHint}`,
      `${newStadium.name} ${newStadium.city}${countryHint}`,
      `${newStadium.club_name} stadium ${newStadium.city}${countryHint}`,
      `stadium ${newStadium.city}${countryHint}`,
      `${newStadium.city}${countryHint}`
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
      notes: newStadium.notes || null,
      built_year: newStadium.built_year ? parseInt(newStadium.built_year) : null,
      is_historic: newStadium.is_historic,
      demolished_year: newStadium.demolished_year ? parseInt(newStadium.demolished_year) : null
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

      // Auto-enrich: fetch club logo + verify/refine coordinates in background
      (async () => {
        try {
          const updates: Record<string, any> = {};
          const stateUpdates: Partial<CustomStadium> = {};

          // 1. Try to fetch club logo from TheSportsDB
          if (data.club_name) {
            const searchNames = [data.club_name, data.club_name.replace(/^(FC|SC|SV|VV|VfL|TSG|1\.\s*FC)\s+/i, '').trim()];
            for (const searchName of searchNames) {
              const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(searchName)}`);
              const json = await res.json();
              if (json.teams && json.teams.length > 0) {
                const team = json.teams[0];
                // Get badge
                if (team.strBadge) {
                  updates.crest_url = team.strBadge;
                  stateUpdates.crest_url = team.strBadge;
                }
                // Get stadium coordinates from TheSportsDB if available
                if (team.strStadiumLocation) {
                  const [tLat, tLng] = team.strStadiumLocation.split(',').map((s: string) => parseFloat(s.trim()));
                  if (!isNaN(tLat) && !isNaN(tLng) && Math.abs(tLat) > 0.1 && Math.abs(tLng) > 0.001) {
                    // Only update if TheSportsDB coords differ significantly (>200m) from current
                    const dLat = (tLat - data.latitude) * 111000;
                    const dLng = (tLng - data.longitude) * 111000 * Math.cos(data.latitude * Math.PI / 180);
                    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
                    if (dist > 200) {
                      updates.latitude = tLat;
                      updates.longitude = tLng;
                      stateUpdates.latitude = tLat;
                      stateUpdates.longitude = tLng;
                    }
                  }
                }
                break;
              }
            }
          }

          // 2. If no TheSportsDB coords, try refining with Nominatim stadium-specific search
          if (!updates.latitude && data.name) {
            const stadiumGeo = await geocodeLocation(`${data.name} stadium ${data.city}`);
            if (stadiumGeo) {
              const dLat = (stadiumGeo.lat - data.latitude) * 111000;
              const dLng = (stadiumGeo.lng - data.longitude) * 111000 * Math.cos(data.latitude * Math.PI / 180);
              const dist = Math.sqrt(dLat * dLat + dLng * dLng);
              // Only update if the refined coords are >200m different (more precise hit)
              if (dist > 200 && dist < 5000) {
                updates.latitude = stadiumGeo.lat;
                updates.longitude = stadiumGeo.lng;
                stateUpdates.latitude = stadiumGeo.lat;
                stateUpdates.longitude = stadiumGeo.lng;
              }
            }
          }

          // 3. Apply updates if any
          if (Object.keys(updates).length > 0) {
            await supabase.from('bram_custom_stadiums').update(updates).eq('id', data.id);
            setCustomStadiums(prev => prev.map(s => s.id === data.id ? { ...s, ...stateUpdates } : s));
          }
        } catch (e) {
          console.log('Auto-enrich failed (non-critical):', e);
        }
      })();
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
      notes: '',
      built_year: '',
      is_historic: false,
      demolished_year: ''
    });
    setSearchError('');
    setFoundLocation(null);
    setExistingMatch(null);
    setShowClubSuggestions(false);
    setClubSuggestionQuery('');
    setCitySearchQuery('');
    setCitySearchResults([]);
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

  // City search: find clubs by city name via TheSportsDB
  const searchClubsByCity = useCallback(async (city: string) => {
    if (city.length < 2) { setCitySearchResults([]); return; }
    setCitySearching(true);
    try {
      // Search TheSportsDB with the city name (many teams are named after their city)
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(city)}`);
      const data = await res.json();
      const results: typeof citySearchResults = [];
      if (data.teams) {
        data.teams
          .filter((t: any) => t.strSport === 'Soccer')
          .forEach((t: any) => {
            const loc = t.strStadiumLocation || t.strLocation || '';
            const teamCity = loc.split(',')[0]?.trim() || '';
            results.push({
              club: t.strTeam,
              stadium: t.strStadium || '',
              city: teamCity,
              country: t.strCountry || '',
              color: t.strColour1 ? `#${t.strColour1.replace('#', '')}` : '#6b7280',
              capacity: t.intStadiumCapacity || '',
            });
          });
      }
      // Also search local suggestions by city
      const q = city.toLowerCase();
      CLUB_SUGGESTIONS.forEach(s => {
        if (s.city.toLowerCase().includes(q) && !results.find(r => r.club.toLowerCase() === s.club.toLowerCase())) {
          results.push({ club: s.club, stadium: s.stadium, city: s.city, country: s.country, color: s.color });
        }
      });
      setCitySearchResults(results.slice(0, 12));
    } catch {
      setCitySearchResults([]);
    } finally {
      setCitySearching(false);
    }
  }, []);

  // Debounced city search
  useEffect(() => {
    if (citySearchTimer.current) clearTimeout(citySearchTimer.current);
    if (citySearchQuery.length >= 2) {
      citySearchTimer.current = setTimeout(() => searchClubsByCity(citySearchQuery), 500);
    } else {
      setCitySearchResults([]);
    }
    return () => { if (citySearchTimer.current) clearTimeout(citySearchTimer.current); };
  }, [citySearchQuery, searchClubsByCity]);

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
      built_year: cs.built_year,
      notable_events: cs.notes ? (cs.is_historic
        ? `🏚️ ${tr(lang, 'Historisch stadion', 'Historic stadium')}${cs.demolished_year ? ` — ${tr(lang, 'gesloopt/gesloten', 'demolished/closed')} ${cs.demolished_year}` : ''}. ${cs.notes}`
        : cs.notes
      ) : (cs.is_historic
        ? `🏚️ ${tr(lang, 'Historisch stadion', 'Historic stadium')}${cs.demolished_year ? ` — ${tr(lang, 'gesloopt/gesloten', 'demolished/closed')} ${cs.demolished_year}` : ''}`
        : undefined
      ),
      image_url: cs.image_url,
      club: {
        id: `custom-club-${cs.id}`,
        name: cs.club_name || cs.name,
        short_name: (cs.club_name || cs.name).substring(0, 3).toUpperCase(),
        primary_color: cs.is_historic ? '#78716c' : (cs.primary_color || '#8b5cf6'),
        secondary_color: undefined,
        crest_url: cs.crest_url,
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

  // Compute achievements
  const achievements = useMemo(() => {
    const visitCount = visits.length;
    const totalStadiums = allStadiums.length;
    const countriesCount = countriesVisited;
    const completedLeagues = leagueStats.filter(ls => ls.total > 0 && ls.visited === ls.total && ls.league !== tr(lang, 'Eigen toevoegingen', 'Custom stadiums')).length;
    const spartaVisited = visits.some(v => {
      const s = allStadiums.find(st => st.id === v.stadium_id);
      return s?.club?.name === 'Sparta Rotterdam';
    });
    const datedVisits = visits.filter(v => v.visit_date).length;
    const customCount = customStadiums.length;
    const wishlistCount = wishlist.length;
    const visitedStadiumIds = new Set(visits.map(v => v.stadium_id));
    const nlVisits = allStadiums.filter(s => visitedStadiumIds.has(s.id) && (s.club?.current_league?.name === 'Eredivisie' || s.club?.current_league?.name === 'Eerste Divisie')).length;

    // v1.2 stats for new achievements
    const ml = visits.filter(v => v.match_score).length;
    const tg = visits.reduce((sum, v) => {
      if (!v.match_score) return sum;
      const parts = v.match_score.split('-').map(s => parseInt(s.trim()));
      return (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) ? sum + parts[0] + parts[1] : sum;
    }, 0);
    const rc = visits.filter(v => v.rating && v.rating > 0).length;
    const ROTTERDAM = { lat: 51.9225, lng: 4.4792 };
    const km = Math.round(visits.reduce((total, v) => {
      const st = allStadiums.find(s => s.id === v.stadium_id);
      return st ? total + haversineDistance(ROTTERDAM.lat, ROTTERDAM.lng, st.latitude, st.longitude) * 2 : total;
    }, 0));

    return ACHIEVEMENTS.map(a => ({
      ...a,
      earned: a.check(visitCount, totalStadiums, countriesCount, completedLeagues, spartaVisited, datedVisits, customCount, wishlistCount, nlVisits, ml, tg, rc, km),
      progressText: a.progress(visitCount, totalStadiums, countriesCount, completedLeagues, spartaVisited, datedVisits, customCount, wishlistCount, nlVisits, ml, tg, rc, km),
    }));
  }, [visits, allStadiums, countriesVisited, leagueStats, customStadiums, wishlist, lang]);

  const earnedCount = achievements.filter(a => a.earned).length;

  // Challenge progress — inspired by The 92 Club
  const challengeProgress = useMemo(() => {
    const visitedIds = new Set(visits.map(v => v.stadium_id));

    return CHALLENGES.map(ch => {
      let visited = 0;
      let total = 0;

      if (ch.type === 'league') {
        const ls = leagueStats.find(l => l.league === ch.league);
        visited = ls?.visited || 0;
        total = ls?.total || 0;
      } else if (ch.type === 'multi_league') {
        ch.leagues.forEach(league => {
          const ls = leagueStats.find(l => l.league === league);
          visited += ls?.visited || 0;
          total += ls?.total || 0;
        });
      } else if (ch.type === 'biggest') {
        const sorted = [...allStadiums].filter(s => s.capacity).sort((a, b) => (b.capacity || 0) - (a.capacity || 0)).slice(0, ch.count);
        total = sorted.length;
        visited = sorted.filter(s => visitedIds.has(s.id)).length;
      } else if (ch.type === 'visit_count') {
        visited = visits.length;
        total = ch.target;
      } else if (ch.type === 'country_count') {
        visited = countriesVisited;
        total = ch.target;
      } else if (ch.type === 'specific_stadiums') {
        const targets = allStadiums.filter(s => ch.stadiumNames.includes(s.name));
        total = ch.stadiumNames.length;
        visited = targets.filter(s => visitedIds.has(s.id)).length;
      }

      return {
        ...ch,
        visited,
        total,
        percentage: total > 0 ? Math.round((visited / total) * 100) : 0,
        completed: total > 0 && visited >= total,
      };
    });
  }, [visits, allStadiums, leagueStats, countriesVisited]);

  const completedChallenges = challengeProgress.filter(c => c.completed).length;

  // Total travel kilometers (from Rotterdam: 51.9225, 4.4792)
  const totalKilometers = useMemo(() => {
    const ROTTERDAM = { lat: 51.9225, lng: 4.4792 };
    return Math.round(visits.reduce((total, v) => {
      const stadium = allStadiums.find(s => s.id === v.stadium_id);
      if (!stadium) return total;
      const dist = haversineDistance(ROTTERDAM.lat, ROTTERDAM.lng, stadium.latitude, stadium.longitude);
      return total + dist * 2; // Heen en terug
    }, 0));
  }, [visits, allStadiums]);

  // Average rating + top rated stadiums
  const ratingStats = useMemo(() => {
    const rated = visits.filter(v => v.rating && v.rating > 0);
    if (rated.length === 0) return { avg: 0, count: 0, top: [] as { name: string; rating: number }[] };
    const avg = rated.reduce((sum, v) => sum + (v.rating || 0), 0) / rated.length;
    const top = rated
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
      .map(v => {
        const stadium = allStadiums.find(s => s.id === v.stadium_id);
        return { name: stadium?.club?.name || stadium?.name || '?', rating: v.rating || 0 };
      });
    return { avg: Math.round(avg * 10) / 10, count: rated.length, top };
  }, [visits, allStadiums]);

  // Total goals seen
  const totalGoals = useMemo(() => {
    return visits.reduce((sum, v) => {
      if (!v.match_score) return sum;
      const parts = v.match_score.split('-').map(s => parseInt(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return sum + parts[0] + parts[1];
      }
      return sum;
    }, 0);
  }, [visits]);

  // Stadium records & extremes
  const stadiumRecords = useMemo(() => {
    if (allStadiums.length === 0) return null;
    const ROTTERDAM = { lat: 51.9225, lng: 4.4792 };
    const withCap = allStadiums.filter(s => (s.capacity ?? 0) > 0);
    const withYear = allStadiums.filter(s => s.built_year && s.built_year > 1800);

    const biggest = withCap.length > 0 ? withCap.reduce((a, b) => (a.capacity ?? 0) > (b.capacity ?? 0) ? a : b) : null;
    const smallest = withCap.length > 0 ? withCap.reduce((a, b) => (a.capacity ?? 0) < (b.capacity ?? 0) ? a : b) : null;
    const oldest = withYear.length > 0 ? withYear.reduce((a, b) => (a.built_year ?? 9999) < (b.built_year ?? 9999) ? a : b) : null;
    const newest = withYear.length > 0 ? withYear.reduce((a, b) => (a.built_year ?? 0) > (b.built_year ?? 0) ? a : b) : null;
    const northernmost = allStadiums.reduce((a, b) => a.latitude > b.latitude ? a : b);
    const southernmost = allStadiums.reduce((a, b) => a.latitude < b.latitude ? a : b);
    const easternmost = allStadiums.reduce((a, b) => a.longitude > b.longitude ? a : b);
    const westernmost = allStadiums.reduce((a, b) => a.longitude < b.longitude ? a : b);

    // Bram's personal records
    const visitedStadiums = visits.map(v => allStadiums.find(s => s.id === v.stadium_id)).filter(Boolean) as typeof allStadiums;
    const furthestVisit = visitedStadiums.length > 0
      ? visitedStadiums.reduce((a, b) =>
          haversineDistance(ROTTERDAM.lat, ROTTERDAM.lng, a.latitude, a.longitude) >
          haversineDistance(ROTTERDAM.lat, ROTTERDAM.lng, b.latitude, b.longitude) ? a : b)
      : null;
    const furthestDist = furthestVisit ? Math.round(haversineDistance(ROTTERDAM.lat, ROTTERDAM.lng, furthestVisit.latitude, furthestVisit.longitude)) : 0;

    const name = (s: typeof allStadiums[0] | null) => s ? (s.club?.name || s.name) : '?';
    const stadium = (s: typeof allStadiums[0] | null) => s?.name || '?';

    return { biggest, smallest, oldest, newest, northernmost, southernmost, easternmost, westernmost, furthestVisit, furthestDist, name, stadium };
  }, [allStadiums, visits]);

  // Matches logged count
  const matchesLogged = useMemo(() => visits.filter(v => v.match_score).length, [visits]);

  // Season list for filter
  const seasonList = useMemo(() => {
    const seasons = new Set<string>();
    visits.forEach(v => {
      const season = getSeasonFromDate(v.visit_date || null);
      if (season !== 'unknown') seasons.add(season);
    });
    return Array.from(seasons).sort().reverse();
  }, [visits]);

  // Photo upload handler
  const uploadVisitPhoto = async (stadiumId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) return; // Max 5MB
    const existingPhotos = visitPhotos.filter(p => p.stadium_id === stadiumId);
    if (existingPhotos.length >= 3) return; // Max 3 per stadium

    setUploadingPhoto(true);
    try {
      const fileName = `${stadiumId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage.from('visit-photos').upload(fileName, file, { contentType: file.type });
      if (uploadError) { console.error('Upload error:', uploadError); setUploadingPhoto(false); return; }
      const { data: urlData } = supabase.storage.from('visit-photos').getPublicUrl(fileName);
      const { data, error } = await supabase.from('bram_visit_photos').insert({
        stadium_id: stadiumId,
        photo_url: urlData.publicUrl,
      }).select('id, stadium_id, photo_url').single();
      if (!error && data) setVisitPhotos([...visitPhotos, data]);
    } catch (err) {
      console.error('Photo upload failed:', err);
    }
    setUploadingPhoto(false);
    setPhotoUploadStadium(null);
  };

  const deleteVisitPhoto = async (photoId: string) => {
    const photo = visitPhotos.find(p => p.id === photoId);
    if (!photo) return;
    // Extract path from URL
    const urlParts = photo.photo_url.split('/visit-photos/');
    if (urlParts[1]) {
      await supabase.storage.from('visit-photos').remove([decodeURIComponent(urlParts[1])]);
    }
    await supabase.from('bram_visit_photos').delete().eq('id', photoId);
    setVisitPhotos(visitPhotos.filter(p => p.id !== photoId));
  };

  // Share stats card generator
  const generateShareCard = async () => {
    setIsGeneratingShare(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d')!;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Decorative border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1000, 1000);
      ctx.strokeStyle = '#f59e0b44';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 50, 980, 980);

      // Title
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GROUNDHOPPER PRO', 540, 150);

      // Subtitle
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px system-ui, -apple-system, sans-serif';
      ctx.fillText(lang === 'nl' ? 'Mijn Stadion Statistieken' : 'My Stadium Statistics', 540, 195);

      // Divider
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(200, 230); ctx.lineTo(880, 230); ctx.stroke();

      // Big stats
      const percentage = totalStadiums > 0 ? Math.round((visits.length / totalStadiums) * 100) : 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 120px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${visits.length}`, 540, 370);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 40px system-ui, -apple-system, sans-serif';
      ctx.fillText(`/ ${totalStadiums} ${lang === 'nl' ? 'stadions' : 'stadiums'} (${percentage}%)`, 540, 420);

      // Progress bar
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(140, 460, 800, 30, 15);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.roundRect(140, 460, Math.max(30, 800 * (visits.length / Math.max(totalStadiums, 1))), 30, 15);
      ctx.fill();

      // Stats grid - row 1
      const statsY = 540;
      const statsRow1 = [
        { icon: '🌍', value: `${countriesVisited}`, label: lang === 'nl' ? 'landen' : 'countries' },
        { icon: '🏆', value: `${leagueStats.filter(l => l.visited > 0).length}`, label: lang === 'nl' ? 'competities' : 'leagues' },
        { icon: '🛣️', value: totalKilometers >= 1000 ? `${(totalKilometers / 1000).toFixed(1)}k` : `${totalKilometers}`, label: 'km' },
      ];
      statsRow1.forEach((stat, i) => {
        const x = 200 + i * 280;
        ctx.font = '36px system-ui';
        ctx.fillText(stat.icon, x, statsY);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.value, x, statsY + 50);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.label, x, statsY + 78);
        ctx.fillStyle = '#ffffff';
      });
      // Stats grid - row 2
      const statsY2 = statsY + 120;
      const statsRow2 = [
        { icon: '⚽', value: `${matchesLogged}`, label: lang === 'nl' ? 'wedstrijden' : 'matches' },
        { icon: '🥅', value: `${totalGoals}`, label: 'goals' },
        { icon: '⭐', value: `${earnedCount}/${ACHIEVEMENTS.length}`, label: 'achievements' },
      ];
      statsRow2.forEach((stat, i) => {
        const x = 200 + i * 280;
        ctx.font = '36px system-ui';
        ctx.fillText(stat.icon, x, statsY2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.value, x, statsY2 + 50);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px system-ui, -apple-system, sans-serif';
        ctx.fillText(stat.label, x, statsY2 + 78);
        ctx.fillStyle = '#ffffff';
      });

      // Earned achievements
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(200, 800); ctx.lineTo(880, 800); ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(lang === 'nl' ? 'ACHIEVEMENTS' : 'ACHIEVEMENTS', 540, 835);

      const earned = achievements.filter(a => a.earned);
      const iconsPerRow = 10;
      earned.forEach((a, i) => {
        const row = Math.floor(i / iconsPerRow);
        const col = i % iconsPerRow;
        const startX = 540 - (Math.min(earned.length - row * iconsPerRow, iconsPerRow) * 55) / 2;
        ctx.font = '36px system-ui';
        ctx.fillText(a.icon, startX + col * 55, 880 + row * 55);
      });

      // Footer
      ctx.fillStyle = '#475569';
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      ctx.fillText('groundhopper-pro.vercel.app', 540, 980);

      // Convert to blob and share/download
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob(b => resolve(b!), 'image/png'));
      const file = new File([blob], 'groundhopper-stats.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Groundhopper Pro Stats' });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'groundhopper-stats.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Share card generation failed:', err);
    }
    setIsGeneratingShare(false);
  };

  // Export backup as JSON
  const exportBackup = async () => {
    const [visitsRes, wishlistRes, customRes, photosRes] = await Promise.all([
      supabase.from('stadium_visits').select('*').eq('is_wishlist', false),
      supabase.from('bram_wishlist').select('*'),
      supabase.from('bram_custom_stadiums').select('*'),
      supabase.from('bram_visit_photos').select('*'),
    ]);
    const backup = {
      exported_at: new Date().toISOString(),
      version: '1.2',
      visits: visitsRes.data || [],
      wishlist: wishlistRes.data || [],
      custom_stadiums: customRes.data || [],
      photos: photosRes.data || [],
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groundhopper-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalStadiums = allStadiums.length;

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

  // Update visit date, notes, match info, and ratings
  const updateVisit = async (stadiumId: string, date: string | null, notes: string, matchData?: { home?: string; away?: string; score?: string; comp?: string; rating?: number; atmosphere_rating?: number; facilities_rating?: number }) => {
    const updatePayload: Record<string, unknown> = {
      first_visit_date: date || null,
      last_visit_date: date || null,
      notes: notes || null,
    };
    if (matchData) {
      updatePayload.match_home_team = matchData.home || null;
      updatePayload.match_away_team = matchData.away || null;
      updatePayload.match_score = matchData.score || null;
      updatePayload.match_competition = matchData.comp || null;
      if (matchData.rating !== undefined) updatePayload.rating = matchData.rating || null;
      if (matchData.atmosphere_rating !== undefined) updatePayload.atmosphere_rating = matchData.atmosphere_rating || null;
      if (matchData.facilities_rating !== undefined) updatePayload.facilities_rating = matchData.facilities_rating || null;
    }
    const { error } = await supabase
      .from('stadium_visits')
      .update(updatePayload)
      .eq('stadium_id', stadiumId);
    if (!error) {
      setVisits(visits.map(v =>
        v.stadium_id === stadiumId ? {
          ...v,
          visit_date: date,
          notes: notes || undefined,
          ...(matchData ? {
            match_home_team: matchData.home || undefined,
            match_away_team: matchData.away || undefined,
            match_score: matchData.score || undefined,
            match_competition: matchData.comp || undefined,
            rating: matchData.rating || undefined,
            atmosphere_rating: matchData.atmosphere_rating || undefined,
            facilities_rating: matchData.facilities_rating || undefined,
          } : {})
        } : v
      ));
      setEditingVisit(null);
    }
  };

  // Delete a single visit
  const removeVisit = async (stadiumId: string) => {
    await supabase.from('stadium_visits').delete().eq('stadium_id', stadiumId);
    setVisits(visits.filter(v => v.stadium_id !== stadiumId));
  };

  // Visit manager data: enriched visits with stadium info, sorted
  const visitManagerData = useMemo(() => {
    let data = visits.map(v => {
      const stadium = allStadiums.find(s => s.id === v.stadium_id);
      return { ...v, stadium };
    }).filter(v => v.stadium);

    if (visitManagerFilter === 'no_date') {
      data = data.filter(v => !v.visit_date);
    }

    if (visitManagerSeason !== 'all') {
      data = data.filter(v => getSeasonFromDate(v.visit_date || null) === visitManagerSeason);
    }

    if (visitManagerSort === 'date') {
      data.sort((a, b) => {
        if (!a.visit_date && !b.visit_date) return 0;
        if (!a.visit_date) return 1;
        if (!b.visit_date) return -1;
        return new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime();
      });
    } else {
      data.sort((a, b) => (a.stadium?.club?.name || a.stadium?.name || '').localeCompare(b.stadium?.club?.name || b.stadium?.name || ''));
    }

    return data;
  }, [visits, allStadiums, visitManagerSort, visitManagerFilter, visitManagerSeason]);

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
      {/* Row 2: Search + Filters + Stats + Achievements */}
      <div className="absolute top-10 left-2 right-2 z-[1001] flex items-start gap-1">
        {/* Search box */}
        <div className="relative flex-1 min-w-0">
          <div className={`relative rounded-lg shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder={tr(lang, 'Zoek stadion, club of stad...', 'Search stadium, club or city...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-2 rounded-lg text-sm ${
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
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} z-10`}>
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
        </div>

        {/* Filter toggle button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-1.5 transition ${
              showFilters || filterLeague !== 'all' || filterStatus !== 'all' || filterCountry !== 'all'
                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : theme === 'dark' ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{tr(lang, 'Filters', 'Filters')}</span>
            {(filterLeague !== 'all' || filterStatus !== 'all' || filterCountry !== 'all') && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                theme === 'dark' || showFilters || filterLeague !== 'all' || filterStatus !== 'all' || filterCountry !== 'all'
                  ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {[filterLeague !== 'all', filterStatus !== 'all', filterCountry !== 'all'].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Filter panel - dropdown */}
          {showFilters && (
            <div className={`absolute top-full right-0 mt-1 w-64 p-3 rounded-lg shadow-lg space-y-3 z-10 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
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

        {/* Stats button */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-1.5 transition ${
              showStats
                ? 'bg-green-600 text-white'
                : theme === 'dark' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900 border border-slate-200'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-green-500" />
            <span className="font-bold">{visits.length}</span>
            <span className={showStats ? 'text-green-200' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>/{allStadiums.length}</span>
          </button>

          {/* Stats Dashboard - dropdown */}
          {showStats && (
          <div className={`absolute top-full right-0 mt-1 w-72 rounded-lg shadow-lg overflow-hidden z-10 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
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

            {/* Dagboek stats: km, matches, rating */}
            <div className={`p-3 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {totalKilometers >= 1000 ? `${(totalKilometers / 1000).toFixed(1)}k` : totalKilometers}
                  </div>
                  <div className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>🛣️ km</div>
                </div>
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {matchesLogged}
                  </div>
                  <div className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>⚽ {tr(lang, 'wedstr.', 'matches')}</div>
                </div>
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {totalGoals}
                  </div>
                  <div className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>⚽ {tr(lang, 'goals', 'goals')}</div>
                </div>
              </div>
              {ratingStats.count > 0 && (
                <div className={`mt-2 text-center text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tr(lang, 'Gem. beoordeling', 'Avg. rating')}: <span className="text-amber-400">{'★'.repeat(Math.round(ratingStats.avg))}</span> ({ratingStats.avg})
                </div>
              )}
            </div>

            {/* Timeline + Visit Manager buttons */}
            <div className={`p-3 border-t space-y-2 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
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
              <button
                onClick={() => setShowVisitManager(true)}
                className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                  theme === 'dark'
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30'
                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {tr(lang, 'Mijn Bezoeken', 'My Visits')}
                {visits.filter(v => !v.visit_date).length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    theme === 'dark' ? 'bg-amber-500/30 text-amber-400' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {visits.filter(v => !v.visit_date).length} {tr(lang, 'zonder datum', 'no date')}
                  </span>
                )}
              </button>
              <button
                onClick={generateShareCard}
                disabled={isGeneratingShare}
                className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                  theme === 'dark'
                    ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                {isGeneratingShare ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                {isGeneratingShare ? tr(lang, 'Genereren...', 'Generating...') : tr(lang, 'Deel mijn stats 📤', 'Share my stats 📤')}
              </button>
              <button
                onClick={exportBackup}
                className={`w-full py-1.5 text-[10px] flex items-center justify-center gap-1 transition opacity-50 hover:opacity-100 ${
                  theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Download className="w-3 h-3" />
                {tr(lang, 'Backup exporteren', 'Export backup')}
              </button>
            </div>
          </div>
        )}
        </div>

        {/* Achievements button */}
        <button
          onClick={() => setShowAchievements(true)}
          className={`flex-shrink-0 px-3 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-1.5 transition ${
            theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span className="font-bold">{earnedCount}</span>
          <span className="text-amber-200 text-xs">/{ACHIEVEMENTS.length}</span>
        </button>
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
                {tr(lang, 'Zoek op stad of vul handmatig in', 'Search by city or fill in manually')}
              </p>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* City search — quick find */}
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'}`}>
                <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                  🔍 {tr(lang, 'Zoek op stad of clubnaam', 'Search by city or club name')}
                </label>
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder={tr(lang, 'Bijv. "Sevilla", "Feyenoord", "München"...', 'E.g. "Seville", "Feyenoord", "Munich"...')}
                  className={`w-full px-3 py-2 rounded-lg text-sm ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-500'
                      : 'bg-white text-slate-900 border-blue-300 placeholder-slate-400'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {citySearching && (
                  <div className={`mt-2 text-xs flex items-center gap-1.5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                    <Loader2 className="w-3 h-3 animate-spin" /> {tr(lang, 'Zoeken...', 'Searching...')}
                  </div>
                )}
                {citySearchResults.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                    {citySearchResults.map((result, i) => (
                      <button
                        key={`${result.club}-${i}`}
                        onClick={() => {
                          setNewStadium(prev => ({
                            ...prev,
                            club_name: result.club,
                            name: result.stadium,
                            city: result.city,
                            country: result.country,
                            primary_color: result.color,
                            ...(result.capacity ? { capacity: result.capacity } : {}),
                          }));
                          setCitySearchQuery('');
                          setCitySearchResults([]);
                          setFoundLocation(null);
                          setExistingMatch(null);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition ${
                          theme === 'dark'
                            ? 'hover:bg-slate-700/50'
                            : 'hover:bg-blue-100'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: result.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {result.club}
                          </div>
                          <div className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {result.stadium}{result.city ? ` · ${result.city}` : ''}{result.country ? `, ${result.country}` : ''}
                            {result.capacity ? ` · ${Number(result.capacity).toLocaleString()}` : ''}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {citySearchQuery.length >= 2 && !citySearching && citySearchResults.length === 0 && (
                  <div className={`mt-2 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    {tr(lang, 'Geen resultaten. Vul hieronder handmatig in.', 'No results. Fill in manually below.')}
                  </div>
                )}
              </div>

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

              {/* Historic stadium toggle */}
              <div className={`p-3 rounded-lg ${newStadium.is_historic
                ? (theme === 'dark' ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-amber-50 border border-amber-200')
                : (theme === 'dark' ? 'bg-slate-700/30 border border-slate-700/50' : 'bg-slate-50 border border-slate-200')
              }`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newStadium.is_historic}
                    onChange={(e) => setNewStadium(prev => ({ ...prev, is_historic: e.target.checked }))}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      🏚️ {tr(lang, 'Historisch stadion', 'Historic stadium')}
                    </span>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {tr(lang, 'Niet meer in gebruik / gesloopt', 'No longer in use / demolished')}
                    </p>
                  </div>
                </label>

                {newStadium.is_historic && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        {tr(lang, 'Bouwjaar', 'Built year')}
                      </label>
                      <input
                        type="number"
                        value={newStadium.built_year}
                        onChange={(e) => setNewStadium(prev => ({ ...prev, built_year: e.target.value }))}
                        placeholder="1934"
                        className={`w-full px-3 py-2 rounded-lg text-sm ${
                          theme === 'dark'
                            ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-500'
                            : 'bg-white text-slate-900 border-amber-300 placeholder-slate-400'
                        } border focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        {tr(lang, 'Gesloopt / gesloten', 'Demolished / closed')}
                      </label>
                      <input
                        type="number"
                        value={newStadium.demolished_year}
                        onChange={(e) => setNewStadium(prev => ({ ...prev, demolished_year: e.target.value }))}
                        placeholder="1996"
                        className={`w-full px-3 py-2 rounded-lg text-sm ${
                          theme === 'dark'
                            ? 'bg-slate-700 text-white border-slate-600 placeholder-slate-500'
                            : 'bg-white text-slate-900 border-amber-300 placeholder-slate-400'
                        } border focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {tr(lang, 'Notities', 'Notes')}
                </label>
                <textarea
                  value={newStadium.notes}
                  onChange={(e) => setNewStadium(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder={tr(lang, 'Optionele notities of trivia...', 'Optional notes or trivia...')}
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
                              {entry.match_score && (
                                <span className={`ml-2 font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                  {entry.match_home_team || '?'} {entry.match_score} {entry.match_away_team || '?'}
                                </span>
                              )}
                              {!entry.match_score && entry.notes && (
                                <span className={`ml-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                  — {entry.notes}
                                </span>
                              )}
                            </div>
                            {entry.rating && entry.rating > 0 && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <span key={s} className={`text-[10px] ${s <= entry.rating! ? 'text-amber-400' : theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>★</span>
                                ))}
                              </div>
                            )}
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

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAchievements(false)} />
          <div className={`relative w-full max-w-md max-h-[85vh] rounded-xl shadow-2xl flex flex-col ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  🏆 {tr(lang, 'Achievements', 'Achievements')}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {earnedCount}/{ACHIEVEMENTS.length} {tr(lang, 'behaald', 'earned')}
                </p>
              </div>
              <button onClick={() => setShowAchievements(false)}>
                <X className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-3">
                {achievements.map(a => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-xl border transition ${
                      a.earned
                        ? theme === 'dark'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-amber-50 border-amber-200'
                        : theme === 'dark'
                          ? 'bg-slate-700/50 border-slate-600/50 opacity-50'
                          : 'bg-slate-50 border-slate-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${a.earned ? '' : 'grayscale'}`}>{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm ${
                          a.earned
                            ? theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
                            : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {lang === 'nl' ? a.title_nl : a.title_en}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {lang === 'nl' ? a.desc_nl : a.desc_en}
                        </div>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                        a.earned
                          ? 'bg-green-500/20 text-green-500'
                          : theme === 'dark' ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {a.earned ? '✓' : a.progressText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-3 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => { setShowAchievements(false); generateShareCard(); }}
                disabled={isGeneratingShare}
                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                  theme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isGeneratingShare ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                {tr(lang, 'Deel mijn stats', 'Share my stats')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visit Manager Modal */}
      {showVisitManager && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowVisitManager(false); setEditingVisit(null); }} />
          <div className={`relative w-full max-w-lg max-h-[85vh] rounded-xl shadow-2xl flex flex-col ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <div>
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {tr(lang, 'Mijn Bezoeken', 'My Visits')}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {visits.length} {tr(lang, 'stadions bezocht', 'stadiums visited')}
                  {visits.filter(v => !v.visit_date).length > 0 && (
                    <span className="text-amber-500 ml-2">
                      ({visits.filter(v => !v.visit_date).length} {tr(lang, 'zonder datum', 'missing date')})
                    </span>
                  )}
                </p>
              </div>
              <button onClick={() => { setShowVisitManager(false); setEditingVisit(null); }}>
                <X className={`w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            </div>

            {/* Sort & Filter bar */}
            <div className={`px-4 py-2 flex items-center gap-2 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={() => setVisitManagerSort(visitManagerSort === 'date' ? 'name' : 'date')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
                  theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {visitManagerSort === 'date' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />}
                {visitManagerSort === 'date' ? tr(lang, 'Op datum', 'By date') : tr(lang, 'Op naam', 'By name')}
              </button>
              <button
                onClick={() => setVisitManagerFilter(visitManagerFilter === 'all' ? 'no_date' : 'all')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
                  visitManagerFilter === 'no_date'
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    : theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <AlertCircle className="w-3 h-3" />
                {tr(lang, 'Zonder datum', 'Missing date')}
                {visits.filter(v => !v.visit_date).length > 0 && (
                  <span className="font-bold">{visits.filter(v => !v.visit_date).length}</span>
                )}
              </button>
              {seasonList.length > 0 && (
                <div className="relative ml-auto">
                  <select
                    value={visitManagerSeason}
                    onChange={(e) => setVisitManagerSeason(e.target.value)}
                    className={`appearance-none px-2.5 py-1 pr-6 rounded text-xs font-medium transition ${
                      visitManagerSeason !== 'all'
                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                        : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <option value="all">📅 {tr(lang, 'Alle seizoenen', 'All seasons')}</option>
                    {seasonList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              )}
            </div>

            {/* Visit list */}
            <div className="flex-1 overflow-y-auto">
              {visitManagerData.length === 0 ? (
                <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {visitManagerFilter === 'no_date'
                      ? tr(lang, 'Alle bezoeken hebben een datum!', 'All visits have a date!')
                      : tr(lang, 'Nog geen bezoeken', 'No visits yet')}
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: theme === 'dark' ? '#334155' : '#e2e8f0' }}>
                  {visitManagerData.map((entry) => {
                    const isEditing = editingVisit === entry.stadium_id;
                    return (
                      <div
                        key={entry.stadium_id}
                        className={`px-4 py-3 transition ${
                          isEditing
                            ? theme === 'dark' ? 'bg-slate-700/50' : 'bg-blue-50/50'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Club logo */}
                          <div className="relative w-8 h-8 flex-shrink-0">
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{ backgroundColor: entry.stadium?.club?.primary_color || '#6b7280' }}
                            />
                            {entry.stadium?.club?.crest_url && (
                              <img
                                src={entry.stadium.club.crest_url}
                                alt=""
                                className="absolute inset-0 w-8 h-8 rounded-full object-contain bg-white p-0.5"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {entry.stadium?.club?.name || entry.stadium?.name}
                            </div>
                            <div className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {entry.stadium?.name} — {entry.stadium?.city}
                            </div>
                          </div>

                          {/* Date display */}
                          <div className="flex-shrink-0 text-right">
                            {entry.visit_date ? (
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                {new Date(entry.visit_date).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            ) : (
                              <span className="text-xs text-amber-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {tr(lang, 'Geen datum', 'No date')}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                if (isEditing) {
                                  setEditingVisit(null);
                                } else {
                                  setEditingVisit(entry.stadium_id);
                                  setEditVisitDate(entry.visit_date || '');
                                  setEditVisitNotes(entry.notes || '');
                                  setEditMatchHome(entry.match_home_team || entry.stadium?.club?.name || '');
                                  setEditMatchAway(entry.match_away_team || '');
                                  setEditMatchScore(entry.match_score || '');
                                  setEditMatchComp(entry.match_competition || '');
                                  setEditRating(entry.rating || 0);
                                  setEditAtmosphereRating(entry.atmosphere_rating || 0);
                                  setEditFacilitiesRating(entry.facilities_rating || 0);
                                }
                              }}
                              className={`p-1.5 rounded transition ${
                                isEditing
                                  ? 'bg-blue-500 text-white'
                                  : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title={tr(lang, 'Bewerken', 'Edit')}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(tr(lang,
                                  `Bezoek aan ${entry.stadium?.club?.name || entry.stadium?.name} verwijderen?`,
                                  `Remove visit to ${entry.stadium?.club?.name || entry.stadium?.name}?`
                                ))) {
                                  removeVisit(entry.stadium_id);
                                }
                              }}
                              className={`p-1.5 rounded transition ${
                                theme === 'dark' ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                              }`}
                              title={tr(lang, 'Verwijderen', 'Remove')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Edit panel */}
                        {isEditing && (
                          <div className={`mt-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className={`text-xs font-medium mb-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {tr(lang, 'Datum bezoek', 'Visit date')}
                                </label>
                                <input
                                  type="date"
                                  value={editVisitDate}
                                  onChange={(e) => setEditVisitDate(e.target.value)}
                                  className={`w-full px-2.5 py-1.5 rounded text-sm ${
                                    theme === 'dark' ? 'bg-slate-600 text-white border-slate-500' : 'bg-white text-slate-900 border-slate-300'
                                  } border`}
                                />
                              </div>
                              <div>
                                <label className={`text-xs font-medium mb-1 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {tr(lang, 'Notities', 'Notes')}
                                </label>
                                <input
                                  type="text"
                                  value={editVisitNotes}
                                  onChange={(e) => setEditVisitNotes(e.target.value)}
                                  placeholder={tr(lang, 'bijv. leuke sfeer', 'e.g. great atmosphere')}
                                  className={`w-full px-2.5 py-1.5 rounded text-sm ${
                                    theme === 'dark' ? 'bg-slate-600 text-white border-slate-500 placeholder-slate-400' : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                                  } border`}
                                />
                              </div>
                            </div>

                            {/* Match fields */}
                            <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'}`}>
                              <label className={`text-xs font-medium mb-1.5 block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                ⚽ {tr(lang, 'Wedstrijd', 'Match')}
                              </label>
                              <div className="grid grid-cols-5 gap-1.5 items-center">
                                <input
                                  type="text"
                                  value={editMatchHome}
                                  onChange={(e) => setEditMatchHome(e.target.value)}
                                  placeholder={tr(lang, 'Thuis', 'Home')}
                                  className={`col-span-2 px-2 py-1.5 rounded text-sm ${
                                    theme === 'dark' ? 'bg-slate-600 text-white placeholder-slate-400 border-slate-500' : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                                  } border`}
                                />
                                <input
                                  type="text"
                                  value={editMatchScore}
                                  onChange={(e) => setEditMatchScore(e.target.value)}
                                  placeholder="0-0"
                                  className={`col-span-1 px-2 py-1.5 rounded text-sm text-center font-bold ${
                                    theme === 'dark' ? 'bg-slate-600 text-white placeholder-slate-400 border-slate-500' : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                                  } border`}
                                />
                                <input
                                  type="text"
                                  value={editMatchAway}
                                  onChange={(e) => setEditMatchAway(e.target.value)}
                                  placeholder={tr(lang, 'Uit', 'Away')}
                                  className={`col-span-2 px-2 py-1.5 rounded text-sm ${
                                    theme === 'dark' ? 'bg-slate-600 text-white placeholder-slate-400 border-slate-500' : 'bg-white text-slate-900 border-slate-300 placeholder-slate-400'
                                  } border`}
                                />
                              </div>
                              <div className="mt-1.5 relative">
                                <select
                                  value={editMatchComp}
                                  onChange={(e) => setEditMatchComp(e.target.value)}
                                  className={`w-full px-2 py-1.5 rounded text-sm appearance-none ${
                                    theme === 'dark' ? 'bg-slate-600 text-white border-slate-500' : 'bg-white text-slate-900 border-slate-300'
                                  } border`}
                                >
                                  <option value="">{tr(lang, '— Competitie —', '— Competition —')}</option>
                                  {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                              </div>
                            </div>

                            {/* Star ratings — 3 categories */}
                            <div className={`mt-3 pt-3 border-t space-y-2.5 ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'}`}>
                              <div className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                ⭐ {tr(lang, 'Beoordeling', 'Rating')}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs w-16 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} title={tr(lang, '1=Stil · 5=Heksenketel', '1=Quiet · 5=Electric')}>⚽ {tr(lang, 'Sfeer', 'Vibe')}</span>
                                <StarRating rating={editAtmosphereRating} setRating={setEditAtmosphereRating} size="sm" theme={theme} />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs w-16 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} title={tr(lang, '1=Bouwval · 5=Wereldklasse', '1=Rundown · 5=World-class')}>🏟️ {tr(lang, 'Stadion', 'Stadium')}</span>
                                <StarRating rating={editFacilitiesRating} setRating={setEditFacilitiesRating} size="sm" theme={theme} />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs w-16 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} title={tr(lang, '1=Meh · 5=Onvergetelijk', '1=Meh · 5=Unforgettable')}>📍 {tr(lang, 'Beleving', 'Experience')}</span>
                                <StarRating rating={editRating} setRating={setEditRating} size="sm" theme={theme} />
                              </div>
                              <div className={`text-[9px] mt-1 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
                                {tr(lang, '1★ = slecht · 2★ = matig · 3★ = prima · 4★ = top · 5★ = wereldklasse', '1★ = poor · 2★ = fair · 3★ = good · 4★ = great · 5★ = world-class')}
                              </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => updateVisit(entry.stadium_id, editVisitDate || null, editVisitNotes, {
                                  home: editMatchHome, away: editMatchAway, score: editMatchScore, comp: editMatchComp,
                                  rating: editRating, atmosphere_rating: editAtmosphereRating, facilities_rating: editFacilitiesRating
                                })}
                                className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium flex items-center justify-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                {tr(lang, 'Opslaan', 'Save')}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStadium({ lat: entry.stadium!.latitude, lng: entry.stadium!.longitude });
                                  setShowVisitManager(false);
                                  setEditingVisit(null);
                                }}
                                className={`flex-1 py-1.5 rounded text-sm font-medium flex items-center justify-center gap-1.5 ${
                                  theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                                }`}
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                {tr(lang, 'Bekijk op kaart', 'View on map')}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Match info display (when not editing) */}
                        {!isEditing && entry.match_score && (
                          <div className={`mt-1 ml-11 text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            ⚽ {entry.match_home_team || '?'} {entry.match_score} {entry.match_away_team || '?'}
                            {entry.match_competition && (
                              <span className={`ml-1.5 font-normal ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                ({entry.match_competition})
                              </span>
                            )}
                          </div>
                        )}
                        {/* Rating display (when not editing) */}
                        {!isEditing && (entry.rating || entry.atmosphere_rating || entry.facilities_rating) && (
                          <div className="mt-0.5 ml-11 flex items-center gap-2 flex-wrap">
                            {entry.atmosphere_rating && entry.atmosphere_rating > 0 && (
                              <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                ⚽{'★'.repeat(entry.atmosphere_rating)}{'☆'.repeat(5 - entry.atmosphere_rating)}
                              </span>
                            )}
                            {entry.facilities_rating && entry.facilities_rating > 0 && (
                              <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                🏟️{'★'.repeat(entry.facilities_rating)}{'☆'.repeat(5 - entry.facilities_rating)}
                              </span>
                            )}
                            {entry.rating && entry.rating > 0 && (
                              <span className={`text-[10px] ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`}>
                                📍{'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                              </span>
                            )}
                          </div>
                        )}
                        {/* Notes display (when not editing) */}
                        {!isEditing && entry.notes && !entry.match_score && (
                          <div className={`mt-1 ml-11 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            📝 {entry.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Bottom Bar — Bram's Groundhops */}
      <div className={`absolute bottom-0 left-0 right-0 z-[1001] transition-all duration-300 ${
        theme === 'dark' ? 'bg-slate-900/95 backdrop-blur-sm border-t border-slate-700' : 'bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg'
      }`}>
        {/* Collapsed bar — always visible */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs uppercase tracking-wider font-bold whitespace-nowrap ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {tr(lang, "Bram's Groundhops", "Bram's Groundhops")}
            </span>
            <span className={`text-sm font-black tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {visits.length}/{allStadiums.length}
            </span>
            <span className={`text-xs whitespace-nowrap ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              · 🌍 {countriesVisited} · 🏆 {leagueStats.filter(l => l.visited > 0).length} · 🛣️ {totalKilometers.toLocaleString()} km
              {earnedCount > 0 && ` · ${earnedCount} 🏅`}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* What's New button */}
            {onShowWhatsNew && (
              <button
                onClick={onShowWhatsNew}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold transition ${
                  theme === 'dark'
                    ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
                title={tr(lang, "Bekijk wat er nieuw is", "See what's new")}
              >
                🚀 {tr(lang, "What's New", "What's New")}
              </button>
            )}
            {/* GPS button */}
            <button
              onClick={() => findNearestUnvisited()}
              className={`rounded-full p-1.5 transition ${
                showNearestPanel
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'text-blue-400 hover:bg-slate-700'
                    : 'text-blue-600 hover:bg-slate-100'
              }`}
              title={tr(lang, 'Dichtstbijzijnde onbezocht', 'Nearest unvisited')}
            >
              {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            </button>
            {/* Expand button — prominent */}
            <button
              onClick={() => setBottomExpanded(!bottomExpanded)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition ${
                bottomExpanded
                  ? theme === 'dark'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-600 text-white'
                  : theme === 'dark'
                    ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              📊 {tr(lang, bottomExpanded ? 'Sluiten' : 'Records & meer', bottomExpanded ? 'Close' : 'Records & more')}
              <ChevronDown className={`w-3 h-3 transition-transform ${bottomExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expanded panel */}
        {bottomExpanded && (
          <div className={`px-4 pb-3 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <div className="flex items-baseline gap-3 mt-2">
              <span className={`text-3xl font-black tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {visits.length}
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                / {allStadiums.length}
              </span>
            </div>
            <div className={`text-xs mt-1 flex items-center gap-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>🌍 {countriesVisited} {tr(lang, 'landen', 'countries')}</span>
              <span>🏆 {leagueStats.filter(l => l.visited > 0).length} {tr(lang, 'competities', 'leagues')}</span>
              <span>🛣️ {totalKilometers.toLocaleString()} km</span>
              {matchesLogged > 0 && <span>⚽ {matchesLogged} {tr(lang, 'wedstr.', 'matches')}</span>}
            </div>
            {/* Earned badges */}
            {earnedCount > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {achievements.filter(a => a.earned).map(a => (
                  <span
                    key={a.id}
                    title={lang === 'nl' ? a.title_nl : a.title_en}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30"
                  >
                    {a.icon}
                  </span>
                ))}
                <button
                  onClick={() => setShowAchievements(true)}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 hover:bg-amber-500/20 hover:text-amber-500 hover:border-amber-500/30 transition"
                >
                  +{ACHIEVEMENTS.length - earnedCount} 🔒
                </button>
              </div>
            )}

            {/* Records & Extremen */}
            {stadiumRecords && (
              <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                <div className={`text-[10px] uppercase tracking-wider font-bold mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                  {tr(lang, '📊 Records & Extremen', '📊 Records & Extremes')}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {stadiumRecords.biggest && (
                    <button onClick={() => setSelectedStadium({ lat: stadiumRecords.biggest!.latitude, lng: stadiumRecords.biggest!.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div className="text-base">🏟️</div>
                      <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Grootste', 'Biggest')}</div>
                      <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.biggest)}</div>
                      <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{(stadiumRecords.biggest.capacity ?? 0).toLocaleString()}</div>
                    </button>
                  )}
                  {stadiumRecords.smallest && (
                    <button onClick={() => setSelectedStadium({ lat: stadiumRecords.smallest!.latitude, lng: stadiumRecords.smallest!.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div className="text-base">🏠</div>
                      <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Kleinste', 'Smallest')}</div>
                      <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.smallest)}</div>
                      <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{(stadiumRecords.smallest.capacity ?? 0).toLocaleString()}</div>
                    </button>
                  )}
                  {stadiumRecords.oldest && (
                    <button onClick={() => setSelectedStadium({ lat: stadiumRecords.oldest!.latitude, lng: stadiumRecords.oldest!.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div className="text-base">📅</div>
                      <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Oudste', 'Oldest')}</div>
                      <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.oldest)}</div>
                      <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{stadiumRecords.oldest.built_year}</div>
                    </button>
                  )}
                  {stadiumRecords.newest && (
                    <button onClick={() => setSelectedStadium({ lat: stadiumRecords.newest!.latitude, lng: stadiumRecords.newest!.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div className="text-base">🆕</div>
                      <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Nieuwste', 'Newest')}</div>
                      <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.newest)}</div>
                      <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{stadiumRecords.newest.built_year}</div>
                    </button>
                  )}
                  <button onClick={() => setSelectedStadium({ lat: stadiumRecords.northernmost.latitude, lng: stadiumRecords.northernmost.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="text-base">⬆️</div>
                    <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Noordelijkst', 'Northernmost')}</div>
                    <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.northernmost)}</div>
                    <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{stadiumRecords.northernmost.city}</div>
                  </button>
                  <button onClick={() => setSelectedStadium({ lat: stadiumRecords.southernmost.latitude, lng: stadiumRecords.southernmost.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="text-base">⬇️</div>
                    <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Zuidelijkst', 'Southernmost')}</div>
                    <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.southernmost)}</div>
                    <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{stadiumRecords.southernmost.city}</div>
                  </button>
                  <button onClick={() => setSelectedStadium({ lat: stadiumRecords.easternmost.latitude, lng: stadiumRecords.easternmost.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="text-base">➡️</div>
                    <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Oostelijkst', 'Easternmost')}</div>
                    <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.easternmost)}</div>
                    <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{stadiumRecords.easternmost.city}</div>
                  </button>
                  <button onClick={() => setSelectedStadium({ lat: stadiumRecords.westernmost.latitude, lng: stadiumRecords.westernmost.longitude })} className={`text-left p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="text-base">⬅️</div>
                    <div className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tr(lang, 'Westelijkst', 'Westernmost')}</div>
                    <div className={`truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stadiumRecords.name(stadiumRecords.westernmost)}</div>
                    <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{stadiumRecords.westernmost.city}</div>
                  </button>
                </div>
                {/* Bram's personal record */}
                {stadiumRecords.furthestVisit && (
                  <button
                    onClick={() => setSelectedStadium({ lat: stadiumRecords.furthestVisit!.latitude, lng: stadiumRecords.furthestVisit!.longitude })}
                    className={`w-full mt-2 p-2 rounded-lg text-left flex items-center gap-3 transition ${theme === 'dark' ? 'bg-green-900/20 hover:bg-green-900/30 border border-green-800/30' : 'bg-green-50 hover:bg-green-100 border border-green-200'}`}
                  >
                    <span className="text-lg">🧳</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[11px] font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                        {tr(lang, "Bram's verste reis", "Bram's furthest trip")}
                      </div>
                      <div className={`text-[11px] truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {stadiumRecords.name(stadiumRecords.furthestVisit)} — {stadiumRecords.furthestVisit.city}
                      </div>
                    </div>
                    <span className={`text-xs font-bold tabular-nums ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                      {stadiumRecords.furthestDist} km
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Uitdagingen / Challenges — inspired by The 92 Club */}
            <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  🎯 {tr(lang, 'Uitdagingen', 'Challenges')}
                </span>
                <span className={`text-[9px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  {completedChallenges}/{CHALLENGES.length} ✓
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {challengeProgress.map(ch => (
                  <div
                    key={ch.id}
                    className={`p-2 rounded-lg border transition ${
                      ch.completed
                        ? theme === 'dark'
                          ? 'bg-green-900/20 border-green-700/30'
                          : 'bg-green-50 border-green-200'
                        : theme === 'dark'
                          ? 'bg-slate-800/50 border-slate-700/30'
                          : 'bg-slate-50 border-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{ch.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[11px] font-bold truncate ${
                          ch.completed
                            ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                            : theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {lang === 'nl' ? ch.title_nl : ch.title_en}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold tabular-nums flex-shrink-0 ${
                        ch.completed
                          ? 'text-green-500'
                          : ch.percentage > 0
                            ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {ch.completed ? '✓' : `${ch.visited}/${ch.total}`}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className={`mt-1 h-1 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ch.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.max(ch.percentage, ch.percentage > 0 ? 3 : 0)}%` }}
                      />
                    </div>
                    <div className={`text-[9px] mt-0.5 truncate ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {lang === 'nl' ? ch.desc_nl : ch.desc_en}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-2 p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50 border border-slate-700/30' : 'bg-blue-50/50 border border-blue-100'}`}>
                <div className={`text-[10px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tr(lang,
                    '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Geïnspireerd door The 92 Club — opgericht in 1978 om alle 92 stadions van de Engelse Football League te bezoeken.',
                    '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inspired by The 92 Club — founded in 1978 to visit all 92 English Football League grounds.'
                  )}
                </div>
                <div className="flex gap-3 mt-1.5">
                  <a href="https://www.the92.net/" target="_blank" rel="noopener noreferrer" className={`text-[9px] font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    the92.net ↗
                  </a>
                  <a href="https://www.footballgroundmap.com/" target="_blank" rel="noopener noreferrer" className={`text-[9px] font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    Football Ground Map ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nearest Unvisited Panel */}
      {showNearestPanel && userLocation && (
        <div className={`absolute bottom-12 right-4 z-[1001] w-72 rounded-xl shadow-xl overflow-hidden ${
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
        center={[52.2, 5.5]}
        zoom={8}
        className="w-full h-full"
        zoomControl={false}
        worldCopyJump={false}
        maxBoundsViscosity={1.0}
        closePopupOnClick={true}
      >
        <MapBounds />
        {selectedStadium && <FlyToStadium lat={selectedStadium.lat} lng={selectedStadium.lng} />}
        
        <TileLayer
          key={theme}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url={theme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
          noWrap={true}
          className={theme === 'dark' ? 'dark-map-tiles' : ''}
        />
        <ZoomControl position="bottomright" />

        {filteredStadiums.map((stadium) => {
          const isSparta = stadium.club?.short_name === 'SPA';
          const isVisited = visits.some(v => v.stadium_id === stadium.id);
          const isOnWishlist = wishlist.some(w => w.stadium_id === stadium.id);
          const isCustom = stadium.id.startsWith('custom-');
          const isLostGround = stadium.is_active === false;
          const visitData = visits.find(v => v.stadium_id === stadium.id);
          const customData = isCustom ? customStadiums.find(c => `custom-${c.id}` === stadium.id) : null;

          return (
            <Marker
              key={stadium.id}
              position={[stadium.latitude, stadium.longitude]}
              icon={createClubIcon(stadium.club?.primary_color || '#ef4444', stadium.club?.crest_url, isSparta, isVisited, isOnWishlist, isCustom, !stadium.club?.crest_url ? (stadium.club?.short_name?.substring(0, 3) || null) : null, isLostGround)}
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
                  {/* Panini header - golden bar (or grey for lost grounds) with crest */}
                  <div className={`px-4 py-2.5 flex items-center gap-3 rounded-t-lg ${isLostGround ? 'bg-gradient-to-r from-stone-700 via-stone-500 to-stone-700' : 'bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700'}`}>
                    <div className="w-11 h-11 bg-white rounded-lg p-1 flex-shrink-0 shadow-sm">
                      {stadium.club?.crest_url ? (
                        <img src={stadium.club.crest_url} alt="" className={`w-full h-full object-contain ${isLostGround ? 'grayscale-[30%]' : ''}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: stadium.club?.primary_color || '#6b7280', color: 'white' }}>
                          {stadium.club?.short_name?.substring(0, 2) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base truncate drop-shadow-sm">{stadium.club?.name || 'Unknown'}</h3>
                      <div className="flex items-center gap-2">
                        {isLostGround && (
                          <span className="text-xs px-1.5 py-0.5 bg-stone-800/50 text-stone-200 rounded font-medium">
                            🏚️ Lost Ground
                          </span>
                        )}
                        {stadium.club?.current_league && !isLostGround && (
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

                  {/* Stadium photo with TheSportsDB fallback */}
                  <StadiumPhoto
                    clubName={stadium.club?.name}
                    imageUrl={stadium.image_url}
                    stadiumName={stadium.name}
                    city={stadium.city}
                    builtYear={stadium.built_year}
                    theme={theme}
                    lang={lang}
                  />

                  {/* Trivia / Notable events + Former names */}
                  {(stadium.notable_events || (stadium.former_names && stadium.former_names.length > 0)) && (
                    <div className={`px-4 py-2.5 text-xs space-y-1.5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-amber-200/50'}`}>
                      {stadium.former_names && stadium.former_names.length > 0 && (
                        <div className={`flex gap-1.5 leading-tight ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span className="flex-shrink-0">📛</span>
                          <span>{tr(lang, 'Vorige namen', 'Former names')}: {stadium.former_names.join(' → ')}</span>
                        </div>
                      )}
                      {stadium.notable_events && (
                        <div className={`leading-tight ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className={`font-bold text-[10px] uppercase tracking-wider ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                            📖 {tr(lang, 'Verhaal', 'Story')}
                          </span>
                          <p className="mt-1">{stadium.notable_events}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* User's own visit photos */}
                  {isVisited && (() => {
                    const photos = visitPhotos.filter(p => p.stadium_id === stadium.id);
                    return (
                      <div className={`px-3 py-2 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-amber-200/50'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            📸 {tr(lang, 'Mijn foto\'s', 'My photos')}
                          </span>
                          {photos.length < 3 && (
                            <button
                              onClick={() => {
                                setPhotoUploadStadium(stadium.id);
                                fileInputRef.current?.click();
                              }}
                              disabled={uploadingPhoto}
                              className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 transition ${
                                theme === 'dark'
                                  ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                            >
                              {uploadingPhoto ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                              {tr(lang, 'Foto toevoegen', 'Add photo')}
                            </button>
                          )}
                        </div>
                        {photos.length > 0 ? (
                          <div className="flex gap-1.5 overflow-x-auto">
                            {photos.map(photo => (
                              <div key={photo.id} className="relative group flex-shrink-0">
                                <img
                                  src={photo.photo_url}
                                  alt=""
                                  className="w-16 h-16 rounded-lg object-cover border-2 border-green-500/30"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteVisitPhoto(photo.id); }}
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-2.5 h-2.5 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {tr(lang, 'Nog geen foto\'s — voeg er een toe!', 'No photos yet — add one!')}
                          </p>
                        )}
                      </div>
                    );
                  })()}

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

                  {/* Match info + Rating for visited stadiums */}
                  {isVisited && visitData && (visitData.match_score || visitData.rating) && (
                    <div className={`px-4 py-2.5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-amber-200/50'}`}>
                      {visitData.match_score && (
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {visitData.match_home_team || '?'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold text-sm ${theme === 'dark' ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                            {visitData.match_score}
                          </span>
                          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {visitData.match_away_team || '?'}
                          </span>
                        </div>
                      )}
                      {visitData.match_competition && (
                        <div className={`text-center text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                          {visitData.match_competition}
                        </div>
                      )}
                      {visitData.rating && (
                        <div className="flex justify-center mt-1">
                          <StarRating rating={visitData.rating} size="sm" theme={theme} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Club details from TheSportsDB (jersey + history) */}
                  {stadium.club?.name && !isCustom && (
                    <ClubPopupDetails clubName={stadium.club.name} theme={theme} lang={lang} />
                  )}

                  {/* Famous club story (Netflix series, etc.) */}
                  {stadium.club?.name && CLUB_STORIES[stadium.club.name] && (() => {
                    const story = CLUB_STORIES[stadium.club.name];
                    const lines = lang === 'nl' ? story.lines.nl : story.lines.en;
                    const label = lang === 'nl' ? story.label.nl : story.label.en;
                    return (
                      <div className={`border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-amber-200/50'}`}>
                        <div className={`px-4 py-2 ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'}`}>
                          <div className={`font-bold text-[10px] uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                            {story.icon} {label}
                          </div>
                          <div className="space-y-1">
                            {lines.map((line, i) => (
                              <div key={i} className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

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
                        <label className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
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

                        {/* Match details (optional) */}
                        <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-600' : 'border-amber-200'}`}>
                          <label className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            ⚽ {tr(lang, 'Wedstrijd (optioneel)', 'Match (optional)')}
                          </label>
                          <div className="grid grid-cols-5 gap-1.5 mt-1.5 items-center">
                            <input
                              type="text"
                              value={matchHomeTeam}
                              onChange={(e) => setMatchHomeTeam(e.target.value)}
                              placeholder={tr(lang, 'Thuis', 'Home')}
                              className={`col-span-2 px-2 py-1.5 rounded text-sm ${
                                theme === 'dark' ? 'bg-slate-600 text-white placeholder-slate-400' : 'bg-white text-slate-900 border border-amber-300 placeholder-slate-400'
                              }`}
                            />
                            <input
                              type="text"
                              value={matchScore}
                              onChange={(e) => setMatchScore(e.target.value)}
                              placeholder="0-0"
                              className={`col-span-1 px-2 py-1.5 rounded text-sm text-center font-bold ${
                                theme === 'dark' ? 'bg-slate-600 text-white placeholder-slate-400' : 'bg-white text-slate-900 border border-amber-300 placeholder-slate-400'
                              }`}
                            />
                            <input
                              type="text"
                              value={matchAwayTeam}
                              onChange={(e) => setMatchAwayTeam(e.target.value)}
                              placeholder={tr(lang, 'Uit', 'Away')}
                              className={`col-span-2 px-2 py-1.5 rounded text-sm ${
                                theme === 'dark' ? 'bg-slate-600 text-white placeholder-slate-400' : 'bg-white text-slate-900 border border-amber-300 placeholder-slate-400'
                              }`}
                            />
                          </div>
                          <div className="mt-1.5 relative">
                            <select
                              value={matchCompetition}
                              onChange={(e) => setMatchCompetition(e.target.value)}
                              className={`w-full px-2 py-1.5 rounded text-sm appearance-none ${
                                theme === 'dark' ? 'bg-slate-600 text-white' : 'bg-white text-slate-900 border border-amber-300'
                              }`}
                            >
                              <option value="">{tr(lang, '— Competitie —', '— Competition —')}</option>
                              {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
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
                        if (isVisited) { toggleVisit(stadium.id); } else { setShowDatePicker(stadium.id); setVisitDate(''); setMatchHomeTeam(stadium.club?.name || ''); setMatchAwayTeam(''); setMatchScore(''); setMatchCompetition(''); }
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

      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && photoUploadStadium) {
            uploadVisitPhoto(photoUploadStadium, file);
          }
          e.target.value = '';
        }}
      />

      <style jsx global>{`
        .custom-stadium-marker { background: transparent; border: none; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3)); }
        .custom-added { filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3)) drop-shadow(0 0 6px rgba(139, 92, 246, 0.4)); }
        .sparta-special { filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4)); z-index: 1000 !important; }
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
