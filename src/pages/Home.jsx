import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { buildAthletePool, pickValidatedAthlete, getHint, clearSessionHistory, addToSessionHistory } from '../components/lib/sportsApi';
import { buildExpansionPool, buildTeamPackPool } from '../components/game/expansionPacks/expansionPacksApi';
import { runSupplementationIfOnline, clearSuppCache } from '../components/lib/apiSupplementation';
import { playTransition, playConfirmation, setSoundEnabled } from '../components/lib/soundSystem';
import LoadingScreen from '../components/game/LoadingScreen';
import SetupScreen from '../components/game/SetupScreen';
import RoleRevealScreen from '../components/game/RoleRevealScreen';
import DiscussionScreen from '../components/game/DiscussionScreen';
import RevealScreen from '../components/game/RevealScreen';
import HowToPlayScreen from '../components/game/HowToPlayScreen';

const SPORTS_PHRASES = [
  "Lacing up cleats...",
  "Tucking in the jersey...",
  "Chalking the batter's box...",
  "Taping the ankles...",
  "Stretching in the outfield...",
  "Warming up in the bullpen...",
  "Tightening the chin strap...",
  "Waxing the hockey stick...",
  "Adjusting the eye black...",
  "Pulling up the knee socks...",
  "Buckling the helmet...",
  "Calling the play in the huddle...",
  "Putting on the batting gloves...",
  "Inflating the ball...",
  "Checking the lineup card...",
  "Chalking the free throw line...",
  "Polishing the cleats...",
  "Getting the signals from the coach...",
  "Stepping into the batter's box...",
  "Tying the skates...",
];
const randomPhrase = () => SPORTS_PHRASES[Math.floor(Math.random() * SPORTS_PHRASES.length)];

// Screen order for back-button logic
const SCREEN_ORDER = ['setup', 'howtoplay', 'loading', 'roles', 'discussion', 'reveal'];
// Screens that should NOT be pushed onto browser history (transient)
const NO_HISTORY_SCREENS = new Set(['loading']);

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const assignRoles = (players, impostorCount) => {
  const shuffled = shuffle([...players]);
  const roles = {};
  shuffled.forEach((name, i) => {
    roles[name] = i < impostorCount ? 'impostor' : 'crewmate';
  });
  return roles;
};

