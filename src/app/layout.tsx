import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Groundhopper Pro',
  description: 'Track je stadionbezoeken door heel Europa — 150+ stadions, 21 competities, 12 landen. Uitdagingen, achievements en meer.',
  keywords: ['football', 'stadiums', 'groundhopping', 'soccer', 'europe', 'tracker', 'stadion', 'voetbal'],
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://groundhopper-pro.vercel.app'),
  openGraph: {
    title: 'Groundhopper Pro 🏟️',
    description: 'Track je stadionbezoeken door heel Europa — 150+ stadions, 21 competities, 12 landen.',
    url: 'https://groundhopper-pro.vercel.app',
    siteName: 'Groundhopper Pro',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Groundhopper Pro 🏟️',
    description: 'Track je stadionbezoeken door heel Europa — 150+ stadions, 21 competities, 12 landen.',
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
