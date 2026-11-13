# prumo-campanha · «Seu negócio precisa de direção» (~91 s, 1080×1920, 30 fps)

Projeto React + Remotion. Marca fictícia (conceito do Studio Matteu).

| Arquivo | O que é |
|---|---|
| `roteiro.md` | texto da narração (exato do briefing) |
| `storyboard.*` | storyboard aprovado (com os ajustes do usuário) |
| `timeline.md` | tempos de cada cena, narração, efeito e marco musical |
| `IDENTIDADE.md` | identidade visual e assinaturas |
| `LICENCAS.md` · `CREDITOS-SONS.md` | licenças (atenção: ElevenLabs gratuito = não comercial) |
| `audio/` | narração por cena (+ alinhamento), testes de voz, 36 efeitos e prompts, trilha editada |
| `remotion/src` | `scenes/` (um ato por arquivo) · `components/` (Desk3D, Compass, AppUI, Screens…) · `audio/` (timeline, cues, música) · `styles/` |

## Renderizar
    cd projetos/prumo-campanha/remotion && npm install && bash render.sh     # → out/prumo-campanha.mp4 (−14 LUFS)

A linha do tempo é dirigida pela narração (`src/audio/palavras.json` + `N` em `musica.json`): trocar a narração e
regenerar o alinhamento reposiciona cenas, efeitos e batidas automaticamente.
