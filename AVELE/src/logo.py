"""AVELÉ · construção geométrica do logotipo e do monograma (desenho exclusivo, sem fonte).

Sistema: altura de caixa alta H=1000, linha de base y=1000 (SVG, y para baixo).
Contraste Didone: haste grossa T, fio t. Serifas em fio com junções curvas (brackets).
O acento agudo do É é desenhado como uma gota inclinada: o símbolo da marca.
"""
import math, os

T = 136      # haste grossa
t = 17       # fio (hairline)
TX = 156     # largura horizontal da diagonal grossa
TXT = 24     # largura horizontal da diagonal fina
BR = 46      # raio das junções (brackets)


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def poly(pts):
    return "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts) + " Z"


def rect(x0, y0, x1, y1):
    return poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)])


def fillet(P, u, v, a=BR, b=BR, k=0.58):
    """Junção curva no canto P entre duas retas; u e v são direções (unitárias) que se afastam de P."""
    A = (P[0] + u[0] * a, P[1] + u[1] * a)
    B = (P[0] + v[0] * b, P[1] + v[1] * b)
    c1 = (A[0] - u[0] * a * k, A[1] - u[1] * a * k)
    c2 = (B[0] - v[0] * b * k, B[1] - v[1] * b * k)
    return (f"M{f(P[0])} {f(P[1])} L{f(A[0])} {f(A[1])} C{f(c1[0])} {f(c1[1])} "
            f"{f(c2[0])} {f(c2[1])} {f(B[0])} {f(B[1])} Z")


def unit(dx, dy):
    n = math.hypot(dx, dy)
    return (dx / n, dy / n)


def line_x_at(p, q, y):
    return p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1])


# ---------------------------------------------------------------- letras
def glyph_A(ox=0):
    ax, L0, R0 = 382, 78, 694
    p = []
    # diagonal grossa (direita) e fina (esquerda), ápice levemente acima da caixa
    rs = [(ax - 14, -12), (ax + 24, -12), (R0 + TX / 2, 1000), (R0 - TX / 2, 1000)]
    ls = [(ax - 14, -12), (ax + 6, -12), (L0 + TXT / 2, 1000), (L0 - TXT / 2, 1000)]
    p += [poly(rs), poly(ls)]
    # travessa em fio, um pouco abaixo do meio (proporção clássica)
    yb = 655
    xl = line_x_at(ls[0], ls[3], yb)
    xr = line_x_at(rs[0], rs[3], yb + t)
    p.append(rect(xl, yb, xr + 20, yb + t))
    # serifas
    yS = 1000 - t
    p.append(rect(L0 - 78, yS, L0 + 66, 1000))
    p.append(rect(R0 - TX / 2 - 58, yS, R0 + TX / 2 + 82, 1000))
    # junções
    for (P0, P1), side in (((ls[1], ls[2]), +1), ((ls[0], ls[3]), -1),
                           ((rs[1], rs[2]), +1), ((rs[0], rs[3]), -1)):
        x = line_x_at(P0, P1, yS)
        up = unit(P0[0] - P1[0], P0[1] - P1[1])
        p.append(fillet((x, yS), (side, 0), up))
    width = R0 + TX / 2 + 82
    return [shift(s, ox) for s in p], width


def glyph_V(ox=0):
    L0, vx, R0 = 150, 462, 772
    p = []
    ls = [(L0 - TX / 2, 0), (L0 + TX / 2, 0), (vx + 14, 1012), (vx - 22, 1012)]
    rs = [(R0 - TXT / 2, 0), (R0 + TXT / 2, 0), (vx + 14, 1012), (vx - 6, 1012)]
    p += [poly(ls), poly(rs)]
    p.append(rect(L0 - TX / 2 - 82, 0, L0 + TX / 2 + 58, t))
    p.append(rect(R0 - 66, 0, R0 + 78, t))
    for (P0, P1), side in (((ls[1], ls[2]), +1), ((ls[0], ls[3]), -1),
                           ((rs[1], rs[2]), +1), ((rs[0], rs[3]), -1)):
        x = line_x_at(P0, P1, t)
        dn = unit(P1[0] - P0[0], P1[1] - P0[1])
        p.append(fillet((x, t), (side, 0), dn))
    return [shift(s, ox) for s in p], R0 + 78


def stem_with_serifs(x0, top_left=True, bot_left=True):
    p = [rect(x0, 0, x0 + T, 1000)]
    if top_left:
        p.append(rect(x0 - 70, 0, x0, t))
        p.append(fillet((x0, t), (-1, 0), (0, 1)))
    if bot_left:
        p.append(rect(x0 - 70, 1000 - t, x0, 1000))
        p.append(fillet((x0, 1000 - t), (-1, 0), (0, -1)))
    return p


