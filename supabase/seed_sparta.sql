-- ============================================
-- SPARTA ROTTERDAM SPOTLIGHT DATA
-- Een speciaal cadeau voor Bram - seizoenskaarthouder sinds...
-- ============================================

-- First, ensure Sparta exists in clubs table (should be in main seed)
-- This assumes the club already exists from 001 seed

-- Get Sparta's ID for foreign key references
DO $$
DECLARE
    sparta_id UUID;
    netherlands_id UUID;
    eredivisie_id UUID;
    feyenoord_id UUID;
BEGIN

-- Get Sparta's club ID
SELECT id INTO sparta_id FROM clubs WHERE name = 'Sparta Rotterdam' LIMIT 1;
SELECT id INTO netherlands_id FROM countries WHERE code = 'NLD' LIMIT 1;
SELECT id INTO eredivisie_id FROM leagues WHERE short_name = 'ERE' AND country_id = netherlands_id LIMIT 1;
SELECT id INTO feyenoord_id FROM clubs WHERE name = 'Feyenoord' LIMIT 1;

-- If Sparta doesn't exist, create it
IF sparta_id IS NULL THEN
    INSERT INTO clubs (name, short_name, country_id, current_league_id, founded_year, city, nickname, primary_color, secondary_color)
    SELECT 'Sparta Rotterdam', 'SPA', netherlands_id, eredivisie_id, 1888, 'Rotterdam', 'De Kasteelheren', '#FF0000', '#FFFFFF'
    RETURNING id INTO sparta_id;
END IF;

-- ============================================
-- CLUB HISTORY
-- ============================================

INSERT INTO club_history (club_id, founding_story, name_origin, motto, anthem_name, original_colors, record_league_position, record_league_season)
VALUES (
    sparta_id,
    'Op Eerste Paasdag, 1 april 1888, kwamen acht scholieren tussen 13 en 16 jaar bijeen in de tuin van het huis van de familie Hartevelt Hoos aan het Oostvestplein 11 in Rotterdam. Tussen de ochtend- en middagkerkdiensten richtten zij de Rotterdamsche Cricket & Football Club Sparta op. Vijf van hen zaten op de HBS aan het Van Alkemadeplein, de andere drie op het Erasmiaans Gymnasium. Allen kwamen uit welvarende Rotterdamse families - handelaren in hout, graan, koffie en tabak. Ze begonnen met cricket, maar in juli 1888 kregen ze een voetbal cadeau en werd een voetbalafdeling opgericht.',
    'De naam Sparta verwijst naar de oude Griekse stadstaat, bekend om discipline, moed en krijgshaftigheid. De Rotterdamse scholieren kozen deze naam als symbool voor sportieve strijd en doorzettingsvermogen.',
    'Én jaren nog hierna',
    'De Sparta Marsch',
    'Rood-wit (sinds 1889)',
    1,
    '1958-59'
);

-- ============================================
-- CLUB FACTS - Oprichting & Primeurs
-- ============================================

INSERT INTO club_facts (club_id, title, content, category, era, year, is_highlight, obscurity_level) VALUES

-- PRIMEURS (Firsts)
(sparta_id, 
 'De oudste profclub van Nederland', 
 'Sparta Rotterdam is opgericht op 1 april 1888, waarmee het de oudste nog bestaande professionele voetbalclub van Nederland is. Ter vergelijking: toen Sparta in 1909 voor het eerst kampioen werd, bestond Feyenoord nog maar één jaar!', 
 'founding', 'pre-war', 1888, true, 1),

(sparta_id, 
 'Uitvinders van het doelnet', 
 'Sparta introduceerde als eerste Nederlandse club een doel met een lat én netten. Voorheen werd er alleen een touw tussen de palen gespannen. Ook de kopbal werd door Sparta in Nederland geïntroduceerd.', 
 'trivia', 'pre-war', 1893, true, 2),

(sparta_id, 
 'Eerste internationale wedstrijd ooit in Nederland', 
 'Op 18 maart 1893 speelde Sparta als eerste Nederlandse club tegen een buitenlandse tegenstander: Harwich & Parkeston FC uit Engeland. Het werd een pijnlijke 0-8 nederlaag, maar het was het begin van internationaal clubvoetbal in Nederland.', 
 'records', 'pre-war', 1893, true, 2),

