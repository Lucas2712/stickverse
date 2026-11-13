#!/usr/bin/env bash
# Render final + masterização (−14 LUFS, pico −1 dBTP). Uso: bash render.sh
set -euo pipefail
cd "$(dirname "$0")"
CHROME=${CHROME:-/opt/pw-browsers/chromium}
npx remotion render src/index.jsx Campanha out/prumo-campanha-mix.mp4 --codec h264 --audio-codec aac --audio-bitrate 256k --crf 16 --browser-executable="$CHROME" --concurrency=4
G=$(ffmpeg -v info -i out/prumo-campanha-mix.mp4 -af ebur128 -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/ I:/{print $2; exit}')
GAIN=$(python3 -c "print(round(-14.0-($G),2))")
ffmpeg -v error -y -i out/prumo-campanha-mix.mp4 -c:v copy -af "volume=${GAIN}dB,alimiter=limit=0.85:level=false:attack=3:release=60,aresample=48000" -c:a aac -b:a 256k -movflags +faststart out/prumo-campanha.mp4
ffmpeg -v info -i out/prumo-campanha.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
