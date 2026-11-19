#!/usr/bin/env python3
"""Cortes de live sem palavrão (regra permanente do Studio Matteu).

Envolve o render.py da Skill clipador-ia sem modificá-la:
- todo palavrão da legenda vira símbolos (ex.: "porra!" -> "@#%!");
- o áudio recebe bip em cima de cada palavrão detectado na transcrição.

Uso: os mesmos argumentos do render.py (o --censor é forçado para "beep").
    python3 -I studio/ferramentas/clipes_sem_palavrao.py --input live.mp4 --start S --end E \
        --cam X,Y,W,H --title "TÍTULO" --words c01_words.json ... --out 01_titulo.mp4

Palavrão que não está na legenda (ex.: voz do jogo em inglês): --bip-extra S-E (segundos da live),
pode repetir. Para achar: transcreva o trecho com --lang en e procure fuck/shit etc.

O caminho do render.py vem de CLIPADOR_RENDER ou é procurado em ~/.claude/skills.
"""
import glob
import importlib.util
import os
import re
import sys

SIMBOLOS = "@#%"

# variações que a lista da Skill não cobre (comparação sem acento e sem pontuação)
EXTRAS = {
    "foderam", "fodendo", "fodam", "fode", "fodi", "fudeu", "fuder", "fudendo", "fodasse", "fodace",
    "porras", "merdas", "caralha", "caralhos", "putas", "putos", "bostas", "cus", "cacetes",
    "filhadaputa", "puraqueopariu", "putaquepariu", "vaisefoder", "vtmnc",
}


def achar_render():
    p = os.environ.get("CLIPADOR_RENDER")
    if p and os.path.isfile(p):
        return p
    achados = glob.glob(os.path.expanduser("~/.claude/skills/**/clipador-ia/scripts/render.py"), recursive=True)
    if not achados:
        sys.exit("ERRO: render.py da Skill clipador-ia não encontrado (defina CLIPADOR_RENDER).")
    return achados[0]


def simbolos(w):
    m = re.match(r"^(\W*)(.*?)(\W*)$", w, flags=re.UNICODE)
    return (m.group(1) + SIMBOLOS + m.group(3)) if m else SIMBOLOS


def main():
    caminho = achar_render()
    sys.path.insert(0, os.path.dirname(caminho))
    spec = importlib.util.spec_from_file_location("clipador_render", caminho)
    r = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(r)
    r.SWEARS |= EXTRAS
    r.star = simbolos
    args = [a for a in sys.argv[1:]]
    for op in ("--censor", "--bip-extra"):
        while op in args:
            i = args.index(op)
            if op == "--bip-extra":
                extras.append(args[i + 1])
            del args[i:i + 2]
    sys.argv = [caminho] + args + ["--censor", "beep"]
    r.main()
    if extras and "--out" in args:
        bip_extra(args[args.index("--out") + 1], float(args[args.index("--start") + 1]), extras)


extras = []


def bip_extra(out, start, faixas):
    """Bip sem legenda (ex.: palavrão em inglês na voz do jogo). Faixas em segundos da live: S-E."""
    import subprocess
    cond = "+".join(f"between(t,{float(a) - start - 0.08:.2f},{float(b) - start + 0.08:.2f})"
                    for a, b in (f.split("-") for f in faixas))
    tmp = out + ".tmp.mp4"
    fc = (f"[0:a]volume='if({cond},0,1)':eval=frame[o];"
          f"sine=frequency=1000:sample_rate=48000[s];[s]volume='if({cond},0.25,0)':eval=frame[b];"
          f"[o][b]amix=inputs=2:normalize=0:duration=first[a]")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", out, "-filter_complex", fc,
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", tmp], check=True)
    os.replace(tmp, out)
    print(f"Bip extra (sem legenda): {', '.join(faixas)}")


if __name__ == "__main__":
    main()
