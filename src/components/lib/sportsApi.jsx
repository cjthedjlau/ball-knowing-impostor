const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// ─────────────────────────────────────────────────────────────────────────────
// NORMAL MODE — hardcoded household names only.
// Every single name here must be universally recognizable, even to non-fans.
// ─────────────────────────────────────────────────────────────────────────────
const NORMAL_ATHLETES_RAW = [
  // NBA
  { name: 'LeBron James',       team: 'Los Angeles Lakers',      league: 'NBA', position: 'Small Forward' },
  { name: 'Stephen Curry',      team: 'Golden State Warriors',   league: 'NBA', position: 'Point Guard' },
  { name: 'Kevin Durant',       team: 'Phoenix Suns',            league: 'NBA', position: 'Small Forward' },
  { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks',      league: 'NBA', position: 'Power Forward' },
  { name: 'Shaquille O\'Neal',  team: 'Retired',                 league: 'NBA', position: 'Center' },
  { name: 'Kobe Bryant',        team: 'Retired',                 league: 'NBA', position: 'Shooting Guard' },
  { name: 'Michael Jordan',     team: 'Retired',                 league: 'NBA', position: 'Shooting Guard' },
  { name: 'Dwyane Wade',        team: 'Retired',                 league: 'NBA', position: 'Shooting Guard' },
  { name: 'Magic Johnson',      team: 'Retired',                 league: 'NBA', position: 'Point Guard' },
  { name: 'Larry Bird',         team: 'Retired',                 league: 'NBA', position: 'Small Forward' },
  { name: 'Charles Barkley',    team: 'Retired',                 league: 'NBA', position: 'Power Forward' },
  { name: 'Dirk Nowitzki',      team: 'Retired',                 league: 'NBA', position: 'Power Forward' },
  { name: 'Scottie Pippen',     team: 'Retired',                 league: 'NBA', position: 'Small Forward' },
  { name: 'Jayson Tatum',       team: 'Boston Celtics',          league: 'NBA', position: 'Small Forward' },
  { name: 'Nikola Jokic',       team: 'Denver Nuggets',          league: 'NBA', position: 'Center' },
  { name: 'Luka Doncic',        team: 'Dallas Mavericks',        league: 'NBA', position: 'Point Guard' },

  // NFL
  { name: 'Patrick Mahomes',    team: 'Kansas City Chiefs',      league: 'NFL', position: 'Quarterback' },
  { name: 'Tom Brady',          team: 'Retired',                 league: 'NFL', position: 'Quarterback' },
  { name: 'Aaron Rodgers',      team: 'New York Jets',           league: 'NFL', position: 'Quarterback' },
  { name: 'Travis Kelce',       team: 'Kansas City Chiefs',      league: 'NFL', position: 'Tight End' },
  { name: 'Peyton Manning',     team: 'Retired',                 league: 'NFL', position: 'Quarterback' },
  { name: 'Jerry Rice',         team: 'Retired',                 league: 'NFL', position: 'Wide Receiver' },
  { name: 'Deion Sanders',      team: 'Retired',                 league: 'NFL', position: 'Cornerback' },
  { name: 'Lawrence Taylor',    team: 'Retired',                 league: 'NFL', position: 'Linebacker' },
  { name: 'Joe Montana',        team: 'Retired',                 league: 'NFL', position: 'Quarterback' },
  { name: 'Emmitt Smith',       team: 'Retired',                 league: 'NFL', position: 'Running Back' },
  { name: 'Lamar Jackson',      team: 'Baltimore Ravens',        league: 'NFL', position: 'Quarterback' },
  { name: 'Josh Allen',         team: 'Buffalo Bills',           league: 'NFL', position: 'Quarterback' },
  { name: 'Justin Jefferson',   team: 'Minnesota Vikings',       league: 'NFL', position: 'Wide Receiver' },

  // MLB
  { name: 'Mike Trout',         team: 'Los Angeles Angels',      league: 'MLB', position: 'Outfielder' },
  { name: 'Aaron Judge',        team: 'New York Yankees',        league: 'MLB', position: 'Outfielder' },
  { name: 'Derek Jeter',        team: 'Retired',                 league: 'MLB', position: 'Shortstop' },
  { name: 'Babe Ruth',          team: 'Retired',                 league: 'MLB', position: 'Outfielder' },
  { name: 'Ken Griffey Jr.',    team: 'Retired',                 league: 'MLB', position: 'Outfielder' },
  { name: 'Barry Bonds',        team: 'Retired',                 league: 'MLB', position: 'Outfielder' },
  { name: 'Roger Clemens',      team: 'Retired',                 league: 'MLB', position: 'Pitcher' },
  { name: 'Hank Aaron',         team: 'Retired',                 league: 'MLB', position: 'Outfielder' },
  { name: 'Willie Mays',        team: 'Retired',                 league: 'MLB', position: 'Outfielder' },
  { name: 'Shohei Ohtani',      team: 'Los Angeles Dodgers',     league: 'MLB', position: 'Pitcher' },
  { name: 'Fernando Tatis Jr.', team: 'San Diego Padres',        league: 'MLB', position: 'Shortstop' },
  { name: 'Mookie Betts',       team: 'Los Angeles Dodgers',     league: 'MLB', position: 'Outfielder' },

  // NHL
  { name: 'Wayne Gretzky',      team: 'Retired',                 league: 'NHL', position: 'Center' },
  { name: 'Mario Lemieux',      team: 'Retired',                 league: 'NHL', position: 'Center' },
  { name: 'Sidney Crosby',      team: 'Pittsburgh Penguins',     league: 'NHL', position: 'Center' },
  { name: 'Alexander Ovechkin', team: 'Washington Capitals',     league: 'NHL', position: 'Winger' },
  { name: 'Connor McDavid',     team: 'Edmonton Oilers',         league: 'NHL', position: 'Center' },
  { name: 'Gordie Howe',        team: 'Retired',                 league: 'NHL', position: 'Right Wing' },
  { name: 'Bobby Orr',          team: 'Retired',                 league: 'NHL', position: 'Defenseman' },
];

// Attach deterministic IDs and empty photoUrl (Normal mode uses a name card, no image needed)
const NORMAL_ATHLETES = NORMAL_ATHLETES_RAW.map((a, i) => ({
  ...a,
  id: `normal_${i}`,
  photoUrl: '',
}));

// ─────────────────────────────────────────────────────────────────────────────
// BALL KNOWLEDGE — fetched live from TheSportsDB, deep bench only (#19+)
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
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return Promise.resolve(false);
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(false), 5000);
    img.onload = () => { clearTimeout(timer); resolve(true); };
    img.onerror = () => { clearTimeout(timer); resolve(false); };
    img.src = url;
  });
};

