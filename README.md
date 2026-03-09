# ⚽ Groundhopper Pro

**The Ultimate European Stadium Tracker**

A modern, feature-rich web application for football fans who love visiting stadiums across Europe. Track your visits, plan trips, collect memories, and discover the rich history of European football grounds.

## ✨ Features

### 🗺️ Interactive Map
- Real-time stadium locations across 40+ European countries
- Filter by country, division, visited status
- Satellite and street view toggle
- Cluster view for dense areas

### 🏟️ Stadium Profiles
- Stadium photos (exterior, aerial, interior)
- Capacity, construction year, renovations
- Club history and founding date
- Historical facts and notable matches
- Home/away/European kit displays
- Club crest and colours

### 📸 Personal Collection
- Mark stadiums as visited with date
- Upload your own photos
- Add scanned tickets and programmes
- Personal notes and memories
- Rate your experience (1-5 stars)

### 🧳 Trip Planning
- Create and manage stadium trips
- Multi-stadium route optimisation
- Transport recommendations
- Local tips (pubs, restaurants, fanshops)
- Weather forecasts
- Match calendar integration

### 📊 Statistics & Achievements
- Stadiums visited per country/league
- Distance travelled per season
- Seasonal progress tracking
- Unlockable badges and achievements
- Compare with friends (optional)

### 🌙 Theming
- Light/dark mode toggle
- Stadium floodlight icon for theme switch

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Maps**: Leaflet + OpenStreetMap / Mapbox
- **Styling**: Tailwind CSS
- **File Storage**: Supabase Storage
- **Deployment**: Vercel / Netlify
- **Type Safety**: TypeScript + Zod

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free tier works)
- Mapbox token (optional, free tier: 50k loads/month)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/groundhopper-pro.git
cd groundhopper-pro
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`

### 3. Database Setup

```bash
npx supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
groundhopper-pro/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (main)/             # Main app pages
│   │   │   ├── map/            # Interactive map view
│   │   │   ├── stadiums/       # Stadium listings & details
│   │   │   ├── trips/          # Trip planning
│   │   │   ├── profile/        # User profile & stats
│   │   │   └── settings/       # App settings
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── map/                # Map components
│   │   ├── stadium/            # Stadium cards, details
│   │   ├── trip/               # Trip planning
│   │   ├── ui/                 # Shared UI components
│   │   └── theme/              # Theme toggle (floodlight!)
│   ├── lib/
│   │   ├── supabase/           # Supabase client & queries
│   │   └── utils/              # Helper functions
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript types
├── supabase/
│   ├── migrations/             # SQL migrations
│   └── seed.sql                # Initial data
└── public/                     # Static assets
```

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/groundhopper-pro)

### Netlify

```bash
npm run build
netlify deploy --prod
```

## 🔄 Backup & Export

Export your personal data:
```bash
npm run export:data
```

## 📄 License

MIT License

---

**Happy Groundhopping! ⚽🏟️**
