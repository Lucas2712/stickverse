#!/usr/bin/env python3
"""Monta o Reel 'Brasil de tricô' (1080x1920, 30 fps, sem áudio) a partir de clipes/cena-1..4.mp4.

Uso: python3 montar.py   (gera saida/brasil-de-trico.mp4)
Requer: ffmpeg com drawtext e xfade, fontes Inter instaladas.
"""
import os, subprocess, tempfile

AQUI = os.path.dirname(os.path.abspath(__file__))
FONTES = "/usr/share/fonts/opentype/inter"
BOLD = f"{FONTES}/InterDisplay-Bold.otf"
SEMI = f"{FONTES}/InterDisplay-SemiBold.otf"
TEXTO = f"{FONTES}/Inter-Medium.otf"

DUR = 5.04          # duração de cada clipe
XF = 0.3            # transição entre cenas
FINAL = 3.6         # cartela final com o prompt
LUGARES = ["Foz do Iguaçu · PR", "Rio de Janeiro · RJ", "Salvador · BA", "Lençóis Maranhenses · MA"]

tmp = tempfile.mkdtemp()
def arq(nome, txt):
    p = os.path.join(tmp, nome)
    open(p, "w", encoding="utf-8").write(txt)
    return p

def texto(arquivo, fonte, tam, y, ini, fim, cor="white", borda=True):
    a = f"if(lt(t,{ini}+0.25),(t-{ini})/0.25,if(gt(t,{fim}-0.2),({fim}-t)/0.2,1))"
    s = (f"drawtext=fontfile={fonte}:textfile={arquivo}:fontsize={tam}:fontcolor={cor}"
         f":x=(w-text_w)/2:y={y}:alpha='{a}':enable='between(t,{ini},{fim})'")
    if borda:
        s += ":shadowcolor=black@0.55:shadowx=0:shadowy=4:borderw=2:bordercolor=black@0.25"
    return s

entradas, filtros = [], []
for i in range(4):
    entradas += ["-i", os.path.join(AQUI, "clipes", f"cena-{i+1}.mp4")]
    filtros.append(f"[{i}:v]scale=1080:1920:flags=lanczos,fps=30,setsar=1,trim=0:{DUR},setpts=PTS-STARTPTS[c{i}]")

# cartela final: último quadro da cena 4, desfocado e escurecido
entradas += ["-sseof", "-0.1", "-i", os.path.join(AQUI, "clipes", "cena-4.mp4")]
filtros.append(f"[4:v]scale=1080:1920:flags=lanczos,boxblur=20:2,eq=brightness=-0.32:saturation=0.8,"
               f"loop=loop=-1:size=1:start=0,fps=30,trim=0:{FINAL},setpts=PTS-STARTPTS,setsar=1[fim]")

# encadeia as cenas com transição
ant, t = "c0", DUR
for i in range(1, 4):
    off = t - XF
    filtros.append(f"[{ant}][c{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}]")
    ant, t = f"x{i}", off + DUR
off_fim = t - 0.4
filtros.append(f"[{ant}][fim]xfade=transition=fade:duration=0.4:offset={off_fim:.3f}[base]")
total = off_fim + FINAL

inicios = [0] + [k * (DUR - XF) for k in range(1, 4)]
camadas = []
# gancho (topo, área segura do Reels)
camadas.append(texto(arq("g1", "Transformei o Brasil"), BOLD, 84, 300, 0.15, 3.4))
camadas.append(texto(arq("g2", "em tricô usando IA"), BOLD, 84, 400, 0.15, 3.4))
# nome de cada lugar
for k, nome in enumerate(LUGARES):
    ini = inicios[k] + (0.3 if k else 0.5)
    fim = (inicios[k + 1] if k < 3 else off_fim) + 0.1
    camadas.append(texto(arq(f"l{k}", nome), SEMI, 58, 1330, ini, fim))
# cartela final
f0 = off_fim + 0.25
linhas = [
    ("O prompt que eu usei", BOLD, 66, 520, "white"),
    ("hand-knitted wool miniature diorama,", TEXTO, 40, 650, "white@0.88"),
    ("every surface made of yarn, visible", TEXTO, 40, 705, "white@0.88"),
    ("knit stitches and crochet texture,", TEXTO, 40, 760, "white@0.88"),
    ("tilt-shift macro photography...", TEXTO, 40, 815, "white@0.88"),
    ("Prompt completo na legenda", SEMI, 48, 930, "#ffb347"),
    ("Qual estado eu faço na próxima?", BOLD, 58, 1120, "white"),
]
for j, (txt, fonte, tam, y, cor) in enumerate(linhas):
    camadas.append(texto(arq(f"f{j}", txt), fonte, tam, y, f0 + 0.05 * j, total + 1, cor, borda=False))

filtros.append("[base]" + ",".join(camadas) + ",format=yuv420p[out]")

os.makedirs(os.path.join(AQUI, "saida"), exist_ok=True)
saida = os.path.join(AQUI, "saida", "brasil-de-trico.mp4")
cmd = ["ffmpeg", "-v", "error", "-y", *entradas, "-filter_complex", ";".join(filtros),
       "-map", "[out]", "-t", f"{total:.3f}", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
       "-profile:v", "high", "-movflags", "+faststart", saida]
subprocess.run(cmd, check=True)
print(f"ok: {saida} ({total:.2f} s)")
