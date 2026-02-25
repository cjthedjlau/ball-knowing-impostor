import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTap } from '../lib/soundSystem';
import { Users, Trophy, HelpCircle, Play, Sun, Moon, Plus, Minus, Volume2, VolumeX, Zap } from 'lucide-react';
import LeagueDecadeSelector from './LeagueDecadeSelector';
import ExpansionPacksModal from './expansionPacks/ExpansionPacksModal';
import { EXPANSION_LEAGUE_EMOJI } from './expansionPacks/expansionData';

const LEAGUES = ['NBA', 'NFL', 'MLB', 'NHL'];
const DIFFICULTIES = [
  { id: 'normal',        label: 'Normal',         emoji: null,  desc: 'Active stars — everyone knows them' },
  { id: 'legends',       label: 'Legends',        emoji: '🏆',  desc: 'Iconic retired GOATs — timeless legends' },
  { id: 'ballknowledge', label: 'Ball Knowledge', emoji: '🔎',  desc: 'Deep bench — brutal even for real fans' },
];

// Ordered display — MLB, NBA, NFL, NHL + expansion leagues
const LEAGUE_ORDER = ['MLB', 'NBA', 'NFL', 'NHL'];
const LEAGUE_EMOJI_MAP = { MLB: '⚾', NBA: '🏀', NFL: '🏈', NHL: '🏒', ...EXPANSION_LEAGUE_EMOJI };
const ALL_LEAGUE_ORDER = [...LEAGUE_ORDER, 'PGA', 'FIFA', 'NCAAF', 'NCAAMB'];

