#!/usr/bin/env python3
"""ROVIA · trilha original composta em código (numpy), seguindo a estrutura musical da referência.

100 BPM (batida = 0,6 s, compasso = 2,4 s). Marcas:
  0,00–1,85  intro: pad suave + subida (reverse swell) até o corte
  1,85       batida entra no corte para o primeiro gráfico
  9,33       entra o arpejo (painel escuro, mais energia)
  17,2–17,9  respiro: grave e bumbo saem (carrossel de ícones)
  20,65–22,25 pausa: só pad + subida; tudo volta em 22,25 («real»)
  27,05      acorde final, cauda até 28,5
Uso: python3 audio/musica.py <saida.wav> [narracao.wav para ducking]
"""
import sys
import numpy as np
import wave

SR = 44100
DUR = 28.5
N = int(SR * DUR)
BEAT = 0.6
T0 = 1.85  # primeiro tempo forte
rng = np.random.default_rng(7)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_adsr(n, a, d, s, r, sus_len):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sl = max(0, int(sus_len * SR))
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sl, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def saw(f, n, harm=18, det=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(1, harm + 1):
        if f * k > 16000:
            break
        out += np.sin(2 * np.pi * f * k * (1 + det) * t + k * 0.3) / k
    return out


def lowpass(x, fc):
    # um polo, aplicado duas vezes (12 dB/oit) — fc pode ser array
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    for _ in range(2):
        z = 0.0
        out = np.empty_like(x)
        for i in range(len(x)):
            z = (1 - a[i]) * x[i] + a[i] * z
            out[i] = z
        x = out
    return x


def lp_fast(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    from scipy.signal import lfilter
    y = lfilter([1 - a], [1, -a], x)
    return lfilter([1 - a], [1, -a], y)


def hp_fast(x, fc):
    return x - lp_fast(x, fc)


def put(buf, x, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    x = x[: N - i]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    buf[0, i:i + len(x)] += x * gain * l * 1.414
    buf[1, i:i + len(x)] += x * gain * r * 1.414


def reverb(x, tempo=2.2, mix=0.25, seed=1):
    from scipy.signal import fftconvolve
    r = np.random.default_rng(seed)
    n = int(tempo * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = r.standard_normal(n) * np.exp(-t * 6.9 / tempo)
        ir = lp_fast(ir, 6000)
        ir[: int(0.012 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[ch] = fftconvolve(x[ch], ir)[: x.shape[1]]
    return x * (1 - mix) + out * mix * 1.6


# ---------- harmonia: Am9 | Fmaj7 | Cmaj7(9) | G6 (um acorde por compasso) ----------
ACORDES = [
    (45, [57, 60, 64, 67, 71]),   # Am9  (A, C E G B)
    (41, [57, 60, 64, 65, 69]),   # Fmaj7 (F A C E)
    (48, [55, 60, 62, 64, 67]),   # Cadd9
    (43, [55, 59, 62, 64, 67]),   # G6
]


def acorde_em(t):
    if t < T0:
        return ACORDES[0]
    i = int((t - T0) // (4 * BEAT)) % 4
    return ACORDES[i]


def ativo(t, camada):
    """quais camadas tocam em cada momento (arranjo)"""
    if t < T0 - 0.02:
        return camada in ("pad",)
    if 20.65 <= t < 22.25:
        return camada in ("pad",)
    if 17.2 <= t < 17.9 and camada in ("kick", "bass"):
        return False
    if t >= 27.05:
        return False
    if camada == "arp":
        return t >= 9.33
    if camada == "hat":
        return t >= 4.25
    return True


mus = np.zeros((2, N))
drums = np.zeros((2, N))

# ---------- pad (acordes longos, filtrados, estéreo largo) ----------
pad = np.zeros((2, N))
tempos_acorde = [0.0] + [T0 + i * 4 * BEAT for i in range(12)]
for j, ta in enumerate(tempos_acorde):
    if ta >= 27.05:
        break
    fim = tempos_acorde[j + 1] if j + 1 < len(tempos_acorde) else 27.05
    fim = min(fim, 27.05)
    root, notas = acorde_em(ta + 0.01)
    n = int((fim - ta + 0.9) * SR)
    for k, m in enumerate(notas):
        for side, det in ((-0.6, -0.0035), (0.6, 0.0035)):
            x = saw(midi(m), n, harm=10, det=det)
            x *= env_adsr(n, 0.35 if ta > 0 else 1.6, 0.4, 0.8, 0.9, fim - ta - 0.75)
            put(pad, x, ta, 0.024, side)
pad[0] = lp_fast(pad[0], 1400)
pad[1] = lp_fast(pad[1], 1400)
# na pausa 20,65–22,25 o pad abre o filtro (respiração)
mus += pad

# ---------- acorde final (27,05): pad + sino suave ----------
root, notas = ACORDES[0]
n = int(1.6 * SR)
fin = np.zeros((2, N))
for m in notas + [69, 76]:
    for side, det in ((-0.5, -0.003), (0.5, 0.003)):
        x = saw(midi(m), n, harm=8, det=det) * env_adsr(n, 0.01, 0.3, 0.5, 1.2, 0.05)
        put(fin, x, 27.05, 0.02, side)
for m in [69, 76, 81]:
    tt = np.arange(n) / SR
    put(fin, np.sin(2 * np.pi * midi(m) * tt) * np.exp(-tt * 2.2), 27.05, 0.05, 0.0)
fin[0] = lp_fast(fin[0], 3200)
fin[1] = lp_fast(fin[1], 3200)
mus += fin

# ---------- bumbo, estalo, chimbal (sincopado, como na referência) ----------
def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 46 + 90 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 7.5)
    x += 0.25 * np.exp(-t * 300) * rng.standard_normal(n) * 0.3
    return np.tanh(x * 1.6)


def snap():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-t * 28)
    x = hp_fast(lp_fast(x, 6000), 1200)
    body = np.sin(2 * np.pi * 220 * t) * np.exp(-t * 40) * 0.3
    return x * 0.9 + body


def hat(aberto=False):
    n = int((0.18 if aberto else 0.05) * SR)
    t = np.arange(n) / SR
    x = hp_fast(rng.standard_normal(n), 7000) * np.exp(-t * (18 if aberto else 90))
    return x


K, S = kick(), snap()
# padrão em colcheias (0,3 s): bumbo 0, 3, 5 · estalo nos tempos 2 e 4 (colcheias 2 e 6)
PAD_KICK = [0, 3, 5]
PAD_SNAP = [2, 6]
t = T0
compasso = 0
while t < 27.05:
    for c in range(8):
        tc = t + c * BEAT / 2
        if tc >= 27.05:
            break
        if c in PAD_KICK and ativo(tc, "kick"):
            put(drums, K, tc, 0.42)
        if c in PAD_SNAP and ativo(tc, "snap") and tc >= 2.9:
            put(drums, snap(), tc, 0.16, 0.05)
        for sixteenth in range(2):
            th = tc + sixteenth * BEAT / 4
            if ativo(th, "hat"):
                vel = 0.05 if sixteenth == 0 else 0.028
                put(drums, hat(aberto=(c == 7 and sixteenth == 1)), th, vel, 0.25 if sixteenth else -0.2)
    t += 4 * BEAT
    compasso += 1

# ---------- grave (sub senoidal nos bumbos) ----------
bass = np.zeros((2, N))
t = T0
while t < 27.05:
    for c in PAD_KICK + [7]:
        tc = t + c * BEAT / 2
        if tc >= 27.05 or not ativo(tc, "bass"):
            continue
        root, _ = acorde_em(tc)
        dur = 0.28 if c != 7 else 0.14
        n = int((dur + 0.08) * SR)
        tt = np.arange(n) / SR
        f = midi(root - 12 if root > 44 else root)
        x = np.sin(2 * np.pi * f * tt) + 0.18 * np.sin(4 * np.pi * f * tt)
        x *= env_adsr(n, 0.008, 0.05, 0.85, 0.08, dur - 0.06)
        put(bass, x, tc, 0.22)
    t += 4 * BEAT
mus += bass

# ---------- arpejo (pluck com eco), a partir do painel escuro ----------
arp = np.zeros((2, N))
t = 9.33
padrao = [0, 2, 4, 3, 1, 4, 2, 3]
i = 0
while t < 27.05:
    if ativo(t, "arp"):
        _, notas = acorde_em(t)
        m = notas[padrao[i % 8] % len(notas)] + 12
        n = int(0.35 * SR)
        tt = np.arange(n) / SR
        x = saw(midi(m), n, harm=6) * np.exp(-tt * 14)
        put(arp, x, t, 0.045, 0.35 if i % 2 else -0.35)
    t = T0 + (round((t - T0) / (BEAT / 2)) + 1) * BEAT / 2
    i += 1
arp[0] = lp_fast(arp[0], 2600)
arp[1] = lp_fast(arp[1], 2600)
eco = np.zeros_like(arp)
d = int(BEAT * 0.75 * SR)
eco[:, d:] += arp[::-1, :-d] * 0.35  # eco pingue-pongue
eco[:, 2 * d:] += arp[:, :-2 * d] * 0.15
mus += arp + eco

# ---------- subidas (reverse swell) antes dos cortes 1,85 e 22,25 ----------
def subida(dur):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = hp_fast(lp_fast(x, 5000), 400)
    return x * (tt / dur) ** 2.4


put(mus, subida(1.4), T0 - 1.4, 0.07)
put(mus, subida(1.5), 22.25 - 1.5, 0.08)

mus = reverb(mus, 2.4, 0.28, 3) + reverb(drums, 0.9, 0.12, 5)

# ---------- ducking pela voz ----------
if len(sys.argv) > 2:
    import subprocess
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[2], "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32)[:N]
    v = np.pad(v, (0, N - len(v)))
    win = int(0.05 * SR)
    envv = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, "same"))
    ativo_voz = (envv > 0.01).astype(float)
    # ataque 60 ms, soltura 350 ms
    from scipy.signal import lfilter
    a1 = np.exp(-1 / (0.06 * SR)); a2 = np.exp(-1 / (0.35 * SR))
    g = np.zeros(N); z = 0.0
    for i2 in range(0, N, 64):
        alvo = ativo_voz[i2]
        a = a1 if alvo > z else a2
        z = alvo + (z - alvo) * a ** 64
        g[i2:i2 + 64] = z
    reducao = 10 ** (-5 / 20)
    mus *= (1 - g * (1 - reducao))

# fade final e normalização
fade = np.ones(N)
nf = int(0.5 * SR)
fade[-nf:] = np.linspace(1, 0, nf) ** 2
mus *= fade
mus /= max(1e-9, np.abs(mus).max()) / 0.7

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mus.T, -1, 1) * 32767).astype(np.int16).tobytes())
print("ok", sys.argv[1])
