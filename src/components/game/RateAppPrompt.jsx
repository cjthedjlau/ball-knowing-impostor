import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeLocalStorageSet } from '../lib/security';

const APP_STORE_URL = 'https://apps.apple.com'; // Replace with actual App Store URL

export default function RateAppPrompt({ onDismiss }) {
  const handleRate = () => {
    localStorage.setItem('bki_rated', 'done');
    window.open(APP_STORE_URL, '_blank');
    onDismiss();
  };

  const handleLater = () => {
    localStorage.setItem('bki_rated', 'later');
    onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-8"
      style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-sm bg-[#131c2e] rounded-3xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-white font-black text-xl mb-1">Enjoying Ball Knowing Imposter?</h3>
          <p className="text-white/50 text-sm">Leave us a quick rating — it really helps!</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleRate}
            className="w-full py-4 rounded-2xl bg-[#3b82f6] text-white font-black text-base"
          >
            Rate Now ⭐
          </button>
          <button
            onClick={handleLater}
            className="w-full py-3 rounded-2xl bg-white/10 text-white/60 font-bold text-sm"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}