function LeagueEmojiCluster({ leagues }) {
  const active = ALL_LEAGUE_ORDER.filter(l => leagues.includes(l));
  const OFFSET = 14;
  const totalWidth = active.length > 1 ? OFFSET * (active.length - 1) + 24 : 24;

  return (
    <div className="relative flex-shrink-0" style={{ width: totalWidth, height: 28 }}>
      <AnimatePresence>
        {active.map((league, i) => (
          <motion.span
            key={league}
            initial={{ x: -10, opacity: 0, scale: 0.6 }}
            animate={{ x: i * OFFSET, opacity: 1, scale: 1 }}
            exit={{ x: -10, opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="absolute top-0 left-0 text-xl leading-none select-none"
            style={{ zIndex: i }}
          >
            {LEAGUE_EMOJI_MAP[league]}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function SetupScreen({ onStart, onHowToPlay, darkMode, onToggleDark, soundOn, onToggleSound, initialPlayerNames }) {
  const savedNames = initialPlayerNames && initialPlayerNames.length >= 3 ? initialPlayerNames : null;
  const [playerCount, setPlayerCount] = useState(savedNames ? savedNames.length : 4);
  const [playerNames, setPlayerNames] = useState(savedNames || ['', '', '', '']);
  const [impostorCount, setImpostorCount] = useState(1);
  const [leagues, setLeagues] = useState(['NBA']);
  const [difficulty, setDifficulty] = useState('normal');
  const [hintEnabled, setHintEnabled] = useState(false);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [expansionLeagues, setExpansionLeagues] = useState([]);
  const [selectedTeamPacks, setSelectedTeamPacks] = useState([]);
  const [showExpansionModal, setShowExpansionModal] = useState(false);

  const toggleExpansionLeague = (id) => {
    setExpansionLeagues(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleTeamPack = (name) => {
    setSelectedTeamPacks(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const bg    = darkMode ? 'bg-[#0a0f1e]'    : 'bg-slate-100';
  const card  = darkMode ? 'bg-[#131c2e]'    : 'bg-white';
  const text  = darkMode ? 'text-white'      : 'text-slate-900';
  const sub   = darkMode ? 'text-white/50'   : 'text-slate-500';
  const input = darkMode ? 'bg-[#1e2d47] border-white/10 text-white placeholder:text-white/30 focus:border-[#3b82f6]'
                         : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500';

  const adjustPlayers = (delta) => {
    const next = Math.max(3, Math.min(10, playerCount + delta));
    if (next > playerCount) setPlayerNames(p => [...p, '']);
    else setPlayerNames(p => p.slice(0, next));
    setPlayerCount(next);
    if (impostorCount >= next) setImpostorCount(next - 1);
  };

  const toggleLeague = (l) => {
    if (leagues.includes(l)) {
      if (leagues.length === 1) return;
      setLeagues(leagues.filter(x => x !== l));
    } else {
      setLeagues([...leagues, l]);
    }
  };

  // All active leagues for emoji cluster
  const allActiveLeagues = selectedTeamPacks.length > 0
    ? leagues
    : [...leagues, ...expansionLeagues];

  const hasAnyLeague = leagues.length > 0 || expansionLeagues.length > 0 || selectedTeamPacks.length > 0;
  const canStart = playerNames.slice(0, playerCount).every(n => n.trim().length > 0) && hasAnyLeague;

  return (
    <div className={`min-h-screen ${bg} pb-10 transition-colors duration-300`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'} px-5 pt-12 pb-6 sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex flex-col items-center text-center flex-1">
            <h1 className={`text-3xl font-black tracking-tight ${text}`}>
              🏆 Ball Knowing
            </h1>
            <p className={`text-[#3b82f6] font-black tracking-[0.25em] uppercase text-3xl`}>Imposter</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onHowToPlay}
              className={`p-2.5 rounded-xl ${darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}
            >
              <HelpCircle size={20} />
            </button>
            <button
              onClick={onToggleSound}
              className={`p-2.5 rounded-xl ${darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}
            >
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={onToggleDark}
              className={`p-2.5 rounded-xl ${darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* Players */}
        <div className={`${card} rounded-2xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#3b82f6]" />
              <span className={`font-bold ${text}`}>Players</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => adjustPlayers(-1)} className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                <Minus size={16} />
              </button>
              <span className={`text-xl font-black w-6 text-center ${text}`}>{playerCount}</span>
              <button onClick={() => adjustPlayers(1)} className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: playerCount }).map((_, i) => (
              <input
                key={i}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition ${input}`}
                placeholder={`Player ${i + 1}`}
                value={playerNames[i] || ''}
                onChange={e => {
                  const n = [...playerNames];
                  n[i] = e.target.value;
                  setPlayerNames(n);
                }}
              />
            ))}
          </div>
        </div>

        {/* Impostors */}
        <div className={`${card} rounded-2xl p-5`}>
          <p className={`font-bold ${text} mb-3`}>Impostors</p>
          <div className="flex gap-3">
            {[1, 2].map(n => (
              <button
                key={n}
                onClick={() => setImpostorCount(n)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                  impostorCount === n
                    ? 'bg-[#3b82f6] text-white'
                    : darkMode ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {n} Impostor{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Leagues */}
        <div className={`${card} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-[#3b82f6]" />
            <span className={`font-bold ${text}`}>Leagues</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {LEAGUES.map(l => (
              <motion.button
                key={l}
                onClick={() => { toggleLeague(l); playTap(); }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className={`py-3 rounded-xl font-bold text-sm transition-colors ${
                  leagues.includes(l)
                    ? 'bg-[#3b82f6] text-white'
                    : darkMode ? 'bg-white/10 text-white/50' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {l}
              </motion.button>
            ))}
          </div>

          {/* Expansion Packs Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowExpansionModal(true); playTap(); }}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-colors border ${
              expansionLeagues.length > 0 || selectedTeamPack
                ? 'border-[#3b82f6] text-[#3b82f6] bg-[#3b82f6]/10'
                : darkMode ? 'border-white/15 text-white/50 bg-white/5' : 'border-slate-200 text-slate-500 bg-slate-50'
            }`}
          >
            <Zap size={15} className="text-[#3b82f6]" />
            Expansion Packs
            {(expansionLeagues.length > 0 || selectedTeamPack) && (
              <span className="bg-[#3b82f6] text-white text-xs font-black px-1.5 py-0.5 rounded-full">
                {expansionLeagues.length + (selectedTeamPack ? 1 : 0)}
              </span>
            )}
          </motion.button>

          {/* Active team pack indicator */}
          {selectedTeamPack && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-xl ${darkMode ? 'bg-[#3b82f6]/10' : 'bg-blue-50'}`}
            >
              <span className="text-sm">📦</span>
              <span className={`text-xs font-bold ${darkMode ? 'text-[#3b82f6]' : 'text-blue-600'}`}>
                Team Pack: {selectedTeamPack}
              </span>
            </motion.div>
          )}
        </div>

        {/* Difficulty */}
        <div className={`${card} rounded-2xl p-5`}>
          <p className={`font-bold ${text} mb-3`}>Difficulty</p>
          <div className="space-y-2">
            {DIFFICULTIES.map(d => (
              <React.Fragment key={d.id}>
                <motion.button
                  onClick={() => { setDifficulty(d.id); playTap(); }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative overflow-hidden ${
                    difficulty === d.id
                      ? d.id === 'legends' ? 'bg-yellow-500 text-black' : 'bg-[#3b82f6] text-white'
                      : darkMode ? 'bg-white/5 text-white/60 border border-white/10' : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {d.emoji
                    ? <span className="text-xl flex-shrink-0">{d.emoji}</span>
                    : <LeagueEmojiCluster leagues={allActiveLeagues} />
                  }
                  <div className="flex flex-col items-start text-left">
                    <span className="font-bold text-sm">{d.label}</span>
                    <span className="text-xs opacity-70">{d.desc}</span>
                  </div>
                </motion.button>
                {d.id === 'legends' && difficulty === 'legends' && (
                  <LeagueDecadeSelector
                    darkMode={darkMode}
                    selectedDecades={selectedDecades}
                    onChange={setSelectedDecades}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hint Toggle */}
        <div className={`${card} rounded-2xl p-5 flex items-center justify-between`}>
          <div>
            <p className={`font-bold ${text}`}>Impostor Hint</p>
            <p className={`text-xs mt-0.5 ${sub}`}>Give impostors a vague one-word hint</p>
          </div>
          <button
            onClick={() => setHintEnabled(!hintEnabled)}
            className={`w-14 h-7 rounded-full transition-colors relative ${hintEnabled ? 'bg-[#3b82f6]' : darkMode ? 'bg-white/20' : 'bg-slate-200'}`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full absolute top-1"
              animate={{ left: hintEnabled ? '30px' : '4px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Start */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => canStart && onStart({
            playerNames: playerNames.slice(0, playerCount).map(n => n.trim()),
            impostorCount,
            leagues,
            difficulty,
            hintEnabled,
            darkMode,
            selectedDecades,
            expansionLeagues,
            selectedTeamPack,
          })}
          className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition ${
            canStart
              ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/30'
              : darkMode ? 'bg-white/10 text-white/30' : 'bg-slate-200 text-slate-400'
          }`}
        >
          <Play size={22} fill="currentColor" />
          Start Game
        </motion.button>
      </div>

      {/* Expansion Packs Modal */}
      <AnimatePresence>
        {showExpansionModal && (
          <ExpansionPacksModal
            darkMode={darkMode}
            selectedExpansionLeagues={expansionLeagues}
            onToggleExpansionLeague={toggleExpansionLeague}
            selectedTeamPack={selectedTeamPack}
            onSelectTeamPack={setSelectedTeamPack}
            onClose={() => setShowExpansionModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}