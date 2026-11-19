"""03_GRAPHIC_ELEMENTS + 04_COLOR_AND_TYPOGRAPHY + construção do logo (02)."""
import json
import math

import brand as B
import content as C
from common import (ROOT, page, run, svg_data, sym, word, word_w, sym_w, lab, frame, cmark,
                    pattern_div, lines_div, hexrgb, cmyk)

G = ROOT / "03_GRAPHIC_ELEMENTS"
CT = ROOT / "04_COLOR_AND_TYPOGRAPHY"
LG = ROOT / "02_LOGO_AND_IDENTITY"
W, H = 2400, 1600

# ------------------------------------------------------------ vetores soltos (SVG)
for sub in ["01_PATTERNS", "02_COLLECTION_IDENTIFIERS", "03_LINES_AND_FRAMES", "04_TEXTURES", "05_NUMBERING"]:
    (G / sub).mkdir(parents=True, exist_ok=True)

pats = [("obsidian-on-ivory", B.OBSIDIAN, B.IVORY, 1), ("champagne-on-obsidian", B.CHAMPAGNE, B.OBSIDIAN, 1),
        ("ivory-on-ivory_tissue", "#D9D2C4", B.IVORY, 1), ("concrete-on-obsidian", "#2A2A29", B.OBSIDIAN, 1)]
for n, c, bg, op in pats:
    (G / "01_PATTERNS" / f"VERTICE_pattern_monogram_{n}.svg").write_text(B.pattern_svg(1200, 1200, 46, c, bg), encoding="utf-8")
    page(f"graphics/pattern_{n}", f'<div class="abs" style="inset:0;background:{bg}"></div>{pattern_div(c, 46)}', 2400, 2400,
         outs=[G / "01_PATTERNS" / f"VERTICE_pattern_monogram_{n}.png"])
W_, H_, inner = B.pattern_tile(46, B.OBSIDIAN)
(G / "01_PATTERNS" / "VERTICE_pattern_monogram_TILE_seamless.svg").write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W_:.2f}" height="{H_:.2f}" viewBox="0 0 {W_:.2f} {H_:.2f}">{inner}</svg>', encoding="utf-8")
for n, c, bg in [("obsidian-on-ivory", B.OBSIDIAN, B.IVORY), ("ivory-on-obsidian", B.IVORY, B.OBSIDIAN), ("champagne-on-obsidian", B.CHAMPAGNE, B.OBSIDIAN)]:
    (G / "01_PATTERNS" / f"VERTICE_pattern_24deg-lines_{n}.svg").write_text(B.lines_svg(1200, 1200, 26, c, 1.2, bg), encoding="utf-8")
    page(f"graphics/lines_{n}", f'<div class="abs" style="inset:0;background:{bg}"></div>{lines_div(2400, 2400, c, 44, 1.6)}', 2400, 2400,
         outs=[G / "01_PATTERNS" / f"VERTICE_pattern_24deg-lines_{n}.png"])

for col in C.COLLECTIONS:
    for cn, cv in [("obsidian", B.OBSIDIAN), ("ivory", B.IVORY), ("champagne", B.CHAMPAGNE)]:
        svg = B.collection_mark_svg(col["blades"], cv, 400, pad=40)
        (G / "02_COLLECTION_IDENTIFIERS" / f"VERTICE_id_{col['n']}_{col['key']}_{cn}.svg").write_text(svg, encoding="utf-8")

# moldura editorial em SVG
fr = (f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" fill="none">'
      f'<rect x="40" y="40" width="1000" height="1270" stroke="{B.OBSIDIAN}" stroke-opacity=".35"/>'
      + "".join(f'<path d="M{x} {y + 14 * sy} V{y} H{x + 14 * sx}" stroke="{B.OBSIDIAN}" stroke-width="1.5"/>'
                for x, y, sx, sy in [(40, 40, 1, 1), (1040, 40, -1, 1), (40, 1310, 1, -1), (1040, 1310, -1, -1)]) + '</svg>')
(G / "03_LINES_AND_FRAMES" / "VERTICE_frame_editorial_4x5.svg").write_text(fr, encoding="utf-8")
(G / "03_LINES_AND_FRAMES" / "VERTICE_lines_24deg.svg").write_text(B.lines_svg(1600, 1000, 32, B.OBSIDIAN, 1), encoding="utf-8")

