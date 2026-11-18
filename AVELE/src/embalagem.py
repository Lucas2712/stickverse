"""AVELÉ · embalagens: caixa rígida (tampa + base), sistema de identificação, linha corporal.

Escala: 1 mm = 4 px. Caixa rígida de tampa e base: 72 × 132 × 46 mm.
Papel areia, elementos em marrom profundo, hot stamping champagne, interior em veludo marrom com berço.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from frasco import FR, bottle_svg, wordmark_group, monogram_group, symbol_group, IVORY, CHAMP, BROWN, LABEL
import logo

SAND, SAND2 = "#E9DECB", "#DCCDB3"
LINHA = {"Féminin": "FÉMININ", "Masculin": "MASCULIN", "Unisexe": "UNISEXE"}


def defs(uid):
    return f'''<defs>
<linearGradient id="foil{uid}" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#B49B70"/><stop offset=".35" stop-color="#F2E7CF"/><stop offset=".55" stop-color="#D2BD96"/>
  <stop offset=".8" stop-color="#EFE2C4"/><stop offset="1" stop-color="#A99066"/></linearGradient>
<filter id="paper{uid}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4" result="n"/>
  <feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .15  0 0 0 .07 0"/>
  <feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="velvet{uid}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="9"/>
  <feColorMatrix type="matrix" values="0 0 0 0 .9  0 0 0 0 .8  0 0 0 0 .7  0 0 0 .10 0"/>
  <feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="soft{uid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="soft2{uid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>'''


def cut_frame(x, y, w, h, r, stroke, sw):
    """Moldura com cantos côncavos (cártula clássica)."""
    d = (f"M{x + r} {y} L{x + w - r} {y} A{r} {r} 0 0 0 {x + w} {y + r} L{x + w} {y + h - r} "
         f"A{r} {r} 0 0 0 {x + w - r} {y + h} L{x + r} {y + h} A{r} {r} 0 0 0 {x} {y + h - r} "
         f"L{x} {y + r} A{r} {r} 0 0 0 {x + r} {y} Z")
    return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}"/>'


def lid_face(f, uid, W=288, H=528, paper=True):
    """Face da tampa (a 'frente' da caixa). Coordenadas locais 0..W, 0..H."""
    foil = f"url(#foil{uid})"
    cx = W / 2
    band = 362
    name = f["nome"]
    fs = 34 if len(name) <= 6 else 27
    ls = 7 if len(name) <= 6 else 4.5
    s = [f'<rect width="{W}" height="{H}" fill="{SAND}"/>']
    if paper:
        s.append(f'<rect width="{W}" height="{H}" fill="#fff" filter="url(#paper{uid})"/>')
    s.append(f'<rect x="14" y="{band}" width="{W - 28}" height="{H - band - 14}" fill="{BROWN}"/>')
    s.append(cut_frame(14, 14, W - 28, H - 28, 12, BROWN, 1.4))
    s.append(cut_frame(20, 20, W - 40, band - 26, 8, BROWN, .5))
    s.append(wordmark_group(cx, 50, 170, BROWN))
    s.append(f'<text x="{cx + 1.5}" y="{126}" text-anchor="middle" font-family="InterA" font-weight="500" font-size="7.2" letter-spacing="3.2" fill="{BROWN}">MAISON DE PARFUM</text>')
    s.append(f'<ellipse cx="{cx}" cy="236" rx="60" ry="80" fill="none" stroke="{foil}" stroke-width="2.2"/>')
    s.append(f'<ellipse cx="{cx}" cy="236" rx="54" ry="74" fill="none" stroke="{foil}" stroke-width=".8"/>')
    s.append(symbol_group(f["simbolo"], cx, 236, 108, BROWN, SAND, sw=2.1))
    s.append(f'<text x="{cx + 1.5}" y="{336}" text-anchor="middle" font-family="InterA" font-weight="500" font-size="8" letter-spacing="3" fill="{BROWN}">N° {f["n"]}</text>')
    s.append(f'<text x="{cx + ls / 2}" y="{band + 66}" text-anchor="middle" font-family="Cormorant" font-weight="500" font-size="{fs}" letter-spacing="{ls}" fill="{foil}">{name}</text>')
    s.append(f'<line x1="{cx - 18}" x2="{cx + 18}" y1="{band + 84}" y2="{band + 84}" stroke="{foil}" stroke-width=".9"/>')
    s.append(f'<text x="{cx + 1.5}" y="{band + 106}" text-anchor="middle" font-family="InterA" font-weight="400" font-size="7.6" letter-spacing="3" fill="{foil}">EAU DE PARFUM</text>')
    s.append(f'<text x="{cx + 1}" y="{band + 122}" text-anchor="middle" font-family="InterA" font-weight="400" font-size="7" letter-spacing="2" fill="{foil}">100 ml · 3.4 fl.oz</text>')
    s.append(f'<text x="{cx + 1.5}" y="{band + 145}" text-anchor="middle" font-family="InterA" font-weight="500" font-size="6" letter-spacing="3" fill="{foil}" opacity=".9">{LINHA[f["linha"]]}</text>')
    return "".join(s)


def side_face(f, uid, D=184, H=528):
    s = [f'<rect width="{D}" height="{H}" fill="{SAND}"/>',
         f'<rect width="{D}" height="{H}" fill="#fff" filter="url(#paper{uid})"/>',
         f'<rect x="12" y="12" width="{D - 24}" height="{H - 24}" fill="none" stroke="{BROWN}" stroke-width=".6"/>']
    cx = D / 2
    s.append(f'<text x="{cx}" y="62" text-anchor="middle" font-family="Cormorant" font-style="italic" font-size="15" fill="{BROWN}">{f["familiaFr"]}</text>')
    y = 104
    for lab, key in (("TÊTE", "saida"), ("CŒUR", "coracao"), ("FOND", "fundo")):
        s.append(f'<text x="{cx}" y="{y}" text-anchor="middle" font-family="InterA" font-weight="500" font-size="6.2" letter-spacing="2.6" fill="{BROWN}">{lab}</text>')
        for i, n in enumerate(f[key]):
            s.append(f'<text x="{cx}" y="{y + 16 + i * 12}" text-anchor="middle" font-family="Cormorant" font-size="10.5" fill="{BROWN}">{n}</text>')
        y += 74
    s.append(f'<line x1="{cx - 14}" x2="{cx + 14}" y1="{y + 6}" y2="{y + 6}" stroke="{BROWN}" stroke-width=".6"/>')
    s.append(monogram_group(cx, y + 60, 46, BROWN))
    s.append(f'<text x="{cx}" y="{H - 40}" text-anchor="middle" font-family="InterA" font-size="5" letter-spacing="1.2" fill="{BROWN}" opacity=".8">PROJET CONCEPTUEL · STUDIO MATTEU</text>')
    return "".join(s)


def top_face(f, uid, W=288, D=184):
    return (f'<rect width="{W}" height="{D}" fill="{SAND}"/><rect width="{W}" height="{D}" fill="#fff" filter="url(#paper{uid})"/>'
            f'<rect x="10" y="10" width="{W - 20}" height="{D - 20}" fill="none" stroke="{BROWN}" stroke-width=".6"/>'
            + monogram_group(W / 2, D / 2 - 6, 70, f"url(#foil{uid})"))


def box_standing(f, uid=None, x=0, y=0, k=1.0, shadow=True):
    """Caixa em pé, vista 3/4 (frente + lateral direita + topo)."""
    uid = uid or "b" + f["n"]
    W, H, D = 288, 528, 184
    sx, sk = 0.36, -0.42          # escala horizontal e inclinação da lateral
    ty = -D * 0.22                 # altura aparente do topo
    s = [defs(uid), f'<g transform="translate({x} {y}) scale({k})">']
    if shadow:
        s.append(f'<ellipse cx="{W * .62}" cy="{H + 6}" rx="{W * .8}" ry="22" fill="#1b110a" opacity=".38" filter="url(#soft{uid})"/>')
    # lateral
    s.append(f'<g transform="matrix({sx} {sk * sx} 0 1 {W} 0)">{side_face(f, uid)}'
             f'<rect width="{D}" height="{H}" fill="#2b1d13" opacity=".28"/></g>')
    # topo
    s.append(f'<g transform="matrix(1 0 {sx} {sk * sx} 0 0)"><g transform="translate(0 {-D}) ">'
             f'</g></g>')
    s.append(f'<path d="M0 0 L{W} 0 L{W + D * sx} {D * sk * sx} L{D * sx} {D * sk * sx} Z" fill="{SAND}"/>')
    s.append(f'<path d="M0 0 L{W} 0 L{W + D * sx} {D * sk * sx} L{D * sx} {D * sk * sx} Z" fill="#fff" opacity=".45"/>')
    s.append(f'<path d="M0 0 L{D * sx} {D * sk * sx} L{W + D * sx} {D * sk * sx} L{W + D * sx} {D * sk * sx + H}" fill="none" stroke="#8a785e" stroke-opacity=".5" stroke-width=".8"/>')
    s.append(f'<g transform="matrix(1 0 {sx} {sk * sx} 0 0) translate(0 0)" opacity=".9">'
             f'<g transform="matrix(1 0 0 -1 0 0)"></g></g>')
    # frente
    s.append(lid_face(f, uid))
    s.append(f'<rect width="{W}" height="{H}" fill="url(#shade{uid})"/>')
    s.append(f'<linearGradient id="shade{uid}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient>')
    # aresta da tampa (tampa telescópica: linha de junção a 2/3)
    s.append(f'<line x1="0" x2="{W}" y1="{H - 2}" y2="{H - 2}" stroke="#000" stroke-opacity=".15"/>')
    s.append(f'<line x1="0" x2="{W}" y1=".6" y2=".6" stroke="#fff" stroke-opacity=".7"/>')
    s.append(f'<line x1="{W}" x2="{W + D * sx}" y1=".5" y2="{D * sk * sx + .5}" stroke="#fff" stroke-opacity=".5"/>')
    s.append("</g>")
    return "".join(s)


def box_open_topdown(f, uid=None, x=0, y=0, k=1.0):
    """Vista de cima: base aberta em veludo com o frasco deitado no berço + tampa ao lado."""
    uid = uid or "o" + f["n"]
    W, H = 288, 528
    wall = 16
    s = [defs(uid), f'<g transform="translate({x} {y}) scale({k})">']
    # sombras
    s.append(f'<rect x="10" y="16" width="{W}" height="{H}" fill="#1b110a" opacity=".35" filter="url(#soft{uid})"/>')
    # base: borda em papel areia, interior veludo
    s.append(f'<rect width="{W}" height="{H}" fill="{SAND2}"/>')
    s.append(f'<rect x="{wall}" y="{wall}" width="{W - 2 * wall}" height="{H - 2 * wall}" fill="#3B2B22"/>')
    s.append(f'<rect x="{wall}" y="{wall}" width="{W - 2 * wall}" height="{H - 2 * wall}" fill="#fff" filter="url(#velvet{uid})"/>')
    s.append(f'<rect x="{wall}" y="{wall}" width="{W - 2 * wall}" height="18" fill="#000" opacity=".25" filter="url(#soft2{uid})"/>')
    s.append(f'<rect x="{wall}" y="{wall}" width="14" height="{H - 2 * wall}" fill="#000" opacity=".2" filter="url(#soft2{uid})"/>')
    # berço: recorte no formato do frasco
    bx, by = W / 2, H / 2 + 10
    s.append(f'<g transform="translate({bx} {by}) rotate(0)">'
             f'<rect x="-95" y="-108" width="200" height="314" rx="12" fill="#2A1E17"/>'
             f'<rect x="-56" y="-208" width="122" height="96" rx="4" fill="#2A1E17"/>'
             f'<rect x="-95" y="-108" width="200" height="314" rx="12" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="3"/>'
             f'</g>')
    # frasco deitado (vista frontal vista de cima)
    s.append(f'<g transform="translate({bx - 161} {by - 286}) scale(.62)">{bottle_svg(f["nome"], shadow=False, uid="t" + uid, standalone=False)}</g>')
    # fita de puxar
    s.append(f'<path d="M{W / 2 - 10} {H - wall} L{W / 2 + 10} {H - wall} L{W / 2 + 10} {H - wall - 40} L{W / 2 - 10} {H - wall - 40} Z" fill="{CHAMP}" opacity=".85"/>')
    s.append("</g>")
    return "".join(s)


def lid_flat(f, uid=None, x=0, y=0, k=1.0, rot=0):
    uid = uid or "l" + f["n"]
    return (defs(uid) + f'<g transform="translate({x} {y}) rotate({rot}) scale({k})">'
            f'<rect x="12" y="18" width="288" height="528" fill="#1b110a" opacity=".35" filter="url(#soft{uid})"/>'
            + lid_face(f, uid) + '</g>')


# ------------------------------------------------------------------ linha corporal
def body_label(f, uid, cx, y, w, h, title, vol):
    c = LABEL[f["etiqueta"]]
    name = f["nome"]
    return (f'<rect x="{cx - w / 2}" y="{y}" width="{w}" height="{h}" fill="{c["paper"]}"/>'
            f'<rect x="{cx - w / 2 + 5}" y="{y + 5}" width="{w - 10}" height="{h - 10}" fill="none" stroke="{c["rule"]}" stroke-width=".6"/>'
            + wordmark_group(cx, y + 16, w * .52, c["ink"])
            + f'<text x="{cx + 2}" y="{y + h * .52}" text-anchor="middle" font-family="Cormorant" font-weight="500" font-size="{w * .12}" letter-spacing="{w * .022}" fill="{c["ink"]}">{name}</text>'
            f'<line x1="{cx - 10}" x2="{cx + 10}" y1="{y + h * .6}" y2="{y + h * .6}" stroke="{c["rule"]}" stroke-width=".5"/>'
            f'<text x="{cx + 1}" y="{y + h * .72}" text-anchor="middle" font-family="Cormorant" font-style="italic" font-size="{w * .072}" fill="{c["ink"]}">{title}</text>'
            f'<text x="{cx + 1}" y="{y + h * .86}" text-anchor="middle" font-family="InterA" font-size="{w * .036}" letter-spacing="1.4" fill="{c["ink"]}">{vol}</text>')


def metal_defs(uid):
    return f'''<defs><linearGradient id="mt{uid}" x1="0" x2="1"><stop offset="0" stop-color="#9C8664"/><stop offset=".25" stop-color="#EFE3C8"/><stop offset=".5" stop-color="#D2BD96"/><stop offset=".8" stop-color="#E6D7B9"/><stop offset="1" stop-color="#9A8461"/></linearGradient>
<linearGradient id="tb{uid}" x1="0" x2="1"><stop offset="0" stop-color="#CBBC9F"/><stop offset=".22" stop-color="#F3ECDF"/><stop offset=".5" stop-color="#EAE0CE"/><stop offset=".85" stop-color="#D9CBB1"/><stop offset="1" stop-color="#BFAE8F"/></linearGradient>
<linearGradient id="am{uid}" x1="0" x2="1"><stop offset="0" stop-color="#7A4420" stop-opacity=".95"/><stop offset=".18" stop-color="#C98A52" stop-opacity=".8"/><stop offset=".5" stop-color="#D99D63" stop-opacity=".72"/><stop offset=".85" stop-color="#A9672F" stop-opacity=".88"/><stop offset="1" stop-color="#6A3818" stop-opacity=".97"/></linearGradient>
<linearGradient id="hl{uid}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="bb{uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="b3{uid}"><feGaussianBlur stdDeviation="2.5"/></filter></defs>'''


def tube(f, uid=None, x=0, y=0, k=1.0):
    """Crème pour le corps 200 ml: bisnaga marfim, tampa champagne embaixo (em pé sobre a tampa)."""
    uid = uid or "tu" + f["n"]
    s = [metal_defs(uid), f'<g transform="translate({x} {y}) scale({k})">']
    s.append(f'<ellipse cx="100" cy="562" rx="100" ry="12" fill="#1b110a" opacity=".4" filter="url(#bb{uid})"/>')
    s.append('<path d="M18 30 L182 30 L180 44 C176 180 150 360 146 470 L54 470 C50 360 24 180 20 44 Z" fill="url(#tb%s)"/>' % uid)
    s.append('<rect x="18" y="16" width="164" height="22" fill="url(#tb%s)"/>' % uid)
    for i in range(6):
        s.append(f'<line x1="22" x2="178" y1="{19 + i * 3.4}" y2="{19 + i * 3.4}" stroke="#A69477" stroke-width=".6" opacity=".6"/>')
    s.append(f'<rect x="54" y="470" width="92" height="90" rx="3" fill="url(#mt{uid})"/>')
    s.append(f'<rect x="54" y="470" width="92" height="3" fill="#000" opacity=".2"/>')
    s.append(f'<rect x="40" y="60" width="16" height="380" fill="url(#hl{uid})" opacity=".5" filter="url(#b3{uid})"/>')
    s.append(body_label(f, uid, 100, 150, 112, 190, "Crème pour le corps", "200 ml"))
    s.append("</g>")
    return "".join(s)


def pump_bottle(f, uid=None, x=0, y=0, k=1.0, title="Savon liquide", vol="300 ml", tall=1.0):
    """Savon liquide 300 ml / Lotion parfumée 200 ml: vidro âmbar retangular com válvula champagne."""
    uid = uid or "pb" + f["n"] + title[:3]
    bh = 330 * tall
    top = 560 - bh
    s = [metal_defs(uid), f'<g transform="translate({x} {y}) scale({k})">']
    s.append(f'<ellipse cx="104" cy="562" rx="110" ry="12" fill="#1b110a" opacity=".45" filter="url(#bb{uid})"/>')
    # válvula
    s.append(f'<rect x="88" y="{top - 108}" width="24" height="70" fill="url(#mt{uid})"/>')
    s.append(f'<path d="M86 {top - 112} L150 {top - 112} Q160 {top - 112} 160 {top - 102} L160 {top - 96} L86 {top - 96} Z" fill="url(#mt{uid})"/>')
    s.append(f'<rect x="80" y="{top - 116}" width="40" height="26" rx="2" fill="url(#mt{uid})"/>')
    s.append(f'<rect x="70" y="{top - 40}" width="60" height="42" rx="2" fill="url(#mt{uid})"/>')
    for i in range(7):
        s.append(f'<line x1="70" x2="130" y1="{top - 36 + i * 5}" y2="{top - 36 + i * 5}" stroke="#7d6a4c" stroke-opacity=".35"/>')
    # corpo
    s.append(f'<rect x="20" y="{top}" width="168" height="{bh}" rx="12" fill="url(#am{uid})"/>')
    s.append(f'<rect x="20" y="{top + bh - 30}" width="168" height="30" rx="10" fill="#5a2e12" opacity=".35"/>')
    s.append(f'<rect x="30" y="{top + 14}" width="12" height="{bh - 50}" fill="url(#hl{uid})" opacity=".8" filter="url(#b3{uid})"/>')
    s.append(f'<rect x="170" y="{top + 20}" width="5" height="{bh - 60}" fill="#fff" opacity=".3" filter="url(#b3{uid})"/>')
    s.append(f'<rect x="20.5" y="{top + .5}" width="167" height="{bh - 1}" rx="12" fill="none" stroke="#fff" stroke-opacity=".25"/>')
    s.append(body_label(f, uid, 104, top + bh * .3, 116, 176, title, vol))
    s.append("</g>")
    return "".join(s)


if __name__ == "__main__":
    import stage
    out = os.path.join(stage.ROOT, "04-Packaging")
    # faces planas (arte-final editável em SVG)
    os.makedirs(os.path.join(out, "svg"), exist_ok=True)
    for f in FR.values():
        uid = "f" + f["n"]
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {288 + 24 + 184} 528">'
               f'<style>{stage.FONTS.replace(stage.ROOT, "../..")}</style>{defs(uid)}'
               f'{lid_face(f, uid)}<g transform="translate(312 0)">{side_face(f, uid)}</g></svg>')
        open(os.path.join(out, "svg", f"caixa-{f['n']}-{f['nome'].lower()}-faces.svg"), "w").write(svg)
    print("svg ok")
