// O tour: o botão "Tour" da nav rola a página sozinho do ponto atual até o rodapé, no ritmo natural do filme
// (VEL telas por segundo: ~2,5 telas por clipe de 5 s, os 24 quadros por segundo dos clipes). Anda pelo mesmo caminho
// da pessoa (a posição da rolagem), então as frases entram e saem nas janelas delas. Qualquer gesto da pessoa (roda,
// toque, tecla, clique fora do botão) devolve a rolagem na hora; parado no meio, o botão vira "Continuar"; no fim,
// "Tour" de novo, e o próximo toque recomeça do topo.
import gsap from 'gsap';
import { liberaQuadros } from './quadros.js';

const VEL = 0.5; // telas por segundo

const ICONE = {
  tocar: '<path d="M5 3.4v9.2l7.4-4.6z" />',
  pausar: '<path d="M5 3.6v8.8M11 3.6v8.8" />',
};

export function criarTour({ lenis }) {
  const botao = document.querySelector('.acoes__tour');
  if (!botao) return null;
  const rotulo = botao.querySelector('.acoes__tour-rotulo');
  const icone = botao.querySelector('svg');
  const tela = document.querySelector('.tela');
  let rodando = false;
  let y = 0;

  const limite = () => (lenis ? lenis.limit : document.documentElement.scrollHeight - innerHeight);
  const atual = () => (lenis ? lenis.scroll : scrollY);
  const vai = (alvo) => (lenis ? lenis.scrollTo(alvo, { immediate: true, force: true }) : scrollTo(0, alvo));

  function mostra(estado) {
    rotulo.textContent = estado === 'rodando' ? 'Pausar' : estado === 'meio' ? 'Continuar' : 'Tour';
    icone.innerHTML = estado === 'rodando' ? ICONE.pausar : ICONE.tocar;
    botao.setAttribute('aria-label', estado === 'rodando' ? 'Pausar o tour' : estado === 'meio' ? 'Continuar o tour' : 'Fazer o tour pela página');
    botao.classList.toggle('is-rodando', estado === 'rodando');
  }

  function passo(_t, dt) {
    const alto = tela?.offsetHeight || innerHeight;
    y = Math.min(y + VEL * alto * Math.min(dt, 100) / 1000, limite());
    vai(y);
    if (y >= limite() - 1) para(true);
  }

  function para(fim = false) {
    if (!rodando) return;
    rodando = false;
    gsap.ticker.remove(passo);
    mostra(fim ? 'fim' : 'meio');
  }

  function toca() {
    // menu do celular aberto: fecha antes (a página por trás está inerte)
    const menu = document.getElementById('menu');
    if (menu && !menu.hidden) document.querySelector('.nav__menu')?.click();
    liberaQuadros();
    y = atual();
    if (y >= limite() - 2) { y = 0; vai(0); }
    rodando = true;
    gsap.ticker.add(passo);
    mostra('rodando');
  }

  botao.addEventListener('click', () => (rodando ? para() : toca()));

  // a pessoa retoma a rolagem com qualquer gesto
  const solta = (e) => { if (rodando && !botao.contains(e.target)) para(); };
  for (const ev of ['wheel', 'touchstart', 'pointerdown', 'keydown']) addEventListener(ev, solta, { passive: true, capture: true });

  mostra('fim');
  return { para };
}
