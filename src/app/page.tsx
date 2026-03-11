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
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="14" width="2" height="16" fill={isOn ? '#fbbf24' : '#64748b'} />
      <path d="M8 4 L24 4 L22 14 L10 14 Z" fill={isOn ? '#fbbf24' : '#64748b'} />
      {isOn && (
        <>
          <path d="M10 14 L4 24" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
          <path d="M16 14 L16 26" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
          <path d="M22 14 L28 24" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
          <circle cx="16" cy="9" r="3" fill="#fff" opacity="0.9" />
        </>
      )}
      {!isOn && <circle cx="16" cy="9" r="3" fill="#334155" />}
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

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
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
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏟️</span>
                <div>
                  <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Groundhopper Pro</h1>
                  <p className="text-slate-500 text-sm">{loading ? t('Laden...', 'Loading...') : `${stadiums.length} ${t('stadions', 'stadiums')}`}</p>
                </div>
              </div>
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
              </div>
            </div>
          </header>
          <StadiumMap stadiums={stadiums} theme={theme} lang={lang} />
          {showSpartaTribute && <SpartaTribute onClose={() => setShowSpartaTribute(false)} theme={theme} lang={lang} />}
          <div className={`absolute bottom-2 right-2 z-[1000] px-2 py-1 rounded text-xs font-mono ${theme === 'dark' ? 'bg-slate-800/80 text-slate-400' : 'bg-white/80 text-slate-500'}`}>
            v0.9.0
          </div>
        </main>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  )
}
