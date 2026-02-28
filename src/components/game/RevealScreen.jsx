import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Settings, ArrowLeft } from 'lucide-react';
import { playImpostorReveal, playSuccess } from '../lib/soundSystem';
import AthletePlaceholder from '../game/AthletePlaceholder';

const haptic = (pattern) => { try { navigator.vibrate?.(pattern || [30]); } catch {} };

const STAGES = ['suspense', 'reveal', 'athlete'];

export default function RevealScreen({ gameState, darkMode, onPlayAgain, onChangeSettings, onBack }) {
  const { playerNames, roles, athlete, impostorCount } = gameState;
  const [stage, setStage] = useState('suspense');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const adRef = React.useRef(null);

  const impostors = playerNames.filter(n => roles[n] === 'impostor');

  const bg   = darkMode ? 'bg-[#0a0f1e]' : 'bg-slate-100';
  const card = darkMode ? 'bg-[#131c2e]' : 'bg-white';
  const text = darkMode ? 'text-white'   : 'text-slate-900';
  const sub  = darkMode ? 'text-white/50' : 'text-slate-500';

  useEffect(() => {
    if (stage === 'suspense') {
      const t = setTimeout(() => {
        haptic([50, 100, 50, 100, 200]);
        playImpostorReveal(gameState.leagues || []);
        setStage('reveal');
      }, 2200);
      return () => clearTimeout(t);
    }
    if (stage === 'reveal') {
      const t = setTimeout(() => { playSuccess(); setStage('athlete'); }, 2800);
      return () => clearTimeout(t);
    }
    if (stage === 'athlete') {
      const t = setTimeout(() => {
        setShowAd(true);
        try {
          if (adRef.current && window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch {}
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <div className={`min-h-screen ${bg} flex flex-col overflow-hidden`} style={{ overscrollBehavior: 'none', touchAction: 'pan-x pan-y' }}>
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
              <p className={`text-sm mb-5 ${sub}`}>This will return to setup and reset the game.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className={`flex-1 py-3 rounded-2xl font-bold text-sm select-none ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>Cancel</button>
                <button onClick={() => { setShowConfirm(false); onBack(); }} className="flex-1 py-3 rounded-2xl font-bold text-sm bg-red-500 text-white select-none">Quit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <div className="px-5 safe-top pb-2 flex items-center">
        <button onClick={() => setShowConfirm(true)} className={`p-2 rounded-xl select-none ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <AnimatePresence mode="wait">
        {stage === 'suspense' && (
          <motion.div
            key="suspense"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center w-full flex flex-col items-center"
          >
            {/* Spotlight expanding from center */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.10) 0%, transparent 70%)' }}
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-7xl mb-6"
            >
              🕵️
            </motion.div>
            <p className={`text-2xl font-black ${text}`}>The imposter was...</p>
            <motion.div className="flex gap-2 justify-center mt-4">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-[#3b82f6]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-6"
            >
              🎯
            </motion.div>
            <div className={`${card} rounded-3xl px-8 py-6 shadow-xl`}>
              <p className={`text-xs font-bold tracking-widest uppercase mb-3 text-red-400`}>
                {impostorCount > 1 ? 'The Imposters Were' : 'The Imposter Was'}
              </p>
              {impostors.map(name => (
                <motion.p
                  key={name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-4xl font-black ${text} leading-tight`}
                >
                  {name}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {stage === 'athlete' && (
          <motion.div
            key="athlete"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            {/* Impostors */}
            <div className={`${card} rounded-3xl p-4 mb-4 text-center`}>
              <p className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">
                  {impostorCount > 1 ? 'The Imposters' : 'The Imposter'}
              </p>
              <p className={`text-xl font-black ${text}`}>{impostors.join(' & ')}</p>
            </div>

            {/* Athlete card */}
            <div className={`${card} rounded-3xl overflow-hidden shadow-2xl`}>
              {(() => {
                const [imgError, setImgError] = React.useState(false);
                const showPhoto = athlete?.photoUrl && !imgError;
                return showPhoto ? (
                  <div className="relative">
                    {!imgLoaded && (
                      <div className="w-full h-72 flex items-center justify-center bg-gradient-to-br from-[#0d1b35] to-[#0a0f1e]">
                        <div className="w-12 h-12 rounded-full border-4 border-[#1e3a6e] border-t-[#3b82f6] animate-spin" />
                      </div>
                    )}
                    <img
                      src={athlete.photoUrl}
                      alt={athlete?.name}
                      className={`w-full h-72 object-cover object-top ${imgLoaded ? 'block' : 'hidden'}`}
                      onLoad={() => setImgLoaded(true)}
                      onError={() => { setImgError(true); setImgLoaded(true); }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {gameState.difficulty === 'legends' && (
                        <span className="bg-yellow-500 text-black text-xs font-black px-2.5 py-1 rounded-full">⭐ Legend</span>
                      )}
                      <span className="bg-[#3b82f6] text-white text-xs font-black px-3 py-1.5 rounded-full">{athlete?.league}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">The Secret Athlete</p>
                      <p className="text-white font-black text-2xl leading-tight">{athlete?.name}</p>
                      <p className="text-white/70 text-sm">{athlete?.team}</p>
                      {athlete?.position && <p className="text-white/50 text-xs mt-0.5">{athlete.position}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <AthletePlaceholder name={athlete?.name} className="w-full h-48" />
                    <div className="p-4 bg-[#0a0f1e]">
                      <p className="text-white font-black text-xl leading-tight">{athlete?.name}</p>
                      <p className="text-white/60 text-sm">{athlete?.team}</p>
                      {athlete?.position && <p className="text-white/40 text-xs mt-0.5">{athlete.position}</p>}
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      {gameState.difficulty === 'legends' && (
                        <span className="bg-yellow-500 text-black text-xs font-black px-2.5 py-1 rounded-full">⭐ Legend</span>
                      )}
                      <span className="bg-[#3b82f6] text-white text-xs font-black px-3 py-1.5 rounded-full">{athlete?.league}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Ad unit — only after all animations, clearly labeled */}
            {showAd && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-center text-xs text-slate-400 mb-2 tracking-wide">Advertisement</p>
                <div className="overflow-hidden rounded-2xl">
                  <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-1818161492484327"
                    data-ad-slot="auto"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 space-y-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { haptic([30]); onPlayAgain(); }}
                className="w-full py-4 rounded-2xl bg-[#3b82f6] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <RotateCcw size={18} /> Play Again
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { haptic([20]); onChangeSettings(); }}
                className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 ${darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-200 text-slate-600'}`}
              >
                <Settings size={18} /> Change Settings
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}