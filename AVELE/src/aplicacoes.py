"""AVELÉ · aplicações da identidade: papelaria, papel de seda, selos, mouillettes, sacolas."""
import os, sys, math
sys.path.insert(0, os.path.dirname(__file__))
import stage, logo
from frasco import FR, wordmark_group, monogram_group, symbol_group
from embalagem import defs as pdefs, cut_frame, box_open_topdown, lid_flat
from composicao import GRAIN, bottle_at

ROOT = stage.ROOT
IV, CH, BR, SAND = "#F4EFE5", "#D8C4A0", "#49372D", "#E9DECB"
FOIL = "url(#foilA)"
DEFS = pdefs("A")


def drop_path(cx, cy, s, fill):
    d = logo.drop(cx - 0.55 * s, cy + 0.8 * s, cx + 0.55 * s, cy - 0.8 * s, 0.22 * s)
    return f'<path d="{d}" fill="{fill}"/>'


def shadowed(inner, x, y, w, h, rot=0, sh=18, op=.28):
    return (f'<g transform="translate({x} {y}) rotate({rot} {w / 2} {h / 2})">'
            f'<rect x="{sh * .4}" y="{sh * .7}" width="{w}" height="{h}" fill="#2b1a0f" opacity="{op}" filter="url(#softA)"/>'
            f'{inner}</g>')


# --------------------------------------------------------------- cartões institucionais (85×55 mm → 425×275)
def card_front(w=425, h=275):
    return (f'<rect width="{w}" height="{h}" fill="{BR}"/>'
            f'<rect width="{w}" height="{h}" fill="#fff" filter="url(#paperA)" opacity=".5"/>'
            + wordmark_group(w / 2, h / 2 - 34, 210, FOIL)
            + f'<line x1="{w / 2 - 16}" x2="{w / 2 + 16}" y1="{h / 2 + 50}" y2="{h / 2 + 50}" stroke="{FOIL}" stroke-width="1"/>'
            f'<text x="{w / 2 + 1}" y="{h / 2 + 76}" text-anchor="middle" font-family="Cormorant" font-style="italic" font-size="15" fill="{CH}">L’élégance est une essence.</text>')


def card_back(w=425, h=275):
    return (f'<rect width="{w}" height="{h}" fill="{IV}"/>'
            f'<rect width="{w}" height="{h}" fill="#fff" filter="url(#paperA)"/>'
            + monogram_group(56, 62, 46, BR)
            + f'<text x="34" y="{h - 92}" font-family="Cormorant" font-weight="500" font-size="22" fill="{BR}">Prénom Nom</text>'
            f'<text x="34" y="{h - 70}" font-family="InterA" font-size="8.5" letter-spacing="2.4" fill="{BR}">CONSEILLÈRE EN PARFUM</text>'
            f'<line x1="34" x2="{w - 34}" y1="{h - 52}" y2="{h - 52}" stroke="{BR}" stroke-width=".5" opacity=".6"/>'
            f'<text x="34" y="{h - 32}" font-family="InterA" font-size="8" letter-spacing="1.6" fill="{BR}" opacity=".85">MAISON AVELÉ · PROJET CONCEPTUEL</text>'
            f'<text x="{w - 34}" y="{h - 32}" text-anchor="end" font-family="InterA" font-size="8" letter-spacing="1.6" fill="{BR}" opacity=".85">STUDIO MATTEU</text>')


