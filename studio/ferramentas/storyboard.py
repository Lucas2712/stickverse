#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · storyboard
Gera storyboard.md e storyboard.html (página para ler no celular e publicar como Artifact)
a partir de projetos/<nome>/storyboard.json.

Uso: python3 studio/ferramentas/storyboard.py projetos/<nome>

storyboard.json:
{ "titulo", "chamada" (HTML curto do título, opcional), "resumo", "duracao",
  "marcas": [[segundo, "rótulo"], ...],          linhas na barra do tempo (drops, viradas)
  "identidade": [["Rótulo", "texto (HTML simples)"], ...],
  "cenas": [{ "n", "nome", "a", "b", "f": "claro|escuro|laranja|claro/escuro", "img": "opcional",
              "narr", "comp", "tela", "sync": [["seg", "evento"]], "tr" }],
  "notas": ["ponto de atenção", ...] }
"""
import html as H, json, os, sys

if len(sys.argv) < 2: sys.exit(__doc__)
P = os.path.abspath(sys.argv[1])
D = json.load(open(os.path.join(P, "storyboard.json"), encoding="utf-8"))
C, TOT = D["cenas"], float(D["duracao"])
v = lambda x: f"{x:.1f}".replace(".", ",")
e = H.escape

# ---------- markdown ----------
md = [f"# Storyboard: {D['titulo']}", "", "> Aguardando aprovação. Nada é programado antes dela.", "", D.get("resumo", ""), "",
      "## Identidade", "", "| | |", "|---|---|"]
md += [f"| {k} | {t} |" for k, t in D.get("identidade", [])]
md += ["", "## Mapa de ritmo", "", "| # | Tempo | Fundo | Composição | Imagem |", "|---|---|---|---|---|"]
md += [f"| {c['n']} | {v(c['a'])}–{v(c['b'])} | {c['f']} | {c['comp']} | {c.get('img', '')} |" for c in C]
md.append("")
for c in C:
    md += [f"### {c['n']} · {c['nome']} · {v(c['a'])}–{v(c['b'])} s", "", f"**Narração:** \"{c['narr']}\"", "",
           f"**Fundo:** {c['f']} · **Composição:** {c['comp']}" + (f" · **Imagem:** {c['img']}" if c.get("img") else ""), "", c["tela"], "", "**Sincronização:**"]
    md += [f"- {t} s {d}" for t, d in c["sync"]] + ["", f"**Transição:** {c['tr']}", "", "---", ""]
if D.get("notas"): md += ["## Pontos de atenção", ""] + [f"- {n}" for n in D["notas"]]
open(os.path.join(P, "storyboard.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")

# ---------- html ----------
segs = "".join(f'<div class="seg {c["f"].split("/")[0]}" style="left:{c["a"] / TOT * 100:.2f}%;width:{(c["b"] - c["a"]) / TOT * 100:.2f}%">{c["n"]}</div>' for c in C)
mk = "".join(f'<div class="mk" style="left:{t / TOT * 100:.2f}%"></div>' for t, _ in D.get("marcas", []))
mkl = " · ".join(f"{e(r)} ({v(t)} s)" for t, r in D.get("marcas", []))
cards = ""
for c in C:
    sync = "".join(f'<li><span class="s">{e(t)} s</span>{e(d)}</li>' for t, d in c["sync"])
    img = f'<span class="pill img">imagem · {e(c["img"])}</span>' if c.get("img") else ""
    cards += f'''<article class="cena"><header><span class="num">{c["n"]}</span><h3>{e(c["nome"])}</h3><span class="t">{v(c["a"])}–{v(c["b"])} s</span><span class="pill {c["f"].split("/")[0]}">{e(c["f"])}</span>{img}</header>
<span class="comp">{e(c["comp"])}</span><blockquote>"{e(c["narr"])}"</blockquote><p>{e(c["tela"])}</p><ul class="sync">{sync}</ul>
<p class="tr"><span class="rot">Transição</span>{e(c["tr"])}</p></article>\n'''
ident = "".join(f"<dt>{e(k)}</dt><dd>{t}</dd>" for k, t in D.get("identidade", []))
notas = "".join(f"<li>{e(n)}</li>" for n in D.get("notas", []))
page = f'''<title>Storyboard {e(D["titulo"])}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap">
<style>
/* Layout: coluna única de leitura no celular; barra do tempo com o fundo de cada plano; uma ficha por plano. */
:root{{--bg:#EDEDED;--surface:#F7F7F7;--ink:#0B0B0D;--ink2:#5E5E66;--line:#D6D6DA;--ac:#D9530B;
  --display:"Archivo","Arial Narrow",Arial,sans-serif;--body:"Geist","Helvetica Neue",Arial,sans-serif;--mono:"Geist Mono",ui-monospace,Menlo,monospace;--serif:"Instrument Serif",Georgia,serif}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#111113;--surface:#1A1A1D;--ink:#F4F4F5;--ink2:#A0A0A8;--line:#2C2C31;--ac:#FF7A2E;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#111113;--surface:#1A1A1D;--ink:#F4F4F5;--ink2:#A0A0A8;--line:#2C2C31;--ac:#FF7A2E;color-scheme:dark}}
*{{box-sizing:border-box}} body{{background:var(--bg);color:var(--ink);font:16px/1.55 var(--body);margin:0}}
main{{max-width:760px;margin:0 auto;padding-block:28px 64px;padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px));display:flex;flex-direction:column;gap:36px}}
h1{{font:300 clamp(30px,8vw,52px)/1.05 var(--body);letter-spacing:-.035em;margin:0;text-wrap:balance}}
h1 b{{font:900 1.05em/1 var(--display);letter-spacing:-.02em}} h1 em{{font:italic 400 1.1em var(--serif);color:var(--ac)}}
h2{{font:600 13px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink2);margin:0}}
.lead{{color:var(--ink2);margin:0;max-width:60ch}} .status{{border-left:3px solid var(--ac);padding:10px 14px;background:var(--surface);border-radius:4px}}
section{{display:flex;flex-direction:column;gap:14px}}
dl{{display:grid;grid-template-columns:auto 1fr;gap:10px 18px;margin:0}} dt{{font:500 12px/1.7 var(--mono);color:var(--ink2);text-transform:uppercase;letter-spacing:.08em}} dd{{margin:0;min-width:0}}
code{{font:13px var(--mono)}}
@media (max-width:520px){{dl{{grid-template-columns:1fr;gap:2px}} dd{{margin-bottom:10px}}}}
.tempo{{position:relative;height:52px;border-radius:6px;overflow:hidden;border:1px solid var(--line)}}
.seg{{position:absolute;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font:600 11px var(--mono);border-right:1px solid rgba(128,128,128,.35)}}
.seg.claro{{background:#EDEDED;color:#0B0B0D}} .seg.escuro{{background:#0B0B0D;color:#F4F4F5}} .seg.laranja{{background:linear-gradient(135deg,#FF6A1A,#FF3D2E);color:#fff}}
.mk{{position:absolute;top:-2px;bottom:-2px;width:2px;background:var(--ac)}}
.leg{{display:flex;justify-content:space-between;gap:8px;font:12px var(--mono);color:var(--ink2);margin-top:6px}}
.cena{{border-top:1px solid var(--line);padding-top:20px;display:flex;flex-direction:column;gap:10px}}
.cena header{{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}}
.num{{font:900 40px/1 var(--display);font-stretch:62%;color:var(--ac)}} .cena h3{{font:600 22px var(--body);letter-spacing:-.02em;margin:0}}
.t{{font:500 13px var(--mono);color:var(--ink2);font-variant-numeric:tabular-nums}}
.pill{{font:500 11px var(--mono);text-transform:uppercase;letter-spacing:.08em;padding:3px 8px;border-radius:999px;border:1px solid var(--line)}}
.pill.escuro{{background:#0B0B0D;color:#F4F4F5;border-color:#0B0B0D}} .pill.claro{{background:#F7F7F7;color:#0B0B0D}} .pill.laranja{{background:#FF6A1A;color:#fff;border-color:#FF6A1A}}
.pill.img{{border-color:var(--ac);color:var(--ac)}}
.comp{{font:500 12px var(--mono);text-transform:uppercase;letter-spacing:.06em;color:var(--ac)}}
blockquote{{margin:0;font:italic 400 22px/1.3 var(--serif)}} .cena p{{margin:0;max-width:65ch}}
.rot{{display:block;font:500 11px var(--mono);text-transform:uppercase;letter-spacing:.1em;color:var(--ink2);margin-bottom:2px}}
.sync{{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px;font-size:15px}}
.sync li{{display:grid;grid-template-columns:62px 1fr;gap:10px}} .sync .s{{font:500 13px var(--mono);color:var(--ac);font-variant-numeric:tabular-nums;padding-top:2px}}
.tr{{color:var(--ink2);font-size:15px}} ul.lista{{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px}}
</style>
<main>
<header style="display:flex;flex-direction:column;gap:14px"><h2>storyboard · @matteu.ia</h2><h1>{D.get("chamada") or e(D["titulo"])}</h1>
<p class="lead">{e(D.get("resumo", ""))}</p><div class="status"><b>Aguardando sua aprovação.</b> Nada foi programado ainda.</div></header>
<section><h2>Identidade</h2><dl>{ident}</dl></section>
<section><h2>Mapa de ritmo</h2><div><div class="tempo">{segs}{mk}</div><div class="leg"><span>0 s</span><span>{mkl}</span><span>{v(TOT)} s</span></div></div></section>
<section><h2>Planos</h2>{cards}</section>
{"<section><h2>Pontos de atenção</h2><ul class='lista'>" + notas + "</ul></section>" if notas else ""}
</main>
'''
open(os.path.join(P, "storyboard.html"), "w", encoding="utf-8").write(page)
print(f"ok {os.path.relpath(P)}/storyboard.md + storyboard.html ({len(C)} planos, {v(TOT)} s)")
