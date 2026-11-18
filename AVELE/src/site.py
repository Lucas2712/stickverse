"""AVELÉ · gera o website institucional (08-Website/index.html) a partir do logo e dos dados das fragrâncias."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import logo
from botanica import SYMBOLS
from frasco import FR, DATA

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "08-Website", "index.html")

d, (x0, y0, w, h) = logo.wordmark()
LOGO = f'<svg class="wm" viewBox="{x0} {y0} {w} {h}" role="img" aria-label="AVELÉ"><path d="{d}"/></svg>'
logo.set_optical(True)
d2, _ = logo.wordmark()
logo.set_optical(False)
LOGO_SM = f'<svg class="wm" viewBox="{x0} {y0} {w} {h}" role="img" aria-label="AVELÉ"><path d="{d2}"/></svg>'
DROP = f'<svg class="drop" viewBox="190 -290 190 250" aria-hidden="true"><path d="{logo.drop(214, -70, 352, -262, 40)}"/></svg>'
mono = logo.svg_monogram(fill="currentColor")


def sym(key):
    s = SYMBOLS[key]().svg(ink="currentColor", bg="var(--paper)", sw=1.5)
    return s.replace("<svg ", '<svg class="sym" aria-hidden="true" ')


SLUG = {"ROSÉE": "rosee", "ÉCLAT": "eclat", "OMBRE": "ombre", "HÉRITAGE": "heritage", "AUBE": "aube", "SILLAGE": "sillage"}
frs = []
for f in DATA["fragrancias"]:
    g = dict(f)
    g["slug"] = SLUG[f["nome"]]
    g["kv"] = f"assets/kv-{f['n']}-{g['slug']}.jpg"
    g["bottle"] = f"assets/frasco-{f['n']}.webp"
    g["sym"] = sym(f["simbolo"])
    frs.append(g)

HTML = r"""<title>AVELÉ Maison de Parfum</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="AVELÉ, casa conceitual de perfumaria de luxo seletivo. L’élégance est une essence. Projeto de Studio Matteu.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap">
<style>
/* Layout: casa editorial em marfim; faixas de largura total que alternam marfim, areia e marrom; o produto conduz cada seção. Tema único por escolha da marca. */
:root{
  --ivory:#F4EFE5; --sand:#E9DECB; --paper:#F4EFE5; --champagne:#D8C4A0; --brown:#49372D; --brown-2:#2F231C; --ink-soft:#6E5A4D;
  --serif:"Cormorant Garamond","Cormorant",Garamond,"Times New Roman",serif;
  --sans:"Inter","InterA",system-ui,-apple-system,"Segoe UI",sans-serif;
  --gut:max(16px,env(safe-area-inset-left,0px)); --gut-r:max(16px,env(safe-area-inset-right,0px));
  --wrap:1240px; color-scheme:light;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ivory);color:var(--brown);font-family:var(--sans);font-weight:300;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:60;background:var(--ivory)}
img,video{max-width:100%;display:block}
a{color:inherit}
:focus-visible{outline:1px solid var(--brown);outline-offset:4px}
.wm{fill:currentColor;display:block;width:100%;height:auto}
.drop{fill:currentColor;width:14px;height:auto;display:inline-block}
.sym{width:100%;height:auto;display:block}
.wrap{max-width:var(--wrap);margin:0 auto;padding-left:var(--gut);padding-right:var(--gut-r)}
.eyebrow{font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:.32em;text-transform:uppercase}
h1,h2,h3{font-family:var(--serif);font-weight:400;line-height:1.05;margin:0;text-wrap:balance}
h2{font-size:clamp(40px,6vw,76px);letter-spacing:-.005em}
h3{font-size:clamp(26px,3vw,34px)}
p{margin:0;max-width:62ch}
.it{font-family:var(--serif);font-style:italic}
.btn{display:inline-flex;align-items:center;gap:14px;font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;padding:16px 26px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer;transition:background .4s,color .4s}
.btn:hover{background:var(--brown);color:var(--ivory)}
.on-dark .btn:hover{background:var(--ivory);color:var(--brown)}

