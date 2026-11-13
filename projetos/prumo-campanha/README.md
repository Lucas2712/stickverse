# prumo-campanha · «Seu negócio precisa de direção» — v3 (87,6 s, 1080×1920, 60 fps)

Projeto React + Remotion. Marca fictícia (conceito do Studio Matteu).

| Arquivo | O que é |
|---|---|
| `roteiro.md` | texto da narração (exato do briefing) |
| `storyboard.*` | storyboard aprovado (com os ajustes do usuário) |
| `timeline.md` | tempos de cada cena, narração, efeito e marco musical |
| `IDENTIDADE.md` | identidade visual e assinaturas |
| `LICENCAS.md` · `CREDITOS-SONS.md` | licenças (atenção: ElevenLabs gratuito = não comercial) |
| `audio/` | narração por cena (+ alinhamento), testes de voz, 36 efeitos e prompts, trilha editada |
| `remotion/src` | `scenes/` (um ato por arquivo) · `scenes/V3_A1…A7` (um ato por arquivo, cada um com a sua câmera) · `components/` (Motion, Compass, AppUI, Screens…) · `animations/cam.js` (câmera e desfoque de movimento) · `audio/` (timeline, cues, música) · `styles/` |

## Renderizar
    cd projetos/prumo-campanha/remotion && npm install && bash render.sh     # → out/prumo-campanha.mp4 (−14 LUFS)

A linha do tempo é dirigida pela narração (`src/audio/palavras.json` + `N` em `musica.json`): trocar a narração e
regenerar o alinhamento reposiciona cenas, efeitos e batidas automaticamente.

Regerar o plano musical depois de trocar a narração: `python3 -I audio/plano_musica_v3.py audio/trilha/ambiant-hope-original.ogg audio/trilha/ambiant-hope-beats.npy`

Diagnóstico e plano da v3: `DIAGNOSTICO-V3.md`.

## v4 (Remotion 4.0.543, 30 fps)
- Cópia intacta da v3.1 em `remotion-v3.1/`; MP4 da v3.1 em `saida/video/prumo-campanha-v3.1.mp4` (fora do git).
- Bússola em 3D real (`components/Compass3D.jsx`, `@remotion/three` + Three.js), atos 2/3/5/7 reconstruídos, light leak próprio (`components/Leak.jsx`; o `lightLeak` oficial exige WebGPU, indisponível aqui).
- Render: `bash remotion/render_blocos.sh` (4 blocos, `--gl=swangle`; com o modo padrão e 4 abas em paralelo o Chrome trava em quadros pesados). Áudio mixado por `mixar.py` com os mesmos dados de `cues.js`.
- Métricas v3.1 → v4: quadros parados 28% → 19%; segundos quase parados 16 → 7; ato 7: 67% → 3%.
