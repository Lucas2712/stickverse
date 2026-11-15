# Storyboard: VYORA · comercial de portfólio

> Aguardando aprovação. Nada é programado antes dela.

Comercial vertical de 39 s (1080×1920, 30 fps) para a marca fictícia VYORA: narração enviada por você, intacta, com 36,2 s + 2,8 s de assinatura e chamada final. Da referência ficam só o ritmo, a sequência narrativa e a lógica de apresentação. Marca, logo, textos e interfaces são originais. Com narração, trilha musical (pedido expresso deste projeto) e efeitos sonoros reais. Construção em React + Remotion.

## Direção de arte

| | |
|---|---|
| Paleta | `#160A33` roxo profundo (bancada, mapa, encerramento) · `#7A2BFF` violeta elétrico (marca, botões, rota) · `#E6189B` magenta (check-in, destaques, ponto de destino) · `#FFFFFF` branco (telas do aplicativo, logo) · `#E9DEFF` lavanda claro (cards, fundos suaves, texto sobre roxo) |
| Conceito | <b>A rota.</b> Uma única linha de trajetória (um arco com um ponto de destino na ponta) atravessa o comercial inteiro: nasce na pergunta da abertura, desenha a logo, liga origem e destino na busca, vira o picote do cartão de embarque, as conexões do mapa e fecha na assinatura. |
| Logo VYORA | Símbolo original: um <b>V desenhado em um só traço</b>, em que a segunda haste sobe em arco, como uma rota decolando, e termina num ponto magenta (o destino). Sem asa, cauda, pássaro ou qualquer forma usada por companhias aéreas. Palavra VYORA em caixa alta, peso bold, espaçamento largo. Versões: violeta sobre branco, branca sobre roxo, e só o símbolo como ícone do aplicativo. |
| Tipografia | <b>Inter</b> (tamanho óptico Display nos títulos, Text na interface), pesos 400 a 700. A SF Pro é a preferência do estúdio, mas a licença da Apple não permite usá-la em vídeo publicado; o Inter é a alternativa prevista. |
| Fundos | bancada escura de desenvolvimento (painéis de camadas e linha do tempo desfocados, criados por nós, sem imitar nenhum programa real) com a tela vertical flutuando em 3D; branco para a logo e a interface; magenta para o check-in; roxo profundo com brilho violeta para mapa e assinatura. |
| Interface do aplicativo | um só sistema de design em todas as telas: cantos de 28 px, cards brancos com sombra lavanda, botões violeta, ícones de traço próprios, barra de abas. Dados fictícios e coerentes do começo ao fim: GRU → SSA, a mesma data, o mesmo voo VY 2718, o mesmo assento 14A, portão B12. |
| Imagens | 3 imagens já geradas no OpenArt, na paleta: avião branco sem pintura nem marca (recortado para cruzar a tela), céu roxo acima das nuvens e passageira na janela do avião (pessoa gerada, não é alguém real). Custo estimado de 90 créditos. |
| Transições | assinatura deste vídeo: <b>o arco da rota varre a tela</b> e troca o fundo; a tela vertical <b>recua para a bancada e volta</b>; o cartão de embarque <b>destaca no picote</b>. Nenhuma se repete em cenas seguidas. |
| Trilha | eletrônica instrumental moderna, crescente. Entrada em fade (0,6 s), virada principal no mapa (25,2 s), fade de saída (1,5 s) e redução automática de cerca de 8 dB durante a fala. Três opções enviadas (A, B, C), todas CC BY 3.0 com licença conferida na origem; aguardando a sua escolha. |
| Efeitos sonoros | sons reais da biblioteca do estúdio (252 efeitos do Earshot + Openverse), posicionados pelo Real SFX no quadro exato de cada movimento, em faixa separada. Mapa por cena abaixo. |
| Narração | arquivo enviado por você (36,2 s, 94 palavras, 2,6 palavras/s), usado sem acelerar, sem cortar e sem mexer nas pausas. Todos os tempos abaixo vêm da transcrição palavra por palavra. |

## Mapa de ritmo

| # | Tempo | Fundo | Composição | Imagem |
|---|---|---|---|---|
| 1 | 0,0–1,7 | escuro | bancada escura + tela vertical em 3D | avião + céu roxo |
| 2 | 1,7–6,3 | claro | logo central → telefone de frente |  |
| 3 | 6,3–10,9 | claro | cards em profundidade, câmera lateral |  |
| 4 | 10,9–14,5 | escuro | telefone 3D flutuando + cards saindo da tela |  |
| 5 | 14,5–21,0 | escuro | cartão de embarque central sobre magenta |  |
| 6 | 21,0–25,2 | escuro | imagem em tela cheia + notificação | passageira na janela do avião |
| 7 | 25,2–28,5 | escuro | mapa estilizado com rotas |  |
| 8 | 28,5–33,2 | claro | telefone de frente, três microinterações |  |
| 9 | 33,2–39,0 | escuro | bancada escura + logo em destaque |  |

