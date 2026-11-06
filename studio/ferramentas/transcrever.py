#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · transcrever
Transcreve a narração com o tempo de cada palavra (faster-whisper, modelo small, CPU) e corrige o texto
pelo roteiro: a grafia vem do roteiro, os tempos vêm do áudio.

Uso: python3 studio/ferramentas/transcrever.py projetos/<nome>
Lê:  narracao.(mp3|wav|m4a|aac|ogg) e roteiro.md (opcional, mas recomendado)
Gera: palavras.json  ([{w, s, e}] em segundos)
      transcricao.md (texto, correções feitas, pausas úteis para cortes de cena, duração)

Modelo: $MDS_WHISPER, ou /opt/mds/whisper-small (instalado pelo script de preparação do ambiente).
"""
import difflib, json, os, re, subprocess, sys, unicodedata

AUDIO_EXT = (".mp3", ".wav", ".m4a", ".aac", ".ogg")
MODELOS = [os.environ.get("MDS_WHISPER", ""), "/opt/mds/whisper-small"]


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^\w]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))


def texto_roteiro(md):
    linhas = []
    for L in md.splitlines():
        L = L.strip()
        if not L or L.startswith(("#", ">", "|", "---", "<!--")): continue
        L = re.sub(r"\[[^\]]*\]|\([^)]*\)", " ", L)          # [marcações] e (rubricas) não são faladas
        L = re.sub(r"[*_`]", "", L)
        linhas.append(L)
    return " ".join(linhas).split()


def duracao(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True)
    return float(r.stdout.strip())


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    proj = os.path.abspath(sys.argv[1])
    narr = next((os.path.join(proj, "narracao" + e) for e in AUDIO_EXT if os.path.exists(os.path.join(proj, "narracao" + e))), None)
    if not narr: sys.exit("narração não encontrada: salve como projetos/<nome>/narracao.mp3")
    modelo = next((m for m in MODELOS if m and os.path.exists(os.path.join(m, "model.bin"))), None)
    if not modelo: sys.exit("modelo de transcrição não encontrado em /opt/mds/whisper-small. Rode studio/ferramentas/preparar_ambiente.sh")

    import numpy as np
    from faster_whisper import WhisperModel
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", narr, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)
    m = WhisperModel(modelo, device="cpu", compute_type="int8")
    roteiro_p = os.path.join(proj, "roteiro.md")
    script = texto_roteiro(open(roteiro_p, encoding="utf-8").read()) if os.path.exists(roteiro_p) else []
    prompt = " ".join(script[:120]) if script else None
    segs, _ = m.transcribe(audio, language="pt", word_timestamps=True, beam_size=5, initial_prompt=prompt)
    ws = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words if w.word.strip()]

    correcoes, final = [], []
    if script:
        A, B = [norm(x["w"]) for x in ws], [norm(x) for x in script]
        for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
            if op == "equal":
                final += [{"w": script[j1 + k], "s": ws[i1 + k]["s"], "e": ws[i1 + k]["e"]} for k in range(i2 - i1)]
            elif op == "replace":
                ouv = " ".join(x["w"] for x in ws[i1:i2]); esc = " ".join(script[j1:j2])
                if i2 - i1 == j2 - j1:
                    final += [{"w": script[j1 + k], "s": ws[i1 + k]["s"], "e": ws[i1 + k]["e"]} for k in range(i2 - i1)]
                else:   # distribui as palavras do roteiro no trecho ouvido, proporcional ao tamanho
                    s0, e0 = ws[i1]["s"], ws[i2 - 1]["e"]; tot = sum(len(x) + 1 for x in script[j1:j2]); acc = 0
                    for x in script[j1:j2]:
                        a = s0 + (e0 - s0) * acc / tot; acc += len(x) + 1
                        final.append({"w": x, "s": round(a, 3), "e": round(s0 + (e0 - s0) * acc / tot, 3)})
                correcoes.append(f"ouvido «{ouv}» → roteiro «{esc}»")
            elif op == "delete":
                final += ws[i1:i2]; correcoes.append(f"falado mas não está no roteiro: «{' '.join(x['w'] for x in ws[i1:i2])}» (mantido)")
            elif op == "insert":
                correcoes.append(f"no roteiro mas não foi ouvido: «{' '.join(script[j1:j2])}» (sem tempo, fora das legendas)")
    else:
        final = ws
    json.dump(final, open(os.path.join(proj, "palavras.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)

    dur = duracao(narr)
    pausas = [(final[i]["e"], final[i + 1]["s"], final[i]["w"], final[i + 1]["w"]) for i in range(len(final) - 1) if final[i + 1]["s"] - final[i]["e"] >= .3]
    with open(os.path.join(proj, "transcricao.md"), "w", encoding="utf-8") as f:
        f.write(f"# Transcrição\n\nDuração da narração: **{dur:.2f} s** · {len(final)} palavras · {len(final) / max(dur, 1):.1f} palavras/s\n\n")
        f.write("## Texto\n\n" + " ".join(x["w"] for x in final) + "\n\n")
        f.write("## Correções pelo roteiro\n\n" + ("\n".join(f"- {c}" for c in correcoes) if correcoes else "- nenhuma") + "\n\n")
        f.write("## Pausas (candidatas a corte de cena)\n\n| de | até | pausa | entre |\n|---|---|---|---|\n")
        for a, b, x, y in pausas: f.write(f"| {a:.2f} | {b:.2f} | {b - a:.2f} s | «{x}» → «{y}» |\n")
        f.write("\n## Palavras com tempo\n\n" + " ".join(f"{x['w']}@{x['s']:.2f}" for x in final) + "\n")
    print(f"ok {len(final)} palavras, {dur:.2f} s, {len(correcoes)} correções, {len(pausas)} pausas → transcricao.md")
    for c in correcoes: print("  ·", c)


if __name__ == "__main__":
    main()
