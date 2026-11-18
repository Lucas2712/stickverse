"""AVELÉ · campanha: key visuals (limpos) + peças com tipografia (feed 4:5, story 9:16, cartaz)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import stage
from composicao import scene, bottle_at, FOTO, ROOT
from frasco import FR, wordmark_group

OUT = os.path.join(ROOT, "07-Campaign")
KV = os.path.join(OUT, "key-visuals")
IV, CH, BR = "#F4EFE5", "#D8C4A0", "#49372D"
SIGN = "L’élégance est une essence."

W, H = 1344, 1792
DARK = "brightness(.8) contrast(1.12) saturate(1.12)"
WARM = "brightness(.9) contrast(1.06) saturate(1.08)"
SOFT = "brightness(1.02) contrast(1.02) saturate(.95)"

# cena: placa, frascos [(nome, cx, base, h, luz, sombra, grade)], oclusão, tom do texto
SCENES = {
    "kv-01-rosee": ("10-rosee-cena.png", [("ROSÉE", 690, 1215, 700, ("left", .5, "#FFF3DE", .45), (1, .45), SOFT)], "", "dark"),
    "kv-02-eclat": ("11-eclat-cena.png", [("ÉCLAT", 650, 1395, 740, ("right", .7, "#FFC97A", .8), (-1, .6), DARK)], "", "light"),
    "kv-03-ombre": ("12-ombre-cena.png", [("OMBRE", 790, 1235, 660, ("left", .6, "#FFE0B0", .85), (1, .6), "brightness(.74) contrast(1.15) saturate(1.05)")], "", "light"),
    "kv-04-heritage": ("13-heritage-cena.png", [("HÉRITAGE", 690, 1385, 700, ("left", .65, "#FFD08A", .85), (1, .6), DARK)], "", "light"),
    "kv-05-aube": ("14-aube-cena.png", [("AUBE", 658, 1392, 500, ("left", .55, "#FFF0D6", .5), (1, .45), SOFT)],
                   "lime", "dark"),
    "kv-06-sillage": ("15-sillage-cena.png", [("SILLAGE", 1040, 1300, 640, ("left", .7, "#FFC97A", .9), (1, .65), "brightness(.76) contrast(1.15) saturate(1.1)")], "", "light"),
    "kv-07-romantica": ("03-romantica-rosas-linho.png", [("ÉCLAT", 330, 1450, 560, ("left", .45, "#FFF3DE", .4), (1, .4), SOFT), ("ROSÉE", 590, 1530, 600, ("left", .45, "#FFF3DE", .4), (1, .4), SOFT)], "", "dark"),
    "kv-00-institucional": ("01-cinematografica-pedestal.png", [("SILLAGE", 690, 1040, 700, ("left", .7, "#FFD9A0", .85), (1, .7), DARK)], "", "light"),
}


def occlusion(kind):
    if kind == "lime":   # a lima da própria foto, recolocada na frente do frasco
        src = "file://" + os.path.join(FOTO, "14-aube-cena.png")
        return (f'<img src="{src}" style="position:absolute;inset:0;width:{W}px;height:{H}px;'
                f'clip-path:ellipse(100px 92px at 862px 1376px)">')
    return ""


def build_kv(key, extra=None):
    plate, bottles, occ, tone = SCENES[key] if not extra else extra
    items = [bottle_at(n, cx, b, h, light=l, cast=c, grade=g, uid=f"{key[:5]}{i}") for i, (n, cx, b, h, l, c, g) in enumerate(bottles)]
    items.append(occlusion(occ))
    html = scene(plate, W, H, items)
    return stage.render(key, html, W, H, os.path.join(KV, key + ".png"), scale=1)


def logo_svg(cx, y, w, color, small=False):
    return (f'<svg style="position:absolute;left:0;top:0;overflow:visible" width="1" height="1">'
            f'{wordmark_group(cx, y, w, color, small=small)}</svg>')


def poster(kv_png, fw, fh, name, kind="frag", tone="light", f=None, pos="50% 50%"):
    ink = IV if tone == "light" else BR
    sub = CH if tone == "light" else BR
    shade = ("linear-gradient(to bottom,rgba(20,12,7,.45),rgba(20,12,7,0) 22%,rgba(20,12,7,0) 70%,rgba(20,12,7,.6))"
             if tone == "light" else
             "linear-gradient(to bottom,rgba(244,239,229,.55),rgba(244,239,229,0) 22%,rgba(244,239,229,0) 72%,rgba(244,239,229,.7))")
    big = fw / 1080
    s = [f'<div style="position:relative;width:{fw}px;height:{fh}px;overflow:hidden;font-family:Cormorant">',
         f'<img src="file://{kv_png}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{pos}">',
         f'<div style="position:absolute;inset:0;background:{shade}"></div>',
         logo_svg(fw / 2, 70 * big, 250 * big, ink, small=True)]
    tb = fh - 70 * big
    if kind == "frag":
        s.append(f'<div style="position:absolute;left:0;right:0;bottom:{70 * big}px;text-align:center;color:{ink}">'
                 f'<div style="font-family:InterA;font-weight:500;font-size:{13 * big}px;letter-spacing:.32em;opacity:.9">N° {f["n"]} · {f["linha"].upper()}</div>'
                 f'<div style="font-weight:500;font-size:{84 * big}px;letter-spacing:.14em;line-height:1.05;margin:{10 * big}px 0 {4 * big}px;padding-left:.14em">{f["nome"]}</div>'
                 f'<div style="font-style:italic;font-size:{30 * big}px;color:{sub}">{f["conceito"].split(".")[0]}.</div>'
                 f'<div style="font-family:InterA;font-size:{12 * big}px;letter-spacing:.3em;margin-top:{18 * big}px;opacity:.85">EAU DE PARFUM · {f["familiaFr"].upper()}</div></div>')
    else:
        s.append(f'<div style="position:absolute;left:0;right:0;bottom:{78 * big}px;text-align:center;color:{ink}">'
                 f'<div style="font-style:italic;font-weight:400;font-size:{62 * big}px;line-height:1.1">{SIGN}</div>'
                 f'<div style="font-family:InterA;font-size:{12 * big}px;letter-spacing:.32em;margin-top:{20 * big}px;opacity:.85;color:{sub}">LA COLLECTION · SIX EAUX DE PARFUM</div></div>')
    s.append("</div>")
    return "".join(s)


def build_posters(key, f=None, kind="frag", tone="light"):
    kv = os.path.join(KV, key + ".png")
    nm = key.replace("kv-", "")
    for fmt, (fw, fh, pos) in {"feed-4x5": (1080, 1350, "50% 40%"), "story-9x16": (1080, 1920, "50% 50%")}.items():
        html = poster(kv, fw, fh, nm, kind, tone, f, pos)
        stage.render(f"p-{nm}-{fmt}", html, fw, fh, os.path.join(OUT, "social", f"{nm}-{fmt}.png"), scale=1)


if __name__ == "__main__":
    only = sys.argv[1:] or list(SCENES)
    for key in only:
        build_kv(key)
        tone = SCENES[key][3]
        if key == "kv-00-institucional":
            build_posters(key, kind="inst", tone=tone)
        else:
            n = SCENES[key][1][0][0]
            build_posters(key, f=FR[n], tone=tone)
        print("ok", key)


def build_wide():
    """Cena ampla 16:9 (site e filme): três frascos sobre o mármore."""
    Wd, Hd = 2048, 1152
    items = [bottle_at("OMBRE", 1060, 905, 430, light=("left", .65, "#FFD9A0", .7), cast=(1, .5), grade=WARM, uid="w1"),
             bottle_at("SILLAGE", 1330, 925, 500, light=("left", .65, "#FFD9A0", .7), cast=(1, .55), grade=WARM, uid="w2"),
             bottle_at("ROSÉE", 1590, 915, 440, light=("left", .65, "#FFD9A0", .7), cast=(1, .5), grade=WARM, uid="w3")]
    html = scene("02-cinematografica-mesa-wide.png", Wd, Hd, items, vignette=.3)
    return stage.render("kv-wide", html, Wd, Hd, os.path.join(KV, "kv-08-colecao-wide.png"), scale=1)


def build_body_scene():
    """Linha corporal ROSÉE na bancada de travertino."""
    from embalagem import tube, pump_bottle
    f = FR["ROSÉE"]
    base = 1255
    k = 0.92
    y = base - 560 * k
    svg = (f'<svg width="{W}" height="{H}" style="position:absolute;inset:0;filter:brightness(.97) contrast(1.03)">'
           + pump_bottle(f, uid="bs1", x=330, y=y - 20 * k, k=k * 1.05, title="Lotion parfumée", vol="200 ml", tall=1.12)
           + pump_bottle(f, uid="bs2", x=560, y=y, k=k)
           + tube(f, uid="bs3", x=790, y=y + 8, k=k * .98)
           + '</svg>')
    sh = (f'<div style="position:absolute;left:300px;top:{base - 14}px;width:760px;height:40px;'
          f'background:radial-gradient(ellipse,rgba(60,40,25,.35),rgba(60,40,25,0) 70%);filter:blur(6px)"></div>')
    html = scene("30-corpo-bancada.png", W, H, [sh, svg], vignette=.2)
    return stage.render("kv-body", html, W, H, os.path.join(KV, "kv-09-linha-corporal.png"), scale=1)
