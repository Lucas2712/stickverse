#!/usr/bin/env python3
"""STUDIO MATTEU · Instagram · cliente SOMENTE LEITURA (fase 1)

API oficial da Meta: Instagram API com login do Instagram (graph.instagram.com, v27.0), conta profissional de Criador.
Tudo aqui é leitura (GET) numa lista fechada de caminhos, campos e parâmetros. Qualquer escrita é recusada antes de sair
da máquina: não existe código para publicar, responder, enviar, ocultar, excluir ou alterar configurações.

Segurança
  - O token nunca passa por aqui: o cabeçalho "Authorization: Bearer proxy-injected" é um marcador que o proxy do ambiente
    substitui pelo valor guardado no cofre (como na ElevenLabs). Nada de token em arquivo, variável, log ou chat.
  - CONEXAO_REAL_AUTORIZADA = False: enquanto o usuário não autorizar a conexão real, o transporte de rede recusa qualquer
    chamada (nem tenta abrir conexão). Os testes usam o transporte simulado (dados fictícios).
  - Erros passam por limpar(), que remove tokens de mensagens e URLs.
  - Registro de consultas: só data, tipo de consulta e resultado (ok/erro). Nunca IDs de comentários, textos, nomes de
    usuário ou conteúdo de mensagens. Fica em studio/instagram/dados/ (fora do git) e é podado após 30 dias.
"""
import json, os, re, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone

HOST = "graph.instagram.com"
VERSAO = "v27.0"
BASE = f"https://{HOST}/{VERSAO}/"
CONEXAO_REAL_AUTORIZADA = False          # muda só com autorização expressa do usuário (fase de conexão real)
AQUI = os.path.dirname(os.path.abspath(__file__))
DADOS = os.environ.get("STUDIO_IG_DADOS") or os.path.join(AQUI, "dados")   # variável só para testes
REGISTRO = os.path.join(DADOS, "consultas.jsonl")
RETENCAO_DIAS = 30

# ---------------- lista fechada do que pode ser lido ----------------
CAMPOS_PERFIL = {"id", "user_id", "username", "name", "account_type", "profile_picture_url", "followers_count", "follows_count", "media_count"}
CAMPOS_MIDIA = {"id", "caption", "media_type", "media_product_type", "permalink", "timestamp", "like_count", "comments_count",
                "thumbnail_url", "media_url", "is_comment_enabled", "shortcode"}
CAMPOS_COMENTARIO = {"id", "text", "timestamp", "like_count", "username", "hidden", "parent_id"}
CAMPOS_COTA = {"quota_usage", "config"}
METRICAS_CONTA = {"views", "reach", "accounts_engaged", "total_interactions", "likes", "comments", "shares", "saves", "reposts",
                  "follows_and_unfollows", "profile_links_taps", "replies", "follower_count", "online_followers",
                  "follower_demographics", "engaged_audience_demographics"}
METRICAS_MIDIA = {"views", "reach", "likes", "comments", "saved", "shares", "reposts", "total_interactions", "follows",
                  "profile_visits", "profile_activity", "ig_reels_avg_watch_time", "ig_reels_video_view_total_time", "reels_skip_rate"}
METRICAS_REELS = ["views", "reach", "likes", "comments", "saved", "shares", "total_interactions",
                  "ig_reels_avg_watch_time", "ig_reels_video_view_total_time", "reels_skip_rate"]
METRICAS_FEED = ["views", "reach", "likes", "comments", "saved", "shares", "total_interactions", "profile_visits", "follows"]
METRICAS_CONTA_PADRAO = ["views", "reach", "accounts_engaged", "total_interactions", "likes", "comments", "shares", "saves"]

