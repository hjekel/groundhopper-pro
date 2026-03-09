'use client'

import { createContext, useContext } from 'react'

export type Language = 'nl' | 'en'
export interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (nl: string, en: string) => string
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'nl',
  setLang: () => {},
  t: (nl) => nl,
})

export const useLanguage = () => useContext(LanguageContext)

export type Theme = 'dark' | 'light'
export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)