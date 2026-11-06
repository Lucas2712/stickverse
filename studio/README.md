# MOTION DESIGN STUDIO

Sistema para produzir vídeos verticais de motion design (1080×1920, 30 fps) com Claude e ElevenLabs,
operado pelo iPhone. As regras de trabalho estão na Skill `.claude/skills/motion-design-studio/`.

## Como pedir um vídeo (pelo app do Claude, numa sessão com o repositório `stickverse`)

1. Gere a narração no ElevenLabs e baixe o MP3 no iPhone.
2. Numa mensagem, envie:
   - **tema**;
   - **roteiro** (o texto exato que foi narrado);
   - **anexo da narração**;
   - *(opcional)* **anexo da música**, mais o BPM ou as marcas de virada, se souber.
3. Você recebe o **storyboard** cena por cena. Aprove ou peça ajustes.
4. Você recebe o **link interativo**, com volumes por canal e opção de zona segura, e o **MP4**.
5. Para pedir ajustes, diga a cena e o que mudar ("cena 3: o mapa entra mais cedo", "música 20%").

## Estrutura

```
studio/
  motor/         motor.js (animação por tempo) · legendas.js · audio.js (3 canais) · player.js · base.css
  componentes/   tipografia · transicoes · ui · infografico · mapa · fundo (inclui o traço conector)
  ferramentas/   novo_projeto.py · transcrever.py · montar.py · revisar.js · exportar.js · preparar_ambiente.sh
  fontes/        Geist, Geist Mono, Archivo, Bricolage Grotesque, Instrument Serif (SIL OFL)
  dados/         países do mundo (Natural Earth 1:110m via world-atlas, ISC)
  modelo/        arquivos iniciais de um projeto
projetos/<nome>/ roteiro.md · narracao.mp3 · palavras.json · transcricao.md · storyboard.md
                 projeto.json · tema.css · cenas.js · saida/ (HTML, MP4, revisão; fora do git)
```

## Comandos (executados pelo Claude)

```
python3 studio/ferramentas/novo_projeto.py <nome> "Título"
python3 -I studio/ferramentas/transcrever.py projetos/<nome>
python3 studio/ferramentas/montar.py projetos/<nome>
node studio/ferramentas/revisar.js projetos/<nome>
node studio/ferramentas/exportar.js projetos/<nome> [--escala 0.5] [--de 10 --ate 18]
```

## Projetos de referência

- `projetos/comercial-ia`: comercial de 30 s com narração e efeitos (o modelo de qualidade).
- `projetos/demo-componentes`: um uso de cada componente, sem narração (teste do sistema).

## Ferramentas instaladas (todas gratuitas)

- **Já vêm no ambiente:** Python 3, Node.js, ffmpeg, Chromium + Playwright.
- **Instalados pelo script de preparação:**
  - `faster-whisper` 1.2.1 (MIT);
  - modelo Whisper small (MIT, ~250 MB, via npm, com SHA-256 conferido).
