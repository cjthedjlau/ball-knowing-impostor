import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_KEY = 'bki_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="bg-[#131c2e] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl max-w-lg mx-auto">
            <p className="text-white/60 text-xs flex-1 leading-relaxed">
              This app uses cookies for advertising purposes.{' '}
              <a href="/PrivacyPolicy" className="text-[#3b82f6] underline">Learn more</a>
            </p>
            <button
              onClick={accept}
              className="bg-[#3b82f6] text-white text-xs font-black px-4 py-2 rounded-xl flex-shrink-0"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}