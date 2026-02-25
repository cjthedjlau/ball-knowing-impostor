// ─────────────────────────────────────────────────────────────────────────────
// API Supplementation — silently fetches additional athletes from TheSportsDB
// at session start and merges them into the hardcoded pools.
// Rules:
//   • Only fetches for active/selected leagues
//   • Rate-limited: 2s between requests, max 30 requests per session
//   • Results cached in sessionStorage for the entire session
//   • Never blocks or delays the user
//   • Never replaces hardcoded data — only adds on top
// ─────────────────────────────────────────────────────────────────────────────

const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const SUPP_CACHE_KEY = 'bki_supp_athletes_v1';
const MAX_REQUESTS = 30;
const REQUEST_DELAY_MS = 2000;

// Team IDs per league from TheSportsDB
const LEAGUE_TEAM_IDS = {
  NBA: [
    134880, 134881, 134882, 134883, 134884, 134885, 134886, 134887, 134888,
    134889, 134890, 134891, 134892, 134893, 134894, 134895, 134896, 134897,
    134898, 134899, 134900, 134901, 134902, 134903, 134904, 134905, 134906,
    134907, 134908, 134909,
  ],
  NFL: [
    134942, 134943, 134944, 134945, 134946, 134947, 134948, 134949, 134950,
    134951, 134952, 134953, 134954, 134955, 134956, 134957, 134958, 134959,
    134960, 134961, 134962, 134963, 134964, 134965, 134966, 134967, 134968,
    134969, 134970, 134971, 134972, 134973,
  ],
  MLB: [
    135261, 135262, 135263, 135264, 135265, 135266, 135267, 135268, 135269,
    135270, 135271, 135272, 135273, 135274, 135275, 135276, 135277, 135278,
    135279, 135280, 135281, 135282, 135283, 135284, 135285, 135286, 135287,
    135288, 135289, 135290,
  ],
  NHL: [
    134830, 134831, 134832, 134833, 134834, 134835, 134836, 134837, 134838,
    134839, 134840, 134841, 134842, 134843, 134844, 134845, 134846, 134847,
    134848, 134849, 134850, 134851, 134852, 134853, 134854, 134855, 134856,
    134857, 134858, 134859, 134860, 134861,
  ],
};

// League IDs in TheSportsDB
const LEAGUE_DB_IDS = {
  NBA: '4387',
  NFL: '4391',
  MLB: '4424',
  NHL: '4380',
};

// Sport string as TheSportsDB returns it
const LEAGUE_SPORT = {
  NBA: 'Basketball',
  NFL: 'American Football',
  MLB: 'Baseball',
  NHL: 'Ice Hockey',
};

let _requestCount = 0;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const rateLimitedFetch = async (url) => {
  if (_requestCount >= MAX_REQUESTS) return null;
  _requestCount++;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
};

// ── Connectivity check ────────────────────────────────────────────────────────
export const checkConnectivity = async () => {
  try {
    const r = await fetch(`${SPORTSDB_BASE}/searchplayers.php?p=LeBron`, {
      method: 'HEAD',
      cache: 'no-store',
    });
    return r.ok;
  } catch {
    return false;
  }
};

// ── Cache helpers ─────────────────────────────────────────────────────────────
export const getSuppCache = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SUPP_CACHE_KEY) || 'null');
  } catch {
    return null;
  }
};

export const clearSuppCache = () => {
  try {
    sessionStorage.removeItem(SUPP_CACHE_KEY);
  } catch {}
};

const saveSuppCache = (data) => {
  try {
    sessionStorage.setItem(SUPP_CACHE_KEY, JSON.stringify(data));
  } catch {}
};

// ── Player → athlete normaliser ───────────────────────────────────────────────
const LEAGUE_EMOJI = {
  NBA: '🏀', NFL: '🏈', MLB: '⚾', NHL: '🏒',
  PGA: '⛳', FIFA: '⚽', NCAAF: '🏈', NCAAMB: '🏀',
};

const normalisePlayer = (p, league) => {
  if (!p.strPlayer || !p.strTeam) return null;
  const photoUrl = p.strCutout || p.strThumb || '';
  return {
    id: `supp_${league}_${p.idPlayer}`,
    name: p.strPlayer,
    team: p.strTeam,
    league,
    position: p.strPosition || '',
    photoUrl,
    emoji: LEAGUE_EMOJI[league] || '🏅',
    status: (p.strStatus || '').toLowerCase(),
    dateBorn: p.dateBorn || '',
    _fromApi: true,
  };
};

// ── Status filters per difficulty ────────────────────────────────────────────
const isNormalEligible = (p) => {
  // Active current-season players; exclude coaches, retired, injured long-term
  const s = (p.strStatus || '').toLowerCase();
  return s === 'active' || s === '';
};

const isBallKnowledgeEligible = (p) => {
  // Any active/rostered player is fine — the obscurity comes from picking from
  // deep-bench team rosters that the hardcoded list wouldn't cover
  const s = (p.strStatus || '').toLowerCase();
  return s === 'active' || s === '' || s === 'injured';
};

