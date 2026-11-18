"""AVELÉ · case para Behance: 19 módulos verticais (1600 px de largura, exportados a 2x = 3200 px).

Gera 10-Behance/_case-fonte.html (fonte editável) e exporta cada módulo em 10-Behance/modulos/NN-nome.jpg.
"""
import os, sys, json, subprocess
sys.path.insert(0, os.path.dirname(__file__))
import stage, logo
from botanica import SYMBOLS
from frasco import FR, DATA

R = stage.ROOT
def P(*a): return "file://" + os.path.join(R, *a)
FOTO = lambda n: P("06-Art-Direction", "fotografia", n)
KV = lambda n: P("07-Campaign", "key-visuals", n)
SRC = lambda n: P("10-Behance", "_src", n)

IV, CH, BR, BR2, SAND = "#F4EFE5", "#D8C4A0", "#49372D", "#2A1E17", "#E9DECB"

d, (x0, y0, w, h) = logo.wordmark()
def LOGO(fill, width, extra=""):
    return f'<svg viewBox="{x0} {y0} {w} {h}" style="width:{width};display:block;{extra}" fill="{fill}"><path d="{d}"/></svg>'
logo.set_optical(True); dS, _ = logo.wordmark(); logo.set_optical(False)
def LOGO_S(fill, width):
    return f'<svg viewBox="{x0} {y0} {w} {h}" style="width:{width};display:block" fill="{fill}"><path d="{dS}"/></svg>'
def MONO(fill, height):
    s = logo.svg_monogram(fill=fill)
    return s.replace("<svg ", f'<svg style="height:{height};display:block" ')
def DROP(fill, width):
    return f'<svg viewBox="190 -290 190 250" style="width:{width};display:block"><path fill="{fill}" d="{logo.drop(214, -70, 352, -262, 40)}"/></svg>'
def SYM(key, ink=BR, bg=IV, size="120px", sw=1.4):
    return SYMBOLS[key]().svg(ink=ink, bg=bg, sw=sw).replace("<svg ", f'<svg style="width:{size};display:block" ')

FRS = DATA["fragrancias"]

CSS = stage.FONTS + f"""
*{{box-sizing:border-box}} body{{margin:0;background:#111}}
.m{{width:1600px;position:relative;overflow:hidden;background:{IV};color:{BR};font-family:InterA;font-weight:300}}
.pad{{padding:140px 140px}}
.lbl{{font-family:InterA;font-weight:500;font-size:13px;letter-spacing:.34em;text-transform:uppercase}}
.num{{position:absolute;top:56px;left:140px;right:140px;display:flex;justify-content:space-between;font-family:InterA;font-weight:500;font-size:12px;letter-spacing:.32em;text-transform:uppercase;opacity:.75}}
h2{{font-family:Cormorant;font-weight:400;font-size:96px;line-height:1;margin:0;letter-spacing:-.005em}}
h3{{font-family:Cormorant;font-weight:400;font-size:44px;line-height:1.1;margin:0}}
p{{font-size:19px;line-height:1.7;margin:0;max-width:60ch}}
.it{{font-family:Cormorant;font-style:italic;font-weight:400}}
.serif{{font-family:Cormorant}}
.cap{{font-size:13px;letter-spacing:.06em;opacity:.75;margin-top:14px}}
.dark{{background:{BR};color:{IV}}} .dark .lbl,.dark .num{{color:{CH}}}
.deep{{background:{BR2};color:{IV}}} .deep .num{{color:{CH}}}
.sand{{background:{SAND}}}
img{{display:block;max-width:100%}}
.g{{display:grid;gap:28px}}
.rule{{border-top:1px solid currentColor;opacity:.25}}
"""

def num(n, title, total=19):
    return f'<div class="num"><span>{n:02d} — {title}</span><span>AVELÉ · Studio Matteu</span></div>'

M = []
def mod(key, html, cls="", style=""):
    M.append((key, f'<section class="m {cls}" id="{key}" style="{style}">{html}</section>'))

# 01 CAPA -------------------------------------------------------------------------------
mod("01-capa", f"""
<img src="{KV('kv-00-institucional.png')}" style="width:1600px;height:1700px;object-fit:cover;object-position:50% 30%">
<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(42,30,23,.35) 0%,rgba(42,30,23,0) 18%,rgba(42,30,23,0) 52%,{BR2} 86%)"></div>
<div style="position:absolute;top:70px;left:140px;right:140px;display:flex;justify-content:space-between;color:{CH}" class="lbl"><span>Brand identity</span><span>Luxury perfumery</span></div>
<div style="background:{BR2};height:620px"></div>
<div style="position:absolute;left:140px;right:140px;top:1500px;color:{CH}">
  {LOGO(CH, '1320px')}
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:70px;color:{IV}">
    <div class="it" style="font-size:54px;font-weight:300">L’élégance est une essence.</div>
    <div class="lbl" style="color:{CH};text-align:right;line-height:2">Identidade visual completa<br>Projeto conceitual · Studio Matteu</div>
  </div>
</div>""", "deep", "height:2320px")

