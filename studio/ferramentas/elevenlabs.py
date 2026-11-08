#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · ElevenLabs com trava de créditos
Única porta do estúdio para gerar áudio na ElevenLabs. As ferramentas do servidor MCP que gastam créditos ficam
BLOQUEADAS em .claude/settings.json (o bloqueio vale em qualquer modo de permissão); a geração passa por aqui.

Fluxo obrigatório (regra 10 do CLAUDE.md):
  1. estimar  → mostra o pedido, a estimativa de créditos, o saldo e um CÓDIGO DE APROVAÇÃO ligado a esse pedido exato
  2. o usuário aprova no chat (o código e a estimativa são mostrados a ele)
  3. gerar    → só roda com o mesmo pedido + o código + um teto de créditos; confere o saldo antes e depois e registra

Uso:
  python3 studio/ferramentas/elevenlabs.py saldo
  python3 studio/ferramentas/elevenlabs.py vozes [--busca texto]
  python3 studio/ferramentas/elevenlabs.py estimar narracao --arquivo roteiro.txt --voz VOICE_ID [--modelo eleven_multilingual_v2]
  python3 studio/ferramentas/elevenlabs.py estimar efeito --descricao "whoosh metálico rápido" --duracao 1.5
  python3 studio/ferramentas/elevenlabs.py estimar musica --prompt "..." --duracao 60
  python3 studio/ferramentas/elevenlabs.py gerar  <mesmos argumentos> --aprovado CODIGO --teto N --saida caminho.mp3

