// O diretor do filme. O filme corre em trilhos: cada trilho é uma trilha alta com um palco preso na tela (sticky), e
// entre dois trilhos a página pode ter seções normais. Em cada trilho, a posição da rolagem, em telas, escolhe o
// capítulo (um clipe cada) e o quadro, e o canvas só redesenha quando o quadro muda. A rolagem já chega freada pelo
// guia (teto de velocidade na roda); um link para longe corta por um véu escuro em vez de passar o filme correndo.
// Os textos entram e saem por marco, por tempo, nunca presos ao scroll: quem para no meio de uma passagem vê o texto
// inteiro ou nenhum.
// No toque, o filme ainda persegue a rolagem a no máximo VEL telas por segundo (o dedo pode arrastar mais rápido que
// os quadros decodificam), e os textos seguem o filme, não a rolagem: a frase de uma cena nunca entra antes da imagem.
// A rolagem já chega contida pelo guia (teto na inércia do toque). Piparotes seguidos deixam o filme para trás: ele
// acelera até o dobro e alcança, passando por todos os quadros. O corte pelo véu fica só para um atraso enorme (barra
// de rolagem, teclado), para nunca pular partes do filme no dedo.
// Celular em pé: os mesmos capítulos recortados no meio em 9:16 (public/filme/retrato, 608 × 1080).
import gsap from 'gsap';
import { capitulo, liberaQuadros } from './quadros.js';
import { clamp, REDUZIDO } from './ease.js';

// cada capítulo é um clipe; telas = quanto de rolagem ele ocupa (a curva de movimento deixa o ritmo constante).
// emenda: o clipe começa no último quadro do anterior (o mesmo quadro-chave); os dois fundem numa faixa curta para
// esconder a diferença de nitidez entre as duas gerações. Sem emenda, corte seco.
// Cada clipe tem 121 quadros: com ~2,5 telas por clipe e o teto de ~1,8 tela/s do guia, o filme passa perto dos
// 24 fps dele numa rolagem normal. Mais telas por clipe deixam a troca de quadros espaçada e o filme parece travar.
const CAPITULOS = [
  { trilha: 0, base: 'c1', telas: 3.2 }, // entrada: atravessa o público e entra no quadro
  { trilha: 0, base: 'c2', telas: 2.6, emenda: true }, // vinhedo: sobe pelo braço da moça e voa sobre as fileiras
  { trilha: 0, base: 'c3', telas: 2.4 }, // colheita: corte para as mãos cortando o cacho
  { trilha: 0, base: 'c4', telas: 2.4, emenda: true }, // lagar: o cesto vira na prensa
  { trilha: 0, base: 'c5', telas: 2.5, emenda: true }, // barrica: mergulha no mosto e sai na adega
  { trilha: 0, base: 'c6', telas: 2.3, emenda: true }, // taça: a pipeta solta o vinho
  // rótulos: afasta da taça para a mesa com as três garrafas (mais telas que os outros: a mesa precisa de tempo na
  // tela, com a frase e o botão da vitrine)
  { trilha: 0, base: 'c7', telas: 3.4, emenda: true },
  { trilha: 0, base: 'c8', telas: 2.8, emenda: true }, // visitas: a mesa é a ponta do banquete
  { trilha: 0, base: 'c9', telas: 2.8, emenda: true }, // clube: o banquete vira um quadro na galeria
];
// telas paradas no último quadro de cada trilho antes do que vem depois (a galeria do fim, antes do rodapé). O motor
// aceita mais de um trilho, com seções de página entre eles; a Uvra usa um só, para o filme correr sem interrupção.
const PARADA = [1.2];
const FUSAO = 0.15; // telas de fusão numa emenda
const SALTO = 1.5; // link para mais longe que isso (em telas) corta pelo véu
const HERO_SAI = 0.03; // telas: os textos do hero saem com o primeiro gesto
const VEL = 2.5; // toque: telas por segundo que o filme anda atrás da rolagem (até o dobro, quando atrasa)
const CORTE = 6; // toque: telas de atraso a partir das quais o filme corta pelo véu até a rolagem

