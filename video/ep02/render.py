#!/usr/bin/env python3
"""Monta o Ep. 2 de ÚLTIMO SINAL (1080x1920, 30 fps) a partir das cenas em cenas/,
da narração (narracao.mp3) e da trilha/efeitos (sfx.wav, gerado por sfx.py).

Uso: python3 render.py [saida.mp4] [--preview INICIO FIM]
"""
import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
FONTES = os.path.join(AQUI, "..", "fonts")
W, H, FPS = 1080, 1920, 30
DURACAO = 90.0
ARROBA = "@conta_cena"

LIMA = (198, 244, 50)
BRANCO = (255, 255, 255)
VERMELHO = (226, 38, 48)
AZUL = (70, 150, 255)


def fonte(nome, tam):
    arq = {
        "titulo": "bebas-neue-latin-400-normal.woff",
        "regra": "anton-latin-400-normal.woff",
        "legenda": "montserrat-latin-800-normal.woff",
        "ui": "montserrat-latin-700-normal.woff",
        "mono": "jetbrains-mono-latin-700-normal.woff",
        "mono_fino": "jetbrains-mono-latin-500-normal.woff",
    }[nome]
    return ImageFont.truetype(os.path.join(FONTES, arq), tam)


F_LEGENDA = fonte("legenda", 70)
F_TAG = fonte("ui", 24)
F_HUD_DIA = fonte("ui", 26)
F_HUD_HORA = fonte("mono", 74)
F_HUD_PM = fonte("mono_fino", 26)
F_HUD_LOCAL = fonte("mono_fino", 22)
F_ARROBA = fonte("ui", 26)

# ---------------------------------------------------------------- planos
# (início, fim, imagem, zoom inicial, zoom final, foco x, foco y, efeitos)
PLANOS = [
    (0.00, 3.60, "00_tranca_ep1", 1.04, 1.10, 0.50, 0.55, {}),
    (3.60, 6.90, "01_tranca_mao", 1.00, 1.08, 0.50, 0.50, {"tremor": [6.12]}),
    (6.90, 10.80, "02_oswald_caido", 1.00, 1.10, 0.50, 0.55, {"tremor": [8.90]}),
    (10.80, 14.00, "03_kai_ajoelhado", 1.00, 1.08, 0.50, 0.50, {}),
    (14.00, 17.10, "04_chave", 1.00, 1.12, 0.50, 0.50, {}),
    (17.10, 21.00, "05_oswald_rosto", 1.00, 1.10, 0.50, 0.45, {}),
    (21.00, 24.10, "06_olhos_brancos", 1.00, 1.18, 0.50, 0.45, {"vermelho": True}),
    (24.10, 26.55, "07_banheiro", 1.00, 1.08, 0.50, 0.50, {"tremor": [24.6, 25.3, 26.0]}),
    (26.55, 29.75, "08_arranhoes", 1.00, 1.08, 0.50, 0.50, {}),
    (29.75, 33.50, "09_celular", 1.10, 1.22, 0.42, 0.45, {}),
    (33.50, 37.85, "10_rua", 1.00, 1.10, 0.50, 0.55, {}),
    (37.85, 42.20, "11_cabecas", 1.00, 1.10, 0.50, 0.55, {}),
    (42.20, 46.85, "11_cabecas", 1.10, 1.18, 0.50, 0.50, {"escuro": 0.5}),
    (46.85, 49.60, "12_escada", 1.00, 1.08, 0.50, 0.50, {}),
    (49.60, 53.95, "13_infectado", 1.00, 1.14, 0.50, 0.40, {"tremor": [50.80]}),
    (53.95, 59.85, "14_kai_respira", 1.00, 1.10, 0.50, 0.45, {}),
    (59.85, 63.25, "15_porta_fundos", 1.00, 1.08, 0.50, 0.50, {}),
    (63.25, 66.40, "16_radio", 1.00, 1.08, 0.50, 0.50, {}),
    (66.40, 71.45, "16_radio", 1.25, 1.45, 0.70, 0.53, {"tv": True}),
    (71.45, 74.40, "17_kai_radio", 1.00, 1.08, 0.50, 0.45, {}),
    (74.40, 78.90, "18_maquina", 1.00, 1.10, 0.50, 0.50, {"tremor": [75.5 + 0.35 * k for k in range(10)]}),
    (78.90, 81.20, "19_escada_porao", 1.00, 1.08, 0.50, 0.40, {"pisca": True}),
    (81.20, DURACAO, "20_kai_decide", 1.00, 1.10, 0.50, 0.50, {}),
]
CORTES_SECOS = set()
TRANSICAO = 0.22