def beak_down(xe, y0, h=188):
    # serifa vertical em fio, levemente afunilada, no fim do braço superior
    return [poly([(xe - 28, y0), (xe, y0), (xe, y0 + h), (xe - 10, y0 + h)]),
            fillet((xe - 28 + 6, y0 + t), (-1, 0), unit(-0.1, 1), 30, 40)]


def beak_up(xe, y1, h=200):
    return [poly([(xe - 28, y1), (xe, y1), (xe, y1 - h), (xe - 10, y1 - h)]),
            fillet((xe - 28 + 6, y1 - t), (-1, 0), unit(-0.1, -1), 30, 40)]


def glyph_E(ox=0, accent=False):
    x0 = 72
    xs = x0 + T
    p = stem_with_serifs(x0)
    p.append(rect(x0, 0, 566, t)); p += beak_down(566, 0)
    p.append(rect(xs, 488, 474, 488 + t))
    p.append(poly([(458, 402), (474, 402), (474, 590), (466, 590)]))
    p.append(rect(x0, 1000 - t, 604, 1000)); p += beak_up(604, 1000)
    p.append(fillet((xs, t), (1, 0), (0, 1)))
    p.append(fillet((xs, 1000 - t), (1, 0), (0, -1)))
    p.append(fillet((xs, 488), (1, 0), (0, -1), 34, 34))
    p.append(fillet((xs, 488 + t), (1, 0), (0, 1), 34, 34))
    if accent:
        p.append(drop(214, -70, 352, -262, 40))
    return [shift(s, ox) for s in p], 604


def glyph_L(ox=0):
    x0 = 72
    xs = x0 + T
    p = stem_with_serifs(x0, top_left=True)
    p.append(rect(xs, 0, xs + 76, t))
    p.append(fillet((xs, t), (1, 0), (0, 1)))
    p.append(rect(x0, 1000 - t, 560, 1000)); p += beak_up(560, 1000)
    p.append(fillet((xs, 1000 - t), (1, 0), (0, -1)))
    return [shift(s, ox) for s in p], 560


def drop(tx, ty, cx, cy, r, m=3.2, n=96):
    """A gota-acento: ponta fina embaixo à esquerda (tx,ty), corpo arredondado no alto à direita.
    (cx,cy) é a extremidade arredondada; r é a meia-largura máxima. Curva de lágrima paramétrica."""
    L = math.hypot(cx - tx, cy - ty)
    d = unit(cx - tx, cy - ty)
    nn = (-d[1], d[0])
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        u = (1 - math.cos(a)) / 2            # 0 na ponta, 1 na cabeça
        w = math.sin(a) * math.sin(a / 2) ** m
        pts.append((tx + d[0] * u * L + nn[0] * w * r * 1.55, ty + d[1] * u * L + nn[1] * w * r * 1.55))
    return poly(pts)


def shift(d, ox, oy=0):
    """Desloca um path (só comandos absolutos M L C Q A Z usados aqui)."""
    out, toks = [], d.replace(",", " ").split()
    i, cmd = 0, None
    res = []
    # tokens já vêm como 'M12' '34' ... ; reconstrói por parsing simples
    import re
    parts = re.findall(r"[MLCQAZ]|-?\d+\.?\d*", d)
    i = 0
    while i < len(parts):
        c = parts[i]
        if c in "MLCQZ":
            res.append(c); i += 1
            n = {"M": 1, "L": 1, "C": 3, "Q": 2, "Z": 0}[c]
            # pode haver vários pares seguidos após L (não usamos)
            for _ in range(n):
                x, y = float(parts[i]) + ox, float(parts[i + 1]) + oy
                res.append(f"{f(x)} {f(y)}"); i += 2
        elif c == "A":
            rx, ry, rot, la, sw, x, y = parts[i + 1:i + 8]
            res.append(f"A{rx} {ry} {rot} {la} {sw} {f(float(x) + ox)} {f(float(y) + oy)}")
            i += 8
        else:
            raise ValueError(c)
    s = " ".join(res)
    return s.replace("M ", "M").replace("L ", "L").replace("C ", "C").replace("Q ", "Q")


# espaçamento (entre extremos das letras, com compensação ótica no par AV)
GAPS = {"AV": -36, "VE": 182, "EL": 190, "LÉ": 168}


