import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Groundhopper Pro',
  description: 'The Ultimate European Stadium Tracker - Track your stadium visits across Europe',
  keywords: ['football', 'stadiums', 'groundhopping', 'soccer', 'europe', 'tracker'],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-white transition-colors duration-300`}>
        {children}
      </body>
    </html>
  )
}
