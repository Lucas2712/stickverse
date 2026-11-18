// Junta os quadros de cada capítulo do filme em dois pacotes, para hospedagens com limite de arquivos (o Artifact
// do claude.ai aceita no máximo 511): "a" leva o começo do capítulo e um quadro a cada 8 (o que desce antes do
// primeiro gesto), "b" leva o resto. O manifest.json ganha a lista de onde cada quadro está; src/motion/quadros.js
// lê os dois formatos. Roda sobre o build pronto: npm run build && npm run pacotes   (padrão: dist/filme)
// Com --base64, cada pacote vira um .json com os bytes em base64 (para hospedagens que não servem .bin, como o
// Artifact): ~33% maior, mas um tipo que qualquer hospedagem serve.
import { readdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const B64 = args.includes('--base64');
const raiz = resolve(args.find((a) => !a.startsWith('--')) ?? 'dist/filme');
const PRIMEIROS = 16; // igual ao de src/motion/quadros.js
const comeco = (i, n) => i < PRIMEIROS || i % 8 === 0 || i === n - 1;

async function capitulos(dir) {
  const achados = [];
  for (const nome of await readdir(dir)) {
    const p = join(dir, nome);
    if (!(await stat(p)).isDirectory()) continue;
    if ((await readdir(p)).includes('manifest.json')) achados.push(p);
    else achados.push(...(await capitulos(p)));
  }
  return achados;
}

let arquivos = 0;
for (const dir of await capitulos(raiz)) {
  const m = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
  if (m.pacotes) continue;
  const nome = (i) => `${String(i + 1).padStart(4, '0')}.${m.ext}`;
  m.pacotes = [];
  for (const [arq, quer] of [[B64 ? 'a.json' : 'a.bin', true], [B64 ? 'b.json' : 'b.bin', false]]) {
    const partes = [], quadros = [];
    let off = 0;
    for (let i = 0; i < m.count; i++) {
      if (comeco(i, m.count) !== quer) continue;
      const buf = await readFile(join(dir, nome(i)));
      quadros.push([i, off, buf.length]);
      partes.push(buf);
      off += buf.length;
    }
    const dados = Buffer.concat(partes);
    await writeFile(join(dir, arq), B64 ? JSON.stringify(dados.toString('base64')) : dados);
    m.pacotes.push({ arq, quadros });
    arquivos++;
  }
  for (let i = 0; i < m.count; i++) await rm(join(dir, nome(i)));
  await writeFile(join(dir, 'manifest.json'), JSON.stringify(m));
}
console.log(`pronto: ${arquivos} pacotes em ${raiz}`);
