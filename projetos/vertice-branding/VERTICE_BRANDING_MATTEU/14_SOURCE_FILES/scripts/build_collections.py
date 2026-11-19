"""05_SNEAKER_COLLECTIONS · 5 peças por coleção (apresentação, campanha, editorial, card, aplicação)."""
import brand as B
import content as C
from common import ROOT, page, run, photo, sym, word, word_w, lab, frame, cmark, pattern_div, lines_div

OUT = ROOT / "05_SNEAKER_COLLECTIONS"

TONES = {
    "ivory":     dict(bg=B.IVORY, fg=B.OBSIDIAN, mute=B.CONCRETE, acc=B.CHAMPAGNE, mark=B.OBSIDIAN),
    "obsidian":  dict(bg=B.OBSIDIAN, fg=B.IVORY, mute=B.CONCRETE, acc=B.CHAMPAGNE, mark=B.IVORY),
    "concrete":  dict(bg="#DDD6C9", fg=B.OBSIDIAN, mute="#6E6B66", acc=B.CHAMPAGNE, mark=B.OBSIDIAN),
    "champagne": dict(bg=B.OBSIDIAN, fg=B.IVORY, mute=B.CONCRETE, acc=B.CHAMPAGNE, mark=B.CHAMPAGNE),
}
POS = {"01_essential_hero": "50% 60%", "03_urban_hero": "45% 55%", "05_archive_hero": "40% 55%", "07_limited_hero": "50% 45%",
       "02_essential_detail": "50% 40%", "04_urban_campaign": "62% 50%", "06_archive_detail": "50% 50%", "08_limited_gallery": "60% 50%"}


def img(name, l, t, w, h, pos=None, extra=""):
    return f'<img class="ph" src="{photo(name)}" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-position:{pos or POS.get(name, "50% 50%")};{extra}">'