// Detect system dark mode preference
const getSystemDark = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive screen from URL hash, fallback to 'setup'
  const screenFromHash = location.hash.replace('#', '') || 'setup';
  const screen = SCREEN_ORDER.includes(screenFromHash) ? screenFromHash : 'setup';

  const setScreen = useCallback((next) => {
    if (NO_HISTORY_SCREENS.has(next)) {
      // Replace so loading screen doesn't pollute history
      navigate(`#${next}`, { replace: true });
    } else {
      navigate(`#${next}`);
    }
  }, [navigate]);

  // Dark mode: init from system, update on system change
  const [darkMode, setDarkMode] = useState(getSystemDark);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [soundOn, setSoundOn] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameState, setGameState] = useState(null);
  const [setupConfig, setSetupConfig] = useState(null);
  const poolRef = useRef([]);
  const usedIdsRef = useRef([]);
  const suppPoolRef = useRef({});

  // Ensure we start at setup if no hash
  useEffect(() => {
    if (!location.hash) navigate('#setup', { replace: true });
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleProgressMsg = (msg) => {
    setLoadingMsg(msg);
    const match = msg.match(/(\d+)%/);
    if (match) setLoadingProgress(parseInt(match[1]));
  };

  const startGame = async (config) => {
    setSetupConfig(config);
    setScreen('loading');
    setLoadingProgress(0);
    setLoadingMsg('Building roster...');

    clearSuppCache();
    suppPoolRef.current = {};

    const EXPANSION_IDS = ['PGA', 'FIFA', 'NCAAF', 'NCAAMB'];
    let pool;
    const teamPacks = config.selectedTeamPacks || (config.selectedTeamPack ? [config.selectedTeamPack] : []);
    if (teamPacks.length > 0) {
      pool = teamPacks.flatMap(tp => buildTeamPackPool(tp)).sort(() => Math.random() - 0.5);
    } else {
      const allLeagues = config.leagues || [];
      const standardLeagues = allLeagues.filter(l => !EXPANSION_IDS.includes(l));
      const expansionLeagueIds = allLeagues.filter(l => EXPANSION_IDS.includes(l));
      const mainPool = standardLeagues.length > 0
        ? await buildAthletePool(standardLeagues, config.difficulty, handleProgressMsg, config.selectedDecades || [])
        : [];
      const expansionPool = expansionLeagueIds.length > 0
        ? buildExpansionPool(expansionLeagueIds, config.difficulty)
        : [];
      const combined = [...mainPool, ...expansionPool];
      pool = combined.sort(() => Math.random() - 0.5);
      if (standardLeagues.length > 0) {
        const hardcodedNames = new Set(combined.map(a => a.name.toLowerCase()));
        runSupplementationIfOnline(standardLeagues, config.difficulty, hardcodedNames, config.selectedDecades || [])
          .then(suppAthletes => { if (suppAthletes) suppPoolRef.current = suppAthletes; })
          .catch(() => {});
      }
    }
    poolRef.current = pool;
    usedIdsRef.current = [];

    setLoadingMsg('Validating athlete photo...');
    const suppFlat = Object.values(suppPoolRef.current).flat();
    const mergedPool = suppFlat.length > 0 ? [...pool, ...suppFlat].sort(() => Math.random() - 0.5) : pool;
    const standardLeaguesForValidation = (config.leagues || []).filter(l => !EXPANSION_IDS.includes(l));
    const athlete = await pickValidatedAthlete(mergedPool, usedIdsRef.current, handleProgressMsg, config.difficulty, standardLeaguesForValidation);
    if (athlete) usedIdsRef.current.push(athlete.id);
    if (athlete) addToSessionHistory(athlete.id);

    const roles = assignRoles(config.playerNames, config.impostorCount);
    const hint = getHint(athlete);
    const firstPlayer = config.playerNames[Math.floor(Math.random() * config.playerNames.length)];
    setGameState({ ...config, athlete, roles, hint, firstPlayer });
    playTransition(config.leagues);
    setScreen('roles');
  };

  const handlePlayAgain = async () => {
    setScreen('loading');
    setLoadingMsg('Picking new athlete...');
    setLoadingProgress(0);

    const EXPANSION_IDS_PA = ['PGA', 'FIFA', 'NCAAF', 'NCAAMB'];
    let pool = poolRef.current;
    if (!pool || pool.length === 0) {
      const teamPacks = setupConfig.selectedTeamPacks || (setupConfig.selectedTeamPack ? [setupConfig.selectedTeamPack] : []);
      if (teamPacks.length > 0) {
        pool = teamPacks.flatMap(tp => buildTeamPackPool(tp)).sort(() => Math.random() - 0.5);
      } else {
        const allLeagues = setupConfig.leagues || [];
        const standardLeagues = allLeagues.filter(l => !EXPANSION_IDS_PA.includes(l));
        const expansionLeagueIds = allLeagues.filter(l => EXPANSION_IDS_PA.includes(l));
        const mainPool = standardLeagues.length > 0
          ? await buildAthletePool(standardLeagues, setupConfig.difficulty, handleProgressMsg, setupConfig.selectedDecades || [])
          : [];
        const expansionPool = expansionLeagueIds.length > 0
          ? buildExpansionPool(expansionLeagueIds, setupConfig.difficulty)
          : [];
        pool = [...mainPool, ...expansionPool].sort(() => Math.random() - 0.5);
      }
      poolRef.current = pool;
    }

    setLoadingMsg('Validating athlete photo...');
    const suppFlat = Object.values(suppPoolRef.current).flat();
    const mergedPool = suppFlat.length > 0 ? [...pool, ...suppFlat].sort(() => Math.random() - 0.5) : pool;
    const standardLeaguesPA = (setupConfig.leagues || []).filter(l => !EXPANSION_IDS_PA.includes(l));
    const athlete = await pickValidatedAthlete(mergedPool, usedIdsRef.current, handleProgressMsg, setupConfig.difficulty, standardLeaguesPA);
    if (athlete) { usedIdsRef.current.push(athlete.id); addToSessionHistory(athlete.id); }

    const roles = assignRoles(setupConfig.playerNames, setupConfig.impostorCount);
    const hint = getHint(athlete);
    const firstPlayer = setupConfig.playerNames[Math.floor(Math.random() * setupConfig.playerNames.length)];
    setGameState({ ...setupConfig, athlete, roles, hint, firstPlayer });
    setScreen('roles');
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`} style={{ WebkitTapHighlightColor: 'transparent' }}>
      <AnimatePresence mode="wait">
        {screen === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingScreen message={loadingMsg} progress={loadingProgress} />
          </motion.div>
        )}

        {screen === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
            <SetupScreen
              darkMode={darkMode}
              onToggleDark={() => setDarkMode(d => !d)}
              soundOn={soundOn}
              onToggleSound={toggleSound}
              onStart={startGame}
              onHowToPlay={() => setScreen('howtoplay')}
              initialPlayerNames={setupConfig?.playerNames}
            />
          </motion.div>
        )}

        {screen === 'howtoplay' && (
          <motion.div key="howtoplay" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
            <HowToPlayScreen darkMode={darkMode} onBack={() => navigate(-1)} />
          </motion.div>
        )}

        {screen === 'roles' && gameState && (
          <motion.div key="roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RoleRevealScreen
              gameState={gameState}
              darkMode={darkMode}
              onAllRevealed={() => { playTransition(gameState.leagues); setScreen('discussion'); }}
              onBack={() => { clearSessionHistory(); clearSuppCache(); usedIdsRef.current = []; poolRef.current = []; suppPoolRef.current = {}; setGameState(null); navigate('#setup', { replace: true }); }}
            />
          </motion.div>
        )}

        {screen === 'discussion' && gameState && (
          <motion.div key="discussion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DiscussionScreen
              gameState={gameState}
              darkMode={darkMode}
              onReveal={() => { playConfirmation(gameState.leagues); setScreen('reveal'); }}
              onBack={() => { clearSessionHistory(); clearSuppCache(); usedIdsRef.current = []; poolRef.current = []; suppPoolRef.current = {}; setGameState(null); navigate('#setup', { replace: true }); }}
            />
          </motion.div>
        )}

        {screen === 'reveal' && gameState && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RevealScreen
              gameState={gameState}
              darkMode={darkMode}
              onPlayAgain={handlePlayAgain}
              onBack={() => { clearSessionHistory(); clearSuppCache(); usedIdsRef.current = []; poolRef.current = []; suppPoolRef.current = {}; setGameState(null); navigate('#setup', { replace: true }); }}
              onChangeSettings={() => {
                clearSessionHistory(); clearSuppCache();
                usedIdsRef.current = []; poolRef.current = []; suppPoolRef.current = {};
                setGameState(null);
                navigate('#setup', { replace: true });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}