# 02 INTRODUÇÃO E CONCEITO ----------------------------------------------------------------
mod("02-conceito", f"""{num(2,'Introdução e conceito')}
<div class="pad" style="display:grid;grid-template-columns:1.1fr 1fr;gap:110px;padding-top:200px;align-items:center">
  <div class="g" style="gap:40px">
    <div class="lbl">O projeto</div>
    <h2>Uma casa de perfumaria que fala baixo.</h2>
    <p>AVELÉ é uma casa conceitual de perfumaria de luxo seletivo, inspirada na tradição francesa, na elegância parisiense e na sofisticação atemporal. Uma marca em que o desejo nasce do detalhe, e não do logotipo.</p>
    <p style="font-size:15px;opacity:.75">Projeto autoral de branding. A inspiração francesa é uma direção estética: a marca não declara origem nem fabricação na França. Os produtos são conceituais.</p>
  </div>
  <div class="g" style="gap:36px;justify-items:center;text-align:center">
    <div style="width:220px">{DROP(BR, '220px')}</div>
    <h3 class="it" style="font-size:52px">O acento como gota.</h3>
    <p style="font-size:18px">Num nome feito só de retas, o acento agudo do É é o único traço inclinado. Ele vira o símbolo da casa: a essência que cai e toca a pele.</p>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0">
  <img src="{FOTO('23-romantica-petala-orvalho.png')}" style="height:620px;width:100%;object-fit:cover">
  <img src="{FOTO('22-sensorial-seda-movimento.png')}" style="height:620px;width:100%;object-fit:cover">
  <img src="{FOTO('20-sensorial-mao-pulso.png')}" style="height:620px;width:100%;object-fit:cover;object-position:50% 30%">
</div>""")

# 03 POSICIONAMENTO ---------------------------------------------------------------------
axes = [("Tom", "sussurro, precisão, calor", "grito, ostentação, frieza"), ("Tempo", "atemporal, herança", "tendência, sazonal"),
        ("Luxo", "discreto, tátil", "logomania, brilho excessivo"), ("Emoção", "romance, memória, pele", "sedução óbvia")]
rows = "".join(f'<div style="display:grid;grid-template-columns:200px 1fr 1fr;padding:26px 0;border-top:1px solid rgba(244,239,229,.25)"><span class="lbl" style="color:{CH}">{a}</span><span class="serif" style="font-size:32px">{b}</span><span class="serif" style="font-size:32px;opacity:.45;text-decoration:line-through;text-decoration-thickness:1px">{c}</span></div>' for a, b, c in axes)
pers = " · ".join(["Elegante", "Atemporal", "Romântica", "Sofisticada", "Sensorial", "Clássica", "Exclusiva"])
mod("03-posicionamento", f"""{num(3,'Posicionamento')}
<div class="pad" style="padding-top:200px">
  <div class="lbl" style="color:{CH};margin-bottom:34px">Declaração de posicionamento</div>
  <h2 style="font-size:70px;max-width:1240px;line-height:1.12">Para quem escolhe perfume como quem escolhe uma palavra, AVELÉ traduz a elegância parisiense clássica numa linguagem <span class="it">silenciosa e atemporal.</span></h2>
  <div style="margin-top:110px;display:grid;grid-template-columns:200px 1fr 1fr" class="lbl"><span></span><span style="color:{CH}">AVELÉ é</span><span style="color:{CH};opacity:.6">AVELÉ não é</span></div>
  <div style="margin-top:18px">{rows}<div style="border-top:1px solid rgba(244,239,229,.25)"></div></div>
  <div style="margin-top:100px;display:grid;grid-template-columns:1fr 1fr;gap:80px">
    <div><div class="lbl" style="color:{CH};margin-bottom:20px">Personalidade</div><div class="serif" style="font-size:34px;line-height:1.4">{pers}</div></div>
    <div><div class="lbl" style="color:{CH};margin-bottom:20px">Arquétipo</div><p style="font-size:20px">O Amante (sensorial, íntimo), temperado pelo Sábio (tradição, contenção). Usaria seda sem estampa e escreveria cartas à mão.</p></div>
  </div>
</div>""", "dark")

# 04 UNIVERSO VISUAL --------------------------------------------------------------------
words = ["Luz rasante", "Marfim", "Âmbar", "Seda", "Boiseries", "Orvalho", "Pele", "Silêncio"]
mod("04-universo", f"""{num(4,'Universo visual')}
<div class="pad" style="padding-top:200px;padding-bottom:80px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end">
  <h2>Luz de fim de tarde num salão de boiseries.</h2>
  <p>Marfim, champagne e sombra marrom. O âmbar do vidro é a única fonte de calor. Matérias que se tocam: travertino, linho, veludo, seda, papel de algodão.</p>
</div>
<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;grid-template-rows:520px 520px;gap:14px;padding:0 140px 0">
  <img src="{FOTO('25-interior-salao.png')}" style="grid-row:span 2;width:100%;height:100%;object-fit:cover">
  <img src="{FOTO('21-romantica-silhueta-janela.png')}" style="width:100%;height:100%;object-fit:cover;object-position:50% 30%">
  <img src="{FOTO('31-flatlay-linho.png')}" style="width:100%;height:100%;object-fit:cover;object-position:0 0">
  <img src="{FOTO('24-sensorial-nuca.png')}" style="width:100%;height:100%;object-fit:cover;object-position:40% 40%">
  <div style="background:{BR};color:{IV};display:grid;align-content:center;justify-items:center;gap:26px">{MONO(CH,'220px')}<span class="lbl" style="color:{CH}">Maison de parfum</span></div>
</div>
<div class="pad" style="padding-top:80px;display:flex;flex-wrap:wrap;gap:16px 46px">{''.join(f'<span class="it" style="font-size:44px">{x}</span>' for x in words)}</div>""")

