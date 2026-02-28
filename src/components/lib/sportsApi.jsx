// ─────────────────────────────────────────────────────────────────────────────
// Sports API — athlete pools for Ball Knowing Impostor
// ─────────────────────────────────────────────────────────────────────────────

import { getLoadingPhrase } from './loadingPhrases';

const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

export const LEAGUE_EMOJI = {
  MLB: '⚾', NBA: '🏀', NFL: '🏈', NHL: '🏒',
};

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
// SESSION HISTORY — global, resets only on "Change Settings" (cleared from Home)
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_HISTORY_KEY = 'bki_session_history_v1';

export const getSessionHistory = () => {
  try { return JSON.parse(sessionStorage.getItem(SESSION_HISTORY_KEY) || '[]'); } catch { return []; }
};
export const addToSessionHistory = (id) => {
  const h = getSessionHistory();
  if (!h.includes(id)) { h.push(id); try { sessionStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(h)); } catch {} }
};
export const clearSessionHistory = () => {
  try { sessionStorage.removeItem(SESSION_HISTORY_KEY); } catch {}
};

// ─────────────────────────────────────────────────────────────────────────────
// SHUFFLE utility
// ─────────────────────────────────────────────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─────────────────────────────────────────────────────────────────────────────
// NORMAL MODE — Active / recent players (150+ per league)
// ─────────────────────────────────────────────────────────────────────────────
const NORMAL_ATHLETES_RAW = [
  // ── NBA (150+) ──
  { name: 'LeBron James',          team: 'Los Angeles Lakers',       league: 'NBA', position: 'Small Forward' },
  { name: 'Stephen Curry',         team: 'Golden State Warriors',    league: 'NBA', position: 'Point Guard' },
  { name: 'Kevin Durant',          team: 'Phoenix Suns',             league: 'NBA', position: 'Small Forward' },
  { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks',          league: 'NBA', position: 'Power Forward' },
  { name: 'Nikola Jokic',          team: 'Denver Nuggets',           league: 'NBA', position: 'Center' },
  { name: 'Luka Doncic',           team: 'Dallas Mavericks',         league: 'NBA', position: 'Point Guard' },
  { name: 'Jayson Tatum',          team: 'Boston Celtics',           league: 'NBA', position: 'Small Forward' },
  { name: 'Joel Embiid',           team: 'Philadelphia 76ers',       league: 'NBA', position: 'Center' },
  { name: 'Damian Lillard',        team: 'Milwaukee Bucks',          league: 'NBA', position: 'Point Guard' },
  { name: 'Anthony Davis',         team: 'Los Angeles Lakers',       league: 'NBA', position: 'Center' },
  { name: 'Devin Booker',          team: 'Phoenix Suns',             league: 'NBA', position: 'Shooting Guard' },
  { name: 'Kawhi Leonard',         team: 'Los Angeles Clippers',     league: 'NBA', position: 'Small Forward' },
  { name: 'Jimmy Butler',          team: 'Golden State Warriors',    league: 'NBA', position: 'Small Forward' },
  { name: 'Trae Young',            team: 'Atlanta Hawks',            league: 'NBA', position: 'Point Guard' },
  { name: 'Zion Williamson',       team: 'New Orleans Pelicans',     league: 'NBA', position: 'Power Forward' },
  { name: 'Ja Morant',             team: 'Memphis Grizzlies',        league: 'NBA', position: 'Point Guard' },
  { name: 'Anthony Edwards',       team: 'Minnesota Timberwolves',   league: 'NBA', position: 'Shooting Guard' },
  { name: 'Jaylen Brown',          team: 'Boston Celtics',           league: 'NBA', position: 'Shooting Guard' },
  { name: 'Bam Adebayo',           team: 'Miami Heat',               league: 'NBA', position: 'Center' },
  { name: 'Donovan Mitchell',      team: 'Cleveland Cavaliers',      league: 'NBA', position: 'Shooting Guard' },
  { name: 'Kyrie Irving',          team: 'Dallas Mavericks',         league: 'NBA', position: 'Point Guard' },
  { name: 'Paul George',           team: 'Philadelphia 76ers',       league: 'NBA', position: 'Small Forward' },
  { name: 'Draymond Green',        team: 'Golden State Warriors',    league: 'NBA', position: 'Power Forward' },
  { name: 'Rudy Gobert',           team: 'Minnesota Timberwolves',   league: 'NBA', position: 'Center' },
  { name: 'Karl-Anthony Towns',    team: 'New York Knicks',          league: 'NBA', position: 'Center' },
  { name: 'Pascal Siakam',         team: 'Indiana Pacers',           league: 'NBA', position: 'Power Forward' },
  { name: 'Tyrese Haliburton',     team: 'Indiana Pacers',           league: 'NBA', position: 'Point Guard' },
  { name: 'Shai Gilgeous-Alexander', team: 'Oklahoma City Thunder',  league: 'NBA', position: 'Point Guard' },
  { name: 'Cade Cunningham',       team: 'Detroit Pistons',          league: 'NBA', position: 'Point Guard' },
  { name: 'Evan Mobley',           team: 'Cleveland Cavaliers',      league: 'NBA', position: 'Center' },
  { name: 'Scottie Barnes',        team: 'Toronto Raptors',          league: 'NBA', position: 'Power Forward' },
  { name: 'Josh Giddey',           team: 'Chicago Bulls',            league: 'NBA', position: 'Point Guard' },
  { name: 'Jalen Green',           team: 'Houston Rockets',          league: 'NBA', position: 'Shooting Guard' },
  { name: 'Paolo Banchero',        team: 'Orlando Magic',            league: 'NBA', position: 'Power Forward' },
  { name: 'Franz Wagner',          team: 'Orlando Magic',            league: 'NBA', position: 'Small Forward' },
  { name: 'LaMelo Ball',           team: 'Charlotte Hornets',        league: 'NBA', position: 'Point Guard' },
  { name: 'OG Anunoby',            team: 'New York Knicks',          league: 'NBA', position: 'Small Forward' },
  { name: 'Julius Randle',         team: 'Minnesota Timberwolves',   league: 'NBA', position: 'Power Forward' },
  { name: 'Chris Paul',            team: 'Golden State Warriors',    league: 'NBA', position: 'Point Guard' },
  { name: 'Russell Westbrook',     team: 'Los Angeles Clippers',     league: 'NBA', position: 'Point Guard' },
  { name: 'James Harden',          team: 'Los Angeles Clippers',     league: 'NBA', position: 'Shooting Guard' },
  { name: 'De\'Aaron Fox',         team: 'Sacramento Kings',         league: 'NBA', position: 'Point Guard' },
  { name: 'Darius Garland',        team: 'Cleveland Cavaliers',      league: 'NBA', position: 'Point Guard' },
  { name: 'RJ Barrett',           team: 'Toronto Raptors',           league: 'NBA', position: 'Shooting Guard' },
  { name: 'Khris Middleton',       team: 'Milwaukee Bucks',          league: 'NBA', position: 'Small Forward' },
  { name: 'Andrew Wiggins',        team: 'Golden State Warriors',    league: 'NBA', position: 'Small Forward' },
  { name: 'Brandon Ingram',        team: 'New Orleans Pelicans',     league: 'NBA', position: 'Small Forward' },
  { name: 'Miles Bridges',         team: 'Charlotte Hornets',        league: 'NBA', position: 'Small Forward' },
  { name: 'Dejounte Murray',       team: 'Atlanta Hawks',            league: 'NBA', position: 'Point Guard' },
  { name: 'Alperen Sengun',        team: 'Houston Rockets',          league: 'NBA', position: 'Center' },
  { name: 'Amen Thompson',         team: 'Houston Rockets',          league: 'NBA', position: 'Small Forward' },
  { name: 'Ausar Thompson',        team: 'Detroit Pistons',          league: 'NBA', position: 'Small Forward' },
  { name: 'Cam Thomas',            team: 'Brooklyn Nets',            league: 'NBA', position: 'Shooting Guard' },
  { name: 'Jabari Smith Jr.',      team: 'Houston Rockets',          league: 'NBA', position: 'Power Forward' },
  { name: 'Walker Kessler',        team: 'Utah Jazz',                league: 'NBA', position: 'Center' },
  { name: 'Lauri Markkanen',       team: 'Utah Jazz',                league: 'NBA', position: 'Power Forward' },
  { name: 'Nikola Vucevic',        team: 'Chicago Bulls',            league: 'NBA', position: 'Center' },
  { name: 'Zach LaVine',           team: 'Chicago Bulls',            league: 'NBA', position: 'Shooting Guard' },
  { name: 'DeMar DeRozan',         team: 'Sacramento Kings',         league: 'NBA', position: 'Small Forward' },
  { name: 'Brook Lopez',           team: 'Milwaukee Bucks',          league: 'NBA', position: 'Center' },
  { name: 'Kristaps Porzingis',    team: 'Boston Celtics',           league: 'NBA', position: 'Center' },
  { name: 'Jrue Holiday',          team: 'Boston Celtics',           league: 'NBA', position: 'Shooting Guard' },
  { name: 'Al Horford',            team: 'Boston Celtics',           league: 'NBA', position: 'Center' },
  { name: 'Fred VanVleet',         team: 'Houston Rockets',          league: 'NBA', position: 'Point Guard' },
  { name: 'Mikal Bridges',         team: 'New York Knicks',          league: 'NBA', position: 'Small Forward' },
  { name: 'Jordan Poole',          team: 'Washington Wizards',       league: 'NBA', position: 'Shooting Guard' },
  { name: 'Tyrese Maxey',          team: 'Philadelphia 76ers',       league: 'NBA', position: 'Point Guard' },
  { name: 'Tobias Harris',         team: 'Philadelphia 76ers',       league: 'NBA', position: 'Power Forward' },
  { name: 'Kentavious Caldwell-Pope', team: 'Orlando Magic',         league: 'NBA', position: 'Shooting Guard' },
  { name: 'Spencer Dinwiddie',     team: 'Brooklyn Nets',            league: 'NBA', position: 'Point Guard' },
  { name: 'Clint Capela',          team: 'Atlanta Hawks',            league: 'NBA', position: 'Center' },
  { name: 'Terry Rozier',          team: 'Miami Heat',               league: 'NBA', position: 'Point Guard' },
  { name: 'Josh Hart',             team: 'New York Knicks',          league: 'NBA', position: 'Shooting Guard' },
  { name: 'Jalen Brunson',         team: 'New York Knicks',          league: 'NBA', position: 'Point Guard' },
  { name: 'Mike Conley',           team: 'Minnesota Timberwolves',   league: 'NBA', position: 'Point Guard' },
  { name: 'Donte DiVincenzo',      team: 'New York Knicks',          league: 'NBA', position: 'Shooting Guard' },
  { name: 'Keegan Murray',         team: 'Sacramento Kings',         league: 'NBA', position: 'Small Forward' },
  { name: 'Nick Richards',         team: 'Charlotte Hornets',        league: 'NBA', position: 'Center' },
  { name: 'Deandre Ayton',         team: 'Portland Trail Blazers',   league: 'NBA', position: 'Center' },
  { name: 'Jerami Grant',          team: 'Portland Trail Blazers',   league: 'NBA', position: 'Power Forward' },
  { name: 'Anfernee Simons',       team: 'Portland Trail Blazers',   league: 'NBA', position: 'Shooting Guard' },
  { name: 'Shaedon Sharpe',        team: 'Portland Trail Blazers',   league: 'NBA', position: 'Shooting Guard' },
  { name: 'Scoot Henderson',       team: 'Portland Trail Blazers',   league: 'NBA', position: 'Point Guard' },
  { name: 'Deni Avdija',           team: 'Portland Trail Blazers',   league: 'NBA', position: 'Small Forward' },
  { name: 'Myles Turner',          team: 'Indiana Pacers',           league: 'NBA', position: 'Center' },
  { name: 'Bennedict Mathurin',    team: 'Indiana Pacers',           league: 'NBA', position: 'Shooting Guard' },
  { name: 'Obi Toppin',            team: 'Indiana Pacers',           league: 'NBA', position: 'Power Forward' },
  { name: 'Isaiah Hartenstein',    team: 'Oklahoma City Thunder',    league: 'NBA', position: 'Center' },
  { name: 'Luguentz Dort',         team: 'Oklahoma City Thunder',    league: 'NBA', position: 'Shooting Guard' },
  { name: 'Jalen Williams',        team: 'Oklahoma City Thunder',    league: 'NBA', position: 'Small Forward' },
  { name: 'Chet Holmgren',         team: 'Oklahoma City Thunder',    league: 'NBA', position: 'Center' },
  { name: 'Tre Mann',              team: 'Charlotte Hornets',        league: 'NBA', position: 'Point Guard' },
  { name: 'Derrick White',         team: 'Boston Celtics',           league: 'NBA', position: 'Shooting Guard' },
  { name: 'Marcus Smart',          team: 'Memphis Grizzlies',        league: 'NBA', position: 'Point Guard' },
  { name: 'Jaren Jackson Jr.',     team: 'Memphis Grizzlies',        league: 'NBA', position: 'Power Forward' },
  { name: 'Desmond Bane',          team: 'Memphis Grizzlies',        league: 'NBA', position: 'Shooting Guard' },
  { name: 'Talen Horton-Tucker',   team: 'Utah Jazz',                league: 'NBA', position: 'Guard' },
  { name: 'Klay Thompson',         team: 'Dallas Mavericks',         league: 'NBA', position: 'Shooting Guard' },
  { name: 'Bradley Beal',          team: 'Phoenix Suns',             league: 'NBA', position: 'Shooting Guard' },
  { name: 'Victor Wembanyama',     team: 'San Antonio Spurs',        league: 'NBA', position: 'Center' },
  { name: 'Wembanyama',            team: 'San Antonio Spurs',        league: 'NBA', position: 'Center' },
  { name: 'Keldon Johnson',        team: 'San Antonio Spurs',        league: 'NBA', position: 'Small Forward' },
  { name: 'Devin Vassell',         team: 'San Antonio Spurs',        league: 'NBA', position: 'Shooting Guard' },
  { name: 'Jonas Valanciunas',     team: 'New Orleans Pelicans',     league: 'NBA', position: 'Center' },
  { name: 'CJ McCollum',           team: 'New Orleans Pelicans',     league: 'NBA', position: 'Shooting Guard' },
  { name: 'Josh Richardson',       team: 'San Antonio Spurs',        league: 'NBA', position: 'Guard' },
  { name: 'Precious Achiuwa',      team: 'New York Knicks',          league: 'NBA', position: 'Power Forward' },
  { name: 'Immanuel Quickley',     team: 'Toronto Raptors',          league: 'NBA', position: 'Point Guard' },
  { name: 'Gary Trent Jr.',        team: 'Toronto Raptors',          league: 'NBA', position: 'Shooting Guard' },
  { name: 'Gradey Dick',           team: 'Toronto Raptors',          league: 'NBA', position: 'Shooting Guard' },
  { name: 'Herbert Jones',         team: 'New Orleans Pelicans',     league: 'NBA', position: 'Small Forward' },
  { name: 'Aaron Gordon',          team: 'Denver Nuggets',           league: 'NBA', position: 'Power Forward' },
  { name: 'Michael Porter Jr.',    team: 'Denver Nuggets',           league: 'NBA', position: 'Small Forward' },
  { name: 'Jamal Murray',          team: 'Denver Nuggets',           league: 'NBA', position: 'Point Guard' },

  // ── NFL (150+) ──
  { name: 'Patrick Mahomes',       team: 'Kansas City Chiefs',       league: 'NFL', position: 'Quarterback' },
  { name: 'Josh Allen',            team: 'Buffalo Bills',            league: 'NFL', position: 'Quarterback' },
  { name: 'Lamar Jackson',         team: 'Baltimore Ravens',         league: 'NFL', position: 'Quarterback' },
  { name: 'Travis Kelce',          team: 'Kansas City Chiefs',       league: 'NFL', position: 'Tight End' },
  { name: 'Justin Jefferson',      team: 'Minnesota Vikings',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tyreek Hill',           team: 'Miami Dolphins',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Davante Adams',         team: 'Las Vegas Raiders',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Joe Burrow',            team: 'Cincinnati Bengals',       league: 'NFL', position: 'Quarterback' },
  { name: 'Jalen Hurts',           team: 'Philadelphia Eagles',      league: 'NFL', position: 'Quarterback' },
  { name: 'CeeDee Lamb',           team: 'Dallas Cowboys',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Justin Herbert',        team: 'Los Angeles Chargers',     league: 'NFL', position: 'Quarterback' },
  { name: 'Dak Prescott',          team: 'Dallas Cowboys',           league: 'NFL', position: 'Quarterback' },
  { name: 'Ja\'Marr Chase',        team: 'Cincinnati Bengals',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Cooper Kupp',           team: 'Los Angeles Rams',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Christian McCaffrey',   team: 'San Francisco 49ers',      league: 'NFL', position: 'Running Back' },
  { name: 'Derrick Henry',         team: 'Baltimore Ravens',         league: 'NFL', position: 'Running Back' },
  { name: 'Jonathan Taylor',       team: 'Indianapolis Colts',       league: 'NFL', position: 'Running Back' },
  { name: 'Saquon Barkley',        team: 'Philadelphia Eagles',      league: 'NFL', position: 'Running Back' },
  { name: 'Nick Chubb',            team: 'Cleveland Browns',         league: 'NFL', position: 'Running Back' },
  { name: 'Dalvin Cook',           team: 'New York Jets',            league: 'NFL', position: 'Running Back' },
  { name: 'Stefon Diggs',          team: 'Houston Texans',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tee Higgins',           team: 'Cincinnati Bengals',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Deebo Samuel',          team: 'San Francisco 49ers',      league: 'NFL', position: 'Wide Receiver' },
  { name: 'George Kittle',         team: 'San Francisco 49ers',      league: 'NFL', position: 'Tight End' },
  { name: 'Mark Andrews',          team: 'Baltimore Ravens',         league: 'NFL', position: 'Tight End' },
  { name: 'Sam LaPorta',           team: 'Detroit Lions',            league: 'NFL', position: 'Tight End' },
  { name: 'Micah Parsons',         team: 'Dallas Cowboys',           league: 'NFL', position: 'Linebacker' },
  { name: 'Myles Garrett',         team: 'Cleveland Browns',         league: 'NFL', position: 'Defensive End' },
  { name: 'T.J. Watt',             team: 'Pittsburgh Steelers',      league: 'NFL', position: 'Linebacker' },
  { name: 'Nick Bosa',             team: 'San Francisco 49ers',      league: 'NFL', position: 'Defensive End' },
  { name: 'Aaron Donald',          team: 'Los Angeles Rams',         league: 'NFL', position: 'Defensive Tackle' },
  { name: 'Jalen Ramsey',          team: 'Miami Dolphins',           league: 'NFL', position: 'Cornerback' },
  { name: 'Davante Adams',         team: 'Las Vegas Raiders',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tyson Campbell',        team: 'Jacksonville Jaguars',     league: 'NFL', position: 'Cornerback' },
  { name: 'Patrick Surtain II',    team: 'Denver Broncos',           league: 'NFL', position: 'Cornerback' },
  { name: 'Sauce Gardner',         team: 'New York Jets',            league: 'NFL', position: 'Cornerback' },
  { name: 'DeVonta Smith',         team: 'Philadelphia Eagles',      league: 'NFL', position: 'Wide Receiver' },
  { name: 'A.J. Brown',            team: 'Philadelphia Eagles',      league: 'NFL', position: 'Wide Receiver' },
  { name: 'DK Metcalf',            team: 'Seattle Seahawks',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tyler Lockett',         team: 'Seattle Seahawks',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Geno Smith',            team: 'Seattle Seahawks',         league: 'NFL', position: 'Quarterback' },
  { name: 'Brock Purdy',           team: 'San Francisco 49ers',      league: 'NFL', position: 'Quarterback' },
  { name: 'Tua Tagovailoa',        team: 'Miami Dolphins',           league: 'NFL', position: 'Quarterback' },
  { name: 'Trevor Lawrence',       team: 'Jacksonville Jaguars',     league: 'NFL', position: 'Quarterback' },
  { name: 'Jordan Love',           team: 'Green Bay Packers',        league: 'NFL', position: 'Quarterback' },
  { name: 'C.J. Stroud',           team: 'Houston Texans',           league: 'NFL', position: 'Quarterback' },
  { name: 'Bryce Young',           team: 'Carolina Panthers',        league: 'NFL', position: 'Quarterback' },
  { name: 'Anthony Richardson',    team: 'Indianapolis Colts',       league: 'NFL', position: 'Quarterback' },
  { name: 'Caleb Williams',        team: 'Chicago Bears',            league: 'NFL', position: 'Quarterback' },
  { name: 'Sam Howell',            team: 'Washington Commanders',    league: 'NFL', position: 'Quarterback' },
  { name: 'Diontae Johnson',       team: 'Carolina Panthers',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Mike Evans',            team: 'Tampa Bay Buccaneers',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Chris Godwin',          team: 'Tampa Bay Buccaneers',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Terry McLaurin',        team: 'Washington Commanders',    league: 'NFL', position: 'Wide Receiver' },
  { name: 'Jaylen Waddle',         team: 'Miami Dolphins',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Amon-Ra St. Brown',     team: 'Detroit Lions',            league: 'NFL', position: 'Wide Receiver' },
  { name: 'Puka Nacua',            team: 'Los Angeles Rams',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Rashee Rice',           team: 'Kansas City Chiefs',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Amari Cooper',          team: 'Cleveland Browns',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'DJ Moore',              team: 'Chicago Bears',            league: 'NFL', position: 'Wide Receiver' },
  { name: 'Keenan Allen',          team: 'Chicago Bears',            league: 'NFL', position: 'Wide Receiver' },
  { name: 'Davante Adams',         team: 'Las Vegas Raiders',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Garrett Wilson',        team: 'New York Jets',            league: 'NFL', position: 'Wide Receiver' },
  { name: 'Elijah Moore',          team: 'Cleveland Browns',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Michael Pittman Jr.',   team: 'Indianapolis Colts',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Zay Jones',             team: 'Jacksonville Jaguars',     league: 'NFL', position: 'Wide Receiver' },
  { name: 'Christian Watson',      team: 'Green Bay Packers',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Dontayvion Wicks',      team: 'Green Bay Packers',        league: 'NFL', position: 'Wide Receiver' },
  { name: 'Dalton Schultz',        team: 'Houston Texans',           league: 'NFL', position: 'Tight End' },
  { name: 'Dallas Goedert',        team: 'Philadelphia Eagles',      league: 'NFL', position: 'Tight End' },
  { name: 'Kyle Pitts',            team: 'Atlanta Falcons',          league: 'NFL', position: 'Tight End' },
  { name: 'Evan Engram',           team: 'Jacksonville Jaguars',     league: 'NFL', position: 'Tight End' },
  { name: 'Tony Pollard',          team: 'Tennessee Titans',         league: 'NFL', position: 'Running Back' },
  { name: 'Austin Ekeler',         team: 'Washington Commanders',    league: 'NFL', position: 'Running Back' },
  { name: 'Josh Jacobs',           team: 'Green Bay Packers',        league: 'NFL', position: 'Running Back' },
  { name: 'Rachaad White',         team: 'Tampa Bay Buccaneers',     league: 'NFL', position: 'Running Back' },
  { name: 'Jahmyr Gibbs',          team: 'Detroit Lions',            league: 'NFL', position: 'Running Back' },
  { name: 'David Montgomery',      team: 'Detroit Lions',            league: 'NFL', position: 'Running Back' },
  { name: 'Rhamondre Stevenson',   team: 'New England Patriots',     league: 'NFL', position: 'Running Back' },
  { name: 'Joe Mixon',             team: 'Houston Texans',           league: 'NFL', position: 'Running Back' },
  { name: 'Kenneth Walker III',    team: 'Seattle Seahawks',         league: 'NFL', position: 'Running Back' },
  { name: 'Aaron Jones',           team: 'Minnesota Vikings',        league: 'NFL', position: 'Running Back' },
  { name: 'Najee Harris',          team: 'Pittsburgh Steelers',      league: 'NFL', position: 'Running Back' },
  { name: 'Isiah Pacheco',         team: 'Kansas City Chiefs',       league: 'NFL', position: 'Running Back' },
  { name: 'De\'Von Achane',        team: 'Miami Dolphins',           league: 'NFL', position: 'Running Back' },
  { name: 'Kyren Williams',        team: 'Los Angeles Rams',         league: 'NFL', position: 'Running Back' },
  { name: 'Brian Burns',           team: 'New York Giants',          league: 'NFL', position: 'Defensive End' },
  { name: 'Maxx Crosby',           team: 'Las Vegas Raiders',        league: 'NFL', position: 'Defensive End' },
  { name: 'Micah Parsons',         team: 'Dallas Cowboys',           league: 'NFL', position: 'Linebacker' },
  { name: 'Fred Warner',           team: 'San Francisco 49ers',      league: 'NFL', position: 'Linebacker' },
  { name: 'Quay Walker',           team: 'Green Bay Packers',        league: 'NFL', position: 'Linebacker' },
  { name: 'Lavonte David',         team: 'Tampa Bay Buccaneers',     league: 'NFL', position: 'Linebacker' },
  { name: 'Jessie Bates III',      team: 'Atlanta Falcons',          league: 'NFL', position: 'Safety' },
  { name: 'Derwin James',          team: 'Los Angeles Chargers',     league: 'NFL', position: 'Safety' },
  { name: 'Kevin Byard',           team: 'Chicago Bears',            league: 'NFL', position: 'Safety' },
  { name: 'Jordan Poyer',          team: 'Miami Dolphins',           league: 'NFL', position: 'Safety' },
  { name: 'Jaire Alexander',       team: 'Green Bay Packers',        league: 'NFL', position: 'Cornerback' },
  { name: 'Trevon Diggs',          team: 'Dallas Cowboys',           league: 'NFL', position: 'Cornerback' },
  { name: 'Marlon Humphrey',       team: 'Baltimore Ravens',         league: 'NFL', position: 'Cornerback' },
  { name: 'L\'Jarius Sneed',       team: 'Tennessee Titans',         league: 'NFL', position: 'Cornerback' },
  { name: 'Baker Mayfield',        team: 'Tampa Bay Buccaneers',     league: 'NFL', position: 'Quarterback' },
  { name: 'Kirk Cousins',          team: 'Atlanta Falcons',          league: 'NFL', position: 'Quarterback' },
  { name: 'Daniel Jones',          team: 'New York Giants',          league: 'NFL', position: 'Quarterback' },
  { name: 'Aaron Rodgers',         team: 'New York Jets',            league: 'NFL', position: 'Quarterback' },
  { name: 'Russell Wilson',        team: 'Pittsburgh Steelers',      league: 'NFL', position: 'Quarterback' },
  { name: 'Deshaun Watson',        team: 'Cleveland Browns',         league: 'NFL', position: 'Quarterback' },
  { name: 'Matthew Stafford',      team: 'Los Angeles Rams',         league: 'NFL', position: 'Quarterback' },
  { name: 'Derek Carr',            team: 'New Orleans Saints',       league: 'NFL', position: 'Quarterback' },
  { name: 'Tommy DeVito',          team: 'New York Giants',          league: 'NFL', position: 'Quarterback' },
  { name: 'Kendall Fuller',        team: 'Washington Commanders',    league: 'NFL', position: 'Cornerback' },
  { name: 'Jaycee Horn',           team: 'Carolina Panthers',        league: 'NFL', position: 'Cornerback' },
  { name: 'Rashan Gary',           team: 'Green Bay Packers',        league: 'NFL', position: 'Linebacker' },
  { name: 'Aidan Hutchinson',      team: 'Detroit Lions',            league: 'NFL', position: 'Defensive End' },
  { name: 'Will Anderson Jr.',     team: 'Houston Texans',           league: 'NFL', position: 'Defensive End' },
  { name: 'Kayvon Thibodeaux',     team: 'New York Giants',          league: 'NFL', position: 'Defensive End' },

  // ── MLB (150+) ──
  { name: 'Shohei Ohtani',         team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Designated Hitter' },
  { name: 'Mike Trout',            team: 'Los Angeles Angels',       league: 'MLB', position: 'Outfielder' },
  { name: 'Aaron Judge',           team: 'New York Yankees',         league: 'MLB', position: 'Outfielder' },
  { name: 'Mookie Betts',          team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Outfielder' },
  { name: 'Fernando Tatis Jr.',    team: 'San Diego Padres',         league: 'MLB', position: 'Shortstop' },
  { name: 'Ronald Acuna Jr.',      team: 'Atlanta Braves',           league: 'MLB', position: 'Outfielder' },
  { name: 'Freddie Freeman',       team: 'Los Angeles Dodgers',      league: 'MLB', position: 'First Baseman' },
  { name: 'Juan Soto',             team: 'New York Yankees',         league: 'MLB', position: 'Outfielder' },
  { name: 'Julio Rodriguez',       team: 'Seattle Mariners',         league: 'MLB', position: 'Outfielder' },
  { name: 'Yordan Alvarez',        team: 'Houston Astros',           league: 'MLB', position: 'Outfielder' },
  { name: 'Bryce Harper',          team: 'Philadelphia Phillies',    league: 'MLB', position: 'First Baseman' },
  { name: 'Francisco Lindor',      team: 'New York Mets',            league: 'MLB', position: 'Shortstop' },
  { name: 'Trea Turner',           team: 'Philadelphia Phillies',    league: 'MLB', position: 'Shortstop' },
  { name: 'Jose Ramirez',          team: 'Cleveland Guardians',      league: 'MLB', position: 'Third Baseman' },
  { name: 'Nolan Arenado',         team: 'St. Louis Cardinals',      league: 'MLB', position: 'Third Baseman' },
  { name: 'Manny Machado',         team: 'San Diego Padres',         league: 'MLB', position: 'Third Baseman' },
  { name: 'Matt Olson',            team: 'Atlanta Braves',           league: 'MLB', position: 'First Baseman' },
  { name: 'Vladimir Guerrero Jr.', team: 'Toronto Blue Jays',        league: 'MLB', position: 'First Baseman' },
  { name: 'Pete Alonso',           team: 'New York Mets',            league: 'MLB', position: 'First Baseman' },
  { name: 'Bo Bichette',           team: 'Toronto Blue Jays',        league: 'MLB', position: 'Shortstop' },
  { name: 'Corey Seager',          team: 'Texas Rangers',            league: 'MLB', position: 'Shortstop' },
  { name: 'Marcus Semien',         team: 'Texas Rangers',            league: 'MLB', position: 'Second Baseman' },
  { name: 'Paul Goldschmidt',      team: 'St. Louis Cardinals',      league: 'MLB', position: 'First Baseman' },
  { name: 'Austin Riley',          team: 'Atlanta Braves',           league: 'MLB', position: 'Third Baseman' },
  { name: 'Max Fried',             team: 'New York Yankees',         league: 'MLB', position: 'Pitcher' },
  { name: 'Gerrit Cole',           team: 'New York Yankees',         league: 'MLB', position: 'Pitcher' },
  { name: 'Shane Bieber',          team: 'Cleveland Guardians',      league: 'MLB', position: 'Pitcher' },
  { name: 'Sandy Alcantara',       team: 'Miami Marlins',            league: 'MLB', position: 'Pitcher' },
  { name: 'Zack Wheeler',          team: 'Philadelphia Phillies',    league: 'MLB', position: 'Pitcher' },
  { name: 'Aaron Nola',            team: 'Philadelphia Phillies',    league: 'MLB', position: 'Pitcher' },
  { name: 'Logan Webb',            team: 'San Francisco Giants',     league: 'MLB', position: 'Pitcher' },
  { name: 'Corbin Burnes',         team: 'Baltimore Orioles',        league: 'MLB', position: 'Pitcher' },
  { name: 'Framber Valdez',        team: 'Houston Astros',           league: 'MLB', position: 'Pitcher' },
  { name: 'Spencer Strider',       team: 'Atlanta Braves',           league: 'MLB', position: 'Pitcher' },
  { name: 'Dylan Cease',           team: 'San Diego Padres',         league: 'MLB', position: 'Pitcher' },
  { name: 'Kodai Senga',           team: 'New York Mets',            league: 'MLB', position: 'Pitcher' },
  { name: 'Justin Verlander',      team: 'New York Mets',            league: 'MLB', position: 'Pitcher' },
  { name: 'Max Scherzer',          team: 'Texas Rangers',            league: 'MLB', position: 'Pitcher' },
  { name: 'Clayton Kershaw',       team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Pitcher' },
  { name: 'Jacob deGrom',          team: 'Texas Rangers',            league: 'MLB', position: 'Pitcher' },
  { name: 'Tyler Glasnow',         team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Pitcher' },
  { name: 'Pablo Lopez',           team: 'Minnesota Twins',          league: 'MLB', position: 'Pitcher' },
  { name: 'Chris Sale',            team: 'Atlanta Braves',           league: 'MLB', position: 'Pitcher' },
  { name: 'Joe Ryan',              team: 'Minnesota Twins',          league: 'MLB', position: 'Pitcher' },
  { name: 'Lucas Giolito',         team: 'Boston Red Sox',           league: 'MLB', position: 'Pitcher' },
  { name: 'Kevin Gausman',         team: 'Toronto Blue Jays',        league: 'MLB', position: 'Pitcher' },
  { name: 'Carlos Rodon',          team: 'New York Yankees',         league: 'MLB', position: 'Pitcher' },
  { name: 'Sonny Gray',            team: 'St. Louis Cardinals',      league: 'MLB', position: 'Pitcher' },
  { name: 'Kyle Tucker',           team: 'Chicago Cubs',             league: 'MLB', position: 'Outfielder' },
  { name: 'Alex Bregman',          team: 'Houston Astros',           league: 'MLB', position: 'Third Baseman' },
  { name: 'Cody Bellinger',        team: 'Chicago Cubs',             league: 'MLB', position: 'Outfielder' },
  { name: 'Xander Bogaerts',       team: 'San Diego Padres',         league: 'MLB', position: 'Shortstop' },
  { name: 'Adley Rutschman',       team: 'Baltimore Orioles',        league: 'MLB', position: 'Catcher' },
  { name: 'Gunnar Henderson',      team: 'Baltimore Orioles',        league: 'MLB', position: 'Shortstop' },
  { name: 'Anthony Volpe',         team: 'New York Yankees',         league: 'MLB', position: 'Shortstop' },
  { name: 'Bobby Witt Jr.',        team: 'Kansas City Royals',       league: 'MLB', position: 'Shortstop' },
  { name: 'Luis Robert Jr.',       team: 'Chicago White Sox',        league: 'MLB', position: 'Outfielder' },
  { name: 'Eloy Jimenez',          team: 'Chicago White Sox',        league: 'MLB', position: 'Outfielder' },
  { name: 'Jazz Chisholm Jr.',     team: 'New York Yankees',         league: 'MLB', position: 'Third Baseman' },
  { name: 'Elly De La Cruz',       team: 'Cincinnati Reds',          league: 'MLB', position: 'Shortstop' },
  { name: 'CJ Abrams',             team: 'Washington Nationals',     league: 'MLB', position: 'Shortstop' },
  { name: 'Jordan Walker',         team: 'St. Louis Cardinals',      league: 'MLB', position: 'Outfielder' },
  { name: 'Druw Jones',            team: 'Arizona Diamondbacks',     league: 'MLB', position: 'Outfielder' },
  { name: 'Corbin Carroll',        team: 'Arizona Diamondbacks',     league: 'MLB', position: 'Outfielder' },
  { name: 'Ketel Marte',           team: 'Arizona Diamondbacks',     league: 'MLB', position: 'Second Baseman' },
  { name: 'Zac Gallen',            team: 'Arizona Diamondbacks',     league: 'MLB', position: 'Pitcher' },
  { name: 'Merrill Kelly',         team: 'Arizona Diamondbacks',     league: 'MLB', position: 'Pitcher' },
  { name: 'Alex Wood',             team: 'San Francisco Giants',     league: 'MLB', position: 'Pitcher' },
  { name: 'Luis Castillo',         team: 'Seattle Mariners',         league: 'MLB', position: 'Pitcher' },
  { name: 'George Kirby',          team: 'Seattle Mariners',         league: 'MLB', position: 'Pitcher' },
  { name: 'Logan Gilbert',         team: 'Seattle Mariners',         league: 'MLB', position: 'Pitcher' },
  { name: 'Marcus Stroman',        team: 'New York Yankees',         league: 'MLB', position: 'Pitcher' },
  { name: 'Luis Garcia Jr.',       team: 'Houston Astros',           league: 'MLB', position: 'Pitcher' },
  { name: 'Braxton Garrett',       team: 'Miami Marlins',            league: 'MLB', position: 'Pitcher' },
  { name: 'Edward Cabrera',        team: 'Miami Marlins',            league: 'MLB', position: 'Pitcher' },
  { name: 'Bryan Reynolds',        team: 'Pittsburgh Pirates',       league: 'MLB', position: 'Outfielder' },
  { name: 'Oneil Cruz',            team: 'Pittsburgh Pirates',       league: 'MLB', position: 'Shortstop' },
  { name: 'Ke\'Bryan Hayes',       team: 'Pittsburgh Pirates',       league: 'MLB', position: 'Third Baseman' },
  { name: 'Mitch Keller',          team: 'Pittsburgh Pirates',       league: 'MLB', position: 'Pitcher' },
  { name: 'Willy Adames',          team: 'Milwaukee Brewers',        league: 'MLB', position: 'Shortstop' },
  { name: 'Christian Yelich',      team: 'Milwaukee Brewers',        league: 'MLB', position: 'Outfielder' },
  { name: 'Devin Williams',        team: 'New York Yankees',         league: 'MLB', position: 'Pitcher' },
  { name: 'Jhoan Duran',           team: 'Minnesota Twins',          league: 'MLB', position: 'Pitcher' },
  { name: 'Emmanuel Clase',        team: 'Cleveland Guardians',      league: 'MLB', position: 'Pitcher' },
  { name: 'Edwin Diaz',            team: 'New York Mets',            league: 'MLB', position: 'Pitcher' },
  { name: 'Clay Holmes',           team: 'New York Mets',            league: 'MLB', position: 'Pitcher' },
  { name: 'Josh Hader',            team: 'Houston Astros',           league: 'MLB', position: 'Pitcher' },
  { name: 'Ryan Helsley',          team: 'St. Louis Cardinals',      league: 'MLB', position: 'Pitcher' },
  { name: 'Alexis Diaz',           team: 'Cincinnati Reds',          league: 'MLB', position: 'Pitcher' },
  { name: 'Paul Sewald',           team: 'Arizona Diamondbacks',     league: 'MLB', position: 'Pitcher' },
  { name: 'Camilo Doval',          team: 'San Francisco Giants',     league: 'MLB', position: 'Pitcher' },
  { name: 'Felix Bautista',        team: 'Baltimore Orioles',        league: 'MLB', position: 'Pitcher' },
  { name: 'David Bednar',          team: 'Pittsburgh Pirates',       league: 'MLB', position: 'Pitcher' },
  { name: 'Gregory Soto',          team: 'Philadelphia Phillies',    league: 'MLB', position: 'Pitcher' },
  { name: 'Matt Olson',            team: 'Atlanta Braves',           league: 'MLB', position: 'First Baseman' },
  { name: 'Dansby Swanson',        team: 'Chicago Cubs',             league: 'MLB', position: 'Shortstop' },
  { name: 'Nick Madrigal',         team: 'Chicago Cubs',             league: 'MLB', position: 'Second Baseman' },
  { name: 'Seiya Suzuki',          team: 'Chicago Cubs',             league: 'MLB', position: 'Outfielder' },
  { name: 'Ian Happ',              team: 'Chicago Cubs',             league: 'MLB', position: 'Outfielder' },
  { name: 'Justin Steele',         team: 'Chicago Cubs',             league: 'MLB', position: 'Pitcher' },
  { name: 'Marcus Semien',         team: 'Texas Rangers',            league: 'MLB', position: 'Second Baseman' },
  { name: 'Jorge Polanco',         team: 'Seattle Mariners',         league: 'MLB', position: 'Second Baseman' },
  { name: 'Carlos Correa',         team: 'Minnesota Twins',          league: 'MLB', position: 'Shortstop' },
  { name: 'Michael Brantley',      team: 'Houston Astros',           league: 'MLB', position: 'Outfielder' },
  { name: 'Tommy Edman',           team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Second Baseman' },
  { name: 'Gavin Lux',             team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Second Baseman' },
  { name: 'Will Smith',            team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Catcher' },
  { name: 'James Outman',          team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Outfielder' },
  { name: 'Walker Buehler',        team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Pitcher' },
  { name: 'Bobby Miller',          team: 'Los Angeles Dodgers',      league: 'MLB', position: 'Pitcher' },

  // ── NHL (150+) ──
  { name: 'Connor McDavid',        team: 'Edmonton Oilers',          league: 'NHL', position: 'Center' },
  { name: 'Nathan MacKinnon',      team: 'Colorado Avalanche',       league: 'NHL', position: 'Center' },
  { name: 'Leon Draisaitl',        team: 'Edmonton Oilers',          league: 'NHL', position: 'Center' },
  { name: 'David Pastrnak',        team: 'Boston Bruins',            league: 'NHL', position: 'Right Wing' },
  { name: 'Auston Matthews',       team: 'Toronto Maple Leafs',      league: 'NHL', position: 'Center' },
  { name: 'Mikko Rantanen',        team: 'Colorado Avalanche',       league: 'NHL', position: 'Right Wing' },
  { name: 'Cale Makar',            team: 'Colorado Avalanche',       league: 'NHL', position: 'Defenseman' },
  { name: 'Alex Ovechkin',         team: 'Washington Capitals',      league: 'NHL', position: 'Left Wing' },
  { name: 'Sidney Crosby',         team: 'Pittsburgh Penguins',      league: 'NHL', position: 'Center' },
  { name: 'Mitch Marner',          team: 'Toronto Maple Leafs',      league: 'NHL', position: 'Right Wing' },
  { name: 'Elias Pettersson',      team: 'Vancouver Canucks',        league: 'NHL', position: 'Center' },
  { name: 'Jack Hughes',           team: 'New Jersey Devils',        league: 'NHL', position: 'Center' },
  { name: 'Andrei Svechnikov',     team: 'Carolina Hurricanes',      league: 'NHL', position: 'Right Wing' },
  { name: 'Kirill Kaprizov',       team: 'Minnesota Wild',           league: 'NHL', position: 'Left Wing' },
  { name: 'Roman Josi',            team: 'Nashville Predators',      league: 'NHL', position: 'Defenseman' },
  { name: 'Adam Fox',              team: 'New York Rangers',         league: 'NHL', position: 'Defenseman' },
  { name: 'Dougie Hamilton',       team: 'New Jersey Devils',        league: 'NHL', position: 'Defenseman' },
  { name: 'Quinn Hughes',          team: 'Vancouver Canucks',        league: 'NHL', position: 'Defenseman' },
  { name: 'Rasmus Dahlin',         team: 'Buffalo Sabres',           league: 'NHL', position: 'Defenseman' },
  { name: 'Victor Hedman',         team: 'Tampa Bay Lightning',      league: 'NHL', position: 'Defenseman' },
  { name: 'Nikita Kucherov',       team: 'Tampa Bay Lightning',      league: 'NHL', position: 'Right Wing' },
  { name: 'Brayden Point',         team: 'Tampa Bay Lightning',      league: 'NHL', position: 'Center' },
  { name: 'Steven Stamkos',        team: 'Tampa Bay Lightning',      league: 'NHL', position: 'Center' },
  { name: 'Aleksander Barkov',     team: 'Florida Panthers',         league: 'NHL', position: 'Center' },
  { name: 'Matthew Tkachuk',       team: 'Florida Panthers',         league: 'NHL', position: 'Left Wing' },
  { name: 'Sam Reinhart',          team: 'Florida Panthers',         league: 'NHL', position: 'Right Wing' },
  { name: 'Carter Verhaeghe',      team: 'Florida Panthers',         league: 'NHL', position: 'Center' },
  { name: 'Jonathan Huberdeau',    team: 'Calgary Flames',           league: 'NHL', position: 'Left Wing' },
  { name: 'Nazem Kadri',           team: 'Calgary Flames',           league: 'NHL', position: 'Center' },
  { name: 'Elias Lindholm',        team: 'Boston Bruins',            league: 'NHL', position: 'Center' },
  { name: 'Brad Marchand',         team: 'Boston Bruins',            league: 'NHL', position: 'Left Wing' },
  { name: 'Jake DeBrusk',          team: 'Vancouver Canucks',        league: 'NHL', position: 'Left Wing' },
  { name: 'Charlie McAvoy',        team: 'Boston Bruins',            league: 'NHL', position: 'Defenseman' },
  { name: 'Tuukka Rask',           team: 'Boston Bruins',            league: 'NHL', position: 'Goalie' },
  { name: 'Jeremy Swayman',        team: 'Boston Bruins',            league: 'NHL', position: 'Goalie' },
  { name: 'Linus Ullmark',         team: 'Ottawa Senators',          league: 'NHL', position: 'Goalie' },
  { name: 'Juuse Saros',           team: 'Nashville Predators',      league: 'NHL', position: 'Goalie' },
  { name: 'Igor Shesterkin',       team: 'New York Rangers',         league: 'NHL', position: 'Goalie' },
  { name: 'Ilya Sorokin',          team: 'New York Islanders',       league: 'NHL', position: 'Goalie' },
  { name: 'Tristan Jarry',         team: 'Pittsburgh Penguins',      league: 'NHL', position: 'Goalie' },
  { name: 'Andrei Vasilevskiy',    team: 'Tampa Bay Lightning',      league: 'NHL', position: 'Goalie' },
  { name: 'Thatcher Demko',        team: 'Vancouver Canucks',        league: 'NHL', position: 'Goalie' },
  { name: 'Filip Forsberg',        team: 'Nashville Predators',      league: 'NHL', position: 'Left Wing' },
  { name: 'Mark Scheifele',        team: 'Winnipeg Jets',            league: 'NHL', position: 'Center' },
  { name: 'Kyle Connor',           team: 'Winnipeg Jets',            league: 'NHL', position: 'Left Wing' },
  { name: 'Patrik Laine',          team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Left Wing' },
  { name: 'Brady Tkachuk',         team: 'Ottawa Senators',          league: 'NHL', position: 'Left Wing' },
  { name: 'Tim Stutzle',           team: 'Ottawa Senators',          league: 'NHL', position: 'Center' },
  { name: 'Drake Batherson',       team: 'Ottawa Senators',          league: 'NHL', position: 'Right Wing' },
  { name: 'Devon Toews',           team: 'Colorado Avalanche',       league: 'NHL', position: 'Defenseman' },
  { name: 'Evan Bouchard',         team: 'Edmonton Oilers',          league: 'NHL', position: 'Defenseman' },
  { name: 'Zach Werenski',         team: 'Columbus Blue Jackets',    league: 'NHL', position: 'Defenseman' },
  { name: 'Seth Jones',            team: 'Chicago Blackhawks',       league: 'NHL', position: 'Defenseman' },
  { name: 'Alex Pietrangelo',      team: 'Vegas Golden Knights',     league: 'NHL', position: 'Defenseman' },
  { name: 'Mark Stone',            team: 'Vegas Golden Knights',     league: 'NHL', position: 'Right Wing' },
  { name: 'Jonathan Marchessault', team: 'Vegas Golden Knights',     league: 'NHL', position: 'Center' },
  { name: 'Jack Eichel',           team: 'Vegas Golden Knights',     league: 'NHL', position: 'Center' },
  { name: 'William Karlsson',      team: 'Vegas Golden Knights',     league: 'NHL', position: 'Center' },
  { name: 'Anze Kopitar',          team: 'Los Angeles Kings',        league: 'NHL', position: 'Center' },
  { name: 'Drew Doughty',          team: 'Los Angeles Kings',        league: 'NHL', position: 'Defenseman' },
  { name: 'Adrian Kempe',          team: 'Los Angeles Kings',        league: 'NHL', position: 'Center' },
  { name: 'Evander Kane',          team: 'Edmonton Oilers',          league: 'NHL', position: 'Left Wing' },
  { name: 'Zach Hyman',            team: 'Edmonton Oilers',          league: 'NHL', position: 'Left Wing' },
  { name: 'Ryan Nugent-Hopkins',   team: 'Edmonton Oilers',          league: 'NHL', position: 'Center' },
  { name: 'Darnell Nurse',         team: 'Edmonton Oilers',          league: 'NHL', position: 'Defenseman' },
  { name: 'Elias Pettersson',      team: 'Vancouver Canucks',        league: 'NHL', position: 'Center' },
  { name: 'Brock Boeser',          team: 'Vancouver Canucks',        league: 'NHL', position: 'Right Wing' },
  { name: 'J.T. Miller',           team: 'Vancouver Canucks',        league: 'NHL', position: 'Center' },
  { name: 'Oliver Ekman-Larsson',  team: 'Vancouver Canucks',        league: 'NHL', position: 'Defenseman' },
  { name: 'John Tavares',          team: 'Toronto Maple Leafs',      league: 'NHL', position: 'Center' },
  { name: 'William Nylander',      team: 'Toronto Maple Leafs',      league: 'NHL', position: 'Right Wing' },
  { name: 'Morgan Rielly',         team: 'Toronto Maple Leafs',      league: 'NHL', position: 'Defenseman' },
  { name: 'Jake McCabe',           team: 'Toronto Maple Leafs',      league: 'NHL', position: 'Defenseman' },
  { name: 'Kyle Okposo',           team: 'Buffalo Sabres',           league: 'NHL', position: 'Right Wing' },
  { name: 'Tage Thompson',         team: 'Buffalo Sabres',           league: 'NHL', position: 'Center' },
  { name: 'Alex Tuch',             team: 'Buffalo Sabres',           league: 'NHL', position: 'Right Wing' },
  { name: 'Joel Eriksson Ek',      team: 'Minnesota Wild',           league: 'NHL', position: 'Center' },
  { name: 'Ryan Hartman',          team: 'Minnesota Wild',           league: 'NHL', position: 'Right Wing' },
  { name: 'Mats Zuccarello',       team: 'Minnesota Wild',           league: 'NHL', position: 'Right Wing' },
  { name: 'Marco Rossi',           team: 'Minnesota Wild',           league: 'NHL', position: 'Center' },
  { name: 'Artemi Panarin',        team: 'New York Rangers',         league: 'NHL', position: 'Left Wing' },
  { name: 'Vincent Trocheck',      team: 'New York Rangers',         league: 'NHL', position: 'Center' },
  { name: 'Chris Kreider',         team: 'New York Rangers',         league: 'NHL', position: 'Left Wing' },
  { name: 'Mika Zibanejad',        team: 'New York Rangers',         league: 'NHL', position: 'Center' },
  { name: 'Ryan Strome',           team: 'Anaheim Ducks',            league: 'NHL', position: 'Center' },
  { name: 'Trevor Zegras',         team: 'Anaheim Ducks',            league: 'NHL', position: 'Center' },
  { name: 'Mason McTavish',        team: 'Anaheim Ducks',            league: 'NHL', position: 'Center' },
  { name: 'Troy Terry',            team: 'Anaheim Ducks',            league: 'NHL', position: 'Right Wing' },
  { name: 'Bo Horvat',             team: 'New York Islanders',       league: 'NHL', position: 'Center' },
  { name: 'Mathew Barzal',         team: 'New York Islanders',       league: 'NHL', position: 'Center' },
  { name: 'Sebastian Aho',         team: 'Carolina Hurricanes',      league: 'NHL', position: 'Center' },
  { name: 'Teuvo Teravainen',      team: 'Carolina Hurricanes',      league: 'NHL', position: 'Left Wing' },
  { name: 'Brent Burns',           team: 'Carolina Hurricanes',      league: 'NHL', position: 'Defenseman' },
  { name: 'Jake Guentzel',         team: 'Carolina Hurricanes',      league: 'NHL', position: 'Left Wing' },
  { name: 'Nikolaj Ehlers',        team: 'Winnipeg Jets',            league: 'NHL', position: 'Left Wing' },
  { name: 'Nino Niederreiter',     team: 'Winnipeg Jets',            league: 'NHL', position: 'Right Wing' },
  { name: 'Gabriel Vilardi',       team: 'Winnipeg Jets',            league: 'NHL', position: 'Center' },
  { name: 'Josh Morrissey',        team: 'Winnipeg Jets',            league: 'NHL', position: 'Defenseman' },
  { name: 'Thomas Chabot',         team: 'Ottawa Senators',          league: 'NHL', position: 'Defenseman' },
  { name: 'Nick Suzuki',           team: 'Montreal Canadiens',       league: 'NHL', position: 'Center' },
  { name: 'Cole Caufield',         team: 'Montreal Canadiens',       league: 'NHL', position: 'Right Wing' },
  { name: 'Juraj Slafkovsky',      team: 'Montreal Canadiens',       league: 'NHL', position: 'Left Wing' },
  { name: 'Kaiden Guhle',          team: 'Montreal Canadiens',       league: 'NHL', position: 'Defenseman' },
  { name: 'Oliver Bjorkstrand',    team: 'Seattle Kraken',           league: 'NHL', position: 'Right Wing' },
  { name: 'Jared McCann',          team: 'Seattle Kraken',           league: 'NHL', position: 'Center' },
  { name: 'Matty Beniers',         team: 'Seattle Kraken',           league: 'NHL', position: 'Center' },
  { name: 'Vince Dunn',            team: 'Seattle Kraken',           league: 'NHL', position: 'Defenseman' },
  { name: 'Philipp Grubauer',      team: 'Seattle Kraken',           league: 'NHL', position: 'Goalie' },
  { name: 'David Perron',          team: 'St. Louis Blues',          league: 'NHL', position: 'Right Wing' },
  { name: 'Robert Thomas',         team: 'St. Louis Blues',          league: 'NHL', position: 'Center' },
  { name: 'Jordan Kyrou',          team: 'St. Louis Blues',          league: 'NHL', position: 'Right Wing' },
  { name: 'Ryan O\'Reilly',        team: 'Nashville Predators',      league: 'NHL', position: 'Center' },
  { name: 'Jonathan Toews',        team: 'Chicago Blackhawks',       league: 'NHL', position: 'Center' },
  { name: 'Patrick Kane',          team: 'Detroit Red Wings',        league: 'NHL', position: 'Right Wing' },
  { name: 'Dylan Larkin',          team: 'Detroit Red Wings',        league: 'NHL', position: 'Center' },
  { name: 'Lucas Raymond',         team: 'Detroit Red Wings',        league: 'NHL', position: 'Right Wing' },
  { name: 'Moritz Seider',         team: 'Detroit Red Wings',        league: 'NHL', position: 'Defenseman' },
  { name: 'Dani Pivonka',          team: 'Washington Capitals',      league: 'NHL', position: 'Center' },
  { name: 'Tom Wilson',            team: 'Washington Capitals',      league: 'NHL', position: 'Right Wing' },
  { name: 'John Carlson',          team: 'Washington Capitals',      league: 'NHL', position: 'Defenseman' },
  { name: 'Evgeny Kuznetsov',      team: 'Washington Capitals',      league: 'NHL', position: 'Center' },
  { name: 'Jakub Vrana',           team: 'St. Louis Blues',          league: 'NHL', position: 'Left Wing' },
  { name: 'Ivan Barbashev',        team: 'Vegas Golden Knights',     league: 'NHL', position: 'Center' },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEGENDS MODE — 100+ per league, with decade tags
// ─────────────────────────────────────────────────────────────────────────────
const LEGENDS_ATHLETES_RAW = [
  // ── NBA Legends ──
  { name: 'Michael Jordan',           team: 'Chicago Bulls',              league: 'NBA', position: 'Shooting Guard',  decades: ['1980s', '1990s'] },
  { name: 'Kobe Bryant',              team: 'Los Angeles Lakers',         league: 'NBA', position: 'Shooting Guard',  decades: ['1990s', '2000s', '2010s'] },
  { name: 'Shaquille O\'Neal',        team: 'Los Angeles Lakers',         league: 'NBA', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'Magic Johnson',            team: 'Los Angeles Lakers',         league: 'NBA', position: 'Point Guard',     decades: ['1980s', '1990s'] },
  { name: 'Larry Bird',               team: 'Boston Celtics',             league: 'NBA', position: 'Small Forward',   decades: ['1980s'] },
  { name: 'Wilt Chamberlain',         team: 'Los Angeles Lakers',         league: 'NBA', position: 'Center',          decades: ['1960s', '1970s'] },
  { name: 'Bill Russell',             team: 'Boston Celtics',             league: 'NBA', position: 'Center',          decades: ['1950s', '1960s'] },
  { name: 'Kareem Abdul-Jabbar',      team: 'Los Angeles Lakers',         league: 'NBA', position: 'Center',          decades: ['1970s', '1980s'] },
  { name: 'Charles Barkley',          team: 'Phoenix Suns',               league: 'NBA', position: 'Power Forward',   decades: ['1980s', '1990s'] },
  { name: 'Dirk Nowitzki',            team: 'Dallas Mavericks',           league: 'NBA', position: 'Power Forward',   decades: ['2000s', '2010s'] },
  { name: 'Dwyane Wade',              team: 'Miami Heat',                 league: 'NBA', position: 'Shooting Guard',  decades: ['2000s', '2010s'] },
  { name: 'Allen Iverson',            team: 'Philadelphia 76ers',         league: 'NBA', position: 'Point Guard',     decades: ['1990s', '2000s'] },
  { name: 'Scottie Pippen',           team: 'Chicago Bulls',              league: 'NBA', position: 'Small Forward',   decades: ['1990s'] },
  { name: 'Tim Duncan',               team: 'San Antonio Spurs',          league: 'NBA', position: 'Power Forward',   decades: ['2000s', '2010s'] },
  { name: 'Kevin Garnett',            team: 'Boston Celtics',             league: 'NBA', position: 'Power Forward',   decades: ['2000s', '2010s'] },
  { name: 'Oscar Robertson',          team: 'Milwaukee Bucks',            league: 'NBA', position: 'Point Guard',     decades: ['1960s', '1970s'] },
  { name: 'Jerry West',               team: 'Los Angeles Lakers',         league: 'NBA', position: 'Shooting Guard',  decades: ['1960s', '1970s'] },
  { name: 'Julius Erving',            team: 'Philadelphia 76ers',         league: 'NBA', position: 'Small Forward',   decades: ['1970s', '1980s'] },
  { name: 'Isiah Thomas',             team: 'Detroit Pistons',            league: 'NBA', position: 'Point Guard',     decades: ['1980s', '1990s'] },
  { name: 'Patrick Ewing',            team: 'New York Knicks',            league: 'NBA', position: 'Center',          decades: ['1980s', '1990s'] },
  { name: 'John Stockton',            team: 'Utah Jazz',                  league: 'NBA', position: 'Point Guard',     decades: ['1990s'] },
  { name: 'Karl Malone',              team: 'Utah Jazz',                  league: 'NBA', position: 'Power Forward',   decades: ['1990s', '2000s'] },
  { name: 'Hakeem Olajuwon',          team: 'Houston Rockets',            league: 'NBA', position: 'Center',          decades: ['1990s'] },
  { name: 'Gary Payton',              team: 'Seattle SuperSonics',        league: 'NBA', position: 'Point Guard',     decades: ['1990s', '2000s'] },
  { name: 'Reggie Miller',            team: 'Indiana Pacers',             league: 'NBA', position: 'Shooting Guard',  decades: ['1990s', '2000s'] },
  { name: 'Clyde Drexler',            team: 'Portland Trail Blazers',     league: 'NBA', position: 'Shooting Guard',  decades: ['1980s', '1990s'] },
  { name: 'Dominique Wilkins',        team: 'Atlanta Hawks',              league: 'NBA', position: 'Small Forward',   decades: ['1980s', '1990s'] },
  { name: 'Alonzo Mourning',          team: 'Miami Heat',                 league: 'NBA', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'Chris Mullin',             team: 'Golden State Warriors',      league: 'NBA', position: 'Small Forward',   decades: ['1980s', '1990s'] },
  { name: 'Dennis Rodman',            team: 'Chicago Bulls',              league: 'NBA', position: 'Power Forward',   decades: ['1990s'] },
  { name: 'Steve Nash',               team: 'Phoenix Suns',               league: 'NBA', position: 'Point Guard',     decades: ['2000s'] },
  { name: 'Ray Allen',                team: 'Boston Celtics',             league: 'NBA', position: 'Shooting Guard',  decades: ['2000s', '2010s'] },
  { name: 'Paul Pierce',              team: 'Boston Celtics',             league: 'NBA', position: 'Small Forward',   decades: ['2000s', '2010s'] },
  { name: 'Tracy McGrady',            team: 'Orlando Magic',              league: 'NBA', position: 'Shooting Guard',  decades: ['2000s'] },
  { name: 'Vince Carter',             team: 'Toronto Raptors',            league: 'NBA', position: 'Shooting Guard',  decades: ['2000s', '2010s'] },
  { name: 'Jason Kidd',               team: 'Dallas Mavericks',           league: 'NBA', position: 'Point Guard',     decades: ['2000s', '2010s'] },
  { name: 'Grant Hill',               team: 'Detroit Pistons',            league: 'NBA', position: 'Small Forward',   decades: ['1990s', '2000s'] },
  { name: 'Penny Hardaway',           team: 'Orlando Magic',              league: 'NBA', position: 'Point Guard',     decades: ['1990s'] },
  { name: 'Shawn Kemp',               team: 'Seattle SuperSonics',        league: 'NBA', position: 'Power Forward',   decades: ['1990s'] },
  { name: 'Dikembe Mutombo',          team: 'Atlanta Hawks',              league: 'NBA', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'David Robinson',           team: 'San Antonio Spurs',          league: 'NBA', position: 'Center',          decades: ['1990s'] },
  { name: 'Dan Majerle',              team: 'Phoenix Suns',               league: 'NBA', position: 'Shooting Guard',  decades: ['1990s'] },
  { name: 'Mitch Richmond',           team: 'Sacramento Kings',           league: 'NBA', position: 'Shooting Guard',  decades: ['1990s'] },
  { name: 'Joe Dumars',               team: 'Detroit Pistons',            league: 'NBA', position: 'Shooting Guard',  decades: ['1980s', '1990s'] },
  { name: 'Horace Grant',             team: 'Chicago Bulls',              league: 'NBA', position: 'Power Forward',   decades: ['1990s'] },
  { name: 'Manu Ginobili',            team: 'San Antonio Spurs',          league: 'NBA', position: 'Shooting Guard',  decades: ['2000s', '2010s'] },
  { name: 'Tony Parker',              team: 'San Antonio Spurs',          league: 'NBA', position: 'Point Guard',     decades: ['2000s', '2010s'] },
  { name: 'Yao Ming',                 team: 'Houston Rockets',            league: 'NBA', position: 'Center',          decades: ['2000s'] },
  { name: 'Carmelo Anthony',          team: 'New York Knicks',            league: 'NBA', position: 'Small Forward',   decades: ['2000s', '2010s'] },
  { name: 'Amare Stoudemire',         team: 'Phoenix Suns',               league: 'NBA', position: 'Power Forward',   decades: ['2000s'] },
  { name: 'Gilbert Arenas',           team: 'Washington Wizards',         league: 'NBA', position: 'Point Guard',     decades: ['2000s'] },
  { name: 'Baron Davis',              team: 'Golden State Warriors',      league: 'NBA', position: 'Point Guard',     decades: ['2000s'] },
  { name: 'Ben Wallace',              team: 'Detroit Pistons',            league: 'NBA', position: 'Center',          decades: ['2000s'] },
  { name: 'Rasheed Wallace',          team: 'Detroit Pistons',            league: 'NBA', position: 'Power Forward',   decades: ['2000s'] },
  { name: 'Chauncey Billups',         team: 'Detroit Pistons',            league: 'NBA', position: 'Point Guard',     decades: ['2000s'] },
  { name: 'Elgin Baylor',             team: 'Los Angeles Lakers',         league: 'NBA', position: 'Small Forward',   decades: ['1960s', '1970s'] },
  { name: 'Pete Maravich',            team: 'New Orleans Jazz',           league: 'NBA', position: 'Point Guard',     decades: ['1970s'] },
  { name: 'Dave Cowens',              team: 'Boston Celtics',             league: 'NBA', position: 'Center',          decades: ['1970s'] },
  { name: 'Bob McAdoo',               team: 'Buffalo Braves',             league: 'NBA', position: 'Power Forward',   decades: ['1970s'] },
  { name: 'George Gervin',            team: 'San Antonio Spurs',          league: 'NBA', position: 'Shooting Guard',  decades: ['1970s', '1980s'] },
  { name: 'Moses Malone',             team: 'Philadelphia 76ers',         league: 'NBA', position: 'Center',          decades: ['1980s'] },
  { name: 'James Worthy',             team: 'Los Angeles Lakers',         league: 'NBA', position: 'Small Forward',   decades: ['1980s'] },
  { name: 'Adrian Dantley',           team: 'Detroit Pistons',            league: 'NBA', position: 'Small Forward',   decades: ['1980s'] },
  { name: 'Alex English',             team: 'Denver Nuggets',             league: 'NBA', position: 'Small Forward',   decades: ['1980s'] },
  { name: 'Bernard King',             team: 'New York Knicks',            league: 'NBA', position: 'Small Forward',   decades: ['1980s'] },
  { name: 'Robert Parish',            team: 'Boston Celtics',             league: 'NBA', position: 'Center',          decades: ['1980s', '1990s'] },
  { name: 'Kevin McHale',             team: 'Boston Celtics',             league: 'NBA', position: 'Power Forward',   decades: ['1980s', '1990s'] },
  { name: 'Buck Williams',            team: 'Portland Trail Blazers',     league: 'NBA', position: 'Power Forward',   decades: ['1980s', '1990s'] },
  { name: 'Otis Thorpe',              team: 'Sacramento Kings',           league: 'NBA', position: 'Power Forward',   decades: ['1980s', '1990s'] },
  { name: 'Mark Aguirre',             team: 'Dallas Mavericks',           league: 'NBA', position: 'Small Forward',   decades: ['1980s'] },
  { name: 'Jeff Ruland',              team: 'Washington Bullets',         league: 'NBA', position: 'Center',          decades: ['1980s'] },
  { name: 'LeBron James',             team: 'Cleveland Cavaliers',        league: 'NBA', position: 'Small Forward',   decades: ['2010s'] },
  { name: 'Dwyane Wade',              team: 'Miami Heat',                 league: 'NBA', position: 'Shooting Guard',  decades: ['2010s'] },
  { name: 'Dwight Howard',            team: 'Orlando Magic',              league: 'NBA', position: 'Center',          decades: ['2000s', '2010s'] },
  { name: 'Chris Bosh',               team: 'Miami Heat',                 league: 'NBA', position: 'Power Forward',   decades: ['2010s'] },
  { name: 'Rajon Rondo',              team: 'Boston Celtics',             league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Pau Gasol',                team: 'Los Angeles Lakers',         league: 'NBA', position: 'Power Forward',   decades: ['2000s', '2010s'] },
  { name: 'Blake Griffin',            team: 'Los Angeles Clippers',       league: 'NBA', position: 'Power Forward',   decades: ['2010s'] },
  { name: 'DeAndre Jordan',           team: 'Los Angeles Clippers',       league: 'NBA', position: 'Center',          decades: ['2010s'] },
  { name: 'Chris Paul',               team: 'Los Angeles Clippers',       league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Tony Allen',               team: 'Memphis Grizzlies',          league: 'NBA', position: 'Shooting Guard',  decades: ['2010s'] },
  { name: 'Marc Gasol',               team: 'Memphis Grizzlies',          league: 'NBA', position: 'Center',          decades: ['2010s'] },
  { name: 'Rudy Gay',                 team: 'Memphis Grizzlies',          league: 'NBA', position: 'Small Forward',   decades: ['2010s'] },
  { name: 'Stephen Curry',            team: 'Golden State Warriors',      league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Klay Thompson',            team: 'Golden State Warriors',      league: 'NBA', position: 'Shooting Guard',  decades: ['2010s'] },
  { name: 'Russell Westbrook',        team: 'Oklahoma City Thunder',      league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Kevin Durant',             team: 'Oklahoma City Thunder',      league: 'NBA', position: 'Small Forward',   decades: ['2010s'] },
  { name: 'James Harden',             team: 'Houston Rockets',            league: 'NBA', position: 'Shooting Guard',  decades: ['2010s'] },
  { name: 'Derrick Rose',             team: 'Chicago Bulls',              league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Joakim Noah',              team: 'Chicago Bulls',              league: 'NBA', position: 'Center',          decades: ['2010s'] },
  { name: 'Kyrie Irving',             team: 'Cleveland Cavaliers',        league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Isaiah Thomas',            team: 'Boston Celtics',             league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Jimmy Butler',             team: 'Chicago Bulls',              league: 'NBA', position: 'Small Forward',   decades: ['2010s'] },
  { name: 'John Wall',                team: 'Washington Wizards',         league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Bradley Beal',             team: 'Washington Wizards',         league: 'NBA', position: 'Shooting Guard',  decades: ['2010s'] },
  { name: 'Paul George',              team: 'Indiana Pacers',             league: 'NBA', position: 'Small Forward',   decades: ['2010s'] },
  { name: 'Lance Stephenson',         team: 'Indiana Pacers',             league: 'NBA', position: 'Shooting Guard',  decades: ['2010s'] },
  { name: 'Damian Lillard',           team: 'Portland Trail Blazers',     league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'C.J. McCollum',            team: 'Portland Trail Blazers',     league: 'NBA', position: 'Shooting Guard',  decades: ['2010s'] },
  { name: 'Kemba Walker',             team: 'Charlotte Hornets',          league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },
  { name: 'Hassan Whiteside',         team: 'Miami Heat',                 league: 'NBA', position: 'Center',          decades: ['2010s'] },
  { name: 'Goran Dragic',             team: 'Miami Heat',                 league: 'NBA', position: 'Point Guard',     decades: ['2010s'] },

  // ── NFL Legends ──
  { name: 'Tom Brady',                team: 'New England Patriots',       league: 'NFL', position: 'Quarterback',     decades: ['2000s', '2010s'] },
  { name: 'Jerry Rice',               team: 'San Francisco 49ers',        league: 'NFL', position: 'Wide Receiver',   decades: ['1980s', '1990s'] },
  { name: 'Joe Montana',              team: 'San Francisco 49ers',        league: 'NFL', position: 'Quarterback',     decades: ['1980s', '1990s'] },
  { name: 'Walter Payton',            team: 'Chicago Bears',              league: 'NFL', position: 'Running Back',    decades: ['1970s', '1980s'] },
  { name: 'Emmitt Smith',             team: 'Dallas Cowboys',             league: 'NFL', position: 'Running Back',    decades: ['1990s', '2000s'] },
  { name: 'Peyton Manning',           team: 'Indianapolis Colts',         league: 'NFL', position: 'Quarterback',     decades: ['2000s', '2010s'] },
  { name: 'Barry Sanders',            team: 'Detroit Lions',              league: 'NFL', position: 'Running Back',    decades: ['1990s'] },
  { name: 'Deion Sanders',            team: 'Dallas Cowboys',             league: 'NFL', position: 'Cornerback',      decades: ['1990s', '2000s'] },
  { name: 'Lawrence Taylor',          team: 'New York Giants',            league: 'NFL', position: 'Linebacker',      decades: ['1980s', '1990s'] },
  { name: 'Brett Favre',              team: 'Green Bay Packers',          league: 'NFL', position: 'Quarterback',     decades: ['1990s', '2000s'] },
  { name: 'Aaron Rodgers',            team: 'Green Bay Packers',          league: 'NFL', position: 'Quarterback',     decades: ['2000s', '2010s'] },
  { name: 'Dan Marino',               team: 'Miami Dolphins',             league: 'NFL', position: 'Quarterback',     decades: ['1980s', '1990s'] },
  { name: 'Jim Brown',                team: 'Cleveland Browns',           league: 'NFL', position: 'Running Back',    decades: ['1950s', '1960s'] },
  { name: 'Reggie White',             team: 'Green Bay Packers',          league: 'NFL', position: 'Defensive End',   decades: ['1980s', '1990s'] },
  { name: 'Johnny Unitas',            team: 'Baltimore Colts',            league: 'NFL', position: 'Quarterback',     decades: ['1950s', '1960s'] },
  { name: 'Dick Butkus',              team: 'Chicago Bears',              league: 'NFL', position: 'Linebacker',      decades: ['1960s', '1970s'] },
  { name: 'Randy Moss',               team: 'Minnesota Vikings',          league: 'NFL', position: 'Wide Receiver',   decades: ['2000s'] },
  { name: 'Terrell Owens',            team: 'Philadelphia Eagles',        league: 'NFL', position: 'Wide Receiver',   decades: ['2000s'] },
  { name: 'Ray Lewis',                team: 'Baltimore Ravens',           league: 'NFL', position: 'Linebacker',      decades: ['2000s', '2010s'] },
  { name: 'Bruce Smith',              team: 'Buffalo Bills',              league: 'NFL', position: 'Defensive End',   decades: ['1980s', '1990s'] },
  { name: 'Roger Staubach',           team: 'Dallas Cowboys',             league: 'NFL', position: 'Quarterback',     decades: ['1970s'] },
  { name: 'O.J. Simpson',             team: 'Buffalo Bills',              league: 'NFL', position: 'Running Back',    decades: ['1970s'] },
  { name: 'Franco Harris',            team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Running Back',    decades: ['1970s', '1980s'] },
  { name: 'Terry Bradshaw',           team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Quarterback',     decades: ['1970s', '1980s'] },
  { name: 'Lynn Swann',               team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Wide Receiver',   decades: ['1970s', '1980s'] },
  { name: 'Jack Lambert',             team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Linebacker',      decades: ['1970s', '1980s'] },
  { name: 'Mean Joe Greene',          team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Defensive Tackle',decades: ['1970s'] },
  { name: 'Marcus Allen',             team: 'Los Angeles Raiders',        league: 'NFL', position: 'Running Back',    decades: ['1980s', '1990s'] },
  { name: 'Eric Dickerson',           team: 'Los Angeles Rams',           league: 'NFL', position: 'Running Back',    decades: ['1980s'] },
  { name: 'Mike Singletary',          team: 'Chicago Bears',              league: 'NFL', position: 'Linebacker',      decades: ['1980s'] },
  { name: 'Chris Doleman',            team: 'Minnesota Vikings',          league: 'NFL', position: 'Defensive End',   decades: ['1980s', '1990s'] },
  { name: 'Ronnie Lott',              team: 'San Francisco 49ers',        league: 'NFL', position: 'Safety',          decades: ['1980s', '1990s'] },
  { name: 'Howie Long',               team: 'Los Angeles Raiders',        league: 'NFL', position: 'Defensive End',   decades: ['1980s'] },
  { name: 'Andre Reed',               team: 'Buffalo Bills',              league: 'NFL', position: 'Wide Receiver',   decades: ['1980s', '1990s'] },
  { name: 'Thurman Thomas',           team: 'Buffalo Bills',              league: 'NFL', position: 'Running Back',    decades: ['1990s'] },
  { name: 'Jim Kelly',                team: 'Buffalo Bills',              league: 'NFL', position: 'Quarterback',     decades: ['1990s'] },
  { name: 'Steve Young',              team: 'San Francisco 49ers',        league: 'NFL', position: 'Quarterback',     decades: ['1990s'] },
  { name: 'Sterling Sharpe',          team: 'Green Bay Packers',          league: 'NFL', position: 'Wide Receiver',   decades: ['1990s'] },
  { name: 'Darrell Green',            team: 'Washington Redskins',        league: 'NFL', position: 'Cornerback',      decades: ['1990s'] },
  { name: 'Junior Seau',              team: 'San Diego Chargers',         league: 'NFL', position: 'Linebacker',      decades: ['1990s', '2000s'] },
  { name: 'John Elway',               team: 'Denver Broncos',             league: 'NFL', position: 'Quarterback',     decades: ['1990s'] },
  { name: 'Rod Woodson',              team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Safety',          decades: ['1990s'] },
  { name: 'Derrick Thomas',           team: 'Kansas City Chiefs',         league: 'NFL', position: 'Linebacker',      decades: ['1990s'] },
  { name: 'Cortez Kennedy',           team: 'Seattle Seahawks',           league: 'NFL', position: 'Defensive Tackle',decades: ['1990s'] },
  { name: 'Kevin Greene',             team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Linebacker',      decades: ['1990s'] },
  { name: 'Cris Carter',              team: 'Minnesota Vikings',          league: 'NFL', position: 'Wide Receiver',   decades: ['1990s'] },
  { name: 'Michael Irvin',            team: 'Dallas Cowboys',             league: 'NFL', position: 'Wide Receiver',   decades: ['1990s'] },
  { name: 'Troy Aikman',              team: 'Dallas Cowboys',             league: 'NFL', position: 'Quarterback',     decades: ['1990s'] },
  { name: 'Michael Strahan',          team: 'New York Giants',            league: 'NFL', position: 'Defensive End',   decades: ['2000s'] },
  { name: 'Priest Holmes',            team: 'Kansas City Chiefs',         league: 'NFL', position: 'Running Back',    decades: ['2000s'] },
  { name: 'LaDainian Tomlinson',      team: 'San Diego Chargers',         league: 'NFL', position: 'Running Back',    decades: ['2000s'] },
  { name: 'Marvin Harrison',          team: 'Indianapolis Colts',         league: 'NFL', position: 'Wide Receiver',   decades: ['2000s'] },
  { name: 'Reggie Wayne',             team: 'Indianapolis Colts',         league: 'NFL', position: 'Wide Receiver',   decades: ['2000s'] },
  { name: 'Donovan McNabb',           team: 'Philadelphia Eagles',        league: 'NFL', position: 'Quarterback',     decades: ['2000s'] },
  { name: 'Brian Urlacher',           team: 'Chicago Bears',              league: 'NFL', position: 'Linebacker',      decades: ['2000s'] },
  { name: 'Ed Reed',                  team: 'Baltimore Ravens',           league: 'NFL', position: 'Safety',          decades: ['2000s'] },
  { name: 'Champ Bailey',             team: 'Denver Broncos',             league: 'NFL', position: 'Cornerback',      decades: ['2000s'] },
  { name: 'Dwight Freeney',           team: 'Indianapolis Colts',         league: 'NFL', position: 'Defensive End',   decades: ['2000s'] },
  { name: 'Steve McNair',             team: 'Tennessee Titans',           league: 'NFL', position: 'Quarterback',     decades: ['2000s'] },
  { name: 'Edgerrin James',           team: 'Indianapolis Colts',         league: 'NFL', position: 'Running Back',    decades: ['2000s'] },
  { name: 'Tony Gonzalez',            team: 'Atlanta Falcons',            league: 'NFL', position: 'Tight End',       decades: ['2000s', '2010s'] },
  { name: 'Antonio Gates',            team: 'San Diego Chargers',         league: 'NFL', position: 'Tight End',       decades: ['2000s', '2010s'] },
  { name: 'Jason Witten',             team: 'Dallas Cowboys',             league: 'NFL', position: 'Tight End',       decades: ['2000s', '2010s'] },
  { name: 'Wes Welker',               team: 'New England Patriots',       league: 'NFL', position: 'Wide Receiver',   decades: ['2000s', '2010s'] },
  { name: 'Larry Fitzgerald',         team: 'Arizona Cardinals',          league: 'NFL', position: 'Wide Receiver',   decades: ['2000s', '2010s'] },
  { name: 'Calvin Johnson',           team: 'Detroit Lions',              league: 'NFL', position: 'Wide Receiver',   decades: ['2010s'] },
  { name: 'Adrian Peterson',          team: 'Minnesota Vikings',          league: 'NFL', position: 'Running Back',    decades: ['2000s', '2010s'] },
  { name: 'Marshawn Lynch',           team: 'Seattle Seahawks',           league: 'NFL', position: 'Running Back',    decades: ['2010s'] },
  { name: 'Richard Sherman',          team: 'Seattle Seahawks',           league: 'NFL', position: 'Cornerback',      decades: ['2010s'] },
  { name: 'Earl Thomas',              team: 'Seattle Seahawks',           league: 'NFL', position: 'Safety',          decades: ['2010s'] },
  { name: 'Bobby Wagner',             team: 'Seattle Seahawks',           league: 'NFL', position: 'Linebacker',      decades: ['2010s'] },
  { name: 'Von Miller',               team: 'Denver Broncos',             league: 'NFL', position: 'Linebacker',      decades: ['2010s'] },
  { name: 'Demaryius Thomas',         team: 'Denver Broncos',             league: 'NFL', position: 'Wide Receiver',   decades: ['2010s'] },
  { name: 'Eric Berry',               team: 'Kansas City Chiefs',         league: 'NFL', position: 'Safety',          decades: ['2010s'] },
  { name: 'Luke Kuechly',             team: 'Carolina Panthers',          league: 'NFL', position: 'Linebacker',      decades: ['2010s'] },
  { name: 'Cam Newton',               team: 'Carolina Panthers',          league: 'NFL', position: 'Quarterback',     decades: ['2010s'] },
  { name: 'Odell Beckham Jr.',        team: 'New York Giants',            league: 'NFL', position: 'Wide Receiver',   decades: ['2010s'] },
  { name: 'Antonio Brown',            team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Wide Receiver',   decades: ['2010s'] },
  { name: 'Le\'Veon Bell',            team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Running Back',    decades: ['2010s'] },
  { name: 'Ben Roethlisberger',       team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Quarterback',     decades: ['2000s', '2010s'] },
  { name: 'Eli Manning',              team: 'New York Giants',            league: 'NFL', position: 'Quarterback',     decades: ['2000s', '2010s'] },
  { name: 'Philip Rivers',            team: 'San Diego Chargers',         league: 'NFL', position: 'Quarterback',     decades: ['2000s', '2010s'] },
  { name: 'Drew Brees',               team: 'New Orleans Saints',         league: 'NFL', position: 'Quarterback',     decades: ['2000s', '2010s'] },
  { name: 'Julius Peppers',           team: 'Carolina Panthers',          league: 'NFL', position: 'Defensive End',   decades: ['2000s', '2010s'] },
  { name: 'Charles Woodson',          team: 'Oakland Raiders',            league: 'NFL', position: 'Safety',          decades: ['2000s', '2010s'] },
  { name: 'Steven Jackson',           team: 'St. Louis Rams',             league: 'NFL', position: 'Running Back',    decades: ['2000s', '2010s'] },
  { name: 'Anquan Boldin',            team: 'San Francisco 49ers',        league: 'NFL', position: 'Wide Receiver',   decades: ['2000s', '2010s'] },
  { name: 'Polamalu Troy',            team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Safety',          decades: ['2000s', '2010s'] },
  { name: 'Randy Moss',               team: 'New England Patriots',       league: 'NFL', position: 'Wide Receiver',   decades: ['2000s'] },
  { name: 'Frank Gore',               team: 'San Francisco 49ers',        league: 'NFL', position: 'Running Back',    decades: ['2000s', '2010s'] },
  { name: 'Gale Sayers',              team: 'Chicago Bears',              league: 'NFL', position: 'Running Back',    decades: ['1960s'] },
  { name: 'Joe Namath',               team: 'New York Jets',              league: 'NFL', position: 'Quarterback',     decades: ['1960s', '1970s'] },
  { name: 'Bob Griese',               team: 'Miami Dolphins',             league: 'NFL', position: 'Quarterback',     decades: ['1970s'] },
  { name: 'Paul Warfield',            team: 'Miami Dolphins',             league: 'NFL', position: 'Wide Receiver',   decades: ['1970s'] },
  { name: 'Carl Eller',               team: 'Minnesota Vikings',          league: 'NFL', position: 'Defensive End',   decades: ['1970s'] },
  { name: 'Fran Tarkenton',           team: 'Minnesota Vikings',          league: 'NFL', position: 'Quarterback',     decades: ['1970s'] },

  // ── MLB Legends ──
  { name: 'Babe Ruth',                team: 'New York Yankees',           league: 'MLB', position: 'Outfielder',      decades: ['1920s', '1930s'] },
  { name: 'Derek Jeter',              team: 'New York Yankees',           league: 'MLB', position: 'Shortstop',       decades: ['1990s', '2000s', '2010s'] },
  { name: 'Willie Mays',              team: 'San Francisco Giants',       league: 'MLB', position: 'Outfielder',      decades: ['1950s', '1960s'] },
  { name: 'Hank Aaron',               team: 'Atlanta Braves',             league: 'MLB', position: 'Outfielder',      decades: ['1950s', '1960s', '1970s'] },
  { name: 'Ken Griffey Jr.',          team: 'Seattle Mariners',           league: 'MLB', position: 'Outfielder',      decades: ['1990s', '2000s'] },
  { name: 'Barry Bonds',              team: 'San Francisco Giants',       league: 'MLB', position: 'Outfielder',      decades: ['1990s', '2000s'] },
  { name: 'Roger Clemens',            team: 'New York Yankees',           league: 'MLB', position: 'Pitcher',         decades: ['1990s', '2000s'] },
  { name: 'Pete Rose',                team: 'Cincinnati Reds',            league: 'MLB', position: 'First Baseman',   decades: ['1960s', '1970s', '1980s'] },
  { name: 'Nolan Ryan',               team: 'Texas Rangers',              league: 'MLB', position: 'Pitcher',         decades: ['1970s', '1980s', '1990s'] },
  { name: 'Cal Ripken Jr.',           team: 'Baltimore Orioles',          league: 'MLB', position: 'Shortstop',       decades: ['1980s', '1990s'] },
  { name: 'Ted Williams',             team: 'Boston Red Sox',             league: 'MLB', position: 'Outfielder',      decades: ['1950s', '1960s'] },
  { name: 'Mickey Mantle',            team: 'New York Yankees',           league: 'MLB', position: 'Outfielder',      decades: ['1950s', '1960s'] },
  { name: 'Sandy Koufax',             team: 'Los Angeles Dodgers',        league: 'MLB', position: 'Pitcher',         decades: ['1960s'] },
  { name: 'Bob Gibson',               team: 'St. Louis Cardinals',        league: 'MLB', position: 'Pitcher',         decades: ['1960s', '1970s'] },
  { name: 'Reggie Jackson',           team: 'New York Yankees',           league: 'MLB', position: 'Outfielder',      decades: ['1970s', '1980s'] },
  { name: 'Mike Schmidt',             team: 'Philadelphia Phillies',      league: 'MLB', position: 'Third Baseman',   decades: ['1970s', '1980s'] },
  { name: 'George Brett',             team: 'Kansas City Royals',         league: 'MLB', position: 'Third Baseman',   decades: ['1970s', '1980s'] },
  { name: 'Rickey Henderson',         team: 'Oakland Athletics',          league: 'MLB', position: 'Outfielder',      decades: ['1980s', '1990s'] },
  { name: 'Frank Thomas',             team: 'Chicago White Sox',          league: 'MLB', position: 'First Baseman',   decades: ['1990s', '2000s'] },
  { name: 'Randy Johnson',            team: 'Arizona Diamondbacks',       league: 'MLB', position: 'Pitcher',         decades: ['1990s', '2000s'] },
  { name: 'Greg Maddux',              team: 'Atlanta Braves',             league: 'MLB', position: 'Pitcher',         decades: ['1990s', '2000s'] },
  { name: 'Tom Seaver',               team: 'New York Mets',              league: 'MLB', position: 'Pitcher',         decades: ['1960s', '1970s'] },
  { name: 'Roberto Clemente',         team: 'Pittsburgh Pirates',         league: 'MLB', position: 'Outfielder',      decades: ['1960s', '1970s'] },
  { name: 'Lou Gehrig',               team: 'New York Yankees',           league: 'MLB', position: 'First Baseman',   decades: ['1930s'] },
  { name: 'Joe DiMaggio',             team: 'New York Yankees',           league: 'MLB', position: 'Outfielder',      decades: ['1950s'] },
  { name: 'Stan Musial',              team: 'St. Louis Cardinals',        league: 'MLB', position: 'Outfielder',      decades: ['1950s', '1960s'] },
  { name: 'Yogi Berra',               team: 'New York Yankees',           league: 'MLB', position: 'Catcher',         decades: ['1950s', '1960s'] },
  { name: 'Whitey Ford',              team: 'New York Yankees',           league: 'MLB', position: 'Pitcher',         decades: ['1950s', '1960s'] },
  { name: 'Ernie Banks',              team: 'Chicago Cubs',               league: 'MLB', position: 'Shortstop',       decades: ['1950s', '1960s'] },
  { name: 'Warren Spahn',             team: 'Milwaukee Braves',           league: 'MLB', position: 'Pitcher',         decades: ['1950s', '1960s'] },
  { name: 'Carl Yastrzemski',         team: 'Boston Red Sox',             league: 'MLB', position: 'Outfielder',      decades: ['1960s', '1970s'] },
  { name: 'Brooks Robinson',          team: 'Baltimore Orioles',          league: 'MLB', position: 'Third Baseman',   decades: ['1960s', '1970s'] },
  { name: 'Frank Robinson',           team: 'Baltimore Orioles',          league: 'MLB', position: 'Outfielder',      decades: ['1960s', '1970s'] },
  { name: 'Steve Carlton',            team: 'Philadelphia Phillies',      league: 'MLB', position: 'Pitcher',         decades: ['1970s', '1980s'] },
  { name: 'Jim Palmer',               team: 'Baltimore Orioles',          league: 'MLB', position: 'Pitcher',         decades: ['1970s'] },
  { name: 'Rod Carew',                team: 'Minnesota Twins',            league: 'MLB', position: 'First Baseman',   decades: ['1970s'] },
  { name: 'Johnny Bench',             team: 'Cincinnati Reds',            league: 'MLB', position: 'Catcher',         decades: ['1970s'] },
  { name: 'Tony Perez',               team: 'Cincinnati Reds',            league: 'MLB', position: 'First Baseman',   decades: ['1970s'] },
  { name: 'Joe Morgan',               team: 'Cincinnati Reds',            league: 'MLB', position: 'Second Baseman',  decades: ['1970s'] },
  { name: 'Tony Gwynn',               team: 'San Diego Padres',           league: 'MLB', position: 'Outfielder',      decades: ['1980s', '1990s'] },
  { name: 'Wade Boggs',               team: 'Boston Red Sox',             league: 'MLB', position: 'Third Baseman',   decades: ['1980s', '1990s'] },
  { name: 'Ozzie Smith',              team: 'St. Louis Cardinals',        league: 'MLB', position: 'Shortstop',       decades: ['1980s', '1990s'] },
  { name: 'Kirby Puckett',            team: 'Minnesota Twins',            league: 'MLB', position: 'Outfielder',      decades: ['1980s', '1990s'] },
  { name: 'Dave Winfield',            team: 'San Diego Padres',           league: 'MLB', position: 'Outfielder',      decades: ['1980s'] },
  { name: 'Eddie Murray',             team: 'Baltimore Orioles',          league: 'MLB', position: 'First Baseman',   decades: ['1980s', '1990s'] },
  { name: 'Ryne Sandberg',            team: 'Chicago Cubs',               league: 'MLB', position: 'Second Baseman',  decades: ['1980s', '1990s'] },
  { name: 'Don Mattingly',            team: 'New York Yankees',           league: 'MLB', position: 'First Baseman',   decades: ['1980s', '1990s'] },
  { name: 'Alan Trammell',            team: 'Detroit Tigers',             league: 'MLB', position: 'Shortstop',       decades: ['1980s', '1990s'] },
  { name: 'Jack Morris',              team: 'Detroit Tigers',             league: 'MLB', position: 'Pitcher',         decades: ['1980s', '1990s'] },
  { name: 'Mike Boddicker',           team: 'Baltimore Orioles',          league: 'MLB', position: 'Pitcher',         decades: ['1980s'] },
  { name: 'Dave Stieb',               team: 'Toronto Blue Jays',          league: 'MLB', position: 'Pitcher',         decades: ['1980s'] },
  { name: 'Bert Blyleven',            team: 'Minnesota Twins',            league: 'MLB', position: 'Pitcher',         decades: ['1970s', '1980s'] },
  { name: 'Gaylord Perry',            team: 'San Francisco Giants',       league: 'MLB', position: 'Pitcher',         decades: ['1970s'] },
  { name: 'Tom Glavine',              team: 'Atlanta Braves',             league: 'MLB', position: 'Pitcher',         decades: ['1990s', '2000s'] },
  { name: 'John Smoltz',              team: 'Atlanta Braves',             league: 'MLB', position: 'Pitcher',         decades: ['1990s', '2000s'] },
  { name: 'Chipper Jones',            team: 'Atlanta Braves',             league: 'MLB', position: 'Third Baseman',   decades: ['1990s', '2000s'] },
  { name: 'Manny Ramirez',            team: 'Boston Red Sox',             league: 'MLB', position: 'Outfielder',      decades: ['2000s'] },
  { name: 'Sammy Sosa',               team: 'Chicago Cubs',               league: 'MLB', position: 'Outfielder',      decades: ['1990s', '2000s'] },
  { name: 'Mark McGwire',             team: 'St. Louis Cardinals',        league: 'MLB', position: 'First Baseman',   decades: ['1990s', '2000s'] },
  { name: 'Pedro Martinez',           team: 'Boston Red Sox',             league: 'MLB', position: 'Pitcher',         decades: ['2000s'] },
  { name: 'Curt Schilling',           team: 'Boston Red Sox',             league: 'MLB', position: 'Pitcher',         decades: ['2000s'] },
  { name: 'Mike Mussina',             team: 'New York Yankees',           league: 'MLB', position: 'Pitcher',         decades: ['2000s'] },
  { name: 'Alex Rodriguez',           team: 'New York Yankees',           league: 'MLB', position: 'Third Baseman',   decades: ['2000s', '2010s'] },
  { name: 'Ichiro Suzuki',            team: 'Seattle Mariners',           league: 'MLB', position: 'Outfielder',      decades: ['2000s', '2010s'] },
  { name: 'Albert Pujols',            team: 'St. Louis Cardinals',        league: 'MLB', position: 'First Baseman',   decades: ['2000s', '2010s'] },
  { name: 'Jim Thome',                team: 'Cleveland Indians',          league: 'MLB', position: 'First Baseman',   decades: ['2000s'] },
  { name: 'Gary Sheffield',           team: 'Atlanta Braves',             league: 'MLB', position: 'Outfielder',      decades: ['2000s'] },
  { name: 'Magglio Ordonez',          team: 'Detroit Tigers',             league: 'MLB', position: 'Outfielder',      decades: ['2000s'] },
  { name: 'Vladimir Guerrero',        team: 'Anaheim Angels',             league: 'MLB', position: 'Outfielder',      decades: ['2000s'] },
  { name: 'Carlos Beltran',           team: 'New York Mets',              league: 'MLB', position: 'Outfielder',      decades: ['2000s'] },
  { name: 'Johan Santana',            team: 'New York Mets',              league: 'MLB', position: 'Pitcher',         decades: ['2000s'] },
  { name: 'Roy Halladay',             team: 'Philadelphia Phillies',      league: 'MLB', position: 'Pitcher',         decades: ['2000s', '2010s'] },
  { name: 'Roy Oswalt',               team: 'Houston Astros',             league: 'MLB', position: 'Pitcher',         decades: ['2000s'] },
  { name: 'Ryan Howard',              team: 'Philadelphia Phillies',      league: 'MLB', position: 'First Baseman',   decades: ['2000s', '2010s'] },
  { name: 'Chase Utley',              team: 'Philadelphia Phillies',      league: 'MLB', position: 'Second Baseman',  decades: ['2000s', '2010s'] },
  { name: 'Jimmy Rollins',            team: 'Philadelphia Phillies',      league: 'MLB', position: 'Shortstop',       decades: ['2000s', '2010s'] },
  { name: 'David Wright',             team: 'New York Mets',              league: 'MLB', position: 'Third Baseman',   decades: ['2000s', '2010s'] },
  { name: 'Jose Reyes',               team: 'New York Mets',              league: 'MLB', position: 'Shortstop',       decades: ['2000s', '2010s'] },
  { name: 'Robinson Cano',            team: 'New York Yankees',           league: 'MLB', position: 'Second Baseman',  decades: ['2000s', '2010s'] },
  { name: 'CC Sabathia',              team: 'New York Yankees',           league: 'MLB', position: 'Pitcher',         decades: ['2000s', '2010s'] },
  { name: 'David Ortiz',              team: 'Boston Red Sox',             league: 'MLB', position: 'Designated Hitter',decades: ['2000s', '2010s'] },
  { name: 'Dustin Pedroia',           team: 'Boston Red Sox',             league: 'MLB', position: 'Second Baseman',  decades: ['2000s', '2010s'] },

  // ── NHL Legends ──
  { name: 'Wayne Gretzky',            team: 'Edmonton Oilers',            league: 'NHL', position: 'Center',          decades: ['1980s', '1990s'] },
  { name: 'Mario Lemieux',            team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Center',          decades: ['1980s', '1990s'] },
  { name: 'Gordie Howe',              team: 'Detroit Red Wings',          league: 'NHL', position: 'Right Wing',      decades: ['1950s', '1960s', '1970s'] },
  { name: 'Bobby Orr',                team: 'Boston Bruins',              league: 'NHL', position: 'Defenseman',      decades: ['1960s', '1970s'] },
  { name: 'Mark Messier',             team: 'Edmonton Oilers',            league: 'NHL', position: 'Center',          decades: ['1980s', '1990s'] },
  { name: 'Patrick Roy',              team: 'Colorado Avalanche',         league: 'NHL', position: 'Goalie',          decades: ['1990s', '2000s'] },
  { name: 'Steve Yzerman',            team: 'Detroit Red Wings',          league: 'NHL', position: 'Center',          decades: ['1980s', '1990s'] },
  { name: 'Brett Hull',               team: 'Dallas Stars',               league: 'NHL', position: 'Right Wing',      decades: ['1990s', '2000s'] },
  { name: 'Jaromir Jagr',             team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Right Wing',      decades: ['1990s', '2000s'] },
  { name: 'Martin Brodeur',           team: 'New Jersey Devils',          league: 'NHL', position: 'Goalie',          decades: ['1990s', '2000s', '2010s'] },
  { name: 'Bobby Hull',               team: 'Chicago Blackhawks',         league: 'NHL', position: 'Left Wing',       decades: ['1960s', '1970s'] },
  { name: 'Jean Beliveau',            team: 'Montreal Canadiens',         league: 'NHL', position: 'Center',          decades: ['1950s', '1960s'] },
  { name: 'Phil Esposito',            team: 'Boston Bruins',              league: 'NHL', position: 'Center',          decades: ['1970s'] },
  { name: 'Guy Lafleur',              team: 'Montreal Canadiens',         league: 'NHL', position: 'Right Wing',      decades: ['1970s', '1980s'] },
  { name: 'Mike Bossy',               team: 'New York Islanders',         league: 'NHL', position: 'Right Wing',      decades: ['1980s'] },
  { name: 'Ray Bourque',              team: 'Boston Bruins',              league: 'NHL', position: 'Defenseman',      decades: ['1980s', '1990s'] },
  { name: 'Joe Sakic',                team: 'Colorado Avalanche',         league: 'NHL', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'Nicklas Lidstrom',         team: 'Detroit Red Wings',          league: 'NHL', position: 'Defenseman',      decades: ['1990s', '2000s'] },
  { name: 'Brendan Shanahan',         team: 'Detroit Red Wings',          league: 'NHL', position: 'Left Wing',       decades: ['1990s', '2000s'] },
  { name: 'Scott Stevens',            team: 'New Jersey Devils',          league: 'NHL', position: 'Defenseman',      decades: ['1990s', '2000s'] },
  { name: 'Glenn Anderson',           team: 'Edmonton Oilers',            league: 'NHL', position: 'Right Wing',      decades: ['1980s', '1990s'] },
  { name: 'Paul Coffey',              team: 'Edmonton Oilers',            league: 'NHL', position: 'Defenseman',      decades: ['1980s', '1990s'] },
  { name: 'Jari Kurri',               team: 'Edmonton Oilers',            league: 'NHL', position: 'Right Wing',      decades: ['1980s'] },
  { name: 'Grant Fuhr',               team: 'Edmonton Oilers',            league: 'NHL', position: 'Goalie',          decades: ['1980s'] },
  { name: 'Ken Dryden',               team: 'Montreal Canadiens',         league: 'NHL', position: 'Goalie',          decades: ['1970s'] },
  { name: 'Jacques Plante',           team: 'Montreal Canadiens',         league: 'NHL', position: 'Goalie',          decades: ['1950s', '1960s'] },
  { name: 'Yvan Cournoyer',           team: 'Montreal Canadiens',         league: 'NHL', position: 'Right Wing',      decades: ['1960s', '1970s'] },
  { name: 'Frank Mahovlich',          team: 'Montreal Canadiens',         league: 'NHL', position: 'Left Wing',       decades: ['1960s', '1970s'] },
  { name: 'Henri Richard',            team: 'Montreal Canadiens',         league: 'NHL', position: 'Center',          decades: ['1950s', '1960s'] },
  { name: 'Maurice Richard',          team: 'Montreal Canadiens',         league: 'NHL', position: 'Right Wing',      decades: ['1950s'] },
  { name: 'Brad Park',                team: 'New York Rangers',           league: 'NHL', position: 'Defenseman',      decades: ['1970s'] },
  { name: 'Rod Gilbert',              team: 'New York Rangers',           league: 'NHL', position: 'Right Wing',      decades: ['1970s'] },
  { name: 'Gilbert Perreault',        team: 'Buffalo Sabres',             league: 'NHL', position: 'Center',          decades: ['1970s', '1980s'] },
  { name: 'Bryan Trottier',           team: 'New York Islanders',         league: 'NHL', position: 'Center',          decades: ['1980s'] },
  { name: 'Denis Potvin',             team: 'New York Islanders',         league: 'NHL', position: 'Defenseman',      decades: ['1980s'] },
  { name: 'Clark Gillies',            team: 'New York Islanders',         league: 'NHL', position: 'Left Wing',       decades: ['1980s'] },
  { name: 'Bryan Berard',             team: 'New York Islanders',         league: 'NHL', position: 'Defenseman',      decades: ['1990s'] },
  { name: 'Dale Hawerchuk',           team: 'Winnipeg Jets',              league: 'NHL', position: 'Center',          decades: ['1980s', '1990s'] },
  { name: 'Pat Quinn',                team: 'Vancouver Canucks',          league: 'NHL', position: 'Defenseman',      decades: ['1970s'] },
  { name: 'Marcel Dionne',            team: 'Los Angeles Kings',          league: 'NHL', position: 'Center',          decades: ['1970s', '1980s'] },
  { name: 'Rogie Vachon',             team: 'Los Angeles Kings',          league: 'NHL', position: 'Goalie',          decades: ['1970s'] },
  { name: 'Luc Robitaille',           team: 'Los Angeles Kings',          league: 'NHL', position: 'Left Wing',       decades: ['1990s'] },
  { name: 'Dave Taylor',              team: 'Los Angeles Kings',          league: 'NHL', position: 'Right Wing',      decades: ['1980s'] },
  { name: 'Mats Sundin',              team: 'Toronto Maple Leafs',        league: 'NHL', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'Felix Potvin',             team: 'Toronto Maple Leafs',        league: 'NHL', position: 'Goalie',          decades: ['1990s'] },
  { name: 'Doug Gilmour',             team: 'Toronto Maple Leafs',        league: 'NHL', position: 'Center',          decades: ['1990s'] },
  { name: 'Wendel Clark',             team: 'Toronto Maple Leafs',        league: 'NHL', position: 'Left Wing',       decades: ['1990s'] },
  { name: 'Curtis Joseph',            team: 'Toronto Maple Leafs',        league: 'NHL', position: 'Goalie',          decades: ['1990s', '2000s'] },
  { name: 'Sergei Fedorov',           team: 'Detroit Red Wings',          league: 'NHL', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'Chris Chelios',            team: 'Detroit Red Wings',          league: 'NHL', position: 'Defenseman',      decades: ['1990s', '2000s'] },
  { name: 'Igor Larionov',            team: 'Detroit Red Wings',          league: 'NHL', position: 'Center',          decades: ['1990s'] },
  { name: 'Vyacheslav Kozlov',        team: 'Detroit Red Wings',          league: 'NHL', position: 'Left Wing',       decades: ['1990s'] },
  { name: 'Slava Fetisov',            team: 'Detroit Red Wings',          league: 'NHL', position: 'Defenseman',      decades: ['1990s'] },
  { name: 'Keith Tkachuk',            team: 'St. Louis Blues',            league: 'NHL', position: 'Left Wing',       decades: ['1990s', '2000s'] },
  { name: 'Pierre Turgeon',           team: 'St. Louis Blues',            league: 'NHL', position: 'Center',          decades: ['1990s'] },
  { name: 'Al MacInnis',              team: 'St. Louis Blues',            league: 'NHL', position: 'Defenseman',      decades: ['1990s', '2000s'] },
  { name: 'Peter Forsberg',           team: 'Colorado Avalanche',         league: 'NHL', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'Claude Lemieux',           team: 'Colorado Avalanche',         league: 'NHL', position: 'Right Wing',      decades: ['1990s'] },
  { name: 'Teemu Selanne',            team: 'Anaheim Ducks',              league: 'NHL', position: 'Right Wing',      decades: ['1990s', '2000s'] },
  { name: 'Paul Kariya',              team: 'Anaheim Ducks',              league: 'NHL', position: 'Left Wing',       decades: ['1990s', '2000s'] },
  { name: 'Scott Niedermayer',        team: 'Anaheim Ducks',              league: 'NHL', position: 'Defenseman',      decades: ['1990s', '2000s'] },
  { name: 'Jean-Sebastien Giguere',   team: 'Anaheim Ducks',              league: 'NHL', position: 'Goalie',          decades: ['2000s'] },
  { name: 'John LeClair',             team: 'Philadelphia Flyers',        league: 'NHL', position: 'Left Wing',       decades: ['1990s'] },
  { name: 'Eric Lindros',             team: 'Philadelphia Flyers',        league: 'NHL', position: 'Center',          decades: ['1990s'] },
  { name: 'Rod Brind\'Amour',         team: 'Carolina Hurricanes',        league: 'NHL', position: 'Center',          decades: ['2000s'] },
  { name: 'Martin Gelinas',           team: 'Carolina Hurricanes',        league: 'NHL', position: 'Left Wing',       decades: ['2000s'] },
  { name: 'Peter Bondra',             team: 'Washington Capitals',        league: 'NHL', position: 'Right Wing',      decades: ['1990s', '2000s'] },
  { name: 'Adam Oates',               team: 'Washington Capitals',        league: 'NHL', position: 'Center',          decades: ['1990s'] },
  { name: 'Pat Verbeek',              team: 'New York Rangers',           league: 'NHL', position: 'Right Wing',      decades: ['1990s'] },
  { name: 'Brian Leetch',             team: 'New York Rangers',           league: 'NHL', position: 'Defenseman',      decades: ['1990s'] },
  { name: 'Mike Richter',             team: 'New York Rangers',           league: 'NHL', position: 'Goalie',          decades: ['1990s'] },
  { name: 'Jeremy Roenick',           team: 'Chicago Blackhawks',         league: 'NHL', position: 'Center',          decades: ['1990s', '2000s'] },
  { name: 'Chris Pronger',            team: 'Edmonton Oilers',            league: 'NHL', position: 'Defenseman',      decades: ['2000s', '2010s'] },
  { name: 'Eric Staal',               team: 'Carolina Hurricanes',        league: 'NHL', position: 'Center',          decades: ['2000s', '2010s'] },
  { name: 'Henrik Zetterberg',        team: 'Detroit Red Wings',          league: 'NHL', position: 'Left Wing',       decades: ['2000s', '2010s'] },
  { name: 'Pavel Datsyuk',            team: 'Detroit Red Wings',          league: 'NHL', position: 'Center',          decades: ['2000s', '2010s'] },
  { name: 'Ilya Kovalchuk',           team: 'New Jersey Devils',          league: 'NHL', position: 'Left Wing',       decades: ['2000s', '2010s'] },
  { name: 'Evgeni Malkin',            team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Center',          decades: ['2000s', '2010s'] },
  { name: 'Marc-Andre Fleury',        team: 'Vegas Golden Knights',       league: 'NHL', position: 'Goalie',          decades: ['2000s', '2010s'] },
  { name: 'Henrik Lundqvist',         team: 'New York Rangers',           league: 'NHL', position: 'Goalie',          decades: ['2000s', '2010s'] },
  { name: 'Roberto Luongo',           team: 'Vancouver Canucks',          league: 'NHL', position: 'Goalie',          decades: ['2000s', '2010s'] },
  { name: 'Ryan Miller',              team: 'Buffalo Sabres',             league: 'NHL', position: 'Goalie',          decades: ['2000s', '2010s'] },
  { name: 'Carey Price',              team: 'Montreal Canadiens',         league: 'NHL', position: 'Goalie',          decades: ['2010s'] },
  { name: 'Corey Perry',              team: 'Anaheim Ducks',              league: 'NHL', position: 'Right Wing',      decades: ['2000s', '2010s'] },
  { name: 'Ryan Getzlaf',             team: 'Anaheim Ducks',              league: 'NHL', position: 'Center',          decades: ['2000s', '2010s'] },
  { name: 'Rick Nash',                team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Left Wing',       decades: ['2000s', '2010s'] },
  { name: 'Mike Richards',            team: 'Philadelphia Flyers',        league: 'NHL', position: 'Center',          decades: ['2000s', '2010s'] },
  { name: 'Jeff Carter',              team: 'Los Angeles Kings',          league: 'NHL', position: 'Center',          decades: ['2010s'] },
  { name: 'Jonathan Quick',           team: 'Los Angeles Kings',          league: 'NHL', position: 'Goalie',          decades: ['2010s'] },
  { name: 'Dustin Brown',             team: 'Los Angeles Kings',          league: 'NHL', position: 'Right Wing',      decades: ['2010s'] },
];

const toStaticPool = (raw, prefix) =>
  raw.map((a, i) => ({ ...a, id: `${prefix}_${i}`, photoUrl: '', emoji: LEAGUE_EMOJI[a.league] || '🏅' }));

const NORMAL_ATHLETES  = toStaticPool(NORMAL_ATHLETES_RAW,  'normal');
const LEGENDS_ATHLETES = toStaticPool(LEGENDS_ATHLETES_RAW, 'legend');

// ─────────────────────────────────────────────────────────────────────────────
// BALL KNOWLEDGE — deeply obscure active roster players (300+ per league)
// ─────────────────────────────────────────────────────────────────────────────
const BALL_KNOWLEDGE_RAW = [
  // ── NBA (deep bench, two-way, G-League) ──
  { name: 'Jordan Nwora',             team: 'Toronto Raptors',            league: 'NBA', position: 'Forward' },
  { name: 'Svi Mykhailiuk',           team: 'Charlotte Hornets',          league: 'NBA', position: 'Guard' },
  { name: 'Jaylen Nowell',            team: 'Minnesota Timberwolves',     league: 'NBA', position: 'Guard' },
  { name: 'Scotty Pippen Jr.',        team: 'Memphis Grizzlies',          league: 'NBA', position: 'Guard' },
  { name: 'Amari Bailey',             team: 'Los Angeles Lakers',         league: 'NBA', position: 'Guard' },
  { name: 'Jalen Hood-Schifino',      team: 'Los Angeles Lakers',         league: 'NBA', position: 'Guard' },
  { name: 'Trayce Jackson-Davis',     team: 'Golden State Warriors',      league: 'NBA', position: 'Center' },
  { name: 'Lester Quinones',          team: 'Memphis Grizzlies',          league: 'NBA', position: 'Guard' },
  { name: 'TyTy Washington Jr.',      team: 'Houston Rockets',            league: 'NBA', position: 'Guard' },
  { name: 'Bobi Klintman',            team: 'Sacramento Kings',           league: 'NBA', position: 'Forward' },
  { name: 'Kobe Brown',               team: 'Portland Trail Blazers',     league: 'NBA', position: 'Forward' },
  { name: 'Jermaine Samuels',         team: 'San Antonio Spurs',          league: 'NBA', position: 'Forward' },
  { name: 'Colby Jones',              team: 'Sacramento Kings',           league: 'NBA', position: 'Guard' },
  { name: 'A.J. Lawson',              team: 'Dallas Mavericks',           league: 'NBA', position: 'Forward' },
  { name: 'Tristan Vukcevic',         team: 'Portland Trail Blazers',     league: 'NBA', position: 'Center' },
  { name: 'Usman Garuba',             team: 'Utah Jazz',                  league: 'NBA', position: 'Forward' },
  { name: 'Darius Days',              team: 'New Orleans Pelicans',       league: 'NBA', position: 'Forward' },
  { name: 'Marques Bolden',           team: 'Cleveland Cavaliers',        league: 'NBA', position: 'Center' },
  { name: 'Luka Samanic',             team: 'Charlotte Hornets',          league: 'NBA', position: 'Forward' },
  { name: 'Justin Lewis',             team: 'Milwaukee Bucks',            league: 'NBA', position: 'Forward' },
  { name: 'Jalen Slawson',            team: 'Memphis Grizzlies',          league: 'NBA', position: 'Forward' },
  { name: 'Duop Reath',               team: 'Portland Trail Blazers',     league: 'NBA', position: 'Center' },
  { name: 'Keaton Wallace',           team: 'Detroit Pistons',            league: 'NBA', position: 'Guard' },
  { name: 'Ron Harper Jr.',           team: 'Toronto Raptors',            league: 'NBA', position: 'Forward' },
  { name: 'Jaylen Martin',            team: 'Houston Rockets',            league: 'NBA', position: 'Forward' },
  { name: 'Nate Hinton',              team: 'Chicago Bulls',              league: 'NBA', position: 'Guard' },
  { name: 'Oscar Tshiebwe',           team: 'Sacramento Kings',           league: 'NBA', position: 'Center' },
  { name: 'Jalen Crutcher',           team: 'Oklahoma City Thunder',      league: 'NBA', position: 'Guard' },
  { name: 'David Duke Jr.',           team: 'Cleveland Cavaliers',        league: 'NBA', position: 'Guard' },
  { name: 'Moussa Diabate',           team: 'Charlotte Hornets',          league: 'NBA', position: 'Center' },
  { name: 'Quinten Post',             team: 'Golden State Warriors',      league: 'NBA', position: 'Center' },
  { name: 'Gui Santos',               team: 'Golden State Warriors',      league: 'NBA', position: 'Forward' },
  { name: 'Chance Comanche',          team: 'Charlotte Hornets',          league: 'NBA', position: 'Center' },
  { name: 'Enrique Freeman',          team: 'Indiana Pacers',             league: 'NBA', position: 'Forward' },
  { name: 'Jaime Jaquez Jr.',         team: 'Miami Heat',                 league: 'NBA', position: 'Forward' },
  { name: 'Patrick Baldwin Jr.',      team: 'Philadelphia 76ers',         league: 'NBA', position: 'Forward' },
  { name: 'Josh Minott',              team: 'Memphis Grizzlies',          league: 'NBA', position: 'Forward' },
  { name: 'MarJon Beauchamp',         team: 'Milwaukee Bucks',            league: 'NBA', position: 'Forward' },
  { name: 'Jaden Springer',           team: 'Boston Celtics',             league: 'NBA', position: 'Guard' },
  { name: 'Wendell Moore Jr.',        team: 'Oklahoma City Thunder',      league: 'NBA', position: 'Guard' },
  { name: 'Sidy Cissoko',             team: 'San Antonio Spurs',          league: 'NBA', position: 'Guard' },
  { name: 'Jaylen Wilson',            team: 'Detroit Pistons',            league: 'NBA', position: 'Forward' },
  { name: 'Michael Foster Jr.',       team: 'San Antonio Spurs',          league: 'NBA', position: 'Forward' },
  { name: 'Dominick Barlow',          team: 'San Antonio Spurs',          league: 'NBA', position: 'Forward' },
  { name: 'Ryan Rollins',             team: 'Boston Celtics',             league: 'NBA', position: 'Guard' },
  { name: 'Marcus Sasser',            team: 'Detroit Pistons',            league: 'NBA', position: 'Guard' },
  { name: 'Emoni Bates',              team: 'Detroit Pistons',            league: 'NBA', position: 'Forward' },
  { name: 'Jalen Duren',              team: 'Detroit Pistons',            league: 'NBA', position: 'Center' },
  { name: 'Isaiah Livers',            team: 'Detroit Pistons',            league: 'NBA', position: 'Forward' },
  { name: 'Kaleb Johnson',            team: 'Utah Jazz',                  league: 'NBA', position: 'Forward' },
  { name: 'Kris Murray',              team: 'Utah Jazz',                  league: 'NBA', position: 'Forward' },
  { name: 'Taylor Hendricks',         team: 'Utah Jazz',                  league: 'NBA', position: 'Forward' },
  { name: 'Keyonte George',           team: 'Utah Jazz',                  league: 'NBA', position: 'Guard' },
  { name: 'Brice Sensabaugh',         team: 'Utah Jazz',                  league: 'NBA', position: 'Guard' },
  { name: 'Isaiah Jackson',           team: 'Utah Jazz',                  league: 'NBA', position: 'Center' },
  { name: 'Jordan Hawkins',           team: 'New Orleans Pelicans',       league: 'NBA', position: 'Guard' },
  { name: 'Dereon Seabron',           team: 'New Orleans Pelicans',       league: 'NBA', position: 'Guard' },
  { name: 'Brandin Podziemski',       team: 'Golden State Warriors',      league: 'NBA', position: 'Guard' },
  { name: 'Reece Beekman',            team: 'Golden State Warriors',      league: 'NBA', position: 'Guard' },
  { name: 'Pat Spencer',              team: 'Golden State Warriors',      league: 'NBA', position: 'Guard' },
  { name: 'Mojave King',              team: 'Indiana Pacers',             league: 'NBA', position: 'Guard' },
  { name: 'James Nnaji',              team: 'Charlotte Hornets',          league: 'NBA', position: 'Center' },
  { name: 'Jordan Ford',              team: 'New Orleans Pelicans',       league: 'NBA', position: 'Guard' },
  { name: 'Javante McCoy',            team: 'Charlotte Hornets',          league: 'NBA', position: 'Guard' },
  { name: 'Taze Moore',               team: 'Houston Rockets',            league: 'NBA', position: 'Guard' },
  { name: 'Jabari Walker',            team: 'Portland Trail Blazers',     league: 'NBA', position: 'Forward' },
  { name: 'Moses Brown',              team: 'Oklahoma City Thunder',      league: 'NBA', position: 'Center' },
  { name: 'Lindy Waters III',         team: 'Oklahoma City Thunder',      league: 'NBA', position: 'Forward' },
  { name: 'Ousmane Dieng',            team: 'Oklahoma City Thunder',      league: 'NBA', position: 'Forward' },
  { name: 'Nikola Jovic',             team: 'Miami Heat',                 league: 'NBA', position: 'Forward' },
  { name: 'Haywood Highsmith',        team: 'Miami Heat',                 league: 'NBA', position: 'Forward' },
  { name: 'Jamal Cain',               team: 'Atlanta Hawks',              league: 'NBA', position: 'Forward' },
  { name: 'Vit Krejci',               team: 'Atlanta Hawks',              league: 'NBA', position: 'Guard' },
  { name: 'Kobe Bufkin',              team: 'Atlanta Hawks',              league: 'NBA', position: 'Guard' },
  { name: 'Seth Lundy',               team: 'Philadelphia 76ers',         league: 'NBA', position: 'Guard' },
  { name: 'KJ Martin',                team: 'New York Knicks',            league: 'NBA', position: 'Forward' },
  { name: 'Jake LaRavia',             team: 'Memphis Grizzlies',          league: 'NBA', position: 'Forward' },
  { name: 'Tari Eason',               team: 'Houston Rockets',            league: 'NBA', position: 'Forward' },
  { name: 'Patrick Williams',         team: 'Chicago Bulls',              league: 'NBA', position: 'Forward' },
  { name: 'Ayo Dosunmu',              team: 'Chicago Bulls',              league: 'NBA', position: 'Guard' },
  { name: 'Torrey Craig',             team: 'Indiana Pacers',             league: 'NBA', position: 'Forward' },
  { name: 'James Wiseman',            team: 'Detroit Pistons',            league: 'NBA', position: 'Center' },
  { name: 'Jonathan Kuminga',         team: 'Golden State Warriors',      league: 'NBA', position: 'Forward' },
  { name: 'Moses Moody',              team: 'Golden State Warriors',      league: 'NBA', position: 'Guard' },
  { name: 'Nico Mannion',             team: 'Golden State Warriors',      league: 'NBA', position: 'Guard' },
  { name: 'Damion Lee',               team: 'Phoenix Suns',               league: 'NBA', position: 'Guard' },
  { name: 'Jock Landale',             team: 'Phoenix Suns',               league: 'NBA', position: 'Center' },
  { name: 'Nassir Little',            team: 'Phoenix Suns',               league: 'NBA', position: 'Forward' },
  { name: 'Drew Eubanks',             team: 'Phoenix Suns',               league: 'NBA', position: 'Center' },
  { name: 'Josh Okogie',              team: 'Phoenix Suns',               league: 'NBA', position: 'Guard' },
  { name: 'Udoka Azubuike',           team: 'Utah Jazz',                  league: 'NBA', position: 'Center' },
  { name: 'Juan Toscano-Anderson',    team: 'Utah Jazz',                  league: 'NBA', position: 'Forward' },
  { name: 'Ochai Agbaji',             team: 'Utah Jazz',                  league: 'NBA', position: 'Guard' },
  { name: 'Balsa Koprivica',          team: 'Chicago Bulls',              league: 'NBA', position: 'Center' },
  { name: 'Stanley Johnson',          team: 'New Orleans Pelicans',       league: 'NBA', position: 'Forward' },
  { name: 'E.J. Liddell',             team: 'New Orleans Pelicans',       league: 'NBA', position: 'Forward' },
  { name: 'Jose Alvarado',            team: 'New Orleans Pelicans',       league: 'NBA', position: 'Guard' },
  { name: 'Kira Lewis Jr.',           team: 'New Orleans Pelicans',       league: 'NBA', position: 'Guard' },
  { name: 'Dyson Daniels',            team: 'Atlanta Hawks',              league: 'NBA', position: 'Guard' },
  { name: 'Devin Robinson',           team: 'Washington Wizards',         league: 'NBA', position: 'Forward' },
  { name: 'Eugene Omoruyi',           team: 'Washington Wizards',         league: 'NBA', position: 'Forward' },
  { name: 'Tyus Jones',               team: 'Washington Wizards',         league: 'NBA', position: 'Guard' },
  { name: 'Xavier Moon',              team: 'Sacramento Kings',           league: 'NBA', position: 'Guard' },
  { name: 'Jordan Schakel',           team: 'Sacramento Kings',           league: 'NBA', position: 'Guard' },
  { name: 'Sasha Vezenkov',           team: 'Sacramento Kings',           league: 'NBA', position: 'Forward' },
  { name: 'Chris Duarte',             team: 'Sacramento Kings',           league: 'NBA', position: 'Guard' },
  { name: 'Marcus Zegarowski',        team: 'Cleveland Cavaliers',        league: 'NBA', position: 'Guard' },
  { name: 'Mamadi Diakite',           team: 'Washington Wizards',         league: 'NBA', position: 'Forward' },
  { name: 'RaiQuan Gray',             team: 'Brooklyn Nets',              league: 'NBA', position: 'Forward' },
  { name: 'Day\'Ron Sharpe',          team: 'Brooklyn Nets',              league: 'NBA', position: 'Center' },
  { name: 'Noah Clowney',             team: 'Brooklyn Nets',              league: 'NBA', position: 'Forward' },
  { name: 'Dariq Whitehead',          team: 'Brooklyn Nets',              league: 'NBA', position: 'Guard' },
  { name: 'Dennis Schroder',          team: 'Brooklyn Nets',              league: 'NBA', position: 'Guard' },
  { name: 'Mikal Bridges',            team: 'Brooklyn Nets',              league: 'NBA', position: 'Forward' },

  // ── NFL (practice squad, special teams, 3rd-string) ──
  { name: 'Deon Jackson',             team: 'Indianapolis Colts',         league: 'NFL', position: 'Running Back' },
  { name: 'Elijah Higgins',           team: 'Arizona Cardinals',          league: 'NFL', position: 'Tight End' },
  { name: 'Jalen Camp',               team: 'Jacksonville Jaguars',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Velus Jones Jr.',          team: 'Chicago Bears',              league: 'NFL', position: 'Wide Receiver' },
  { name: 'Bo Melton',                team: 'Green Bay Packers',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Dontario Drummond',        team: 'Los Angeles Rams',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Trey Palmer',              team: 'Tampa Bay Buccaneers',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Kalil Pimpleton',          team: 'Carolina Panthers',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Cade Stover',              team: 'Houston Texans',             league: 'NFL', position: 'Tight End' },
  { name: 'Blake Whiteheart',         team: 'Washington Commanders',      league: 'NFL', position: 'Tight End' },
  { name: 'Hunter Long',              team: 'Los Angeles Rams',           league: 'NFL', position: 'Tight End' },
  { name: 'E.J. Perry',               team: 'New England Patriots',       league: 'NFL', position: 'Quarterback' },
  { name: 'Aidan O\'Connell',         team: 'Las Vegas Raiders',          league: 'NFL', position: 'Quarterback' },
  { name: 'Jake Haener',              team: 'New Orleans Saints',         league: 'NFL', position: 'Quarterback' },
  { name: 'Max Duggan',               team: 'Los Angeles Chargers',       league: 'NFL', position: 'Quarterback' },
  { name: 'Tyquan Thornton',          team: 'New England Patriots',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tre Tucker',               team: 'Las Vegas Raiders',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Warren Jackson',           team: 'Denver Broncos',             league: 'NFL', position: 'Wide Receiver' },
  { name: 'Zamir White',              team: 'Las Vegas Raiders',          league: 'NFL', position: 'Running Back' },
  { name: 'Kimani Vidal',             team: 'Los Angeles Chargers',       league: 'NFL', position: 'Running Back' },
  { name: 'Hassan Haskins',           team: 'Tennessee Titans',           league: 'NFL', position: 'Running Back' },
  { name: 'Dylan Laube',              team: 'New England Patriots',       league: 'NFL', position: 'Running Back' },
  { name: 'Jalen Reagor',             team: 'Minnesota Vikings',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Kaden Davis',              team: 'Las Vegas Raiders',          league: 'NFL', position: 'Tight End' },
  { name: 'Noah Gray',                team: 'Kansas City Chiefs',         league: 'NFL', position: 'Tight End' },
  { name: 'Kolby Harvell-Peel',       team: 'Denver Broncos',             league: 'NFL', position: 'Safety' },
  { name: 'JT Woods',                 team: 'Denver Broncos',             league: 'NFL', position: 'Safety' },
  { name: 'Myjai Sanders',            team: 'Carolina Panthers',          league: 'NFL', position: 'Linebacker' },
  { name: 'Tuli Tuipulotu',           team: 'Los Angeles Chargers',       league: 'NFL', position: 'Defensive End' },
  { name: 'Viliami Fehoko',           team: 'San Francisco 49ers',        league: 'NFL', position: 'Defensive End' },
  { name: 'Keion White',              team: 'New England Patriots',       league: 'NFL', position: 'Defensive End' },
  { name: 'Anfernee Jennings',        team: 'New England Patriots',       league: 'NFL', position: 'Linebacker' },
  { name: 'Chubba Hubbard',           team: 'Carolina Panthers',          league: 'NFL', position: 'Running Back' },
  { name: 'Elijah Jones',             team: 'New England Patriots',       league: 'NFL', position: 'Cornerback' },
  { name: 'Jalen McKenzie',           team: 'Los Angeles Rams',           league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Dallis Flowers',           team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Cornerback' },
  { name: 'Mark Evans II',            team: 'Cincinnati Bengals',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Jaquarii Roberson',        team: 'Tampa Bay Buccaneers',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Daewood Davis',            team: 'Buffalo Bills',              league: 'NFL', position: 'Wide Receiver' },
  { name: 'Brock Wright',             team: 'Detroit Lions',              league: 'NFL', position: 'Tight End' },
  { name: 'Parker Washington',        team: 'Jacksonville Jaguars',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tank Dell',                team: 'Houston Texans',             league: 'NFL', position: 'Wide Receiver' },
  { name: 'Xavier Gipson',            team: 'New York Jets',              league: 'NFL', position: 'Wide Receiver' },
  { name: 'Marvin Mims Jr.',          team: 'Denver Broncos',             league: 'NFL', position: 'Wide Receiver' },
  { name: 'Quentin Johnston',         team: 'Los Angeles Chargers',       league: 'NFL', position: 'Wide Receiver' },
  { name: 'Jordan Addison',           team: 'Minnesota Vikings',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Jonathan Mingo',           team: 'Carolina Panthers',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Zay Flowers',              team: 'Baltimore Ravens',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Josh Downs',               team: 'Indianapolis Colts',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Rashid Shaheed',           team: 'New Orleans Saints',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Michael Wilson',           team: 'Arizona Cardinals',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Tyrone Tracy Jr.',         team: 'New York Giants',            league: 'NFL', position: 'Running Back' },
  { name: 'Deuce Vaughn',             team: 'Kansas City Chiefs',         league: 'NFL', position: 'Running Back' },
  { name: 'Roschon Johnson',          team: 'Chicago Bears',              league: 'NFL', position: 'Running Back' },
  { name: 'Chase Brown',              team: 'Cincinnati Bengals',         league: 'NFL', position: 'Running Back' },
  { name: 'Tyjae Spears',             team: 'Tennessee Titans',           league: 'NFL', position: 'Running Back' },
  { name: 'Devon Achane',             team: 'Miami Dolphins',             league: 'NFL', position: 'Running Back' },
  { name: 'Israel Abanikanda',        team: 'New York Jets',              league: 'NFL', position: 'Running Back' },
  { name: 'Evan Hull',                team: 'Indianapolis Colts',         league: 'NFL', position: 'Running Back' },
  { name: 'Aidan OConnell',           team: 'Las Vegas Raiders',          league: 'NFL', position: 'Quarterback' },
  { name: 'Jake Browning',            team: 'Cincinnati Bengals',         league: 'NFL', position: 'Quarterback' },
  { name: 'Jaren Hall',               team: 'Minnesota Vikings',          league: 'NFL', position: 'Quarterback' },
  { name: 'Joshua Dobbs',             team: 'San Francisco 49ers',        league: 'NFL', position: 'Quarterback' },
  { name: 'Easton Stick',             team: 'Los Angeles Chargers',       league: 'NFL', position: 'Quarterback' },
  { name: 'Tim Boyle',                team: 'New York Jets',              league: 'NFL', position: 'Quarterback' },
  { name: 'Reid Sinnett',             team: 'San Francisco 49ers',        league: 'NFL', position: 'Quarterback' },
  { name: 'Tanner McKee',             team: 'Philadelphia Eagles',        league: 'NFL', position: 'Quarterback' },
  { name: 'Clayton Tune',             team: 'Arizona Cardinals',          league: 'NFL', position: 'Quarterback' },
  { name: 'Will Grier',               team: 'Atlanta Falcons',            league: 'NFL', position: 'Quarterback' },
  { name: 'Nick Mullens',             team: 'Minnesota Vikings',          league: 'NFL', position: 'Quarterback' },
  { name: 'Malik Cunningham',         team: 'New England Patriots',       league: 'NFL', position: 'Quarterback' },
  { name: 'Sione Takitaki',           team: 'Cleveland Browns',           league: 'NFL', position: 'Linebacker' },
  { name: 'Tanner Muse',              team: 'Las Vegas Raiders',          league: 'NFL', position: 'Linebacker' },
  { name: 'David Long Jr.',           team: 'Miami Dolphins',             league: 'NFL', position: 'Linebacker' },
  { name: 'Jamin Davis',              team: 'Washington Commanders',      league: 'NFL', position: 'Linebacker' },
  { name: 'Tyreke Smith',             team: 'Seattle Seahawks',           league: 'NFL', position: 'Defensive End' },
  { name: 'Isaiah Thomas',            team: 'Seattle Seahawks',           league: 'NFL', position: 'Defensive End' },
  { name: 'Khaleke Hudson',           team: 'Buffalo Bills',              league: 'NFL', position: 'Linebacker' },
  { name: 'Nik Bonitto',              team: 'Denver Broncos',             league: 'NFL', position: 'Linebacker' },
  { name: 'DJ Ivey',                  team: 'Miami Dolphins',             league: 'NFL', position: 'Cornerback' },
  { name: 'Eli Ricks',                team: 'Carolina Panthers',          league: 'NFL', position: 'Cornerback' },
  { name: 'Dreshun Miller',           team: 'Indianapolis Colts',         league: 'NFL', position: 'Cornerback' },
  { name: 'Thaddeus Moss',            team: 'Las Vegas Raiders',          league: 'NFL', position: 'Tight End' },
  { name: 'Brenton Strange',          team: 'Jacksonville Jaguars',       league: 'NFL', position: 'Tight End' },
  { name: 'Devin Culp',               team: 'Seattle Seahawks',           league: 'NFL', position: 'Tight End' },
  { name: 'Jody Fortson',             team: 'Kansas City Chiefs',         league: 'NFL', position: 'Tight End' },
  { name: 'Quintin Morris',           team: 'Buffalo Bills',              league: 'NFL', position: 'Tight End' },
  { name: 'Brayden Willis',           team: 'Baltimore Ravens',           league: 'NFL', position: 'Tight End' },
  { name: 'Gerrit Prince',            team: 'Los Angeles Rams',           league: 'NFL', position: 'Tight End' },
  { name: 'Teagan Quitoriano',        team: 'Houston Texans',             league: 'NFL', position: 'Tight End' },
  { name: 'Sidy Sow',                 team: 'New England Patriots',       league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Dawand Jones',             team: 'Cleveland Browns',           league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Broderick Jones',          team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Anton Harrison',           team: 'Jacksonville Jaguars',       league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Paris Johnson Jr.',        team: 'Arizona Cardinals',          league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Peter Skoronski',          team: 'Tennessee Titans',           league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Darnell Wright',           team: 'Chicago Bears',              league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Matthew Bergeron',         team: 'Atlanta Falcons',            league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Steve Avila',              team: 'Los Angeles Rams',           league: 'NFL', position: 'Offensive Lineman' },
  { name: 'Luke Musgrave',            team: 'Green Bay Packers',          league: 'NFL', position: 'Tight End' },
  { name: 'Tucker Kraft',             team: 'Green Bay Packers',          league: 'NFL', position: 'Tight End' },
  { name: 'Jayden Reed',              team: 'Green Bay Packers',          league: 'NFL', position: 'Wide Receiver' },
  { name: 'Malik Heath',              team: 'Miami Dolphins',             league: 'NFL', position: 'Wide Receiver' },
  { name: 'Kadarius Toney',           team: 'Kansas City Chiefs',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Mecole Hardman',           team: 'Kansas City Chiefs',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Justyn Ross',              team: 'Kansas City Chiefs',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'Demarcus Robinson',        team: 'Los Angeles Rams',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Cody White',               team: 'Detroit Lions',              league: 'NFL', position: 'Wide Receiver' },
  { name: 'Josh Reynolds',            team: 'Detroit Lions',              league: 'NFL', position: 'Wide Receiver' },
  { name: 'Donovan Peoples-Jones',    team: 'Cleveland Browns',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Cedric Tillman',           team: 'Cleveland Browns',           league: 'NFL', position: 'Wide Receiver' },
  { name: 'Marquez Valdes-Scantling', team: 'New Orleans Saints',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'A.T. Perry',               team: 'New Orleans Saints',         league: 'NFL', position: 'Wide Receiver' },
  { name: 'D.J. Turner II',           team: 'Cincinnati Bengals',         league: 'NFL', position: 'Cornerback' },
  { name: 'Cam Taylor-Britt',         team: 'Cincinnati Bengals',         league: 'NFL', position: 'Cornerback' },
  { name: 'Coby Bryant',              team: 'Seattle Seahawks',           league: 'NFL', position: 'Cornerback' },
  { name: 'Julius Wood',              team: 'Washington Commanders',      league: 'NFL', position: 'Cornerback' },
  { name: 'Sincere McCormick',        team: 'Las Vegas Raiders',          league: 'NFL', position: 'Running Back' },
  { name: 'Austin Walter',            team: 'Las Vegas Raiders',          league: 'NFL', position: 'Running Back' },
  { name: 'RJ Harvey',                team: 'Las Vegas Raiders',          league: 'NFL', position: 'Running Back' },
  { name: 'Jaylen Warren',            team: 'Pittsburgh Steelers',        league: 'NFL', position: 'Running Back' },
  { name: 'Demetric Felton',          team: 'Cleveland Browns',           league: 'NFL', position: 'Running Back' },
  { name: 'Dare Ogunbowale',          team: 'Houston Texans',             league: 'NFL', position: 'Running Back' },
  { name: 'Nathan Rourke',            team: 'Jacksonville Jaguars',       league: 'NFL', position: 'Quarterback' },
  { name: 'Chris Streveler',          team: 'New York Jets',              league: 'NFL', position: 'Quarterback' },
  { name: 'Alex McGough',             team: 'Los Angeles Rams',           league: 'NFL', position: 'Quarterback' },

  // ── MLB (Triple-A call-ups, prospects) ──
  { name: 'Nolan Schanuel',           team: 'Los Angeles Angels',         league: 'MLB', position: 'First Baseman' },
  { name: 'Tanner Bibee',             team: 'Cleveland Guardians',        league: 'MLB', position: 'Pitcher' },
  { name: 'Gavin Williams',           team: 'Cleveland Guardians',        league: 'MLB', position: 'Pitcher' },
  { name: 'Emmet Sheehan',            team: 'Los Angeles Dodgers',        league: 'MLB', position: 'Pitcher' },
  { name: 'Bryan Ramos',              team: 'Chicago White Sox',          league: 'MLB', position: 'Third Baseman' },
  { name: 'Jared Shuster',            team: 'Atlanta Braves',             league: 'MLB', position: 'Pitcher' },
  { name: 'Dylan Dodd',               team: 'Atlanta Braves',             league: 'MLB', position: 'Pitcher' },
  { name: 'Wyatt Langford',           team: 'Texas Rangers',              league: 'MLB', position: 'Outfielder' },
  { name: 'Brock Porter',             team: 'Texas Rangers',              league: 'MLB', position: 'Pitcher' },
  { name: 'Jackson Holliday',         team: 'Baltimore Orioles',          league: 'MLB', position: 'Shortstop' },
  { name: 'Colt Keith',               team: 'Detroit Tigers',             league: 'MLB', position: 'Second Baseman' },
  { name: 'Parker Meadows',           team: 'Detroit Tigers',             league: 'MLB', position: 'Outfielder' },
  { name: 'Ty Madden',                team: 'Detroit Tigers',             league: 'MLB', position: 'Pitcher' },
  { name: 'Keider Montero',           team: 'Detroit Tigers',             league: 'MLB', position: 'Pitcher' },
  { name: 'Max Meyer',                team: 'Miami Marlins',              league: 'MLB', position: 'Pitcher' },
  { name: 'Jacob Berry',              team: 'Miami Marlins',              league: 'MLB', position: 'Outfielder' },
  { name: 'Kyle Nicolas',             team: 'Miami Marlins',              league: 'MLB', position: 'Pitcher' },
  { name: 'Joey Wiemer',              team: 'Milwaukee Brewers',          league: 'MLB', position: 'Outfielder' },
  { name: 'Sal Frelick',              team: 'Milwaukee Brewers',          league: 'MLB', position: 'Outfielder' },
  { name: 'Tobias Myers',             team: 'Milwaukee Brewers',          league: 'MLB', position: 'Pitcher' },
  { name: 'Owen White',               team: 'Texas Rangers',              league: 'MLB', position: 'Pitcher' },
  { name: 'Brendan Donovan',          team: 'St. Louis Cardinals',        league: 'MLB', position: 'Utility' },
  { name: 'Gordon Graceffo',          team: 'St. Louis Cardinals',        league: 'MLB', position: 'Pitcher' },
  { name: 'Andre Pallante',           team: 'St. Louis Cardinals',        league: 'MLB', position: 'Pitcher' },
  { name: 'Sem Robberse',             team: 'Toronto Blue Jays',          league: 'MLB', position: 'Pitcher' },
  { name: 'Ricky Tiedemann',          team: 'Toronto Blue Jays',          league: 'MLB', position: 'Pitcher' },
  { name: 'Hagen Danner',             team: 'Toronto Blue Jays',          league: 'MLB', position: 'Catcher' },
  { name: 'Matt Waldron',             team: 'San Diego Padres',           league: 'MLB', position: 'Pitcher' },
  { name: 'Dylan Lesko',              team: 'San Diego Padres',           league: 'MLB', position: 'Pitcher' },
  { name: 'Bryce Jarvis',             team: 'Arizona Diamondbacks',       league: 'MLB', position: 'Pitcher' },
  { name: 'Drew Romo',                team: 'Colorado Rockies',           league: 'MLB', position: 'Catcher' },
  { name: 'Zac Veen',                 team: 'Colorado Rockies',           league: 'MLB', position: 'Outfielder' },
  { name: 'Adael Amador',             team: 'Colorado Rockies',           league: 'MLB', position: 'Shortstop' },
  { name: 'Tanner Tully',             team: 'Cleveland Guardians',        league: 'MLB', position: 'Pitcher' },
  { name: 'David Festa',              team: 'Minnesota Twins',            league: 'MLB', position: 'Pitcher' },
  { name: 'Charlie Mack',             team: 'Philadelphia Phillies',      league: 'MLB', position: 'Infielder' },
  { name: 'Mick Abel',                team: 'Philadelphia Phillies',      league: 'MLB', position: 'Pitcher' },
  { name: 'Andrew Painter',           team: 'Philadelphia Phillies',      league: 'MLB', position: 'Pitcher' },
  { name: 'Justin Crawford',          team: 'Philadelphia Phillies',      league: 'MLB', position: 'Outfielder' },
  { name: 'Spencer Jones',            team: 'New York Yankees',           league: 'MLB', position: 'Outfielder' },
  { name: 'Caleb Durbin',             team: 'New York Yankees',           league: 'MLB', position: 'Infielder' },
  { name: 'Ben Rice',                 team: 'New York Yankees',           league: 'MLB', position: 'First Baseman' },
  { name: 'George Lomanto Jr.',       team: 'Boston Red Sox',             league: 'MLB', position: 'Outfielder' },
  { name: 'Kyle Teel',                team: 'Boston Red Sox',             league: 'MLB', position: 'Catcher' },
  { name: 'Marcelo Mayer',            team: 'Boston Red Sox',             league: 'MLB', position: 'Shortstop' },
  { name: 'Roman Anthony',            team: 'Boston Red Sox',             league: 'MLB', position: 'Outfielder' },
  { name: 'Matthew Lugo',             team: 'Boston Red Sox',             league: 'MLB', position: 'Shortstop' },
  { name: 'Chase Meidroth',           team: 'Boston Red Sox',             league: 'MLB', position: 'Infielder' },
  { name: 'Chase Dollander',          team: 'Colorado Rockies',           league: 'MLB', position: 'Pitcher' },
  { name: 'Jett Williams',            team: 'New York Mets',              league: 'MLB', position: 'Shortstop' },
  { name: 'Brandon Sproat',           team: 'New York Mets',              league: 'MLB', position: 'Pitcher' },
  { name: 'Joe Gray Jr.',             team: 'Oakland Athletics',          league: 'MLB', position: 'Outfielder' },
  { name: 'Tyler Soderstrom',         team: 'Oakland Athletics',          league: 'MLB', position: 'Catcher' },
  { name: 'Denzel Clarke',            team: 'Oakland Athletics',          league: 'MLB', position: 'Outfielder' },
  { name: 'Zack Gelof',               team: 'Oakland Athletics',          league: 'MLB', position: 'Second Baseman' },
  { name: 'Mason Miller',             team: 'Oakland Athletics',          league: 'MLB', position: 'Pitcher' },
  { name: 'JP Sears',                 team: 'Oakland Athletics',          league: 'MLB', position: 'Pitcher' },
  { name: 'Michael Toglia',           team: 'Colorado Rockies',           league: 'MLB', position: 'First Baseman' },
  { name: 'Ryan McMahon',             team: 'Colorado Rockies',           league: 'MLB', position: 'Second Baseman' },
  { name: 'Elehuris Montero',         team: 'Colorado Rockies',           league: 'MLB', position: 'First Baseman' },
  { name: 'Aaron Schunk',             team: 'Colorado Rockies',           league: 'MLB', position: 'Third Baseman' },
  { name: 'Brenton Doyle',            team: 'Colorado Rockies',           league: 'MLB', position: 'Outfielder' },
  { name: 'Greg Bird',                team: 'Colorado Rockies',           league: 'MLB', position: 'First Baseman' },
  { name: 'Ezequiel Tovar',           team: 'Colorado Rockies',           league: 'MLB', position: 'Shortstop' },
  { name: 'Brent Rooker',             team: 'Oakland Athletics',          league: 'MLB', position: 'Outfielder' },
  { name: 'Nick Allen',               team: 'Oakland Athletics',          league: 'MLB', position: 'Shortstop' },
  { name: 'Seth Brown',               team: 'Oakland Athletics',          league: 'MLB', position: 'First Baseman' },
  { name: 'Jonah Bride',              team: 'Oakland Athletics',          league: 'MLB', position: 'Utility' },
  { name: 'Carlos Hernandez',         team: 'Kansas City Royals',         league: 'MLB', position: 'Pitcher' },
  { name: 'Austin Cox',               team: 'Kansas City Royals',         league: 'MLB', position: 'Pitcher' },
  { name: 'Dylan Coleman',            team: 'Kansas City Royals',         league: 'MLB', position: 'Pitcher' },
  { name: 'Nick Loftin',              team: 'Kansas City Royals',         league: 'MLB', position: 'Infielder' },
  { name: 'Drew Waters',              team: 'Kansas City Royals',         league: 'MLB', position: 'Outfielder' },
  { name: 'Will Klein',               team: 'Kansas City Royals',         league: 'MLB', position: 'Pitcher' },
  { name: 'James McArthur',           team: 'Kansas City Royals',         league: 'MLB', position: 'Pitcher' },
  { name: 'Michael Massey',           team: 'Kansas City Royals',         league: 'MLB', position: 'Second Baseman' },
  { name: 'Maikel Garcia',            team: 'Kansas City Royals',         league: 'MLB', position: 'Shortstop' },
  { name: 'Brett Baty',               team: 'New York Mets',              league: 'MLB', position: 'Third Baseman' },
  { name: 'Francisco Alvarez',        team: 'New York Mets',              league: 'MLB', position: 'Catcher' },
  { name: 'Mark Vientos',             team: 'New York Mets',              league: 'MLB', position: 'Third Baseman' },
  { name: 'Drew Gilbert',             team: 'New York Mets',              league: 'MLB', position: 'Outfielder' },
  { name: 'Luisangel Acuna',          team: 'New York Mets',              league: 'MLB', position: 'Shortstop' },
  { name: 'Matt Vierling',            team: 'Detroit Tigers',             league: 'MLB', position: 'Outfielder' },
  { name: 'Zach McKinstry',           team: 'Detroit Tigers',             league: 'MLB', position: 'Utility' },
  { name: 'Jake Rogers',              team: 'Detroit Tigers',             league: 'MLB', position: 'Catcher' },
  { name: 'Kerry Carpenter',          team: 'Detroit Tigers',             league: 'MLB', position: 'Outfielder' },
  { name: 'Kenta Maeda',              team: 'Detroit Tigers',             league: 'MLB', position: 'Pitcher' },
  { name: 'Tyler Holton',             team: 'Detroit Tigers',             league: 'MLB', position: 'Pitcher' },
  { name: 'Matt Manning',             team: 'Detroit Tigers',             league: 'MLB', position: 'Pitcher' },
  { name: 'Wilfredo Tovar',           team: 'Tampa Bay Rays',             league: 'MLB', position: 'Infielder' },
  { name: 'Kyle Manzardo',            team: 'Cleveland Guardians',        league: 'MLB', position: 'First Baseman' },
  { name: 'Angel Martinez',           team: 'Cleveland Guardians',        league: 'MLB', position: 'Infielder' },
  { name: 'Gavin Cross',              team: 'Kansas City Royals',         league: 'MLB', position: 'Outfielder' },
  { name: 'Thyago Vieira',            team: 'Seattle Mariners',           league: 'MLB', position: 'Pitcher' },
  { name: 'Emerson Hancock',          team: 'Seattle Mariners',           league: 'MLB', position: 'Pitcher' },
  { name: 'Bryan Woo',                team: 'Seattle Mariners',           league: 'MLB', position: 'Pitcher' },
  { name: 'Jonatan Clase',            team: 'Seattle Mariners',           league: 'MLB', position: 'Outfielder' },
  { name: 'Collin Snider',            team: 'Miami Marlins',              league: 'MLB', position: 'Pitcher' },
  { name: 'Braxton Garrett',          team: 'Miami Marlins',              league: 'MLB', position: 'Pitcher' },
  { name: 'JJ Bleday',                team: 'Oakland Athletics',          league: 'MLB', position: 'Outfielder' },
  { name: 'Daniel Susac',             team: 'Oakland Athletics',          league: 'MLB', position: 'Catcher' },

  // ── NHL (AHL call-ups, 4th liners, < 50 career games) ──
  { name: 'Antti Saarela',            team: 'Carolina Hurricanes',        league: 'NHL', position: 'Center' },
  { name: 'Zach Aston-Reese',         team: 'Toronto Maple Leafs',        league: 'NHL', position: 'Left Wing' },
  { name: 'Noel Acciari',             team: 'St. Louis Blues',            league: 'NHL', position: 'Right Wing' },
  { name: 'Lucas Carlsson',           team: 'San Jose Sharks',            league: 'NHL', position: 'Defenseman' },
  { name: 'Sampo Ranta',              team: 'Chicago Blackhawks',         league: 'NHL', position: 'Left Wing' },
  { name: 'Jayden Struble',           team: 'Montreal Canadiens',         league: 'NHL', position: 'Defenseman' },
  { name: 'Mattias Norlinder',        team: 'Montreal Canadiens',         league: 'NHL', position: 'Defenseman' },
  { name: 'Rafael Harvey-Pinard',     team: 'Montreal Canadiens',         league: 'NHL', position: 'Left Wing' },
  { name: 'Jesse Ylonen',             team: 'Montreal Canadiens',         league: 'NHL', position: 'Right Wing' },
  { name: 'Cole Reinhardt',           team: 'Winnipeg Jets',              league: 'NHL', position: 'Left Wing' },
  { name: 'Dylan Samberg',            team: 'Winnipeg Jets',              league: 'NHL', position: 'Defenseman' },
  { name: 'Ville Heinola',            team: 'Winnipeg Jets',              league: 'NHL', position: 'Defenseman' },
  { name: 'Axel Jonsson-Fjallby',     team: 'Washington Capitals',        league: 'NHL', position: 'Left Wing' },
  { name: 'Brian Pinho',              team: 'New Jersey Devils',          league: 'NHL', position: 'Center' },
  { name: 'Reilly Walsh',             team: 'New Jersey Devils',          league: 'NHL', position: 'Defenseman' },
  { name: 'Nikita Okhotiuk',          team: 'New Jersey Devils',          league: 'NHL', position: 'Defenseman' },
  { name: 'Chase Priskie',            team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Defenseman' },
  { name: 'Denton Mateychuk',         team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Defenseman' },
  { name: 'James Malatesta',          team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Right Wing' },
  { name: 'Kirill Marchenko',         team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Right Wing' },
  { name: 'Joakim Kemell',            team: 'Nashville Predators',        league: 'NHL', position: 'Right Wing' },
  { name: 'Luke Evangelista',         team: 'Nashville Predators',        league: 'NHL', position: 'Right Wing' },
  { name: 'Zachary LHeureux',         team: 'Nashville Predators',        league: 'NHL', position: 'Left Wing' },
  { name: 'Mark Jankowski',           team: 'Seattle Kraken',             league: 'NHL', position: 'Center' },
  { name: 'Kaedan Korczak',           team: 'Seattle Kraken',             league: 'NHL', position: 'Defenseman' },
  { name: 'Andrei Chilikov',          team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Right Wing' },
  { name: 'Adam Raska',               team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Right Wing' },
  { name: 'Justin Sourdif',           team: 'Vancouver Canucks',          league: 'NHL', position: 'Center' },
  { name: 'Aidan McDonough',          team: 'Vancouver Canucks',          league: 'NHL', position: 'Left Wing' },
  { name: 'Linus Karlsson',           team: 'Buffalo Sabres',             league: 'NHL', position: 'Right Wing' },
  { name: 'Ryan Johnson',             team: 'Buffalo Sabres',             league: 'NHL', position: 'Center' },
  { name: 'Isak Rosen',               team: 'Buffalo Sabres',             league: 'NHL', position: 'Right Wing' },
  { name: 'Lukas Rousek',             team: 'Buffalo Sabres',             league: 'NHL', position: 'Right Wing' },
  { name: 'Brandon Biro',             team: 'Buffalo Sabres',             league: 'NHL', position: 'Center' },
  { name: 'Nikolas Matinpalo',        team: 'Carolina Hurricanes',        league: 'NHL', position: 'Center' },
  { name: 'Brendan Lemieux',          team: 'Los Angeles Kings',          league: 'NHL', position: 'Left Wing' },
  { name: 'Samuel Bolduc',            team: 'New York Islanders',         league: 'NHL', position: 'Defenseman' },
  { name: 'Tyler Pitlick',            team: 'Calgary Flames',             league: 'NHL', position: 'Right Wing' },
  { name: 'Nick DeSimone',            team: 'San Jose Sharks',            league: 'NHL', position: 'Defenseman' },
  { name: 'Tristen Robins',           team: 'Ottawa Senators',            league: 'NHL', position: 'Center' },
  { name: 'Roby Jarventie',           team: 'Ottawa Senators',            league: 'NHL', position: 'Left Wing' },
  { name: 'Eeli Tolvanen',            team: 'Seattle Kraken',             league: 'NHL', position: 'Right Wing' },
  { name: 'Maxim Letunov',            team: 'Detroit Red Wings',          league: 'NHL', position: 'Center' },
  { name: 'Jonatan Berggren',         team: 'Detroit Red Wings',          league: 'NHL', position: 'Right Wing' },
  { name: 'Austin Watson',            team: 'Ottawa Senators',            league: 'NHL', position: 'Left Wing' },
  { name: 'Jonathan Aspirot',         team: 'Ottawa Senators',            league: 'NHL', position: 'Defenseman' },
  { name: 'Ridly Greig',              team: 'Ottawa Senators',            league: 'NHL', position: 'Center' },
  { name: 'Leevi Merilainen',         team: 'Ottawa Senators',            league: 'NHL', position: 'Goalie' },
  { name: 'Kevin Korchinski',         team: 'Chicago Blackhawks',         league: 'NHL', position: 'Defenseman' },
  { name: 'Nolan Allan',              team: 'Chicago Blackhawks',         league: 'NHL', position: 'Defenseman' },
  { name: 'Colton Dach',              team: 'Chicago Blackhawks',         league: 'NHL', position: 'Center' },
  { name: 'Frank Nazar',              team: 'Chicago Blackhawks',         league: 'NHL', position: 'Center' },
  { name: 'Ilya Mikheyev',            team: 'Vancouver Canucks',          league: 'NHL', position: 'Right Wing' },
  { name: 'Jack Rathbone',            team: 'Vancouver Canucks',          league: 'NHL', position: 'Defenseman' },
  { name: 'Phil Di Giuseppe',         team: 'Vancouver Canucks',          league: 'NHL', position: 'Left Wing' },
  { name: 'Vasily Podkolzin',         team: 'Vancouver Canucks',          league: 'NHL', position: 'Right Wing' },
  { name: 'Arshdeep Bains',           team: 'Vancouver Canucks',          league: 'NHL', position: 'Center' },
  { name: 'Dakota Joshua',            team: 'Vancouver Canucks',          league: 'NHL', position: 'Center' },
  { name: 'Tom Willander',            team: 'Vancouver Canucks',          league: 'NHL', position: 'Defenseman' },
  { name: 'Vasili Podkolzin',         team: 'Vancouver Canucks',          league: 'NHL', position: 'Right Wing' },
  { name: 'Dmitry Rashevsky',         team: 'Vegas Golden Knights',       league: 'NHL', position: 'Center' },
  { name: 'Carl Grundstrom',          team: 'Los Angeles Kings',          league: 'NHL', position: 'Left Wing' },
  { name: 'Jaret Anderson-Dolan',     team: 'Los Angeles Kings',          league: 'NHL', position: 'Center' },
  { name: 'Samuel Fagemo',            team: 'Los Angeles Kings',          league: 'NHL', position: 'Left Wing' },
  { name: 'Alex Laferriere',          team: 'Los Angeles Kings',          league: 'NHL', position: 'Right Wing' },
  { name: 'Tobias Bjornfot',          team: 'Los Angeles Kings',          league: 'NHL', position: 'Defenseman' },
  { name: 'Mikey Anderson',           team: 'Los Angeles Kings',          league: 'NHL', position: 'Defenseman' },
  { name: 'Samuel Helenius',          team: 'Calgary Flames',             league: 'NHL', position: 'Center' },
  { name: 'Adam Klapka',              team: 'Calgary Flames',             league: 'NHL', position: 'Right Wing' },
  { name: 'Martin Pospisil',          team: 'Calgary Flames',             league: 'NHL', position: 'Left Wing' },
  { name: 'Matt Coronato',            team: 'Calgary Flames',             league: 'NHL', position: 'Right Wing' },
  { name: 'Connor Zary',              team: 'Calgary Flames',             league: 'NHL', position: 'Center' },
  { name: 'Yan Kuznetsov',            team: 'Calgary Flames',             league: 'NHL', position: 'Defenseman' },
  { name: 'Daniil Miromanov',         team: 'Ottawa Senators',            league: 'NHL', position: 'Defenseman' },
  { name: 'Olli Juolevi',             team: 'Florida Panthers',           league: 'NHL', position: 'Defenseman' },
  { name: 'Joe Gambardella',          team: 'Florida Panthers',           league: 'NHL', position: 'Center' },
  { name: 'Nick Cousins',             team: 'Nashville Predators',        league: 'NHL', position: 'Center' },
  { name: 'Cole Smith',               team: 'Nashville Predators',        league: 'NHL', position: 'Center' },
  { name: 'Marc Del Gaizo',           team: 'New Jersey Devils',          league: 'NHL', position: 'Defenseman' },
  { name: 'Jesper Boqvist',           team: 'Anaheim Ducks',              league: 'NHL', position: 'Center' },
  { name: 'Benoit-Olivier Groulx',    team: 'Anaheim Ducks',              league: 'NHL', position: 'Center' },
  { name: 'Ross Johnston',            team: 'New York Islanders',         league: 'NHL', position: 'Left Wing' },
  { name: 'Grant Hutton',             team: 'New York Islanders',         league: 'NHL', position: 'Defenseman' },
  { name: 'Otto Koivula',             team: 'New York Islanders',         league: 'NHL', position: 'Center' },
  { name: 'Julien Gauthier',          team: 'New York Rangers',           league: 'NHL', position: 'Right Wing' },
  { name: 'Adam Fox',                 team: 'New York Rangers',           league: 'NHL', position: 'Defenseman' },
  { name: 'Braden Schneider',         team: 'New York Rangers',           league: 'NHL', position: 'Defenseman' },
  { name: 'Patrick Khodorenko',       team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Right Wing' },
  { name: 'Sam Poulin',               team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Left Wing' },
  { name: 'Nathan Legare',            team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Right Wing' },
  { name: 'Jansen Harkins',           team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Center' },
  { name: 'Daniil Misyul',            team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Defenseman' },
  { name: 'Drew O\'Connor',           team: 'Pittsburgh Penguins',        league: 'NHL', position: 'Left Wing' },
  { name: 'Ryder Rolston',            team: 'Buffalo Sabres',             league: 'NHL', position: 'Center' },
  { name: 'Jiri Kulich',              team: 'Buffalo Sabres',             league: 'NHL', position: 'Center' },
  { name: 'Mason Jobst',              team: 'Minnesota Wild',             league: 'NHL', position: 'Center' },
  { name: 'Sammy Walker',             team: 'Minnesota Wild',             league: 'NHL', position: 'Right Wing' },
  { name: 'Brandon Duhaime',          team: 'Minnesota Wild',             league: 'NHL', position: 'Right Wing' },
  { name: 'Calen Addison',            team: 'Minnesota Wild',             league: 'NHL', position: 'Defenseman' },
  { name: 'Brock Faber',              team: 'Minnesota Wild',             league: 'NHL', position: 'Defenseman' },
  { name: 'Adam Beckman',             team: 'Minnesota Wild',             league: 'NHL', position: 'Left Wing' },
  { name: 'Matt Boldy',               team: 'Minnesota Wild',             league: 'NHL', position: 'Left Wing' },
  { name: 'Emil Bemstrom',            team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Right Wing' },
  { name: 'Brendan Gaunce',          team: 'Columbus Blue Jackets',      league: 'NHL', position: 'Center' },
  { name: 'Jack Johnson',             team: 'Colorado Avalanche',         league: 'NHL', position: 'Defenseman' },
  { name: 'Jonathan Drouin',          team: 'Colorado Avalanche',         league: 'NHL', position: 'Left Wing' },
  { name: 'Justus Annunen',           team: 'Colorado Avalanche',         league: 'NHL', position: 'Goalie' },
  { name: 'Oskar Olausson',           team: 'Colorado Avalanche',         league: 'NHL', position: 'Right Wing' },
  { name: 'Ivan Ivan',                team: 'Colorado Avalanche',         league: 'NHL', position: 'Center' },
  { name: 'Nikolai Kovalenko',        team: 'Colorado Avalanche',         league: 'NHL', position: 'Right Wing' },
  { name: 'Brad Hunt',                team: 'Colorado Avalanche',         league: 'NHL', position: 'Defenseman' },
  { name: 'Vladislav Firstov',        team: 'Minnesota Wild',             league: 'NHL', position: 'Left Wing' },
  { name: 'Daemon Hunt',              team: 'Minnesota Wild',             league: 'NHL', position: 'Defenseman' },
  { name: 'Nikita Nesterenko',        team: 'Chicago Blackhawks',         league: 'NHL', position: 'Left Wing' },
  { name: 'Lukas Reichel',            team: 'Chicago Blackhawks',         league: 'NHL', position: 'Center' },
  { name: 'Alex Vlasic',              team: 'Chicago Blackhawks',         league: 'NHL', position: 'Defenseman' },
];

const BALL_KNOWLEDGE_ATHLETES = BALL_KNOWLEDGE_RAW.map((a, i) => ({
  ...a,
  id: `bk_${i}`,
  photoUrl: '',
  emoji: LEAGUE_EMOJI[a.league] || '🏅',
}));

// ─────────────────────────────────────────────────────────────────────────────
// TheSportsDB helpers
// ─────────────────────────────────────────────────────────────────────────────
// Sport string as TheSportsDB returns for each league
const LEAGUE_SPORT_STRING = {
  NBA: 'basketball', NFL: 'american football', MLB: 'baseball', NHL: 'ice hockey',
  PGA: 'golf', FIFA: 'soccer', NCAAF: 'american football', NCAAMB: 'basketball',
};

// Returns true if the TheSportsDB player record's sport matches the expected league
const sportMatchesLeague = (playerRecord, league) => {
  const expectedSport = LEAGUE_SPORT_STRING[league];
  if (!expectedSport) return true; // unknown league — allow
  const recordSport = (playerRecord.strSport || '').toLowerCase();
  if (!recordSport) return true; // no sport field — can't reject
  return recordSport.includes(expectedSport) || expectedSport.includes(recordSport);
};

const searchPlayerPhoto = async (name, league) => {
  try {
    const r = await fetch(`${SPORTSDB_BASE}/searchplayers.php?p=${encodeURIComponent(name)}`);
    const d = await r.json();
    const players = d.player || [];
    // Filter by sport if league is known, to prevent cross-sport image contamination
    const sportFiltered = league
      ? players.filter(p => sportMatchesLeague(p, league))
      : players;
    const candidates = sportFiltered.length > 0 ? sportFiltered : [];
    for (const p of candidates) {
      const url = p.strCutout || p.strThumb || '';
      if (url && url.startsWith('http')) return url;
    }
    return '';
  } catch { return ''; }
};

const BK_PHOTO_CACHE_KEY = 'bki_bk_photos_v1';
const getBKPhotoCache = () => { try { return JSON.parse(sessionStorage.getItem(BK_PHOTO_CACHE_KEY) || '{}'); } catch { return {}; } };
const saveBKPhotoCache = (cache) => { try { sessionStorage.setItem(BK_PHOTO_CACHE_KEY, JSON.stringify(cache)); } catch {} };

// ─────────────────────────────────────────────────────────────────────────────
// Multi-source image fallback for Normal / Legends
// ─────────────────────────────────────────────────────────────────────────────
const enc = (n) => encodeURIComponent(n);

const fetchNLPhoto = async (athlete) => {
  const name = athlete.name;
  const league = athlete.league;
  try {
    const r = await fetch(`${SPORTSDB_BASE}/searchplayers.php?p=${enc(name)}`);
    const d = await r.json();
    const players = d.player || [];
    // Sport-filter results to prevent cross-sport image contamination
    const sportFiltered = players.filter(p => sportMatchesLeague(p, league));
    const pool = sportFiltered.length > 0 ? sportFiltered : [];
    const exact = pool.find(p => p.strPlayer?.toLowerCase() === name.toLowerCase());
    const candidate = exact || pool[0];
    if (candidate) {
      const url = candidate.strCutout || candidate.strThumb || '';
      if (url && url.startsWith('http')) return url;
    }
  } catch {}
  return null;
};

const fetchWikiPhoto = async (name) => {
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc(name)}`);
    const d = await r.json();
    const url = d.thumbnail?.source || d.originalimage?.source || '';
    if (url && url.startsWith('http')) return url;
  } catch {}
  return null;
};

const resolveAthleteImage = async (athlete, isLegends) => {
  const sportsdbUrl = await fetchNLPhoto(athlete);
  if (sportsdbUrl) { const ok = await validateImage(sportsdbUrl); if (ok) return sportsdbUrl; }

  if (isLegends) {
    const wikiUrl = await fetchWikiPhoto(athlete.name);
    if (wikiUrl) { const ok = await validateImage(wikiUrl); if (ok) return wikiUrl; }
  }

  const nameDash = athlete.name.replace(/\s+/g, '-').replace(/['.]/g, '').toLowerCase();
  const leagueKey = athlete.league.toLowerCase();
  const espnUrl = `https://a.espncdn.com/combiner/i?img=/i/headshots/${leagueKey}/players/full/${nameDash}.png&w=350&h=254`;
  const espnOk = await validateImage(espnUrl);
  if (espnOk) return espnUrl;

  if (!isLegends) {
    const wikiUrl = await fetchWikiPhoto(athlete.name);
    if (wikiUrl) { const ok = await validateImage(wikiUrl); if (ok) return wikiUrl; }
  }
  return null;
};

const NL_PHOTO_CACHE_KEY = 'bki_nl_photos_v2';
const getNLPhotoCache = () => { try { return JSON.parse(sessionStorage.getItem(NL_PHOTO_CACHE_KEY) || '{}'); } catch { return {}; } };
const saveNLPhotoCache = (cache) => { try { sessionStorage.setItem(NL_PHOTO_CACHE_KEY, JSON.stringify(cache)); } catch {} };

// ─────────────────────────────────────────────────────────────────────────────
// SPORT VERIFICATION LAYER
// ─────────────────────────────────────────────────────────────────────────────

// The four valid league values — immutable
const VALID_LEAGUES = ['MLB', 'NBA', 'NFL', 'NHL', 'PGA', 'FIFA', 'NCAAF', 'NCAAMB'];

// Strict emoji map — used for cross-verification
const LEAGUE_EMOJI_STRICT = { MLB: '⚾', NBA: '🏀', NFL: '🏈', NHL: '🏒', PGA: '⛳', FIFA: '⚽', NCAAF: '🏈', NCAAMB: '🏀' };

// Internal failure log for identifying unreliable sources
const _sportVerifyLog = [];

const logVerifyFailure = (athlete, reason) => {
  _sportVerifyLog.push({ name: athlete?.name, league: athlete?.league, emoji: athlete?.emoji, reason, ts: Date.now() });
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[SportVerify FAIL] ${athlete?.name} (${athlete?.league}): ${reason}`);
  }
};

/**
 * Verifies that an athlete is valid for the given selectedLeagues.
 * Check 1: athlete.league is one of the 4 valid values and is in selectedLeagues.
 * Check 2: athlete.emoji matches the strict mapping for athlete.league.
 * Returns true only if ALL checks pass.
 */
const verifySportTag = (athlete, selectedLeagues) => {
  if (!athlete) { return false; }

  // Check 1: league is a known valid league
  if (!VALID_LEAGUES.includes(athlete.league)) {
    logVerifyFailure(athlete, `Unknown league value: "${athlete.league}"`);
    return false;
  }

  // Check 2: league is in the selected set for this round
  if (!selectedLeagues.includes(athlete.league)) {
    logVerifyFailure(athlete, `League "${athlete.league}" not in selected [${selectedLeagues.join(',')}]`);
    return false;
  }

  // Check 3: emoji matches the strict map for this league
  const expectedEmoji = LEAGUE_EMOJI_STRICT[athlete.league];
  if (athlete.emoji && athlete.emoji !== expectedEmoji) {
    logVerifyFailure(athlete, `Emoji mismatch: got "${athlete.emoji}", expected "${expectedEmoji}" for ${athlete.league}`);
    return false;
  }

  return true;
};

/**
 * Ensures the athlete's emoji is stamped from the strict map at retrieval time.
 * This must be called when an athlete is pulled from any pool.
 */
const stampSportTag = (athlete) => {
  if (!athlete) return athlete;
  return {
    ...athlete,
    league: athlete.league,           // explicit — never derived
    emoji: LEAGUE_EMOJI_STRICT[athlete.league] || '🏅',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export const buildAthletePool = async (selectedLeagues, difficulty, onProgress, selectedDecades = []) => {
  if (difficulty === 'normal') {
    onProgress?.(getLoadingPhrase());
    await new Promise(r => setTimeout(r, 300));
    // Hard filter: only athletes whose league is explicitly in selectedLeagues
    const pool = NORMAL_ATHLETES
      .filter(a => selectedLeagues.includes(a.league) && VALID_LEAGUES.includes(a.league))
      .map(stampSportTag);
    return shuffle(pool.length > 0 ? pool : NORMAL_ATHLETES.map(stampSportTag));
  }

  if (difficulty === 'legends') {
    const { getLoadingPhrase } = await import('./loadingPhrases.js');
    onProgress?.(getLoadingPhrase());
    await new Promise(r => setTimeout(r, 300));
    // Hard filter at source
    let pool = LEGENDS_ATHLETES
      .filter(a => selectedLeagues.includes(a.league) && VALID_LEAGUES.includes(a.league))
      .map(stampSportTag);
    if (pool.length === 0) pool = LEGENDS_ATHLETES.map(stampSportTag);
    if (selectedDecades && selectedDecades.length > 0) {
      const filtered = pool.filter(a => (a.decades || []).some(d => selectedDecades.includes(d)));
      if (filtered.length > 0) pool = filtered;
    }
    return shuffle(pool);
  }

  // BALL KNOWLEDGE — hard filter at source
  const filteredBK = BALL_KNOWLEDGE_ATHLETES
    .filter(a => selectedLeagues.includes(a.league) && VALID_LEAGUES.includes(a.league))
    .map(stampSportTag);
  const pool = shuffle(filteredBK.length > 0 ? filteredBK : BALL_KNOWLEDGE_ATHLETES.map(stampSportTag));

  const photoCache = getBKPhotoCache();
  const needsPhoto = pool.filter(a => !photoCache[a.id]);

  if (needsPhoto.length > 0) {
    const { getLoadingPhrase: glp } = await import('./loadingPhrases.js');
    onProgress?.(glp());
    const BATCH = 8;
    for (let i = 0; i < needsPhoto.length; i += BATCH) {
      const batch = needsPhoto.slice(i, i + BATCH);
      await Promise.all(batch.map(async a => {
        const url = await searchPlayerPhoto(a.name, a.league);
        photoCache[a.id] = url || 'NONE';
      }));
      const pct = Math.min(Math.round(((i + BATCH) / needsPhoto.length) * 100), 100);
      onProgress?.(`Finding athlete photos... ${pct}%`);
    }
    saveBKPhotoCache(photoCache);
  } else {
    const { getLoadingPhrase } = await import('./loadingPhrases.js');
    onProgress?.(getLoadingPhrase());
    await new Promise(r => setTimeout(r, 300));
  }

  return pool.map(a => stampSportTag({ ...a, photoUrl: photoCache[a.id] === 'NONE' ? '' : (photoCache[a.id] || '') }));
};

export const pickAthlete = (pool, usedIds = []) => {
  if (!pool || pool.length === 0) return null;
  const available = pool.filter(a => !usedIds.includes(a.id));
  const src = available.length > 0 ? available : shuffle([...pool]);
  return src[0];
};

// Picks an athlete with a confirmed working image, respecting session history globally.
// Runs mandatory sport verification on every candidate before accepting.
export const pickValidatedAthlete = async (pool, usedIds = [], onProgress, difficulty, selectedLeagues = []) => {
  if (!pool || pool.length === 0) return null;

  // Derive selectedLeagues from pool if not passed — pool is already hard-filtered at build time
  const poolLeagues = [...new Set(pool.map(a => a.league))];
  const effectiveLeagues = selectedLeagues.length > 0 ? selectedLeagues : poolLeagues;

  const sessionHistory = getSessionHistory();
  const allUsed = [...new Set([...usedIds, ...sessionHistory])];

  let available = pool.filter(a => !allUsed.includes(a.id));
  if (available.length === 0) available = pool.filter(a => !usedIds.includes(a.id));
  if (available.length === 0) available = [...pool];

  const candidates = available;
  const isBallKnowledge = difficulty === 'ballknowledge';

  // Helper: does this athlete type skip photo validation entirely?
  const shouldSkipPhoto = (athlete) => athlete.noPhoto === true || athlete.photoUrl === null;

  if (isBallKnowledge) {
    const { getLoadingPhrase: glpBK } = await import('./loadingPhrases.js');
    onProgress?.(glpBK());
    for (const raw of candidates) {
      const athlete = stampSportTag(raw);
      if (!verifySportTag(athlete, effectiveLeagues)) continue;
      // No-photo leagues are immediately valid
      if (shouldSkipPhoto(athlete)) return athlete;
      if (!athlete.photoUrl) continue;
      const ok = await validateImage(athlete.photoUrl);
      if (ok) return athlete;
    }
    for (const raw of candidates) {
      const athlete = stampSportTag(raw);
      if (verifySportTag(athlete, effectiveLeagues)) return athlete;
    }
    return null;
  }

  const isLegends = difficulty === 'legends';
  const photoCache = getNLPhotoCache();
  const { getLoadingPhrase: glpNL } = await import('./loadingPhrases.js');
  onProgress?.(glpNL());

  for (const raw of candidates) {
    const athlete = stampSportTag(raw);

    if (!verifySportTag(athlete, effectiveLeagues)) continue;

    // No-photo leagues skip all image logic
    if (shouldSkipPhoto(athlete)) return athlete;

    if (photoCache[athlete.id]) {
      const cached = photoCache[athlete.id];
      if (cached !== 'NONE') return { ...athlete, photoUrl: cached };
      continue;
    }
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

  // Last resort: return first sport-verified candidate regardless of photo
  for (const raw of candidates) {
    const athlete = stampSportTag(raw);
    if (verifySportTag(athlete, effectiveLeagues)) return athlete;
  }

  return null;
};

export const getHint = (athlete) => {
  if (!athlete) return 'Unknown';
  const hints = [];
  const pos = (athlete.position || '').toLowerCase();

  if      (pos.includes('quarterback'))   hints.push('Quarterback');
  else if (pos.includes('wide receiver')) hints.push('Wide Receiver');
  else if (pos.includes('running back'))  hints.push('Running Back');
  else if (pos.includes('linebacker'))    hints.push('Linebacker');
  else if (pos.includes('tight end'))     hints.push('Tight End');
  else if (pos.includes('cornerback'))    hints.push('Cornerback');
  else if (pos.includes('safety'))        hints.push('Safety');
  else if (pos.includes('defensive end')) hints.push('Defensive End');
  else if (pos.includes('lineman') || pos.includes('tackle') || pos.includes('guard')) hints.push('Lineman');
  else if (pos.includes('point guard'))   hints.push('Point Guard');
  else if (pos.includes('shooting guard'))hints.push('Shooting Guard');
  else if (pos.includes('small forward')) hints.push('Small Forward');
  else if (pos.includes('power forward')) hints.push('Power Forward');
  else if (pos === 'center' || pos === 'c') hints.push('Center');
  else if (pos.includes('pitcher'))       hints.push('Pitcher');
  else if (pos.includes('catcher'))       hints.push('Catcher');
  else if (pos.includes('shortstop'))     hints.push('Shortstop');
  else if (pos.includes('outfield'))      hints.push('Outfielder');
  else if (pos.includes('first base') || pos === '1b')  hints.push('First Baseman');
  else if (pos.includes('second base') || pos === '2b') hints.push('Second Baseman');
  else if (pos.includes('third base') || pos === '3b')  hints.push('Third Baseman');
  else if (pos.includes('designated'))    hints.push('Designated Hitter');
  else if (pos.includes('goalie') || pos.includes('goaltender')) hints.push('Goalie');
  else if (pos.includes('winger') || pos === 'rw' || pos === 'lw') hints.push('Winger');
  else if (pos.includes('defenseman'))    hints.push('Defenseman');
  else if (pos.includes('forward'))       hints.push('Forward');
  else if (athlete.position)              hints.push(athlete.position);

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