#!/usr/bin/env python3
"""Trilha original da KAVORA, composta por código (sem amostras de terceiros).

Eletrônica minimalista de motion design corporativo: pad de synth suave, baixo discreto com sidechain,
batida leve (bumbo macio, estalo, chimbal), arpejo digital no bloco laranja, riser e impacto no logo.
118 BPM, com o compasso ancorado na entrada do logo (3,14 s) e no impacto «KAVORA» (25,52 s = +11 compassos).
Lê os tempos de src/timing.json e grava public/trilha.wav (estéreo, 48 kHz, normalizado em -14 LUFS).

Uso (dentro de projetos/kavora/remotion):  python3 ferramentas/compor_trilha.py
"""
import json, os, subprocess
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 48000
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..'))
T = json.load(open(os.path.join(RAIZ, 'src', 'timing.json')))
W, DUR = T['words'], T['duration']
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)

LOGO, KAV = W['com'], W['kavora']
BEAT = (KAV - LOGO) / 44.0            # 11 compassos de 4 tempos entre o logo e o impacto (~118 BPM)
BAR = BEAT * 4
DARK, ORANGE, FIM = W['controle'] - 0.45, W['gestao'] - 0.45, W['slogan']

def t2i(t): return int(round(t * SR))
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, fc, order=2): return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)

L = np.zeros(N); R = np.zeros(N)
def add(sig, t, gl=1.0, gr=None):
    i = t2i(t)
    if i >= N: return
    if i < 0: sig = sig[-i:]; i = 0
    n = min(len(sig), N - i)
    L[i:i + n] += sig[:n] * gl
    R[i:i + n] += sig[:n] * (gl if gr is None else gr)

def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.full(n, s)
    e[:a] = np.linspace(0, 1, a, endpoint=False) if a else e[:a]
    e[a:a + d] = np.linspace(1, s, min(d, max(0, n - a)), endpoint=False)[: len(e[a:a + d])]
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e

def saw(f, n, harm=14, bright=6.0, phase=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(1, harm + 1):
        if f * k > 12000: break
        out += np.sin(2 * np.pi * f * k * t + phase * k) / k * np.exp(-(k - 1) / bright)
    return out

# ---------- harmonia: Am9 · Fmaj7 · Cmaj9 · G6 (uma por compasso) ----------
CHORDS = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [48, 55, 59, 62, 64], [55, 59, 62, 64, 67]]
ROOTS = [45, 41, 48, 43]

# grade de compassos (inclui um compasso de anacruse antes do logo)
first_bar = LOGO - BAR * 2
bars = []
b = first_bar
while b < DUR + BAR:
    bars.append(b); b += BAR

# ---------- pad (sempre presente; mais escuro no bloco escuro, aberto no laranja) ----------
for bi, b0 in enumerate(bars):
    ch = CHORDS[bi % 4]
    n = int(BAR * SR * 1.35)
    bright = 3.2 if DARK <= b0 < ORANGE else (5.0 if b0 >= ORANGE else 4.2)
    for m in ch:
        f = mtof(m)
        for det, pan in ((-0.09, 0.85), (0.09, 0.15)):
            s = saw(f * 2 ** (det / 12), n, harm=10, bright=bright, phase=rng.uniform(0, 6.28))
            s *= env_adsr(n, 0.45, 0.3, 0.8, 0.9) * 0.022
            add(s, b0, gl=pan, gr=1 - pan)

# ---------- baixo (sine + 2º harmônico), notas em colcheias pontuadas, com sidechain do bumbo ----------
def bass_note(f, dur, g):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * env_adsr(n, 0.008, 0.12, 0.7, 0.08) * g
for bi, b0 in enumerate(bars):
    if b0 < LOGO - 0.01 or b0 > DUR: continue
    f = mtof(ROOTS[bi % 4] - 12 + 12)  # oitava grave
    pattern = [0, 1.5, 2.5, 3.5] if b0 >= DARK else [0, 2.5]
    for p in pattern:
        add(bass_note(f / 2 if p == 0 else f / 2, BEAT * 0.9, 0.16), b0 + p * BEAT)

# ---------- bateria leve ----------
def kick(g=0.5):
    n = int(0.32 * SR); t = np.arange(n) / SR
    f = 45 + 75 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 11) * g
def snap(g=0.12):
    n = int(0.18 * SR)
    x = bp(rng.standard_normal(n), 1400, 6000) * np.exp(-np.arange(n) / SR * 26)
    return x * g
def hat(g=0.05, dec=40):
    n = int(0.09 * SR)
    return hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * dec) * g

kick_times = []
for bi, b0 in enumerate(bars):
    if b0 < LOGO - 0.01: continue
    drop = KAV <= b0 < KAV + BAR - 0.01          # um compasso de respiro depois do impacto
    if drop or b0 > DUR - BAR * 0.5: continue
    for k in (0, 2):
        add(kick(0.42 if b0 < ORANGE else 0.5), b0 + k * BEAT); kick_times.append(b0 + k * BEAT)
    if b0 >= DARK:
        for k in (1, 3): add(snap(0.10 if b0 < ORANGE else 0.13), b0 + k * BEAT, 0.9, 1.0)
    for e in range(8):
        tt = b0 + e * BEAT / 2
        g = 0.035 if e % 2 == 0 else 0.05
        if b0 >= ORANGE: g *= 1.4
        pan = 0.62 if e % 2 else 0.4
        add(hat(g, 30 if (b0 >= ORANGE and e % 2) else 45), tt, pan, 1 - pan)

