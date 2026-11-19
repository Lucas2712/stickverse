"""06_PACKAGING + 07_STATIONERY + 11_MOCKUPS.

1) Artes planas (arquivos originais para produção) renderizadas do HTML-fonte.
2) Camadas de tinta (PNG transparente) da mesma arte, aplicadas nas fotografias-base
   com mistura realista: impressão = multiplicação sobre a textura do papel;
   hot stamping champagne = metal com gradiente de luz + leve relevo.
"""
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage as nd

import brand as B
import content as C
from common import ROOT, SRC, page, run, photo, sym, word, word_w, lab, frame, cmark, pattern_div, svg_data, PHOTOS

PK = ROOT / "06_PACKAGING"
ST = ROOT / "07_STATIONERY"
MK = ROOT / "11_MOCKUPS"
INK = SRC / "ink_layers"
for p in (PK, ST, MK, INK):
    p.mkdir(parents=True, exist_ok=True)


def art(name, w, h, bg, body, folder, ink_body=None, scale=2):
    """Arte plana (com fundo) + camada de tinta (sem fundo)."""
    page(f"pack/{name}", f'<div class="abs grain" style="inset:0;background:{bg}"></div>{body}', w, h,
         outs=[folder / f"VERTICE_{name}.png"], bg=bg, scale=scale)
    page(f"pack/{name}_ink", ink_body if ink_body is not None else body, w, h,
         outs=[INK / f"{name}_ink.png"], transparent=True, scale=scale)


CH, IV, OB, CO = B.CHAMPAGNE, B.IVORY, B.OBSIDIAN, B.CONCRETE

# ------------------------------------------------------------ artes planas
# tampa de caixa (proporção das tampas fotografadas ≈ 0.705)
LW, LH = 1410, 2000
def lid(color_sym, color_txt):
    return (f'<div class="abs" style="left:0;right:0;top:640px;display:flex;justify-content:center">{sym(color_sym, 420)}</div>'
            f'<div class="abs" style="left:0;right:0;bottom:240px;display:flex;justify-content:center">{word(color_txt, 46)}</div>'
            f'<div class="abs" style="left:0;right:0;bottom:170px;text-align:center">{lab("BEYOND THE ORDINARY.", 16, color_txt, .5)}</div>')
art("pack_01_shoebox_black_lid", LW, LH, OB, lid(CH, CH), PK / "01_SHOEBOX_BLACK")
art("pack_02_shoebox_ivory_lid", LW, LH, IV, lid(OB, OB), PK / "02_SHOEBOX_IVORY")

# lateral da caixa (etiqueta de coleção) — arte plana
for nm, bg, fg in [("pack_01_shoebox_black_side", OB, CH), ("pack_02_shoebox_ivory_side", IV, OB)]:
    page(f"pack/{nm}", f'<div class="abs grain" style="inset:0;background:{bg}"></div>'
         f'<div class="abs" style="left:90px;top:0;bottom:0;display:flex;align-items:center;gap:60px">{sym(fg, 150)}{word(fg, 70)}</div>'
         f'<div class="abs mono" style="right:90px;top:150px;font-size:30px;color:{fg};text-align:right;line-height:1.8">VRT·ESS·FW26·014<br>EU 42 · SELECTED</div>', 2400, 460,
         outs=[PK / ("01_SHOEBOX_BLACK" if "black" in nm else "02_SHOEBOX_IVORY") / f"VERTICE_{nm}.png"], bg=bg)

# sacolas (frente) — proporção da face ≈ 0.88
BW, BH = 1600, 1800
bag_b = (f'<div class="abs" style="left:0;right:0;top:900px;display:flex;justify-content:center">{sym(CH, 300)}</div>'
         f'<div class="abs" style="left:0;right:0;top:1300px;display:flex;justify-content:center">{word(IV, 60)}</div>')
bag_i = (f'<div class="abs" style="left:0;right:0;top:900px;display:flex;justify-content:center">{sym(OB, 300)}</div>'
         f'<div class="abs" style="left:0;right:0;top:1300px;display:flex;justify-content:center">{word(OB, 60)}</div>')