# ------------------------------------------------------------ pranchas
def board(name, body, out, bg=B.IVORY, w=W, h=H):
    page(name, f'<div class="abs grain" style="inset:0;background:{bg}"></div>{body}', w, h, outs=[out], bg=bg)


# prancha: identificadores de coleção
cells = ""
for i, col in enumerate(C.COLLECTIONS):
    x = 160 + i * 540
    cells += (f'<div class="abs" style="left:{x}px;top:420px;width:460px;height:760px;border-top:1px solid rgba(23,23,23,.25)">'
              f'<div style="padding-top:28px">{lab(col["n"] + " / 04", 13, "var(--co)")}</div>'
              f'<div style="height:330px;display:flex;align-items:center">{cmark(col["blades"], B.OBSIDIAN, 190)}</div>'
              f'<div class="serif" style="font-size:72px;line-height:1;color:var(--ob)">{col["key"].title()}</div>'
              f'<div style="margin-top:22px;font-size:20px;line-height:1.5;color:#4a4845;max-width:380px">{col["desc"]}</div>'
              f'<div style="margin-top:28px">{lab(col["code"] + " · " + ("FULL VERTEX" if col["blades"] == 0 else str(col["blades"]) + " BLADE" + ("S" if col["blades"] > 1 else "")), 13, "var(--ch)")}</div></div>')
board("graphics/board_collection_ids",
      f'{frame(W, H, 56, "var(--ob)", "VÉRTICE · GRAPHIC SYSTEM", "COLLECTION IDENTIFIERS", "BLADES AT 24°", "STUDIO MATTEU")}'
      f'<div class="abs serif" style="left:160px;top:170px;font-size:110px;line-height:1;color:var(--ob)">Four collections, <span class="it">one angle.</span></div>{cells}',
      G / "02_COLLECTION_IDENTIFIERS" / "VERTICE_board_collection_identifiers.jpg")

# prancha: numeração de produto
nums = ""
for i, col in enumerate(C.COLLECTIONS):
    y = 520 + i * 190
    nums += (f'<div class="abs" style="left:160px;top:{y}px;width:2080px;height:150px;border-top:1px solid rgba(233,228,218,.18);display:flex;align-items:center;gap:60px">'
             f'<div style="width:120px">{cmark(col["blades"], B.CHAMPAGNE, 80)}</div>'
             f'<div class="mono" style="font-size:54px;color:var(--iv);letter-spacing:.06em;width:900px">VRT·{col["code"]}·FW26·{[14, 27, 3, 1][i]:03d}</div>'
             f'<div style="width:420px">{lab(col["key"], 16, "var(--iv)")}</div>'
             f'<div class="serif it" style="font-size:44px;color:var(--ch)">{"Nº 001 / 250" if col["key"] == "LIMITED" else "Selected FW26"}</div></div>')
board("graphics/board_numbering",
      f'{frame(W, H, 56, "var(--iv)", "VÉRTICE · GRAPHIC SYSTEM", "PRODUCT NUMBERING", "VRT · COLLECTION · SEASON · Nº", "STUDIO MATTEU")}'
      f'<div class="abs serif" style="left:160px;top:170px;font-size:110px;line-height:1;color:var(--iv)">Every pair has <span class="it">a number.</span></div>'
      f'<div class="abs" style="left:160px;top:330px;font-size:22px;line-height:1.6;color:var(--co);max-width:1300px">Curation code used on tags, authenticity cards and boxes. '
      f'Brand prefix, collection code, season and pair number. Limited releases add the edition size.</div>{nums}',
      G / "05_NUMBERING" / "VERTICE_board_product_numbering.jpg", bg=B.OBSIDIAN)

