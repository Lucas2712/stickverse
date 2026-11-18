# Guia do projeto — Uvra

A Uvra é a landing page de uma vinícola de altitude fictícia, e a página inteira é um filme pintado preso à rolagem. O hero é o primeiro quadro (uma galeria escura com um quadro iluminado); rolando, a câmera entra no quadro e segue a uva do vinhedo até a taça, e no fim o banquete vira outro quadro na mesma galeria. Cada cena tem uma frase curta, no vazio da imagem. A loja abre por cima do filme, quando a pessoa pede.

Este guia vale para a montagem da demo e para qualquer mudança depois. Leia a seção da peça antes de mexer nela.

## Arquitetura

Vite sem framework: HTML, CSS e JavaScript puros, GSAP e Lenis pelo npm, com as versões travadas.

### HTML e CSS

- `index.html` tem a página inteira:
  - `header.nav`: o índice das salas (`.indice`), a marca e as ações (`.acoes`: Loja, Agendar visita, Clube Uvra e o botão do menu do celular, `.nav__menu`).
  - `nav#menu`: o menu do celular, com o mesmo índice (`.menu__item`).
  - `main > .trilha > .tela`: o filme. A `.trilha` é alta (a rolagem do filme inteiro) e a `.tela` fica presa (`sticky`). Dentro dela:
    - `.palco`: a foto do hero num `<picture>` (deitada e em pé) e o `canvas.palco__filme` por cima, na mesma caixa, mais as duas legendas de acervo (`.legenda--hero`, `.legenda--fim`);
    - `.sombra`: o véu liso por cima do filme (escurece o topo e o pé) e os véus de cena;
    - `.textos`: o hero (`#topo`) e uma `section.cena` por cena: `#vinhedo` (o céu sobre o vinhedo), `#colheita` (as mãos e o cesto), `#adega` (a prensa: a sala "Adega" do índice começa nela), `#barrica` (a adega de pedra, "Guardado sem pressa"), `#prova` (a taça), `#rotulos` (as garrafas), `#visitas` (o banquete) e `#clube` (o fecho).
  - `footer.rodape`.
  - `#loja`: a vitrine dos rótulos (um diálogo, escondido até ser aberto).
  - `.veu`: o véu escuro dos cortes (links para longe).
- O CSS é uma folha só, `src/styles/site.css`, ligada por `<link>` no `<head>` e nunca importada pelo JS (senão a página aparece crua ao recarregar). Ela junta `fontes.css`, `tokens.css`, `base.css` e um arquivo por parte em `src/sections/`: `nav.css`, `hero.css` (trilha, palco, legendas e hero), `cena.css` (as cenas, o fecho, o rodapé, os véus e a barra de rolagem), `loja.css` (a vitrine) e `menu.css` (o menu do celular).

### O filme

- **Os quadros** ficam em `public/filme/`: `cN/` (deitados, 1440 × 812) e `retrato/cN/` (em pé, o recorte do meio em 608 × 1080), 121 WebP por clipe e um `manifest.json` com a curva de movimento (`cum`). Saem de `npm run quadros` (`scripts/quadros.mjs`), que lê os clipes de `arquivos/filme/` (`c1.mp4`... e `curvas.json`) e refaz também a foto do hero a partir do quadro 0 do primeiro clipe.
- **O diretor** é `src/motion/filme.js`:
  - `CAPITULOS`: um capítulo por clipe, com `telas` (quanto de rolagem ele ocupa; ~2,5 telas por clipe de 5 s deixam o filme perto dos 24 quadros por segundo) e `emenda` (o clipe começa no último quadro do anterior: os dois fundem numa faixa de 0,15 tela). Sem emenda, corte seco.
  - A posição da rolagem, em telas, escolhe o capítulo e o quadro pela curva `cum`; o canvas só redesenha quando o quadro muda, fundindo o quadro de baixo e o seguinte pela fração da posição, e assenta num quadro inteiro quando a rolagem para.
  - `PARADA`: telas paradas no último quadro antes do rodapé.
  - Tela em pé (`max-aspect-ratio: 4/5`) usa o conjunto `retrato`; virar o aparelho troca o conjunto.
  - No toque, o filme persegue a rolagem a até 2,5 telas por segundo (acelera até o dobro quando fica para trás) e só corta pelo véu com 6 telas de atraso.
  - Links internos (`a[href^="#"]`): perto, rola até a cena; longe (mais de 1,5 tela), corta pelo véu.
