#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · sons (Openverse → biblioteca do estúdio, com licença conferida na fonte)

  python3 studio/ferramentas/sons.py buscar "whoosh" [--tipo whoosh] [--n 10] [--fonte freesound|wikimedia_audio]
  python3 studio/ferramentas/sons.py baixar <id-openverse> --tipo whoosh [--nome curto]
  python3 studio/ferramentas/sons.py creditos [projetos/<nome>]     # gera CREDITOS-SONS.md (biblioteca ou um projeto)

Regras de licença do canal (nunca relaxar):
  1. CC0 (e Public Domain Mark) primeiro; CC BY só sem alternativa CC0, sempre com atribuição.
  2. Proibidas: qualquer NC (não comercial), ND (sem derivações) e SA (compartilha igual).
  3. A licença é conferida na PÁGINA DE ORIGEM do arquivo, não só no Openverse. Sem confirmação, o arquivo não entra.
  4. Cada arquivo baixado é registrado em studio/sons/creditos.json: nome, autor, origem, licença, link, data.
"""
import json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request
from datetime import date

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEST = os.path.join(RAIZ, "studio", "sons", "openverse")
CRED = os.path.join(RAIZ, "studio", "sons", "creditos.json")
UA = "stickverse-motion-studio/1.0 (+https://github.com/Lucas2712/stickverse)"
PERMITIDAS = {"cc0": "CC0 1.0", "pdm": "Public Domain Mark 1.0", "by": "CC BY"}
TIPOS = ["whoosh", "impact", "riser", "pop", "chime", "click", "typing", "glitch", "camera", "paper", "glass",
         "foley", "error", "water", "coin", "ui", "ambience"]


def get(url, binario=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        d = r.read()
    return d if binario else d.decode("utf-8", "replace")


def openverse(params):
    return json.loads(get("https://api.openverse.org/v1/audio/?" + urllib.parse.urlencode(params)))


def conferir(item):
    """Lê a licença na página de origem. Devolve (licença normalizada ou None, autor, detalhe)."""
    prov, url = item.get("provider"), item.get("foreign_landing_url", "")
    try:
        if prov == "freesound":
            html = get(url)
            m = re.search(r'href="https?://creativecommons\.org/(publicdomain/zero|licenses/[a-z-]+)/([\d.]+)/?"', html)
            if not m: return None, item.get("creator"), "licença não encontrada na página do Freesound"
            k = "cc0" if "zero" in m.group(1) else m.group(1).split("/")[-1]
            return k, item.get("creator"), f"página do Freesound: {m.group(0)}"
        if prov == "wikimedia_audio":
            titulo = urllib.parse.unquote(url.rsplit("/", 1)[-1])
            api = ("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles="
                   + urllib.parse.quote(titulo))
            meta = list(json.loads(get(api))["query"]["pages"].values())[0]["imageinfo"][0]["extmetadata"]
            lic = (meta.get("LicenseShortName", {}).get("value") or "").lower()
            autor = re.sub("<[^>]+>", "", meta.get("Artist", {}).get("value", "")).strip()
            if "cc0" in lic or "public domain" in lic: return "cc0", autor, f"Wikimedia Commons: {lic}"
            m = re.match(r"cc[ -]by(-[a-z-]+)?[ -]?([\d.]+)?", lic)
            if m: return ("by" + (m.group(1) or "")).replace("by-", "by-") if m.group(1) else "by", autor, f"Wikimedia Commons: {lic}"
            return None, autor, f"Wikimedia Commons: licença não reconhecida ({lic})"
    except Exception as e:
        return None, item.get("creator"), f"não foi possível ler a página de origem ({type(e).__name__}: {str(e)[:80]})"
    return None, item.get("creator"), f"fonte sem conferência implementada: {prov}"


def buscar(q, n=10, fonte=None):
    vistos = []
    for lic in ("cc0,pdm", "by"):                      # CC0 primeiro; CC BY só depois
        p = {"q": q, "license": lic, "page_size": n}
        if fonte: p["source"] = fonte
        for r in openverse(p)["results"]:
            # fora: música, pronúncias de palavras, podcasts (o Openverse marca a categoria quando sabe)
            if r.get("category") in ("music", "pronunciation", "podcast", "audiobook", "news"): continue
            if (r.get("duration") or 0) > 30000: continue
            vistos.append(r)
    for r in vistos[:2 * n]:
        print(f"{r['id']}  {r['license']:>4} {r.get('license_version') or '':4} {((r.get('duration') or 0) / 1000):5.1f}s  "
              f"{r['provider']:<16} {r['title'][:46]}  · {r.get('creator') or '?'}")
    return vistos


def baixar(oid, tipo, nome=None):
    if tipo not in TIPOS: sys.exit(f"tipo inválido: {tipo} (use {', '.join(TIPOS)})")
    item = json.loads(get(f"https://api.openverse.org/v1/audio/{oid}/"))
    if item.get("license") not in PERMITIDAS:
        sys.exit(f"recusado: licença {item.get('license')} no Openverse não é permitida pelas regras do canal")
    lic, autor, det = conferir(item)
    if lic not in PERMITIDAS:
        sys.exit(f"recusado: licença não confirmada na origem ({det})")
    if lic != item["license"]:
        sys.exit(f"recusado: Openverse diz {item['license']}, a página de origem diz {lic} ({det})")
    nome = nome or re.sub(r"[^a-z0-9]+", "-", item["title"].lower())[:40].strip("-")
    rel = f"{tipo}/{tipo}_{nome}_{item['provider'][:2]}{oid[:6]}.flac"
    alvo = os.path.join(DEST, rel); os.makedirs(os.path.dirname(alvo), exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        bruto = os.path.join(td, "orig")
        open(bruto, "wb").write(get(item["url"], binario=True))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", bruto, "-ar", "48000", "-sample_fmt", "s16", alvo], check=True)
    cred = json.load(open(CRED, encoding="utf-8")) if os.path.exists(CRED) else []
    cred = [c for c in cred if c.get("arquivo") != "studio/sons/openverse/" + rel]
    cred.append({"arquivo": "studio/sons/openverse/" + rel, "nome": item["title"], "origem": f"openverse/{item['provider']}",
                 "tipo": tipo, "autor": autor or item.get("creator"), "licenca": PERMITIDAS[lic] + (f" {item.get('license_version')}" if lic == "by" else ""),
                 "licenca_url": item.get("license_url"), "fonte": item["foreign_landing_url"], "openverse_id": oid,
                 "conferencia": det, "verificado_em": str(date.today()), "editado": "convertido para FLAC 48 kHz; recortado/sincronizado no vídeo"})
    json.dump(cred, open(CRED, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"ok {rel}  ({PERMITIDAS[lic]}, {autor})")


def creditos(proj=None):
    cred = json.load(open(CRED, encoding="utf-8")) if os.path.exists(CRED) else []
    usados = None
    if proj:
        f = os.path.join(proj, "saida", "sfx-real", "usados.json")
        usados = set(json.load(open(f))) if os.path.exists(f) else set()
    linhas = ["# Créditos dos efeitos sonoros", "", "| efeito | autor | origem | licença | link |", "|---|---|---|---|---|"]
    for c in cred:
        if usados is not None and c["arquivo"] not in usados: continue
        base = c.get("baseado_em")
        extra = f" (receita medida de «{base['titulo']}», {base['autor']}, {base['licenca']}, {base['fonte']})" if base else ""
        linhas.append(f"| {c['nome']} | {c['autor']}{extra} | {c['origem']} | {c['licenca']} | {c['fonte']} |")
    out = os.path.join(proj or os.path.join(RAIZ, "studio", "sons"), "CREDITOS-SONS.md")
    open(out, "w", encoding="utf-8").write("\n".join(linhas) + "\n")
    print("ok", os.path.relpath(out, RAIZ), f"({len(linhas) - 4} efeitos)")


if __name__ == "__main__":
    a = sys.argv[1:]
    op = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    if not a: sys.exit(__doc__)
    if a[0] == "buscar": buscar(a[1], int(op("--n", 10)), op("--fonte"))
    elif a[0] == "baixar": baixar(a[1], op("--tipo", "other"), op("--nome"))
    elif a[0] == "creditos": creditos(a[1] if len(a) > 1 else None)
    else: sys.exit(__doc__)
