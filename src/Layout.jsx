import React from 'react';
import CookieConsent from './components/game/CookieConsent';
import ErrorBoundary from './components/game/ErrorBoundary';

export default function Layout({ children }) {

  // Suppress console warnings in production (but keep errors)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        // Only suppress known safe warnings (AdSense, iOS quirks)
        const msg = String(args[0]);
        if (msg.includes('adsbygoogle') || msg.includes('WebKit') || msg.includes('Passive event')) return;
        originalWarn.apply(console, args);
      };
    }
  }, []);

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen overflow-x-hidden"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          WebkitFontSmoothing: 'antialiased',
          WebkitTextSizeAdjust: '100%',
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
          .safe-top    { padding-top: max(1.25rem, env(safe-area-inset-top)); }
          .safe-bottom { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
          button, [role="button"] { user-select: none; }
        `}</style>
        {children}
        <CookieConsent />
      </div>
    </ErrorBoundary>
  );
}