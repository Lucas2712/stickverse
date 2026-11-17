// Fotografa os cartões do mural (arquivos/fonte/cartoes.html) e grava em public/img/mural/01.webp … 06.webp.
// Os cartões são montados com as peças do próprio site (o mascote, os recortes, as fotos e as cores da marca):
// troque os textos e as imagens no cartoes.html, veja no navegador e só então fotografe.
//
//   npm install -D -E sharp@0.35.5 playwright@1.63.0   (uma vez só)
//   npx playwright install chromium                     (uma vez só: baixa o navegador que tira a foto)
//   npm run dev                                         (num terminal, e deixe rodando)
//   node arquivos/fonte/cartoes.mjs [http://localhost:5173]   (em outro terminal, da raiz do projeto)
//
// Sem vontade de instalar o navegador? Qualquer imagem em pé serve de cartão:
//   node arquivos/fonte/imagens.mjs mural <numero> <arquivo>
import sharp from 'sharp';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const base = (process.argv[2] ?? 'http://localhost:5173').replace(/\/$/, '');
const saida = join(process.cwd(), 'public', 'img', 'mural');

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 2000, height: 1300 }, deviceScaleFactor: 1 });
await pagina.goto(`${base}/arquivos/fonte/cartoes.html`, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);
await pagina.waitForTimeout(400);
await mkdir(saida, { recursive: true });
const cartoes = await pagina.locator('.cartao').all();
if (!cartoes.length) console.log('Não achei cartão nenhum: o servidor de desenvolvimento está no ar nesse endereço?');
for (const [i, cartao] of cartoes.entries()) {
  const png = await cartao.screenshot({ type: 'png' });
  const nome = `${String(i + 1).padStart(2, '0')}.webp`;
  await sharp(png).resize({ width: 612 }).webp({ quality: 78, effort: 6 }).toFile(join(saida, nome));
  console.log(`mural/${nome}`);
}
await navegador.close();