# prancha: padrões
board("graphics/board_patterns",
      f'<div class="abs" style="left:0;top:0;width:1200px;height:1600px;background:var(--ob);overflow:hidden">{pattern_div(B.CHAMPAGNE, 52)}</div>'
      f'<div class="abs" style="left:1200px;top:0;width:1200px;height:800px;overflow:hidden">{pattern_div("#CFC7B8", 36)}</div>'
      f'<div class="abs" style="left:1200px;top:800px;width:1200px;height:800px;overflow:hidden;background:var(--ob)">{lines_div(1200, 800, B.CONCRETE, 30, 1, .7)}</div>'
      f'<div class="abs" style="left:1200px;top:800px;width:1200px;height:800px;display:flex;align-items:center;justify-content:center">'
      f'<div style="background:var(--ob);padding:40px 56px">{lab("24° LINE SYSTEM", 16, "var(--iv)")}</div></div>'
      f'<div class="abs" style="left:1200px;top:0;width:1200px;height:800px;display:flex;align-items:center;justify-content:center">'
      f'<div style="background:var(--iv);padding:40px 56px">{lab("MONOGRAM · TISSUE", 16, "var(--ob)")}</div></div>'
      f'<div class="abs" style="left:0;top:0;width:1200px;height:1600px;display:flex;align-items:center;justify-content:center">'
      f'<div style="background:var(--ob);padding:40px 56px">{lab("MONOGRAM · HOT STAMP", 16, "var(--ch)")}</div></div>',
      G / "01_PATTERNS" / "VERTICE_board_patterns.jpg")

# prancha: linhas, molduras e grafismos
board("graphics/board_frames",
      f'<div class="abs" style="left:160px;top:200px;width:620px;height:1200px;background:var(--iv);box-shadow:0 30px 80px rgba(0,0,0,.12)">'
      f'{frame(620, 1200, 28, "var(--ob)", "VÉRTICE", "Nº 014", "ESS · FW26", "SELECTED", 10)}'
      f'<div class="abs" style="left:0;right:0;top:470px;display:flex;justify-content:center">{sym(B.OBSIDIAN, 150)}</div></div>'
      f'<div class="abs" style="left:890px;top:200px;width:620px;height:1200px;background:var(--ob);box-shadow:0 30px 80px rgba(0,0,0,.2)">'
      f'{frame(620, 1200, 28, "var(--ch)", "VÉRTICE", "Nº 001/250", "LTD · FW26", "LIMITED", 10)}'
      f'<div class="abs" style="left:0;right:0;top:470px;display:flex;justify-content:center">{cmark(0, B.CHAMPAGNE, 150)}</div></div>'
      f'<div class="abs" style="left:1620px;top:200px;width:620px;height:1200px;background:#DCD6CB;overflow:hidden">'
      f'{lines_div(620, 1200, B.OBSIDIAN, 26, 1, .22)}'
      f'<div class="abs" style="left:60px;top:60px;right:60px;bottom:60px;background:var(--iv)"></div>'
      f'<div class="abs" style="left:60px;right:60px;top:520px;text-align:center" class="serif"><span class="serif" style="font-size:64px;color:var(--ob)">A different<br><span class="it">point of view.</span></span></div></div>'
      f'<div class="abs" style="left:160px;top:110px">{lab("EDITORIAL FRAMES · 24° LINES · CORNER MARKS", 14, "var(--co)")}</div>',
      G / "03_LINES_AND_FRAMES" / "VERTICE_board_frames_and_lines.jpg", bg="#D3CDC2")

# ------------------------------------------------------------ construção do logo
t = math.tan(B.ANG)
polys, sw0, sh0 = B.symbol_geometry()
S = 1000 / sh0
sx0, sy0 = 430, 300
grid = ""
for k in range(0, 11):
    yy = sy0 + k * B.M * S
    if yy <= sy0 + sh0 * S + 1:
        grid += f'<line x1="{sx0 - 200}" y1="{yy:.1f}" x2="{sx0 + sw0 * S + 200}" y2="{yy:.1f}" />'
for k in range(-2, 12):
    xx = sx0 + k * B.M * S
    grid += f'<line x1="{xx:.1f}" y1="{sy0 - 80}" x2="{xx:.1f}" y2="{sy0 + sh0 * S + 80}" />'
