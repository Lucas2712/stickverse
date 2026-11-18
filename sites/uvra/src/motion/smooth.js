// Lenis no relógio do GSAP. Sem Lenis com movimento reduzido.
// O Lenis conduz também o toque (syncTouch): o dedo arrasta a página junto, e o guia (guia.js) põe teto na inércia
// depois de soltar, como faz com a roda: com a rolagem nativa, um piparote no celular passaria várias telas de filme.
import gsap from 'gsap';
import Lenis from 'lenis';
import { REDUZIDO } from './ease.js';

export function criarScroll() {
  if (REDUZIDO) return null;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: true, syncTouchLerp: 0.075 });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
