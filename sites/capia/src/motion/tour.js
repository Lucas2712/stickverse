// Tour automático: um botão discreto no canto (ou o endereço com ?tour) rola a página sozinho de cima a baixo,
// parando em cada painel do cardápio para trocar de item, e no rodapé solta os cartões do mural (no celular, folheia
// a pilha). Qualquer gesto da pessoa (roda, dedo, tecla, clique) para o tour na hora: a página volta a ser dela.
// É opcional: sem este módulo o site é o mesmo. A rolagem continua passando pelo Lenis (rolaJa) e os efeitos
// presos à rolagem reagem como numa rolagem comum. Com prefers-reduced-motion, o tour pula de parada em parada.
import { rolaJa, reduzido, suave } from './rolagem.js';

// velocidade da rolagem entre as paradas: fração da altura da tela por segundo (com um piso em px/s)
const VELOCIDADE = 0.42;
const VELOCIDADE_MINIMA = 320;
// menor duração de um trecho, em ms
const TRECHO_MINIMO = 900;
// esperas, em ms
const ESPERA_INICIO = 1600;
const ESPERA_CHEGADA = 900;   // painel preso, antes da primeira troca
const ESPERA_ITEM = 2100;     // entre uma troca de item e a seguinte
const TROCAS = 2;             // quantos itens o tour mostra em cada painel
const ESPERA_FIM = 2500;
// o mural: quantos passos de mouse o rastro dá (computador) ou quantas folheadas na pilha (celular)
const PASSOS_RASTRO = 70;
const FOLHEADAS = 3;

const espera = (ms, sinal) => new Promise((ok, falha) => {
  const t = setTimeout(ok, ms);
  sinal.addEventListener('abort', () => { clearTimeout(t); falha(sinal.reason); }, { once: true });
});

const yDe = (el) => el.getBoundingClientRect().top + window.scrollY;
const fim = () => document.documentElement.scrollHeight - window.innerHeight;

function vai(destino, sinal) {
  const inicio = window.scrollY;
  const distancia = destino - inicio;
  if (reduzido || Math.abs(distancia) < 2) { rolaJa(destino); return Promise.resolve(); }
  const porSegundo = Math.max(VELOCIDADE_MINIMA, window.innerHeight * VELOCIDADE);
  const duracao = Math.max(TRECHO_MINIMO, (Math.abs(distancia) / porSegundo) * 1000);
  const t0 = performance.now();
  return new Promise((ok, falha) => {
    let quadro = 0;
    sinal.addEventListener('abort', () => { cancelAnimationFrame(quadro); falha(sinal.reason); }, { once: true });
    const passo = (agora) => {
      const p = Math.min(1, (agora - t0) / duracao);
      rolaJa(inicio + distancia * suave(p));
      if (p < 1) quadro = requestAnimationFrame(passo); else ok();
    };
    quadro = requestAnimationFrame(passo);
  });
}

// troca para o item seguinte da fila, pelo mesmo clique que a pessoa daria
function proximoItem(painel) {
  const abas = [...painel.querySelectorAll('[role="tab"]:not([aria-hidden="true"])')];
  const atual = abas.findIndex((a) => a.getAttribute('aria-selected') === 'true');
  abas[(atual + 1) % abas.length]?.click();
}

async function mural(rodape, sinal) {
  const celular = matchMedia('(max-width: 767.98px)').matches;
  const mouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (celular || !mouse) {
    const pilha = rodape.querySelector('[data-pilha]');
    for (let i = 0; i < FOLHEADAS && pilha; i++) { pilha.click(); await espera(1200, sinal); }
    return;
  }
  const area = rodape.querySelector('[data-mural]') || rodape;
  const caixa = area.getBoundingClientRect();
  const alvo = rodape.querySelector('.mural__chamada') || area;
  for (let i = 0; i <= PASSOS_RASTRO; i++) {
    const p = i / PASSOS_RASTRO;
    const x = caixa.left + caixa.width * (0.08 + 0.84 * p);
    const y = caixa.top + caixa.height * (0.5 + 0.28 * Math.sin(p * Math.PI * 3));
    alvo.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y, pointerType: 'mouse', bubbles: true }));
    await espera(28, sinal);
  }
  await espera(1800, sinal);
}

export function iniciaTour() {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'botao tour__botao';
  botao.innerHTML = '<span data-tour-rotulo>Fazer o tour</span><span class="botao__seta" aria-hidden="true">›</span>';
  document.body.append(botao);
  const rotulo = botao.querySelector('[data-tour-rotulo]');

  let controle = null;

  const para = () => {
    if (!controle) return;
    controle.abort('parou');
    controle = null;
    botao.classList.remove('rodando');
    rotulo.textContent = 'Fazer o tour';
  };

  async function roda() {
    controle = new AbortController();
    const sinal = controle.signal;
    botao.classList.add('rodando');
    rotulo.textContent = 'Parar o tour';
    try {
      await vai(0, sinal);
      await espera(ESPERA_INICIO, sinal);
      for (const painel of document.querySelectorAll('[data-painel]')) {
        const ancora = document.getElementById(painel.dataset.painel) || painel;
        await vai(yDe(ancora), sinal);
        await espera(ESPERA_CHEGADA, sinal);
        for (let i = 0; i < TROCAS; i++) { proximoItem(painel); await espera(ESPERA_ITEM, sinal); }
      }
      const rodape = document.querySelector('[data-rodape]');
      const muralEl = rodape?.querySelector('[data-mural]');
      if (muralEl) {
        await vai(Math.min(fim(), yDe(muralEl) - (window.innerHeight - muralEl.offsetHeight) / 2), sinal);
        await mural(rodape, sinal);
      }
      await vai(fim(), sinal);
      await espera(ESPERA_FIM, sinal);
    } catch { /* parado pela pessoa */ }
    if (controle?.signal === sinal) para();
  }

  botao.addEventListener('click', () => (controle ? para() : roda()));

  // qualquer gesto da pessoa devolve a página a ela
  const gesto = (evento) => { if (controle && !botao.contains(evento.target)) para(); };
  addEventListener('wheel', gesto, { passive: true });
  addEventListener('touchstart', gesto, { passive: true });
  addEventListener('pointerdown', gesto, { passive: true });
  addEventListener('keydown', (evento) => { if (controle && evento.key !== 'Tab' && !botao.contains(evento.target)) para(); });

  if (new URLSearchParams(location.search).has('tour')) addEventListener('load', () => setTimeout(roda, 400), { once: true });
}
