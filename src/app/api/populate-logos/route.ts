import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// TheSportsDB free API - no key needed
async function fetchLogoFromSportsDB(clubName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(clubName)}`,
      { next: { revalidate: 86400 } }
    );
    const data = await response.json();
    if (data.teams && data.teams.length > 0) {
      // Try to find the best match (football/soccer team)
      const footballTeam = data.teams.find(
        (t: any) => t.strSport === 'Soccer' || t.strSport === 'Football'
      ) || data.teams[0];
      return footballTeam.strBadge || footballTeam.strTeamBadge || null;
    }
    return null;
  } catch {
    return null;
  }
}

// Name mappings for clubs that don't match exactly in TheSportsDB
const NAME_MAPPINGS: Record<string, string> = {
  'sc Heerenveen': 'SC Heerenveen',
  'Go Ahead Eagles': 'Go Ahead Eagles',
  'NEC': 'NEC Nijmegen',
  'AZ': 'AZ Alkmaar',
  'NAC Breda': 'NAC Breda',
  'Bayern Munich': 'Bayern Munich',
  '1. FC Köln': 'FC Cologne',
  '1. FC Heidenheim': 'Heidenheim',
  '1. FC Union Berlin': 'Union Berlin',
  'VfB Stuttgart': 'VfB Stuttgart',
  'VfL Wolfsburg': 'VfL Wolfsburg',
  'VfL Bochum': 'VfL Bochum',
  'RB Leipzig': 'RB Leipzig',
  'TSG Hoffenheim': 'TSG Hoffenheim',
  'Brighton & Hove Albion': 'Brighton',
  'Wolverhampton Wanderers': 'Wolverhampton Wanderers',
  'Nottingham Forest': 'Nottingham Forest',
  'ACF Fiorentina': 'Fiorentina',
  'Athletic Club': 'Athletic Bilbao',
  'Atlético Madrid': 'Atletico Madrid',
};

export async function GET() {
  // Get all clubs without a crest_url
  const { data: clubs, error } = await supabase
    .from('clubs')
    .select('id, name, crest_url')
    .is('crest_url', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { name: string; logo: string | null; status: string }[] = [];

  for (const club of clubs || []) {
    const searchName = NAME_MAPPINGS[club.name] || club.name;
    const logo = await fetchLogoFromSportsDB(searchName);

    if (logo) {
      await supabase
        .from('clubs')
        .update({ crest_url: logo })
        .eq('id', club.id);
      results.push({ name: club.name, logo, status: 'updated' });
    } else {
      results.push({ name: club.name, logo: null, status: 'not_found' });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return NextResponse.json({
    total: clubs?.length || 0,
    updated: results.filter(r => r.status === 'updated').length,
    not_found: results.filter(r => r.status === 'not_found').length,
    details: results
  });
}
