"""VÉRTICE · núcleo da identidade (Studio Matteu).

Gera, em vetor puro (sem dependência de fonte instalada):
- o símbolo V (construção geométrica)
- o logotipo VÉRTICE (contornos do Instrument Serif, tracking próprio, acento redesenhado)
Todas as peças do projeto importam daqui, para que o logo seja um só em todo o sistema.
"""
import math
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parents[2]          # VERTICE_BRANDING_MATTEU/
SRC = ROOT / "14_SOURCE_FILES"
FONTS = SRC / "fonts"

# ---------------------------------------------------------------- paleta
OBSIDIAN = "#171717"
IVORY = "#E9E4DA"
CONCRETE = "#85827D"
CHAMPAGNE = "#A98C63"
PALETTE = {"Obsidian": OBSIDIAN, "Ivory": IVORY, "Concrete": CONCRETE, "Champagne": CHAMPAGNE}

# ---------------------------------------------------------------- símbolo
# Grade de construção: módulo M = 12 u. Altura do traço espesso = 9M (108 u).
# O vértice fica na base; o traço fino sobe 1M acima do espesso (elevação).
# Ângulo dos dois traços: 24° em relação à vertical (espelhados).
ANG = math.radians(24)
M = 12.0
H = 9 * M                 # altura do traço espesso
RISE = 1 * M              # o traço fino ultrapassa o espesso
THICK = 2.25 * M          # largura horizontal do traço espesso no topo (27 u)
THIN = 0.6 * M            # largura horizontal do traço fino (7.2 u)


def v_polygon(H_, rise, thick, thin):
    """Constrói o V como um único polígono de 6 pontos.
    Traço esquerdo: cunha espessa que afina até o vértice (movimento, direção).
    Traço direito: lâmina fina e paralela que sobe `rise` acima do esquerdo (elevação).
    Os dois traços têm o mesmo ângulo (24°) e se encontram num vértice pontiagudo."""
    t = math.tan(ANG)
    top = rise
    vy = rise + H_
    bx = H_ * t                                   # vértice (ponto mais baixo)
    tx = bx + vy * t                              # topo externo do traço fino
    # intersecção da borda interna da cunha com a borda interna da lâmina
    def wedge_x(y):
        return thick + (bx - thick) * (y - top) / H_
    def blade_x(y):
        return bx - thin + (vy - y) * t
    lo, hi = top, vy
    for _ in range(80):
        mid = (lo + hi) / 2
        if wedge_x(mid) < blade_x(mid):
            lo = mid
        else:
            hi = mid
    iy = (lo + hi) / 2
    ix = wedge_x(iy)
    pts = [(0, top), (thick, top), (ix, iy), (tx - thin, 0), (tx, 0), (bx, vy)]
    return pts, tx, vy


def symbol_geometry():
    """(polígonos, largura, altura) do símbolo; origem no canto superior esquerdo."""
    pts, w, h = v_polygon(H, RISE, THICK, THIN)
    return [pts], w, h


def poly_d(pts, dx=0, dy=0, s=1):
    return "M" + " L".join(f"{x * s + dx:.3f},{y * s + dy:.3f}" for x, y in pts) + " Z"


def symbol_path(x=0, y=0, height=100):
    polys, w, h = symbol_geometry()
    s = height / h
    return " ".join(poly_d(p, x, y, s) for p in polys), w * s, height


def symbol_svg(color=OBSIDIAN, height=240, pad=0, bg=None):
    d, w, h = symbol_path(pad, pad, height)
    W, Hh = w + 2 * pad, h + 2 * pad
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {Hh:.2f}" width="{W:.0f}" height="{Hh:.0f}">'
            f'{bgr}<path d="{d}" fill="{color}"/></svg>')


# ---------------------------------------------------------------- logotipo
_font = None


def font():
    global _font
    if _font is None:
        _font = TTFont(str(FONTS / "InstrumentSerif-Regular.ttf"))
    return _font


