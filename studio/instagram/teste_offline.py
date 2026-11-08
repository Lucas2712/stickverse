#!/usr/bin/env python3
"""STUDIO MATTEU · Instagram · testes OFFLINE (fase 1, com as correções da auditoria)

Nenhum teste usa a rede: abrir conexão (socket ou urllib) faz o teste falhar. Todas as respostas são simuladas.
Os registros de teste vão para uma pasta temporária, não para studio/instagram/dados/.

  python3 -I studio/instagram/teste_offline.py
"""
import email.message, io, json, multiprocessing, os, socket, stat, subprocess, sys, tempfile, unittest, urllib.error, urllib.parse, urllib.request, urllib.response
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
        self._orig = (api.DADOS, socket.socket.connect, urllib.request.urlopen)
        api.DADOS = self.tmp
        socket.socket.connect = _sem_rede; urllib.request.urlopen = _sem_rede
        self.urls = []

    def tearDown(self):
        api.DADOS, socket.socket.connect, urllib.request.urlopen = self._orig

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
        with self.assertRaises(api.Recusado): api.metricas_conta(self.cliente(), dias=90)        # a API aceita até 30 dias

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
        with open(api.registro_de("real")) as f: reg = [json.loads(l) for l in f]
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
        with open(api.registro_de("teste"), "w") as f: f.write(json.dumps({"quando": antigo, "consulta": "perfil", "resultado": "ok"}) + "\n")
        c = self.cliente(); api.comentarios(c, "1801"); api.perfil(c)
        with open(api.registro_de("teste")) as f: txt = f.read()
        linhas = [json.loads(l) for l in txt.splitlines()]
        self.assertTrue(all(l["quando"] != antigo for l in linhas))                 # entrada de 45 dias foi podada
        self.assertEqual({tuple(sorted(l)) for l in linhas}, {("consulta", "quando", "resultado")})
        for proibido in ("Que vídeo", "narração", "pessoa.ficticia", "5501", "1801"):
            self.assertNotIn(proibido, txt)
        self.assertEqual(oct(os.stat(api.registro_de("teste")).st_mode & 0o777), "0o600")

    def test_relatorio_sem_comentarios(self):
        rel = api.relatorio_markdown(self.cliente(), 28, 3)
        self.assertIn("+42.9%", rel)
        for proibido in ("Que vídeo", "narração rápida", "pessoa.ficticia"): self.assertNotIn(proibido, rel)


class TestServidorMCP(Base):
    def test_protocolo_em_processo(self):
        servidor_mcp.SIMULADO = True
        try:
            r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18"}})
            self.assertEqual(r["result"]["serverInfo"]["name"], "studio-matteu-instagram-simulado")
            self.assertIsNone(servidor_mcp.responder({"jsonrpc": "2.0", "method": "notifications/initialized"}))
            nomes = [t["name"] for t in servidor_mcp.responder({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})["result"]["tools"]]
            self.assertEqual(nomes, ["ig_status", "ig_perfil", "ig_publicacoes", "ig_publicacao", "ig_comentarios", "ig_metricas_conta", "ig_cota_publicacao"])
            for proibida in ("publicar", "responder", "enviar", "excluir", "ocultar", "agendar"):
                self.assertFalse(any(proibida in n for n in nomes))
            r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "ig_publicacao", "arguments": {"id": "1801"}}})
            self.assertFalse(r["result"]["isError"]); self.assertEqual(json.loads(r["result"]["content"][0]["text"].split("\n", 1)[1])["metricas"]["views"], 15400)
            r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "ig_publicar", "arguments": {}}})
            self.assertEqual(r["error"]["code"], -32602)
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
        real_dados = os.path.join(AQUI, "dados")
        antes = {f: os.stat(os.path.join(real_dados, f)).st_size for f in os.listdir(real_dados)} if os.path.isdir(real_dados) else {}
        p = subprocess.run([sys.executable, "-I", os.path.join(AQUI, "servidor_mcp.py"), "--simulado"], input="\n".join(json.dumps(x) for x in pedidos) + "\n",
                           capture_output=True, text=True, timeout=60, env=env)
        depois = {f: os.stat(os.path.join(real_dados, f)).st_size for f in os.listdir(real_dados)} if os.path.isdir(real_dados) else {}
        self.assertEqual(antes, depois)                                          # a pasta de dados de verdade não foi tocada
        self.assertEqual(sorted(x for x in os.listdir(self.tmp) if x.endswith(".jsonl")), ["consultas-simulado.jsonl"])
        resp = [json.loads(l) for l in p.stdout.splitlines()]
        self.assertEqual([r["id"] for r in resp], [1, 2])
        texto = resp[1]["result"]["content"][0]["text"]; self.assertTrue(texto.startswith(servidor_mcp.AVISO_SIMULADO))
        self.assertEqual(json.loads(texto.split("\n", 1)[1])["periodo"]["dias"], 7)



