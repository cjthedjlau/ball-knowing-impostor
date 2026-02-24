import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check } from 'lucide-react';

const haptic = () => { try { navigator.vibrate?.([30]); } catch {} };

function RoleCard({ player, athlete, isImpostor, hint, darkMode, onDone, difficulty }) {
  const [revealed, setRevealed] = useState(false);
  const bg = darkMode ? 'bg-[#0a0f1e]' : 'bg-slate-100';
  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-slate-900';

  const reveal = () => {
    haptic();
    setRevealed(true);
  };

  return (
    <div className={`fixed inset-0 ${bg} flex flex-col items-center justify-center p-6 z-50`}>
      <p className={`text-sm font-bold tracking-widest uppercase mb-8 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
        {player}'s turn
      </p>

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-xs"
          >
            <div className={`${card} rounded-3xl p-10 flex flex-col items-center gap-6 shadow-xl`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${darkMode ? 'bg-[#3b82f6]/20' : 'bg-blue-50'}`}>
                🔒
              </div>
              <div className="text-center">
                <p className={`font-bold text-lg ${text}`}>Tap to see your role</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>Keep it secret!</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={reveal}
                className="w-full py-4 rounded-2xl bg-[#3b82f6] text-white font-black text-lg flex items-center justify-center gap-2"
              >
                <Eye size={20} /> Reveal
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xs"
          >
            {isImpostor ? (
              <div className={`${card} rounded-3xl p-8 flex flex-col items-center gap-5 shadow-xl border-2 border-red-500/40`}>
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-5xl">🕵️</div>
                <div className="text-center">
                  <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">Classified</p>
                  <p className={`text-2xl font-black ${text}`}>You Are the Impostor</p>
                  {hint && (
                    <div className="mt-4 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">Hint</p>
                      <p className={`font-bold text-lg ${text}`}>{hint}</p>
                    </div>
                  )}
                  <p className={`text-xs mt-3 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>Blend in. Don't get caught.</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { haptic(); onDone(); }}
                  className="w-full py-3.5 rounded-2xl bg-red-500 text-white font-black text-base flex items-center justify-center gap-2"
                >
                  <EyeOff size={18} /> Got It
                </motion.button>
              </div>
            ) : (
              <div className={`${card} rounded-3xl overflow-hidden shadow-xl border-2 border-[#3b82f6]/30`}>
                {athlete?.photoUrl ? (
                  <div className="relative">
                    <img
                      src={athlete.photoUrl}
                      alt={athlete.name}
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-black text-xl leading-tight">{athlete?.name}</p>
                      <p className="text-white/70 text-sm">{athlete?.team}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-[#3b82f6] text-white text-xs font-black px-2.5 py-1 rounded-full">
                      {athlete?.league}
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-gradient-to-br from-[#1e3a6e] to-[#0a1628] flex flex-col items-center justify-center h-48">
                    <div className="text-6xl mb-2">🏆</div>
                    <p className="text-white font-black text-2xl text-center px-4">{athlete?.name}</p>
                    <p className="text-white/60 text-sm mt-1">{athlete?.team}</p>
                    <div className="absolute top-3 right-3 bg-[#3b82f6] text-white text-xs font-black px-2.5 py-1 rounded-full">
                      {athlete?.league}
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>Your Athlete</p>
                  {athlete?.position && (
                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Position: {athlete.position}</p>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { haptic(); onDone(); }}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-[#3b82f6] text-white font-black text-base flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Got It
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoleRevealScreen({ gameState, darkMode, onAllRevealed }) {
  const { playerNames, roles, athlete, hintEnabled } = gameState;
  const [activePlayer, setActivePlayer] = useState(null);
  const [done, setDone] = useState(new Set());

  const bg   = darkMode ? 'bg-[#0a0f1e]' : 'bg-slate-100';
  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white'   : 'text-slate-900';

  const handleDone = (name) => {
    const next = new Set(done);
    next.add(name);
    setDone(next);
    setActivePlayer(null);
  };

  const allDone = done.size === playerNames.length;

  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      <div className="px-5 pt-12 pb-4">
        <p className={`text-xs font-bold tracking-widest uppercase ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>Step 1</p>
        <h2 className={`text-2xl font-black mt-1 ${text}`}>Check Your Role</h2>
        <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>Tap your name — keep it secret!</p>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3 flex-1">
        {playerNames.map((name) => {
          const isDone = done.has(name);
          return (
            <motion.button
              key={name}
              whileTap={{ scale: 0.96 }}
              onClick={() => { if (!isDone) { haptic(); setActivePlayer(name); } }}
              className={`py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                isDone
                  ? 'bg-green-500/20 border-2 border-green-500/40'
                  : darkMode ? 'bg-[#131c2e] border-2 border-white/10' : 'bg-white border-2 border-slate-200'
              }`}
            >
              <span className="text-2xl">{isDone ? '✅' : '👤'}</span>
              <span className={`font-bold text-sm text-center px-2 ${isDone ? 'text-green-400' : text}`}>{name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="px-5 pt-4 pb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => allDone && onAllRevealed()}
          className={`w-full py-5 rounded-2xl font-black text-lg transition ${
            allDone
              ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/30'
              : darkMode ? 'bg-white/10 text-white/30' : 'bg-slate-200 text-slate-400'
          }`}
        >
          {allDone ? 'Start Discussion →' : `${done.size} / ${playerNames.length} revealed`}
        </motion.button>
      </div>

      <AnimatePresence>
        {activePlayer && (
          <RoleCard
            key={activePlayer}
            player={activePlayer}
            athlete={athlete}
            isImpostor={roles[activePlayer] === 'impostor'}
            hint={hintEnabled ? gameState.hint : null}
            darkMode={darkMode}
            onDone={() => handleDone(activePlayer)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}