# ---------------------------------------------------------------- falas
N, OSW, RADIO = None, "SR. OSWALD · 4A", "RÁDIO · FREQ. 147.3"
TAG_COR = {OSW: (255, 170, 60), RADIO: (130, 255, 170)}
FALAS = [
    (0.00, 1.80, 'A MAIORIA DE VOCÊS DISSE...', set(), N),
    (2.37, 3.34, 'ABRIR A PORTA.', {'ABRIR'}, N),
    (3.89, 5.56, 'VOCÊ GIRA A TRANCA.', {'TRANCA.'}, N),
    (6.12, 6.56, 'CLIQUE.', {'CLIQUE.'}, N),
    (7.11, 8.17, 'A PORTA ABRE...', set(), N),
    (8.68, 10.52, 'E O SENHOR OSWALD CAI PRA DENTRO.', {'CAI'}, N),
    (11.02, 12.25, 'VOCÊ FECHA A PORTA.', set(), N),
    (12.72, 13.73, 'ELE ESTÁ GELADO.', {'GELADO.'}, N),
    (14.18, 15.47, 'PORÃO DA LAVANDERIA...', {'PORÃO'}, OSW),
    (16.01, 16.79, 'TEM UM RÁDIO.', {'RÁDIO.'}, OSW),
    (17.24, 17.94, 'SUA MÃE...', {'MÃE...'}, OSW),
    (18.44, 19.32, 'ELA IA QUERER...', set(), OSW),
    (19.69, 20.70, 'QUE VOCÊ VIVESSE.', {'VIVESSE.'}, OSW),
    (21.19, 21.78, 'ENTÃO...', set(), N),
    (22.14, 23.97, 'OS OLHOS DELE FICAM BRANCOS.', {'BRANCOS.'}, N),
    (24.30, 26.31, 'VOCÊ EMPURRA ELE PRO BANHEIRO... E TRANCA.', {'TRANCA.'}, N),
    (26.70, 27.89, 'A NOITE INTEIRA...', set(), N),
    (28.32, 29.44, 'UNHAS NA MADEIRA.', {'UNHAS'}, N),
    (29.90, 31.21, 'SEIS E DOZE DA MANHÃ.', {'MANHÃ.'}, N),
    (31.61, 33.23, 'BATERIA: TRÊS POR CENTO.', {'TRÊS'}, N),
    (33.68, 34.33, 'LÁ EMBAIXO...', set(), N),
    (34.68, 36.57, 'ELES ESTÃO PARADOS NO MEIO DA RUA.', {'PARADOS'}, N),
    (36.91, 37.69, 'DEZENAS.', {'DEZENAS.'}, N),
    (38.03, 38.98, 'UM CACHORRO LATE.', {'LATE.'}, N),
    (39.32, 40.67, 'TODOS VIRAM A CABEÇA...', {'CABEÇA...'}, N),
    (41.01, 41.96, 'AO MESMO TEMPO.', {'TEMPO.'}, N),
    (42.34, 43.76, 'REGRA NÚMERO DOIS.', {'DOIS.'}, N),
    (44.14, 45.24, 'ELES NÃO TE VEEM...', set(), N),
    (45.58, 46.57, 'ELES TE ESCUTAM.', {'ESCUTAM.'}, N),
    (47.02, 48.21, 'A ESCADA DE INCÊNDIO.', {'INCÊNDIO.'}, N),
    (48.57, 49.44, 'QUATRO ANDARES.', {'ANDARES.'}, N),
    (49.76, 50.48, 'NO TERCEIRO...', set(), N),
    (50.75, 51.66, 'O METAL RANGE.', {'RANGE.'}, N),
    (52.02, 52.95, 'UM DELES PARA...', {'PARA...'}, N),
    (53.30, 53.79, 'E VIRA.', {'VIRA.'}, N),
    (54.14, 55.52, 'VOCÊ PRENDE A RESPIRAÇÃO.', {'RESPIRAÇÃO.'}, N),
    (55.95, 56.24, 'UM...', set(), N),
    (56.76, 57.35, 'DOIS...', set(), N),
    (57.80, 58.32, 'TRÊS.', {'TRÊS.'}, N),
    (58.73, 59.68, 'ELE VOLTA A ANDAR.', set(), N),
    (60.05, 60.71, 'LAVANDERIA.', {'LAVANDERIA.'}, N),
    (60.98, 61.91, 'PORTA DOS FUNDOS.', set(), N),
    (62.21, 63.09, 'A CHAVE GIRA.', {'GIRA.'}, N),
    (63.40, 63.92, 'NO PORÃO...', set(), N),
    (64.17, 66.24, 'UM RÁDIO VELHO, CHEIO DE FIOS.', {'FIOS.'}, N),
    (66.52, 67.76, '...PONTE HARLAN FECHADA...', {'FECHADA...'}, RADIO),
    (68.07, 69.75, 'HOSPITAL ST. AGNES ISOLADO...', {'ST.', 'AGNES'}, RADIO),
    (69.97, 71.27, 'SOBREVIVENTES NO TELHADO...', {'TELHADO...'}, RADIO),
    (71.60, 72.55, 'ST. AGNES.', set(), N),
    (72.91, 74.13, 'O HOSPITAL DA SUA MÃE.', {'MÃE.'}, N),
    (74.53, 75.18, 'LÁ EM CIMA...', set(), N),
    (75.43, 77.41, 'UMA MÁQUINA DE LAVAR LIGA SOZINHA.', {'LIGA'}, N),
    (77.76, 78.76, 'A ENERGIA VOLTOU.', {'VOLTOU.'}, N),
    (79.06, 79.65, 'PASSOS...', {'PASSOS...'}, N),
    (79.96, 80.96, 'NA ESCADA DO PORÃO.', {'PORÃO.'}, N),
    (81.33, 82.78, 'VOCÊ CORRE PRO HOSPITAL...', {'HOSPITAL...'}, N),
    (83.15, 83.87, 'OU SE ESCONDE?', {'ESCONDE?'}, N),
    (84.22, 85.03, 'COMENTA AÍ EMBAIXO.', {'COMENTA'}, N),
]

