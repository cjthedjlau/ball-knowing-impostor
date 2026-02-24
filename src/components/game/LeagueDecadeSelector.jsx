import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTap } from '../lib/soundSystem';

const DECADES = [
  { id: '1950s', label: '1950 — 1959' },
  { id: '1960s', label: '1960 — 1969' },
  { id: '1970s', label: '1970 — 1979' },
  { id: '1980s', label: '1980 — 1989' },
  { id: '1990s', label: '1990 — 1999' },
  { id: '2000s', label: '2000 — 2009' },
  { id: '2010s', label: '2010 — 2019' },
];

export default function LeagueDecadeSelector({ darkMode, selectedDecades, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-slate-900';
  const sub  = darkMode ? 'text-white/50' : 'text-slate-500';

  const hasLowVariety = expanded && selectedDecades.length > 0 && selectedDecades.length <= 1;

  const toggleDecade = (id) => {
    playTap();
    if (selectedDecades.includes(id)) {
      onChange(selectedDecades.filter(d => d !== id));
    } else {
      onChange([...selectedDecades, id]);
    }
  };

  // Dismiss tooltip on outside click
  useEffect(() => {
    if (!showTooltip) return;
    const handler = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showTooltip]);

  return (
    <div className={`${card} rounded-2xl p-4 mt-2`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${sub} uppercase tracking-wider`}>Advanced Settings</span>
          {/* Info icon */}
          <div className="relative" ref={tooltipRef}>
            <button
              onClick={() => setShowTooltip(v => !v)}
              className="w-4 h-4 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0"
            >
              <span className="text-white text-[9px] font-black leading-none">i</span>
            </button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-6 z-50 w-56 bg-[#0d1b35] text-white text-xs rounded-xl p-3 shadow-xl border border-white/10"
                >
                  Filter Legends athletes by the decade they were most prominent. Mix and match any decades you like.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={() => {
            const next = !expanded;
            setExpanded(next);
            if (!next) onChange([]);
          }}
          className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${expanded ? 'bg-[#3b82f6]' : darkMode ? 'bg-white/20' : 'bg-slate-200'}`}
        >
          <motion.div
            className="w-4 h-4 bg-white rounded-full absolute top-1"
            animate={{ left: expanded ? '26px' : '4px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Accordion content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="decade-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="grid grid-cols-2 gap-2 mt-3">
              {DECADES.map((d, i) => (
                <motion.button
                  key={d.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.045, type: 'spring', stiffness: 500, damping: 28 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleDecade(d.id)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-colors text-center ${
                    selectedDecades.includes(d.id)
                      ? 'bg-[#3b82f6] text-white'
                      : darkMode ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {d.label}
                </motion.button>
              ))}
            </div>

            {/* Low variety warning */}
            <AnimatePresence>
              {hasLowVariety && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#3b82f6] text-xs mt-2 text-center"
                >
                  Consider selecting additional decades for more variety
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}