# ======================= testes das correções da auditoria =======================

def _escritor(pasta, n, k):                     # processo filho do teste de concorrência (sem rede: só arquivos)
    api.DADOS = pasta
    for i in range(n): api.registrar(f"p{k}", "ok", "teste")


class TestModoSimuladoMCP(Base):
    def setUp(self):
        super().setUp(); self._sim = servidor_mcp.SIMULADO

    def tearDown(self):
        servidor_mcp.SIMULADO = self._sim; super().tearDown()

    def chamar(self, nome, args=None, pid=1):
        return servidor_mcp.responder({"jsonrpc": "2.0", "id": pid, "method": "tools/call", "params": {"name": nome, "arguments": args or {}}})

    def test_todas_as_ferramentas_no_simulado_marcadas(self):
        servidor_mcp.SIMULADO = True
        for nome, args in [("ig_status", {}), ("ig_perfil", {}), ("ig_publicacoes", {"limite": 2}), ("ig_publicacao", {"id": "1801"}),
                           ("ig_comentarios", {"id": "1801"}), ("ig_metricas_conta", {"dias": 7}), ("ig_cota_publicacao", {})]:
            with self.subTest(nome=nome):
                r = self.chamar(nome, args)["result"]
                self.assertFalse(r["isError"]); self.assertTrue(r["content"][0]["text"].startswith(servidor_mcp.AVISO_SIMULADO))
        nome = servidor_mcp.responder({"jsonrpc": "2.0", "id": 9, "method": "initialize", "params": {"protocolVersion": "2025-06-18"}})["result"]["serverInfo"]["name"]
        self.assertTrue(nome.endswith("-simulado"))

    def test_padrao_e_real_bloqueado(self):
        servidor_mcp.SIMULADO = False
        self.assertIs(servidor_mcp.cliente().transporte, api.transporte_real)
        r = self.chamar("ig_perfil")["result"]
        self.assertTrue(r["isError"]); self.assertIn("não autorizada", r["content"][0]["text"]); self.assertNotIn("SIMULADO", r["content"][0]["text"])

    def test_configuracao_mcp(self):
        raiz = os.path.abspath(os.path.join(AQUI, "..", ".."))
        with open(os.path.join(raiz, ".mcp.json")) as f: srv = json.load(f)["mcpServers"]
        self.assertEqual(srv["instagram"]["args"], ["studio/instagram/servidor_mcp.py"])                 # real: sem --simulado
        self.assertEqual(srv["instagram-simulado"]["args"], ["studio/instagram/servidor_mcp.py", "--simulado"])
        for k in ("instagram", "instagram-simulado"): self.assertNotIn("env", srv[k])                  # nenhum segredo/variável


