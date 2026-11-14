#!/usr/bin/env bash
# Gera as 3 faixas usadas pelo Remotion em remotion/public/audio/ (narração encaixada, trilha original, efeitos).
set -e
cd "$(dirname "$0")/.."
mkdir -p remotion/public/audio
cp narracao.wav remotion/public/audio/narracao.wav
python3 audio/musica.py remotion/public/audio/musica.wav narracao.wav
python3 audio/efeitos.py remotion/public/audio/efeitos.wav
