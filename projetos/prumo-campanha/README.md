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