ID = r"\d{1,30}"
CAMINHOS = [  # (nome, padrão, campos permitidos, métricas permitidas)
    ("perfil",      rf"^(me|{ID})$",                         CAMPOS_PERFIL | CAMPOS_MIDIA, None),
    ("midias",      rf"^(me|{ID})/media$",                   CAMPOS_MIDIA, None),
    ("filhos",      rf"^{ID}/children$",                     CAMPOS_MIDIA, None),
    ("insights",    rf"^(me|{ID})/insights$",                None, METRICAS_CONTA | METRICAS_MIDIA),
    ("comentarios", rf"^{ID}/comments$",                     CAMPOS_COMENTARIO, None),
    ("respostas",   rf"^{ID}/replies$",                      CAMPOS_COMENTARIO, None),
    ("cota",        rf"^(me|{ID})/content_publishing_limit$", CAMPOS_COTA, None),
]
# Só estes parâmetros. Ficam de fora, de propósito: access_token (vem do cofre), method/_method (a Graph API aceita
# sobrescrever o método HTTP por parâmetro), callback, suppress_http_code e qualquer outro.
PARAMETROS = {"fields", "metric", "period", "metric_type", "breakdown", "since", "until", "timeframe", "limit", "after", "before"}
LIMITACAO = {4, 17, 32, 613, 80002}      # códigos de "muitas chamadas": espera e tenta de novo
MAX_PAGINAS = 10


class Recusado(Exception):
    """Pedido fora da lista de leitura permitida (ou conexão real não autorizada). Nada sai da máquina."""


class ErroAPI(Exception):
    def __init__(self, status, codigo, mensagem):
        self.status, self.codigo = status, codigo
        super().__init__(limpar(f"HTTP {status} · código {codigo} · {mensagem}"))


def limpar(texto):
    """Remove tokens de qualquer texto (mensagens de erro, URLs)."""
    t = str(texto)
    t = re.sub(r"(access_token|client_secret|code)=[^&\s\"']+", r"\1=***", t, flags=re.I)
    t = re.sub(r"(Bearer|OAuth)\s+[A-Za-z0-9._~+/=-]+", r"\1 ***", t)
    t = re.sub(r"\b(IG|EA)[A-Za-z0-9]{30,}\b", "***", t)
    return t


# ---------------- registro de consultas (sem conteúdo) ----------------
def registrar(tipo, resultado, agora=None):
    agora = agora or datetime.now(timezone.utc)
    os.makedirs(DADOS, mode=0o700, exist_ok=True)
    limite = agora - timedelta(days=RETENCAO_DIAS)
    linhas = []
    if os.path.exists(REGISTRO):
        with open(REGISTRO, encoding="utf-8") as f:
            for l in f:
                try:
                    if datetime.fromisoformat(json.loads(l)["quando"]) >= limite: linhas.append(l.rstrip("\n"))
                except (ValueError, KeyError): pass
    linhas.append(json.dumps({"quando": agora.isoformat(timespec="seconds"), "consulta": tipo, "resultado": resultado}))
    with open(REGISTRO, "w", encoding="utf-8") as f: f.write("\n".join(linhas) + "\n")
    os.chmod(REGISTRO, 0o600)


# ---------------- transportes ----------------
def transporte_real(url, cabecalhos, timeout=30):
    """Único ponto que abriria uma conexão. Bloqueado até a autorização expressa do usuário."""
    if not CONEXAO_REAL_AUTORIZADA:
        raise Recusado("conexão real com o Instagram ainda não autorizada (fase 1: só testes offline)")
    req = urllib.request.Request(url, method="GET", headers=cabecalhos)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r: return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e: return e.code, e.read().decode("utf-8", "replace")


