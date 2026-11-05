# Desmontagem da edição: "Série do zero ao motion" (Parte 1 e Parte 2)

Análise de 2 reels de tutorial em motion design para replicar o **estilo de edição**.
Vídeos: 720x1280 (9:16), 30 fps. Parte 1 = 106 s, Parte 2 = 166 s.
Áudio: AAC 48 kHz, **-14 LUFS integrado, LRA 1,6 LU** (voz muito comprimida, volume constante).

> Copie o **formato e a linguagem visual**, não a marca: @, domínio, nomes de pastas,
> repositório e textos são do criador original. Use os seus.

---

## 1. O formato em uma frase

Tutorial narrado em que **tudo o que é dito vira uma interface animada** (janela de
macOS, terminal, celular, chat de IA, checklist), num **plano-sequência sem cortes**:
uma "câmera" passeia por um único canvas branco guiada por uma **fita de gradiente**
(azul→roxo→rosa→laranja), e as legendas aparecem palavra por palavra.

Por que funciona:
- **Zero corte seco**: na detecção de cena o ffmpeg achou 0 cortes na Parte 2 e 1 na
  Parte 1. O olho nunca "reseta" e não sobra brecha pra rolar o feed.
- **Mostrar, não falar**: cada frase tem um objeto na tela que faz exatamente o que a
  frase diz ("cria uma pasta" → aparece a pasta; "cola este comando" → botão Copiar → "✓ Copiado").
- **Série numerada** ("Parte 1", "01 de 03", checklist 01/02/03) dá progresso e motivo pra seguir.
- **CTA por palavra-chave** ("Comenta ESTUDIO", "Comenta REFERÊNCIA") → DM com link/PDF.
  Gera comentário (alcance) e lead.

---

## 2. Estrutura de um episódio

| Bloco | Parte 1 | Parte 2 | O que acontece |
|---|---|---|---|
| **Gancho escuro** | 0–12 s | 0–19 s | Fundo preto/roxo, "cinematográfico". Prova social ou recap + título da parte. |
| **Portal** (transição) | 12–13 s | 19–20 s | Um ponto de luz vira a fita; um **círculo branco** cresce e engole a tela. |
| **Capítulo** | 13–15 s | — | "01 de 03 / Crie o seu segundo cérebro" (número fino gigante + título bold). |
| **Explicação** (miolo) | 15–70 s | 20–139 s | 1 interface por ideia, encadeadas pela fita. |
| **Capítulo 2** | 70–95 s | — | "02 de 03 / Ferramentas de edição" (mesmo template). |
| **Fechamento** | 95–100 s | 156–163 s | Checklist da série (01 ✓, 02 ✓, 03 destacado) = teaser da próxima parte. |
| **CTA** | 100–104 s | 139–156 s | Comentário digitado com a palavra-chave → notificação de DM com o link. |
| **Zoom-out final** | 104–106 s | 163–166 s | A câmera se afasta e mostra a fita inteira como "linha do tempo" do vídeo. |

### Beat sheet: Parte 1 (106 s)