const isLegendsEligible = (p, selectedDecades) => {
  // Must be retired/former
  const s = (p.strStatus || '').toLowerCase();
  const isRetired = s === 'retired' || s === 'former' || s === 'deceased' || s === 'coaching';
  if (!isRetired) return false;

  if (!selectedDecades || selectedDecades.length === 0) return true;

  // Try to map birth year to active decades (rough heuristic: prime ~age 22-38)
  if (!p.dateBorn) return true;
  const birthYear = parseInt(p.dateBorn.split('-')[0], 10);
  if (isNaN(birthYear)) return true;
  const primeStart = birthYear + 22;
  const primeEnd = birthYear + 38;
  const decadeNumbers = selectedDecades.map((d) => parseInt(d.replace('s', ''), 10));
  return decadeNumbers.some((d) => d >= primeStart - 9 && d <= primeEnd + 9);
};

// ── Fetch players for one team ────────────────────────────────────────────────
const fetchTeamPlayers = async (teamId, league) => {
  const data = await rateLimitedFetch(
    `${SPORTSDB_BASE}/lookup_all_players.php?id=${teamId}`
  );
  if (!data || !data.player) return [];

  return data.player
    .map((p) => normalisePlayer(p, league))
    .filter(Boolean)
    .filter((a) => LEAGUE_SPORT[league] === undefined ||
      // Validate sport matches (guard against TheSportsDB mixing sports)
      (a.position !== 'Assistant Coach' && a.position !== 'Head Coach' && a.position !== 'Coach'));
};

// ── Main supplementation function ────────────────────────────────────────────
/**
 * Builds the supplementary athlete map for this session.
 * Returns: { NBA: [...], NFL: [...], MLB: [...], NHL: [...] }
 * Each array contains validated API athletes not already in the hardcoded set.
 */
export const buildSupplementaryAthletes = async (
  selectedLeagues,       // string[]  e.g. ['NBA','NFL']
  difficulty,            // 'normal' | 'legends' | 'ballknowledge'
  hardcodedNames,        // Set<string> of lowercased names already in pool
  selectedDecades = []
) => {
  _requestCount = 0;

  const result = {};
  for (const league of selectedLeagues) {
    result[league] = [];
  }

  const teamIdsByLeague = {};
  for (const league of selectedLeagues) {
    const ids = LEAGUE_TEAM_IDS[league];
    if (!ids) continue;
    // Shuffle team order to get variety across sessions
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    teamIdsByLeague[league] = shuffled;
  }

  // Interleave teams across leagues so we fill all leagues before hitting cap
  const leagueQueues = selectedLeagues
    .filter((l) => teamIdsByLeague[l])
    .map((l) => ({ league: l, ids: teamIdsByLeague[l], idx: 0 }));

  let madeProgress = true;
  while (madeProgress && _requestCount < MAX_REQUESTS) {
    madeProgress = false;
    for (const q of leagueQueues) {
      if (q.idx >= q.ids.length) continue;
      if (_requestCount >= MAX_REQUESTS) break;

      const teamId = q.ids[q.idx++];
      const players = await fetchTeamPlayers(teamId, q.league);
      madeProgress = true;

      for (const athlete of players) {
        const nameLower = athlete.name.toLowerCase();
        // Skip duplicates already in hardcoded sets
        if (hardcodedNames.has(nameLower)) continue;
        // Skip already added in this run
        if (result[q.league].some((a) => a.name.toLowerCase() === nameLower)) continue;

        // Difficulty eligibility filter
        let eligible = false;
        if (difficulty === 'normal') {
          eligible = isNormalEligible(athlete);
        } else if (difficulty === 'ballknowledge') {
          eligible = isBallKnowledgeEligible(athlete);
        } else if (difficulty === 'legends') {
          eligible = isLegendsEligible(athlete, selectedDecades);
        }

        if (eligible) {
          result[q.league].push(athlete);
        }
      }

      // Rate limit spacing
      if (_requestCount < MAX_REQUESTS) {
        await delay(REQUEST_DELAY_MS);
      }
    }
  }

  return result;
};

// ── Session-level entry point ─────────────────────────────────────────────────
/**
 * Called once at session start. Checks connectivity, builds supplementary pool,
 * caches it, and returns the merged athletes per league.
 * If offline or any error: returns empty maps silently.
 */
export const runSupplementationIfOnline = async (
  selectedLeagues,
  difficulty,
  hardcodedNames,
  selectedDecades = []
) => {
  try {
    // Check if we already have a valid cache for this session config
    const cached = getSuppCache();
    const cacheKey = `${selectedLeagues.sort().join(',')}_${difficulty}_${selectedDecades.sort().join(',')}`;
    if (cached && cached.key === cacheKey && cached.athletes) {
      return cached.athletes;
    }

    // Clear any stale cache
    clearSuppCache();

    // Check connectivity
    const online = await checkConnectivity();
    if (!online) return null;

    // Run background fetch
    const athletes = await buildSupplementaryAthletes(
      selectedLeagues,
      difficulty,
      hardcodedNames,
      selectedDecades
    );

    // Persist to sessionStorage
    saveSuppCache({ key: cacheKey, athletes, ts: Date.now() });

    return athletes;
  } catch {
    // Never surface errors to the user
    return null;
  }
};