(sparta_id, 
 'Initiatief voor het Nederlands Elftal', 
 'Na de 0-8 nederlaag tegen Engeland stelde Sparta voor om de beste spelers van alle Nederlandse clubs samen te brengen. Dit ''eerste Nederlands elftal'' speelde 1-1 tegen Felixstowe FC. Sparta was dus mede-initiatiefnemer van Oranje!', 
 'trivia', 'pre-war', 1894, true, 2),

(sparta_id, 
 'Gastheer van de allereerste officiële interland', 
 'Op 14 mei 1905 werd op het Sparta Sportpark Schuttersveld de eerste officiële thuisinterland van Nederland gespeeld. Oranje won met 4-0 van België. Het allereerste officiële thuisdoelpunt werd gemaakt door Sparta-speler Bok de Korver.', 
 'records', 'pre-war', 1905, true, 1),

(sparta_id, 
 'Het eerste echte voetbalstadion van Nederland', 
 'Het Kasteel, geopend in 1916, was het eerste echte voetbalstadion van Nederland. Met zijn karakteristieke twee kasteeltorens is het nog steeds een van de meest herkenbare stadions. Het stadion werd grotendeels privé gefinancierd door 27 Rotterdamse inwoners.', 
 'stadium', 'pre-war', 1916, true, 1),

(sparta_id, 
 'Koninklijk bezoek als eerste', 
 'In 1918 was Prins Hendrik het eerste lid van het Koninklijk Huis dat officieel een Sparta-wedstrijd bezocht. Later kwamen ook Koningin Wilhelmina, Prinses Juliana en Prins Bernhard naar Het Kasteel.', 
 'trivia', 'pre-war', 1918, false, 3),

-- RECORDS
(sparta_id, 
 'Grootste overwinning in competitieverband ooit: 17-0', 
 'Op 18 december 1892 versloeg Sparta de Amersfoortsche FC met 17-0. Dit is nog steeds de grootste overwinning in een officiële Nederlandse competitiewedstrijd. Rechtervleugel Freek Kampschreur scoorde 9 van de 17 doelpunten - een record dat nog steeds staat.', 
 'records', 'pre-war', 1892, true, 2),

(sparta_id, 
 'Ongeslagen in thuiswedstrijden tijdens kampioensjaar 1959', 
 'In het kampioensjaar 1958-59 bleef Sparta in alle thuiswedstrijden ongeslagen. Van de 34 competitiewedstrijden werden er slechts 3 verloren.', 
 'records', '1950s', 1959, false, 2),

-- GLORY DAYS
(sparta_id, 
 'Vijf landstitels in zeven jaar (1909-1915)', 
 'Tussen 1909 en 1915 werd Sparta vijfmaal landskampioen - een gouden periode die nooit meer geëvenaard is. Sleutelspelers waren Bok de Korver en ''het Sparta-kanon'' Huug de Groot.', 
 'glory_days', 'pre-war', 1915, true, 1),

(sparta_id, 
 'Het wonderjaar 1959', 
 'Niemand verwachtte het, maar onder leiding van de Engelse trainer Denis Neville werd Sparta in 1959 landskampioen - voor het eerst sinds 1915. Het team had geen grote namen, maar een ongekend saamhorigheidsgevoel. Na de beslissende wedstrijd tegen DWS in Amsterdam reed het elftal op een paardenkoets over de Coolsingel, waar een juichende mensenmassa hen opwachtte.', 
 'glory_days', '1950s', 1959, true, 1),

(sparta_id, 
 'Europese sensatie: 83.000 toeschouwers in Glasgow', 
 'Als landskampioen speelde Sparta in de Europacup I van 1959-60. In de kwartfinale tegen Rangers FC won Sparta in het Ibrox-stadion voor 83.000 toeschouwers met 0-1. Helaas werd de beslissingswedstrijd in Londen met 2-3 verloren. Nooit eerder was een Nederlandse club zo ver gekomen in Europa.', 
 'glory_days', '1950s', 1960, true, 2),

-- DARK TIMES / RESILIENCE
(sparta_id, 
 'Het Kasteel als voedseluitdeelpunt in WOII', 
 'In de hongerwinter van 1943, 1944 en 1945 werd Het Kasteel gebruikt als centraal uitdeelpunt van voedsel voor honderden bewoners van de omliggende wijken. Na de bevrijding maakten ook geallieerde strijders uit Engeland, Canada en de VS gebruik van het terrein.', 
 'dark_times', '1940s', 1944, false, 3),

