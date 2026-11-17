// Converte as imagens novas para o formato e os tamanhos que o site usa, e grava em public/img/.
// Rode da raiz do projeto, depois de `npm install -D -E sharp@0.35.5` (uma vez só):
//
//   node arquivos/fonte/imagens.mjs produto <id> <arquivo>     o item da cena: recorte em fundo transparente (PNG)
//                                                              → public/img/produtos/<id>.webp e <id>-p.webp (a miniatura)
//   node arquivos/fonte/imagens.mjs hero <arquivo>             o lanche da primeira tela → public/img/produtos/hero.webp
//   node arquivos/fonte/imagens.mjs peca <nome> <arquivo>      um ingrediente solto, em fundo transparente
//                                                              → public/img/pecas/<nome>.webp
//   node arquivos/fonte/imagens.mjs foto <nome> <arquivo>      foto da casa (qualquer formato; sai em 3:2)
//                                                              → public/img/fotos/<nome>-640.webp e -1200.webp
//   node arquivos/fonte/imagens.mjs mural <numero> <arquivo>   cartão do mural (sai em 9:16, 612 × 1088)
//                                                              → public/img/mural/<numero>.webp
//   node arquivos/fonte/imagens.mjs folha <arquivo> <produtos|pecas> <colunas>x<linhas> <nome,nome,...>
//                                                              uma folha com vários itens em grade (como as das
//                                                              receitas): corta cada item e grava com o nome dado,
//                                                              da esquerda para a direita, de cima para baixo
//
// O <id> do produto é o `id` do item em src/config.js; o <nome> da peça é o que aparece na lista `pecas` do item.
// Recorte sem fundo transparente fica com um quadrado em volta: tire o fundo antes (qualquer removedor de fundo).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SAIDA = join(process.cwd(), 'public', 'img');
if (!existsSync(join(process.cwd(), 'public'))) {
  console.error('Rode da raiz do projeto (a pasta que tem public/ e src/).');
  process.exit(1);
}
const [modo, ...resto] = process.argv.slice(2);
const erro = (texto) => { console.error(texto); process.exit(1); };
const existe = (arquivo) => { if (!arquivo || !existsSync(arquivo)) erro(`Não achei o arquivo: ${arquivo ?? '(faltou o caminho)'}`); return arquivo; };
const kb = async (arquivo) => `${Math.round((await sharp(arquivo).toBuffer()).length / 1024)} KB`;

