import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import AthletePlaceholder from '../game/AthletePlaceholder';
import { playPop, playTap } from '../lib/soundSystem';

const haptic = () => { try { navigator.vibrate?.([30]); } catch {} };

function RoleCard({ player, athlete, isImpostor, hint, darkMode, onDone, difficulty }) {
  const [revealed, setRevealed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const bg = darkMode ? 'bg-[#0a0f1e]' : 'bg-slate-100';
  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-slate-900';

  const reveal = () => {
    haptic();
    playPop();
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
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ perspective: 1200 }}
            className="w-full max-w-xs"
          >
            {isImpostor ? (
              <div className={`${card} rounded-3xl p-8 flex flex-col items-center gap-5 shadow-xl border-2 border-red-500/40`}>
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-5xl">🕵️</div>
                <div className="text-center">
                  <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">Classified</p>
                  <p className={`text-2xl font-black ${text}`}>You Are the Imposter</p>
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
                    {!imgError && athlete?.photoUrl ? (
                      <>
                        {!imgLoaded && (
                          <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-[#0d1b35] to-[#0a0f1e]">
                            <div className="w-10 h-10 rounded-full border-4 border-[#1e3a6e] border-t-[#3b82f6] animate-spin" />
                          </div>
                        )}
                        <motion.img
                          src={athlete.photoUrl}
                          alt={athlete.name}
                          initial={{ scale: 1.08, opacity: 0 }}
                          animate={imgLoaded ? { scale: 1, opacity: 1 } : {}}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          className={`w-full h-64 object-cover object-top ${imgLoaded ? 'block' : 'hidden'}`}
                          onLoad={() => setImgLoaded(true)}
                          onError={() => { setImgError(true); setImgLoaded(true); }}
                        />
                      </>
                    ) : (
                      <AthletePlaceholder name={athlete?.name} className="w-full h-64" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-black text-xl leading-tight">{athlete?.name}</p>
                      <p className="text-white/70 text-sm">{athlete?.team}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-[#3b82f6] text-white text-xs font-black px-2.5 py-1 rounded-full">
                      {athlete?.league}
                    </div>
                  </div>
                ) : (
                  <div className={`relative flex flex-col items-center justify-center py-10 px-4 h-48 ${difficulty === 'legends' ? 'bg-gradient-to-br from-yellow-900/60 to-[#0a1628]' : 'bg-gradient-to-br from-[#1e3a6e] to-[#0a1628]'}`}>
                    <div className="text-5xl mb-2">{difficulty === 'legends' ? '🏆' : (athlete?.emoji || '🏅')}</div>
                    <p className="text-white font-black text-xl text-center px-4">{athlete?.name}</p>
                    <p className="text-white/60 text-sm mt-1">{athlete?.team}</p>
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {difficulty === 'legends' && (
                        <span className="bg-yellow-500 text-black text-xs font-black px-2 py-0.5 rounded-full">⭐</span>
                      )}
                      <span className="bg-[#3b82f6] text-white text-xs font-black px-2.5 py-1 rounded-full">{athlete?.league}</span>
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

export default function RoleRevealScreen({ gameState, darkMode, onAllRevealed, onBack }) {
  const { playerNames, roles, athlete, hintEnabled, difficulty } = gameState;
  const [activePlayer, setActivePlayer] = useState(null);
  const [done, setDone] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className={`min-h-screen ${bg} flex flex-col`} style={{ overscrollBehavior: 'none', touchAction: 'pan-x pan-y' }}>
      {/* Confirm quit dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`${card} rounded-3xl p-6 w-full max-w-xs`}
            >
              <p className={`text-lg font-black mb-2 ${text}`}>Quit Game?</p>
              <p className={`text-sm mb-5 ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>This will end the current game and return to setup.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className={`flex-1 py-3 rounded-2xl font-bold text-sm select-none ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
                <button onClick={() => { setShowConfirm(false); onBack(); }} className="flex-1 py-3 rounded-2xl font-bold text-sm bg-red-500 text-white select-none">Quit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 safe-top pb-4 flex items-center gap-3">
        <button onClick={() => setShowConfirm(true)} className={`p-2 rounded-xl flex-shrink-0 select-none ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className={`text-xs font-bold tracking-widest uppercase ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>Step 1</p>
          <h2 className={`text-2xl font-black ${text}`}>Check Your Role</h2>
          <p className={`text-sm ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>Tap your name — keep it secret!</p>
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3 flex-1">
        {playerNames.map((name, idx) => {
          const isDone = done.has(name);
          return (
            <motion.button
              key={name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
              whileTap={{ scale: 0.93 }}
              role="button"
              aria-label="Tap to reveal your role"
              onClick={() => { if (!isDone) { haptic(); playTap(); setActivePlayer(name); } }}
              className={`py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors ${
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
            difficulty={difficulty}
            onDone={() => handleDone(activePlayer)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}