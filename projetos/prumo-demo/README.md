# prumo-demo · anúncio de demonstração (marca fictícia)

Vídeo vertical de 36,5 s produzido em **React + Remotion** (rota nova e opcional do estúdio; não substitui o pipeline HTML).

| Pasta / arquivo | O que é |
|---|---|
| `referencias/analise.md` | análise das 5 referências enviadas (ritmo e gramática; nada copiado) |
| `roteiro.md` | roteiro final (texto exato da narração) |
| `storyboard.json/.md/.html` | storyboard e direção de arte aprovados (paleta Apple pedida pelo usuário) |
| `timeline.md` | tempos de cada cena e de cada efeito sonoro (entrada/saída/ganho/evento) |
| `palavras.json` | tempo de cada palavra (alinhamento da ElevenLabs) |
| `audio/` | narração, testes de voz, efeitos originais (`efeitos/`), prompts (`sfx.json`), trilha cortada |
| `remotion/` | projeto Remotion: `src/scenes` (uma cena por arquivo), `src/components`, `src/animations`, `src/audio/cues.js`, `src/styles/tokens.js`, `public/` (áudio, sfx, fonte) |
| `CREDITOS-SONS.md` | licenças (narração, efeitos, trilha, fonte) |
| `saida/` (fora do git) | MP4 final + narração, efeitos e trilha separados + timeline |

## Renderizar

    cd projetos/prumo-demo/remotion
    npm install
    bash render.sh          # render + masterização (−14 LUFS, pico −1 dBTP) → out/prumo-demo.mp4
    npx remotion studio src/index.jsx   # prévia interativa

Composições: `Prumo` (com trilha) e `PrumoSemTrilha`.
