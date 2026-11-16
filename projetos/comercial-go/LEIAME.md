# Comercial GO · gobank (15 s, 1920×1080, 60 fps)

Filme em Three.js (WebGL) com trilha original em Web Audio (120 BPM) e efeitos sonoros reais (Real SFX, biblioteca `studio/sons`).
Projeto fora do padrão vertical do estúdio: tem ferramentas próprias aqui dentro, sem mexer em `studio/ferramentas`.

## Espaços reservados (trocar quando chegarem os arquivos oficiais)
- **Logo gobank**: caixa tracejada «LOGO GOBANK» no cartão (`src/card.js`, `faceTextures`) e na cartela final (`src/overlay.js`, bloco LOGO FINAL).
- **Cor da marca**: `BRAND_HEX` em `src/scene.js` (provisória `#19C79B`) + `--ac` em `src/pagina.html` + rótulo `#7FE8C9` em `src/overlay.js`.
- **Benefícios** (genéricos, aprovados como provisórios): `BENEFICIOS` em `src/overlay.js`.

## Comandos
    npm install                                  # three 0.187, esbuild, topojson-client, d3-geo
    node build.mjs                               # saida/comercial-go.html (arquivo único; embute saida/efeitos.mp3 se existir)
    node quadros.cjs [N=20] 2.0 4.5 ...          # quadros avulsos para revisão → saida/quadros/
    node exportar.cjs --rascunho                 # prévia 960×540 30 fps (≈13 min)
    node exportar.cjs --workers 2                # final 1920×1080 60 fps, 8–20 subquadros por quadro (≈2 h neste servidor sem GPU)
    bash efeitos.sh saida/comercial-go-video-musica.mp4 saida/comercial-go.mp4   # efeitos reais + mix −14 LUFS
(NODE_PATH=$(npm root -g) para o Playwright.)

## Render
- Cartão PBR (MeshPhysicalMaterial, clearcoat), bisel extrudado, chip com relevo, GO em hot-stamping metálico.
- Luz: spot com sombra VSM, contraluzes, luz rasante no macro, RectAreaLight estreita = a linha de luz que percorre o cartão;
  ambiente de estúdio (softboxes → PMREM) para os reflexos.
- Pós por quadro: GTAO (oclusão de ambiente), Bokeh (profundidade de campo com foco animado), bloom contido, tone mapping Neutral.
- Motion blur temporal: acumulação de 8 a 20 subquadros por quadro (obturador 180°), com jitter subpixel (antisserrilhado).
  O número de subquadros sai do deslocamento real na tela (`window.__motion`), 20 nos movimentos rápidos.
  Simplificação assumida: a sombra é atualizada uma vez por quadro, e AO/DOF/bloom são calculados sobre o quadro já acumulado.
- Globo: pontos de terra do Natural Earth 1:110m (`studio/dados/paises-110m.json`, licença em `studio/dados/LICENCA-world-atlas.txt`).
