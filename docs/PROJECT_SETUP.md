# Groundhopper Pro - Complete Project Setup Guide

## 🎯 Project Overview

**Groundhopper Pro** is a comprehensive European football stadium tracking application for stadium collectors ("groundhoppers"). Track your visits, plan trips, discover stadium history, and connect with fellow enthusiasts.

### Core Features
- 🗺️ Interactive map with 1000+ European stadiums
- ✅ Personal visit tracking with photos and notes
- 🧳 Trip planning with route optimisation
- 📊 Statistics and progress tracking
- 🏆 Achievements and badges
- 🌙 Dark/Light mode (stadium lights toggle!)
- 📱 Mobile-first, PWA support
- 💾 Backup/export functionality

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 14 (App Router) | Best DX, Vercel deployment, SSR |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| **Maps** | Leaflet + React-Leaflet | Free, open-source, great for markers |
| **Database** | Supabase (PostgreSQL) | Free tier, realtime, auth, storage |
| **Auth** | Supabase Auth | Simple, secure, social logins |
| **Storage** | Supabase Storage | Photos, scanned notes |
| **Deployment** | Vercel | Perfect Next.js integration |
| **AI Features** | Claude API | Trip advice, stadium facts |

---

## 📁 Project Structure

```
groundhopper-pro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── map/           # Main map view
│   │   │   ├── clubs/         # Club directory
│   │   │   ├── trips/         # Trip planning
│   │   │   ├── stats/         # Statistics
│   │   │   └── profile/       # User profile
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── map/               # Map-related components
│   │   ├── clubs/             # Club cards, details
│   │   ├── trips/             # Trip planning UI
│   │   └── layout/            # Header, sidebar, etc.
│   ├── lib/
│   │   ├── supabase/          # Supabase client & helpers
│   │   ├── utils/             # Utility functions
│   │   └── constants/         # App constants
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Database schema (for reference)
├── public/
│   └── images/                # Static images
├── docs/                      # Documentation
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- Supabase account (free)
- Vercel account (free)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/groundhopper-pro.git
cd groundhopper-pro

# Install dependencies
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Claude API for AI features
ANTHROPIC_API_KEY=your_claude_api_key

# Optional: Map tiles (if using Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### 3. Database Setup

Run the SQL migrations in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration files in `/prisma/migrations/`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema Overview

See `prisma/schema.prisma` for complete schema. Key tables:

- **clubs** - All football clubs with metadata
- **stadiums** - Stadium details, capacity, coordinates
- **users** - User profiles and preferences
- **visits** - User stadium visits with photos/notes
- **trips** - Planned and completed trips
- **trip_stops** - Stops within a trip
- **photos** - User-uploaded photos
- **achievements** - Earned badges

---

## 🎨 Design System

### Colour Palette

```css
/* Dark Mode (Default) */
--background: #0a0f1a;
--surface: #151c2c;
--primary: #22c55e;      /* Green - visited */
--accent: #3b82f6;       /* Blue - planned */
--division-1: #ef4444;   /* Red */
--division-2: #3b82f6;   /* Blue */
--division-3: #eab308;   /* Yellow */
--division-4: #a855f7;   /* Purple */

/* Light Mode */
--background: #f8fafc;
--surface: #ffffff;
```

### Typography
- **Headings**: Space Grotesk (bold, modern)
- **Body**: Inter (readable, clean)
- **Mono**: JetBrains Mono (coordinates, stats)

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/ssr": "^0.1.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0"
  }
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Netlify (Alternative)

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables

---

## 📱 PWA Setup

The app is configured as a Progressive Web App:
- Installable on mobile
- Offline support for viewed stadiums
- Push notifications for trip reminders

---

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- User can only access their own data
- Photos stored in private buckets
- API routes protected with auth middleware

---

## 📈 Future Roadmap

- [ ] Social features (follow users, share visits)
- [ ] Match calendar integration
- [ ] Ticket purchase links
- [ ] AR stadium finder
- [ ] Offline mode
- [ ] Multi-language support
