import React from 'react';

// Shows navy background with athlete initials when image fails or is unavailable
export default function AthletePlaceholder({ name = '', className = '', style = {} }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-[#1e3a6e] to-[#0a0f1e] ${className}`}
      style={style}
    >
      <span className="text-white font-black text-4xl select-none">{initials || '?'}</span>
    </div>
  );
}