# 05 LOGOTIPO ---------------------------------------------------------------------------
gl = f"""<svg viewBox="{x0 - 120} {y0 - 40} {w + 240} {h + 80}" style="width:1320px;display:block">
<g stroke="#B9A27C" stroke-width="4" fill="none" stroke-dasharray="14 12">
<line x1="{x0 - 120}" x2="{x0 + w + 120}" y1="0" y2="0"/><line x1="{x0 - 120}" x2="{x0 + w + 120}" y1="1000" y2="1000"/>
<line x1="{x0 - 120}" x2="{x0 + w + 120}" y1="655" y2="655"/><line x1="{x0 - 120}" x2="{x0 + w + 120}" y1="-262" y2="-262"/></g>
<path fill="{BR}" d="{d}"/>
<g font-family="InterA" font-size="38" fill="#9C8664" letter-spacing="4">
<text x="{x0 + w + 110}" y="-276" text-anchor="end">ACENTO-GOTA</text><text x="{x0 + w + 110}" y="-14" text-anchor="end">ALTURA DE CAIXA</text>
<text x="{x0 + w + 110}" y="640" text-anchor="end">TRAVESSA 0,655</text><text x="{x0 + w + 110}" y="1050" text-anchor="end">LINHA DE BASE</text></g></svg>"""
mod("05-logotipo", f"""{num(5,'Logotipo')}
<div class="pad" style="padding-top:220px;padding-bottom:60px;display:grid;justify-items:center">{LOGO(BR,'1320px')}</div>
<div class="pad" style="padding-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:100px">
  <div class="g"><div class="lbl">Desenho exclusivo</div><h3>Cinco letras retas, desenhadas uma a uma.</h3></div>
  <p>O logotipo não parte de uma fonte pronta. Cada letra foi construída em geometria: contraste Didone de 8 para 1 entre haste e fio, serifas em fio com junções curvas, ápice do A acima da altura de caixa e um par AV compensado oticamente. O acento agudo é desenhado como uma gota, e a grafia AVELÉ com acento é obrigatória em todas as aplicações.</p>
</div>
<div class="sand" style="padding:110px 140px;display:grid;justify-items:center">{gl}
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:40px;margin-top:70px;width:100%">
    <div class="g" style="gap:10px"><span class="lbl">Haste</span><span class="serif" style="font-size:40px">136 u</span></div>
    <div class="g" style="gap:10px"><span class="lbl">Fio</span><span class="serif" style="font-size:40px">17 u · corpo pequeno 30 u</span></div>
    <div class="g" style="gap:10px"><span class="lbl">Caixa alta</span><span class="serif" style="font-size:40px">1000 u</span></div>
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr">
  <div style="background:{BR};padding:120px 60px;display:grid;place-items:center">{LOGO(CH,'360px')}</div>
  <div style="background:{IV};padding:120px 60px;display:grid;place-items:center">{LOGO(BR,'360px')}</div>
  <div style="background:{CH};padding:120px 60px;display:grid;place-items:center">{LOGO(BR,'360px')}</div>
</div>
<div class="pad" style="padding-top:90px;padding-bottom:110px;display:grid;grid-template-columns:auto 1fr;gap:80px;align-items:center">
  <div style="display:flex;gap:40px;align-items:flex-end">{LOGO_S(BR,'200px')}{LOGO_S(BR,'110px')}{LOGO_S(BR,'64px')}</div>
  <p style="font-size:16px">Versão de corpo pequeno: fios engrossados para etiquetas, mouillettes e telas. Abaixo de 64 px de largura, usar sempre esta versão. Área de proteção: a altura do E em todos os lados.</p>
</div>""")

# 06 MONOGRAMA --------------------------------------------------------------------------
mod("06-monograma", f"""{num(6,'Monograma')}
<div style="display:grid;grid-template-columns:1fr 1fr;min-height:1300px">
  <div style="display:grid;place-items:center">{MONO(CH,'760px')}</div>
  <div style="padding:220px 140px 120px 40px;display:grid;align-content:center;gap:34px">
    <div class="lbl">Elemento secundário</div><h2 style="font-size:84px">O A em cártula.</h2>
    <p>O A do logotipo dentro de uma cártula oval em fio duplo. A travessa se estende até o anel interno, como um horizonte, e a gota pende abaixo do eixo. O nome AVELÉ segue protagonista: o monograma assina tampas, selos, papel de seda e bordados.</p>
    <div style="display:flex;gap:28px;margin-top:20px">
      <img src="{P('10-Behance','_src','tampa.png')}" style="width:300px;height:300px;object-fit:cover">
      <div style="width:300px;height:300px;background:{IV};display:grid;place-items:center">{MONO(BR,'230px')}</div>
    </div>
  </div>
</div>""", "dark")

