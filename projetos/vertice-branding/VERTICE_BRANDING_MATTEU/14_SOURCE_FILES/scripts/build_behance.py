"""12_BEHANCE_PRESENTATION · 17 pranchas em ordem de publicação (2400 px de largura, alturas variadas)."""
from PIL import Image

import brand as B
import content as C
from common import ROOT, page, run, photo, sym, word, word_w, lab, frame, cmark, pattern_div, lines_div

OUT = ROOT / "12_BEHANCE_PRESENTATION"
OB, IV, CO, CH = B.OBSIDIAN, B.IVORY, B.CONCRETE, B.CHAMPAGNE
W = 2400


def f(rel):
    return (ROOT / rel).as_uri()


def pic(rel, l, t, w, h, pos="50% 50%", extra=""):
    return f'<img class="ph" src="{f(rel)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos};{extra}">'


def ph(name, l, t, w, h, pos="50% 50%", extra=""):
    return f'<img class="ph" src="{photo(name)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos};{extra}">'


def head(n, title, fg, y=110, x=120):
    return (f'<div class="abs" style="left:{x}px;top:{y}px;display:flex;gap:40px;align-items:baseline">'
            f'{lab(f"{n:02d}", 13, CH)}{lab(title, 13, fg)}</div>')


SL = []   # (nome, altura, corpo, fundo)

# 01 CAPA
SL.append(("cover", 1600, ph("09_architecture_v-light", 0, 0, W, 1600, "55% 50%")
           + '<div class="abs" style="inset:0;background:rgba(23,23,23,.42)"></div>'
           + f'<div class="abs" style="left:0;right:0;top:560px;display:flex;justify-content:center">{sym(CH, 170)}</div>'
           + f'<div class="abs" style="left:0;right:0;top:800px;display:flex;justify-content:center">{word(IV, 120)}</div>'
           + f'<div class="abs" style="left:0;right:0;top:1030px;text-align:center">{lab("BEYOND THE ORDINARY.", 16, IV, .5)}</div>'
           + f'<div class="abs" style="left:120px;bottom:90px">{lab("BRAND IDENTITY & LAUNCH CAMPAIGN", 12, IV)}</div>'
           + f'<div class="abs" style="right:120px;bottom:90px">{lab("STUDIO MATTEU", 12, IV)}</div>', OB))

# 02 BRAND INTRODUCTION
SL.append(("brand-introduction", 1600, f'<div class="abs grain" style="inset:0;background:{IV}"></div>' + head(2, "BRAND INTRODUCTION", OB)
           + f'<div class="abs serif" style="left:116px;top:300px;width:1250px;font-size:150px;line-height:.95;color:{OB}">The point where<br><span class="it">everything</span><br>converges.</div>'
           + f'<div class="abs" style="left:120px;top:1000px;width:1050px;font-size:26px;line-height:1.65;color:{OB}">{C.ESSENCE_LONG}</div>'
           + f'<div class="abs" style="left:120px;bottom:110px">{lab("VÉRTICE · SNEAKER BOUTIQUE PREMIUM · CONCEPTUAL PROJECT", 12, CO)}</div>'
           + ph("02_essential_detail", 1480, 0, 920, 1600, "50% 40%"), IV))

# 03 BRAND POSITIONING
pers = "".join(f'<div style="border-top:1px solid rgba(233,228,218,.25);padding-top:24px">{lab("0" + str(i + 1), 12, CH)}'
               f'<div class="serif" style="font-size:56px;color:{IV};margin-top:16px">{a}</div><div style="font-size:21px;line-height:1.6;color:{IV};opacity:.7;margin-top:12px">{b}</div></div>'
               for i, (a, b) in enumerate(C.PERSONALITY))
mva = "".join(f'<div>{lab(a, 12, CH)}<div style="font-size:24px;line-height:1.6;color:{IV};margin-top:16px;opacity:.9">{b}</div></div>'
              for a, b in [("Mission", C.MISSION), ("Vision", C.VISION), ("Audience", C.AUDIENCE)])
