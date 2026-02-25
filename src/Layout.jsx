import React from 'react';

export default function Layout({ children }) {
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
        @supports (padding-top: env(safe-area-inset-top)) {
          .safe-top    { padding-top: env(safe-area-inset-top); }
          .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        }
      `}</style>
      {children}
    </div>
  );
}