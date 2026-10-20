import React from 'react';

/**
 * Minimalist transparent vector illustration of an ICT student
 * working in Windows Sandbox. Designed to blend seamlessly into
 * dark backdrops with zero square container or opaque background.
 */
export const StudentVectorIllustration = ({ className = '', style = {} }) => {
  return (
    <svg
      viewBox="0 0 540 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', ...style }}
      aria-label="Illustration of a student safely analyzing malware in Windows Sandbox"
      role="img"
    >
      <defs>
        {/* Soft Violet Gradient */}
        <linearGradient id="sv_purple_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Shield Gradient */}
        <linearGradient id="sv_shield_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>

        {/* Subtle Shield Glow */}
        <filter id="sv_soft_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Laptop Screen Glow */}
        <linearGradient id="sv_screen_grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* ===================================================
          BACKGROUND AMBIENT ACCENTS (Transparent, subtle)
          =================================================== */}
      {/* Decorative dashed security orbit */}
      <circle cx="380" cy="140" r="95" stroke="#7c3aed" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx="380" cy="140" r="130" stroke="#a855f7" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 8" />

      {/* Little tech accent nodes */}
      <circle cx="380" cy="45" r="3.5" fill="#a78bfa" fillOpacity="0.7" />
      <circle cx="475" cy="140" r="3" fill="#38bdf8" fillOpacity="0.8" />
      <circle cx="285" cy="140" r="2.5" fill="#c084fc" fillOpacity="0.6" />
      <circle cx="430" cy="220" r="3" fill="#a78bfa" fillOpacity="0.5" />

      {/* ===================================================
          FLOATING WINDOWS SANDBOX SHIELD
          =================================================== */}
      <g filter="url(#sv_soft_glow)">
        {/* Shield outer contour */}
        <path
          d="M380 75 L435 95 C435 150 380 185 380 195 C380 185 325 150 325 95 Z"
          fill="url(#sv_shield_grad)"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Shield Layer */}
        <path
          d="M380 90 L420 105 C420 145 380 172 380 180 C380 172 340 145 340 105 Z"
          stroke="#c084fc"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Minimalist Lock Symbol */}
        <rect x="368" y="128" width="24" height="20" rx="4" fill="#a78bfa" fillOpacity="0.9" />
        <path
          d="M373 128 V120 C373 115 387 115 387 120 V128"
          stroke="#f8fafc"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="380" cy="137" r="2" fill="#1e1b4b" />
        <path d="M380 139 V143" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Floating sandbox badge chip */}
      <g transform="translate(420, 80)">
        <rect width="64" height="22" rx="11" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />
        <circle cx="11" cy="11" r="3" fill="#34d399" />
        <text x="20" y="15" fill="#e2e8f0" fontSize="9.5" fontWeight="600" fontFamily="sans-serif">SANDBOX</text>
      </g>

      {/* ===================================================
          FURNITURE: DESK & CHAIR (Minimalist clean lines)
          =================================================== */}
      {/* Desk surface */}
      <path
        d="M170 280 L490 280"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Desk leg */}
      <path
        d="M450 280 L450 395"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M435 395 L465 395"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Modern Desk Chair */}
      <path
        d="M95 240 Q105 180 120 180 Q135 180 135 240 L135 320"
        stroke="#334155"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M90 320 L155 320"
        stroke="#334155"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Chair Stem & 5-star base */}
      <path d="M125 320 L125 365" stroke="#334155" strokeWidth="3" />
      <path d="M100 380 L125 365 L150 380" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="98" cy="382" r="3" fill="#64748b" />
      <circle cx="152" cy="382" r="3" fill="#64748b" />

      {/* ===================================================
          LAPTOP (Minimalist & glowing screen)
          =================================================== */}
      {/* Laptop base */}
      <path d="M260 280 L350 280" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      {/* Laptop screen lid */}
      <path d="M305 220 L355 220 L345 280 L295 280 Z" fill="url(#sv_screen_grad)" stroke="#a78bfa" strokeWidth="1.5" />
      {/* Code lines on screen */}
      <line x1="308" y1="232" x2="335" y2="232" stroke="#e0e7ff" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="308" y1="240" x2="342" y2="240" stroke="#c084fc" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="308" y1="248" x2="326" y2="248" stroke="#38bdf8" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Coffee Mug on desk */}
      <rect x="365" y="260" width="12" height="18" rx="3" fill="#1e2230" stroke="#64748b" strokeWidth="1.5" />
      <path d="M377 264 C381 264 381 274 377 274" stroke="#64748b" strokeWidth="1.5" fill="none" />
      {/* Steam line */}
      <path d="M371 254 Q373 250 371 246" stroke="#94a3b8" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" fill="none" />

      {/* Small Minimalist Succulent Plant */}
      <path d="M420 280 L423 268 L437 268 L440 280 Z" fill="#1e2230" stroke="#475569" strokeWidth="1.5" />
      <path d="M430 268 Q430 252 430 250" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <path d="M430 260 Q422 254 424 248" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M430 262 Q438 256 436 250" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />

      {/* ===================================================
          STUDENT CHARACTER (Minimalist flat vector)
          =================================================== */}
      {/* Legs & Pants (Dark slate / deep indigo) */}
      <path
        d="M145 285 L180 295 L225 365 L210 375 L170 305 L140 295 Z"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <path
        d="M135 280 L185 285 L260 360 L245 372 L180 298 L130 290 Z"
        fill="#334155"
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Shoes / Sneakers */}
      <path
        d="M238 368 L265 368 C272 368 274 375 270 378 L240 378 Z"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <path
        d="M205 370 L232 370 C238 370 240 377 236 380 L206 380 Z"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Torso / Hoodie (Lavender / Purple) */}
      <path
        d="M125 195 C145 190 170 195 185 210 L195 285 C175 290 145 290 130 285 Z"
        fill="#8b5cf6"
      />
      {/* Hoodie back volume */}
      <path
        d="M120 195 C115 215 125 245 135 255 L130 285 L120 280 C110 240 108 210 120 195 Z"
        fill="#7c3aed"
      />

      {/* Arms & Hands typing */}
      {/* Left arm */}
      <path
        d="M165 210 Q210 230 240 268 L268 272"
        stroke="#8b5cf6"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right arm & hand */}
      <path
        d="M175 215 Q220 235 255 268 L285 275"
        stroke="#a78bfa"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hands */}
      <circle cx="272" cy="273" r="5" fill="#fbcfe8" />
      <circle cx="288" cy="276" r="5" fill="#fbcfe8" />

      {/* Student Head & Hair (Modern minimal silhouette) */}
      {/* Neck */}
      <path d="M152 180 L160 198 L168 198 L162 180 Z" fill="#fbcfe8" />
      {/* Face profile/3-quarter */}
      <path
        d="M152 150 C152 140 168 140 174 150 C178 158 176 172 165 178 C155 176 150 165 152 150 Z"
        fill="#fbcfe8"
      />
      {/* Minimalist stylish hair */}
      <path
        d="M146 152 C146 132 164 128 178 135 C184 140 184 150 178 155 C174 146 166 142 158 146 C152 150 150 156 146 152 Z"
        fill="#1e1b4b"
      />
      {/* Minimalist glasses frame */}
      <rect x="164" y="152" width="10" height="7" rx="2" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
      <line x1="158" y1="155" x2="164" y2="155" stroke="#38bdf8" strokeWidth="1.2" />

      {/* Floating subtle data stream line */}
      <path
        d="M320 215 Q340 190 360 185"
        stroke="#38bdf8"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeDasharray="2 4"
        fill="none"
      />
    </svg>
  );
};

export const StudentAvatarIcon = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="23" fill="#13161e" stroke="#7c3aed" strokeWidth="1.5" />
      {/* Shield backdrop */}
      <path
        d="M24 10 L33 13.5 C33 22 24 27.5 24 29 C24 27.5 15 22 15 13.5 Z"
        fill="#7c3aed"
        fillOpacity="0.25"
        stroke="#a855f7"
        strokeWidth="1.2"
      />
      {/* Student Head */}
      <circle cx="24" cy="21" r="5" fill="#fbcfe8" />
      <path d="M20 19 C20 15 28 15 28 19 C28 20 26 21 24 21 Z" fill="#1e1b4b" />
      {/* Student Body */}
      <path
        d="M16 34 C16 29 20 27 24 27 C28 27 32 29 32 34 Z"
        fill="#8b5cf6"
      />
      {/* Laptop Accent */}
      <rect x="20" y="32" width="8" height="5" rx="1" fill="#38bdf8" fillOpacity="0.8" />
    </svg>
  );
};

export default StudentVectorIllustration;
