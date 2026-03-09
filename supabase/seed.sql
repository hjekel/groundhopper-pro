-- Groundhopper Pro Seed Data
-- Sample data for European countries, leagues, and stadiums

-- ============================================
-- COUNTRIES
-- ============================================

INSERT INTO countries (name, code, code_2, flag_emoji) VALUES
('Netherlands', 'NLD', 'NL', '🇳🇱'),
('Germany', 'DEU', 'DE', '🇩🇪'),
('England', 'ENG', 'GB', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
('Spain', 'ESP', 'ES', '🇪🇸'),
('Italy', 'ITA', 'IT', '🇮🇹'),
('France', 'FRA', 'FR', '🇫🇷'),
('Portugal', 'PRT', 'PT', '🇵🇹'),
('Belgium', 'BEL', 'BE', '🇧🇪'),
('Austria', 'AUT', 'AT', '🇦🇹'),
('Switzerland', 'CHE', 'CH', '🇨🇭'),
('Scotland', 'SCO', 'GB', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'),
('Wales', 'WAL', 'GB', '🏴󠁧󠁢󠁷󠁬󠁳󠁿'),
('Ireland', 'IRL', 'IE', '🇮🇪'),
('Denmark', 'DNK', 'DK', '🇩🇰'),
('Sweden', 'SWE', 'SE', '🇸🇪'),
('Norway', 'NOR', 'NO', '🇳🇴'),
('Finland', 'FIN', 'FI', '🇫🇮'),
('Poland', 'POL', 'PL', '🇵🇱'),
('Czech Republic', 'CZE', 'CZ', '🇨🇿'),
('Greece', 'GRC', 'GR', '🇬🇷'),
('Turkey', 'TUR', 'TR', '🇹🇷'),
('Russia', 'RUS', 'RU', '🇷🇺'),
('Ukraine', 'UKR', 'UA', '🇺🇦'),
('Croatia', 'HRV', 'HR', '🇭🇷'),
('Serbia', 'SRB', 'RS', '🇷🇸'),
('Hungary', 'HUN', 'HU', '🇭🇺'),
('Romania', 'ROU', 'RO', '🇷🇴'),
('Bulgaria', 'BGR', 'BG', '🇧🇬'),
('Slovenia', 'SVN', 'SI', '🇸🇮'),
('Slovakia', 'SVK', 'SK', '🇸🇰'),
('Iceland', 'ISL', 'IS', '🇮🇸'),
('Cyprus', 'CYP', 'CY', '🇨🇾'),
('Malta', 'MLT', 'MT', '🇲🇹'),
('Luxembourg', 'LUX', 'LU', '🇱🇺'),
('Estonia', 'EST', 'EE', '🇪🇪'),
('Latvia', 'LVA', 'LV', '🇱🇻'),
('Lithuania', 'LTU', 'LT', '🇱🇹');

-- ============================================
-- LEAGUES (sample - top divisions)
-- ============================================

INSERT INTO leagues (country_id, name, short_name, division, league_type, is_active)
SELECT c.id, 'Eredivisie', 'ERE', 1, 'domestic', true FROM countries c WHERE c.code = 'NLD'
UNION ALL
SELECT c.id, 'Eerste Divisie', 'ED', 2, 'domestic', true FROM countries c WHERE c.code = 'NLD'
UNION ALL
SELECT c.id, 'Tweede Divisie', 'TD', 3, 'domestic', true FROM countries c WHERE c.code = 'NLD'
UNION ALL
SELECT c.id, 'Bundesliga', 'BL', 1, 'domestic', true FROM countries c WHERE c.code = 'DEU'
UNION ALL
SELECT c.id, '2. Bundesliga', '2BL', 2, 'domestic', true FROM countries c WHERE c.code = 'DEU'
UNION ALL
SELECT c.id, '3. Liga', '3L', 3, 'domestic', true FROM countries c WHERE c.code = 'DEU'
UNION ALL
SELECT c.id, 'Premier League', 'PL', 1, 'domestic', true FROM countries c WHERE c.code = 'ENG'
UNION ALL
SELECT c.id, 'Championship', 'CH', 2, 'domestic', true FROM countries c WHERE c.code = 'ENG'
UNION ALL
SELECT c.id, 'League One', 'L1', 3, 'domestic', true FROM countries c WHERE c.code = 'ENG'
UNION ALL
SELECT c.id, 'League Two', 'L2', 4, 'domestic', true FROM countries c WHERE c.code = 'ENG'
UNION ALL
SELECT c.id, 'La Liga', 'LL', 1, 'domestic', true FROM countries c WHERE c.code = 'ESP'
UNION ALL
SELECT c.id, 'La Liga 2', 'LL2', 2, 'domestic', true FROM countries c WHERE c.code = 'ESP'
UNION ALL
SELECT c.id, 'Serie A', 'SA', 1, 'domestic', true FROM countries c WHERE c.code = 'ITA'
UNION ALL
SELECT c.id, 'Serie B', 'SB', 2, 'domestic', true FROM countries c WHERE c.code = 'ITA'
UNION ALL
SELECT c.id, 'Ligue 1', 'L1', 1, 'domestic', true FROM countries c WHERE c.code = 'FRA'
UNION ALL
SELECT c.id, 'Ligue 2', 'L2', 2, 'domestic', true FROM countries c WHERE c.code = 'FRA'
UNION ALL
SELECT c.id, 'Primeira Liga', 'PL', 1, 'domestic', true FROM countries c WHERE c.code = 'PRT'
UNION ALL
SELECT c.id, 'Pro League', 'JPL', 1, 'domestic', true FROM countries c WHERE c.code = 'BEL'
UNION ALL
SELECT c.id, 'Scottish Premiership', 'SP', 1, 'domestic', true FROM countries c WHERE c.code_2 = 'GB' AND c.name = 'Scotland';

-- ============================================
-- CLUBS (sample selection)
-- ============================================

-- Netherlands
INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Ajax', 'AJX', c.id, l.id, 1900, 'Amsterdam', 'De Godenzonen', '#D2122E', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'NLD' AND l.short_name = 'ERE';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Feyenoord', 'FEY', c.id, l.id, 1908, 'Rotterdam', 'Het Legioen', '#EE0000', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'NLD' AND l.short_name = 'ERE';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'PSV', 'PSV', c.id, l.id, 1913, 'Eindhoven', 'Boeren', '#ED1C24', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'NLD' AND l.short_name = 'ERE';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'AZ', 'AZ', c.id, l.id, 1967, 'Alkmaar', 'Kaaskoppen', '#ED1C24', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'NLD' AND l.short_name = 'ERE';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'FC Twente', 'TWE', c.id, l.id, 1965, 'Enschede', 'Tukkers', '#E00034', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'NLD' AND l.short_name = 'ERE';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'FC Utrecht', 'UTR', c.id, l.id, 1970, 'Utrecht', 'Utreg', '#D00027', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'NLD' AND l.short_name = 'ERE';

-- Germany
INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Bayern München', 'FCB', c.id, l.id, 1900, 'Munich', 'Die Bayern', '#DC052D', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'DEU' AND l.short_name = 'BL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Borussia Dortmund', 'BVB', c.id, l.id, 1909, 'Dortmund', 'Die Schwarzgelben', '#FDE100', '#000000'
FROM countries c, leagues l WHERE c.code = 'DEU' AND l.short_name = 'BL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'RB Leipzig', 'RBL', c.id, l.id, 2009, 'Leipzig', 'Die Roten Bullen', '#DD0741', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'DEU' AND l.short_name = 'BL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Bayer Leverkusen', 'B04', c.id, l.id, 1904, 'Leverkusen', 'Die Werkself', '#E32221', '#000000'
FROM countries c, leagues l WHERE c.code = 'DEU' AND l.short_name = 'BL';

-- England
INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Manchester United', 'MUN', c.id, l.id, 1878, 'Manchester', 'Red Devils', '#DA291C', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ENG' AND l.short_name = 'PL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Liverpool', 'LIV', c.id, l.id, 1892, 'Liverpool', 'The Reds', '#C8102E', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ENG' AND l.short_name = 'PL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Arsenal', 'ARS', c.id, l.id, 1886, 'London', 'Gunners', '#EF0107', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ENG' AND l.short_name = 'PL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Chelsea', 'CHE', c.id, l.id, 1905, 'London', 'The Blues', '#034694', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ENG' AND l.short_name = 'PL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Manchester City', 'MCI', c.id, l.id, 1880, 'Manchester', 'Citizens', '#6CABDD', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ENG' AND l.short_name = 'PL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Tottenham Hotspur', 'TOT', c.id, l.id, 1882, 'London', 'Spurs', '#132257', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ENG' AND l.short_name = 'PL';

-- Spain
INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'FC Barcelona', 'BAR', c.id, l.id, 1899, 'Barcelona', 'Blaugrana', '#004D98', '#A50044'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Real Madrid', 'RMA', c.id, l.id, 1902, 'Madrid', 'Los Blancos', '#FFFFFF', '#FEBE10'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LL';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Atlético Madrid', 'ATM', c.id, l.id, 1903, 'Madrid', 'Los Colchoneros', '#CB3524', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LL';

-- Italy
INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Juventus', 'JUV', c.id, l.id, 1897, 'Turin', 'La Vecchia Signora', '#000000', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SA';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'AC Milan', 'MIL', c.id, l.id, 1899, 'Milan', 'Rossoneri', '#FB090B', '#000000'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SA';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Inter Milan', 'INT', c.id, l.id, 1908, 'Milan', 'Nerazzurri', '#0068A8', '#000000'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SA';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'AS Roma', 'ROM', c.id, l.id, 1927, 'Rome', 'Giallorossi', '#8E1F2F', '#F0BC42'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SA';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'SSC Napoli', 'NAP', c.id, l.id, 1926, 'Naples', 'Partenopei', '#12A0D7', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SA';

-- France  
INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Paris Saint-Germain', 'PSG', c.id, l.id, 1970, 'Paris', 'Les Parisiens', '#004170', '#DA291C'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.name = 'Ligue 1';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Olympique Marseille', 'OM', c.id, l.id, 1899, 'Marseille', 'Les Phocéens', '#2FAEE0', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.name = 'Ligue 1';

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Olympique Lyon', 'OL', c.id, l.id, 1950, 'Lyon', 'Les Gones', '#1D4289', '#ED1C24'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.name = 'Ligue 1';

-- ============================================
-- STADIUMS
-- ============================================

-- Netherlands
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Johan Cruijff Arena', cl.id, c.id, 'Amsterdam', 'ArenA Boulevard 1, 1101 AX Amsterdam', 52.3142, 4.9419, 55500, 1996, 2018, 'grass',
'Home of Ajax. Hosted 1998 Champions League Final, Euro 2000 matches, 2013 Europa League Final. Named after Johan Cruijff since 2018.'
FROM clubs cl, countries c WHERE cl.short_name = 'AJX' AND c.code = 'NLD';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'De Kuip', cl.id, c.id, 'Rotterdam', 'Van Zandvlietplein 1, 3077 AA Rotterdam', 51.8939, 4.5231, 51117, 1937, 2016, 'grass',
'Officially Stadion Feijenoord. One of UEFA''s Five Star stadiums. Hosted Euro 2000 Final and 1972 European Championship Final. Iconic Dutch stadium with legendary atmosphere.'
FROM clubs cl, countries c WHERE cl.short_name = 'FEY' AND c.code = 'NLD';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Philips Stadion', cl.id, c.id, 'Eindhoven', 'Frederiklaan 10, 5616 NH Eindhoven', 51.4417, 5.4675, 35000, 1913, 2022, 'grass',
'Home of PSV. Hosted many European nights including 1988 European Cup semi-final. Named after electronics company Philips who founded PSV.'
FROM clubs cl, countries c WHERE cl.short_name = 'PSV' AND c.code = 'NLD';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'AFAS Stadion', cl.id, c.id, 'Alkmaar', 'Stadionweg 1, 1812 NC Alkmaar', 52.6128, 4.7408, 17023, 2006, NULL, 'grass',
'Modern stadium that replaced the old Alkmaarderhout. Part of the roof collapsed in 2019 but was rebuilt.'
FROM clubs cl, countries c WHERE cl.short_name = 'AZ' AND c.code = 'NLD';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'De Grolsch Veste', cl.id, c.id, 'Enschede', 'Colosseum 65, 7521 PP Enschede', 52.2367, 6.8378, 30205, 1998, 2008, 'grass',
'Named after local brewery Grolsch. Hosted FC Twente''s only Eredivisie title celebrations in 2010.'
FROM clubs cl, countries c WHERE cl.short_name = 'TWE' AND c.code = 'NLD';

-- Germany
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Allianz Arena', cl.id, c.id, 'Munich', 'Werner-Heisenberg-Allee 25, 80939 München', 48.2188, 11.6247, 75024, 2005, 2018, 'grass',
'Iconic illuminated facade stadium. Hosted 2012 Champions League Final and Euro 2020 matches. Originally shared with 1860 Munich.'
FROM clubs cl, countries c WHERE cl.short_name = 'FCB' AND c.code = 'DEU';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Signal Iduna Park', cl.id, c.id, 'Dortmund', 'Strobelallee 50, 44139 Dortmund', 51.4926, 7.4518, 81365, 1974, 2013, 'grass',
'Largest stadium in Germany. Famous Yellow Wall (Südtribüne) holds 25,000 standing fans - largest terrace in world football. Hosted 2006 World Cup matches.'
FROM clubs cl, countries c WHERE cl.short_name = 'BVB' AND c.code = 'DEU';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Red Bull Arena', cl.id, c.id, 'Leipzig', 'Am Sportforum 3, 04105 Leipzig', 51.3459, 12.3486, 47069, 2004, 2021, 'grass',
'Built on site of former Zentralstadion. Hosted 2006 World Cup matches as Zentralstadion. Modern arena rebuilt for RB Leipzig.'
FROM clubs cl, countries c WHERE cl.short_name = 'RBL' AND c.code = 'DEU';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'BayArena', cl.id, c.id, 'Leverkusen', 'Bismarckstraße 122-124, 51373 Leverkusen', 51.0384, 7.0022, 30210, 1958, 2009, 'grass',
'Home of Bayer Leverkusen since 1958. Completely rebuilt between 1997-2009 into modern arena.'
FROM clubs cl, countries c WHERE cl.short_name = 'B04' AND c.code = 'DEU';

-- England
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Old Trafford', cl.id, c.id, 'Manchester', 'Sir Matt Busby Way, Old Trafford, M16 0RA', 53.4631, -2.2913, 74310, 1910, 2006, 'grass',
'Theatre of Dreams. Largest club stadium in UK. Hosted 1966 World Cup, Euro 96, 2003 Champions League Final. Home of Man United since 1910.'
FROM clubs cl, countries c WHERE cl.short_name = 'MUN' AND c.code = 'ENG';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Anfield', cl.id, c.id, 'Liverpool', 'Anfield Road, Liverpool, L4 0TH', 53.4308, -2.9608, 61276, 1884, 2023, 'grass',
'One of the most iconic stadiums in football. Famous Kop end and "You''ll Never Walk Alone". Hosted European nights that defined Liverpool''s history.'
FROM clubs cl, countries c WHERE cl.short_name = 'LIV' AND c.code = 'ENG';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Emirates Stadium', cl.id, c.id, 'London', 'Hornsey Road, London, N7 7AJ', 51.5549, -0.1084, 60704, 2006, NULL, 'grass',
'Modern arena that replaced Highbury. One of the most expensive stadiums ever built. Named after airline sponsor Emirates.'
FROM clubs cl, countries c WHERE cl.short_name = 'ARS' AND c.code = 'ENG';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Stamford Bridge', cl.id, c.id, 'London', 'Fulham Road, London, SW6 1HS', 51.4817, -0.1910, 40343, 1877, 2001, 'grass',
'Chelsea''s home since 1905. Originally hosted athletics. Located in wealthy Fulham area. Hosted FA Cup finals before Wembley.'
FROM clubs cl, countries c WHERE cl.short_name = 'CHE' AND c.code = 'ENG';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Etihad Stadium', cl.id, c.id, 'Manchester', 'Ashton New Road, Manchester, M11 3FF', 53.4831, -2.2004, 53400, 2002, 2015, 'grass',
'Built for 2002 Commonwealth Games, became City''s home in 2003. Witnessed City''s transformation into Premier League champions.'
FROM clubs cl, countries c WHERE cl.short_name = 'MCI' AND c.code = 'ENG';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Tottenham Hotspur Stadium', cl.id, c.id, 'London', '782 High Road, London, N17 0BX', 53.4831, -2.2004, 62850, 2019, NULL, 'grass',
'State-of-the-art stadium with retractable pitch for NFL games. First stadium with an in-bowl microbrewery. Replaced historic White Hart Lane.'
FROM clubs cl, countries c WHERE cl.short_name = 'TOT' AND c.code = 'ENG';

-- Spain
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Spotify Camp Nou', cl.id, c.id, 'Barcelona', 'C. d''Arístides Maillol, 12, 08028 Barcelona', 41.3809, 2.1228, 99354, 1957, 2023, 'grass',
'Largest stadium in Europe. Hosted 1992 Olympics opening ceremony, 1982 and 1999 Champions League Finals. Currently being renovated with roof addition.'
FROM clubs cl, countries c WHERE cl.short_name = 'BAR' AND c.code = 'ESP';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Santiago Bernabéu', cl.id, c.id, 'Madrid', 'Av. de Concha Espina, 1, 28036 Madrid', 40.4531, -3.6883, 81044, 1947, 2023, 'grass',
'Iconic Real Madrid home. Hosted 4 European Cup/Champions League finals, 1982 World Cup Final. Currently being rebuilt with retractable roof and pitch.'
FROM clubs cl, countries c WHERE cl.short_name = 'RMA' AND c.code = 'ESP';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Cívitas Metropolitano', cl.id, c.id, 'Madrid', 'Av. de Luis Aragonés, 4, 28022 Madrid', 40.4362, -3.5995, 70460, 2017, NULL, 'grass',
'Replaced Vicente Calderón as Atlético''s home. Hosted 2019 Champions League Final. Built on site of old Estadio La Peineta.'
FROM clubs cl, countries c WHERE cl.short_name = 'ATM' AND c.code = 'ESP';

-- Italy
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Allianz Stadium', cl.id, c.id, 'Turin', 'Corso Gaetano Scirea, 50, 10151 Torino', 45.1096, 7.6413, 41507, 2011, NULL, 'grass',
'First stadium owned by a Serie A club. Replaced Stadio delle Alpi. Built specifically for football with steep stands close to pitch.'
FROM clubs cl, countries c WHERE cl.short_name = 'JUV' AND c.code = 'ITA';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'San Siro', cl.id, c.id, 'Milan', 'Piazzale Angelo Moratti, 20151 Milano', 45.4781, 9.1240, 75923, 1926, 1990, 'grass',
'Shared by AC Milan and Inter. Officially Giuseppe Meazza. Hosted 1990 World Cup opening, 4 European Cup/Champions League finals. One of football''s cathedrals.'
FROM clubs cl, countries c WHERE cl.short_name = 'MIL' AND c.code = 'ITA';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Stadio Olimpico', cl.id, c.id, 'Rome', 'Viale dei Gladiatori, 00135 Roma', 41.9340, 12.4547, 70634, 1937, 1990, 'grass',
'Shared by Roma and Lazio. Hosted 1960 Olympics, 1990 World Cup Final, 2 European Championship finals, numerous European finals.'
FROM clubs cl, countries c WHERE cl.short_name = 'ROM' AND c.code = 'ITA';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Stadio Diego Armando Maradona', cl.id, c.id, 'Naples', 'Piazzale Vincenzo Tecchio, 80125 Napoli', 40.8280, 14.1930, 54726, 1959, 2019, 'grass',
'Renamed after Maradona in 2020. Witnessed Napoli''s greatest era under Diego. Hosted 1990 World Cup matches. Passionate atmosphere.'
FROM clubs cl, countries c WHERE cl.short_name = 'NAP' AND c.code = 'ITA';

-- France
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Parc des Princes', cl.id, c.id, 'Paris', '24 Rue du Commandant Guilbaud, 75016 Paris', 48.8414, 2.2530, 47929, 1972, 2016, 'grass',
'PSG''s fortress since 1974. Hosted 1984 European Championship Final, 1998 World Cup matches. Known for intense atmosphere in night matches.'
FROM clubs cl, countries c WHERE cl.short_name = 'PSG' AND c.code = 'FRA';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Vélodrome', cl.id, c.id, 'Marseille', '3 Boulevard Michelet, 13008 Marseille', 43.2697, 5.3958, 67394, 1937, 2014, 'grass',
'One of most intimidating stadiums in Europe. Hosted 1998 World Cup semi-final, Euro 2016 matches. Complete rebuild for Euro 2016 added iconic roof.'
FROM clubs cl, countries c WHERE cl.short_name = 'OM' AND c.code = 'FRA';

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year, renovated_year, surface, notable_events)
SELECT 'Groupama Stadium', cl.id, c.id, 'Lyon', '10 Avenue Simone Veil, 69150 Décines-Charpieu', 45.7653, 4.9822, 59186, 2016, NULL, 'grass',
'Modern stadium that replaced Gerland. Hosted 2018 Europa League Final, Women''s World Cup 2019 Final. State-of-the-art facilities.'
FROM clubs cl, countries c WHERE cl.short_name = 'OL' AND c.code = 'FRA';

-- ============================================
-- ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (code, name, description, icon, requirement_type, requirement_value, rarity, points) VALUES
('first_stadium', 'First Steps', 'Visit your first stadium', '👟', 'stadiums_count', 1, 'common', 5),
('ten_stadiums', 'Groundhopper', 'Visit 10 different stadiums', '🏟️', 'stadiums_count', 10, 'common', 20),
('fifty_stadiums', 'Stadium Collector', 'Visit 50 different stadiums', '🎯', 'stadiums_count', 50, 'uncommon', 50),
('hundred_stadiums', 'Century Club', 'Visit 100 different stadiums', '💯', 'stadiums_count', 100, 'rare', 100),
('two_fifty_stadiums', 'Stadium Obsessed', 'Visit 250 different stadiums', '🤯', 'stadiums_count', 250, 'epic', 250),
('five_hundred_stadiums', 'Legend', 'Visit 500 different stadiums', '👑', 'stadiums_count', 500, 'legendary', 500),

('three_countries', 'Border Hopper', 'Visit stadiums in 3 different countries', '🌍', 'countries_count', 3, 'common', 15),
('ten_countries', 'European Explorer', 'Visit stadiums in 10 different countries', '✈️', 'countries_count', 10, 'uncommon', 40),
('twenty_countries', 'Continental', 'Visit stadiums in 20 different countries', '🗺️', 'countries_count', 20, 'rare', 80),

('eredivisie_complete', 'Dutch Master', 'Visit all Eredivisie stadiums', '🇳🇱', 'league_complete', NULL, 'epic', 150),
('bundesliga_complete', 'German Engineering', 'Visit all Bundesliga stadiums', '🇩🇪', 'league_complete', NULL, 'epic', 150),
('premier_league_complete', 'English Expert', 'Visit all Premier League stadiums', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'league_complete', NULL, 'epic', 150),
('la_liga_complete', 'Spanish Conquest', 'Visit all La Liga stadiums', '🇪🇸', 'league_complete', NULL, 'epic', 150),
('serie_a_complete', 'Italian Job', 'Visit all Serie A stadiums', '🇮🇹', 'league_complete', NULL, 'epic', 150),

('weekend_warrior', 'Weekend Warrior', 'Visit 3 stadiums in one weekend', '⚡', 'special', NULL, 'uncommon', 30),
('same_day_double', 'Double Header', 'Visit 2 stadiums on the same day', '✌️', 'special', NULL, 'uncommon', 25),
('derby_day', 'Derby Day', 'Visit both stadiums of a city rivalry', '🔥', 'special', NULL, 'rare', 50),
('champions_venue', 'European Royalty', 'Visit a Champions League Final venue', '⭐', 'special', NULL, 'rare', 40),
('world_cup_venue', 'World Stage', 'Visit a World Cup Final venue', '🏆', 'special', NULL, 'rare', 50);
