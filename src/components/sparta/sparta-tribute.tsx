'use client';

import { useState } from 'react';
import { X, Trophy, Star, Users, Home, Calendar, MapPin, Shield, Heart, Lightbulb, Award } from 'lucide-react';

interface SpartaTributeProps {
  onClose: () => void;
  theme: 'dark' | 'light';
  lang: 'nl' | 'en';
}

const tr = (lang: string, nl: string, en: string) => lang === 'nl' ? nl : en;

const IMAGES = {
  kasteel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Rotterdam_spangen_spartastadion.jpg/800px-Rotterdam_spangen_spartastadion.jpg',
  badge: 'https://r2.thesportsdb.com/images/media/team/badge/upluv31586362224.png',
  banner: 'https://r2.thesportsdb.com/images/media/team/banner/r3ujd51722780656.jpg',
  cruijff: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Johan_Cruijff_%281974%29.jpg/300px-Johan_Cruijff_%281974%29.jpg',
  lenstra: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Abe_Lenstra_%28Heerenveen%29_in_het_Olympisch_Stadion_in_Amsterdam%2C_enige_dagen_na_d%2C_Bestanddeelnr_191-1062.jpg/300px-Abe_Lenstra_%28Heerenveen%29_in_het_Olympisch_Stadion_in_Amsterdam%2C_enige_dagen_na_d%2C_Bestanddeelnr_191-1062.jpg',
  neville: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Denis_Neville%2C_trainer_van_Sparta%2C_1963.jpg/300px-Denis_Neville%2C_trainer_van_Sparta%2C_1963.jpg',
  vanTiggelen: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Adri_van_Tiggelen_%28cropped%29.jpg',
  advocaat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Dick_Advocaat_2021.jpg/500px-Dick_Advocaat_2021.jpg',
  dillen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Voetballers_voor_archief%2C_Dillen%2C_Bestanddeelnr_906-9835.jpg/500px-Voetballers_voor_archief%2C_Dillen%2C_Bestanddeelnr_906-9835.jpg',
  galje: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hans_Galj%C3%A9_1982.jpg/500px-Hans_Galj%C3%A9_1982.jpg',
};

