#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · sfx_real (efeitos sonoros reais em faixa separada, sem música)

Pega os eventos de som que as cenas já registram (MDS.sfx / sfx: [...]) e entrega ao Real SFX
(.claude/skills/real-sfx), que escolhe sons reais da biblioteca do estúdio (studio/sons: Openverse conferido +
banco do Earshot) e do pacote uisfx (CC0), coloca cada um no quadro exato e mixa com a narração protegida.

Uso: python3 studio/ferramentas/sfx_real.py projetos/<nome> [--sem-exportar] [--realce 6]
  --realce N  sobe N dB os sons pequenos de interface (vídeos com narração contínua, como tutoriais)
Antes: montar.py (o HTML do projeto precisa existir).

Gera em projetos/<nome>/saida/:
  <nome>-voz.mp4                 vídeo só com a narração (base; exportar.js --sem-efeitos)
  <nome>-sfx-real.mp4            vídeo final: narração + efeitos reais
  sfx-real/<nome>-sfx-real_sfx_track.wav   a faixa de efeitos SEPARADA
  sfx-real/eventos.json, cues.json, critica.txt, usados.json
  e projetos/<nome>/CREDITOS-SONS.md com os sons usados.
Nunca adiciona música. O exportador e os efeitos sintetizados continuam funcionando como antes.
"""
import glob, json, os, shutil, subprocess, sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RSFX = os.path.join(RAIZ, ".claude", "skills", "real-sfx")

# tipo do estúdio → tipo do Real SFX (references/typed-cues.md), comprimento padrão, ganho relativo
MAPA = {"whoosh": ("whoosh", .6, 1), "swoosh": ("whoosh", .3, .9), "riser": ("riser", 1.2, 1), "swell": ("riser", .9, .6),
        "pop": ("pop", None, 1), "blip": ("pop", None, .6), "tick": ("tick", None, 1), "click": ("click", None, 1),
        "send": ("click", None, .9), "flip": ("wipe", None, 1), "boom": ("hit", None, 1), "hit": ("hit", None, 1),
        "chime": ("chime", None, 1), "ding": ("chime", None, 1), "glitch": ("glitch", None, 1), "key": ("key", None, 1)}

JS_EVENTOS = r"""
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(process.argv[1], 'utf8') + '</body></html>', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__pronto || window.__erro, null, { timeout: 30000 });
  process.stdout.write(JSON.stringify(await p.evaluate(() => MDS.SFX))); await b.close(); })();
