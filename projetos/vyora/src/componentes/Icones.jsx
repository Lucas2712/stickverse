// VYORA · ícones de traço próprios (24×24, traço arredondado)
import React from "react";

const S = ({tam = 48, cor = "currentColor", esp = 1.9, children}) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={esp} strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: 0}}>
    {children}
  </svg>
);

export const IcVoo = (a) => (
  <S {...a}>
    <path d="M10.5 13.5 3.6 11.2l1.1-1.4 6.9.7 4.6-5c1-1.1 2.6-1.4 3.4-.6.8.8.5 2.4-.6 3.4l-5 4.6.7 6.9-1.4 1.1-2.3-6.9Z" />
    <path d="m7.4 16.6-2.6.6.6-2.6" />
  </S>
);
export const IcCama = (a) => (
  <S {...a}>
    <path d="M3 18v-8M3 15h18M21 18v-5.2A2.8 2.8 0 0 0 18.2 10H11v5" />
    <circle cx="7" cy="11.6" r="1.7" />
  </S>
);
export const IcCarro = (a) => (
  <S {...a}>
    <path d="M4 16.5v-3.2l1.9-4.6A2 2 0 0 1 7.8 7.5h8.4a2 2 0 0 1 1.9 1.2l1.9 4.6v3.2" />
    <path d="M3.5 13.3h17M4 16.5h16M6.3 16.5v1.7M17.7 16.5v1.7" />
    <circle cx="7.6" cy="14.9" r=".5" />
    <circle cx="16.4" cy="14.9" r=".5" />
  </S>
);
export const IcEscudo = (a) => (
  <S {...a}>
    <path d="M12 3.2 5 5.8v5.6c0 4.3 2.9 7.6 7 9.4 4.1-1.8 7-5.1 7-9.4V5.8l-7-2.6Z" />
    <path d="m9 12 2.2 2.2L15.2 10" />
  </S>
);
export const IcBrilho = (a) => (
  <S {...a}>
    <path d="M11 4.5c.5 3.6 2 5.1 5.6 5.6-3.6.5-5.1 2-5.6 5.6-.5-3.6-2-5.1-5.6-5.6 3.6-.5 5.1-2 5.6-5.6Z" />
    <path d="M18 14.5c.2 1.7.9 2.4 2.6 2.6-1.7.2-2.4.9-2.6 2.6-.2-1.7-.9-2.4-2.6-2.6 1.7-.2 2.4-.9 2.6-2.6Z" />
  </S>
);
export const IcCheck = (a) => (
  <S esp={2.6} {...a}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </S>
);
export const IcSeta = (a) => (
  <S esp={2.4} {...a}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
);
export const IcCalendario = (a) => (
  <S {...a}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </S>
);
export const IcPessoa = (a) => (
  <S {...a}>
    <circle cx="12" cy="8.2" r="3.6" />
    <path d="M5 20c.6-3.8 3.3-5.8 7-5.8s6.4 2 7 5.8" />
  </S>
);
export const IcSol = (a) => (
  <S {...a}>
    <circle cx="12" cy="12" r="3.8" />
    <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" />
  </S>
);
export const IcJanela = (a) => (
  <S {...a}>
    <rect x="6.5" y="3.5" width="11" height="17" rx="5.5" />
    <path d="M6.5 11h11" />
  </S>
);
export const IcPin = (a) => (
  <S {...a}>
    <path d="M12 21c4-4.2 6.5-7.4 6.5-10.6A6.5 6.5 0 0 0 5.500 10.400C5.500 13.600 8 16.800 12 21Z" />
    <circle cx="12" cy="10.2" r="2.3" />
  </S>
);
export const IcCasa = (a) => (
  <S {...a}>
    <path d="m4 11 8-6.5 8 6.500M6 9.800V19.500h12V9.800" />
  </S>
);
export const IcBusca = (a) => (
  <S {...a}>
    <circle cx="11" cy="11" r="6.200" />
    <path d="m16 16 4 4" />
  </S>
);
export const IcBilhete = (a) => (
  <S {...a}>
    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
    <path d="M14 6.500v11" strokeDasharray="1.500 2.500" />
  </S>
);