def transporte_simulado(url, cabecalhos):
    """Respostas fictícias (conta «studio.matteu.simulado») para testes e demonstrações offline."""
    u = urllib.parse.urlparse(url); q = urllib.parse.parse_qs(u.query); cam = u.path.split(f"/{VERSAO}/", 1)[1]
    perfil = {"id": "900", "user_id": "17840000000000001", "username": "studio.matteu.simulado", "name": "Studio Matteu (SIMULADO)",
              "account_type": "Media_Creator", "followers_count": 1234, "follows_count": 210, "media_count": 3}
    midias = [
        {"id": "1801", "caption": "Brasil sob temporais (SIMULADO)", "media_type": "VIDEO", "media_product_type": "REELS",
         "permalink": "https://www.instagram.com/reel/SIMULADO1/", "timestamp": "2026-11-08T21:00:00+0000", "like_count": 310, "comments_count": 2},
        {"id": "1802", "caption": "A IA virou uma arma de espionagem? (SIMULADO)", "media_type": "VIDEO", "media_product_type": "REELS",
         "permalink": "https://www.instagram.com/reel/SIMULADO2/", "timestamp": "2026-11-05T21:00:00+0000", "like_count": 190, "comments_count": 1},
        {"id": "1803", "caption": "Bastidores (SIMULADO)", "media_type": "CAROUSEL_ALBUM", "media_product_type": "FEED",
         "permalink": "https://www.instagram.com/p/SIMULADO3/", "timestamp": "2026-11-01T15:00:00+0000", "like_count": 80, "comments_count": 0},
    ]
    def resp(obj, st=200): return st, json.dumps(obj)
    if cam == "me": return resp({k: v for k, v in perfil.items() if k in q.get("fields", [""])[0].split(",")})
    if cam.endswith("/media"):
        n = int(q.get("limit", ["25"])[0]); return resp({"data": midias[:n], "paging": {"cursors": {"after": "FIM"}}})
    if cam.endswith("/comments"):
        dados = {"1801": [{"id": "5501", "text": "Que vídeo incrível! Qual programa vocês usam?", "timestamp": "2026-11-08T22:10:00+0000", "username": "pessoa.ficticia1", "like_count": 3},
                          {"id": "5502", "text": "Achei a narração rápida demais.", "timestamp": "2026-11-08T23:00:00+0000", "username": "pessoa.ficticia2", "like_count": 0}],
                 "1802": [{"id": "5503", "text": "Faz um tutorial disso!", "timestamp": "2026-11-06T10:00:00+0000", "username": "pessoa.ficticia3", "like_count": 5}]}
        return resp({"data": dados.get(cam.split("/")[0], [])})
    if cam.endswith("/content_publishing_limit"): return resp({"data": [{"quota_usage": 1, "config": {"quota_total": 50, "quota_duration": 86400}}]})
    if cam.endswith("/insights"):
        alvo, mets = cam.split("/")[0], q.get("metric", [""])[0].split(",")
        if alvo in ("me", "17840000000000001"):
            antes = int(q.get("until", ["0"])[0]) < int(time.time()) - 20 * 86400   # período anterior: números menores
            base = {"views": 52000, "reach": 18000, "accounts_engaged": 1500, "total_interactions": 2600, "likes": 2100,
                    "comments": 90, "shares": 260, "saves": 150}
            return resp({"data": [{"name": m, "period": "day", "total_value": {"value": int(base.get(m, 0) * (.7 if antes else 1))}} for m in mets]})
        vals = {"views": 15400, "reach": 9100, "likes": 310, "comments": 2, "saved": 40, "shares": 77, "total_interactions": 429,
                "ig_reels_avg_watch_time": 21300, "ig_reels_video_view_total_time": 328000000, "reels_skip_rate": 31.5, "profile_visits": 12, "follows": 3}
        return resp({"data": [{"name": m, "period": "lifetime", "values": [{"value": vals.get(m, 0)}]} for m in mets]})
    if re.fullmatch(r"\d+", cam):
        m = next((x for x in midias if x["id"] == cam), None)
        return resp(m) if m else resp({"error": {"message": "Object does not exist", "code": 100}}, 400)
    return resp({"error": {"message": "caminho simulado desconhecido", "code": 100}}, 400)


