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
  kasteelFacade: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Exterieur_OVERZICHT_CLUBGEBOUW_-_Rotterdam_-_20282971_-_RCE.jpg/960px-Exterieur_OVERZICHT_CLUBGEBOUW_-_Rotterdam_-_20282971_-_RCE.jpg',
  kasteelStadion: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Het_Kasteel%2C_Rotterdam.jpg/960px-Het_Kasteel%2C_Rotterdam.jpg',
  badge: 'https://r2.thesportsdb.com/images/media/team/badge/upluv31586362224.png',
  banner: 'https://r2.thesportsdb.com/images/media/team/banner/r3ujd51722780656.jpg',
  bokDeKorver: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/BokdeKorver.jpg',
  vanEde: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tonny_van_Ede_%281962%29.jpg/330px-Tonny_van_Ede_%281962%29.jpg',
  terlouw: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Rinus_Terlouw_%281951%29.jpg/330px-Rinus_Terlouw_%281951%29.jpg',
  neville: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Denis_Neville%2C_trainer_van_Sparta%2C_1963.jpg/330px-Denis_Neville%2C_trainer_van_Sparta%2C_1963.jpg',
  vanTiggelen: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Adri_van_Tiggelen_%28cropped%29.jpg',
  advocaat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Dick_Advocaat_2021.jpg/500px-Dick_Advocaat_2021.jpg',
};

// All facts verified via Wikipedia, Transfermarkt, Sparta-rotterdam.nl, NOS
const legends = [
  {
    name: 'Bok de Korver',
    years: '1902-1923',
    role: { nl: 'Verdediger - 363 wedstrijden, 31 interlands', en: 'Defender - 363 matches, 31 caps' },
    photo: IMAGES.bokDeKorver,
    desc: {
      nl: 'Op 19-jarige leeftijd debuteerde Bok de Korver in Sparta\'s eerste elftal en droeg 21 seizoenen het rood-wit. Met 363 wedstrijden en 31 interlands is hij een van de grootste Spartanen ooit. De familietribune draagt zijn naam.',
      en: 'At age 19, Bok de Korver made his Sparta debut and wore the red-white for 21 seasons. With 363 matches and 31 international caps, he is one of the greatest Spartans ever. The family stand bears his name.'
    },
  },
  {
    name: 'Tonny van Ede',
    years: '1946-1964',
    role: { nl: 'Aanvaller - 455 wedstrijden, clubrecord', en: 'Forward - 455 matches, club record' },
    photo: IMAGES.vanEde,
    desc: {
      nl: '"De Schicht" — vanaf zijn elfde lid van Sparta, droeg achttien seizoenen het rood-wit als aanvaller. Met 455 competitiewedstrijden houdt hij het clubrecord. Kampioen in 1959, twee bekers, en #2 in de all-time Sparta top-60. De hoofdtribune draagt sinds 2008 zijn naam.',
      en: '"The Flash" — a Sparta member from age eleven, he wore the red-white for eighteen seasons as a forward. With 455 competitive matches he holds the club record. Champion in 1959, two cups, and #2 in the all-time Sparta top-60. The main stand has borne his name since 2008.'
    },
  },
  {
    name: 'Rinus Terlouw',
    years: '1948-1958',
    role: { nl: 'Verdediger - 248 wedstrijden, 34 interlands', en: 'Defender - 248 matches, 34 caps' },
    photo: IMAGES.terlouw,
    desc: {
      nl: '"De Rots" — samen met keeper Wim Landman maakte Rinus Terlouw Het Kasteel tot een onneembaar bolwerk. In tien seizoenen speelde hij 248 wedstrijden en verdiende 34 interlands voor Oranje.',
      en: '"The Rock" — together with goalkeeper Wim Landman, Rinus Terlouw made Het Kasteel an impregnable fortress. In ten seasons he played 248 matches and earned 34 international caps for the Netherlands.'
    },
  },
  {
    name: 'Denis Neville',
    years: '1955-1963',
    role: { nl: 'Trainer - Kampioen 1959, 2x Beker', en: 'Manager - Champion 1959, 2x Cup' },
    photo: IMAGES.neville,
    desc: {
      nl: 'De Engelse gentleman-trainer leidde Sparta naar het kampioenschap van 1959 en twee KNVB Bekers (1958, 1962). Onder Neville scoorde Sparta 83 goals in 34 wedstrijden. De luidruchtigste tribune draagt zijn naam.',
      en: 'The English gentleman-manager led Sparta to the 1959 championship and two KNVB Cups (1958, 1962). Under Neville, Sparta scored 83 goals in 34 matches. The noisiest stand bears his name.'
    },
  },
  {
    name: 'Adri van Tiggelen',
    years: '1978-1983',
    role: { nl: 'Verdediger - Debuut 1978, EK 1988 winnaar', en: 'Defender - Debut 1978, Euro 1988 winner' },
    photo: IMAGES.vanTiggelen,
    desc: {
      nl: 'Debuteerde op 30 augustus 1978 in een 1-0 thuiszege op Feyenoord. In vijf seizoenen was hij onbetwiste basisspeler. Vertrok naar Anderlecht en won het EK 1988 met Oranje. Keerde later terug als jeugdtrainer en hoofdcoach.',
      en: 'Made his debut on 30 August 1978 in a 1-0 home win over Feyenoord. In five seasons he was an undisputed starter. Left for Anderlecht and won Euro 1988 with the Netherlands. Later returned as youth trainer and head coach.'
    },
  },
  {
    name: 'Dick Advocaat',
    years: '1980-1981',
    role: { nl: 'Speler (61 wed.) & later trainer', en: 'Player (61 apps) & later manager' },
    photo: IMAGES.advocaat,
    desc: {
      nl: 'De "Kleine Generaal" speelde 61 wedstrijden voor Sparta en scoorde 6 keer. Later werd hij bondscoach van Nederland, Rusland en Zuid-Korea. In 2017 keerde hij terug als trainer van Sparta.',
      en: 'The "Little General" played 61 matches for Sparta and scored 6 goals. He later became national team coach of the Netherlands, Russia, and South Korea. In 2017 he returned as Sparta\'s manager.'
    },
  },
];

