"""09_INSTAGRAM · 12 publicações × 3 formatos (1080×1080, 1080×1350, 1080×1920) + composição de perfil."""
import brand as B
import content as C
from common import ROOT, page, run, photo, sym, word, word_w, lab, frame, cmark, pattern_div, lines_div

OUT = ROOT / "09_INSTAGRAM"
OB, IV, CO, CH = B.OBSIDIAN, B.IVORY, B.CONCRETE, B.CHAMPAGNE
FORMATS = {"feed-square_1080x1080": (1080, 1080), "feed-vertical_1080x1350": (1080, 1350), "stories_1080x1920": (1080, 1920)}


def img(name, l, t, w, h, pos="50% 50%"):
    return f'<img class="ph" src="{photo(name)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos}">'


def chrome(W, H, fg, n, note=""):
    """Moldura editorial + índice da publicação (o fio condutor do feed)."""
    safe = 250 if H == 1920 else 0    # área segura dos stories
    return (frame(W, H, 36, fg, "", "", "", "", 11, op=.8, line=False)
            + f'<div class="abs" style="left:64px;top:{64 + safe}px">{lab("VÉRTICE", 11, fg)}</div>'
            + f'<div class="abs" style="right:64px;top:{64 + safe}px">{lab(f"{n:02d} / 12" + (" · " + note if note else ""), 11, fg)}</div>')


def photo_post(ph, pos, title, sub, n, blades=None, dark=.55, note=""):
    def f(W, H):
        safe = 250 if H == 1920 else 0
        m = blades if blades is not None else None
        return (f'{img(ph, 0, 0, W, H, pos)}'
                f'<div class="abs" style="left:0;right:0;bottom:0;height:{int(H * .55)}px;background:linear-gradient(0deg,rgba(23,23,23,{dark}),rgba(23,23,23,0))"></div>'
                + chrome(W, H, IV, n, note)
                + (f'<div class="abs" style="left:64px;bottom:{(275 if W == H else 290) + safe}px">{cmark(m, CH if m == 0 else IV, 46)}</div>' if m is not None else "")
                + f'<div class="abs serif" style="left:60px;bottom:{130 + safe}px;font-size:{108 if W == H else 120}px;line-height:.95;color:{IV}">{title}</div>'
                + f'<div class="abs" style="left:64px;bottom:{80 + safe}px">{lab(sub, 12, IV)}</div>')
    return f


def p01(W, H):   # apresentação
    return (f'<div class="abs grain" style="inset:0;background:{OB}"></div>' + chrome(W, H, IV, 1)
            + f'<div class="abs" style="left:0;right:0;top:{H / 2 - 230}px;display:flex;justify-content:center">{sym(CH, 250)}</div>'
            + f'<div class="abs" style="left:0;right:0;top:{H / 2 + 80}px;display:flex;justify-content:center">{word(IV, 64)}</div>'
            + f'<div class="abs" style="left:0;right:0;top:{H / 2 + 230}px;text-align:center">{lab("SNEAKER BOUTIQUE · BEYOND THE ORDINARY.", 12, IV)}</div>')


def p02(W, H):   # manifesto
    lines = C.MANIFESTO
    fs = 52 if W == H else 58
    txt = "".join(f'<div style="{"color:" + CH + ";font-style:italic" if j in (1, 7) else ""}">{l}</div>' for j, l in enumerate(lines))
    return (f'<div class="abs grain" style="inset:0;background:{IV}"></div>' + chrome(W, H, OB, 2, "MANIFESTO")
            + f'<div class="abs serif" style="left:90px;right:90px;top:{H / 2 - fs * 4.6}px;font-size:{fs}px;line-height:1.12;color:{OB}">{txt}</div>')


def p07(W, H):   # detalhes e materiais
    safe = 250 if H == 1920 else 0
    ph_h = H - 360 - 2 * safe
    return (f'<div class="abs grain" style="inset:0;background:{IV}"></div>' + chrome(W, H, OB, 7, "MATERIALS")
            + img("12_materials_flatlay", 64, 130 + safe, W - 128, ph_h, "50% 50%")
            + f'<div class="abs serif" style="left:60px;bottom:{70 + safe}px;font-size:64px;color:{OB}">Leather. Suede. <span class="it">Rubber.</span></div>'
            + f'<div class="abs" style="right:64px;bottom:{90 + safe}px">{lab("DETAILS", 11, CO)}</div>')


