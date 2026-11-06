#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · montar
Junta motor + componentes + cenas do projeto + fontes + áudio num único HTML executável
(o mesmo arquivo serve para o link interativo, a revisão e a exportação MP4).

Uso: python3 studio/ferramentas/montar.py projetos/<nome>
Saída: projetos/<nome>/saida/<nome>.html
"""
import base64, json, mimetypes, os, sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MOTOR = ["motor/motor.js", "motor/legendas.js", "motor/audio.js"]
COMPONENTES = ["componentes/tipografia.js", "componentes/transicoes.js", "componentes/ui.js",
               "componentes/infografico.js", "componentes/mapa.js", "componentes/fundo.js"]
FONTES = {  # nome no projeto.json → (arquivo, família CSS, descritores)
    "geist": ("geist.woff2", "Geist", "font-weight:100 900"),
    "geist-mono": ("geist-mono.woff2", "Geist Mono", "font-weight:100 900"),
    "archivo": ("archivo.woff2", "Archivo", "font-weight:100 900;font-stretch:62% 125%"),
    "bricolage": ("bricolage.woff2", "Bricolage Grotesque", "font-weight:200 800;font-stretch:75% 100%"),
    "instrument-serif": ("instrument-serif.woff2", "Instrument Serif", "font-weight:400;font-style:normal"),
    "instrument-serif-italico": ("instrument-serif-italico.woff2", "Instrument Serif", "font-weight:400;font-style:italic"),
}
AUDIO_EXT = (".mp3", ".wav", ".m4a", ".aac", ".ogg")


def ler(p, modo="r"):
    with open(p, modo, **({} if "b" in modo else {"encoding": "utf-8"})) as f:
        return f.read()


def data_uri(p):
    mime = mimetypes.guess_type(p)[0] or "application/octet-stream"
    if p.endswith(".m4a"): mime = "audio/mp4"
    return f"data:{mime};base64," + base64.b64encode(ler(p, "rb")).decode()


def achar_narracao(proj):
    for ext in AUDIO_EXT:
        p = os.path.join(proj, "narracao" + ext)
        if os.path.exists(p): return p
    return None


def js_seguro(obj):
    return json.dumps(obj, ensure_ascii=False).replace("</", "<\\/")


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    proj = os.path.abspath(sys.argv[1]); nome = os.path.basename(proj.rstrip("/"))
    cfg = json.loads(ler(os.path.join(proj, "projeto.json")))
    cenas = ler(os.path.join(proj, "cenas.js"))
    tema = ler(os.path.join(proj, "tema.css")) if os.path.exists(os.path.join(proj, "tema.css")) else ""
    pal_p = os.path.join(proj, "palavras.json")
    palavras = json.loads(ler(pal_p)) if os.path.exists(pal_p) else []

    # fontes embutidas (sempre Geist para a interface do player)
    fontes = list(dict.fromkeys(["geist", "geist-mono"] + cfg.get("fontes", [])))
    faces = []
    for f in fontes:
        if f not in FONTES: sys.exit(f"fonte desconhecida: {f} (disponíveis: {', '.join(FONTES)})")
        arq, fam, desc = FONTES[f]
        faces.append(f"@font-face{{font-family:\"{fam}\";src:url({data_uri(os.path.join(RAIZ, 'fontes', arq))}) format(\"woff2\");{desc};font-display:block}}")

    # áudio
    audio = cfg.setdefault("audio", {})
    narr = achar_narracao(proj)
    vo = f'<audio id="vo" preload="auto" src="{data_uri(narr)}"></audio>' if narr else '<audio id="vo"></audio>'
    mus_cfg = audio.get("musica") or {}
    mus = '<audio id="mus"></audio>'
    if mus_cfg.get("arquivo"):
        mp = os.path.join(proj, mus_cfg["arquivo"])
        if not os.path.exists(mp): sys.exit(f"música indicada em projeto.json não encontrada: {mp}")
        mus = f'<audio id="mus" preload="auto" src="{data_uri(mp)}"></audio>'

    dados = ""
    if "MDS.mapa" in cenas or "M.mapa" in cenas:
        dados = "window.MDS_DADOS={paises:" + ler(os.path.join(RAIZ, "dados", "paises-110m.json")) + "};"

    scripts = [ler(os.path.join(RAIZ, p)) for p in MOTOR + COMPONENTES]
    publico = {k: v for k, v in cfg.items() if k not in ("roteiro",)}
    titulo = cfg.get("titulo", nome)
    html = f"""<title>{titulo}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
{''.join(faces)}
{ler(os.path.join(RAIZ, 'motor', 'base.css'))}
/* ===== tema do projeto ===== */
{tema}
</style>

<div class="app">
  <div class="player">
    <div class="vp" id="vp">
      <div id="stage" aria-label="Animação: {titulo}"></div>
      <button class="poster" id="poster" aria-label="Assistir"><span><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span></button>
    </div>
    <div class="ctrl">
      <button class="btn primary" id="play" aria-label="Iniciar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg><span>Iniciar</span></button>
      <button class="btn" id="restart" aria-label="Reiniciar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/></svg><span>Reiniciar</span></button>
      <input type="range" id="scrub" min="0" max="30" step="0.01" value="0" aria-label="Posição no vídeo">
      <span class="time" id="time">00:00</span>
    </div>
    <div class="mix" id="mix" aria-label="Volumes"></div>
    <div class="opts">
      <label><input type="checkbox" id="caps" checked> Legendas</label>
      <label><input type="checkbox" id="sfx" checked> Efeitos</label>
      <label><input type="checkbox" id="safe"> Zona segura</label>
    </div>
  </div>
  <div class="side">
    <h1>{titulo}</h1>
    <p class="lede">{cfg.get('descricao', '')}</p>
    <div class="meta"><span>1080×1920 · 9:16</span><span>{cfg.get('fps', 30)} fps</span><span id="meta-dur"></span><span id="meta-cenas"></span></div>
    <ol class="scene-list" id="scenes"></ol>
  </div>
</div>
{vo}
{mus}
<script>
window.PROJETO={js_seguro(publico)};
window.PALAVRAS={js_seguro(palavras)};
{dados}
</script>
""" + "\n".join(f"<script>\n{s}\n</script>" for s in scripts) + f"""
<script>
/* ===== cenas do projeto: {nome} ===== */
{cenas}
</script>
<script>
{ler(os.path.join(RAIZ, 'motor', 'player.js'))}
</script>
"""
    saida = os.path.join(proj, "saida"); os.makedirs(saida, exist_ok=True)
    out = os.path.join(saida, nome + ".html")
    with open(out, "w", encoding="utf-8") as f: f.write(html)
    mb = len(html.encode()) / 1e6
    print(f"ok {out} ({mb:.2f} MB)")
    if mb > 15: print("AVISO: acima de 15 MB; o link interativo aceita até 16 MB. Comprima o áudio (128 kbps mono) ou divida o vídeo.")


if __name__ == "__main__":
    main()
