'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles,
  ChevronRight,
  Crown,
  Swords,
  BookOpen,
  Lightbulb,
  Clock,
  Heart
} from 'lucide-react';

// Types
interface ClubFact {
  id: string;
  title: string;
  content: string;
  category: 'founding' | 'records' | 'legends' | 'stadium' | 'rivalry' | 'trivia' | 'dark_times' | 'glory_days';
  era?: string;
  year?: number;
  is_highlight: boolean;
  obscurity_level: 1 | 2 | 3;
}

interface ClubLegend {
  id: string;
  name: string;
  nickname?: string;
  role: 'player' | 'manager' | 'chairman' | 'founder' | 'supporter';
  position?: string;
  joined_year?: number;
  left_year?: number;
  appearances?: number;
  goals?: number;
  biography?: string;
  famous_quote?: string;
  photo_url?: string;
  legend_tier: 1 | 2 | 3;
}

interface ClubTrophy {
  id: string;
  competition_name: string;
  competition_type: string;
  season: string;
  year: number;
  notes?: string;
}

interface ClubHistory {
  founding_story?: string;
  name_origin?: string;
  motto?: string;
  anthem_name?: string;
}

interface ClubSpotlightProps {
  clubName: string;
  clubColors: { primary: string; secondary: string };
  history?: ClubHistory;
  facts: ClubFact[];
  legends: ClubLegend[];
  trophies: ClubTrophy[];
  className?: string;
}

// Category configuration
const categoryConfig = {
  founding: { icon: BookOpen, label: 'Oprichting', color: 'text-amber-400' },
  records: { icon: Trophy, label: 'Records', color: 'text-yellow-400' },
  legends: { icon: Crown, label: 'Legendes', color: 'text-purple-400' },
  stadium: { icon: MapPin, label: 'Het Kasteel', color: 'text-green-400' },
  rivalry: { icon: Swords, label: 'Rivaliteit', color: 'text-red-400' },
  trivia: { icon: Lightbulb, label: 'Weetjes', color: 'text-blue-400' },
  dark_times: { icon: Clock, label: 'Donkere tijden', color: 'text-slate-400' },
  glory_days: { icon: Sparkles, label: 'Gloriejaren', color: 'text-amber-400' },
};

// Obscurity labels
const obscurityLabels = {
  1: 'Bekend',
  2: 'Minder bekend',
  3: 'Weinig bekend',
};