(sparta_id, 
 'Eerste naoorlogse wedstrijd in Rotterdam', 
 'Op 20 mei 1945 won Sparta de eerste naoorlogse wedstrijd in Rotterdam met 5-0 van RFC in de Bevrijdingscompetitie.', 
 'records', '1940s', 1945, false, 3),

(sparta_id, 
 '2.000 supporters redden Sparta van degradatie', 
 'In 1921 dreigde Sparta te degraderen. Maar liefst 2.000 Rotterdammers reisden naar Haarlem - in dertig vrachtauto''s, eigen auto''s en zelfs op de fiets. De lokale bevolking stond verbaasd langs de weg. Sparta won met 1-2 en bleef behouden. Dit is de oudste Nederlandse competitiewedstrijd waarvan filmbeelden bestaan.', 
 'trivia', '1920s', 1921, true, 3),

-- LEGENDS & CULTURE
(sparta_id, 
 'Bok de Korver - de gentleman-voetballer', 
 'Johannes Marinus ''Bok'' de Korver (1883-1957) was een icoon. Hij wilde niet trainen, want dat was ''niet eerlijk voor de tegenstander''. Juichen deed hij nauwelijks, ook uit eerbied voor de andere partij. In de rust rookte hij een sigaar. Op wedstrijddagen zat hij om kwart over één nog thuis terwijl de wedstrijd om twee uur begon. ''Ik denk dat ik maar eens opstap,'' zei hij dan kalm tegen zijn vrouw. Zijn schoenen liggen nog in het Sparta-museum.', 
 'legends', 'pre-war', 1905, true, 2),

(sparta_id, 
 'De eerste bondscoach was een Spartaan', 
 'Cees van Hasselt, Sparta-speler vanaf 1893, werd in 1905 de eerste bondscoach van het Nederlands elftal. Het Nederlands elftal bestond destijds uitsluitend uit spelers uit Zuid-Holland. Van Hasselt drukte een enorm stempel op het begin van het voetbal in Nederland.', 
 'legends', 'pre-war', 1905, true, 2),

(sparta_id, 
 'Sparta Piet en zijn kanariepiet', 
 'Decennialang zat supporter ''Sparta Piet'' op de tribune van Het Kasteel met een kooitje met een kanariepiet. Een iconisch beeld dat bij geen andere club te zien was.', 
 'trivia', '1970s', 1975, false, 3),

(sparta_id, 
 'Jules Deelder - de beroemdste Spartaan', 
 'Dichter, schrijver en ''nachtburgemeester van Rotterdam'' Jules Deelder (1944-2019) was de beroemdste Sparta-fan aller tijden. In zijn ''Spartaans Gedicht'' vergelijkt hij Het Kasteel met de hemelpoort. ''O, dicht Deelder, brok in ons keel...'' Veel fans kennen zijn gedichten uit het hoofd.', 
 'legends', '1980s', 1980, true, 2),

-- RIVALRY
(sparta_id, 
 'De Derby aan de Maas', 
 'De rivaliteit met stadsgenoot Feyenoord is een van de oudste in het Nederlandse voetbal. Hoewel Feyenoord vaak als grotere club wordt gezien, weet Sparta regelmatig verrassende resultaten te boeken. De spanning rond deze wedstrijden is weken van tevoren voelbaar in de hele stad.', 
 'rivalry', '1950s', 1950, true, 1),

(sparta_id, 
 'Ouder dan Feyenoord zelf', 
 'Toen Sparta in 1909 voor het eerst landskampioen werd, bestond Feyenoord (toen nog ''Wilhelmina'') nog maar één jaar. Sparta was opgericht door jongens uit welvarende families; Feyenoord door de arbeidersklasse. Dit klassenonderscheid klinkt nog door in de rivaliteit.', 
 'rivalry', 'pre-war', 1909, false, 2),

-- HET KASTEEL
(sparta_id, 
 'Waarom Het Kasteel ''Het Kasteel'' heet', 
 'Het stadion, geopend op 15 oktober 1916, werd al snel ''Het Kasteel'' genoemd vanwege de facade met twee karakteristieke torentjes. Deze torens zijn na alle renovaties het enige originele onderdeel dat nog over is.', 
 'stadium', 'pre-war', 1916, false, 2),

