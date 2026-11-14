# Storyboard: ROVIA — comercial vertical

> Aguardando aprovação. Nada é programado antes dela.

Reconstrução cena a cena do comercial de referência (27,4 s, 11 planos, beat ~100 BPM) para a marca nova ROVIA, app de controle de gastos do carro. Mesma ordem, mesma duração dos planos, mesmas transições e mesma lógica de som; marca, paleta, interfaces e textos próprios. Vertical de verdade (a referência é um 16:9 com tarjas pretas dentro de 9:16): cada plano é recomposto para 1080×1920. Tempos abaixo = tempos da referência; depois da narração nova, cada corte é reajustado à palavra correspondente. Projeto em React + Remotion.

## Direção de arte

| | |
|---|---|
| Paleta | `#F2F6F5` névoa (fundos claros: problema, ícones, CTA) · `#0A1214` asfalto noturno (fundos escuros: dados, logo) · `#13B8A6` petróleo-turquesa ROVIA (marca, valores positivos, botão) · `#FF6B5B` coral-alerta (custos que sobem, barras de despesa) · `#FFB467` luz de sódio (só na cena da mesa, luz quente) |
| Marca ROVIA | logotipo novo: um <b>R</b> desenhado por uma <b>estrada</b> que vira linha de gráfico subindo, dentro de um quadrado arredondado petróleo; nome em Inter Display Semibold, caixa alta com espaçamento largo. Nada do nome, logo ou verde da marca original. |
| Conceito | <b>Painel do carro à noite</b>: o mesmo jogo da referência entre fundos claros de névoa (perguntas, ícones, chamada) e fundos escuros de painel (dados), com a luz quente de uma mesa noturna no meio. Instrumentos de bordo viram interface financeira. |
| Tipografia | <b>Inter</b> (Display nos títulos, Text no corpo; Regular, Medium, Semibold, Bold). A SF Pro não tem licença para vídeo publicado; o Inter é a alternativa permanente do estúdio (OFL). |
| Sistema gráfico | cards de vidro com sombra longa e suave, contadores que rolam dígito a dígito, mini-barras (sparklines) turquesa/coral, anéis de porcentagem, mapa de rota com traço que se desenha, widget de tela bloqueada, ícones 3D (bomba de combustível, chave, escudo, documento, pneu), post-it e recibos térmicos na cena da bagunça. |
| Transições (como na referência) | foco que entra (desfoque → nítido), zoom para dentro da tela, chicote horizontal com borrão de movimento, fita turquesa que envolve o celular (a referência usa uma fita verde: aqui ela é uma <b>estrada</b> que dá a volta no aparelho), flash branco curto. |
| Imagens | 2 imagens geradas no OpenArt: (1) quarto escuro, mão sobre notebook com a tela acesa; (2) mesa de madeira à noite com luminária, plantas, janela com lua e notebook. A tela do notebook fica vazia e a interface ROVIA é animada por cima em código. Ícones 3D: gerados no OpenArt (lote de 4–5) ou desenhados em código. |
| Áudio | narração nova (voz Matilda), <b>música instrumental</b> no lugar da da referência (pedido explícito seu, exceção à regra do canal) e efeitos de interface presos a cada animação. |

## Mapa de ritmo

