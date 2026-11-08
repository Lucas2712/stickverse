#!/usr/bin/env bash
# MOTION DESIGN STUDIO · preparação do ambiente (tudo gratuito)
# O mesmo conteúdo fica salvo como script de preparação do ambiente de nuvem "stickverse",
# então roda sozinho no início de cada sessão. Rodar à mão (da pasta acima do repositório ou de dentro dele):
#   bash studio/ferramentas/preparar_ambiente.sh
# Já vêm no ambiente e NÃO são instalados aqui: Python 3, Node.js, ffmpeg, Chromium + Playwright.
set -e
REPO=$( [ -d stickverse/studio ] && echo stickverse || ( [ -d studio ] && echo . ) || echo "" )
[ -n "$REPO" ] && REPO=$(cd "$REPO" && pwd)

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
# Downloads: 3 tentativas (5 s, 15 s). Estado em /opt/mds/estado.txt; diagnóstico (rede, tentativas, tipo de erro,
# validação; sem tokens nem senhas) em /opt/mds/preparacao.log. Na sessão: preparar_ambiente.sh --testar
ESTADO=/opt/mds/estado.txt; LOG=/opt/mds/preparacao.log; mkdir -p /opt/mds
echo "preparação $(date -u +%F' '%T) UTC" > $ESTADO; echo "=== preparação $(date -u +%F' '%T) UTC ===" > $LOG
log() { echo "$(date -u +%T) $*" >> $LOG; }
limpa() { sed -E 's#(://)[^/@[:space:]]+@#\1***@#g; s#(Bearer|token|Token)[ =:]+[A-Za-z0-9._~+/-]{8,}#\1 ***#g;
  s#((password|passwd|secret|authorization|api[_-]?key)["'"'"' ]*[:=] *)[^[:space:]"'"'"']+#\1***#Ig'; }
classifica() {  # tipo de erro pela mensagem: DNS, conexão, timeout, TLS, HTTP ou outro
  [ "$2" = 0 ] && { echo nenhum; return; }; if grep -qiE 'name resolution|not known|getaddrinfo|nodename|NXDOMAIN|resolve host' <<<"$1"; then echo DNS
  elif grep -qiE 'CERTIFICATE_VERIFY|SSLError|ssl\.|certificate|handshake|TLS' <<<"$1"; then echo TLS
  elif grep -qiE 'timed out|timeout|ReadTimeout|ConnectTimeout' <<<"$1"; then echo timeout
  elif grep -qiE 'refused|unreachable|Failed to establish|ConnectError|ProxyError|Connection reset|No route' <<<"$1"; then echo conexão
  elif grep -qiE 'HTTP Error|status code|40[0-9]|50[0-9]|Forbidden|Unauthorized|Not Found' <<<"$1"; then echo HTTP
  else echo outro; fi; }
rodar() {  # rodar <rótulo> comando...: guarda a saída (limpa) no log e classifica o erro
  local r=$1 out rc; shift; out=$("$@" 2>&1) && rc=0 || rc=$?
  printf '%s\n' "$out" | tail -n 30 | limpa | sed 's/^/    /' >> $LOG; log "$r: rc=$rc tipo=$(classifica "$out" $rc)"; return $rc; }
tentar() { local item=$1 n=1; shift; for e in 5 15 0; do  # 3 tentativas, cada uma registrada
    log "[$item] tentativa $n/3"; "$@" && { log "[$item] tentativa $n: ok"; return 0; }
    log "[$item] tentativa $n: falhou"; n=$((n+1)); [ $e -gt 0 ] && { log "[$item] aguardando ${e} s"; sleep $e; }; done; return 1; }
marca() { echo "$1: $2" | tee -a $ESTADO; log "estado $1: $2"; }
diag_rede() {  # retrato da rede no momento da preparação (só nomes e caminhos, nunca valores secretos)
  log "rede: HTTPS_PROXY $([ -n "${HTTPS_PROXY:-${https_proxy:-}}" ] && echo definido || echo 'não definido')"
  for v in REQUESTS_CA_BUNDLE SSL_CERT_FILE CURL_CA_BUNDLE; do log "rede: $v=${!v:-não definido}"; done
  log "rede: DNS huggingface.co $(getent hosts huggingface.co >/dev/null && echo resolve || echo 'não resolve')"
  local u code rc t; for u in https://huggingface.co/api/models/MIT/ast-finetuned-audioset-10-10-0.4593 \
    https://huggingface.co/audiomagic/yamnet-onnx/resolve/main/yamnet_class_map.csv; do
    code=$(curl -sS -L -o /dev/null -w '%{http_code}' --max-time 20 "$u" 2>>$LOG) && rc=0 || rc=$?
    case $rc in 0) [ "${code:-0}" -ge 400 ] && t=HTTP || t=nenhum;; 5|6) t=DNS;; 7) t=conexão;; 28) t=timeout;;
      35|51|53|54|58|59|60|77|80|82|83|90|91) t=TLS;; 22|56) t=HTTP;; *) t=outro;; esac
    log "rede: curl $u -> rc=$rc http=${code:-?} tipo=$t"; done
  u=$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 20 https://huggingface.co/audiomagic/yamnet-onnx/resolve/main/yamnet.onnx 2>>$LOG)
  code=$(curl -sS -r 0-99 -o /dev/null -w '%{http_code}' --max-time 20 "$u" 2>>$LOG) && rc=0 || rc=$?
  log "rede: arquivos grandes redirecionam para $(cut -d/ -f3 <<<"$u") -> rc=$rc http=${code:-?}"
  local py; py=$(python3 -c 'import urllib.request as u; print(u.urlopen("https://huggingface.co/api/models/MIT/ast-finetuned-audioset-10-10-0.4593", timeout=20).status)' 2>&1) && rc=0 || rc=$?
  log "rede: python urllib -> rc=$rc tipo=$(classifica "$py" $rc) $(tail -n1 <<<"$py" | limpa | cut -c1-200)"; }
