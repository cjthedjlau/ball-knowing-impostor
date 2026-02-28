import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AboutModal({ darkMode, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-xs rounded-3xl p-6 relative ${darkMode ? 'bg-[#131c2e]' : 'bg-white'}`}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-xl ${darkMode ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'}`}
          >
            <X size={16} />
          </button>

          <div className="text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h2 className={`text-xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ball Knowing Imposter</h2>
            <p className={`text-sm mb-4 ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>
              The ultimate sports trivia social deduction party game.
            </p>
            <div className={`text-xs rounded-xl px-3 py-2.5 mb-4 text-left ${darkMode ? 'bg-white/5 text-white/40' : 'bg-slate-50 text-slate-400'}`}>
              <p className="font-bold mb-0.5">Content Rating: 4+</p>
              <p>No violence · No explicit content · No user-generated content. Safe for all ages.</p>
            </div>
            <a
              href="mailto:support@ballknowingimpostor.com"
              className="text-[#3b82f6] text-sm underline"
            >
              support@ballknowingimpostor.com
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}