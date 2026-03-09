'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SpartaTributeProps {
  onClose: () => void;
  theme: 'dark' | 'light';
  lang: 'nl' | 'en';
}

interface ClubHistory {
  founding_story: string;
  name_origin: string;
  motto: string;
  anthem_name: string;
}

interface ClubFact {
  id: string;
  title: string;
  content: string;
  category: string;
  year: number;
  is_highlight: boolean;
}

interface ClubLegend {
  id: string;
  name: string;
  nickname: string;
  role: string;
  position: string;
  biography: string;
  famous_quote: string;
  legend_tier: number;
}

interface ClubTrophy {
  id: string;
  competition_name: string;
  competition_type: string;
  season: string;
  year: number;
  notes: string;
}

type TabType = 'overview' | 'facts' | 'legends' | 'trophies';

const translations = {
  nl: {
    title: 'Sparta Rotterdam',
    subtitle: 'De oudste profclub van Nederland',
    tabs: {
      overview: 'Overzicht',
      facts: 'Feiten & Weetjes',
      legends: 'Legendes',
      trophies: 'Erelijst',
    },
    founded: 'Opgericht',
    motto: 'Motto',
    anthem: 'Clublied',
    close: 'Sluiten',
    loading: 'Laden...',
    quote: 'Citaat',
    role: 'Rol',
    championships: 'Landstitels',
    cups: 'Bekers',
  },
  en: {
    title: 'Sparta Rotterdam',
    subtitle: 'The oldest professional club in the Netherlands',
    tabs: {
      overview: 'Overview',
      facts: 'Facts & Trivia',
      legends: 'Legends',
      trophies: 'Honours',
    },
    founded: 'Founded',
    motto: 'Motto',
    anthem: 'Club Anthem',
    close: 'Close',
    loading: 'Loading...',
    quote: 'Quote',
    role: 'Role',
    championships: 'Championships',
    cups: 'Cups',
  }
};

