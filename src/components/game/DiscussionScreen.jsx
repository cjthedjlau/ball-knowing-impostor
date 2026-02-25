import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, ArrowLeft } from 'lucide-react';

const haptic = () => { try { navigator.vibrate?.([20, 50, 20]); } catch {} };

export default function DiscussionScreen({ gameState, darkMode, onReveal, onBack }) {
  const { playerNames, impostorCount } = gameState;
  const [seconds, setSeconds] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const bg   = darkMode ? 'bg-[#0a0f1e]' : 'bg-slate-100';
  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white'   : 'text-slate-900';
  const sub  = darkMode ? 'text-white/50' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bg} flex flex-col`} style={{ overscrollBehavior: 'none' }}>
      {/* Confirm quit */}
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
              <p className={`text-sm mb-5 ${sub}`}>This will end the current game and return to setup.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className={`flex-1 py-3 rounded-2xl font-bold text-sm select-none ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
                <button onClick={() => { setShowConfirm(false); onBack(); }} className="flex-1 py-3 rounded-2xl font-bold text-sm bg-red-500 text-white select-none">Quit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button row */}
      <div className="px-5 safe-top pb-2 flex items-center">
        <button onClick={() => setShowConfirm(true)} className={`p-2 rounded-xl select-none ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-5xl font-black mb-8 tracking-tight ${text}`}
      >
        {fmt(seconds)}
      </motion.div>

      {/* First player banner */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className={`w-full max-w-sm mb-4 rounded-2xl px-6 py-4 text-center ${darkMode ? 'bg-[#3b82f6]/20 border border-[#3b82f6]/40' : 'bg-blue-50 border border-blue-200'}`}
      >
        <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${darkMode ? 'text-[#3b82f6]' : 'text-blue-500'}`}>Goes First</p>
        <p className={`text-2xl font-black ${text}`}>{gameState.firstPlayer}</p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>give your clue!</p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`${card} rounded-3xl p-8 w-full max-w-sm text-center shadow-xl`}
      >
        <div className="text-5xl mb-4">💬</div>
        <h2 className={`text-2xl font-black mb-2 ${text}`}>Discussion Time</h2>
        <p className={`text-sm leading-relaxed ${sub}`}>
          Go around the table. Each player gives a <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>one-sentence clue</span> about the athlete.
          Be vague enough to fool the {impostorCount === 1 ? 'imposter' : 'imposters'} — but not so vague you seem suspicious.
        </p>

        <div className={`mt-6 p-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'}`}>
          <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${sub}`}>Players</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {playerNames.map(n => (
              <span key={n} className={`text-xs font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'bg-blue-100 text-blue-700'}`}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className="text-yellow-500 text-xs">
            🎯 Find the {impostorCount === 1 ? 'imposter' : `${impostorCount} imposters`} hiding among you!
          </p>
        </div>
      </motion.div>

      {/* Reveal Button — heartbeat glow */}
      <motion.div
        className="mt-8 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ boxShadow: ['0 0 16px 2px rgba(59,130,246,0.35)', '0 0 40px 10px rgba(59,130,246,0.7)', '0 0 16px 2px rgba(59,130,246,0.35)'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-2xl"
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { haptic(); onReveal(); }}
            className="w-full py-5 rounded-2xl bg-[#3b82f6] text-white font-black text-lg flex items-center justify-center gap-3"
          >
            <Eye size={22} /> Reveal the Imposter
          </motion.button>
        </motion.div>
      </motion.div>

      <p className={`mt-4 text-xs text-center ${sub}`}>Ready? Tap when everyone has voted.</p>
      </div>{/* end flex-1 */}
    </div>
  );
}