# --------------------------------------------------------------- cartão de fragrância (100×150 mm → 400×600)
def frag_card(f, w=400, h=600):
    s = [f'<rect width="{w}" height="{h}" fill="{IV}"/>', f'<rect width="{w}" height="{h}" fill="#fff" filter="url(#paperA)"/>',
         cut_frame(16, 16, w - 32, h - 32, 12, BR, 1)]
    cx = w / 2
    s.append(f'<text x="{cx + 2}" y="62" text-anchor="middle" font-family="InterA" font-weight="500" font-size="9" letter-spacing="3.4" fill="{BR}">N° {f["n"]} · {f["linha"].upper()}</text>')
    s.append(symbol_group(f["simbolo"], cx, 132, 96, BR, IV, sw=2.2))
    s.append(f'<text x="{cx + 3}" y="232" text-anchor="middle" font-family="Cormorant" font-weight="500" font-size="40" letter-spacing="6" fill="{BR}">{f["nome"]}</text>')
    s.append(f'<text x="{cx}" y="260" text-anchor="middle" font-family="Cormorant" font-style="italic" font-size="17" fill="{BR}">{f["familiaFr"]}</text>')
    y = 306
    for lab, key in (("TÊTE", "saida"), ("CŒUR", "coracao"), ("FOND", "fundo")):
        s.append(f'<text x="{cx + 1.5}" y="{y}" text-anchor="middle" font-family="InterA" font-weight="500" font-size="8" letter-spacing="3" fill="{BR}" opacity=".8">{lab}</text>')
        s.append(f'<text x="{cx}" y="{y + 22}" text-anchor="middle" font-family="Cormorant" font-size="17" fill="{BR}">{" · ".join(f[key])}</text>')
        y += 64
    s.append(f'<line x1="{cx - 16}" x2="{cx + 16}" y1="{y - 6}" y2="{y - 6}" stroke="{BR}" stroke-width=".6"/>')
    s.append(wordmark_group(cx, h - 74, 120, BR))
    return "".join(s)


# --------------------------------------------------------------- mouillette (fita olfativa 14×150 mm → 70×750)
def blotter(f, w=70, L=750):
    pts = f"0 0 {w} 0 {w} {L - 60} {w / 2} {L} 0 {L - 60}"
    return (f'<polygon points="{pts}" fill="#FBF8F2"/><polygon points="{pts}" fill="#fff" filter="url(#paperA)"/>'
            f'<g transform="translate({w / 2 + 8} 40) rotate(90)">'
            + wordmark_group(70, -10, 130, BR, small=True)
            + f'<text x="190" y="1" font-family="Cormorant" font-weight="500" font-size="17" letter-spacing="3" fill="{BR}">{f["nome"]}</text>'
            f'<text x="{190 + len(f["nome"]) * 14 + 16}" y="0" font-family="InterA" font-size="7" letter-spacing="2" fill="{BR}">N° {f["n"]}</text></g>'
            f'<line x1="8" x2="{w - 8}" y1="{L - 220}" y2="{L - 220}" stroke="{BR}" stroke-width=".5" stroke-dasharray="2 3" opacity=".6"/>')


# --------------------------------------------------------------- selo adesivo (Ø 40 mm → 200)
def seal(r=100):
    return (f'<circle cx="{r}" cy="{r}" r="{r}" fill="{BR}"/>'
            f'<circle cx="{r}" cy="{r}" r="{r - 9}" fill="none" stroke="{FOIL}" stroke-width="1.6"/>'
            f'<circle cx="{r}" cy="{r}" r="{r - 14}" fill="none" stroke="{FOIL}" stroke-width=".6"/>'
            + monogram_group(r, r - 4, 86, FOIL))