pts = polys[0]
P = [(sx0 + x * S, sy0 + y * S) for x, y in pts]
d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in P) + "Z"
ext = (f'<line x1="{P[0][0]:.1f}" y1="{P[0][1]:.1f}" x2="{P[5][0]:.1f}" y2="{P[5][1]:.1f}" stroke="{B.CHAMPAGNE}" stroke-width="2" />'
       f'<line x1="{P[5][0]:.1f}" y1="{P[5][1]:.1f}" x2="{P[4][0]:.1f}" y2="{P[4][1]:.1f}" stroke="{B.CHAMPAGNE}" stroke-width="2" />'
       f'<line x1="{P[5][0]:.1f}" y1="{P[5][1] + 60:.1f}" x2="{P[5][0]:.1f}" y2="{sy0 - 120}" stroke="{B.CHAMPAGNE}" stroke-dasharray="6 8" stroke-width="1.5"/>')
# arcos de 24°
r = 300
ax, ay = P[5]
arc = (f'<path d="M{ax:.1f},{ay - r:.1f} A{r},{r} 0 0 1 {ax + r * math.sin(B.ANG):.1f},{ay - r * math.cos(B.ANG):.1f}" stroke="{B.CHAMPAGNE}" stroke-width="1.5" fill="none"/>'
       f'<path d="M{ax:.1f},{ay - r:.1f} A{r},{r} 0 0 0 {ax - r * math.sin(B.ANG):.1f},{ay - r * math.cos(B.ANG):.1f}" stroke="{B.CHAMPAGNE}" stroke-width="1.5" fill="none"/>')
dots = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7" fill="{B.IVORY}" stroke="{B.CHAMPAGNE}" stroke-width="2"/>' for x, y in P)
cons_svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            f'<g stroke="{B.CONCRETE}" stroke-width="1" opacity=".35">{grid}</g>'
            f'<path d="{d}" fill="{B.OBSIDIAN}"/>{ext}{arc}{dots}</svg>')
(LG / "06_CONSTRUCTION").mkdir(parents=True, exist_ok=True)
(LG / "06_CONSTRUCTION" / "VERTICE_symbol_construction.svg").write_text(cons_svg, encoding="utf-8")
notes = [("Module", "M = 1/9 of the wedge height"), ("Angle", "24° from the vertical, both strokes"), ("Wedge", "2.25 M at the top, tapering to the vertex"),
         ("Blade", "0.6 M, constant width"), ("Elevation", "The blade rises 1 M above the wedge")]
nt = "".join(f'<div style="border-top:1px solid rgba(23,23,23,.2);padding:18px 0 22px">{lab(a, 13, "var(--ch)")}<div style="font-size:24px;color:var(--ob);margin-top:10px">{b}</div></div>' for a, b in notes)
board("graphics/board_symbol_construction",
      f'<img class="abs" style="left:0;top:0;width:{W}px;height:{H}px" src="{svg_data(cons_svg)}">'
      f'{frame(W, H, 56, "var(--ob)", "VÉRTICE · SYMBOL", "CONSTRUCTION", "GRID 12 U · 24°", "STUDIO MATTEU")}'
      f'<div class="abs" style="left:1560px;top:300px;width:640px"><div class="serif" style="font-size:76px;line-height:1.02;color:var(--ob);margin-bottom:50px">Built from <span class="it">one angle.</span></div>{nt}</div>'
      f'<div class="abs" style="left:{ax - 60:.0f}px;top:{ay - r - 70:.0f}px">{lab("24°  24°", 14, "var(--ch)")}</div>',
      LG / "06_CONSTRUCTION" / "VERTICE_board_symbol_construction.jpg")

