"""08_CAMPAIGN · BEYOND THE ORDINARY. — 3 cartazes, 3 anúncios, 2 editoriais, 1 lançamento, 1 encerramento."""
import brand as B
import content as C
from common import ROOT, page, run, photo, sym, word, word_w, lab, frame, cmark, pattern_div, lines_div

OUT = ROOT / "08_CAMPAIGN"
OB, IV, CO, CH = B.OBSIDIAN, B.IVORY, B.CONCRETE, B.CHAMPAGNE


def img(name, l, t, w, h, pos="50% 50%", extra=""):
    return f'<img class="ph" src="{photo(name)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos};{extra}">'


def shade(h, frm="bottom", strength=.6):
    return (f'<div class="abs" style="left:0;right:0;{frm}:0;height:{h}px;'
            f'background:linear-gradient({"0deg" if frm == "bottom" else "180deg"},rgba(23,23,23,{strength}),rgba(23,23,23,0))"></div>')


PW, PH = 1400, 2100   # cartaz 2:3

# ---------- 3 cartazes institucionais
posters = [
    ("01", "09_architecture_v-light", "62% 50%", "BEYOND<br>THE ORDINARY.", "The point where everything converges."),
    ("02", "10_campaign_sculpture", "50% 50%", "SELECTED<br>WITH INTENTION.", "Four collections. One point of view."),
    ("03", "11_campaign_walk", "50% 50%", "CULTURE<br>IN EVERY STEP.", "A sneaker is never just a product."),
]
for n, ph, pos, head, sub in posters:
    body = (f'{img(ph, 0, 0, PW, PH, pos)}{shade(900, "bottom", .7)}{shade(380, "top", .35)}'
            f'<div class="abs" style="left:90px;top:90px">{word(IV, 34)}</div>'
            f'<div class="abs" style="right:90px;top:96px">{lab("CAMPAIGN FW26 · " + n + "/03", 12, IV)}</div>'
            f'<div class="abs" style="left:84px;bottom:250px;font-family:Inter Display;font-weight:500;font-size:118px;line-height:.98;letter-spacing:.01em;color:{IV}">{head}</div>'
            f'<div class="abs serif it" style="left:90px;bottom:160px;font-size:44px;color:{IV};opacity:.9">{sub}</div>'
            f'<div class="abs" style="right:90px;bottom:160px">{sym(CH, 70)}</div>'
            f'<div class="abs" style="left:90px;right:90px;bottom:110px;border-top:1px solid rgba(233,228,218,.3)"></div>'
            f'<div class="abs" style="left:90px;bottom:70px">{lab("VÉRTICE · SNEAKER BOUTIQUE", 11, IV)}</div>'
            f'<div class="abs" style="right:90px;bottom:70px">{lab("BEYOND THE ORDINARY.", 11, IV)}</div>')
    page(f"campaign/poster_{n}", body, PW, PH, outs=[OUT / "01_POSTERS" / f"VERTICE_campaign_poster_{n}.jpg"], bg=OB)

# ---------- 3 anúncios de produto (4:5, 1600×2000)
AW, AH = 1600, 2000
ads = [("01", C.COLLECTIONS[0], "01_essential_hero", "50% 60%", IV, OB, "Leather, quiet and exact."),
       ("02", C.COLLECTIONS[1], "03_urban_hero", "45% 55%", OB, IV, "Built for the city's shadows."),
       ("03", C.COLLECTIONS[3], "07_limited_hero", "50% 45%", OB, IV, "Numbered. Never repeated.")]
for n, col, ph, pos, bg, fg, claim in ads:
    body = (f'<div class="abs grain" style="inset:0;background:{bg}"></div>'
            f'{img(ph, 80, 80, AW - 160, 1440, pos)}'
            f'<div class="abs" style="left:80px;top:1580px">{cmark(col["blades"], CH if col["blades"] == 0 else fg, 70)}</div>'
            f'<div class="abs serif" style="left:200px;top:1560px;font-size:96px;line-height:1;color:{fg}">{col["key"].title()}</div>'
            f'<div class="abs serif it" style="left:204px;top:1680px;font-size:42px;color:{CH}">{claim}</div>'
            f'<div class="abs" style="right:80px;top:1600px;text-align:right">{lab("SELECTED FW26", 13, fg)}'
            f'<div class="mono" style="font-size:20px;color:{fg};opacity:.7;margin-top:14px">VRT·{col["code"]}·FW26</div></div>'
            f'<div class="abs" style="left:80px;right:80px;bottom:110px;border-top:1px solid {fg}33"></div>'
            f'<div class="abs" style="left:80px;bottom:56px">{word(fg, 22)}</div>'
            f'<div class="abs" style="right:80px;bottom:62px">{lab("NOW IN THE BOUTIQUE", 11, fg)}</div>')
    page(f"campaign/ad_{n}", body, AW, AH, outs=[OUT / "02_PRODUCT_ADS" / f"VERTICE_campaign_product_ad_{n}_{col['key']}.jpg"], bg=bg)

