#!/usr/bin/env bash
# Efeitos sonoros reais (Real SFX, biblioteca do estúdio) sobre o vídeo com a trilha Web Audio.
# Uso: bash efeitos.sh saida/<video>-musica.mp4 saida/<final>.mp4
set -euo pipefail
P=$(cd "$(dirname "$0")" && pwd); RS="$P/../../.claude/skills/real-sfx"; IN=$(realpath "$1"); OUT=$(realpath -m "$2")
W="$P/saida/sfx"; mkdir -p "$W"
cd "$RS"
python3 scripts/from_cues.py "$P/efeitos.json" --video "$IN" --out "$W/cues.json"
# escolhas fixas: impacto do drop (4,0 s) com corpo grave em vez do sorteado
python3 - "$W/cues.json" "$P/../../studio/sons/earshot/impact/impact_pro-impact-deep.flac" <<'PY'
import json, sys, os
p, f = sys.argv[1], os.path.realpath(sys.argv[2]); d = json.load(open(p))
for c in d["cues"]:
    if abs(c["t"] - 4.0) < .01 and c.get("pick", {}).get("role") == "hit": c.pop("pick", None); c["file"] = f; c.pop("pitch", None); c["role"] = "hit"
json.dump(d, open(p, "w"), indent=1)
PY
python3 scripts/mix.py "$W/cues.json" --out "$W/final.mp4" --music-ref "$P/saida/musica.wav" --target-lufs -14 --ceiling-db -1 --stems --sfx-trim-db 4.5
python3 scripts/critique.py "$W/final_resolved_cues.json" "$W/final_sfx_track.wav" > "$W/critica.txt" 2>&1 || true
cp "$W/final.mp4" "$OUT"
# faixa de efeitos para o player do HTML
ffmpeg -y -loglevel error -i "$W/final_sfx_track.wav" -c:a libmp3lame -b:a 192k "$P/saida/efeitos.mp3"
echo "ok $OUT"