def glyph_path(ch, x, baseline, scale):
    f = font()
    gs = f.getGlyphSet()
    name = f.getBestCmap()[ord(ch)]
    pen = SVGPathPen(gs)
    tp = TransformPen(pen, (scale, 0, 0, -scale, x, baseline))
    gs[name].draw(tp)
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    return pen.getCommands(), gs[name].width * scale, bp.bounds


WORD = "VERTICE"
TRACK = 0.30          # tracking em fração do cap height (refinado e arejado)
CAP = 720             # cap height do Instrument Serif (unidades)


def wordmark_paths(cap_h=100, x0=0, y0=0, accent=True):
    """Desenha VÉRTICE com cap height `cap_h`; (x0, y0) = topo-esquerda das maiúsculas.
    O acento agudo é redesenhado como uma lâmina com o mesmo ângulo do traço fino do símbolo."""
    s = cap_h / CAP
    baseline = y0 + cap_h
    x = x0
    parts = []
    letters = []
    for i, ch in enumerate(WORD):
        d, adv, b = glyph_path(ch, 0, 0, 1)
        lsb = b[0]
        # alinhamento ótico: posiciona pela caixa real da letra (sem side bearings)
        gx = x - lsb * s
        d, adv, b = glyph_path(ch, gx, baseline, s)
        parts.append(d)
        letters.append((ch, x, x + (b[2] - b[0]) * s))
        x = x + (b[2] - b[0]) * s + TRACK * cap_h
    width = x - TRACK * cap_h - x0
    acc = ""
    if accent:
        # lâmina do acento sobre o E (2ª letra): mesmo ângulo de 24° do símbolo
        ch, ex0, ex1 = letters[1]
        cx = (ex0 + ex1) / 2 + cap_h * 0.04
        ah = cap_h * 0.23            # altura da lâmina
        aw = cap_h * 0.075           # espessura horizontal
        gap = cap_h * 0.11           # distância até o topo do E
        t = math.tan(ANG)
        yb = y0 - gap
        yt = yb - ah
        xb = cx - ah * t / 2
        xt = cx + ah * t / 2
        acc = poly_d([(xb - aw / 2, yb), (xb + aw / 2 * 0.35, yb), (xt + aw / 2, yt), (xt - aw / 2 * 0.35, yt)])
    return " ".join(parts) + " " + acc, width, cap_h, cap_h * 0.34   # 0.34 = altura do acento acima


def wordmark_svg(color=OBSIDIAN, cap_h=100, pad=None, bg=None):
    pad = cap_h * 0.6 if pad is None else pad
    top_extra = cap_h * 0.36
    d, w, h, _ = wordmark_paths(cap_h, pad, pad + top_extra)
    W, Hh = w + 2 * pad, h + top_extra + 2 * pad
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {Hh:.2f}" width="{W:.0f}" height="{Hh:.0f}">'
            f'{bgr}<path d="{d}" fill="{color}"/></svg>')


def lockup_horizontal(color=OBSIDIAN, sym_color=None, cap_h=100, pad=None, bg=None):
    """Símbolo à esquerda + filete + logotipo."""
    sym_color = sym_color or color
    pad = cap_h * 0.8 if pad is None else pad
    sh = cap_h * 1.62
    top_extra = cap_h * 0.36
    total_h = max(sh, cap_h + top_extra)
    sd, sw, _ = symbol_path(pad, pad + (total_h - sh) / 2, sh)
    rule_x = pad + sw + cap_h * 0.62
    wx = rule_x + cap_h * 0.62
    wy = pad + (total_h - cap_h) / 2 + top_extra / 2
    wd, ww, _, _ = wordmark_paths(cap_h, wx, wy)
    W = wx + ww + pad
    Hh = total_h + 2 * pad
    rule = (f'<rect x="{rule_x:.2f}" y="{pad + total_h * 0.12:.2f}" width="{max(cap_h * 0.012, 1):.2f}" '
            f'height="{total_h * 0.76:.2f}" fill="{color}" opacity="0.55"/>')
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {Hh:.2f}" width="{W:.0f}" height="{Hh:.0f}">'
            f'{bgr}<path d="{sd}" fill="{sym_color}"/>{rule}<path d="{wd}" fill="{color}"/></svg>')