// Verified squad via ESPN, Transfermarkt, Sparta-rotterdam.nl (2024-25 season)
// Note: Sparta uses traditional 1-11 numbering per match — no fixed squad numbers
const squad = [
  { name: 'Nick Olij', position: { nl: 'Keeper', en: 'Goalkeeper' }, nationality: '🇳🇱', photo: null, note: { nl: '1e keeper', en: '1st choice' } },
  { name: 'Joel Drommel', position: { nl: 'Keeper', en: 'Goalkeeper' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/q3r4li1646699927.jpg' },
  { name: 'Filip Bednarek', position: { nl: 'Keeper', en: 'Goalkeeper' }, nationality: '🇵🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/ksus991696664818.jpg' },
  { name: 'Bruno Martins Indi', position: { nl: 'Verdediger', en: 'Defender' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/2sx3a31509654666.jpg' },
  { name: 'Patrick van Aanholt', position: { nl: 'Verdediger', en: 'Defender' }, nationality: '🇳🇱', photo: null, note: { nl: 'ex-Chelsea, Crystal Palace', en: 'ex-Chelsea, Crystal Palace' } },
  { name: 'Boyd Reith', position: { nl: 'Verdediger', en: 'Defender' }, nationality: '🇳🇱', photo: null },
  { name: 'Mike Kleijn', position: { nl: 'Verdediger', en: 'Defender' }, nationality: '🇳🇱', photo: null },
  { name: 'Said Bakari', position: { nl: 'Verdediger', en: 'Defender' }, nationality: '🇰🇲', photo: null },
  { name: 'Jens Toornstra', position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/w6cgvc1679239148.jpg' },
  { name: 'Julian Baas', position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/q1oahy1679406854.jpg' },
  { name: 'Jonathan de Guzman', position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/kpr9mr1578087007.jpg' },
  { name: 'Joshua Kitolano', position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇴', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/7kyq9j1701437428.jpg' },
  { name: 'Pelle Clement', position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: null },
  { name: 'Carel Eiting', position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: null, note: { nl: 'huur FC Twente', en: 'loan FC Twente' } },
  { name: 'Ayoni Santos', position: { nl: 'Middenvelder', en: 'Midfielder' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/75e2m61765730191.jpg' },
  { name: 'Tobias Lauritsen', position: { nl: 'Aanvaller', en: 'Forward' }, nationality: '🇳🇴', photo: null, note: { nl: 'topscorer', en: 'top scorer' } },
  { name: 'Shunsuke Mito', position: { nl: 'Aanvaller', en: 'Forward' }, nationality: '🇯🇵', photo: null },
  { name: 'Ayoub Oufkir', position: { nl: 'Aanvaller', en: 'Forward' }, nationality: '🇳🇱', photo: 'https://r2.thesportsdb.com/images/media/player/thumb/w0ikoj1759697668.jpg' },
  { name: 'Mitchell van Bergen', position: { nl: 'Aanvaller', en: 'Forward' }, nationality: '🇳🇱', photo: null, note: { nl: 'huur FC Twente', en: 'loan FC Twente' } },
];

// Verified notable ex-Sparta players via Wikipedia, Transfermarkt
const exPlayers = [
  { name: 'Pim Doesburg', years: '1962-1977', role: { nl: 'Keeper — 687 Eredivisie-wedstrijden (all-time record!)', en: 'GK — 687 Eredivisie apps (all-time record!)' }, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pim_Doesburg_%28PSV%29.jpg/330px-Pim_Doesburg_%28PSV%29.jpg' },
  { name: 'Ed de Goey', years: '1985-1990', role: { nl: 'Keeper — debuut bij Sparta → Chelsea, 31 interlands', en: 'GK — Sparta debut → Chelsea, 31 caps' }, photo: null },
  { name: 'Winston Bogarde', years: '1991-1994', role: { nl: 'Verdediger — Ajax (CL \'95), Milan, Barcelona', en: 'Defender — Ajax (CL \'95), Milan, Barcelona' }, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Winston_bogarde-1507900545.jpg/330px-Winston_bogarde-1507900545.jpg' },
  { name: 'John de Wolf', years: '1983-1985', role: { nl: 'Verdediger — Feyenoord-legende, later Sparta-trainer', en: 'Defender — Feyenoord legend, later Sparta manager' }, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Feyenoord_-_GAE_-_53334499213.jpg/330px-Feyenoord_-_GAE_-_53334499213.jpg' },
  { name: 'Henk Fraser', years: '1984-1986', role: { nl: 'Verdediger — Feyenoord, WK \'90, later Sparta-coach', en: 'Defender — Feyenoord, WC \'90, later Sparta coach' }, photo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Henk_Fraser_coach.jpg' },
  { name: 'Danny Koevermans', years: '2000-2005', role: { nl: 'Aanvaller — 71 goals in 110 wedstrijden!', en: 'Forward — 71 goals in 110 matches!' }, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Danny-Koevermans2.jpg/330px-Danny-Koevermans2.jpg' },
  { name: 'Jetro Willems', years: 'Jeugd-2011', role: { nl: 'Verdediger — jongste EK-speler ooit (18 jr)', en: 'Defender — youngest ever Euro Champ player (18)' }, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/PSV_Eindhoven%2C_Teamcamp_Bad_Erlach%2C_July_2014_%28154%29_%28cropped%29.jpg/330px-PSV_Eindhoven%2C_Teamcamp_Bad_Erlach%2C_July_2014_%28154%29_%28cropped%29.jpg' },
];

// Verified youth academy products via Transfermarkt, Wikipedia, NOS, Squawka
const youthProducts = [
  { name: 'Memphis Depay', dest: { nl: 'PSV, Man Utd, Barcelona, Oranje', en: 'PSV, Man Utd, Barcelona, Netherlands' }, years: '2003-2006' },
  { name: 'Georginio Wijnaldum', dest: { nl: 'Feyenoord, Newcastle, Liverpool, PSG', en: 'Feyenoord, Newcastle, Liverpool, PSG' }, years: 'Jeugd' },
  { name: 'Kevin Strootman', dest: { nl: 'FC Utrecht, PSV, AS Roma, Marseille', en: 'FC Utrecht, PSV, AS Roma, Marseille' }, years: 'Jeugd - 2008' },
  { name: 'Danny Blind', dest: { nl: 'Ajax (350+ wed.), bondscoach NL', en: 'Ajax (350+ apps), Netherlands manager' }, years: 'Jeugd' },
  { name: 'Denzel Dumfries', dest: { nl: 'PSV, Inter Milan, Oranje', en: 'PSV, Inter Milan, Netherlands' }, years: '2017-2018' },
  { name: 'Jorrel Hato', dest: { nl: 'Ajax, Chelsea', en: 'Ajax, Chelsea' }, years: 'Jeugd' },
  { name: 'Ian Maatsen', dest: { nl: 'Chelsea, Aston Villa', en: 'Chelsea, Aston Villa' }, years: 'Jeugd' },
  { name: 'Marten de Roon', dest: { nl: 'Heerenveen, Atalanta', en: 'Heerenveen, Atalanta' }, years: 'Jeugd' },
  { name: 'Aron Winter', dest: { nl: 'Ajax, Lazio, Inter Milan, Oranje', en: 'Ajax, Lazio, Inter Milan, Netherlands' }, years: 'Jeugd' },
];

const didYouKnow = [
  {
    nl: 'Sparta heeft als eerste club in Nederland het koppen geintroduceerd, een doel met lat en netten, en felgekleurde shirts. Pioniers van het Nederlandse voetbal.',
    en: 'Sparta were the first club in the Netherlands to introduce heading, goals with a crossbar and nets, and brightly colored shirts. Pioneers of Dutch football.',
  },
  {
    nl: 'In het kampioensjaar 1959 scoorde Sparta 83 doelpunten in 34 wedstrijden — een gemiddelde van bijna 2,5 per wedstrijd. Het doelsaldo was 83-30.',
    en: 'In the championship year 1959, Sparta scored 83 goals in 34 matches — an average of nearly 2.5 per game. The goal difference was 83-30.',
  },
  {
    nl: 'Sparta was in 1959 de eerste Nederlandse club die deelnam aan de Europacup voor landskampioenen (nu Champions League).',
    en: 'Sparta was the first Dutch club to participate in the European Cup for national champions (now Champions League) in 1959.',
  },
  {
    nl: 'De Sparta Jeugdopleiding is een 4-sterren gecertificeerde opleiding en meerdere keren verkozen tot beste jeugdopleiding van Nederland. Bekende producten: Memphis Depay, Wijnaldum, Strootman.',
    en: 'The Sparta Youth Academy is a 4-star certified academy and has been voted best youth academy in the Netherlands multiple times. Famous products: Memphis Depay, Wijnaldum, Strootman.',
  },
  {
    nl: 'Memphis Depay werd als 8-jarig ventje bij zijn amateurclub Moordrecht ontdekt door Sparta-scouts. Na drie seizoenen bij Sparta ging hij naar PSV.',
    en: 'Memphis Depay was discovered at age 8 at his amateur club Moordrecht by Sparta scouts. After three seasons at Sparta he moved to PSV.',
  },
  {
    nl: 'Er zijn drie tribunes in Het Kasteel vernoemd naar Sparta-legendes: de Bok de Korver-tribune, de Tonny van Ede-tribune en de Denis Neville-tribune.',
    en: 'Three stands at Het Kasteel are named after Sparta legends: the Bok de Korver stand, the Tonny van Ede stand, and the Denis Neville stand.',
  },
  {
    nl: 'Het Kasteel is ontworpen door architecten J.H. de Roos en W.F. Overeynder. De kasteelachtige gevel met kantelen maakt het uniek in de voetbalwereld.',
    en: 'Het Kasteel was designed by architects J.H. de Roos and W.F. Overeynder. Its castle-like facade with battlements makes it unique in the football world.',
  },
  {
    nl: 'Kevin Strootman en Georginio Wijnaldum groeiden samen op in de Sparta-jeugd. De NOS noemde ze "van beugelbekkies bij Sparta tot sterren in Europa".',
    en: 'Kevin Strootman and Georginio Wijnaldum grew up together in the Sparta youth. Dutch broadcaster NOS called them "from kids with braces at Sparta to stars in Europe".',
  },
];

const facts = [
  { icon: '📅', nl: 'Opgericht op 1 april 1888', en: 'Founded on April 1, 1888' },
  { icon: '👑', nl: 'Oudste profclub van Nederland', en: 'Oldest professional club in the Netherlands' },
  { icon: '🏆', nl: '6x Landskampioen (1909, 1911, 1912, 1913, 1915, 1959)', en: '6x Dutch Champions (1909, 1911, 1912, 1913, 1915, 1959)' },
  { icon: '🏅', nl: '3x KNVB Beker winnaar (1958, 1962, 1966)', en: '3x KNVB Cup winners (1958, 1962, 1966)' },
  { icon: '🏰', nl: 'Bijnaam: De Kasteelheren', en: 'Nickname: The Castle Lords' },
  { icon: '🔴', nl: 'Clubkleuren: Rood-Wit sinds 1888', en: 'Club colors: Red-White since 1888' },
  { icon: '🌍', nl: 'Eerste NL-club in Europacup (1959)', en: 'First Dutch club in European Cup (1959)' },
  { icon: '💡', nl: 'Introduceerde in NL: koppen, doellat met net, gekleurde shirts', en: 'Introduced in NL: heading, crossbar with nets, colored shirts' },
  { icon: '🎓', nl: '4-sterren jeugdopleiding (Depay, Wijnaldum, Strootman)', en: '4-star youth academy (Depay, Wijnaldum, Strootman)' },
  { icon: '💪', nl: 'Altijd teruggevochten na degradatie', en: 'Always fought back after relegation' },
];

const milestones = [
  { year: '1888', event: { nl: 'Oprichting door acht studenten', en: 'Founded by eight students' } },
  { year: '1902', event: { nl: 'Bok de Korver debuteert (21 seizoenen!)', en: 'Bok de Korver debuts (21 seasons!)' } },
  { year: '1909', event: { nl: 'Eerste landskampioenschap', en: 'First national championship' } },
  { year: '1911-15', event: { nl: 'Vier titels in vijf jaar', en: 'Four titles in five years' } },
  { year: '1916', event: { nl: 'Het Kasteel geopend in Spangen', en: 'Het Kasteel opened in Spangen' } },
  { year: '1946', event: { nl: 'Tonny van Ede debuteert — "De Schicht" (455 wedstrijden)', en: 'Tonny van Ede debuts — "The Flash" (455 matches)' } },
  { year: '1955', event: { nl: 'Denis Neville wordt trainer', en: 'Denis Neville becomes manager' } },
  { year: '1958', event: { nl: 'KNVB Beker winnaar', en: 'KNVB Cup winners' } },
  { year: '1959', event: { nl: 'Kampioen (83 goals!) + Europacup', en: 'Champions (83 goals!) + European Cup' } },
  { year: '1978', event: { nl: 'Adri van Tiggelen debuteert', en: 'Adri van Tiggelen debuts' } },
  { year: '1980', event: { nl: 'Dick Advocaat komt naar Sparta', en: 'Dick Advocaat joins Sparta' } },
  { year: '1999', event: { nl: 'Het Kasteel gerenoveerd', en: 'Het Kasteel renovated' } },
  { year: '2003', event: { nl: 'Memphis Depay (8 jaar) naar Sparta-jeugd', en: 'Memphis Depay (age 8) joins Sparta youth' } },
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

        {/* Tabs */}
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

              {/* Youth Academy Alumni */}
              <div>
                <h3 className={`font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2 ${textMuted}`}>
                  <Award className="w-4 h-4 text-red-500" />
                  {tr(lang, 'Uit de Sparta-jeugd', 'From the Sparta youth')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {youthProducts.map((p, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${cardBg}`}>
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${textPrimary}`}>{p.name}</div>
                        <div className={`text-xs ${textMuted}`}>{tr(lang, p.dest.nl, p.dest.en)}</div>
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
                {tr(lang, 'De helden die Sparta groot hebben gemaakt', 'The heroes who made Sparta great')}
              </p>
              {legends.map((legend, i) => (
                <div key={i} className={`rounded-xl overflow-hidden ${cardBg}`}>
                  <div className="flex gap-4 p-4">
                    <div className="flex-shrink-0">
                      {legend.photo ? (
                        <img src={legend.photo} alt={legend.name} className="w-20 h-24 object-cover rounded-lg" onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.parentElement!.innerHTML = '<div class="w-20 h-24 rounded-lg bg-red-900/30 flex items-center justify-center"><span class="text-2xl font-bold text-red-400">' + legend.name.split(' ').map((n: string) => n[0]).join('') + '</span></div>';
                        }} />
                      ) : (
                        <div className="w-20 h-24 rounded-lg bg-red-900/30 flex items-center justify-center">
                          <span className="text-2xl font-bold text-red-400">{legend.name.split(' ').map(n => n[0]).join('')}</span>
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
                <img src={IMAGES.kasteelFacade} alt="Het Kasteel - Sparta Rotterdam" className="w-full h-52 object-cover" onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = IMAGES.kasteelStadion;
                  el.onerror = () => { el.parentElement!.innerHTML = '<div class="w-full h-52 bg-red-900/20 flex items-center justify-center"><span class="text-6xl">🏰</span></div>'; };
                }} />
              </div>

              <h3 className={`text-xl font-bold ${textPrimary}`}>
                {tr(lang, 'Sparta Stadion — Het Kasteel', 'Sparta Stadium — The Castle')}
              </h3>

              <p className={`text-sm leading-relaxed ${textSecondary}`}>
                {tr(lang,
                  'Het Kasteel is het thuisstadion van Sparta Rotterdam, gelegen in de wijk Spangen. Gebouwd in 1916 als Stadion Spangen naar ontwerp van architecten J.H. de Roos en W.F. Overeynder. De kasteelachtige gevel met kantelen maakt het uniek in de voetbalwereld.',
                  'Het Kasteel (The Castle) is the home stadium of Sparta Rotterdam, located in the Spangen district. Built in 1916 as Stadion Spangen, designed by architects J.H. de Roos and W.F. Overeynder. Its castle-like facade with battlements makes it unique in the football world.'
                )}
              </p>

              <p className={`text-sm leading-relaxed ${textSecondary}`}>
                {tr(lang,
                  'Na een grondige renovatie in 1999 biedt het stadion plaats aan 11.026 toeschouwers. De tribunes zitten dicht op het veld, waardoor elke wedstrijd een intense ervaring is.',
                  'After a thorough renovation in 1999, the stadium holds 11,026 spectators. The stands are close to the pitch, making every match an intense experience.'
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
                    <span className={`text-xs font-medium ${textMuted}`}>{tr(lang, 'Architecten', 'Architects')}</span>
                  </div>
                  <p className={`text-sm font-medium ${textPrimary}`}>De Roos & Overeynder</p>
                  <p className={`text-xs ${textMuted}`}>{tr(lang, 'Ontwerp 1916', 'Design 1916')}</p>
                </div>
              </div>

              {/* Named stands */}
              <div>
                <h4 className={`font-bold text-sm uppercase tracking-wider mb-2 ${textMuted}`}>
                  {tr(lang, 'Tribunenamen', 'Named Stands')}
                </h4>
                <div className="space-y-2">
                  {[
                    { name: 'Bok de Korver', nl: 'Familietribune — vernoemd naar de verdediger (363 wedstrijden)', en: 'Family stand — named after the defender (363 matches)' },
                    { name: 'Tonny van Ede', nl: 'Hoofdtribune — vernoemd naar "De Schicht" (455 wed., clubrecord)', en: 'Main stand — named after "The Flash" (455 apps, club record)' },
                    { name: 'Denis Neville', nl: 'De luidruchtigste tribune — vernoemd naar de kampioenentrainer', en: 'The noisiest stand — named after the championship manager' },
                  ].map((s, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${cardBg}`}>
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${textPrimary}`}>{s.name}</span>
                        <p className={`text-xs ${textMuted}`}>{tr(lang, s.nl, s.en)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SQUAD TAB */}
          {activeTab === 'squad' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold ${textPrimary}`}>{tr(lang, 'Selectie 2024-25', 'Squad 2024-25')}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>Eredivisie</span>
                </div>
                {(['Keeper', 'Verdediger', 'Middenvelder', 'Aanvaller'] as const).map(posGroup => {
                  const posLabel = { nl: posGroup, en: posGroup === 'Keeper' ? 'Keepers' : posGroup === 'Verdediger' ? 'Defenders' : posGroup === 'Middenvelder' ? 'Midfielders' : 'Forwards' };
                  const players = squad.filter(p => p.position.nl === posGroup);
                  if (players.length === 0) return null;
                  return (
                    <div key={posGroup} className="mb-3">
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${textMuted}`}>{tr(lang, posLabel.nl, posLabel.en)}</h4>
                      <div className="space-y-1">
                        {players.map((player, i) => (
                          <div key={i} className={`flex items-center gap-2.5 p-2 rounded-lg ${cardBg}`}>
                            <div className="relative flex-shrink-0">
                              {player.photo ? (
                                <img src={player.photo} alt={player.name} className="w-8 h-8 rounded-full object-cover" onError={(e) => {
                                  const el = e.target as HTMLImageElement;
                                  el.style.display = 'none';
                                  el.nextElementSibling!.classList.remove('hidden');
                                }} />
                              ) : null}
                              <div className={`w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs ${player.photo ? 'hidden' : ''}`}>
                                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-sm ${textPrimary}`}>{player.name}</div>
                              {player.note && <div className={`text-xs ${textMuted}`}>{tr(lang, player.note.nl, player.note.en)}</div>}
                            </div>
                            <span className="text-sm">{player.nationality}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notable Ex-Players */}
              <div>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${textPrimary}`}>
                  <Trophy className="w-4 h-4 text-red-500" />
                  {tr(lang, 'Markante ex-Spartanen', 'Notable ex-Spartans')}
                </h3>
                <div className="space-y-2">
                  {exPlayers.map((player, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${cardBg}`}>
                      <div className="flex-shrink-0">
                        {player.photo ? (
                          <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                            el.nextElementSibling!.classList.remove('hidden');
                          }} />
                        ) : null}
                        <div className={`w-10 h-10 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-xs ${player.photo ? 'hidden' : ''}`}>
                          {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${textPrimary}`}>{player.name}</div>
                        <div className={`text-xs ${textMuted}`}>
                          <span className="text-red-500 font-semibold">{player.years}</span> — {tr(lang, player.role.nl, player.role.en)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className={`text-xs text-center ${textMuted}`}>
                {tr(lang, 'Bronnen: TheSportsDB, Transfermarkt, Wikipedia', 'Sources: TheSportsDB, Transfermarkt, Wikipedia')}
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
