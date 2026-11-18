"""AVELÉ · trilha original de 30 s (piano + cordas), composta sobre os cortes do filme.

Síntese aditiva em numpy: piano com parciais inarmônicas e decaimento em dois estágios;
cordas com serras desafinadas (aditivas), vibrato e envelope lento; reverberação por convolução.
Tonalidade: Ré maior, harmonia de inspiração impressionista francesa.
Saída: trilha-original-piano-cordas-30s.wav (48 kHz, estéreo).
"""
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
import wave, os

SR = 48000
DUR = 30.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}


def hz(name):
    p, o = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((NOTE[p] + 12 * (o + 1) - 69) / 12)


def pan(sig, start, p):
    i = int(start * SR)
    j = min(N, i + len(sig))
    sig = sig[:j - i]
    L[i:j] += sig * np.cos((p + 1) * np.pi / 4)
    R[i:j] += sig * np.sin((p + 1) * np.pi / 4)


def piano(name, t, vel=.6, length=None):
    f = hz(name)
    tau0 = 2.6 * (261.6 / f) ** 0.45
    length = length or min(6.5, tau0 * 3.2)
    n = int(length * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    B = 0.00035
    for k in range(1, 16):
        fk = k * f * np.sqrt(1 + B * k * k)
        if fk > 14000:
            break
        a = (1 / k ** 1.15) * np.exp(-k * (0.32 - 0.16 * vel))
        tk = tau0 / (1 + 0.28 * (k - 1))
        env = 0.65 * np.exp(-tt / (tk * 0.22)) + 0.35 * np.exp(-tt / tk)
        det = 1 + 0.00025 * (rng.random() - .5)
        out += a * env * (np.sin(2 * np.pi * fk * tt) + 0.8 * np.sin(2 * np.pi * fk * det * tt + rng.random() * 6.28))
    att = np.minimum(1, tt / 0.004)
    # martelo: ruído curto filtrado
    hn = rng.standard_normal(min(n, int(.03 * SR))) * np.exp(-np.arange(min(n, int(.03 * SR))) / (SR * .006))
    hn = sosfilt(butter(2, [min(f * 2, 6000), min(f * 8, 12000)], btype="band", fs=SR, output="sos"), hn)
    out[:len(hn)] += hn * 0.25
    rel = np.ones(n); r0 = int(n * .9); rel[r0:] = np.linspace(1, 0, n - r0)
    out *= att * rel * vel * 0.16
    p = np.clip((np.log2(f / 261.6)) * 0.35, -.6, .6)
    pan(out, t, p)


def strings(names, t0, t1, amp=.05, att=1.4, rel=1.6, p=0.0):
    n = int((t1 - t0 + rel) * SR)
    tt = np.arange(n) / SR
    env = np.minimum(1, tt / att) ** 1.6
    env *= np.clip(((t1 - t0 + rel) - tt) / rel, 0, 1) ** 1.2
    sig = np.zeros(n)
    for nm in names:
        f = hz(nm)
        vib = 1 + 0.0028 * np.sin(2 * np.pi * 5.1 * tt + rng.random() * 6) * np.minimum(1, tt / 1.2)
        for d in (-6, -2.5, 0, 2.5, 6):
            fd = f * 2 ** (d / 1200)
            ph = 2 * np.pi * np.cumsum(fd * vib) / SR
            for k in range(1, 18):
                if fd * k > 9000:
                    break
                sig += (1 / k) * np.exp(-k / 7.5) * np.sin(k * ph + rng.random() * 6.28) * 0.2
    sig = sosfilt(butter(2, 3800, fs=SR, output="sos"), sig)
    sig *= env * amp / max(1, len(names) ** .5)
    pan(sig, t0, p)


def arp(chord, t0, t1, step, vel=.45, pattern=(0, 1, 2, 3, 2, 1)):
    t, i = t0, 0
    while t < t1 - .05:
        piano(chord[pattern[i % len(pattern)] % len(chord)], t, vel * (0.85 + 0.3 * rng.random()))
        t += step * (1 + 0.04 * (rng.random() - .5)); i += 1


# ---------------------------------------------------------------- composição (tempos = cortes do filme)
# 0–4.4  seda: piano sozinho, Dmaj9 arpejado, com melodia
arp(["D3", "A3", "E4", "F#4"], 0.25, 4.4, .55, .38)
for nm, t in (("A4", 1.4), ("F#4", 2.5), ("E4", 3.3)):
    piano(nm, t, .5)
# 4.4–7.5 silhueta: Bm9
piano("B1", 4.4, .45); piano("B2", 4.4, .4)
arp(["B2", "F#3", "C#4", "D4"], 4.5, 7.5, .55, .36)
for nm, t in (("D5", 4.9), ("C#5", 5.9), ("A4", 6.7)):
    piano(nm, t, .5)
# 7.5–10 gota: Gmaj7, cordas entram
piano("G1", 7.5, .45); piano("G2", 7.5, .4)
arp(["G2", "D3", "B3", "F#4"], 7.6, 10.0, .5, .34)
piano("B4", 8.0, .48); piano("A4", 9.0, .45)
strings(["G2", "D3", "B3", "F#4"], 7.5, 10.1, .045, att=1.8)
# 10–12.1 tampa: A6sus / 12.1–14 etiqueta: F#m7 / 14–15.5 frasco: Gmaj7
piano("A1", 10.0, .45); arp(["A2", "E3", "B3", "D4"], 10.05, 12.1, .52, .33)
strings(["A2", "E3", "D4", "F#4"], 10.0, 12.2, .05, att=.9)
piano("F#4", 10.6, .45); piano("E4", 11.4, .42)
piano("F#1", 12.1, .42); arp(["F#2", "C#3", "A3", "E4"], 12.15, 14.0, .5, .33)
strings(["F#2", "C#3", "A3", "E4"], 12.1, 14.1, .055, att=.8)
piano("C#5", 12.6, .45); piano("A4", 13.3, .42)
piano("G1", 14.0, .45); arp(["G2", "D3", "B3", "F#4"], 14.05, 15.5, .48, .33)
strings(["G2", "D3", "B3", "F#4", "A4"], 14.0, 15.6, .06, att=.7)
piano("B4", 14.4, .48)
# 15.5–19.2 identidade: Em9 → A7sus4; gota no É (17.5): nota aguda "gota"
piano("E1", 15.5, .5); piano("E2", 15.5, .45)
for i, nm in enumerate(["B3", "D4", "F#4", "G4"]):
    piano(nm, 15.75 + i * .16, .42)     # letras surgindo em escada
strings(["E2", "B2", "G3", "D4", "F#4"], 15.5, 17.6, .065, att=.9)
piano("A1", 17.55, .45)
piano("D6", 17.6, .55); piano("A5", 17.68, .35)    # a gota cai
strings(["A2", "E3", "D4", "G4"], 17.5, 19.25, .07, att=.6)
# 19.2–25.8 as seis fragrâncias: um acorde por corte (1.12 s), cordas em crescendo
prog = [(["B1", "B2"], ["F#3", "A3", "D4"], "F#5"), (["G1", "G2"], ["D3", "B3", "F#4"], "B5"),
        (["F#1", "F#2"], ["A3", "D4", "F#4"], "A5"), (["E1", "E2"], ["G3", "B3", "D4"], "G5"),
        (["G1", "G2"], ["B3", "D4", "F#4"], "B5"), (["A1", "A2"], ["C#4", "E4", "G4"], "E5")]
for i, (bass, mid, top) in enumerate(prog):
    t = 19.2 + i * 1.12
    for b in bass:
        piano(b, t, .5)
    for j, m in enumerate(mid):
        piano(m, t + .02 + j * .05, .38)
    piano(top, t + .55, .45)
    strings(bass[1:] + mid, t, t + 1.12, .07 + .012 * i, att=.35, rel=.5)
# 25.8–30 assinatura: Dmaj9 resolve; segunda gota em 27.4; fecho
piano("D1", 25.8, .55); piano("D2", 25.8, .5)
for j, m in enumerate(["A2", "F#3", "C#4", "E4", "A4"]):
    piano(m, 25.85 + j * .09, .4)
strings(["D2", "A2", "F#3", "C#4", "E4"], 25.8, 28.6, .09, att=.4, rel=1.4)
piano("F#5", 26.6, .42)
piano("D6", 27.45, .5); piano("A5", 27.53, .32)
piano("D4", 28.4, .3); piano("A4", 28.42, .26); piano("F#5", 28.44, .26)

# ---------------------------------------------------------------- reverberação e master
ir_n = int(2.6 * SR)
ti = np.arange(ir_n) / SR
irL = rng.standard_normal(ir_n) * np.exp(-ti / .55)
irR = rng.standard_normal(ir_n) * np.exp(-ti / .55)
lp = butter(2, 5200, fs=SR, output="sos")
irL, irR = sosfilt(lp, irL), sosfilt(lp, irR)
irL[:int(.012 * SR)] = 0; irR[:int(.017 * SR)] = 0
irL /= np.abs(irL).sum() ** .5 * 6; irR /= np.abs(irR).sum() ** .5 * 6
wL = fftconvolve(L, irL)[:N]; wR = fftconvolve(R, irR)[:N]
mixL = L * .82 + wL * .55; mixR = R * .82 + wR * .55
hp = butter(2, 35, btype="high", fs=SR, output="sos")
mixL, mixR = sosfilt(hp, mixL), sosfilt(hp, mixR)
# fade final
fo = int(1.6 * SR)
fade = np.ones(N); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
mixL *= fade; mixR *= fade
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
g = 0.89 / peak
st = np.stack([np.tanh(mixL * g * 1.05) / np.tanh(1.05), np.tanh(mixR * g * 1.05) / np.tanh(1.05)], 1)
pcm = (st * 32767 * .95).astype(np.int16)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trilha-original-piano-cordas-30s.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok", out)