const legends = [
  {
    name: 'Johan Cruijff',
    years: '1983-1984',
    role: { nl: 'Speler - Zijn laatste Eredivisie', en: 'Player - His final Eredivisie' },
    photo: IMAGES.cruijff,
    desc: {
      nl: 'De grootste voetballer aller tijden speelde zijn laatste Eredivisie-seizoen bij Sparta. Cruijff koos bewust voor de bescheiden Kasteelheren en scoorde 11 doelpunten in 33 wedstrijden. Hij bracht het voetbal van Barcelona naar Spangen.',
      en: 'The greatest footballer of all time played his final Eredivisie season at Sparta. Cruijff deliberately chose the modest Castle Lords and scored 11 goals in 33 matches. He brought Barcelona football to Spangen.'
    },
  },
  {
    name: 'Abe Lenstra',
    years: '1948-1954',
    role: { nl: 'Topscorer aller tijden - 103 goals', en: 'All-time top scorer - 103 goals' },
    photo: IMAGES.lenstra,
    desc: {
      nl: 'De legendarische Friese aanvaller is nog altijd de topscorer aller tijden van Sparta. Met zijn onnavolgbare techniek en doelinstinct was Lenstra de absolute ster van het kampioensteam.',
      en: 'The legendary Frisian striker remains Sparta\'s all-time top scorer. With his inimitable technique and goal instinct, Lenstra was the absolute star of the championship team.'
    },
  },
  {
    name: 'Coen Dillen',
    years: '1949-1958',
    role: { nl: 'Aanvaller - 89 doelpunten', en: 'Forward - 89 goals' },
    photo: IMAGES.dillen,
    desc: {
      nl: 'De doelpuntenmachine die samen met Lenstra een dodelijk duo vormde. Dillen staat tweede op de eeuwige topscorerslijst en scoorde in een seizoen maar liefst 43 competitiedoelpunten - een record dat decennialang standhield.',
      en: 'The goal machine who formed a deadly duo with Lenstra. Dillen ranks second on the all-time scoring list and once scored 43 league goals in a single season - a record that stood for decades.'
    },
  },
  {
    name: 'Denis Neville',
    years: '1956-1966',
    role: { nl: 'Trainer - Kampioenschap 1959', en: 'Manager - Championship 1959' },
    photo: IMAGES.neville,
    desc: {
      nl: 'De Engelse gentleman-trainer leidde Sparta naar het laatste landskampioenschap in 1959. Onder zijn leiding speelde Sparta het aanvallendste voetbal van Nederland. Neville bleef 10 jaar trouw aan de club.',
      en: 'The English gentleman-manager led Sparta to their last national championship in 1959. Under his guidance, Sparta played the most attacking football in the Netherlands. Neville stayed loyal to the club for 10 years.'
    },
  },
  {
    name: 'Dick Advocaat',
    years: '1967-1970',
    role: { nl: 'Speler & later bondscoach', en: 'Player & later national team coach' },
    photo: IMAGES.advocaat,
    desc: {
      nl: 'De "Kleine Generaal" begon zijn spelerscarriere op Het Kasteel. Later werd hij een van de succesvolste Nederlandse trainers ooit, met topbanen bij Oranje, Rangers, PSV, Feyenoord en zelfs bondscoach van Rusland en Zuid-Korea.',
      en: 'The "Little General" started his playing career at Het Kasteel. He later became one of the most successful Dutch coaches ever, with top jobs at the Netherlands, Rangers, PSV, Feyenoord, and even national coach of Russia and South Korea.'
    },
  },
  {
    name: 'Hans Galjé',
    years: '1974-1987',
    role: { nl: 'Keeper - Clubrecord 391 wedstrijden', en: 'Goalkeeper - Club record 391 matches' },
    photo: IMAGES.galje,
    desc: {
      nl: 'De onverslijtbare doelman die 13 seizoenen het doel verdedigde. Met 391 officiële wedstrijden houdt Galjé het clubrecord. Een muur op Het Kasteel die generaties fans inspireerde.',
      en: 'The indestructible goalkeeper who guarded the goal for 13 seasons. With 391 official appearances, Galjé holds the club record. A wall at Het Kasteel who inspired generations of fans.'
    },
  },
  {
    name: 'Adri van Tiggelen',
    years: '1980-1986',
    role: { nl: 'Verdediger - Van Sparta naar Oranje', en: 'Defender - From Sparta to Dutch squad' },
    photo: IMAGES.vanTiggelen,
    desc: {
      nl: 'Begon als jeugdspeler op Het Kasteel en groeide uit tot Europees kampioen. Van Tiggelen speelde 56 interlands en was basisspeler op het legendarische EK 1988 dat Oranje won.',
      en: 'Started as a youth player at Het Kasteel and grew into a European champion. Van Tiggelen played 56 caps and was a regular at the legendary Euro 1988 that the Netherlands won.'
    },
  },
  {
    name: 'Henk Timman',
    years: '1978-1985',
    role: { nl: 'Aanvoerder & Clubicoon', en: 'Captain & Club Icon' },
    photo: null,
    desc: {
      nl: 'De onvermoeibare captain die Sparta door de moeilijkste jaren leidde. Timman weigerde meerdere transfers naar topclubs uit trouw aan Sparta. Het symbool van hart boven geld.',
      en: 'The tireless captain who led Sparta through its toughest years. Timman refused multiple transfers to top clubs out of loyalty to Sparta. The symbol of heart over money.'
    },
  },
];