- **As janelas dos textos** ficam no HTML, em cada `section.cena`: `data-cap` (o capítulo), `data-de` e `data-ate` (a fração do capítulo em que a frase está na tela; acima de 1 avança no capítulo seguinte; `fim` vai até o fim do filme) e `data-pouso` (onde o link para a cena para; sem ele, logo depois de a frase entrar).
- **O lugar de cada frase** é uma classe na `section.cena`: sem classe, no pé (a frase à esquerda e o apoio à direita); `cena--ceu` (centrada em cima, no céu); `cena--direita` e `cena--esquerda` (no meio da altura, num lado); `cena--legenda` (centrada embaixo, como placa de quadro). `data-veu="topo"` ou `"pe"` escurece o topo ou o pé com um véu liso só enquanto a cena está na tela (para o texto branco ler sobre fundo claro). O lugar e a janela vieram do vazio de cada clipe, medido quadro a quadro.
- **O carregamento** é `src/motion/quadros.js`: cada quadro fica comprimido na memória e só uma janela em volta do quadro atual é decodificada (14 de cada lado no computador, 10 no celular). Antes do primeiro gesto, cada capítulo baixa só os 16 primeiros quadros e um a cada 8; o resto desce no primeiro toque ou roda, do grosso para o fino.

### Motion (`src/motion/` e `src/main.js`)

- `smooth.js`: o Lenis, no relógio do GSAP, conduzindo a roda e o toque. Sem Lenis com movimento reduzido.
- `guia.js`: o freio. Roda e trackpad: a página anda no máximo ~1,8 tela por segundo (`AVANCO`). Toque: o arrasto segue o dedo e a inércia ao soltar anda no máximo 2,4 telas (`INERCIA`, `GANHO`). Toque sem arrasto (clique) e com dois dedos (pinça) passam direto.
- `loja.js`: a vitrine (abre por qualquer link `#loja`, foco preso, página inerte e parada por trás, fecha no ×, no Esc ou num clique fora).
- `menu.js`: o menu do celular.
- `scrollbar.js`: a barra de rolagem própria (um fio que aparece ao rolar).
- `rolando.js`: o hover descansa enquanto a página rola com o cursor parado (`.is-scrolling`).
- `ease.js`: as curvas da marca (`uv-out`, `uv-in`) e o movimento reduzido.

## Design system

- **Cores** (`src/styles/tokens.css`): fundo `#0c0705`, parede `#150e0a`, branco `#f0efee` (texto a 88%, apoio a 62%, fraco a 34%, linha a 9%), acento lilás-rosé `#e2d0dc` (itálico das frases, pílula cheia) com a tinta `#1b1013`. O resto da cor vem do filme.
- **Tipo** (`src/styles/fontes.css`, arquivos em `public/fonts/` com as licenças OFL): Instrument Serif nas frases e títulos (a palavra-chave em itálico lilás), Inter Tight variável no texto e na interface, Geist Mono nas legendas de acervo.
- **Escalas:** `--u` (cena: 1 px numa tela de 1456 × 840) no hero e no fecho; `--su` (site: 1 px a partir de 1280, só encolhe abaixo) nas cenas, na vitrine e no rodapé; `--pu` (1 px da foto do palco) nas legendas presas ao quadro. Frase de cena: 64 px no pé, 72 no meio da tela, 42 no celular. Títulos gigantes do hero e do fecho: de borda a borda.
- **Forma:** pílulas (25 px no computador, 44 px no celular), sem card. A vitrine mostra as garrafas recortadas no fundo da marca.

## Regras de motion

1. **Nada trava a rolagem.** O filme é preso à rolagem; a página nunca para sozinha nem engole um gesto.
2. **Texto por marco, com tempo fixo:** entra do desfoque quando a imagem dele aparece, sai antes da emenda. Nunca preso ao scrub.
3. **O texto mora no vazio do quadro.** Frase nova ou filme novo: ponha a frase onde a imagem tem vazio (céu liso, parede ou fundo escuro) durante a janela inteira dela. Texto branco sobre fundo claro leva véu de cena (`data-veu`), nunca tinta escura. Quadro cheio do começo ao fim: a frase vai no pé.
4. **Ritmo:** ~2,5 telas por clipe de 5 s. Mais telas deixam a troca de quadros espaçada e o filme parece travar; menos, passa corrido.
5. **Nada de clarão, flash ou zoom feito em código** entre as cenas: a emenda é a do próprio filme.
6. **Nada de HUD**, contador, "role para..." ou linha decorativa.

## Celular (regras que nunca quebram)

1. **Nunca rolar para o lado.** Nada passa da largura da tela em nenhum estado (menu aberto, vitrine, animação de entrada). `html, body { overflow-x: clip }` é só a rede de segurança.
2. **O dedo manda.** O Lenis conduz o toque com teto só na inércia (`guia.js`); nunca `preventDefault` no `touchend` de um toque sem arrasto (mataria o clique de todo botão), e a pinça é do navegador.
3. **Quadros cabem na memória do iPhone** (~150 MB de imagens decodificadas ao mesmo tempo): nunca decodificar o filme inteiro; a janela de `ImageBitmap` com `close()` nos de fora (`quadros.js`) fica.
4. **Nada muda de tamanho rolando:** a tela do filme tem `100lvh` e a camada de textos `100svh`; nada em `dvh` nem `100vh`. A barra do Safari some e volta sem redesenhar o palco.
5. **Toque de 44 px** em tudo que é clicável; hover só com `@media (hover: hover)`.

