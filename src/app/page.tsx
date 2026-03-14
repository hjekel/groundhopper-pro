'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'
import { LanguageContext, ThemeContext, Language, Theme } from '@/lib/contexts'

const StadiumMap = dynamic(() => import('@/components/map/stadium-map'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-slate-900">Loading Groundhopper Pro...</h2>
        <p className="text-slate-500 mt-2">Preparing your stadium map</p>
      </div>
    </div>
  ),
})

const SpartaTribute = dynamic(() => import('@/components/sparta/sparta-tribute'), {
  ssr: false,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Stadium {
  id: string
  name: string
  latitude: number
  longitude: number
  capacity: number
  city: string
  address?: string
  built_year?: number
  image_url?: string
  club: {
    id: string
    name: string
    short_name: string
    primary_color: string
    secondary_color: string
    crest_url?: string
    current_league: {
      division: number
      name: string
    } | null
  } | null
}

function FloodlightIcon({ isOn }: { isOn: boolean }) {
  const metal = isOn ? '#d97706' : '#64748b'
  const light = isOn ? '#ffffff' : '#475569'
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="10" x2="12" y2="21" stroke={metal} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="8" y1="21" x2="16" y2="21" stroke={metal} strokeWidth="2" strokeLinecap="round"/>
      <rect x="3" y="2" width="18" height="7" rx="1.5" fill={metal}/>
      <rect x="4.5" y="3.5" width="4" height="4" rx="0.75" fill={light}/>
      <rect x="10" y="3.5" width="4" height="4" rx="0.75" fill={light}/>
      <rect x="15.5" y="3.5" width="4" height="4" rx="0.75" fill={light}/>
      {isOn && (
        <>
          <path d="M6 9 L3 20" stroke="#fbbf24" strokeWidth="1.5" opacity="0.3"/>
          <path d="M12 9 L12 20" stroke="#fbbf24" strokeWidth="1.5" opacity="0.3"/>
          <path d="M18 9 L21 20" stroke="#fbbf24" strokeWidth="1.5" opacity="0.3"/>
          <circle cx="12" cy="5" r="10" fill="#fbbf24" opacity="0.06"/>
        </>
      )}
    </svg>
  )
}

export default function Home() {
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [lang, setLang] = useState<Language>('nl')
  const [showSpartaTribute, setShowSpartaTribute] = useState(false)
  const [showGroundhopInfo, setShowGroundhopInfo] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [addStadiumTrigger, setAddStadiumTrigger] = useState(0)
  const [timelineTrigger, setTimelineTrigger] = useState(0)
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number } | null>(null)

  const APP_VERSION = 'v1.7'
  const APP_DATE = '13 maart 2026'

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // Show welcome screen on first visit
  useEffect(() => {
    if (!localStorage.getItem('groundhopper-welcomed')) {
      setShowHelp(true)
      localStorage.setItem('groundhopper-welcomed', 'true')
    }
  }, [])

  // Show "What's New" when version changes
  useEffect(() => {
    const lastSeenVersion = localStorage.getItem('groundhopper-version')
    if (lastSeenVersion && lastSeenVersion !== APP_VERSION) {
      setShowWhatsNew(true)
    }
    localStorage.setItem('groundhopper-version', APP_VERSION)
  }, [])
  const t = (nl: string, en: string) => (lang === 'nl' ? nl : en)

  useEffect(() => {
    async function fetchStadiums() {
      try {
        const { data, error } = await supabase
          .from('stadiums')
          .select(`
            id, name, latitude, longitude, capacity, city, address, built_year, image_url, notable_events, former_names, is_active,
            club:clubs (
              id, name, short_name, primary_color, secondary_color, crest_url, country_id,
              current_league:leagues ( division, name )
            )
          `)
        if (error) throw error
        setStadiums((data as any) || [])
      } catch (err) {
        console.error('Error fetching stadiums:', err)
        setError(err instanceof Error ? err.message : 'Failed to load stadiums')
      } finally {
        setLoading(false)
      }
    }
    fetchStadiums()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  if (error) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t('Verbindingsfout', 'Connection Error')}
          </h2>
          <p className="text-slate-500">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
            {t('Opnieuw proberen', 'Try Again')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        <main className={`h-screen w-full relative ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <header className={`absolute top-0 left-0 right-0 z-[1000] px-3 py-1.5 ${theme === 'dark' ? 'bg-slate-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowGroundhopInfo(true)} className="flex items-center gap-1.5 hover:opacity-80 transition flex-shrink-0">
                <img src="/Voetbal_bal.png" alt="Groundhopper Pro" className="w-8 h-8 rounded-lg flex-shrink-0" />
                <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Groundhopper Pro</h1>
              </button>
              <button onClick={() => setAddStadiumTrigger(n => n + 1)} className={`flex-shrink-0 px-3 py-1 rounded-lg font-medium text-sm flex items-center gap-1.5 transition ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
                + {t('Stadion toevoegen', 'Add stadium')}
              </button>
              <button onClick={() => setTimelineTrigger(n => n + 1)} className={`flex-shrink-0 px-3 py-1 rounded-lg font-medium text-sm flex items-center gap-1.5 transition ${theme === 'dark' ? 'bg-amber-700 hover:bg-amber-600 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
                📖 {t('Dagboek', 'Diary')}
              </button>
              <div className="flex-1 min-w-1" />
              <button onClick={() => setShowSpartaTribute(true)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition text-sm bg-[#D90000] hover:bg-[#B50000] text-white font-bold shadow-sm" title="Sparta Rotterdam Tribute">
                <img src="https://r2.thesportsdb.com/images/media/team/badge/upluv31586362224.png" alt="Sparta" className="w-6 h-6 object-contain" />
                <span className="hidden sm:inline font-medium">Sparta</span>
              </button>
              <button onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')} className={`p-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100 border border-slate-200'}`} title={t('Switch to English', 'Wissel naar Nederlands')}>
                <img src={lang === 'nl' ? 'https://flagcdn.com/w40/nl.png' : 'https://flagcdn.com/w40/gb.png'} alt={lang === 'nl' ? 'NL' : 'EN'} className="w-6 h-4 object-cover rounded-sm" />
              </button>
              <button onClick={toggleTheme} className={`p-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100 border border-slate-200'}`} title={t(theme === 'dark' ? 'Licht aanzetten' : 'Licht uitzetten', theme === 'dark' ? 'Turn lights on' : 'Turn lights off')}>
                <FloodlightIcon isOn={theme === 'dark'} />
              </button>
              <button onClick={() => setShowHelp(true)} className={`p-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200'}`} title={t('Help & info', 'Help & info')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </button>
            </div>
          </header>
          <StadiumMap stadiums={stadiums} theme={theme} lang={lang} addStadiumTrigger={addStadiumTrigger} timelineTrigger={timelineTrigger} onShowWhatsNew={() => setShowWhatsNew(true)} flyToTarget={flyToTarget} />
          {showSpartaTribute && <SpartaTribute onClose={() => setShowSpartaTribute(false)} theme={theme} lang={lang} />}

          {/* Groundhopping Info Modal */}
          {showGroundhopInfo && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowGroundhopInfo(false)}>
              <div className={`relative max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowGroundhopInfo(false)} className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                  &times;
                </button>
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <span className="text-5xl">⚽</span>
                    <h2 className="text-2xl font-bold mt-2">Groundhopping</h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t('De kunst van het stadion verzamelen', 'The art of collecting stadiums')}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-lg mb-2">{t('Wat is groundhopping?', 'What is groundhopping?')}</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'Groundhopping is de hobby van het bezoeken van zoveel mogelijk verschillende voetbalstadions om daar een wedstrijd te zien. Het gaat niet om het volgen van je eigen club, maar om het verzamelen van stadions en de beleving van voetbal op steeds andere plekken.',
                        'Groundhopping is the hobby of visiting as many different football grounds as possible to watch a match. It\'s not about following your own club, but about collecting stadiums and experiencing football in different places.'
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-lg mb-2">{t('Oorsprong', 'Origins')}</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'Groundhopping ontstond in de jaren 70-80 in Engeland en Duitsland. Britse fans begonnen systematisch alle 92 stadions van de Football League af te reizen. In Duitsland groeide de cultuur van het bezoeken van amateurwedstrijden en lagere divisies.',
                        'Groundhopping originated in the 1970s-80s in England and Germany. British fans started systematically visiting all 92 Football League grounds. In Germany, a culture of attending amateur matches and lower division games developed.'
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-lg mb-2">{t('De 92 Club', 'The 92 Club')}</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'De beroemdste groundhopping-uitdaging is "The 92 Club" in Engeland: alle 92 stadions bezoeken van de Premier League tot en met League Two. Opgericht in 1978, heeft de club duizenden leden die deze prestatie hebben volbracht.',
                        'The most famous groundhopping challenge is "The 92 Club" in England: visiting all 92 grounds from the Premier League to League Two. Founded in 1978, the club has thousands of members who have completed this achievement.'
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-lg mb-2">{t('Bekende groundhoppers', 'Famous groundhoppers')}</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'De Brit Larry Groves bezocht meer dan 2.000 stadions wereldwijd. De Duitser Ernst Middendorp combineerde zijn trainerscarriere met het bezoeken van honderden stadions op vijf continenten. In Nederland groeit de community ook, met actieve groepen op sociale media.',
                        'The Brit Larry Groves visited over 2,000 grounds worldwide. The German Ernst Middendorp combined his coaching career with visiting hundreds of stadiums on five continents. In the Netherlands the community is growing too, with active groups on social media.'
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-lg mb-2">{t('Zelf beginnen?', 'Want to start?')}</h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'Begin gewoon! Ga naar een wedstrijd bij een club waar je nog nooit bent geweest. Zoek op sociale media naar #groundhopping of sluit je aan bij communities op Facebook en Reddit. En gebruik deze app om je voortgang bij te houden! 🏟️',
                        'Just start! Go to a match at a ground you\'ve never been to before. Search #groundhopping on social media or join communities on Facebook and Reddit. And use this app to track your progress! 🏟️'
                      )}
                    </p>
                  </div>

                  {/* Raiders of the Lost Ground */}
                  <div className={`rounded-xl p-4 border-2 ${theme === 'dark' ? 'bg-amber-900/20 border-amber-700/50' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🏚️</span>
                      <h3 className="font-bold text-lg">{t('Raiders of the Lost Ground', 'Raiders of the Lost Ground')}</h3>
                    </div>
                    <p className={`text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'Naast het bezoeken van actieve stadions bestaat er een fascinerende subcultuur: lost ground hopping. Fans bezoeken de locaties van gesloopte, verlaten of herbestemde stadions. Van het iconische Highbury in Londen (nu luxe appartementen) tot het Bökelbergstadion in Mönchengladbach (nu een woonwijk) — overal ter wereld liggen de geesten van legendarische voetbaltempels te wachten om herontdekt te worden.',
                        'Besides visiting active grounds, there\'s a fascinating subculture: lost ground hopping. Fans visit the sites of demolished, abandoned or repurposed stadiums. From the iconic Highbury in London (now luxury flats) to the Bökelbergstadion in Mönchengladbach (now a residential area) — ghosts of legendary football temples are waiting to be rediscovered all over the world.'
                      )}
                    </p>
                    <p className={`text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'Het bijzondere aan lost ground hopping is de mix van nostalgie, detective-werk en urban exploring. Soms is er nog een tribune te zien, soms alleen een vage omtrek in het gras of een gedenkplaat. Het gaat om het gevoel: hier stonden ooit duizenden fans te schreeuwen.',
                        'What makes lost ground hopping special is the mix of nostalgia, detective work and urban exploring. Sometimes a stand is still visible, sometimes just a faint outline in the grass or a memorial plaque. It\'s about the feeling: thousands of fans once stood here, roaring.'
                      )}
                    </p>
                    <div className={`rounded-lg p-3 mb-3 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-white/80'}`}>
                      <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        {t('Bekende lost grounds', 'Famous lost grounds')}
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { name: 'Highbury', city: 'London', year: '1913-2006', lat: 51.5578, lng: -0.1036 },
                          { name: 'Bökelbergstadion', city: 'Mönchengladbach', year: '1919-2006', lat: 51.2093, lng: 6.4391 },
                          { name: 'Estadio Insular', city: 'Las Palmas', year: '1944-2003', lat: 28.1067, lng: -15.4164 },
                          { name: 'Freethielstadion', city: 'Beveren', year: '1927-2012', lat: 51.2126, lng: 4.2578 },
                          { name: 'De Meer', city: 'Amsterdam', year: '1934-1996', lat: 52.3544, lng: 4.9385 },
                        ].map((ground) => (
                          <button
                            key={ground.name}
                            onClick={() => { setShowGroundhopInfo(false); setFlyToTarget({ lat: ground.lat, lng: ground.lng }); }}
                            className={`flex items-center gap-2 w-full text-left text-sm p-1.5 rounded-lg transition hover:scale-[1.01] ${theme === 'dark' ? 'hover:bg-slate-600/50 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                          >
                            <span className="text-base">🏚️</span>
                            <span className="font-medium flex-1">{ground.name}</span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{ground.city} · {ground.year}</span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                      {t('Lost ground links', 'Lost ground links')}
                    </p>
                    <div className="space-y-1.5">
                      <a href="https://www.stadionautist.nl/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        <span>📖</span>
                        <span className="flex-1">Stadionautist — {t('vergane glorie verhalen', 'lost ground stories')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                      <a href="https://www.indehekken.net/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        <span>🏟️</span>
                        <span className="flex-1">In de Hekken — {t('vergane glorie serie', 'faded glory series')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                      <a href="https://heritagecalling.com/2022/05/19/12-lost-english-football-grounds/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                        <span className="flex-1">Historic England — {t('12 verloren Engelse stadions', '12 lost English grounds')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                      <a href="https://www.groundtastic.co.uk/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        <span>📰</span>
                        <span className="flex-1">Groundtastic — {t('het voetbalstadion magazine', 'the football ground magazine')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                      <a href="https://www.terraceedition.com/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                        <span>🇳🇱</span>
                        <span className="flex-1">Terrace Edition — {t('verdwenen stadions in Nederland', 'disappeared grounds in Holland')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* De Heilige Graal */}
                  <div className={`rounded-xl p-4 border-2 ${theme === 'dark' ? 'bg-purple-900/20 border-purple-700/50' : 'bg-purple-50 border-purple-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🏆</span>
                      <h3 className="font-bold text-lg">{t('De Heilige Graal', 'The Holy Grail')}</h3>
                    </div>
                    <p className={`text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {t(
                        'De Heilige Graal van het groundhoppen is niet één specifieke wedstrijd, maar de ultieme ervaring — een zeldzaam bezoek op een plek waar passie, geschiedenis en sfeer samenkomen. Het gaat om het bijwonen van een wedstrijd in een unieke, historische of intens geladen sfeer, vaak op locaties die moeilijk bereikbaar zijn of binnenkort verdwijnen.',
                        'The Holy Grail of groundhopping isn\'t one specific match, but the ultimate experience — a rare visit where passion, history and atmosphere converge. It\'s about attending a match in a unique, historic or intensely charged atmosphere, often at locations that are hard to reach or about to disappear.'
                      )}
                    </p>
                    <div className={`rounded-lg p-3 mb-3 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-white/80'}`}>
                      <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>
                        {t('Heilige Graal ervaringen', 'Holy Grail experiences')}
                      </p>
                      <div className="space-y-2">
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className="font-semibold">🇦🇷 La Superclásico</span>
                          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('Boca Juniors vs River Plate — La Bombonera of El Monumental. De ultieme voetbalervaring qua passie, sfeer en vuur.', 'Boca Juniors vs River Plate — La Bombonera or El Monumental. The ultimate football experience in terms of passion, atmosphere and fire.')}
                          </p>
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className="font-semibold">🏚️ Lost Grounds</span>
                          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('Gesloopte, verlaten of historische stadions bezoeken — vergane glorie herontdekken voordat het voorgoed verdwijnt.', 'Visiting demolished, abandoned or historic stadiums — rediscovering faded glory before it vanishes forever.')}
                          </p>
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className="font-semibold">🔥 {t('Unieke derby\'s', 'Unique derbies')}</span>
                          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('Minder bekende maar verhitte derby\'s zoals Banfield-Lanús (El Derbi del Sur) — de cultzoeker\'s droom.', 'Lesser-known but heated derbies like Banfield-Lanús (El Derbi del Sur) — the cult seeker\'s dream.')}
                          </p>
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className="font-semibold">✅ {t('Complete reeksen', 'Complete series')}</span>
                          <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {t('Alle 92 Engelse profclubs bezoeken, of alle stadions in een regio — de systematische graal.', 'Visiting all 92 English professional clubs, or every ground in a region — the systematic grail.')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className={`text-xs italic ${theme === 'dark' ? 'text-purple-400/70' : 'text-purple-600/70'}`}>
                      {t(
                        '"Kortom, de Heilige Graal is het bijwonen van een wedstrijd in een unieke sfeer, op locaties die moeilijk toegankelijk zijn of binnenkort verdwijnen."',
                        '"In short, the Holy Grail is attending a match in a unique atmosphere, at locations that are hard to access or about to disappear."'
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-lg mb-2">{t('Handige links', 'Useful links')}</h3>
                    <div className="space-y-2">
                      <a href="https://www.the92.net/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                        <span>The 92 Club — {t('alle Engelse stadions bezoeken', 'visit all English grounds')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                      <a href="https://www.fastscore.com/stadiums" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <span>⚡</span>
                        <span>FastScore — {t('stadions per land en competitie', 'stadiums by country and league')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                      <a href="https://www.groundhopping.se/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <span>🌍</span>
                        <span>Groundhopping.se — {t('Scandinavische groundhopping community', 'Scandinavian groundhopping community')}</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                      <a href="https://www.reddit.com/r/groundhopping/" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm hover:underline ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <span>💬</span>
                        <span>r/groundhopping — Reddit community</span>
                        <span className="text-xs opacity-50">↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Welcome / Help Modal */}
          {showHelp && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
              <div className={`relative max-w-md w-full max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowHelp(false)} className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                  &times;
                </button>
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="mx-auto w-48 h-28 rounded-xl overflow-hidden mb-2 shadow-lg">
                      <img
                        src="/het-kasteel.jpg"
                        alt="Het Kasteel - Sparta Rotterdam"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold mt-2">{t('Welkom bij Groundhopper Pro!', 'Welcome to Groundhopper Pro!')}</h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t(
                        "Jouw persoonlijke voetbaldagboek en reisverslag. Met alle door jou bezochte of nog geplande stadions, wedstrijden en reis-statistieken op een interactieve kaart.",
                        "Your personal football diary and travel log. With all the stadiums you've visited or planned, matches and travel stats on an interactive map."
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 space-y-3 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    {[
                      { icon: '📍', nl: 'Kaart — Klik op een stadion voor details', en: 'Map — Click a stadium for details' },
                      { icon: '✅', nl: 'Bezocht — Markeer stadions + vul wedstrijd in', en: 'Visited — Mark stadiums + log match info' },
                      { icon: '⭐', nl: 'Rating — Beoordeel sfeer, stadion en beleving', en: 'Rating — Rate atmosphere, stadium and experience' },
                      { icon: '📊', nl: 'Stats — Voortgang per competitie', en: 'Stats — Progress per league' },
                      { icon: '📅', nl: 'Tijdlijn — Alle bezoeken op datum', en: 'Timeline — All visits by date' },
                      { icon: '🏆', nl: 'Badges — Verdien achievements', en: 'Badges — Earn achievements' },
                      { icon: '📤', nl: 'Delen — Deel je stats als afbeelding', en: 'Share — Share your stats as image' },
                      { icon: '💾', nl: 'Backup — Exporteer je data als JSON', en: 'Backup — Export your data as JSON' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t(item.nl, item.en)}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`rounded-xl p-4 space-y-2 ${theme === 'dark' ? 'bg-emerald-900/30 border border-emerald-800/30' : 'bg-emerald-50 border border-emerald-100'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📱</span>
                      <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        {t('Zet op je beginscherm', 'Add to home screen')}
                      </span>
                    </div>
                    <div className={`text-xs space-y-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      <div>
                        <span className="font-medium">iPhone/iPad:</span>{' '}
                        {t(
                          'Open in Safari → tik op het Deel-icoon (vierkantje met pijl omhoog) → "Zet op beginscherm"',
                          'Open in Safari → tap Share icon (square with arrow) → "Add to Home Screen"'
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Android:</span>{' '}
                        {t(
                          'Open in Chrome → tik op ⋮ menu rechtsboven → "Toevoegen aan startscherm"',
                          'Open in Chrome → tap ⋮ menu top-right → "Add to Home screen"'
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`text-center pt-2 border-t space-y-1 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('Gemaakt door', 'Made by')} <span className="font-medium">Henk Jekel</span>
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      The AppFabrique — an initiative of Incredible Projects
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
                      {t('Laatste update', 'Last update')}: {APP_DATE.replace('maart', t('maart', 'March'))} · {APP_VERSION}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What's New popup */}
          {showWhatsNew && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowWhatsNew(false)}>
              <div className={`relative max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`} onClick={e => e.stopPropagation()}>
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🚀</span>
                      <div>
                        <h2 className="text-xl font-bold">{t("What's New!", "What's New!")}</h2>
                        <p className="text-sm text-white/80">{APP_VERSION} · {APP_DATE}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowWhatsNew(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-lg transition">
                      &times;
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                  <button onClick={() => { setShowWhatsNew(false); setFlyToTarget({ lat: 51.2093, lng: 6.4391 }); }} className={`flex items-start gap-3 p-3 rounded-xl w-full text-left transition hover:scale-[1.02] ${theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <span className="text-xl flex-shrink-0">🏚️</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('57 Vergane Glorie stadions', '57 Lost Ground stadiums')}</p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('Verdwenen stadions uit NL, België, Duitsland en Spanje — van Bökelberg tot Nou Mestalla', 'Lost stadiums from NL, Belgium, Germany and Spain — from Bökelberg to Nou Mestalla')}
                      </p>
                    </div>
                    <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                  </button>

                  <button onClick={() => { setShowWhatsNew(false); setFlyToTarget({ lat: 51.2126, lng: 4.2578 }); }} className={`flex items-start gap-3 p-3 rounded-xl w-full text-left transition hover:scale-[1.02] ${theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <span className="text-xl flex-shrink-0">🇧🇪</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('België geopend!', 'Belgium opened!')}</p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('31 Belgische lost grounds: Freethiel, Veltwijckpark, Mijnstadion en meer', '31 Belgian lost grounds: Freethiel, Veltwijckpark, Mijnstadion and more')}
                      </p>
                    </div>
                    <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                  </button>

                  <button onClick={() => { setShowWhatsNew(false); setFlyToTarget({ lat: 52.3885, lng: 4.6388 }); }} className={`flex items-start gap-3 p-3 rounded-xl w-full text-left transition hover:scale-[1.02] ${theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <span className="text-xl flex-shrink-0">⚽</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('HFC Haarlem & De Haarlemse Herdgang', 'HFC Haarlem & De Haarlemse Herdgang')}</p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('Het Haarlemstadion (Gullit, Hughes) + ons eigen COVID-voetbalveld bij Hageveld', 'The Haarlemstadion (Gullit, Hughes) + our own COVID football field at Hageveld')}
                      </p>
                    </div>
                    <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                  </button>

                  <button onClick={() => { setShowWhatsNew(false); setFlyToTarget({ lat: 53.0049, lng: 5.9615 }); }} className={`flex items-start gap-3 p-3 rounded-xl w-full text-left transition hover:scale-[1.02] ${theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <span className="text-xl flex-shrink-0">🏟️</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('260 stadions op de kaart!', '260 stadiums on the map!')}</p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('Van het kleinste clubje (VV Gersloot, 22 leden) tot het grootste skelet (Nou Mestalla, 75.000)', 'From the smallest club (VV Gersloot, 22 members) to the biggest skeleton (Nou Mestalla, 75,000)')}
                      </p>
                    </div>
                    <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                  </button>

                  <button onClick={() => { setShowWhatsNew(false); setFlyToTarget({ lat: 51.2093, lng: 6.4391 }); }} className={`flex items-start gap-3 p-3 rounded-xl w-full text-left transition hover:scale-[1.02] ${theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <span className="text-xl flex-shrink-0">📸</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t('Foto\'s & logo\'s', 'Photos & logos')}</p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('Historische foto\'s voor Bökelberg, Freethiel, Estadio Insular, Nou Mestalla en meer', 'Historic photos for Bökelberg, Freethiel, Estadio Insular, Nou Mestalla and more')}
                      </p>
                    </div>
                    <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                  </button>
                </div>

                <div className="px-6 pb-5 pt-2">
                  <button onClick={() => setShowWhatsNew(false)} className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition shadow-lg">
                    {t('Top, bekeken!', 'Got it!')} ⚽
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  )
}
