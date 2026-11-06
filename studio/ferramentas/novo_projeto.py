#!/usr/bin/env python3
"""MOTION DESIGN STUDIO · novo projeto
Uso: python3 studio/ferramentas/novo_projeto.py <nome-curto> "Título do vídeo"
Cria projetos/<nome-curto>/ com projeto.json, tema.css, cenas.js, roteiro.md e storyboard.md.
"""
import os, re, shutil, sys
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELO = os.path.join(RAIZ, "studio", "modelo")
STORY = os.path.join(RAIZ, ".claude", "skills", "motion-design-studio", "referencias", "storyboard-modelo.md")
if len(sys.argv) < 3: sys.exit(__doc__)
nome = re.sub(r"[^a-z0-9-]", "-", sys.argv[1].lower()).strip("-"); titulo = sys.argv[2]
dest = os.path.join(RAIZ, "projetos", nome)
if os.path.exists(dest): sys.exit(f"já existe: {dest}")
os.makedirs(dest)
for f in ("projeto.json", "tema.css", "cenas.js", "roteiro.md"):
    txt = open(os.path.join(MODELO, f), encoding="utf-8").read().replace("__TITULO__", titulo)
    open(os.path.join(dest, f), "w", encoding="utf-8").write(txt)
shutil.copy(STORY, os.path.join(dest, "storyboard.md"))
open(os.path.join(dest, ".gitignore"), "w").write("saida/\n")
print(f"ok projetos/{nome}/  ·  próximo: salvar narracao.mp3 e roteiro.md, depois transcrever.py")
