#!/usr/bin/env python3
"""STUDIO MATTEU · Instagram · testes OFFLINE (fase 1)

Nenhum teste usa a rede: abrir conexão (socket ou urllib) faz o teste falhar. Todas as respostas são simuladas.
Os registros de teste vão para uma pasta temporária, não para studio/instagram/dados/.

  python3 -I studio/instagram/teste_offline.py
"""
import json, os, socket, subprocess, sys, tempfile, unittest, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import api  # noqa: E402
import servidor_mcp  # noqa: E402

TOKEN_FALSO = "IGAAT" + "x" * 60


def _sem_rede(*a, **k): raise AssertionError("tentativa de acesso à rede durante teste offline")


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self._orig = (api.DADOS, api.REGISTRO, socket.socket.connect, urllib.request.urlopen)
        api.DADOS = self.tmp; api.REGISTRO = os.path.join(self.tmp, "consultas.jsonl")
        socket.socket.connect = _sem_rede; urllib.request.urlopen = _sem_rede
        self.urls = []

    def tearDown(self):
        api.DADOS, api.REGISTRO, socket.socket.connect, urllib.request.urlopen = self._orig

    def cliente(self, transporte=None):
        def gravar(url, cab):
            self.urls.append((url, cab)); return (transporte or api.transporte_simulado)(url, cab)
        return api.Cliente(gravar, dormir=lambda s: None)


class TestLeitura(Base):
    def test_perfil_host_versao_e_cabecalho(self):
        p = api.perfil(self.cliente())
        self.assertEqual(p["account_type"], "Media_Creator")
        url, cab = self.urls[0]
        self.assertTrue(url.startswith("https://graph.instagram.com/v27.0/me?"))
        self.assertEqual(cab["Authorization"], "Bearer proxy-injected")       # marcador: o token real só existe no cofre
        self.assertNotIn("access_token", url)

    def test_publicacoes_e_metricas_por_tipo(self):
        c = self.cliente(); pubs = api.publicacoes(c, 3)
        self.assertEqual(len(pubs), 3)
        reel = api.publicacao(c, "1801"); feed = api.publicacao(c, "1803")
        self.assertIn("reels_skip_rate", reel["metricas"]); self.assertIn("ig_reels_avg_watch_time", reel["metricas"])
        self.assertNotIn("reels_skip_rate", feed["metricas"]); self.assertIn("profile_visits", feed["metricas"])
        self.assertEqual(reel["metricas"]["views"], 15400)

    def test_metricas_conta_comparacao(self):
        r = api.metricas_conta(self.cliente(), dias=28)
        self.assertEqual(r["periodo"]["dias"], 28)
        self.assertEqual(r["atual"]["views"], 52000); self.assertEqual(r["anterior"]["views"], 36400)
        self.assertAlmostEqual(r["variacao_pct"]["views"], 42.9)
        self.assertEqual(api.metricas_conta(self.cliente(), dias=90)["periodo"]["dias"], 30)   # a API aceita até 30 dias

    def test_comentarios_e_cota(self):
        c = self.cliente()
        self.assertEqual(len(api.comentarios(c, "1801")), 2)
        self.assertEqual(api.cota(c)["config"]["quota_total"], 50)

    def test_status_simulado(self):
        s = api.status(api.Cliente(api.transporte_simulado))
        self.assertEqual(s["modo"], "simulado"); self.assertTrue(s["somente_leitura"])


class TestRecusas(Base):
    def test_metodos_de_escrita(self):
        for m in ("POST", "DELETE", "PUT", "PATCH"):
            with self.assertRaises(api.Recusado): api.Cliente.validar("me", {}, metodo=m)

    def test_caminhos_de_escrita_ou_fora_da_lista(self):
        for cam in ("me/media_publish", "17840000000000001/media_publish", "me/messages", "me/conversations", "1801/comments/5501",
                    "refresh_access_token", "access_token", "me/subscribed_apps", "1801/insights/extra", "../me", "me/stories"):
            with self.subTest(cam=cam), self.assertRaises(api.Recusado): api.Cliente.validar(cam, {})

    def test_parametros_perigosos(self):
        for p in ({"method": "post"}, {"_method": "DELETE"}, {"access_token": "x"}, {"message": "oi"}, {"hide": "true"},
                  {"suppress_http_code": "1"}, {"caption": "x"}):
            with self.subTest(p=p), self.assertRaises(api.Recusado): api.Cliente.validar("me", p)

    def test_campos_e_metricas_fora_da_lista(self):
        with self.assertRaises(api.Recusado): api.Cliente.validar("me", {"fields": "username,email"})
        with self.assertRaises(api.Recusado): api.Cliente.validar("1801/insights", {"metric": "views,impressions_x"})
        with self.assertRaises(api.Recusado): api.Cliente.validar("1801/insights", {})

    def test_recusa_nao_chega_ao_transporte(self):
        c = self.cliente()
        with self.assertRaises(api.Recusado): c.get("me/media_publish", creation_id="1")
        self.assertEqual(self.urls, [])

    def test_conexao_real_bloqueada(self):
        self.assertFalse(api.CONEXAO_REAL_AUTORIZADA)
        with self.assertRaises(api.Recusado): api.perfil(api.Cliente())      # transporte real: recusa antes de qualquer rede
        with open(api.REGISTRO) as f: reg = [json.loads(l) for l in f]
        self.assertEqual(reg[-1]["resultado"], "recusado")


