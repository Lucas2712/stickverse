#!/usr/bin/env python3
"""Copia os efeitos usados em src/audio.ts da biblioteca do estúdio (studio/sons/earshot, MIT)
para public/sfx/<nome>.wav, normalizados em pico de -1 dBFS (o ganho fino fica na lista de cues).
Uso: python3 ferramentas/preparar_sfx.py   (rodar dentro de projetos/kavora/remotion)"""
import os, re, subprocess, glob
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..'))
LIB = os.path.abspath(os.path.join(RAIZ, '..', '..', '..', 'studio', 'sons', 'earshot'))
OUT = os.path.join(RAIZ, 'public', 'sfx'); os.makedirs(OUT, exist_ok=True)
nomes = sorted(set(re.findall(r"'((?:whoosh|impact|riser|chime|pop|click|foley|glitch|typing|other)_[\w.-]+)'", open(os.path.join(RAIZ, 'src', 'audio.ts')).read())))
for n in nomes:
    src = glob.glob(os.path.join(LIB, '*', n + '.flac'))
    if not src: print('FALTA', n); continue
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', src[0], '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    pico = float(re.search(r'max_volume: ([-\d.]+) dB', r).group(1))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src[0], '-af', f'volume={-1 - pico:.2f}dB', '-ar', '48000', '-ac', '2', os.path.join(OUT, n + '.wav')], check=True)
    print(f'ok {n}  pico {pico:+.1f} dB → -1 dB')
