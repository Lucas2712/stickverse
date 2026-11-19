"""13_BRAND_GUIDELINES · manual de identidade em PDF (A4 paisagem, texto vetorial) + JPG das páginas."""
import brand as B
import content as C
from common import ROOT, run, doc, photo, sym, word, word_w, lab, frame, cmark, pattern_div, lines_div, svg_data, hexrgb, cmyk

OUT = ROOT / "13_BRAND_GUIDELINES"
OB, IV, CO, CH = B.OBSIDIAN, B.IVORY, B.CONCRETE, B.CHAMPAGNE
W, H = 1754, 1240
PAGES = []
TOC = []


def f(rel):
    return (ROOT / rel).as_uri()


def pic(rel, l, t, w, h, pos="50% 50%", extra=""):
    return f'<img class="ph" src="{f(rel)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos};{extra}">'


def ph(name, l, t, w, h, pos="50% 50%", extra=""):
    return f'<img class="ph" src="{photo(name)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos};{extra}">'


def pg(section, title, body, dark=False, toc=None):
    n = len(PAGES) + 1
    bg, fg = (OB, IV) if dark else (IV, OB)
    if toc:
        TOC.append((toc, n))
    if title == "":   # página de imagem: só o número, embaixo à direita
        PAGES.append(f'<div class="abs grain" style="inset:0;background:{bg}"></div>' + body
                     + f'<div class="abs mono" style="right:80px;bottom:22px;font-size:13px;color:{fg}">{n:02d}</div>')
        return
    PAGES.append(f'<div class="abs grain" style="inset:0;background:{bg}"></div>'
                 f'<div class="abs" style="left:80px;top:60px">{lab("VÉRTICE · BRAND GUIDELINES", 10, fg)}</div>'
                 f'<div class="abs" style="right:80px;top:60px">{lab(section, 10, CH)}</div>'
                 f'<div class="abs" style="left:80px;bottom:56px">{lab("STUDIO MATTEU · V1.0 · 2026", 10, CO)}</div>'
                 f'<div class="abs mono" style="right:80px;bottom:52px;font-size:13px;color:{fg}">{n:02d}</div>'
                 + f'<div class="abs serif" style="left:76px;top:130px;width:1300px;font-size:72px;line-height:1.02;color:{fg}">{title}</div>'
                 + body)


def txt(t, l, top, w, size=19, color=None, op=.85):
    return f'<div class="abs" style="left:{l}px;top:{top}px;width:{w}px;font-size:{size}px;line-height:1.65;color:{color or "inherit"};opacity:{op}">{t}</div>'


def rows(items, l, top, w, fg):
    return (f'<div class="abs" style="left:{l}px;top:{top}px;width:{w}px">' + "".join(
        f'<div style="display:grid;grid-template-columns:260px 1fr;border-top:1px solid {fg}30;padding:16px 0">{lab(a, 11, CH)}'
        f'<span style="font-size:18px;line-height:1.55;color:{fg}">{b}</span></div>' for a, b in items) + '</div>')


# 01 capa
PAGES.append(f'<div class="abs" style="inset:0;background:{OB}"></div>{ph("09_architecture_v-light", 0, 0, W, H, "55% 50%", "opacity:.5")}'
             f'<div class="abs" style="left:100px;top:100px">{sym(CH, 110)}</div>'
             f'<div class="abs" style="left:96px;bottom:270px">{word(IV, 96)}</div>'
             f'<div class="abs serif it" style="left:100px;bottom:180px;font-size:56px;color:{IV}">Brand guidelines</div>'
             f'<div class="abs" style="left:100px;bottom:100px">{lab("VERSION 1.0 · STUDIO MATTEU · 2026", 12, IV)}</div>')
# 02 sumário (preenchido no fim)
PAGES.append("TOC")

# 03 conceito
pg("01 · CONCEPT", f'{C.ESSENCE}',
   txt(C.ESSENCE_LONG, 80, 330, 900, 24, OB) + txt("<b style='font-weight:500'>Name.</b> Vértice is Portuguese for <i>vertex</i>: the highest point of a figure, where two lines meet. "
       "It names the brand's role — the point where selection becomes a point of view.", 80, 560, 900, 20, OB)
   + ph("09_architecture_v-light", 1100, 0, 654, H, "62% 50%")
   + f'<div class="abs serif it" style="left:80px;bottom:150px;font-size:48px;color:{CH}">Beyond the ordinary.</div>', toc="Concept")
