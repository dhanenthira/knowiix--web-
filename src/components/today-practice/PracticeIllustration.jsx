import React from 'react';

/**
 * PracticeIllustration - Flat modern vector illustration matching the reference design:
 * Student with glasses at desk, white laptop, phone in hand, floating analytics pie chart,
 * folder, coffee tumbler, potted plant, and decorative sparkles.
 */
export default function PracticeIllustration({ className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 520 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`practice-illustration-svg ${className}`}
      style={{ width: '100%', height: 'auto', maxHeight: '320px', ...style }}
      aria-label="Student practicing and learning"
    >
      <defs>
        {/* Soft background glow */}
        <radialGradient id="deskGlow" cx="60%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DCEBFE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EBF5FF" stopOpacity="0" />
        </radialGradient>
        
        {/* Chart pie gradient */}
        <linearGradient id="pieBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="piePink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Laptop gradient */}
        <linearGradient id="laptopGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>

        {/* Window shadow */}
        <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1E293B" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Background soft ambient blob */}
      <ellipse cx="360" cy="170" rx="150" ry="110" fill="url(#deskGlow)" />
      
      {/* Background Soft Floating Clouds */}
      <path
        d="M260 70 C280 50, 320 50, 340 70 C360 60, 400 70, 410 95 C430 100, 440 130, 430 150 C410 180, 300 190, 260 170 C230 155, 230 110, 260 70 Z"
        fill="#E0EEFD"
        opacity="0.6"
      />

      {/* Decorative Sparkles & Shapes */}
      {/* Gear top left */}
      <g transform="translate(265, 55)" stroke="#94A3B8" strokeWidth="2.5" fill="none" opacity="0.4">
        <circle cx="12" cy="12" r="6" />
        <path d="M12 2 V6 M12 18 V22 M2 12 H6 M18 12 H22 M5 5 L8 8 M16 16 L19 19 M5 19 L8 16 M16 8 L19 5" strokeLinecap="round" />
      </g>
      
      {/* Sparkles */}
      <path d="M275 140 L280 145 L275 150 L270 145 Z" fill="#F43F5E" opacity="0.75" />
      <path d="M430 160 L434 164 L430 168 L426 164 Z" fill="#F59E0B" opacity="0.85" />
      <circle cx="288" cy="170" r="3" fill="#FBBF24" />
      <circle cx="295" cy="120" r="2.5" fill="#38BDF8" />
      <circle cx="438" cy="130" r="2.5" fill="#EC4899" />
      <path d="M445 145 L450 145 M447.5 142.5 L447.5 147.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />

      {/* Floating Card: Mountain Photo */}
      <g transform="translate(260, 195)" filter="url(#cardShadow)">
        <rect width="64" height="48" rx="6" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Sky */}
        <rect x="2" y="2" width="60" height="44" rx="5" fill="#E2E8F0" />
        {/* Mountain 1 */}
        <polygon points="12,46 28,26 44,46" fill="#475569" />
        <polygon points="28,26 34,34 30,36 28,34 26,36 24,32" fill="#FFFFFF" />
        {/* Mountain 2 */}
        <polygon points="32,46 45,30 58,46" fill="#334155" />
        <polygon points="45,30 50,36 47,38 45,36 43,38" fill="#FFFFFF" />
        {/* Sun */}
        <circle cx="48" cy="14" r="4" fill="#F59E0B" />
      </g>

      {/* Floating Analytics Chart Window */}
      <g transform="translate(300, 50)" filter="url(#cardShadow)">
        <rect width="96" height="74" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Window Top Bar */}
        <rect x="1" y="1" width="94" height="14" rx="7" fill="#F8FAFC" />
        <circle cx="8" cy="8" r="2" fill="#FDA4AF" />
        <circle cx="14" cy="8" r="2" fill="#FDE047" />
        <circle cx="20" cy="8" r="2" fill="#86EFAC" />
        
        {/* Pie Chart */}
        <g transform="translate(32, 45)">
          <circle cx="0" cy="0" r="18" fill="url(#pieBlue)" />
          {/* Slice Pink */}
          <path d="M0 0 L18 0 A18 18 0 0 1 -4 17.5 Z" fill="url(#piePink)" />
          {/* Inner cutout */}
          <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
        </g>

        {/* Stats bars */}
        <rect x="58" y="28" width="28" height="4" rx="2" fill="#93C5FD" />
        <rect x="58" y="36" width="22" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="58" y="43" width="26" height="3" rx="1.5" fill="#CBD5E1" />
        <rect x="58" y="50" width="16" height="3" rx="1.5" fill="#CBD5E1" />
      </g>

      {/* Floating Yellow Folder */}
      <g transform="translate(400, 85)" filter="url(#cardShadow)">
        <path d="M4 8 L18 8 L24 14 L42 14 C44.2 14, 46 15.8, 46 18 L46 40 C46 42.2, 44.2 44, 42 44 L4 44 C1.8 44, 0 42.2, 0 40 L0 12 C0 9.8, 1.8 8, 4 8 Z" fill="#F59E0B" />
        <path d="M0 16 L46 16 L46 40 C46 42.2, 44.2 44, 42 44 L4 44 C1.8 44, 0 42.2, 0 40 Z" fill="#FBBF24" />
        <rect x="10" y="24" width="16" height="3" rx="1.5" fill="#F59E0B" opacity="0.6" />
      </g>

      {/* Desk Surface Baseline */}
      <line x1="250" y1="280" x2="495" y2="280" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

      {/* Chair Back */}
      <rect x="365" y="160" width="46" height="85" rx="14" fill="#E2E8F0" />
      <rect x="372" y="168" width="32" height="70" rx="10" fill="#CBD5E1" opacity="0.6" />

      {/* Character (Student / Courtney) */}
      <g id="character-group">
        {/* Hair Back */}
        <path d="M352 100 C345 80, 375 60, 395 70 C410 75, 415 95, 410 115 C400 125, 360 120, 352 100 Z" fill="#0F172A" />

        {/* Neck */}
        <rect x="370" y="150" width="16" height="20" rx="6" fill="#FCD34D" />

        {/* Head / Face */}
        <ellipse cx="378" cy="130" rx="18" ry="22" fill="#FDE68A" />

        {/* Hair front & curls */}
        <path d="M362 120 C360 100, 370 85, 390 85 C405 85, 410 98, 408 112 C402 105, 385 106, 378 112 C370 118, 365 116, 362 120 Z" fill="#0F172A" />
        {/* Sideburns */}
        <path d="M362 122 Q360 135 365 140" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Glasses */}
        <rect x="364" y="122" width="14" height="12" rx="4" fill="none" stroke="#EF4444" strokeWidth="2.5" />
        <rect x="382" y="122" width="14" height="12" rx="4" fill="none" stroke="#EF4444" strokeWidth="2.5" />
        <line x1="378" y1="127" x2="382" y2="127" stroke="#EF4444" strokeWidth="2.5" />
        
        {/* Eyes (Smiling curves) */}
        <path d="M368 128 Q371 125 374 128" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M386 128 Q389 125 392 128" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <path d="M379 133 Q382 136 379 138" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Smile & Beard/Stubble */}
        <path d="M373 142 Q379 148 385 142" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M368 138 C366 150, 392 150, 390 138" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="2 2" />

        {/* Torso / Purple Patterned T-Shirt */}
        <path
          d="M352 170 C345 178, 335 195, 332 230 L425 230 C422 195, 412 178, 405 170 C395 174, 362 174, 352 170 Z"
          fill="#8B5CF6"
        />
        {/* Shirt Patterns (x's matching the illustration) */}
        <g stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.65">
          {/* Row 1 */}
          <path d="M360 185 L364 189 M364 185 L360 189" />
          <path d="M372 185 L376 189 M376 185 L372 189" />
          <path d="M384 185 L388 189 M388 185 L384 189" />
          <path d="M396 185 L400 189 M400 185 L396 189" />
          {/* Row 2 */}
          <path d="M356 198 L360 202 M360 198 L356 202" />
          <path d="M368 198 L372 202 M372 198 L368 202" />
          <path d="M380 198 L384 202 M384 198 L380 202" />
          <path d="M392 198 L396 202 M396 198 L392 202" />
          <path d="M404 198 L408 202 M408 198 L404 202" />
          {/* Row 3 */}
          <path d="M362 212 L366 216 M366 212 L362 216" />
          <path d="M374 212 L378 216 M378 212 L374 216" />
          <path d="M386 212 L390 216 M390 212 L386 216" />
          <path d="M398 212 L402 216 M402 212 L398 216" />
        </g>

        {/* Left Arm holding phone */}
        {/* Sleeve */}
        <path d="M346 172 C340 182, 335 198, 332 208 L348 210 C350 200, 355 186, 356 178 Z" fill="#7C3AED" />
        {/* Arm going up */}
        <path d="M334 206 Q320 200 318 175" stroke="#FDE68A" strokeWidth="12" strokeLinecap="round" fill="none" />
        {/* Hand */}
        <ellipse cx="316" cy="170" rx="6" ry="8" fill="#FDE68A" />

        {/* Smartphone */}
        <rect x="312" y="150" width="12" height="22" rx="3" fill="#0F172A" />
        <rect x="313.5" y="153" width="9" height="15" rx="1.5" fill="#38BDF8" />

        {/* Right Arm on laptop */}
        {/* Sleeve */}
        <path d="M405 170 C412 180, 420 196, 424 208 L408 210 C406 200, 400 186, 396 178 Z" fill="#7C3AED" />
        {/* Forearm extending towards laptop */}
        <path d="M410 208 Q395 240 375 258" stroke="#FDE68A" strokeWidth="12" strokeLinecap="round" fill="none" />
        {/* Hand on keyboard */}
        <ellipse cx="370" cy="262" rx="8" ry="5" fill="#FDE68A" />
      </g>

      {/* Modern White Laptop */}
      <g id="laptop-group" filter="url(#cardShadow)">
        {/* Screen */}
        <path d="M308 208 L356 210 L360 274 L304 274 Z" fill="url(#laptopGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Apple/Knowiix round emblem on back of screen */}
        <circle cx="332" cy="242" r="5" fill="#94A3B8" opacity="0.4" />
        {/* Base / Keyboard side */}
        <polygon points="300,274 395,274 385,280 292,280" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
      </g>

      {/* Coffee Tumbler with Lid */}
      <g transform="translate(424, 236)">
        {/* Cup body */}
        <path d="M4 14 L7 44 C7.2 46, 8.8 47.5, 11 47.5 L19 47.5 C21.2 47.5, 22.8 46, 23 44 L26 14 Z" fill="#F472B6" />
        {/* Sleeve */}
        <path d="M5.5 22 L6.5 34 L23.5 34 L24.5 22 Z" fill="#FFFFFF" opacity="0.9" />
        {/* Coffee Bean or heart */}
        <circle cx="15" cy="28" r="2.5" fill="#EC4899" />
        {/* Lid */}
        <rect x="2" y="10" width="26" height="5" rx="2" fill="#BE185D" />
        <rect x="12" y="7" width="6" height="4" rx="1.5" fill="#BE185D" />
      </g>

      {/* Potted Plant */}
      <g transform="translate(444, 218)">
        {/* Leaves */}
        <path d="M12 28 Q4 10 16 0 Q20 12 14 28" fill="#38BDF8" />
        <path d="M15 28 Q24 6 30 2 Q28 16 18 28" fill="#0284C7" />
        <path d="M10 30 Q-2 18 2 12 Q8 20 12 30" fill="#0EA5E9" />
        {/* Pot */}
        <polygon points="4,34 8,62 22,62 26,34" fill="#C084FC" />
        <rect x="2" y="30" width="26" height="5" rx="2" fill="#9333EA" />
      </g>
    </svg>
  );
}