def tagline_paths(text, x0, y0, size, track=0.42, font_file="Inter-Medium.otf"):
    """Texto em Inter convertido em contorno (para assinaturas dentro dos SVGs)."""
    f = TTFont(str(FONTS / font_file))
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()
    upm = f['head'].unitsPerEm
    s = size / upm
    x = x0
    out = []
    for ch in text:
        if ch == " ":
            x += gs[cmap[32]].width * s + track * size
            continue
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[name].draw(TransformPen(pen, (s, 0, 0, -s, x, y0)))
        out.append(pen.getCommands())
        x += gs[name].width * s + track * size
    return " ".join(out), x - track * size - x0


def lockup_vertical(color=OBSIDIAN, sym_color=None, cap_h=100, pad=None, bg=None, tagline=True):
    """Símbolo centralizado acima do logotipo, assinatura opcional."""
    sym_color = sym_color or color
    pad = cap_h * 0.9 if pad is None else pad
    top_extra = cap_h * 0.36
    probe, ww, _, _ = wordmark_paths(cap_h, 0, 0)
    sh = cap_h * 2.1
    _, sw, _ = symbol_path(0, 0, sh)
    tag_size = cap_h * 0.165
    tag_d, tag_w = tagline_paths("BEYOND THE ORDINARY.", 0, 0, tag_size)
    inner_w = max(ww, sw, tag_w)
    W = inner_w + 2 * pad
    sx = (W - sw) / 2
    sd, _, _ = symbol_path(sx, pad, sh)
    wy = pad + sh + cap_h * 0.75 + top_extra
    wd, _, _, _ = wordmark_paths(cap_h, (W - ww) / 2, wy)
    Hh = wy + cap_h + pad
    tag = ""
    if tagline:
        ty = wy + cap_h + cap_h * 0.62 + tag_size * 0.73
        tag_d, tag_w = tagline_paths("BEYOND THE ORDINARY.", (W - tag_w) / 2, ty, tag_size)
        tag = f'<path d="{tag_d}" fill="{color}"/>'
        Hh = ty + pad
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {Hh:.2f}" width="{W:.0f}" height="{Hh:.0f}">'
            f'{bgr}<path d="{sd}" fill="{sym_color}"/><path d="{wd}" fill="{color}"/>{tag}</svg>')


def label_mark(color=OBSIDIAN, size=100, bg=None):
    """Símbolo reforçado para etiquetas e aplicações pequenas: cunha e lâmina mais
    grossas para não fechar em impressão pequena (bordado, etiqueta tecida, favicon)."""
    pts, w, vy = v_polygon(100.0, 8.0, 34.0, 15.0)
    polys = [pts]
    s = size / vy
    pad = size * 0.2
    d = " ".join(poly_d(p, pad, pad, s) for p in polys)
    W, Hh = w * s + 2 * pad, size + 2 * pad
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {Hh:.2f}" width="{W:.0f}" height="{Hh:.0f}">'
            f'{bgr}<path d="{d}" fill="{color}"/></svg>')


def label_lockup(color=OBSIDIAN, size=100, bg=None):
    """Assinatura para etiquetas pequenas: símbolo reforçado + VÉRTICE em Inter SemiBold
    com tracking largo (as hastes finas do serifado somem abaixo de 25 mm)."""
    pts, w, vy = v_polygon(100.0, 8.0, 34.0, 15.0)
    s = size / vy
    pad = size * 0.35
    d = poly_d(pts, pad, pad, s)
    tsize = size * 0.46
    td, tw = tagline_paths("VÉRTICE", 0, 0, tsize, track=0.32, font_file="Inter-SemiBold.otf")
    tx = pad + w * s + size * 0.42
    ty = pad + size / 2 + tsize * 0.727 / 2
    td, tw = tagline_paths("VÉRTICE", tx, ty, tsize, track=0.32, font_file="Inter-SemiBold.otf")
    W, Hh = tx + tw + pad, size + 2 * pad
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {Hh:.2f}" width="{W:.0f}" height="{Hh:.0f}">'
            f'{bgr}<path d="{d}" fill="{color}"/><path d="{td}" fill="{color}"/></svg>')


