"""AVELÉ · frasco Eau de Parfum 100 ml (render vetorial paramétrico).

Vista frontal com leve 3/4 (face lateral à direita e topo da tampa visíveis).
Proporções de referência (mm): corpo 56 × 74 × 34, tampa 34 × 27 × 26, gargalo/colar 16 × 4.
O vidro é semitransparente: sobre uma foto, o fundo aparece tingido de âmbar.
"""
import json, os, sys, math
sys.path.insert(0, os.path.dirname(__file__))
import logo
from botanica import SYMBOLS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA = json.load(open(os.path.join(ROOT, "01-Brand-Strategy", "fragrancias.json")))
FR = {f["nome"]: f for f in DATA["fragrancias"]}
IVORY, CHAMP, BROWN = "#F4EFE5", "#D8C4A0", "#49372D"

LABEL = {  # colorway por linha
    "ivory": dict(paper=IVORY, paper2="#ECE4D6", ink=BROWN, rule=BROWN),
    "brown": dict(paper=BROWN, paper2="#3E2E25", ink=CHAMP, rule=CHAMP),
    "champagne": dict(paper=CHAMP, paper2="#CDB68F", ink=BROWN, rule=BROWN),
}


def font_css(rel):
    return (f"@font-face{{font-family:'Cormorant';src:url({rel}/fonts/cormorant-garamond-latin-500-normal.woff2)}}"
            f"@font-face{{font-family:'Cormorant';font-style:italic;src:url({rel}/fonts/cormorant-garamond-latin-400-italic.woff2)}}"
            f"@font-face{{font-family:'InterA';font-weight:400;src:url({rel}/fonts/inter-latin-400-normal.woff2)}}"
            f"@font-face{{font-family:'InterA';font-weight:500;src:url({rel}/fonts/inter-latin-500-normal.woff2)}}")


def wordmark_group(x, y, w, fill, small=True):
    logo.set_optical(small)
    d, (x0, y0, W, H) = logo.wordmark()
    logo.set_optical(False)
    s = w / W
    return f'<g transform="translate({x - w / 2:.2f} {y:.2f}) scale({s:.5f}) translate(0 260)"><path fill="{fill}" d="{d}"/></g>'


def monogram_group(cx, cy, h, fill, opacity=1.0):
    d, mcx = logo.monogram_paths()
    s = h / 1012
    return (f'<g opacity="{opacity}" transform="translate({cx - mcx * s:.2f} {cy - 500 * s:.2f}) scale({s:.5f})">'
            f'<path fill="{fill}" d="{d}"/></g>')


def symbol_group(key, cx, cy, size, ink, bg, sw=1.6):
    sym = SYMBOLS[key]()
    inner = sym.svg(ink=ink, bg=bg, sw=sw)
    inner = inner[inner.index("<g"):inner.rindex("</svg>")]
    s = size / 200
    return f'<g transform="translate({cx - size / 2:.2f} {cy - size / 2:.2f}) scale({s:.4f})">{inner}</g>'


def label_svg(f, x, y, w, h, uid):
    c = LABEL[f["etiqueta"]]
    cx = x + w / 2
    name = f["nome"]
    ls = 5.2 if len(name) <= 6 else 3.6
    fs = 27 if len(name) <= 6 else 23.5
    return f'''
  <defs><linearGradient id="lp{uid}" x1="0" x2="1"><stop offset="0" stop-color="{c['paper2']}"/><stop offset=".45" stop-color="{c['paper']}"/><stop offset="1" stop-color="{c['paper2']}"/></linearGradient></defs>
  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#lp{uid})"/>
  <rect x="{x + 6}" y="{y + 6}" width="{w - 12}" height="{h - 12}" fill="none" stroke="{c['rule']}" stroke-width=".7" opacity=".85"/>
  {wordmark_group(cx, y + 19, 96, c['ink'])}
  <text x="{cx}" y="{y + 67}" text-anchor="middle" font-family="InterA" font-weight="500" font-size="5.8" letter-spacing="2.2" fill="{c['ink']}">N° {f['n']}</text>
  {symbol_group(f['simbolo'], cx, y + 97, 40, c['ink'], c['paper'], sw=3)}
  <text x="{cx + ls / 2}" y="{y + 142}" text-anchor="middle" font-family="Cormorant" font-size="{fs}" letter-spacing="{ls}" fill="{c['ink']}">{name}</text>
  <line x1="{cx - 14}" x2="{cx + 14}" y1="{y + 151}" y2="{y + 151}" stroke="{c['rule']}" stroke-width=".6"/>
  <text x="{cx + 1}" y="{y + 163}" text-anchor="middle" font-family="InterA" font-weight="400" font-size="5" letter-spacing="2" fill="{c['ink']}">EAU DE PARFUM</text>
  <text x="{cx + 1}" y="{y + 172}" text-anchor="middle" font-family="InterA" font-weight="400" font-size="4.6" letter-spacing="1.4" fill="{c['ink']}" opacity=".85">100 ml · 3.4 fl.oz</text>
'''