SL.append(("brand-positioning", 1900, f'<div class="abs grain" style="inset:0;background:{OB}"></div>' + head(3, "BRAND POSITIONING", IV)
           + f'<div class="abs serif" style="left:116px;top:260px;width:1900px;font-size:120px;line-height:1;color:{IV}">A gallery of choices,<br><span class="it" style="color:{CH}">not a stockroom.</span></div>'
           + f'<div class="abs" style="left:120px;top:620px;width:1300px;font-size:28px;line-height:1.6;color:{IV};opacity:.85">{C.POSITIONING}</div>'
           + f'<div class="abs" style="left:120px;right:120px;top:900px;display:grid;grid-template-columns:repeat(3,1fr);gap:80px">{mva}</div>'
           + f'<div class="abs" style="left:120px;right:120px;top:1300px;display:grid;grid-template-columns:repeat(4,1fr);gap:60px">{pers}</div>'
           + f'<div class="abs" style="left:120px;bottom:110px;display:flex;gap:80px">' + "".join(f'<span style="font-size:22px;color:{IV}">{a}, <span style="opacity:.5">{b}.</span></span>' for a, b in C.IS_NOT) + '</div>', OB))

# 04 LOGO CONSTRUCTION
SL.append(("logo-construction", 3200, pic("02_LOGO_AND_IDENTITY/06_CONSTRUCTION/VERTICE_board_symbol_construction.jpg", 0, 0, W, 1600)
           + pic("02_LOGO_AND_IDENTITY/06_CONSTRUCTION/VERTICE_board_wordmark_construction.jpg", 0, 1600, W, 1600)
           + f'<div class="abs" style="left:56px;top:56px;background:{IV};padding:30px 64px">{head(4, "LOGO CONSTRUCTION", OB, 0, 0)}</div>', IV))

# 05 LOGO VARIATIONS
prev = ["horizontal_obsidian_on_ivory", "horizontal_ivory_on_obsidian", "centered_ivory-champagne_on_obsidian", "centered_obsidian_on_ivory",
        "champagne_on_ivory", "monochrome_concrete_on_ivory", "symbol_champagne_on_obsidian", "symbol_obsidian_on_ivory", "label_on_obsidian"]
caps = ["Primary · Obsidian", "Primary · Ivory & Champagne", "Centered · Reversed", "Centered · Obsidian", "Champagne", "Monochrome · Concrete",
        "Symbol · Hot stamp", "Symbol · Obsidian", "Label · Small applications"]
