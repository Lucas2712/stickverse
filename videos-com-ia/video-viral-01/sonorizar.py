#!/usr/bin/env python3
"""Adiciona efeitos sonoros (biblioteca studio/sons, licença MIT) aos MP4 de saida/.

Uso: python3 sonorizar.py
Gera, para cada vídeo de saida/ sem sufixo -com-sfx:
  saida/<nome>-com-sfx.mp4   vídeo + efeitos (AAC 48 kHz)
  saida/<nome>-sfx.wav       só a faixa de efeitos (para usar no CapCut, se preferir)
Os tempos seguem montar.py (DUR=5.04, XF=0.3): pico de cada som no momento do evento.
"""
import glob, os, subprocess

AQUI = os.path.dirname(os.path.abspath(__file__))
SONS = os.path.normpath(os.path.join(AQUI, "..", "..", "studio", "sons", "earshot"))

DUR, XF = 5.04, 0.3
trans = [k * (DUR - XF) + XF / 2 for k in range(1, 4)]          # meio de cada transição
fim_cartela = (DUR + 3 * (DUR - XF)) - 0.4 + 0.25                  # texto da cartela final entra

# (arquivo, momento do evento em s, pico do som dentro do arquivo em s, ganho em dB)
CUES = [("chime/chime_pluck-kalimba-soft.flac", 0.15, 0.015, -12)]
CUES += [("whoosh/whoosh_swipe-velvet.flac", t, 0.266, -11) for t in trans]
CUES += [("chime/chime_logo-sting-soft-bloom.flac", fim_cartela, 0.307, -12)]

def faixa_sfx(destino, duracao):
    entradas, filtros, rotulos = [], [], []
    for i, (arq, t, pico, db) in enumerate(CUES):
        entradas += ["-i", os.path.join(SONS, arq)]
        ms = max(0, int(round((t - pico) * 1000)))
        filtros.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={db}dB,adelay={ms}|{ms}[a{i}]")
        rotulos.append(f"[a{i}]")
    filtros.append("".join(rotulos) + f"amix=inputs={len(CUES)}:normalize=0,apad,atrim=0:{duracao:.3f},"
                   "alimiter=limit=0.7[out]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *entradas, "-filter_complex", ";".join(filtros),
                    "-map", "[out]", "-c:a", "pcm_s16le", destino], check=True)

for video in sorted(glob.glob(os.path.join(AQUI, "saida", "*.mp4"))):
    if video.endswith("-com-sfx.mp4"):
        continue
    base = video[:-4]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                "-of", "csv=p=0", video], capture_output=True, text=True).stdout)
    wav = base + "-sfx.wav"
    faixa_sfx(wav, dur)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-i", wav, "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                    base + "-com-sfx.mp4"], check=True)
    print("ok:", base + "-com-sfx.mp4")

print("cues:", [(os.path.basename(a), round(t, 2)) for a, t, _, _ in CUES])
