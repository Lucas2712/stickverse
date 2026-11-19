"""10_PHOTOGRAPHIC_DIRECTION + 01_BRAND_STRATEGY."""
import shutil
import numpy as np
from PIL import Image

import brand as B
import content as C
from common import ROOT, PHOTOS, page, run, doc, photo, sym, word, lab, frame, cmark, lines_div

PD = ROOT / "10_PHOTOGRAPHIC_DIRECTION"
BS = ROOT / "01_BRAND_STRATEGY"
OB, IV, CO, CH = B.OBSIDIAN, B.IVORY, B.CONCRETE, B.CHAMPAGNE
W, H = 2400, 1600


def img(name, l, t, w, h, pos="50% 50%", extra=""):
    return f'<img class="ph" src="{photo(name)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos};{extra}">'


# ---------- imagens-mestre (JPG de alta qualidade, nomes claros)
MASTER = PD / "01_MASTER_IMAGES"
MASTER.mkdir(parents=True, exist_ok=True)
names = {
    "01_essential_hero": "ESSENTIAL_hero", "02_essential_detail": "ESSENTIAL_leather-detail", "03_urban_hero": "URBAN_hero",
    "04_urban_campaign": "URBAN_concrete-light", "05_archive_hero": "ARCHIVE_hero", "06_archive_detail": "ARCHIVE_suede-detail",
    "07_limited_hero": "LIMITED_hero-sculptural", "08_limited_gallery": "LIMITED_gallery", "09_architecture_v-light": "LOCATION_v-light",
    "10_campaign_sculpture": "CAMPAIGN_sculpture", "11_campaign_walk": "CAMPAIGN_walk", "12_materials_flatlay": "MATERIALS_flatlay",
}
for k, v in names.items():
    Image.open(PHOTOS / f"{k}.png").convert("RGB").save(MASTER / f"VERTICE_photo_{k[:2]}_{v}.jpg", quality=95, subsampling=0)

# paleta extraída das fotografias (prova de coerência cromática)
def swatches(name, n=5):
    a = np.asarray(Image.open(PHOTOS / f"{name}.png").convert("RGB").resize((120, 150))).reshape(-1, 3).astype(float)
    lum = a.mean(1)
    qs = np.quantile(lum, np.linspace(.08, .92, n))
    return ["#%02x%02x%02x" % tuple(a[np.argmin(abs(lum - q))].astype(int)) for q in qs]

# ---------- prancha 1 · princípios
principles = [("01", "Directional light", "One hard key light. Long shadows that draw lines.", "09_architecture_v-light", "60% 50%"),
              ("02", "Object as sculpture", "The sneaker alone, on stone, plinth or air.", "07_limited_hero", "50% 45%"),
              ("03", "Material close-ups", "Grain, nap, stitch. Curation starts with touch.", "06_archive_detail", "50% 50%"),
              ("04", "Architecture", "Concrete, travertine, steps. Space as a frame.", "10_campaign_sculpture", "50% 55%")]
cells = "".join(f'<div class="abs" style="left:{120 + i * 550}px;top:420px;width:510px">'
                f'<div style="position:relative;width:510px;height:640px;overflow:hidden">{img(ph, 0, 0, 510, 640, pos)}</div>'
                f'<div style="margin-top:30px">{lab(n, 12, CH)}</div><div class="serif" style="font-size:46px;color:{OB};margin-top:12px">{t}</div>'
                f'<div style="font-size:19px;line-height:1.6;color:{OB};opacity:.75;margin-top:12px">{d}</div></div>'
                for i, (n, t, d, ph, pos) in enumerate(principles))
page("photo/board_principles", f'<div class="abs grain" style="inset:0;background:{IV}"></div>'
     f'{frame(W, H, 56, OB, "VÉRTICE · ART DIRECTION", "PHOTOGRAPHY PRINCIPLES", "", "STUDIO MATTEU")}'
     f'<div class="abs serif" style="left:120px;top:170px;font-size:110px;line-height:1;color:{OB}">Light is <span class="it">the material.</span></div>{cells}',
     W, H, outs=[PD / "VERTICE_photo_direction_01_principles.jpg"])

# ---------- prancha 2 · faça / não faça
dos = "".join(f'<div style="position:relative;height:520px;overflow:hidden">{img(ph, 0, 0, 520, 520, pos)}</div>'
              for ph, pos in [("01_essential_hero", "50% 60%"), ("04_urban_campaign", "50% 50%"), ("12_materials_flatlay", "50% 50%"), ("11_campaign_walk", "50% 70%")])