/* navegação */
.nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:50;background:color-mix(in srgb,var(--ivory) 88%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid color-mix(in srgb,var(--brown) 12%,transparent)}
.nav .wrap{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:68px}
.nav .brand{width:118px;justify-self:center;color:var(--brown)}
.nav ul{list-style:none;margin:0;padding:0;display:flex;gap:28px}
.nav ul a{text-decoration:none;font-size:11px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;opacity:.8}
.nav ul a:hover{opacity:1}
.nav .right{justify-self:end}
.menu-btn{display:none;background:none;border:0;color:var(--brown);font:500 11px var(--sans);letter-spacing:.24em;text-transform:uppercase;cursor:pointer;padding:8px 0}
.mnav{position:fixed;inset:0;z-index:70;background:var(--brown);color:var(--ivory);display:flex;flex-direction:column;justify-content:center;gap:10px;padding:max(24px,env(safe-area-inset-top,0px)) var(--gut-r) 24px var(--gut)}
.mnav a{font-family:var(--serif);font-size:42px;text-decoration:none;line-height:1.2}
.mnav button{position:absolute;top:calc(18px + env(safe-area-inset-top,0px));right:calc(16px + env(safe-area-inset-right,0px));background:none;border:0;color:var(--ivory);font:500 11px var(--sans);letter-spacing:.24em;text-transform:uppercase;cursor:pointer}