| Tempo | Narração (pelas legendas) | Tela |
|---|---|---|
| 0–4 | "Muita gente tá pedindo um vídeo ensinando do zero como fazer motion com IA." | Tela de bloqueio "23:47 / quarta-feira", notificações do Instagram empilhando ("como faz esse motion??", "ensina do zero?", "qual IA você usa?") |
| 5–9 | "O momento chegou… essa é a parte 1, o setup…" | Card de vidro fosco "Série do zero ao motion · 01/03 · **Parte 1** · o setup completo" |
| 9–11 | "…até quem nunca mexeu numa ferramenta de IA." | Ícones de apps (IA, Python, After Effects) entram um a um com pop |
| 12 | "Bora começar?" | Campo de chat digita "bora começar" → clique no botão de enviar |
| 12,5–13,2 | — | **Portal**: o botão solta a fita, que desce; círculo branco cresce |
| 13–15 | "Antes de tudo, a gente precisa…" | "01 de 03 / Crie o seu segundo cérebro" |
| 15–19 | "…configurar uma pasta no seu computador pra ser o seu segundo cérebro." | Janela Finder "Documentos" → pasta nova renomeada letra a letra para "meu-estudio" |
| 19–27 | "É dentro dessa pasta que qualquer agente de IA vai trabalhar… lembrando dos seus projetos, o que fizeram, o que ainda vão…" | Árvore 00-entrada…06-metodo + AGENTS.md; selos de IA "grudam" nas linhas; cards Projetos / Já fizemos / Próximos com ✓ |
| 27–33 | "Sem isso, a sua IA começa todo vídeo do zero… por isso sempre sai genérico." | "Novo chat" vazio com cursor; 3 cards de vídeo cinzas ganham um X vermelho |
| 33–40 | "Pra configurar, é simples: cria uma pasta… abre a sua IA dentro dela e cola este comando:" | Checklist "Configurar 0 de 3 → 1 de 3 → 2 de 3" |
| 41–42 | — | Card "Cole na sua IA" com o prompt → cursor clica **Copiar** → "✓ Copiado" |
| 42–50 | "Ela faz tudo sozinha: baixa a estrutura, liga a memória, conversa com você…" | Terminal com o agente executando, linhas ✓ verdes, árvore de pastas sendo criada |
| 50–58 | "E não precisa confiar no escuro: tudo o que ela roda tá num repositório aberto no GitHub…" | Página do repositório, scroll até o script de instalação |
| 58–70 | "Com o segundo cérebro pronto, a regra é uma só: sempre abre a sua IA dentro dessa pasta…" | Pasta ganha ✓ verde → vira uma "caixa" 3D aberta com as IAs dentro; arquivos voam pra dentro |
| 70–77 | "Agora vem a parte das ferramentas de edição. Eu preparei um comando…" | "02 de 03 / Ferramentas de edição" + card de prompt digitando → Copiado |
| 77–86 | "Python, as skills… o EffectCraft, o HyperFrames, o Remotion e a ponte com o After Effects." | Lista vertical rolando; item ativo em foco, anteriores ganham ✓, próximos esmaecidos |
| 86–95 | "É só colar o comando… leva de 10 a 20 minutos, e ele só te pede login ou senha." | Terminal com checklist 1–8 + pílula "**10 a 20 minutos**" + diálogo de senha do sistema |
| 95–99 | "Na próxima, você já vai ter o setup todo… e aí a gente começa a brincadeira!" | Checklist de conferência todo verde "Essencial pronto" → "03" fantasma |
| 100–104 | "Comenta ESTUDIO que eu te mando na DM o link com todos os comandos." | Lista de comentários; digita "ESTUDIO" no campo; chega notificação "Te mandei o link 👇" |
| 104–106 | — | Zoom-out: a fita inteira em S vertical, com as cenas como miniaturas |

### Beat sheet: Parte 2 (166 s)

