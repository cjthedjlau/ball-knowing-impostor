import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, HelpCircle, Play, Sun, Moon, Plus, Minus } from 'lucide-react';

const LEAGUES = ['NBA', 'NFL', 'MLB', 'NHL'];
const DIFFICULTIES = [
  { id: 'normal',        label: 'Normal',         desc: 'Household names — even your grandma knows them' },
  { id: 'ballknowledge', label: 'Ball Knowledge', desc: 'Deep bench obscurity — brutal even for real fans' },
];

export default function SetupScreen({ onStart, onHowToPlay, darkMode, onToggleDark }) {
  const [playerCount, setPlayerCount] = useState(4);
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [impostorCount, setImpostorCount] = useState(1);
  const [leagues, setLeagues] = useState(['NBA']);
  const [difficulty, setDifficulty] = useState('normal');
  const [hintEnabled, setHintEnabled] = useState(false);

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

  const canStart = playerNames.slice(0, playerCount).every(n => n.trim().length > 0) && leagues.length > 0;

  return (
    <div className={`min-h-screen ${bg} pb-10 transition-colors duration-300`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'} px-5 pt-12 pb-6 sticky top-0 z-10 shadow-sm`}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${text}`}>
              🏆 Ball Knowing
            </h1>
            <p className="text-[#3b82f6] font-bold text-sm tracking-widest uppercase">Impostor</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onHowToPlay}
              className={`p-2.5 rounded-xl ${darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}
            >
              <HelpCircle size={20} />
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
              <button
                key={l}
                onClick={() => toggleLeague(l)}
                className={`py-3 rounded-xl font-bold text-sm transition ${
                  leagues.includes(l)
                    ? 'bg-[#3b82f6] text-white'
                    : darkMode ? 'bg-white/10 text-white/50' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className={`${card} rounded-2xl p-5`}>
          <p className={`font-bold ${text} mb-3`}>Difficulty</p>
          <div className="space-y-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                  difficulty === d.id
                    ? 'bg-[#3b82f6] text-white'
                    : darkMode ? 'bg-white/5 text-white/60 border border-white/10' : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <span className="font-bold text-sm">{d.label}</span>
                <span className="text-xs opacity-70">{d.desc}</span>
              </button>
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
          onClick={() => canStart && onStart({ playerNames: playerNames.slice(0, playerCount).map(n => n.trim()), impostorCount, leagues, difficulty, hintEnabled, darkMode })}
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
    </div>
  );
}