class TestRegistroRobusto(Base):
    def linhas(self):
        with open(api.registro_de("teste")) as f: return [json.loads(l) for l in f]

    def test_concorrencia_sem_perda_nem_corrupcao(self):
        ctx = multiprocessing.get_context("fork")
        ps = [ctx.Process(target=_escritor, args=(self.tmp, 40, k)) for k in range(6)]
        for p in ps: p.start()
        for p in ps: p.join(30); self.assertEqual(p.exitcode, 0)
        ls = self.linhas()
        self.assertEqual(len(ls), 240)
        self.assertEqual({l["consulta"] for l in ls}, {f"p{k}" for k in range(6)})

    def test_permissoes_e_correcao_de_modo(self):
        os.chmod(self.tmp, 0o755)
        with open(api.registro_de("teste"), "w") as f: f.write("")
        os.chmod(api.registro_de("teste"), 0o644)
        self.assertTrue(api.registrar("perfil", "ok", "teste"))
        self.assertEqual(stat.S_IMODE(os.stat(self.tmp).st_mode), 0o700)
        self.assertEqual(stat.S_IMODE(os.stat(api.registro_de("teste")).st_mode), 0o600)
        self.assertEqual(stat.S_IMODE(os.stat(api.registro_de("teste") + ".lock").st_mode), 0o600)

    def test_recusa_link_simbolico(self):
        alvo = os.path.join(self.tmp, "alvo.txt")
        with open(alvo, "w") as f: f.write("intocado\n")
        os.symlink(alvo, api.registro_de("teste"))
        self.assertFalse(api.registrar("perfil", "ok", "teste"))             # falha segura: não segue o link
        with open(alvo) as f: self.assertEqual(f.read(), "intocado\n")

    def test_pasta_link_simbolico_recusada(self):
        real = tempfile.mkdtemp(); link = os.path.join(self.tmp, "dados-link"); os.symlink(real, link)
        api.DADOS = link
        self.assertFalse(api.registrar("perfil", "ok", "teste")); self.assertEqual(os.listdir(real), [])

    def test_poda_atomica_e_linhas_invalidas(self):
        antigo = (datetime.now(timezone.utc) - timedelta(days=40)).isoformat(timespec="seconds")
        recente = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(timespec="seconds")
        with open(api.registro_de("teste"), "w") as f:
            f.write(json.dumps({"quando": antigo, "consulta": "perfil", "resultado": "ok"}) + "\nlixo não-json\n" +
                    json.dumps({"quando": recente, "consulta": "midias", "resultado": "ok"}) + "\n")
        api.registrar("insights", "ok", "teste")
        self.assertEqual([l["consulta"] for l in self.linhas()], ["midias", "insights"])
        self.assertEqual([x for x in os.listdir(self.tmp) if x.endswith(".tmp")], [])        # nenhum temporário esquecido

    def test_sem_poda_nao_reescreve(self):
        api.registrar("perfil", "ok", "teste"); ino = os.stat(api.registro_de("teste")).st_ino
        api.registrar("midias", "ok", "teste")
        self.assertEqual(os.stat(api.registro_de("teste")).st_ino, ino)        # só acréscimo, mesmo arquivo

    def test_falha_de_registro_nao_vaza_em_stdout(self):
        api.DADOS = "/proc/naopode"
        self.assertFalse(api.registrar("perfil", "ok", "teste"))

    def test_gravar_novo_nunca_sobrescreve(self):
        a = api.gravar_novo(os.path.join(self.tmp, "rel.md"), "primeiro")
        b = api.gravar_novo(os.path.join(self.tmp, "rel.md"), "segundo")
        self.assertNotEqual(a, b)
        with open(a) as f: self.assertEqual(f.read(), "primeiro")
        self.assertEqual(stat.S_IMODE(os.stat(b).st_mode), 0o600)


class TestRelatorioSemLegendas(Base):
    def test_sem_legenda_nem_texto(self):
        rel = api.relatorio_markdown(self.cliente(), 28, 3)
        p = api.perfil(self.cliente())
        for proibido in ("SIMULADO", "Brasil sob temporais", "espionagem", "Bastidores", "legenda", "pessoa.ficticia",
                         "@", p["username"], "studio.matteu", p["name"], "instagram.com", "permalink", "caption"):
            self.assertNotIn(proibido, rel)
        self.assertEqual(rel.splitlines()[0], "# Relatório do Instagram")
        tabela = [l for l in rel.splitlines() if l.startswith("| 2026-")]
        self.assertEqual(len(tabela), 3)
        for l in tabela:
            cel = [x.strip() for x in l.strip("|").split("|")]
            self.assertRegex(cel[0], r"^\d{4}-\d{2}-\d{2}$"); self.assertIn(cel[1], ("REELS", "FEED"))
            for v in cel[2:]: self.assertRegex(v, r"^(\d+(\.\d+)?|None)$")