## Como checar

- `npm run build` passa sem erro, e `npm run dev` abre em `http://localhost:5360`.
- Role a página inteira na tela de 1456 × 840 e compare com `arquivos/conceito/*-desktop.jpg` (cada print é a página aberta pela âncora da cena: `/#vinhedo`, `/#adega` para a prensa, `/#barrica` para a adega de pedra...): nenhuma cena com quadro em branco, cada frase no lugar e na janela dela, o véu entrando só no céu do vinhedo e na mesa das garrafas.
- Abra a vitrine (Ver os vinhos, Loja) e feche no ×, no Esc e com um clique fora: ela volta ao mesmo ponto.
- No celular (`npm run dev -- --host` e o endereço de rede), compare com `*-mobile.jpg`: filme em pé, menu, vitrine em trilho, nada rolando para o lado (nem com a vitrine aberta), todos os botões respondendo ao toque.
- Recarregue a página: a primeira pintura já sai com estilo e com a fonte certa.
- O console fica sem erros.

## Personalizar

O site chega como a demo da Uvra, uma vinícola inventada. Esta seção vale sempre que a pessoa pedir uma mudança, hoje ou daqui a meses: trocar o nome, um rótulo, um preço, uma frase, ou levar uma peça para outro site.

### Antes de mexer

- Se ainda não sabe o objetivo, pergunte qual destes é (uma pergunta por vez, em linguagem simples):
  1. **Ver a demo funcionando** como está, para trocar depois.
  2. **O site da minha vinícola** com esta estrutura e este filme.
  3. **Só algumas peças** (o filme em quadros preso à rolagem, a vitrine que abre por cima, o menu do celular, o freio da rolagem) para um site que já existe.
- **Para o caminho 2**, pergunte o que ainda não sabe, sem pedir tudo de uma vez:
  - o nome e a frase da marca;
  - os rótulos (nome, uva, safra, preço, uma linha) e o link de compra de cada um;
  - as visitas e o link de agendamento;
  - o clube (o que vem por estação, o link);
  - os números reais (hectares, altitude, ano da primeira safra, tempo de barrica);
  - o e-mail e as redes.
- **Para o caminho 3**, pergunte quais peças e onde fica o site de destino. Leia o código do destino antes.
  - O filme é `src/motion/filme.js` + `quadros.js` + `guia.js` + `smooth.js`, a estrutura `.trilha > .tela > .palco` do `index.html` e o CSS de `hero.css` e `cena.css`. Em React ou Next, monte o diretor num `useEffect` e devolva o `gsap.ticker` na limpeza.
  - A vitrine é `#loja` + `loja.css` + `loja.js` e abre por qualquer link `href="#loja"`.
- **Diga com clareza, sem rodeio:**
  - O filme foi pintado por IA e mostra uma vinícola inventada. Ele não se edita por prompt. Serve como está para qualquer vinícola, porque conta o caminho da uva até a taça sem marca nenhuma. Para mostrar a paisagem, a adega ou o produto da pessoa, é preciso gerar quadros e clipes novos (abaixo).
  - As três garrafas da vitrine são pinturas com rótulos inventados. Publicar com elas é vender garrafas que não existem: entram fotos das garrafas reais ou pinturas novas dos rótulos dela.
  - Os números e os preços da demo são inventados.
  - Bebida alcoólica: o aviso "Aprecie com moderação. Venda proibida para menores de 18 anos." fica no rodapé, e nenhum texto associa o vinho a dirigir, a menores, a sucesso ou a desempenho.

### O que muda e onde