# ---------------- cliente ----------------
class Cliente:
    def __init__(self, transporte=None, dormir=time.sleep, registrar_consultas=True):
        self.transporte = transporte or transporte_real
        self.dormir, self.reg = dormir, registrar_consultas

    @staticmethod
    def validar(caminho, params, metodo="GET"):
        """Devolve o nome do tipo de consulta ou levanta Recusado. Nada é enviado se não passar daqui."""
        if metodo != "GET": raise Recusado(f"somente leitura: método {metodo} recusado")
        caminho = caminho.strip("/")
        for nome, padrao, campos, metricas in CAMINHOS:
            if re.fullmatch(padrao, caminho): break
        else: raise Recusado(f"caminho fora da lista de leitura: {caminho}")
        extras = set(params) - PARAMETROS
        if extras: raise Recusado(f"parâmetros não permitidos: {', '.join(sorted(extras))}")
        if "fields" in params:
            pedidos = {f.strip() for f in str(params["fields"]).split(",") if f.strip()}
            if campos is None or not pedidos <= campos: raise Recusado(f"campos não permitidos: {', '.join(sorted(pedidos - (campos or set())))}")
        if "metric" in params:
            pedidos = {m.strip() for m in str(params["metric"]).split(",") if m.strip()}
            if metricas is None or not pedidos <= metricas: raise Recusado(f"métricas não permitidas: {', '.join(sorted(pedidos - (metricas or set())))}")
        elif metricas is not None: raise Recusado("insights exige o parâmetro metric")
        return nome

    def get(self, caminho, **params):
        nome = self.validar(caminho, params)
        url = BASE + caminho.strip("/") + ("?" + urllib.parse.urlencode(params) if params else "")
        return self._pedir(nome, url)

    def _pedir(self, nome, url):
        cab = {"Authorization": "Bearer proxy-injected", "Accept": "application/json", "User-Agent": "studio-matteu-leitura/1"}
        for tentativa in range(4):
            try:
                status, corpo = self.transporte(url, cab)
            except Recusado:
                if self.reg: registrar(nome, "recusado")
                raise
            try: dados = json.loads(corpo) if corpo else {}
            except ValueError: dados = {"error": {"message": "resposta não é JSON", "code": -1}}
            if status == 200 and "error" not in dados:
                if self.reg: registrar(nome, "ok")
                return dados
            err = dados.get("error", {}); codigo = err.get("code", -1)
            if codigo in LIMITACAO and tentativa < 3:
                self.dormir(min(60, 5 * 2 ** tentativa)); continue
            if self.reg: registrar(nome, f"erro {codigo}")
            raise ErroAPI(status, codigo, err.get("message", "erro desconhecido"))

    def paginas(self, caminho, maximo=MAX_PAGINAS, **params):
        """Segue a paginação pelo cursor 'after' (nunca pela URL 'next', que poderia apontar para outro lugar)."""
        itens = []
        for _ in range(maximo):
            r = self.get(caminho, **params); itens += r.get("data", [])
            depois = (r.get("paging", {}).get("cursors", {}) or {}).get("after")
            if not depois or "next" not in r.get("paging", {}): break
            params["after"] = depois
        return itens


# ---------------- consultas de alto nível (usadas pelo MCP e pela linha de comando) ----------------
def perfil(c):
    return c.get("me", fields="user_id,username,name,account_type,followers_count,follows_count,media_count")


def publicacoes(c, limite=12):
    limite = max(1, min(int(limite), 50))
    return c.get("me/media", fields="id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count",
                 limit=limite).get("data", [])[:limite]


def metricas_midia(c, midia_id, tipo_produto):
    mets = METRICAS_REELS if tipo_produto == "REELS" else METRICAS_FEED
    r = c.get(f"{midia_id}/insights", metric=",".join(mets))
    return {d["name"]: (d.get("values") or [{}])[0].get("value", d.get("total_value", {}).get("value")) for d in r.get("data", [])}


def publicacao(c, midia_id, com_metricas=True):
    m = c.get(str(midia_id), fields="id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count")
    if com_metricas: m["metricas"] = metricas_midia(c, m["id"], m.get("media_product_type"))
    return m


