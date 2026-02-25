import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { playTap } from '../../lib/soundSystem';
import {
  NFL_TEAMS, NBA_TEAMS, MLB_TEAMS, NHL_TEAMS, EXPANSION_LEAGUE_EMOJI, TEAM_PACKS,
} from './expansionData';

const EXPANSION_LEAGUES = [
  { id: 'PGA',    label: 'PGA Tour',              emoji: '⛳' },
  { id: 'FIFA',   label: 'FIFA',                  emoji: '⚽' },
  { id: 'NCAAF',  label: 'NCAAF',                 emoji: '🏈' },
  { id: 'NCAAMB', label: 'NCAA Men\'s Basketball', emoji: '🏀' },
];

const TEAM_SECTIONS = [
  { label: 'NFL Teams', teams: NFL_TEAMS },
  { label: 'NBA Teams', teams: NBA_TEAMS },
  { label: 'MLB Teams', teams: MLB_TEAMS },
  { label: 'NHL Teams', teams: NHL_TEAMS },
];

export default function ExpansionPacksModal({
  darkMode,
  selectedExpansionLeagues,
  onToggleExpansionLeague,
  selectedTeamPacks,
  onToggleTeamPack,
  onClose,
}) {
  const [openSection, setOpenSection] = useState(null);

  const bg   = darkMode ? 'bg-[#0a0f1e]'  : 'bg-slate-100';
  const card = darkMode ? 'bg-[#131c2e]'  : 'bg-white';
  const text = darkMode ? 'text-white'    : 'text-slate-900';
  const sub  = darkMode ? 'text-white/50' : 'text-slate-500';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
    >
      <div className={`flex-1 ${bg} overflow-y-auto`}>
        {/* Header */}
        <div className={`${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'} px-5 pt-12 pb-4 sticky top-0 z-10 shadow-sm flex items-center justify-between`}>
          <div>
            <h2 className={`text-xl font-black ${text}`}>⚡ Expansion Packs</h2>
            <p className={`text-xs ${sub} mt-0.5`}>All packs free & unlocked</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2.5 rounded-xl ${darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-4 pb-10 space-y-4">

          {/* ── Section 1: League Expansions ── */}
          <div className={`${card} rounded-2xl p-5`}>
            <p className={`font-black text-sm tracking-widest uppercase mb-3 ${darkMode ? 'text-[#3b82f6]' : 'text-blue-600'}`}>
              League Expansions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {EXPANSION_LEAGUES.map(l => {
                const active = selectedExpansionLeagues.includes(l.id);
                return (
                  <motion.button
                    key={l.id}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => { onToggleExpansionLeague(l.id); playTap(); }}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${
                      active
                        ? 'bg-[#3b82f6] text-white'
                        : darkMode ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="text-lg">{l.emoji}</span>
                    <span className="leading-tight text-left">{l.label}</span>
                  </motion.button>
                );
              })}
            </div>
            <p className={`text-xs mt-3 ${sub}`}>
              NCAAF & NCAA Basketball use name + emoji only — no photos.
            </p>
          </div>

          {/* ── Section 2: Team Packs ── */}
          <div className={`${card} rounded-2xl overflow-hidden`}>
            <div className="p-5 pb-2">
              <p className={`font-black text-sm tracking-widest uppercase mb-1 ${darkMode ? 'text-[#3b82f6]' : 'text-blue-600'}`}>
                Team Packs
              </p>
              <p className={`text-xs ${sub}`}>One team pack active at a time. Replaces the league pool.</p>
            </div>

            {TEAM_SECTIONS.map(section => (
              <div key={section.label}>
                {/* Section header */}
                <button
                  onClick={() => { setOpenSection(s => s === section.label ? null : section.label); playTap(); }}
                  className={`w-full flex items-center justify-between px-5 py-3 transition-colors ${
                    darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-bold text-sm ${text}`}>{section.label}</span>
                  {openSection === section.label
                    ? <ChevronUp size={16} className={sub} />
                    : <ChevronDown size={16} className={sub} />
                  }
                </button>

                <AnimatePresence initial={false}>
                  {openSection === section.label && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 grid grid-cols-1 gap-1.5">
                        {section.teams.map(teamName => {
                          const pack = TEAM_PACKS[teamName];
                          const active = selectedTeamPack === teamName;
                          return (
                            <motion.button
                              key={teamName}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => { onSelectTeamPack(active ? null : teamName); playTap(); }}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                active
                                  ? 'bg-[#3b82f6] text-white'
                                  : darkMode ? 'bg-white/5 text-white/70 border border-white/10' : 'bg-slate-50 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span className="text-base flex-shrink-0">{pack?.emoji || '🏅'}</span>
                              <span
                                className={`w-2.5 h-2.5 rounded-full flex-shrink-0`}
                                style={{ backgroundColor: pack?.color || '#888' }}
                              />
                              <span>{teamName}</span>
                              {active && <span className="ml-auto text-xs opacity-80">Active</span>}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className={`mx-5 h-px ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
}