/* abertura */
.intro{position:fixed;inset:0;z-index:90;background:var(--brown);color:var(--champagne);display:grid;place-items:center;transition:opacity 1.2s ease,visibility 1.2s}
.intro .in{width:min(60vw,420px);text-align:center}
.intro .wm{opacity:0;animation:rise 1.6s .2s ease forwards}
.intro .it{display:block;margin-top:22px;font-size:20px;color:var(--ivory);opacity:0;animation:rise 1.4s 1s ease forwards}
.intro.gone{opacity:0;visibility:hidden}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* hero com filme */
.hero{position:relative;background:var(--brown-2);color:var(--ivory);overflow:hidden}
.hero video,.hero .poster{width:100%;height:min(84vh,860px);min-height:520px;object-fit:cover}
.hero .shade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(47,35,28,.25),rgba(47,35,28,0) 30%,rgba(47,35,28,.1) 60%,rgba(47,35,28,.7))}
.hero .copy{position:absolute;left:0;right:0;bottom:0;padding-bottom:clamp(28px,6vh,64px)}
.hero .copy .wrap{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.hero h1{font-style:italic;font-weight:300;font-size:clamp(34px,5vw,64px)}
.hero .ctrl{display:flex;gap:12px;flex-wrap:wrap}
.hero .sound{border-color:color-mix(in srgb,var(--ivory) 60%,transparent)}

/* essência */
.essence{padding-block:clamp(72px,12vw,160px)}
.essence .grid{display:grid;grid-template-columns:5fr 6fr;gap:clamp(32px,6vw,96px);align-items:center}
.essence figure{margin:0;position:relative}
.essence figure img{aspect-ratio:3/4;object-fit:cover;width:100%}
.essence figcaption{position:absolute;left:-14px;bottom:28px;background:var(--ivory);padding:14px 18px;font-size:12px;letter-spacing:.06em;max-width:240px}
.essence .text{display:grid;gap:26px;min-width:0}
.essence .lead{font-family:var(--serif);font-size:clamp(24px,2.6vw,32px);line-height:1.3;font-weight:400}
.essence .accent{display:flex;align-items:center;gap:18px;padding-top:12px;border-top:1px solid color-mix(in srgb,var(--brown) 20%,transparent)}
.essence .accent .big{width:120px;flex:none}
.essence .accent p{font-size:14px}

/* faixa institucional */
.manifest{background:var(--brown);color:var(--ivory)}
.manifest .wrap{display:grid;grid-template-columns:1fr 1fr;align-items:stretch}
.manifest img{width:100%;height:100%;object-fit:cover;min-height:420px}
.manifest .q{padding:clamp(40px,7vw,110px) 0 clamp(40px,7vw,110px) clamp(24px,5vw,80px);display:grid;align-content:center;gap:22px;min-width:0}
.manifest blockquote{margin:0;font-family:var(--serif);font-style:italic;font-weight:300;font-size:clamp(34px,4.6vw,60px);line-height:1.08}
.manifest .eyebrow{color:var(--champagne)}

/* coleção */
.collection{padding-block:clamp(72px,11vw,150px)}
.collection header{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:44px}
.filters{display:flex;gap:6px;flex-wrap:wrap}
.filters button{background:none;border:1px solid color-mix(in srgb,var(--brown) 25%,transparent);color:var(--brown);font:500 10.5px var(--sans);letter-spacing:.22em;text-transform:uppercase;padding:10px 16px;cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--brown);color:var(--ivory);border-color:var(--brown)}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,2.4vw,32px)}
.card{text-decoration:none;display:grid;gap:16px}
.card .ph{overflow:hidden;aspect-ratio:3/4;background:var(--sand)}
.card .ph img{width:100%;height:100%;object-fit:cover;transition:transform 1.4s cubic-bezier(.2,.7,.2,1)}
.card:hover .ph img{transform:scale(1.04)}
.card .meta{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.card .name{font-family:var(--serif);font-size:30px;letter-spacing:.12em}
.card .fam{font-size:12px;letter-spacing:.06em;color:var(--ink-soft);text-align:right}
.card .n{font-size:10.5px;letter-spacing:.3em;font-weight:500}

/* página da fragrância */
.frag{position:fixed;inset:0;z-index:80;background:var(--ivory);overflow-y:auto;-webkit-overflow-scrolling:touch}
.frag .bar{position:sticky;top:0;z-index:2;background:var(--ivory);border-bottom:1px solid color-mix(in srgb,var(--brown) 12%,transparent);padding-top:env(safe-area-inset-top,0px)}
.frag .bar .wrap{height:64px;display:flex;justify-content:space-between;align-items:center}
.frag .bar a{text-decoration:none;font:500 11px var(--sans);letter-spacing:.24em;text-transform:uppercase}
.frag .bar .brand{width:96px}
.frag .top{display:grid;grid-template-columns:1fr 1fr;min-height:80vh}
.frag .top .img{position:relative;background:var(--sand)}
.frag .top .img img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.frag .top .info{padding:clamp(32px,6vw,90px) var(--gut-r) clamp(32px,6vw,90px) clamp(24px,5vw,80px);display:grid;align-content:center;gap:22px;min-width:0}
.frag .top .sym{width:84px}
.frag h1{font-size:clamp(54px,7vw,104px);letter-spacing:.1em;font-weight:400}
.frag .concept{font-family:var(--serif);font-size:clamp(22px,2.2vw,28px);line-height:1.35}
.frag .pyr{padding-block:clamp(60px,9vw,120px);background:var(--sand)}
.frag .pyr .wrap{display:grid;grid-template-columns:5fr 7fr;gap:clamp(32px,6vw,90px);align-items:center}
.frag .pyr .bottle{justify-self:center;max-width:300px;filter:drop-shadow(0 30px 30px rgba(47,35,28,.25))}
.tiers{display:grid;gap:0;min-width:0}
.tier{display:grid;grid-template-columns:110px 1fr;gap:20px;padding:22px 0;border-top:1px solid color-mix(in srgb,var(--brown) 22%,transparent)}
.tier:last-child{border-bottom:1px solid color-mix(in srgb,var(--brown) 22%,transparent)}
.tier .eyebrow{padding-top:8px}
.tier .notes{font-family:var(--serif);font-size:clamp(22px,2.4vw,30px);line-height:1.25}
.tier small{display:block;font-family:var(--sans);font-size:12px;color:var(--ink-soft);margin-top:4px}
.frag .pn{display:flex;justify-content:space-between;gap:16px;padding-block:40px}
.frag .pn a{text-decoration:none;font-family:var(--serif);font-size:24px}
.frag .pn span{display:block;font:500 10.5px var(--sans);letter-spacing:.24em;text-transform:uppercase;opacity:.7}

/* linha corporal */
.body-line{background:var(--sand);padding-block:clamp(72px,11vw,150px)}
.body-line .grid{display:grid;grid-template-columns:6fr 5fr;gap:clamp(32px,6vw,90px);align-items:center}
.body-line .grid > img{aspect-ratio:3/4;object-fit:cover;width:100%}
.prods{display:grid;gap:0;margin-top:28px}
.prod{display:grid;grid-template-columns:1fr auto;gap:12px;padding:20px 0;border-top:1px solid color-mix(in srgb,var(--brown) 22%,transparent)}
.prod:last-child{border-bottom:1px solid color-mix(in srgb,var(--brown) 22%,transparent)}
.prod b{font-family:var(--serif);font-weight:500;font-size:24px;display:block}
.prod span{font-size:13px;color:var(--ink-soft)}
.prod em{font-style:normal;font-size:11px;letter-spacing:.2em;align-self:center}

/* história */
.story{position:relative;color:var(--ivory);background:var(--brown-2)}
.story > img{width:100%;height:min(80vh,760px);min-height:460px;object-fit:cover;opacity:.55}
.story .over{position:absolute;inset:0;display:flex;align-items:center}
.story .over .wrap{width:100%}
.story h2{max-width:14ch}
.chapters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(20px,4vw,60px);padding-block:clamp(56px,8vw,110px)}
.chapters article{display:grid;gap:14px;align-content:start;min-width:0}
.chapters h3{font-style:italic}
.chapters p{font-size:15px}

