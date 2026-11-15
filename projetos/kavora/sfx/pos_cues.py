#!/usr/bin/env python3
"""Ajustes de mixagem aplicados à folha do Real SFX depois do from_cues (reaplicáveis a cada rodada):
corte de graves (220 Hz; 180 Hz no impacto da marca) em impactos e pousos, para não somar com o grave da trilha nem pesar no celular."""
import json, sys
p = sys.argv[1]; d = json.load(open(p))
n = 0
# pan do movimento: vem da lista de eventos (sfx/eventos.json), casando pelo tempo
EV = [e for e in json.load(open(__file__.rsplit('/', 1)[0] + '/eventos.json')) if 'pan' in e]
for c in d['cues']:
    lab = str(c.get('label', ''))
    if 'brandhit' in lab:
        c['highpass'] = 200; c['gain_db'] = float(c.get('gain_db', 0)) - 1.5; n += 1                       # o subgrave do impacto já vem da trilha
    elif lab.startswith('hit'):                           # pousos (emblema, cartão, fundo): leves, sem grave
        c['highpass'] = 320; c['gain_db'] = float(c.get('gain_db', 0)) - 7; n += 1
    elif any(k in lab for k in ('thump', 'passagem3d')):
        c['highpass'] = 220; c['gain_db'] = float(c.get('gain_db', 0)) - 3; n += 1
        if 'thump' in lab: c['anchor'] = 'peak'            # pouso: o pico cai no quadro do assentamento
    elif c.get('role') == 'whoosh' or any(k in lab for k in ('whoosh', 'swish', 'wipe')):
        c['highpass'] = 120; n += 1                       # ar sem subgrave: a trilha cuida do grave
for c in d['cues']:
    for e in EV:
        if abs(c['t'] - e['t']) < 0.03: c['pan'] = e['pan']
json.dump(d, open(p, 'w'), indent=1, ensure_ascii=False)
print(f'corte de graves em {n} cue(s)')
