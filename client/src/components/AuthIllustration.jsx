import React from 'react';

const AuthIllustration = () => {
  return (
    <div className="auth-illustration-container d-flex align-items-center justify-content-center p-4">
      <svg
        viewBox="0 0 600 500"
        className="w-100"
        style={{ maxHeight: '420px' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="300" cy="250" r="180" fill="#F0F4FD" />
        <path d="M120 340C90 320 80 250 110 200C140 150 200 160 220 200C240 240 220 320 180 340C150 355 130 350 120 340Z" fill="#D6E4FE" opacity="0.7"/>
        <path d="M480 320C510 300 520 230 490 180C460 130 400 140 380 180C360 220 380 300 420 320C450 335 470 330 480 320Z" fill="#E8EEFC" opacity="0.8"/>
        
        {/* Computer Screen */}
        <rect x="140" y="140" width="320" height="230" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="6" />
        <rect x="140" y="340" width="320" height="30" fill="#F1F5F9" />
        <circle cx="300" cy="355" r="5" fill="#3B82F6" />
        <rect x="270" y="370" width="60" height="35" fill="#CBD5E1" />
        <rect x="220" y="405" width="160" height="8" rx="4" fill="#3B82F6" />
        
        {/* Drawing Tablet Pad inside screen */}
        <rect x="220" y="180" width="160" height="150" rx="6" fill="#1E293B" transform="rotate(-6 220 180)" />
        <circle cx="320" cy="275" r="26" fill="#EF4444" opacity="0.9" />
        <path d="M300 265 H340 M298 273 H342 M302 281 H338" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        
        {/* Stylus / Pen */}
        <rect x="340" y="110" width="20" height="130" rx="10" fill="#EF4444" transform="rotate(28 340 110)" />
        <polygon points="300,230 312,216 322,228" fill="#1E293B" />
        <path d="M346 120 L356 128 M352 135 L362 143 M358 150 L368 158" stroke="#FFFFFF" strokeWidth="3" />

        {/* Hand 1 holding pen */}
        <path d="M330 220 C340 190 380 200 400 230 L450 250 L430 290 L360 260 Z" fill="#FED7AA" />
        <rect x="420" y="240" width="45" height="50" rx="4" fill="#2563EB" />

        {/* Hand 2 on left */}
        <path d="M160 290 L230 240 C250 225 270 250 250 270 L200 320 Z" fill="#FED7AA" />
        <rect x="150" y="275" width="45" height="50" rx="4" fill="#2563EB" />

        {/* Decorative sparkles */}
        <path d="M280 130 L285 140 L280 150 L275 140 Z" fill="#1E293B" />
        <path d="M420 120 L424 128 L420 136 L416 128 Z" fill="#2563EB" />
      </svg>
    </div>
  );
};

export default AuthIllustration;