# --------------------------------------------------------------- papel de seda (padrão)
def tissue_pattern(w, h, ink=CH, bg=IV, step=120):
    s = [f'<rect width="{w}" height="{h}" fill="{bg}"/>']
    j = 0
    for y in range(-step, h + step, step // 2):
        off = (step // 2) if j % 2 else 0
        for x in range(-step, w + step, step):
            if j % 2:
                s.append(drop_path(x + off, y, 14, ink))
            else:
                s.append(monogram_group(x + off, y, 30, ink, .9))
        j += 1
    return "".join(s)


def tissue_sheet(w, h, seed=3):
    """Papel de seda com dobras: padrão + sombreamento ondulado."""
    return (f'<defs><filter id="fold{seed}" x="0" y="0" width="100%" height="100%">'
            f'<feTurbulence type="fractalNoise" baseFrequency=".0025 .009" numOctaves="2" seed="{seed}"/>'
            f'<feColorMatrix values="0 0 0 0 .3 0 0 0 0 .22 0 0 0 0 .15 0 0 0 .55 -.12"/></filter></defs>'
            + tissue_pattern(w, h) + f'<rect width="{w}" height="{h}" filter="url(#fold{seed})"/>'
            f'<rect width="{w}" height="{h}" fill="#fff" opacity=".18"/>')


# --------------------------------------------------------------- etiqueta de sacola (hang tag 50×90 mm → 250×450)
def hang_tag(f, w=250, h=450):
    return (f'<path d="M0 30 L30 0 L{w - 30} 0 L{w} 30 L{w} {h} L0 {h} Z" fill="{SAND}"/>'
            f'<path d="M0 30 L30 0 L{w - 30} 0 L{w} 30 L{w} {h} L0 {h} Z" fill="#fff" filter="url(#paperA)"/>'
            f'<circle cx="{w / 2}" cy="38" r="9" fill="#3a2a20"/><circle cx="{w / 2}" cy="38" r="12" fill="none" stroke="{FOIL}" stroke-width="3"/>'
            + wordmark_group(w / 2, 92, 160, BR)
            + symbol_group(f["simbolo"], w / 2, 240, 110, BR, SAND, sw=2.2)
            + f'<text x="{w / 2 + 2}" y="350" text-anchor="middle" font-family="Cormorant" font-weight="500" font-size="28" letter-spacing="4" fill="{BR}">{f["nome"]}</text>'
            f'<text x="{w / 2 + 1}" y="380" text-anchor="middle" font-family="Cormorant" font-style="italic" font-size="15" fill="{BR}">Pour vous, avec soin.</text>')


# --------------------------------------------------------------- sacola (vista frontal 3/4)
def bag(x, y, k, color=BR, ink=FOIL, uid="g1"):
    W, H, G = 420, 520, 120     # largura, altura, sanfona
    sx, sk = .38, -.30
    paper = color
    s = [f'<g transform="translate({x} {y}) scale({k})">',
         f'<ellipse cx="{W * .6}" cy="{H + 6}" rx="{W * .78}" ry="20" fill="#1b110a" opacity=".32" filter="url(#softA)"/>']
    # alça traseira
    s.append(f'<path d="M{W * .3 + G * sx} {G * sk * sx + 4} C{W * .3 + G * sx} -150 {W * .7 + G * sx} -150 {W * .7 + G * sx} {G * sk * sx + 4}" fill="none" stroke="#2e2119" stroke-width="7" opacity=".7"/>')
    # lateral (sanfona)
    s.append(f'<path d="M{W} 0 L{W + G * sx} {G * sk * sx} L{W + G * sx} {H + G * sk * sx} L{W} {H} Z" fill="{paper}"/>')
    s.append(f'<path d="M{W} 0 L{W + G * sx} {G * sk * sx} L{W + G * sx} {H + G * sk * sx} L{W} {H} Z" fill="#000" opacity=".28"/>')
    s.append(f'<path d="M{W} 0 L{W + G * sx / 2} {H * .55} L{W} {H}" fill="none" stroke="#000" stroke-opacity=".25"/>')
    s.append(f'<path d="M{W + G * sx / 2} {H * .55} L{W + G * sx} {H + G * sk * sx}" stroke="#000" stroke-opacity=".2"/>')
    # frente
    s.append(f'<rect width="{W}" height="{H}" fill="{paper}"/>')
    s.append(f'<rect width="{W}" height="{H}" fill="#fff" filter="url(#paperA)" opacity=".7"/>')
    s.append(f'<rect width="{W}" height="56" fill="#000" opacity=".06"/><line x1="0" x2="{W}" y1="56" y2="56" stroke="#000" stroke-opacity=".12"/>')
    s.append(f'<linearGradient id="bgl{uid}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>')
    s.append(f'<rect width="{W}" height="{H}" fill="url(#bgl{uid})"/>')
    s.append(wordmark_group(W / 2, H * .42, 240, ink))
    s.append(f'<text x="{W / 2 + 2}" y="{H * .42 + 120}" text-anchor="middle" font-family="InterA" font-weight="500" font-size="9" letter-spacing="4" fill="{ink}">MAISON DE PARFUM</text>')
    # ilhoses e alça frontal
    for hx in (W * .3, W * .7):
        s.append(f'<circle cx="{hx}" cy="28" r="7" fill="#2a1d15"/><circle cx="{hx}" cy="28" r="9" fill="none" stroke="{FOIL}" stroke-width="2.4"/>')
    s.append(f'<path d="M{W * .3} 28 C{W * .3} -170 {W * .7} -170 {W * .7} 28" fill="none" stroke="{CH if color == BR else BR}" stroke-width="8" stroke-linecap="round"/>')
    s.append("</g>")
    return "".join(s)


def soft_defs():
    return '<defs><filter id="softA" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter></defs>'


def svg_wrap(W, H, inner):
    return f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" style="position:absolute;inset:0">{DEFS}{soft_defs()}{inner}</svg>'


def flatlay_bg(W, H, plate="31-flatlay-linho.png"):
    p = os.path.join(ROOT, "06-Art-Direction", "fotografia", plate)
    if os.path.exists(p):
        return f'<img src="file://{p}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">'
    return '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 40% 40%,#F6F0E6,#E3D8C6)"></div>'


def render_stationery(out):
    W, H = 2048, 1536
    fs = list(FR.values())
    inner = ""
    inner += shadowed(f'<g>{tissue_sheet(760, 980, 5)}</g>', 1180, 230, 760, 980, rot=-8, sh=10, op=.18)
    inner += shadowed(frag_card(fs[0]), 1310, 330, 400, 600, rot=-4)
    inner += shadowed(f'<g>{seal()}</g>', 1640, 980, 200, 200, sh=8, op=.3)
    inner += shadowed(card_front(), 330, 330, 425, 275, rot=-6)
    inner += shadowed(card_back(), 410, 690, 425, 275, rot=4)
    for i, f in enumerate(fs[2:5]):
        inner += shadowed(blotter(f), 900 + i * 70, 300 + i * 14, 70, 750, rot=-14 + i * 9, sh=10, op=.22)
    inner += shadowed(hang_tag(fs[3]), 640, 1030, 250, 450, rot=-78, sh=10, op=.24)
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">{flatlay_bg(W, H)}'
            f'{svg_wrap(W, H, inner)}{GRAIN}</div>')
    return stage.render("stationery", html, W, H, out, scale=1)


def render_cards_closeup(out):
    W, H = 1600, 1200
    inner = shadowed(card_front(), 210, 300, 425, 275, rot=-3, sh=14) + shadowed(card_back(), 640, 520, 425, 275, rot=5, sh=14)
    inner = f'<g transform="translate(-140 -260) scale(1.45)">{inner}</g>'
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">'
            f'<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 40% 35%,#EFE6D8,#D9CBB3)"></div>'
            f'{svg_wrap(W, H, inner)}{GRAIN}</div>')
    return stage.render("cards", html, W, H, out, scale=1)