# construção do logotipo: espaçamento e acento
cap = 260
ww = word_w(cap)
lx = (W - ww) / 2
wd = word(B.OBSIDIAN, cap)
board("graphics/board_wordmark_construction",
      f'{frame(W, H, 56, "var(--ob)", "VÉRTICE · LOGOTYPE", "CONSTRUCTION", "INSTRUMENT SERIF · CUSTOM", "STUDIO MATTEU")}'
      f'<div class="abs" style="left:{lx:.0f}px;top:{620 - cap * .36:.0f}px">{wd}</div>'
      + "".join(f'<div class="abs" style="left:{lx - 120}px;width:{ww + 240:.0f}px;top:{y}px;height:1px;background:var(--ch);opacity:.8"></div>' for y in [620, 620 + cap, 620 - cap * .31])
      + f'<div class="abs" style="left:{lx + ww + 140:.0f}px;top:{620 - 10}px">{lab("CAP HEIGHT", 12, "var(--ch)")}</div>'
      f'<div class="abs" style="left:{lx + ww + 140:.0f}px;top:{620 + cap - 10}px">{lab("BASELINE", 12, "var(--ch)")}</div>'
      f'<div class="abs" style="left:{lx + ww + 140:.0f}px;top:{620 - cap * .31 - 10:.0f}px">{lab("ACCENT · 24°", 12, "var(--ch)")}</div>'
      f'<div class="abs" style="left:240px;top:1080px;display:grid;grid-template-columns:repeat(3,1fr);gap:80px;width:1920px">'
      f'<div>{lab("01 · Tracking", 13, "var(--ch)")}<p style="font-size:24px;line-height:1.5;margin-top:16px;color:var(--ob)">Optical spacing of 0.30 cap height between every letter. The word breathes like a monument inscription.</p></div>'
      f'<div>{lab("02 · The accent", 13, "var(--ch)")}<p style="font-size:24px;line-height:1.5;margin-top:16px;color:var(--ob)">The acute accent was redrawn as a blade cut at 24°, the same angle as the symbol. The vertex lives inside the name.</p></div>'
      f'<div>{lab("03 · Contrast", 13, "var(--ch)")}<p style="font-size:24px;line-height:1.5;margin-top:16px;color:var(--ob)">High-contrast editorial serif in uppercase: fashion heritage, set with architectural rigour.</p></div></div>',
      LG / "06_CONSTRUCTION" / "VERTICE_board_wordmark_construction.jpg")

