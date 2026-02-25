import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const STEPS = [
  { emoji: '⚙️', title: 'Set Up',       desc: 'Enter player names, pick leagues, and choose a difficulty.' },
  { emoji: '🔒', title: 'Get Your Role', desc: 'Each player secretly taps their name to see if they\'re a Crewmate or Imposter.' },
  { emoji: '🧠', title: 'Give Clues',   desc: 'Each player gives ONE vague sentence about the athlete. Don\'t make it too obvious!' },
  { emoji: '🗳️', title: 'Vote',         desc: 'Discuss and vote on who you think the impostor is.' },
  { emoji: '🎯', title: 'Reveal',       desc: 'Tap "Reveal" to unveil the impostor and the secret athlete.' },
];

export default function HowToPlayScreen({ darkMode, onBack }) {
  const bg   = darkMode ? 'bg-[#0a0f1e]' : 'bg-slate-100';
  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white'   : 'text-slate-900';
  const sub  = darkMode ? 'text-white/50' : 'text-slate-500';

  return (
    <div className={`min-h-screen ${bg} pb-10 overflow-y-auto`} style={{ overscrollBehavior: 'none' }}>
      <div className={`${darkMode ? 'bg-[#0a0f1e]' : 'bg-white'} px-5 safe-top pb-5 flex items-center gap-3`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-xl flex-shrink-0 select-none ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className={`text-xl font-black ${text}`}>How to Play</h1>
          <p className={`text-xs ${sub}`}>Ball Knowing Imposter</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 pt-4 space-y-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${card} rounded-2xl p-4 flex items-start gap-4`}
          >
            <div className="text-3xl w-12 flex-shrink-0 flex items-center justify-center">{step.emoji}</div>
            <div>
              <p className={`font-bold ${text}`}>{step.title}</p>
              <p className={`text-sm mt-0.5 leading-relaxed ${sub}`}>{step.desc}</p>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${card} rounded-2xl p-5 border-2 border-[#3b82f6]/30`}
        >
          <p className="text-[#3b82f6] font-black text-sm mb-2">💡 Pro Tips</p>
          <ul className={`text-sm space-y-1.5 ${sub}`}>
            <li>• Crewmates: give clues that prove knowledge but don't make it trivial</li>
            <li>• Impostors: listen carefully and give generic sports clues</li>
            <li>• If a hint is enabled, impostors know the sport league only</li>
            <li>• Harder difficulty = deeper roster = harder to fake knowledge</li>
          </ul>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="w-full py-4 rounded-2xl bg-[#3b82f6] text-white font-black text-base"
        >
          Let's Play!
        </motion.button>
      </div>
    </div>
  );
}