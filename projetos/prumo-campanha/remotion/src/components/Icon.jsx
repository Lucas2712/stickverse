import React from 'react';
// Ícones de traço genéricos (desenhados para este projeto)
const P = {
  in: <><path d="M17 7 7 17" /><path d="M7 9v8h8" /></>,
  doc: <><path d="M6 3h9l3 3v15H6z" /><path d="M9 10h6M9 14h6M9 18h3" /></>,
  card: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18M7 15h3" /></>,
  house: <><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-5h4v5" /></>,
  bag: <><rect x="3" y="8" width="18" height="12" rx="2.5" /><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" /><path d="M3 13h18" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  cart: <><path d="M3 4h2l2.2 11h10.6L20 8H6.2" /><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></>,
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6z" />,
  pill: <><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)" /><path d="m10 8 4 8" transform="rotate(-35 12 12)" /></>,
  laptop: <><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2.5 18.5h19" /></>,
  dumbbell: <><path d="M6 8v8M18 8v8M3.5 10v4M20.5 10v4M6 12h12" /></>,
  home2: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9v11h13V9" /></>,
  grid: <><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 9h18M3 14h18M9 4v16M15 4v16" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
};
export const Icon = ({ name, size = 48, color = 'currentColor', stroke = 2.2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" style={style}>{P[name]}</svg>
);
