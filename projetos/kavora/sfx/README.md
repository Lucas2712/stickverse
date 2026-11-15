# Sonorização · KAVORA (Openverse + Real SFX + Earshot)

Entrega: `saida/kavora-v3.mp4` (fora do git). Vídeo idêntico ao v2; só o áudio foi refeito.

## Pipeline (refazer do zero)

    cd projetos/kavora
    python3 sfx/stems.py                     # voz + música (mesmo envelope do Remotion) → sfx/stems/
    python3 sfx/eventos.py                   # 56 eventos tirados dos tempos das animações → sfx/eventos.json
    export REAL_SFX_CONFIG=$PWD/sfx/realsfx/config.json REAL_SFX_INDEX=$PWD/sfx/realsfx/library_index.json
    cd ../../.claude/skills/real-sfx
    python3 scripts/build_index.py && python3 scripts/listen.py tag-index   # só se o índice faltar
    python3 scripts/from_cues.py $P/sfx/eventos.json --video $P/saida/kavora-v2.mp4 --out $P/sfx/work/cues.json \
        --ui library --drop-original --ui-pitch off --map "$(cat $P/sfx/mapa-earshot.json)"
    python3 scripts/sheet.py top $P/sfx/work/cues.json keep_audio=yes 'base_audio=[{"file":".../musica.wav","keep_level":true},{"file":".../voice.wav","keep_level":true}]'
    python3 scripts/sheet.py gain $P/sfx/work/cues.json --db -3
    python3 $P/sfx/pos_cues.py $P/sfx/work/cues.json        # cortes de grave e pan do movimento
    python3 scripts/mix.py $P/sfx/work/cues.json --out $P/sfx/result/kavora_sfx.mp4 --voice-safe --stems
    python3 scripts/critique.py ... ; python3 scripts/verify.py ...
    # master: compressão 2:1 leve + loudnorm linear -15 LUFS, teto -2,5 dBTP → saida/kavora-v3.mp4
    python3 sfx/organizar.py                 # copia os sons usados para sfx/biblioteca/ e escreve sfx/CREDITOS.md

**Atenção:** com base_audio, use `keep_audio=yes` (o `--drop-original` grava `no` e o mix.py então descarta voz e música).
`tag-index` grava na pasta da skill (`library_embeddings.*`): restaure com `git checkout` ao terminar.

## Arquivos
- `mapa-earshot.json`: pools de sons por tipo de evento, escolhidos pelo `earshot rank` (notas em `work/rank/`, fora do git).
- `criados/`: sons de passagem 3D feitos com `earshot forge thump` (relatório em `earshot-forge/passagem3d/report.md`).
- `result/critica.md`: as 14 rodadas da autocrítica do Real SFX; `result/earshot-folha.png` e `earshot-critica.json`: revisão final.
- `CANDIDATOS-OPENVERSE.md`: gravações reais CC0 encontradas, não baixadas (403/429 neste servidor).
