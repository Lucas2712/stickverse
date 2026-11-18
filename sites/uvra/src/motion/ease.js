// Curvas da marca e o que a página sabe do aparelho.
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

CustomEase.create('uv-out', '0.22, 1, 0.36, 1');
CustomEase.create('uv-in', '0.64, 0, 0.78, 0');

export const REDUZIDO = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
