#!/usr/bin/env python3
"""STUDIO MATTEU · Instagram pela linha de comando (fase 1: SOMENTE LEITURA)

Mesmas consultas do servidor MCP (studio/instagram/servidor_mcp.py), sem nenhuma ação que altere a conta.

  python3 studio/ferramentas/instagram.py [--simulado] status
  python3 studio/ferramentas/instagram.py [--simulado] perfil
  python3 studio/ferramentas/instagram.py [--simulado] publicacoes [--limite 12]
  python3 studio/ferramentas/instagram.py [--simulado] publicacao ID
  python3 studio/ferramentas/instagram.py [--simulado] comentarios ID [--limite 50]   (só mostra; nada é gravado)
  python3 studio/ferramentas/instagram.py [--simulado] metricas [--dias 28]
  python3 studio/ferramentas/instagram.py [--simulado] cota
  python3 studio/ferramentas/instagram.py [--simulado] relatorio [--dias 28] [--n 12]  → studio/instagram/dados/relatorios/ (fora do git)

Sem --simulado, usa a conexão real, que fica bloqueada até a autorização do usuário (CONEXAO_REAL_AUTORIZADA em api.py).
"""
import argparse, json, os, sys
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "instagram"))
import api  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--simulado", action="store_true", help="dados fictícios (offline)")
    ap.add_argument("acao", choices=["status", "perfil", "publicacoes", "publicacao", "comentarios", "metricas", "cota", "relatorio"])
    ap.add_argument("id", nargs="?")
    ap.add_argument("--limite", type=int); ap.add_argument("--dias", type=int, default=28); ap.add_argument("--n", type=int, default=12)
    a = ap.parse_args()
    c = api.Cliente(api.transporte_simulado if a.simulado else None)
    try:
        if a.acao in ("publicacao", "comentarios") and not a.id: sys.exit(f"{a.acao}: informe o ID da publicação")
        if a.acao == "relatorio":
            txt = api.relatorio_markdown(c, a.dias, a.n)
            pasta = os.path.join(api.DADOS, "relatorios"); os.makedirs(pasta, mode=0o700, exist_ok=True)
            arq = os.path.join(pasta, f"relatorio-{datetime.now():%Y%m%d-%H%M}{'-simulado' if a.simulado else ''}.md")
            open(arq, "w", encoding="utf-8").write(txt); os.chmod(arq, 0o600)
            print(txt); print(f"salvo em {os.path.relpath(arq)} (fora do git)"); return
        r = {"status": lambda: api.status(c), "perfil": lambda: api.perfil(c),
             "publicacoes": lambda: api.publicacoes(c, a.limite or 12), "publicacao": lambda: api.publicacao(c, a.id),
             "comentarios": lambda: api.comentarios(c, a.id, a.limite or 50), "metricas": lambda: api.metricas_conta(c, a.dias),
             "cota": lambda: api.cota(c)}[a.acao]()
        print(json.dumps(r, ensure_ascii=False, indent=1))
    except (api.Recusado, api.ErroAPI) as e:
        sys.exit(api.limpar(f"{type(e).__name__}: {e}"))


if __name__ == "__main__":
    main()
