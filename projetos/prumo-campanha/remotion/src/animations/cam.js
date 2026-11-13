import { Easing } from 'remotion';
// Câmera virtual por quadros-chave. keys: [[t, {x, y, s, rx, ry, rz}, easing?]] — o easing vale do quadro até o próximo.
export const WHIP = Easing.bezier(0.83, 0, 0.17, 1);          // chicote: arranque e frenagem fortes
export const GLIDE = Easing.bezier(0.45, 0, 0.2, 1);          // deslize suave
export const DIVE = Easing.bezier(0.7, 0, 0.9, 0.4);          // mergulho acelerando
export const kf = (t, keys) => {
  if (t <= keys[0][0]) return { ...keys[0][1] };
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, A, e = GLIDE] = keys[i], [b, B] = keys[i + 1];
    if (t <= b) {
      const p = e(Math.min(1, Math.max(0, (t - a) / (b - a))));
      const o = {}; for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) o[k] = (A[k] ?? B[k]) + ((B[k] ?? A[k]) - (A[k] ?? B[k])) * p; return o;
    }
  }
  return { ...keys.at(-1)[1] };
};
// transforma um ponto do "mundo" (canvas) para a tela 1080×1920
export const camTransform = (c) => `translate(540px, 960px) scale(${c.s ?? 1}) rotateX(${c.rx ?? 0}deg) rotateY(${c.ry ?? 0}deg) rotate(${c.rz ?? 0}deg) translate(${-(c.x ?? 0)}px, ${-(c.y ?? 0)}px)`;
// velocidade da câmera em px de tela por quadro (60 fps) → desfoque direcional
export const camBlur = (t, keys, k = 0.22, max = 40) => {
  const a = kf(t, keys), b = kf(t - 1 / 60, keys);
  const s = a.s ?? 1;
  const dx = ((a.x ?? 0) - (b.x ?? 0)) * s, dy = ((a.y ?? 0) - (b.y ?? 0)) * s;
  const ds = Math.abs(Math.log((a.s ?? 1) / (b.s ?? 1))) * 2600;      // zoom rápido também borra
  return [Math.min(max, Math.abs(dx) * k + ds * 0.08), Math.min(max, Math.abs(dy) * k + ds * 0.08)];
};
