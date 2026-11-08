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

Ordem das travas em "gerar" (todas locais, ANTES de qualquer acesso à rede):
  argumentos e limites → código de aprovação → teto → arquivo de saída → (só então) estimativa e saldo pela API.
  Código inválido = recusa imediata, sem consultar saldo, modelos ou qualquer outro endpoint.

LIMITAÇÃO IMPORTANTE (auditoria M3): o "código de aprovação" é um resumo (SHA-256) do próprio pedido. Qualquer pessoa ou
agente que tenha o pedido consegue calculá-lo; portanto ele NÃO representa uma autorização humana real. Ele só garante
que o pedido gerado é exatamente o pedido mostrado ao usuário. A barreira efetiva contra gastar créditos continua sendo o
bloqueio ("deny") das ferramentas do MCP em .claude/settings.json, somado à regra de só rodar "gerar" depois da aprovação
do usuário no chat. Nenhum código calculável pelo próprio agente pode ser considerado suficiente como aprovação de ações
sensíveis (vale também para futuras publicações no Instagram). A ElevenLabs continua INATIVA por decisão do usuário.
"""
import argparse, hashlib, hmac, json, os, re, socket, sys, time, urllib.error, urllib.request

API = "https://api.elevenlabs.io"
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
REG = os.path.join(RAIZ, "studio", "elevenlabs", "registro.jsonl")
# Efeitos e música não têm tabela de preço na API: estimativa conservadora, conferida depois pelo saldo real.
EFEITO_POR_SEGUNDO, EFEITO_SEM_DURACAO, MUSICA_POR_SEGUNDO = 40, 200, 60
TETO_MAXIMO = 100_000                     # nenhum pedido aprovado pode passar disto
LIMITES = {"texto": 10_000, "descricao": 450, "prompt": 2_000, "efeito_dur": (0.5, 30.0), "musica_dur": (10.0, 300.0)}


class Recusa(SystemExit):
    """Recusa local: sai com mensagem, sem nenhum acesso à rede."""
    def __init__(self, msg): super().__init__(f"RECUSADO: {msg}")


def erro_rede(e):
    """Mensagem segura para falhas de conexão (sem cabeçalhos, URLs com parâmetros ou corpo de resposta)."""
    motivo = getattr(e, "reason", e)
    return SystemExit(f"ElevenLabs inacessível: falha de conexão ({type(motivo).__name__}). Nada foi gerado.")


def req(metodo, caminho, corpo=None, binario=False):
    dados = json.dumps(corpo).encode() if corpo is not None else None
    r = urllib.request.Request(API + caminho, data=dados, method=metodo, headers={
        "xi-api-key": "proxy-injected",  # marcador: o proxy substitui pelo valor guardado no cofre do ambiente
        "Content-Type": "application/json", "Accept": "audio/mpeg" if binario else "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=180) as resp:
            b = resp.read(); return b if binario else json.loads(b)
    except urllib.error.HTTPError as e:
        # só o código HTTP e o campo de status da API; o corpo pode repetir o pedido, então não é mostrado
        try: det = json.loads(e.read(4096) or b"{}").get("detail", {})
        except (ValueError, OSError): det = {}
        st = det.get("status") if isinstance(det, dict) else None
        raise SystemExit(f"ElevenLabs respondeu HTTP {e.code}" + (f" ({str(st)[:60]})" if st else "") + ". Nada foi gerado.")
    except (urllib.error.URLError, TimeoutError, socket.timeout, ConnectionError, OSError) as e:
        raise erro_rede(e)
    except ValueError:
        raise SystemExit("ElevenLabs devolveu uma resposta inválida. Nada foi gerado.")


def saldo():
    s = req("GET", "/v1/user/subscription")
    return {"plano": s.get("tier"), "usados": s.get("character_count"), "limite": s.get("character_limit"),
            "restante": (s.get("character_limit") or 0) - (s.get("character_count") or 0)}


def _faixa(v, nome, lo, hi):
    if v is None or not (lo <= v <= hi): raise Recusa(f"{nome} deve estar entre {lo:g} e {hi:g}")
    return v


def pedido(a):
    """Valida os argumentos (localmente) e normaliza o pedido; o código de aprovação depende exatamente disto."""
    if a.tipo == "narracao":
        if a.arquivo:
            if not os.path.isfile(a.arquivo): raise Recusa("--arquivo não encontrado")
            with open(a.arquivo, encoding="utf-8") as f: texto = f.read(LIMITES["texto"] + 1).strip()
        else: texto = (a.texto or "").strip()
        if not texto or not a.voz: raise Recusa("narração: informe --arquivo (ou --texto) e --voz")
        if len(texto) > LIMITES["texto"]: raise Recusa(f"texto acima de {LIMITES['texto']} caracteres")
        if not re.fullmatch(r"[A-Za-z0-9]{8,40}", a.voz): raise Recusa("--voz inválida")
        if not re.fullmatch(r"[a-z0-9_]{3,60}", a.modelo or ""): raise Recusa("--modelo inválido")
        return {"tipo": "narracao", "texto": texto, "voz": a.voz, "modelo": a.modelo}
    if a.tipo == "efeito":
        if not a.descricao or not a.descricao.strip(): raise Recusa("efeito: informe --descricao")
        if len(a.descricao) > LIMITES["descricao"]: raise Recusa(f"descrição acima de {LIMITES['descricao']} caracteres")
        if a.duracao is not None: _faixa(a.duracao, "--duracao", *LIMITES["efeito_dur"])
        return {"tipo": "efeito", "descricao": a.descricao, "duracao": a.duracao}
    if a.tipo == "musica":
        if not a.prompt or not a.prompt.strip(): raise Recusa("música: informe --prompt")
        if len(a.prompt) > LIMITES["prompt"]: raise Recusa(f"prompt acima de {LIMITES['prompt']} caracteres")
        _faixa(a.duracao, "--duracao", *LIMITES["musica_dur"])
        return {"tipo": "musica", "prompt": a.prompt, "duracao": a.duracao}
    raise Recusa("informe o tipo: narracao, efeito ou musica")


def estimativa_local(p):
    """Estimativa sem rede. Para narração é um limite inferior (o multiplicador do modelo só vem da API)."""
    if p["tipo"] == "narracao": return len(p["texto"])
    if p["tipo"] == "efeito": return round(p["duracao"] * EFEITO_POR_SEGUNDO) if p["duracao"] else EFEITO_SEM_DURACAO
    return round(p["duracao"] * MUSICA_POR_SEGUNDO)


def travas_locais(a, p):
    """Tudo o que pode recusar 'gerar' sem rede: código, teto e arquivo de saída. Chamada ANTES de qualquer requisição."""
    cod = codigo(p)
    if not a.aprovado or not hmac.compare_digest(str(a.aprovado).upper(), cod):
        raise Recusa("código de aprovação ausente ou diferente deste pedido.")
    if a.teto is None: raise Recusa("informe --teto (créditos máximos aprovados).")
    if not 1 <= a.teto <= TETO_MAXIMO: raise Recusa(f"--teto deve estar entre 1 e {TETO_MAXIMO}.")
    if estimativa_local(p) > a.teto: raise Recusa(f"estimativa mínima {estimativa_local(p)} acima do teto aprovado {a.teto}.")
    if not a.saida: raise Recusa("informe --saida.")
    if not a.saida.lower().endswith(".mp3"): raise Recusa("--saida deve terminar em .mp3")
    if os.path.lexists(a.saida): raise Recusa("--saida já existe (nada é sobrescrito).")
    pasta = os.path.dirname(os.path.abspath(a.saida))
    if os.path.exists(pasta) and not os.path.isdir(pasta): raise Recusa("a pasta de --saida não é uma pasta.")
    return cod


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
    if not a.tipo: raise Recusa("informe o tipo: narracao, efeito ou musica")
    p = pedido(a)                                         # 1. argumentos e limites (local)
    if a.acao == "gerar": travas_locais(a, p)             # 2. código, teto e saída (local) — antes de QUALQUER rede
    est, como = estimativa(p); s = saldo(); cod = codigo(p)   # 3. só agora: estimativa e saldo pela API

    if a.acao == "estimar":
        print(json.dumps({"pedido": {k: (v[:80] + "…" if isinstance(v, str) and len(v) > 80 else v) for k, v in p.items()},
                          "estimativa_creditos": est, "base": como, "saldo": s, "codigo_aprovacao": cod}, ensure_ascii=False, indent=1))
        print("\nNada foi gerado. Para gerar, o usuário precisa aprovar este pedido; depois use:\n"
              f"  gerar {p['tipo']} <mesmos argumentos> --aprovado {cod} --teto {est} --saida <arquivo.mp3>")
        return

    # gerar: travas que dependem da API (estimativa real e saldo), ainda antes de qualquer chamada que gaste créditos
    if est > a.teto: raise Recusa(f"estimativa {est} acima do teto aprovado {a.teto}.")
    if est > s["restante"]: raise Recusa(f"estimativa {est} acima do saldo restante {s['restante']}.")
    if p["tipo"] == "musica" and s["plano"] == "free": raise Recusa("a música da ElevenLabs exige plano pago.")

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
    with open(a.saida, "xb") as f: f.write(audio)           # "x": nunca sobrescreve um arquivo existente
    depois = saldo()["usados"]; gasto = depois - antes
    os.makedirs(os.path.dirname(REG), exist_ok=True)
    with open(REG, "a", encoding="utf-8") as f:
        f.write(json.dumps({"quando": time.strftime("%Y-%m-%d %H:%M:%S"), "tipo": p["tipo"], "codigo": cod, "estimativa": est,
                            "teto": a.teto, "gasto_real": gasto, "saida": os.path.relpath(os.path.abspath(a.saida), RAIZ)}, ensure_ascii=False) + "\n")
    print(json.dumps({"ok": a.saida, "estimativa": est, "gasto_real": gasto, "saldo_restante": (s["limite"] or 0) - depois}, ensure_ascii=False))
    if gasto > a.teto: print(f"ATENÇÃO: o gasto real ({gasto}) passou do teto aprovado ({a.teto}); avise o usuário.")


if __name__ == "__main__":
    main()
