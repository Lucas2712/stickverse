#!/usr/bin/env python3
"""Stems de base para a sonorização (sem efeitos): voz, música com o mesmo envelope do Remotion
(18% livre, 12% na fala, ataque 0,12 s, soltura 0,35 s, fade-in 1,5 s, fade-out 2 s) e base = voz + música.
Uso: python3 sfx/stems.py   (dentro de projetos/kavora)"""
import json, subprocess, numpy as np, soundfile as sf, os
SR = 48000
T = json.load(open('remotion/src/timing.json')); DUR = T['duration']; SPEECH = T['speech']
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
n = int(DUR * SR)
def fit(x): return np.pad(x, ((0, max(0, n - len(x))), (0, 0)))[:n]
voz = fit(load('remotion/public/narracao.mp3'))
mus = fit(load('remotion/public/trilha.wav'))
t = np.arange(n) / SR
duck = np.zeros(n)
for a, b in SPEECH:
    up = np.clip((t - (a - 0.12)) / 0.12, 0, 1)
    down = np.where(t > b, 1 - (t - b) / 0.35, 1)
    duck = np.maximum(duck, np.clip(np.minimum(up, down), 0, 1) * ((t >= a - 0.12) & (t <= b + 0.35)))
level = 0.18 + (0.12 - 0.18) * duck
fade = np.minimum(np.clip(t / 1.5, 0, 1), np.clip((DUR - t) / 2, 0, 1))
mus = mus * (level * fade)[:, None]
os.makedirs('sfx/stems', exist_ok=True)
sf.write('sfx/stems/voz.wav', voz, SR); sf.write('sfx/stems/voice.wav', voz, SR); sf.write('sfx/stems/musica.wav', mus, SR); sf.write('sfx/stems/base.wav', voz + mus, SR)
print('ok stems', DUR, 's')