def p09(W, H):   # frase institucional
    return (f'<div class="abs" style="inset:0;background:{OB}"></div>{lines_div(W, H, CO, 30, 1, .25)}'
            + f'<div class="abs grain" style="left:120px;right:120px;top:{H / 2 - 260}px;height:520px;background:{OB}"></div>'
            + chrome(W, H, IV, 9)
            + f'<div class="abs serif" style="left:0;right:0;top:{H / 2 - 150}px;text-align:center;font-size:104px;line-height:1;color:{IV}">A different<br><span class="it" style="color:{CH}">point of view.</span></div>')


def p10(W, H):   # curadoria
    safe = 250 if H == 1920 else 0
    return (f'<div class="abs grain" style="inset:0;background:{IV}"></div>'
            + img("02_essential_detail", W // 2, 0, W - W // 2, H, "50% 40%") + chrome(W, H, OB, 10, "CURATION")
            + f'<div class="abs serif" style="left:60px;top:{H / 2 - 160}px;width:{W // 2 - 90}px;font-size:76px;line-height:1;color:{OB}">Selected<br><span class="it">with<br>intention.</span></div>'
            + f'<div class="abs" style="left:64px;top:{H / 2 + 120}px;width:{W // 2 - 120}px;font-size:19px;line-height:1.6;color:{OB};opacity:.8">Every pair inspected, approved and numbered before it reaches the shelf.</div>'
            + f'<div class="abs mono" style="left:64px;bottom:{80 + safe}px;font-size:18px;color:{OB}">VRT·ESS·FW26·014</div>')


def p11(W, H):   # lançamento especial
    safe = 250 if H == 1920 else 0
    return (f'<div class="abs" style="inset:0;background:{OB}"></div>'
            + img("08_limited_gallery", 0, 0, W, int(H * .62), "55% 50%") + chrome(W, H, IV, 11, "LAUNCH")
            + f'<div class="abs" style="left:64px;top:{int(H * .62) + 60}px">{cmark(0, CH, 60)}</div>'
            + f'<div class="abs serif" style="left:150px;top:{int(H * .62) + 40}px;font-size:96px;line-height:1;color:{IV}">Limited</div>'
            + f'<div class="abs mono" style="left:154px;top:{int(H * .62) + 160}px;font-size:22px;color:{CH}">Nº 001 / 250 · FW26</div>'
            + f'<div class="abs" style="left:64px;bottom:{80 + safe}px">{lab("A SPECIAL RELEASE · SOON IN THE BOUTIQUE", 12, IV)}</div>')


def p12(W, H):   # encerramento
    return (f'<div class="abs" style="inset:0;background:{OB}"></div>{pattern_div("#222221", 40)}'
            + f'<div class="abs grain" style="left:150px;right:150px;top:{H / 2 - 300}px;height:600px;background:{OB}"></div>'
            + chrome(W, H, IV, 12)
            + f'<div class="abs" style="left:0;right:0;top:{H / 2 - 200}px;display:flex;justify-content:center">{sym(CH, 170)}</div>'
            + f'<div class="abs serif" style="left:0;right:0;top:{H / 2 + 20}px;text-align:center;font-size:84px;line-height:1;color:{IV}">Beyond the<br><span class="it">ordinary.</span></div>')


C0, C1, C2, C3 = C.COLLECTIONS
POSTS = [
    ("01_brand_introduction", p01),
    ("02_manifesto", p02),
    ("03_collection_essential", photo_post("01_essential_hero", "50% 60%", "Essential", "COLLECTION 01 · THE QUIET FOUNDATION", 3, 1)),
    ("04_collection_urban", photo_post("03_urban_hero", "45% 55%", "Urban", "COLLECTION 02 · CHARACTER IN THE SHADOWS", 4, 2)),
    ("05_collection_archive", photo_post("05_archive_hero", "40% 55%", "Archive", "COLLECTION 03 · MEMORY, REWORKED", 5, 3, .5)),
    ("06_collection_limited", photo_post("07_limited_hero", "50% 45%", "Limited", "COLLECTION 04 · THE HIGHEST POINT", 6, 0)),
    ("07_details_materials", p07),
    ("08_editorial_campaign", photo_post("11_campaign_walk", "50% 50%", "Culture in<br><span class='it'>every step.</span>", "CAMPAIGN FW26 · BEYOND THE ORDINARY.", 8, None, .6, "CAMPAIGN")),
    ("09_institutional_phrase", p09),
    ("10_curation_concept", p10),
    ("11_special_launch", p11),
    ("12_closing", p12),
]

for name, fn in POSTS:
    for fmt, (W, H) in FORMATS.items():
        page(f"instagram/{name}_{fmt}", fn(W, H), W, H, outs=[OUT / fmt.upper().split("_")[0].replace("-", "_") / f"VERTICE_IG_{name}_{fmt}.jpg"], bg=OB)
run()

# ---------- composição do perfil (grade 3×4 com as publicações verticais)
from common import HTML
thumbs = ""
TW = 340
TH = int(TW * 1350 / 1080)
for i, (name, _) in enumerate(POSTS):
    r, c = divmod(i, 3)
    src = (OUT / "FEED_VERTICAL" / f"VERTICE_IG_{name}_feed-vertical_1080x1350.jpg").as_uri()
    thumbs += f'<img class="ph" src="{src}" style="left:{c * (TW + 6)}px;top:{r * (TH + 6)}px;width:{TW}px;height:{TH}px">'
gw = 3 * TW + 12
gh = 4 * TH + 18
PW, PH = 2400, 2340
body = (f'<div class="abs grain" style="inset:0;background:#D9D3C8"></div>'
        f'<div class="abs" style="left:150px;top:150px;width:700px">{lab("INSTAGRAM · FEED SYSTEM", 13, CO)}'
        f'<div class="serif" style="font-size:110px;line-height:1;color:{OB};margin-top:40px">Twelve posts,<br><span class="it">one rhythm.</span></div>'
        f'<div style="font-size:22px;line-height:1.7;color:{OB};opacity:.8;margin-top:40px">The feed alternates product, typography and atmosphere. Dark and ivory tiles create a checkerboard rhythm; '
        f'every post carries the same editorial chrome: wordmark, index and corner marks.</div>'
        + "".join(f'<div style="border-top:1px solid rgba(23,23,23,.2);padding:18px 0;display:flex;justify-content:space-between;margin-top:{40 if j == 0 else 0}px">{lab(a, 12, OB)}{lab(b, 12, CO)}</div>'
                  for j, (a, b) in enumerate([("Feed", "1080 × 1350"), ("Square", "1080 × 1080"), ("Stories", "1080 × 1920"), ("Typefaces", "Instrument Serif · Inter")]))
        + '</div>'
        # perfil neutro (sem reproduzir a interface de terceiros)
        f'<div class="abs" style="left:1150px;top:150px;width:{gw + 120}px;height:{gh + 340}px;background:{IV};box-shadow:0 40px 90px rgba(0,0,0,.18)">'
        f'<div class="abs" style="left:60px;top:60px;width:150px;height:150px;border-radius:50%;background:{OB};display:flex;align-items:center;justify-content:center">{sym(CH, 70)}</div>'
        f'<div class="abs" style="left:250px;top:75px">{word(OB, 34)}</div>'
        f'<div class="abs" style="left:252px;top:140px;font-size:20px;color:{OB};line-height:1.6">Curated sneaker boutique.<br><span style="color:{CO}">Beyond the ordinary. · FW26</span></div>'
        f'<div class="abs" style="left:60px;top:260px;width:{gw}px;height:{gh}px;overflow:hidden">{thumbs}</div></div>')
page("instagram/profile_grid", body, PW, PH, outs=[OUT / "VERTICE_IG_00_profile_grid_composition.jpg"], bg=IV)
run()
print("instagram ok")
