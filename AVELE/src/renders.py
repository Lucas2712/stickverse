"""AVELÉ · renders de estúdio: frascos, caixas, caixa aberta e linha corporal."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import stage
from frasco import FR, bottle_svg
from embalagem import box_standing, box_open_topdown, lid_flat, tube, pump_bottle
from composicao import bottle_at, GRAIN

ROOT = stage.ROOT
IV, CH, BR, SAND = "#F4EFE5", "#D8C4A0", "#49372D", "#E9DECB"


def studio(W, H, floor, dark=False):
    if dark:
        bg = f"radial-gradient(ellipse at 50% 35%,#5a4436 0%,#3a2a21 55%,#251a14 100%)"
        fl = "linear-gradient(to bottom,#2c2019,#1d1410)"
    else:
        bg = f"radial-gradient(ellipse at 50% 30%,#FBF7F0 0%,#F1E9DC 50%,#E2D5BF 100%)"
        fl = "linear-gradient(to bottom,#E6DAC6,#D9CAB0)"
    return (f'<div style="position:absolute;inset:0;background:{bg}"></div>'
            f'<div style="position:absolute;left:0;right:0;top:{floor}px;bottom:0;background:{fl}"></div>')


def reflect(inner_html, base, h_ref=.35, op=.22):
    """Reflexo no piso: o mesmo conteúdo espelhado no eixo da base e esmaecido."""
    return (f'<div style="position:absolute;inset:0;transform-origin:50% {base}px;transform:scaleY(-1);opacity:{op};'
            f'-webkit-mask-image:linear-gradient(to top,rgba(0,0,0,1) 0,rgba(0,0,0,0) {h_ref * 100}%);filter:blur(1.5px)">{inner_html}</div>')


def family(dark=False, out=None):
    W, H = 2400, 1200
    base = 900
    xs = [300 + i * 360 for i in range(6)]
    names = list(FR)
    items = "".join(bottle_at(n, x, base, 560, light=("left", .45, "#FFF1D8", .45), uid=f"fam{i}{int(dark)}",
                              grade="brightness(.9) contrast(1.05)" if dark else "")
                    for i, (n, x) in enumerate(zip(names, xs)))
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">{studio(W, H, base, dark)}'
            f'{reflect(items, base, .3, .18 if not dark else .25)}{items}{GRAIN}</div>')
    return stage.render("family" + str(dark), html, W, H, out, scale=1)


def single_transparent(name, out):
    svg = bottle_svg(name, shadow=False, uid="st", rel=ROOT).replace('width="400" height="730"', 'width="1200" height="2190"')
    return stage.render("st" + FR[name]["n"], svg, 1200, 2190, out, scale=1, transparent=True)


def boxes_row(out):
    W, H = 2600, 1200
    base = 980
    items = "".join(box_standing(f, uid=f"br{f['n']}", x=170 + i * 390, y=base - 528 * .74, k=.74) for i, f in enumerate(FR.values()))
    svg = f'<svg width="{W}" height="{H}" style="position:absolute;inset:0">{items}</svg>'
    html = f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">{studio(W, H, base)}{svg}{GRAIN}</div>'
    return stage.render("boxrow", html, W, H, out, scale=1)


def box_and_bottle(name, out, dark=False):
    """Caixa em pé + frasco ao lado."""
    W, H = 1600, 1200
    base = 990
    f = FR[name]
    svg = f'<svg width="{W}" height="{H}" style="position:absolute;inset:0">{box_standing(f, uid="bb", x=330, y=base - 528 * 1.15, k=1.15)}</svg>'
    b = bottle_at(name, 1080, base, 560, light=("left", .45, "#FFF1D8", .5), uid="bbb")
    inner = svg + b
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">{studio(W, H, base, dark)}'
            f'{reflect(inner, base, .25, .15)}{inner}{GRAIN}</div>')
    return stage.render("bandb" + f["n"], html, W, H, out, scale=1)


def unboxing(name, out):
    """Vista de cima: base aberta (veludo + berço) e tampa ao lado, sobre papel de seda."""
    W, H = 1600, 1200
    f = FR[name]
    tissue = ('<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 40% 40%,#F6F0E6,#E7DCCB)"></div>'
              '<svg width="1600" height="1200" style="position:absolute;inset:0;opacity:.5"><defs><filter id="tz"><feTurbulence type="fractalNoise" baseFrequency=".004 .012" numOctaves="3" seed="7"/>'
              '<feColorMatrix values="0 0 0 0 .55 0 0 0 0 .45 0 0 0 0 .35 0 0 0 .45 0"/></filter></defs><rect width="1600" height="1200" filter="url(#tz)"/></svg>')
    svg = (f'<svg width="{W}" height="{H}" style="position:absolute;inset:0">'
           f'{box_open_topdown(f, uid="ub", x=330, y=120, k=1.8)}'
           f'</svg>')
    svg2 = f'<svg width="{W}" height="{H}" style="position:absolute;inset:0">{lid_flat(f, uid="ul", x=980, y=150, k=1.62, rot=6)}</svg>'
    html = f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">{tissue}{svg}{svg2}{GRAIN}</div>'
    return stage.render("unbox" + f["n"], html, W, H, out, scale=1)


def body_line(names, out, dark=False):
    W, H = 2400, 1200
    base = 1000
    items = ""
    x = 260
    for i, n in enumerate(names):
        f = FR[n]
        items += tube(f, uid=f"t{i}", x=x, y=base - 560 * 1.15, k=1.15)
        items += pump_bottle(f, uid=f"s{i}", x=x + 250, y=base - 560 * 1.15, k=1.15)
        items += pump_bottle(f, uid=f"l{i}", x=x + 520, y=base - 560 * 1.15, k=1.15, title="Lotion parfumée", vol="200 ml", tall=1.12)
        x += 1000
    svg = f'<svg width="{W}" height="{H}" style="position:absolute;inset:0">{items}</svg>'
    html = (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">{studio(W, H, base, dark)}'
            f'{reflect(svg, base, .25, .15)}{svg}{GRAIN}</div>')
    return stage.render("body" + str(len(names)), html, W, H, out, scale=1)


if __name__ == "__main__":
    P = os.path.join(ROOT, "05-Product-Design", "renders")
    K = os.path.join(ROOT, "04-Packaging", "renders")
    family(False, os.path.join(P, "frascos-familia-marfim.png"))
    family(True, os.path.join(P, "frascos-familia-marrom.png"))
    for n, f in FR.items():
        single_transparent(n, os.path.join(P, f"frasco-{f['n']}-{f['nome'].lower()}-transparente.png"))
    boxes_row(os.path.join(K, "caixas-sistema-seis-fragrancias.png"))
    box_and_bottle("HÉRITAGE", os.path.join(K, "caixa-e-frasco-heritage.png"))
    box_and_bottle("ROSÉE", os.path.join(K, "caixa-e-frasco-rosee.png"))
    unboxing("ROSÉE", os.path.join(K, "caixa-aberta-berco-rosee.png"))
    unboxing("OMBRE", os.path.join(K, "caixa-aberta-berco-ombre.png"))
    body_line(["ROSÉE", "SILLAGE"], os.path.join(K, "linha-corporal-rosee-sillage.png"))
    body_line(["OMBRE", "AUBE"], os.path.join(K, "linha-corporal-ombre-aube.png"), dark=True)
    print("ok")