A chave nunca passa por aqui: o proxy do ambiente "stickverse" injeta o cabeçalho xi-api-key em api.elevenlabs.io.
Registro de cada geração (sem credenciais): studio/elevenlabs/registro.jsonl (fora do git).
"""
import argparse, hashlib, json, os, sys, time, urllib.error, urllib.request

API = "https://api.elevenlabs.io"
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
REG = os.path.join(RAIZ, "studio", "elevenlabs", "registro.jsonl")
# Efeitos e música não têm tabela de preço na API: estimativa conservadora, conferida depois pelo saldo real.
EFEITO_POR_SEGUNDO, EFEITO_SEM_DURACAO, MUSICA_POR_SEGUNDO = 40, 200, 60


def req(metodo, caminho, corpo=None, binario=False):
    dados = json.dumps(corpo).encode() if corpo is not None else None
    r = urllib.request.Request(API + caminho, data=dados, method=metodo, headers={
        "xi-api-key": "proxy-injected",  # marcador: o proxy substitui pelo valor guardado no cofre do ambiente
        "Content-Type": "application/json", "Accept": "audio/mpeg" if binario else "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=180) as resp:
            b = resp.read(); return b if binario else json.loads(b)
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs respondeu {e.code}: {e.read().decode(errors='replace')[:400]}")


def saldo():
    s = req("GET", "/v1/user/subscription")
    return {"plano": s.get("tier"), "usados": s.get("character_count"), "limite": s.get("character_limit"),
            "restante": (s.get("character_limit") or 0) - (s.get("character_count") or 0)}


def pedido(a):
    """Normaliza o pedido (o código de aprovação depende exatamente disto)."""
    if a.tipo == "narracao":
        texto = open(a.arquivo, encoding="utf-8").read().strip() if a.arquivo else (a.texto or "").strip()
        if not texto or not a.voz: sys.exit("narração: informe --arquivo (ou --texto) e --voz")
        return {"tipo": "narracao", "texto": texto, "voz": a.voz, "modelo": a.modelo}
    if a.tipo == "efeito":
        if not a.descricao: sys.exit("efeito: informe --descricao")
        return {"tipo": "efeito", "descricao": a.descricao, "duracao": a.duracao}
    if a.tipo == "musica":
        if not a.prompt or not a.duracao: sys.exit("música: informe --prompt e --duracao")
        return {"tipo": "musica", "prompt": a.prompt, "duracao": a.duracao}


def estimativa(p):
    if p["tipo"] == "narracao":
        m = next((x for x in req("GET", "/v1/models") if x["model_id"] == p["modelo"]), None)
        if not m: sys.exit(f"modelo desconhecido: {p['modelo']}")
        r = m.get("model_rates") or {}
        mult = (r.get("character_cost_multiplier") or 1) * (r.get("cost_discount_multiplier") or 1)
        return round(len(p["texto"]) * mult), f"{len(p['texto'])} caracteres × {mult} ({p['modelo']}), conforme a API"
    if p["tipo"] == "efeito":
        if p["duracao"]: return round(p["duracao"] * EFEITO_POR_SEGUNDO), f"{p['duracao']} s × {EFEITO_POR_SEGUNDO} (aproximada; confirmada pelo saldo depois)"
        return EFEITO_SEM_DURACAO, "duração automática (aproximada; confirmada pelo saldo depois)"
    return round(p["duracao"] * MUSICA_POR_SEGUNDO), f"{p['duracao']} s × {MUSICA_POR_SEGUNDO} (aproximada; a música exige plano pago)"


def codigo(p):
    return hashlib.sha256(json.dumps(p, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:8].upper()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("acao", choices=["saldo", "vozes", "estimar", "gerar"])
    ap.add_argument("tipo", nargs="?", choices=["narracao", "efeito", "musica"])
    ap.add_argument("--texto"); ap.add_argument("--arquivo"); ap.add_argument("--voz")
    ap.add_argument("--modelo", default="eleven_multilingual_v2")
    ap.add_argument("--descricao"); ap.add_argument("--prompt"); ap.add_argument("--duracao", type=float)
    ap.add_argument("--aprovado"); ap.add_argument("--teto", type=int); ap.add_argument("--saida"); ap.add_argument("--busca")
    a = ap.parse_args()

    if a.acao == "saldo": print(json.dumps(saldo(), ensure_ascii=False)); return
    if a.acao == "vozes":
        v = req("GET", "/v1/voices")["voices"]
        for x in v:
            if not a.busca or a.busca.lower() in (x["name"] + json.dumps(x.get("labels", {}))).lower():
                print(x["voice_id"], "·", x["name"], "·", ", ".join(f"{k}: {w}" for k, w in (x.get("labels") or {}).items()))
        return
    if not a.tipo: sys.exit("informe o tipo: narracao, efeito ou musica")
    p = pedido(a); est, como = estimativa(p); s = saldo(); cod = codigo(p)

    if a.acao == "estimar":
        print(json.dumps({"pedido": {k: (v[:80] + "…" if isinstance(v, str) and len(v) > 80 else v) for k, v in p.items()},
                          "estimativa_creditos": est, "base": como, "saldo": s, "codigo_aprovacao": cod}, ensure_ascii=False, indent=1))
        print("\nNada foi gerado. Para gerar, o usuário precisa aprovar este pedido; depois use:\n"
              f"  gerar {p['tipo']} <mesmos argumentos> --aprovado {cod} --teto {est} --saida <arquivo.mp3>")
        return

    # gerar: todas as travas antes de qualquer chamada que gaste créditos
    if a.aprovado != cod: sys.exit(f"RECUSADO: código de aprovação ausente ou diferente deste pedido (esperado o código mostrado por 'estimar').")
    if a.teto is None: sys.exit("RECUSADO: informe --teto (créditos máximos aprovados).")
    if est > a.teto: sys.exit(f"RECUSADO: estimativa {est} acima do teto aprovado {a.teto}.")
    if est > s["restante"]: sys.exit(f"RECUSADO: estimativa {est} acima do saldo restante {s['restante']}.")
    if p["tipo"] == "musica" and s["plano"] == "free": sys.exit("RECUSADO: a música da ElevenLabs exige plano pago.")
    if not a.saida: sys.exit("RECUSADO: informe --saida.")

    antes = s["usados"]
    if p["tipo"] == "narracao":
        audio = req("POST", f"/v1/text-to-speech/{p['voz']}?output_format=mp3_44100_128", {"text": p["texto"], "model_id": p["modelo"]}, binario=True)
    elif p["tipo"] == "efeito":
        corpo = {"text": p["descricao"]}
        if p["duracao"]: corpo["duration_seconds"] = p["duracao"]
        audio = req("POST", "/v1/sound-generation?output_format=mp3_44100_128", corpo, binario=True)
    else:
        audio = req("POST", "/v1/music?output_format=mp3_44100_128", {"prompt": p["prompt"], "music_length_ms": int(p["duracao"] * 1000)}, binario=True)
    os.makedirs(os.path.dirname(os.path.abspath(a.saida)), exist_ok=True)
    open(a.saida, "wb").write(audio)
    depois = saldo()["usados"]; gasto = depois - antes
    os.makedirs(os.path.dirname(REG), exist_ok=True)
    with open(REG, "a", encoding="utf-8") as f:
        f.write(json.dumps({"quando": time.strftime("%Y-%m-%d %H:%M:%S"), "tipo": p["tipo"], "codigo": cod, "estimativa": est,
                            "teto": a.teto, "gasto_real": gasto, "saida": os.path.relpath(os.path.abspath(a.saida), RAIZ)}, ensure_ascii=False) + "\n")
    print(json.dumps({"ok": a.saida, "estimativa": est, "gasto_real": gasto, "saldo_restante": (s["limite"] or 0) - depois}, ensure_ascii=False))
    if gasto > a.teto: print(f"ATENÇÃO: o gasto real ({gasto}) passou do teto aprovado ({a.teto}); avise o usuário.")


if __name__ == "__main__":
    main()
