#!/usr/bin/env python3
"""STUDIO MATTEU · ElevenLabs (INATIVA) · testes OFFLINE das travas de studio/ferramentas/elevenlabs.py

Comprova que "gerar" recusa aprovação, teto, argumentos e saída inválidos ANTES de qualquer acesso à rede, e que falhas
de conexão viram mensagens seguras. Nenhum teste acessa a rede: qualquer tentativa (urlopen ou socket) é contada e falha.
Nenhum áudio é gerado e nenhum crédito é usado.

  python3 -I studio/ferramentas/teste_elevenlabs_offline.py
"""
import io, json, os, socket, sys, tempfile, unittest, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import elevenlabs as el  # noqa: E402

SEGREDO = "sk_" + "z" * 40


class Base(unittest.TestCase):
    def setUp(self):
        self.tentativas = []
        self._orig = (urllib.request.urlopen, socket.socket.connect)
        def bloquear(*a, **k): self.tentativas.append(a); raise AssertionError("acesso à rede durante teste offline")
        urllib.request.urlopen = bloquear; socket.socket.connect = bloquear
        self.tmp = tempfile.mkdtemp()

    def tearDown(self):
        urllib.request.urlopen, socket.socket.connect = self._orig

    def rodar(self, *args):
        antigo = sys.argv; sys.argv = ["elevenlabs.py", *args]
        try:
            with self.assertRaises(SystemExit) as cm: el.main()
        finally: sys.argv = antigo
        return str(cm.exception.code)

    def efeito(self, *extra, saida=None):
        return ["gerar", "efeito", "--descricao", "trovão distante", "--duracao", "2", "--saida", saida or os.path.join(self.tmp, "x.mp3"), *extra]

    def codigo_efeito(self):
        return el.codigo({"tipo": "efeito", "descricao": "trovão distante", "duracao": 2.0})


class TestRecusaSemRede(Base):
    def test_codigo_invalido_recusa_sem_rede(self):
        for cod in ("ERRADO", "", "00000000", self.codigo_efeito().lower()[:7]):
            with self.subTest(cod=cod):
                msg = self.rodar(*self.efeito("--aprovado", cod, "--teto", "500"))
                self.assertIn("RECUSADO", msg); self.assertIn("código de aprovação", msg)
        self.assertEqual(self.tentativas, [])

    def test_codigo_ausente(self):
        self.assertIn("código de aprovação", self.rodar(*self.efeito("--teto", "500")))
        self.assertEqual(self.tentativas, [])

    def test_teto_invalido(self):
        cod = self.codigo_efeito()
        for teto, trecho in (([], "--teto"), (["--teto", "0"], "entre 1"), (["--teto", "100001"], "entre 1"), (["--teto", "50"], "acima do teto")):
            with self.subTest(teto=teto): self.assertIn(trecho, self.rodar(*self.efeito("--aprovado", cod, *teto)))
        self.assertEqual(self.tentativas, [])

    def test_saida_invalida(self):
        cod = self.codigo_efeito()
        existe = os.path.join(self.tmp, "ja.mp3"); open(existe, "w").close()
        self.assertIn("já existe", self.rodar(*self.efeito("--aprovado", cod, "--teto", "500", saida=existe)))
        self.assertIn(".mp3", self.rodar(*self.efeito("--aprovado", cod, "--teto", "500", saida=os.path.join(self.tmp, "x.wav"))))
        sem = ["gerar", "efeito", "--descricao", "trovão distante", "--duracao", "2", "--aprovado", cod, "--teto", "500"]
        self.assertIn("--saida", self.rodar(*sem))
        self.assertEqual(self.tentativas, [])

    def test_argumentos_e_limites(self):
        casos = [
            ["gerar", "efeito", "--duracao", "2"],                                              # sem descrição
            ["gerar", "efeito", "--descricao", "x" * 451],
            ["gerar", "efeito", "--descricao", "ok", "--duracao", "99"],
            ["gerar", "musica", "--prompt", "calmo", "--duracao", "5"],
            ["gerar", "musica", "--prompt", "calmo"],
            ["gerar", "narracao", "--texto", "olá", "--voz", "voz;rm -rf"],
            ["gerar", "narracao", "--texto", "a" * 10001, "--voz", "abcdefgh12"],
            ["gerar", "narracao", "--texto", "olá", "--voz", "abcdefgh12", "--modelo", "../x"],
            ["gerar", "narracao", "--arquivo", "/nao/existe.txt", "--voz", "abcdefgh12"],
            ["gerar"],
            ["estimar", "efeito"],                                                                # estimar também valida antes
        ]
        for c in casos:
            with self.subTest(c=c[:3]): self.assertIn("RECUSADO", self.rodar(*c, "--aprovado", "X", "--teto", "10", "--saida", os.path.join(self.tmp, "y.mp3")))
        self.assertEqual(self.tentativas, [])

    def test_ordem_das_travas_no_codigo(self):
        with open(el.__file__) as f: src = f.read()
        i_trava, i_rede = src.index("travas_locais(a, p)             # 2."), src.index("est, como = estimativa(p); s = saldo()")
        self.assertLess(i_trava, i_rede)


class TestFalhasDeConexao(Base):
    """Com código, teto e saída válidos, o próximo passo é a API: aqui a rede é simulada falhando."""
    def com(self, erro):
        def falha(*a, **k): self.tentativas.append(a); raise erro
        urllib.request.urlopen = falha
        return self.rodar(*self.efeito("--aprovado", self.codigo_efeito(), "--teto", "500"))

    def test_urlerror_timeout_e_conexao(self):
        for erro in (urllib.error.URLError(socket.gaierror("nome")), urllib.error.URLError(TimeoutError("lento")), TimeoutError("lento"),
                     socket.timeout("lento"), ConnectionResetError("reset")):
            with self.subTest(erro=type(erro).__name__):
                msg = self.com(erro)
                self.assertIn("falha de conexão", msg); self.assertIn("Nada foi gerado", msg)
                self.assertNotIn("Traceback", msg); self.assertNotIn("xi-api-key", msg)
        self.assertFalse(os.path.exists(os.path.join(self.tmp, "x.mp3")))

    def test_httperror_sem_corpo_nem_segredo(self):
        corpo = json.dumps({"detail": {"status": "quota_exceeded", "message": f"chave {SEGREDO} texto: trovão distante"}}).encode()
        msg = self.com(urllib.error.HTTPError("https://api.elevenlabs.io/v1/models", 401, "x", {}, io.BytesIO(corpo)))
        self.assertIn("HTTP 401", msg); self.assertIn("quota_exceeded", msg)
        for proibido in (SEGREDO, "trovão", "chave"): self.assertNotIn(proibido, msg)

    def test_rede_so_depois_das_travas(self):
        self.com(urllib.error.URLError(OSError("x")))
        self.assertEqual(len(self.tentativas), 1)                 # a 1ª requisição só acontece com as travas locais aprovadas


class TestDocumentacaoM3(unittest.TestCase):
    def test_limitacao_documentada(self):
        with open(el.__file__) as f: doc = f.read()
        for trecho in ("NÃO representa uma autorização humana real", "deny", "Nenhum código calculável pelo próprio agente"):
            self.assertIn(trecho, doc)

    def test_codigo_e_calculavel(self):                          # a limitação, comprovada: o código sai do próprio pedido
        p = {"tipo": "efeito", "descricao": "a", "duracao": None}
        self.assertEqual(el.codigo(p), el.codigo(dict(p)))


if __name__ == "__main__":
    unittest.main(verbosity=2)