# área de proteção e redução mínima
hz = B.lockup_horizontal(color=B.OBSIDIAN, cap_h=120, pad=0)
import re
mw, mh = map(float, re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', hz).groups())
px, py = (W - mw) / 2, 420
xu = 120 * 1.62 * 0.45   # x = altura do vértice ~ meia altura do símbolo
board("graphics/board_clearspace",
      f'{frame(W, H, 56, "var(--ob)", "VÉRTICE · LOGO", "CLEAR SPACE & MINIMUM SIZE", "", "STUDIO MATTEU")}'
      f'<div class="abs" style="left:{px - xu:.0f}px;top:{py - xu:.0f}px;width:{mw + 2 * xu:.0f}px;height:{mh + 2 * xu:.0f}px;background:rgba(169,140,99,.14);border:1px dashed var(--ch)"></div>'
      f'<img class="abs" style="left:{px:.0f}px;top:{py:.0f}px;width:{mw:.0f}px;height:{mh:.0f}px" src="{svg_data(hz)}">'
      f'<div class="abs" style="left:{px - xu:.0f}px;top:{py - xu - 40:.0f}px">{lab("X = HALF THE SYMBOL HEIGHT ON EVERY SIDE", 13, "var(--ch)")}</div>'
      f'<div class="abs" style="left:240px;top:1020px;width:1920px;border-top:1px solid rgba(23,23,23,.2);display:flex;gap:120px;padding-top:50px;align-items:flex-end">'
      f'<div><img src="{svg_data(B.lockup_horizontal(color=B.OBSIDIAN, cap_h=26, pad=0))}" style="height:42px;display:block"><div style="margin-top:22px">{lab("HORIZONTAL · MIN 35 MM / 140 PX", 12, "var(--co)")}</div></div>'
      f'<div><img src="{svg_data(B.lockup_vertical(color=B.OBSIDIAN, cap_h=22, pad=0, tagline=False))}" style="height:90px;display:block"><div style="margin-top:22px">{lab("CENTERED · MIN 22 MM / 90 PX", 12, "var(--co)")}</div></div>'
      f'<div><img src="{svg_data(B.symbol_svg(B.OBSIDIAN, 40))}" style="height:40px;display:block"><div style="margin-top:22px">{lab("SYMBOL · MIN 6 MM / 24 PX", 12, "var(--co)")}</div></div>'
      f'<div><img src="{svg_data(B.label_lockup(B.OBSIDIAN, 30))}" style="height:48px;display:block"><div style="margin-top:22px">{lab("LABEL VERSION · MIN 15 MM", 12, "var(--co)")}</div></div></div>',
      LG / "06_CONSTRUCTION" / "VERTICE_board_clearspace_minimum.jpg")

# ------------------------------------------------------------ cor
(CT / "01_COLOR").mkdir(parents=True, exist_ok=True)
(CT / "02_TYPOGRAPHY").mkdir(parents=True, exist_ok=True)
roles = {"Obsidian": "Institutional base", "Ivory": "Editorial backgrounds", "Concrete": "Support & information", "Champagne": "Premium details, used sparingly"}
share = {"Obsidian": 46, "Ivory": 38, "Concrete": 11, "Champagne": 5}
colw = {"Obsidian": 34, "Ivory": 30, "Concrete": 19, "Champagne": 17}   # largura visual (o uso real está em share)
cols = ""
x = 0
for n, hx in B.PALETTE.items():
    wpx = W * colw[n] / 100
    r, g, b = hexrgb(hx)
    c, m, y, k = cmyk(hx)
    fg = B.IVORY if n in ("Obsidian", "Concrete", "Champagne") else B.OBSIDIAN
    cmyk_s = f"C{c} M{m} Y{y} K{k}"
    cols += (f'<div class="abs" style="left:{x:.0f}px;top:0;width:{wpx:.0f}px;height:{H}px;background:{hx}">'
             f'<div class="abs" style="left:48px;top:64px">{lab(f"USAGE ≈ {share[n]}%", 13, fg)}</div>'
             f'<div class="abs serif" style="left:48px;bottom:330px;font-size:{96 if wpx > 600 else 64}px;color:{fg};line-height:1">{n}</div>'
             f'<div class="abs" style="left:48px;bottom:80px;font-size:17px;line-height:1.9;color:{fg}" class="mono">'
             f'<div style="opacity:.75;margin-bottom:12px">{roles[n]}</div>HEX {hx}<br>RGB {r} {g} {b}<br>CMYK {cmyk_s}</div></div>')
    x += wpx
board("graphics/board_palette", cols, CT / "01_COLOR" / "VERTICE_color_palette.jpg")
pal = {n: {"hex": hx, "rgb": hexrgb(hx), "cmyk_reference": cmyk(hx), "role": roles[n], "share_percent": share[n]} for n, hx in B.PALETTE.items()}
pal["_note"] = "CMYK = conversão de referência a partir do RGB; validar com prova de impressão. Áreas grandes de Obsidian em offset: preto calçado C60 M50 Y50 K100."
(CT / "01_COLOR" / "VERTICE_palette.json").write_text(json.dumps(pal, indent=2, ensure_ascii=False), encoding="utf-8")
(CT / "01_COLOR" / "VERTICE_palette_tokens.css").write_text(":root {\n" + "".join(f"  --vertice-{n.lower()}: {hx};\n" for n, hx in B.PALETTE.items()) + "}\n", encoding="utf-8")
(CT / "01_COLOR" / "VERTICE_palette_swatches.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">' + "".join(f'<rect x="{i * 200}" y="0" width="200" height="200" fill="{hx}"><title>{n} {hx}</title></rect>' for i, (n, hx) in enumerate(B.PALETTE.items())) + "</svg>", encoding="utf-8")

# combinações de cor
combos = [(B.OBSIDIAN, B.IVORY, B.CHAMPAGNE, "Obsidian · Ivory · Champagne", "Institutional"),
          (B.IVORY, B.OBSIDIAN, B.CHAMPAGNE, "Ivory · Obsidian", "Editorial"),
          (B.CONCRETE, B.IVORY, B.OBSIDIAN, "Concrete · Ivory", "Support"),
          (B.CHAMPAGNE, B.OBSIDIAN, B.IVORY, "Champagne · Obsidian", "Limited only")]
cc = "".join(f'<div style="background:{bg};position:relative;height:620px;padding:46px"><div style="display:flex;justify-content:space-between">{lab(t2, 12, fg)}{lab("AA" if i != 3 else "LARGE TYPE", 12, fg)}</div>'
             f'<div style="position:absolute;left:46px;bottom:46px">{sym(ac, 120)}<div class="serif" style="font-size:54px;color:{fg};margin-top:30px;line-height:1">{t1}</div></div></div>'
             for i, (bg, fg, ac, t1, t2) in enumerate(combos))
board("graphics/board_color_combos", f'<div class="abs" style="left:120px;top:150px">{lab("APPROVED COLOR COMBINATIONS", 14, "var(--co)")}</div>'
      f'<div class="abs" style="left:120px;right:120px;top:240px;display:grid;grid-template-columns:repeat(2,1fr);gap:24px">{cc}</div>',
      CT / "01_COLOR" / "VERTICE_color_combinations.jpg", w=W, h=1700)

# ------------------------------------------------------------ tipografia
spec = (f'{frame(W, H, 56, "var(--ob)", "VÉRTICE · TYPOGRAPHY", "PRIMARY PAIR", "SIL OPEN FONT LICENSE 1.1", "STUDIO MATTEU")}'
        f'<div class="abs" style="left:160px;top:200px;width:1000px">{lab("Display · Editorial serif", 13, "var(--ch)")}'
        f'<div class="serif" style="font-size:300px;line-height:.9;color:var(--ob);margin-top:30px">Aa</div>'
        f'<div class="serif" style="font-size:96px;line-height:1;color:var(--ob);margin-top:20px">Instrument Serif</div>'
        f'<div class="serif it" style="font-size:52px;color:var(--co);margin-top:16px">Regular & Italic</div>'
        f'<div class="serif" style="font-size:40px;line-height:1.35;color:var(--ob);margin-top:46px;letter-spacing:.02em">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 · É Ã Ç &</div></div>'
        f'<div class="abs" style="left:1300px;top:200px;width:940px">{lab("Text · Neo-grotesque sans", 13, "var(--ch)")}'
        f'<div style="font-family:Inter Display;font-weight:300;font-size:300px;line-height:.9;color:var(--ob);margin-top:30px;letter-spacing:-.03em">Aa</div>'
        f'<div style="font-family:Inter Display;font-weight:400;font-size:96px;line-height:1;color:var(--ob);margin-top:20px;letter-spacing:-.02em">Inter</div>'
        f'<div style="font-size:30px;color:var(--co);margin-top:26px">Light 300 · Regular 400 · Medium 500 · SemiBold 600</div>'
        f'<div style="font-size:34px;line-height:1.5;color:var(--ob);margin-top:46px">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 · É Ã Ç &</div></div>')
board("graphics/board_type_specimen", spec, CT / "02_TYPOGRAPHY" / "VERTICE_type_specimen.jpg")

hier = [("H1 · Display", "Instrument Serif 120–160 / 0.95", '<span class="serif" style="font-size:128px;line-height:.95">Beyond the <span class="it">ordinary.</span></span>'),
        ("H2 · Title", "Instrument Serif 64 / 1.05", '<span class="serif" style="font-size:64px">Selected with intention</span>'),
        ("H3 · Statement", "Inter Medium 18 · caps · +320", lab("CULTURE IN EVERY STEP", 18, "var(--ob)")),
        ("Body", "Inter Regular 20 / 1.6", '<span style="font-size:22px;line-height:1.6;max-width:1100px;display:block">Every pair on our shelves was selected with intention: for its design, its material and its story.</span>'),
        ("Caption", "Inter Regular 14 / 1.5 · Concrete", '<span style="font-size:15px;color:var(--co)">Archive collection — suede study, FW26 selection.</span>'),
        ("Technical", "Inter Regular 14 · tabular · +80", '<span class="mono" style="font-size:18px">VRT·ARC·FW26·003 &nbsp; Nº 003 / 120 &nbsp; EU 42</span>')]
hh = "".join(f'<div style="display:grid;grid-template-columns:420px 1fr;border-top:1px solid rgba(23,23,23,.18);padding:30px 0;align-items:center">'
             f'<div>{lab(a, 13, "var(--ch)")}<div style="font-size:15px;color:var(--co);margin-top:10px">{b}</div></div><div style="color:var(--ob)">{c}</div></div>' for a, b, c in hier)
board("graphics/board_type_hierarchy", f'<div class="abs" style="left:160px;right:160px;top:150px">{lab("TYPOGRAPHIC HIERARCHY", 14, "var(--co)")}<div style="margin-top:50px">{hh}</div></div>',
      CT / "02_TYPOGRAPHY" / "VERTICE_type_hierarchy.jpg", h=1420)

run()
print("ok")