# relógio do HUD: (a partir de, hora, local)
HUD = [
    (0.0, "1", "6:31", "PM", "APTO 4B"),
    (26.55, "1", "11:48", "PM", "APTO 4B"),
    (29.75, "2", "6:12", "AM", "APTO 4B"),
    (46.85, "2", "6:19", "AM", "ESCADA"),
    (59.85, "2", "6:24", "AM", "LAVANDERIA"),
    (63.25, "2", "6:24", "AM", "PORÃO"),
    (74.40, "2", "6:26", "AM", "PORÃO"),
]
ARROBA_PILULA = [(12.7, 14.0), (36.9, 38.0), (60.0, 62.0)]
RECAP = (0.0, 3.6)
TITULO = (26.6, 29.7)
REGRA = (42.2, 46.85)
ESCOLHA = 81.33
CARTELA = 85.30


def blocos_legenda():
    """Quebra cada fala em blocos de até 3 palavras, com tempo proporcional ao tamanho."""
    saida = []
    for ini, fim, texto, destaque, quem in FALAS:
        palavras = texto.split()
        grupos, atual = [], []
        for p in palavras:
            if atual and (len(atual) == 3 or len(" ".join(atual + [p])) > 17):
                grupos.append(atual)
                atual = []
            atual.append(p)
        grupos.append(atual)
        total = sum(len(" ".join(g)) for g in grupos)
        t = ini
        for g in grupos:
            dur = (fim - ini) * len(" ".join(g)) / total
            saida.append([t, t + dur, g, destaque, quem])
            t += dur
    # cada bloco fica na tela até o próximo começar (no máximo +0,35 s)
    for a, b in zip(saida, saida[1:]):
        a[1] = min(b[0], a[1] + 0.35)
    saida[-1][1] += 0.3
    return saida