# 04 manifesto
pg("01 · CONCEPT", " ", f'<div class="abs serif" style="left:80px;top:220px;width:1400px;font-size:62px;line-height:1.14;color:{IV}">'
   + "".join(f'<div style="{"color:" + CH + ";font-style:italic" if j in (1, 7) else ""}">{l}</div>' for j, l in enumerate(C.MANIFESTO)) + '</div>'
   + f'<div class="abs" style="left:80px;top:150px">{lab("MANIFESTO", 12, CH)}</div>', dark=True)
# 05 posicionamento
pg("02 · POSITIONING", "A gallery of choices, <span class='it'>not a stockroom.</span>",
   txt(C.POSITIONING, 80, 330, 1100, 23, OB)
   + rows([("Mission", C.MISSION), ("Vision", C.VISION), ("Audience", C.AUDIENCE)], 80, 520, 1100, OB)
   + rows([(a, b) for _, a, b in C.PILLARS], 80, 860, 1100, OB)
   + ph("10_campaign_sculpture", 1260, 130, 414, 980), toc="Positioning")
# 06 personalidade e voz
pg("02 · POSITIONING", "Personality & <span class='it'>voice.</span>",
   f'<div class="abs" style="left:80px;top:320px;right:80px;display:grid;grid-template-columns:repeat(4,1fr);gap:40px">'
   + "".join(f'<div style="border-top:1px solid {IV}40;padding-top:20px">{lab("0" + str(i + 1), 11, CH)}<div class="serif" style="font-size:46px;color:{IV};margin-top:12px">{a}</div>'
             f'<div style="font-size:18px;line-height:1.55;color:{IV};opacity:.75;margin-top:10px">{b}</div></div>' for i, (a, b) in enumerate(C.PERSONALITY)) + '</div>'
   + f'<div class="abs" style="left:80px;top:640px;display:flex;gap:60px">' + "".join(f'<span style="font-size:20px;color:{IV}">{a}, <span style="opacity:.5">{b}.</span></span>' for a, b in C.IS_NOT) + '</div>'
   + f'<div class="abs" style="left:80px;top:760px;width:700px">' + "".join(f'<div style="border-top:1px solid {IV}30;padding:14px 0;font-size:18px;color:{IV};opacity:.85">{v}</div>' for v in C.VOICE) + '</div>'
   + f'<div class="abs" style="left:900px;top:770px">' + "".join(f'<div style="font-family:Inter Display;font-weight:500;font-size:34px;letter-spacing:.04em;color:{IV};margin-bottom:18px">{l}</div>' for l in C.LINES) + '</div>', dark=True)
# 07 logotipo principal
pg("03 · LOGO", "The primary logo.",
   f'<div class="abs" style="left:80px;top:300px;width:1594px;height:560px;background:#DFD9CE;display:flex;align-items:center;justify-content:center">'
   f'<img src="{svg_data(B.lockup_horizontal(OB, cap_h=110, pad=0))}" style="height:180px"></div>'
   + txt("The horizontal lockup is the primary signature: symbol, a hairline divider and the logotype. Use it whenever space allows. "
         "The logotype and symbol are drawn as outlines; never retype the name.", 80, 900, 900, 20, OB)
   + f'<div class="abs" style="left:1100px;top:900px">{lab("FILES · 02_LOGO_AND_IDENTITY", 11, CH)}<div class="mono" style="font-size:15px;color:{OB};margin-top:12px;line-height:1.8">VERTICE_01_horizontal_[color].svg<br>VERTICE_02_centered_[color].svg<br>VERTICE_03_symbol_[color].svg</div></div>', toc="Logo")