art("pack_04_bag_black_front", BW, BH, OB, bag_b, PK / "04_BAG_BLACK")
art("pack_05_bag_ivory_front", BW, BH, IV, bag_i, PK / "05_BAG_IVORY")

# papel de seda (padrão) — arte plana 50×70 cm
art("pack_03_tissue_paper_50x70", 2000, 2800, IV, pattern_div("#C9BFAE", 64), PK / "03_TISSUE_PAPER")

# etiqueta de produto (hang tag 50×90 mm)
TW, TH = 600, 1150
tag = (f'<div class="abs" style="left:270px;top:56px;width:60px;height:60px;border-radius:50%;border:1px solid {CO}"></div>'
       f'<div class="abs" style="left:0;right:0;top:330px;display:flex;justify-content:center">{sym(OB, 170)}</div>'
       f'<div class="abs" style="left:0;right:0;top:600px;display:flex;justify-content:center">{word(OB, 30)}</div>'
       f'<div class="abs" style="left:70px;right:70px;top:760px;border-top:1px solid {OB}33;padding-top:26px">'
       f'<div class="mono" style="font-size:24px;color:{OB};text-align:center;line-height:1.9">VRT·ESS·FW26·014<br>EU 42</div></div>'
       f'<div class="abs" style="left:0;right:0;bottom:70px;text-align:center">{lab("SELECTED WITH INTENTION", 12, CO)}</div>')
art("pack_06_hang_tag_front", TW, TH, IV, tag, PK / "06_PRODUCT_TAG")
tag_back = (f'<div class="abs" style="left:270px;top:56px;width:60px;height:60px;border-radius:50%;border:1px solid {CO}"></div>'
            f'<div class="abs" style="left:0;right:0;top:420px;display:flex;justify-content:center">{cmark(1, CH, 150)}</div>'
            f'<div class="abs serif" style="left:0;right:0;top:640px;text-align:center;font-size:64px;color:{IV}">Essential</div>'
            f'<div class="abs" style="left:0;right:0;bottom:70px;text-align:center">{lab("COLLECTION 01 / 04", 12, CO)}</div>')
page("pack/pack_06_hang_tag_back", f'<div class="abs grain" style="inset:0;background:{OB}"></div>{tag_back}', TW, TH,
     outs=[PK / "06_PRODUCT_TAG" / "VERTICE_pack_06_hang_tag_back.png"], bg=OB, scale=2)

# cartão de agradecimento (A6 / 5:7)
TY_W, TY_H = 1000, 1400
ty = (f'<div class="abs" style="left:0;right:0;top:170px;display:flex;justify-content:center">{sym(OB, 90)}</div>'
      f'<div class="abs serif" style="left:100px;right:100px;top:480px;text-align:center;font-size:92px;line-height:1.02;color:{OB}">Thank you<br>for choosing<br><span class="it">with intention.</span></div>'
      f'<div class="abs" style="left:150px;right:150px;top:930px;text-align:center;font-size:22px;line-height:1.7;color:{OB};opacity:.8">This pair was selected, inspected and packed by hand. We hope it becomes part of your story.</div>'
      f'<div class="abs" style="left:0;right:0;bottom:130px;display:flex;justify-content:center">{word(OB, 26)}</div>')
art("pack_07_thank_you_card", TY_W, TY_H, IV, ty, PK / "07_THANK_YOU_CARD")

# cartão de autenticidade e curadoria (quadrado, preto, hot stamping)
AW = 1200
fields = [("Code", "VRT·LTD·FW26·001"), ("Collection", "Limited · 04"), ("Edition", "Nº 001 / 250"), ("Size", "EU 42")]
fl = "".join(f'<div style="border-top:1px solid {CH}55;padding:16px 0 18px;display:flex;justify-content:space-between">{lab(a, 13, CH)}'
             f'<span class="mono" style="font-size:22px;color:{CH}">{b}</span></div>' for a, b in fields)