donts = ["Pure-white e-commerce packshots", "Busy streets, crowds, clutter", "Coloured gels, neon, saturated grading",
         "Third-party logos used as endorsement", "Generic stock imagery", "Over-retouched plastic surfaces"]
dl = "".join(f'<div style="border-top:1px solid rgba(233,228,218,.2);padding:22px 0;display:flex;gap:30px;align-items:center">'
             f'<span style="color:{CH};font-size:26px">×</span><span style="font-size:26px;color:{IV}">{d}</span></div>' for d in donts)
page("photo/board_dos_donts", f'<div class="abs" style="left:0;top:0;width:1200px;height:{H}px;background:{IV}"></div>'
     f'<div class="abs grain" style="left:1200px;top:0;width:1200px;height:{H}px;background:{OB}"></div>'
     f'<div class="abs" style="left:120px;top:120px">{lab("DO", 14, CH)}</div>'
     f'<div class="abs serif" style="left:120px;top:170px;font-size:84px;color:{OB}">Quiet, directed, real.</div>'
     f'<div class="abs" style="left:120px;top:330px;width:1060px;display:grid;grid-template-columns:1fr 1fr;gap:20px">{dos}</div>'
     f'<div class="abs" style="left:1320px;top:120px">{lab("DON\'T", 14, CH)}</div>'
     f'<div class="abs serif" style="left:1320px;top:170px;font-size:84px;color:{IV}">Never generic.</div>'
     f'<div class="abs" style="left:1320px;top:360px;width:960px">{dl}</div>',
     W, H, outs=[PD / "VERTICE_photo_direction_02_dos_and_donts.jpg"])

# ---------- prancha 3 · ficha técnica + paleta das imagens
spec = [("Lens", "80–85 mm medium format feel · 35 mm for people"), ("Light", "Single hard key at 30–45°, negative fill, no flash look"),
        ("Shadows", "Kept deep and clean; never lifted to grey"), ("Grade", "Warm neutrals, low saturation, rich blacks, fine grain"),
        ("Sets", "Board-formed concrete, travertine, black stone, daylight slits"), ("Product", "Unbranded or third-party marks never featured as partners")]
sp = "".join(f'<div style="display:grid;grid-template-columns:220px 1fr;border-top:1px solid rgba(23,23,23,.18);padding:20px 0">{lab(a, 12, CH)}'
             f'<span style="font-size:22px;color:{OB}">{b}</span></div>' for a, b in spec)
rows = ""
for j, ph in enumerate(["01_essential_hero", "03_urban_hero", "05_archive_hero", "07_limited_hero"]):
    sw = swatches(ph)
    rows += (f'<div class="abs" style="left:1360px;top:{250 + j * 300}px;width:920px;height:260px;display:flex;gap:0">'
             f'<div style="position:relative;width:260px;height:260px;overflow:hidden">{img(ph, 0, 0, 260, 260)}</div>'
             + "".join(f'<div style="flex:1;background:{c}"></div>' for c in sw) + '</div>')
page("photo/board_specs", f'<div class="abs grain" style="inset:0;background:{IV}"></div>'
     f'{frame(W, H, 56, OB, "VÉRTICE · ART DIRECTION", "TECHNICAL BRIEF & IMAGE PALETTE", "", "STUDIO MATTEU")}'
     f'<div class="abs serif" style="left:120px;top:170px;font-size:96px;line-height:1;color:{OB}">One universe,<br><span class="it">four moods.</span></div>'
     f'<div class="abs" style="left:120px;top:520px;width:1100px">{sp}</div>{rows}'
     f'<div class="abs" style="left:1360px;top:200px">{lab("TONES SAMPLED FROM THE IMAGES", 11, CO)}</div>',
     W, H, outs=[PD / "VERTICE_photo_direction_03_technical_brief.jpg"])

# ---------- prancha 4 · moodboard em grade arquitetônica
mb = (img("09_architecture_v-light", 0, 0, 1180, 800, "60% 50%") + img("02_essential_detail", 1200, 0, 580, 800, "50% 40%")
      + img("07_limited_hero", 1800, 0, 600, 800, "50% 45%") + img("05_archive_hero", 0, 820, 580, 780, "40% 55%")
      + img("12_materials_flatlay", 600, 820, 580, 780) + img("04_urban_campaign", 1200, 820, 1200, 780, "50% 50%"))
page("photo/board_moodboard", f'<div class="abs" style="inset:0;background:{IV}"></div>{mb}', W, H, outs=[PD / "VERTICE_photo_direction_04_moodboard.jpg"])