class TestValidacao(Base):
    def test_ids_invalidos_api(self):
        c = self.cliente()
        for ruim in ("", "abc", "-1", "1801/../me", "1801?x=1", " 1801", "1" * 31, True, 1.5, None, ["1801"], "١٨٠١"):
            with self.subTest(ruim=ruim), self.assertRaises(api.Recusado): api.publicacao(c, ruim)
        self.assertEqual(self.urls, [])

    def test_limites_e_periodos_api(self):
        c = self.cliente()
        for f, kw in [(api.publicacoes, {"limite": 0}), (api.publicacoes, {"limite": 51}), (api.publicacoes, {"limite": "10"}),
                      (api.publicacoes, {"limite": True}), (api.metricas_conta, {"dias": 0}), (api.metricas_conta, {"dias": 31}),
                      (api.metricas_conta, {"dias": 7, "comparar": "sim"})]:
            with self.subTest(f=f.__name__, kw=kw), self.assertRaises(api.Recusado): f(c, **kw)
        with self.assertRaises(api.Recusado): api.comentarios(c, "1801", limite=0)
        self.assertEqual(self.urls, [])

    def test_argumentos_mcp_recusados_antes_da_consulta(self):
        chamadas = []
        orig = servidor_mcp.cliente
        servidor_mcp.cliente = lambda: chamadas.append(1) or api.Cliente(api.transporte_simulado)
        try:
            casos = [("ig_perfil", {"x": 1}), ("ig_publicacoes", {"limite": 0}), ("ig_publicacoes", {"limite": "5"}),
                     ("ig_publicacoes", {"limite": True}), ("ig_publicacao", {}), ("ig_publicacao", {"id": 1801}),
                     ("ig_publicacao", {"id": "18a"}), ("ig_publicacao", {"id": "1801", "metricas": "sim"}),
                     ("ig_comentarios", {"id": "1801", "limite": 99}), ("ig_metricas_conta", {"dias": 45}),
                     ("ig_metricas_conta", {"dias": 7, "extra": True}), ("ig_status", {"modo": "real"})]
            for nome, args in casos:
                with self.subTest(nome=nome, args=args):
                    r = servidor_mcp.responder({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": nome, "arguments": args}})
                    self.assertTrue(r["result"]["isError"]); self.assertIn("Argumentos recusados", r["result"]["content"][0]["text"])
            self.assertEqual(chamadas, [])                              # nenhum cliente criado, nenhuma consulta
        finally:
            servidor_mcp.cliente = orig

    def test_padroes_preenchidos(self):
        self.assertEqual(servidor_mcp.validar_argumentos("ig_metricas_conta", {}), {"dias": 28, "comparar": True})
        self.assertEqual(servidor_mcp.validar_argumentos("ig_publicacao", {"id": "1801"}), {"id": "1801", "metricas": True})


class TestProtocoloMCP(Base):
    def r(self, pedido): return servidor_mcp.responder(pedido)

    def test_mensagens_invalidas(self):
        self.assertEqual(self.r([{"jsonrpc": "2.0", "id": 1, "method": "ping"}])["error"]["code"], -32600)        # lote
        self.assertEqual(self.r({"id": 1, "method": "ping"})["error"]["code"], -32600)                           # sem jsonrpc
        self.assertEqual(self.r({"jsonrpc": "1.0", "id": 1, "method": "ping"})["error"]["code"], -32600)
        for pid in (True, 1.5, {"a": 1}, [1], None):
            with self.subTest(pid=pid): self.assertEqual(self.r({"jsonrpc": "2.0", "id": pid, "method": "ping"})["error"]["code"], -32600)
        self.assertEqual(self.r({"jsonrpc": "2.0", "id": 1, "method": 5})["error"]["code"], -32600)
        self.assertEqual(self.r({"jsonrpc": "2.0", "id": 1, "method": "ping", "params": [1]})["error"]["code"], -32602)
        self.assertEqual(self.r({"jsonrpc": "2.0", "id": 1, "method": "resources/list"})["error"]["code"], -32601)
        self.assertEqual(self.r({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "ig_perfil", "arguments": [1]}})["error"]["code"], -32602)
        self.assertEqual(self.r({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": 7}})["error"]["code"], -32602)
        self.assertIsNone(self.r({"jsonrpc": "2.0", "method": "notifications/initialized"}))
        self.assertIsNone(self.r({"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "ig_perfil"}}))   # notificação nunca executa
        self.assertEqual(self.r({"jsonrpc": "2.0", "id": "a", "method": "ping"}), {"jsonrpc": "2.0", "id": "a", "result": {}})

    def test_linhas_brutas(self):
        self.assertEqual(servidor_mcp.processar_linha("{nao json")["error"]["code"], -32700)
        self.assertEqual(servidor_mcp.processar_linha("x" * (servidor_mcp.MAX_LINHA + 1))["error"]["code"], -32600)

    def test_erro_da_meta_sem_detalhes(self):
        def falha(url, cab): return 400, json.dumps({"error": {"message": f"objeto 1801 do usuário pessoa.ficticia token {TOKEN_FALSO}", "code": 100}})
        orig = servidor_mcp.cliente; servidor_mcp.cliente = lambda: api.Cliente(falha, dormir=lambda s: None)
        try:
            r = self.r({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "ig_perfil", "arguments": {}}})
        finally: servidor_mcp.cliente = orig
        txt = r["result"]["content"][0]["text"]
        self.assertTrue(r["result"]["isError"]); self.assertIn("código 100", txt)
        for proibido in ("pessoa.ficticia", "1801", TOKEN_FALSO, "token "): self.assertNotIn(proibido, txt)

    def test_erro_interno_generico(self):
        orig = servidor_mcp.executar
        servidor_mcp.executar = lambda n, a: (_ for _ in ()).throw(ValueError("dado privado: pessoa.ficticia"))
        try:
            r = self.r({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "ig_perfil", "arguments": {}}})
        finally: servidor_mcp.executar = orig
        self.assertTrue(r["result"]["isError"]); self.assertNotIn("pessoa", r["result"]["content"][0]["text"])
        self.assertNotIn("Traceback", json.dumps(r))


def _resposta(corpo, code=200, cabecalhos=None, contador=None):
    h = email.message.Message()
    for k, v in (cabecalhos or {}).items(): h[k] = v
    class Fluxo(io.BytesIO):
        def read(self, n=-1):
            d = super().read(n)
            if contador is not None: contador.append(len(d))
            return d
    r = urllib.response.addinfourl(Fluxo(corpo), h, "https://graph.instagram.com/v27.0/me", code)
    r.msg = "OK" if code == 200 else "Redirect"
    return r


class HTTPSFalso(urllib.request.HTTPSHandler):
    """Substitui o HTTPS de verdade dentro do opener: devolve respostas prontas e registra cada pedido. Sem rede."""
    def __init__(self, *respostas):
        super().__init__(); self.respostas = list(respostas); self.pedidos = []
    def https_open(self, req):
        self.pedidos.append((req.full_url, req.get_header("Authorization")))
        r = self.respostas.pop(0)
        if isinstance(r, Exception): raise r
        return r


class TestTransporteReal(Base):
    """Confere, sem rede, o transporte real como se estivesse autorizado: o HTTPS é um falso dentro do opener verdadeiro
    (com o tratamento de redirecionamento e de erros reais do urllib)."""
    def setUp(self):
        super().setUp(); api.CONEXAO_REAL_AUTORIZADA = True

    def tearDown(self):
        api.CONEXAO_REAL_AUTORIZADA = False; super().tearDown()

    def transporte(self, falso):
        return lambda url, cab: api.transporte_real(url, cab, opener=api.construir_opener(falso))

    def test_pedido_montado_corretamente(self):
        falso = HTTPSFalso(_resposta(b'{"user_id": "1", "username": "x", "account_type": "Media_Creator"}'))
        api.perfil(api.Cliente(self.transporte(falso)))
        url, aut = falso.pedidos[0]
        self.assertEqual(urllib.parse.urlparse(url).netloc, "graph.instagram.com")
        self.assertEqual(aut, "Bearer proxy-injected"); self.assertNotIn("access_token", url)

    def test_redirecionamento_para_outro_host_recusado(self):
        for code in (301, 302, 303, 307, 308):
            with self.subTest(code=code):
                falso = HTTPSFalso(_resposta(b"", code, {"Location": "https://outro-host.example/roubar"}),
                                   _resposta(b'{"username": "nao-deveria"}'))
                with self.assertRaises(api.ErroAPI) as e: api.perfil(api.Cliente(self.transporte(falso), dormir=lambda s: None))
                self.assertEqual(e.exception.codigo, -4); self.assertIn("redirecionamento recusado", e.exception.resumo())
                self.assertEqual(len(falso.pedidos), 1)                                   # nunca segue o Location
                self.assertTrue(all("outro-host" not in u for u, _ in falso.pedidos))

    def test_redirecionamento_no_mesmo_host_recusado(self):
        falso = HTTPSFalso(_resposta(b"", 302, {"Location": "https://graph.instagram.com/v27.0/me/media_publish"}))
        with self.assertRaises(api.ErroAPI): api.perfil(api.Cliente(self.transporte(falso)))
        self.assertEqual(len(falso.pedidos), 1)

    def test_resposta_grande_com_content_length_recusada_sem_ler(self):
        lidos = []
        falso = HTTPSFalso(_resposta(b"x" * 10, 200, {"Content-Length": str(api.MAX_RESPOSTA + 1)}, lidos))
        with self.assertRaises(api.ErroAPI) as e: api.perfil(api.Cliente(self.transporte(falso)))
        self.assertEqual(e.exception.codigo, -2); self.assertEqual(lidos, [])           # nem um byte lido

    def test_resposta_grande_sem_content_length_lida_so_ate_o_limite(self):
        lidos = []
        falso = HTTPSFalso(_resposta(b"{" + b" " * (api.MAX_RESPOSTA * 3), 200, None, lidos))
        with self.assertRaises(api.ErroAPI) as e: api.perfil(api.Cliente(self.transporte(falso)))
        self.assertEqual(e.exception.codigo, -2); self.assertLessEqual(sum(lidos), api.MAX_RESPOSTA + 1)

    def test_resposta_no_limite_aceita(self):
        corpo = json.dumps({"user_id": "1", "username": "x", "account_type": "Media_Creator"}).encode()
        corpo += b" " * (api.MAX_RESPOSTA - len(corpo))
        falso = HTTPSFalso(_resposta(corpo))
        self.assertEqual(api.perfil(api.Cliente(self.transporte(falso)))["username"], "x")

    def test_corpo_de_erro_grande_descartado(self):
        lidos = []
        falso = HTTPSFalso(_resposta(b"y" * (api.MAX_RESPOSTA_ERRO * 4), 500, None, lidos))
        with self.assertRaises(api.ErroAPI): api.perfil(api.Cliente(self.transporte(falso)))
        self.assertLessEqual(sum(lidos), api.MAX_RESPOSTA_ERRO + 1)

    def test_falhas_de_conexao_viram_erro_seguro(self):
        for exc in (urllib.error.URLError(socket.gaierror("nome")), urllib.error.URLError(TimeoutError()), TimeoutError(), ConnectionResetError()):
            with self.subTest(exc=type(exc).__name__):
                falso = HTTPSFalso(exc)
                with self.assertRaises(api.ErroAPI) as e: api.perfil(api.Cliente(self.transporte(falso)))
                self.assertEqual(e.exception.codigo, -3); self.assertIn("falha de conexão", e.exception.resumo())

    def test_opener_padrao_sem_redirecionamento(self):
        op = api.construir_opener()
        self.assertTrue(any(isinstance(h, api.SemRedirecionamento) for h in op.handlers))
        self.assertFalse(any(type(h) is urllib.request.HTTPRedirectHandler for h in op.handlers))

    def test_flag_padrao_no_arquivo(self):
        with open(os.path.join(AQUI, "api.py")) as f: self.assertIn("\nCONEXAO_REAL_AUTORIZADA = False", f.read())



# ======================= testes da 3ª revisão =======================

class TestTravaPreexistente(Base):
    def setUp(self):
        super().setUp(); os.chmod(self.tmp, 0o700); self.trava = api.registro_de("teste") + ".lock"

    def test_trava_existente_com_permissao_aberta_e_corrigida(self):
        for modo in (0o644, 0o666, 0o777, 0o400):
            with self.subTest(modo=oct(modo)):
                if os.path.exists(self.trava): os.remove(self.trava)
                with open(self.trava, "w"): pass
                os.chmod(self.trava, modo)
                self.assertTrue(api.registrar("perfil", "ok", "teste"))
                self.assertEqual(stat.S_IMODE(os.stat(self.trava).st_mode), 0o600)

    def test_trava_link_simbolico_recusada(self):
        alvo = os.path.join(self.tmp, "alvo.txt")
        with open(alvo, "w") as f: f.write("intocado\n")
        os.chmod(alvo, 0o644); os.symlink(alvo, self.trava)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))
        self.assertEqual(stat.S_IMODE(os.stat(alvo).st_mode), 0o644)          # alvo nem lido nem alterado
        with open(alvo) as f: self.assertEqual(f.read(), "intocado\n")
        self.assertFalse(os.path.exists(api.registro_de("teste")))                          # nada gravado sem trava válida

    def test_trava_link_simbolico_quebrado_recusado(self):
        os.symlink(os.path.join(self.tmp, "nao-existe"), self.trava)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))
        self.assertFalse(os.path.exists(os.path.join(self.tmp, "nao-existe")))  # O_CREAT não seguiu o link

    def test_trava_pasta_recusada(self):
        os.mkdir(self.trava)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))

    def test_trava_fifo_recusada_sem_travar(self):
        os.mkfifo(self.trava, 0o600)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))                         # O_NONBLOCK + fstat: recusa na hora

    def test_trava_link_fisico_recusado(self):
        outro = os.path.join(self.tmp, "outro.txt")
        with open(outro, "w"): pass
        os.link(outro, self.trava)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))

    @unittest.skipUnless(os.getuid() == 0, "trocar o dono exige root")
    def test_trava_de_outro_dono_recusada(self):
        with open(self.trava, "w"): pass
        os.chown(self.trava, 4242, 4242)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))
        self.assertEqual(os.stat(self.trava).st_uid, 4242)

    @unittest.skipUnless(os.getuid() == 0, "trocar o dono exige root")
    def test_registro_de_outro_dono_recusado(self):
        with open(api.registro_de("teste"), "w"): pass
        os.chown(api.registro_de("teste"), 4242, 4242)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))

    def test_registro_fifo_recusado(self):
        os.mkfifo(api.registro_de("teste"), 0o600)
        self.assertFalse(api.registrar("perfil", "ok", "teste"))

    def test_concorrencia_com_trava_preexistente(self):
        with open(self.trava, "w"): pass
        os.chmod(self.trava, 0o644)
        ctx = multiprocessing.get_context("fork")
        ps = [ctx.Process(target=_escritor, args=(self.tmp, 30, k)) for k in range(4)]
        for p in ps: p.start()
        for p in ps: p.join(30); self.assertEqual(p.exitcode, 0)
        with open(api.registro_de("teste")) as f: self.assertEqual(len(f.read().splitlines()), 120)
        self.assertEqual(stat.S_IMODE(os.stat(self.trava).st_mode), 0o600)


