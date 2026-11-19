"""Infra comum: CSS-base, fila de renderização e utilitários de layout."""
import json
import os
import subprocess
from pathlib import Path

import brand as B

ROOT = B.ROOT
SRC = B.SRC
HTML = SRC / "html"
PHOTOS = SRC / "photos_raw"
SCRIPTS = SRC / "scripts"

FONT_CSS = f"""
@font-face {{ font-family: 'Instrument Serif'; src: url('{(B.FONTS / 'InstrumentSerif-Regular.ttf').as_uri()}'); font-style: normal; }}
@font-face {{ font-family: 'Instrument Serif'; src: url('{(B.FONTS / 'InstrumentSerif-Italic.ttf').as_uri()}'); font-style: italic; }}
@font-face {{ font-family: 'Inter'; src: url('{(B.FONTS / 'Inter-Light.otf').as_uri()}'); font-weight: 300; }}
@font-face {{ font-family: 'Inter'; src: url('{(B.FONTS / 'Inter-Regular.otf').as_uri()}'); font-weight: 400; }}
@font-face {{ font-family: 'Inter'; src: url('{(B.FONTS / 'Inter-Medium.otf').as_uri()}'); font-weight: 500; }}
@font-face {{ font-family: 'Inter'; src: url('{(B.FONTS / 'Inter-SemiBold.otf').as_uri()}'); font-weight: 600; }}
@font-face {{ font-family: 'Inter Display'; src: url('{(B.FONTS / 'InterDisplay-Light.otf').as_uri()}'); font-weight: 300; }}
@font-face {{ font-family: 'Inter Display'; src: url('{(B.FONTS / 'InterDisplay-Regular.otf').as_uri()}'); font-weight: 400; }}
@font-face {{ font-family: 'Inter Display'; src: url('{(B.FONTS / 'InterDisplay-Medium.otf').as_uri()}'); font-weight: 500; }}
"""

BASE_CSS = FONT_CSS + f"""
:root {{ --ob:{B.OBSIDIAN}; --iv:{B.IVORY}; --co:{B.CONCRETE}; --ch:{B.CHAMPAGNE}; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:100%; height:100%; }}
body {{ font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; text-rendering:geometricPrecision; overflow:hidden; }}
.serif {{ font-family:'Instrument Serif',serif; font-weight:400; }}
.it {{ font-style:italic; }}
.cap {{ font-family:'Inter'; font-weight:500; text-transform:uppercase; letter-spacing:.32em; }}
.mono {{ font-family:'Inter'; font-weight:400; letter-spacing:.08em; font-feature-settings:'tnum' 1; }}
.abs {{ position:absolute; }}
img.ph {{ position:absolute; object-fit:cover; display:block; }}
/* grão discreto (textura de papel/filme) */
.grain::after {{ content:''; position:absolute; inset:0; pointer-events:none; opacity:.07; mix-blend-mode:overlay;
  background-image:url('{(SRC / 'scripts' / 'grain.png').as_uri()}'); background-size:256px; }}
"""

_jobs = []


