# Claude Code Development Guide

This document provides guidance for developing Groundhopper Pro using Claude Code.

## Quick Start

```bash
# Clone and enter the project
git clone https://github.com/yourusername/groundhopper-pro.git
cd groundhopper-pro

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

## Project Overview

**Groundhopper Pro** is a European football stadium tracking app built with:
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet / React-Leaflet
- **Styling**: Tailwind CSS
- **State**: Zustand

## Common Development Tasks

### Adding a New Stadium

```typescript
// In src/lib/supabase/queries.ts
export async function addStadium(stadium: StadiumInsert) {
  const { data, error } = await supabase
    .from('stadiums')
    .insert(stadium)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

Ask Claude Code:
> "Add a new stadium called 'De Kuip' in Rotterdam, Netherlands with coordinates 51.8939, 4.5231 and capacity 51117"

### Creating Components

When creating components, follow this structure:

```typescript
// src/components/stadium/stadium-card.tsx
'use client';

import { Stadium } from '@/types/database';
import { cn } from '@/lib/utils';

interface StadiumCardProps {
  stadium: Stadium;
  className?: string;
  onClick?: () => void;
}

export function StadiumCard({ stadium, className, onClick }: StadiumCardProps) {
  return (
    <div 
      className={cn("rounded-xl p-4 bg-card", className)}
      onClick={onClick}
    >
      {/* Component content */}
    </div>
  );
}
```

### Working with the Map

The map uses React-Leaflet. Key files:
- `src/components/map/stadium-map.tsx` - Main map component
- `src/components/map/stadium-marker.tsx` - Individual markers
- `src/components/map/map-controls.tsx` - Zoom, filters, etc.

```typescript
// Example: Add clustering to map
import MarkerClusterGroup from 'react-leaflet-markercluster';

<MarkerClusterGroup>
  {stadiums.map(stadium => (
    <StadiumMarker key={stadium.id} stadium={stadium} />
  ))}
</MarkerClusterGroup>
```

### Database Queries

All database queries go through Supabase. Use the typed client:

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Fetch stadiums with filters
const { data: stadiums } = await supabase
  .from('stadiums')
  .select(`
    *,
    club:clubs(*),
    country:countries(*)
  `)
  .eq('country_id', countryId)
  .order('name');
```

### API Routes

API routes are in `src/app/api/`. Example:

```typescript
// src/app/api/stadiums/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  
  const country = searchParams.get('country');
  
  let query = supabase.from('stadiums').select('*');
  if (country) query = query.eq('country_id', country);
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}
```

## File Structure Reference

```
src/
├── app/                      # Next.js pages
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (main)/              # Main app pages
│   │   ├── page.tsx         # Home/Map view
│   │   ├── stadiums/        # Stadium pages
│   │   ├── clubs/           # Club pages
│   │   ├── trips/           # Trip planning
│   │   └── stats/           # Statistics
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI (button, input, etc.)
│   ├── map/                 # Map components
│   ├── stadium/             # Stadium-related
│   ├── club/                # Club-related
│   └── layout/              # Header, sidebar, etc.
├── lib/                     # Utilities
│   ├── supabase/           # Supabase client & queries
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Helper functions
└── types/                   # TypeScript types
```

## Supabase Schema Quick Reference

### Main Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `countries` | Country data | name, code, flag_emoji |
| `leagues` | Football leagues | name, country_id, division |
| `clubs` | Football clubs | name, country_id, crest_url |
| `stadiums` | Stadiums | name, latitude, longitude, capacity |
| `profiles` | User profiles | username, avatar_url, preferred_theme |
| `visits` | Stadium visits | user_id, stadium_id, visit_date |
| `trips` | Trip plans | user_id, name, start_date, end_date |

### Key Relationships

- `stadiums.club_id` → `clubs.id`
- `clubs.country_id` → `countries.id`
- `clubs.current_league_id` → `leagues.id`
- `visits.stadium_id` → `stadiums.id`
- `visits.user_id` → `profiles.id`

## Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes. For complex styles, use `cn()`:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "rounded-xl p-4",
  isActive && "bg-green-500",
  className
)} />
```

### Theme Support

The app supports light/dark themes. Use semantic classes:

```typescript
// ✓ Good - works with both themes
className="bg-card text-card-foreground"
className="bg-background text-foreground"
className="text-muted-foreground"

// ✗ Bad - hardcoded colors
className="bg-white text-black"
```

### Division Colors

Consistent colors for league divisions:

```typescript
const divisionColors = {
  1: 'bg-red-500',    // 1st division
  2: 'bg-blue-500',   // 2nd division
  3: 'bg-yellow-500', // 3rd division
  4: 'bg-purple-500', // 4th division
};
```

## Testing Prompts for Claude Code

Here are some example prompts you can use:

### Feature Development
> "Create a component that shows the nearest 5 stadiums to a given location"

> "Add a form to log a stadium visit with date, match details, and photo upload"

> "Implement a trip planner that calculates the route between selected stadiums"

### Bug Fixes
> "The map markers aren't showing the correct division colors. Fix this."

> "The visit form doesn't save the rating. Check the database insert."

### UI Improvements
> "Make the stadium cards more visually appealing with hover effects"

> "Add loading skeletons to the stadium list"

### Data Operations
> "Create a script to import stadiums from a CSV file"

> "Add a backup/export feature that downloads all user data as JSON"

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server-side)

Optional:
- `NEXT_PUBLIC_MAPBOX_TOKEN` - For Mapbox tiles (better quality)
- `FOOTBALL_DATA_API_KEY` - For match data integration

## Deployment Commands

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Run database migrations
npm run db:push

# Seed database
npm run db:seed
```

## Troubleshooting

### "Module not found" errors
```bash
npm install  # Reinstall dependencies
```

### Supabase connection issues
1. Check `.env.local` has correct values
2. Verify RLS policies aren't blocking requests
3. Check Supabase dashboard for errors

### Map not loading
1. Ensure Leaflet CSS is imported
2. Check for SSR issues (maps must be client-side)
3. Verify coordinates are valid numbers

### Type errors
```bash
# Regenerate Supabase types
npm run db:types
```

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React-Leaflet Docs](https://react-leaflet.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
