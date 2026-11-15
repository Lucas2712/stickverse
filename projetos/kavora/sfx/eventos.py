#!/usr/bin/env python3
"""Lista de eventos sonoros do comercial KAVORA, derivada dos mesmos tempos que movem as animações
(remotion/src/timing.json + as defasagens usadas em cada cena). Cada t é o quadro em que o movimento começa.
Gera sfx/eventos.json no formato de lista tipada do Real SFX (t, type, len, g).
Uso: python3 sfx/eventos.py"""
import json
W = json.load(open('remotion/src/timing.json'))['words']
E = []
def ev(t, type_, g=1.0, len_=None, nota='', pan=None):
    if type_ == 'whoosh' and len_ and len_ <= 0.45: type_ = 'swish'   # movimentos curtos e laterais
    if type_ in ('whoosh', 'swish', 'wipe', 'passagem3d') and len_:
        t += len_ * 0.45            # o Real SFX ancora o whoosh pelo pico: pico no meio do movimento visível
    d = {'t': round(t, 3), 'type': type_, 'g': g}
    if len_: d['len'] = len_
    if pan is not None: d['pan'] = pan
    if nota: d['notes'] = nota
    E.append(d)

# ---- 01 abertura ----
ev(0.02, 'whoosh', 0.45, 0.4, 'Gerenciar sobe da máscara')
ev(0.30, 'whoosh', 0.35, 0.7, 'cartão-chave 3D entra pela esquerda (profundidade)', pan=-0.45)
ev(W['hotel'] + 0.06, 'bell', 0.32, nota='«hotel»: toque de sineta de recepção', pan=0.35)
# ---- 02 problema ----
ev(W['nao'] - 0.08, 'whoosh', 0.5, 0.5, 'linha 1 recua, «não precisa» entra')
for i in (0, 4):
    ev(W['nao'] + 0.33 + i * 0.075, 'tick', 0.55 - i * 0.04, nota=f'cartões de despesa pousam ({i+1})')
ev(W['nao'] + 0.42, 'click', 0.7, nota='ícone ✕ abre')
ev(W['complicado'] - 0.05, 'thump', 0.29, nota='«complicado» salta')
# ---- 03 solução ----
ev(W['com'] - 0.36, 'wipe', 0.6, 0.6, 'feixe de farol revela a cena, cartões saem', pan=-0.25)
ev(W['com'] + 0.08, 'hit', 0.4, nota='emblema pousa (camada: impacto leve)')
ev(W['tecnologia'] + 0.4, 'glass', 0.45, nota='brilho percorre o letreiro')
ev(W['voce'] - 0.25, 'whoosh', 0.45, 0.5, 'logo recua e sobe')
ev(W['lugar'] - 0.2, 'pop', 0.65, nota='pílula «em um só lugar» abre')
for k, g in (('reservas', .45), ('recepcao', .23), ('financeiro', .4), ('compras', .32), ('operacao', .38)):
    ev(W[k] - 0.12, 'whoosh', g, 0.35, f'pílula {k} desliza pela direita', pan=0.4)
    if k in ('reservas', 'financeiro', 'operacao'):
        ev(W[k] + 0.08, 'click', g + 0.1, nota=f'pílula {k} assenta')
ev(W['integrado'] - 0.3, 'whoosh', 0.45, 0.45, 'pílulas recolhem')
for i in range(1):
    ev(W['integrado'] - 0.16 + i * 0.18, 'pop', 0.35, nota=f'ícones da órbita {i+1}')
ev(W['integrado'] - 0.03, 'thump', 0.45, nota='ícone do app aparece no centro')
ev(W['controle'] - 1.0, 'riser', 0.35, 0.56, 'crescimento antes do zoom')
ev(W['controle'] - 0.3, 'passagem3d', 0.7, 0.5, 'ícone do app cresce até a câmera (som criado no Earshot)')
ev(W['controle'] + 0.04, 'thump', 0.5, nota='entra o ambiente escuro')
# ---- 04 escuro ----
ev(W['processos'] - 0.2, 'whoosh', 0.55, 0.6, 'cartão de processos sobe girando')
for i in (0,):
    ev(W['processos'] + i * 0.13, 'tick', 0.4, nota=f'linha de processo {i+1}')
ev(W['agilidade'] - 0.1, 'whoosh', 0.55, 0.5, 'cartão de ocupação entra pela direita; anterior recua', pan=0.35)
ev(W['decisoes'] - 0.45, 'whoosh', 0.6, 0.55, 'cartão laranja atravessa em 3D', pan=0.3)
ev(W['decisoes'] - 0.08, 'hit', 0.3, nota='cartão laranja assenta')
ev(W['decisoes'] + 0.03, 'click', 0.8, nota='botão Aprovar pressionado')
ev(W['decisoes'] + 0.15, 'success', 0.45, nota='Aprovado ✓')
ev(W['tempo'] - 0.25, 'whoosh', 0.55, 0.5, 'cartões saem pela esquerda, etapas entram', pan=-0.35)
for i in range(4):
    ev(W['tempo'] - 0.05 + i * 0.22, 'tick', 0.45, nota=f'etapa {i+1} acende')
ev(W['cuidar'] - 0.17, 'whoosh', 0.5, 0.6, 'painel vem da profundidade')
# ---- 05 laranja ----
ev(W['gestao'] - 1.05, 'riser', 0.22, 0.6, 'brasa laranja cresce')
ev(W['gestao'] - 0.45, 'whoosh', 0.24, 0.7, 'laranja sobe e toma o quadro')
ev(W['gestao'] - 0.02, 'hit', 0.4, nota='mudança de fundo para laranja')
ev(W['inteligente'] - 0.06, 'pop', 0.5, nota='«inteligente» salta')
ev(W['inteligente'] + 0.12, 'whoosh', 0.3, 0.55, 'círculo manuscrito')
ev(W['comeca'] - 0.3, 'whoosh', 0.65, 0.7, 'celular 3D sobe girando')
ev(W['comeca'] + 0.27, 'thump', 0.4, nota='celular assenta')
ev(W['conectado'] - 0.05, 'glitch', 0.1, nota='linhas conectam os ícones ao celular')
ev(W['conectado'] + 0.35, 'notify', 0.45, nota='notificação chega na tela')
# ---- 06/07 mergulho e marca ----
ev(W['kavora'] - 1.0, 'riser', 0.45, 0.9, 'crescimento para a marca')
ev(W['kavora'] - 0.42, 'passagem3d', 0.62, 0.45, 'celular mergulha na câmera (som criado no Earshot)')
ev(W['kavora'] + 0.14, 'brandhit', 0.75, nota='letras KAVORA 3D chegam (impacto principal)')
ev(W['kavora'] + 0.18, 'sting', 0.4, nota='camada de brilho no impacto')
# ---- 08 encerramento ----
ev(W['slogan'] - 0.16, 'wipe', 0.5, 0.6, 'feixe revela a cartela')
ev(W['slogan'] + 0.0, 'pop', 0.5, nota='emblema da cartela')
ev(W['gestao2'] - 0.25, 'pop', 0.5, nota='chamada «Baixe o app» surge')
E.sort(key=lambda d: d['t'])
json.dump(E, open('sfx/eventos.json', 'w'), ensure_ascii=False, indent=1)
print(len(E), 'eventos')
