#!/usr/bin/env python3
"""Sintetiza a trilha e os efeitos sonoros do Ep. 2 (ÚLTIMO SINAL) em código.

Uso: python3 sfx.py saida.wav
Os tempos seguem a narração (narracao.mp3, 86,5 s); o vídeo tem DURACAO s.
"""
import sys
import wave

import numpy as np

SR = 48000
DURACAO = 90.0
rng = np.random.default_rng(7)
N = int(SR * DURACAO)
L = np.zeros(N)
R = np.zeros(N)


def idx(t):
    return int(t * SR)


def add(sinal, t, ganho=1.0, pan=0.0):
    i = idx(t)
    j = min(N, i + len(sinal))
    s = sinal[: j - i] * ganho
    L[i:j] += s * (1 - max(pan, 0))
    R[i:j] += s * (1 + min(pan, 0))


def env(n, ataque=0.01, queda=0.2):
    e = np.ones(n)
    a, q = int(ataque * SR), int(queda * SR)
    if a:
        e[:a] = np.linspace(0, 1, a)
    if q:
        e[-q:] *= np.linspace(1, 0, q)
    return e


def lowpass(x, corte):
    # filtro de um polo, suficiente para escurecer ruído
    a = np.exp(-2 * np.pi * corte / SR)
    y = np.empty_like(x)
    acc = 0.0
    for k in range(len(x)):
        acc = (1 - a) * x[k] + a * acc
        y[k] = acc
    return y


def lowpass_rapido(x, corte):
    # versão vetorizada via FFT para sinais longos
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / corte) ** 4)
    return np.fft.irfft(X, len(x))


def bandpass_rapido(x, baixo, alto):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < baixo) | (f > alto)] *= 0.05
    return np.fft.irfft(X, len(x))


def tempo(n):
    return np.arange(n) / SR


# ---------- drone de tensão (curva de volume ao longo do episódio) ----------
t = tempo(N)
drone = (
    np.sin(2 * np.pi * 43 * t + 0.6 * np.sin(2 * np.pi * 0.07 * t))
    + 0.6 * np.sin(2 * np.pi * 64.5 * t)
    + 0.35 * np.sin(2 * np.pi * 86 * t + np.sin(2 * np.pi * 0.11 * t))
)
drone *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.18 * t)
drone += 0.5 * lowpass_rapido(rng.standard_normal(N), 180)
pontos = [(0, 0.5), (3.5, 0.25), (6.0, 0.0), (6.9, 0.7), (21.0, 0.9), (26.5, 0.5), (29.7, 0.6),
          (42.0, 0.85), (47.0, 0.5), (49.6, 0.25), (59.8, 0.6), (66.4, 0.4), (74.4, 1.0), (81.3, 1.0),
          (88.0, 0.6), (DURACAO, 0.0)]
curva = np.interp(t, [p[0] for p in pontos], [p[1] for p in pontos])
add(drone * curva, 0, 0.11)

# pad agudo e tenso a partir do apagão
pad = np.sin(2 * np.pi * 311 * t) * np.sin(2 * np.pi * 0.25 * t) ** 2 + 0.5 * np.sin(2 * np.pi * 466 * t)
pontos_pad = [(0, 0), (21, 0), (22, 0.6), (26.5, 0.4), (29, 0), (74, 0), (76, 0.6), (81.3, 0.8),
              (88, 0.4), (DURACAO, 0)]
add(pad * np.interp(t, [p[0] for p in pontos_pad], [p[1] for p in pontos_pad]), 0, 0.012)


# ---------- efeitos ----------
def boom(dur=3.0):
    n = idx(dur)
    tt = tempo(n)
    f = 55 * np.exp(-tt * 1.2) + 28
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.6)
    s += 0.6 * lowpass_rapido(rng.standard_normal(n), 120) * np.exp(-tt * 3)
    return s * env(n, 0.003, 0.5)