auth = (f'{frame(AW, AW, 50, CH, "", "", "", "", 12, op=1)}'
        f'<div class="abs" style="left:0;right:0;top:130px;display:flex;justify-content:center">{sym(CH, 110)}</div>'
        f'<div class="abs" style="left:0;right:0;top:300px;text-align:center">{lab("CERTIFICATE OF CURATION", 16, CH, .45)}</div>'
        f'<div class="abs serif" style="left:120px;right:120px;top:360px;text-align:center;font-size:56px;line-height:1.1;color:{CH}">Inspected, selected<br><span class="it">and numbered by VÉRTICE.</span></div>'
        f'<div class="abs" style="left:190px;right:190px;top:600px">{fl}</div>'
        f'<div class="abs" style="left:190px;width:340px;top:1010px;border-top:1px solid {CH}"></div>'
        f'<div class="abs" style="left:190px;top:1026px">{lab("CURATOR", 11, CH)}</div>'
        f'<div class="abs" style="right:190px;top:1026px">{lab("DATE", 11, CH)}</div>'
        f'<div class="abs" style="right:190px;width:260px;top:1010px;border-top:1px solid {CH}"></div>')
art("pack_08_authenticity_curation_card", AW, AW, OB, auth, PK / "08_AUTHENTICITY_CARD")

# adesivos (círculo)
SW_ = 800
def sticker(bg, fg, kind):
    inner = sym(fg, 330) if kind == "sym" else ""
    if kind == "ring":
        inner = (f'<svg width="800" height="800" viewBox="0 0 800 800" style="position:absolute;left:0;top:0"><defs><path id="c" d="M400,400 m-290,0 a290,290 0 1,1 580,0 a290,290 0 1,1 -580,0"/></defs>'
                 f'<text font-family="Inter" font-weight="500" font-size="38" letter-spacing="11" fill="{fg}"><textPath href="#c">BEYOND THE ORDINARY · SELECTED WITH INTENTION ·</textPath></text></svg>'
                 f'<div class="abs" style="left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center">{sym(fg, 220)}</div>')
    return f'<div class="abs" style="inset:0;border-radius:50%;background:{bg}"></div><div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center">{inner}</div>', inner
for nm, bg, fg, kind in [("pack_09_sticker_black_champagne", OB, CH, "sym"), ("pack_09_sticker_ivory_obsidian", IV, OB, "sym"), ("pack_09_sticker_black_ring", OB, IV, "ring")]:
    full, inner = sticker(bg, fg, kind)
    page(f"pack/{nm}", full, SW_, SW_, outs=[PK / "09_STICKERS" / f"VERTICE_{nm}.png"], transparent=True, scale=2)
    page(f"pack/{nm}_ink", f'<div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center">{inner}</div>', SW_, SW_,
         outs=[INK / f"{nm}_ink.png"], transparent=True, scale=2)

# ------------------------------------------------------------ papelaria
A4W, A4H = 1240, 1754
lh = (f'<div class="abs" style="left:110px;top:110px">{sym(OB, 70)}</div>'
      f'<div class="abs" style="right:110px;top:132px">{word(OB, 26)}</div>'
      f'<div class="abs" style="left:110px;right:110px;top:250px;border-top:1px solid {OB}22"></div>'
      f'<div class="abs" style="left:110px;top:340px;width:760px;font-size:17px;line-height:1.75;color:{OB}">'
      f'<p style="margin-bottom:26px">{lab("19 NOVEMBER 2026", 11, CO)}</p>'
      f'<p class="serif" style="font-size:34px;margin-bottom:26px">Dear reader,</p>'
      f'<p style="margin-bottom:18px;opacity:.85">VÉRTICE was born from a simple conviction: a sneaker can be more than a product. It can be identity, personality and expression.</p>'
      f'<p style="margin-bottom:18px;opacity:.85">Every pair we present is selected with intention, inspected by our curators and numbered before it reaches the shelf.</p>'
      f'<p style="opacity:.85">Beyond the ordinary.</p></div>'
      f'<div class="abs" style="left:110px;bottom:100px">{lab("CURATED SNEAKER BOUTIQUE", 10, CO)}</div>'
      f'<div class="abs" style="right:110px;bottom:100px">{lab("SÃO PAULO · FW26", 10, CO)}</div>')
art("stat_01_letterhead_A4", A4W, A4H, IV, lh, ST / "01_LETTERHEAD")
EW, EH = 1600, 700
env = (f'<div class="abs" style="left:90px;top:90px">{sym(OB, 80)}</div>'
       f'<div class="abs" style="right:90px;bottom:80px">{lab("BEYOND THE ORDINARY.", 12, OB)}</div>')
