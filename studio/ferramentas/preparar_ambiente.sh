#!/usr/bin/env bash
# MOTION DESIGN STUDIO · preparação do ambiente (tudo gratuito)
# O mesmo conteúdo fica salvo como script de preparação do ambiente de nuvem "stickverse",
# então roda sozinho no início de cada sessão. Rodar à mão (da pasta acima do repositório ou de dentro dele):
#   bash studio/ferramentas/preparar_ambiente.sh
# Já vêm no ambiente e NÃO são instalados aqui: Python 3, Node.js, ffmpeg, Chromium + Playwright.
set -e
REPO=$( [ -d stickverse/studio ] && echo stickverse || ( [ -d studio ] && echo . ) || echo "" )

# 1. faster-whisper 1.2.1 (licença MIT): transcrição com tempo de cada palavra, roda na CPU
pip install -q "faster-whisper==1.2.1"

# 2. modelo Whisper "small" (licença MIT, OpenAI) em formato CTranslate2, ~250 MB, 4 partes no npm, SHA-256 conferido
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

# 3. Earshot 0.4.1 (MIT, github.com/Leonxlnx/earshot @ 4ac3d2a) + torch CPU + modelos CLAP e AST (Hugging Face)
#    Rede: download.pytorch.org, download-r2.pytorch.org, huggingface.co, us.aws.cdn.hf.co (Xet desligado).
pip install -q torch --index-url https://download.pytorch.org/whl/cpu
pip install -q "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot@4ac3d2ac2b151e1c23376f9ce7f3047a17050013"
HF_HUB_DISABLE_XET=1 earshot doctor --fetch >/dev/null 2>&1 || echo "aviso: modelos do Earshot não baixados (describe/match/timeline indisponíveis; sfx/kit/measure funcionam)"

# 4. Real SFX (MIT, cópia em .claude/skills/real-sfx): classificador YAMNet no venv da própria skill
if [ -n "$REPO" ] && [ -d "$REPO/.claude/skills/real-sfx" ]; then
  (cd "$REPO/.claude/skills/real-sfx" && HF_HUB_DISABLE_XET=1 python3 scripts/listen.py install --yes >/dev/null 2>&1) \
    || echo "aviso: YAMNet do Real SFX não instalado (as escolhas de som seguem pelo nome e pelas medidas)"
fi
echo "MOTION DESIGN STUDIO: ambiente pronto"