| Tempo | Narração | Tela |
|---|---|---|
| 0–4 | "No último vídeo a gente fez o setup completo do ambiente de trabalho." | Escuro: **arcos neon** concêntricos (roxo/rosa) formando um corredor; pasta "meu-estudio" no centro |
| 4–14 | "Agora, nessa parte, vamos exercitar o nosso workflow… pra que cada vídeo tenha a sua própria identidade visual. Pronto?" | Câmera avança pelo corredor; celulares inclinados com reels nas laterais |
| 15–19 | "Essa é uma das tarefas mais importantes… de maneira 'manual', digamos assim." | Foto P&B dentro do arco + card "Tarefa nº 1 · Abastecer o palácio com o que você gosta. Só você faz isso." (digitando) |
| 19–20 | — | **Portal**: arco colapsa num orbe de luz → fita → círculo branco |
| 20–28 | "O que você vai fazer? Anotar os links de todos os conteúdos…" | App Notas "Referências" ganhando links um por um |
| 28–42 | "Eu gosto de vídeos de criadores aqui do Instagram… copio o link e mando no meu bot, onde a IA tá configurada como agente." | iPhone: feed, coração de like, menu → "Link copiado" → chat de mensageiro com a bolha do link |
| 42–48 | "Ele pega esse link, baixa e assiste com a skill watch…" | Terminal + **tira de frames** do vídeo aparecendo |
| 48–55 | "…documenta tudo: estilo, cores, identidade, movimentos, transições, animações, contexto." | Card "Análise do reel": cada campo preenche no ritmo da palavra falada |
| 55–59 | "…nosso segundo cérebro, que eu carinhosamente chamo de palácio mental." | Rótulo da pasta é re-digitado: "segundo cérebro" → "Palácio mental" |
| 59–66 | "Cada gosto é único. O estilo que eu curto, você pode não gostar." | Grade "Meu gosto" vs "Seu gosto" com corações |
| 66–73 | "A sua IA precisa entender o que você gosta e o que não gosta…" | Janela com gosto.md / nao-gosto.md → linhas curvas ligam ao nó da IA → timeline de vídeo |
| 73–80 | "Eu fiz questão de fazer esse vídeo falando apenas de referência…" | Checklist da série: 01 o setup ✓ / **02 as referências** (borda gradiente) / 03 esmaecido |
| 80–87 | "Não adianta jogar uns prompts mágicos e esperar… Esquece isso, nunca vai funcionar." | Chat digita "faz um vídeo incrível em motion" → resultado placeholder cinza → texto apagado |
| 87–97 | "Vídeo é algo criativo… é isso que vai te diferenciar de todo mundo…" | Mosaico de vídeos condensa num card; zoom-out: grade de cards cinzas genéricos, só o seu colorido |
| 97–111 | "Eu uso bastante o Instagram… e o YouTube, pesquisando 'SaaS animation', 'After Effects transitions'… sempre em inglês." | Explore do Instagram enchendo; YouTube digitando buscas, resultados pipocando |
| 111–127 | "Você nem precisa assistir: é só pegar o link e mandar a sua IA assistir e aprender… ela escreve em scripts…" | Copiar link → chat da IA → "Técnica anotada" → passos numerados → código digitando → "✓ Salvo" |
| 127–139 | "Se não for usar o After Effects, tudo bem: dá pra fazer em Remotion ou HyperFrames…" | Editor com código; abas de ferramenta alternando no YouTube |
| 139–156 | "Vou deixar disponível um PDF com todas as referências… Comenta a palavra REFERÊNCIA…" | PDF com números (131 / 44 / 3) → envio pra IA "Catalogando…" → "Catalogado" → pasta "131 itens" → campo de comentário digitando → notificação da DM com o PDF |
| 156–166 | "E na parte 3… a gente vai fazer o primeiro vídeo com IA!" | Checklist: 01 ✓ 02 ✓ **03 o primeiro vídeo** com sublinhado gradiente → zoom-out |

Padrão do miolo: **1 ideia = 1 interface = 3 a 8 segundos**. Cada interface tem um
"micro-evento" que confirma a frase (✓ verde, "Copiado", "Salvo", contador subindo).

---

## 3. Roteiro e narração

- Tom de conversa, 2ª pessoa ("você"), frases médias, **~2,5–3 palavras/s**.
  Parte 1 ≈ 270 palavras em 106 s.
- **Pausas cortadas**: a voz é editada sem respiro (jump-cut de áudio). Os únicos
  silêncios ficam nos portais e no fim.
- Estrutura retórica que se repete: **problema → regra → passo a passo → prova → CTA**.
  - Problema: "Sem isso, a sua IA começa todo vídeo do zero."
  - Regra: "A regra é uma só: sempre abre a sua IA dentro dessa pasta."
  - Prova/confiança: "E não precisa confiar no escuro: tá tudo num repositório aberto."
  - Antecipa objeção: "Esquece isso, nunca vai funcionar dessa maneira."
- Termina sempre apontando pra próxima parte ("Na próxima…", "E na parte 3…").

---

## 4. Visual

### 4.1 Dois mundos

| | Abertura (escuro) | Miolo (claro) |
|---|---|---|
| Fundo | quase preto `#060508`, manchas desfocadas roxo `#2C1B3F` / `#140F2E` e laranja-vinho `#3C2024` | branco puro `#FFFFFF` |
| Elementos | vidro fosco (glassmorphism), arcos neon, glow | janelas brancas tipo macOS, sombra grande e suave |
| Legenda | branca | preta `#111` |
| Função | clima, título, "trailer" | explicação clara, legível |

### 4.2 A fita (o elemento-assinatura)

- Um traço grosso (≈ 30–40 px em 1080p), pontas arredondadas, em curva S, que
  atravessa a tela diagonalmente.
- Gradiente ao longo do traço: **azul `#4F7BFF` → roxo `#B14CF0` → rosa `#FF2D7A` →
  laranja `#FF7A1A` → pêssego que some no branco**. Glow suave da mesma cor por fora.
- Fica **atrás** das janelas; as janelas são levemente translúcidas e deixam passar um
  reflexo rosado da fita (vidro fosco claro).
