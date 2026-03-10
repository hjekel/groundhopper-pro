import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Wikipedia article title mappings for clubs
const WIKI_TITLES: Record<string, string> = {
  // Eredivisie
  'Ajax': 'AFC_Ajax',
  'PSV': 'PSV_Eindhoven',
  'Feyenoord': 'Feyenoord',
  'AZ': 'AZ_Alkmaar',
  'FC Twente': 'FC_Twente',
  'FC Utrecht': 'FC_Utrecht',
  'Sparta Rotterdam': 'Sparta_Rotterdam',
  'sc Heerenveen': 'SC_Heerenveen',
  'FC Groningen': 'FC_Groningen',
  'Vitesse': 'SBV_Vitesse',
  'NEC': 'NEC_Nijmegen',
  'Go Ahead Eagles': 'Go_Ahead_Eagles',
  'PEC Zwolle': 'PEC_Zwolle',
  'Fortuna Sittard': 'Fortuna_Sittard',
  'RKC Waalwijk': 'RKC_Waalwijk',
  'Heracles Almelo': 'Heracles_Almelo',
  'Willem II': 'Willem_II_(football_club)',
  'NAC Breda': 'NAC_Breda',
  'Almere City FC': 'Almere_City_FC',
  // Eerste Divisie / Other Dutch
  'TOP Oss': 'TOP_Oss',
  'Helmond Sport': 'Helmond_Sport',
  // Premier League
  'Arsenal': 'Arsenal_F.C.',
  'Manchester City': 'Manchester_City_F.C.',
  'Manchester United': 'Manchester_United_F.C.',
  'Liverpool': 'Liverpool_F.C.',
  'Liverpool FC': 'Liverpool_F.C.',
  'Chelsea': 'Chelsea_F.C.',
  'Tottenham Hotspur': 'Tottenham_Hotspur_F.C.',
  'Newcastle United': 'Newcastle_United_F.C.',
  'Aston Villa': 'Aston_Villa_F.C.',
  'Brighton & Hove Albion': 'Brighton_%26_Hove_Albion_F.C.',
  'West Ham United': 'West_Ham_United_F.C.',
  'Bournemouth': 'AFC_Bournemouth',
  'Crystal Palace': 'Crystal_Palace_F.C.',
  'Wolverhampton Wanderers': 'Wolverhampton_Wanderers_F.C.',
  'Fulham': 'Fulham_F.C.',
  'Everton': 'Everton_F.C.',
  'Brentford': 'Brentford_F.C.',
  'Nottingham Forest': 'Nottingham_Forest_F.C.',
  'Ipswich Town': 'Ipswich_Town_F.C.',
  'Leicester City': 'Leicester_City_F.C.',
  'Southampton': 'Southampton_F.C.',
  // Bundesliga
  'Bayern Munich': 'FC_Bayern_Munich',
  'Borussia Dortmund': 'Borussia_Dortmund',
  'RB Leipzig': 'RB_Leipzig',
  'Bayer Leverkusen': 'Bayer_04_Leverkusen',
  'Eintracht Frankfurt': 'Eintracht_Frankfurt',
  'VfB Stuttgart': 'VfB_Stuttgart',
  'Borussia Mönchengladbach': 'Borussia_M%C3%B6nchengladbach',
  'SC Freiburg': 'SC_Freiburg',
  'TSG Hoffenheim': 'TSG_1899_Hoffenheim',
  'VfL Wolfsburg': 'VfL_Wolfsburg',
  '1. FC Union Berlin': '1._FC_Union_Berlin',
  'FSV Mainz 05': '1._FSV_Mainz_05',
  'Werder Bremen': 'SV_Werder_Bremen',
  'FC Augsburg': 'FC_Augsburg',
  '1. FC Heidenheim': '1._FC_Heidenheim',
  'SV Darmstadt 98': 'SV_Darmstadt_98',
  'VfL Bochum': 'VfL_Bochum',
  '1. FC Köln': '1._FC_K%C3%B6ln',
  'Dynamo Dresden': 'Dynamo_Dresden',
  // La Liga
  'FC Barcelona': 'FC_Barcelona',
  'Real Madrid': 'Real_Madrid_CF',
  'Atlético Madrid': 'Atl%C3%A9tico_Madrid',
  'Sevilla FC': 'Sevilla_FC',
  'Real Betis': 'Real_Betis',
  'Real Sociedad': 'Real_Sociedad',
  'Villarreal CF': 'Villarreal_CF',
  'Athletic Club': 'Athletic_Bilbao',
  'Valencia CF': 'Valencia_CF',
  'Girona FC': 'Girona_FC',
  // Serie A
  'Inter Milan': 'Inter_Milan',
  'AC Milan': 'AC_Milan',
  'Juventus': 'Juventus_FC',
  'SSC Napoli': 'S.S.C._Napoli',
  'AS Roma': 'AS_Roma',
  'SS Lazio': 'S.S._Lazio',
  'Atalanta': 'Atalanta_BC',
  'ACF Fiorentina': 'ACF_Fiorentina',
  // Ligue 1
  'Paris Saint-Germain': 'Paris_Saint-Germain_F.C.',
  'Olympique de Marseille': 'Olympique_de_Marseille',
  'Olympique Lyonnais': 'Olympique_Lyonnais',
  'AS Monaco': 'AS_Monaco_FC',
  'LOSC Lille': 'Lille_OSC',
  // Belgian
  'KAS Eupen': 'K.A.S._Eupen',
  'Berchem Sport': 'Berchem_Sport',
  // Northern Irish
  'Glentoran FC': 'Glentoran_F.C.',
  'Linfield FC': 'Linfield_F.C.',
};

async function fetchLogoFromWikipedia(articleTitle: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${articleTitle}&prop=pageimages&format=json&pithumbsize=200`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'GroundhopperPro/1.0 (football stadium app)' }
    });
    const data = await response.json();
    const pages = data.query?.pages;
    if (pages) {
      const page = Object.values(pages)[0] as any;
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchLogoFromSportsDB(clubName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(clubName)}`
    );
    const data = await response.json();
    if (data.teams && data.teams.length > 0) {
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

export async function GET() {
  const { data: clubs, error } = await supabase
    .from('clubs')
    .select('id, name, crest_url')
    .is('crest_url', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { name: string; logo: string | null; source: string; status: string }[] = [];

  for (const club of clubs || []) {
    let logo: string | null = null;
    let source = '';

    // 1. Try Wikipedia first (most reliable for logos)
    const wikiTitle = WIKI_TITLES[club.name];
    if (wikiTitle) {
      logo = await fetchLogoFromWikipedia(wikiTitle);
      if (logo) source = 'wikipedia';
    }

    // 2. Fallback to TheSportsDB
    if (!logo) {
      logo = await fetchLogoFromSportsDB(club.name);
      if (logo) source = 'sportsdb';
    }

    if (logo) {
      await supabase
        .from('clubs')
        .update({ crest_url: logo })
        .eq('id', club.id);
      results.push({ name: club.name, logo, source, status: 'updated' });
    } else {
      results.push({ name: club.name, logo: null, source: '', status: 'not_found' });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return NextResponse.json({
    total: clubs?.length || 0,
    updated: results.filter(r => r.status === 'updated').length,
    not_found: results.filter(r => r.status === 'not_found').length,
    details: results
  });
}
