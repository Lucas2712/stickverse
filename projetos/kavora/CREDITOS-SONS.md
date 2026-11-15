# Créditos de som · KAVORA

- **Narração:** gravada e enviada pelo usuário (`narracao-original.mp3`). Só as 5 pausas entre frases foram encurtadas para 0,30 s (ver `narracao-cortes.md`); sem aceleração e sem palavras cortadas.
- **Efeitos sonoros:** biblioteca do estúdio `studio/sons/earshot/` (gerados por código com o Earshot, licença MIT), normalizados em `remotion/public/sfx/`. Lista de eventos em `remotion/src/audio.ts`.
- **Música:** nenhuma nesta versão. O canal de música está pronto (`remotion/src/assets.json → music`); faltou baixar a faixa CC0 escolhida no Wikimedia Commons (limite de requisições do servidor).

## Atualização · trilha original
- **Música:** composição original do Studio Matteu feita por código (`remotion/ferramentas/compor_trilha.py`, saída `remotion/public/trilha.wav`):
  eletrônica minimalista a 118 BPM, sem amostras de terceiros. O download das faixas CC0 (Mesostic, Komiku) foi bloqueado
  pelo Wikimedia neste servidor; se você quiser trocar pela faixa do Mesostic, basta colocar o arquivo em `public/` e
  apontar `src/assets.json → music.file`.
- **Mix:** música entre 12% (durante a fala) e 18% (nas pausas), ducking automático pelos trechos de fala da transcrição,
  fade-in de 1,5 s e fade-out nos 2 s finais; efeitos com ganho geral 0,85.