- Funciona como **trilho da câmera**: a cada nova interface, a fita desliza, gira ou
  redesenha a curva, dando continuidade sem corte.
- No fim, o zoom-out revela que a fita é **o caminho do vídeo inteiro**.
- Fundo com **linhas de wireframe cinza bem claras** (retângulos finos, 1 px,
  `#ECECEC`) pra criar profundidade e parallax.

### 4.3 Componentes de interface (kit reutilizável)

1. **Janela macOS**: branca, raio ~24 px, 3 bolinhas (vermelho/amarelo/verde), título
   cinza pequeno, sombra `0 30px 60px rgba(0,0,0,.08)`.
2. **Terminal do agente**: mesma janela, fonte mono, caixa "Welcome to…" com borda
   rosa, linhas `✓` verdes `#22C55E`, árvore `├─`.
3. **Card de prompt** "Cole na sua IA": borda gradiente fina, texto digitando com
   cursor, botão preto "Copiar" → vira pílula verde "✓ Copiado".
4. **Checklist** "Configurar 1 de 3": item ativo preto, concluído com bolinha verde,
   futuros como barras cinza (skeleton).
5. **Lista rolante** de ferramentas: item central em foco (escala 1,1, opaco), vizinhos
   menores, esmaecidos e com blur, estilo picker do iOS.
6. **iPhone** em mockup (9:41, notch), com telas reais de feed/explore.
7. **Notificação** estilo iOS (ícone, nome, "agora", texto) que desce do topo.
8. **Pílula de número** "10 a 20 minutos": números com gradiente, texto preto.
9. **Título de capítulo**: "01" fino gigante (peso Light/Thin) + "de 03" minúsculo +
   título em 2 linhas Bold, tracking negativo.
10. **Checklist da série** 01/02/03: o item atual tem borda e sublinhado gradiente.
11. **Cursor do mouse**: aparece pra clicar em botões (Copiar, Enviar). Dá realismo.
12. **Skeleton/placeholder** cinza claro pra conteúdo "genérico" ou ainda não carregado.

### 4.4 Câmera e movimento

- **Plano-sequência**: não há corte. Tudo é transição por movimento.
- **Entrada de card**: escala 0,92 → 1,0 + opacidade 0 → 1 + blur 12 → 0 px, com
  ease-out forte (tipo `cubic-bezier(.2,.8,.2,1)` ou spring), ~400 ms.
- **Saída**: o card sobe/sai pela borda e desfoca (motion blur) enquanto o próximo
  já entra. **Sobreposição de 150–250 ms**, nunca tela vazia.
- **Deriva constante**: mesmo "parado", tudo flutua alguns px e a escala cresce
  ~2–3% por plano.
- Elementos internos entram **em cascata** (stagger de 60–100 ms por linha).
- **Digitação** sempre visível: texto entra letra a letra (~25–35 caracteres/s) com cursor `|`.
- **Portal escuro → claro** (≈ 0,8 s): botão/orbe brilha → solta a fita, que desce →
  um círculo branco com borda cinza cresce a partir do ponto até cobrir a tela → a
  câmera já está no mundo branco com a fita em S.

---

## 5. Legendas (o detalhe que mais "vende")

- Posição: centro-baixo, linha base em **~79% da altura** (y ≈ 1010/1280).
- Fonte: sans grotesca tipo SF Pro Display / Inter, **Semibold**, caixa normal
  (não é caixa alta), ~44 px em 720p (≈ 66 px em 1080p), tracking levemente negativo.
- Cor: preto `#111` no claro, branco no escuro. **Sem contorno, sem caixa, sem sombra.**
- **1 linha por vez, até ~5 palavras**, centralizada.
- **Animação por palavra** (no tempo exato da fala):
  1. a palavra nasce **~12 px abaixo** da linha, **cinza** e com opacidade ~40%;
  2. em ~150–200 ms sobe pra linha, fica preta e opaca;
  3. a próxima palavra já começa a nascer enquanto a anterior assenta.
- **Troca de frase**: a linha inteira esmaece e sobe um pouco (~200 ms) enquanto a
  primeira palavra da frase nova nasce embaixo.
- **Palavra-chave** (1 por frase, às vezes 2): texto com **gradiente** azul → roxo → rosa
  (o mesmo da fita). Ex.: "setup", "pasta", "comando", "memória", "GitHub", "IA",
  "referência", "Remotion". A pontuação colada à palavra herda o gradiente.

