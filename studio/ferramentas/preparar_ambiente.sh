#!/usr/bin/env bash
# MOTION DESIGN STUDIO · preparação do ambiente (tudo gratuito, ~1 a 2 min)
# O mesmo conteúdo fica salvo como script de preparação do ambiente de nuvem "stickverse",
# então roda sozinho no início de cada sessão. Rodar à mão: bash studio/ferramentas/preparar_ambiente.sh
# Já vêm no ambiente e NÃO são instalados aqui: Python 3, Node.js, ffmpeg, Chromium + Playwright.
set -e

# 1. faster-whisper 1.2.1 (licença MIT): transcrição com tempo de cada palavra, roda na CPU
pip install -q "faster-whisper==1.2.1"

# 2. modelo Whisper "small" (licença MIT, OpenAI) em formato CTranslate2, ~250 MB.
#    O download normal (Hugging Face) é bloqueado pela rede do ambiente; o mesmo modelo é
#    distribuído em 4 partes no registro npm. Conferimos o SHA-256 do arquivo montado.
M=/opt/mds/whisper-small
if [ ! -f "$M/model.bin" ]; then
  T=$(mktemp -d)
  (
    cd "$T"
    for i in 0 1 2 3; do
      npm pack --silent "@skillninja/shortmovie-telop-model-p$i@1.0.0" >/dev/null
      mkdir "p$i" && tar xzf "skillninja-shortmovie-telop-model-p$i-1.0.0.tgz" -C "p$i" --strip-components=1
    done
    mkdir -p "$M"
    cp p0/config.json p0/tokenizer.json p0/vocabulary.json p0/preprocessor_config.json "$M/"
    cat p0/model.bin.part0 p1/model.bin.part1 p2/model.bin.part2 p3/model.bin.part3 > "$M/model.bin"
    echo "$(cat p0/model.sha256)  $M/model.bin" | sha256sum -c --quiet -
  )
  rm -rf "$T"
fi
echo "MOTION DESIGN STUDIO: ambiente pronto"
