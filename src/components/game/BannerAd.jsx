import React, { useEffect, useRef, useState } from 'react';
import { createBannerIns, injectAdScript } from '../lib/adManager';

export default function BannerAd({ darkMode }) {
  const insRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      injectAdScript();
      const { adClient, adSlot, npa } = createBannerIns();

      if (insRef.current) {
        insRef.current.setAttribute('data-ad-client', adClient);
        insRef.current.setAttribute('data-ad-slot', adSlot);
        insRef.current.setAttribute('data-ad-format', 'auto');
        insRef.current.setAttribute('data-full-width-responsive', 'true');
        if (npa) insRef.current.setAttribute('data-npa', '1');

        (window.adsbygoogle = window.adsbygoogle || []).push({});

        // Hide if no fill after 3 seconds
        const t = setTimeout(() => {
          const el = insRef.current;
          if (el && (!el.offsetHeight || el.offsetHeight < 10)) {
            setHidden(true);
          }
        }, 3000);
        return () => clearTimeout(t);
      }
    } catch (e) {
      setHidden(true);
    }
  }, []);

  if (hidden) return null;

  return (
    <div className="mt-6">
      <p className={`text-xs text-center mb-1 ${darkMode ? 'text-white/25' : 'text-slate-400'}`}>
        Advertisement
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
      />
    </div>
  );
}