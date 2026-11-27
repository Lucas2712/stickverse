"""Monta o Ep. 01: 4 clipes + flash branco + painéis do Sistema + legendas + 1 s de preto final.
Uso: python3 montar.py <pasta_clipes> <saida.mp4> [voz_sistema.json]"""
import json, subprocess, sys
CL, OUT = sys.argv[1], sys.argv[2]
leg = json.load(open("legendas.json")); pan = json.load(open("paineis.json"))
voz = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else []
args = ["ffmpeg", "-v", "error", "-y"]
for i in range(1, 5): args += ["-i", f"{CL}/c{i}.mp4"]
ovs = [(f"paineis/{p['png']}.png", p["ini"], p["fim"], 0.25) for p in pan] + [(f"leg/l{i:02d}.png", l["ini"], l["fim"], 0.08) for i, l in enumerate(leg)]
for f, a, b, _ in ovs: args += ["-loop", "1", "-t", f"{b - a:.2f}", "-i", f]
for v in voz: args += ["-i", v["arquivo"]]
f = []
for i in range(4):
    f.append(f"[{i}:v]scale=1104:1920:flags=lanczos,crop=1080:1920,fps=30,setsar=1[v{i}];[{i}:a]aresample=48000[a{i}]")
f.append("".join(f"[v{i}][a{i}]" for i in range(4)) + "concat=n=4:v=1:a=1[vc][ac]")
f.append("color=black:s=1080x1920:r=30:d=1.0[pre];anullsrc=r=48000:cl=stereo:d=1.0[sil]")
f.append("[vc][ac][pre][sil]concat=n=2:v=1:a=1[vb][ab]")
import os
flash = json.load(open("flash.json")) if os.path.exists("flash.json") else []
expr = "+".join(f"between(t,{a},{b})" for a, b in flash) or "0"
f.append(f"[vb]drawbox=x=0:y=0:w=iw:h=ih:color=white@1:t=fill:enable='{expr}'[x0]")
cur = "x0"
for k, (_, a, b, fd) in enumerate(ovs):
    n = 4 + k; d = b - a
    f.append(f"[{n}:v]format=rgba,fade=in:st=0:d={fd}:alpha=1,fade=out:st={d - fd:.2f}:d={fd}:alpha=1,setpts=PTS+{a}/TB[o{k}]")
    f.append(f"[{cur}][o{k}]overlay=0:0:eof_action=pass[x{k + 1}]"); cur = f"x{k + 1}"
amix = "[ab]"
if voz:
    base = 4 + len(ovs)
    for j, v in enumerate(voz):
        ms = int(v["ini"] * 1000)
        f.append(f"[{base + j}:a]aresample=48000,aformat=channel_layouts=stereo,volume={v.get('ganho', 1.0)},adelay={ms}|{ms}[s{j}]")
    f.append("[ab]" + "".join(f"[s{j}]" for j in range(len(voz))) + f"amix=inputs={len(voz) + 1}:duration=first:normalize=0[am]"); amix = "[am]"
f.append(f"{amix}loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
args += ["-filter_complex", ";".join(f), "-map", f"[{cur}]", "-map", "[aout]", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
         "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", OUT]
subprocess.run(args, check=True); print("ok", OUT)
