// Os quadros de um capítulo do filme (gerados a partir dos clipes por scripts/quadros.mjs, com a curva de movimento
// de cada capítulo no manifest.json).
// Cada quadro fica guardado comprimido (Blob) e só uma janela em volta do quadro pedido vira ImageBitmap, decodificado
// fora da thread principal: centenas de quadros de 1600 px decodificados passam de 1 GB, e o navegador descartaria e
// redecodificaria no meio da rolagem. Baixa o primeiro e o último quadro, depois o resto do grosso para o fino (a cada
// 16, 8, 4, 2, 1): quem rola antes de terminar vê o quadro pronto mais próximo, e a página nunca trava.
// Antes do primeiro gesto da pessoa, só desce o começo de cada capítulo e a passada grossa (liberaQuadros solta o
// resto): a página abre leve no 4G e quem sai sem rolar não baixa o filme.
const DECODES = 4; // decodificações ao mesmo tempo (fora da thread principal)
const PRIMEIROS = 16; // quadros do começo que descem antes do primeiro gesto, além de um a cada 8

let livre = false;
const esperando = [];
const quandoLivre = () => (livre ? Promise.resolve() : new Promise((r) => esperando.push(r)));
/** o primeiro gesto (ou um tempo parado na página): os capítulos baixam o resto dos quadros */
export function liberaQuadros() {
  if (livre) return;
  livre = true;
  esperando.splice(0).forEach((r) => r());
}

/**
 * janela: quadros decodificados de cada lado do pedido; sobra: além dela, o bitmap é liberado. No celular, menores:
 * o iPhone aguenta ~150 MB de imagens decodificadas ao mesmo tempo.
 */
export function capitulo(base, { simultaneos = 6, janela: JANELA = 14, sobra: SOBRA = 26 } = {}) {
  const c = { total: 0, largura: 0, altura: 0, cum: null, pronto: null };
  const bitmaps = new Map();
  const decodificando = new Set();
  let blobs = [];
  let pedido = 0;
  let agendado = false;
  let vivo = true;

  // mantém decodificada a janela em volta do pedido, do mais perto para o mais longe, e solta o que ficou longe
  function janela() {
    agendado = false;
    if (!vivo) return;
    for (const [i, b] of bitmaps) if (Math.abs(i - pedido) > SOBRA) { b.close(); bitmaps.delete(i); }
    for (let d = 0; d <= JANELA && decodificando.size < DECODES; d++) {
      for (const i of d ? [pedido + d, pedido - d] : [pedido]) {
        if (i < 0 || i >= c.total || bitmaps.has(i) || decodificando.has(i) || !blobs[i]) continue;
        decodificando.add(i);
        createImageBitmap(blobs[i])
          .then((b) => {
            if (!vivo || Math.abs(i - pedido) > SOBRA) b.close();
            else bitmaps.set(i, b);
          }, () => {})
          .finally(() => { decodificando.delete(i); agenda(); });
        if (decodificando.size >= DECODES) break;
      }
    }
  }
  const agenda = () => { if (!agendado) { agendado = true; queueMicrotask(janela); } };

  /** pede o quadro i: a janela de decodificação passa a girar em volta dele */
  c.pede = (i) => {
    if (i === pedido) return;
    pedido = i;
    agenda();
  };

  /** o bitmap do quadro i, se já estiver decodificado */
  c.exato = (i) => bitmaps.get(i) || null;

  /** [índice, bitmap] do quadro pronto mais perto de i, ou null */
  c.melhor = (i) => {
    if (bitmaps.has(i)) return [i, bitmaps.get(i)];
    for (let d = 1; d < c.total; d++) {
      if (bitmaps.has(i - d)) return [i - d, bitmaps.get(i - d)];
      if (bitmaps.has(i + d)) return [i + d, bitmaps.get(i + d)];
    }
    return null;
  };

  /** libera os bitmaps (capítulo longe da tela); os Blobs ficam, para voltar sem baixar de novo */
  c.solta = () => {
    for (const b of bitmaps.values()) b.close();
    bitmaps.clear();
  };

  /** descarta o capítulo inteiro (a tela virou de pé para deitada e o filme trocou de conjunto de quadros) */
  c.descarta = () => {
    vivo = false;
    c.solta();
    blobs = [];
  };

  /** progresso 0..1 do capítulo → quadro (fracionário), pela curva de movimento: a câmera anda em ritmo constante */
  c.quadro = (p) => {
    const n = c.total - 1;
    if (p <= 0) return 0;
    if (p >= 1) return n;
    const cum = c.cum;
    if (!cum) return p * n;
    let lo = 0, hi = n;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= p) lo = m; else hi = m; }
    return lo + (p - cum[lo]) / (cum[hi] - cum[lo] || 1);
  };

  const baixa = (url, i) => (vivo ? fetch(url) : Promise.resolve(null))
    .then((r) => (r?.ok ? r.blob() : null))
    .then((b) => {
      if (!b || !vivo) return;
      blobs[i] = b;
      if (Math.abs(i - pedido) <= JANELA) agenda();
    }, () => {});

  /** baixa o manifest e o primeiro quadro (a promessa resolve com ele pronto); o resto segue por trás */
  c.carrega = () => {
    if (c.pronto) return c.pronto;
    c.pronto = fetch(`${base}/manifest.json`).then((r) => r.json()).then(async (m) => {
      c.total = m.count;
      c.largura = m.width;
      c.altura = m.height;
      c.cum = m.cum || null;
      blobs = new Array(m.count);
      const url = (i) => `${base}/${String(i + 1).padStart(4, '0')}.${m.ext}`;
      await baixa(url(pedido), pedido);
      if (vivo && blobs[pedido] && !bitmaps.has(pedido)) bitmaps.set(pedido, await createImageBitmap(blobs[pedido]));
      const ordem = [];
      const visto = new Set([pedido]);
      const poe = (i) => { if (!visto.has(i)) { visto.add(i); ordem.push(i); } };
      poe(0);
      poe(m.count - 1);
      for (let passo = 16; passo >= 1; passo /= 2) for (let i = 0; i < m.count; i += passo) poe(i);
      // antes do primeiro gesto: o começo inteiro e um quadro a cada 8; depois, o resto, do grosso para o fino
      const comeco = (i) => i < PRIMEIROS || i % 8 === 0 || i === m.count - 1;
      const fila = (lista) => Promise.all(Array.from({ length: simultaneos }, async () => {
        for (let i; (i = lista.shift()) !== undefined; ) await baixa(url(i), i);
      }));
      fila(ordem.filter(comeco)).then(quandoLivre).then(() => fila(ordem.filter((i) => !comeco(i))));
      return c;
    }).catch(() => c); // sem os quadros (rede fora), o capítulo fica vazio e o palco segura o último quadro desenhado
    return c.pronto;
  };

  return c;
}
