"""Gera os PNGs (1080x1920, fundo transparente) do painel do Sistema.
Painel no terço superior, centralizado e dentro de 8%–78% da largura, longe da zona dos botões da PrendeFlix
(nada à direita de 80% entre 35% e 95% da altura). Azul em geral, dourado no alerta de combate."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H = 1080, 1920
F = "/usr/share/fonts/opentype/inter/"
def fonte(nome, t): return ImageFont.truetype(F + nome, t)
AZUL = ((90, 200, 255), (10, 40, 80))
OURO = ((255, 205, 90), (70, 45, 5))

def painel(linhas, saida, cor=AZUL, titulo="SISTEMA DE CONQUISTA E EVOLUÇÃO"):
    borda, fundo = cor
    x0, x1, y0 = 110, 830, 300
    alt = 120 + sum(l[1] + 22 for l in linhas)
    y1 = y0 + alt
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle((x0 - 6, y0 - 6, x1 + 6, y1 + 6), 26, outline=borda + (200,), width=10)
    base.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14)))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((x0, y0, x1, y1), 22, fill=fundo + (150,), outline=borda + (255,), width=3)
    d.line((x0 + 30, y0 + 78, x1 - 30, y0 + 78), fill=borda + (160,), width=2)
    d.text(((x0 + x1) / 2, y0 + 44), titulo, font=fonte("Inter-SemiBold.otf", 26), fill=borda + (255,), anchor="mm")
    y = y0 + 110
    for texto, tam, peso in linhas:
        d.text(((x0 + x1) / 2, y + tam / 2), texto, font=fonte(peso, tam), fill=(235, 248, 255, 255), anchor="mm")
        y += tam + 22
    base.save(saida)

if __name__ == "__main__":
    out = sys.argv[1]
    painel([("Missão aceita.", 50, "InterDisplay-SemiBold.otf"), ("RECOMPENSA", 28, "Inter-SemiBold.otf"),
            ("Manopla de Luz", 54, "InterDisplay-Bold.otf")], f"{out}/p1_aceita.png")
    painel([("DURAÇÃO", 30, "Inter-SemiBold.otf"), ("00:30", 80, "InterDisplay-Medium.otf")], f"{out}/p2_duracao.png")
    painel([("MISSÃO ATUALIZADA", 34, "Inter-Bold.otf"), ("SOBREVIVER", 66, "InterDisplay-Bold.otf")], f"{out}/p3_sobreviver.png", cor=OURO)
    print("ok")
