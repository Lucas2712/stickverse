// Celular: o carrossel dos projetos anda sozinho para o lado, bem devagar, enquanto aparece na tela. Para quando a
// pessoa toca nele, volta a andar alguns segundos depois de ela soltar e, no fim, desliza de volta ao primeiro card.
// Só começa depois que os agentes terminam de montar os cards. Com movimento reduzido, fica parado.
const VELOCIDADE = 26; // px por segundo
const PAUSA_TOQUE = 5000; // ms sem tocar antes de voltar a andar
const PAUSA_FIM = 2200; // ms parado no último card antes de voltar ao começo

export function carrossel() {
  const grade = document.querySelector('.projetos__grade');
  if (!grade || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const celular = matchMedia('(max-width: 760px)');
  const raiz = document.documentElement;
  let visivel = false;
  let tocando = false;
  let pausaAte = 0;
  let voltando = false;
  let x = 0;
  let posto = -1; // a última posição que o próprio carrossel escreveu
  let antes = 0;
  let andando = false;

  const pronto = () => raiz.classList.contains('pronto') || !grade.querySelector('[data-camada]:not(.c-pronta)');
  const solta = () => { if (andando) { grade.style.scrollSnapType = ''; andando = false; } };

  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }, { threshold: 0.4 }).observe(grade);
  const segura = () => { tocando = true; voltando = false; solta(); };
  const larga = () => { tocando = false; pausaAte = performance.now() + PAUSA_TOQUE; };
  grade.addEventListener('pointerdown', segura, { passive: true });
  grade.addEventListener('touchstart', segura, { passive: true });
  for (const ev of ['pointerup', 'pointercancel', 'touchend', 'touchcancel']) grade.addEventListener(ev, larga, { passive: true });

  const passo = (agora) => {
    const dt = Math.min(64, agora - (antes || agora)) / 1000;
    antes = agora;
    requestAnimationFrame(passo);
    if (!celular.matches || !visivel || tocando || voltando || agora < pausaAte || !pronto()) {
      solta();
      x = grade.scrollLeft;
      return;
    }
    const max = grade.scrollWidth - grade.clientWidth;
    if (max <= 2) return;
    if (!andando) { grade.style.scrollSnapType = 'none'; andando = true; x = grade.scrollLeft; }
    if (posto >= 0 && Math.abs(grade.scrollLeft - posto) > 2) x = grade.scrollLeft; // alguém mexeu: segue dali
    x += VELOCIDADE * dt;
    if (x >= max) {
      grade.scrollLeft = max;
      // fim do trilho: espera um pouco e desliza de volta ao primeiro card
      voltando = true;
      setTimeout(() => {
        if (tocando) return;
        grade.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(() => { voltando = false; x = 0; pausaAte = performance.now() + 1500; }, 1200);
      }, PAUSA_FIM);
      return;
    }
    grade.scrollLeft = x;
    posto = grade.scrollLeft;
  };
  requestAnimationFrame(passo);
}
