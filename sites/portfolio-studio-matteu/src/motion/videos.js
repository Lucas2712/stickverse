// Vídeos dos cards (loop sem som): tocam só enquanto aparecem na tela, para poupar bateria e dados no celular. No
// HTML eles vêm sem autoplay e com preload="none": nada é baixado até o card chegar perto da tela (com autoplay o
// navegador baixava os três vídeos inteiros logo ao abrir a página). Com movimento reduzido, ficam na capa (poster).
export function videos() {
  const lista = [...document.querySelectorAll('.projeto__img video')];
  if (!lista.length) return;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const v of lista) {
    v.muted = true; // o iOS só toca sozinho com o vídeo mudo, e a propriedade precisa estar ligada além do atributo
    if (reduz) v.pause();
  }
  if (reduz || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((itens) => {
    for (const it of itens) {
      if (it.isIntersecting) it.target.play().catch(() => {});
      else it.target.pause();
    }
  }, { rootMargin: '200px 0px' });
  lista.forEach((v) => io.observe(v));
}
