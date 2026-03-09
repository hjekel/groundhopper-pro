'use client';

import { Stadium } from '@/types/database';
import { MapPin, Users, Calendar, ExternalLink, Check } from 'lucide-react';

interface StadiumPopupProps {
  stadium: Stadium;
  isVisited?: boolean;
  onVisitToggle?: () => void;
}

export function StadiumPopup({ stadium, isVisited, onVisitToggle }: StadiumPopupProps) {
  const division = stadium.club?.current_league?.division || 1;
  const divisionColors: Record<number, string> = {
    1: 'bg-red-500',
    2: 'bg-blue-500',
    3: 'bg-yellow-500',
    4: 'bg-purple-500',
  };
  
  return (
    <div className="p-4 min-w-[280px]">
      {/* Club crest and name */}
      <div className="flex items-start gap-3 mb-3">
        {stadium.club?.crest_url ? (
          <img 
            src={stadium.club.crest_url} 
            alt={stadium.club.name}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: stadium.club?.primary_color || '#6b7280' }}
          >
            {stadium.club?.short_name?.substring(0, 2) || '??'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white dark:text-white light:text-slate-900 text-lg leading-tight">
            {stadium.club?.name || 'Unknown Club'}
          </h3>
          {stadium.club?.current_league && (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium text-white ${divisionColors[division]}`}>
              {stadium.club.current_league.name}
            </span>
          )}
        </div>
      </div>
      
      {/* Stadium info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-600">
          <span className="text-lg">🏟️</span>
          <span className="font-medium">{stadium.name}</span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 light:text-slate-500">
          <MapPin className="w-4 h-4" />
          <span>{stadium.city}, {stadium.country?.name}</span>
        </div>
        
        {stadium.capacity && (
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 light:text-slate-500">
            <Users className="w-4 h-4" />
            <span>{stadium.capacity.toLocaleString()} capacity</span>
          </div>
        )}
        
        {stadium.built_year && (
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 light:text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Built {stadium.built_year}</span>
            {stadium.renovated_year && (
              <span className="text-slate-500">(renovated {stadium.renovated_year})</span>
            )}
          </div>
        )}
        
        {/* Coordinates */}
        <div className="text-xs text-slate-500 font-mono pt-1">
          {stadium.latitude.toFixed(4)}°N, {stadium.longitude.toFixed(4)}°E
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700 dark:border-slate-700 light:border-slate-200">
        <button
          onClick={onVisitToggle}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isVisited 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
              : 'bg-slate-700 dark:bg-slate-700 light:bg-slate-100 text-white dark:text-white light:text-slate-900 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-200'
          }`}
        >
          {isVisited ? (
            <>
              <Check className="w-4 h-4" />
              Visited
            </>
          ) : (
            'Mark as Visited'
          )}
        </button>
        
        <a
          href={`/stadiums/${stadium.id}`}
          className="py-2 px-3 rounded-lg bg-slate-700 dark:bg-slate-700 light:bg-slate-100 text-white dark:text-white light:text-slate-900 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-200 transition-colors"
          title="View details"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