grid = "".join(pic(f"02_LOGO_AND_IDENTITY/00_PREVIEWS/VERTICE_preview_{p}.jpg", (i % 3) * 800, 300 + (i // 3) * 560, 796, 530)
               + f'<div class="abs" style="left:{(i % 3) * 800 + 30}px;top:{300 + (i // 3) * 560 + 486}px">{lab(caps[i], 11, IV if "on_obsidian" in p else OB)}</div>' for i, p in enumerate(prev))
SL.append(("logo-variations", 1980, f'<div class="abs grain" style="inset:0;background:{IV}"></div>' + head(5, "LOGO VARIATIONS", OB)
           + f'<div class="abs serif" style="left:116px;top:160px;font-size:84px;color:{OB}">One mark, <span class="it">many surfaces.</span></div>' + grid, IV))

# 06 SYMBOL
d, sw, sh = B.symbol_path(0, 0, 1)
SL.append(("symbol", 1600, f'<div class="abs grain" style="inset:0;background:{OB}"></div>'
           + f'<div class="abs" style="left:980px;top:-160px">{sym(CH, 1900)}</div>' + head(6, "THE SYMBOL", IV)
           + f'<div class="abs serif" style="left:116px;top:420px;font-size:130px;line-height:.95;color:{IV}">The V,<br><span class="it">the vertex.</span></div>'
           + f'<div class="abs" style="left:120px;top:780px;width:700px;font-size:24px;line-height:1.65;color:{IV};opacity:.85">A tapering wedge meets a fine blade at a single point. '
             f'The wedge carries movement and direction; the blade rises one module higher, for elevation. Both strokes share one angle: 24°.</div>'
           + f'<div class="abs" style="left:120px;bottom:120px;display:flex;gap:60px">' + "".join(lab(k, 13, CH) for k in ["MOVEMENT", "DIRECTION", "ELEVATION", "IDENTITY"]) + '</div>', OB))

# 07 COLOR PALETTE
SL.append(("color-palette", 3300, pic("04_COLOR_AND_TYPOGRAPHY/01_COLOR/VERTICE_color_palette.jpg", 0, 0, W, 1600)
           + pic("04_COLOR_AND_TYPOGRAPHY/01_COLOR/VERTICE_color_combinations.jpg", 0, 1600, W, 1700)
           + f'<div class="abs" style="left:120px;top:1700px">{head(7, "COLOR PALETTE · COMBINATIONS", OB, 0, 0)}</div>', IV))

# 08 TYPOGRAPHY
SL.append(("typography", 3020, pic("04_COLOR_AND_TYPOGRAPHY/02_TYPOGRAPHY/VERTICE_type_specimen.jpg", 0, 0, W, 1600)
           + pic("04_COLOR_AND_TYPOGRAPHY/02_TYPOGRAPHY/VERTICE_type_hierarchy.jpg", 0, 1600, W, 1420)
           + f'<div class="abs" style="left:56px;top:56px;background:{IV};padding:30px 64px">{head(8, "TYPOGRAPHY", OB, 0, 0)}</div>', IV))

# 09 GRAPHIC ELEMENTS
SL.append(("graphic-elements", 4800, pic("03_GRAPHIC_ELEMENTS/01_PATTERNS/VERTICE_board_patterns.jpg", 0, 0, W, 1600)
           + pic("03_GRAPHIC_ELEMENTS/03_LINES_AND_FRAMES/VERTICE_board_frames_and_lines.jpg", 0, 1600, W, 1600)
           + pic("03_GRAPHIC_ELEMENTS/05_NUMBERING/VERTICE_board_product_numbering.jpg", 0, 3200, W, 1600)
           + f'<div class="abs" style="left:0;top:0;background:{OB};padding:40px 64px">{head(9, "GRAPHIC ELEMENTS", IV, 0, 0)}</div>', OB))

# 10 COLLECTIONS
cols = ""
for i, c in enumerate(C.COLLECTIONS):
    rel = f"05_SNEAKER_COLLECTIONS/{c['n']}_{c['key']}/VERTICE_{c['n']}_{c['key']}"
    cols += pic(rel + "_A_presentation.jpg", (i % 2) * 1200, 3200 + (i // 2) * 800, 1196, 796)
    cols += pic(rel + "_D_id_card.png", 60 + i * 585, 4900, 540, 756)
SL.append(("collections", 5760, f'<div class="abs" style="inset:0;background:#DCD6CB"></div>'
           + pic("05_SNEAKER_COLLECTIONS/VERTICE_00_collections_overview.jpg", 0, 0, W, 1600)
           + pic("03_GRAPHIC_ELEMENTS/02_COLLECTION_IDENTIFIERS/VERTICE_board_collection_identifiers.jpg", 0, 1600, W, 1600) + cols
           + f'<div class="abs" style="left:120px;top:110px">{head(10, "COLLECTIONS · SELECTED, NOT MADE, BY VÉRTICE", IV, 0, 0)}</div>', OB))

# 11 PACKAGING
SL.append(("packaging", 4840, f'<div class="abs" style="inset:0;background:{IV}"></div>'
           + pic("11_MOCKUPS/VERTICE_mockup_01_shoeboxes_black_ivory.jpg", 0, 0, W, 1600)
           + pic("11_MOCKUPS/VERTICE_mockup_02_shopping_bags.jpg", 0, 1640, W, 1600)
           + pic("11_MOCKUPS/VERTICE_mockup_04_unboxing.jpg", 0, 3280, 1180, 1560)
           + pic("06_PACKAGING/03_TISSUE_PAPER/VERTICE_pack_03_tissue_paper_50x70.png", 1220, 3280, 1180, 1560)
           + f'<div class="abs" style="left:60px;top:60px;background:{IV};padding:30px 50px">{head(11, "PACKAGING", OB, 0, 0)}</div>', IV))

# 12 STATIONERY
SL.append(("stationery", 2700, f'<div class="abs grain" style="inset:0;background:{IV}"></div>'
           + pic("11_MOCKUPS/VERTICE_mockup_03_stationery_flatlay.jpg", 0, 0, W, 1600) + head(12, "STATIONERY", OB, 1700)
           + pic("07_STATIONERY/01_LETTERHEAD/VERTICE_stat_01_letterhead_A4.png", 120, 1800, 560, 792, extra="box-shadow:0 20px 50px rgba(0,0,0,.12)")
           + pic("07_STATIONERY/03_BUSINESS_CARD/VERTICE_stat_03_business_card_front_black.png", 760, 1800, 700, 413, extra="box-shadow:0 20px 50px rgba(0,0,0,.2)")
           + pic("07_STATIONERY/03_BUSINESS_CARD/VERTICE_stat_03_business_card_back_ivory.png", 760, 2260, 700, 413, extra="box-shadow:0 20px 50px rgba(0,0,0,.12)")
           + pic("07_STATIONERY/02_ENVELOPE/VERTICE_stat_02_envelope_DL.png", 1540, 1800, 740, 324, extra="box-shadow:0 20px 50px rgba(0,0,0,.12)")
           + pic("07_STATIONERY/04_COMPLIMENTS_CARD/VERTICE_stat_04_compliments_card.png", 1540, 2200, 740, 370, extra="box-shadow:0 20px 50px rgba(0,0,0,.12)"), IV))

# 13 ART DIRECTION
SL.append(("art-direction", 4800, pic("10_PHOTOGRAPHIC_DIRECTION/VERTICE_photo_direction_04_moodboard.jpg", 0, 0, W, 1600)
           + pic("10_PHOTOGRAPHIC_DIRECTION/VERTICE_photo_direction_01_principles.jpg", 0, 1600, W, 1600)
           + pic("10_PHOTOGRAPHIC_DIRECTION/VERTICE_photo_direction_03_technical_brief.jpg", 0, 3200, W, 1600)
           + f'<div class="abs" style="left:0;top:0;background:{IV};padding:40px 64px">{head(13, "ART DIRECTION", OB, 0, 0)}</div>', IV))

# 14 CAMPAIGN
pw, phh = 720, 1080
posters = "".join(pic(f"08_CAMPAIGN/01_POSTERS/VERTICE_campaign_poster_0{i + 1}.jpg", 120 + i * 740, 300, pw, phh, extra="box-shadow:0 30px 70px rgba(0,0,0,.35)") for i in range(3))
ads = "".join(pic(f"08_CAMPAIGN/02_PRODUCT_ADS/VERTICE_campaign_product_ad_0{i + 1}_{k}.jpg", 120 + i * 740, 3200, pw, 900) for i, k in enumerate(["ESSENTIAL", "URBAN", "LIMITED"]))
SL.append(("campaign", 4300, f'<div class="abs grain" style="inset:0;background:#26262A"></div>' + head(14, "CAMPAIGN · BEYOND THE ORDINARY.", IV)
           + f'<div class="abs serif" style="left:116px;top:160px;font-size:84px;color:{IV}">Three posters, <span class="it" style="color:{CH}">one statement.</span></div>' + posters
           + pic("08_CAMPAIGN/03_EDITORIAL/VERTICE_campaign_editorial_01_point_of_view.jpg", 0, 1500, W, 1600) + ads, OB))

# 15 SOCIAL MEDIA
st = "".join(pic(f"09_INSTAGRAM/STORIES/VERTICE_IG_{n}_stories_1080x1920.jpg", 120 + i * 360, 2440, 340, 604, extra="border-radius:22px")
             for i, n in enumerate(["01_brand_introduction", "03_collection_essential", "06_collection_limited", "08_editorial_campaign", "11_special_launch", "12_closing"]))
SL.append(("social-media", 3160, pic("09_INSTAGRAM/VERTICE_IG_00_profile_grid_composition.jpg", 0, 0, W, 2340)
           + f'<div class="abs" style="left:0;top:2340px;width:{W}px;height:820px;background:{OB}"></div>' + st
           + f'<div class="abs" style="left:120px;top:60px">{head(15, "SOCIAL MEDIA", OB, 0, 0)}</div>', IV))

# 16 BRAND APPLICATIONS
apps = "".join(pic(f"05_SNEAKER_COLLECTIONS/{c['n']}_{c['key']}/VERTICE_{c['n']}_{c['key']}_E_system_application.jpg", (i % 2) * 1200, 1640 + (i // 2) * 800, 1196, 796)
               for i, c in enumerate(C.COLLECTIONS))
SL.append(("brand-applications", 3240, f'<div class="abs" style="inset:0;background:{IV}"></div>'
           + pic("05_SNEAKER_COLLECTIONS/01_ESSENTIAL/VERTICE_01_ESSENTIAL_C_editorial.jpg", 0, 0, 1196, 800)
           + pic("05_SNEAKER_COLLECTIONS/04_LIMITED/VERTICE_04_LIMITED_C_editorial.jpg", 1204, 0, 1196, 800)
           + pic("08_CAMPAIGN/03_EDITORIAL/VERTICE_campaign_editorial_02_materials.jpg", 0, 820, 1196, 800)
           + pic("06_PACKAGING/08_AUTHENTICITY_CARD/VERTICE_mockup_authenticity_card.jpg", 1204, 820, 1196, 800, "50% 50%")
           + apps + f'<div class="abs" style="left:40px;top:40px;background:{IV};padding:26px 44px">{head(16, "BRAND APPLICATIONS", OB, 0, 0)}</div>', IV))

# 17 FINAL
SL.append(("final", 1600, f'<div class="abs" style="inset:0;background:{OB}"></div>{pattern_div("#1F1F1F", 50)}'
           + f'<div class="abs grain" style="left:600px;top:300px;width:1200px;height:1000px;background:{OB}"></div>'
           + frame(W, 1600, 300, CH, "", "", "", "", 12, op=.6)
           + f'<div class="abs" style="left:0;right:0;top:480px;display:flex;justify-content:center">{sym(CH, 220)}</div>'
           + f'<div class="abs" style="left:0;right:0;top:790px;display:flex;justify-content:center">{word(IV, 96)}</div>'
           + f'<div class="abs" style="left:0;right:0;top:1000px;text-align:center">{lab("BEYOND THE ORDINARY.", 16, IV, .5)}</div>'
           + f'<div class="abs" style="left:0;right:0;top:1140px;text-align:center">{lab("THANK YOU · STUDIO MATTEU", 11, CO)}</div>'
           + f'<div class="abs" style="left:0;right:0;bottom:120px;text-align:center;font-size:15px;color:{CO}">{C.NOTE}</div>', OB))

outs = []
for i, (name, h, body, bg) in enumerate(SL):
    o = OUT / f"VERTICE_behance_{i + 1:02d}_{name}.jpg"
    outs.append(o)
    page(f"behance/{i + 1:02d}_{name}", body, W, h, outs=[o], bg=bg)
run()

# versão PDF da apresentação (uma página por prancha)
ims = [Image.open(o).convert("RGB") for o in outs]
ims[0].save(OUT / "VERTICE_behance_presentation_full.pdf", save_all=True, append_images=ims[1:], resolution=150)
print("behance ok", len(outs))
