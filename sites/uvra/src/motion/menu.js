// O menu do celular: o botão da nav abre o índice das salas por cima do filme esmaecido. A barra da nav continua por
// cima dele (a marca, a loja e o "Fechar"); o resto da página fica inerte e parada. Tocar numa sala fecha o menu antes
// de o diretor do filme levar até ela (este clique corre no próprio menu, antes do dele, que fica no documento).
import gsap from 'gsap';
import { REDUZIDO } from './ease.js';

const CELULAR = matchMedia('(max-width: 1023px), (max-aspect-ratio: 4/5)');

export function criarMenu({ lenis }) {
  const menu = document.getElementById('menu');
  const botao = document.querySelector('.nav__menu');
  if (!menu || !botao) return;
  const nav = document.querySelector('.nav');
  const rotulo = botao.querySelector('.nav__menu-rotulo');
  const partes = [...menu.querySelectorAll('.menu__lista li, .menu__acoes, .menu__contato')];
  let aberto = false;

  // a página por trás: inerte (o leitor de tela e o Tab não chegam nela) e sem rolar
  function prende(sim) {
    for (const el of document.body.children) if (el !== menu && el !== nav && el.tagName !== 'SCRIPT') el.inert = sim;
    if (lenis) (sim ? lenis.stop() : lenis.start());
    else document.documentElement.style.overflow = sim ? 'hidden' : '';
  }

  function abre() {
    if (aberto) return;
    aberto = true;
    menu.hidden = false;
    menu.scrollTop = 0;
    botao.setAttribute('aria-expanded', 'true');
    rotulo.textContent = 'Fechar';
    prende(true);
    if (REDUZIDO) gsap.set([menu, ...partes], { opacity: 1, y: 0 });
    else {
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'uv-out', overwrite: true });
      gsap.fromTo(partes, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: 'uv-out', stagger: 0.035, delay: 0.04, overwrite: true });
    }
    menu.querySelector('.menu__item')?.focus({ preventScroll: true });
  }

  // foco: false quando o menu fecha porque a pessoa escolheu um destino (o foco segue com ela)
  function fecha({ foco = true } = {}) {
    if (!aberto) return;
    aberto = false;
    botao.setAttribute('aria-expanded', 'false');
    rotulo.textContent = 'Menu';
    prende(false);
    if (foco) botao.focus({ preventScroll: true });
    if (REDUZIDO) { menu.hidden = true; return; }
    gsap.to(partes, { opacity: 0, y: -8, duration: 0.2, ease: 'uv-in', overwrite: true });
    gsap.to(menu, { opacity: 0, duration: 0.3, delay: 0.05, ease: 'uv-in', overwrite: true, onComplete: () => { if (!aberto) menu.hidden = true; } });
  }

  botao.addEventListener('click', () => (aberto ? fecha() : abre()));
  // uma sala ou uma ação: o menu fecha e solta a página antes de o filme rolar até lá
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) fecha({ foco: false }); });
  // a loja (da nav) abre por cima de tudo: o menu sai antes, para a vitrine devolver a página inteira ao fechar
  nav.addEventListener('click', (e) => { if (e.target.closest('a[href="#loja"]')) fecha({ foco: false }); });

  document.addEventListener('keydown', (e) => {
    if (!aberto) return;
    if (e.key === 'Escape') { e.preventDefault(); fecha(); return; }
    if (e.key !== 'Tab') return;
    // o Tab gira entre a barra da nav e o menu
    const focaveis = [...nav.querySelectorAll('a[href], button'), ...menu.querySelectorAll('a[href]')]
      .filter((el) => el.getClientRects().length);
    const i = focaveis.indexOf(document.activeElement);
    if (i < 0) { e.preventDefault(); focaveis[0].focus(); }
    else if (e.shiftKey && i === 0) { e.preventDefault(); focaveis[focaveis.length - 1].focus(); }
    else if (!e.shiftKey && i === focaveis.length - 1) { e.preventDefault(); focaveis[0].focus(); }
  });

  // a tela cresceu para o desktop com o menu aberto (aparelho virado, janela larga): ele fecha
  CELULAR.addEventListener('change', () => { if (!CELULAR.matches) fecha({ foco: false }); });
}