const fetchTeams = async (league) => {
  try {
    const res = await fetch(`${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(league)}`);
    const data = await res.json();
    return data.teams || [];
  } catch { return []; }
};

const fetchPlayers = async (teamId) => {
  try {
    const res = await fetch(`${BASE_URL}/lookup_all_players.php?id=${teamId}`);
    const data = await res.json();
    return data.player || [];
  } catch { return []; }
};

const CACHE_KEY = 'bki_pool_v2';

const getCached = (key) => {
  try {
    const c = sessionStorage.getItem(CACHE_KEY);
    if (!c) return null;
    const p = JSON.parse(c);
    return p.key === key ? p.pool : null;
  } catch { return null; }
};

const setCache = (key, pool) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ key, pool }));
  } catch {}
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export const buildAthletePool = async (selectedLeagues, difficulty, onProgress) => {
  // NORMAL: filter curated list by selected leagues, no network call needed
  if (difficulty === 'normal') {
    onProgress?.('Loading Normal roster...');
    await new Promise(r => setTimeout(r, 400));
    const pool = NORMAL_ATHLETES.filter(a => selectedLeagues.includes(a.league));
    return pool.length > 0 ? pool : NORMAL_ATHLETES; // fallback to all if no league match
  }

  // BALL KNOWLEDGE: live fetch, deep bench (#19 onward per team)
  const cacheKey = [...selectedLeagues].sort().join('_') + '_ballknowledge';
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
    const selected = shuffle(teams); // use ALL teams to maximize obscure player pool

    onProgress?.(`Loading ${league} rosters...`);
    const rosters = await Promise.all(selected.map(t => fetchPlayers(t.idTeam)));

    rosters.forEach((players, i) => {
      const team = selected[i];
      // Skip the first 18 — those are starters/stars. Only take deep bench.
      players.slice(18).forEach(p => {
        const img = p.strCutout || p.strThumb || '';
        if (img && p.strPlayer) {
          candidates.push({
            id: p.idPlayer,
            name: p.strPlayer,
            team: p.strTeam || team.strTeam || '',
            league,
            position: p.strPosition || '',
            photoUrl: img,
            isCutout: !!p.strCutout,
          });
        }
      });
    });
  }

  onProgress?.(`Validating ${candidates.length} photos...`);

  const BATCH = 15;
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

  setCache(cacheKey, valid);
  return valid;
};