art("stat_02_envelope_DL", EW, EH, IV, env, ST / "02_ENVELOPE")
CW, CHh = 1050, 620
card_f = f'<div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center">{sym(CH, 170)}</div>'
art("stat_03_business_card_front_black", CW, CHh, OB, card_f, ST / "03_BUSINESS_CARD")
card_b = (f'<div class="abs" style="left:80px;top:80px">{word(OB, 22)}</div>'
          f'<div class="abs" style="left:80px;bottom:150px"><div class="serif" style="font-size:46px;color:{OB}">Name Surname</div>'
          f'<div style="margin-top:12px">{lab("HEAD CURATOR", 11, CO)}</div></div>'
          f'<div class="abs mono" style="left:80px;bottom:70px;font-size:15px;color:{OB}">name@vertice — +55 00 0000 0000</div>'
          f'<div class="abs" style="right:80px;top:80px">{sym(OB, 54)}</div>')
art("stat_03_business_card_back_ivory", CW, CHh, IV, card_b, ST / "03_BUSINESS_CARD")
# carimbo/selo de correspondência e cartão de compliments (extra institucional)
comp = (f'<div class="abs" style="left:0;right:0;top:140px;display:flex;justify-content:center">{word(OB, 30)}</div>'
        f'<div class="abs serif it" style="left:0;right:0;top:300px;text-align:center;font-size:48px;color:{OB}">With compliments</div>'
        f'<div class="abs" style="left:0;right:0;bottom:90px;display:flex;justify-content:center">{sym(CH, 50)}</div>')
art("stat_04_compliments_card", 1400, 700, IV, comp, ST / "04_COMPLIMENTS_CARD")

run()


# ------------------------------------------------------------ composição sobre fotografia
def load(p):
    return np.asarray(Image.open(p).convert("RGB")).astype(np.float32) / 255


def ink(name, size, rotate=0):
    im = Image.open(INK / f"{name}_ink.png").convert("RGBA").resize(size, Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    return a[..., :3], a[..., 3]


def paper_detail(region):
    lum = region.mean(axis=2)
    blur = nd.gaussian_filter(lum, 6)
    return np.clip(lum / np.maximum(blur, 1e-3), .85, 1.15)[..., None]


def apply_print(base, box, name, opacity=.94):
    """Impressão (tinta) sobre papel: cor multiplicada + grão do papel preservado."""
    x0, y0, x1, y1 = box
    reg = base[y0:y1, x0:x1]
    rgb, a = ink(name, (x1 - x0, y1 - y0))
    det = paper_detail(reg)
    lumr = reg.mean(axis=2, keepdims=True)
    shade = lumr / max(np.percentile(lumr, 90), 1e-3)          # luz real da foto sobre a tinta
    inked = np.clip(rgb * shade * det, 0, 1)
    a = (a * opacity)[..., None]
    base[y0:y1, x0:x1] = reg * (1 - a) + inked * a


def apply_foil(base, box, name, light=(-0.6, -0.8)):
    """Hot stamping champagne: metal escovado com gradiente de luz e relevo sutil."""
    x0, y0, x1, y1 = box
    reg = base[y0:y1, x0:x1]
    rgb, a = ink(name, (x1 - x0, y1 - y0))
    h, w = a.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    g = (xx / w * -light[0] + yy / h * -light[1])
    g = (g - g.min()) / max(g.max() - g.min(), 1e-3)
    base_c = np.array([169, 140, 99], np.float32) / 255
    hi = np.array([222, 200, 160], np.float32) / 255
    lo = np.array([120, 96, 64], np.float32) / 255
    metal = lo + (hi - lo) * (0.35 + 0.65 * (1 - g))[..., None]
    metal = metal * 0.55 + base_c * 0.45
    # brilho escovado (ruído direcional)
    rng = np.random.default_rng(3)
    brush = nd.gaussian_filter(rng.normal(0, 1, (h, w)).astype(np.float32), (0.6, 8))
    metal = np.clip(metal * (1 + brush[..., None] * 0.05), 0, 1)
    # relevo: borda iluminada em cima-esquerda, sombra embaixo-direita
    sa = nd.gaussian_filter(a, 1.2)
    emb = np.roll(np.roll(sa, 2, 0), 2, 1) - np.roll(np.roll(sa, -2, 0), -2, 1)
    metal = np.clip(metal + emb[..., None] * 0.18, 0, 1)
    shade = reg.mean(axis=2, keepdims=True)
    shade = np.clip(shade / max(np.percentile(shade, 80), 1e-3), .7, 1.2)
    metal = metal * (0.85 + 0.15 * shade)
    A = a[..., None]
    out = reg * (1 - A) + metal * A
    # sombra de pressão no papel ao redor (debossing)
    halo = np.clip(nd.gaussian_filter(a, 2.5) - a, 0, 1)[..., None]
    out = out * (1 - halo * 0.35)
    base[y0:y1, x0:x1] = out


def save(arr, p, q=93):
    Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8)).save(p, quality=q, subsampling=0)


