// Refaz o filme a partir dos nove clipes: os quadros deitados (computador) e os em pé (celular), com a curva de
// movimento de cada capítulo. Roda uma vez, depois do npm install; o site lê tudo de public/filme/.
// uso: npm run quadros [-- <pasta dos clipes>]      (padrão: arquivos/filme, ou ../arquivos/filme)
//   deitados: 1440 × 812, WebP qualidade 78, em public/filme/cN/
//   em pé: o recorte do meio do clipe em 9:16 (608 × 1080), WebP qualidade 70, em public/filme/retrato/cN/
// Ao lado dos clipes (cN.mp4, 1916 × 1080 a 24 fps, 121 quadros), curvas.json traz a curva de cada capítulo: a
// fração da rolagem em que cada quadro aparece, para a câmera andar em ritmo constante. Sem curvas.json (ou sem a
// curva de um clipe), o capítulo anda em ritmo linear.
// O quadro 0 do primeiro clipe vira também a foto do hero (public/img/galeria.webp e galeria-retrato.webp): parada no
// topo, a página mostra essa foto, e ela tem de ser o mesmo quadro em que o filme começa.
import { spawn } from 'node:child_process';
import { chmod, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { availableParallelism, tmpdir } from 'node:os';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import instalador from '@ffmpeg-installer/ffmpeg';
import sharp from 'sharp';

const pasta = resolve(process.argv[2] ?? (existsSync('arquivos/filme') ? 'arquivos/filme' : '../arquivos/filme'));
const curvas = existsSync(join(pasta, 'curvas.json')) ? JSON.parse(await readFile(join(pasta, 'curvas.json'), 'utf8')) : {};
const clipes = (await readdir(pasta)).filter((f) => /^c\d+\.mp4$/.test(f)).map((f) => f.slice(0, -4))
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
if (!clipes.length) throw new Error(`nenhum clipe c1.mp4, c2.mp4... em ${pasta}`);
const destino = resolve('public/filme');

// o ffmpeg vem pronto dentro do pacote @ffmpeg-installer (nada a instalar no sistema); se o npm não rodou o chmod de
// instalação dele, a permissão de executar é dada aqui
const ffmpeg = instalador.path;
if (process.platform !== 'win32') await chmod(ffmpeg, 0o755).catch(() => {});
const roda = (args) => new Promise((ok, falha) => {
  const p = spawn(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let erro = '';
  p.stderr.on('data', (d) => { erro += d; });
  p.on('error', falha);
  p.on('close', (c) => (c === 0 ? ok() : falha(new Error(`ffmpeg saiu com ${c}: ${erro.slice(-400)}`))));
});

for (const cap of clipes) {
  const cum = curvas[cap] ?? null;
  const tmp = await mkdtemp(join(tmpdir(), `filme-${cap}-`));
  try {
    await roda(['-v', 'error', '-i', join(pasta, `${cap}.mp4`), '-vf', 'fps=24', join(tmp, '%04d.png')]);
    const pngs = (await readdir(tmp)).filter((f) => f.endsWith('.png')).sort();
    if (cum && pngs.length !== cum.length) throw new Error(`${cap}: ${pngs.length} quadros no clipe, ${cum.length} na curva`);
    const { width, height } = await sharp(join(tmp, pngs[0])).metadata();
    const recorte = { left: Math.round((width - 608) / 2), top: Math.round((height - 1080) / 2), width: 608, height: 1080 };

    const conjuntos = [
      { nome: 'deitados', dir: join(destino, cap), w: 1440, h: 812, q: 78,
        faz: (img) => img.resize(1440, 812, { fit: 'fill', kernel: 'lanczos3' }) },
      { nome: 'em pé', dir: join(destino, 'retrato', cap), w: 608, h: 1080, q: 70, faz: (img) => img.extract(recorte) },
    ];
    for (const c of conjuntos) {
      await rm(c.dir, { recursive: true, force: true });
      await mkdir(c.dir, { recursive: true });
      let bytes = 0;
      const fila = [...pngs];
      await Promise.all(Array.from({ length: Math.max(2, availableParallelism() - 1) }, async () => {
        for (let f; (f = fila.shift()); ) {
          const info = await c.faz(sharp(join(tmp, f))).webp({ quality: c.q, effort: 6 }).toFile(join(c.dir, f.replace('.png', '.webp')));
          bytes += info.size;
        }
      }));
      const manifest = { count: pngs.length, fps: 24, width: c.w, height: c.h, ext: 'webp', bytes, cum };
      await writeFile(join(c.dir, 'manifest.json'), JSON.stringify(manifest));
      console.log(`${cap} ${c.nome}: ${pngs.length} quadros ${c.w} × ${c.h}, ${(bytes / 1e6).toFixed(1)} MB`);
    }
    if (cap === clipes[0]) {
      const zero = join(tmp, pngs[0]);
      await sharp(zero).webp({ quality: 86, effort: 6 }).toFile(resolve('public/img/galeria.webp'));
      await sharp(zero).extract(recorte).webp({ quality: 86, effort: 6 }).toFile(resolve('public/img/galeria-retrato.webp'));
      console.log('foto do hero: public/img/galeria.webp e galeria-retrato.webp (quadro 0 do primeiro clipe)');
    }
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}
console.log('pronto: public/filme/');
