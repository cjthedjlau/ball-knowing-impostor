import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { showRewardedAd, unlockPack } from '../lib/adManager';

/**
 * props:
 *   darkMode   — bool
 *   packId     — string (league id or team pack name)
 *   packLabel  — string (human-readable)
 *   onUnlocked — () => void   called after unlock confirmed
 *   onCancel   — () => void
 */
export default function RewardedAdModal({ darkMode, packId, packLabel, onUnlocked, onCancel }) {
  const [status, setStatus] = useState('idle'); // idle | loading | failed | unlocked

  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white'   : 'text-slate-900';
  const sub  = darkMode ? 'text-white/60' : 'text-slate-500';

  const handleWatch = () => {
    setStatus('loading');
    showRewardedAd(({ failed }) => {
      unlockPack(packId);
      setStatus(failed ? 'failed' : 'unlocked');
      setTimeout(() => onUnlocked(), 1400);
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className={`${card} rounded-3xl p-6 w-full max-w-xs`}
      >
        <AnimatePresence mode="wait">
          {status === 'unlocked' || status === 'failed' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-2"
            >
              {status === 'unlocked' ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <CheckCircle size={52} className="text-green-400 mb-3" />
                  </motion.div>
                  <p className={`text-lg font-black ${text}`}>Pack Unlocked!</p>
                  <p className={`text-sm mt-1 ${sub}`}>{packLabel} is active for this session.</p>
                </>
              ) : (
                <>
                  <p className="text-3xl mb-3">⚠️</p>
                  <p className={`text-base font-black ${text}`}>Ad unavailable right now.</p>
                  <p className={`text-sm mt-1 ${sub}`}>Pack unlocked for this session.</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-3xl text-center mb-3">🎬</p>
              <p className={`text-base font-black text-center mb-1 ${text}`}>
                Watch a short ad to unlock this pack for this session
              </p>
              <p className={`text-xs text-center mb-5 ${sub}`}>{packLabel}</p>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={status === 'loading'}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition ${
                    darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'
                  } disabled:opacity-40`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleWatch}
                  disabled={status === 'loading'}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm bg-[#3b82f6] text-white flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : 'Watch Ad'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}