def render_frag_cards(out):
    W, H = 2400, 1200
    fs = list(FR.values())
    inner = "".join(shadowed(frag_card(f), 90 + i * 380, 300 + (i % 2) * 40, 400, 600, rot=(-3 + i * 1.2), sh=14) for i, f in enumerate(fs))
    inner = f'<g transform="translate(0 -60) scale(.98)">{inner}</g>'
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">'
            f'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#4f3c31,#2f231c)"></div>'
            f'{svg_wrap(W, H, inner)}{GRAIN}</div>')
    return stage.render("fragcards", html, W, H, out, scale=1)


def render_tissue_unboxing(out):
    """Caixa aberta envolta em papel de seda + selo."""
    W, H = 1600, 1200
    f = FR["SILLAGE"]
    inner = (shadowed(f'<g>{tissue_sheet(1100, 900, 8)}</g>', 250, 150, 1100, 900, rot=4, sh=8, op=.15)
             + box_open_topdown(f, uid="tu", x=610, y=210, k=1.42)
             + shadowed(f'<g>{seal(80)}</g>', 1110, 830, 160, 160, sh=8))
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">'
            f'<div style="position:absolute;inset:0;background:#3c2d24"></div>'
            f'{svg_wrap(W, H, inner)}{GRAIN}</div>')
    return stage.render("tissue", html, W, H, out, scale=1)


