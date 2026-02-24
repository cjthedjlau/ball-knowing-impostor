// ─────────────────────────────────────────────────────────────────────────────
// Sports API — athlete pools for Ball Knowing Impostor
// ─────────────────────────────────────────────────────────────────────────────

const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

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
  raw.map((a, i) => ({ ...a, id: `${prefix}_${i}`, photoUrl: '' }));

const NORMAL_ATHLETES  = toStaticPool(NORMAL_ATHLETES_RAW,  'normal');
const LEGENDS_ATHLETES = toStaticPool(LEGENDS_ATHLETES_RAW, 'legend');

// ─────────────────────────────────────────────────────────────────────────────
// BALL KNOWLEDGE — live-fetched deep bench players (#19+) via TheSportsDB
// ─────────────────────────────────────────────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const validateImage = (url) => {
  if (!url || !url.startsWith('http')) return Promise.resolve(false);
  return new Promise((resolve) => {
    const img = new Image();
    const t = setTimeout(() => resolve(false), 5000);
    img.onload  = () => { clearTimeout(t); resolve(img.naturalWidth > 10); };
    img.onerror = () => { clearTimeout(t); resolve(false); };
    img.src = url;
  });
};

const fetchTeams   = async (league) => {
  try {
    const r = await fetch(`${SPORTSDB_BASE}/search_all_teams.php?l=${encodeURIComponent(league)}`);
    const d = await r.json();
    return d.teams || [];
  } catch { return []; }
};

const fetchPlayers = async (teamId) => {
  try {
    const r = await fetch(`${SPORTSDB_BASE}/lookup_all_players.php?id=${teamId}`);
    const d = await r.json();
    return d.player || [];
  } catch { return []; }
};

const CACHE_KEY = 'bki_ballknowledge_v3';

const getCached = (key) => {
  try {
    const c = sessionStorage.getItem(CACHE_KEY);
    if (!c) return null;
    const p = JSON.parse(c);
    return p.key === key ? p.pool : null;
  } catch { return null; }
};

const setCache = (key, pool) => {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ key, pool })); } catch {}
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export const buildAthletePool = async (selectedLeagues, difficulty, onProgress) => {
  // NORMAL — active players only, no network call
  if (difficulty === 'normal') {
    onProgress?.('Loading Normal roster...');
    await new Promise(r => setTimeout(r, 300));
    const pool = NORMAL_ATHLETES.filter(a => selectedLeagues.includes(a.league));
    return pool.length > 0 ? pool : NORMAL_ATHLETES;
  }

  // LEGENDS — iconic retired players, no network call
  if (difficulty === 'legends') {
    onProgress?.('Loading Legends roster...');
    await new Promise(r => setTimeout(r, 300));
    const pool = LEGENDS_ATHLETES.filter(a => selectedLeagues.includes(a.league));
    return pool.length > 0 ? pool : LEGENDS_ATHLETES;
  }

  // BALL KNOWLEDGE — live fetch, deep bench (#19+)
  const cacheKey = [...selectedLeagues].sort().join('_') + '_bk';
  const cached = getCached(cacheKey);
  if (cached && cached.length > 5) {
    onProgress?.('Loading cached roster...');
    await new Promise(r => setTimeout(r, 300));
    return cached;
  }

  const candidates = [];

  for (const league of selectedLeagues) {
    onProgress?.(`Fetching ${league} teams...`);
    const teams = await fetchTeams(league);
    if (!teams.length) continue;
    const selected = shuffle(teams);

    onProgress?.(`Loading ${league} rosters...`);
    const rosters = await Promise.all(selected.map(t => fetchPlayers(t.idTeam)));

    rosters.forEach((players, i) => {
      const team = selected[i];
      // Slots 18+ are deep bench — skip starters/stars
      players.slice(18).forEach(p => {
        const img = p.strCutout || p.strThumb || '';
        if (img && p.strPlayer && p.strPlayer.trim().length > 2) {
          candidates.push({
            id: p.idPlayer,
            name: p.strPlayer,
            team: p.strTeam || team.strTeam || '',
            league,
            position: p.strPosition || '',
            photoUrl: img,
          });
        }
      });
    });
  }

  if (candidates.length === 0) {
    // Fallback: use known secondary-tier players if API returns nothing
    onProgress?.('Using fallback roster...');
    return NORMAL_ATHLETES.filter(a => selectedLeagues.includes(a.league));
  }

  onProgress?.(`Validating ${candidates.length} photos...`);

  const BATCH = 20;
  const valid = [];
  for (let i = 0; i < candidates.length; i += BATCH) {
    const batch = candidates.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async a => {
        const ok = await validateImage(a.photoUrl);
        return ok ? a : null;
      })
    );
    valid.push(...results.filter(Boolean));
    const pct = Math.min(Math.round(((i + BATCH) / candidates.length) * 100), 100);
    onProgress?.(`Validating photos... ${pct}%`);
  }

  // If validation kills everything, fall back gracefully
  const final = valid.length > 3 ? valid : candidates.slice(0, 30);
  setCache(cacheKey, final);
  return final;
};

export const pickAthlete = (pool, usedIds = []) => {
  if (!pool || pool.length === 0) return null;
  const available = pool.filter(a => !usedIds.includes(a.id));
  const src = available.length > 0 ? available : pool;
  return src[Math.floor(Math.random() * src.length)];
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