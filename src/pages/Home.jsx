import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildAthletePool, pickValidatedAthlete, getHint, clearSessionHistory, addToSessionHistory } from '../components/lib/sportsApi';
import { buildExpansionPool, buildTeamPackPool } from '../components/game/expansionPacks/expansionPacksApi';
import { runSupplementationIfOnline, clearSuppCache } from '../components/lib/apiSupplementation';
import { playTransition, playConfirmation, setSoundEnabled, isSoundEnabled } from '../components/lib/soundSystem';
import LoadingScreen from '../components/game/LoadingScreen';
import SetupScreen from '../components/game/SetupScreen';
import RoleRevealScreen from '../components/game/RoleRevealScreen';
import DiscussionScreen from '../components/game/DiscussionScreen';
import RevealScreen from '../components/game/RevealScreen';
import HowToPlayScreen from '../components/game/HowToPlayScreen';

const SCREENS = ['setup', 'loading', 'roles', 'discussion', 'reveal', 'howtoplay'];

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

export default function Home() {
  const [screen, setScreen] = useState('setup');
  const [darkMode, setDarkMode] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameState, setGameState] = useState(null);
  const [setupConfig, setSetupConfig] = useState(null);
  const poolRef = useRef([]);
  const usedIdsRef = useRef([]);
  const suppPoolRef = useRef({});  // supplementary athletes by league

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

    // Clear stale supplementary cache from previous session config
    clearSuppCache();
    suppPoolRef.current = {};

    let pool;
    if (config.selectedTeamPack) {
      // Team pack replaces entire league pool
      pool = buildTeamPackPool(config.selectedTeamPack, config.difficulty);
    } else {
      // Main leagues + expansion leagues combined
      const mainPool = await buildAthletePool(config.leagues, config.difficulty, handleProgressMsg, config.selectedDecades || []);
      const expansionPool = config.expansionLeagues && config.expansionLeagues.length > 0
        ? buildExpansionPool(config.expansionLeagues, config.difficulty)
        : [];
      // Shuffle-merge
      const combined = [...mainPool, ...expansionPool];
      pool = combined.sort(() => Math.random() - 0.5);

      // Kick off background API supplementation (non-blocking)
      if (config.leagues && config.leagues.length > 0) {
        const hardcodedNames = new Set(combined.map(a => a.name.toLowerCase()));
        runSupplementationIfOnline(
          config.leagues,
          config.difficulty,
          hardcodedNames,
          config.selectedDecades || []
        ).then(suppAthletes => {
          if (suppAthletes) suppPoolRef.current = suppAthletes;
        }).catch(() => {});
      }
    }
    poolRef.current = pool;
    usedIdsRef.current = [];

    setLoadingMsg('Validating athlete photo...');
    const athlete = await pickValidatedAthlete(pool, usedIdsRef.current, handleProgressMsg, config.difficulty, config.leagues);
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

    let pool = poolRef.current;
    if (!pool || pool.length === 0) {
      if (setupConfig.selectedTeamPack) {
        pool = buildTeamPackPool(setupConfig.selectedTeamPack, setupConfig.difficulty);
      } else {
        const mainPool = await buildAthletePool(setupConfig.leagues, setupConfig.difficulty, handleProgressMsg, setupConfig.selectedDecades || []);
        const expansionPool = setupConfig.expansionLeagues && setupConfig.expansionLeagues.length > 0
          ? buildExpansionPool(setupConfig.expansionLeagues, setupConfig.difficulty)
          : [];
        pool = [...mainPool, ...expansionPool].sort(() => Math.random() - 0.5);
      }
      poolRef.current = pool;
    }

    setLoadingMsg('Validating athlete photo...');
    const athlete = await pickValidatedAthlete(pool, usedIdsRef.current, handleProgressMsg, setupConfig.difficulty, setupConfig.leagues);
    if (athlete) { usedIdsRef.current.push(athlete.id); addToSessionHistory(athlete.id); }

    const roles = assignRoles(setupConfig.playerNames, setupConfig.impostorCount);
    const hint = getHint(athlete);
    const firstPlayer = setupConfig.playerNames[Math.floor(Math.random() * setupConfig.playerNames.length)];

    setGameState({ ...setupConfig, athlete, roles, hint, firstPlayer });
    setScreen('roles');
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`} style={{ WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}>
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
            <HowToPlayScreen darkMode={darkMode} onBack={() => setScreen('setup')} />
          </motion.div>
        )}

        {screen === 'roles' && gameState && (
          <motion.div key="roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RoleRevealScreen
              gameState={gameState}
              darkMode={darkMode}
              onAllRevealed={() => { playTransition(gameState.leagues); setScreen('discussion'); }}
            />
          </motion.div>
        )}

        {screen === 'discussion' && gameState && (
          <motion.div key="discussion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DiscussionScreen
              gameState={gameState}
              darkMode={darkMode}
              onReveal={() => { playConfirmation(gameState.leagues); setScreen('reveal'); }}
            />
          </motion.div>
        )}

        {screen === 'reveal' && gameState && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RevealScreen
              gameState={gameState}
              darkMode={darkMode}
              onPlayAgain={handlePlayAgain}
              onChangeSettings={() => { clearSessionHistory(); usedIdsRef.current = []; poolRef.current = []; setScreen('setup'); setGameState(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}