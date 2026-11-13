#!/usr/bin/env bash
# Render em blocos (independente do terminal): vídeo mudo em 4 partes + áudio à parte → junta → masteriza (−14 LUFS)
set -uo pipefail
cd "$(dirname "$0")"
CHROME=${CHROME:-/opt/pw-browsers/chromium}
TOTAL=$(node -e "const m=require('./src/audio/musica.json');console.log(Math.round(m.DURACAO*30))")
mkdir -p out/blocos
B=4; PASSO=$(( (TOTAL + B - 1) / B ))
for i in $(seq 0 $((B-1))); do
  A=$((i*PASSO)); Z=$(( (i+1)*PASSO - 1 )); [ $Z -ge $TOTAL ] && Z=$((TOTAL-1))
  [ -s out/blocos/b$i.mp4 ] && { echo "bloco $i já existe"; continue; }
  echo "== bloco $i: quadros $A-$Z"
  npx remotion render src/index.jsx Campanha out/blocos/b$i.tmp.mp4 --frames=$A-$Z --muted --codec h264 --crf 16 --browser-executable="$CHROME" --concurrency=4 --gl=swangle --timeout=180000 || { echo "FALHOU bloco $i"; exit 1; }
  mv out/blocos/b$i.tmp.mp4 out/blocos/b$i.mp4
done
echo "== áudio (mixagem própria, mesmos dados do Remotion)"
S=$(mktemp -d); npx esbuild scripts/linha.jsx --bundle --platform=node --format=cjs --loader:.js=jsx --jsx=automatic --outfile=$S/linha.cjs --log-level=error && node $S/linha.cjs > $S/linha.json && python3 -I mixar.py $S/linha.json out/blocos/audio.wav || { echo "FALHOU audio"; exit 1; }
printf "file 'b%d.mp4'\n" $(seq 0 $((B-1))) > out/blocos/lista.txt
ffmpeg -v error -y -f concat -safe 0 -i out/blocos/lista.txt -i out/blocos/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest out/prumo-campanha-mix.mp4
G=$(ffmpeg -v info -i out/prumo-campanha-mix.mp4 -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/ I:/{print $2; exit}')
GAIN=$(python3 -c "print(round(-14.0-($G),2))")
ffmpeg -v error -y -i out/prumo-campanha-mix.mp4 -c:v copy -af "volume=${GAIN}dB,alimiter=limit=0.85:level=false:attack=3:release=60,aresample=48000" -c:a aac -b:a 256k -movflags +faststart out/prumo-campanha.mp4
ffmpeg -v info -i out/prumo-campanha.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
echo "PRONTO"
