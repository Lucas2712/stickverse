"""AVELÉ · símbolos botânicos em traço fino (desenho vetorial exclusivo).

Cada símbolo vive numa caixa 200×200. As formas têm preenchimento na cor do fundo
para que as sobreposições se escondam (técnica de gravura), e traço na cor da tinta.
"""
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from logo import drop

F = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")


def P(*xy):
    return " ".join(F(v) for v in xy)


def vec(a, b):
    return (b[0] - a[0], b[1] - a[1])


def norm(v):
    l = math.hypot(*v)
    return (v[0] / l, v[1] / l)


def add(p, v, s=1.0):
    return (p[0] + v[0] * s, p[1] + v[1] * s)


def leaf(p0, p1, w, bend=0.0, rib=0.85):
    d = vec(p0, p1)
    n = norm((-d[1], d[0]))
    b = (n[0] * bend, n[1] * bend)
    c1 = add(add(add(p0, d, 0.22), n, w * 1.25), b)
    c2 = add(add(add(p0, d, 0.72), n, w * 0.95), b)
    c3 = add(add(add(p0, d, 0.72), n, -w * 0.95), b)
    c4 = add(add(add(p0, d, 0.22), n, -w * 1.15), b)
    out = f"M{P(*p0)} C{P(*c1)} {P(*c2)} {P(*p1)} C{P(*c3)} {P(*c4)} {P(*p0)} Z"
    mid = add(add(p0, d, 0.5), b, 0.9)
    end = add(p0, d, rib)
    ribd = f"M{P(*add(p0, d, 0.04))} Q{P(*mid)} {P(*end)}"
    return out, ribd


def petal(p0, ang, L, w, skew=0.0):
    d = (math.cos(ang), math.sin(ang))
    n = (-d[1], d[0])
    tip = add(p0, d, L)
    a1 = add(add(p0, d, L * 0.42), n, w * (1.25 + skew))
    a2 = add(add(p0, d, L * 1.08), n, w * (0.85 + skew))
    b2 = add(add(p0, d, L * 1.08), n, -w * (0.85 - skew))
    b1 = add(add(p0, d, L * 0.42), n, -w * (1.25 - skew))
    return f"M{P(*p0)} C{P(*a1)} {P(*a2)} {P(*tip)} C{P(*b2)} {P(*b1)} {P(*p0)} Z"


def smooth(pts, closed=True):
    """Catmull-Rom → Bézier."""
    n = len(pts)
    s = f"M{P(*pts[0])}"
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = pts[(i - 1) % n] if closed or i > 0 else pts[i]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if closed or i + 2 < n else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        s += f" C{P(*c1)} {P(*c2)} {P(*p2)}"
    return s + (" Z" if closed else "")


class Sym:
    def __init__(self):
        self.items = []   # (d, kind) kind: 'shape' (fill bg + stroke), 'line' (stroke), 'ink' (fill ink)

    def shape(self, d): self.items.append((d, "shape"))
    def line(self, d, w=1.0): self.items.append((d, f"line:{w}"))
    def ink(self, d): self.items.append((d, "ink"))

    def svg(self, ink="#49372D", bg="#F4EFE5", sw=1.5, box="0 0 200 200", bgrect=False):
        out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}">']
        if bgrect:
            out.append(f'<rect x="-1000" y="-1000" width="3000" height="3000" fill="{bg}"/>')
        out.append(f'<g stroke-linecap="round" stroke-linejoin="round">')
        for d, k in self.items:
            if k == "shape":
                out.append(f'<path d="{d}" fill="{bg}" stroke="{ink}" stroke-width="{sw}"/>')
            elif k == "ink":
                out.append(f'<path d="{d}" fill="{ink}"/>')
            else:
                w = float(k.split(":")[1])
                out.append(f'<path d="{d}" fill="none" stroke="{ink}" stroke-width="{F(sw * w)}"/>')
        out.append("</g></svg>")
        return "".join(out)


