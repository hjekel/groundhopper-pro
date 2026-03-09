-- ============================================
-- ADDITIONAL CLUBS: Complete La Liga, Serie A, Ligue 1
-- Run this AFTER the main extended-clubs-seed.sql
-- ============================================

-- ============================================
-- LA LIGA - Remaining clubs (10 more to make 20)
-- ============================================

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Celta de Vigo', 'CEL', c.id, l.id, 1923, 'Vigo', 'Os Celestes', '#8AC3EE', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Getafe CF', 'GET', c.id, l.id, 1983, 'Getafe', 'Azulones', '#004FA3', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Osasuna', 'OSA', c.id, l.id, 1920, 'Pamplona', 'Rojillos', '#D91A21', '#00205B'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'UD Las Palmas', 'LPA', c.id, l.id, 1949, 'Las Palmas', 'Pío Pío', '#FFE400', '#0033A0'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Deportivo Alavés', 'ALA', c.id, l.id, 1921, 'Vitoria-Gasteiz', 'Babazorros', '#003DA5', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'RCD Mallorca', 'MLL', c.id, l.id, 1916, 'Palma', 'Bermellones', '#E30613', '#000000'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Rayo Vallecano', 'RAY', c.id, l.id, 1924, 'Madrid', 'Franjirrojos', '#E30613', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Real Valladolid', 'VLL', c.id, l.id, 1928, 'Valladolid', 'Pucela', '#5E2D79', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'CD Leganés', 'LEG', c.id, l.id, 1928, 'Leganés', 'Pepineros', '#0033A0', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'RCD Espanyol', 'ESP', c.id, l.id, 1900, 'Barcelona', 'Periquitos', '#007FC8', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ESP' AND l.short_name = 'LAL'
ON CONFLICT DO NOTHING;

-- La Liga Stadiums (remaining)
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Abanca-Balaídos', c.id, co.id, 'Vigo', 'Av. de Balaídos, s/n, 36210 Vigo', 42.2117, -8.7397, 29000, 1928
FROM clubs c, countries co WHERE c.short_name = 'CEL' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Coliseum Alfonso Pérez', c.id, co.id, 'Getafe', 'Calle Teresa de Calcuta, s/n, 28903 Getafe', 40.3256, -3.7147, 17393, 1998
FROM clubs c, countries co WHERE c.short_name = 'GET' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'El Sadar', c.id, co.id, 'Pamplona', 'C. del Sadar, s/n, 31006 Pamplona', 42.7967, -1.6369, 23576, 1967
FROM clubs c, countries co WHERE c.short_name = 'OSA' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Estadio de Gran Canaria', c.id, co.id, 'Las Palmas', 'Fondos de Segura, s/n, 35019 Las Palmas', 28.1003, -15.4567, 32400, 2003
FROM clubs c, countries co WHERE c.short_name = 'LPA' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Mendizorrotza', c.id, co.id, 'Vitoria-Gasteiz', 'Paseo de Cervantes, 13, 01007 Vitoria-Gasteiz', 42.8372, -2.6878, 19840, 1924
FROM clubs c, countries co WHERE c.short_name = 'ALA' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Estadi Mallorca Son Moix', c.id, co.id, 'Palma', 'Camí dels Reis, s/n, 07011 Palma', 39.5903, 2.6300, 23142, 1999
FROM clubs c, countries co WHERE c.short_name = 'MLL' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Estadio de Vallecas', c.id, co.id, 'Madrid', 'C. del Payaso Fofó, s/n, 28018 Madrid', 40.3919, -3.6589, 14708, 1976
FROM clubs c, countries co WHERE c.short_name = 'RAY' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Estadio José Zorrilla', c.id, co.id, 'Valladolid', 'Av. del Mundial 82, s/n, 47014 Valladolid', 41.6444, -4.7614, 27618, 1982
FROM clubs c, countries co WHERE c.short_name = 'VLL' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Estadio Municipal de Butarque', c.id, co.id, 'Leganés', 'C. Maestro, 25, 28914 Leganés', 40.3558, -3.7608, 12454, 1998
FROM clubs c, countries co WHERE c.short_name = 'LEG' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'RCDE Stadium', c.id, co.id, 'Barcelona', 'Av. del Baix Llobregat, 100, 08940 Cornellà', 41.3481, 2.0756, 40000, 2009
FROM clubs c, countries co WHERE c.short_name = 'ESP' AND co.code = 'ESP'
ON CONFLICT DO NOTHING;

