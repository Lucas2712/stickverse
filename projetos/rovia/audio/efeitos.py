#!/usr/bin/env python3
"""ROVIA · faixa de efeitos: coloca cada som de studio/sons/earshot no segundo exato do evento visual.
Uso: python3 audio/efeitos.py <saida.wav>   (lê audio/cues.json)
cues: {t, som, ganho, alinhar_fim}; alinhar_fim=true → o som TERMINA em t (subidas que levam a um corte)."""
import json, os, sys, wave
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
AQUI = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(AQUI, "..", "..", "..", "studio", "sons", "earshot")
SR, DUR = 44100, 28.5
N = int(SR * DUR)
buf = np.zeros((N, 2))
for c in json.load(open(os.path.join(AQUI, "cues.json"))):
    x, sr = sf.read(os.path.join(LIB, c["som"] + ".flac"), always_2d=True)
    if sr != SR:
        x = resample_poly(x, SR, sr, axis=0)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, 1)
    x = x / max(1e-9, np.abs(x).max())  # pico normalizado; o ganho define o nível
    t = c["t"] - (len(x) / SR if c.get("alinhar_fim") else 0)
    i = max(0, int(round(t * SR)))
    x = x[: N - i]
    buf[i:i + len(x)] += x * c["ganho"]
pk = np.abs(buf).max()
if pk > 0.98:
    buf *= 0.98 / pk
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((buf * 32767).astype(np.int16).tobytes())
print("ok", sys.argv[1], f"pico {pk:.2f}")