# ------------------------------------------------------------------ ROSÉE
def rosee():
    s = Sym()
    s.line("M100 100 C103 128 95 160 100 194")
    o, r = leaf((100, 138), (56, 112), 11, bend=-4); s.shape(o); s.line(r, .7)
    o, r = leaf((99, 160), (146, 140), 11, bend=4); s.shape(o); s.line(r, .7)
    # botão
    s.shape("M86 92 C80 70 88 50 102 42 C116 50 122 70 114 92 Z")
    s.line("M92 58 C94 46 108 44 110 54 C111 60 105 63 99 60 C95 58 97 53 101 53", .8)
    s.shape("M100 100 C118 98 130 82 126 62 C124 52 116 46 108 49 C115 60 113 80 100 100 Z")
    s.shape("M100 100 C82 98 70 82 74 62 C76 52 85 46 94 50 C88 62 89 82 100 100 Z")
    # sépalas
    s.shape("M100 102 C88 104 76 98 70 80 C80 88 90 92 98 94 Z")
    s.shape("M100 102 C112 104 124 98 130 80 C120 88 110 92 102 94 Z")
    # gota de orvalho na ponta da folha (a gota da marca)
    s.ink(drop(57, 120, 57, 138, 3.4, 2.6))
    return s


# ------------------------------------------------------------------ ÉCLAT
def eclat():
    s = Sym()
    s.line("M100 84 C98 120 106 150 102 194")
    s.line("M102 134 C114 130 128 124 138 112")
    s.shape(petal((138, 112), -0.95, 26, 4.2))
    s.line("M137 116 L133 121 M141 115 L145 119", .7)
    o, r = leaf((102, 158), (62, 146), 10, bend=-3); s.shape(o); s.line(r, .7)
    o, r = leaf((102, 162), (140, 176), 9, bend=3); s.shape(o); s.line(r, .7)
    c = (100, 66)
    for i in range(5):
        a = -math.pi / 2 + i * 2 * math.pi / 5 + 0.18
        s.shape(petal(c, a, 40, 9.5, skew=0.18))
        s.line(f"M{P(*add(c, (math.cos(a), math.sin(a)), 9))} L{P(*add(c, (math.cos(a + .06), math.sin(a + .06)), 22))}", .55)
    s.shape("M95 66 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0")
    s.ink("M98.2 66 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0")
    return s


# ------------------------------------------------------------------ OMBRE
def ombre():
    s = Sym()
    s.line("M100 150 L100 194")
    s.line("M80 194 L120 194", .8)
    s.shape("M100 14 C113 46 128 106 120 156 C117 174 109 182 100 182 C91 182 83 174 80 156 C72 106 87 46 100 14 Z")
    def hw(y):  # meia-largura aproximada da silhueta
        tt = (y - 14) / (182 - 14)
        return 21 * math.sin(math.pi * min(1, tt * 1.05)) ** 0.7
    y = 38
    k = 0
    while y < 172:
        w = hw(y) * 0.78
        off = 3 if k % 2 else -3
        s.line(f"M{P(100 - w, y + 9)} Q{P(100 + off, y - 3)} {P(100 + w, y + 9)}", .6)
        y += 12; k += 1
    s.line("M100 24 L100 178", .55)
    # sombra: o símbolo de OMBRE ganha uma hachura lateral
    for i in range(6):
        yy = 70 + i * 16
        s.line(f"M{P(110 + i * .6, yy)} L{P(116, yy + 10)}", .45)
    return s


# ------------------------------------------------------------------ HÉRITAGE
def heritage():
    s = Sym()
    base, tip = (72, 176), (122, 26)
    d = vec(base, tip); L = math.hypot(*d); u = norm(d); n = (-u[1], u[0])
    left, right = [], []
    N = 60
    for i in range(N + 1):
        t = i / N
        env = 30 * math.sin(math.pi * t) ** 0.75 * (1 - 0.25 * t)
        lob = 0.58 + 0.42 * abs(math.cos(math.pi * (t * 4.5 + 0.1))) ** 0.7
        w = env * lob
        p = add(base, u, L * t)
        left.append(add(p, n, w)); right.append(add(p, n, -w))
    pts = left + right[::-1][1:-1]
    s.line("M72 176 C70 184 66 190 60 194")
    s.shape(smooth(pts[::2]))
    s.line(f"M{P(*add(base, u, 4))} L{P(*add(base, u, L * .95))}", .75)
    for t in (0.2, 0.42, 0.64, 0.84):
        p = add(base, u, L * t)
        for sg in (1, -1):
            q = add(add(p, u, L * 0.07), n, sg * 16 * math.sin(math.pi * t) ** 0.6 * (1 - 0.3 * t))
            s.line(f"M{P(*p)} L{P(*q)}", .55)
    # bolota
    s.line("M88 150 C108 148 124 146 134 136", .9)
    s.shape("M128 146 C120 160 124 182 138 186 C152 182 156 160 148 146 Z")
    s.shape("M124 148 C124 136 152 136 152 148 C146 152 130 152 124 148 Z")
    for i in range(5):
        x = 128 + i * 5
        s.line(f"M{P(x, 140.5)} L{P(x + 3, 150)}", .45)
    s.line("M138 138 L136 131", .9)
    return s


