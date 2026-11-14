# ROVIA · comercial vertical (React + Remotion)

Marca fictícia. 1080×1920, 30 fps, 28,5 s. Reconstrução cena a cena do vídeo de referência
(análise em `analise-referencia.md`, storyboard aprovado em `storyboard.md`).

## Como renderizar
```
cd projetos/rovia
bash audio/preparar.sh                       # narração, trilha original e efeitos → remotion/public/audio
cd remotion && npm install
npx remotion studio src/index.ts             # pré-visualização interativa
npm run render                                # saida/rovia.mp4 (depois: loudnorm −14 LUFS, ver abaixo)
ffmpeg -i saida/rovia.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -ar 48000 -c:a aac -b:a 256k saida/rovia-final.mp4
node scripts/quadros.mjs 3.5 9.8 22.5        # quadros soltos para revisão
```

## Estrutura
- `remotion/src/Video.tsx` — linha do tempo: cada cena com início/fim absolutos (segundos da narração).
- `remotion/src/cenas/AtoUm.tsx` (1–4), `AtoDois.tsx` (5–8), `AtoTres.tsx` (9–12) — uma função por cena.
- `remotion/src/ui.tsx` — marca ROVIA (ícone R-estrada), contador odômetro, celular, mini-barras, anéis, fundos, chicote.
- `remotion/src/lib.ts` — tempo, curvas, cores e tipografia (Inter, OFL, em `public/fontes`).
- `remotion/src/mix.json` — volumes: narração 1 · música 0,18 · efeitos 0,35.
- `audio/musica.py` — trilha original (100 BPM, marcas iguais às da referência, ducking pela voz).
- `audio/cues.json` + `audio/efeitos.py` — 104 efeitos do Earshot (MIT) no segundo exato de cada animação.
- `palavras.json` — tempos por palavra (alinhamento do ElevenLabs + deslocamento de cada frase).

## Narração
ElevenLabs, voz Matilda, modelo multilíngue v2 (`narracao-original.mp3`, intacta: sem aceleração e sem cortes
de palavras). As frases foram reposicionadas nos tempos das frases da referência (`narracao.wav`), separando
apenas nos silêncios; um ruído final de 0,4 s depois de «É grátis» (sem palavra) ficou de fora.
