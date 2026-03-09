'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create marker icon with club color
const createClubIcon = (primaryColor: string, isSparta: boolean = false) => {
  const color = primaryColor || '#ef4444';
  
  // Sparta gets a special animated golden glow marker
  if (isSparta) {
    const svg = `
      <svg width="48" height="56" viewBox="0 0 48 56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="sparta-outer-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood flood-color="#FFD700" flood-opacity="0.8"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="sparta-gradient" cx="50%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:#ff4444"/>
            <stop offset="100%" style="stop-color:#CC0000"/>
          </radialGradient>
        </defs>
        <!-- Outer glow ring (animated via CSS) -->
        <circle cx="24" cy="22" r="18" fill="none" stroke="#FFD700" stroke-width="3" opacity="0.6" class="sparta-pulse"/>
        <!-- Main pin -->
        <path d="M24 4C13.507 4 5 12.507 5 23c0 10.493 19 29 19 29s19-18.507 19-29C43 12.507 34.493 4 24 4z" 
              fill="url(#sparta-gradient)" filter="url(#sparta-outer-glow)" stroke="#FFD700" stroke-width="2"/>
        <!-- Inner white circle -->
        <circle cx="24" cy="22" r="10" fill="white"/>
        <!-- Castle emoji -->
        <text x="24" y="27" text-anchor="middle" font-size="14">🏰</text>
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
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" 
            fill="${color}" filter="url(#shadow)"/>
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

// Component to set map bounds (prevent infinite scrolling)
function MapBounds() {
  const map = useMap();
  
  useEffect(() => {
    // Set max bounds to prevent map from repeating
    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);
    
    map.setMaxBounds(bounds);
    map.setMinZoom(3);
    map.setMaxZoom(18);
    
    // Prevent dragging outside bounds
    map.on('drag', function() {
      map.panInsideBounds(bounds, { animate: false });
    });
  }, [map]);
  
  return null;
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
    current_league?: {
      division: number;
      name: string;
    } | null;
  } | null;
}

interface StadiumMapProps {
  stadiums: Stadium[];
  theme: 'dark' | 'light';
  lang: 'nl' | 'en';
}

// Translations
const translations = {
  nl: {
    seats: 'stoelen',
    built: 'Gebouwd',
    address: 'Adres',
    league: 'Competitie',
    loadingMap: 'Kaart laden...',
  },
  en: {
    seats: 'seats',
    built: 'Built',
    address: 'Address',
    league: 'League',
    loadingMap: 'Loading map...',
  }
};

export default function StadiumMap({ stadiums, theme, lang }: StadiumMapProps) {
  const [mounted, setMounted] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'
      }`}>
        <div className={theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}>
          {t.loadingMap}
        </div>
      </div>
    );
  }

  // Default center on Europe
  const defaultCenter: [number, number] = [50.0, 10.0];
  const defaultZoom = 5;

  // Tile layers
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={false}
        worldCopyJump={false}
        maxBoundsViscosity={1.0}
      >
        <MapBounds />
        
        {/* Tile layer based on theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={theme === 'dark' ? darkTileUrl : lightTileUrl}
          noWrap={true}
        />
        
        <ZoomControl position="bottomright" />
        
        {stadiums.map((stadium) => {
          const isSparta = stadium.club?.short_name === 'SPA';
          const clubColor = stadium.club?.primary_color || '#ef4444';
          
          return (
            <Marker
              key={stadium.id}
              position={[stadium.latitude, stadium.longitude]}
              icon={createClubIcon(clubColor, isSparta)}
            >
              <Popup>
                <div className={`min-w-[280px] max-w-[320px] ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {/* Club Logo & Stadium Name Header */}
                  <div className="flex items-start gap-3 p-4 border-b border-slate-700/30">
                    {/* Club crest placeholder or emoji */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ 
                        backgroundColor: stadium.club?.primary_color || '#ef4444',
                        color: 'white'
                      }}
                    >
                      {isSparta ? '🏰' : '⚽'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg leading-tight">{stadium.name}</h3>
                      {stadium.club && (
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {stadium.club.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stadium Photo via placeholder */}
                  <div 
                    className="h-28 bg-cover bg-center relative overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, transparent 50%, ${theme === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)'}), url('https://source.unsplash.com/400x200/?football,stadium,${encodeURIComponent(stadium.city || 'europe')}')`,
                      backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
                    }}
                  >
                    <div className="absolute bottom-2 left-3 right-3">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        📍 {stadium.city}
                      </div>
                    </div>
                  </div>

                  {/* Stadium Details */}
                  <div className="p-4 space-y-2">
                    {/* Capacity */}
                    {stadium.capacity && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          👥 {lang === 'nl' ? 'Capaciteit' : 'Capacity'}
                        </span>
                        <span className="font-semibold">
                          {stadium.capacity.toLocaleString()} {t.seats}
                        </span>
                      </div>
                    )}

                    {/* Built Year */}
                    {stadium.built_year && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          🏗️ {t.built}
                        </span>
                        <span className="font-semibold">{stadium.built_year}</span>
                      </div>
                    )}

                    {/* League */}
                    {stadium.club?.current_league && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          🏆 {t.league}
                        </span>
                        <span className="font-semibold text-sm">{stadium.club.current_league.name}</span>
                      </div>
                    )}

                    {/* Address */}
                    {stadium.address && (
                      <div className="pt-2 border-t border-slate-700/30">
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          📍 {stadium.address}
                        </div>
                      </div>
                    )}

                    {/* Sparta special badge */}
                    {isSparta && (
                      <div className="mt-3 p-2 bg-red-900/30 rounded-lg border border-red-800/50">
                        <div className="flex items-center gap-2 text-red-400">
                          <span>🏰</span>
                          <span className="text-xs font-medium">
                            {lang === 'nl' 
                              ? 'Oudste profclub van Nederland (1888)' 
                              : 'Oldest professional club in the Netherlands (1888)'
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Google Maps Link */}
                    <div className="mt-3 pt-3 border-t border-slate-700/30">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stadium.name + ' ' + stadium.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition shadow-md"
                      >
                        <span>🗺️</span>
                        <span>{lang === 'nl' ? 'Open in Google Maps' : 'Open in Google Maps'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .custom-stadium-marker {
          background: transparent;
          border: none;
        }
        
        /* Sparta pulsing glow animation */
        .sparta-special .sparta-pulse {
          animation: sparta-glow-pulse 2s ease-in-out infinite;
          transform-origin: center;
        }
        
        @keyframes sparta-glow-pulse {
          0%, 100% {
            opacity: 0.4;
            r: 18;
          }
          50% {
            opacity: 0.8;
            r: 22;
          }
        }
        
        .sparta-special {
          filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
          z-index: 1000 !important;
        }
        
        /* Dark mode popup styling */
        html.dark .leaflet-popup-content-wrapper {
          background: #1e293b;
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        
        html.dark .leaflet-popup-tip {
          background: #1e293b;
        }
        
        html.dark .leaflet-popup-content {
          margin: 0;
          color: white;
        }

        /* Light mode popup styling */
        html.light .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        
        html.light .leaflet-popup-tip {
          background: white;
        }
        
        html.light .leaflet-popup-content {
          margin: 0;
          color: #1e293b;
        }

        .leaflet-popup-close-button {
          color: inherit !important;
          font-size: 20px !important;
          padding: 8px !important;
        }
      `}</style>
    </div>
  );
}