class TestErrosELimpeza(Base):
    def test_limpar_tokens(self):
        t = api.limpar(f"falhou https://graph.instagram.com/me?access_token={TOKEN_FALSO}&x=1 Authorization: Bearer {TOKEN_FALSO} {TOKEN_FALSO}")
        self.assertNotIn(TOKEN_FALSO, t); self.assertIn("access_token=***", t)

    def test_erro_da_api_sem_token(self):
        def falha(url, cab): return 400, json.dumps({"error": {"message": f"Invalid OAuth access token {TOKEN_FALSO}", "code": 190}})
        with self.assertRaises(api.ErroAPI) as e: api.perfil(self.cliente(falha))
        self.assertEqual(e.exception.codigo, 190); self.assertNotIn(TOKEN_FALSO, str(e.exception))

    def test_limitacao_espera_e_repete(self):
        estado = {"n": 0}
        def limitado(url, cab):
            estado["n"] += 1
            if estado["n"] < 3: return 400, json.dumps({"error": {"message": "Application request limit reached", "code": 4}})
            return api.transporte_simulado(url, cab)
        esperas = []
        c = api.Cliente(limitado, dormir=esperas.append)
        self.assertEqual(api.perfil(c)["username"], "studio.matteu.simulado")
        self.assertEqual(esperas, [5, 10])

    def test_paginacao_pelo_cursor(self):
        pags = [{"data": [{"id": "1"}], "paging": {"cursors": {"after": "A"}, "next": "https://outro-host.example/roubar?access_token=x"}},
                {"data": [{"id": "2"}], "paging": {"cursors": {"after": "B"}}}]
        def t(url, cab): return 200, json.dumps(pags[len(self.urls) - 1])
        itens = self.cliente(t).paginas("me/media", fields="id", limit=1)
        self.assertEqual([i["id"] for i in itens], ["1", "2"])
        self.assertTrue(all(urllib.parse.urlparse(u).netloc == "graph.instagram.com" for u, _ in self.urls))   # nunca segue a URL "next"
        self.assertIn("after=A", self.urls[1][0])


class TestPrivacidade(Base):
    def test_registro_sem_conteudo_e_com_retencao(self):
        antigo = (datetime.now(timezone.utc) - timedelta(days=45)).isoformat(timespec="seconds")
        with open(api.REGISTRO, "w") as f: f.write(json.dumps({"quando": antigo, "consulta": "perfil", "resultado": "ok"}) + "\n")
        c = self.cliente(); api.comentarios(c, "1801"); api.perfil(c)
        with open(api.REGISTRO) as f: txt = f.read()
        linhas = [json.loads(l) for l in txt.splitlines()]
        self.assertTrue(all(l["quando"] != antigo for l in linhas))                 # entrada de 45 dias foi podada
        self.assertEqual({tuple(sorted(l)) for l in linhas}, {("consulta", "quando", "resultado")})
        for proibido in ("Que vídeo", "narração", "pessoa.ficticia", "5501", "1801"):
            self.assertNotIn(proibido, txt)
        self.assertEqual(oct(os.stat(api.REGISTRO).st_mode & 0o777), "0o600")

    def test_relatorio_sem_comentarios(self):
        rel = api.relatorio_markdown(self.cliente(), 28, 3)
        self.assertIn("Brasil sob temporais", rel); self.assertIn("+42.9%", rel)
        for proibido in ("Que vídeo", "narração rápida", "pessoa.ficticia"): self.assertNotIn(proibido, rel)


class TestServidorMCP(Base):
    def test_protocolo_em_processo(self):
        servidor_mcp.SIMULADO = True
        try:
            r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18"}})
            self.assertEqual(r["result"]["serverInfo"]["name"], "studio-matteu-instagram")
            self.assertIsNone(servidor_mcp.responder({"jsonrpc": "2.0", "method": "notifications/initialized"}))
            nomes = [t["name"] for t in servidor_mcp.responder({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})["result"]["tools"]]
            self.assertEqual(nomes, ["ig_status", "ig_perfil", "ig_publicacoes", "ig_publicacao", "ig_comentarios", "ig_metricas_conta", "ig_cota_publicacao"])
            for proibida in ("publicar", "responder", "enviar", "excluir", "ocultar", "agendar"):
                self.assertFalse(any(proibida in n for n in nomes))
            r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "ig_publicacao", "arguments": {"id": "1801"}}})
            self.assertFalse(r["result"]["isError"]); self.assertEqual(json.loads(r["result"]["content"][0]["text"])["metricas"]["views"], 15400)
            r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "ig_publicar", "arguments": {}}})
            self.assertTrue(r["result"]["isError"])
            servidor_mcp.SIMULADO = False
            r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "ig_perfil", "arguments": {}}})
            self.assertTrue(r["result"]["isError"]); self.assertIn("não autorizada", r["result"]["content"][0]["text"])
        finally:
            servidor_mcp.SIMULADO = False

    def test_stdio_subprocesso_simulado(self):
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
        pedidos = [{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "teste", "version": "0"}}},
                   {"jsonrpc": "2.0", "method": "notifications/initialized"},
                   {"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "ig_metricas_conta", "arguments": {"dias": 7}}}]
        env["STUDIO_IG_DADOS"] = self.tmp                                         # registro do subprocesso vai para a pasta temporária
        p = subprocess.run([sys.executable, "-I", os.path.join(AQUI, "servidor_mcp.py"), "--simulado"], input="\n".join(json.dumps(x) for x in pedidos) + "\n",
                           capture_output=True, text=True, timeout=60, env=env)
        self.assertFalse(os.path.exists(os.path.join(AQUI, "dados")))
        resp = [json.loads(l) for l in p.stdout.splitlines()]
        self.assertEqual([r["id"] for r in resp], [1, 2])
        self.assertEqual(json.loads(resp[1]["result"]["content"][0]["text"])["periodo"]["dias"], 7)


if __name__ == "__main__":
    unittest.main(verbosity=2)