# 08 construção do símbolo
pg("03 · LOGO", "", pic("02_LOGO_AND_IDENTITY/06_CONSTRUCTION/VERTICE_board_symbol_construction.jpg", 0, 0, W, int(W / 1.5), "50% 50%")
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px">{lab("SYMBOL CONSTRUCTION · GRID 12 U · 24°", 11, CH)}</div>', toc="Construction")
# 09 construção do logotipo
pg("03 · LOGO", "", pic("02_LOGO_AND_IDENTITY/06_CONSTRUCTION/VERTICE_board_wordmark_construction.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px">{lab("LOGOTYPE CONSTRUCTION · INSTRUMENT SERIF, REDRAWN ACCENT", 11, CH)}</div>')
# 10 área de proteção / redução
pg("03 · LOGO", "", pic("02_LOGO_AND_IDENTITY/06_CONSTRUCTION/VERTICE_board_clearspace_minimum.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px">{lab("CLEAR SPACE X = HALF THE SYMBOL HEIGHT · MINIMUM SIZES FOR PRINT AND SCREEN", 11, CH)}</div>', toc="Clear space & minimum size")
# 11 variações
tiles = [(B.lockup_horizontal(OB, cap_h=60, pad=0), IV, "Horizontal · Obsidian"), (B.lockup_horizontal(IV, CH, cap_h=60, pad=0), OB, "Horizontal · Ivory/Champagne"),
         (B.lockup_vertical(OB, cap_h=46, pad=0), IV, "Centered · Obsidian"), (B.lockup_vertical(IV, CH, cap_h=46, pad=0), OB, "Centered · Reversed"),
         (B.lockup_horizontal(CH, cap_h=60, pad=0), IV, "Champagne"), (B.lockup_horizontal("#FFFFFF", cap_h=60, pad=0), "#3a3936", "White · on photography"),
         (B.lockup_horizontal(CO, cap_h=60, pad=0), IV, "Monochrome · Concrete"), (B.label_lockup(IV, 60), OB, "Label · small sizes")]
vt = "".join(f'<div style="position:relative;background:{bg};height:250px;display:flex;align-items:center;justify-content:center">'
             f'<img src="{svg_data(s)}" style="max-height:{150 if "centered" in c.lower() else 80}px;max-width:330px">'
             f'<div style="position:absolute;left:18px;bottom:14px">{lab(c, 9, IV if bg != IV else OB)}</div></div>' for s, bg, c in tiles)
pg("03 · LOGO", "Variations.", f'<div class="abs" style="left:80px;right:80px;top:290px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">{vt}</div>'
   + txt("Black (Obsidian), white (Ivory, or pure white over photography), Champagne for hot stamping, Concrete for monochrome. "
         "The label version uses a reinforced symbol and a sans-serif name for woven labels, tags and favicons.", 80, 860, 1100, 19, OB), toc="Variations")
# 12 usos incorretos
hz = svg_data(B.lockup_horizontal(OB, cap_h=50, pad=0))
wrong = [("Do not stretch or distort", f'<img src="{hz}" style="height:60px;transform:scaleX(1.45)">', IV),
         ("Do not rotate", f'<img src="{hz}" style="height:60px;transform:rotate(-12deg)">', IV),
         ("Do not use colors outside the palette", f'<img src="{svg_data(B.lockup_horizontal("#2F5FD0", cap_h=50, pad=0))}" style="height:60px">', IV),
         ("Do not add shadows or effects", f'<img src="{hz}" style="height:60px;filter:drop-shadow(6px 8px 4px rgba(0,0,0,.55))">', IV),
         ("Do not outline the logo", f'<svg width="330" height="70" viewBox="0 0 {B.wordmark_paths(50)[1]:.0f} 70"><path d="{B.wordmark_paths(50, 0, 18)[0]}" fill="none" stroke="{OB}" stroke-width="1.2"/></svg>', IV),
         ("Do not rearrange the elements", f'<div style="display:flex;align-items:center;gap:20px">{word(OB, 34)}{sym(OB, 56)}</div>', IV),
         ("Do not place on busy, low-contrast images", f'<img src="{svg_data(B.lockup_horizontal(CO, cap_h=50, pad=0))}" style="height:60px;position:relative">', "url"),
         ("Do not retype the name in another font", f'<span style="font-family:Inter;font-weight:600;font-size:46px;letter-spacing:.02em;color:{OB}">Vértice</span>', IV)]
wt = ""
for t, inner, bg in wrong:
    bgs = f"background:url({photo('12_materials_flatlay')}) center/cover" if bg == "url" else f"background:#DFD9CE"
    wt += (f'<div style="position:relative;height:250px;{bgs};display:flex;align-items:center;justify-content:center;overflow:hidden">{inner}'
           f'<div style="position:absolute;right:14px;top:8px;color:#B0412E;font-size:34px;line-height:1">×</div>'
           f'<div style="position:absolute;left:16px;bottom:12px;background:{IV};padding:4px 8px">{lab(t, 9, OB)}</div></div>')
pg("03 · LOGO", "Incorrect use.", f'<div class="abs" style="left:80px;right:80px;top:290px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">{wt}</div>'
   + txt("The logo is a fixed drawing. Any change in proportion, color, arrangement or typography weakens recognition. When in doubt, use the files supplied.", 80, 860, 1100, 19, OB), toc="Incorrect use")
# 13 paleta
sw = ""
roles = {"Obsidian": "Institutional base", "Ivory": "Editorial backgrounds", "Concrete": "Support & information", "Champagne": "Premium details, sparingly"}
for i, (n, hx) in enumerate(B.PALETTE.items()):
    r, g, b = hexrgb(hx)
    c, m, y, k = cmyk(hx)
    fg = OB if n == "Ivory" else IV
    sw += (f'<div style="background:{hx};height:560px;position:relative;{"outline:1px solid #0001" if n == "Ivory" else ""}">'
           f'<div class="serif" style="position:absolute;left:30px;top:30px;font-size:52px;color:{fg}">{n}</div>'
           f'<div style="position:absolute;left:30px;top:110px">{lab(roles[n], 10, fg)}</div>'
           f'<div class="mono" style="position:absolute;left:30px;bottom:30px;font-size:17px;line-height:1.9;color:{fg}">HEX {hx}<br>RGB {r} · {g} · {b}<br>CMYK {c} · {m} · {y} · {k}</div></div>')
pg("04 · COLOR", "Color palette.", f'<div class="abs" style="left:80px;right:80px;top:290px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">{sw}</div>'
   + txt("CMYK values are reference conversions from RGB; confirm with a printed proof on the chosen paper. For large Obsidian areas in offset, use a rich black (C60 M50 Y50 K100). "
         "Champagne in print is preferably applied as hot-stamping foil.", 80, 900, 1300, 18, OB), toc="Color")
# 14 proporção e combinações
pg("04 · COLOR", "", pic("04_COLOR_AND_TYPOGRAPHY/01_COLOR/VERTICE_color_combinations.jpg", 0, 0, W, int(W * 1700 / 2400))
   + f'<div class="abs" style="left:80px;top:60px;background:{IV};padding:0 10px">{lab("PROPORTION · OBSIDIAN 46% · IVORY 38% · CONCRETE 11% · CHAMPAGNE 5%", 11, CH)}</div>')
# 15 tipografia
pg("05 · TYPOGRAPHY", "", pic("04_COLOR_AND_TYPOGRAPHY/02_TYPOGRAPHY/VERTICE_type_specimen.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Instrument Serif (Instrument, SIL OFL 1.1) · Inter / Inter Display (Rasmus Andersson, SIL OFL 1.1). License files in 14_SOURCE_FILES/fonts.</div>', toc="Typography")
pg("05 · TYPOGRAPHY", "", pic("04_COLOR_AND_TYPOGRAPHY/02_TYPOGRAPHY/VERTICE_type_hierarchy.jpg", 0, 0, W, int(W * 1420 / 2400)))
# 17 elementos gráficos
pg("06 · GRAPHIC ELEMENTS", "", pic("03_GRAPHIC_ELEMENTS/01_PATTERNS/VERTICE_board_patterns.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Monogram: upright and inverted V in a quincunx. Champagne on Obsidian for hot stamping, tone-on-tone for tissue. 24° lines as architectural texture.</div>', toc="Graphic elements")
pg("06 · GRAPHIC ELEMENTS", "", pic("03_GRAPHIC_ELEMENTS/03_LINES_AND_FRAMES/VERTICE_board_frames_and_lines.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Editorial frames: hairline at 35% opacity, 14 px corner marks, metadata in the corners (brand, number, collection, season).</div>')
pg("06 · GRAPHIC ELEMENTS", "", pic("03_GRAPHIC_ELEMENTS/02_COLLECTION_IDENTIFIERS/VERTICE_board_collection_identifiers.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Collection identifiers: 1, 2 and 3 blades at 24°; Limited carries the complete vertex.</div>')
pg("06 · GRAPHIC ELEMENTS", "", pic("03_GRAPHIC_ELEMENTS/05_NUMBERING/VERTICE_board_product_numbering.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Numbering: VRT · collection code · season · pair number. Limited editions add Nº / edition size.</div>')
# aplicações
pg("07 · APPLICATIONS", "", pic("11_MOCKUPS/VERTICE_mockup_01_shoeboxes_black_ivory.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Shoeboxes: soft-touch black with Champagne hot stamping; textured ivory with Obsidian print.</div>', toc="Applications")
pg("07 · APPLICATIONS", "", pic("11_MOCKUPS/VERTICE_mockup_02_shopping_bags.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Shopping bags: symbol centered below the handles, logotype beneath. Cotton rope handles in the bag color.</div>')
pg("07 · APPLICATIONS", "", pic("11_MOCKUPS/VERTICE_mockup_03_stationery_flatlay.jpg", 0, 0, W, int(W / 1.5))
   + f'<div class="abs" style="left:80px;top:{int(W / 1.5) + 18}px;font-size:16px;color:{OB}">Stationery, authenticity card, hang tag and stickers.</div>')
pg("07 · APPLICATIONS", "", pic("11_MOCKUPS/VERTICE_mockup_04_unboxing.jpg", 0, 0, 830, H, "50% 40%")
   + pic("09_INSTAGRAM/STORIES/VERTICE_IG_01_brand_introduction_stories_1080x1920.jpg", 900, 150, 400, 711, extra="border-radius:18px")
   + pic("09_INSTAGRAM/STORIES/VERTICE_IG_06_collection_limited_stories_1080x1920.jpg", 1320, 150, 400, 711, extra="border-radius:18px")
   + f'<div class="abs" style="left:30px;bottom:30px;background:{IV};padding:6px 12px">{lab("UNBOXING · TISSUE · THANK-YOU CARD", 10, OB)}</div>'
   + f'<div class="abs" style="left:900px;top:900px">{lab("DIGITAL · INSTAGRAM STORIES", 10, OB)}</div>')
# direção fotográfica
pg("08 · PHOTOGRAPHY", "", pic("10_PHOTOGRAPHIC_DIRECTION/VERTICE_photo_direction_01_principles.jpg", 0, 0, W, int(W / 1.5)), toc="Photographic direction")
pg("08 · PHOTOGRAPHY", "", pic("10_PHOTOGRAPHIC_DIRECTION/VERTICE_photo_direction_02_dos_and_donts.jpg", 0, 0, W, int(W / 1.5)))
pg("08 · PHOTOGRAPHY", "", pic("10_PHOTOGRAPHIC_DIRECTION/VERTICE_photo_direction_03_technical_brief.jpg", 0, 0, W, int(W / 1.5)))
# encerramento
PAGES.append(f'<div class="abs" style="inset:0;background:{OB}"></div>{pattern_div("#1F1F1F", 44)}'
             f'<div class="abs grain" style="left:400px;top:250px;width:954px;height:740px;background:{OB}"></div>'
             f'<div class="abs" style="left:0;right:0;top:380px;display:flex;justify-content:center">{sym(CH, 170)}</div>'
             f'<div class="abs" style="left:0;right:0;top:620px;display:flex;justify-content:center">{word(IV, 70)}</div>'
             f'<div class="abs" style="left:0;right:0;top:780px;text-align:center">{lab("BEYOND THE ORDINARY.", 14, IV, .5)}</div>'
             f'<div class="abs" style="left:0;right:0;bottom:90px;text-align:center;font-size:14px;color:{CO}">{C.NOTE}</div>')

# sumário
toc = "".join(f'<div style="display:flex;justify-content:space-between;border-top:1px solid {OB}25;padding:16px 0"><span class="serif" style="font-size:34px;color:{OB}">'
              f'<span class="mono" style="font-size:14px;color:{CH};margin-right:30px">{i + 1:02d}</span>{t}</span><span class="mono" style="font-size:16px;color:{OB}">{n:02d}</span></div>'
              for i, (t, n) in enumerate(TOC))
PAGES[1] = (f'<div class="abs grain" style="inset:0;background:{IV}"></div>'
            f'<div class="abs serif" style="left:76px;top:130px;font-size:72px;color:{OB}">Contents</div>'
            f'<div class="abs" style="left:700px;top:140px;width:960px">{toc}</div>'
            f'<div class="abs" style="left:80px;bottom:80px">{sym(OB, 60)}</div>')

doc("manual/VERTICE_brand_guidelines", PAGES, W, H, OUT / "VERTICE_brand_guidelines.pdf", jpg_dir=OUT / "pages", jpg_prefix="VERTICE_guidelines_page", a4=True)
run()
print("manual ok", len(PAGES), "páginas")