# 13 · caixas
img = load(PHOTOS / "13_pack_boxes_topdown.png")
apply_foil(img, (272, 162, 958, 1134), "pack_01_shoebox_black_lid")
apply_print(img, (1038, 160, 1728, 1128), "pack_02_shoebox_ivory_lid")
save(img, MK / "VERTICE_mockup_01_shoeboxes_black_ivory.jpg")
save(img[100:1200, 200:1000], PK / "01_SHOEBOX_BLACK" / "VERTICE_mockup_shoebox_black_detail.jpg")
save(img[100:1200, 970:1800], PK / "02_SHOEBOX_IVORY" / "VERTICE_mockup_shoebox_ivory_detail.jpg")

# 14 · sacolas (face frontal; arte centralizada abaixo das alças)
img = load(PHOTOS / "14_pack_bags_front.png")
apply_foil(img, (240, 300, 920, 1065), "pack_04_bag_black_front")
apply_print(img, (1075, 300, 1745, 1055), "pack_05_bag_ivory_front")
save(img, MK / "VERTICE_mockup_02_shopping_bags.jpg")
save(img[200:1250, 120:1010], PK / "04_BAG_BLACK" / "VERTICE_mockup_bag_black_detail.jpg")
save(img[200:1250, 990:1880], PK / "05_BAG_IVORY" / "VERTICE_mockup_bag_ivory_detail.jpg")

# 15 · papelaria
img = load(PHOTOS / "15_stationery_flatlay.png")
apply_print(img, (167, 123, 947, 1201), "stat_01_letterhead_A4")
apply_print(img, (1008, 152, 1838, 515), "stat_02_envelope_DL")
apply_foil(img, (1021, 560, 1312, 732), "stat_03_business_card_front_black")
apply_print(img, (1359, 562, 1650, 733), "stat_03_business_card_back_ivory")
apply_foil(img, (1021, 818, 1381, 1169), "pack_08_authenticity_curation_card")
apply_print(img, (1459, 879, 1616, 1179), "pack_06_hang_tag_front")
apply_foil(img, (1737, 788, 1865, 916), "pack_09_sticker_black_champagne")
apply_print(img, (1737, 926, 1865, 1054), "pack_09_sticker_ivory_obsidian")
apply_print(img, (1737, 1063, 1865, 1191), "pack_09_sticker_black_ring", opacity=.9)
save(img, MK / "VERTICE_mockup_03_stationery_flatlay.jpg")
save(img[80:1260, 120:1000], ST / "01_LETTERHEAD" / "VERTICE_mockup_letterhead.jpg")
save(img[500:800, 980:1700], ST / "03_BUSINESS_CARD" / "VERTICE_mockup_business_cards.jpg")
save(img[760:1230, 980:1420], PK / "08_AUTHENTICITY_CARD" / "VERTICE_mockup_authenticity_card.jpg")
save(img[740:1240, 1680:1920], PK / "09_STICKERS" / "VERTICE_mockup_stickers.jpg")
save(img[560:1230, 1400:1700], PK / "06_PRODUCT_TAG" / "VERTICE_mockup_hang_tag.jpg")