---

## 6. Áudio

- Voz única do criador, seca, bem perto do microfone. **Compressão pesada**
  (LRA 1,6 LU) e loudness **-14 LUFS** (padrão de redes).
- Trilha de fundo **muito baixa** (só uma "cama" grave, quase imperceptível).
- **SFX de interface** sincronizados com o visual (aparecem como estalos de banda
  larga no espectrograma): *whoosh* nas entradas de card e no portal, clique no
  "Copiar/Enviar", tec-tec de teclado nas digitações, "pop" nos ✓ e nas notificações.
- Sem silêncio; o único respiro é o fade final (~0,4–0,6 s).

---

## 7. Como replicar (pipeline)

Ferramentas possíveis: **After Effects** (shape layers + Graph Editor), **Remotion**
(React) ou **HTML + GSAP** (HyperFrames). Para este repositório, Remotion ou HTML/GSAP
encaixa melhor que o renderizador em PIL dos episódios, porque blur, gradiente em
traço e easing ficam triviais.

1. **Roteiro em tabela**: tempo | fala | componente | micro-evento | palavra-chave.
2. **Gravar a voz**, cortar as pausas, comprimir, normalizar em -14 LUFS.
3. **Timestamps por palavra** (Whisper com `word_timestamps`). Eles dirigem tudo:
   legenda, entrada de card, ✓, cliques.
4. **Montar o kit de componentes** (§4.3) uma vez, parametrizado por texto.
5. **Fita**: um path SVG em S com `stroke` gradiente + glow (blur da mesma cor
   embaixo). Anime `d`/rotação/posição por cena; câmera = transform do canvas inteiro.
6. **Cenas** = lista `{inicio, fim, componente, props}`. Cada cena entra 200 ms antes
   da anterior sair.
7. **Legenda** (§5): renderizada por palavra a partir dos timestamps.
8. **SFX**: whoosh/clique/tecla/pop amarrados aos eventos da timeline.
9. **Exportar** 1080x1920, 30 fps, H.264 + AAC 48 kHz.

### Constantes pra copiar

```
W, H, FPS          = 1080, 1920, 30
LEGENDA_Y          = 0.79 * H
LEGENDA_FONTE      = Inter SemiBold 66px, tracking -1%
PALAVRA_SOBE       = 18px em 180ms, ease-out, cinza(#9A9A9A,40%) -> #111
FRASE_SAI          = opacidade 1->0, y -10px, 200ms
CARD_ENTRA         = escala .92->1, blur 12->0, opac 0->1, 420ms, cubic-bezier(.2,.8,.2,1)
CARD_SOBREPOE      = 200ms
STAGGER_LINHAS     = 80ms
DIGITACAO          = 30 caracteres/s
FITA_LARGURA       = 36px, glow blur 24px, opac .35
FITA_GRADIENTE     = #4F7BFF -> #B14CF0 -> #FF2D7A -> #FF7A1A -> #FFD9C7(0%)
GRADIENTE_PALAVRA  = #4F7BFF -> #A855F7 -> #EC4899
VERDE_OK           = #22C55E
ESCURO_FUNDO       = #060508 + blobs #2C1B3F, #140F2E, #3C2024 (blur 200px)
PORTAL             = 0.8s: orbe brilha -> fita desce -> circulo branco cresce
AUDIO              = -14 LUFS, voz comprimida, trilha -30 dB, SFX por evento
```

---

## 8. Checklist de "parece o original"

- [ ] Nenhum corte seco: tudo entra e sai por movimento, com sobreposição.
- [ ] Toda frase tem um objeto na tela fazendo o que é dito.
- [ ] Legenda palavra por palavra subindo do cinza pro preto, 1 palavra em gradiente.
- [ ] A fita gradiente costura todas as cenas e aparece inteira no zoom-out final.
- [ ] Abertura escura com vidro fosco e portal de círculo branco pro miolo claro.
- [ ] Micro-confirmações: ✓ verde, "Copiado", "Salvo", contadores.
- [ ] Título de capítulo "01 de 03" e checklist da série no final.
- [ ] CTA de palavra-chave no comentário → notificação de DM na tela.
- [ ] Voz sem pausas, -14 LUFS, SFX de UI em cada evento.
