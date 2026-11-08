#!/usr/bin/env python3
"""STUDIO MATTEU · Instagram · servidor MCP próprio (fase 1: SOMENTE LEITURA)

Servidor MCP por stdio (JSON-RPC 2.0), só com a biblioteca padrão do Python (sem dependências). Expõe apenas consultas;
não há nenhuma ferramenta que publique, responda, envie, oculte, exclua ou altere configurações.

  python3 studio/instagram/servidor_mcp.py              conexão real (bloqueada até autorização: CONEXAO_REAL_AUTORIZADA em api.py)
  python3 studio/instagram/servidor_mcp.py --simulado   dados fictícios, para testes offline

Comentários aparecem só na resposta da ferramenta (no chat); não são gravados em disco nem registrados.
"""
import json, os, sys, traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import api  # noqa: E402

PROTOCOLO = "2025-06-18"
SIMULADO = "--simulado" in sys.argv

FERRAMENTAS = [
    {"name": "ig_status", "description": "Instagram (somente leitura): conexão, conta, tipo de conta e modo (real/simulado).",
     "inputSchema": {"type": "object", "properties": {}}},
    {"name": "ig_perfil", "description": "Instagram (somente leitura): perfil da conta (seguidores, seguindo, nº de publicações).",
     "inputSchema": {"type": "object", "properties": {}}},
    {"name": "ig_publicacoes", "description": "Instagram (somente leitura): publicações recentes com curtidas e comentários.",
     "inputSchema": {"type": "object", "properties": {"limite": {"type": "integer", "minimum": 1, "maximum": 50, "default": 12}}}},
    {"name": "ig_publicacao", "description": "Instagram (somente leitura): detalhes e métricas de uma publicação ou Reel (views, alcance, interações, tempo assistido, taxa de pulo).",
     "inputSchema": {"type": "object", "properties": {"id": {"type": "string"}, "metricas": {"type": "boolean", "default": True}}, "required": ["id"]}},
    {"name": "ig_comentarios", "description": "Instagram (somente leitura): comentários de uma publicação. Só para leitura no chat; nada é gravado.",
     "inputSchema": {"type": "object", "properties": {"id": {"type": "string"}, "limite": {"type": "integer", "minimum": 1, "maximum": 50, "default": 50}}, "required": ["id"]}},
    {"name": "ig_metricas_conta", "description": "Instagram (somente leitura): totais da conta no período (até 30 dias) comparados ao período anterior.",
     "inputSchema": {"type": "object", "properties": {"dias": {"type": "integer", "minimum": 1, "maximum": 30, "default": 28}, "comparar": {"type": "boolean", "default": True}}}},
    {"name": "ig_cota_publicacao", "description": "Instagram (somente leitura): uso da cota de publicações via API nas últimas 24 h.",
     "inputSchema": {"type": "object", "properties": {}}},
]


def cliente():
    return api.Cliente(api.transporte_simulado if SIMULADO else None)


def executar(nome, args):
    c = cliente()
    if nome == "ig_status": return api.status(c)
    if nome == "ig_perfil": return api.perfil(c)
    if nome == "ig_publicacoes": return api.publicacoes(c, args.get("limite", 12))
    if nome == "ig_publicacao": return api.publicacao(c, str(args["id"]), args.get("metricas", True))
    if nome == "ig_comentarios": return api.comentarios(c, str(args["id"]), args.get("limite", 50))
    if nome == "ig_metricas_conta": return api.metricas_conta(c, args.get("dias", 28), args.get("comparar", True))
    if nome == "ig_cota_publicacao": return api.cota(c)
    raise api.Recusado(f"ferramenta desconhecida: {nome}")


def responder(pedido):
    metodo, pid = pedido.get("method"), pedido.get("id")
    if pid is None: return None                       # notificações (ex.: notifications/initialized) não têm resposta
    if metodo == "initialize":
        versao = (pedido.get("params") or {}).get("protocolVersion") or PROTOCOLO
        res = {"protocolVersion": versao, "capabilities": {"tools": {}},
               "serverInfo": {"name": "studio-matteu-instagram", "version": "1.0.0-leitura"},
               "instructions": "Somente leitura do Instagram do Studio Matteu (API oficial da Meta). Nenhuma ação altera a conta."}
    elif metodo == "ping": res = {}
    elif metodo == "tools/list": res = {"tools": FERRAMENTAS}
    elif metodo == "tools/call":
        p = pedido.get("params") or {}
        try:
            dados = executar(p.get("name"), p.get("arguments") or {})
            res = {"content": [{"type": "text", "text": json.dumps(dados, ensure_ascii=False, indent=1)}], "isError": False}
        except (api.Recusado, api.ErroAPI) as e:
            res = {"content": [{"type": "text", "text": api.limpar(f"{type(e).__name__}: {e}")}], "isError": True}
        except Exception as e:  # erro inesperado: mensagem limpa, sem rastro com dados
            res = {"content": [{"type": "text", "text": api.limpar(f"erro interno: {type(e).__name__}: {e}")}], "isError": True}
    else:
        return {"jsonrpc": "2.0", "id": pid, "error": {"code": -32601, "message": f"método não suportado: {metodo}"}}
    return {"jsonrpc": "2.0", "id": pid, "result": res}


def main():
    for linha in sys.stdin:
        linha = linha.strip()
        if not linha: continue
        try: pedido = json.loads(linha)
        except ValueError:
            print(json.dumps({"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "JSON inválido"}}), flush=True); continue
        try: r = responder(pedido)
        except Exception:
            r = {"jsonrpc": "2.0", "id": pedido.get("id"), "error": {"code": -32603, "message": api.limpar(traceback.format_exc(limit=1))}}
        if r is not None: print(json.dumps(r, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