# ---------- 2 peças editoriais (spread 2400×1600)
body = (f'{img("04_urban_campaign", 0, 0, 2400, 1600, "50% 50%")}'
        f'<div class="abs" style="left:1500px;top:0;width:900px;height:1600px;background:rgba(23,23,23,.86)"></div>'
        f'<div class="abs" style="left:1600px;top:130px">{lab("VÉRTICE JOURNAL · CAMPAIGN", 12, CO)}</div>'
        f'<div class="abs serif" style="left:1596px;top:420px;width:700px;font-size:120px;line-height:.98;color:{IV}">A different<br><span class="it" style="color:{CH}">point of view.</span></div>'
        f'<div class="abs" style="left:1600px;top:820px;width:600px;font-size:22px;line-height:1.7;color:{IV};opacity:.85">'
        f'Light falls through concrete and finds a single pair. Nothing else in the frame. This is how we look at sneakers: as objects of design that deserve silence, space and attention.</div>'
        f'<div class="abs" style="left:1600px;bottom:130px">{cmark(2, IV, 50)}</div>'
        f'<div class="abs" style="left:1700px;bottom:140px">{lab("URBAN · FW26", 12, IV)}</div>'
        f'<div class="abs" style="right:100px;bottom:130px">{lab("P. 22", 12, CO)}</div>')
page("campaign/editorial_01", body, 2400, 1600, outs=[OUT / "03_EDITORIAL" / "VERTICE_campaign_editorial_01_point_of_view.jpg"], bg=OB)

body = (f'<div class="abs grain" style="inset:0;background:{IV}"></div>'
        f'{img("12_materials_flatlay", 0, 0, 1200, 1600, "50% 50%")}'
        f'<div class="abs" style="left:1320px;top:130px">{lab("VÉRTICE JOURNAL · MATERIALS", 12, CO)}</div>'
        f'<div class="abs serif" style="left:1316px;top:300px;width:900px;font-size:110px;line-height:1;color:{OB}">Made to be<br>seen <span class="it">up close.</span></div>'
        f'{img("02_essential_detail", 1320, 700, 470, 600, "50% 40%")}'
        f'{img("06_archive_detail", 1820, 700, 470, 600, "50% 50%")}'
        f'<div class="abs" style="left:1320px;top:1330px">{lab("FIG. A — FULL-GRAIN LEATHER", 11, CO)}</div>'
        f'<div class="abs" style="left:1820px;top:1330px">{lab("FIG. B — SUEDE & GUM", 11, CO)}</div>'
        f'<div class="abs" style="left:1320px;bottom:100px;width:900px;font-size:20px;line-height:1.65;color:{OB};opacity:.8">Leather, suede, ripstop, rubber, metal. Curation starts with touch.</div>')
page("campaign/editorial_02", body, 2400, 1600, outs=[OUT / "03_EDITORIAL" / "VERTICE_campaign_editorial_02_materials.jpg"], bg=IV)

# ---------- arte de lançamento (1600×2000)
body = (f'<div class="abs" style="inset:0;background:{OB}"></div>'
        f'{img("08_limited_gallery", 0, 0, 1600, 1150, "55% 50%")}'
        f'<div class="abs grain" style="left:0;top:1150px;width:1600px;height:850px;background:{OB}"></div>'
        f'<div class="abs" style="left:100px;top:1250px">{lab("THE LAUNCH · FW26", 13, CH)}</div>'
        f'<div class="abs" style="left:94px;top:1320px">{word(IV, 120)}</div>'
        f'<div class="abs serif it" style="left:100px;top:1560px;font-size:56px;color:{IV}">A sneaker boutique beyond the ordinary.</div>'
        f'<div class="abs" style="left:100px;right:100px;top:1720px;border-top:1px solid rgba(233,228,218,.25);display:flex;justify-content:space-between;padding-top:30px">'
        + "".join(f'<div style="display:flex;gap:18px;align-items:center">{cmark(c["blades"], CH if c["blades"] == 0 else IV, 28)}{lab(c["key"], 12, IV)}</div>' for c in C.COLLECTIONS)
        + '</div>')
page("campaign/launch", body, 1600, 2000, outs=[OUT / "04_LAUNCH" / "VERTICE_campaign_launch_art.jpg"], bg=OB)

# ---------- encerramento institucional (1600×2000)
d, sw, sh = B.symbol_path(0, 0, 1)
body = (f'<div class="abs" style="inset:0;background:{OB}"></div>{pattern_div("#202020", 54)}'
        f'<div class="abs grain" style="left:200px;top:300px;right:200px;bottom:300px;background:{OB}"></div>'
        f'{frame(1600, 2000, 200, CH, "", "", "", "", 12, op=.8)}'
        f'<div class="abs" style="left:0;right:0;top:640px;display:flex;justify-content:center">{sym(CH, 300)}</div>'
        f'<div class="abs" style="left:0;right:0;top:1060px;display:flex;justify-content:center">{word(IV, 92)}</div>'
        f'<div class="abs" style="left:0;right:0;top:1290px;text-align:center">{lab("BEYOND THE ORDINARY.", 18, IV, .5)}</div>'
        f'<div class="abs" style="left:0;right:0;bottom:350px;text-align:center">{lab("SNEAKER BOUTIQUE · SELECTED WITH INTENTION", 11, CO)}</div>')
page("campaign/closing", body, 1600, 2000, outs=[OUT / "05_CLOSING" / "VERTICE_campaign_closing_institutional.jpg"], bg=OB)

run()
print("campanha ok")
