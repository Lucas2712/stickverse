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
# Downloads com até 3 tentativas (espera 5 s, 15 s); o resultado de cada item vai para /opt/mds/estado.txt
tentar() { for e in 5 15 0; do "$@" && return 0; [ $e -gt 0 ] && sleep $e; done; return 1; }
ESTADO=/opt/mds/estado.txt; mkdir -p /opt/mds; echo "preparação $(date -u +%F' '%T) UTC" > $ESTADO
marca() { echo "$1: $2" | tee -a $ESTADO; }
[ -f /opt/mds/whisper-small/model.bin ] && marca whisper ok || marca whisper FALHOU
earshot_ok() { [ "$(earshot doctor 2>/dev/null | grep '^models_cached' | grep -o true | wc -l)" = 2 ]; }
earshot_fetch() { HF_HUB_DISABLE_XET=1 earshot doctor --fetch >/dev/null 2>&1; earshot_ok; }
tentar earshot_fetch && marca earshot-modelos ok \
  || marca earshot-modelos "FALHOU (describe/match/timeline/critique indisponíveis; sfx/kit/measure funcionam)"

# 4. Real SFX (MIT, cópia em .claude/skills/real-sfx): classificador YAMNet no venv da própria skill
#    yamnet.onnx de huggingface.co/audiomagic/yamnet-onnx (conversão Apache 2.0 do YAMNet do Google), SHA-256 conferido
YAMNET_SHA=d3835ffbbd4a1bb3e777f0ca217b5007907f5171dd5d17c4236b95b2af8f908e
yamnet() {
  (cd "$REPO/.claude/skills/real-sfx" && HF_HUB_DISABLE_XET=1 python3 scripts/listen.py install --yes >/dev/null 2>&1 \
    && echo "$YAMNET_SHA  vendor/models/yamnet.onnx" | sha256sum -c --quiet - ) \
    || { rm -f "$REPO/.claude/skills/real-sfx/vendor/models/yamnet.onnx"; return 1; }
}
if [ -n "$REPO" ] && [ -d "$REPO/.claude/skills/real-sfx" ]; then
  tentar yamnet && marca yamnet ok || marca yamnet "FALHOU (o Real SFX escolhe os sons pelo nome e pelas medidas)"
else
  marca yamnet "não tentado (repositório não encontrado)"
fi
echo "MOTION DESIGN STUDIO: ambiente pronto (estado em $ESTADO)"