### 1 · Abertura · 0,0–1,7 s

**Narração:** "Para onde você quer viajar?"

**Fundo:** escuro · **Composição:** bancada escura + tela vertical em 3D · **Imagem:** avião + céu roxo

Bancada de desenvolvimento em roxo quase preto, painéis desfocados ao fundo. A tela vertical chega inclinada em perspectiva e assenta de frente. Acima dela, selo «100% COM INTELIGÊNCIA ARTIFICIAL». Dentro da tela: céu roxo acima das nuvens, o avião cruza em diagonal com desfoque de movimento, e a pergunta «Para onde você quer viajar?» aparece palavra por palavra junto com a voz.

**Sincronização:**
- 0,00 s tela vertical gira e assenta, câmera empurra · whoosh
- 0,00 s «Para onde você quer viajar?» palavra por palavra (0,00 · 0,18 · 0,36 · 0,62 · 0,80)
- 0,30 s selo «100% COM INTELIGÊNCIA ARTIFICIAL» sobe da máscara · impacto suave
- 0,60 s avião atravessa a tela · swish + ambiente de cabine bem baixo
- 1,30 s o rastro do avião vira a linha da rota · brilho digital

**Transição:** a linha da rota varre a tela e deixa tudo branco (pausa de 0,5 s da voz)

---

### 2 · Logo e busca · 1,7–6,3 s

**Narração:** "Com a VYORA, sua próxima viagem começa de um jeito muito mais simples."

**Fundo:** claro · **Composição:** logo central → telefone de frente

Tela branca. O traço da rota desenha o V da logo, o ponto magenta pousa na ponta e a palavra VYORA abre letra por letra. A logo encolhe e vira o cabeçalho do aplicativo: tela «Sua próxima viagem», campos Origem «GRU · São Paulo» e Destino «SSA · Salvador» ligados por um arco pontilhado, data, 1 passageiro e botão violeta «Buscar com IA».

**Sincronização:**
- 1,74 s traço desenha o V · swish
- 2,06 s «VYORA»: ponto magenta pousa, palavra abre · impacto elegante da logo
- 2,62 s «sua próxima viagem»: logo sobe e vira cabeçalho, interface monta · whoosh suave
- 3,72 s «começa»: GRU e SSA preenchidos, arco liga os dois · 2 pops + brilho digital
- 5,36 s «simples»: toque no botão «Buscar com IA» · clique

**Transição:** zoom para dentro do botão: o violeta abre e revela os serviços

---

### 3 · Serviços · 6,3–10,9 s

**Narração:** "Encontre voos, serviços e ofertas personalizadas em um só lugar."

**Fundo:** claro · **Composição:** cards em profundidade, câmera lateral

Interface clara em leve perspectiva. Cinco cards de serviço entram em sequência vindos do fundo, cada um com ícone próprio: Voos, Hospedagem, Aluguel de carros, Seguro viagem e Ofertas para você (com selo «IA»). A câmera desliza acompanhando a fila; o card citado pela voz acende em violeta. Texto cinético: «Tudo em um só lugar.»

**Sincronização:**
- 6,66 s «voos»: card Voos entra e acende · whoosh curto + pop
- 7,40 s «serviços»: Hospedagem, Aluguel de carros e Seguro viagem em cascata (7,40 · 7,62 · 7,84) · 3 pops em tons diferentes
- 8,12 s «ofertas personalizadas»: card Ofertas para você com selo IA · brilho digital
- 9,50 s «em um só lugar»: cards se alinham, texto entra palavra por palavra · impacto suave
- 10,50 s riser curto para a virada

**Transição:** os cards giram como um leque e a tela escurece para violeta

---

### 4 · IA do seu jeito · 10,9–14,5 s

**Narração:** "Tudo pensado para facilitar cada etapa da sua jornada."

**Fundo:** escuro · **Composição:** telefone 3D flutuando + cards saindo da tela

