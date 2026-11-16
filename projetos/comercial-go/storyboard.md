# Storyboard: Comercial GO · gobank

> Aguardando aprovação. Nada é programado antes dela.

Filme publicitário de 15 s, 1920×1080 a 60 fps, em Three.js (WebGL), sem narração. Trilha original em Web Audio a 120 BPM (1 batida = 0,5 s, 1 compasso = 2 s): todas as trocas de cena caem em batidas. Efeitos sonoros reais da biblioteca configurada (Real SFX + Earshot), presos aos eventos visuais. O cartão GO é o fio condutor: ele nunca sai de cena, a câmera é que muda de mundo ao redor dele.

## Direção de arte

| | |
|---|---|
| Conceito | <b>Luz rasante sobre matéria.</b> Um estúdio fotográfico de produto, escuro, onde o cartão é esculpido pela luz. A tecnologia aparece como linhas de luz que nascem do próprio cartão (o reflexo vira a onda do pagamento, que vira as rotas do globo). |
| Paleta | Preto quase absoluto <code>#07080A</code> · cor principal da gobank <b>(aguardando o HEX oficial)</b> · cartão em grafite fosco <code>#1A1C20</code> com bisel metálico · luz branca fria <code>#EEF2F6</code> · chip em ouro pálido realista. Sem cor inventada para a marca. |
| Fundo e composição | Espaço negativo grande, cartão sempre com escala heroica. Alterna preto (atos 1, 2, 5, 7, 8) e cor da marca (atos 3 e 4). Profundidade real: chão refletivo escuro, névoa leve, desfoque de profundidade. |
| Sistema gráfico | Uma única linha de luz (o reflexo especular) que percorre o cartão e vira onda e órbita. Tipografia gigante, sempre ancorada na linha de base, letras sobem de máscaras. Nada de partículas soltas nem ícones decorativos. |
| Tipografia | Inter Display ExtraBold/Black nos títulos (o briefing pede extra bold; a SF Pro não tem licença para vídeo publicado) e Inter Text Medium nos apoios. Licença OFL incluída no projeto. |
| Render | PBR (MeshPhysicalMaterial com clearcoat), mapa de ambiente de estúdio (RoomEnvironment), sombras suaves (PCSS), SSAO/GTAO, bokeh com foco animado, bloom contido, motion blur por acumulação de subquadros na exportação. |
| Transição assinatura | <b>Varredura de luz:</b> o reflexo atravessa o cartão e, ao passar, troca o mundo de fundo (preto ↔ cor da marca). Segunda transição: o cartão gira de borda e a espessura vira um corte. |

## Mapa de ritmo

| # | Tempo | Fundo | Composição | Imagem |
|---|---|---|---|---|
| 1 | 0,0–2,0 | escuro | macro extremo (câmera a ~3 cm do chip) |  |
| 2 | 2,0–4,0 | escuro | objeto hero central, rotação 3D |  |
| 3 | 4,0–6,0 | marca | tipografia gigante à esquerda + cartão inclinado à direita |  |
| 4 | 6,0–7,0 | marca | cartão em diagonal à esquerda, texto à direita (espelho da cena 3) |  |
| 5 | 7,0–8,0 | escuro | plano lateral: maquininha genérica (sem marca) à direita, cartão vindo da esquerda |  |
| 6 | 8,0–12,0 | escuro | globo tecnológico (pontos + arcos de luz) à direita, cartão em órbita; câmera em arco |  |
| 7 | 12,0–13,5 | escuro | hero shot central, luz de recorte (rim light) |  |
| 8 | 13,5–15,0 | escuro | cartão menor ao centro + logo gobank abaixo |  |

### 1 · O detalhe · 0,0–2,0 s

**Narração:** "(sem narração · trilha: drone sub-grave, sem bateria)"

**Fundo:** escuro · **Composição:** macro extremo (câmera a ~3 cm do chip)

Sem texto. Chip em close com luz lateral rasante; foco raso que corre dos contatos para a borda do cartão. Uma linha de luz atravessa a superfície fosca da esquerda para a direita.

**Sincronização:**
- 0,0 s fade do preto em 0,4 s, câmera já em deslocamento lateral lento
- 0,3 s som metálico fino (roçar no chip) acompanhando o movimento
- 0,8 s linha de luz começa a varrer; whoosh suave
- 1,5 s riser curto preparando a revelação

**Transição:** saída por recuo contínuo da câmera (sem corte), foco abre

---

### 2 · A revelação · 2,0–4,0 s

**Narração:** "(trilha: impacto grave + entra o kick)"

**Fundo:** escuro · **Composição:** objeto hero central, rotação 3D

Cartão inteiro gira ~200° com inércia: mostra espessura, bisel, reflexo percorrendo. «GO» entra gigante atrás do cartão, letras subindo da linha de base.

**Sincronização:**
- 2,0 s impacto grave, câmera chega ao plano médio
- 2,5 s «G» sobe da máscara (expo 0,5 s)
- 2,6 s «O» sobe 0,1 s depois
- 3,5 s riser para o drop