def render_bags(out):
    W, H = 2000, 1300
    inner = (bag(380, 520, 1.25, BR, FOIL, "b1") + bag(1060, 640, 1.0, SAND, BR, "b2"))
    tag = f'<g transform="translate(1560 1020) rotate(-12) scale(.5)">{shadowed(hang_tag(FR["ÉCLAT"]), 0, 0, 250, 450, sh=10, op=.25)}</g>'
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">'
            f'<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 45% 30%,#FBF7F0,#E8DDCB 60%,#D7C7AD)"></div>'
            f'<div style="position:absolute;left:0;right:0;top:1170px;bottom:0;background:linear-gradient(#DCCDB3,#CDBB9C)"></div>'
            f'{svg_wrap(W, H, inner + tag)}{GRAIN}</div>')
    return stage.render("bags", html, W, H, out, scale=1)


def render_labels_sheet(out):
    """Folha de etiquetas: as 6 etiquetas de frasco em escala, para gráfica."""
    from frasco import label_svg
    W, H = 1400, 900
    inner = ""
    for i, f in enumerate(FR.values()):
        x, y = 120 + (i % 3) * 400, 110 + (i // 3) * 360
        inner += f'<g transform="translate({x} {y}) scale(1.6)">{label_svg(f, 0, 0, 170, 184, "ls" + f["n"])}</g>'
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden;background:#EDE5D8">'
            f'{svg_wrap(W, H, inner)}</div>')
    return stage.render("labels", html, W, H, out, scale=2)


if __name__ == "__main__":
    O = os.path.join(ROOT, "11-Exports", "aplicacoes")
    V = os.path.join(ROOT, "03-Visual-Identity", "aplicacoes-svg")
    os.makedirs(V, exist_ok=True)
    fonts = stage.FONTS.replace(ROOT, "../..")
    def save(name, w, h, inner):
        open(os.path.join(V, name), "w").write(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><style>{fonts}</style>{DEFS}{inner}</svg>')
    save("cartao-institucional-frente.svg", 425, 275, card_front())
    save("cartao-institucional-verso.svg", 425, 275, card_back())
    save("selo-adesivo.svg", 200, 200, seal())
    save("papel-de-seda-padrao.svg", 960, 960, tissue_pattern(960, 960))
    for f in FR.values():
        save(f"cartao-fragrancia-{f['n']}.svg", 400, 600, frag_card(f))
        save(f"mouillette-{f['n']}.svg", 70, 750, blotter(f))
        save(f"etiqueta-sacola-{f['n']}.svg", 250, 450, hang_tag(f))
    which = sys.argv[1:] or ["stationery", "cards", "fragcards", "tissue", "bags", "labels"]
    if "stationery" in which: render_stationery(os.path.join(O, "papelaria-flatlay.png"))
    if "cards" in which: render_cards_closeup(os.path.join(O, "cartoes-institucionais.png"))
    if "fragcards" in which: render_frag_cards(os.path.join(O, "cartoes-de-fragrancia.png"))
    if "tissue" in which: render_tissue_unboxing(os.path.join(O, "papel-de-seda-e-selo.png"))
    if "bags" in which: render_bags(os.path.join(O, "sacolas.png"))
    if "labels" in which: render_labels_sheet(os.path.join(O, "etiquetas-folha.png"))
    print("ok")
