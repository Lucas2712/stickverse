#!/usr/bin/env python3
"""Acelera a narração SEM mudar o tom (método de referencias/audio.md, "Narração mais rápida").
Use só quando o usuário pedir. Nenhuma palavra é cortada: só as pausas longas encolhem.

  python3 studio/ferramentas/acelerar.py projetos/<nome> [--tempo 1.12] [--pausa .22] [--pausa-frase .34] [--palavras arq.json]

1. Lê narracao-original.* (copia narracao.* para lá se ainda não existir).
2. Encurta cada pausa entre palavras: no máximo --pausa dentro da frase e --pausa-frase depois de . ! ? : …
   (emendas com fade de 12 ms para não estalar).
3. Aplica atempo=--tempo (preserva o tom; acima de 1,2 começa a soar acelerado).
4. Grava narracao.mp3. Depois rode transcrever.py de novo: todos os tempos mudam.
Tempos das palavras: --palavras (lista [{w,s,e}] ou [[s,e,w]]) ou palavras.json do projeto, que precisa ser
da narração ORIGINAL.
"""
import argparse, glob, json, os, subprocess, sys
import numpy as np

SR = 44100


def ler(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("proj")
    ap.add_argument("--tempo", type=float, default=1.12); ap.add_argument("--pausa", type=float, default=.22)
    ap.add_argument("--pausa-frase", type=float, default=.34); ap.add_argument("--palavras")
    o = ap.parse_args()
    orig = sorted(glob.glob(os.path.join(o.proj, "narracao-original.*")))
    if not orig:
        atual = sorted(glob.glob(os.path.join(o.proj, "narracao.*")))
        if not atual: sys.exit("narração não encontrada")
        dst = os.path.join(o.proj, "narracao-original" + os.path.splitext(atual[0])[1])
        os.rename(atual[0], dst); orig = [dst]
    pal = json.load(open(o.palavras or os.path.join(o.proj, "palavras.json"), encoding="utf-8"))
    W = [(x["s"], x["e"], x["w"]) if isinstance(x, dict) else (x[0], x[1], x[2]) for x in pal]
    a = ler(orig[0]); fade = int(.012 * SR)
    pedacos, cursor, cortado = [], 0, 0.0
    for i in range(len(W) - 1):
        fim, ini = W[i][1], W[i + 1][0]
        alvo = o.pausa_frase if W[i][2].rstrip('"”').endswith((".", "!", "?", ":", "…")) else o.pausa
        gap = ini - fim
        if gap <= alvo + .02: continue
        c0 = int((fim + alvo / 2) * SR); c1 = int((ini - alvo / 2) * SR)
        seg = a[cursor:c0].copy(); seg[-fade:] *= np.linspace(1, 0, fade)
        if pedacos: seg[:fade] *= np.linspace(0, 1, fade)
        pedacos.append(seg); cursor = c1; cortado += gap - alvo
    seg = a[cursor:].copy()
    if pedacos: seg[:fade] *= np.linspace(0, 1, fade)
    pedacos.append(seg)
    b = np.concatenate(pedacos)
    tmp = os.path.join(o.proj, ".acelerar.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=b.tobytes(), check=True)
    out = os.path.join(o.proj, "narracao.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"atempo={o.tempo}", "-ar", str(SR), "-b:a", "192k", out], check=True)
    os.remove(tmp)
    d0, d1 = len(a) / SR, len(b) / SR / o.tempo
    print(f"ok {out}: {d0:.2f} s → {d1:.2f} s (pausas −{cortado:.2f} s, atempo {o.tempo}). Rode transcrever.py de novo.")


if __name__ == "__main__":
    main()