for i, col in enumerate(C.COLLECTIONS):
    T = TONES[col["tone"]]
    k, n, code = col["key"], col["n"], col["code"]
    d = OUT / f"{n}_{k}"
    pre = f"VERTICE_{n}_{k}"
    bg, fg, mu, ac, mk = T["bg"], T["fg"], T["mute"], T["acc"], T["mark"]
    title = k.title()

    # A · arte de apresentação (2400×1600)
    attrs = "".join(f'<div style="border-top:1px solid {fg}22;padding:18px 0;display:flex;justify-content:space-between">'
                    f'{lab(a, 13, fg)}{lab("0" + str(j + 1), 13, mu)}</div>' for j, a in enumerate(col["attrs"]))
    body = (f'<div class="abs grain" style="inset:0;background:{bg}"></div>'
            f'{img(col["photo"], 0, 0, 1320, 1600)}'
            f'<div class="abs" style="left:1440px;top:96px">{lab("VÉRTICE · COLLECTION " + n + " / 04", 13, mu)}</div>'
            f'<div class="abs" style="left:1440px;top:300px">{cmark(col["blades"], mk, 120)}</div>'
            f'<div class="abs serif" style="left:1430px;top:500px;font-size:220px;line-height:.9;color:{fg};letter-spacing:-.01em">{title}</div>'
            f'<div class="abs serif it" style="left:1440px;top:760px;font-size:58px;color:{ac}">{col["line"]}</div>'
            f'<div class="abs" style="left:1440px;top:880px;width:760px;font-size:24px;line-height:1.6;color:{fg};opacity:.85">{col["desc"]}</div>'
            f'<div class="abs" style="left:1440px;top:1100px;width:840px">{attrs}</div>'
            f'<div class="abs" style="left:1440px;bottom:96px">{lab(code + " · SELECTED FW26", 13, ac)}</div>'
            f'<div class="abs" style="right:120px;bottom:90px">{sym(fg, 34)}</div>')
    page(f"collections/{n}_{k}_A_presentation", body, 2400, 1600, outs=[d / f"{pre}_A_presentation.jpg"], bg=bg)

    # B · imagem de campanha (1600×2000, 4:5)
    body = (f'{img(col["photo"], 0, 0, 1600, 2000)}'
            f'<div class="abs" style="left:0;right:0;bottom:0;height:760px;background:linear-gradient(180deg,rgba(23,23,23,0),rgba(23,23,23,.62))"></div>'
            f'{frame(1600, 2000, 56, B.IVORY, "VÉRTICE", k, "", "", 13, op=.9, line=False)}'
            f'<div class="abs serif" style="left:110px;bottom:250px;font-size:150px;line-height:.95;color:{B.IVORY}">{col["line"].replace(". ", ".<br>").replace(" the", "<br>the") if False else col["line"]}</div>'
            f'<div class="abs" style="left:116px;bottom:150px">{lab("BEYOND THE ORDINARY.", 15, B.IVORY)}</div>'
            f'<div class="abs" style="right:116px;bottom:140px">{cmark(col["blades"], B.CHAMPAGNE if col["blades"] == 0 else B.IVORY, 60)}</div>')
    page(f"collections/{n}_{k}_B_campaign", body, 1600, 2000, outs=[d / f"{pre}_B_campaign.jpg"], bg=B.OBSIDIAN)

    # C · composição editorial (spread 2400×1600)
    flip = i % 2 == 1
    L, R = (1200, 0) if flip else (0, 1200)
    body = (f'<div class="abs grain" style="inset:0;background:{bg}"></div>'
            f'{img(col["photo"], R, 0, 1200, 1600)}'
            f'<div class="abs" style="left:{L + 120}px;top:120px">{lab("VÉRTICE JOURNAL · Nº " + n, 13, mu)}</div>'
            f'<div class="abs serif" style="left:{L + 900}px;top:96px;width:180px;text-align:right;font-size:150px;line-height:.8;color:{ac}">{n}</div>'
            f'<div class="abs serif" style="left:{L + 120}px;top:300px;width:960px;font-size:104px;line-height:1;color:{fg}">{title},<br><span class="it" style="color:{ac}">{col["line"].rstrip(".").lower()}.</span></div>'
            f'{img(col["detail"], L + 120, 700, 520, 650)}'
            f'<div class="abs" style="left:{L + 700}px;top:700px;width:380px;font-size:21px;line-height:1.65;color:{fg}">'
            f'<p style="margin-bottom:22px">{col["desc"]}</p><p style="opacity:.75">Every pair in this selection was chosen for how it is made and what it stands for. Shown here as an object of design: alone, in silence, in light.</p></div>'
            f'<div class="abs" style="left:{L + 700}px;top:1290px">{lab("FIG. " + n + " — " + ("MATERIAL STUDY" if i in (0, 2) else "ON LOCATION"), 12, mu)}</div>'
            f'<div class="abs" style="left:{L + 120}px;bottom:80px">{lab(code + " · FW26", 12, mu)}</div>'
            f'<div class="abs" style="left:{L + 1060}px;bottom:76px">{lab(str(14 + i * 2), 12, mu)}</div>')
    page(f"collections/{n}_{k}_C_editorial", body, 2400, 1600, outs=[d / f"{pre}_C_editorial.jpg"], bg=bg)

    # D · card de identificação (1200×1680, cartão 5:7) — arte plana para impressão
    ww = word_w(34)
    body = (f'<div class="abs grain" style="inset:0;background:{bg}"></div>'
            f'{frame(1200, 1680, 48, fg, "", "", "", "", 12)}'
            f'<div class="abs" style="left:0;right:0;top:120px;display:flex;justify-content:center">{word(fg, 34)}</div>'
            f'<div class="abs" style="left:0;right:0;top:470px;display:flex;justify-content:center">{cmark(col["blades"], mk if col["blades"] else B.CHAMPAGNE, 230)}</div>'
            f'<div class="abs serif" style="left:0;right:0;top:820px;text-align:center;font-size:140px;line-height:1;color:{fg}">{title}</div>'
            f'<div class="abs serif it" style="left:0;right:0;top:980px;text-align:center;font-size:44px;color:{ac}">{col["line"]}</div>'
            f'<div class="abs" style="left:150px;right:150px;top:1160px;display:grid;grid-template-columns:1fr 1fr;row-gap:0">'
            + "".join(f'<div style="border-top:1px solid {fg}30;padding:18px 0">{lab(a, 11, mu)}<div class="mono" style="font-size:22px;color:{fg};margin-top:8px">{b}</div></div>'
                      for a, b in [("Collection", n + " / 04"), ("Code", code), ("Season", "FW26"), ("Focus", col["attrs"][0])])
            + f'</div><div class="abs" style="left:0;right:0;bottom:110px;text-align:center">{lab("SELECTED WITH INTENTION", 12, fg)}</div>')
    page(f"collections/{n}_{k}_D_id_card", body, 1200, 1680, outs=[d / f"{pre}_D_id_card.png"], bg=bg)

    # E · aplicação do sistema gráfico (2400×1600): divisória de prateleira, etiqueta lateral de caixa e tag
    sh = "box-shadow:0 40px 70px rgba(0,0,0,.28),0 6px 14px rgba(0,0,0,.18)"
    body = (f'<div class="abs" style="inset:0;background:{"#CFC8BB" if bg != B.OBSIDIAN else "#232322"}"></div>'
            f'{lines_div(2400, 1600, fg if bg != B.OBSIDIAN else B.CONCRETE, 34, 1, .12)}'
            # divisória de prateleira (vertical)
            f'<div class="abs grain" style="left:180px;top:170px;width:620px;height:1260px;background:{bg};{sh};overflow:hidden">'
            f'{frame(620, 1260, 30, fg, "", "", "", "", 10)}'
            f'<div class="abs" style="left:70px;top:90px">{lab("COLLECTION " + n, 12, mu)}</div>'
            f'<div class="abs" style="left:70px;top:200px">{cmark(col["blades"], mk if col["blades"] else B.CHAMPAGNE, 150)}</div>'
            f'<div class="abs serif" style="left:62px;bottom:200px;font-size:128px;line-height:.9;color:{fg}">{title}</div>'
            f'<div class="abs" style="left:70px;bottom:110px">{lab("VÉRTICE · SHELF DIVIDER", 11, mu)}</div></div>'
            # etiqueta lateral da caixa (faixa horizontal)
            f'<div class="abs" style="left:900px;top:240px;width:1320px;height:300px;background:{B.OBSIDIAN};{sh};display:flex;align-items:center;padding:0 70px;gap:60px">'
            f'{cmark(col["blades"], B.CHAMPAGNE, 110)}'
            f'<div style="border-left:1px solid #E9E4DA33;padding-left:56px"><div class="serif" style="font-size:64px;color:{B.IVORY};line-height:1">{title}</div>'
            f'<div style="margin-top:16px">{lab("BOX END LABEL", 11, B.CONCRETE)}</div></div>'
            f'<div style="margin-left:auto;text-align:right"><div class="mono" style="font-size:30px;color:{B.IVORY}">VRT·{code}·FW26·{14 + i:03d}</div>'
            f'<div class="mono" style="font-size:22px;color:{B.CHAMPAGNE};margin-top:14px">EU 42 · {("Nº 001 / 250" if col["blades"] == 0 else "SELECTED")}</div></div></div>'
            # tag
            f'<div class="abs grain" style="left:900px;top:680px;width:420px;height:720px;background:{B.IVORY};{sh}">'
            f'<div class="abs" style="left:190px;top:40px;width:40px;height:40px;border-radius:50%;background:{"#CFC8BB" if bg != B.OBSIDIAN else "#232322"};box-shadow:inset 0 2px 4px rgba(0,0,0,.35)"></div>'
            f'<div class="abs" style="left:0;right:0;top:170px;display:flex;justify-content:center">{sym(B.OBSIDIAN, 120)}</div>'
            f'<div class="abs serif" style="left:0;right:0;top:350px;text-align:center;font-size:56px;color:{B.OBSIDIAN}">{title}</div>'
            f'<div class="abs mono" style="left:0;right:0;top:450px;text-align:center;font-size:20px;color:{B.OBSIDIAN}">VRT·{code}·FW26·{14 + i:03d}</div>'
            f'<div class="abs" style="left:0;right:0;bottom:70px;text-align:center">{lab("HANG TAG", 11, B.CONCRETE)}</div></div>'
            # recorte de foto
            f'<div class="abs" style="left:1420px;top:680px;width:800px;height:720px;{sh};overflow:hidden">{img(col["detail"], 0, 0, 800, 720)}'
            f'<div class="abs" style="left:30px;bottom:26px">{lab(k + " · ART DIRECTION", 11, B.IVORY)}</div></div>')
    page(f"collections/{n}_{k}_E_system_application", body, 2400, 1600, outs=[d / f"{pre}_E_system_application.jpg"], bg=bg)

# visão geral das quatro coleções
cells = "".join(
    f'<div class="abs" style="left:{i * 600}px;top:0;width:600px;height:1600px;overflow:hidden">{img(c["photo"], 0, 0, 600, 1600)}'
    f'<div class="abs" style="left:0;right:0;bottom:0;height:600px;background:linear-gradient(180deg,rgba(23,23,23,0),rgba(23,23,23,.75))"></div>'
    f'<div class="abs" style="left:50px;bottom:180px">{cmark(c["blades"], B.CHAMPAGNE if c["blades"] == 0 else B.IVORY, 56)}</div>'
    f'<div class="abs serif" style="left:46px;bottom:80px;font-size:76px;color:{B.IVORY};line-height:1">{c["key"].title()}</div>'
    f'<div class="abs" style="left:50px;top:60px">{lab(c["n"] + " / 04", 12, B.IVORY)}</div></div>'
    for i, c in enumerate(C.COLLECTIONS))
page("collections/00_overview", cells, 2400, 1600, outs=[OUT / "VERTICE_00_collections_overview.jpg"], bg=B.OBSIDIAN)

run()
print("coleções ok")
