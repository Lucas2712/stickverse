#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · biblioteca_earshot
Renderiza o banco de efeitos do Earshot (252 sons feitos em código, licença MIT) para a biblioteca do estúdio,
organizado por tipo, com catálogo para o Real SFX e créditos.

Uso: python3 studio/ferramentas/biblioteca_earshot.py [--forcar]
Saída: studio/sons/earshot/<tipo>/<id>.flac · studio/sons/earshot/catalog.csv · entradas em studio/sons/creditos.json
Precisa do Earshot instalado (`earshot sfx list`): o script de preparação do ambiente instala.
"""
import csv, json, os, re, subprocess, sys, tempfile
from datetime import date

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEST = os.path.join(RAIZ, "studio", "sons", "earshot")
CRED = os.path.join(RAIZ, "studio", "sons", "creditos.json")

# tipo do Earshot (primeira "kind") → tipo do catálogo do Real SFX (PACK_TYPE_ROLES em real-sfx/scripts/common.py)
TIPO = {"whoosh.long": "whoosh", "whoosh.short": "whoosh", "zip": "whoosh", "glitch": "glitch", "drop": "impact",
        "hit": "impact", "swell": "riser", "riser": "riser", "pop": "pop", "sting": "chime", "key.run": "typing",
        "key.space": "typing", "key": "typing", "tick": "click", "tock": "foley", "click": "click",
        "click.confirm": "click", "shimmer": "chime", "bell": "chime", "land.light": "foley", "text": "chime"}
# as 15 receitas "fit" foram medidas de gravações CC0 do Freesound (docs/CREDITS_FIT.md do Earshot)
FIT = {"fit/bell/small_bell": ("Small Bell #2", "steffcaffrey", 452379), "fit/click/floss_lid": ("Plastic Clicks.flac", "qubodup", 167829),
       "fit/hit/bamboo_tok": ("Bamboo hit", "michorvath", 386888), "fit/key.space/thock_space": ("Keychron k10 space_bar", "Sadiquecat", 789630),
       "fit/key/lubed": ("Keyboard typing sounds: Unidentified Technics keyboard", "zrrion", 665075), "fit/key/medium": ("mechanical key medium.wav", "bigmonmulgrew", 378084),
       "fit/key/thock": ("Keychron k10 A to + individual keys", "Sadiquecat", 789628), "fit/land.light/finger_phone": ("Finger Tapping Phone", "jentlemen", 704862),
       "fit/land.light/finger_wood": ("finger tap table counter wood various.wav", "kyles", 452621), "fit/land.light/fingertip_book": ("Light Footsteps On Book", "IENBA", 760337),
       "fit/pop/lip_pop": ("Pop sound", "deraj", 202230), "fit/pop/mouth_plop": ("Mouth Plops.wav", "CapsLok", 181907),
       "fit/snap/switch_flip": ("Switch Flip #1", "IanStarGem", 278205), "fit/tick/domino": ("Domino pieces hit", "Macif", 329098),
       "fit/whoosh.short/bamboo_swish": ("Short Whoosh, 13x", "Kinoton", 427979)}


def lista():
    out = subprocess.run(["earshot", "sfx", "list"], capture_output=True, text=True, check=True).stdout.splitlines()
    sons = []
    for L in out:
        m = re.match(r"^(\S+/\S+)\s+[\d.]+\s+[\d.]+\s+(\S+)", L)
        if m: sons.append((m.group(1), m.group(2).split("|")[0].split(",")[0]))
    return sons


def main():
    forcar = "--forcar" in sys.argv
    versao = subprocess.run(["earshot", "sfx", "list"], capture_output=True, text=True).stdout.split("bank ")[-1].split(" ")[0]
    cred = json.load(open(CRED, encoding="utf-8")) if os.path.exists(CRED) else []
    cred = [c for c in cred if c.get("origem") != "earshot"]
    linhas, n = [], 0
    for sid, kind in lista():
        tipo = TIPO.get(kind, "other")
        nome = re.sub(r"[^a-z0-9]+", "-", sid.lower()).strip("-")
        # o nome do arquivo carrega o tipo, para as regras de papel do Real SFX também acharem pelo nome
        rel = f"{tipo}/{tipo}_{nome}.flac"
        alvo = os.path.join(DEST, rel)
        if forcar or not os.path.exists(alvo):
            os.makedirs(os.path.dirname(alvo), exist_ok=True)
            with tempfile.TemporaryDirectory() as td:
                w = os.path.join(td, "x.wav")
                r = subprocess.run(["earshot", "sfx", "render", sid, "-o", w], capture_output=True, text=True)
                if r.returncode or not os.path.exists(w): print("falhou:", sid, r.stderr.strip()[:120]); continue
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-ar", "48000", "-sample_fmt", "s16", "-compression_level", "8", alvo], check=True)
            n += 1
        linhas.append({"file": rel, "type": tipo, "source": sid, "hit": "", "hits_in_source": ""})
        e = {"arquivo": "studio/sons/earshot/" + rel, "nome": sid, "origem": "earshot", "tipo": tipo,
             "autor": "Leon Lin (earshot), som feito em código", "licenca": "MIT (código do Earshot; sem gravação embutida)",
             "fonte": "https://github.com/Leonxlnx/earshot", "versao_banco": versao, "verificado_em": str(date.today())}
        if sid in FIT:
            t, a, i = FIT[sid]
            e["baseado_em"] = {"titulo": t, "autor": a, "licenca": "CC0 1.0", "fonte": f"https://freesound.org/people/{a}/sounds/{i}/",
                               "nota": "receita medida da gravação; nenhuma amostra da gravação é usada (docs/CREDITS_FIT.md do Earshot)"}
        cred.append(e)
    with open(os.path.join(DEST, "catalog.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["file", "type", "source", "hit", "hits_in_source"]); w.writeheader(); w.writerows(linhas)
    json.dump(cred, open(CRED, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"ok {len(linhas)} sons no catálogo ({n} renderizados agora) → {os.path.relpath(DEST, RAIZ)}")


if __name__ == "__main__":
    main()
