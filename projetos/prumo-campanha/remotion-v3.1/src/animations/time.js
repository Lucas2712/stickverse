import { useCurrentFrame } from 'remotion';
import { FPS } from '../styles/tokens';
export const useT = (a) => a + useCurrentFrame() / FPS;
