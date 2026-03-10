'use client';

import { useState } from 'react';
import { X, Trophy, Star, Users, Home, Calendar, MapPin, Shield, Heart } from 'lucide-react';

interface SpartaTributeProps {
  onClose: () => void;
  theme: 'dark' | 'light';
  lang: 'nl' | 'en';
}

const tr = (lang: string, nl: string, en: string) => lang === 'nl' ? nl : en;

// Real Wikipedia API thumbnail URLs
const IMAGES = {
  kasteel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Rotterdam_spangen_spartastadion.jpg/800px-Rotterdam_spangen_spartastadion.jpg',
  badge: 'https://r2.thesportsdb.com/images/media/team/badge/upluv31586362224.png',
  banner: 'https://r2.thesportsdb.com/images/media/team/banner/r3ujd51722780656.jpg',
  cruijff: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Johan_Cruijff_%281974%29.jpg/300px-Johan_Cruijff_%281974%29.jpg',
  lenstra: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Abe_Lenstra_%28Heerenveen%29_in_het_Olympisch_Stadion_in_Amsterdam%2C_enige_dagen_na_d%2C_Bestanddeelnr_191-1062.jpg/300px-Abe_Lenstra_%28Heerenveen%29_in_het_Olympisch_Stadion_in_Amsterdam%2C_enige_dagen_na_d%2C_Bestanddeelnr_191-1062.jpg',
  neville: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Denis_Neville%2C_trainer_van_Sparta%2C_1963.jpg/300px-Denis_Neville%2C_trainer_van_Sparta%2C_1963.jpg',
  vanTiggelen: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Adri_van_Tiggelen_%28cropped%29.jpg',
};

const legends = [
  {
    name: 'Johan Cruijff',
    years: '1983-1984',
    role: { nl: 'Speler - Eredivisie', en: 'Player - Eredivisie' },
    photo: IMAGES.cruijff,
    desc: {
      nl: 'De grootste voetballer aller tijden speelde zijn laatste Eredivisie-seizoen bij Sparta. Cruijff koos bewust voor de Kasteelheren en scoorde 11 doelpunten in 33 wedstrijden.',
      en: 'The greatest footballer of all time played his final Eredivisie season at Sparta. Cruijff deliberately chose the Castle Lords and scored 11 goals in 33 matches.'
    },
  },
  {
    name: 'Abe Lenstra',
    years: '1948-1954',
    role: { nl: 'Topscorer aller tijden (103 goals)', en: 'All-time top scorer (103 goals)' },
    photo: IMAGES.lenstra,
    desc: {
      nl: 'De legendarische Friese aanvaller is nog altijd de topscorer aller tijden van Sparta. Lenstra was een technisch wonderkind dat het verschil maakte in het kampioensteam van 1959.',
      en: 'The legendary Frisian striker remains Sparta\'s all-time top scorer. Lenstra was a technically gifted wonder who made the difference in the 1959 championship team.'
    },
  },
  {
    name: 'Denis Neville',
    years: '1956-1966',
    role: { nl: 'Trainer - Kampioenschap 1959', en: 'Manager - Championship 1959' },
    photo: IMAGES.neville,
    desc: {
      nl: 'De Engelse trainer leidde Sparta naar het laatste landskampioenschap in 1959. Onder zijn leiding speelde Sparta het mooiste voetbal van Nederland.',
      en: 'The English manager led Sparta to their last national championship in 1959. Under his guidance, Sparta played the most beautiful football in the Netherlands.'
    },
  },
  {
    name: 'Adri van Tiggelen',
    years: '1980-1986',
    role: { nl: 'Verdediger - Van Sparta naar Oranje', en: 'Defender - From Sparta to Oranje' },
    photo: IMAGES.vanTiggelen,
    desc: {
      nl: 'Begon zijn loopbaan op Het Kasteel en groeide uit tot international. Van Tiggelen speelde 56 interlands voor Oranje en was basisspeler op het EK 1988.',
      en: 'Started his career at Het Kasteel and grew into an international. Van Tiggelen played 56 caps for the Netherlands and was a regular at Euro 1988.'
    },
  },
  {
    name: 'Coen Dillen',
    years: '1949-1958',
    role: { nl: 'Aanvaller - 89 doelpunten', en: 'Forward - 89 goals' },
    photo: null,
    desc: {
      nl: 'De rood-witte doelpuntenmachine die samen met Lenstra een dodelijk duo vormde. Dillen staat tweede op de eeuwige topscorerslijst van Sparta.',
      en: 'The red-white goal machine who formed a deadly duo with Lenstra. Dillen ranks second on Sparta\'s all-time top scorers list.'
    },
  },
  {
    name: 'Henk Timman',
    years: '1978-1985',
    role: { nl: 'Aanvoerder & Clubicoon', en: 'Captain & Club Icon' },
    photo: null,
    desc: {
      nl: 'De onvermoeibare captain die Sparta door moeilijke tijden leidde. Timman is het symbool van trouw en strijdlust op Het Kasteel.',
      en: 'The tireless captain who led Sparta through difficult times. Timman is the symbol of loyalty and fighting spirit at Het Kasteel.'
    },
  },
];