/* contato */
.contact{padding-block:clamp(72px,11vw,150px);border-top:1px solid color-mix(in srgb,var(--brown) 12%,transparent)}
.contact .grid{display:grid;grid-template-columns:5fr 7fr;gap:clamp(32px,6vw,90px)}
form{display:grid;grid-template-columns:1fr 1fr;gap:22px 24px;min-width:0}
.field{display:grid;gap:8px;min-width:0}
.field.full{grid-column:1/-1}
label{font:500 10.5px var(--sans);letter-spacing:.24em;text-transform:uppercase}
input,select,textarea{font:300 16px var(--sans);color:var(--brown);background:transparent;border:0;border-bottom:1px solid color-mix(in srgb,var(--brown) 40%,transparent);padding:10px 0;border-radius:0;width:100%}
textarea{min-height:110px;resize:vertical}
input:focus,select:focus,textarea:focus{outline:none;border-bottom-color:var(--brown)}
.err{font-size:12px;color:#8A3B26;min-height:1em}
.note{grid-column:1/-1;font-size:13px;color:var(--ink-soft);border-left:2px solid var(--champagne);padding-left:14px}

footer{background:var(--brown);color:var(--champagne);padding-block:clamp(56px,8vw,100px) calc(40px + env(safe-area-inset-bottom,0px))}
footer .wrap{display:grid;gap:28px;justify-items:center;text-align:center}
footer .brand{width:min(70vw,420px)}
footer .it{font-size:24px;color:var(--ivory)}
footer small{font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.8;line-height:2}

.reveal{transition:transform 1.2s cubic-bezier(.2,.7,.2,1),opacity 1.2s}
.reveal.pre{transform:translateY(18px);opacity:.25}

@media (max-width:900px){
  .nav ul{display:none} .menu-btn{display:block}
  .essence .grid,.manifest .wrap,.body-line .grid,.contact .grid,.frag .top,.frag .pyr .wrap{grid-template-columns:1fr}
  .manifest .q{padding-left:0}
  .cards{grid-template-columns:repeat(2,minmax(0,1fr))}
  .chapters{grid-template-columns:1fr}
  .frag .top .img{min-height:70vh}
  .frag .top .info{padding-left:var(--gut)}
  .essence figcaption{left:0}
}
@media (max-width:560px){
  .cards{grid-template-columns:1fr}
  form{grid-template-columns:1fr}
  .tier{grid-template-columns:1fr;gap:4px}
  .nav .brand{width:96px}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.reveal.pre{transform:none;opacity:1}.intro{display:none}}
</style>

<div class="intro" id="intro" aria-hidden="true"><div class="in">%LOGO%<span class="it">L’élégance est une essence.</span></div></div>

<nav class="nav" aria-label="Principal"><div class="wrap">
  <ul><li><a href="#essencia">Nossa essência</a></li><li><a href="#colecao">Coleção</a></li><li><a href="#corpo">Corps</a></li></ul>
  <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="mnav">Menu</button>
  <a class="brand" href="#inicio" aria-label="AVELÉ, início">%LOGO_SM%</a>
  <ul class="right"><li><a href="#historia">História</a></li><li><a href="#contato">Contato</a></li></ul>
</div></nav>
<div class="mnav" id="mnav" hidden>
  <button id="menuClose">Fechar</button>
  <a href="#essencia">Nossa essência</a><a href="#colecao">Coleção</a><a href="#corpo">Linha corporal</a><a href="#historia">História</a><a href="#contato">Contato</a>
</div>

<main id="inicio">
<section class="hero on-dark" aria-label="Filme AVELÉ">
  <video id="film" autoplay muted loop playsinline preload="auto" poster="assets/kv-08-colecao-wide.jpg"><source src="assets/avele-filme-30s.mp4" type="video/mp4"></video>
  <div class="shade"></div>
  <div class="copy"><div class="wrap">
    <div><div class="eyebrow" style="color:var(--champagne)">Maison de parfum · La collection</div><h1>L’élégance est une essence.</h1></div>
    <div class="ctrl"><a class="btn" href="#colecao">Descobrir a coleção</a><button class="btn sound" id="soundBtn" aria-pressed="false">Ouvir o filme</button></div>
  </div></div>
</section>

<section class="essence" id="essencia"><div class="wrap grid">
  <figure class="reveal"><img src="assets/23-romantica-petala-orvalho.jpg" alt="Gota de orvalho prestes a cair de uma pétala de rosa" loading="lazy"><figcaption>A gota que cai em diagonal é o acento do É.</figcaption></figure>
  <div class="text reveal">
    <div class="eyebrow">Nossa essência</div>
    <h2>O que fica quando você sai.</h2>
    <p class="lead">Elegância de verdade não está no que aparece. Está no que permanece: um gesto, um rastro, uma lembrança na pele.</p>
    <p>AVELÉ é uma casa de perfumaria de luxo seletivo de inspiração francesa. Desenhamos fragrâncias como quem escreve uma carta à mão: devagar, com matérias nobres e frases curtas. Feito para a pele, não para a vitrine.</p>
    <div class="accent"><div class="big">%DROP_BIG%</div><p>Num nome feito só de retas, o acento agudo é o único traço inclinado. É ele que guarda o perfume: a essência que toca a pele.</p></div>
  </div>
</div></section>

<section class="manifest on-dark" aria-label="Assinatura"><div class="wrap">
  <img src="assets/kv-00-institucional.jpg" alt="Frasco AVELÉ SILLAGE sobre pedestal de travertino diante de veludo marrom" loading="lazy">
  <div class="q reveal"><div class="eyebrow">La signature</div><blockquote>L’élégance<br>est une essence.</blockquote><p class="it" style="font-size:20px;color:var(--champagne)">A elegância é uma essência.</p></div>
</div></section>

<section class="collection" id="colecao"><div class="wrap">
  <header><div><div class="eyebrow">La collection · Six eaux de parfum</div><h2>Coleção</h2></div>
  <div class="filters" role="group" aria-label="Filtrar por linha">
    <button data-f="all" aria-pressed="true">Todas</button><button data-f="Féminin" aria-pressed="false">Féminin</button><button data-f="Masculin" aria-pressed="false">Masculin</button><button data-f="Unisexe" aria-pressed="false">Unisexe</button>
  </div></header>
  <div class="cards" id="cards"></div>
</div></section>

<section class="body-line" id="corpo"><div class="wrap grid">
  <img class="reveal" src="assets/kv-09-linha-corporal.jpg" alt="Loção, sabonete líquido e creme ROSÉE sobre bancada de travertino" loading="lazy">
  <div class="reveal">
    <div class="eyebrow">Corps</div>
    <h2>A mesma assinatura, na pele inteira.</h2>
    <p style="margin-top:22px">Cada uma das seis fragrâncias ganha uma linha corporal com a mesma identidade dos perfumes: vidro âmbar, válvula champagne e etiqueta na cor da linha.</p>
    <div class="prods">
      <div class="prod"><div><b>Crème pour le corps</b><span>Hidratante corporal · textura de seda</span></div><em>200 ml</em></div>
      <div class="prod"><div><b>Savon liquide</b><span>Sabonete líquido · espuma leve</span></div><em>300 ml</em></div>
      <div class="prod"><div><b>Lotion parfumée</b><span>Loção perfumada · véu luminoso</span></div><em>200 ml</em></div>
    </div>
  </div>
</div></section>

<section class="story on-dark" id="historia">
  <img src="assets/25-interior-salao.jpg" alt="Salão clássico com boiseries e luz de fim de tarde" loading="lazy">
  <div class="over"><div class="wrap"><div class="eyebrow" style="color:var(--champagne)">História da marca</div><h2 style="margin-top:18px">Uma casa imaginada à luz de fim de tarde.</h2></div></div>
</section>
<section style="background:var(--brown);color:var(--ivory)"><div class="wrap chapters">
  <article class="reveal"><div class="eyebrow" style="color:var(--champagne)">O nome</div><h3>Cinco letras retas.</h3><p>AVELÉ soa francês e termina na tônica. A-V-E-L-É: hastes retas, um único acento. O nome foi desenhado letra por letra, sem partir de uma fonte pronta.</p></article>
  <article class="reveal"><div class="eyebrow" style="color:var(--champagne)">A gota</div><h3>O acento como essência.</h3><p>O traço do É virou o símbolo da casa. Ele aparece no orvalho da ROSÉE, no selo das caixas e no último plano do filme.</p></article>
  <article class="reveal"><div class="eyebrow" style="color:var(--champagne)">A casa</div><h3>Tradição sem pressa.</h3><p>Marfim, champagne e marrom profundo. Luz rasante em salões de boiseries. O âmbar do vidro é a única fonte de calor.</p></article>
</div></section>

<section class="contact" id="contato"><div class="wrap grid">
  <div><div class="eyebrow">Contato</div><h2 style="margin-top:14px">Conciergerie</h2><p style="margin-top:22px">Agende uma consulta olfativa ou peça orientação sobre a coleção.</p></div>
  <form id="form" novalidate>
    <div class="field"><label for="f-name">Nome</label><input id="f-name" name="name" autocomplete="name" required><span class="err" id="e-name"></span></div>
    <div class="field"><label for="f-mail">E-mail</label><input id="f-mail" name="email" type="email" autocomplete="email" required><span class="err" id="e-mail"></span></div>
    <div class="field full"><label for="f-int">Interesse</label><select id="f-int" name="interest"><option>Consulta olfativa</option><option>Coleção Eau de Parfum</option><option>Linha corporal</option><option>Presente</option></select></div>
    <div class="field full"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="message"></textarea></div>
    <div class="field full"><button class="btn" type="submit" style="justify-self:start">Enviar pedido</button></div>
    <p class="note" id="formNote">AVELÉ é um projeto conceitual. Este formulário é demonstrativo: o pedido é validado na página e nenhuma mensagem é enviada.</p>
  </form>
</div></section>
</main>

<footer><div class="wrap">
  <div class="brand">%LOGO%</div>
  <div class="it">L’élégance est une essence.</div>
  <small>Projeto conceitual autoral · Não é uma marca comercial lançada<br>Created by Studio Matteu</small>
</div></footer>

<div class="frag" id="frag" hidden role="dialog" aria-modal="true" aria-labelledby="fragName"></div>

<script>
const FR = %DATA%;
const LOGO_SM = %LOGO_SM_JSON%;
const cards = document.getElementById('cards');
function cardHTML(f){return `<a class="card reveal" href="#${f.slug}" data-l="${f.linha}"><div class="ph"><img src="${f.kv}" alt="Frasco AVELÉ ${f.nome} em cena de campanha" loading="lazy"></div><div class="meta"><div><div class="n">N° ${f.n} · ${f.linha}</div><div class="name">${f.nome}</div></div><div class="fam">${f.familia}</div></div></a>`}
cards.innerHTML = FR.map(cardHTML).join('');
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const v=b.dataset.f; cards.querySelectorAll('.card').forEach(c=>{c.hidden = v!=='all' && c.dataset.l!==v});
}));

