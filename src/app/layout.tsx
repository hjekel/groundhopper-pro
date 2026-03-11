import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Groundhopper Pro',
  description: 'The Ultimate European Stadium Tracker - Track your stadium visits across Europe',
  keywords: ['football', 'stadiums', 'groundhopping', 'soccer', 'europe', 'tracker'],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='white' stroke='%23222' stroke-width='3'/><path d='M50 2a48 48 0 0 0 0 96a48 48 0 0 0 0-96M50 5a45 45 0 0 1 0 90a45 45 0 0 1 0-90' fill='none' stroke='%23333' stroke-width='2'/><path d='M50 2v96M2 50h96M10 20q40 15 80 0M10 80q40-15 80 0M20 10q15 40 0 80M80 10q-15 40 0 80' fill='none' stroke='%23333' stroke-width='2.5'/></svg>",
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