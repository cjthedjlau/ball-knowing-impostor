const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// TheSportsDB lists players roughly by prominence — starters/stars first, deep bench last.
// We use strict non-overlapping slices per tier so pools never bleed into each other.
const DIFFICULTY_CONFIG = {
  easy:          { playerStart: 0,  playerEnd: 2,  maxTeams: 5  }, // #1-2: superstars, household names
  medium:        { playerStart: 2,  playerEnd: 8,  maxTeams: 10 }, // #3-8: solid starters / All-Stars
  hard:          { playerStart: 8,  playerEnd: 18, maxTeams: 20 }, // #9-18: role players / deep starters
  ballknowledge: { playerStart: 18, playerEnd: 999, maxTeams: 999 }, // #19+: bench warmers, obscure
};

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

const CACHE_KEY = 'bki_pool_v1';

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

export const buildAthletePool = async (selectedLeagues, difficulty, onProgress) => {
  const cacheKey = [...selectedLeagues].sort().join('_') + '_' + difficulty;
  const cached = getCached(cacheKey);
  if (cached && cached.length > 5) {
    onProgress?.('Loading cached roster...');
    await new Promise(r => setTimeout(r, 300));
    return cached;
  }

  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const candidates = [];

  for (const league of selectedLeagues) {
    onProgress?.(`Fetching ${league} teams...`);
    const teams = await fetchTeams(league);
    if (!teams.length) continue;
    // Use all teams for harder difficulties to widen the obscure player pool
    const maxTeams = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : teams.length;
    const selected = shuffle(teams).slice(0, maxTeams);

    onProgress?.(`Loading ${league} rosters...`);
    const rosters = await Promise.all(selected.map(t => fetchPlayers(t.idTeam)));

    rosters.forEach((players, i) => {
      const team = selected[i];
      players.slice(config.playerStart, config.playerEnd).forEach(p => {
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
  const map = { NBA: 'Basketball', NFL: 'Football', MLB: 'Baseball', NHL: 'Hockey' };
  return map[athlete?.league] || 'Athletics';
};