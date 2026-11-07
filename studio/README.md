# MOTION DESIGN STUDIO · Studio Matteu

Sistema do **Studio Matteu** para produzir vídeos verticais de motion design (1080×1920, 30 fps) com
Claude e narração do ElevenLabs, operado pelo iPhone. As preferências permanentes estão no
[`CLAUDE.md`](../CLAUDE.md) da raiz; o método de trabalho está na Skill `.claude/skills/motion-design-studio/`.

## Como pedir um vídeo (pelo app do Claude, numa sessão com o repositório `stickverse`)

1. Gere a narração no ElevenLabs e baixe o MP3 no iPhone.
2. Numa mensagem, envie:
   - **tema**;
   - **roteiro** (o texto exato que foi narrado);
   - **anexo da narração**;
   - *(tutoriais)* **gravações de tela** do iPhone das ferramentas mostradas, quando precisar de interface real.
3. Você recebe a **direção de arte** (nova para cada vídeo) e o **storyboard** cena por cena, com tempos.
   Nada é programado antes da sua aprovação.
4. Você recebe o **link interativo** (com mixer e zona segura) e o **MP4** com narração + efeitos sonoros reais.
5. Para pedir ajustes, diga a cena e o que mudar ("cena 3: a janela entra mais cedo", "efeitos mais altos").

**Padrão de todos os vídeos:**
- Narração preservada: sem acelerar, reescrever ou cortar palavras; silêncio só sai com necessidade e com
  a sua aprovação.
- **Sem música de fundo.** Só narração + efeitos sonoros presos a eventos visuais. O canal de música do
  motor continua disponível, mas só é usado quando você pedir expressamente.
- Tipografia: SF Pro Display/Text como preferência; Inter quando a SF Pro não puder ser usada (licença).
- Cada vídeo tem identidade visual própria (cores, fundos, composições, elementos, layouts, animações);
  referências de vídeo orientam só ritmo, velocidade, dinâmica e qualidade das animações.
- A assinatura Studio Matteu é opcional e segue a direção criativa de cada projeto.

## Estrutura

```
CLAUDE.md                     preferências permanentes do Studio Matteu
.claude/skills/
  motion-design-studio/       a Skill (SKILL.md + referencias/: estilo, direções usadas, áudio, revisão…)
  real-sfx/                   Real SFX (Clipwing, MIT) com config apontando para studio/sons
studio/
  motor/         motor.js (animação por tempo, MDS.img) · legendas.js · audio.js (3 canais) · player.js · base.css
  componentes/   tipografia · transicoes · ui · infografico · mapa · fundo (inclui o traço conector)
  ferramentas/   novo_projeto.py · transcrever.py · storyboard.py · montar.py · revisar.js · exportar.js
                 sfx_real.py · sons.py · biblioteca_earshot.py · preparar_ambiente.sh
  sons/          biblioteca de efeitos: earshot/ (catálogo) · openverse/ (criada no 1º download) · creditos.json · CREDITOS-SONS.md
  fontes/        Geist, Geist Mono, Archivo, Bricolage Grotesque, Instrument Serif (SIL OFL)
  dados/         países do mundo (Natural Earth 1:110m via world-atlas, ISC)
  modelo/        arquivos iniciais de um projeto
projetos/<nome>/ roteiro.md · narracao.mp3 · palavras.json · transcricao.md · storyboard.json/.md/.html
                 projeto.json · tema.css · cenas.js · imagens/ · fontes/ · CREDITOS-SONS.md
                 saida/ (HTML, MP4, revisão; fora do git)
```

## Comandos (executados pelo Claude)

Antes de rodar, confirmar que a ferramenta e as dependências existem no ambiente (regra 8 do `CLAUDE.md`).

```
python3 studio/ferramentas/novo_projeto.py <nome> "Título"
python3 -I studio/ferramentas/transcrever.py projetos/<nome>
python3 studio/ferramentas/storyboard.py projetos/<nome>        # storyboard.json → storyboard.md + .html
python3 studio/ferramentas/montar.py projetos/<nome>            # HTML único com imagens e fontes embutidas
node studio/ferramentas/revisar.js projetos/<nome>              # folhas de quadros + relatório
node studio/ferramentas/exportar.js projetos/<nome> [--escala 0.5] [--de 10 --ate 18]
     [--sem-efeitos] [--sem-musica] [--trilhas]                 # MP4 a −14 LUFS
python3 studio/ferramentas/sfx_real.py projetos/<nome> [--realce 7]   # MP4 final: narração + efeitos reais
python3 studio/ferramentas/sons.py buscar "whoosh" [--tipo whoosh]    # Openverse, licença conferida na origem
python3 studio/ferramentas/sons.py baixar <id> --tipo whoosh
python3 studio/ferramentas/sons.py creditos [projetos/<nome>]         # gera CREDITOS-SONS.md
python3 studio/ferramentas/biblioteca_earshot.py [--forcar]           # renderiza o banco do Earshot
```

Os comandos `node` precisam de `NODE_PATH=$(npm root -g)` para achar o Playwright.

## Projetos

- `projetos/comercial-ia`: comercial de 30 s com narração e efeitos (teste de qualidade do sistema).
- `projetos/demo-componentes`: um uso de cada componente, sem narração (teste do sistema).
- `projetos/ia-muda-tudo`: noite digital com cursor verde.
- `projetos/ia-muda-tudo-v2`: anúncio tech claro/escuro com laranja.
- `projetos/ia-ciberseguranca`: planta técnica (blueprint) sob investigação.
- `projetos/tutorial-claude`: apresentação de produto (keynote) em Inter.

As identidades usadas estão em `.claude/skills/motion-design-studio/referencias/direcoes-usadas.md`
e não são reaproveitadas automaticamente.

## Ferramentas e licenças

- **Já vêm no ambiente:** Python 3, Node.js, ffmpeg, Chromium + Playwright.
- **Instalados pelo script de preparação** (ambiente de nuvem "stickverse"):
  - `faster-whisper` 1.2.1 (MIT) + modelo Whisper small (MIT, ~250 MB, SHA-256 conferido);
  - Earshot 0.4.1 (MIT) com torch para CPU e os modelos CLAP/AST;
  - classificador YAMNet do Real SFX (`.claude/skills/real-sfx/vendor/`, fora do git): `yamnet.onnx` de
    huggingface.co/audiomagic/yamnet-onnx (conversão Apache 2.0 do YAMNet do Google, pesos sem alteração), SHA-256 conferido.
  - Cada download tem até 3 tentativas; o resultado fica em `/opt/mds/estado.txt` (`whisper`, `earshot-modelos`,
    `yamnet`: ok ou FALHOU). Os modelos ficam fora do git e são baixados de novo a cada sessão (~1 min).
- **Sons:** Real SFX (MIT) com o pacote uisfx (CC0), banco do Earshot (MIT) e Openverse.
  CC0 primeiro; CC BY só sem alternativa CC0 e com atribuição; proibidos NC, ND e SA; a licença de cada
  arquivo é conferida na página de origem; créditos em `studio/sons/creditos.json` e no
  `CREDITOS-SONS.md` de cada projeto.
- **Fontes:** só com licença que permita vídeo publicado, com o arquivo de licença junto. Inter (OFL) é a
  alternativa usada no lugar da SF Pro, que fica como preferência para quando houver licença que permita.
- **Imagens:** OpenArt (conta conectada), com consulta ao usuário antes de gastar créditos.