| o quê | onde | precisa de material novo? |
|---|---|---|
| Nome, `<title>`, `description` | `index.html`: `<title>`, `meta description`, `.marca__nome` e os `aria-label` da marca, `.rodape__marca`, `.rodape__direitos` | não |
| Logo e favicon | o SVG `.marca__icone` (na nav e no rodapé, o cacho de seis bagos) e `public/favicon.svg` | o SVG da marca, se houver |
| Texto e título do hero | `.hero__texto` e `.hero__titulo` (os dois `span.linha` são as duas linhas do celular); a legenda do quadro em `.legenda--hero` | não |
| Frase e apoio de uma cena | o `h2.cena__frase` (a palavra-chave em `<em>`) e o `.cena__apoio` de cada `section.cena` (atenção aos nomes: a frase da prensa está em `#adega` e a da adega de pedra em `#barrica`). Frase de até ~28 letras cabe numa linha no computador e em duas no celular | não |
| Índice das salas | `.indice__item` na nav e `.menu__item` no menu (o `href` é o `id` da cena) | não |
| Rótulos e preços | os três `li.garrafa` de `#loja`: nome, preço, uva e safra, a linha, o `alt` da foto e o link do "Comprar" | fotos das garrafas (abaixo) |
| Botões de ação | os `href="#"` com `data-acao`: `comprar` (cada garrafa), `agendar` (visitas), `clube` (fecho) viram os links reais | os links |
| Clube | `.clube__texto`, `.clube__titulo` e `.clube__botao` em `#clube`; a legenda do quadro do fim em `.legenda--fim` | não |
| Rodapé | `.rodape__frase`, `.rodape__links` (o e-mail), `.rodape__aviso` (fica), `.rodape__direitos` | não |
| Cores | `src/styles/tokens.css` e o `theme-color` do `index.html` | não |
| Tirar uma cena (só o texto) | a `section.cena` e o item dela no índice e no menu; o filme continua igual | não |
| Ritmo do filme | `telas` de cada capítulo em `CAPITULOS` (`filme.js`); as janelas `data-de`/`data-ate` são frações do capítulo e acompanham | não |
| Freio da rolagem | `AVANCO` (roda) e `INERCIA`/`GANHO` (toque) em `guia.js` | não |
| Outro filme | os clipes em `arquivos/filme/`, `npm run quadros`, `CAPITULOS` e as janelas das cenas (abaixo) | sim: quadros e clipes |

### Material da pessoa

Para cada peça visual, ofereça estes caminhos, do mais simples para o mais trabalhoso, e deixe a pessoa escolher.

**As garrafas da vitrine**

1. **Fotos das garrafas dela** (o melhor e o único honesto para vender): retrato vertical 2:3, a garrafa inteira de frente, centrada e ocupando ~76% da altura, sobre fundo liso quase preto (`#0c0705`, sem mesa nem reflexo), luz lateral quente. Recorte em 640 × 960, exporte em WebP (qualidade ~80) e salve como `public/img/loja/<nome>.webp`, no lugar da foto da demo. Mais ou menos de três rótulos: os `li.garrafa` acompanham, e no computador ajuste `repeat(3, 1fr)` em `.loja__grade` (`loja.css`); no celular, o trilho lateral se ajusta sozinho.
2. **Pintar com IA** no estilo do filme: as receitas estão em `arquivos/receitas/garrafas/` (uma por garrafa), descrevendo o rótulo dela no lugar do inventado. Use o quadro `k8-natureza-morta.jpg` e o `k1-dentro.jpg` de `arquivos/receitas/quadros/` como referência. Pintura mostra o rótulo, não a garrafa real: para vender, prefira a foto.
3. **Manter as da demo** só para ver o site funcionando. Diga à pessoa que, publicadas, elas vendem rótulos que não existem.

**O filme**

1. **Manter o filme da demo:** serve para qualquer vinícola, sem marca nenhuma. Troque só os textos.
2. **Um filme novo** (a paisagem, a adega ou o produto da pessoa): siga `arquivos/receitas/LEIA.md`. Em resumo: um quadro-chave por emenda (pintados em sequência, cada um com o anterior como referência), um clipe de 5 s entre cada par de quadros (gerador de vídeo com quadro inicial e final), os clipes em `arquivos/filme/c1.mp4`, `c2.mp4`... (1916 × 1080 ou 1920 × 1080, 24 fps) e `npm run quadros`. Sem `curvas.json`, o ritmo fica linear. Depois, ajuste `CAPITULOS` (um por clipe, `emenda: true` onde o clipe começa no quadro do anterior), as janelas e os lugares das frases (`data-de`, `data-ate`, a classe e o `data-veu`, no vazio de cada clipe) e confira a rolagem inteira.
3. **Um filme mais curto:** tire capítulos do fim de `CAPITULOS` e as cenas deles, e emende o último no fecho (`#clube`, `data-ate="fim"`).

**A foto do hero** é o quadro 0 do primeiro clipe e sai sozinha do `npm run quadros`. Não troque por outra foto: parada no topo, a página mostra a foto, e o filme começa exatamente nela.

### Regras ao trocar

- Não quebre: o `<link>` do CSS no `<head>`, a estrutura `.trilha > .tela > .palco` e `.textos`, o `canvas` do filme, as regras do celular e o aviso de bebida alcoólica.
- Dado que a pessoa ainda não deu (preço, safra, número, link) entra como `[preencher]`, nunca inventado.
- Cada frase continua no vazio da imagem e dentro da janela do clipe dela; ao mudar uma frase de tamanho, confira se ela não encosta em nada.
- Depois de cada mudança, `npm run build` e a rolagem inteira no computador e no celular.
- No fim, liste o que ainda é da demo (o filme, as garrafas, os números, os links `#`) e o que falta a pessoa mandar.
