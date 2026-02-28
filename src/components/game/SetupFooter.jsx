import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AboutModal from './AboutModal';

export default function SetupFooter({ darkMode }) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-4 py-4 mt-2">
        <Link to={createPageUrl('PrivacyPolicy')} className={`text-xs transition-colors ${darkMode ? 'text-white/25 hover:text-white/50' : 'text-slate-400 hover:text-slate-600'}`}>
          Privacy Policy
        </Link>
        <span className={`text-xs ${darkMode ? 'text-white/15' : 'text-slate-300'}`}>·</span>
        <Link to={createPageUrl('TermsOfService')} className={`text-xs transition-colors ${darkMode ? 'text-white/25 hover:text-white/50' : 'text-slate-400 hover:text-slate-600'}`}>
          Terms of Service
        </Link>
        <span className={`text-xs ${darkMode ? 'text-white/15' : 'text-slate-300'}`}>·</span>
        <button
          onClick={() => setShowAbout(true)}
          className={`text-xs transition-colors ${darkMode ? 'text-white/25 hover:text-white/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          About
        </button>
      </div>

      {showAbout && <AboutModal darkMode={darkMode} onClose={() => setShowAbout(false)} />}
    </>
  );
}