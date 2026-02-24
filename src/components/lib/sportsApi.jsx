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
    const selected = shuffle(teams).slice(0, config.maxTeams);

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
  if (!athlete) return 'Unknown';

  const hints = [];

  // Position-based hints
  const pos = (athlete.position || '').toLowerCase();
  if (pos.includes('quarterback') || pos === 'qb') hints.push('Quarterback');
  else if (pos.includes('wide receiver') || pos === 'wr') hints.push('Wide Receiver');
  else if (pos.includes('running back') || pos === 'rb') hints.push('Running Back');
  else if (pos.includes('linebacker') || pos === 'lb') hints.push('Linebacker');
  else if (pos.includes('defensive') && pos.includes('end')) hints.push('Pass Rusher');
  else if (pos.includes('cornerback') || pos === 'cb') hints.push('Cornerback');
  else if (pos.includes('safety')) hints.push('Safety');
  else if (pos.includes('tight end') || pos === 'te') hints.push('Tight End');
  else if (pos.includes('offensive line') || pos.includes('tackle') || pos.includes('guard') || pos.includes('center')) hints.push('Lineman');
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
  else if (pos.includes('goalie') || pos.includes('goalkeeper') || pos.includes('goaltender')) hints.push('Goalie');
  else if (pos.includes('winger') || pos.includes('wing')) hints.push('Winger');
  else if (pos.includes('defenseman') || pos.includes('defence')) hints.push('Defenseman');
  else if (pos.includes('forward')) hints.push('Forward');
  else if (pos && pos.length > 0) hints.push(athlete.position); // fallback: use raw position

  // League conference/division hints
  const league = athlete.league || '';
  if (league === 'NBA') hints.push('NBA Player');
  else if (league === 'NFL') hints.push('NFL Player');
  else if (league === 'MLB') hints.push('MLB Player');
  else if (league === 'NHL') hints.push('NHL Player');

  // Name-based hints (first letter)
  const firstName = (athlete.name || '').split(' ')[0];
  if (firstName) hints.push(`First name starts with "${firstName[0].toUpperCase()}"`);

  // Team name hint (vague)
  if (athlete.team) {
    const teamWords = athlete.team.split(' ');
    const lastWord = teamWords[teamWords.length - 1];
    if (lastWord && lastWord.length > 3) hints.push(`Team: ${lastWord}`);
  }

  // Pick a random hint from the meaningful ones (prefer position if available)
  const positionHint = hints[0]; // first added is always position-based if found
  const otherHints = hints.slice(1);

  // 60% chance to use position, 40% chance to use another hint
  if (positionHint && (otherHints.length === 0 || Math.random() < 0.6)) {
    return positionHint;
  }
  if (otherHints.length > 0) {
    return otherHints[Math.floor(Math.random() * otherHints.length)];
  }
  return positionHint || 'Unknown';
};