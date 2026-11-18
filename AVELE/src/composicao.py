"""AVELÉ · composição: frascos vetoriais encaixados nas placas fotográficas.

Cada cena: placa (foto sem produto) + frascos posicionados pela base, sombra projetada no sentido
da luz, luz de recorte, granulação e vinheta. Saídas: versão limpa e versão de campanha (com texto).
"""
import os, sys, base64
sys.path.insert(0, os.path.dirname(__file__))
import stage
from frasco import bottle_svg, FR, wordmark_group
from embalagem import box_standing, tube, pump_bottle, defs as box_defs

ROOT = stage.ROOT
FOTO = os.path.join(ROOT, "06-Art-Direction", "fotografia")

# frasco: viewBox 80 90 400 730 ; base do vidro em y=780, centro do corpo em x=260
VB_W, VB_H, BASE_Y, CX = 400, 730, 780 - 90, 260 - 80


def bottle_at(name, cx, base, h, light=None, cast=None, uid=None, shadow=True, grade=""):
    """h = altura total do desenho (tampa→base, ~ 690 unidades). cast = (dx, opacidade) sombra projetada."""
    k = h / BASE_Y
    w, H = VB_W * k, VB_H * k
    left, top = cx - CX * k, base - BASE_Y * k
    out = ""
    if cast:
        dx, op = cast
        bw = 300 * k
        out += (f'<div style="position:absolute;left:{cx - bw / 2}px;top:{base - h * .85 + 2}px;width:{bw}px;height:{h * .85}px;'
                f'background:linear-gradient(to top,rgba(25,14,8,{op}),rgba(25,14,8,0));filter:blur({h * .025}px);'
                f'transform-origin:50% 100%;transform:scaleY(.24) skewX({-58 if dx > 0 else 58}deg);mix-blend-mode:multiply"></div>')
        out += (f'<div style="position:absolute;left:{cx - bw * .6}px;top:{base - 10}px;width:{bw * 1.2}px;height:22px;'
                f'background:radial-gradient(ellipse,rgba(20,10,5,{op * 1.2}),rgba(20,10,5,0) 70%);filter:blur(4px)"></div>')
    svg = bottle_svg(name, shadow=shadow, uid=uid or f"c{FR[name]['n']}{int(cx)}", light=light, rel=ROOT)
    svg = svg.replace('width="400" height="730"', f'width="{w:.1f}" height="{H:.1f}"')
    out += f'<div style="position:absolute;left:{left:.1f}px;top:{top:.1f}px;filter:{grade or 'none'}">{svg}</div>'
    return out


def img_src(path):
    return "file://" + path


GRAIN = (f'<svg style="position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:overlay;opacity:.35;pointer-events:none">'
         f'<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/>'
         f'<feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>')


def scene(plate, W, H, items, overlay="", vignette=.35, grade=None):
    g = grade or ""
    return (f'<div style="position:relative;width:{W}px;height:{H}px;overflow:hidden">'
            f'<img src="{img_src(os.path.join(FOTO, plate))}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;{g}">'
            + "".join(items) +
            f'<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(20,12,7,{vignette}) 100%)"></div>'
            + GRAIN + overlay + '</div>')


def text_logo(cx, y, w, color):
    return (f'<svg style="position:absolute;left:0;top:0;overflow:visible" width="1" height="1">'
            f"{wordmark_group(cx, y, w, color, small=w < 300)}</svg>")