# ---------- 01 · estratégia (PDF A4 paisagem)
SW_, SH_ = 1754, 1240
def sp_page(kicker, title, body, dark=False, n=1):
    bg, fg = (OB, IV) if dark else (IV, OB)
    return (f'<div class="abs grain" style="inset:0;background:{bg}"></div>{frame(SW_, SH_, 40, fg, "VÉRTICE · BRAND STRATEGY", f"{n:02d}", "", "STUDIO MATTEU", 10)}'
            f'<div class="abs" style="left:120px;top:150px">{lab(kicker, 12, CH)}</div>'
            f'<div class="abs serif" style="left:116px;top:200px;width:1400px;font-size:84px;line-height:1.02;color:{fg}">{title}</div>'
            f'<div class="abs" style="left:120px;top:520px;right:120px;color:{fg}">{body}</div>')
cols = lambda items: (f'<div style="display:grid;grid-template-columns:repeat({len(items)},1fr);gap:50px">' + "".join(
    f'<div style="border-top:1px solid currentColor;padding-top:22px;opacity:.95">{lab(a, 12, CH)}<div class="serif" style="font-size:52px;margin-top:16px">{b}</div>'
    f'<div style="font-size:22px;line-height:1.6;margin-top:12px;opacity:.75">{c}</div></div>' for a, b, c in items) + '</div>')
pages = [
    (f'<div class="abs" style="inset:0;background:{OB}"></div>{img("09_architecture_v-light", 0, 0, SW_, SH_, "60% 50%", "opacity:.55")}'
     f'<div class="abs" style="left:120px;top:150px">{sym(CH, 120)}</div>'
     f'<div class="abs serif" style="left:116px;bottom:240px;font-size:120px;line-height:1;color:{IV}">Brand<br><span class="it">strategy.</span></div>'
     f'<div class="abs" style="left:120px;bottom:150px">{lab("VÉRTICE · SNEAKER BOUTIQUE · STUDIO MATTEU", 13, IV)}</div>'),
    sp_page("Essence", C.ESSENCE, f'<div style="font-size:28px;line-height:1.6;max-width:1200px">{C.ESSENCE_LONG}</div>', n=2),
    sp_page("Positioning", "A gallery of choices, <span class='it'>not a stockroom.</span>",
            f'<div style="font-size:26px;line-height:1.6;max-width:1300px;margin-bottom:60px">{C.POSITIONING}</div>'
            + cols([("Mission", "Why we exist", C.MISSION), ("Vision", "Where we go", C.VISION), ("Audience", "Who we serve", C.AUDIENCE)]), True, 3),
    sp_page("Personality", "Precise, discreet, <span class='it'>cultured, intentional.</span>",
            cols([(f"0{i + 1}", a, b) for i, (a, b) in enumerate(C.PERSONALITY)])
            + '<div style="margin-top:70px;display:flex;gap:70px">' + "".join(f'<div style="font-size:24px"><b style="font-weight:500">{a}</b>, <span style="opacity:.6">{b}.</span></div>' for a, b in C.IS_NOT) + '</div>', n=4),
    sp_page("Pillars", "Four reasons <span class='it'>to choose.</span>", cols([(a, b, c) for a, b, c in C.PILLARS]), True, 5),
    sp_page("Voice", "Speak like <span class='it'>a curator.</span>",
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:70px"><div>' + "".join(f'<div style="font-size:24px;line-height:1.6;border-top:1px solid currentColor;padding:18px 0;opacity:.9">{v}</div>' for v in C.VOICE) + '</div><div>'
            + "".join(f'<div style="font-family:Inter Display;font-weight:500;font-size:40px;letter-spacing:.04em;margin-bottom:22px">{l}</div>' for l in C.LINES) + '</div></div>', n=6),
    sp_page("Collection architecture", "Four collections, <span class='it'>one angle.</span>",
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:50px">' + "".join(
                f'<div style="border-top:1px solid currentColor;padding-top:30px">{cmark(c["blades"], CH, 70)}<div class="serif" style="font-size:56px;margin-top:30px">{c["key"].title()}</div>'
                f'<div style="font-size:21px;line-height:1.6;margin-top:12px;opacity:.75">{c["desc"]}</div><div class="mono" style="margin-top:18px;font-size:16px;color:{CH}">{c["code"]} · {c["n"]}</div></div>'
                for c in C.COLLECTIONS) + '</div>', True, 7),
]
doc("strategy/VERTICE_brand_strategy", pages, SW_, SH_, BS / "VERTICE_brand_strategy.pdf", jpg_dir=BS / "pages", jpg_prefix="VERTICE_brand_strategy_page")
run()
print("direção + estratégia ok")
