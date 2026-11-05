#!/usr/bin/env python3
"""Gera comercial-ia.html (arquivo único, executável) a partir de comercial.src.html,
embutindo a narração (narracao.mp3) e os tempos de cada palavra (palavras.json).

Uso: python3 build.py
"""
import base64, json, os
AQUI = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(AQUI, "comercial.src.html"), encoding="utf-8").read()
mp3 = base64.b64encode(open(os.path.join(AQUI, "narracao.mp3"), "rb").read()).decode()
palavras = json.load(open(os.path.join(AQUI, "palavras.json"), encoding="utf-8"))
out = src.replace("__AUDIO__", "data:audio/mpeg;base64," + mp3).replace("__WORDS__", json.dumps(palavras, ensure_ascii=False))
open(os.path.join(AQUI, "comercial-ia.html"), "w", encoding="utf-8").write(out)
print("ok", len(out) // 1024, "KB")
