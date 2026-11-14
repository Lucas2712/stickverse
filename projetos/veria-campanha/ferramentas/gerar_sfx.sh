#!/bin/bash
# Gera os efeitos sob medida no ElevenLabs (Sound Effects v2). Uso: bash ferramentas/gerar_sfx.sh
cd "$(dirname "$0")/../audio/sfx"
g(){ [ -s "$1.mp3" ] && file "$1.mp3" | grep -q Audio && return; for i in 1 2 3; do curl -sS -o "$1.mp3" -w "$1 %{http_code}\n" -X POST "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128" -H "xi-api-key: dummy" -H "Content-Type: application/json" -d "{\"text\":\"$2\",\"duration_seconds\":$3,\"prompt_influence\":0.7,\"model_id\":\"eleven_text_to_sound_v2\"}"; file "$1.mp3" | grep -q Audio && break; sleep 4; done; }
g pulso "Single soft deep sub bass heartbeat thump with a tiny clean glassy tick on top, minimal, premium, dry" 1.2
g whoosh-suave "Smooth elegant airy whoosh pass-by, premium tech commercial transition, soft and clean" 1.5
g whoosh-rapido "Fast tight short swoosh, clean, premium motion graphics" 0.8
g glitch "Very short subtle digital stutter glitch, clean, small, modern" 0.8
g batida-conta "Soft muted tap thud, a small card landing on a table, dull and short" 0.6
g papel "Receipt paper unrolling quickly from a printer, short" 1.2
g congela "Time freeze effect: sudden tape stop slowdown, then a crystalline frozen shimmer, cinematic" 1.8
g metal "Subtle sleek metallic shimmer sweep, premium credit card rotating in light, elegant" 1.6
g ui-toque "Clean soft UI tap click, premium smartphone app interface, subtle" 0.5
g ui-confirma "Soft pleasant two-note UI confirmation chime, modern banking app, gentle" 1.0
g varredura "Digital data sweep, glassy rising swipe as a chart draws on screen, clean and modern" 1.5
g contador "Soft quick digital ticking of numbers counting up on a display, subtle, clean" 1.2
g encaixe "Small satisfying magnetic snap, an icon clicking into place, crisp" 0.5
g ar "Soft air swell, wide gentle breath of air as a camera pulls back, cinematic, calm" 2.0
g whoosh-grave "Deep cinematic whoosh with low end, big object passing close to camera, premium" 1.4