Fundo violeta com brilho. Telefone em 3D gira devagar. Na tela, «Sugestões da VYORA»: balão da IA «Montei 3 dias em Salvador para você» e cards que saltam para fora do telefone em camadas: roteiro (Dia 1 · Pelourinho, Dia 2 · Praia do Forte, Dia 3 · Farol da Barra), «Melhor horário para voar: manhã» e «Assento na janela reservado». Título grande: «Sua viagem. Do seu jeito.»

**Sincronização:**
- 10,94 s «Tudo pensado»: telefone entra girando, balão da IA aparece · whoosh + som digital discreto
- 11,88 s «facilitar»: 3 cards saltam para fora em camadas · swishes laterais
- 12,42 s «cada etapa»: câmera aproxima no roteiro, os 3 dias marcam um a um · ticks
- 13,28 s «da sua jornada»: «Sua viagem.» + «Do seu jeito.» em magenta · impacto suave

**Transição:** o magenta do texto cresce e toma a tela

---

### 5 · Check-in · 14,5–21,0 s

**Narração:** "E com o check-in automático, você ganha ainda mais praticidade na hora de embarcar. Receba suas informações,"

**Fundo:** escuro · **Composição:** cartão de embarque central sobre magenta

Fundo magenta intenso. Título «Check-in sem complicação.» Card de check-in GRU → SSA, voo VY 2718, com botão deslizante que anda sozinho e vira ✓ «Check-in confirmado». O card gira e se transforma no cartão de embarque digital: passageira Marina Costa, assento 14A, portão B12, embarque 08:40, QR Code fictício varrido por uma luz. Em «Receba suas informações», três etiquetas saltam do cartão: Portão B12 · Assento 14A · Embarque 08:40. Plano muda aos 17,3 s (giro) e aos 19,4 s (aproximação).

**Sincronização:**
- 14,60 s card sobe com leve giro; título entra palavra por palavra · whoosh + impacto suave
- 14,86 s «check-in automático»: botão desliza sozinho até o fim · swish + clique
- 16,22 s «ganha»: ✓ «Check-in confirmado» · sino de confirmação discreto
- 17,30 s «praticidade»: card gira e vira cartão de embarque · flip
- 18,22 s «na hora de embarcar»: QR Code monta bloco a bloco e é varrido por luz · som digital
- 19,38 s «Receba suas informações»: câmera aproxima, 3 etiquetas saltam (19,38 · 19,74 · 19,94) · 3 pops
- 20,50 s cartão destaca no picote · rasgo de papel suave

**Transição:** a parte destacada do cartão sobe e vira a moldura da janela do avião

---

### 6 · A bordo · 21,0–25,2 s

**Narração:** "tenha seu cartão de embarque sempre à mão e viaje sem complicação."

**Fundo:** escuro · **Composição:** imagem em tela cheia + notificação · **Imagem:** passageira na janela do avião

Imagem cinematográfica da passageira sorrindo para o celular ao lado da janela do avião, luz violeta e rosa do nascer do sol, aproximação lenta e grão leve. Um mini cartão de embarque flutua ao lado do celular («sempre à mão»). Notificação discreta da VYORA desce do topo: «Já estamos embarcando! · Portão B12». Embaixo, sobre degradê roxo: «Mais liberdade em cada etapa.»

**Sincronização:**
- 21,00 s imagem abre com aproximação lenta · ambiente de cabine + whoosh grave
- 21,34 s «cartão de embarque»: mini cartão flutua ao lado do celular · pop suave
- 22,52 s «à mão»: notificação «Já estamos embarcando!» desce · pop discreto
- 23,32 s «viaje sem complicação»: «Mais liberdade» + «em cada etapa.» sobem da máscara · impacto suave
- 24,60 s riser para o mapa (pausa de 0,54 s da voz)

**Transição:** a janela do avião cresce até a tela inteira; o céu vira o roxo do mapa

---

### 7 · Seu mundo · 25,2–28,5 s

**Narração:** "A VYORA conecta você a destinos em 27 países."

**Fundo:** escuro · **Composição:** mapa estilizado com rotas

Roxo profundo. Mapa-múndi estilizado em pontos lavanda. Rotas em arco saem de São Paulo ligando cidades com marcadores que pulsam: Salvador, Lisboa, Nova York, Tóquio, Cidade do Cabo. Câmera recua enquanto as linhas se multiplicam. Título «Seu mundo, sem limites.» e, quando a voz diz, o número «27 países» em destaque (dado da sua narração).

