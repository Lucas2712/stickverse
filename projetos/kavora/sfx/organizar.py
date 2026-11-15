#!/usr/bin/env python3
"""Copia os sons usados na mixagem final para sfx/biblioteca/<categoria>/ e escreve sfx/CREDITOS.md
(título, autor, licença, origem, momentos do filme e nota do Earshot quando houver).
Uso: python3 sfx/organizar.py   (dentro de projetos/kavora)"""
import json, os, shutil, collections
R = json.load(open('sfx/result/kavora_sfx_resolved_cues.json'))
cred = {os.path.basename(c['arquivo']): c for c in json.load(open('../../studio/sons/creditos.json'))}
rank = {}
for f in os.listdir('sfx/work/rank'):
    for it in json.load(open(f'sfx/work/rank/{f}')).get('results', json.load(open(f'sfx/work/rank/{f}')).get('ranked', [])) if False else []:
        pass
# notas do Earshot (z) de cada arquivo, pelas buscas de sfx/work/rank/*.json
for f in os.listdir('sfx/work/rank'):
    d = json.load(open(f'sfx/work/rank/{f}'))
    lst = d if isinstance(d, list) else next((v for v in d.values() if isinstance(v, list)), [])
    for it in lst:
        p = it.get('path') or it.get('file') or ''
        if p: rank[os.path.basename(p)] = (it.get('z'), it.get('verdict') or it.get('label'), d.get('query') if isinstance(d, dict) else f)
CAT = {'whoosh': 'whooshes', 'hit': 'impactos', 'pop': 'pops', 'click': 'cliques', 'chime': 'brilhos-e-sinos', 'riser': 'risers', 'glitch': 'texturas-digitais'}
uso = collections.defaultdict(list)
for c in R['cues']:
    f = c.get('file')
    if not f: continue
    uso[f].append((round(c['t'], 2), c.get('label', ''), c.get('role', '')))
os.makedirs('sfx/biblioteca', exist_ok=True)
linhas = []
for f, us in sorted(uso.items(), key=lambda kv: kv[1][0][0]):
    nome = os.path.basename(f); role = us[0][2]
    cat = 'criados-earshot' if '/sfx/criados/' in f else CAT.get(role, role)
    os.makedirs(f'sfx/biblioteca/{cat}', exist_ok=True)
    shutil.copy2(f, f'sfx/biblioteca/{cat}/{nome}')
    if '/sfx/criados/' in f:
        autor, lic, orig = 'Studio Matteu (criado com Earshot forge, receita «thump»)', 'Próprio (gerado por código; Earshot MIT)', 'sfx/earshot-forge/passagem3d/report.md'
    else:
        c = cred.get(nome, {})
        autor, lic, orig = c.get('autor', '?'), c.get('licenca', '?'), c.get('fonte', '?')
    z = rank.get(nome)
    nota = f"z {z[0]:+.1f} ({z[1]})" if z and z[0] is not None else ''
    tempos = ', '.join(f"{t:.2f}s" for t, _, _ in us)
    linhas.append(f"| {cat}/{nome} | {autor} | {lic} | {orig} | {tempos} | {nota} |")
txt = ["# Créditos dos efeitos sonoros · KAVORA", "",
       "Todos os efeitos da mixagem final, copiados por categoria em `sfx/biblioteca/`. Ordem = primeira aparição no filme.", "",
       "| arquivo | autor | licença | origem | momentos | nota do Earshot (encaixe com a direção) |", "|---|---|---|---|---|---|", *linhas, "",
       "## Openverse", "",
       "A busca da API funcionou, mas nenhum arquivo pôde ser baixado deste servidor: o Freesound (quase todo o acervo de efeitos do",
       "Openverse) bloqueia servidores de nuvem (HTTP 403, regra do estúdio: não contornar) e o Wikimedia Commons respondeu 429",
       "(limite de requisições) em todas as tentativas. Por isso nenhum som do Openverse entrou nesta versão.",
       "Candidatos CC0 encontrados e prontos para substituir os atuais quando o download for possível: `sfx/CANDIDATOS-OPENVERSE.md`.", "",
       "## Narração e música", "", "- Narração: gravada pelo usuário (`narracao-original.mp3`), pausas longas encurtadas (`narracao-cortes.md`).",
       "- Música: composição original do Studio Matteu feita por código (`remotion/ferramentas/compor_trilha.py`)."]
open('sfx/CREDITOS.md', 'w').write('\n'.join(txt) + '\n')
print(len(uso), 'arquivos em', sorted(os.listdir('sfx/biblioteca')))