(sparta_id, 
 'De Denis Neville-tribune', 
 'De luidruchtigste tribune van Het Kasteel is vernoemd naar Denis Neville, de Engelse trainer die Sparta in 1959 naar het onverwachte kampioenschap leidde. Hij was acht jaar verbonden aan de club (1955-1963) en overleed in 1995.', 
 'stadium', '2000s', 2001, false, 2),

-- JEUGDOPLEIDING
(sparta_id, 
 'Kweekvijver van talent', 
 'Sparta staat bekend om zijn uitstekende jeugdopleiding. Veel bekende voetballers begonnen hun carrière bij Sparta, waaronder Michel Valke. In 1963 besloot de club officieel tot het oprichten van een scoutingsafdeling.', 
 'trivia', '1960s', 1963, false, 2),

-- INNOVATIE
(sparta_id, 
 'Eerste club met TV-reclame', 
 'Sparta was de eerste Nederlandse voetbalclub die een TV-reclame uitzond.', 
 'trivia', '1980s', 1985, false, 3),

(sparta_id, 
 'Eerste club met betaalde toegang', 
 'Sparta was een van de eerste clubs die entreegeld ging vragen voor wedstrijden.', 
 'trivia', 'pre-war', 1900, false, 3),

-- OBSCURE FACTS
(sparta_id, 
 'Het eerste affiche was van een beroemde kunstenaar', 
 'Het allereerste officiële Sparta-affiche werd gemaakt door een kunstenaar die later werd toegelaten tot de prestigieuze Académie des Beaux-Arts in Parijs. Deze Wim van Hasselt wordt nog altijd in één adem genoemd met Kees van Dongen. Waar het originele affiche is gebleven, weet niemand meer.', 
 'trivia', 'pre-war', 1895, false, 3),

(sparta_id, 
 'De oprichters werden succesvolle zakenlieden', 
 'De acht oprichters van Sparta kwamen uit welvarende families en werden zelf ook succesvol. La Verge werd mede-eigenaar van een van de grootste tabaksfirma''s van Rotterdam. Van den Ende groeide uit tot gevierd graanhandelaar. De Vogel werd eigenaar van een Amsterdamse importfirma.', 
 'founding', 'pre-war', 1910, false, 3),

(sparta_id, 
 'Vrouwenvoetbal al in 1896', 
 'Sparta probeerde in 1896 al een wedstrijd te organiseren tussen een vrouwenteam van Sparta en de English Ladies Football Club uit Londen. De Nederlandse Voetbalbond verbood de wedstrijd echter. Nederland was er nog niet klaar voor.', 
 'trivia', 'pre-war', 1896, false, 3),

(sparta_id, 
 'Zo oud als Sparta word je nooit', 
 'Deze beroemde uitspraak van Jules Deelder vat de unieke status van de club samen. Deelder: ''Ik heb de boeken er op nageslagen; er is niemand die zo oud is als Sparta.''', 
 'trivia', '2010s', 2019, true, 1);

-- ============================================
-- CLUB LEGENDS
-- ============================================

INSERT INTO club_legends (club_id, name, nickname, nationality, role, position, joined_year, left_year, appearances, goals, biography, famous_quote, legend_tier) VALUES

(sparta_id, 
 'Johannes Marinus de Korver', 
 'Bok', 
 'Netherlands', 
 'player', 
 'defender', 
 1900, 
 1920, 
 NULL, 
 2,
 'Bok de Korver was een gentleman-voetballer die training weigerde omdat het ''oneerlijk'' was voor de tegenstander. Hij rookte een sigaar in de rust, vierde nooit uitbundig en stond om kwart over één nog rustig thuis terwijl de wedstrijd om twee uur begon. Hij speelde 31 interlands en scoorde het eerste officiële thuisdoelpunt van Oranje. Na zijn carrière werd hij hoofd van de afdeling sport & recreatie van de gemeente Rotterdam.',
 'Ik denk dat ik maar eens opstap.',
 1),

(sparta_id, 
 'Huug de Groot', 
 'Het Sparta-kanon', 
 'Netherlands', 
 'player', 
 'forward', 
 1905, 
 1920, 
 NULL, 
 NULL,
 'Huug de Groot stond bekend als ''het Sparta-kanon'' vanwege zijn enorme schotkracht. Hij was een sleutelspeler tijdens de gouden periode van vijf landstitels tussen 1909 en 1915.',
 NULL,
 1),

