import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Groundhopper Pro',
  description: 'Track je stadionbezoeken door heel Europa — kaart, achievements, uitdagingen en meer.',
  keywords: ['football', 'stadiums', 'groundhopping', 'soccer', 'europe', 'tracker', 'stadion', 'voetbal'],
  icons: {
    icon: '/Voetbal_bal.png',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://groundhopper-pro.vercel.app'),
  openGraph: {
    title: 'Groundhopper Pro 🏟️',
    description: 'Track je stadionbezoeken door heel Europa — kaart, achievements, uitdagingen en meer.',
    url: 'https://groundhopper-pro.vercel.app',
    siteName: 'Groundhopper Pro',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Groundhopper Pro 🏟️',
    description: 'Track je stadionbezoeken door heel Europa — kaart, achievements, uitdagingen en meer.',
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