# ---------------------------------------------------------------- sistema gráfico
def blade_poly(x, y, h, w):
    """Lâmina a 24° (o traço fino do símbolo), base em (x, y+h)."""
    t = math.tan(ANG)
    return [(x, y + h), (x + w, y + h), (x + w + h * t, y), (x + h * t, y)]


def collection_mark(blades, color=OBSIDIAN, h=100):
    """Identificador de coleção: 1, 2 ou 3 lâminas (ESSENTIAL, URBAN, ARCHIVE);
    0 = o V completo (LIMITED, o vértice, o ponto mais alto)."""
    if blades == 0:
        d, w, hh = symbol_path(0, 0, h)
        return d, w, h
    bw = h * 0.085
    gap = h * 0.17
    t = math.tan(ANG)
    ds = []
    for i in range(blades):
        ds.append(poly_d(blade_poly(i * (bw + gap), 0, h, bw)))
    w = (blades - 1) * (bw + gap) + bw + h * t
    return " ".join(ds), w, h


def collection_mark_svg(blades, color=OBSIDIAN, h=100, pad=0):
    d, w, hh = collection_mark(blades, color, h)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {w + 2 * pad:.2f} {hh + 2 * pad:.2f}" '
            f'width="{w + 2 * pad:.0f}" height="{hh + 2 * pad:.0f}"><path d="{d}" fill="{color}"/></svg>')


def pattern_tile(sym_h=40, color=OBSIDIAN, bg=None, cell_w=None, cell_h=None):
    """Monograma: V em pé e V invertido alternados em quincôncio (como um tecido)."""
    d0, w, h = symbol_path(0, 0, sym_h)
    cw = cell_w or w * 2.2
    ch = cell_h or h * 1.55
    W, H_ = cw * 2, ch * 2
    def at(x, y, rot=False):
        cx, cy = x + w / 2, y + h / 2
        tr = f'translate({x:.2f},{y:.2f})' + (f' rotate(180,{w / 2:.2f},{h / 2:.2f})' if rot else "")
        return f'<path transform="{tr}" d="{d0}" fill="{color}"/>'
    items = [at((cw - w) / 2, (ch - h) / 2), at(cw + (cw - w) / 2, ch + (ch - h) / 2),
             at(cw + (cw - w) / 2, (ch - h) / 2, True), at((cw - w) / 2, ch + (ch - h) / 2, True)]
    bgr = f'<rect width="{W:.2f}" height="{H_:.2f}" fill="{bg}"/>' if bg else ""
    return W, H_, bgr + "".join(items)


def pattern_svg(width, height, sym_h=40, color=OBSIDIAN, bg=None, opacity=1):
    W, H_, inner = pattern_tile(sym_h, color)
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">'
            f'<defs><pattern id="vp" width="{W:.2f}" height="{H_:.2f}" patternUnits="userSpaceOnUse">{inner}</pattern></defs>'
            f'{bgr}<rect width="100%" height="100%" fill="url(#vp)" opacity="{opacity}"/></svg>')


def lines_svg(width, height, step=28, color=OBSIDIAN, stroke=1.0, bg=None, opacity=1):
    """Linhas a 24° (régua do sistema): textura arquitetônica."""
    t = math.tan(ANG)
    ls = []
    x = -height * t
    while x < width + step:
        ls.append(f'<line x1="{x:.1f}" y1="{height}" x2="{x + height * t:.1f}" y2="0"/>')
        x += step
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">'
            f'{bgr}<g stroke="{color}" stroke-width="{stroke}" opacity="{opacity}">{"".join(ls)}</g></svg>')
