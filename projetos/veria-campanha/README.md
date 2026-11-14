# VÉRIA · Seu dinheiro. Seu ritmo.

Comercial vertical de 71 s para a fintech fictícia **VÉRIA**, feito do zero em **React + Remotion**
(Studio Matteu). 1080 × 1920 · 30 fps · H.264 + AAC · master em −14 LUFS.

## Rodar e renderizar

```bash
cd projetos/veria-campanha
npm install
npm run marca                     # regenera todos os SVGs da marca e src/branding/marca.json
npx remotion studio src/index.ts  # pré-visualização interativa
# render (no ambiente de nuvem, use o chrome-headless-shell instalado):
npx remotion render src/index.ts Veria saida/veria-bruto.mp4 --codec h264 --audio-codec aac \
  --audio-bitrate 256k --crf 17 --concurrency 4 \
  --browser-executable /opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
# master (loudnorm −14 LUFS, pico −1,5 dBTP): ver comando em ferramentas/README abaixo
node ferramentas/quadros.mjs saida/revisao todos   # folhas de revisão (1 quadro a cada 0,5 s)
node ferramentas/apresentacao.mjs                  # apresentação da marca (marca/apresentacao.html)
NODE_PATH=$(npm root -g) node ferramentas/png.cjs  # PNGs transparentes de marca/svg
```

Master final usado:
```bash
ffmpeg -i saida/veria-bruto.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000" -c:a aac -b:a 256k -movflags +faststart saida/veria.mp4
```

## Estrutura

```
src/
  tempos.ts               TODOS os tempos: palavras da narração (tempos-narracao.json) + janelas das cenas
  anim.ts                 curvas e utilitários
  branding/               IDENTIDADE CENTRAL
    compasso.js           geometria do símbolo (retas + arcos), acento-onda, 3 propostas do estudo
    marca.json            gerado: símbolo, contornos do nome, acento (não editar à mão)
    Marca.tsx             <Simbolo/>, <Nome/>, cores e fontes
    Fita3D.tsx            fita acetinada 3D (linha de ritmo / símbolo com volume)
    Apresentacao.tsx      composições da apresentação (SimboloAnimado, Fita3D)
  components/             linha de ritmo (formas e morph), celular, interface do app, cartão, ícones, gráfico, textos
  scenes/                 LinhaRitmo (a linha global) + Ato1 (cenas 1–5), Ato2 (6–11), Ato3 (12–14)
  audio/Trilha.tsx        narração, arranjo da trilha (stems) e efeitos, com ducking pela fala
public/                   fontes (Inter, OFL) e áudio usado no render
marca/                    svg/ (21 versões), png/ (transparentes + fita 3D), apresentacao.html, fonte/
audio/                    originais: narração ElevenLabs, stems da trilha, efeitos
ferramentas/              marca.mjs, png.cjs, apresentacao.mjs, quadros.mjs, estudo.mjs, gerar_sfx.sh
```

## Narração

ElevenLabs, voz **Matilda** (padrão da plataforma), modelo **eleven_v3** com direção de interpretação
(`roteiro-elevenlabs-v3.txt`). A voz não foi acelerada nem cortada: `ferramentas/montar_narracao.py` coloca
cada frase no mesmo instante em que ela começava na montagem de referência, cortando só dentro de silêncios
medidos, e aplica apenas ganho. Original: `audio/narracao/narracao.mp3`; montada: `narracao-timeline.wav`.
A primeira versão (Sarah, multilingual v2) está guardada em `audio/narracao/v1-sarah/`.
Para medir voz × fundo: `npx remotion render src/index.ts Veria saida/fundo.wav --codec wav --props='{"semVoz":true}'`.

## Licenças

- Inter / Inter Display: SIL OFL 1.1 (`public/fonts/LICENCA-inter.txt`).
- Voz, trilha e efeitos: gerados no ElevenLabs em conta **gratuita** → uso não comercial e com atribuição
  (a cartela final credita "voz e trilha: ElevenLabs"). Para veiculação comercial, regerar com plano pago.
- Remotion: gratuito para pessoa física e empresas de até 3 pessoas.
- VÉRIA é marca fictícia; telas e valores são ilustrativos.