| # | Tempo | Fundo | Composição | Imagem |
|---|---|---|---|---|
| 1 | 0,0–1,9 | escuro | Plano fechado de um notebook num quarto escuro, mão no teclado, tela clara acesa preenchendo o centro do quadro (na vertical, o notebook ocupa a metade inferior; acima, o escuro do quarto). A frase da narração aparece escrita no meio da tela, como na referência. | quarto escuro + notebook (OpenArt) |
| 2 | 1,9–4,3 | claro | Fundo névoa com brilho azul-turquesa nos cantos. Card de vidro no centro (largura ~70% do quadro). Depois, tipografia central. |  |
| 3 | 4,3–7,0 | escuro | Plano médio da mesa de madeira à noite: luminária quente à esquerda, plantas, livros, janela azul com lua ao fundo, notebook no centro. Na vertical, a câmera está mais alta e mostra a mesa inteira de frente, janela ocupando o terço de cima. | mesa noturna + notebook (OpenArt) |
| 4 | 7,0–9,3 | claro | Fundo névoa. Celular inclinado em 3D entra de baixo, gira e para no centro; uma fita turquesa em forma de estrada (com faixa tracejada) se enrola em volta dele, entrando por cima e saindo por baixo. |  |
| 5 | 9,3–12,9 | escuro | Fundo asfalto noturno. Campo de busca/entrada no centro (pílula). Depois a câmera desce para uma lista de 4 linhas com mini-barras, à esquerda os rótulos, à direita valor e barras. |  |
| 6 | 12,9–15,2 | escuro | Grade de cards: em cima dois anéis (Combustível 63% · Outros custos 37%); embaixo à esquerda card turquesa-escuro «Veja o seu custo real»; à direita card grande claro com «R$ 0,74 por km» e mapa de rota com traço se desenhando. |  |
| 7 | 15,2–16,9 | escuro | Close do celular em fundo azul-noite, tela de bloqueio com widget ROVIA. Notificações chegam pelo topo e o total sobe. |  |
| 8 | 16,9–19,4 | claro | Fundo névoa-lilás. Ícones 3D (pneu, documento do IPVA, bomba de combustível, chave, escudo do seguro) passam num carrossel horizontal na parte de cima; no centro «Com o que você gasta no carro?»; rótulos flutuam em profundidade embaixo. |  |
| 9 | 19,4–21,5 | claro | Texto gigante «Sem bagunça.» entra desfocado no centro; a câmera recua e revela à volta uma nuvem de papéis e cards (planilha, extrato, recibo térmico, post-it, alerta do IPVA) que entram de todos os lados; sublinhado coral desenha sob «bagunça». Depois «Sem planilha.» com tudo em chicote. |  |
| 10 | 21,5–23,2 | claro | Fundo névoa liso, frase única centralizada em tamanho grande, muito espaço vazio (respiro). |  |
| 11 | 23,2–25,2 | escuro | Fundo asfalto noturno. Ícone ROVIA aparece pequeno, a estrada do R se desenha, o nome entra ao lado com leve giro que se acomoda; depois cresce suavemente. |  |
| 12 | 25,2–28,5 | claro | Fundo névoa. Ícone pequeno em cima; botão turquesa em pílula no centro que se estica da esquerda e o texto aparece letra a letra; depois o botão vira contorno com «É GRÁTIS»; abaixo, endereço e «Valores de exemplo». |  |

### 1 · Abertura · notebook no escuro · 0,0–1,9 s

**Narração:** "Dois mil no mês…"

**Fundo:** escuro · **Composição:** Plano fechado de um notebook num quarto escuro, mão no teclado, tela clara acesa preenchendo o centro do quadro (na vertical, o notebook ocupa a metade inferior; acima, o escuro do quarto). A frase da narração aparece escrita no meio da tela, como na referência. · **Imagem:** quarto escuro + notebook (OpenArt)

na tela do notebook: «Dois mil no mês…» em texto pequeno; barra de player discreta embaixo

**Sincronização:**
- 0,00 s câmera parada com leve deriva; tela pisca ao acender
- 0,70 s «Dois mil no mês…» digita na tela
- 1,40 s clique de tecla (som)
- 1,60 s câmera mergulha na tela (zoom para dentro), tudo vira o branco da cena 2

**Transição:** zoom para dentro da tela do notebook → fundo branco

---

### 2 · Problema · card de gastos · 1,9–4,3 s

**Narração:** "…E cada quilômetro, quanto custou?"

**Fundo:** claro · **Composição:** Fundo névoa com brilho azul-turquesa nos cantos. Card de vidro no centro (largura ~70% do quadro). Depois, tipografia central.

card: «Gastos do mês · R$ 2.000,00» + 2 pílulas «Abastecer» «Gastos»; depois «quanto CUSTOU?» (CUSTOU em caixa alta e Bold)

**Sincronização:**
- 1,85 s beat entra; card chega desfocado e entra em foco (0,5 s)
- 2,30 s valor rola de R$ 0 até R$ 2.000,00, dígito a dígito
- 3,24 s «quanto» card sai em chicote e a frase entra
- 3,68 s «CUSTOU?» bate maior, leve tranco de escala
- 4,00 s frase sai em chicote para a esquerda com borrão

**Transição:** chicote horizontal com borrão → mesa

---

### 3 · Ambiente · mesa noturna · 4,3–7,0 s

**Narração:** "Entre posto, oficina e planilha?"

**Fundo:** escuro · **Composição:** Plano médio da mesa de madeira à noite: luminária quente à esquerda, plantas, livros, janela azul com lua ao fundo, notebook no centro. Na vertical, a câmera está mais alta e mostra a mesa inteira de frente, janela ocupando o terço de cima. · **Imagem:** mesa noturna + notebook (OpenArt)