"""


def run(cmd, **kw):
    print("·", " ".join(os.path.relpath(c, RAIZ) if os.path.isabs(c) else c for c in cmd)[:160])
    return subprocess.run(cmd, check=True, **kw)


def eventos(html):
    env = dict(os.environ, NODE_PATH=subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip())
    sfx = json.loads(subprocess.run(["node", "-e", JS_EVENTOS, html], capture_output=True, text=True, check=True, env=env).stdout)
    sfx.sort(key=lambda e: e[1])
    out, teclas = [], []
    for tipo, t, g in sfx:
        if tipo == "key": teclas.append((t, g)); continue
        if tipo not in MAPA: print(f"  aviso: tipo sem equivalente real ({tipo} em {t:.2f} s), ignorado"); continue
        k, ln, gm = MAPA[tipo]
        e = {"t": round(t, 3), "type": k, "g": round((g or 1) * gm, 3)}
        if ln: e["len"] = ln
        out.append(e)
    # teclas seguidas viram trechos de digitação (len, n)
    grupo = []
    for t, g in teclas + [(1e9, 0)]:
        if grupo and t - grupo[-1][0] > .25:
            out.append({"t": round(grupo[0][0], 3), "type": "key", "len": round(grupo[-1][0] - grupo[0][0] + .1, 3), "n": len(grupo), "g": round(grupo[0][1] or 1, 3)})
            grupo = []
        grupo.append((t, g))
    return sorted(out, key=lambda e: e["t"])


def ajustar_caminhos():
    """O índice da biblioteca guarda caminhos absolutos. Se o repositório mudou de pasta (ex.: /home/user → /workspace),
    troca a raiz antiga pela atual em config.json, library_index.json e library_embeddings.json do Real SFX."""
    cfgp = os.path.join(RSFX, "config.json")
    try: libs = json.load(open(cfgp, encoding="utf-8")).get("libraries", [])
    except Exception: return
    sons = os.path.join(RAIZ, "studio", "sons")
    for lib in libs:
        velho = lib.get("path", "")
        if velho.endswith("/studio/sons") and not os.path.isdir(velho) and os.path.isdir(sons):
            raiz_velha = velho[: -len("/studio/sons")]
            for f in ("config.json", "library_index.json", "library_embeddings.json"):
                fp = os.path.join(RSFX, f)
                if os.path.exists(fp):
                    t = open(fp, encoding="utf-8").read()
                    open(fp, "w", encoding="utf-8").write(t.replace(raiz_velha + "/", RAIZ + "/"))
            print(f"  caminhos da biblioteca de sons atualizados: {raiz_velha} → {RAIZ}")
            return


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    ajustar_caminhos()
    proj = os.path.abspath(sys.argv[1]); nome = os.path.basename(proj.rstrip("/"))
    html = os.path.join(proj, "saida", nome + ".html")
    if not os.path.exists(html): sys.exit("rode antes: python3 studio/ferramentas/montar.py " + sys.argv[1])
    cfg = json.load(open(os.path.join(proj, "projeto.json"), encoding="utf-8"))
    if (cfg.get("audio") or {}).get("musica"): print("  aviso: projeto.json tem música; a regra do canal é sem música. Ela fica de fora deste passo (--sem-musica).")
    W = os.path.join(proj, "saida", "sfx-real"); os.makedirs(W, exist_ok=True)
    ev = eventos(html); json.dump(ev, open(os.path.join(W, "eventos.json"), "w"), indent=1)
    print(f"  {len(ev)} eventos de som")
    voz = os.path.join(proj, "saida", nome + "-voz.mp4")
    if "--sem-exportar" not in sys.argv or not os.path.exists(voz):
        env = dict(os.environ, NODE_PATH=subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip())
        run(["node", os.path.join(RAIZ, "studio", "ferramentas", "exportar.js"), proj, "--sem-efeitos", "--sem-musica"], env=env)
    py = sys.executable
    run([py, "scripts/from_cues.py", os.path.join(W, "eventos.json"), "--video", voz, "--out", os.path.join(W, "cues.json")], cwd=RSFX)
    # voz em primeiro plano: impactos, quedas e glitches perdem o grave (>= 150 Hz) para não somar com a voz
    cj = os.path.join(W, "cues.json"); d = json.load(open(cj))
    for c in d["cues"]:
        rot = (c.get("label", "") + " " + str(c.get("role", ""))).lower()
        if any(k in rot for k in ("hit", "drop", "glitch", "boom")): c.setdefault("highpass", 150)
        if any(k in rot for k in ("hit", "drop", "boom")) and not c.get("_grave_ok"):
            c["gain_db"] = round(c.get("gain_db", 0) - 6, 1); c["_grave_ok"] = 1   # o filtro sozinho deixa grave demais
    # --realce N: sons pequenos de interface (cliques, pops, tiques, teclas, sinos) N dB mais altos; a voz segue protegida
    rl = float(sys.argv[sys.argv.index("--realce") + 1]) if "--realce" in sys.argv else 0
    if rl:
        for c in d["cues"]:
            rot = (c.get("label", "") + " " + str(c.get("uisfx", "")) + " " + str(c.get("role", ""))).lower()
            if any(k in rot for k in ("click", "pop", "tick", "key", "chime", "ding", "blip", "press", "select", "progress", "notification")) and not c.get("_realce"):
                c["gain_db"] = round(c.get("gain_db", 0) + rl, 1); c["_realce"] = rl
    json.dump(d, open(cj, "w"), indent=1)
    final = os.path.join(W, nome + "-sfx-real.mp4")
    run([py, "scripts/mix.py", os.path.join(W, "cues.json"), "--out", final, "--voice-safe"] + (["--no-match-layer"] if "--realce" in sys.argv else []), cwd=RSFX)
    res = os.path.join(W, nome + "-sfx-real_resolved_cues.json"); trk = os.path.join(W, nome + "-sfx-real_sfx_track.wav")
    crit = subprocess.run([py, "scripts/critique.py", res, trk], cwd=RSFX, capture_output=True, text=True)
    open(os.path.join(W, "critica.txt"), "w").write(crit.stdout + crit.stderr)
    shutil.copy(final, os.path.join(proj, "saida", nome + "-sfx-real.mp4"))
    # sons usados → créditos do projeto
    usados = set()
    for c in (json.load(open(res)).get("cues") if isinstance(json.load(open(res)), dict) else json.load(open(res))) or []:
        for k in ("file", "path", "sound", "src"):
            v = c.get(k) if isinstance(c, dict) else None
            if isinstance(v, str) and "studio/sons/" in v: usados.add("studio/sons/" + v.split("studio/sons/", 1)[1])
    json.dump(sorted(usados), open(os.path.join(W, "usados.json"), "w"), indent=1)
    run([py, os.path.join(RAIZ, "studio", "ferramentas", "sons.py"), "creditos", proj])
    print(f"\nok {os.path.relpath(os.path.join(proj, 'saida', nome + '-sfx-real.mp4'), RAIZ)}")
    print(f"   faixa de efeitos separada: {os.path.relpath(trk, RAIZ)}")
    print("   crítica do Real SFX: " + os.path.relpath(os.path.join(W, 'critica.txt'), RAIZ))


if __name__ == "__main__":
    main()
