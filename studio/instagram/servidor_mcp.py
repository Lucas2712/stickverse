#!/usr/bin/env python3
"""STUDIO MATTEU · Instagram · servidor MCP próprio (fase 1: SOMENTE LEITURA)

Servidor MCP por stdio (JSON-RPC 2.0), só com a biblioteca padrão do Python (sem dependências). Expõe apenas consultas;
não há nenhuma ferramenta que publique, responda, envie, oculte, exclua ou altere configurações.

  python3 studio/instagram/servidor_mcp.py              conexão real (bloqueada até autorização: CONEXAO_REAL_AUTORIZADA em api.py)
  python3 studio/instagram/servidor_mcp.py --simulado   dados fictícios (servidor "instagram-simulado" do .mcp.json); nunca usa a rede

Garantias do protocolo:
  - cada mensagem é validada (jsonrpc "2.0", id texto/inteiro, método texto, params objeto) e lotes são recusados;
  - os argumentos de cada ferramenta são validados contra o esquema (tipos, limites, IDs só com dígitos) e argumentos
    desconhecidos são recusados ANTES de qualquer consulta;
  - erros nunca devolvem rastros, mensagens internas nem a mensagem da Meta: só uma descrição segura;
  - stdout só carrega JSON-RPC; avisos vão para stderr, sem conteúdo.
Comentários aparecem só na resposta da ferramenta (no chat); não são gravados em disco nem registrados.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import api  # noqa: E402

PROTOCOLO = "2025-06-18"
SIMULADO = "--simulado" in sys.argv
MAX_LINHA = 1_000_000
AVISO_SIMULADO = "[SIMULADO: dados fictícios, nenhuma conexão com o Instagram]"

ID_MIDIA = {"type": "string", "pattern": "^[0-9]{1,30}$", "description": "ID numérico da publicação"}
FERRAMENTAS = [
    {"name": "ig_status", "description": "Instagram (somente leitura): conexão, conta, tipo de conta e modo (real/simulado).",
     "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False}},
    {"name": "ig_perfil", "description": "Instagram (somente leitura): perfil da conta (seguidores, seguindo, nº de publicações).",
     "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False}},
    {"name": "ig_publicacoes", "description": "Instagram (somente leitura): publicações recentes com curtidas e comentários.",
     "inputSchema": {"type": "object", "properties": {"limite": {"type": "integer", "minimum": 1, "maximum": 50, "default": 12}}, "additionalProperties": False}},
    {"name": "ig_publicacao", "description": "Instagram (somente leitura): detalhes e métricas de uma publicação ou Reel (views, alcance, interações, tempo assistido, taxa de pulo).",
     "inputSchema": {"type": "object", "properties": {"id": ID_MIDIA, "metricas": {"type": "boolean", "default": True}}, "required": ["id"], "additionalProperties": False}},
    {"name": "ig_comentarios", "description": "Instagram (somente leitura): comentários de uma publicação. Só para leitura no chat; nada é gravado.",
     "inputSchema": {"type": "object", "properties": {"id": ID_MIDIA, "limite": {"type": "integer", "minimum": 1, "maximum": 50, "default": 50}}, "required": ["id"], "additionalProperties": False}},
    {"name": "ig_metricas_conta", "description": "Instagram (somente leitura): totais da conta no período (1 a 30 dias) comparados ao período anterior.",
     "inputSchema": {"type": "object", "properties": {"dias": {"type": "integer", "minimum": 1, "maximum": 30, "default": 28}, "comparar": {"type": "boolean", "default": True}}, "additionalProperties": False}},
    {"name": "ig_cota_publicacao", "description": "Instagram (somente leitura): uso da cota de publicações via API nas últimas 24 h.",
     "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False}},
]
POR_NOME = {f["name"]: f for f in FERRAMENTAS}


class ArgumentoInvalido(Exception):
    pass


def validar_argumentos(nome, args):
    """Valida pelo esquema da ferramenta e devolve os argumentos com os padrões preenchidos. Nada é consultado antes disto."""
    esq = POR_NOME[nome]["inputSchema"]; props = esq["properties"]
    if not isinstance(args, dict): raise ArgumentoInvalido("arguments deve ser um objeto")
    extras = sorted(set(args) - set(props))
    if extras: raise ArgumentoInvalido(f"argumentos desconhecidos: {', '.join(x[:40] for x in extras)}")
    for r in esq.get("required", []):
        if r not in args: raise ArgumentoInvalido(f"argumento obrigatório ausente: {r}")
    saida = {}
    for k, d in props.items():
        v = args.get(k, d.get("default"))
        if v is None: continue
        if d["type"] == "integer":
            if isinstance(v, bool) or not isinstance(v, int): raise ArgumentoInvalido(f"{k} deve ser um número inteiro")
            if not d["minimum"] <= v <= d["maximum"]: raise ArgumentoInvalido(f"{k} fora do intervalo {d['minimum']}–{d['maximum']}")
        elif d["type"] == "boolean":
            if not isinstance(v, bool): raise ArgumentoInvalido(f"{k} deve ser verdadeiro ou falso")
        elif d["type"] == "string":
            if not isinstance(v, str) or not re.fullmatch(d["pattern"], v): raise ArgumentoInvalido(f"{k} inválido: use só dígitos")
        saida[k] = v
    return saida


def cliente():
    return api.Cliente(api.transporte_simulado if SIMULADO else api.transporte_real)


def executar(nome, a):
    c = cliente()
    if nome == "ig_status": return api.status(c)
    if nome == "ig_perfil": return api.perfil(c)
    if nome == "ig_publicacoes": return api.publicacoes(c, a["limite"])
    if nome == "ig_publicacao": return api.publicacao(c, a["id"], a["metricas"])
    if nome == "ig_comentarios": return api.comentarios(c, a["id"], a["limite"])
    if nome == "ig_metricas_conta": return api.metricas_conta(c, a["dias"], a["comparar"])
    if nome == "ig_cota_publicacao": return api.cota(c)


def erro(pid, codigo, msg):
    return {"jsonrpc": "2.0", "id": pid, "error": {"code": codigo, "message": msg}}


def resultado_ferramenta(texto, falhou):
    if SIMULADO: texto = f"{AVISO_SIMULADO}\n{texto}"
    return {"content": [{"type": "text", "text": texto}], "isError": falhou}


def chamar(params):
    nome, args = params.get("name"), params.get("arguments", {})
    try:
        a = validar_argumentos(nome, args)
    except ArgumentoInvalido as e:
        return resultado_ferramenta(f"Argumentos recusados: {e}", True)
    try:
        dados = executar(nome, a)
        return resultado_ferramenta(json.dumps(dados, ensure_ascii=False, indent=1), False)
    except api.Recusado as e:
        return resultado_ferramenta(f"Recusado: {e}", True)
    except api.ErroAPI as e:
        return resultado_ferramenta(e.resumo(), True)
    except Exception as e:
        print(f"aviso: erro interno em {nome} ({type(e).__name__})", file=sys.stderr)
        return resultado_ferramenta("Erro interno do servidor do Instagram (detalhes omitidos por segurança).", True)


def responder(pedido):
    """Uma mensagem JSON-RPC → resposta (ou None para notificações)."""
    if not isinstance(pedido, dict): return erro(None, -32600, "pedido inválido (lotes não são suportados)")
    tem_id = "id" in pedido; pid = pedido.get("id")
    if tem_id and (isinstance(pid, bool) or not isinstance(pid, (str, int))):
        return erro(None, -32600, "id inválido")
    if pedido.get("jsonrpc") != "2.0" or not isinstance(pedido.get("method"), str):
        return erro(pid if tem_id else None, -32600, "pedido inválido")
    metodo, params = pedido["method"], pedido.get("params", {})
    if not tem_id: return None                             # notificação: nunca responde (ex.: notifications/initialized)
    if not isinstance(params, dict): return erro(pid, -32602, "params deve ser um objeto")
    if metodo == "initialize":
        versao = params.get("protocolVersion") if isinstance(params.get("protocolVersion"), str) else PROTOCOLO
        res = {"protocolVersion": versao, "capabilities": {"tools": {}},
               "serverInfo": {"name": "studio-matteu-instagram" + ("-simulado" if SIMULADO else ""), "version": "1.1.0-leitura"},
               "instructions": ("DADOS FICTÍCIOS para testes. " if SIMULADO else "") +
                               "Somente leitura do Instagram do Studio Matteu (API oficial da Meta). Nenhuma ação altera a conta."}
    elif metodo == "ping": res = {}
    elif metodo == "tools/list": res = {"tools": FERRAMENTAS}
    elif metodo == "tools/call":
        nome = params.get("name")
        if not isinstance(nome, str) or nome not in POR_NOME: return erro(pid, -32602, "ferramenta desconhecida")
        if "arguments" in params and not isinstance(params["arguments"], dict): return erro(pid, -32602, "arguments deve ser um objeto")
        res = chamar(params)
    else:
        return erro(pid, -32601, "método não suportado")
    return {"jsonrpc": "2.0", "id": pid, "result": res}


def processar_linha(linha):
    if len(linha) > MAX_LINHA: return erro(None, -32600, "mensagem grande demais")
    try: pedido = json.loads(linha)
    except ValueError: return erro(None, -32700, "JSON inválido")
    try: return responder(pedido)
    except Exception as e:
        print(f"aviso: falha ao processar mensagem ({type(e).__name__})", file=sys.stderr)
        pid = pedido.get("id") if isinstance(pedido, dict) and isinstance(pedido.get("id"), (str, int)) and not isinstance(pedido.get("id"), bool) else None
        return erro(pid, -32603, "erro interno")


def main():
    for linha in sys.stdin:
        linha = linha.strip()
        if not linha: continue
        r = processar_linha(linha)
        if r is not None: print(json.dumps(r, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
