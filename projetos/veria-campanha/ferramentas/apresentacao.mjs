// Monta marca/apresentacao.html (apresentação da identidade VÉRIA) com tudo embutido.
// Uso: node ferramentas/apresentacao.mjs
import fs from "fs";
import path from "path";
import { PROPOSTAS, contorno, uniformizar, larguraFita } from "../src/branding/compasso.js";

const R = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const svg = (n) => fs.readFileSync(path.join(R, "marca/svg", n), "utf8").replace(/<title>.*?<\/title>/, "").replace("<svg ", '<svg class="arte" ');
const b64 = (n, t) => `data:${t};base64,${fs.readFileSync(path.join(R, "marca/apresentacao", n)).toString("base64")}`;

const proposta = (k, cor) => {
  const g = PROPOSTAS[k]();
  const [x0, y0, x1, y1] = g.caixa, m = g.w;
  const vb = `${x0 - m} ${y0 - m} ${x1 - x0 + 2 * m} ${y1 - y0 + 2 * m}`;
  const corpo = g.fita ? `<path d="${contorno(uniformizar(g.pts, 400), larguraFita)}" fill="${cor}"/>` : `<path d="${g.d}" fill="none" stroke="${cor}" stroke-width="${g.w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<svg class="arte" viewBox="${vb}">${corpo}</svg>`;
};