**Sincronização:**
- 25,16 s virada principal da trilha; mapa surge em pontos · impacto + swell
- 25,66 s «conecta»: primeira rota (São Paulo → Salvador) · traço digital sutil
- 26,18 s mais 4 rotas em cascata, marcadores pulsam · brilhos em tons diferentes
- 26,66 s «destinos»: «Seu mundo, sem limites.»
- 27,28 s «27 países»: número conta de 0 a 27 e trava · tique rápido + impacto suave

**Transição:** um marcador do mapa cresce e vira o campo «Destino» do aplicativo; fundo passa a branco

---

### 8 · Escolha e pronto · 28,5–33,2 s

**Narração:** "Escolha seu destino, encontre seu voo e deixe o resto com a gente."

**Fundo:** claro · **Composição:** telefone de frente, três microinterações

Cena nova, pedida pelo texto da narração. De volta ao aplicativo em fundo branco/lavanda, três gestos em sequência: 1) carrossel de destinos e o toque em «Salvador»; 2) lista de voos, o melhor resultado «GRU → SSA · 08:40 · direto» é selecionado com selo «Recomendado pela IA»; 3) botão «Deixar com a VYORA»: uma lista se completa sozinha (Hospedagem ✓, Carro ✓, Seguro ✓, Check-in ✓).

**Sincronização:**
- 28,48 s «Escolha seu destino»: carrossel desliza, toque em Salvador · swish + clique
- 30,44 s «encontre seu voo»: resultados entram, o recomendado acende · whoosh curto + pop
- 31,78 s «deixe o resto»: toque no botão; 4 itens marcam sozinhos (31,9 · 32,2 · 32,5 · 32,8) · clique + ticks
- 32,80 s «com a gente»: tela pulsa em violeta · riser curto

**Transição:** o violeta toma a tela e a câmera recua para a bancada

---

### 9 · Assinatura · 33,2–39,0 s

**Narração:** "VYORA. Viajar começa com uma ideia."

**Fundo:** escuro · **Composição:** bancada escura + logo em destaque

De volta à bancada escura: a tela vertical flutua no centro. O símbolo da VYORA acende em branco sobre roxo, a palavra VYORA abre, e o slogan «Viajar começa com uma ideia.» entra palavra por palavra com a voz. Depois da fala, botão em cápsula «Descubra sua próxima viagem →» e respiro final. Crédito mínimo no rodapé: «Motion · Studio Matteu» (opcional).

**Sincronização:**
- 33,22 s «VYORA»: símbolo acende, ponto magenta pousa · impacto elegante da logo
- 33,92 s «Viajar começa com uma ideia.» palavra por palavra (33,92 · 34,48 · 34,90 · 35,32 · 35,46)
- 36,60 s botão «Descubra sua próxima viagem» entra e pulsa uma vez · pop + clique suave
- 37,50 s trilha em fade de saída; último quadro segura a logo até 39,0

**Transição:** fade final junto com a trilha

---

## Pontos de atenção

- Duração: você pediu cerca de 32 s, mas a narração enviada tem 36,2 s. Como a regra é não acelerar nem cortar a voz, o comercial fica com 39 s. Se preferir 32 s, a saída é regravar a narração com um texto mais curto.
- A narração enviada tem um texto diferente do que eu havia proposto; o storyboard foi refeito em cima dela. Entrou uma cena nova (8, «Escolha e pronto») para a frase «Escolha seu destino, encontre seu voo e deixe o resto com a gente».
- «27 países» aparece na tela porque está na sua narração. É o mesmo número do vídeo de referência; se quiser fugir disso, posso mostrar só «Seu mundo, sem limites.» sem o número (a voz continua dizendo).
- Na cena 5 o título na tela é «Check-in sem complicação.» (do seu briefing) enquanto a voz diz «check-in automático»; e na cena 6 a tela diz «Mais liberdade em cada etapa.» enquanto a voz diz «viaje sem complicação». Posso trocar para o texto exato da voz se preferir.
- React + Remotion: testado neste ambiente (instalação e renderização em 1080×1920 funcionaram). O projeto fica isolado em projetos/vyora/, sem alterar o estúdio. Não haverá link interativo com mixer; a entrega é o MP4.
- Ferramentas de som conferidas: Earshot instalado, Real SFX presente como skill, biblioteca studio/sons com 252 efeitos. Openverse: a API responde, mas o Freesound e o Jamendo são bloqueados para este servidor; as trilhas vieram do Wikimedia Commons.
- QR Code, voo VY 2718, passageira Marina Costa e portão B12 são fictícios. O QR será um padrão decorativo, não legível.
- Eu não ouço áudio: mixagem de voz, trilha e efeitos é conferida por medição e pelas notas do Earshot. A aprovação final do som é sua.
