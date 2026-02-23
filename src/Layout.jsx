import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        body { overscroll-behavior: none; }
        @media (max-width: 640px) { html { font-size: 16px; } }
      `}</style>
      {children}
    </div>
  );
}