const squad = [
  { name: 'Joel Drommel', number: 1, position: { nl: 'Keeper', en: 'Goalkeeper' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/q3r4li1646699927.jpg' },
  { name: 'Filip Bednarek', number: 16, position: { nl: 'Keeper', en: 'Goalkeeper' }, nationality: '🇵🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/ksus991696664818.jpg' },
  { name: 'Bruno Martins Indi', number: 4, position: { nl: 'Verdediger', en: 'Centre-Back' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/2sx3a31509654666.jpg' },
  { name: 'Giannino Vianello', number: 3, position: { nl: 'Verdediger', en: 'Defender' }, nationality: '🇳🇱', photo: null },
  { name: 'Jens Toornstra', number: 6, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/w6cgvc1679239148.jpg' },
  { name: 'Julian Baas', number: 8, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/q1oahy1679406854.jpg' },
  { name: 'Jonathan de Guzman', number: 20, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/kpr9mr1578087007.jpg' },
  { name: 'Joshua Kitolano', number: 10, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇨🇩', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/7kyq9j1701437428.jpg' },
  { name: 'Ayoni Santos', number: 14, position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/75e2m61765730191.jpg' },
  { name: 'Ayoub Oufkir', number: 7, position: { nl: 'Aanvaller', en: 'Forward' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/w0ikoj1759697668.jpg' },
];

const didYouKnow = [
  {
    nl: 'Sparta heeft een eigen begraafplaats naast Het Kasteel. Oud-spelers en trouwe fans kunnen er hun laatste rustplaats vinden. De enige club in Nederland met deze traditie.',
    en: 'Sparta has its own cemetery next to Het Kasteel. Former players and loyal fans can find their final resting place there. The only club in the Netherlands with this tradition.',
  },
  {
    nl: 'De naam "Sparta" verwijst naar de antieke Griekse stad-staat, bekend om zijn moedige krijgers. De oprichters kozen deze naam als symbool van kracht en doorzettingsvermogen.',
    en: 'The name "Sparta" refers to the ancient Greek city-state, known for its brave warriors. The founders chose this name as a symbol of strength and perseverance.',
  },
  {
    nl: 'Het Kasteel dankt zijn naam aan het kasteelachtige uiterlijk van de hoofdtribune. Het stadion is gebouwd in de stijl van een middeleeuws fort, uniek in het Nederlandse voetbal.',
    en: 'Het Kasteel (The Castle) owes its name to the castle-like appearance of the main stand. The stadium was built in the style of a medieval fort, unique in Dutch football.',
  },
  {
    nl: 'Sparta was in 1959 de eerste Nederlandse club die deelnam aan de Europacup voor landskampioenen (nu Champions League). Ze verloren van IFK Goteborg.',
    en: 'Sparta was the first Dutch club to participate in the European Cup for national champions (now Champions League) in 1959. They lost to IFK Gothenburg.',
  },
  {
    nl: 'Johan Cruijff koos in 1983 bewust voor Sparta boven grote clubs. Hij wilde bewijzen dat hij ook bij een kleine club het verschil kon maken - en dat deed hij.',
    en: 'Johan Cruijff deliberately chose Sparta over big clubs in 1983. He wanted to prove he could make the difference at a small club too - and he did.',
  },
  {
    nl: 'Sparta degradeerde 5 keer uit de Eredivisie maar promoveerde elke keer weer terug. De club staat bekend om zijn veerkracht en trouwe achterban die altijd blijft.',
    en: 'Sparta was relegated 5 times from the Eredivisie but promoted back every single time. The club is known for its resilience and loyal fan base that always stays.',
  },
  {
    nl: 'Het stadion ligt in de wijk Spangen, een van de meest multiculturele wijken van Rotterdam. De club speelt een belangrijke sociale rol in de buurt.',
    en: 'The stadium is located in the Spangen neighborhood, one of the most multicultural areas of Rotterdam. The club plays an important social role in the community.',
  },
  {
    nl: 'Coen Dillen scoorde in het seizoen 1956-57 maar liefst 43 competitiedoelpunten. Dit was jarenlang een Nederlands record.',
    en: 'Coen Dillen scored an incredible 43 league goals in the 1956-57 season. This was a Dutch record for many years.',
  },
];

const famousAlumni = [
  { name: 'Dick Advocaat', role: { nl: 'Bondscoach NL, Rusland, Zuid-Korea', en: 'Coach: NL, Russia, South Korea' } },
  { name: 'Adri van Tiggelen', role: { nl: 'Europees kampioen 1988', en: 'European champion 1988' } },
  { name: 'Peter van Vossen', role: { nl: 'Champions League-winnaar 1995', en: 'Champions League winner 1995' } },
  { name: 'Roy Makaay', role: { nl: 'Topscorer La Liga, Bayern', en: 'La Liga top scorer, Bayern' } },
  { name: 'Kevin Strootman', role: { nl: 'AS Roma, Olympique Marseille', en: 'AS Roma, Olympique Marseille' } },
  { name: 'Rick Karsdorp', role: { nl: 'AS Roma, Feyenoord', en: 'AS Roma, Feyenoord' } },
  { name: 'Tonny Vilhena', role: { nl: 'Feyenoord, Krasnodar', en: 'Feyenoord, Krasnodar' } },
];

const facts = [
  { icon: '📅', nl: 'Opgericht op 1 april 1888', en: 'Founded on April 1, 1888' },
  { icon: '👑', nl: 'Oudste profclub van Nederland', en: 'Oldest professional club in the Netherlands' },
  { icon: '🏆', nl: '6x Landskampioen (1909, 1911, 1912, 1913, 1915, 1959)', en: '6x Dutch Champions (1909, 1911, 1912, 1913, 1915, 1959)' },
  { icon: '🏅', nl: '3x KNVB Beker winnaar (1958, 1962, 1966)', en: '3x KNVB Cup winners (1958, 1962, 1966)' },
  { icon: '🏰', nl: 'Bijnaam: De Kasteelheren', en: 'Nickname: The Castle Lords' },
  { icon: '🔴', nl: 'Clubkleuren: Rood-Wit sinds 1888', en: 'Club colors: Red-White since 1888' },
  { icon: '⚰️', nl: 'Enige club met eigen begraafplaats', en: 'Only club with its own cemetery' },
  { icon: '⭐', nl: 'Johan Cruijff speelde hier in 1983-84', en: 'Johan Cruijff played here in 1983-84' },
  { icon: '🌍', nl: 'Eerste NL-club in Europacup (1959)', en: 'First Dutch club in European Cup (1959)' },
  { icon: '💪', nl: '5x gedegradeerd, 5x teruggekomen', en: '5x relegated, 5x bounced back' },
  { icon: '🎓', nl: 'Erkende jeugdopleiding (Roy Makaay, Strootman)', en: 'Renowned youth academy (Roy Makaay, Strootman)' },
  { icon: '🤝', nl: 'Sociale rol in multiculturele wijk Spangen', en: 'Social role in multicultural Spangen neighborhood' },
];

const milestones = [
  { year: '1888', event: { nl: 'Oprichting Sparta Rotterdam', en: 'Sparta Rotterdam founded' } },
  { year: '1909', event: { nl: 'Eerste landskampioenschap', en: 'First national championship' } },
  { year: '1911-15', event: { nl: 'Vier titels in vijf jaar!', en: 'Four titles in five years!' } },
  { year: '1916', event: { nl: 'Het Kasteel geopend', en: 'Het Kasteel stadium opened' } },
  { year: '1948', event: { nl: 'Abe Lenstra komt naar Sparta', en: 'Abe Lenstra joins Sparta' } },
  { year: '1958', event: { nl: 'KNVB Beker winnaar', en: 'KNVB Cup winners' } },
  { year: '1959', event: { nl: 'Laatste kampioenschap + Europacup', en: 'Last championship + European Cup' } },
  { year: '1966', event: { nl: 'Derde KNVB Beker', en: 'Third KNVB Cup' } },
  { year: '1967', event: { nl: 'Dick Advocaat debuteert', en: 'Dick Advocaat debuts' } },
  { year: '1983', event: { nl: 'Johan Cruijff komt naar Sparta', en: 'Johan Cruijff joins Sparta' } },
  { year: '1988', event: { nl: 'Van Tiggelen wint EK met Oranje', en: 'Van Tiggelen wins Euro with Netherlands' } },
  { year: '1999', event: { nl: 'Het Kasteel gerenoveerd', en: 'Het Kasteel renovated' } },
  { year: '2002', event: { nl: 'Degradatie - stad in shock', en: 'Relegation - city in shock' } },
  { year: '2005', event: { nl: 'Terugkeer naar Eredivisie', en: 'Return to Eredivisie' } },
  { year: '2025', event: { nl: 'Eredivisie seizoen 2024-25', en: 'Eredivisie season 2024-25' } },
];

export default function SpartaTribute({ onClose, theme, lang }: SpartaTributeProps) {
  const [activeTab, setActiveTab] = useState<'facts' | 'legends' | 'stadium' | 'squad' | 'didyouknow'>('facts');

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
    { id: 'didyouknow', label: { nl: 'Wist je dat', en: 'Did you know' }, icon: Lightbulb },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${bg}`}>
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={IMAGES.banner} alt="Sparta Rotterdam" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-800/70 to-red-900/90" />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="relative p-6 text-center text-white">
            <img src={IMAGES.badge} alt="Sparta Rotterdam badge" className="w-20 h-20 mx-auto mb-3 drop-shadow-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <h2 className="text-3xl font-bold tracking-tight">Sparta Rotterdam</h2>
            <p className="text-red-200 mt-1 text-lg font-medium">{tr(lang, 'De Kasteelheren', 'The Castle Lords')}</p>
            <p className="text-red-300/80 text-sm mt-1">{tr(lang, 'Opgericht 1888 — Oudste profclub van Nederland', 'Founded 1888 — Oldest professional club in the Netherlands')}</p>
          </div>
        </div>

        {/* Tabs - scrollable on mobile */}
        <div className={`flex overflow-x-auto border-b ${borderColor} scrollbar-hide`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-shrink-0 flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-medium transition whitespace-nowrap px-2 ${
                activeTab === tab.id ? 'text-red-500 border-b-2 border-red-500' : `${textMuted} hover:${textPrimary}`
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
              <div className="space-y-2">
                {facts.map((fact, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${cardBg}`}>
                    <span className="text-lg w-7 text-center">{fact.icon}</span>
                    <span className={`text-sm ${textPrimary}`}>{tr(lang, fact.nl, fact.en)}</span>
                  </div>
                ))}
              </div>

              {/* Famous alumni */}
              <div>
                <h3 className={`font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2 ${textMuted}`}>
                  <Award className="w-4 h-4 text-red-500" />
                  {tr(lang, 'Beroemde Spartanen', 'Famous Spartans')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {famousAlumni.map((p, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${cardBg}`}>
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${textPrimary}`}>{p.name}</div>
                        <div className={`text-xs ${textMuted}`}>{tr(lang, p.role.nl, p.role.en)}</div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <span className="text-red-500 font-bold text-sm min-w-[52px]">{m.year}</span>
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
                {tr(lang, 'De helden die Sparta groot hebben gemaakt — van kampioenen tot internationale sterren', 'The heroes who made Sparta great — from champions to international stars')}
              </p>
              {legends.map((legend, i) => (
                <div key={i} className={`rounded-xl overflow-hidden ${cardBg}`}>
                  <div className="flex gap-4 p-4">
                    <div className="flex-shrink-0">
                      {legend.photo ? (
                        <img src={legend.photo} alt={legend.name} className="w-20 h-24 object-cover rounded-lg" onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.parentElement!.innerHTML = '<div class="w-20 h-24 rounded-lg bg-red-900/30 flex items-center justify-center"><span class="text-3xl">⚽</span></div>';
                        }} />
                      ) : (
                        <div className="w-20 h-24 rounded-lg bg-red-900/30 flex items-center justify-center">
                          <span className="text-3xl">⚽</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-lg ${textPrimary}`}>{legend.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-red-500 text-xs font-semibold">{legend.years}</span>
                        <span className={`text-xs ${textMuted}`}>{tr(lang, legend.role.nl, legend.role.en)}</span>
                      </div>
                      <p className={`text-sm mt-2 leading-relaxed ${textSecondary}`}>{tr(lang, legend.desc.nl, legend.desc.en)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STADIUM TAB */}
          {activeTab === 'stadium' && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden">
                <img src={IMAGES.kasteel} alt="Het Kasteel - Sparta Rotterdam" className="w-full h-52 object-cover" onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-52 bg-red-900/20 flex items-center justify-center"><span class="text-6xl">🏰</span></div>';
                }} />
              </div>

              <h3 className={`text-xl font-bold ${textPrimary}`}>
                {tr(lang, 'Sparta Stadion — Het Kasteel', 'Sparta Stadium — The Castle')}
              </h3>

              <p className={`text-sm leading-relaxed ${textSecondary}`}>
                {tr(lang,
                  'Het Kasteel is het legendarische thuisstadion van Sparta Rotterdam, gelegen in de wijk Spangen. Het stadion werd in 1916 geopend en is daarmee een van de oudste voetbalstadions van Nederland. De karakteristieke kasteelachtige gevel maakt het uniek in de wereld.',
                  'Het Kasteel (The Castle) is the legendary home stadium of Sparta Rotterdam, located in the Spangen district. The stadium was opened in 1916, making it one of the oldest football stadiums in the Netherlands. Its characteristic castle-like facade makes it unique in the world.'
                )}
              </p>

              <p className={`text-sm leading-relaxed ${textSecondary}`}>
                {tr(lang,
                  'Na een grondige renovatie in 1999 biedt het stadion plaats aan 11.026 toeschouwers. Ondanks de bescheiden capaciteit staat Het Kasteel bekend om zijn unieke sfeer. De tribunes zitten dicht op het veld, waardoor elke wedstrijd een intense ervaring is.',
                  'After a thorough renovation in 1999, the stadium holds 11,026 spectators. Despite its modest capacity, Het Kasteel is known for its unique atmosphere. The stands are close to the pitch, making every match an intense experience.'
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

              {/* Unique features */}
              <div>
                <h4 className={`font-bold text-sm uppercase tracking-wider mb-2 ${textMuted}`}>
                  {tr(lang, 'Bijzonderheden', 'Special Features')}
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: '🏰', nl: 'Kasteelachtige hoofdtribune met kantelen — uniek in de wereld', en: 'Castle-like main stand with battlements — unique in the world' },
                    { icon: '⚰️', nl: 'Begraafplaats "Oud Spangen" naast het stadion voor oud-spelers', en: 'Cemetery "Oud Spangen" next to the stadium for former players' },
                    { icon: '🎭', nl: 'Karakteristieke rode stoeltjes — het rood-witte hart van Rotterdam', en: 'Characteristic red seats — the red-white heart of Rotterdam' },
                    { icon: '🌳', nl: 'Omringd door de volkstuinen en parken van Spangen', en: 'Surrounded by the allotment gardens and parks of Spangen' },
                  ].map((f, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${cardBg}`}>
                      <span className="text-lg">{f.icon}</span>
                      <span className={`text-sm ${textSecondary}`}>{tr(lang, f.nl, f.en)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className={`text-sm italic leading-relaxed ${textMuted}`}>
                {tr(lang,
                  '"Het Kasteel is meer dan een stadion. Het is het hart van Spangen, een plek waar generaties Spartanen hun club hebben aangemoedigd. Je voelt de geschiedenis in elke steen."',
                  '"Het Kasteel is more than a stadium. It is the heart of Spangen, a place where generations of Spartans have cheered on their club. You can feel the history in every stone."'
                )}
              </p>
            </div>
          )}

          {/* SQUAD TAB */}
          {activeTab === 'squad' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold ${textPrimary}`}>{tr(lang, 'Selectie 2024-25', 'Squad 2024-25')}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                  Eredivisie
                </span>
              </div>

              {/* Group by position */}
              {(['Keeper', 'Verdediger', 'Middenvelder', 'Aanvaller'] as const).map(posGroup => {
                const posLabel = { nl: posGroup, en: posGroup === 'Keeper' ? 'Goalkeepers' : posGroup === 'Verdediger' ? 'Defenders' : posGroup === 'Middenvelder' ? 'Midfielders' : 'Forwards' };
                const players = squad.filter(p => p.position.nl === posGroup);
                if (players.length === 0) return null;
                return (
                  <div key={posGroup} className="mb-4">
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>
                      {tr(lang, posLabel.nl, posLabel.en)}
                    </h4>
                    <div className="space-y-1.5">
                      {players.map((player, i) => (
                        <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${cardBg}`}>
                          <div className="relative flex-shrink-0">
                            {player.photo ? (
                              <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                el.style.display = 'none';
                                el.nextElementSibling!.classList.remove('hidden');
                              }} />
                            ) : null}
                            <div className={`w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm ${player.photo ? 'hidden' : ''}`}>
                              {player.number || '?'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${textPrimary}`}>{player.name}</div>
                            <div className={`text-xs ${textMuted}`}>{tr(lang, player.position.nl, player.position.en)}</div>
                          </div>
                          <span className="text-sm mr-1">{player.nationality}</span>
                          {player.number && <div className="text-red-500 font-bold text-lg w-8 text-center">{player.number}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <p className={`text-xs mt-4 text-center ${textMuted}`}>
                {tr(lang, 'Gegevens via TheSportsDB', 'Data via TheSportsDB')}
              </p>
            </div>
          )}

          {/* DID YOU KNOW TAB */}
          {activeTab === 'didyouknow' && (
            <div className="space-y-4">
              <p className={`text-sm mb-2 ${textMuted}`}>
                {tr(lang, 'Verrassende feiten over Sparta Rotterdam', 'Surprising facts about Sparta Rotterdam')}
              </p>
              {didYouKnow.map((fact, i) => (
                <div key={i} className={`p-4 rounded-xl ${cardBg} border-l-4 border-red-500`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm mb-1 ${textPrimary}`}>
                        {tr(lang, 'Wist je dat...', 'Did you know...')} #{i + 1}
                      </h4>
                      <p className={`text-sm leading-relaxed ${textSecondary}`}>
                        {tr(lang, fact.nl, fact.en)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
