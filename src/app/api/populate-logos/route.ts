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
  // Eredivisie
  'PSV': 'PSV Eindhoven',
  'sc Heerenveen': 'Heerenveen',
  'AZ': 'AZ Alkmaar',
  'NEC': 'NEC Nijmegen',
  'NAC Breda': 'NAC Breda',
  'FC Utrecht': 'FC Utrecht',
  'FC Twente': 'FC Twente',
  'FC Groningen': 'FC Groningen',
  'Almere City FC': 'Almere City',
  // Eerste Divisie / Other Dutch
  'TOP Oss': 'TOP Oss',
  'Helmond Sport': 'Helmond Sport',
  'Berchem Sport': 'Berchem Sport',
  // German
  'Bayern Munich': 'FC Bayern Munich',
  '1. FC Köln': 'FC Cologne',
  '1. FC Heidenheim': 'FC Heidenheim',
  '1. FC Union Berlin': 'Union Berlin',
  'VfB Stuttgart': 'Stuttgart',
  'VfL Wolfsburg': 'Wolfsburg',
  'VfL Bochum': 'Bochum',
  'RB Leipzig': 'RB Leipzig',
  'TSG Hoffenheim': 'Hoffenheim',
  'FSV Mainz 05': 'Mainz 05',
  'SC Freiburg': 'SC Freiburg',
  'Eintracht Frankfurt': 'Eintracht Frankfurt',
  'SV Darmstadt 98': 'SV Darmstadt',
  'Dynamo Dresden': 'Dynamo Dresden',
  'Werder Bremen': 'Werder Bremen',
  'FC Augsburg': 'FC Augsburg',
  'Borussia Mönchengladbach': 'Borussia Monchengladbach',
  // English
  'Brighton & Hove Albion': 'Brighton',
  'Wolverhampton Wanderers': 'Wolves',
  'Nottingham Forest': 'Nottingham Forest',
  'Newcastle United': 'Newcastle',
  'Ipswich Town': 'Ipswich Town',
  'Leicester City': 'Leicester City',
  'Liverpool FC': 'Liverpool',
  'West Ham United': 'West Ham',
  'Crystal Palace': 'Crystal Palace',
  'Bournemouth': 'AFC Bournemouth',
  // Spanish
  'Athletic Club': 'Athletic Bilbao',
  'Atlético Madrid': 'Atletico Madrid',
  'Real Sociedad': 'Real Sociedad',
  'Villarreal CF': 'Villarreal',
  'Valencia CF': 'Valencia',
  'Sevilla FC': 'Sevilla',
  'Real Betis': 'Real Betis',
  'Girona FC': 'Girona',
  // Italian
  'ACF Fiorentina': 'Fiorentina',
  'SSC Napoli': 'Napoli',
  'AS Roma': 'AS Roma',
  'Inter Milan': 'Inter Milan',
  'AC Milan': 'AC Milan',
  // French
  'Paris Saint-Germain': 'Paris Saint-Germain',
  'Olympique Lyonnais': 'Lyon',
  'Olympique de Marseille': 'Marseille',
  'LOSC Lille': 'Lille',
  'AS Monaco': 'AS Monaco',
  // Belgian
  'KAS Eupen': 'KAS Eupen',
  // Northern Irish
  'Glentoran FC': 'Glentoran',
  'Linfield FC': 'Linfield',
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

    // Try mapped name first, then original, then simplified
    let logo = await fetchLogoFromSportsDB(searchName);
    if (!logo && searchName !== club.name) {
      logo = await fetchLogoFromSportsDB(club.name);
    }
    if (!logo) {
      // Try without common prefixes/suffixes
      const simplified = club.name
        .replace(/^(FC |SC |SV |VfB |VfL |TSG |FSV |ACF |SSC |1\. )/i, '')
        .replace(/ (FC|CF|SC|FK)$/i, '');
      if (simplified !== club.name && simplified !== searchName) {
        logo = await fetchLogoFromSportsDB(simplified);
      }
    }

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
