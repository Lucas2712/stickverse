// Rolando: o hover descansa enquanto a página rola e só volta quando o mouse se mexe. Com o cursor parado no meio da
// tela, a rolagem passa cards e botões por baixo dele, e o hover acenderia sozinho. A classe .is-scrolling entra no
// <html> com o primeiro evento de rolagem (o Lenis também dispara o scroll nativo) e sai no primeiro movimento de
// mouse depois de a rolagem parar; o CSS só aplica o hover sem ela. O clique, o foco e o toque continuam valendo.
const html = document.documentElement;
const subs = new Set();
let on = false, still = true, timer = 0, px = NaN, py = NaN;

function set(v) {
  if (v === on) return;
  on = v;
  html.classList.toggle('is-scrolling', v);
  subs.forEach((f) => f(v));
}

addEventListener('scroll', () => {
  set(true);
  still = false;
  clearTimeout(timer);
  timer = setTimeout(() => { still = true; }, 160);
}, { passive: true });

// o mouse mexeu de verdade: a posição na tela mudou (o Safari deixa movementX/Y em zero fora do pointer lock)
addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  const moved = e.clientX !== px || e.clientY !== py;
  px = e.clientX; py = e.clientY;
  if (on && still && moved) set(false);
}, { passive: true });

export const rolando = {
  get on() { return on; },
  /** f(true) quando a rolagem começa, f(false) quando o mouse volta a mexer depois dela */
  sub(f) { subs.add(f); },
};
