// Monta saida/comercial-go.html: bundle do Three.js + fontes + faixa de efeitos (se existir) num arquivo único.
import { build } from 'esbuild'; import fs from 'fs';
fs.mkdirSync('saida', { recursive: true });
const r = await build({ entryPoints: ['src/main.js'], bundle: true, minify: true, format: 'iife', write: false, loader: { '.json': 'json' }, target: 'es2020', legalComments: 'none' });
const js = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const f = n => fs.readFileSync('fontes/' + n + '.woff2').toString('base64');
const sfx = fs.existsSync('saida/efeitos.mp3') ? `window.__SFX_B64="${fs.readFileSync('saida/efeitos.mp3').toString('base64')}";` : '';
let html = fs.readFileSync('src/pagina.html', 'utf8')
  .replace('__F_DXB__', f('InterDisplay-ExtraBold')).replace('__F_DBL__', f('InterDisplay-Black')).replace('__F_TM__', f('Inter-Medium')).replace('__F_TS__', f('Inter-SemiBold'));
html = html.split('__SFX__').join(sfx); html = html.replace('__JS__', () => js);
fs.writeFileSync('saida/comercial-go.html', html);
console.log('ok saida/comercial-go.html', (html.length / 1e6).toFixed(2), 'MB', sfx ? '(com efeitos)' : '(sem efeitos)');