def comentarios(c, midia_id, limite=50):
    """Texto dos comentários só para mostrar no chat: não é gravado em disco nem registrado."""
    return c.get(f"{midia_id}/comments", fields="id,text,timestamp,username,like_count", limit=max(1, min(int(limite), 50))).get("data", [])


def _totais(c, ini, fim, metricas):
    r = c.get("me/insights", metric=",".join(metricas), period="day", metric_type="total_value",
              since=int(ini.timestamp()), until=int(fim.timestamp()))
    return {d["name"]: d.get("total_value", {}).get("value") for d in r.get("data", [])}


def metricas_conta(c, dias=28, comparar=True, agora=None, metricas=None):
    """Totais do período (máx. 30 dias por consulta) e, se pedido, o período anterior de mesmo tamanho com a variação."""
    dias = max(1, min(int(dias), 30)); agora = agora or datetime.now(timezone.utc); mets = metricas or METRICAS_CONTA_PADRAO
    fim, ini = agora, agora - timedelta(days=dias)
    out = {"periodo": {"de": ini.date().isoformat(), "ate": fim.date().isoformat(), "dias": dias}, "atual": _totais(c, ini, fim, mets)}
    if comparar:
        out["anterior"] = _totais(c, ini - timedelta(days=dias), ini, mets)
        out["variacao_pct"] = {k: (round((v - out["anterior"].get(k, 0)) / out["anterior"][k] * 100, 1)
                                   if isinstance(v, (int, float)) and out["anterior"].get(k) else None) for k, v in out["atual"].items()}
    out["aviso"] = "Dados da Meta podem atrasar até 48 h; métricas marcadas «em desenvolvimento» podem mudar."
    return out


def cota(c):
    d = c.get("me/content_publishing_limit", fields="quota_usage,config").get("data", [{}])
    return d[0] if d else {}


def status(c):
    p = c.get("me", fields="user_id,username,account_type")
    return {"conectado": True, "conta": p.get("username"), "tipo": p.get("account_type"), "api": f"{HOST} {VERSAO}",
            "modo": "real" if c.transporte is transporte_real else "simulado", "somente_leitura": True}


def relatorio_markdown(c, dias=28, n=12):
    """Relatório sem nenhum conteúdo de terceiros: só números da conta e das próprias publicações."""
    p, mc, pubs = perfil(c), metricas_conta(c, dias), publicacoes(c, n)
    linhas = [f"# Relatório do Instagram · @{p.get('username')}", "",
              f"Período: {mc['periodo']['de']} a {mc['periodo']['ate']} ({mc['periodo']['dias']} dias), comparado ao período anterior.", "",
              f"Seguidores: {p.get('followers_count')} · publicações: {p.get('media_count')}", "",
              "| métrica | período | anterior | variação |", "|---|---|---|---|"]
    for k, v in mc["atual"].items():
        var = mc["variacao_pct"].get(k); linhas.append(f"| {k} | {v} | {mc['anterior'].get(k)} | {'' if var is None else f'{var:+.1f}%'} |")
    linhas += ["", "## Publicações recentes (por visualizações)", "", "| data | tipo | legenda | views | alcance | curtidas | comentários | compart. | salvos |", "|---|---|---|---|---|---|---|---|---|"]
    lista = []
    for m in pubs:
        mm = metricas_midia(c, m["id"], m.get("media_product_type")); lista.append((mm.get("views") or 0, m, mm))
    for _, m, mm in sorted(lista, key=lambda x: -x[0]):
        leg = (m.get("caption") or "").replace("\n", " ").replace("|", "/")[:50]
        linhas.append(f"| {m.get('timestamp', '')[:10]} | {m.get('media_product_type')} | {leg} | {mm.get('views')} | {mm.get('reach')} | "
                      f"{mm.get('likes')} | {mm.get('comments')} | {mm.get('shares')} | {mm.get('saved')} |")
    linhas += ["", mc["aviso"]]
    return "\n".join(linhas) + "\n"
