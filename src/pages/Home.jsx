import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildAthletePool, pickValidatedAthlete, getHint } from '../components/lib/sportsApi';
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

    const pool = await buildAthletePool(config.leagues, config.difficulty, handleProgressMsg);
    poolRef.current = pool;
    usedIdsRef.current = [];

    setLoadingMsg('Validating athlete photo...');
    const athlete = await pickValidatedAthlete(pool, usedIdsRef.current, handleProgressMsg);
    if (athlete) usedIdsRef.current.push(athlete.id);

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
      pool = await buildAthletePool(setupConfig.leagues, setupConfig.difficulty, handleProgressMsg);
      poolRef.current = pool;
    }

    setLoadingMsg('Validating athlete photo...');
    const athlete = await pickValidatedAthlete(pool, usedIdsRef.current, handleProgressMsg);
    if (athlete) usedIdsRef.current.push(athlete.id);

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
              onReveal={() => setScreen('reveal')}
            />
          </motion.div>
        )}

        {screen === 'reveal' && gameState && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RevealScreen
              gameState={gameState}
              darkMode={darkMode}
              onPlayAgain={handlePlayAgain}
              onChangeSettings={() => { setScreen('setup'); setGameState(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}