const squad = [
  { name: 'Joel Drommel', number: 1, position: { nl: 'Keeper', en: 'Goalkeeper' }, nationality: 'NL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/q3r4li1646699927.jpg' },
  { name: 'Filip Bednarek', number: 16, position: { nl: 'Keeper', en: 'Goalkeeper' }, nationality: 'PL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/ksus991696664818.jpg' },
  { name: 'Bruno Martins Indi', number: 4, position: { nl: 'Verdediger', en: 'Centre-Back' }, nationality: 'NL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/2sx3a31509654666.jpg' },
  { name: 'Jens Toornstra', number: 6, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: 'NL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/w6cgvc1679239148.jpg' },
  { name: 'Jonathan de Guzman', number: 20, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: 'NL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/kpr9mr1578087007.jpg' },
  { name: 'Julian Baas', number: 8, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: 'NL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/q1oahy1679406854.jpg' },
  { name: 'Joshua Kitolano', number: 10, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: 'CD', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/7kyq9j1701437428.jpg' },
  { name: 'Ayoni Santos', number: 14, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: 'NL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/75e2m61765730191.jpg' },
  { name: 'Ayoub Oufkir', number: 7, position: { nl: 'Aanvaller', en: 'Forward' }, nationality: 'NL', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/w0ikoj1759697668.jpg' },
];

const facts = [
  { icon: '📅', nl: 'Opgericht op 1 april 1888', en: 'Founded on April 1, 1888' },
  { icon: '👑', nl: 'Oudste profclub van Nederland', en: 'Oldest professional club in the Netherlands' },
  { icon: '🏆', nl: '6x Landskampioen (laatste: 1959)', en: '6x Dutch Champions (last: 1959)' },
  { icon: '🏅', nl: '3x KNVB Beker winnaar', en: '3x KNVB Cup winners' },
  { icon: '🏰', nl: 'Bijnaam: De Kasteelheren', en: 'Nickname: The Castle Lords' },
  { icon: '🔴', nl: 'Clubkleuren: Rood-Wit', en: 'Club colors: Red-White' },
  { icon: '⚰️', nl: 'Enige club met eigen begraafplaats', en: 'Only club with its own cemetery' },
  { icon: '⭐', nl: 'Johan Cruijff speelde hier in 1983-84', en: 'Johan Cruijff played here in 1983-84' },
  { icon: '🌍', nl: 'Eerste Nederlandse club in Europacup (1959)', en: 'First Dutch club in European Cup (1959)' },
  { icon: '💪', nl: 'Altijd teruggevochten na degradatie', en: 'Always fought back after relegation' },
];

const milestones = [
  { year: '1888', event: { nl: 'Oprichting Sparta', en: 'Sparta founded' } },
  { year: '1909', event: { nl: 'Eerste landskampioenschap', en: 'First national championship' } },
  { year: '1916', event: { nl: 'Het Kasteel geopend', en: 'Het Kasteel opened' } },
  { year: '1959', event: { nl: 'Laatste kampioenschap (6e)', en: 'Last championship (6th)' } },
  { year: '1966', event: { nl: 'KNVB Beker winnaar', en: 'KNVB Cup winners' } },
  { year: '1983', event: { nl: 'Johan Cruijff komt naar Sparta', en: 'Johan Cruijff joins Sparta' } },
  { year: '1999', event: { nl: 'Het Kasteel gerenoveerd', en: 'Het Kasteel renovated' } },
  { year: '2024', event: { nl: 'Eredivisie seizoen 2024-25', en: 'Eredivisie season 2024-25' } },
];

export default function SpartaTribute({ onClose, theme, lang }: SpartaTributeProps) {
  const [activeTab, setActiveTab] = useState<'facts' | 'legends' | 'stadium' | 'squad'>('facts');

  const isDark = theme === 'dark';
  const bg = isDark ? 'bg-slate-900' : 'bg-white';
  const cardBg = isDark ? 'bg-slate-800' : 'bg-slate-50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';

  const tabs = [
    { id: 'facts', label: { nl: 'Club', en: 'Club' }, icon: Star },
    { id: 'legends', label: { nl: 'Legendes', en: 'Legends' }, icon: Trophy },
    { id: 'stadium', label: { nl: 'Kasteel', en: 'Castle' }, icon: Home },
    { id: 'squad', label: { nl: 'Selectie', en: 'Squad' }, icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${bg}`}>
        {/* Hero Header with banner image */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={IMAGES.banner}
              alt="Sparta Rotterdam"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-800/70 to-red-900/90" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative p-6 text-center text-white">
            <img
              src={IMAGES.badge}
              alt="Sparta Rotterdam badge"
              className="w-20 h-20 mx-auto mb-3 drop-shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h2 className="text-3xl font-bold tracking-tight">Sparta Rotterdam</h2>
            <p className="text-red-200 mt-1 text-lg font-medium">
              {tr(lang, 'De Kasteelheren', 'The Castle Lords')}
            </p>
            <p className="text-red-300/80 text-sm mt-1">
              {tr(lang, 'Opgericht 1888 — Oudste profclub van Nederland', 'Founded 1888 — Oldest professional club in the Netherlands')}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${borderColor}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'text-red-500 border-b-2 border-red-500'
                  : `${textMuted} hover:${textPrimary}`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tr(lang, tab.label.nl, tab.label.en)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[50vh]">
          {/* FACTS TAB */}
          {activeTab === 'facts' && (
            <div className="space-y-6">
              {/* Facts grid */}
              <div className="space-y-2">
                {facts.map((fact, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${cardBg}`}>
                    <span className="text-lg w-7 text-center">{fact.icon}</span>
                    <span className={`text-sm ${textPrimary}`}>{tr(lang, fact.nl, fact.en)}</span>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div>
                <h3 className={`font-bold text-sm uppercase tracking-wider mb-3 ${textMuted}`}>
                  {tr(lang, 'Tijdlijn', 'Timeline')}
                </h3>
                <div className="relative pl-6 space-y-3">
                  <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-red-500/30 rounded" />
                  {milestones.map((m, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div className="absolute -left-[17px] top-1.5 w-3 h-3 rounded-full bg-red-500 border-2 border-red-300/50" />
                      <span className="text-red-500 font-bold text-sm min-w-[40px]">{m.year}</span>
                      <span className={`text-sm ${textSecondary}`}>{tr(lang, m.event.nl, m.event.en)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEGENDS TAB */}
          {activeTab === 'legends' && (
            <div className="space-y-4">
              <p className={`text-sm mb-4 ${textMuted}`}>
                {tr(lang,
                  'De helden die Sparta groot hebben gemaakt',
                  'The heroes who made Sparta great'
                )}
              </p>
              {legends.map((legend, i) => (
                <div key={i} className={`rounded-xl overflow-hidden ${cardBg}`}>
                  <div className="flex gap-4 p-4">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      {legend.photo ? (
                        <img
                          src={legend.photo}
                          alt={legend.name}
                          className="w-20 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.parentElement!.innerHTML = `<div class="w-20 h-24 rounded-lg bg-red-900/30 flex items-center justify-center"><span class="text-3xl">⚽</span></div>`;
                          }}
                        />
                      ) : (
                        <div className="w-20 h-24 rounded-lg bg-red-900/30 flex items-center justify-center">
                          <span className="text-3xl">⚽</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-lg ${textPrimary}`}>{legend.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-red-500 text-xs font-semibold">{legend.years}</span>
                        <span className={`text-xs ${textMuted}`}>{tr(lang, legend.role.nl, legend.role.en)}</span>
                      </div>
                      <p className={`text-sm mt-2 leading-relaxed ${textSecondary}`}>
                        {tr(lang, legend.desc.nl, legend.desc.en)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STADIUM TAB */}
          {activeTab === 'stadium' && (
            <div className="space-y-4">
              {/* Main stadium photo */}
              <div className="rounded-xl overflow-hidden">
                <img
                  src={IMAGES.kasteel}
                  alt="Het Kasteel - Sparta Rotterdam"
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-52 bg-red-900/20 flex items-center justify-center"><span class="text-6xl">🏰</span></div>';
                  }}
                />
              </div>

              <h3 className={`text-xl font-bold ${textPrimary}`}>
                {tr(lang, 'Sparta Stadion - Het Kasteel', 'Sparta Stadium - The Castle')}
              </h3>

              <p className={`text-sm leading-relaxed ${textSecondary}`}>
                {tr(lang,
                  'Het Kasteel is het legendarische thuisstadion van Sparta Rotterdam, gelegen in de wijk Spangen. Het stadion werd in 1916 geopend en is daarmee een van de oudste voetbalstadions van Nederland. Na een grondige renovatie in 1999 biedt het stadion plaats aan 11.026 toeschouwers.',
                  'Het Kasteel (The Castle) is the legendary home stadium of Sparta Rotterdam, located in the Spangen district. The stadium was opened in 1916, making it one of the oldest football stadiums in the Netherlands. After a thorough renovation in 1999, the stadium holds 11,026 spectators.'
                )}
              </p>

              {/* Stadium info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className={`text-xs font-medium ${textMuted}`}>{tr(lang, 'Locatie', 'Location')}</span>
                  </div>
                  <p className={`text-sm font-medium ${textPrimary}`}>Spangen, Rotterdam</p>
                  <p className={`text-xs ${textMuted}`}>Spartastraat 12</p>
                </div>
                <div className={`p-3 rounded-lg ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-red-500" />
                    <span className={`text-xs font-medium ${textMuted}`}>{tr(lang, 'Capaciteit', 'Capacity')}</span>
                  </div>
                  <p className={`text-sm font-medium ${textPrimary}`}>11.026</p>
                  <p className={`text-xs ${textMuted}`}>{tr(lang, 'zitplaatsen', 'seats')}</p>
                </div>
                <div className={`p-3 rounded-lg ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className={`text-xs font-medium ${textMuted}`}>{tr(lang, 'Geopend', 'Opened')}</span>
                  </div>
                  <p className={`text-sm font-medium ${textPrimary}`}>1916</p>
                  <p className={`text-xs ${textMuted}`}>{tr(lang, 'Gerenoveerd 1999', 'Renovated 1999')}</p>
                </div>
                <div className={`p-3 rounded-lg ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-red-500" />
                    <span className={`text-xs font-medium ${textMuted}`}>{tr(lang, 'Veld', 'Pitch')}</span>
                  </div>
                  <p className={`text-sm font-medium ${textPrimary}`}>105 x 68m</p>
                  <p className={`text-xs ${textMuted}`}>{tr(lang, 'Natuurgras', 'Natural grass')}</p>
                </div>
              </div>

              <p className={`text-sm italic leading-relaxed ${textMuted}`}>
                {tr(lang,
                  '"Het Kasteel is meer dan een stadion. Het is het hart van Spangen, een plek waar generaties Spartanen hun club hebben aangemoedigd."',
                  '"Het Kasteel is more than a stadium. It is the heart of Spangen, a place where generations of Spartans have cheered on their club."'
                )}
              </p>
            </div>
          )}

          {/* SQUAD TAB */}
          {activeTab === 'squad' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold ${textPrimary}`}>
                  {tr(lang, 'Selectie 2024-25', 'Squad 2024-25')}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                  Eredivisie
                </span>
              </div>

              <div className="space-y-2">
                {squad.map((player, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${cardBg}`}
                  >
                    {/* Player photo */}
                    <div className="relative flex-shrink-0">
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                            el.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm ${player.photo ? 'hidden' : ''}`}>
                        {player.number || '?'}
                      </div>
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${textPrimary}`}>
                        {player.name}
                      </div>
                      <div className={`text-xs ${textMuted}`}>
                        {tr(lang, player.position.nl, player.position.en)}
                      </div>
                    </div>

                    {/* Number */}
                    {player.number && (
                      <div className="text-red-500 font-bold text-lg w-8 text-center">
                        {player.number}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className={`text-xs mt-4 text-center ${textMuted}`}>
                {tr(lang,
                  'Gegevens via TheSportsDB',
                  'Data via TheSportsDB'
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center ${borderColor}`}>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <p className={`text-sm font-medium ${textMuted}`}>
              {tr(lang, 'Forza Sparta! — Eens een Spartaan, altijd een Spartaan', 'Forza Sparta! — Once a Spartan, always a Spartan')}
            </p>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
