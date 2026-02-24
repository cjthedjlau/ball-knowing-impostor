// ─────────────────────────────────────────────────────────────────────────────
// Sports API — athlete pools for Ball Knowing Impostor
// ─────────────────────────────────────────────────────────────────────────────

const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

// Strict league → emoji mapping. Set once, never re-derived at display time.
export const LEAGUE_EMOJI = {
  MLB: '⚾',
  NBA: '🏀',
  NFL: '🏈',
  NHL: '🏒',
};

// Validate that an image URL is reachable and renders (returns true/false)
export const validateImage = (url) => {
  if (!url || !url.startsWith('http')) return Promise.resolve(false);
  return new Promise((resolve) => {
    const img = new Image();
    const t = setTimeout(() => resolve(false), 6000);
    img.onload  = () => { clearTimeout(t); resolve(img.naturalWidth > 10); };
    img.onerror = () => { clearTimeout(t); resolve(false); };
    img.src = url;
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// NORMAL MODE — Active current-season players only (hardcoded, curated)
// ─────────────────────────────────────────────────────────────────────────────
const NORMAL_ATHLETES_RAW = [
  // NBA — active 2024-25
  { name: 'LeBron James',          team: 'Los Angeles Lakers',    league: 'NBA', position: 'Small Forward' },
  { name: 'Stephen Curry',         team: 'Golden State Warriors', league: 'NBA', position: 'Point Guard' },
  { name: 'Kevin Durant',          team: 'Phoenix Suns',          league: 'NBA', position: 'Small Forward' },
  { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks',       league: 'NBA', position: 'Power Forward' },
  { name: 'Nikola Jokic',          team: 'Denver Nuggets',        league: 'NBA', position: 'Center' },
  { name: 'Luka Doncic',           team: 'Dallas Mavericks',      league: 'NBA', position: 'Point Guard' },
  { name: 'Jayson Tatum',          team: 'Boston Celtics',        league: 'NBA', position: 'Small Forward' },
  { name: 'Joel Embiid',           team: 'Philadelphia 76ers',    league: 'NBA', position: 'Center' },
  { name: 'Damian Lillard',        team: 'Milwaukee Bucks',       league: 'NBA', position: 'Point Guard' },
  { name: 'Anthony Davis',         team: 'Los Angeles Lakers',    league: 'NBA', position: 'Center' },
  { name: 'Devin Booker',          team: 'Phoenix Suns',          league: 'NBA', position: 'Shooting Guard' },
  { name: 'Kawhi Leonard',         team: 'Los Angeles Clippers',  league: 'NBA', position: 'Small Forward' },
  { name: 'Jimmy Butler',          team: 'Golden State Warriors', league: 'NBA', position: 'Small Forward' },
  { name: 'Trae Young',            team: 'Atlanta Hawks',         league: 'NBA', position: 'Point Guard' },
  { name: 'Zion Williamson',       team: 'New Orleans Pelicans',  league: 'NBA', position: 'Power Forward' },

  // NFL — active 2024-25
  { name: 'Patrick Mahomes',       team: 'Kansas City Chiefs',    league: 'NFL', position: 'Quarterback' },
  { name: 'Josh Allen',            team: 'Buffalo Bills',         league: 'NFL', position: 'Quarterback' },
  { name: 'Lamar Jackson',         team: 'Baltimore Ravens',      league: 'NFL', position: 'Quarterback' },
  { name: 'Travis Kelce',          team: 'Kansas City Chiefs',    league: 'NFL', position: 'Tight End' },
  { name: 'Justin Jefferson',      team: 'Minnesota Vikings',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tyreek Hill',           team: 'Miami Dolphins',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Davante Adams',         team: 'Los Angeles Rams',      league: 'NFL', position: 'Wide Receiver' },
  { name: 'Stefon Diggs',          team: 'Houston Texans',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Joe Burrow',            team: 'Cincinnati Bengals',    league: 'NFL', position: 'Quarterback' },
  { name: 'Jalen Hurts',           team: 'Philadelphia Eagles',   league: 'NFL', position: 'Quarterback' },
  { name: 'CeeDee Lamb',           team: 'Dallas Cowboys',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Justin Herbert',        team: 'Los Angeles Chargers',  league: 'NFL', position: 'Quarterback' },

  // MLB — active 2024
  { name: 'Shohei Ohtani',         team: 'Los Angeles Dodgers',   league: 'MLB', position: 'Designated Hitter' },
  { name: 'Mike Trout',            team: 'Los Angeles Angels',    league: 'MLB', position: 'Outfielder' },
  { name: 'Aaron Judge',           team: 'New York Yankees',      league: 'MLB', position: 'Outfielder' },
  { name: 'Mookie Betts',          team: 'Los Angeles Dodgers',   league: 'MLB', position: 'Outfielder' },
  { name: 'Fernando Tatis Jr.',    team: 'San Diego Padres',      league: 'MLB', position: 'Shortstop' },
  { name: 'Ronald Acuna Jr.',      team: 'Atlanta Braves',        league: 'MLB', position: 'Outfielder' },
  { name: 'Freddie Freeman',       team: 'Los Angeles Dodgers',   league: 'MLB', position: 'First Baseman' },
  { name: 'Juan Soto',             team: 'New York Yankees',      league: 'MLB', position: 'Outfielder' },
  { name: 'Julio Rodriguez',       team: 'Seattle Mariners',      league: 'MLB', position: 'Outfielder' },
  { name: 'Yordan Alvarez',        team: 'Houston Astros',        league: 'MLB', position: 'Outfielder' },

  // NHL — active 2024-25
  { name: 'Connor McDavid',        team: 'Edmonton Oilers',       league: 'NHL', position: 'Center' },
  { name: 'Nathan MacKinnon',      team: 'Colorado Avalanche',    league: 'NHL', position: 'Center' },
  { name: 'Leon Draisaitl',        team: 'Edmonton Oilers',       league: 'NHL', position: 'Center' },
  { name: 'David Pastrnak',        team: 'Boston Bruins',         league: 'NHL', position: 'Right Wing' },
  { name: 'Auston Matthews',       team: 'Toronto Maple Leafs',   league: 'NHL', position: 'Center' },
  { name: 'Mikko Rantanen',        team: 'Colorado Avalanche',    league: 'NHL', position: 'Right Wing' },
  { name: 'Cale Makar',            team: 'Colorado Avalanche',    league: 'NHL', position: 'Defenseman' },
  { name: 'Alex Ovechkin',         team: 'Washington Capitals',   league: 'NHL', position: 'Left Wing' },
  { name: 'Sidney Crosby',         team: 'Pittsburgh Penguins',   league: 'NHL', position: 'Center' },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEGENDS MODE — Iconic retired players only
// ─────────────────────────────────────────────────────────────────────────────
const LEGENDS_ATHLETES_RAW = [
  // NBA Legends
  { name: 'Michael Jordan',        team: 'Chicago Bulls',             league: 'NBA', position: 'Shooting Guard' },
  { name: 'Kobe Bryant',           team: 'Los Angeles Lakers',        league: 'NBA', position: 'Shooting Guard' },
  { name: 'Shaquille O\'Neal',     team: 'Los Angeles Lakers',        league: 'NBA', position: 'Center' },
  { name: 'Magic Johnson',         team: 'Los Angeles Lakers',        league: 'NBA', position: 'Point Guard' },
  { name: 'Larry Bird',            team: 'Boston Celtics',            league: 'NBA', position: 'Small Forward' },
  { name: 'Wilt Chamberlain',      team: 'Los Angeles Lakers',        league: 'NBA', position: 'Center' },
  { name: 'Bill Russell',          team: 'Boston Celtics',            league: 'NBA', position: 'Center' },
  { name: 'Kareem Abdul-Jabbar',   team: 'Los Angeles Lakers',        league: 'NBA', position: 'Center' },
  { name: 'Charles Barkley',       team: 'Phoenix Suns',              league: 'NBA', position: 'Power Forward' },
  { name: 'Dirk Nowitzki',         team: 'Dallas Mavericks',          league: 'NBA', position: 'Power Forward' },
  { name: 'Dwyane Wade',           team: 'Miami Heat',                league: 'NBA', position: 'Shooting Guard' },
  { name: 'Allen Iverson',         team: 'Philadelphia 76ers',        league: 'NBA', position: 'Point Guard' },
  { name: 'Scottie Pippen',        team: 'Chicago Bulls',             league: 'NBA', position: 'Small Forward' },
  { name: 'Tim Duncan',            team: 'San Antonio Spurs',         league: 'NBA', position: 'Power Forward' },
  { name: 'Kevin Garnett',         team: 'Boston Celtics',            league: 'NBA', position: 'Power Forward' },

  // NFL Legends
  { name: 'Tom Brady',             team: 'New England Patriots',      league: 'NFL', position: 'Quarterback' },
  { name: 'Jerry Rice',            team: 'San Francisco 49ers',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Joe Montana',           team: 'San Francisco 49ers',       league: 'NFL', position: 'Quarterback' },
  { name: 'Walter Payton',         team: 'Chicago Bears',             league: 'NFL', position: 'Running Back' },
  { name: 'Emmitt Smith',          team: 'Dallas Cowboys',            league: 'NFL', position: 'Running Back' },
  { name: 'Peyton Manning',        team: 'Indianapolis Colts',        league: 'NFL', position: 'Quarterback' },
  { name: 'Barry Sanders',         team: 'Detroit Lions',             league: 'NFL', position: 'Running Back' },
  { name: 'Deion Sanders',         team: 'Dallas Cowboys',            league: 'NFL', position: 'Cornerback' },
  { name: 'Lawrence Taylor',       team: 'New York Giants',           league: 'NFL', position: 'Linebacker' },
  { name: 'Brett Favre',           team: 'Green Bay Packers',         league: 'NFL', position: 'Quarterback' },
  { name: 'Aaron Rodgers',         team: 'Green Bay Packers',         league: 'NFL', position: 'Quarterback' },
  { name: 'Dan Marino',            team: 'Miami Dolphins',            league: 'NFL', position: 'Quarterback' },
  { name: 'Jim Brown',             team: 'Cleveland Browns',          league: 'NFL', position: 'Running Back' },
  { name: 'Reggie White',          team: 'Green Bay Packers',         league: 'NFL', position: 'Defensive End' },

  // MLB Legends
  { name: 'Babe Ruth',             team: 'New York Yankees',          league: 'MLB', position: 'Outfielder' },
  { name: 'Derek Jeter',           team: 'New York Yankees',          league: 'MLB', position: 'Shortstop' },
  { name: 'Willie Mays',           team: 'San Francisco Giants',      league: 'MLB', position: 'Outfielder' },
  { name: 'Hank Aaron',            team: 'Atlanta Braves',            league: 'MLB', position: 'Outfielder' },
  { name: 'Ken Griffey Jr.',       team: 'Seattle Mariners',          league: 'MLB', position: 'Outfielder' },
  { name: 'Barry Bonds',           team: 'San Francisco Giants',      league: 'MLB', position: 'Outfielder' },
  { name: 'Roger Clemens',         team: 'New York Yankees',          league: 'MLB', position: 'Pitcher' },
  { name: 'Pete Rose',             team: 'Cincinnati Reds',           league: 'MLB', position: 'First Baseman' },
  { name: 'Nolan Ryan',            team: 'Texas Rangers',             league: 'MLB', position: 'Pitcher' },
  { name: 'Cal Ripken Jr.',        team: 'Baltimore Orioles',         league: 'MLB', position: 'Shortstop' },
  { name: 'Ted Williams',          team: 'Boston Red Sox',            league: 'MLB', position: 'Outfielder' },
  { name: 'Mickey Mantle',         team: 'New York Yankees',          league: 'MLB', position: 'Outfielder' },

  // NHL Legends
  { name: 'Wayne Gretzky',         team: 'Edmonton Oilers',           league: 'NHL', position: 'Center' },
  { name: 'Mario Lemieux',         team: 'Pittsburgh Penguins',       league: 'NHL', position: 'Center' },
  { name: 'Gordie Howe',           team: 'Detroit Red Wings',         league: 'NHL', position: 'Right Wing' },
  { name: 'Bobby Orr',             team: 'Boston Bruins',             league: 'NHL', position: 'Defenseman' },
  { name: 'Mark Messier',          team: 'Edmonton Oilers',           league: 'NHL', position: 'Center' },
  { name: 'Patrick Roy',           team: 'Colorado Avalanche',        league: 'NHL', position: 'Goalie' },
  { name: 'Steve Yzerman',         team: 'Detroit Red Wings',         league: 'NHL', position: 'Center' },
  { name: 'Brett Hull',            team: 'Dallas Stars',              league: 'NHL', position: 'Right Wing' },
  { name: 'Jaromir Jagr',          team: 'Pittsburgh Penguins',       league: 'NHL', position: 'Right Wing' },
  { name: 'Martin Brodeur',        team: 'New Jersey Devils',         league: 'NHL', position: 'Goalie' },
];

const toStaticPool = (raw, prefix) =>
  raw.map((a, i) => ({ ...a, id: `${prefix}_${i}`, photoUrl: '', emoji: LEAGUE_EMOJI[a.league] || '🏅' }));

const NORMAL_ATHLETES  = toStaticPool(NORMAL_ATHLETES_RAW,  'normal');
const LEGENDS_ATHLETES = toStaticPool(LEGENDS_ATHLETES_RAW, 'legend');

// ─────────────────────────────────────────────────────────────────────────────
// BALL KNOWLEDGE — deeply obscure active roster players, fully hardcoded
// No player here should ever appear in Normal or Legends pools.
// Criteria: no All-Star appearances, deep bench/practice squad/AHL/G-League,
// minimal national media, even dedicated fans would not recognize them.
// ─────────────────────────────────────────────────────────────────────────────

const BALL_KNOWLEDGE_RAW = [
  // ── NBA: Two-way contracts, end-of-bench, G League call-ups ──
  { name: 'Jordan Nwora',          team: 'Toronto Raptors',          league: 'NBA', position: 'Forward' },
  { name: 'Svi Mykhailiuk',        team: 'Charlotte Hornets',        league: 'NBA', position: 'Shooting Guard' },
  { name: 'Jaylen Nowell',         team: 'Minnesota Timberwolves',   league: 'NBA', position: 'Guard' },
  { name: 'Scotty Pippen Jr.',     team: 'Memphis Grizzlies',        league: 'NBA', position: 'Guard' },
  { name: 'Amari Bailey',          team: 'Los Angeles Lakers',       league: 'NBA', position: 'Guard' },
  { name: 'Jalen Hood-Schifino',   team: 'Los Angeles Lakers',       league: 'NBA', position: 'Guard' },
  { name: 'Trayce Jackson-Davis',  team: 'Golden State Warriors',    league: 'NBA', position: 'Center' },
  { name: 'Lester Quinones',       team: 'Memphis Grizzlies',        league: 'NBA', position: 'Guard' },
  { name: 'Mojave King',           team: 'Indiana Pacers',           league: 'NBA', position: 'Guard' },
  { name: 'TyTy Washington Jr.',   team: 'Houston Rockets',          league: 'NBA', position: 'Guard' },
  { name: 'Bobi Klintman',         team: 'Sacramento Kings',         league: 'NBA', position: 'Forward' },
  { name: 'Kobe Brown',            team: 'Portland Trail Blazers',   league: 'NBA', position: 'Forward' },
  { name: 'Jermaine Samuels',      team: 'San Antonio Spurs',        league: 'NBA', position: 'Forward' },
  { name: 'Colby Jones',           team: 'Sacramento Kings',         league: 'NBA', position: 'Guard' },
  { name: 'A.J. Lawson',           team: 'Dallas Mavericks',         league: 'NBA', position: 'Forward' },
  { name: 'Javante McCoy',         team: 'Charlotte Hornets',        league: 'NBA', position: 'Guard' },
  { name: 'Tristan Vukcevic',      team: 'Portland Trail Blazers',   league: 'NBA', position: 'Center' },
  { name: 'Usman Garuba',          team: 'Utah Jazz',                league: 'NBA', position: 'Forward' },
  { name: 'Darius Days',           team: 'New Orleans Pelicans',     league: 'NBA', position: 'Forward' },
  { name: 'Marques Bolden',        team: 'Cleveland Cavaliers',      league: 'NBA', position: 'Center' },
  { name: 'Luka Samanić',          team: 'Charlotte Hornets',        league: 'NBA', position: 'Forward' },
  { name: 'Justin Lewis',          team: 'Milwaukee Bucks',          league: 'NBA', position: 'Forward' },
  { name: 'Jalen Slawson',         team: 'Memphis Grizzlies',        league: 'NBA', position: 'Forward' },
  { name: 'Duop Reath',            team: 'Portland Trail Blazers',   league: 'NBA', position: 'Center' },
  { name: 'Keaton Wallace',        team: 'Detroit Pistons',          league: 'NBA', position: 'Guard' },
  { name: 'Ron Harper Jr.',        team: 'Toronto Raptors',          league: 'NBA', position: 'Forward' },
  { name: 'Kaleb Johnson',         team: 'Utah Jazz',                league: 'NBA', position: 'Forward' },
  { name: 'Jaylen Martin',         team: 'Houston Rockets',          league: 'NBA', position: 'Forward' },
  { name: 'Nate Hinton',           team: 'Chicago Bulls',            league: 'NBA', position: 'Guard' },
  { name: 'Jordan Ford',           team: 'New Orleans Pelicans',     league: 'NBA', position: 'Guard' },
  { name: 'Oscar Tshiebwe',        team: 'Sacramento Kings',         league: 'NBA', position: 'Center' },
  { name: 'Jalen Crutcher',        team: 'Oklahoma City Thunder',    league: 'NBA', position: 'Guard' },
  { name: 'David Duke Jr.',        team: 'Cleveland Cavaliers',      league: 'NBA', position: 'Guard' },
  { name: 'Moussa Diabate',        team: 'Charlotte Hornets',        league: 'NBA', position: 'Center' },
  { name: 'Quinten Post',          team: 'Golden State Warriors',    league: 'NBA', position: 'Center' },
  { name: 'Gui Santos',            team: 'Golden State Warriors',    league: 'NBA', position: 'Forward' },
  { name: 'Chance Comanche',       team: 'Charlotte Hornets',        league: 'NBA', position: 'Center' },
  { name: 'Enrique Freeman',       team: 'Indiana Pacers',           league: 'NBA', position: 'Forward' },
  { name: 'Jaime Jaquez Jr.',      team: 'Miami Heat',               league: 'NBA', position: 'Forward' },
  { name: 'Patrick Baldwin Jr.',   team: 'Philadelphia 76ers',       league: 'NBA', position: 'Forward' },
  { name: 'Josh Minott',           team: 'Memphis Grizzlies',        league: 'NBA', position: 'Forward' },
  { name: 'MarJon Beauchamp',      team: 'Milwaukee Bucks',          league: 'NBA', position: 'Forward' },
  { name: 'Jaden Springer',        team: 'Boston Celtics',           league: 'NBA', position: 'Guard' },
  { name: 'Wendell Moore Jr.',     team: 'Oklahoma City Thunder',    league: 'NBA', position: 'Guard' },
  { name: 'Sidy Cissoko',          team: 'San Antonio Spurs',        league: 'NBA', position: 'Guard' },

  // ── NFL: Practice squad, 3rd/4th string, special teams only ──
  { name: 'Deon Jackson',          team: 'Indianapolis Colts',       league: 'NFL', position: 'Running Back' },
  { name: 'Elijah Higgins',        team: 'Arizona Cardinals',        league: 'NFL', position: 'Tight End' },
  { name: 'Jalen Camp',            team: 'Jacksonville Jaguars',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Velus Jones Jr.',       team: 'Chicago Bears',            league: 'NFL', position: 'Wide Receiver' },
  { name: 'Bo Melton',             team: 'Green Bay Packers',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Dontario Drummond',     team: 'Los Angeles Rams',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Trey Palmer',           team: 'Tampa Bay Buccaneers',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Laquon Treadwell',      team: 'New England Patriots',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Kalil Pimpleton',       team: 'Carolina Panthers',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Cade Stover',           team: 'Houston Texans',           league: 'NFL', position: 'Tight End' },
  { name: 'Blake Whiteheart',      team: 'Washington Commanders',    league: 'NFL', position: 'Tight End' },
  { name: 'Hunter Long',           team: 'Los Angeles Rams',         league: 'NFL', position: 'Tight End' },
  { name: 'Chris Myarick',         team: 'New York Jets',            league: 'NFL', position: 'Tight End' },
  { name: 'E.J. Perry',            team: 'New England Patriots',     league: 'NFL', position: 'Quarterback' },
  { name: 'Aidan O\'Connell',      team: 'Las Vegas Raiders',        league: 'NFL', position: 'Quarterback' },
  { name: 'Jake Haener',           team: 'New Orleans Saints',       league: 'NFL', position: 'Quarterback' },
  { name: 'Max Duggan',            team: 'Los Angeles Chargers',     league: 'NFL', position: 'Quarterback' },
  { name: 'Tyquan Thornton',       team: 'New England Patriots',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tre Tucker',            team: 'Las Vegas Raiders',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Warren Jackson',        team: 'Denver Broncos',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Montario Hardesty',     team: 'Cleveland Browns',         league: 'NFL', position: 'Running Back' },
  { name: 'Zamir White',           team: 'Las Vegas Raiders',        league: 'NFL', position: 'Running Back' },
  { name: 'Kimani Vidal',          team: 'Los Angeles Chargers',     league: 'NFL', position: 'Running Back' },
  { name: 'Hassan Haskins',        team: 'Tennessee Titans',         league: 'NFL', position: 'Running Back' },
  { name: 'Dylan Laube',           team: 'New England Patriots',     league: 'NFL', position: 'Running Back' },
  { name: 'Jalen Reagor',          team: 'Minnesota Vikings',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Kaden Davis',           team: 'Las Vegas Raiders',        league: 'NFL', position: 'Tight End' },
  { name: 'Eric Tomlinson',        team: 'Denver Broncos',           league: 'NFL', position: 'Tight End' },
  { name: 'Noah Gray',             team: 'Kansas City Chiefs',       league: 'NFL', position: 'Tight End' },
  { name: 'Kolby Harvell-Peel',    team: 'Denver Broncos',           league: 'NFL', position: 'Safety' },
  { name: 'JT Woods',              team: 'Denver Broncos',           league: 'NFL', position: 'Safety' },
  { name: 'Myjai Sanders',         team: 'Carolina Panthers',        league: 'NFL', position: 'Linebacker' },
  { name: 'Tuli Tuipulotu',        team: 'Los Angeles Chargers',     league: 'NFL', position: 'Defensive End' },
  { name: 'Viliami Fehoko',        team: 'San Francisco 49ers',      league: 'NFL', position: 'Defensive End' },
  { name: 'Keion White',           team: 'New England Patriots',     league: 'NFL', position: 'Defensive End' },
  { name: 'Anfernee Jennings',     team: 'New England Patriots',     league: 'NFL', position: 'Linebacker' },
  { name: 'Chubba Hubbard',        team: 'Carolina Panthers',        league: 'NFL', position: 'Running Back' },
  { name: 'Elijah Jones',          team: 'New England Patriots',     league: 'NFL', position: 'Cornerback' },
  { name: 'Jalen McKenzie',        team: 'Los Angeles Rams',         league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Dallis Flowers',        team: 'Pittsburgh Steelers',      league: 'NFL', position: 'Cornerback' },
  { name: 'Sidy Sow',              team: 'New England Patriots',     league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Mark Evans II',         team: 'Cincinnati Bengals',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Jaquarii Roberson',     team: 'Tampa Bay Buccaneers',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Chris Olave',           team: 'New Orleans Saints',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Daewood Davis',         team: 'Buffalo Bills',            league: 'NFL', position: 'Wide Receiver' },

  // ── MLB: Triple-A call-ups, long relievers, < 100 career appearances ──
  { name: 'Nolan Schanuel',        team: 'Los Angeles Angels',       league: 'MLB', position: 'First Baseman' },
  { name: 'Tanner Bibee',          team: 'Cleveland Guardians',      league: 'MLB', position: 'Pitcher' },
  { name: 'Gavin Williams',        team: 'Cleveland Guardians',      league: 'MLB', position: 'Pitcher' },
  { name: 'Emmet Sheehan',         team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Pitcher' },
  { name: 'Bryan Ramos',           team: 'Chicago White Sox',        league: 'MLB', position: 'Third Baseman' },
  { name: 'José Cuas',             team: 'Chicago Cubs',             league: 'MLB', position: 'Pitcher' },
  { name: 'Jared Shuster',         team: 'Atlanta Braves',           league: 'MLB', position: 'Pitcher' },
  { name: 'Dylan Dodd',            team: 'Atlanta Braves',           league: 'MLB', position: 'Pitcher' },
  { name: 'Jose Guzman',           team: 'Texas Rangers',            league: 'MLB', position: 'Pitcher' },
  { name: 'Wyatt Langford',        team: 'Texas Rangers',            league: 'MLB', position: 'Outfielder' },
  { name: 'Brock Porter',          team: 'Texas Rangers',            league: 'MLB', position: 'Pitcher' },
  { name: 'Jackson Holliday',      team: 'Baltimore Orioles',        league: 'MLB', position: 'Shortstop' },
  { name: 'Colt Keith',            team: 'Detroit Tigers',           league: 'MLB', position: 'Second Baseman' },
  { name: 'Parker Meadows',        team: 'Detroit Tigers',           league: 'MLB', position: 'Outfielder' },
  { name: 'Ty Madden',             team: 'Detroit Tigers',           league: 'MLB', position: 'Pitcher' },
  { name: 'Keider Montero',        team: 'Detroit Tigers',           league: 'MLB', position: 'Pitcher' },
  { name: 'Max Meyer',             team: 'Miami Marlins',            league: 'MLB', position: 'Pitcher' },
  { name: 'Jacob Berry',           team: 'Miami Marlins',            league: 'MLB', position: 'Outfielder' },
  { name: 'Kyle Nicolas',          team: 'Miami Marlins',            league: 'MLB', position: 'Pitcher' },
  { name: 'Joey Wiemer',           team: 'Milwaukee Brewers',        league: 'MLB', position: 'Outfielder' },
  { name: 'Sal Frelick',           team: 'Milwaukee Brewers',        league: 'MLB', position: 'Outfielder' },
  { name: 'Tobias Myers',          team: 'Milwaukee Brewers',        league: 'MLB', position: 'Pitcher' },
  { name: 'Owen White',            team: 'Texas Rangers',            league: 'MLB', position: 'Pitcher' },
  { name: 'Brendan Donovan',       team: 'St. Louis Cardinals',      league: 'MLB', position: 'Utility' },
  { name: 'Gordon Graceffo',       team: 'St. Louis Cardinals',      league: 'MLB', position: 'Pitcher' },
  { name: 'Andre Pallante',        team: 'St. Louis Cardinals',      league: 'MLB', position: 'Pitcher' },
  { name: 'Sem Robberse',          team: 'Toronto Blue Jays',        league: 'MLB', position: 'Pitcher' },
  { name: 'Ricky Tiedemann',       team: 'Toronto Blue Jays',        league: 'MLB', position: 'Pitcher' },
  { name: 'Hagen Danner',          team: 'Toronto Blue Jays',        league: 'MLB', position: 'Catcher' },
  { name: 'Matt Waldron',          team: 'San Diego Padres',         league: 'MLB', position: 'Pitcher' },
  { name: 'Dylan Lesko',           team: 'San Diego Padres',         league: 'MLB', position: 'Pitcher' },
  { name: 'Bryce Jarvis',          team: 'Arizona Diamondbacks',     league: 'MLB', position: 'Pitcher' },
  { name: 'Drew Romo',             team: 'Colorado Rockies',         league: 'MLB', position: 'Catcher' },
  { name: 'Zac Veen',              team: 'Colorado Rockies',         league: 'MLB', position: 'Outfielder' },
  { name: 'Adael Amador',          team: 'Colorado Rockies',         league: 'MLB', position: 'Shortstop' },
  { name: 'Tanner Tully',          team: 'Cleveland Guardians',      league: 'MLB', position: 'Pitcher' },
  { name: 'Sammy Natera Jr.',      team: 'Cleveland Guardians',      league: 'MLB', position: 'Infielder' },
  { name: 'David Festa',           team: 'Minnesota Twins',          league: 'MLB', position: 'Pitcher' },
  { name: 'Charlie Mack',          team: 'Philadelphia Phillies',    league: 'MLB', position: 'Infielder' },
  { name: 'Mick Abel',             team: 'Philadelphia Phillies',    league: 'MLB', position: 'Pitcher' },
  { name: 'Andrew Painter',        team: 'Philadelphia Phillies',    league: 'MLB', position: 'Pitcher' },
  { name: 'Justin Crawford',       team: 'Philadelphia Phillies',    league: 'MLB', position: 'Outfielder' },
  { name: 'Spencer Jones',         team: 'New York Yankees',         league: 'MLB', position: 'Outfielder' },
  { name: 'Caleb Durbin',          team: 'New York Yankees',         league: 'MLB', position: 'Infielder' },
  { name: 'Ben Rice',              team: 'New York Yankees',         league: 'MLB', position: 'First Baseman' },
  { name: 'George Lomanto Jr.',    team: 'Boston Red Sox',           league: 'MLB', position: 'Outfielder' },
  { name: 'Kyle Teel',             team: 'Boston Red Sox',           league: 'MLB', position: 'Catcher' },
  { name: 'Marcelo Mayer',         team: 'Boston Red Sox',           league: 'MLB', position: 'Shortstop' },
  { name: 'Roman Anthony',         team: 'Boston Red Sox',           league: 'MLB', position: 'Outfielder' },
  { name: 'Matthew Lugo',          team: 'Boston Red Sox',           league: 'MLB', position: 'Shortstop' },

  // ── NHL: Fourth-liners, AHL call-ups, < 20 career games ──
  { name: 'Antti Saarela',         team: 'Carolina Hurricanes',      league: 'NHL', position: 'Center' },
  { name: 'Zach Aston-Reese',      team: 'Toronto Maple Leafs',      league: 'NHL', position: 'Left Wing' },
  { name: 'Noel Acciari',          team: 'St. Louis Blues',          league: 'NHL', position: 'Right Wing' },
  { name: 'Lucas Carlsson',        team: 'San Jose Sharks',          league: 'NHL', position: 'Defenseman' },
  { name: 'Sampo Ranta',           team: 'Chicago Blackhawks',       league: 'NHL', position: 'Left Wing' },
  { name: 'Joey Anderson',         team: 'Arizona Coyotes',          league: 'NHL', position: 'Right Wing' },
  { name: 'Artem Anisimov',        team: 'Ottawa Senators',          league: 'NHL', position: 'Center' },
  { name: 'Jayden Struble',        team: 'Montreal Canadiens',       league: 'NHL', position: 'Defenseman' },
  { name: 'Mattias Norlinder',     team: 'Montreal Canadiens',       league: 'NHL', position: 'Defenseman' },
  { name: 'Rafaël Harvey-Pinard',  team: 'Montreal Canadiens',       league: 'NHL', position: 'Left Wing' },
  { name: 'Jesse Ylönen',          team: 'Montreal Canadiens',       league: 'NHL', position: 'Right Wing' },
  { name: 'Daniil Miromanov',      team: 'Ottawa Senators',          league: 'NHL', position: 'Defenseman' },
  { name: 'Cole Reinhardt',        team: 'Winnipeg Jets',            league: 'NHL', position: 'Left Wing' },
  { name: 'Dylan Samberg',         team: 'Winnipeg Jets',            league: 'NHL', position: 'Defenseman' },
  { name: 'Ville Heinola',         team: 'Winnipeg Jets',            league: 'NHL', position: 'Defenseman' },
  { name: 'Axel Jonsson-Fjallby',  team: 'Washington Capitals',      league: 'NHL', position: 'Left Wing' },
  { name: 'Brian Pinho',           team: 'New Jersey Devils',        league: 'NHL', position: 'Center' },
  { name: 'Reilly Walsh',          team: 'New Jersey Devils',        league: 'NHL', position: 'Defenseman' },
  { name: 'Jake Allen',            team: 'New Jersey Devils',        league: 'NHL', position: 'Goalie' },
  { name: 'Nikita Okhotiuk',       team: 'New Jersey Devils',        league: 'NHL', position: 'Defenseman' },
  { name: 'Chase Priskie',         team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Defenseman' },
  { name: 'Denton Mateychuk',      team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Defenseman' },
  { name: 'James Malatesta',       team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Right Wing' },
  { name: 'Kirill Marchenko',      team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Right Wing' },
  { name: 'Joakim Kemell',         team: 'Nashville Predators',      league: 'NHL', position: 'Right Wing' },
  { name: 'Luke Evangelista',      team: 'Nashville Predators',      league: 'NHL', position: 'Right Wing' },
  { name: 'Zachary L\'Heureux',    team: 'Nashville Predators',      league: 'NHL', position: 'Left Wing' },
  { name: 'Mark Jankowski',        team: 'Seattle Kraken',           league: 'NHL', position: 'Center' },
  { name: 'Kaedan Korczak',        team: 'Seattle Kraken',           league: 'NHL', position: 'Defenseman' },
  { name: 'Gustav Olofsson',       team: 'Minnesota Wild',           league: 'NHL', position: 'Defenseman' },
  { name: 'Andrei Chilikov',       team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Right Wing' },
  { name: 'Adam Raska',            team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Right Wing' },
  { name: 'Justin Sourdif',        team: 'Vancouver Canucks',        league: 'NHL', position: 'Center' },
  { name: 'Aidan McDonough',       team: 'Vancouver Canucks',        league: 'NHL', position: 'Left Wing' },
  { name: 'Linus Karlsson',        team: 'Buffalo Sabres',           league: 'NHL', position: 'Right Wing' },
  { name: 'Ryan Johnson',          team: 'Buffalo Sabres',           league: 'NHL', position: 'Center' },
  { name: 'Isak Rosen',            team: 'Buffalo Sabres',           league: 'NHL', position: 'Right Wing' },
  { name: 'JJ Peterka',            team: 'Buffalo Sabres',           league: 'NHL', position: 'Right Wing' },
  { name: 'Lukas Rousek',          team: 'Buffalo Sabres',           league: 'NHL', position: 'Right Wing' },
  { name: 'Brandon Biro',          team: 'Buffalo Sabres',           league: 'NHL', position: 'Center' },
  { name: 'Nikolas Matinpalo',     team: 'Carolina Hurricanes',      league: 'NHL', position: 'Center' },
  { name: 'Brendan Lemieux',       team: 'Los Angeles Kings',        league: 'NHL', position: 'Left Wing' },
  { name: 'Samuel Bolduc',         team: 'New York Islanders',       league: 'NHL', position: 'Defenseman' },
  { name: 'Julien Gauthier',       team: 'New York Rangers',         league: 'NHL', position: 'Right Wing' },
  { name: 'Tyler Pitlick',         team: 'Calgary Flames',           league: 'NHL', position: 'Right Wing' },
  { name: 'Nick DeSimone',         team: 'San Jose Sharks',          league: 'NHL', position: 'Defenseman' },
  { name: 'Tristen Robins',        team: 'Ottawa Senators',          league: 'NHL', position: 'Center' },
  { name: 'Roby Jarventie',        team: 'Ottawa Senators',          league: 'NHL', position: 'Left Wing' },
  { name: 'Eeli Tolvanen',         team: 'Seattle Kraken',           league: 'NHL', position: 'Right Wing' },
  { name: 'Maxim Letunov',         team: 'Detroit Red Wings',        league: 'NHL', position: 'Center' },
];

const BALL_KNOWLEDGE_ATHLETES = BALL_KNOWLEDGE_RAW.map((a, i) => ({
  ...a,
  id: `bk_${i}`,
  photoUrl: '',
  emoji: LEAGUE_EMOJI[a.league] || '🏅',
}));

// ─────────────────────────────────────────────────────────────────────────────
// TheSportsDB helpers — only used as supplemental search for BK photo lookup
// ─────────────────────────────────────────────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const searchPlayerPhoto = async (name) => {
  try {
    const r = await fetch(`${SPORTSDB_BASE}/searchplayers.php?p=${encodeURIComponent(name)}`);
    const d = await r.json();
    const players = d.player || [];
    for (const p of players) {
      const url = p.strCutout || p.strThumb || '';
      if (url && url.startsWith('http')) return url;
    }
    return '';
  } catch { return ''; }
};

const BK_PHOTO_CACHE_KEY = 'bki_bk_photos_v1';

const getBKPhotoCache = () => {
  try { return JSON.parse(sessionStorage.getItem(BK_PHOTO_CACHE_KEY) || '{}'); } catch { return {}; }
};
const saveBKPhotoCache = (cache) => {
  try { sessionStorage.setItem(BK_PHOTO_CACHE_KEY, JSON.stringify(cache)); } catch {}
};

// ─────────────────────────────────────────────────────────────────────────────
// Multi-source image fallback for Normal / Legends athletes
// ─────────────────────────────────────────────────────────────────────────────

// Encode a name for URL use
const enc = (n) => encodeURIComponent(n);

// Build candidate URLs for a known athlete (Normal/Legends)
const getImageCandidates = (athlete) => {
  const name = athlete.name;
  const nameDash = name.replace(/\s+/g, '-').replace(/['.]/g, '').toLowerCase();
  const nameUnderscore = name.replace(/\s+/g, '_');
  const urls = [];

  // 1. TheSportsDB search (returns cutout + thumb)
  // (handled separately via API call — see fetchNLPhoto below)

  // 2. Wikipedia REST API thumbnail
  urls.push(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc(name)}`);  // metadata, not direct img

  // 3. ESPN athlete image patterns
  if (athlete.league === 'NBA') {
    urls.push(`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${nameDash}.png&w=350&h=254`);
  } else if (athlete.league === 'NFL') {
    urls.push(`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${nameDash}.png&w=350&h=254`);
  } else if (athlete.league === 'MLB') {
    urls.push(`https://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/${nameDash}.png&w=350&h=254`);
  } else if (athlete.league === 'NHL') {
    urls.push(`https://a.espncdn.com/combiner/i?img=/i/headshots/nhl/players/full/${nameDash}.png&w=350&h=254`);
  }

  return urls;
};

// Fetch a photo URL for a Normal/Legends athlete using TheSportsDB search
const fetchNLPhoto = async (athlete) => {
  const name = athlete.name;
  try {
    const r = await fetch(`${SPORTSDB_BASE}/searchplayers.php?p=${enc(name)}`);
    const d = await r.json();
    const players = d.player || [];
    // Prefer exact name match
    const exact = players.find(p => p.strPlayer?.toLowerCase() === name.toLowerCase());
    const candidate = exact || players[0];
    if (candidate) {
      const url = candidate.strCutout || candidate.strThumb || '';
      if (url && url.startsWith('http')) return url;
    }
  } catch {}
  return null;
};

// Fetch Wikipedia thumbnail for legends
const fetchWikiPhoto = async (name) => {
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc(name)}`);
    const d = await r.json();
    const url = d.thumbnail?.source || d.originalimage?.source || '';
    if (url && url.startsWith('http')) return url;
  } catch {}
  return null;
};

// Run the full fallback chain for a Normal/Legends athlete
// Returns the first confirmed working image URL, or null
const resolveAthleteImage = async (athlete, isLegends) => {
  // Step 1: TheSportsDB (best structured data)
  const sportsdbUrl = await fetchNLPhoto(athlete);
  if (sportsdbUrl) {
    const ok = await validateImage(sportsdbUrl);
    if (ok) return sportsdbUrl;
  }

  // Step 2: Wikipedia (especially good for legends)
  if (isLegends) {
    const wikiUrl = await fetchWikiPhoto(athlete.name);
    if (wikiUrl) {
      const ok = await validateImage(wikiUrl);
      if (ok) return wikiUrl;
    }
  }

  // Step 3: Try ESPN direct image URL patterns
  const nameDash = athlete.name.replace(/\s+/g, '-').replace(/['.]/g, '').toLowerCase();
  const leagueKey = athlete.league.toLowerCase();
  const espnUrl = `https://a.espncdn.com/combiner/i?img=/i/headshots/${leagueKey}/players/full/${nameDash}.png&w=350&h=254`;
  const espnOk = await validateImage(espnUrl);
  if (espnOk) return espnUrl;

  // For legends, also try Wikipedia as final attempt if not tried yet
  if (!isLegends) {
    const wikiUrl = await fetchWikiPhoto(athlete.name);
    if (wikiUrl) {
      const ok = await validateImage(wikiUrl);
      if (ok) return wikiUrl;
    }
  }

  return null;
};

const NL_PHOTO_CACHE_KEY = 'bki_nl_photos_v2';
const getNLPhotoCache = () => {
  try { return JSON.parse(sessionStorage.getItem(NL_PHOTO_CACHE_KEY) || '{}'); } catch { return {}; }
};
const saveNLPhotoCache = (cache) => {
  try { sessionStorage.setItem(NL_PHOTO_CACHE_KEY, JSON.stringify(cache)); } catch {}
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export const buildAthletePool = async (selectedLeagues, difficulty, onProgress) => {
  // NORMAL — active players, photos resolved via fallback chain
  if (difficulty === 'normal') {
    onProgress?.('Loading Normal roster...');
    await new Promise(r => setTimeout(r, 300));
    const pool = NORMAL_ATHLETES.filter(a => selectedLeagues.includes(a.league));
    return pool.length > 0 ? pool : NORMAL_ATHLETES;
  }

  // LEGENDS — iconic retired players, photos resolved via fallback chain (incl. Wikipedia)
  if (difficulty === 'legends') {
    onProgress?.('Loading Legends roster...');
    await new Promise(r => setTimeout(r, 300));
    const pool = LEGENDS_ATHLETES.filter(a => selectedLeagues.includes(a.league));
    return pool.length > 0 ? pool : LEGENDS_ATHLETES;
  }

  // BALL KNOWLEDGE — hardcoded obscure active players, photos fetched via API
  const filteredBK = BALL_KNOWLEDGE_ATHLETES.filter(a => selectedLeagues.includes(a.league));
  const pool = filteredBK.length > 0 ? filteredBK : BALL_KNOWLEDGE_ATHLETES;

  // Fetch and cache photos in batches
  const photoCache = getBKPhotoCache();
  const needsPhoto = pool.filter(a => !photoCache[a.id]);

  if (needsPhoto.length > 0) {
    onProgress?.('Finding athlete photos... 0%');
    const BATCH = 8;
    for (let i = 0; i < needsPhoto.length; i += BATCH) {
      const batch = needsPhoto.slice(i, i + BATCH);
      await Promise.all(batch.map(async a => {
        const url = await searchPlayerPhoto(a.name);
        photoCache[a.id] = url || 'NONE';
      }));
      const pct = Math.min(Math.round(((i + BATCH) / needsPhoto.length) * 100), 100);
      onProgress?.(`Finding athlete photos... ${pct}%`);
    }
    saveBKPhotoCache(photoCache);
  } else {
    onProgress?.('Loading Ball Knowledge roster...');
    await new Promise(r => setTimeout(r, 300));
  }

  // Attach photos to pool entries
  const withPhotos = pool.map(a => ({
    ...a,
    photoUrl: photoCache[a.id] === 'NONE' ? '' : (photoCache[a.id] || ''),
  }));

  return withPhotos;
};

export const pickAthlete = (pool, usedIds = []) => {
  if (!pool || pool.length === 0) return null;
  const available = pool.filter(a => !usedIds.includes(a.id));
  const src = available.length > 0 ? available : pool;
  return src[Math.floor(Math.random() * src.length)];
};

// Picks an athlete with a confirmed working image.
// For Normal/Legends: uses multi-source fallback chain (SportsDB → Wikipedia → ESPN).
// For Ball Knowledge: validates existing photoUrl as-is (untouched).
export const pickValidatedAthlete = async (pool, usedIds = [], onProgress, difficulty) => {
  if (!pool || pool.length === 0) return null;

  const available = pool.filter(a => !usedIds.includes(a.id));
  const src = available.length > 0 ? available : pool;
  const shuffled = [...src].sort(() => Math.random() - 0.5);

  const isBallKnowledge = difficulty === 'ballknowledge';

  // Ball Knowledge — validate existing photoUrl, skip athletes with no working image
  if (isBallKnowledge) {
    onProgress?.('Validating athlete photo...');
    for (const athlete of shuffled) {
      if (!athlete.photoUrl) continue;
      const ok = await validateImage(athlete.photoUrl);
      if (ok) return athlete;
    }
    return shuffled[0] || null;
  }

  // Normal / Legends — use photo cache + multi-source fallback chain
  const isLegends = difficulty === 'legends';
  const photoCache = getNLPhotoCache();
  onProgress?.('Finding athlete photo...');

  for (const athlete of shuffled) {
    // Check session cache first
    if (photoCache[athlete.id]) {
      const cached = photoCache[athlete.id];
      if (cached !== 'NONE') {
        return { ...athlete, photoUrl: cached };
      }
      continue; // previously confirmed broken, skip
    }

    // Run fallback chain
    const resolved = await resolveAthleteImage(athlete, isLegends);
    if (resolved) {
      photoCache[athlete.id] = resolved;
      saveNLPhotoCache(photoCache);
      return { ...athlete, photoUrl: resolved };
    } else {
      photoCache[athlete.id] = 'NONE';
      saveNLPhotoCache(photoCache);
    }
  }

  // Absolute last resort — return athlete without image requirement
  return shuffled[0] || null;
};

export const getHint = (athlete) => {
  if (!athlete) return 'Unknown';
  const hints = [];
  const pos = (athlete.position || '').toLowerCase();

  if      (pos.includes('quarterback'))  hints.push('Quarterback');
  else if (pos.includes('wide receiver'))hints.push('Wide Receiver');
  else if (pos.includes('running back')) hints.push('Running Back');
  else if (pos.includes('linebacker'))   hints.push('Linebacker');
  else if (pos.includes('tight end'))    hints.push('Tight End');
  else if (pos.includes('cornerback'))   hints.push('Cornerback');
  else if (pos.includes('safety'))       hints.push('Safety');
  else if (pos.includes('defensive end'))hints.push('Defensive End');
  else if (pos.includes('lineman') || pos.includes('tackle') || pos.includes('guard')) hints.push('Lineman');
  else if (pos.includes('point guard'))  hints.push('Point Guard');
  else if (pos.includes('shooting guard'))hints.push('Shooting Guard');
  else if (pos.includes('small forward'))hints.push('Small Forward');
  else if (pos.includes('power forward'))hints.push('Power Forward');
  else if (pos === 'center' || pos === 'c') hints.push('Center');
  else if (pos.includes('pitcher'))      hints.push('Pitcher');
  else if (pos.includes('catcher'))      hints.push('Catcher');
  else if (pos.includes('shortstop'))    hints.push('Shortstop');
  else if (pos.includes('outfield'))     hints.push('Outfielder');
  else if (pos.includes('first base') || pos === '1b')  hints.push('First Baseman');
  else if (pos.includes('second base') || pos === '2b') hints.push('Second Baseman');
  else if (pos.includes('third base') || pos === '3b')  hints.push('Third Baseman');
  else if (pos.includes('designated'))   hints.push('Designated Hitter');
  else if (pos.includes('goalie') || pos.includes('goaltender')) hints.push('Goalie');
  else if (pos.includes('winger') || pos === 'rw' || pos === 'lw') hints.push('Winger');
  else if (pos.includes('defenseman'))   hints.push('Defenseman');
  else if (pos.includes('forward'))      hints.push('Forward');
  else if (athlete.position)             hints.push(athlete.position);

  const firstName = (athlete.name || '').split(' ')[0];
  if (firstName) hints.push(`First name starts with "${firstName[0].toUpperCase()}"`);
  if (athlete.team) {
    const lastWord = athlete.team.split(' ').pop();
    if (lastWord && lastWord.length > 3) hints.push(`Team: ${lastWord}`);
  }

  const posHint = hints[0];
  const others  = hints.slice(1);
  if (posHint && (others.length === 0 || Math.random() < 0.6)) return posHint;
  if (others.length > 0) return others[Math.floor(Math.random() * others.length)];
  return posHint || 'Unknown';
};