def wordmark():
    paths = []
    x = 0
    g, w = glyph_A(x); paths += g; x += w + GAPS["AV"]
    g, w = glyph_V(x); paths += g; x += w + GAPS["VE"]
    g, w = glyph_E(x); paths += g; x += w + GAPS["EL"]
    g, w = glyph_L(x); paths += g; x += w + GAPS["LÉ"]
    g, w = glyph_E(x, accent=True); paths += g; x += w
    return " ".join(paths), (0, -260, x, 1260)   # viewBox com margem do acento


def svg_wordmark(fill="#49372D", pad=0.0, bg=None):
    d, (x0, y0, w, h) = wordmark()
    px = w * pad
    vb = f"{f(x0 - px)} {f(y0 - px)} {f(w + 2 * px)} {f(h + 2 * px)}"
    bgr = f'<rect x="{f(x0 - px)}" y="{f(y0 - px)}" width="{f(w + 2 * px)}" height="{f(h + 2 * px)}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="AVELÉ">'
            f'<title>AVELÉ</title>{bgr}<path fill="{fill}" d="{d}"/></svg>')


def monogram_paths():
    """Monograma: o A do logotipo dentro de uma cártula oval em fio duplo, com a gota-acento acima do ápice."""
    g, w = glyph_A(0)
    cx = 382 + 5
    d = " ".join(g)
    return d, cx


def svg_monogram(fill="#49372D", bg=None, frame=True):
    d, cx = monogram_paths()
    cy = 470
    rx, ry = 700, 900
    parts = [f'<path fill="{fill}" d="{d}"/>']
    if frame:
        ri, rj = rx - 56, ry - 56
        yb = 655
        half = ri * math.sqrt(1 - ((yb + t / 2 - cy) / rj) ** 2)
        parts.append(f'<path fill="{fill}" d="{rect(cx - half, yb, cx + half, yb + t * 0.6)}"/>')
        parts.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="{fill}" stroke-width="18"/>')
        parts.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{ri}" ry="{rj}" fill="none" stroke="{fill}" stroke-width="6"/>')
        # gota pendente no eixo, logo abaixo do anel externo: a essência que cai
        parts.append(f'<path fill="{fill}" d="{drop(cx, cy + ry + 34, cx, cy + ry + 168, 28, 2.6)}"/>')
    pad = 40
    x0, y0, W, H = cx - rx - pad, cy - ry - pad, 2 * (rx + pad), 2 * (ry + pad) + 160
    vb = f"{x0} {y0} {W} {H}"
    bgr = f'<rect x="{x0}" y="{y0}" width="{W}" height="{H}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Monograma AVELÉ">'
            f'{bgr}{"".join(parts)}</svg>')


def svg_drop(fill="#49372D"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="190 -290 190 250">'
            f'<path fill="{fill}" d="{drop(214, -70, 352, -262, 40)}"/></svg>')


PAL = {"brown": "#49372D", "ivory": "#F4EFE5", "champagne": "#D8C4A0"}

def set_optical(small):
    global t, BR
    t, BR = (30, 40) if small else (17, 46)


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "..", "02-Logo", "svg")
    os.makedirs(out, exist_ok=True)
    combos = {
        "avele-logo-marrom": dict(fill=PAL["brown"]),
        "avele-logo-marfim": dict(fill=PAL["ivory"]),
        "avele-logo-champagne": dict(fill=PAL["champagne"]),
        "avele-logo-marrom-sobre-marfim": dict(fill=PAL["brown"], bg=PAL["ivory"], pad=0.18),
        "avele-logo-champagne-sobre-marrom": dict(fill=PAL["champagne"], bg=PAL["brown"], pad=0.18),
    }
    for k, v in combos.items():
        open(os.path.join(out, k + ".svg"), "w").write(svg_wordmark(**v))
    for k, (fl, bg) in {"avele-monograma-marrom": (PAL["brown"], None),
                        "avele-monograma-champagne": (PAL["champagne"], None),
                        "avele-monograma-champagne-sobre-marrom": (PAL["champagne"], PAL["brown"]),
                        "avele-monograma-marrom-sobre-marfim": (PAL["brown"], PAL["ivory"])}.items():
        open(os.path.join(out, k + ".svg"), "w").write(svg_monogram(fl, bg))
    open(os.path.join(out, "avele-gota-acento.svg"), "w").write(svg_drop())
    set_optical(True)
    for k, v in {"avele-logo-corpo-pequeno-marrom": dict(fill=PAL["brown"]),
                 "avele-logo-corpo-pequeno-champagne": dict(fill=PAL["champagne"]),
                 "avele-logo-corpo-pequeno-marfim": dict(fill=PAL["ivory"])}.items():
        open(os.path.join(out, k + ".svg"), "w").write(svg_wordmark(**v))
    set_optical(False)
    print("ok", sorted(os.listdir(out)))
