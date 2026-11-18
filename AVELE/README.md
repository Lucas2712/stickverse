# AVELÉ · Identidade visual completa

**L’élégance est une essence.** · Created by Studio Matteu

Projeto conceitual autoral de branding para uma casa de perfumaria de luxo seletivo de inspiração
francesa. AVELÉ **não** é uma marca comercial lançada: os produtos não existem fisicamente, as pirâmides
olfativas são conceituais (não são fórmulas) e os nomes precisam de busca de anterioridade antes de
qualquer uso comercial. A inspiração francesa é uma direção estética, não uma origem declarada.

## Pastas

| Pasta | Conteúdo |
|---|---|
| `01-Brand-Strategy/` | `estrategia.md` (conceito, posicionamento, voz) e `fragrancias.json` (fonte única dos dados das seis fragrâncias) |
| `02-Logo/svg/` | Logotipo desenhado em geometria (5 cores/fundos + versão de corpo pequeno), monograma e gota-acento em SVG |
| `03-Visual-Identity/` | Seis símbolos botânicos (SVG) e aplicações em SVG editável (cartões, selo, papel de seda, mouillettes, etiquetas) |
| `04-Packaging/` | Faces das caixas em SVG e renders (sistema de 6 caixas, caixa aberta com berço, caixa + frasco, linha corporal) |
| `05-Product-Design/` | Frascos em SVG e renders (família em marfim e em marrom, PNG transparentes 1200 × 2190) |
| `06-Art-Direction/fotografia/` | 17 placas fotográficas geradas no OpenArt (Seedream 5.5), sem produto, texto ou logo |
| `07-Campaign/` | Key visuals (frascos compostos nas placas) e peças de feed 4:5 e stories 9:16 |
| `08-Website/` | Site responsivo funcional (`index.html` + `assets/`) |
| `09-Motion/` | Filme `AVELE-filme-institucional-30s.mp4`, fonte do filme (`filme/`) e trilha original (`audio/`) |
| `10-Behance/` | Case em 19 módulos: `modulos/` (3200 px), `web/` (1600 px), `index.html` (leitor), `_case-fonte.html` |
| `11-Exports/` | PNGs de logo, monograma e símbolos; mockups de aplicações |
| `src/` | Scripts que geram tudo acima |
| `fonts/` | Cormorant Garamond e Inter (woff2) com as licenças SIL OFL 1.1 |

## Como regenerar

Requisitos: Python 3 com numpy/scipy, Node com Playwright (Chromium), ffmpeg e ImageMagick.

    python3 src/logo.py            # logotipo, monograma, gota
    python3 src/botanica.py        # símbolos botânicos
    python3 src/frasco.py          # frascos em SVG
    python3 src/embalagem.py       # faces das caixas
    python3 src/renders.py         # renders de estúdio (produto e embalagem)
    python3 src/campanha.py        # key visuals e peças sociais
    python3 src/aplicacoes.py      # papelaria, sacolas, papel de seda
    python3 src/site.py            # website
    python3 -I 09-Motion/audio/trilha.py
    NODE_PATH=$(npm root -g) node 09-Motion/filme/render_filme.js saida.mp4
    python3 src/behance.py         # módulos do case

## Créditos e licenças

- **Logotipo, monograma, gota, símbolos botânicos, frascos, embalagens e aplicações:** desenho vetorial
  próprio, gerado por código neste repositório.
- **Fontes:** Cormorant Garamond e Inter, SIL Open Font License 1.1 (licenças em `fonts/`).
- **Fotografia:** placas geradas com IA no OpenArt (Seedream 5.5, 17 imagens, 1.5K). Os prompts pediam
  explicitamente “no bottle, no product, no text, no logo”. Os frascos são compostos por cima.
- **Trilha do filme:** composição original de piano e cordas, sintetizada em `09-Motion/audio/trilha.py`.
  A música do ElevenLabs não está disponível no plano gratuito da conta, e a gravação em domínio público
  da *Pavane* de Ravel no Wikimedia não pôde ser baixada (bloqueio 429).
- **Nomes de pessoas em mockups:** “Prénom Nom” é marcador de posição, não uma pessoa.