class TestNegociacaoProtocolo(Base):
    def init(self, params):
        return servidor_mcp.responder({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": params})

    def test_versoes_suportadas_ecoadas(self):
        for v in servidor_mcp.VERSOES_SUPORTADAS:
            with self.subTest(v=v): self.assertEqual(self.init({"protocolVersion": v})["result"]["protocolVersion"], v)

    def test_versoes_nao_suportadas_viram_a_mais_recente(self):
        for v in ("1999-01-01", "2030-12-31", "2025-06-18-beta", "latest", "x" * 300):
            with self.subTest(v=v[:20]):
                r = self.init({"protocolVersion": v})["result"]
                self.assertEqual(r["protocolVersion"], servidor_mcp.PROTOCOLO)
                self.assertIn(r["protocolVersion"], servidor_mcp.VERSOES_SUPORTADAS)
                self.assertNotIn(v, json.dumps(r))                              # nunca devolve a versão desconhecida

    def test_versao_ausente_ou_invalida_recusada(self):
        for params in ({}, {"protocolVersion": None}, {"protocolVersion": 20250618}, {"protocolVersion": ""}, {"protocolVersion": ["2025-06-18"]}):
            with self.subTest(params=params): self.assertEqual(self.init(params)["error"]["code"], -32602)

    def test_mais_recente_e_suportada(self):
        self.assertEqual(servidor_mcp.PROTOCOLO, servidor_mcp.VERSOES_SUPORTADAS[0])



# ======================= correções pós-auditoria final (B2 e B3) =======================

class TestStatusSimulado(Base):
    def test_status_simulado_nao_conectado(self):
        s = api.status(api.Cliente(api.transporte_simulado))
        self.assertIs(s["conectado"], False); self.assertEqual(s["modo"], "simulado")
        self.assertIn("NÃO está conectada", s["aviso"]); self.assertNotIn("conta", s)        # só "conta_ficticia"

    def test_mcp_simulado_nunca_diz_conectado(self):
        orig = servidor_mcp.SIMULADO; servidor_mcp.SIMULADO = True
        try:
            for nome, args in [("ig_status", {}), ("ig_perfil", {}), ("ig_publicacoes", {}), ("ig_publicacao", {"id": "1801"}),
                               ("ig_comentarios", {"id": "1801"}), ("ig_metricas_conta", {}), ("ig_cota_publicacao", {})]:
                with self.subTest(nome=nome):
                    t = servidor_mcp.responder({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": nome, "arguments": args}})["result"]["content"][0]["text"]
                    self.assertTrue(t.startswith(servidor_mcp.AVISO_SIMULADO)); self.assertNotIn('"conectado": true', t)
            t = servidor_mcp.responder({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "ig_status", "arguments": {}}})["result"]["content"][0]["text"]
            self.assertIn('"conectado": false', t); self.assertIn('"modo": "simulado"', t)
        finally:
            servidor_mcp.SIMULADO = orig


class TestRegistrosSeparados(Base):
    def ler(self, modo):
        c = api.registro_de(modo)
        if not os.path.exists(c): return []
        with open(c) as f: return [json.loads(l) for l in f]

    def test_real_e_simulado_em_arquivos_separados(self):
        api.perfil(api.Cliente(api.transporte_simulado))
        with self.assertRaises(api.Recusado): api.perfil(api.Cliente(api.transporte_real))
        api.publicacoes(api.Cliente(api.transporte_simulado), 2)
        sim, real = self.ler("simulado"), self.ler("real")
        self.assertEqual([(l["consulta"], l["resultado"]) for l in sim], [("perfil", "ok"), ("midias", "ok")])
        self.assertEqual([(l["consulta"], l["resultado"]) for l in real], [("perfil", "recusado")])
        self.assertEqual(self.ler("teste"), [])
        nomes = sorted(os.listdir(self.tmp))
        self.assertEqual(nomes, ["consultas-real.jsonl", "consultas-real.jsonl.lock", "consultas-simulado.jsonl", "consultas-simulado.jsonl.lock"])
        for n in nomes: self.assertEqual(stat.S_IMODE(os.stat(os.path.join(self.tmp, n)).st_mode), 0o600)

    def test_modo_do_cliente(self):
        self.assertEqual(api.Cliente().modo, "real"); self.assertEqual(api.Cliente(api.transporte_simulado).modo, "simulado")
        self.assertEqual(api.Cliente(lambda u, c: (200, "{}")).modo, "teste")

    def test_modo_invalido_recusado(self):
        for m in ("", "REAL", "../x", None, "producao"):
            with self.subTest(m=m), self.assertRaises(ValueError): api.registro_de(m)

    def test_protecoes_valem_para_cada_modo(self):
        os.chmod(self.tmp, 0o700)
        alvo = os.path.join(self.tmp, "alvo.txt")
        with open(alvo, "w") as f: f.write("intocado\n")
        os.symlink(alvo, api.registro_de("simulado"))
        self.assertFalse(api.registrar("perfil", "ok", "simulado"))
        self.assertTrue(api.registrar("perfil", "ok", "real"))                       # o outro modo segue funcionando
        with open(alvo) as f: self.assertEqual(f.read(), "intocado\n")

    def test_sem_conteudo_em_nenhum_registro(self):
        api.comentarios(api.Cliente(api.transporte_simulado), "1801")
        with self.assertRaises(api.Recusado): api.comentarios(api.Cliente(api.transporte_real), "1801")
        for modo in ("simulado", "real"):
            with open(api.registro_de(modo)) as f: txt = f.read()
            for proibido in ("Que vídeo", "pessoa.ficticia", "1801", "5501", "Bearer", "proxy-injected"): self.assertNotIn(proibido, txt)


if __name__ == "__main__":
    unittest.main(verbosity=2)