def bottle_svg(name, rel="..", shadow=True, uid=None, standalone=True, light=None):
    """light: (lado 'left'|'right', intensidade 0..1, cor) → luz de recorte quente sobre vidro e tampa."""
    f = FR[name]
    uid = uid or f["n"]
    L1, L2 = f["liquido"]
    # geometria
    X0, X1 = 120, 400            # face frontal do corpo
    YT, YB = 300, 780            # topo / base do corpo
    DX, DY = 22, -9             # deslocamento da face lateral (3/4)
    R = 16
    capX0, capX1, capT, capB = 180, 340, 140, 268
    colY0, colY1 = 268, 300
    lvl = YT + 46                # nível do líquido
    base = YB - 52               # base espessa de vidro
    W = X1 - X0
    parts = []
    parts.append(f'''<defs>
  <linearGradient id="gl{uid}" x1="0" x2="1">
    <stop offset="0" stop-color="{L2}" stop-opacity=".92"/><stop offset=".12" stop-color="{L1}" stop-opacity=".62"/>
    <stop offset=".5" stop-color="{L1}" stop-opacity=".42"/><stop offset=".88" stop-color="{L1}" stop-opacity=".6"/>
    <stop offset="1" stop-color="{L2}" stop-opacity=".95"/></linearGradient>
  <linearGradient id="lq{uid}" x1="0" x2="1">
    <stop offset="0" stop-color="{L2}"/><stop offset=".22" stop-color="{L1}"/><stop offset=".55" stop-color="{L1}" stop-opacity=".93"/>
    <stop offset=".85" stop-color="{L2}" stop-opacity=".96"/><stop offset="1" stop-color="{L2}"/></linearGradient>
  <linearGradient id="lqv{uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
  <linearGradient id="sd{uid}" x1="0" x2="1">
    <stop offset="0" stop-color="{L2}" stop-opacity=".95"/><stop offset=".6" stop-color="{L2}" stop-opacity=".78"/><stop offset="1" stop-color="#2a1608" stop-opacity=".9"/></linearGradient>
  <linearGradient id="bs{uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{L2}" stop-opacity=".75"/><stop offset=".5" stop-color="{L1}" stop-opacity=".85"/><stop offset="1" stop-color="{L2}" stop-opacity=".98"/></linearGradient>
  <linearGradient id="cp{uid}" x1="0" x2="1">
    <stop offset="0" stop-color="#9C8664"/><stop offset=".08" stop-color="#C9B48E"/><stop offset=".3" stop-color="#EFE3C8"/>
    <stop offset=".46" stop-color="#D8C4A0"/><stop offset=".7" stop-color="#C2AC85"/><stop offset=".9" stop-color="#E2D2B2"/><stop offset="1" stop-color="#A48E6B"/></linearGradient>
  <linearGradient id="cs{uid}" x1="0" x2="1"><stop offset="0" stop-color="#9A8462"/><stop offset="1" stop-color="#6F5C42"/></linearGradient>
  <linearGradient id="ct{uid}" x1="0" x2="1"><stop offset="0" stop-color="#F3EAD6"/><stop offset="1" stop-color="#CDB993"/></linearGradient>
  <linearGradient id="col{uid}" x1="0" x2="1"><stop offset="0" stop-color="#8E7957"/><stop offset=".35" stop-color="#EADCBE"/><stop offset=".7" stop-color="#BBA47C"/><stop offset="1" stop-color="#8A7553"/></linearGradient>
  <linearGradient id="hl{uid}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="sh{uid}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1c120c" stop-opacity=".55"/><stop offset="1" stop-color="#1c120c" stop-opacity="0"/></radialGradient>
  <filter id="bl{uid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="bl2{uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  <clipPath id="body{uid}"><rect x="{X0}" y="{YT}" width="{W}" height="{YB - YT}" rx="{R}"/></clipPath>
</defs>''')
    if shadow:
        parts.append(f'<ellipse cx="{(X0 + X1) / 2 + 30}" cy="{YB + 4}" rx="{W * .72}" ry="20" fill="url(#sh{uid})" filter="url(#bl2{uid})"/>')
        parts.append(f'<ellipse cx="{(X0 + X1) / 2 + 10}" cy="{YB + 1}" rx="{W * .52}" ry="6" fill="#140c07" opacity=".45" filter="url(#bl{uid})"/>')
    # face lateral do corpo
    parts.append(f'<path d="M{X1 - 3} {YT + R * .5} L{X1 + DX - 4} {YT + DY + R * .5} Q{X1 + DX} {YT + DY + R * .5} {X1 + DX} {YT + DY + R} L{X1 + DX} {YB + DY - R} Q{X1 + DX} {YB + DY - R * .4} {X1 + DX - 5} {YB + DY - R * .2} L{X1 - 3} {YB - R * .3} Z" fill="url(#sd{uid})"/>')
    parts.append(f'<path d="M{X1 + DX - 3} {YT + DY + R + 8} L{X1 + DX - 3} {YB + DY - R - 8}" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>')
    # topo do corpo (ombro)
    parts.append(f'<path d="M{X0 + R} {YT + .5} L{X1 - R / 2} {YT + .5} L{X1 + DX - R / 2} {YT + DY} L{X0 + R + DX} {YT + DY} Z" fill="{L1}" opacity=".5"/>')
    # corpo frontal: vidro
    parts.append(f'<g clip-path="url(#body{uid})">')
    parts.append(f'<rect x="{X0}" y="{YT}" width="{W}" height="{YB - YT}" fill="url(#gl{uid})"/>')
    # líquido
    parts.append(f'<rect x="{X0 + 16}" y="{lvl}" width="{W - 32}" height="{base - lvl}" fill="url(#lq{uid})"/>')
    parts.append(f'<rect x="{X0 + 16}" y="{lvl}" width="{W - 32}" height="{base - lvl}" fill="url(#lqv{uid})"/>')
    parts.append(f'<rect x="{X0 + 16}" y="{lvl - 1}" width="{W - 32}" height="3" fill="#fff" opacity=".35"/>')
    # tubo
    parts.append(f'<rect x="{(X0 + X1) / 2 - 2.2}" y="{YT}" width="4.4" height="{base - YT - 6}" fill="#fff" opacity=".16"/>')
    # base espessa
    parts.append(f'<rect x="{X0}" y="{base}" width="{W}" height="{YB - base}" fill="url(#bs{uid})"/>')
    parts.append(f'<rect x="{X0 + 10}" y="{base + 4}" width="{W - 20}" height="2" fill="#fff" opacity=".28"/>')
    parts.append(f'<rect x="{X0 + 10}" y="{YB - 10}" width="{W - 20}" height="3" fill="#fff" opacity=".14"/>')
    # paredes (espessura do vidro) e reflexos
    parts.append(f'<rect x="{X0 + 14}" y="{YT + 8}" width="2" height="{YB - YT - 16}" fill="#fff" opacity=".22"/>')
    parts.append(f'<rect x="{X1 - 16}" y="{YT + 8}" width="2" height="{YB - YT - 16}" fill="#fff" opacity=".14"/>')
    parts.append(f'<rect x="{X0 + 24}" y="{YT + 20}" width="20" height="{YB - YT - 60}" fill="url(#hl{uid})" opacity=".75" filter="url(#bl{uid})"/>')
    parts.append(f'<rect x="{X0 + 5}" y="{YT + 10}" width="4" height="{YB - YT - 20}" fill="#fff" opacity=".45" filter="url(#bl{uid})"/>')
    parts.append(f'<rect x="{X1 - 34}" y="{YT + 30}" width="8" height="{YB - YT - 120}" fill="url(#hl{uid})" opacity=".35" filter="url(#bl{uid})"/>')
    parts.append('</g>')
    parts.append(f'<rect x="{X0 + .5}" y="{YT + .5}" width="{W - 1}" height="{YB - YT - 1}" rx="{R}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1"/>')
    # etiqueta (vista através do vidro, colada na face frontal)
    lw, lh = 170, 184
    lx, ly = (X0 + X1) / 2 - lw / 2, 432
    parts.append(f'<rect x="{lx + 2}" y="{ly + 3}" width="{lw}" height="{lh}" fill="#000" opacity=".18" filter="url(#bl{uid})"/>')
    parts.append(label_svg(f, lx, ly, lw, lh, uid))
    parts.append(f'<rect x="{lx}" y="{ly}" width="{lw}" height="{lh}" fill="url(#hl{uid})" opacity=".07"/>')
    # colar (gargalo metálico)
    parts.append(f'<path d="M{capX0 + 22} {colY0} L{capX1 - 22} {colY0} L{capX1 - 22 + 14} {colY0 - 5} L{capX1 - 22 + 14} {colY1 - 8} L{capX1 - 22} {colY1} Z" fill="#6F5C42"/>')
    parts.append(f'<rect x="{capX0 + 22}" y="{colY0}" width="{capX1 - capX0 - 44}" height="{colY1 - colY0}" fill="url(#col{uid})"/>')
    parts.append(f'<rect x="{capX0 + 22}" y="{colY0 + 10}" width="{capX1 - capX0 - 44}" height="1.2" fill="#5b4a33" opacity=".5"/>')
    # tampa
    cdx, cdy = 16, -7
    parts.append(f'<path d="M{capX1} {capT} L{capX1 + cdx} {capT + cdy} L{capX1 + cdx} {capB + cdy} L{capX1} {capB} Z" fill="url(#cs{uid})"/>')
    parts.append(f'<path d="M{capX0} {capT} L{capX1} {capT} L{capX1 + cdx} {capT + cdy} L{capX0 + cdx} {capT + cdy} Z" fill="url(#ct{uid})"/>')
    parts.append(f'<rect x="{capX0}" y="{capT}" width="{capX1 - capX0}" height="{capB - capT}" fill="url(#cp{uid})"/>')
    # textura escovada
    for i in range(0, capB - capT, 3):
        op = 0.05 + 0.04 * ((i * 7) % 5) / 5
        parts.append(f'<rect x="{capX0}" y="{capT + i}" width="{capX1 - capX0}" height=".6" fill="#fff" opacity="{op:.3f}"/>')
    parts.append(f'<rect x="{capX0}" y="{capT}" width="{capX1 - capX0}" height="1.6" fill="#fff" opacity=".6"/>')
    parts.append(f'<rect x="{capX0}" y="{capB - 2}" width="{capX1 - capX0}" height="2" fill="#5b4a33" opacity=".45"/>')
    # monograma em baixo-relevo na tampa
    mcx, mcy = (capX0 + capX1) / 2, (capT + capB) / 2 - 2
    parts.append(monogram_group(mcx + .8, mcy + .9, 50, "#fff", .45))
    parts.append(monogram_group(mcx, mcy, 50, "#7D6A4C", .55))
    parts.append(f'<ellipse cx="{mcx}" cy="{mcy - 3}" rx="38" ry="49" fill="none" stroke="#7D6A4C" stroke-opacity=".45" stroke-width="1"/>')
    if light:
        side, k, col = light[:3]
        dk = light[3] if len(light) > 3 else .55
        x1, x2 = ("0", "1") if side == "left" else ("1", "0")
        parts.append(f'<defs><linearGradient id="lt{uid}" x1="{x1}" x2="{x2}"><stop offset="0" stop-color="{col}" stop-opacity="{k}"/>'
                     f'<stop offset=".45" stop-color="{col}" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="{dk}"/></linearGradient>'
                     f'<clipPath id="lc{uid}"><rect x="{X0}" y="{YT + DY}" width="{W + DX}" height="{YB - YT - DY}" rx="{R}"/>'
                     f'<rect x="{capX0}" y="{capT + cdy}" width="{capX1 - capX0 + cdx}" height="{colY1 - capT - cdy}"/></clipPath></defs>')
        parts.append(f'<rect x="0" y="0" width="600" height="900" fill="url(#lt{uid})" clip-path="url(#lc{uid})" style="mix-blend-mode:soft-light"/>')
        sx = X0 + 3 if side == "left" else X1 + DX - 6
        parts.append(f'<rect x="{sx}" y="{YT + 12}" width="3" height="{YB - YT - 30}" fill="{col}" opacity="{.55 * k + .2}" filter="url(#bl{uid})"/>')
    body = "".join(parts)
    if not standalone:
        return body
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="80 90 400 730" width="400" height="730">'
            f'<style>{font_css(rel)}</style>{body}</svg>')


if __name__ == "__main__":
    out = os.path.join(ROOT, "05-Product-Design", "svg")
    os.makedirs(out, exist_ok=True)
    for n, f in FR.items():
        open(os.path.join(out, f"frasco-{f['n']}-{f['simbolo']}.svg"), "w").write(bottle_svg(n, rel="../.."))
    print("ok")
