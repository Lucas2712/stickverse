# KAVORA · comercial 9:16 (Remotion + Three.js)

1080×1920 · 30 fps · 29,5 s. Toda a timeline deriva das palavras da narração (`src/timing.json`).

    npm install
    node ferramentas/sincronizar.mjs          # depois de transcrever.py: tempos da narração → timing.json
    python3 ferramentas/preparar_sfx.py       # copia e normaliza os efeitos usados em src/audio.ts
    node ferramentas/quadros.mjs <saida> 0.4 1.5 3.2   # quadros soltos para revisão
    npx remotion render src/index.ts Kavora ../saida/kavora.mp4 --gl=swangle --browser-executable=/opt/pw-browsers/chromium

Estrutura: `src/scenes/` (A abertura+problema · B solução · C gestão/escuro · D mobile/laranja · E destaque 3D · F encerramento),
`src/components/` (base 2D, logo), `src/three/` (palco, objetos, smartphone, tela do app), `src/lib/` (movimento, glifos do logo, ícones).
Música: preencher `src/assets.json → music.file` (arquivo em `public/`) e renderizar de novo; o volume já cresce no laranja e no impacto.