(sparta_id, 
 'Denis Neville', 
 NULL, 
 'England', 
 'manager', 
 NULL, 
 1955, 
 1963, 
 NULL, 
 NULL,
 'De Engelse trainer Denis Neville leidde Sparta in 1959 naar het onverwachte kampioenschap - het eerste sinds 1915. Hij creëerde een team met ongekende saamhorigheid. De luidruchtigste tribune van Het Kasteel is naar hem vernoemd.',
 NULL,
 1),

(sparta_id, 
 'Tonny van Ede', 
 'De ongrijpbare', 
 'Netherlands', 
 'player', 
 'forward', 
 1955, 
 1965, 
 NULL, 
 NULL,
 'Tonny van Ede was de ongrijpbare buitenspeler van het kampioensteam van 1959.',
 NULL,
 2),

(sparta_id, 
 'Cees van Hasselt', 
 NULL, 
 'Netherlands', 
 'player', 
 'defender', 
 1893, 
 1908, 
 NULL, 
 NULL,
 'Cees van Hasselt was niet alleen speler, maar werd in 1905 ook de eerste bondscoach van het Nederlands elftal. Hij drukte een enorm stempel op het begin van het Nederlandse voetbal.',
 NULL,
 1),

(sparta_id, 
 'Michel Valke', 
 NULL, 
 'Netherlands', 
 'player', 
 'midfielder', 
 1982, 
 1990, 
 NULL, 
 NULL,
 'Michel Valke is een van de bekendste producten van de Sparta-jeugdopleiding. Hij groeide uit tot international.',
 NULL,
 2),

(sparta_id, 
 'Jules Deelder', 
 'De nachtburgemeester', 
 'Netherlands', 
 'supporter', 
 NULL, 
 1960, 
 2019, 
 NULL, 
 NULL,
 'Dichter, schrijver en ''nachtburgemeester van Rotterdam'' Jules Deelder (1944-2019) was de beroemdste Sparta-supporter aller tijden. Zijn ''Spartaans Gedicht'' wordt door veel fans uit het hoofd gekend. Hij vergeleek Het Kasteel met de hemelpoort.',
 'Zo oud als Sparta word je nooit.',
 1);

-- ============================================
-- CLUB TROPHIES
-- ============================================

INSERT INTO club_trophies (club_id, competition_name, competition_type, season, year, notes) VALUES
(sparta_id, 'Landskampioenschap', 'league', '1908-09', 1909, 'Eerste landstitel ooit'),
(sparta_id, 'Landskampioenschap', 'league', '1910-11', 1911, NULL),
(sparta_id, 'Landskampioenschap', 'league', '1911-12', 1912, NULL),
(sparta_id, 'Landskampioenschap', 'league', '1912-13', 1913, NULL),
(sparta_id, 'Landskampioenschap', 'league', '1914-15', 1915, 'Vijfde titel in zeven jaar'),
(sparta_id, 'Landskampioenschap', 'league', '1958-59', 1959, 'Het wonderjaar - eerste titel sinds 1915'),
(sparta_id, 'KNVB Beker', 'cup', '1957-58', 1958, 'Bekerwinst voorafgaand aan kampioensjaar'),
(sparta_id, 'Eerste Divisie', 'league', '2015-16', 2016, 'Terugkeer naar Eredivisie onder Alex Pastoor'),
(sparta_id, 'Eerste Divisie', 'league', '2018-19', 2019, 'Promotie naar Eredivisie');

-- ============================================
-- CLUB RIVALRIES
-- ============================================

INSERT INTO club_rivalries (club_id, rival_club_id, rivalry_name, rivalry_type, origin_story, intensity_level) VALUES
(sparta_id, 
 feyenoord_id, 
 'De Derby aan de Maas', 
 'city', 
 'De rivaliteit tussen Sparta en Feyenoord is een van de oudste in het Nederlandse voetbal. Sparta, opgericht door jongens uit welvarende families in 1888, was al kampioen toen Feyenoord in 1908 door de arbeidersklasse werd opgericht. Dit klassenonderscheid klinkt nog door in de rivaliteit. Hoewel Feyenoord nu de grotere club is, weet Sparta regelmatig verrassende resultaten te boeken.',
 2);

END $$;