def chiado(dur):
    n = idx(dur)
    s = bandpass_rapido(rng.standard_normal(n), 800, 7000)
    s *= 0.7 + 0.3 * (rng.random(n // 480 + 1).repeat(480)[:n])
    return s * env(n, 0.02, 0.05)


def notificacao():
    n = idx(0.45)
    tt = tempo(n)
    s = np.sin(2 * np.pi * 1318 * tt) * np.exp(-tt * 9)
    s[idx(0.12):] += np.sin(2 * np.pi * 1760 * tt[: n - idx(0.12)]) * np.exp(-tt[: n - idx(0.12)] * 9)
    return s


def apagao():
    n = idx(1.6)
    tt = tempo(n)
    f = 120 * np.exp(-tt * 2.2) + 15
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 * np.exp(-tt * 1.5)
    s = lowpass_rapido(s, 900)
    s[: idx(0.05)] += rng.standard_normal(idx(0.05)) * 0.8
    return s * env(n, 0.002, 0.3)


def batida_carro():
    n = idx(1.2)
    tt = tempo(n)
    s = lowpass_rapido(rng.standard_normal(n), 2500) * np.exp(-tt * 5)
    s += 0.8 * np.sin(2 * np.pi * 60 * tt) * np.exp(-tt * 6)
    vidro = bandpass_rapido(rng.standard_normal(n), 4000, 12000) * np.exp(-tt * 8) * 0.5
    return (s + vidro) * env(n, 0.001, 0.2)


def alarme(dur):
    n = idx(dur)
    tt = tempo(n)
    f = np.where((tt * 2.5).astype(int) % 2 == 0, 880, 1050)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3
    return lowpass_rapido(s, 3000) * env(n, 0.01, 1.5)


def helicoptero(dur):
    n = idx(dur)
    tt = tempo(n)
    s = lowpass_rapido(rng.standard_normal(n), 400)
    s *= 0.25 + 0.75 * (np.sin(2 * np.pi * 13 * tt) > 0.3)
    s = lowpass_rapido(s, 700)
    return s * np.sin(np.pi * tt / dur) ** 1.5


def chamada():
    n = idx(1.4)
    tt = tempo(n)
    s = np.sin(2 * np.pi * 425 * tt) * (tt % 0.7 < 0.45)
    return s * 0.5 * env(n, 0.005, 0.05)


def bipe():
    n = idx(0.5)
    tt = tempo(n)
    return np.sin(2 * np.pi * 1000 * tt) * env(n, 0.005, 0.03)


def batida_porta():
    n = idx(0.5)
    tt = tempo(n)
    s = np.sin(2 * np.pi * 95 * tt) * np.exp(-tt * 22) + 0.6 * np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 30)
    s += lowpass_rapido(rng.standard_normal(n), 1500) * np.exp(-tt * 45) * 0.8
    return s


def coracao():
    n = idx(0.6)
    tt = tempo(n)
    um = np.sin(2 * np.pi * 50 * tt) * np.exp(-tt * 18)
    s = um.copy()
    d = idx(0.22)
    s[d:] += 0.7 * um[: n - d]
    return s


def subida(dur):
    n = idx(dur)
    tt = tempo(n)
    f = 200 + 900 * (tt / dur) ** 2
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + bandpass_rapido(rng.standard_normal(n), 2000, 9000) * 0.4
    return s * (tt / dur) ** 2


def clique():
    n = idx(0.12)
    tt = tempo(n)
    s = bandpass_rapido(rng.standard_normal(n), 1500, 6000) * np.exp(-tt * 70)
    s[idx(0.05):] += bandpass_rapido(rng.standard_normal(n - idx(0.05)), 1000, 4000) * np.exp(-tt[: n - idx(0.05)] * 90) * 0.7
    return s


def arranhao(dur):
    n = idx(dur)
    tt = tempo(n)
    s = bandpass_rapido(rng.standard_normal(n), 2500, 7000)
    s *= np.abs(np.sin(2 * np.pi * 3.2 * tt)) ** 3 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * tt))
    return s * env(n, 0.3, 0.6)


def latido():
    n = idx(0.9)
    tt = tempo(n)
    s = np.zeros(n)
    for ini in (0.0, 0.42):
        i = idx(ini)
        m = idx(0.18)
        tb = tt[:m]
        f = 520 - 300 * tb / 0.18
        b_ = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-tb * 14)
        b_ += rng.standard_normal(m) * 0.4 * np.exp(-tb * 20)
        s[i:i + m] += bandpass_rapido(b_, 300, 2500)
    return s


def rangido():
    n = idx(1.1)
    tt = tempo(n)
    f = 260 - 70 * tt + 18 * np.sin(2 * np.pi * 9 * tt)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 2.7) / SR)
    s *= 0.6 + 0.4 * (rng.random(n // 300 + 1).repeat(300)[:n])
    return s * env(n, 0.05, 0.4) * 0.6


def maquina(dur):
    n = idx(dur)
    tt = tempo(n)
    ritmo = 3.2 + 1.5 * tt / dur
    pancada = np.maximum(0, np.sin(2 * np.pi * np.cumsum(ritmo) / SR)) ** 8
    s = np.sin(2 * np.pi * 65 * tt) * pancada * 1.2
    s += lowpass_rapido(rng.standard_normal(n), 300) * 0.5 * (0.5 + pancada)
    s += 0.2 * np.sin(2 * np.pi * (90 + 40 * tt / dur) * tt)
    return s * np.minimum(1, tt / 1.5) * env(n, 0.01, 0.3)


def passo():
    n = idx(0.5)
    tt = tempo(n)
    s = lowpass_rapido(rng.standard_normal(n), 900) * np.exp(-tt * 9) * np.minimum(1, tt / 0.12)
    return s + np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 25) * 0.6


add(clique(), 6.10, 0.6)                        # clique da tranca
add(batida_carro(), 8.75, 0.35)                 # corpo caindo
add(boom(1.5), 8.8, 0.35)
add(subida(1.2), 20.0, 0.2)
add(boom(), 21.20, 0.7)                         # olhos brancos
add(batida_porta(), 24.55, 1.0)                 # porta do banheiro
add(batida_porta(), 25.30, 0.85)
add(batida_porta(), 25.95, 0.75)
add(clique(), 26.25, 0.5)                       # trinco
add(arranhao(3.2), 26.55, 0.18)                 # unhas na madeira
add(boom(), 26.60, 0.6)                         # cartela do título
add(notificacao(), 31.6, 0.08)                  # bateria
add(latido(), 38.05, 0.35, pan=0.4)             # cachorro ao longe
add(subida(1.3), 41.0, 0.25)
add(boom(), 42.34, 0.8)                         # regra
add(rangido(), 50.70, 0.7)                      # metal range
for k in range(7):                              # coração
    add(coracao(), 54.1 + k * 0.8, 0.6)
add(clique(), 62.30, 0.5)                       # chave
add(clique(), 62.55, 0.4)
add(chiado(5.2), 66.30, 0.18)                   # rádio
add(boom(), 71.55, 0.45)                        # St. Agnes
add(apagao()[::-1] * 0.6, 75.0, 0.4)            # energia voltando
add(maquina(6.5), 75.40, 0.55)                  # máquina de lavar
for k in range(4):                              # passos na escada
    add(passo(), 79.05 + k * 0.62, 0.55 + 0.1 * k)
add(boom(), 81.33, 0.7)                         # escolha
add(boom(), 85.30, 0.5)                         # cartela final

mix = np.stack([L, R], 1)
mix /= max(1.0, np.abs(mix).max() / 0.95)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
