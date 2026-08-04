import React from 'react';

const Defs = ({ color }) => (
  <defs>
    <linearGradient id={`glassGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
      <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
    </linearGradient>
    <linearGradient id={`glassGradLight`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
      <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
    </linearGradient>
    <linearGradient id={`colorGrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={color} stopOpacity="0.8" />
      <stop offset="100%" stopColor={color} stopOpacity="0.2" />
    </linearGradient>
  </defs>
);

const svgStyle = { overflow: 'visible', filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' };

export const WindowIcon = ({ color = '#e05c5c', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
    <Defs color={color} />
    <rect x="6" y="8" width="36" height="32" rx="6" fill={`url(#colorGrad-${color.replace('#', '')})`} />
    <rect x="6" y="8" width="36" height="32" rx="6" fill="url(#glassGrad)" stroke="url(#glassGradLight)" strokeWidth="1.5" />
    <path d="M6 18H42" stroke="url(#glassGradLight)" strokeWidth="1.5" />
    <path d="M24 18V40" stroke="url(#glassGradLight)" strokeWidth="1.5" />
    <circle cx="12" cy="13" r="1.5" fill="rgba(255,255,255,0.8)" />
    <circle cx="17" cy="13" r="1.5" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export const VirusIcon = ({ color = '#e09a3f', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
    <Defs color={color} />
    <circle cx="24" cy="24" r="14" fill={`url(#colorGrad-${color.replace('#', '')})`} />
    <path d="M24 6V10M24 38V42M10 24H6M42 24H38M11 11L15 15M37 37L33 33M37 11L33 15M11 37L15 33" stroke="url(#glassGradLight)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="24" r="14" fill="url(#glassGrad)" stroke="url(#glassGradLight)" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.9)" />
    <circle cx="28" cy="26" r="2.5" fill="rgba(255,255,255,0.6)" />
    <circle cx="18" cy="28" r="1.5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const ShieldIcon = ({ color = '#5c7fe0', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
    <Defs color={color} />
    <path d="M24 4L8 10V22C8 31 14.5 39 24 44C33.5 39 40 31 40 22V10L24 4Z" fill={`url(#colorGrad-${color.replace('#', '')})`} />
    <path d="M24 4L8 10V22C8 31 14.5 39 24 44C33.5 39 40 31 40 22V10L24 4Z" fill="url(#glassGrad)" stroke="url(#glassGradLight)" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M24 4V44" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    <path d="M16 24L22 30L32 18" stroke="url(#glassGradLight)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BroomIcon = ({ color = '#3fbe8a', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
    <Defs color={color} />
    <path d="M34 14L22 26" stroke="url(#glassGradLight)" strokeWidth="4" strokeLinecap="round" />
    <path d="M12 40C12 40 8 32 14 26C20 20 28 24 28 24L12 40Z" fill={`url(#colorGrad-${color.replace('#', '')})`} />
    <path d="M12 40C12 40 8 32 14 26C20 20 28 24 28 24L12 40Z" fill="url(#glassGrad)" stroke="url(#glassGradLight)" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M22 26L16 32" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M25 28L18 35" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