// a tela em pé usa os quadros recortados; a troca acontece ao virar o aparelho
const RETRATO = matchMedia('(max-aspect-ratio: 4/5)');
const TOQUE = matchMedia('(hover: none) and (pointer: coarse)').matches;
const pasta = (c) => (RETRATO.matches ? `filme/retrato/${c.base}` : `filme/${c.base}`);
// no celular, a janela de quadros decodificados é menor (memória do iPhone)
const opcoes = () => (RETRATO.matches || TOQUE ? { janela: 10, sobra: 16 } : {});

export function criarFilme({ lenis }) {
  const veu = document.querySelector('.veu');
  const heroPartes = [...document.querySelectorAll('.legenda--hero, .hero__texto, .hero__titulo')];

  // ---- trilhos: cada um com a sua tela, o seu canvas e os seus capítulos (ini/fim em telas, dentro do trilho)
  const trilhos = [...document.querySelectorAll('.trilha')].map((el, k) => {
    const canvas = el.querySelector('.palco__filme');
    return {
      k, el, tela: el.querySelector('.tela'), sombra: el.querySelector('.sombra'), canvas,
      ctx: canvas.getContext('2d', { alpha: false }), caps: [], total: 0, topo: 0,
      chave: '', mostrado: { c: null, f: 0 }, yAntes: NaN, paradoDesde: 0,
      y: 0, cortando: false, // y: onde o filme está (no toque, atrás da rolagem; fora dele, igual a ela)
    };
  });
  const caps = CAPITULOS.map((c, n) => {
    const t = trilhos[c.trilha];
    const o = { ...c, n, t, ini: t.total, fim: t.total + c.telas, cap: capitulo(pasta(c), opcoes()) };
    t.total += c.telas;
    t.caps.push(o);
    return o;
  });
  for (const t of trilhos) t.el.style.setProperty('--telas', t.total + PARADA[t.k]);

  let alturaTela = trilhos[0].tela.offsetHeight;
  const rolagem = () => (lenis ? lenis.scroll : scrollY);
  const local = (t) => (rolagem() - t.topo) / alturaTela; // posição da rolagem dentro do trilho, em telas

  // janelas dos textos (data-cap, data-de, data-ate em fração do capítulo; "fim" = até o fim do trilho). data-pouso
  // (opcional, fração do capítulo): onde um link para a cena para, quando logo depois de o texto entrar o clipe ainda
  // está borrado
  const cenas = [...document.querySelectorAll('[data-cap]')].map((el) => {
    const c = caps[Number(el.dataset.cap) - 1];
    const de = c.ini + Number(el.dataset.de) * c.telas;
    const ate = el.dataset.ate === 'fim' ? Infinity : c.ini + Number(el.dataset.ate) * c.telas;
    const pouso = el.dataset.pouso ? c.ini + Number(el.dataset.pouso) * c.telas : de + 0.12;
    return { el, t: c.t, de, ate, pouso, on: false };
  });

  // destino de cada link interno, em px da página: cena do filme logo depois de o texto entrar (ou no pouso dela);
  // seção normal, o topo dela. Medido na hora (a página muda de altura com a tela).
  const destinos = { topo: () => 0 };
  for (const s of cenas) {
    const id = s.el.id || s.el.closest('[id]')?.id;
    if (id && !(id in destinos)) destinos[id] = () => s.t.topo + s.pouso * alturaTela;
  }
  // seções de página entre trilhos (se houver): o topo delas
  for (const el of document.querySelectorAll('main > section[id]')) destinos[el.id] = () => el.offsetTop;
  // o índice do desktop e o do menu do celular acendem juntos
  const indice = [...document.querySelectorAll('.indice__item, .menu__item')].map((a) => ({ a, id: a.getAttribute('href').slice(1) }));
  const ids = [...new Set(indice.map((it) => it.id))];

  // ---- medidas: altura da tela, topo de cada trilho e o canvas do tamanho da caixa da foto (nunca maior que o
  // próprio quadro). A tela tem a altura grande do celular (100lvh): a barra do Safari some e volta sem mudar nada aqui
  function mede() {
    alturaTela = trilhos[0].tela.offsetHeight;
    for (const t of trilhos) {
      t.topo = t.el.offsetTop;
      const { canvas } = t;
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (!cw || !ch) continue;
      const largura = t.caps[0].cap.largura || (RETRATO.matches ? 608 : 1440);
      const escala = Math.max(1, Math.min(devicePixelRatio || 1, 2, largura / cw));
      const w = Math.round(cw * escala), h = Math.round(ch * escala);
      if (w === canvas.width && h === canvas.height) continue;
      canvas.width = w;
      canvas.height = h;
      t.chave = '';
    }
  }

  function cobre(t, img, alfa) {
    const { width: cw, height: ch } = t.canvas;
    const s = Math.max(cw / img.width, ch / img.height);
    const w = img.width * s, h = img.height * s;
    t.ctx.globalAlpha = alfa;
    t.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    t.ctx.globalAlpha = 1;
  }

  // desenha a posição f (fracionária) do capítulo c: o quadro de baixo e, por cima, o seguinte na proporção da
  // fração (a passagem entre dois quadros vira uma fusão, não um degrau); numa emenda, o 1º quadro do capítulo
  // seguinte entra por cima. Sem os quadros exatos ainda decodificados, desenha o pronto mais perto.
  function desenha(t, c, f, prox, fus0) {
    const i0 = Math.floor(f);
    const fr = f - i0;
    const b0 = c.cap.exato(i0);
    const b1 = fr > 0.02 ? c.cap.exato(Math.min(i0 + 1, c.cap.total - 1)) : null;
    let k = i0, base = b0, cima = null, mistura = 0;
    if (b0 && b1) { cima = b1; mistura = Math.round(fr * 32) / 32; }
    else if (!b0 || fr > 0.02) {
      const m = c.cap.melhor(Math.round(f));
      if (!m) return;
      [k, base] = m;
    }
    const m2 = fus0 > 0 && prox?.cap.total ? prox.cap.melhor(0) : null;
    const fus = m2 ? Math.round(fus0 * 40) / 40 : 0;
    const nova = `${c.n}:${k}:${mistura}:${fus}`;
    if (nova === t.chave) return;
    cobre(t, base, 1);
    if (mistura > 0) cobre(t, cima, mistura);
    if (fus > 0) cobre(t, m2[1], fus);
    t.chave = nova;
    // o canvas só aparece depois do primeiro desenho (antes, a foto do hero é o mesmo quadro 0)
    if (!t.canvas.classList.contains('is-pronto')) t.canvas.classList.add('is-pronto');
  }

  function onde(t, y) {
    for (const c of t.caps) if (y < c.fim) return [c, clamp((y - c.ini) / c.telas)];
    const ult = t.caps[t.caps.length - 1];
    return [ult, 1];
  }

  // ---- marcos: hero, textos de cena e índice trocam de estado por tempo, só quando cruzam a fronteira
  let heroOn = true;
  let secao = null;

  function hero(sim, imediato) {
    if (imediato || REDUZIDO) { gsap.set(heroPartes, { autoAlpha: sim ? 1 : 0, y: 0 }); return; }
    if (sim) gsap.to(heroPartes, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'uv-out', stagger: 0.05, overwrite: true });
    else gsap.to(heroPartes, { autoAlpha: 0, y: (k) => (k === 2 ? 28 : -10), duration: 0.4, ease: 'uv-in', stagger: 0.03, overwrite: true });
  }

  function cena(el, sim, imediato) {
    const partes = el.children;
    if (imediato || REDUZIDO) {
      gsap.set(el, { autoAlpha: sim ? 1 : 0 });
      gsap.set(partes, { autoAlpha: sim ? 1 : 0, y: 0, filter: 'none' });
      return;
    }
    if (sim) {
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(partes, { autoAlpha: 0, y: 18, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'uv-out', stagger: 0.09, overwrite: true });
    } else {
      gsap.to(partes, { autoAlpha: 0, y: -8, filter: 'blur(6px)', duration: 0.35, ease: 'uv-in', overwrite: true,
        onComplete: () => gsap.set(el, { autoAlpha: 0 }) });
    }
  }

  function marcos(imediato = false) {
    const h = trilhos[0].y < HERO_SAI;
    if (h !== heroOn) { heroOn = h; hero(h, imediato); }
    // fora do hero o véu liso fica sempre: na galeria escura não se vê, e dentro do quadro segura a nav e os textos
    for (const t of trilhos) t.sombra.classList.toggle('is-on', t.k > 0 || !h);
    for (const s of cenas) {
      const v = s.t.y >= s.de && s.t.y < s.ate;
      if (v !== s.on) {
        s.on = v;
        cena(s.el, v, imediato);
        // véu da cena (data-veu): escurece o topo ou o pé enquanto ela está na tela
        const veuCena = s.el.dataset.veu;
        if (veuCena && v) s.t.tela.dataset.veu = veuCena;
        else if (veuCena && s.t.tela.dataset.veu === veuCena) delete s.t.tela.dataset.veu;
      }
    }
    // a seção atual é a do filme (no toque, ele pode estar um pouco atrás da rolagem)
    const atraso = (trilhos[0].y - local(trilhos[0])) * alturaTela;
    const agora = rolagem() + atraso + 0.4 * alturaTela;
    let atual = ids[0];
    for (const id of ids) if (destinos[id] && destinos[id]() <= agora) atual = id;
    if (atual !== secao) {
      secao = atual;
      for (const it of indice) {
        const sim = it.id === atual;
        it.a.classList.toggle('is-atual', sim);
        if (sim) it.a.setAttribute('aria-current', 'true'); else it.a.removeAttribute('aria-current');
      }
    }
  }

  // ---- toque: o filme anda atrás da rolagem com teto de velocidade; muito atrás, corta pelo véu
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  function avanca(t, dt) {
    const y = local(t);
    if (!TOQUE || REDUZIDO || pulando) { t.y = y; return; }
    if (t.cortando) return;
    const d = y - t.y;
    if (Math.abs(d) > CORTE) { corta(t); return; }
    // mais de uma tela atrás (piparotes seguidos), acelera até o dobro para alcançar sem pular nada
    const vel = VEL * Math.min(2, 1 + Math.max(0, Math.abs(d) - 1) * 0.5);
    const passo = (vel * Math.min(dt || 16, 50)) / 1000;
    t.y += clamp(d, -passo, passo);
  }
  function corta(t) {
    t.cortando = true;
    gsap.to(veu, {
      autoAlpha: 1, duration: 0.16, ease: 'uv-in', overwrite: true,
      onComplete: async () => {
        // o véu só abre quando a inércia assenta (até 1,5 s): um piparote forte vira um corte só, não um véu piscando
        const inicio = performance.now();
        for (let antes = local(t); performance.now() - inicio < 1500; ) {
          await espera(100);
          const agora = local(t);
          if (Math.abs(agora - antes) < 0.12) break;
          antes = agora;
        }
        t.y = local(t);
        marcos(true);
        const [c] = onde(t, clamp(t.y, 0, t.total));
        await Promise.race([c.cap.carrega(), espera(500)]);
        await espera(110); // a janela de quadros gira em volta do novo ponto
        t.y = local(t); // a inércia andou um pouco durante a espera
        marcos(true);
        t.cortando = false;
        gsap.to(veu, { autoAlpha: 0, duration: 0.45, ease: 'uv-out', overwrite: true });
      },
    });
  }

  // ---- a cada quadro, em cada trilho perto da tela: capítulo e quadro da posição do filme, carrega o que vem perto
  // (do filme e da rolagem) e solta o que ficou longe. Andando, o quadro mostrado segue a posição (fracionária, com
  // fusão); parado, assenta no quadro inteiro mais perto em ~0,1 s, para nunca ficar uma imagem dupla na tela.
  function tiqueTrilho(t, dt) {
    avanca(t, dt);
    const yr = local(t);
    const yb = t.y;
    for (const c of t.caps) {
      const perto = (y) => y > c.ini - 1.5 && y < c.fim + 1.5;
      if (perto(yb) || perto(yr)) c.cap.carrega();
      else if (c.cap.total && (yb < c.ini - 3 || yb > c.fim + 3)) c.cap.solta();
    }
    if (yb < -1.05 || yb > t.total + PARADA[t.k] + 1.05) return; // tela do trilho fora da vista
    const y = clamp(yb, 0, t.total);
    const [c, p] = onde(t, y);
    if (!c.cap.total) return;
    const agora = performance.now();
    if (!(Math.abs(yb - t.yAntes) < 0.0004)) t.paradoDesde = agora;
    t.yAntes = yb;
    const alvo = c.cap.quadro(p);
    let f = alvo;
    if (t.mostrado.c === c && agora - t.paradoDesde > 120) {
      const inteiro = Math.round(alvo);
      f = t.mostrado.f + (inteiro - t.mostrado.f) * Math.min(1, (dt || 16) / 70);
      if (Math.abs(f - inteiro) < 0.02) f = inteiro;
    }
    t.mostrado = { c, f };
    c.cap.pede(Math.round(f));
    const prox = t.caps[t.caps.indexOf(c) + 1];
    const fus = prox?.emenda ? clamp((y - (c.fim - FUSAO)) / FUSAO) : 0;
    desenha(t, c, f, prox, fus);
    if (t.k === 0) t.canvas.classList.toggle('is-topo', c.n === 0 && f < 0.002);
  }

  function tique(tempo, dt) {
    for (const t of trilhos) tiqueTrilho(t, dt);
    if (!pulando) marcos();
  }

  // ---- links internos: perto rola até lá; longe corta pelo véu e assenta tudo no destino sem animar
  let pulando = false;
  async function vaiPara(alvo) {
    if (Math.abs(alvo - rolagem()) <= SALTO * alturaTela || REDUZIDO) {
      if (lenis) lenis.scrollTo(alvo, { duration: 1.1 });
      else scrollTo({ top: alvo, behavior: REDUZIDO ? 'auto' : 'smooth' });
      return;
    }
    pulando = true;
    await gsap.to(veu, { autoAlpha: 1, duration: 0.3, ease: 'uv-in', overwrite: true });
    if (lenis) lenis.scrollTo(alvo, { immediate: true, force: true });
    else scrollTo(0, alvo);
    for (const t of trilhos) t.y = local(t);
    marcos(true);
    const prontos = caps.filter((c) => { const y = local(c.t); return y > c.ini - 1 && y < c.fim + 1; }).map((c) => c.cap.carrega());
    await Promise.race([Promise.all(prontos), espera(700)]);
    await espera(90);
    pulando = false;
    gsap.to(veu, { autoAlpha: 0, duration: 0.55, ease: 'uv-out', overwrite: true });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    const id = a?.getAttribute('href').slice(1);
    if (!a || id === 'conteudo') return;
    e.preventDefault();
    if (destinos[id]) vaiPara(destinos[id]());
  });

  // ---- o conjunto de quadros segue a orientação da tela: virar o aparelho troca os capítulos (os do outro conjunto
  // saem da memória) e a foto do hero troca sozinha (<picture>)
  RETRATO.addEventListener('change', () => {
    for (const c of caps) { c.cap.descarta(); c.cap = capitulo(pasta(c), opcoes()); }
    for (const t of trilhos) { t.chave = ''; t.mostrado = { c: null, f: 0 }; t.canvas.classList.remove('is-pronto'); }
    mede();
  });

  // ---- o resto dos quadros desce no primeiro gesto (ou depois de um tempo parado no hero)
  for (const ev of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll']) addEventListener(ev, liberaQuadros, { once: true, passive: true });
  if (document.readyState === 'complete') setTimeout(liberaQuadros, 8000);
  else addEventListener('load', () => setTimeout(liberaQuadros, 8000), { once: true });

  mede();
  for (const t of trilhos) new ResizeObserver(mede).observe(t.canvas);
  new ResizeObserver(mede).observe(document.body); // as fontes e a tela mudam a altura da página
  addEventListener('resize', mede);
  // aberta por um link com âncora (…/#visitas), a página já começa na cena
  const inicial = location.hash.slice(1);
  if (inicial && inicial !== 'topo' && destinos[inicial]) {
    // depois do load: o navegador faz antes o salto dele até o elemento da âncora, que fica dentro do palco preso e
    // não diz onde a cena está no filme. O Lenis remede o limite (as trilhas ganharam altura depois que ele mediu).
    const salta = () => {
      mede();
      const alvo = destinos[inicial]();
      if (lenis) { lenis.resize(); lenis.scrollTo(alvo, { immediate: true, force: true }); }
      else scrollTo(0, alvo);
      for (const t of trilhos) t.y = local(t);
      marcos(true);
    };
    if (document.readyState === 'complete') requestAnimationFrame(salta);
    else addEventListener('load', () => requestAnimationFrame(salta), { once: true });
  }
  marcos(true);
  caps[0].cap.carrega().then(mede);
  gsap.ticker.add(tique);
}
