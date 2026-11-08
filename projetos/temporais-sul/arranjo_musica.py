#!/usr/bin/env python3
"""Arranjo de 60 s da trilha (musica.mp3, 30,8 s, 180 BPM) cortando só em inícios de frase/compasso.
Uso: python3 -I projetos/temporais-sul/arranjo_musica.py  →  saida/musica-arranjo.wav (o original fica intacto)

Grade medida: batida 0,3328 s · compasso 1,331 s · frase de 4 compassos 5,324 s, com acentos em 2,17 / 7,50 / 18,15 s.
Cada corte é alinhado ao transiente mais próximo (±45 ms) e emendado com crossfade de potência constante de 40 ms.

Mapa (saída ← trecho da música) e por quê:
  A   0,00–18,15 ← 0,00–18,15   abertura e crescimento; acentos caem em «casas» (2,20) e «sequência» (7,66)
  B  18,15–28,80 ← 18,15–28,80  clímax 1 sob os números (23 mil, 17 municípios, destelhadas/alagadas)
  C  28,80–39,45 ← 12,82–23,47  novo capítulo («E os estragos…»): volta um degrau e cresce até o pico em 34,1
                                (acento de 18,15 → microexplosão/rajadas); 126 km/h cai no clímax
  D  39,45–42,98   quebra: o trecho C some num filtro passa-baixa (0,45 s) e fica só a atmosfera («Mas…»)
  E  42,98–51,60 ← 0,00–8,62    explicação: o começo da trilha volta abafado (passa-baixa 2,2 kHz) e mais baixo
  F  51,60–57,57 ← 24,80–30,77  final: o acento da frase (28,80) cai em 55,58, o corte para a cartela (55,40)
  cauda 57,57–60,00: eco do último acorde se apagando
"""
import os, subprocess, numpy as np, soundfile as sf

AQUI = os.path.dirname(os.path.abspath(__file__))
SAI = os.path.join(AQUI, "saida"); os.makedirs(SAI, exist_ok=True)
tmp = os.path.join(SAI, "_musica.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(AQUI, "musica.mp3"), "-ar", "48000", "-ac", "2", tmp], check=True)
x, sr = sf.read(tmp); mono = x.mean(1)

def ataque(t, janela=.045):
    """Ajusta o ponto de corte ao início do transiente mais próximo (fluxo de energia)."""
    i0, i1 = int((t - janela) * sr), int((t + janela) * sr); h = int(.005 * sr)
    e = np.array([np.sum(mono[i:i + h] ** 2) for i in range(i0, i1, h)])
    d = np.diff(e, prepend=e[0]); k = int(np.argmax(d))
    return (i0 + k * h) / sr - .008  # um pouco antes do ataque

def trecho(a, b): return x[int(ataque(a) * sr) if a > 0 else 0: int(ataque(b) * sr) if b < len(x) / sr - .01 else len(x)].copy()

def passa_baixa(y, fc):
    from scipy.signal import butter, sosfiltfilt
    return sosfiltfilt(butter(4, fc, fs=sr, output="sos"), y, axis=0)

A = trecho(0.00, 28.80)                              # A + B são contínuos (sem corte)
C = trecho(12.82, 23.47)
# D: o fim de C some num passa-baixa (0,45 s)
n = int(.45 * sr); C[-n:] = passa_baixa(C[-n:], 900) * np.linspace(1, 0, n)[:, None] ** 2
quebra = np.zeros((int(3.53 * sr), 2))              # 39,45 → 42,98: atmosfera (chuva/vento vêm dos efeitos)
E = passa_baixa(trecho(0.00, 8.62), 2200) * .62
Fm = trecho(24.80, 30.77)
cauda = Fm[-int(1.2 * sr):] * np.linspace(.5, 0, int(1.2 * sr))[:, None] ** 2
cauda = passa_baixa(np.concatenate([cauda, np.zeros((int(1.3 * sr), 2))]), 1800)

def coloca(buf, seg, t, fade=.04):
    """Soma o trecho na posição exata da saída, com rampas de potência constante de 40 ms nas emendas."""
    seg = seg.copy(); n = int(fade * sr); r = np.sin(np.linspace(0, np.pi / 2, n))[:, None]
    seg[:n] *= r; seg[-n:] *= r[::-1]
    i = int(t * sr); j = min(len(buf), i + len(seg)); buf[i:j] += seg[:j - i]

y = np.zeros((int(60 * sr), 2))
coloca(y, A, 0.00); coloca(y, C, 28.80); coloca(y, E, 42.98); coloca(y, Fm, 51.60); coloca(y, cauda, 51.60 + len(Fm) / sr)
f = int(.6 * sr); y[-f:] *= np.linspace(1, 0, f)[:, None]
y *= .891 / max(1e-9, np.abs(y).max())                 # pico em −1 dBFS (o original chegava a +0,1 dBTP)
sf.write(os.path.join(SAI, "musica-arranjo.wav"), y, sr); os.remove(tmp)
print(f"ok saida/musica-arranjo.wav · {len(y) / sr:.2f} s")
