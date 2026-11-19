"""02_LOGO_AND_IDENTITY · exporta todas as versões do logotipo em SVG + PNG."""
import numpy as np
from PIL import Image

import brand as B
from common import ROOT, SRC, page, run, svg_data

OUT = ROOT / "02_LOGO_AND_IDENTITY"

# grão para as texturas (usado por todas as peças)
rng = np.random.default_rng(7)
g = (rng.normal(128, 42, (256, 256))).clip(0, 255).astype("uint8")
Image.fromarray(g, "L").save(SRC / "scripts" / "grain.png")

COLORS = {
    "obsidian": B.OBSIDIAN,
    "ivory": B.IVORY,          # versão branca da marca (marfim institucional)
    "white": "#FFFFFF",        # branco puro, só para impressão sobre fotografia/hot stamping branco
    "champagne": B.CHAMPAGNE,
    "concrete": B.CONCRETE,    # versão monocromática de apoio
}

LOCKUPS = {
    "01_horizontal": lambda c: B.lockup_horizontal(color=c, cap_h=200),
    "02_centered": lambda c: B.lockup_vertical(color=c, cap_h=180),
    "02b_centered_no_tagline": lambda c: B.lockup_vertical(color=c, cap_h=180, tagline=False),
    "03_symbol": lambda c: B.symbol_svg(color=c, height=1000, pad=160),
    "04_wordmark": lambda c: B.wordmark_svg(color=c, cap_h=200),
    "08_label_symbol": lambda c: B.label_mark(color=c, size=600),
    "08_label_lockup": lambda c: B.label_lockup(color=c, size=200),
}


def svg_size(svg):
    import re
    m = re.search(r'width="(\d+)" height="(\d+)"', svg)
    return int(m.group(1)), int(m.group(2))


def export(svg, folder, name, scale=2):
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{name}.svg").write_text(svg, encoding="utf-8")
    w, h = svg_size(svg)
    page(f"logo/{name}", f'<img src="{svg_data(svg)}" style="width:{w}px;height:{h}px;display:block">', w, h,
         outs=[folder / f"{name}.png"], scale=scale, transparent=True)


for cname, col in COLORS.items():
    folder = OUT / {"obsidian": "01_BLACK_OBSIDIAN", "ivory": "02_WHITE_IVORY", "white": "03_WHITE_PURE",
                    "champagne": "04_CHAMPAGNE", "concrete": "05_MONOCHROME_CONCRETE"}[cname]
    for lname, fn in LOCKUPS.items():
        export(fn(col), folder, f"VERTICE_{lname}_{cname}")

# versão principal institucional: símbolo champagne + logotipo marfim (sobre obsidian)
prim = OUT / "00_PRIMARY"
export(B.lockup_horizontal(color=B.IVORY, sym_color=B.CHAMPAGNE, cap_h=200), prim, "VERTICE_primary_horizontal_ivory-champagne")
export(B.lockup_vertical(color=B.IVORY, sym_color=B.CHAMPAGNE, cap_h=180), prim, "VERTICE_primary_centered_ivory-champagne")
export(B.lockup_horizontal(color=B.OBSIDIAN, sym_color=B.CHAMPAGNE, cap_h=200), prim, "VERTICE_primary_horizontal_obsidian-champagne")
export(B.lockup_vertical(color=B.OBSIDIAN, sym_color=B.CHAMPAGNE, cap_h=180), prim, "VERTICE_primary_centered_obsidian-champagne")

# pranchas de visualização (JPG) com fundos corretos
PREV = OUT / "00_PREVIEWS"
combos = [
    ("horizontal_obsidian_on_ivory", B.lockup_horizontal(color=B.OBSIDIAN, cap_h=120), B.IVORY),
    ("horizontal_ivory_on_obsidian", B.lockup_horizontal(color=B.IVORY, sym_color=B.CHAMPAGNE, cap_h=120), B.OBSIDIAN),
    ("centered_obsidian_on_ivory", B.lockup_vertical(color=B.OBSIDIAN, cap_h=110), B.IVORY),
    ("centered_ivory-champagne_on_obsidian", B.lockup_vertical(color=B.IVORY, sym_color=B.CHAMPAGNE, cap_h=110), B.OBSIDIAN),
    ("symbol_champagne_on_obsidian", B.symbol_svg(color=B.CHAMPAGNE, height=520), B.OBSIDIAN),
    ("symbol_obsidian_on_ivory", B.symbol_svg(color=B.OBSIDIAN, height=520), B.IVORY),
    ("champagne_on_ivory", B.lockup_horizontal(color=B.CHAMPAGNE, cap_h=120), B.IVORY),
    ("monochrome_concrete_on_ivory", B.lockup_horizontal(color=B.CONCRETE, cap_h=120), B.IVORY),
    ("label_on_obsidian", B.label_lockup(color=B.IVORY, size=120), B.OBSIDIAN),
]
for n, svg, bg in combos:
    w, h = svg_size(svg)
    page(f"logo/preview_{n}", f'<div class="grain" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><img src="{svg_data(svg)}" style="width:{w}px;height:{h}px"></div>',
         2400, 1600, bg=bg, outs=[PREV / f"VERTICE_preview_{n}.jpg"])

run()
print("identidade exportada")