# 07 PALETA -----------------------------------------------------------------------------
def cmyk(hx):
    r, g, b = [int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    k = 1 - max(r, g, b)
    c, m, y = [(1 - v - k) / (1 - k) if k < 1 else 0 for v in (r, g, b)]
    return f"{round(c*100)} {round(m*100)} {round(y*100)} {round(k*100)}"
def rgb(hx): return " ".join(str(int(hx[i:i + 2], 16)) for i in (1, 3, 5))
sw = [("Marfim", IV, BR, "Fundo, papel, respiro", "60%"), ("Champagne", CH, BR, "Hot stamping, tampas, destaque", "15%"), ("Marrom profundo", BR, IV, "Tipografia, faixas, veludo", "25%")]
mod("07-paleta", f"""{num(7,'Paleta cromática')}
<div class="pad" style="padding-top:200px;padding-bottom:70px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Três cores. Nenhuma vibrante.</h2><p>A paleta oficial é fixa. O areia das caixas é um tom de apoio obtido entre marfim e champagne, nunca uma quarta cor de marca. O âmbar do vidro vem do material, não da impressão.</p></div>
<div style="display:grid;grid-template-columns:6fr 1.5fr 2.5fr;height:760px;margin:0 140px;outline:1px solid rgba(73,55,45,.25)">
{''.join(f'<div style="background:{c};color:{t};padding:60px 50px;display:grid;align-content:space-between"><span class="lbl">{n}</span><div class="g" style="gap:10px"><span class="serif" style="font-size:54px">{c}</span><span style="font-size:15px">RGB {rgb(c)}<br>CMYK ≈ {cmyk(c)}<br>{u}</span><span class="lbl" style="opacity:.7">{pc} do uso</span></div></div>' for n, c, t, u, pc in sw)}
</div>
<div class="pad" style="padding-top:60px;padding-bottom:110px;display:grid;grid-template-columns:auto 1fr;gap:50px;align-items:center">
  <div style="width:180px;height:120px;background:{SAND};display:grid;place-items:center" class="lbl">Areia · apoio</div>
  <p style="font-size:15px">{SAND} · RGB {rgb(SAND)}. CMYK por conversão direta, sem perfil ICC: validar com prova de cor da gráfica antes de imprimir. Nenhuma referência Pantone foi atribuída.</p>
</div>""")

# 08 TIPOGRAFIA -------------------------------------------------------------------------
mod("08-tipografia", f"""{num(8,'Tipografia')}
<div class="pad" style="padding-top:200px;display:grid;grid-template-columns:1fr 1fr;gap:100px">
  <div class="g" style="gap:24px"><div class="lbl">Serifada · títulos e nomes</div>
    <div class="serif" style="font-size:230px;line-height:.9">Aa</div>
    <div class="serif" style="font-size:44px">Cormorant Garamond</div>
    <p style="font-size:16px">Garalde de alto contraste, herdeira de Claude Garamont. Light, Regular e Medium, com itálico para frases de assinatura. Licença SIL OFL 1.1.</p></div>
  <div class="g" style="gap:24px"><div class="lbl">Sem serifa · textos e técnica</div>
    <div style="font-family:InterA;font-weight:300;font-size:230px;line-height:.9;letter-spacing:-.04em">Aa</div>
    <div style="font-family:InterA;font-size:40px;font-weight:400">Inter</div>
    <p style="font-size:16px">Para informação técnica, legendas e interface. Light e Regular no corpo, Medium em versal com espaçamento largo nos rótulos. Licença SIL OFL 1.1.</p></div>
</div>
<div class="sand" style="margin-top:110px;padding:110px 140px;display:grid;gap:44px">
  <div style="display:grid;grid-template-columns:220px 1fr;align-items:baseline"><span class="lbl">Display 120</span><span class="serif" style="font-size:120px;letter-spacing:.12em;line-height:1">HÉRITAGE</span></div>
  <div style="display:grid;grid-template-columns:220px 1fr;align-items:baseline"><span class="lbl">Assinatura 56</span><span class="it" style="font-size:56px">L’élégance est une essence.</span></div>
  <div style="display:grid;grid-template-columns:220px 1fr;align-items:baseline"><span class="lbl">Título 40</span><span class="serif" style="font-size:40px">Uma biblioteca antiga, couro gasto e especiarias.</span></div>
  <div style="display:grid;grid-template-columns:220px 1fr;align-items:baseline"><span class="lbl">Rótulo 12</span><span class="lbl">N° 04 · Masculin · Eau de parfum 100 ml</span></div>
  <div style="display:grid;grid-template-columns:220px 1fr;align-items:baseline"><span class="lbl">Corpo 18</span><p>Noz-moscada quente, cravo seco e couro macio sobre sândalo cremoso.</p></div>
</div>""", style="padding-bottom:0")

# 09 ELEMENTOS GRÁFICOS -----------------------------------------------------------------
syms = "".join(f'<div style="display:grid;justify-items:center;gap:18px;padding:40px 10px;border:1px solid rgba(73,55,45,.15)">{SYM(f["simbolo"], size="190px")}<span class="lbl">{f["nome"]}</span><span class="cap" style="margin:0;text-align:center">{f["simboloPt"]}</span></div>' for f in FRS)
mod("09-elementos", f"""{num(9,'Elementos gráficos')}
<div class="pad" style="padding-top:200px;padding-bottom:70px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Botânica em traço fino.</h2><p>Seis símbolos desenhados como gravura: preenchimento na cor do papel para esconder sobreposições, traço único na cor da tinta. Cada fragrância tem o seu. A gota da marca reaparece no orvalho da ROSÉE.</p></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:0 140px">{syms}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px 140px 140px">
  <img src="{P('10-Behance','_src','papel-seda.png')}" style="width:100%;height:520px;object-fit:cover">
  <div style="background:{SAND};display:grid;place-items:center;height:520px"><img src="{P('10-Behance','_src','moldura.png')}" style="height:440px"></div>
</div>""")

# 10 COLEÇÃO ----------------------------------------------------------------------------
def fcard(f):
    return f'''<div style="display:grid;grid-template-columns:420px 1fr;gap:56px;padding:56px 0;border-top:1px solid rgba(73,55,45,.2);align-items:center">
  <img src="{KV(f"kv-{f['n']}-{['rosee','eclat','ombre','heritage','aube','sillage'][int(f['n'])-1]}.png")}" style="width:420px;height:540px;object-fit:cover">
  <div class="g" style="gap:18px">
    <div style="display:flex;justify-content:space-between;align-items:center"><span class="lbl">N° {f['n']} · {f['linha']} · {f['familia']}</span>{SYM(f['simbolo'], size='70px')}</div>
    <div class="serif" style="font-size:86px;letter-spacing:.12em;line-height:1">{f['nome']}</div>
    <div class="it" style="font-size:30px">{f['conceito']}</div>
    <p style="font-size:17px">{f['sensorial']} <span style="opacity:.7">Personalidade: {f['personalidade']}</span></p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:10px">
      {''.join(f'<div><div class="lbl" style="font-size:11px;margin-bottom:8px">{a}</div><div class="serif" style="font-size:22px;line-height:1.35">{"<br>".join(f[k])}</div></div>' for a,k in (("Saída","saida"),("Coração","coracao"),("Fundo","fundo")))}
    </div></div></div>'''
mod("10-colecao", f"""{num(10,'Coleção de fragrâncias')}
<div class="pad" style="padding-top:200px;padding-bottom:40px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Seis eaux de parfum, três linhas.</h2><p>Féminin, Masculin e Unisexe. A linha define o colorway da etiqueta; a fragrância define o símbolo, o número e o tom do líquido. Pirâmides olfativas conceituais: descrevem o conceito, não uma fórmula. Nomes sujeitos a pesquisa de disponibilidade.</p></div>
<div style="padding:0 140px 120px">{''.join(fcard(f) for f in FRS)}</div>""")

# 11 FRASCOS ----------------------------------------------------------------------------
mod("11-frascos", f"""{num(11,'Design dos frascos')}
<img src="{P('05-Product-Design','renders','frascos-familia-marfim.png')}" style="width:1600px;margin-top:120px">
<div class="pad" style="padding-top:70px;padding-bottom:80px;display:grid;grid-template-columns:1fr 1fr;gap:100px">
  <div class="g"><div class="lbl">Uma família</div><h3>Vidro âmbar suave, tampa champagne, etiqueta mínima.</h3></div>
  <div class="g" style="gap:18px"><p>Frasco retangular clássico de 100 ml com base espessa e ombros retos. Tampa em metal escovado champagne com o monograma em baixo-relevo. Etiqueta em papel com moldura em fio, colada na face frontal.</p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:12px">
  <div><div class="lbl" style="font-size:11px">Corpo</div><div class="serif" style="font-size:28px">56 × 74 × 34 mm</div></div>
  <div><div class="lbl" style="font-size:11px">Tampa</div><div class="serif" style="font-size:28px">34 × 27 × 26 mm</div></div>
  <div><div class="lbl" style="font-size:11px">Etiqueta</div><div class="serif" style="font-size:28px">34 × 37 mm</div></div></div>
  <p style="font-size:14px;opacity:.7">Medidas de referência do conceito, para estudo de proporção. Não são especificação técnica de fornecedor.</p></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr">
  <div style="background:#EDE5D8;height:700px;display:grid;place-items:center"><img src="{P('11-Exports','aplicacoes','etiquetas-folha.png')}" style="width:92%;height:auto"></div>
  <img src="{P('05-Product-Design','renders','frascos-familia-marrom.png')}" style="width:100%;height:700px;object-fit:cover">
</div>
<div class="sand" style="padding:90px 140px;display:grid;grid-template-columns:repeat(3,1fr);gap:50px">
  <div class="g" style="gap:10px"><span class="lbl">Féminin</span><span class="serif" style="font-size:30px">Etiqueta marfim, tinta marrom</span></div>
  <div class="g" style="gap:10px"><span class="lbl">Masculin</span><span class="serif" style="font-size:30px">Etiqueta marrom, hot stamping champagne</span></div>
  <div class="g" style="gap:10px"><span class="lbl">Unisexe</span><span class="serif" style="font-size:30px">Etiqueta champagne, tinta marrom</span></div>
</div>""")

# 12 EMBALAGENS -------------------------------------------------------------------------
mod("12-embalagens", f"""{num(12,'Embalagens')}
<div class="pad" style="padding-top:200px;padding-bottom:70px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Caixa rígida em tom areia.</h2><p>Tampa e base em papel areia, faixa em marrom profundo, nome e cártula em hot stamping champagne. Por dentro, veludo marrom e berço recortado no formato do frasco. Na lateral, a pirâmide olfativa.</p></div>
<img src="{P('04-Packaging','renders','caixas-sistema-seis-fragrancias.png')}" style="width:1600px;height:640px;object-fit:cover;object-position:50% 72%">
<div style="display:grid;grid-template-columns:1fr 1fr">
  <img src="{P('04-Packaging','renders','caixa-aberta-berco-rosee.png')}" style="width:100%;height:600px;object-fit:cover">
  <img src="{P('04-Packaging','renders','caixa-e-frasco-heritage.png')}" style="width:100%;height:600px;object-fit:cover">
</div>
<div class="pad" style="padding-top:100px;padding-bottom:110px;display:grid;grid-template-columns:1fr 1.25fr;gap:80px;align-items:center">
  <div class="g"><div class="lbl">Sistema de identificação</div><h3>Seis caixas, uma família.</h3><p style="font-size:17px">A estrutura é a mesma; mudam o símbolo na cártula, o número, o nome em hot stamping e a linha (FÉMININ, MASCULIN, UNISEXE) no rodapé da faixa.</p></div>
  <img src="{P('04-Packaging','renders','caixa-aberta-berco-ombre.png')}" style="width:100%;height:520px;object-fit:cover">
</div>""")

# 13 LINHA CORPORAL ---------------------------------------------------------------------
mod("13-corpo", f"""{num(13,'Linha corporal')}
<div style="display:grid;grid-template-columns:1fr 1fr;min-height:1200px">
  <img src="{KV('kv-09-linha-corporal.png')}" style="width:100%;height:100%;object-fit:cover">
  <div style="padding:220px 140px 100px 100px;display:grid;align-content:center;gap:34px">
    <div class="lbl">Corps</div><h2 style="font-size:80px">A mesma assinatura na pele inteira.</h2>
    <p>As seis fragrâncias ganham hidratante, sabonete líquido e loção perfumada. Vidro âmbar, válvula champagne, bisnaga marfim e a etiqueta na cor da linha mantêm o parentesco com os perfumes.</p>
    <div style="display:grid;gap:0;margin-top:10px">
      {''.join(f'<div style="display:flex;justify-content:space-between;padding:20px 0;border-top:1px solid rgba(73,55,45,.25)"><span class="serif" style="font-size:30px">{a}</span><span class="lbl" style="align-self:center">{b}</span></div>' for a,b in (("Crème pour le corps","Hidratante · 200 ml"),("Savon liquide","Sabonete líquido · 300 ml"),("Lotion parfumée","Loção perfumada · 200 ml")))}
    </div>
  </div>
</div>
<img src="{P('04-Packaging','renders','linha-corporal-rosee-sillage.png')}" style="width:1600px">
<img src="{P('04-Packaging','renders','linha-corporal-ombre-aube.png')}" style="width:1600px">""", "sand")

# 14 DIREÇÃO FOTOGRÁFICA ----------------------------------------------------------------
def col(t, s, imgs):
    return f'<div class="g" style="gap:16px;align-content:start"><div class="lbl" style="color:{CH}">{t}</div><p style="font-size:16px;margin-bottom:14px">{s}</p>' + "".join(f'<img src="{FOTO(i)}" style="width:100%;height:{hh}px;object-fit:cover;object-position:{op}">' for i, hh, op in imgs) + "</div>"
mod("14-fotografia", f"""{num(14,'Direção fotográfica')}
<div class="pad" style="padding-top:200px;padding-bottom:70px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Três linguagens, um protagonista.</h2><p>Cinematográfica, romântica e sensorial. Sem modelos posando para a câmera: mãos, pele, silhuetas e tecidos acompanham o frasco, que sempre lidera a cena.</p></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:26px;padding:0 140px 140px">
  {col('Cinematográfica','Luz dramática, sombras profundas, reflexos âmbar, luz champagne.',[('01-cinematografica-pedestal.png',560,'50% 50%'),('13-heritage-cena.png',420,'50% 40%')])}
  {col('Romântica','Flores, tecidos delicados, transparências, luz suave.',[('03-romantica-rosas-linho.png',420,'50% 50%'),('21-romantica-silhueta-janela.png',560,'50% 30%')])}
  {col('Sensorial','Mãos, pele, silhuetas, movimento de tecido, detalhe.',[('20-sensorial-mao-pulso.png',560,'50% 30%'),('24-sensorial-nuca.png',420,'40% 40%')])}
</div>
<div class="pad" style="padding-top:0;padding-bottom:120px"><p style="font-size:14px;opacity:.7">Placas fotográficas geradas com IA (OpenArt, Seedream 5.5) sem produto, sem texto e sem logo. Os frascos são renders vetoriais próprios compostos sobre as placas, para que o logotipo nunca seja deformado.</p></div>""", "deep")

# 15 CAMPANHA ---------------------------------------------------------------------------
kvs = ["kv-01-rosee", "kv-02-eclat", "kv-03-ombre", "kv-04-heritage", "kv-05-aube", "kv-06-sillage"]
mod("15-campanha", f"""{num(15,'Campanha publicitária')}
<div style="position:relative"><img src="{KV('kv-08-colecao-wide.png')}" style="width:1600px;height:900px;object-fit:cover">
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(42,30,23,.75),rgba(42,30,23,0) 50%)"></div>
  <div style="position:absolute;left:140px;bottom:90px;color:{IV}"><div class="lbl" style="color:{CH};margin-bottom:16px">Campanha institucional</div><div class="it" style="font-size:84px;line-height:1">L’élégance est une essence.</div></div></div>
<div class="pad" style="padding-top:110px;padding-bottom:60px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Uma cena para cada essência.</h2><p>Cada fragrância tem seu cenário, sua luz e seus ingredientes. A grade tipográfica se repete em todas as peças: logotipo no alto, nome e conceito na base.</p></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 140px">{''.join(f'<img src="{KV(k + ".png")}" style="width:100%;height:560px;object-fit:cover">' for k in kvs)}</div>
<div class="sand" style="margin-top:120px;padding:110px 140px">
  <div class="lbl" style="margin-bottom:40px">Redes sociais · feed 4:5 e stories 9:16</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px;align-items:end">
    {''.join(f'<img src="{P("07-Campaign","social",n)}" style="width:100%;box-shadow:0 30px 60px rgba(42,30,23,.25)">' for n in ("00-institucional-story-9x16.png","03-ombre-feed-4x5.png","01-rosee-story-9x16.png","06-sillage-feed-4x5.png"))}
  </div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr">
  <img src="{KV('kv-07-romantica.png')}" style="width:100%;height:1000px;object-fit:cover">
  <div style="background:{BR};color:{IV};padding:120px 100px;display:grid;align-content:center;gap:28px">
    <div class="lbl" style="color:{CH}">Material de lançamento</div><h3 class="it" style="font-size:60px">La collection.<br>Six eaux de parfum.</h3>
    <p>Kit de imprensa com caixa, cartão de fragrância e mouillettes; peças de feed e stories; filme de 30 segundos; site com a coleção completa.</p></div>
</div>""")

# 16 FILME ------------------------------------------------------------------------------
stills = ["2.5", "5.6", "9.4", "10.9", "13.2", "15.2", "17.75", "18.9", "19.9", "22.3", "26.2", "28.9"]
caps = ["Seda em movimento", "Silhueta à janela", "A gota", "Monograma da tampa", "Etiqueta", "O frasco", "O acento cai no É", "Maison de parfum", "ROSÉE", "AUBE", "A coleção", "Assinatura"]
mod("16-filme", f"""{num(16,'Filme institucional')}
<div class="pad" style="padding-top:200px;padding-bottom:70px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Trinta segundos.</h2><p>Atmosfera, detalhes do frasco, identidade, as seis fragrâncias e a assinatura. Filme 1920 × 1080, 30 fps, renderizado quadro a quadro. Trilha original de piano e cordas composta sobre os cortes.</p></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 140px 120px">
{''.join(f'<div><img src="{SRC("filme-" + s + ".jpg")}" style="width:100%;aspect-ratio:16/9;object-fit:cover"><div class="cap" style="display:flex;justify-content:space-between"><span>{c}</span><span>{float(s):04.1f} s</span></div></div>' for s, c in zip(stills, caps))}
</div>""", "deep")

# 17 WEBSITE ----------------------------------------------------------------------------
def browser(img, wpx, hpx, op="50% 0"):
    return f'''<div style="width:{wpx}px;background:#fff;box-shadow:0 40px 80px rgba(42,30,23,.28);border-radius:10px;overflow:hidden">
<div style="height:38px;background:#EDE6DA;display:flex;align-items:center;gap:8px;padding:0 16px"><i style="width:11px;height:11px;border-radius:50%;background:#CDBFA9"></i><i style="width:11px;height:11px;border-radius:50%;background:#CDBFA9"></i><i style="width:11px;height:11px;border-radius:50%;background:#CDBFA9"></i></div>
<img src="{img}" style="width:100%;height:{hpx}px;object-fit:cover;object-position:{op}"></div>'''
def phone(img, wpx=300):
    return f'''<div style="width:{wpx}px;padding:12px;background:#1a1410;border-radius:44px;box-shadow:0 40px 70px rgba(42,30,23,.35)"><img src="{img}" style="width:100%;border-radius:32px;aspect-ratio:390/844;object-fit:cover;object-position:50% 0"></div>'''
mod("17-website", f"""{num(17,'Website')}
<div class="pad" style="padding-top:200px;padding-bottom:80px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Uma casa que se visita.</h2><p>Site responsivo e funcional: abertura com o filme, Nossa essência, Coleção com filtro por linha, página individual de cada fragrância com pirâmide olfativa, Linha corporal, História e Contato.</p></div>
<div style="display:grid;justify-items:center;gap:60px;padding:0 140px">
  {browser(SRC('site-desktop-home.jpg'), 1320, 820)}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;width:1320px">{browser(SRC('site-desktop-colecao.jpg'), 640, 400)}{browser(SRC('site-desktop-fragrancia.jpg'), 640, 400)}</div>
</div>
<div class="sand" style="margin-top:120px;padding:110px 140px;display:flex;justify-content:space-between;align-items:flex-end">
  {phone(SRC('site-mobile-home.jpg'))}{phone(SRC('site-mobile-colecao.jpg'))}{phone(SRC('site-mobile-fragrancia.jpg'))}{phone(SRC('site-mobile-corpo.jpg'))}
</div>""")

# 18 APLICAÇÕES -------------------------------------------------------------------------
A = lambda n: P("11-Exports", "aplicacoes", n)
mod("18-aplicacoes", f"""{num(18,'Aplicações')}
<div class="pad" style="padding-top:200px;padding-bottom:70px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:end"><h2>Do cartão à sacola.</h2><p>Cartões institucionais com hot stamping, cartões de fragrância, mouillettes, papel de seda com padrão de monogramas e gotas, selo adesivo, etiquetas de sacola e sacolas em marrom e areia.</p></div>
<img src="{A('papelaria-flatlay.png')}" style="width:1600px">
<div style="display:grid;grid-template-columns:1fr 1fr">
  <img src="{A('sacolas.png')}" style="width:100%;height:620px;object-fit:cover">
  <img src="{A('papel-de-seda-e-selo.png')}" style="width:100%;height:620px;object-fit:cover">
</div>
<img src="{A('cartoes-de-fragrancia.png')}" style="width:1600px;height:640px;object-fit:cover">
<div style="display:grid;grid-template-columns:1fr 1fr">
  <img src="{A('cartoes-institucionais.png')}" style="width:100%;height:600px;object-fit:cover">
  <img src="{P('07-Campaign','social','04-heritage-feed-4x5.png')}" style="width:100%;height:600px;object-fit:cover;object-position:50% 30%">
</div>""")

# 19 ENCERRAMENTO -----------------------------------------------------------------------
mod("19-encerramento", f"""
<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center">
  <div style="display:grid;justify-items:center;gap:60px">
    {MONO(CH,'220px')}
    {LOGO(CH,'980px')}
    <div class="it" style="font-size:64px;font-weight:300">L’élégance est une essence.</div>
    <div class="rule" style="width:80px;opacity:.5"></div>
    <div class="lbl" style="color:{CH};line-height:2.2">Created by Studio Matteu<br><span style="opacity:.7">Projeto conceitual autoral · Não é uma marca comercial lançada</span></div>
  </div>
</div>""", "deep", "height:1500px")


def build():
    out_dir = os.path.join(R, "10-Behance")
    html = f"<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><title>AVELÉ · Case Behance</title><style>{CSS}</style></head><body>" + "".join(s for _, s in M) + "</body></html>"
    src = os.path.join(out_dir, "_case-fonte.html")
    open(src, "w").write(html)
    js = os.path.join(R, "src", "_build", "shoot_case.js")
    open(js, "w").write("""
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1200},deviceScaleFactor:2});
await p.goto('file://'+process.argv[2]);await p.evaluate(()=>document.fonts.ready);
await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});await p.waitForTimeout(500);
const ids=await p.$$eval('section.m',a=>a.map(s=>s.id));
for(const id of ids){const el=await p.$('[id="'+id+'"]');await el.screenshot({path:process.argv[3]+'/'+id+'.jpg',type:'jpeg',quality:90});console.log(id);}
await b.close();})();""")
    md = os.path.join(out_dir, "modulos")
    os.makedirs(md, exist_ok=True)
    env = dict(os.environ); env["NODE_PATH"] = subprocess.check_output(["npm", "root", "-g"], text=True).strip()
    subprocess.run(["node", js, src, md], check=True, env=env)


if __name__ == "__main__":
    build()