export function ClubSpotlight({
  clubName,
  clubColors,
  history,
  facts,
  legends,
  trophies,
  className = '',
}: ClubSpotlightProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'facts' | 'legends' | 'trophies'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showObscure, setShowObscure] = useState(false);
  const [expandedFact, setExpandedFact] = useState<string | null>(null);

  // Filter facts
  const filteredFacts = useMemo(() => {
    return facts.filter(fact => {
      if (selectedCategory !== 'all' && fact.category !== selectedCategory) return false;
      if (!showObscure && fact.obscurity_level === 3) return false;
      return true;
    });
  }, [facts, selectedCategory, showObscure]);

  // Group facts by era for timeline
  const factsByEra = useMemo(() => {
    const grouped: Record<string, ClubFact[]> = {};
    filteredFacts.forEach(fact => {
      const era = fact.era || 'Overig';
      if (!grouped[era]) grouped[era] = [];
      grouped[era].push(fact);
    });
    return grouped;
  }, [filteredFacts]);

  // Highlight facts for overview
  const highlightFacts = useMemo(() => {
    return facts.filter(f => f.is_highlight).slice(0, 5);
  }, [facts]);

  // Stats
  const stats = useMemo(() => ({
    totalTrophies: trophies.length,
    championships: trophies.filter(t => t.competition_type === 'league' && t.competition_name.includes('Landskampioenschap')).length,
    cups: trophies.filter(t => t.competition_type === 'cup').length,
    legends: legends.filter(l => l.legend_tier === 1).length,
    facts: facts.length,
    obscureFacts: facts.filter(f => f.obscurity_level === 3).length,
  }), [trophies, legends, facts]);

  const tabs = [
    { id: 'overview', label: 'Overzicht', icon: Star },
    { id: 'facts', label: 'Feiten & Weetjes', icon: Lightbulb },
    { id: 'legends', label: 'Legendes', icon: Crown },
    { id: 'trophies', label: 'Erelijst', icon: Trophy },
  ];

  return (
    <div className={`bg-slate-900 rounded-2xl overflow-hidden ${className}`}>
      {/* Header with club colors */}
      <div 
        className="relative p-6 pb-4"
        style={{ 
          background: `linear-gradient(135deg, ${clubColors.primary}20 0%, ${clubColors.primary}05 100%)`,
          borderBottom: `3px solid ${clubColors.primary}`,
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg"
            style={{ backgroundColor: clubColors.primary, color: clubColors.secondary }}
          >
            ⚽
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{clubName}</h2>
            <p className="text-slate-400 text-sm">
              {history?.motto && <span className="italic">"{history.motto}"</span>}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.championships}</div>
            <div className="text-xs text-slate-500">Landstitels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.cups}</div>
            <div className="text-xs text-slate-500">Bekers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.legends}</div>
            <div className="text-xs text-slate-500">Legendes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.facts}</div>
            <div className="text-xs text-slate-500">Feiten</div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-slate-800">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-red-500 bg-slate-800/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Founding story */}
              {history?.founding_story && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Het Verhaal
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {history.founding_story}
                  </p>
                </div>
              )}

              {/* Highlight facts */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Hoogtepunten uit de historie
                </h3>
                <div className="space-y-3">
                  {highlightFacts.map((fact, index) => {
                    const config = categoryConfig[fact.category];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={fact.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedFact(expandedFact === fact.id ? null : fact.id)}
                      >
                        <div className={`mt-0.5 ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-white text-sm">{fact.title}</h4>
                            {fact.year && (
                              <span className="text-xs text-slate-500 shrink-0">{fact.year}</span>
                            )}
                          </div>
                          <AnimatePresence>
                            {expandedFact === fact.id && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-slate-400 text-sm mt-2"
                              >
                                {fact.content}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <ChevronRight 
                          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                            expandedFact === fact.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* FACTS TAB */}
          {activeTab === 'facts' && (
            <motion.div
              key="facts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Alles ({facts.length})
                </button>
                {Object.entries(categoryConfig).map(([key, config]) => {
                  const count = facts.filter(f => f.category === key).length;
                  if (count === 0) return null;
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        selectedCategory === key
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label} ({count})
                    </button>
                  );
                })}
                <div className="flex-1" />
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showObscure}
                    onChange={(e) => setShowObscure(e.target.checked)}
                    className="rounded border-slate-600"
                  />
                  Toon obscure feiten ({stats.obscureFacts})
                </label>
              </div>

              {/* Facts list */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {filteredFacts.map((fact, index) => {
                  const config = categoryConfig[fact.category];
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={fact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-slate-700/50 ${config.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white text-sm">{fact.title}</h4>
                            {fact.obscurity_level === 3 && (
                              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                                Weinig bekend
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">{fact.content}</p>
                          {(fact.year || fact.era) && (
                            <div className="flex gap-3 mt-2 text-xs text-slate-500">
                              {fact.year && <span>{fact.year}</span>}
                              {fact.era && <span>{fact.era}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* LEGENDS TAB */}
          {activeTab === 'legends' && (
            <motion.div
              key="legends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Tier 1 legends */}
              {legends.filter(l => l.legend_tier === 1).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    All-time Greats
                  </h3>
                  <div className="grid gap-3">
                    {legends.filter(l => l.legend_tier === 1).map(legend => (
                      <LegendCard key={legend.id} legend={legend} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tier 2 legends */}
              {legends.filter(l => l.legend_tier === 2).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Clublegenden
                  </h3>
                  <div className="grid gap-3">
                    {legends.filter(l => l.legend_tier === 2).map(legend => (
                      <LegendCard key={legend.id} legend={legend} compact />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TROPHIES TAB */}
          {activeTab === 'trophies' && (
            <motion.div
              key="trophies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Trophy timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />
                <div className="space-y-4">
                  {trophies.sort((a, b) => b.year - a.year).map((trophy, index) => (
                    <motion.div
                      key={trophy.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-10"
                    >
                      <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-white" />
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white text-sm">{trophy.competition_name}</h4>
                          <span className="text-amber-400 text-sm font-bold">{trophy.season}</span>
                        </div>
                        {trophy.notes && (
                          <p className="text-slate-400 text-xs mt-1">{trophy.notes}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Legend card component
function LegendCard({ legend, compact = false }: { legend: ClubLegend; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const roleLabels: Record<string, string> = {
    player: 'Speler',
    manager: 'Trainer',
    chairman: 'Voorzitter',
    founder: 'Oprichter',
    supporter: 'Supporter',
  };

  return (
    <div 
      className={`bg-slate-800/50 rounded-xl border border-slate-700/30 overflow-hidden cursor-pointer transition-all ${
        compact ? 'p-3' : 'p-4'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold shrink-0`}>
          {legend.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium text-white ${compact ? 'text-sm' : ''}`}>
              {legend.name}
            </h4>
            {legend.nickname && (
              <span className="text-slate-500 text-sm">"{legend.nickname}"</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>{roleLabels[legend.role]}</span>
            {legend.position && <span>• {legend.position}</span>}
            {legend.joined_year && legend.left_year && (
              <span>• {legend.joined_year}-{legend.left_year}</span>
            )}
          </div>
        </div>
        {!compact && legend.legend_tier === 1 && (
          <Crown className="w-5 h-5 text-amber-400 shrink-0" />
        )}
      </div>

      <AnimatePresence>
        {expanded && legend.biography && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-700/50"
          >
            <p className="text-slate-400 text-sm">{legend.biography}</p>
            {legend.famous_quote && (
              <blockquote className="mt-2 pl-3 border-l-2 border-amber-500/50 text-slate-300 text-sm italic">
                "{legend.famous_quote}"
              </blockquote>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