na tela: painel escuro com cards soltos (comprovante do posto, orçamento da oficina, planilha) e um post-it amarelo colado na borda da tela

**Sincronização:**
- 4,27 s entrada desfocada → foco na tela (rack focus 0,6 s)
- 4,90 s «posto» card do posto aparece na tela (pop)
- 5,74 s «oficina» card da oficina (pop)
- 6,34 s «planilha» planilha + post-it (pop)
- 4,3–7,0 s câmera avança devagar (dolly-in 6%)

**Transição:** a imagem esmaece e clareia (flash branco suave) → fundo névoa

---

### 4 · Solução · celular com a estrada · 7,0–9,3 s

**Narração:** "Existe um app pra isso."

**Fundo:** claro · **Composição:** Fundo névoa. Celular inclinado em 3D entra de baixo, gira e para no centro; uma fita turquesa em forma de estrada (com faixa tracejada) se enrola em volta dele, entrando por cima e saindo por baixo.

tela do celular: app ROVIA, pergunta «Quanto custa cada km do seu carro?», campos preenchidos e card escuro «R$ 0,74 / km»

**Sincronização:**
- 7,00 s celular sobe de baixo girando (out expo)
- 7,98 s «um app» fita-estrada começa a envolver
- 8,12 s card «R$ 0,74/km» acende na tela
- 9,00 s fita acelera e cobre o quadro

**Transição:** a fita cobre a tela (wipe) e o fundo escurece para o painel

---

### 5 · Produto · digitar os números · 9,3–12,9 s

**Narração:** "Lance seus gastos e veja quanto custa…"

**Fundo:** escuro · **Composição:** Fundo asfalto noturno. Campo de busca/entrada no centro (pílula). Depois a câmera desce para uma lista de 4 linhas com mini-barras, à esquerda os rótulos, à direita valor e barras.

campo: «Valor do carro» → digita «R$ 70.000»; lista: Gasolina R$ 6,20/L (barras turquesa) · Km por mês 2.700 km · Manutenção R$ 340 (barras coral) · Fixos (seguro, IPVA) R$ 400 (barras coral)

**Sincronização:**
- 9,33 s campo entra desfocado e foca
- 9,90 s «Lance» digitação no campo (sons de tecla)
- 10,56 s lista sobe de baixo, linha a linha (0,12 s entre linhas)
- 11,36 s «veja» barras crescem em cascata
- 12,40 s câmera desliza para cima, desfoque de movimento

**Transição:** deslize vertical rápido com borrão → cards

---

### 6 · Indicadores · custo por km · 12,9–15,2 s

**Narração:** "…cada quilômetro."

**Fundo:** escuro · **Composição:** Grade de cards: em cima dois anéis (Combustível 63% · Outros custos 37%); embaixo à esquerda card turquesa-escuro «Veja o seu custo real»; à direita card grande claro com «R$ 0,74 por km» e mapa de rota com traço se desenhando.

63% Combustível · 37% Outros custos · R$ 0,74 por quilômetro · «Veja o seu custo real»

**Sincronização:**
- 12,90 s cards entram por foco (desfoque → nítido)
- 13,00 s «quilômetro» número rola 0,52 → 0,74
- 13,10 s anéis preenchem
- 13,40 s rota se desenha no mapa com ponto no final

**Transição:** zoom rápido para dentro do card grande → celular

---

### 7 · App · tudo numa tela · 15,2–16,9 s

**Narração:** "Tudo numa tela só."

**Fundo:** escuro · **Composição:** Close do celular em fundo azul-noite, tela de bloqueio com widget ROVIA. Notificações chegam pelo topo e o total sobe.

widget: «Gastos do mês R$ 1.150 → 1.410 → 1.750 → 2.000»; notificações «+ Combustível R$ 260», «+ Manutenção R$ 340», «+ Seguro R$ 250»; barra de progresso turquesa enchendo

**Sincronização:**
- 15,20 s corte com leve zoom-out
- 15,60 s 1ª notificação + total sobe (som de confirmação)
- 16,10 s 2ª notificação
- 16,50 s 3ª notificação

**Transição:** chicote para a direita → fundo névoa

---

### 8 · Gastos · carrossel de ícones · 16,9–19,4 s

**Narração:** "Informe cada gasto. Combustível, manutenção."