**Transição:** varredura de luz: reflexo cruza o cartão e troca o fundo para a cor da marca em 4,0 s

---

### 3 · Benefício 01 · 4,0–6,0 s

**Narração:** "(trilha: drop, batida completa)"

**Fundo:** marca · **Composição:** tipografia gigante à esquerda + cartão inclinado à direita

[BENEFÍCIO 1] em 2 linhas, palavra-chave 3× maior. Contagem numérica só se você fornecer valor e condição reais.

**Sincronização:**
- 4,0 s drop: fundo na cor da marca, hit grave
- 4,1 s linha 1 sobe da base
- 4,5 s palavra-chave sobe, escala 1,08 → 1

**Transição:** chicote: cartão gira de borda (a espessura fecha o quadro) em 6,0 s

---

### 4 · Benefício 02 · 6,0–7,0 s

**Narração:** "(trilha: hats acelerados)"

**Fundo:** marca · **Composição:** cartão em diagonal à esquerda, texto à direita (espelho da cena 3)

[BENEFÍCIO 2] em uma linha forte. Cartão em rotação sutil, luz dinâmica passando.

**Sincronização:**
- 6,0 s swoosh do chicote
- 6,05 s texto sobe da base
- 6,8 s fundo volta ao preto pela varredura

**Transição:** varredura de luz de volta ao preto

---

### 5 · Aproximação · 7,0–8,0 s

**Narração:** "(trilha: corta para só kick + sub)"

**Fundo:** escuro · **Composição:** plano lateral: maquininha genérica (sem marca) à direita, cartão vindo da esquerda

Sem texto. O cartão desacelera e para a ~2 cm do terminal; anéis de luz se propagam do cartão ao terminal e um LED genérico acende.

**Sincronização:**
- 7,0 s whoosh de aproximação
- 7,5 s contato: anel de luz + som de confirmação (exatamente na batida)
- 7,6 s LED do terminal acende

**Transição:** a onda do pagamento se expande e vira o horizonte do globo (8,0 s)

---

### 6 · O universo GO · 8,0–12,0 s

**Narração:** "(trilha: arpejo digital, textura)"

**Fundo:** escuro · **Composição:** globo tecnológico (pontos + arcos de luz) à direita, cartão em órbita; câmera em arco

Quatro benefícios, 1 s cada, sempre um por vez, no lado esquerdo: [BENEFÍCIO 3] 8,0 · [BENEFÍCIO 4] 9,0 · [BENEFÍCIO 5] 10,0 · [BENEFÍCIO 6] 11,0. Cada um com entrada própria (subida da base, corte de máscara lateral, letras em cascata, escala) e a mesma tipografia. A cada benefício um arco de luz sai do cartão e pousa no globo.

**Sincronização:**
- 8,0 s whoosh + globo se forma
- 8,0 / 9,0 / 10,0 / 11,0 s troca de benefício + pulso curto
- 11,0 s riser de 1 s

**Transição:** luzes apagam, globo recua para o escuro; câmera cai no hero

---

### 7 · Assinatura · 12,0–13,5 s

**Narração:** "(trilha: queda, só sub e reverberação)"

**Fundo:** escuro · **Composição:** hero shot central, luz de recorte (rim light)

SEU DINHEIRO. / SEU RITMO. em duas linhas gigantes acima e abaixo do cartão, entrando na batida.

**Sincronização:**
- 12,0 s hit grave, ambiente escurece
- 12,0 s «SEU DINHEIRO.» sobe
- 12,5 s «SEU RITMO.» sobe (batida seguinte)

**Transição:** tagline sai para cima, cartão recua levemente

---

### 8 · Logo final · 13,5–15,0 s

**Narração:** "(trilha: impacto final + cauda)"

**Fundo:** escuro · **Composição:** cartão menor ao centro + logo gobank abaixo

Logo oficial da gobank (SVG que você enviar). Sem o SVG: caixa de espaço reservado marcada "LOGO GOBANK". Imagem final segura 1,2 s parada para leitura, com micro-deriva de luz.

**Sincronização:**
- 13,5 s impacto final + logo aparece
- 14,0–15,0 s cauda da reverberação, imagem segura

**Transição:** fim em 15,0 s exatos

---

## Pontos de atenção

- Faltam para produzir: os 6 benefícios, o SVG oficial da logo gobank e o HEX da cor principal. Não vou inventar nenhum deles.
- Cartão sem bandeira, sem número, sem nome de titular e sem certificações: só chip, símbolo de aproximação, GO e a logo.
- Música: o padrão do canal é sem música; aqui entra trilha original em Web Audio porque você pediu. Efeitos: biblioteca real configurada (Real SFX), mixada abaixo da trilha nos ritmos e acima dela nos impactos.
- Formato fora do padrão do estúdio (16:9, 60 fps): crio um exportador próprio para este projeto, sem mexer nas ferramentas existentes.
- Motion blur por acumulação (até 20 subquadros) só na exportação do MP4; o link interativo roda em tempo real sem acumulação. O tempo de render no servidor pode me obrigar a reduzir subquadros: eu aviso se acontecer.