const frag=document.getElementById('frag');
function fragHTML(f,i){
  const p=FR[(i+FR.length-1)%FR.length], n=FR[(i+1)%FR.length];
  const tier=(lab,pt,arr)=>`<div class="tier"><div class="eyebrow">${lab}<small>${pt}</small></div><div class="notes">${arr.join(' · ')}</div></div>`;
  return `<div class="bar"><div class="wrap"><a href="#colecao">← Coleção</a><a class="brand" href="#inicio" aria-label="AVELÉ">${LOGO_SM}</a><a href="#colecao" aria-label="Fechar">Fechar</a></div></div>
  <div class="top"><div class="img"><img src="${f.kv}" alt="AVELÉ ${f.nome} em cena de campanha"></div>
  <div class="info"><div class="sym" style="width:84px">${f.sym}</div><div class="eyebrow">N° ${f.n} · ${f.linha} · Eau de Parfum 100 ml</div>
  <h1 id="fragName">${f.nome}</h1><div class="it" style="font-size:22px">${f.familiaFr} · ${f.traducao}</div>
  <p class="concept">${f.conceito}</p><p>${f.sensorial}</p><p style="font-size:14px;color:var(--ink-soft)">Personalidade: ${f.personalidade}</p></div></div>
  <section class="pyr"><div class="wrap"><img class="bottle" src="${f.bottle}" alt="Frasco AVELÉ ${f.nome}">
  <div><div class="eyebrow" style="margin-bottom:18px">Pirâmide olfativa conceitual</div><div class="tiers">${tier('Tête','Saída',f.saida)}${tier('Cœur','Coração',f.coracao)}${tier('Fond','Fundo',f.fundo)}</div>
  <p style="margin-top:18px;font-size:13px;color:var(--ink-soft)">Símbolo: ${f.simboloPt}. Fragrância conceitual: as notas descrevem o conceito, não uma fórmula.</p></div></div></section>
  <div class="wrap pn"><a href="#${p.slug}"><span>Anterior</span>${p.nome}</a><a href="#${n.slug}" style="text-align:right"><span>Próxima</span>${n.nome}</a></div>`;
}
function route(){
  const h=location.hash.slice(1);
  const i=FR.findIndex(f=>f.slug===h);
  if(i>=0){frag.innerHTML=fragHTML(FR[i],i);frag.hidden=false;frag.scrollTop=0;document.body.style.overflow='hidden';document.title='AVELÉ '+FR[i].nome}
  else{if(!frag.hidden){frag.hidden=true;document.body.style.overflow=''} document.title='AVELÉ Maison de Parfum'}
}
addEventListener('hashchange',route); route();
addEventListener('keydown',e=>{if(e.key==='Escape'&&!frag.hidden)location.hash='colecao'});