**Fundo:** claro · **Composição:** Fundo névoa-lilás. Ícones 3D (pneu, documento do IPVA, bomba de combustível, chave, escudo do seguro) passam num carrossel horizontal na parte de cima; no centro «Com o que você gasta no carro?»; rótulos flutuam em profundidade embaixo.

«Com o que você gasta no carro?» · Combustível · Manutenção · Seguro · IPVA · Pneus

**Sincronização:**
- 16,90 s carrossel entra da direita (whoosh)
- 17,30 s «Combustível» bomba centraliza, rótulo acende
- 18,16 s «manutenção» chave centraliza
- 19,00 s tudo desfoca e sai

**Transição:** desfoque total → texto grande

---

### 9 · Sem bagunça · sem planilha · 19,4–21,5 s

**Narração:** "Sem bagunça, sem planilha."

**Fundo:** claro · **Composição:** Texto gigante «Sem bagunça.» entra desfocado no centro; a câmera recua e revela à volta uma nuvem de papéis e cards (planilha, extrato, recibo térmico, post-it, alerta do IPVA) que entram de todos os lados; sublinhado coral desenha sob «bagunça». Depois «Sem planilha.» com tudo em chicote.

«Sem bagunça.» → «Sem planilha.» (sublinhado coral)

**Sincronização:**
- 19,45 s «Sem bagunça.» foca
- 19,80 s câmera recua (scale 1,8 → 1), cards entram em leque
- 20,36 s «Sem planilha.» troca, sublinhado desenha
- 21,00 s música corta; cards saem em chicote

**Transição:** chicote com borrão → frase final

---

### 10 · Só o custo real · 21,5–23,2 s

**Narração:** "Só o custo real."

**Fundo:** claro · **Composição:** Fundo névoa liso, frase única centralizada em tamanho grande, muito espaço vazio (respiro).

«Só o custo REAL.» (REAL em turquesa, depois marca-texto turquesa claro passa por trás)

**Sincronização:**
- 21,60 s frase entra (máscara para cima)
- 22,14 s «real» marca-texto varre; música volta

**Transição:** corte seco no impacto para o fundo escuro

---

### 11 · Marca ROVIA · 23,2–25,2 s

**Narração:** "ROVIA."

**Fundo:** escuro · **Composição:** Fundo asfalto noturno. Ícone ROVIA aparece pequeno, a estrada do R se desenha, o nome entra ao lado com leve giro que se acomoda; depois cresce suavemente.

ícone + «ROVIA»

**Sincronização:**
- 23,20 s ponto turquesa aparece
- 23,40 s estrada do R se desenha, nome entra girando e assenta
- 24,00 s logo cresce 1 → 1,15 devagar

**Transição:** corte para o fundo claro

---

### 12 · Chamada · baixe agora · 25,2–28,5 s

**Narração:** "Baixe agora. É grátis."

**Fundo:** claro · **Composição:** Fundo névoa. Ícone pequeno em cima; botão turquesa em pílula no centro que se estica da esquerda e o texto aparece letra a letra; depois o botão vira contorno com «É GRÁTIS»; abaixo, endereço e «Valores de exemplo».

«Baixe agora» → «É GRÁTIS» · rovia.app (a confirmar) · «Valores de exemplo.»

**Sincronização:**
- 25,20 s botão estica da esquerda
- 25,50 s «agora» texto completa, clique
- 26,30 s «É grátis» botão inverte para contorno, som de confirmação
- 27,2–28,5 s respiro final, música termina

**Transição:** fim (fade curto do áudio)

---

## Pontos de atenção

- Valores na tela são exemplos coerentes entre si (R$ 2.000/mês ÷ 2.700 km = R$ 0,74/km; combustível R$ 1.260 = 63%; manutenção R$ 340 + fixos R$ 400 = 37%), como na referência, com o aviso «Valores de exemplo» na cartela final. Se tiver números reais da ROVIA, troco.
- «É grátis», o endereço do site e «Baixe agora» dependem do produto: confirme.
- ElevenLabs: a conta está no plano gratuito com 437 caracteres livres (o roteiro tem cerca de 310): dá para gerar a narração uma única vez. O plano gratuito também não dá licença comercial nem acesso à geração de música.
- A voz Matilda da sua conta é americana: falando português pelo modelo multilíngue pode ficar com sotaque. Sua biblioteca tem também a «Lari Diniz», feminina, brasileira, de publicidade.
- Remotion: grátis para pessoa física e empresas de até 3 pessoas; acima disso exige licença da empresa.