-- ============================================
-- SERIE A - Remaining clubs (12 more to make 20)
-- ============================================

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Bologna FC', 'BOL', c.id, l.id, 1909, 'Bologna', 'Rossoblù', '#1A2F48', '#A21C26'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Torino FC', 'TOR', c.id, l.id, 1906, 'Turin', 'Il Toro', '#8B0000', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Udinese Calcio', 'UDI', c.id, l.id, 1896, 'Udine', 'Zebrette', '#000000', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Genoa CFC', 'GEN', c.id, l.id, 1893, 'Genoa', 'Il Grifone', '#A50021', '#00387B'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Cagliari Calcio', 'CAG', c.id, l.id, 1920, 'Cagliari', 'Isolani', '#A51E36', '#00387B'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Hellas Verona', 'VER', c.id, l.id, 1903, 'Verona', 'Mastini', '#003366', '#FFD700'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'US Lecce', 'LEC', c.id, l.id, 1908, 'Lecce', 'Giallorossi', '#FFC300', '#D63636'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Empoli FC', 'EMP', c.id, l.id, 1920, 'Empoli', 'Azzurri', '#005EB8', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Parma Calcio', 'PAR', c.id, l.id, 1913, 'Parma', 'Crociati', '#FFFF00', '#003DA5'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Como 1907', 'COM', c.id, l.id, 1907, 'Como', 'Lariani', '#005BA9', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Venezia FC', 'VEN', c.id, l.id, 1907, 'Venice', 'Arancioneroverdi', '#FF6600', '#00452A'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'AC Monza', 'MON', c.id, l.id, 1912, 'Monza', 'Biancorossi', '#EE0000', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'ITA' AND l.short_name = 'SEA'
ON CONFLICT DO NOTHING;

-- Serie A Stadiums (remaining)
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Renato Dall''Ara', c.id, co.id, 'Bologna', 'Via Andrea Costa, 174, 40134 Bologna', 44.4922, 11.3097, 38279, 1927
FROM clubs c, countries co WHERE c.short_name = 'BOL' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Olimpico Grande Torino', c.id, co.id, 'Turin', 'Via Filadelfia, 96, 10134 Torino', 45.0419, 7.6497, 28177, 1933
FROM clubs c, countries co WHERE c.short_name = 'TOR' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Dacia Arena', c.id, co.id, 'Udine', 'Piazzale Repubblica Argentina, 3, 33100 Udine', 46.0817, 13.2000, 25144, 2016
FROM clubs c, countries co WHERE c.short_name = 'UDI' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Luigi Ferraris', c.id, co.id, 'Genoa', 'Via Giovanni De Prà, 1, 16139 Genova', 44.4164, 8.9525, 36599, 1911
FROM clubs c, countries co WHERE c.short_name = 'GEN' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Unipol Domus', c.id, co.id, 'Cagliari', 'Viale La Plaia, 09123 Cagliari', 39.2000, 9.1378, 16416, 2017
FROM clubs c, countries co WHERE c.short_name = 'CAG' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Marcantonio Bentegodi', c.id, co.id, 'Verona', 'Piazzale Olimpia, 37138 Verona', 45.4353, 10.9686, 39211, 1963
FROM clubs c, countries co WHERE c.short_name = 'VER' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Via del Mare', c.id, co.id, 'Lecce', 'Via del Mare, 73100 Lecce', 40.3594, 18.1939, 33876, 1966
FROM clubs c, countries co WHERE c.short_name = 'LEC' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Carlo Castellani', c.id, co.id, 'Empoli', 'Viale delle Olimpiadi, 50053 Empoli', 43.7264, 10.9547, 16284, 1965
FROM clubs c, countries co WHERE c.short_name = 'EMP' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Ennio Tardini', c.id, co.id, 'Parma', 'Viale Partigiani d''Italia, 1, 43121 Parma', 44.7956, 10.3381, 22352, 1923
FROM clubs c, countries co WHERE c.short_name = 'PAR' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Giuseppe Sinigaglia', c.id, co.id, 'Como', 'Viale Vittorio Veneto, 22100 Como', 45.8117, 9.0706, 13602, 1927
FROM clubs c, countries co WHERE c.short_name = 'COM' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadio Pier Luigi Penzo', c.id, co.id, 'Venice', 'Isola di Sant''Elena, 30132 Venezia', 45.4247, 12.3644, 11150, 1913
FROM clubs c, countries co WHERE c.short_name = 'VEN' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'U-Power Stadium', c.id, co.id, 'Monza', 'Via Gian Battista Stucchi, 62, 20900 Monza', 45.5831, 9.3086, 16917, 1988
FROM clubs c, countries co WHERE c.short_name = 'MON' AND co.code = 'ITA'
ON CONFLICT DO NOTHING;

