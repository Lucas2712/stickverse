// A vitrine dos rótulos: abre por cima do filme quando a pessoa pede (o botão da cena da mesa, o "Loja" da nav e do
// rodapé) e fecha de volta no mesmo ponto: o filme não para nem perde a passagem. Enquanto ela está aberta, a página
// não rola e fica inerte por trás (o Tab e o clique não chegam lá), e o Esc, o × ou um clique fora fecham.
// As entradas animam só a opacidade: elemento com visibility hidden não recebe foco.
import gsap from 'gsap';
import { REDUZIDO } from './ease.js';

export function criarLoja({ lenis }) {
  const loja = document.getElementById('loja');
  if (!loja) return;
  const fundo = loja.querySelector('.loja__fundo');
  const fechar = loja.querySelector('.loja__fechar');
  const partes = [loja.querySelector('.loja__topo'), ...loja.querySelectorAll('.garrafa')];
  let aberta = false;
  let origem = null; // quem abriu, para devolver o foco ao fechar

  function abre(de) {
    if (aberta) return;
    aberta = true;
    origem = de;
    for (const img of loja.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager';
    loja.hidden = false;
    for (const el of document.body.children) if (el !== loja && el.tagName !== 'SCRIPT') el.inert = true;
    if (lenis) lenis.stop(); else document.documentElement.style.overflow = 'hidden';
    loja.scrollTop = 0;
    if (REDUZIDO) gsap.set([fundo, fechar, ...partes], { opacity: 1, y: 0 });
    else {
      gsap.fromTo(fundo, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'uv-out', overwrite: true });
      gsap.fromTo(fechar, { opacity: 0 }, { opacity: 1, duration: 0.45, delay: 0.2, ease: 'uv-out', overwrite: true });
      gsap.fromTo(partes, { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'uv-out', stagger: 0.07, delay: 0.06, overwrite: true });
    }
    fechar.focus({ preventScroll: true });
  }

  function fecha() {
    if (!aberta) return;
    aberta = false;
    const fim = () => {
      loja.hidden = true;
      for (const el of document.body.children) el.inert = false;
      if (lenis) lenis.start(); else document.documentElement.style.overflow = '';
      origem?.focus?.({ preventScroll: true });
    };
    if (REDUZIDO) { fim(); return; }
    gsap.to([fechar, ...partes], { opacity: 0, y: -10, duration: 0.26, ease: 'uv-in', overwrite: true });
    gsap.to(fundo, { opacity: 0, duration: 0.34, delay: 0.08, ease: 'uv-in', overwrite: true, onComplete: fim });
  }

  document.addEventListener('click', (e) => {
    const quem = e.target.closest('a[href="#loja"]');
    if (quem) { e.preventDefault(); abre(quem); return; }
    if (aberta && e.target.closest('[data-fecha]')) fecha();
  });

  document.addEventListener('keydown', (e) => {
    if (!aberta) return;
    if (e.key === 'Escape') { e.preventDefault(); fecha(); return; }
    if (e.key !== 'Tab') return;
    const focaveis = [...loja.querySelectorAll('button, a[href]')];
    const i = focaveis.indexOf(document.activeElement);
    if (i < 0) { e.preventDefault(); focaveis[0].focus(); }
    else if (e.shiftKey && i === 0) { e.preventDefault(); focaveis[focaveis.length - 1].focus(); }
    else if (!e.shiftKey && i === focaveis.length - 1) { e.preventDefault(); focaveis[0].focus(); }
  });
}