export default function SpartaTribute({ onClose, theme, lang }: SpartaTributeProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [history, setHistory] = useState<ClubHistory | null>(null);
  const [facts, setFacts] = useState<ClubFact[]>([]);
  const [legends, setLegends] = useState<ClubLegend[]>([]);
  const [trophies, setTrophies] = useState<ClubTrophy[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = translations[lang];

  useEffect(() => {
    async function fetchSpartaData() {
      try {
        // Get Sparta club ID
        const { data: spartaClub } = await supabase
          .from('clubs')
          .select('id')
          .eq('short_name', 'SPA')
          .single();

        if (!spartaClub) return;

        // Fetch all data in parallel
        const [historyRes, factsRes, legendsRes, trophiesRes] = await Promise.all([
          supabase.from('club_history').select('*').eq('club_id', spartaClub.id).single(),
          supabase.from('club_facts').select('*').eq('club_id', spartaClub.id).order('year', { ascending: true }),
          supabase.from('club_legends').select('*').eq('club_id', spartaClub.id).order('legend_tier', { ascending: true }),
          supabase.from('club_trophies').select('*').eq('club_id', spartaClub.id).order('year', { ascending: true }),
        ]);

        if (historyRes.data) setHistory(historyRes.data);
        if (factsRes.data) setFacts(factsRes.data);
        if (legendsRes.data) setLegends(legendsRes.data);
        if (trophiesRes.data) setTrophies(trophiesRes.data);
      } catch (error) {
        console.error('Error fetching Sparta data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpartaData();
  }, []);

  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subtextClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const cardClass = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 modal-backdrop bg-black/60">
      <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${bgClass}`}>
        {/* Header with Sparta branding */}
        <div className="relative h-48 bg-gradient-to-br from-red-700 via-red-600 to-red-800 overflow-hidden">
          {/* Castle pattern background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L45 15 L45 30 L35 30 L35 40 L25 40 L25 30 L15 30 L15 15 L25 15 Z' fill='white'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          {/* Content */}
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2 castle-glow">🏰</div>
              <h1 className="text-3xl font-bold text-white">{t.title}</h1>
              <p className="text-red-200 mt-1">{t.subtitle}</p>
              <p className="text-white/80 text-sm mt-2">1888 - {new Date().getFullYear()}</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${borderClass}`}>
          {(['overview', 'facts', 'legends', 'trophies'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-500'
                  : `${subtextClass} hover:text-red-400`
              }`}
            >
              {t.tabs[tab]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              <span className={`ml-3 ${subtextClass}`}>{t.loading}</span>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && history && (
                <div className="space-y-6">
                  {/* Founding Story */}
                  <div className={`p-6 rounded-xl ${cardClass}`}>
                    <h3 className={`text-lg font-bold mb-3 ${textClass}`}>
                      {lang === 'nl' ? 'Het Verhaal' : 'The Story'}
                    </h3>
                    <p className={`leading-relaxed ${subtextClass}`}>
                      {history.founding_story}
                    </p>
                  </div>

                  {/* Quick Facts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${cardClass}`}>
                      <div className={`text-sm ${subtextClass}`}>{t.founded}</div>
                      <div className={`text-2xl font-bold ${textClass}`}>1 april 1888</div>
                    </div>
                    <div className={`p-4 rounded-xl ${cardClass}`}>
                      <div className={`text-sm ${subtextClass}`}>{t.championships}</div>
                      <div className={`text-2xl font-bold ${textClass}`}>6×</div>
                    </div>
                    <div className={`p-4 rounded-xl ${cardClass}`}>
                      <div className={`text-sm ${subtextClass}`}>{t.motto}</div>
                      <div className={`text-lg font-semibold ${textClass}`}>{history.motto || 'Én jaren nog hierna'}</div>
                    </div>
                    <div className={`p-4 rounded-xl ${cardClass}`}>
                      <div className={`text-sm ${subtextClass}`}>{t.anthem}</div>
                      <div className={`text-lg font-semibold ${textClass}`}>{history.anthem_name || 'De Sparta Marsch'}</div>
                    </div>
                  </div>

                  {/* Het Kasteel */}
                  <div className={`p-6 rounded-xl border-2 border-red-500/30 ${cardClass}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🏰</span>
                      <h3 className={`text-lg font-bold ${textClass}`}>Het Kasteel</h3>
                    </div>
                    <p className={subtextClass}>
                      {lang === 'nl' 
                        ? 'Het eerste echte voetbalstadion van Nederland, geopend in 1916. Met zijn karakteristieke twee kasteeltorens is het nog steeds een van de meest herkenbare stadions van het land.'
                        : 'The first true football stadium in the Netherlands, opened in 1916. With its characteristic two castle towers, it remains one of the most recognizable stadiums in the country.'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Facts Tab */}
              {activeTab === 'facts' && (
                <div className="space-y-4">
                  {facts.map((fact) => (
                    <div 
                      key={fact.id} 
                      className={`p-4 rounded-xl ${cardClass} ${fact.is_highlight ? 'border-l-4 border-red-500' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className={`font-bold ${textClass}`}>{fact.title}</h4>
                          <p className={`mt-1 text-sm ${subtextClass}`}>{fact.content}</p>
                        </div>
                        {fact.year && (
                          <div className="text-red-500 font-bold text-lg">{fact.year}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Legends Tab */}
              {activeTab === 'legends' && (
                <div className="grid gap-6">
                  {legends.map((legend) => (
                    <div key={legend.id} className={`p-6 rounded-xl ${cardClass}`}>
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
                          {legend.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`text-xl font-bold ${textClass}`}>
                            {legend.name}
                            {legend.nickname && (
                              <span className={`text-sm font-normal ml-2 ${subtextClass}`}>
                                "{legend.nickname}"
                              </span>
                            )}
                          </h4>
                          <div className={`text-sm ${subtextClass} mb-2`}>
                            {t.role}: {legend.role === 'player' ? (lang === 'nl' ? 'Speler' : 'Player') : 
                                      legend.role === 'manager' ? (lang === 'nl' ? 'Trainer' : 'Manager') :
                                      legend.role === 'supporter' ? 'Supporter' : legend.role}
                            {legend.position && ` • ${legend.position}`}
                          </div>
                          <p className={`text-sm ${subtextClass}`}>{legend.biography}</p>
                          
                          {legend.famous_quote && (
                            <blockquote className={`mt-3 pl-4 border-l-2 border-red-500 italic ${subtextClass}`}>
                              "{legend.famous_quote}"
                            </blockquote>
                          )}
                        </div>

                        {/* Tier badge */}
                        {legend.legend_tier === 1 && (
                          <div className="text-2xl" title="Tier 1 Legend">⭐</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trophies Tab */}
              {activeTab === 'trophies' && (
                <div className="space-y-6">
                  {/* Championships */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${textClass}`}>
                      🏆 {t.championships}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {trophies
                        .filter(t => t.competition_name === 'Landskampioenschap')
                        .map((trophy) => (
                          <div 
                            key={trophy.id}
                            className={`p-4 rounded-xl text-center ${cardClass} hover:scale-105 transition`}
                          >
                            <div className="text-3xl mb-1">🏆</div>
                            <div className={`font-bold ${textClass}`}>{trophy.season}</div>
                            {trophy.notes && (
                              <div className={`text-xs mt-1 ${subtextClass}`}>{trophy.notes}</div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Cups */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${textClass}`}>
                      🥇 {t.cups}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {trophies
                        .filter(t => t.competition_name !== 'Landskampioenschap')
                        .map((trophy) => (
                          <div 
                            key={trophy.id}
                            className={`p-4 rounded-xl text-center ${cardClass}`}
                          >
                            <div className="text-2xl mb-1">🥇</div>
                            <div className={`font-semibold text-sm ${textClass}`}>{trophy.competition_name}</div>
                            <div className={`text-sm ${subtextClass}`}>{trophy.season}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