export const pickAthlete = (pool, usedIds = []) => {
  const available = pool.filter(a => !usedIds.includes(a.id));
  const src = available.length > 0 ? available : pool;
  return src[Math.floor(Math.random() * src.length)];
};

export const getHint = (athlete) => {
  if (!athlete) return 'Unknown';

  const hints = [];
  const pos = (athlete.position || '').toLowerCase();

  if (pos.includes('quarterback') || pos === 'qb') hints.push('Quarterback');
  else if (pos.includes('wide receiver') || pos === 'wr') hints.push('Wide Receiver');
  else if (pos.includes('running back') || pos === 'rb') hints.push('Running Back');
  else if (pos.includes('linebacker') || pos === 'lb') hints.push('Linebacker');
  else if (pos.includes('tight end') || pos === 'te') hints.push('Tight End');
  else if (pos.includes('cornerback') || pos === 'cb') hints.push('Cornerback');
  else if (pos.includes('safety')) hints.push('Safety');
  else if (pos.includes('tackle') || pos.includes('guard') || pos.includes('lineman')) hints.push('Lineman');
  else if (pos.includes('point guard') || pos === 'pg') hints.push('Point Guard');
  else if (pos.includes('shooting guard') || pos === 'sg') hints.push('Shooting Guard');
  else if (pos.includes('small forward') || pos === 'sf') hints.push('Small Forward');
  else if (pos.includes('power forward') || pos === 'pf') hints.push('Power Forward');
  else if (pos === 'center' || pos === 'c') hints.push('Center');
  else if (pos.includes('pitcher')) hints.push('Pitcher');
  else if (pos.includes('catcher')) hints.push('Catcher');
  else if (pos.includes('shortstop')) hints.push('Shortstop');
  else if (pos.includes('outfield')) hints.push('Outfielder');
  else if (pos.includes('first base') || pos === '1b') hints.push('First Baseman');
  else if (pos.includes('second base') || pos === '2b') hints.push('Second Baseman');
  else if (pos.includes('third base') || pos === '3b') hints.push('Third Baseman');
  else if (pos.includes('goalie') || pos.includes('goaltender')) hints.push('Goalie');
  else if (pos.includes('winger') || pos === 'rw' || pos === 'lw') hints.push('Winger');
  else if (pos.includes('defenseman')) hints.push('Defenseman');
  else if (pos.includes('forward')) hints.push('Forward');
  else if (athlete.position) hints.push(athlete.position);

  // Secondary hints
  const firstName = (athlete.name || '').split(' ')[0];
  if (firstName) hints.push(`First name: "${firstName[0].toUpperCase()}"`);
  if (athlete.team) {
    const lastWord = athlete.team.split(' ').pop();
    if (lastWord && lastWord.length > 3) hints.push(`Team: ${lastWord}`);
  }

  // 60% position, 40% secondary
  const posHint = hints[0];
  const others = hints.slice(1);
  if (posHint && (others.length === 0 || Math.random() < 0.6)) return posHint;
  if (others.length > 0) return others[Math.floor(Math.random() * others.length)];
  return posHint || 'Unknown';
};