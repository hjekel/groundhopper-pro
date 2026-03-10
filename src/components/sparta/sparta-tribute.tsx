'use client';

import { useState } from 'react';
import { X, Trophy, Star, Users, Home, Calendar, MapPin } from 'lucide-react';

interface SpartaTributeProps {
  onClose: () => void;
  theme: 'dark' | 'light';
  lang: 'nl' | 'en';
}

const t = (lang: string, nl: string, en: string) => lang === 'nl' ? nl : en;

export default function SpartaTribute({ onClose, theme, lang }: SpartaTributeProps) {
  const [activeTab, setActiveTab] = useState<'facts' | 'legends' | 'stadium' | 'squad'>('facts');

  const facts = [
    { nl: 'Opgericht op 1 april 1888', en: 'Founded on April 1, 1888' },
    { nl: 'Oudste profclub van Nederland', en: 'Oldest professional club in the Netherlands' },
    { nl: '6x Landskampioen (laatste in 1959)', en: '6x Dutch Champions (last in 1959)' },
    { nl: '3x KNVB Beker winnaar', en: '3x KNVB Cup winners' },
    { nl: 'Bijnaam: Kasteelheren', en: 'Nickname: Castle Lords' },
    { nl: 'Clubkleuren: Rood-Wit', en: 'Club colors: Red-White' },
    { nl: 'Het Kasteel sinds 1916', en: 'Het Kasteel since 1916' },
    { nl: 'Enige club met eigen begraafplaats', en: 'Only club with its own cemetery' },
  ];

  const legends = [
    { name: 'Abe Lenstra', years: '1948-1954', goals: 103, desc: { nl: 'Topscorer aller tijden', en: 'All-time top scorer' } },
    { name: 'Cor Mouwen', years: '1946-1961', goals: 0, desc: { nl: 'Legendarische doelman', en: 'Legendary goalkeeper' } },
    { name: 'Coen Dillen', years: '1949-1958', goals: 89, desc: { nl: 'Rood-witte doelpuntenmachine', en: 'Red-white goal machine' } },
    { name: 'Henk Timman', years: '1978-1985', goals: 52, desc: { nl: 'Captain & clubicoon', en: 'Captain & club icon' } },
    { name: 'Adri van Tiggelen', years: '1980-1986', goals: 5, desc: { nl: 'Van Sparta naar Oranje', en: 'From Sparta to Oranje' } },
  ];

  const stadiumPhotos = [
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Het_Kasteel_Sparta.jpg/1280px-Het_Kasteel_Sparta.jpg',
      caption: { nl: 'Het Kasteel - Hoofdtribune', en: 'Het Kasteel - Main Stand' }
    },
    {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sparta_Stadion_het_Kasteel.jpg/1280px-Sparta_Stadion_het_Kasteel.jpg',
      caption: { nl: 'Luchtfoto Het Kasteel', en: 'Aerial view Het Kasteel' }
    },
  ];

  const squad2024 = [
    { name: 'Nick Olij', position: 'Keeper', number: 1 },
    { name: 'Metinho', position: 'Middenvelder', number: 8 },
    { name: 'Arno Verschueren', position: 'Middenvelder', number: 6 },
    { name: 'Joshua Kitolano', position: 'Middenvelder', number: 10 },
    { name: 'Camiel Neghli', position: 'Aanvaller', number: 7 },
    { name: 'Tobias Lauritsen', position: 'Spits', number: 9 },
    { name: 'Shunsuke Mito', position: 'Aanvaller', number: 11 },
    { name: 'Mike Eerdhuijzen', position: 'Verdediger', number: 4 },
    { name: 'Bart Vriends', position: 'Verdediger', number: 3 },
    { name: 'Aaron Meijers', position: 'Verdediger', number: 5 },
  ];

  const tabs = [
    { id: 'facts', label: { nl: 'Feiten', en: 'Facts' }, icon: Star },
    { id: 'legends', label: { nl: 'Legendes', en: 'Legends' }, icon: Trophy },
    { id: 'stadium', label: { nl: 'Kasteel', en: 'Castle' }, icon: Home },
    { id: 'squad', label: { nl: 'Selectie', en: 'Squad' }, icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-red-600 to-red-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-3">🏰</div>
            <h2 className="text-3xl font-bold">Sparta Rotterdam</h2>
            <p className="text-red-200 mt-1">{t(lang, 'De oudste profclub van Nederland', 'The oldest professional club in the Netherlands')}</p>
            <p className="text-red-300 text-sm mt-1">1888 - 2026</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'text-red-500 border-b-2 border-red-500'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{t(lang, tab.label.nl, tab.label.en)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Facts Tab */}
          {activeTab === 'facts' && (
            <div className="space-y-3">
              {facts.map((fact, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                  }`}
                >
                  <span className="text-red-500">⚽</span>
                  <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                    {t(lang, fact.nl, fact.en)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Legends Tab */}
          {activeTab === 'legends' && (
            <div className="space-y-4">
              {legends.map((legend, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {legend.name}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {legend.years}
                      </p>
                    </div>
                    {legend.goals > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-500">{legend.goals}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>goals</div>
                      </div>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {t(lang, legend.desc.nl, legend.desc.en)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Stadium Tab */}
          {activeTab === 'stadium' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Spartastraat 12, 3027 AT Rotterdam
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-red-500" />
                  <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                    {t(lang, 'Capaciteit: 11.026 zitplaatsen', 'Capacity: 11,026 seats')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                    {t(lang, 'Geopend: 1916 (gerenoveerd 1999)', 'Opened: 1916 (renovated 1999)')}
                  </span>
                </div>
              </div>

              {stadiumPhotos.map((photo, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={t(lang, photo.caption.nl, photo.caption.en)}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Het+Kasteel';
                    }}
                  />
                  <p className={`text-sm text-center py-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t(lang, photo.caption.nl, photo.caption.en)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Squad Tab */}
          {activeTab === 'squad' && (
            <div>
              <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t(lang, 'Selectie 2024-25', 'Squad 2024-25')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {squad2024.map((player, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                      {player.number}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {player.name}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {player.position}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            🔴⚪ {t(lang, 'Forza Sparta!', 'Forza Sparta!')} 🔴⚪
          </p>
        </div>
      </div>
    </div>
  );
}