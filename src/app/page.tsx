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

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // Show welcome screen on first visit
  useEffect(() => {
    if (!localStorage.getItem('groundhopper-welcomed')) {
      setShowHelp(true)
      localStorage.setItem('groundhopper-welcomed', 'true')
    }
  }, [])
  const t = (nl: string, en: string) => (lang === 'nl' ? nl : en)

  useEffect(() => {
    async function fetchStadiums() {
      try {
        const { data, error } = await supabase
          .from('stadiums')
          .select(`
            id, name, latitude, longitude, capacity, city, address, built_year, image_url,
            club:clubs (
              id, name, short_name, primary_color, secondary_color, crest_url, country_id,
              current_league:leagues ( division, name )
            )
          `)
          .eq('is_active', true)
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
          <header className={`absolute top-0 left-0 right-0 z-[1000] p-4 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-transparent' : 'bg-gradient-to-b from-white to-transparent'}`}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <button onClick={() => setShowGroundhopInfo(true)} className="flex items-center gap-3 hover:opacity-80 transition">
                <span className="text-3xl">⚽</span>
                <div className="text-left">
                  <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Groundhopper Pro</h1>
                  <p className="text-slate-500 text-sm">{loading ? t('Laden...', 'Loading...') : `${stadiums.length} ${t('stadions', 'stadiums')}`}</p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSpartaTribute(true)} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800' : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'}`} title="Sparta Rotterdam Tribute">
                  <img src="https://r2.thesportsdb.com/images/media/team/badge/upluv31586362224.png" alt="Sparta" className="w-7 h-7 object-contain" />
                  <span className="hidden sm:inline font-medium">Sparta</span>
                </button>
                <button onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')} className={`px-2 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200'}`} title={t('Switch to English', 'Wissel naar Nederlands')}>
                  <img src={lang === 'nl' ? 'https://flagcdn.com/w40/nl.png' : 'https://flagcdn.com/w40/gb.png'} alt={lang === 'nl' ? 'NL' : 'EN'} className="w-6 h-4 object-cover rounded-sm" />
                </button>
                <button onClick={toggleTheme} className={`p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100 border border-slate-200'}`} title={t(theme === 'dark' ? 'Licht aanzetten' : 'Licht uitzetten', theme === 'dark' ? 'Turn lights on' : 'Turn lights off')}>
                  <FloodlightIcon isOn={theme === 'dark'} />
                </button>
                <button onClick={() => setShowHelp(true)} className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200'}`} title={t('Help & info', 'Help & info')}>
                  ?
                </button>
              </div>
            </div>
          </header>
          <StadiumMap stadiums={stadiums} theme={theme} lang={lang} />
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
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Sparta_Stadion_Het_Kasteel_02.jpg/480px-Sparta_Stadion_Het_Kasteel_02.jpg"
                        alt="Het Kasteel - Sparta Rotterdam"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold mt-2">{t('Welkom bij Groundhopper Pro!', 'Welcome to Groundhopper Pro!')}</h2>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t(
                        "Bram's persoonlijk voetbaldagboek — track bezochte stadions, wedstrijden en reis-statistieken op de kaart.",
                        "Bram's personal football diary — track visited stadiums, matches and travel stats on the map."
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 space-y-3 ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    {[
                      { icon: '📍', nl: 'Kaart — Klik op een stadion voor details', en: 'Map — Click a stadium for details' },
                      { icon: '✅', nl: 'Bezocht — Markeer stadions + vul wedstrijd in', en: 'Visited — Mark stadiums + log match info' },
                      { icon: '⭐', nl: 'Rating — Geef stadions 1-5 sterren', en: 'Rating — Rate stadiums 1-5 stars' },
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

                  <div className={`text-center pt-2 border-t space-y-1 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('Gemaakt door', 'Made by')} <span className="font-medium">Henk Jekel</span>
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      The AppFabrique — an initiative of Incredible Projects
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
                      {t('Laatste update', 'Last update')}: 11 {t('maart', 'March')} 2026 · v1.2
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`absolute bottom-2 right-2 z-[1000] px-2 py-1 rounded text-xs font-mono ${theme === 'dark' ? 'bg-slate-800/80 text-slate-400' : 'bg-white/80 text-slate-500'}`}>
            v1.2
          </div>
        </main>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  )
}
