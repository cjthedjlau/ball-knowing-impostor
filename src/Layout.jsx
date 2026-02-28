import React from 'react';
import CookieConsent from './components/game/CookieConsent';
import ErrorBoundary from './components/game/ErrorBoundary';

export default function Layout({ children }) {
  React.useEffect(() => {
    if (!document.querySelector('script[src*="adsbygoogle"]')) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1818161492484327';
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        html, body {
          overscroll-behavior: none;
          overscroll-behavior-y: contain;
          overflow: hidden;
          height: 100%;
        }
        #root {
          height: 100%;
          overflow-y: auto;
          overscroll-behavior: none;
        }
        @media (max-width: 640px) { html { font-size: 16px; } }
        /* iOS safe area meta */
        .safe-top    { padding-top: max(1.25rem, env(safe-area-inset-top)); }
        .safe-bottom { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
        button, [role="button"] { user-select: none; }
      `}</style>
      {children}
      <CookieConsent />
    </div>
  );
}