-- ============================================
-- LIGUE 1 - Remaining clubs (13 more to make 18)
-- ============================================

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Stade Brestois 29', 'BRE29', c.id, l.id, 1950, 'Brest', 'Pirates', '#E30613', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'OGC Nice', 'NIC', c.id, l.id, 1904, 'Nice', 'Les Aiglons', '#000000', '#E30613'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'RC Lens', 'RCL', c.id, l.id, 1906, 'Lens', 'Sang et Or', '#FFD700', '#E30613'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Stade Rennais', 'REN', c.id, l.id, 1901, 'Rennes', 'Rouge et Noir', '#E30613', '#000000'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'RC Strasbourg', 'RCS', c.id, l.id, 1906, 'Strasbourg', 'Racing', '#009FE3', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Toulouse FC', 'TOU', c.id, l.id, 1970, 'Toulouse', 'Téfécé', '#7B2D81', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'FC Nantes', 'NAN', c.id, l.id, 1943, 'Nantes', 'Canaris', '#FCDD09', '#00A651'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Stade de Reims', 'REI', c.id, l.id, 1931, 'Reims', 'Les Rouges', '#E30613', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Montpellier HSC', 'MHS', c.id, l.id, 1974, 'Montpellier', 'La Paillade', '#FF6600', '#003DA5'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'AJ Auxerre', 'AUX', c.id, l.id, 1905, 'Auxerre', 'Ajaïste', '#FFFFFF', '#009FE3'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Angers SCO', 'ANG', c.id, l.id, 1919, 'Angers', 'Scoïstes', '#000000', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'AS Saint-Étienne', 'ASSE', c.id, l.id, 1919, 'Saint-Étienne', 'Les Verts', '#00552E', '#FFFFFF'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
SELECT 'Le Havre AC', 'HAC', c.id, l.id, 1872, 'Le Havre', 'Ciel et Marine', '#88C8F2', '#00205B'
FROM countries c, leagues l WHERE c.code = 'FRA' AND l.short_name = 'L1'
ON CONFLICT DO NOTHING;

-- Ligue 1 Stadiums (remaining)
INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade Francis-Le Blé', c.id, co.id, 'Brest', '1 Boulevard de Plymouth, 29200 Brest', 48.4028, -4.4617, 15220, 1922
FROM clubs c, countries co WHERE c.short_name = 'BRE29' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Allianz Riviera', c.id, co.id, 'Nice', 'Boulevard des Jardiniers, 06200 Nice', 43.7050, 7.1925, 35624, 2013
FROM clubs c, countries co WHERE c.short_name = 'NIC' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade Bollaert-Delelis', c.id, co.id, 'Lens', 'Rue Maurice Carton, 62300 Lens', 50.4328, 2.8150, 38223, 1933
FROM clubs c, countries co WHERE c.short_name = 'RCL' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Roazhon Park', c.id, co.id, 'Rennes', 'Route de Lorient, 35000 Rennes', 48.1075, -1.7128, 29778, 1912
FROM clubs c, countries co WHERE c.short_name = 'REN' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade de la Meinau', c.id, co.id, 'Strasbourg', '12 Rue de l''Extenwoerth, 67100 Strasbourg', 48.5600, 7.7553, 26109, 1914
FROM clubs c, countries co WHERE c.short_name = 'RCS' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stadium de Toulouse', c.id, co.id, 'Toulouse', '1 Allée Gabriel Biénès, 31400 Toulouse', 43.5833, 1.4344, 33150, 1937
FROM clubs c, countries co WHERE c.short_name = 'TOU' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade de la Beaujoire', c.id, co.id, 'Nantes', 'Route de Saint-Joseph, 44300 Nantes', 47.2558, -1.5247, 37473, 1984
FROM clubs c, countries co WHERE c.short_name = 'NAN' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade Auguste-Delaune', c.id, co.id, 'Reims', '33 Chaussée Bocquaine, 51100 Reims', 49.2467, 4.0253, 21684, 1935
FROM clubs c, countries co WHERE c.short_name = 'REI' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade de la Mosson', c.id, co.id, 'Montpellier', 'Avenue de Heidelberg, 34080 Montpellier', 43.6219, 3.8119, 32900, 1972
FROM clubs c, countries co WHERE c.short_name = 'MHS' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade de l''Abbé-Deschamps', c.id, co.id, 'Auxerre', 'Route de Vaux, 89000 Auxerre', 47.7864, 3.5839, 24000, 1918
FROM clubs c, countries co WHERE c.short_name = 'AUX' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade Raymond Kopa', c.id, co.id, 'Angers', 'Boulevard Pierre de Coubertin, 49000 Angers', 47.4603, -0.5306, 18752, 1912
FROM clubs c, countries co WHERE c.short_name = 'ANG' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade Geoffroy-Guichard', c.id, co.id, 'Saint-Étienne', '14 Rue Paul et Pierre Guichard, 42000 Saint-Étienne', 45.4608, 4.3903, 42000, 1931
FROM clubs c, countries co WHERE c.short_name = 'ASSE' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

INSERT INTO stadiums (name, club_id, country_id, city, address, latitude, longitude, capacity, built_year)
SELECT 'Stade Océane', c.id, co.id, 'Le Havre', 'Boulevard de Léningrad, 76600 Le Havre', 49.4992, 0.1661, 25178, 2012
FROM clubs c, countries co WHERE c.short_name = 'HAC' AND co.code = 'FRA'
ON CONFLICT DO NOTHING;

-- Final count
SELECT 'Total clubs' as info, COUNT(*) as count FROM clubs
UNION ALL
SELECT 'Total stadiums', COUNT(*) FROM stadiums;
