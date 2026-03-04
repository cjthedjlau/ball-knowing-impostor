// ─────────────────────────────────────────────────────────────────────────────
// Expansion Packs — pool builder (mirrors sportsApi.js patterns exactly)
// ─────────────────────────────────────────────────────────────────────────────

import {
  PGA_NORMAL, PGA_LEGENDS, PGA_BALLKNOWLEDGE,
  FIFA_NORMAL, FIFA_LEGENDS, FIFA_BALLKNOWLEDGE,
  NCAAF_NORMAL, NCAAF_LEGENDS, NCAAF_BALLKNOWLEDGE,
  NCAAMB_NORMAL, NCAAMB_LEGENDS, NCAAMB_BALLKNOWLEDGE,
  TEAM_PACKS,
  EXPANSION_LEAGUE_EMOJI,
} from './expansionData';
import { TEAM_PACKS_2 } from './expansionDataTeams2';

export const ALL_TEAM_PACKS = { ...TEAM_PACKS, ...TEAM_PACKS_2 };

// Leagues that never use photos under any circumstance
const NO_PHOTO_LEAGUES = new Set(['NCAAF', 'NCAAMB']);

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const toPool = (raw, prefix) =>
  raw.map((a, i) => ({
    ...a,
    id: `${prefix}_${i}`,
    photoUrl: NO_PHOTO_LEAGUES.has(a.league) ? null : '',
    emoji: EXPANSION_LEAGUE_EMOJI[a.league] || '🏅',
    noPhoto: NO_PHOTO_LEAGUES.has(a.league),
  }));

const POOL_MAP = {
  PGA: {
    normal:        toPool(PGA_NORMAL,        'pga_n'),
    legends:       toPool(PGA_LEGENDS,       'pga_l'),
    ballknowledge: toPool(PGA_BALLKNOWLEDGE, 'pga_b'),
  },
  FIFA: {
    normal:        toPool(FIFA_NORMAL,        'fifa_n'),
    legends:       toPool(FIFA_LEGENDS,       'fifa_l'),
    ballknowledge: toPool(FIFA_BALLKNOWLEDGE, 'fifa_b'),
  },
  NCAAF: {
    normal:        toPool(NCAAF_NORMAL,        'ncaaf_n'),
    legends:       toPool(NCAAF_LEGENDS,       'ncaaf_l'),
    ballknowledge: toPool(NCAAF_BALLKNOWLEDGE, 'ncaaf_b'),
  },
  NCAAMB: {
    normal:        toPool(NCAAMB_NORMAL,        'ncaamb_n'),
    legends:       toPool(NCAAMB_LEGENDS,       'ncaamb_l'),
    ballknowledge: toPool(NCAAMB_BALLKNOWLEDGE, 'ncaamb_b'),
  },
};

/**
 * Build the pool for expansion leagues only.
 * Returns a shuffled flat array of athletes matching selectedExpansionLeagues.
 */
export const buildExpansionPool = (selectedExpansionLeagues, difficulty) => {
  const tier = difficulty === 'legends' ? 'legends'
    : difficulty === 'ballknowledge' ? 'ballknowledge'
    : 'normal';

  const all = [];
  for (const league of selectedExpansionLeagues) {
    const leaguePool = POOL_MAP[league];
    if (leaguePool && leaguePool[tier]) {
      all.push(...leaguePool[tier]);
    }
  }
  return shuffle(all);
};

/**
 * Build pool for a specific team pack — always merges ALL three tiers (normal + legends + ballknowledge)
 * into one unified pool regardless of difficulty setting.
 * Difficulty parameter is ignored for team packs.
 */
export const buildTeamPackPool = (teamName) => {
  const pack = ALL_TEAM_PACKS[teamName];
  if (!pack) return [];

  const prefix = `team_${teamName.replace(/\s+/g, '_')}`;
  const emojiMap = { MLB: '⚾', NBA: '🏀', NFL: '🏈', NHL: '🏒' };

  const allRaw = [
    ...(pack.normal || []).map((a, i) => ({ ...a, id: `${prefix}_n_${i}` })),
    ...(pack.legends || []).map((a, i) => ({ ...a, id: `${prefix}_l_${i}` })),
    ...(pack.ballknowledge || []).map((a, i) => ({ ...a, id: `${prefix}_b_${i}` })),
  ];

  return shuffle(
    allRaw.map(a => ({
      ...a,
      photoUrl: '',
      emoji: emojiMap[a.league] || '🏅',
    }))
  );
};