// menu móvel
const mnav=document.getElementById('mnav'),mb=document.getElementById('menuBtn');
mb.addEventListener('click',()=>{mnav.hidden=false;mb.setAttribute('aria-expanded','true')});
function closeM(){mnav.hidden=true;mb.setAttribute('aria-expanded','false')}
document.getElementById('menuClose').addEventListener('click',closeM);
mnav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeM));

// som do filme (só depois de um toque)
const film=document.getElementById('film'),sb=document.getElementById('soundBtn');
sb.addEventListener('click',()=>{film.muted=!film.muted; if(!film.muted){film.currentTime=0;film.play().catch(()=>{})} sb.setAttribute('aria-pressed',String(!film.muted)); sb.textContent=film.muted?'Ouvir o filme':'Silenciar'});

// abertura
const intro=document.getElementById('intro');
setTimeout(()=>intro.classList.add('gone'),2600);
intro.addEventListener('click',()=>intro.classList.add('gone'));

// revelação discreta (parte de um estado visível)
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{const r=el.getBoundingClientRect(); if(r.top>innerHeight){el.classList.add('pre');io.observe(el)}});
}

// formulário demonstrativo
document.getElementById('form').addEventListener('submit',e=>{
  e.preventDefault();
  const n=document.getElementById('f-name'),m=document.getElementById('f-mail');
  let ok=true;
  document.getElementById('e-name').textContent = n.value.trim()?'':(ok=false,'Escreva seu nome.');
  document.getElementById('e-mail').textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value)?'':(ok=false,'Use um e-mail no formato nome@dominio.com.');
  if(ok) document.getElementById('formNote').textContent='Pedido validado, '+n.value.trim().split(' ')[0]+'. Como este é um projeto conceitual, nenhuma mensagem foi enviada.';
});
</script>
"""

DATAJS = json.dumps([{k: v for k, v in f.items()} for f in frs], ensure_ascii=False)
big_drop = DROP.replace('class="drop"', 'class="drop" style="width:100%"')
html = (HTML.replace("%LOGO_SM_JSON%", json.dumps(LOGO_SM)).replace("%LOGO_SM%", LOGO_SM).replace("%LOGO%", LOGO)
        .replace("%DROP_BIG%", big_drop).replace("%DATA%", DATAJS))
open(OUT, "w").write(html)
print("ok", len(html) // 1024, "KB")