diag_rede
[ -f /opt/mds/whisper-small/model.bin ] && marca whisper ok || marca whisper FALHOU
earshot_ok() { [ "$(earshot doctor 2>/dev/null | grep '^models_cached' | grep -o true | wc -l)" = 2 ]; }
earshot_fetch() { rodar "earshot doctor --fetch" env HF_HUB_DISABLE_XET=1 earshot doctor --fetch || true
  earshot_ok && { log "validação earshot: os 2 modelos completos"; return 0; }; log "validação earshot: modelos incompletos"; return 1; }
tentar earshot earshot_fetch && marca earshot-modelos ok \
  || marca earshot-modelos "FALHOU (describe/match/timeline/critique indisponíveis; sfx/kit/measure funcionam; ver $LOG)"

# 4. Real SFX (MIT, cópia em .claude/skills/real-sfx): classificador YAMNet no venv da própria skill
#    yamnet.onnx de huggingface.co/audiomagic/yamnet-onnx (conversão Apache 2.0 do YAMNet do Google), SHA-256 conferido
YAMNET_SHA=d3835ffbbd4a1bb3e777f0ca217b5007907f5171dd5d17c4236b95b2af8f908e
RSFX="$REPO/.claude/skills/real-sfx"
yamnet() {
  rodar "listen.py install" bash -c "cd '$RSFX' && HF_HUB_DISABLE_XET=1 python3 scripts/listen.py install --yes" || true
  local f="$RSFX/vendor/models/yamnet.onnx" got
  [ -f "$f" ] || { log "validação yamnet: arquivo ausente"; return 1; }
  got=$(sha256sum "$f" | cut -d' ' -f1); [ "$got" = "$YAMNET_SHA" ] && { log "validação yamnet: SHA-256 ok"; return 0; }
  log "validação yamnet: SHA-256 diferente ($got), arquivo apagado"; rm -f "$f"; return 1; }
if [ -n "$REPO" ] && [ -d "$RSFX" ]; then tentar yamnet yamnet && marca yamnet ok \
  || marca yamnet "FALHOU (o Real SFX escolhe os sons pelo nome e pelas medidas; ver $LOG)"; else marca yamnet "não tentado (sem repositório)"; fi
# 5. Só com --testar (contingência na sessão): teste de funcionamento com um som da biblioteca
if [ "${1:-}" = "--testar" ] && [ -n "$REPO" ]; then
  W="$REPO/studio/sons/earshot/whoosh/whoosh_pro-whoosh-big-long.flac"
  rodar "teste earshot match" earshot match "$W" "a fast whoosh" && marca earshot-teste ok || marca earshot-teste FALHOU
  rodar "teste yamnet" bash -c "cd '$RSFX' && vendor/venv/bin/python scripts/listen.py describe '$W' | grep -q 'tags'" \
    && marca yamnet-teste ok || marca yamnet-teste FALHOU
  N=$(find "$REPO/studio/sons/earshot" -name '*.flac' | wc -l); [ "$N" = 252 ] && marca biblioteca "ok (252)" || marca biblioteca "FALHOU ($N)"
fi
echo "MOTION DESIGN STUDIO: ambiente pronto (estado em $ESTADO, diagnóstico em $LOG)"
