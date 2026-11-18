"""Utilitário: monta uma página HTML com as fontes da marca e renderiza em PNG via Playwright."""
import os, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BUILD = os.path.join(ROOT, "src", "_build")
os.makedirs(BUILD, exist_ok=True)

FONTS = f"""
@font-face{{font-family:'Cormorant';font-weight:300;src:url({ROOT}/fonts/cormorant-garamond-latin-300-normal.woff2)}}
@font-face{{font-family:'Cormorant';font-weight:400;src:url({ROOT}/fonts/cormorant-garamond-latin-400-normal.woff2)}}
@font-face{{font-family:'Cormorant';font-weight:500;src:url({ROOT}/fonts/cormorant-garamond-latin-500-normal.woff2)}}
@font-face{{font-family:'Cormorant';font-weight:600;src:url({ROOT}/fonts/cormorant-garamond-latin-600-normal.woff2)}}
@font-face{{font-family:'Cormorant';font-style:italic;font-weight:300;src:url({ROOT}/fonts/cormorant-garamond-latin-300-italic.woff2)}}
@font-face{{font-family:'Cormorant';font-style:italic;font-weight:400;src:url({ROOT}/fonts/cormorant-garamond-latin-400-italic.woff2)}}
@font-face{{font-family:'Cormorant';font-style:italic;font-weight:500;src:url({ROOT}/fonts/cormorant-garamond-latin-500-italic.woff2)}}
@font-face{{font-family:'InterA';font-weight:300;src:url({ROOT}/fonts/inter-latin-300-normal.woff2)}}
@font-face{{font-family:'InterA';font-weight:400;src:url({ROOT}/fonts/inter-latin-400-normal.woff2)}}
@font-face{{font-family:'InterA';font-weight:500;src:url({ROOT}/fonts/inter-latin-500-normal.woff2)}}
"""


def page(inner, w, h, bg="transparent", css=""):
    return (f"<!doctype html><html><head><meta charset='utf-8'><style>{FONTS}"
            f"html,body{{margin:0;width:{w}px;height:{h}px;background:{bg};overflow:hidden}}{css}</style></head>"
            f"<body>{inner}</body></html>")


def render(name, inner, w, h, out, scale=2, bg="transparent", css="", transparent=False, full=False):
    html = os.path.join(BUILD, name + ".html")
    open(html, "w").write(page(inner, w, h, bg, css))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    cmd = ["node", os.path.join(ROOT, "src", "render.js"), html, out, str(w), str(h), str(scale)]
    if transparent:
        cmd.append("--transparent")
    if full:
        cmd.append("--full")
    env = dict(os.environ)
    env["NODE_PATH"] = subprocess.check_output(["npm", "root", "-g"], text=True).strip()
    subprocess.run(cmd, check=True, env=env)
    return out