# sidechain: o pad e o baixo respiram com o bumbo
sc = np.ones(N)
for kt in kick_times:
    i = t2i(kt); n = int(0.28 * SR)
    if i >= N: continue
    seg = 1 - 0.38 * np.exp(-np.arange(min(n, N - i)) / SR * 14)
    sc[i:i + len(seg)] = np.minimum(sc[i:i + len(seg)], seg)
L *= sc; R *= sc

# ---------- arpejo digital (bloco laranja e final) ----------
def pluck(f, g):
    n = int(0.35 * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t + 0.3) + 0.12 * np.sin(2 * np.pi * 3 * f * t))
    return s * np.exp(-t * 14) * g
arp_l = np.zeros(N); arp_r = np.zeros(N)
for bi, b0 in enumerate(bars):
    active = (ORANGE - BAR <= b0 < KAV) or (b0 >= KAV + BAR * 0.99)
    if not active: continue
    ch = CHORDS[bi % 4]
    seq = [ch[0] + 12, ch[2] + 12, ch[3] + 12, ch[4] + 12, ch[3] + 12, ch[2] + 12, ch[1] + 12, ch[2] + 12]
    for s16 in range(16):
        tt = b0 + s16 * BEAT / 4
        if tt < ORANGE - 0.05 and b0 < KAV: continue
        m = seq[s16 % 8]
        g = 0.05 * (0.6 + 0.4 * ((s16 % 4) == 0))
        p = pluck(mtof(m), g)
        i = t2i(tt); n = min(len(p), N - i)
        if n <= 0: continue
        pan = 0.3 + 0.4 * (s16 % 2)
        arp_l[i:i + n] += p[:n] * pan; arp_r[i:i + n] += p[:n] * (1 - pan)
# eco em pingue-pongue (3/16)
dly = int(BEAT * 0.75 * SR)
for k, g in ((1, 0.35), (2, 0.18)):
    src_l, src_r = (arp_r, arp_l) if k % 2 else (arp_l, arp_r)
    L[dly * k:] += src_l[:-dly * k] * g; R[dly * k:] += src_r[:-dly * k] * g
L += arp_l; R += arp_r

# ---------- riser antes do logo e antes do impacto, e o impacto ----------
def riser(dur, g):
    n = int(dur * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    steps = 24
    for k in range(steps):
        a, b2 = k * n // steps, (k + 1) * n // steps
        fc = 400 * (12 ** (k / steps))
        out[a:b2] = bp(noise, fc * 0.7, min(fc * 1.4, 20000))[a:b2]
    tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * t / dur)) / SR) * 0.3
    return (out + tone) * (t / dur) ** 2 * g
add(riser(1.2, 0.05), LOGO - 1.2)
add(riser(2.0, 0.07), KAV - 2.0)
def impact():
    n = int(2.2 * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(38 + 40 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.2)
    return sub * 0.5
add(impact(), KAV)
# acorde sustentado no impacto
for m in CHORDS[0]:
    n = int(BAR * 1.6 * SR)
    s = saw(mtof(m + 12), n, harm=8, bright=3.5) * env_adsr(n, 0.01, 0.6, 0.35, 1.2) * 0.03
    add(s, KAV, 0.6, 0.4)

# ---------- espaço (reverb por convolução com cauda sintética estéreo) ----------
irn = int(1.8 * SR); ti = np.arange(irn) / SR
irL = rng.standard_normal(irn) * np.exp(-ti * 3.2); irR = rng.standard_normal(irn) * np.exp(-ti * 3.2)
irL, irR = lp(irL, 6000), lp(irR, 6000)
irL /= np.sqrt((irL ** 2).sum()); irR /= np.sqrt((irR ** 2).sum())
wet = 0.22
L2 = L + fftconvolve(L, irL)[:N] * wet
R2 = R + fftconvolve(R, irR)[:N] * wet

# limpeza: corta subgrave extremo, suaviza o topo
L2, R2 = hp(L2, 28), hp(R2, 28)
L2, R2 = lp(L2, 15000), lp(R2, 15000)
mix = np.stack([L2, R2], 1)[: int(DUR * SR)]
mix /= np.max(np.abs(mix)) * 1.12

tmp = os.path.join(RAIZ, 'public', 'trilha-bruta.wav')
import soundfile as sf
sf.write(tmp, mix.astype(np.float32), SR)
out = os.path.join(RAIZ, 'public', 'trilha.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9', '-ar', str(SR), out], check=True)
os.remove(tmp)
print(f'ok public/trilha.wav · {60 / BEAT:.1f} BPM · compasso {BAR:.3f}s · {DUR:.2f}s')