const html = `<title>VÉRIA Identidade</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap">
<style>
/* Layout: livro de marca em faixas alternadas (off-white, roxo profundo, lavanda), uma ideia por faixa,
   pranchas de aplicação em grade que vira coluna no celular. Visual único e fixo da marca (não segue o tema). */
:root{
  --profundo:#24104B; --roxo:#5423A8; --violeta:#7541D8; --lavanda:#A987F0; --off:#F7F5FA; --cinza:#EAE7EF; --branco:#FFFFFF;
  --tinta:#24104B; --tinta2:#5E5672; --linha:#DDD7E8;
  --display:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif; --texto:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  color-scheme: light;
}
*{box-sizing:border-box}
body{background:var(--off);color:var(--tinta);font-family:var(--texto);font-size:16px;line-height:1.55;font-optical-sizing:auto}
.faixa{padding-block:72px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.miolo{max-width:1080px;margin:0 auto;display:grid;gap:28px}
.escura{background:var(--profundo);color:var(--branco)} .escura .rot,.escura p{color:#CDBEF5}
.lav{background:var(--lavanda)}
h1,h2{font-family:var(--display);font-weight:600;letter-spacing:-0.025em;line-height:1.02;margin:0;text-wrap:balance}
h1{font-size:clamp(44px,9vw,104px)} h2{font-size:clamp(30px,5vw,52px)}
h3{font-family:var(--display);font-weight:600;font-size:19px;margin:0}
p{margin:0;max-width:62ch;color:var(--tinta2)}
.rot{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--roxo)}
.arte{display:block;width:100%;height:auto}
.grade{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.prancha{border-radius:22px;padding:28px;display:grid;gap:14px;align-content:start;min-width:0}
.prancha .alvo{display:grid;place-items:center;min-height:180px}
.p-off{background:var(--branco);border:1px solid var(--linha)} .p-prof{background:var(--profundo);color:#fff} .p-roxo{background:var(--roxo);color:#fff} .p-lav{background:var(--lavanda)}
.p-prof .leg,.p-roxo .leg{color:#D9CCFA} .leg{font-size:13px;color:var(--tinta2)}
.hero{display:grid;gap:40px;grid-template-columns:1.1fr .9fr;align-items:center}
.hero video{width:100%;border-radius:28px;display:block;background:var(--profundo)}
.escolha{display:grid;gap:16px;grid-template-columns:repeat(3,minmax(0,1fr))}
.prop{border-radius:22px;padding:24px;background:var(--branco);border:1px solid var(--linha);display:grid;gap:12px;min-width:0}
.prop.ok{border:2px solid var(--roxo);box-shadow:0 18px 40px rgba(36,16,75,.12)}
.selo{justify-self:start;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:5px 10px;border-radius:99px;background:var(--cinza);color:var(--tinta2)}
.ok .selo{background:var(--roxo);color:#fff}
.tams{display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap}
.paleta{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.cor{border-radius:18px;padding:16px;min-height:120px;display:flex;flex-direction:column;justify-content:flex-end;font-size:13px;font-variant-numeric:tabular-nums}
.cor b{font-size:15px}
.tipo{display:grid;gap:10px}
.tipo .d{font-family:var(--display);font-weight:600;font-size:clamp(40px,7vw,72px);letter-spacing:-.025em;line-height:1}
.num{font-variant-numeric:tabular-nums;font-weight:600;font-size:30px}
.fotos{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.fotos figure{margin:0;border-radius:22px;overflow:hidden;background:var(--profundo)}
.fotos img{display:block;width:100%;height:auto}
.fotos figcaption{padding:12px 16px;font-size:13px;color:#D9CCFA}
ul.regras{margin:0;padding-left:18px;display:grid;gap:6px;color:var(--tinta2);max-width:70ch}
@media (max-width:760px){.hero,.escolha{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){video{display:none}}
</style>

<section class="faixa escura"><div class="miolo hero">
  <div style="display:grid;gap:22px">
    <span class="rot">Identidade · Studio Matteu para VÉRIA</span>
    <h1>O Compasso</h1>
    <p>Um único traço desce, faz a curva e sobe até terminar num pulso. É a linha de ritmo da campanha dobrada em um V. O mesmo pulso vira o acento do É, o marcador dos gráficos e a batida da linha nas animações.</p>
    <div style="max-width:420px">${svg("veria-horizontal-escuro.svg")}</div>
  </div>
  <video src="${b64("simbolo-animado.mp4", "video/mp4")}" autoplay muted loop playsinline aria-label="Animação: a linha de ritmo se dobra no símbolo e vira fita 3D"></video>
</div></section>

<section class="faixa"><div class="miolo">
  <span class="rot">Estudo · três caminhos para o Compasso</span>
  <h2>Escolhemos o traço geométrico.</h2>
  <div class="escolha">
    <div class="prop ok"><span class="selo">Escolhida · A</span><div style="padding:8px 18px">${proposta("A", "#5423A8")}</div><h3>Compasso</h3><p>Retas e arcos do mesmo raio. Lê bem a 16 px, é desenhável à mão e se transforma limpo a partir de uma senoide.</p></div>
    <div class="prop"><span class="selo">B</span><div style="padding:8px 18px">${proposta("B", "#A987F0")}</div><h3>Batida</h3><p>V mais aberto com o pulso deitado. Bonito em faixa horizontal, mas perde força no ícone quadrado e lembra um gráfico genérico.</p></div>
    <div class="prop"><span class="selo">C</span><div style="padding:8px 18px">${proposta("C", "#A987F0")}</div><h3>Fita</h3><p>Espessura variável, como cetim. Expressiva, mas as pontas finas somem em tamanhos pequenos. Ficou como inspiração para o volume 3D.</p></div>
  </div>
</div></section>

<section class="faixa" style="padding-top:0"><div class="miolo">
  <span class="rot">Assinaturas</span>
  <div class="grade">
    <div class="prancha p-off"><div class="alvo">${svg("veria-horizontal-claro.svg")}</div><span class="leg">Horizontal · fundo claro</span></div>
    <div class="prancha p-prof"><div class="alvo">${svg("veria-horizontal-escuro.svg")}</div><span class="leg">Horizontal · fundo escuro</span></div>
    <div class="prancha p-off"><div class="alvo" style="max-width:220px;margin:0 auto">${svg("veria-vertical-claro.svg")}</div><span class="leg">Vertical</span></div>
    <div class="prancha p-roxo"><div class="alvo" style="max-width:220px;margin:0 auto">${svg("veria-vertical-branco.svg")}</div><span class="leg">Monocromática branca</span></div>
    <div class="prancha p-off"><div class="alvo" style="max-width:220px;margin:0 auto">${svg("veria-vertical-roxo.svg")}</div><span class="leg">Monocromática roxa</span></div>
    <div class="prancha p-lav"><div class="alvo" style="max-width:220px;margin:0 auto">${svg("veria-vertical-profundo.svg")}</div><span class="leg">Sobre lavanda</span></div>
  </div>
</div></section>

<section class="faixa escura"><div class="miolo">
  <span class="rot">Símbolo e ícone</span>
  <h2>Reconhecível sem o nome.</h2>
  <div class="grade">
    <div class="prancha p-prof" style="border:1px solid #3B2470"><div class="alvo" style="max-width:240px;margin:0 auto">${svg("veria-simbolo-escuro.svg")}</div><span class="leg">Símbolo isolado</span></div>
    <div class="prancha p-prof" style="border:1px solid #3B2470"><div class="alvo"><div style="width:180px">${svg("veria-icone-app.svg")}</div></div><span class="leg">Ícone de aplicativo · traço 12% mais grosso</span></div>
    <div class="prancha p-off"><div class="alvo"><div class="tams">${[96, 48, 32, 20].map((s) => `<div style="width:${s}px">${svg("veria-simbolo-profundo.svg")}</div>`).join("")}</div></div><span class="leg">Teste de redução: 96, 48, 32 e 20 px</span></div>
  </div>
</div></section>

<section class="faixa"><div class="miolo">
  <span class="rot">O nome</span>
  <h2>VÉRIA, com o pulso no acento.</h2>
  <p>Inter Display Semibold redesenhada em contorno, com espaçamento ajustado à mão (diagonais do V e do A mais próximas, retas do E, R e I mais abertas). O acento agudo é uma onda delicada: sobe para a direita como um acento comum, por isso a leitura continua sendo É.</p>
  <div class="prancha p-off" style="padding:40px"><div style="max-width:640px">${svg("veria-nome-profundo.svg")}</div></div>
</div></section>

<section class="faixa lav"><div class="miolo">
  <span class="rot" style="color:var(--profundo)">Volume</span>
  <h2>A fita acetinada.</h2>
  <p style="color:var(--profundo)">Na campanha o símbolo ganha volume: seção levemente curva, gradiente violeta para lavanda, luz principal no alto à esquerda, brilho controlado e sombra tingida de roxo. A assinatura principal continua plana e funciona sem nenhum efeito.</p>
  <div class="fotos">
    <figure style="background:var(--off);max-width:560px"><img src="${b64("fita.jpg", "image/jpeg")}" alt="Símbolo VÉRIA como fita 3D acetinada"></figure>
  </div>
</div></section>

<section class="faixa escura"><div class="miolo">
  <span class="rot">Aplicações</span>
  <h2>No cartão, no app e no gráfico.</h2>
  <div class="fotos">
    <figure><img src="${b64("cartao.jpg", "image/jpeg")}" alt="Cartão VÉRIA em metal violeta com o símbolo em relevo"><figcaption>Cartão: símbolo em relevo, nome no canto, linha de ritmo gravada.</figcaption></figure>
    <figure><img src="${b64("app.jpg", "image/jpeg")}" alt="Tela inicial do app VÉRIA com saldo e movimentações"><figcaption>App: o símbolo no cabeçalho e a linha de ritmo no saldo.</figcaption></figure>
    <figure><img src="${b64("grafico.jpg", "image/jpeg")}" alt="Gráfico de evolução feito com a linha de ritmo"><figcaption>Gráfico de evolução: a mesma linha, agora estável.</figcaption></figure>
  </div>
</div></section>

<section class="faixa"><div class="miolo">
  <span class="rot">Sistema</span>
  <div class="paleta">
    <div class="cor" style="background:#24104B;color:#fff"><b>Roxo profundo</b>#24104B</div>
    <div class="cor" style="background:#5423A8;color:#fff"><b>Roxo principal</b>#5423A8</div>
    <div class="cor" style="background:#7541D8;color:#fff"><b>Violeta</b>#7541D8</div>
    <div class="cor" style="background:#A987F0;color:#24104B"><b>Lavanda</b>#A987F0</div>
    <div class="cor" style="background:#F7F5FA;color:#24104B;border:1px solid var(--linha)"><b>Off-white</b>#F7F5FA</div>
    <div class="cor" style="background:#EAE7EF;color:#24104B"><b>Cinza suave</b>#EAE7EF</div>
  </div>
  <div class="grade">
    <div class="prancha p-off tipo"><span class="leg">Inter Display · títulos · 600</span><span class="d">Seu ritmo.</span></div>
    <div class="prancha p-off tipo"><span class="leg">Inter · interface · números tabulares</span><span class="num">R$ 4.280,50</span><span class="leg">Saldo disponível · valores ilustrativos</span></div>
  </div>
  <h3>A linha de ritmo</h3>
  <ul class="regras">
    <li>Sempre conta algo: um pulso, uma transição entre ideias, a evolução num gráfico. Nunca é enfeite de fundo.</li>
    <li>Estados: ponto que pulsa, onda com cristas, ruído (problema), senoide (equilíbrio), símbolo, curva de evolução, respiração.</li>
    <li>Traço com pontas redondas; em fundos escuros, lavanda para branco com brilho suave; em fundos claros, roxo principal.</li>
  </ul>
  <p class="leg">VÉRIA é uma marca fictícia criada para uma campanha conceitual do Studio Matteu.</p>
</div></section>
`;
fs.writeFileSync(path.join(R, "marca/apresentacao.html"), html);
console.log("ok", (html.length / 1024).toFixed(0), "KB");
