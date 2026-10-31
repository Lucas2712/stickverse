#!/usr/bin/env python3
"""Sintetiza a trilha e os efeitos sonoros do Ep. 1 (ÚLTIMO SINAL) em código.

Uso: python3 sfx.py saida.wav
Os tempos seguem a narração (narracao.mp3, 61,8 s); o vídeo tem DURACAO s.
"""
import sys
import wave

import numpy as np

SR = 48000
DURACAO = 65.0
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
pontos = [(0, 0.35), (16.0, 0.4), (17.9, 1.0), (33.0, 1.0), (33.4, 0.0), (41.2, 0.0),
          (41.5, 0.7), (46.0, 0.55), (53.8, 0.65), (56.4, 1.0), (63.0, 0.8), (DURACAO, 0.0)]
curva = np.interp(t, [p[0] for p in pontos], [p[1] for p in pontos])
add(drone * curva, 0, 0.11)

# pad agudo e tenso a partir do apagão
pad = np.sin(2 * np.pi * 311 * t) * np.sin(2 * np.pi * 0.25 * t) ** 2 + 0.5 * np.sin(2 * np.pi * 466 * t)
pontos_pad = [(0, 0), (18, 0), (22, 0.5), (33.0, 0.5), (33.4, 0), (49.3, 0), (52, 0.6), (56.4, 0.8), (62, 0.4), (DURACAO, 0)]
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


add(chiado(5.4) * 0.5, 3.3, 0.06)              # TV ao fundo
add(boom(), 5.0, 0.75)                          # cartela do título
add(notificacao(), 9.0, 0.18)                   # mensagem da mãe
add(apagao(), 17.75, 0.5)                       # a cidade apaga
add(boom(), 17.95, 0.55)
add(batida_carro(), 19.25, 0.5, pan=-0.2)       # carro no hidrante
add(alarme(9.5), 19.6, 0.05, pan=0.3)
add(helicoptero(5.6), 24.0, 0.35, pan=0.2)
add(chamada(), 30.75, 0.2)                      # chama...
add(chamada(), 31.5, 0.2)                       # chama...
add(bipe(), 32.25, 0.12)                        # caixa postal
for k, tk in enumerate((34.2, 34.75, 35.3)):    # três batidas
    add(batida_porta(), tk, 0.9 - 0.1 * k)
add(subida(1.3), 40.2, 0.25)
add(boom(), 41.45, 0.8)                         # regra
add(chiado(3.1), 46.0, 0.22)                    # TV falhando
add(boom(1.2), 49.15, 0.35)                     # corte seco
for k in range(6):                              # coração
    add(coracao(), 49.4 + k * 0.8, 0.6)
add(subida(1.6), 54.8, 0.2)
add(boom(), 56.4, 0.7)                          # escolha
add(boom(), 59.6, 0.5)                          # cartela final

mix = np.stack([L, R], 1)
mix /= max(1.0, np.abs(mix).max() / 0.95)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
