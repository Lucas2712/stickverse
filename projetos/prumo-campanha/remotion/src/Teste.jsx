import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { useFonte } from './components/Fonte';
import * as A from './scenes/V3_A1';
import * as A2 from './scenes/V3_A2';
import * as A3 from './scenes/V3_A3';
import * as A4 from './scenes/V3_A4';
export const TesteCena = ({ cena = 'V3_A1', a = 0 }) => { useFonte(); const Comp = { ...A, ...A2, ...A3, ...A4 }[cena]; return <AbsoluteFill style={{ background: '#fff' }}><Comp a={a} /></AbsoluteFill>; };