def page(name, body, w, h, css="", outs=(), scale=1, transparent=False, bg=None, extra_head=""):
    """Escreve o HTML-fonte (editável) e agenda as exportações."""
    path = HTML / f"{name}.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    bgc = f"body{{background:{bg};}}" if bg else "body{background:transparent;}"
    path.write_text(f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{name}</title>
<style>{BASE_CSS}{bgc} body{{width:{w}px;height:{h}px;position:relative;}}{css}</style>{extra_head}</head>
<body>{body}</body></html>""", encoding="utf-8")
    for o in outs:
        _jobs.append({"html": str(path), "out": str(o), "w": w, "h": h, "scale": scale, "transparent": transparent})
    return path


def run():
    global _jobs
    if not _jobs:
        return
    jf = SRC / "scripts" / "_jobs.json"
    jf.write_text(json.dumps(_jobs))
    env = dict(os.environ)
    env["NODE_PATH"] = subprocess.check_output(["npm", "root", "-g"], text=True).strip()
    subprocess.run(["node", str(SRC / "scripts" / "render.js"), str(jf)], check=True, env=env)
    jf.unlink()
    _jobs = []


def photo(name):
    p = PHOTOS / f"{name}.png"
    return p.as_uri()


def svg_data(svg):
    """SVG inline para <img> (data URI)."""
    import base64
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


def sym(color, h, extra=""):
    d, w, hh = B.symbol_path(0, 0, h)
    return f'<svg width="{w:.1f}" height="{hh:.1f}" viewBox="0 0 {w:.2f} {hh:.2f}" style="display:block;{extra}"><path d="{d}" fill="{color}"/></svg>'


def word(color, cap_h, extra=""):
    top = cap_h * 0.36
    d, w, h, _ = B.wordmark_paths(cap_h, 0, top)
    return f'<svg width="{w:.1f}" height="{cap_h + top:.1f}" viewBox="0 0 {w:.2f} {cap_h + top:.2f}" style="display:block;overflow:visible;{extra}"><path d="{d}" fill="{color}"/></svg>'


def word_w(cap_h):
    return B.wordmark_paths(cap_h, 0, 0)[1]


def sym_w(h):
    return B.symbol_path(0, 0, h)[1]


# ---------------------------------------------------------------- componentes editoriais
def lab(text, size=13, color="var(--ob)", track=.32, weight=500, extra=""):
    return (f'<span style="font-family:Inter;font-weight:{weight};font-size:{size}px;letter-spacing:{track}em;'
            f'text-transform:uppercase;color:{color};white-space:nowrap;{extra}">{text}</span>')


def frame(w, h, inset=40, color="var(--ob)", tl="", tr="", bl="", br="", size=12, op=1, line=True):
    """Moldura editorial: filete fino + marcas de canto + metadados nos quatro cantos."""
    i = inset
    tick = 14
    out = []
    if line:
        out.append(f'<div class="abs" style="left:{i}px;top:{i}px;right:{i}px;bottom:{i}px;border:1px solid {color};opacity:{.35*op}"></div>')
    for (x, y, sx, sy) in [(i, i, 1, 1), (w - i, i, -1, 1), (i, h - i, 1, -1), (w - i, h - i, -1, -1)]:
        out.append(f'<div class="abs" style="left:{x - (tick if sx < 0 else 0) - (0 if sx>0 else 0)}px;top:{y - (0 if sy > 0 else 1)}px;width:{tick}px;height:1.5px;background:{color};opacity:{op}"></div>')
        out.append(f'<div class="abs" style="left:{x - (0 if sx > 0 else 1.5)}px;top:{y - (tick if sy < 0 else 0)}px;width:1.5px;height:{tick}px;background:{color};opacity:{op}"></div>')
    g = i + 22
    if tl: out.append(f'<div class="abs" style="left:{g}px;top:{i + 18}px">{lab(tl, size, color)}</div>')
    if tr: out.append(f'<div class="abs" style="right:{g}px;top:{i + 18}px">{lab(tr, size, color)}</div>')
    if bl: out.append(f'<div class="abs" style="left:{g}px;bottom:{i + 16}px">{lab(bl, size, color)}</div>')
    if br: out.append(f'<div class="abs" style="right:{g}px;bottom:{i + 16}px">{lab(br, size, color)}</div>')
    return "".join(out)


def cmark(blades, color, h, extra=""):
    d, w, hh = B.collection_mark(blades, color, h)
    return f'<svg width="{w:.1f}" height="{hh:.1f}" viewBox="0 0 {w:.2f} {hh:.2f}" style="display:block;{extra}"><path d="{d}" fill="{color}"/></svg>'


def pattern_div(color, sym_h=40, opacity=1, extra=""):
    W, H_, inner = B.pattern_tile(sym_h, color)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.2f}" height="{H_:.2f}">{inner}</svg>'
    return f'<div class="abs" style="inset:0;background-image:url({svg_data(svg)});background-size:{W:.2f}px {H_:.2f}px;opacity:{opacity};{extra}"></div>'


def lines_div(w, h, color, step=28, stroke=1, opacity=1, extra=""):
    return f'<img class="abs" style="left:0;top:0;width:{w}px;height:{h}px;opacity:{opacity};{extra}" src="{svg_data(B.lines_svg(w, h, step, color, stroke))}">'


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def cmyk(h):
    r, g, b = [v / 255 for v in hexrgb(h)]
    k = 1 - max(r, g, b)
    if k >= 1:
        return 0, 0, 0, 100
    c = (1 - r - k) / (1 - k); m = (1 - g - k) / (1 - k); y = (1 - b - k) / (1 - k)
    return tuple(round(v * 100) for v in (c, m, y, k))


def doc(name, pages, w, h, out_pdf, jpg_dir=None, jpg_prefix=None, a4=False):
    """Documento de várias páginas: HTML-fonte + PDF (texto vetorial) + JPG opcional de cada página."""
    path = HTML / f"{name}.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    secs = "".join(f'<section style="position:relative;width:{w}px;height:{h}px;overflow:hidden;page-break-after:always">{p}</section>' for p in pages)
    path.write_text(f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{name}</title>
<style>{BASE_CSS} html,body{{width:{w}px;height:auto;overflow:visible;background:#fff}} @page{{size:{"A4 landscape" if a4 else f"{w}px {h}px"};margin:0}}</style></head>
<body>{secs}</body></html>""", encoding="utf-8")
    _jobs.append({"html": str(path), "out": str(out_pdf), "w": w, "h": h, "scale": 1, "a4": a4})
    if jpg_dir:
        for i, p in enumerate(pages):
            page(f"{name}_p{i + 1:02d}", p, w, h, outs=[jpg_dir / f"{jpg_prefix}_{i + 1:02d}.jpg"], bg="#fff")
