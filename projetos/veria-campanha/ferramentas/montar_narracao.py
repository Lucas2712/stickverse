#!/usr/bin/env python3
"""Monta a narração na linha do tempo do filme sem alterar a voz.
Cada frase da gravação nova começa no mesmo instante em que a frase correspondente começava na montagem
de referência (audio/narracao/v1-sarah/tempos-narracao-sarah.json). Os cortes caem sempre dentro de silêncios
medidos (silencedetect); nenhuma palavra é cortada, acelerada ou alterada.
Uso: python3 -I ferramentas/montar_narracao.py   (rodar depois de transcrever.py)
"""
import json, re, subprocess, wave, os
import numpy as np
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
DUR = 71.0
INICIOS = ["Tudo", "O", "O", "As", "Mas", "Contas", "Gastos", "Objetivos", "E", "Esta", "Uma", "Seu", "Entradas", "Cada", "Seus", "E", "Sem", "Sem", "Do", "Véria", "Seu", "Seu"]

def limpa(w): return re.sub(r"[^\wÀ-ÿ]", "", w)

ref = json.load(open(os.path.join(R, "audio/narracao/v1-sarah/tempos-narracao-sarah.json")))["palavras"]
novo = json.load(open(os.path.join(R, "palavras.json")))
arq = os.path.join(R, "audio/narracao/narracao.mp3")
a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, dtype=np.float32)
log = subprocess.run(["ffmpeg", "-v", "info", "-i", arq, "-af", "silencedetect=n=-38dB:d=0.18", "-f", "null", "-"], capture_output=True, text=True).stderr
sil = list(zip(map(float, re.findall(r"silence_start: ([\d.]+)", log)), map(float, re.findall(r"silence_end: ([\d.]+)", log))))

def indices(lista):
    out, k = [], 0
    for alvo in INICIOS:
        while limpa(lista[k]["w"]) != alvo: k += 1
        out.append(k); k += 1
    return out
iref, inov = indices(ref), indices(novo)

# início real de cada frase nova = fim do silêncio que a precede (o Whisper às vezes adianta a palavra)
inicio_novo = []
for b, k in enumerate(inov):
    s = novo[k]["s"]
    if b > 0:
        cand = [e for (st, e) in sil if abs(e - s) < 0.8]
        if cand: s = min(cand, key=lambda e: abs(e - s))
    inicio_novo.append(s)
cortes, fins = [], []
for b, s in enumerate(inicio_novo):
    if b == 0: cortes.append(0.0); continue
    st = max([x for (x, e) in sil if e <= s + 0.01] or [s - 0.2])
    cortes.append(s - min(0.12, (s - st) / 2))
    fins.append(min(cortes[-1], st + 0.14))      # a frase anterior termina pouco depois do início do silêncio
cortes.append(len(a) / SR); fins.append(len(a) / SR)

out = np.zeros(int(DUR * SR), np.float32)
palavras, fim_ant = [], 0
for b in range(len(INICIOS)):
    alvo = ref[iref[b]]["s"]
    desl = alvo - inicio_novo[b]
    i0, i1 = int(cortes[b] * SR), int(fins[b] * SR)
    j0 = int((cortes[b] + desl) * SR)
    if j0 < fim_ant: raise SystemExit(f"frase {b+1} sobreporia a anterior em {(fim_ant-j0)/SR:.2f} s")
    seg = a[i0:i1].copy(); n = int(0.015 * SR); seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
    out[j0:j0 + (i1 - i0)] += seg
    fim_ant = j0 + (i1 - i0)
    ult = inov[b + 1] if b + 1 < len(inov) else len(novo)
    for k in range(inov[b], ult):
        s = inicio_novo[b] if k == inov[b] else novo[k]["s"]
        palavras.append({"w": novo[k]["w"], "s": round(s + desl, 3), "e": round(novo[k]["e"] + desl, 3)})
    print(f"frase {b+1:2d} {INICIOS[b]:10s} em {alvo:6.2f} s  (dura {(i1-i0)/SR:4.2f} s)")

# nivelamento: só ganho, para a voz ficar perto de −16 LUFS (medido pelo ffmpeg) sem passar de −1 dBFS de pico
tmp = os.path.join(R, "audio/narracao/_tmp.wav")
def grava(x, p):
    ww = wave.open(p, "wb"); ww.setnchannels(1); ww.setsampwidth(2); ww.setframerate(SR)
    ww.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); ww.close()
grava(out, tmp)
m = re.findall(r"I:\s+(-?[\d.]+) LUFS", subprocess.run(["ffmpeg", "-v", "info", "-i", tmp, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr)
os.remove(tmp)
ganho = min(10 ** ((-16.0 - float(m[-1])) / 20), 0.89 / max(1e-9, float(np.abs(out).max())))
out = out * ganho
print(f"voz: {float(m[-1]):.1f} LUFS → ganho {20*np.log10(ganho):+.1f} dB")
w = wave.open(os.path.join(R, "audio/narracao/narracao-timeline.wav"), "wb")
w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
json.dump({"duracao": DUR, "metodo": "frases alinhadas aos inícios da montagem de referência", "palavras": palavras}, open(os.path.join(R, "src/tempos-narracao.json"), "w"), ensure_ascii=False, indent=0)
print("ok · fim da fala em", palavras[-1]["e"], "s")