BLOCOS = blocos_legenda()

# ---------------------------------------------------------------- utilidades


def carregar_cenas():
    cenas = {}
    for p in PLANOS:
        nome = p[2]
        if nome in cenas:
            continue
        im = Image.open(os.path.join(AQUI, "cenas", nome + ".png")).convert("RGB")
        # cobre 1080x1920 com 20% de folga para o zoom
        esc = max(W / im.width, H / im.height) * 1.0
        cenas[nome] = im.resize((round(im.width * esc * 1.25), round(im.height * esc * 1.25)), Image.LANCZOS)
    return cenas


def vinheta():
    y, x = np.mgrid[0:H, 0:W]
    d = np.sqrt(((x - W / 2) / (W * 0.62)) ** 2 + ((y - H / 2) / (H * 0.58)) ** 2)
    return np.clip(1.15 - d ** 2.2 * 0.75, 0.25, 1.0)[..., None].astype(np.float32)


rng = np.random.default_rng(3)
GRAOS = [(rng.standard_normal((H // 2, W // 2)) * 4).astype(np.float32) for _ in range(6)]
VINHETA = vinheta()


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def quadro_plano(i, t, cenas):
    ini, fim, nome, z0, z1, fx, fy, fx_ = PLANOS[i]
    im = cenas[nome]
    p = (t - ini) / (fim - ini)
    z = z0 + (z1 - z0) * ease(p) if fim - ini > 0 else z0
    base = 1.25
    cw, ch = im.width * (1 / base) / z, im.height * (1 / base) / z
    cx = fx * im.width
    cy = fy * im.height
    if fx_.get("desce"):
        cy += p * im.height * 0.04
    dx = dy = 0.0
    for tt in fx_.get("tremor", []):
        if 0 <= t - tt < 0.35:
            k = (1 - (t - tt) / 0.35) * 22
            dx += math.sin(t * 97) * k
            dy += math.cos(t * 83) * k
    x0 = min(max(cx - cw / 2 + dx, 0), im.width - cw)
    y0 = min(max(cy - ch / 2 + dy, 0), im.height - ch)
    q = im.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + cw, y0 + ch))
    a = np.asarray(q, dtype=np.float32)

    if "apagao" in fx_:
        ta = fx_["apagao"]
        if t >= ta:
            frente = min(1.0, (t - ta) / 0.9) * 1.4 - 0.2
            xs = np.linspace(0, 1, W)[None, :, None]
            mascara = np.clip((frente - xs) * 6, 0, 1)
            pisca = 0.15 if int(t * 30) % 7 == 0 and t - ta < 1.2 else 0.0
            a = a * (1 - mascara * (0.8 - pisca))
    if fx_.get("pisca"):
        f = 0.8 + 0.2 * ((math.sin(t * 23) + math.sin(t * 7.3)) > -0.6)
        if int(t * 30) % 41 == 0:
            f = 0.45
        a = a * f
    if fx_.get("chiado"):
        ruido = rng.integers(0, 255, (H // 4, W // 4), dtype=np.uint8)
        ruido = np.asarray(Image.fromarray(ruido).resize((W, H), Image.NEAREST), dtype=np.float32)[..., None]
        a = a * 0.75 + ruido * 0.25 * (0.6 + 0.4 * math.sin(t * 40))
    if fx_.get("tv"):
        a = a * (0.95 + 0.05 * math.sin(t * 50))
    if "escuro" in fx_:
        a = a * fx_["escuro"]
    if fx_.get("vermelho"):
        pulso = 0.5 + 0.5 * math.sin(t * 6)
        borda = 1 - VINHETA
        a[..., 0] += borda[..., 0] * 140 * pulso
    return a


def fundo(t, cenas):
    for i, p in enumerate(PLANOS):
        if p[0] <= t < p[1] or (i == len(PLANOS) - 1 and t >= p[0]):
            a = quadro_plano(i, t, cenas)
            # corte com fusão curta para o próximo plano (exceto o corte seco da TV)
            if i + 1 < len(PLANOS) and t > p[1] - TRANSICAO and p[1] not in CORTES_SECOS:
                k = (t - (p[1] - TRANSICAO)) / TRANSICAO
                a = a * (1 - k) + quadro_plano(i + 1, p[1], cenas) * k
            return a
    return np.zeros((H, W, 3), np.float32)


# ---------------------------------------------------------------- textos


def texto_contorno(d, xy, txt, f, cor, contorno=7, sombra=True, anchor="la"):
    if sombra:
        d.text((xy[0] + 4, xy[1] + 6), txt, font=f, fill=(0, 0, 0, 150), anchor=anchor,
               stroke_width=contorno, stroke_fill=(0, 0, 0, 150))
    d.text(xy, txt, font=f, fill=cor, anchor=anchor, stroke_width=contorno, stroke_fill=(0, 0, 0, 255))


def pilula(d, centro, txt, f, borda, fundo=(10, 10, 14, 220), pad=(22, 10), largura_borda=3, cor_txt=BRANCO):
    l, t_, r, b = d.textbbox((0, 0), txt, font=f)
    w, h = r - l + pad[0] * 2, b - t_ + pad[1] * 2
    x0, y0 = centro[0] - w / 2, centro[1] - h / 2
    d.rounded_rectangle((x0, y0, x0 + w, y0 + h), radius=h / 2, fill=fundo, outline=borda, width=largura_borda)
    d.text((centro[0], centro[1]), txt, font=f, fill=cor_txt, anchor="mm")
    return h


def desenha_legenda(d, t):
    for ini, fim, palavras, destaque, quem in BLOCOS:
        if ini <= t < fim and t < CARTELA:
            y = 1255
            pop = 1 - ease((t - ini) / 0.08)
            f = F_LEGENDA if pop < 0.05 else fonte("legenda", int(70 * (1 + 0.12 * pop)))
            larguras = [d.textlength(p, font=f) for p in palavras]
            esp = d.textlength(" ", font=f)
            total = sum(larguras) + esp * (len(palavras) - 1)
            escala = min(1.0, 960 / total)
            if escala < 1:
                f = fonte("legenda", int(70 * escala))
                larguras = [d.textlength(p, font=f) for p in palavras]
                esp = d.textlength(" ", font=f)
                total = sum(larguras) + esp * (len(palavras) - 1)
            x = W / 2 - total / 2
            for p, lw in zip(palavras, larguras):
                cor = LIMA if p in destaque else BRANCO
                texto_contorno(d, (x, y), p, f, cor, contorno=7, anchor="ls")
                x += lw + esp
            if quem:
                pilula(d, (W / 2, y - 105), quem, F_TAG, TAG_COR[quem])
            return


def desenha_hud(d, t):
    if t >= CARTELA:
        return
    _, dia, hora, ampm, local = HUD[0]
    for item in HUD:
        if t >= item[0]:
            _, dia, hora, ampm, local = item
    x, y = 58, 150
    d.ellipse((x, y + 8, x + 13, y + 21), fill=VERMELHO)
    d.text((x + 22, y + 2), "DIA " + dia, font=F_HUD_DIA, fill=VERMELHO)
    d.text((x - 4, y + 32), hora, font=F_HUD_HORA, fill=BRANCO, stroke_width=2, stroke_fill=(0, 0, 0))
    hw = d.textlength(hora, font=F_HUD_HORA)
    d.text((x + hw + 6, y + 70), ampm, font=F_HUD_PM, fill=BRANCO)
    d.line((x, y + 128, x + 250, y + 128), fill=(255, 255, 255, 110), width=2)
    d.text((x, y + 138), " ".join(local), font=F_HUD_LOCAL, fill=VERMELHO)


def icone_insta(d, x, y, s, cor):
    d.rounded_rectangle((x, y, x + s, y + s), radius=s * 0.3, outline=cor, width=3)
    d.ellipse((x + s * 0.27, y + s * 0.27, x + s * 0.73, y + s * 0.73), outline=cor, width=3)
    d.ellipse((x + s * 0.72, y + s * 0.15, x + s * 0.84, y + s * 0.27), fill=cor)


def desenha_arroba(d, camada_marca, t):
    tw = d.textlength(ARROBA, font=F_ARROBA)
    x = W - 50 - tw
    icone_insta(d, x - 40, 76, 28, (255, 255, 255, 230))
    d.text((x, 74), ARROBA, font=F_ARROBA, fill=(255, 255, 255, 230))
    for a, b in ARROBA_PILULA:
        if a <= t < b:
            al = int(255 * min(1, (t - a) / 0.15, (b - t) / 0.15))
            f = fonte("ui", 30)
            w = d.textlength(ARROBA, font=f) + 90
            x0, y0 = W / 2 - w / 2, 1330
            for k, c in enumerate([(254, 218, 117), (250, 126, 30), (214, 41, 118), (150, 47, 191), (79, 91, 213)]):
                d.rounded_rectangle((x0 - 4 + k * 0, y0 - 4, x0 + w + 4, y0 + 64), radius=36,
                                    outline=c + (al,), width=4 - min(k, 3))
            d.rounded_rectangle((x0, y0, x0 + w, y0 + 60), radius=30, fill=(12, 12, 16, int(al * 0.9)))
            icone_insta(d, x0 + 24, y0 + 16, 28, (255, 255, 255, al))
            d.text((x0 + 64, y0 + 30), ARROBA, font=f, fill=(255, 255, 255, al), anchor="lm")
    camada_marca.text((0, 0), "", font=F_ARROBA)


def marca_dagua():
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    f = fonte("ui", 64)
    tile = Image.new("RGBA", (900, 120), (0, 0, 0, 0))
    ImageDraw.Draw(tile).text((10, 10), ARROBA.lstrip("@"), font=f, fill=(255, 255, 255, 26))
    tile = tile.rotate(18, expand=True)
    im.alpha_composite(tile, (int(W / 2 - tile.width / 2), int(H * 0.42)))
    return im


MARCA = marca_dagua()


def desenha_titulo(cam, t):
    a, b = TITULO
    if not a <= t < b:
        return
    al = min(1, (t - a) / 0.25, (b - t) / 0.35)
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    y = 470
    f1, f2 = fonte("titulo", 150), fonte("titulo", 96)
    texto_contorno(d, (W / 2, y), "ÚLTIMO SINAL", f1, BRANCO, contorno=4, anchor="mm")
    lw = d.textlength("ÚLTIMO SINAL", font=f1) * ease((t - a) / 0.5)
    d.line((W / 2 - lw / 2, y + 72, W / 2 + lw / 2, y + 72), fill=VERMELHO, width=6)
    texto_contorno(d, (W / 2, y + 135), "D I A   2", f2, VERMELHO, contorno=3, anchor="mm")
    camada.putalpha(camada.getchannel("A").point(lambda v: int(v * al)))
    cam.alpha_composite(camada)


def desenha_recap(cam, t):
    a, b = RECAP
    if not a <= t < b:
        return
    al = min(1, (t - a) / 0.2 + 0.4, (b - t) / 0.3)
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    d.text((W / 2, 400), "A  MAIORIA  DE  VOCÊS  DISSE", font=fonte("legenda", 34), fill=BRANCO, anchor="mm",
           stroke_width=3, stroke_fill=(0, 0, 0))
    neon = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(neon).text((W / 2, 520), "ABRIR A PORTA", font=fonte("titulo", 160), fill=(120, 220, 255, 255),
                              anchor="mm")
    camada.alpha_composite(neon.filter(ImageFilter.GaussianBlur(18)))
    camada.alpha_composite(neon.filter(ImageFilter.GaussianBlur(6)))
    camada.alpha_composite(neon)
    camada.putalpha(camada.getchannel("A").point(lambda v: int(v * al)))
    cam.alpha_composite(camada)


def desenha_regra(d, t):
    a, b = REGRA
    if not a <= t < b:
        return
    fa = fonte("legenda", 40)
    x, y = 370, 168
    w = d.textlength("REGRA #2", font=fa) + 36
    entra = ease((t - 42.34) / 0.2) if t > 42.34 else 0
    if entra:
        d.rectangle((x, y, x + w * entra, y + 62), fill=VERMELHO)
        if entra > 0.9:
            d.text((x + 18, y + 31), "REGRA #2", font=fa, fill=BRANCO, anchor="lm")
    fr = fonte("regra", 76)
    if t >= 44.14:
        texto_contorno(d, (W / 2, 335), "ELES NÃO TE VEEM...", fr, BRANCO, contorno=4, anchor="mm")
    if t >= 45.58:
        frase = "ELES TE ESCUTAM."
        f2 = fonte("regra", 70)
        while d.textlength(frase, font=f2) > 980:
            f2 = fonte("regra", f2.size - 2)
        texto_contorno(d, (W / 2, 430), frase, f2, BRANCO, contorno=4, anchor="mm")
        lw = d.textlength(frase, font=f2) * ease((t - 45.58) / 0.6)
        d.line((W / 2 - lw / 2, 482, W / 2 + lw / 2, 482), fill=VERMELHO, width=7)


def desenha_escolha(d, t):
    if not ESCOLHA <= t < CARTELA:
        return
    ft = fonte("regra", 112)
    while d.textlength("CORRER OU ESCONDER?", font=ft) > 990:
        ft = fonte("regra", ft.size - 4)
    texto_contorno(d, (W / 2, 360), "CORRER OU ESCONDER?", ft, BRANCO, contorno=5, anchor="mm")
    fb = fonte("legenda", 34)
    if t >= ESCOLHA + 0.25:
        pilula(d, (W / 2, 495), "CORRER PRO HOSPITAL", fb, VERMELHO, fundo=(40, 6, 10, 200), pad=(36, 16),
               largura_borda=4, cor_txt=(255, 120, 125))
    if t >= ESCOLHA + 0.9:
        pilula(d, (W / 2, 590), "ESCONDER NO PORÃO", fb, AZUL, fundo=(6, 18, 44, 200), pad=(36, 16),
               largura_borda=4, cor_txt=(150, 200, 255))
    if t >= ESCOLHA + 1.5 and int(t * 2.5) % 2 == 0:
        fc = fonte("ui", 26)
        d.text((W / 2, 680), "C O M E N T E   A B A I X O", font=fc, fill=BRANCO, anchor="mm")
        d.line((W / 2, 708, W / 2, 742), fill=BRANCO, width=4)
        d.polygon([(W / 2 - 12, 732), (W / 2 + 12, 732), (W / 2, 750)], fill=BRANCO)


def desenha_cartela(cam, t):
    if t < CARTELA:
        return
    al = min(1, (t - CARTELA) / 0.4)
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    texto_contorno(d, (W / 2, 740), "Ú L T I M O   S I N A L", fonte("titulo", 84), BRANCO, contorno=0,
                   sombra=False, anchor="mm")
    brilho = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(brilho).text((W / 2, 900), "DIA 2", font=fonte("titulo", 250), fill=VERMELHO + (255,),
                                anchor="mm")
    camada.alpha_composite(brilho.filter(ImageFilter.GaussianBlur(22)))
    camada.alpha_composite(brilho)
    d.text((W / 2, 1060), "6:26 AM", font=fonte("mono_fino", 40), fill=BRANCO, anchor="mm")
    pilula(d, (W / 2, 1160), "SIGA PARA O DIA 3", fonte("ui", 30), (255, 255, 255), fundo=(0, 0, 0, 0),
           pad=(34, 14), largura_borda=3)
    icone_insta(d, W / 2 - 150, 1500, 34, (255, 255, 255))
    d.text((W / 2 - 100, 1517), ARROBA, font=fonte("ui", 34), fill=BRANCO, anchor="lm")
    camada.putalpha(camada.getchannel("A").point(lambda v: int(v * al)))
    cam.alpha_composite(camada)


# ---------------------------------------------------------------- quadro


def quadro(t, cenas, n):
    a = fundo(t, cenas)
    if ESCOLHA <= t < CARTELA:
        a = a * (1 - 0.45 * ease((t - ESCOLHA) / 0.3))
    if t >= CARTELA:
        a = a * (0.55 - 0.3 * ease((t - CARTELA) / 0.6))
    a = a * VINHETA
    g = GRAOS[(n // 3) % len(GRAOS)]
    a += np.repeat(np.repeat(g, 2, 0), 2, 1)[..., None]
    if t > DURACAO - 0.7:
        a *= max(0.0, (DURACAO - t) / 0.7)
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")
    if t < CARTELA:
        im.alpha_composite(MARCA)
    camada = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    desenha_hud(d, t)
    desenha_regra(d, t)
    desenha_escolha(d, t)
    desenha_legenda(d, t)
    if t < CARTELA:
        desenha_arroba(d, d, t)
    im.alpha_composite(camada)
    desenha_recap(im, t)
    desenha_titulo(im, t)
    desenha_cartela(im, t)
    return im.convert("RGB")


def main():
    args = sys.argv[1:]
    saida = os.path.join(AQUI, "ultimo_sinal_ep02.mp4")
    ini, fim = 0.0, DURACAO
    if args and not args[0].startswith("--"):
        saida = args.pop(0)
    if args and args[0] == "--preview":
        ini, fim = float(args[1]), float(args[2])
    cenas = carregar_cenas()
    narr = os.path.join(AQUI, "narracao.mp3")
    sfx = os.path.join(AQUI, "sfx.wav")
    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-ss", str(ini), "-i", narr, "-ss", str(ini), "-i", sfx,
        "-filter_complex",
        "[2:a][1:a]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=300[duck];"
        "[1:a]volume=1.0[voz];[voz][duck]amix=inputs=2:normalize=0:duration=longest,"
        "loudnorm=I=-14:TP=-1.5:LRA=11[a]",
        "-map", "0:v", "-map", "[a]", "-t", str(fim - ini),
        "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", saida,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    total = int((fim - ini) * FPS)
    for n in range(total):
        t = ini + n / FPS
        proc.stdin.write(quadro(t, cenas, n).tobytes())
        if n % 150 == 0:
            print(f"{t:5.1f}s / {fim:.1f}s", flush=True)
    proc.stdin.close()
    proc.wait()
    print("Pronto:", saida)


if __name__ == "__main__":
    main()