# ------------------------------------------------------------------ AUBE
def aube():
    s = Sym()
    s.line("M42 190 C70 156 104 120 150 50")
    o, r = leaf((70, 158), (36, 126), 11, bend=-3); s.shape(o); s.line(r, .7)
    o, r = leaf((121, 92), (156, 98), 9, bend=3); s.shape(o); s.line(r, .7)
    o, r = leaf((128, 82), (104, 60), 9, bend=-2); s.shape(o); s.line(r, .7)
    # fruto
    s.line("M110 109 C118 112 124 114 128 117", .9)
    s.shape("M106 140 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0")
    for (x, y) in ((122, 132), (130, 142), (138, 132), (120, 150), (140, 152), (132, 158), (116, 140), (144, 141), (130, 126)):
        s.ink(f"M{P(x - .9, y)} a.9 .9 0 1 0 1.8 0 a.9 .9 0 1 0 -1.8 0")
    s.line("M114 126 C118 121 124 119 128 119", .55)
    # flor de laranjeira
    c = (150, 46)
    for i in range(5):
        a = i * 2 * math.pi / 5 - 0.4
        s.shape(petal(c, a, 17, 5.2))
    for i in range(7):
        a = i * 2 * math.pi / 7
        e = add(c, (math.cos(a), math.sin(a)), 9)
        s.line(f"M{P(*c)} L{P(*e)}", .5)
        s.ink(f"M{P(e[0] - 1.1, e[1])} a1.1 1.1 0 1 0 2.2 0 a1.1 1.1 0 1 0 -2.2 0")
    return s


# ------------------------------------------------------------------ SILLAGE
def sillage():
    s = Sym()
    s.line("M100 120 C96 150 108 170 100 194")
    o, r = leaf((101, 166), (138, 150), 9, bend=3); s.shape(o); s.line(r, .7)
    c = (100, 80)
    for i in range(5):
        a = -math.pi / 2 + i * 2 * math.pi / 5
        d = (math.cos(a), math.sin(a)); n = (-d[1], d[0])
        pts = [c]
        l1 = add(add(c, d, 30), n, -30)
        pts.append(l1)
        for j in range(7):
            th = -0.62 + 1.24 * j / 6
            rr = 50 + (2.2 if j % 2 else -1.2)
            pts.append(add(c, (math.cos(a + th), math.sin(a + th)), rr))
        pts.append(add(add(c, d, 30), n, 30))
        s.shape(smooth(pts))
        for th in (-.22, .2):
            s.line(f"M{P(*add(c, (math.cos(a + th), math.sin(a + th)), 18))} L{P(*add(c, (math.cos(a + th * 1.2), math.sin(a + th * 1.2)), 38))}", .45)
    s.shape("M90 80 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0")
    for i in range(14):
        a = i * 2 * math.pi / 14
        e = add(c, (math.cos(a), math.sin(a)), 14.5)
        s.ink(f"M{P(e[0] - 1.2, e[1])} a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0")
    s.ink("M97 80 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0")
    return s


SYMBOLS = {"rosa": rosee, "jasmim": eclat, "cipreste": ombre, "carvalho": heritage,
           "laranjeira": aube, "cisto": sillage}

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "..", "03-Visual-Identity", "botanica")
    os.makedirs(out, exist_ok=True)
    for k, fn in SYMBOLS.items():
        sym = fn()
        open(os.path.join(out, f"simbolo-{k}-marrom.svg"), "w").write(sym.svg())
        open(os.path.join(out, f"simbolo-{k}-champagne-sobre-marrom.svg"), "w").write(
            sym.svg(ink="#D8C4A0", bg="#49372D", bgrect=True))
    print("ok")
