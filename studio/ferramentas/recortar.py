#!/usr/bin/env python3
"""Recorta ilustrações geradas sobre fundo verde chapado (#00FF00) e salva PNG com transparência.

Uso:
  python3 studio/ferramentas/recortar.py entrada.png saida.png [--caixa x0,y0,x1,y1] [--margem 24]
  python3 studio/ferramentas/recortar.py folha.png pasta/ --grade 3x2 [--nomes a,b,c,...]

--caixa  recorta só esse retângulo (pixels da entrada) antes de tirar o fundo.
--grade  divide a folha em CxL células e salva uma imagem por célula (cortada justa no conteúdo).
Sempre: tira o verde (com borda suave), remove o reflexo verde nas bordas e corta o excesso transparente.
"""
import argparse, os, sys
import numpy as np
from PIL import Image


def tirar_verde(rgb):
    im = rgb.astype(np.float32)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    verde = g - np.maximum(r, b)                 # quanto o pixel é "mais verde que o resto"
    a = np.clip(1 - (verde - 45) / 70, 0, 1)     # > 115 some, < 45 fica opaco
    # despill: limita o verde nas bordas semitransparentes e nas que ficaram opacas mas esverdeadas
    lim = np.maximum(r, b) * 1.03 + 6
    im[..., 1] = np.where(verde > 20, np.minimum(g, lim), g)
    return np.dstack([im, a * 255]).clip(0, 255).astype(np.uint8)


def sem_ilhas(rgba, fator=4, minimo=.12):
    """Apaga pedaços soltos (ex.: sobra da célula vizinha): mantém só as regiões com área
    de pelo menos `minimo` da maior. Busca feita numa versão reduzida da máscara."""
    from collections import deque
    m = rgba[::fator, ::fator, 3] > 20
    H, W = m.shape; rot = np.zeros((H, W), np.int32); areas = [0]; n = 0
    for y in range(H):
        for x in range(W):
            if m[y, x] and not rot[y, x]:
                n += 1; q = deque([(y, x)]); rot[y, x] = n; a = 0
                while q:
                    cy, cx = q.popleft(); a += 1
                    for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                        if 0 <= ny < H and 0 <= nx < W and m[ny, nx] and not rot[ny, nx]:
                            rot[ny, nx] = n; q.append((ny, nx))
                areas.append(a)
    if n == 0: return rgba
    maior = max(areas); manter = np.array([a >= maior * minimo for a in areas]); manter[0] = False
    keep = manter[rot]
    for _ in range(2):  # dilata 2 células para não comer a borda suave
        k = keep.copy(); k[1:] |= keep[:-1]; k[:-1] |= keep[1:]; k[:, 1:] |= keep[:, :-1]; k[:, :-1] |= keep[:, 1:]; keep = k
    keep = np.kron(keep, np.ones((fator, fator), bool))[:rgba.shape[0], :rgba.shape[1]]
    out = rgba.copy(); out[..., 3] = np.where(keep, out[..., 3], 0); return out


def justo(rgba, margem):
    rgba = sem_ilhas(rgba)
    a = rgba[..., 3]
    ys, xs = np.where(a > 20)
    if not len(xs): return rgba
    y0, y1 = max(ys.min() - margem, 0), min(ys.max() + margem + 1, rgba.shape[0])
    x0, x1 = max(xs.min() - margem, 0), min(xs.max() + margem + 1, rgba.shape[1])
    return rgba[y0:y1, x0:x1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada"); ap.add_argument("saida")
    ap.add_argument("--caixa"); ap.add_argument("--grade"); ap.add_argument("--nomes")
    ap.add_argument("--margem", type=int, default=16)
    o = ap.parse_args()
    rgb = np.asarray(Image.open(o.entrada).convert("RGB"))
    if o.caixa:
        x0, y0, x1, y1 = map(int, o.caixa.split(","))
        rgb = rgb[y0:y1, x0:x1]
    if not o.grade:
        Image.fromarray(justo(tirar_verde(rgb), o.margem), "RGBA").save(o.saida)
        print("ok", o.saida); return
    C, L = map(int, o.grade.lower().split("x"))
    H, W = rgb.shape[:2]
    nomes = o.nomes.split(",") if o.nomes else [f"{i + 1:02d}" for i in range(C * L)]
    os.makedirs(o.saida, exist_ok=True)
    for i in range(C * L):
        if i >= len(nomes) or not nomes[i]: continue
        c, l = i % C, i // C
        cel = rgb[l * H // L:(l + 1) * H // L, c * W // C:(c + 1) * W // C]
        p = os.path.join(o.saida, nomes[i] + ".png")
        Image.fromarray(justo(tirar_verde(cel), o.margem), "RGBA").save(p)
        print("ok", p)


if __name__ == "__main__":
    sys.exit(main())
