// Sincroniza a timeline com a narração real.
// 1. python3 -I studio/ferramentas/transcrever.py projetos/kavora   (gera ../palavras.json)
// 2. node ferramentas/sincronizar.mjs                               (dentro de projetos/kavora/remotion)
// Procura as palavras-chave na ordem do roteiro, grava src/timing.json (voice: true),
// copia a narração para public/ e ajusta a duração (fim da fala + cartela).
import fs from 'node:fs';
import path from 'node:path';

const AQUI = path.resolve('.');
const PROJ = path.resolve(AQUI, '..');
const palavras = JSON.parse(fs.readFileSync(path.join(PROJ, 'palavras.json'), 'utf8'));
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

// [chave da timeline, palavra no roteiro]
const MAPA = [
  ['controlar', 'controlar'], ['gastos', 'gastos'], ['carro', 'carro'], ['nao', 'nao'], ['complicado', 'complicado'],
  ['com', 'com'], ['kavora', 'kavora'], ['combustivel', 'combustivel'], ['manutencao', 'manutencao'], ['seguro', 'seguro'],
  ['impostos', 'impostos'], ['revisoes', 'revisoes'], ['unico', 'unico'], ['aplicativo', 'aplicativo'],
  ['tenha', 'tenha'], ['controle', 'controle'], ['historico', 'historico'], ['economizar', 'economizar'], ['mesames', 'mes'],
  ['tudo', 'tudo'], ['palma', 'palma'], ['alertas', 'alertas'], ['inteligentes', 'inteligentes'], ['revisao', 'revisao'],
  ['kavora2', 'kavora'], ['tecnologia', 'tecnologia'], ['acompanha', 'acompanha'], ['caminho', 'caminho'],
  ['baixe', 'baixe'], ['assuma', 'assuma'],
];

const words = {};
let i = 0;
for (const [k, w] of MAPA) {
  while (i < palavras.length && norm(palavras[i].w) !== w) i++;
  if (i >= palavras.length) throw new Error(`palavra-chave não encontrada na transcrição: «${w}» (${k})`);
  words[k] = +palavras[i].s.toFixed(3);
  i++;
}
const fimFala = palavras[palavras.length - 1].e;
words.fim = +fimFala.toFixed(3);
const duration = Math.max(28.5, +(fimFala + 3.4).toFixed(2));

const ext = ['mp3', 'wav', 'm4a'].find((e) => fs.existsSync(path.join(PROJ, `narracao.${e}`)));
if (!ext) throw new Error('narração não encontrada em projetos/kavora/narracao.(mp3|wav|m4a)');
fs.copyFileSync(path.join(PROJ, `narracao.${ext}`), path.join(AQUI, 'public', `narracao.${ext}`));

fs.writeFileSync(path.join(AQUI, 'src', 'timing.json'), JSON.stringify({voice: true, duration, words}, null, 2) + '\n');
const assetsPath = path.join(AQUI, 'src', 'assets.json');
const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
assets.voice.file = `narracao.${ext}`;
fs.writeFileSync(assetsPath, JSON.stringify(assets, null, 2) + '\n');
console.log(`ok: ${Object.keys(words).length} marcas, duração ${duration}s, fala termina em ${fimFala.toFixed(2)}s`);
