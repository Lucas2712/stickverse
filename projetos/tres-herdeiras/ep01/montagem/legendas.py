"""Legendas queimadas (Inter) como PNGs 1080x1920, dentro de 8%–76% da largura para não entrar na zona dos botões."""
import json, sys
from PIL import Image, ImageDraw, ImageFont
W, H = 1080, 1920
FT = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-SemiBold.otf", 46)
X0, X1, YB = 86, 820, 1560
def quebra(txt):
    d = ImageDraw.Draw(Image.new("L", (1, 1))); linhas, atual = [], ""
    for p in txt.split():
        t = (atual + " " + p).strip()
        if d.textlength(t, font=FT) <= X1 - X0: atual = t
        else: linhas.append(atual); atual = p
    return linhas + [atual]
def png(txt, saida):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    ls = quebra(txt); y = YB - len(ls) * 60
    for l in ls:
        d.text(((X0 + X1) / 2, y), l, font=FT, fill=(255, 255, 255, 255), anchor="mt", stroke_width=5, stroke_fill=(0, 0, 0, 230))
        y += 60
    im.save(saida)
if __name__ == "__main__":
    leg = json.load(open(sys.argv[1]))
    for i, l in enumerate(leg): png(l["texto"], f"{sys.argv[2]}/l{i:02d}.png")
    print(len(leg))