// recorte em fundo transparente: apara a sobra em volta e reduz para caber em `lado`
async function recorte(origem, pasta, nome, lado, miniatura) {
  await mkdir(join(SAIDA, pasta), { recursive: true });
  const imagem = sharp(origem).ensureAlpha();
  const { hasAlpha, channels } = await sharp(origem).metadata();
  if (!hasAlpha && channels < 4) console.warn(`  aviso: ${origem} não tem fundo transparente; o item vai sair com um quadrado em volta.`);
  const aparada = await imagem.trim({ threshold: 8 }).toBuffer().catch(() => imagem.toBuffer());
  const destino = join(SAIDA, pasta, `${nome}.webp`);
  await sharp(aparada).resize({ width: lado, height: lado, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(destino);
  console.log(`  ${pasta}/${nome}.webp (${await kb(destino)})`);
  if (miniatura) {
    const pequena = join(SAIDA, pasta, `${nome}-p.webp`);
    await sharp(aparada).resize({ width: 200, height: 200, fit: 'inside' }).webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(pequena);
    console.log(`  ${pasta}/${nome}-p.webp (${await kb(pequena)})`);
  }
}

// folha com vários itens em grade: acha as manchas de tinta pelo canal alfa, junta as que caem na mesma casa da
// grade (três picles soltos são um item só) e recorta a caixa do conjunto, apagando a ponta do vizinho
async function folha(origem, pasta, colunas, linhas, nomes, lado, miniatura) {
  const { data, info } = await sharp(origem).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const F = 4, w = Math.ceil(W / F), h = Math.ceil(H / F);
  const tinta = new Uint8Array(w * h);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 24) tinta[(y >> 2) * w + (x >> 2)] = 1;
  if (!tinta.includes(0)) erro('A folha não tem fundo transparente: não dá para separar os itens. Gere de novo com fundo transparente ou tire o fundo antes.');

  const manchas = [];
  const dona = new Int32Array(w * h).fill(-1);
  const fila = new Int32Array(w * h);
  for (let inicio = 0; inicio < w * h; inicio++) {
    if (!tinta[inicio] || dona[inicio] !== -1) continue;
    const id = manchas.length;
    let cabeca = 0, cauda = 0, n = 0, sx = 0, sy = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    fila[cauda++] = inicio; dona[inicio] = id;
    while (cabeca < cauda) {
      const p = fila[cabeca++], px = p % w, py = (p / w) | 0;
      n++; sx += px; sy += py;
      if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const qx = px + dx, qy = py + dy;
        if (qx < 0 || qy < 0 || qx >= w || qy >= h) continue;
        const q = qy * w + qx;
        if (tinta[q] && dona[q] === -1) { dona[q] = id; fila[cauda++] = q; }
      }
    }
    const casa = Math.min(linhas - 1, Math.floor((sy / n / h) * linhas)) * colunas + Math.min(colunas - 1, Math.floor((sx / n / w) * colunas));
    manchas.push({ n, casa, caixa: [x0, y0, x1, y1], fica: true });
  }
  // migalha solta (bem menor que a maior mancha da casa) não entra: costuma ser respingo
  for (let casa = 0; casa < nomes.length; casa++) {
    const maior = Math.max(0, ...manchas.filter((m) => m.casa === casa).map((m) => m.n));
    for (const m of manchas) if (m.casa === casa && m.n < maior * 0.06) m.fica = false;
  }

  await mkdir(join(SAIDA, pasta), { recursive: true });
  for (const [i, nome] of nomes.entries()) {
    const c = manchas.filter((m) => m.casa === i && m.fica).reduce((a, m) => (a
      ? [Math.min(a[0], m.caixa[0]), Math.min(a[1], m.caixa[1]), Math.max(a[2], m.caixa[2]), Math.max(a[3], m.caixa[3])]
      : [...m.caixa]), null);
    if (!c) { console.log(`  FALTOU ${nome}: a casa ${i + 1} da grade está vazia`); continue; }
    const folga = 10;
    const left = Math.max(0, c[0] * F - folga), top = Math.max(0, c[1] * F - folga);
    const width = Math.min(W, (c[2] + 1) * F + folga) - left, height = Math.min(H, (c[3] + 1) * F + folga) - top;
    const pedaco = Buffer.alloc(width * height * 4);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const de = ((top + y) * W + left + x) * 4, para = (y * width + x) * 4;
      const m = dona[((top + y) >> 2) * w + ((left + x) >> 2)];
      const meu = m === -1 || (manchas[m].casa === i && manchas[m].fica);
      pedaco[para] = data[de]; pedaco[para + 1] = data[de + 1]; pedaco[para + 2] = data[de + 2];
      pedaco[para + 3] = meu ? data[de + 3] : 0;
    }
    const item = sharp(pedaco, { raw: { width, height, channels: 4 } });
    await item.clone().resize({ width: lado, height: lado, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(join(SAIDA, pasta, `${nome}.webp`));
    if (miniatura) await item.clone().resize({ width: 200, height: 200, fit: 'inside' }).webp({ quality: 86, alphaQuality: 90, effort: 5 }).toFile(join(SAIDA, pasta, `${nome}-p.webp`));
    console.log(`  ${pasta}/${nome}.webp  (${width} × ${height} na folha)${miniatura ? ' e a miniatura' : ''}`);
  }
}

if (modo === 'produto') {
  const [id, arquivo] = resto;
  if (!id) erro('uso: node arquivos/fonte/imagens.mjs produto <id> <arquivo>');
  await recorte(existe(arquivo), 'produtos', id, 680, true);
} else if (modo === 'hero') {
  await recorte(existe(resto[0]), 'produtos', 'hero', 900, false);
} else if (modo === 'peca') {
  const [nome, arquivo] = resto;
  if (!nome) erro('uso: node arquivos/fonte/imagens.mjs peca <nome> <arquivo>');
  await recorte(existe(arquivo), 'pecas', nome, 440, false);
} else if (modo === 'foto') {
  const [nome, arquivo] = resto;
  if (!nome) erro('uso: node arquivos/fonte/imagens.mjs foto <nome> <arquivo>');
  existe(arquivo);
  await mkdir(join(SAIDA, 'fotos'), { recursive: true });
  for (const largura of [640, 1200]) {
    const destino = join(SAIDA, 'fotos', `${nome}-${largura}.webp`);
    await sharp(arquivo).rotate().resize({ width: largura, height: Math.round((largura * 2) / 3), fit: 'cover' }).webp({ quality: 80, effort: 5 }).toFile(destino);
    console.log(`  fotos/${nome}-${largura}.webp (${await kb(destino)})`);
  }
} else if (modo === 'mural') {
  const [numero, arquivo] = resto;
  if (!numero) erro('uso: node arquivos/fonte/imagens.mjs mural <numero> <arquivo>');
  existe(arquivo);
  await mkdir(join(SAIDA, 'mural'), { recursive: true });
  const nome = String(numero).padStart(2, '0');
  const destino = join(SAIDA, 'mural', `${nome}.webp`);
  await sharp(arquivo).rotate().resize({ width: 612, height: 1088, fit: 'cover' }).webp({ quality: 78, effort: 6 }).toFile(destino);
  console.log(`  mural/${nome}.webp (${await kb(destino)}); o número precisa estar na lista MURAL de src/config.js`);
} else if (modo === 'folha') {
  const [arquivo, pasta, grade, lista] = resto;
  const [colunas, linhas] = (grade ?? '').split('x').map(Number);
  const nomes = (lista ?? '').split(',').map((n) => n.trim()).filter(Boolean);
  if (!['produtos', 'pecas'].includes(pasta) || !colunas || !linhas || !nomes.length) erro('uso: node arquivos/fonte/imagens.mjs folha <arquivo> <produtos|pecas> <colunas>x<linhas> <nome,nome,...>');
  if (nomes.length > colunas * linhas) erro(`São ${nomes.length} nomes para ${colunas * linhas} casas.`);
  await folha(existe(arquivo), pasta, colunas, linhas, nomes, pasta === 'produtos' ? 680 : 440, pasta === 'produtos');
} else {
  erro('uso: node arquivos/fonte/imagens.mjs <produto|hero|peca|foto|mural|folha> ... (os exemplos estão no começo deste arquivo)');
}