# 16 · unboxing: cartão de agradecimento em perspectiva
img = load(PHOTOS / "16_unboxing_topdown.png")
quad = [(202, 590), (433, 502), (552, 815), (326, 908)]   # TL, TR, BR, BL
cw, chh = 700, 980
art_rgba = Image.open(INK / "pack_07_thank_you_card_ink.png").convert("RGBA").resize((cw, chh), Image.LANCZOS)
# coeficientes de perspectiva (destino → origem)
def coeffs(dst, src):
    A, Bv = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        Bv += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(Bv, float)).tolist()
H_, W_ = img.shape[:2]
warp = art_rgba.transform((W_, H_), Image.PERSPECTIVE, coeffs(quad, [(0, 0), (cw, 0), (cw, chh), (0, chh)]), Image.BICUBIC)
wa = np.asarray(warp).astype(np.float32) / 255
mask = Image.new("L", (W_, H_), 0)
ImageDraw.Draw(mask).polygon(quad, fill=255)
m = (np.asarray(mask.filter(ImageFilter.GaussianBlur(1))).astype(np.float32) / 255)
a = wa[..., 3] * m * 0.92
shade = img.mean(axis=2, keepdims=True) / 0.86
img = img * (1 - a[..., None]) + np.clip(wa[..., :3] * shade, 0, 1) * a[..., None]
save(img, MK / "VERTICE_mockup_04_unboxing.jpg")
save(img[380:1100, 90:760], PK / "07_THANK_YOU_CARD" / "VERTICE_mockup_thank_you_card.jpg")

# papel de seda: o padrão é impresso sobre o papel de seda REAL da foto de unboxing,
# deslocado pelo relevo das dobras (gradiente de luminância) para acompanhar o papel.
img = load(MK / "VERTICE_mockup_04_unboxing.jpg")
Hh, Ww = img.shape[:2]
lum = img.mean(axis=2)
box_poly = [(262, 240), (938, 326), (876, 1296), (84, 1160)]
sneaker = [(600, 445), (700, 436), (805, 468), (815, 505), (792, 700), (762, 900), (745, 965), (702, 1150), (655, 1262), (540, 1268),
           (492, 1225), (486, 1000), (498, 800), (535, 640), (558, 555)]
mimg = Image.new("L", (Ww, Hh), 0)
dr = ImageDraw.Draw(mimg)
dr.polygon(box_poly, fill=255)
dr.polygon(sneaker, fill=0)
dr.line(sneaker + [sneaker[0]], fill=0, width=36)
dr.polygon([(196, 584), (439, 496), (558, 821), (320, 914)], fill=0)      # cartão
m = np.asarray(mimg.filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255
m *= np.clip((lum - 0.55) / 0.15, 0, 1)                                   # só o papel claro (exclui paredes pretas)
tile = Image.open(PK / "03_TISSUE_PAPER" / "VERTICE_pack_03_tissue_paper_50x70.png").convert("L")
tile = tile.resize((tile.width * 2 // 5, tile.height * 2 // 5), Image.LANCZOS)
t = np.asarray(tile).astype(np.float32) / 255
reps = (Hh // t.shape[0] + 2, Ww // t.shape[1] + 2)
t = np.tile(t, reps)
gl = nd.gaussian_filter(lum, 6)
gy, gx = np.gradient(gl)
yy, xx = np.mgrid[0:Hh, 0:Ww].astype(np.float32)
t = nd.map_coordinates(t, [yy + 40 + gy * 900, xx + 40 + gx * 900], order=1, mode="wrap")
bgv, mkv = 233 / 255, 201 / 255
ink_a = np.clip((bgv - t) / (bgv - mkv), 0, 1) * m                # traços do padrão
tint = np.array([0.80, 0.74, 0.64], np.float32)
img = img * (1 - ink_a[..., None] * 0.62) + img * tint * ink_a[..., None] * 0.62
save(img, MK / "VERTICE_mockup_04_unboxing.jpg")
save(img[380:1100, 90:760], PK / "07_THANK_YOU_CARD" / "VERTICE_mockup_thank_you_card.jpg")
crop = img[200:1340, 40:980]
save(crop, MK / "VERTICE_mockup_05_tissue_paper.jpg")
save(crop, PK / "03_TISSUE_PAPER" / "VERTICE_mockup_tissue_paper.jpg")
print("embalagens ok")
