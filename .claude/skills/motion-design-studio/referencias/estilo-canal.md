# Estilo do canal (@matteu.ia)

Direção padrão de TODOS os vídeos do canal, tirada de dois vídeos de referência que o usuário enviou
(anúncio de tecnologia em inglês com fundo claro e destaque verde-limão; anúncio de agência com
celular 3D, cards com luz de borda e gradientes laranja). Leia antes de escrever qualquer storyboard.
A paleta muda por vídeo se o usuário pedir; o MÉTODO abaixo não muda.

## 1. O que as referências fazem (medido)

| Medida | Referência 1 | Referência 2 |
|---|---|---|
| Duração | 34,8 s | 24,2 s |
| Troca de fundo claro ↔ escuro | 3 vezes | 6 vezes |
| Cortes secos | 3 (quase tudo é transição contínua) | 9 |
| Quadros parados | 10% | 15% |
| Ritmo de movimento | picos fortes a cada 2–4 s, respiros de ~1 s | picos a cada 1–3 s, respiros curtos |

Conclusão: a energia não vem de cortar muito. Vem de **algo novo entrando a cada 0,5–1 s**, de
**transições contínuas** (o objeto da cena vira o da próxima) e de **pulsos**: uma rajada de
movimento rápido na troca de ideia, depois ~1 s de deriva lenta para o olho ler.

## 2. Regras de linguagem

**Fundo**
- Alternar claro (cinza-papel `#ECECEC`/`#F2F2F2`, nunca branco puro chapado) e escuro (`#0B0B0D`
  com um brilho radial colorido e difuso, tipo brasa, atrás do assunto). Troca a cada 2–5 s.
- Um momento de **tela cheia na cor de destaque** (gradiente) por vídeo, no clímax ou na virada.

**Tipografia** (é ela que conta a história: o texto na tela É a narração)
- Base elegante: sans moderna em peso leve/médio (Geist 300–500), 56–90 px, centralizada,
  palavra por palavra no tempo da fala, entrando com desfoque → nítido (não máscara dura).
- Impacto: 1 palavra-chave por frase vira GIGANTE (Archivo 900, 250–400 px, ocupando a largura),
  ou ganha **brilho neon** na cor de destaque, ou vira **itálico serifado** (Instrument Serif) em
  contraste com a sans.
- Destaque por **faixa** de cor atrás de uma palavra ou número (marcador).
- Sem legenda automática: as palavras animadas já são a legenda. Só ligar legenda se o usuário pedir.

**Objetos**
- Interfaces genéricas e limpas: celular 3D girando em perspectiva, janelas e cards inclinados
  (rotateX/rotateY de 8–25°) com sombra macia, documentos flutuando, barra de busca com brilho.
- Cards escuros com **luz de borda** na cor de destaque (rim light) e reflexo.
- Infográficos simples: número grande com contador, pílulas empilhadas (listas), gráfico em
  escada/linha, órbitas com ícones geométricos, planos em perspectiva (mapa/gráfico deitado).
- Um **fio** gráfico (fita, traço com brilho) que atravessa cenas.
- Nada de marca real nem foto: UI genérica da categoria, ícones geométricos próprios.

**Câmera e transições**
- Sempre um empurrão lento (zoom de 2–5%) ou deriva; nada parado.
- Profundidade: o que está atrás fica desfocado; foco puxa para o assunto.
- Transições preferidas: objeto vira o próximo (match/morph), chicote com desfoque, íris circular
  na cor de destaque, zoom através de uma tela, corte seco só em batida ou palavra de impacto.

## 3. Ritmo

- Narração com pausas curtas (0,2–0,3 s). Se o áudio vier com pausas longas, propor encurtar
  (ver `audio.md`, "Narração mais rápida") e pedir aprovação do resultado.
- Plano novo a cada 1–2,5 s; nenhum plano acima de 3 s sem mudança forte.
- Alinhar viradas e impactos à música: achar BPM, grave e subidas, e ajustar `musica.corte` para
  que o drop caia na frase principal.
- No máximo 1 impacto sonoro forte (`boom`/`hit`) a cada ~4 s; whoosh só em transição de verdade.

## 4. Fluxo para cada vídeo novo do canal

1. Ler este guia + `linguagem-visual.md`.
2. Analisar narração (transcrever) e música (BPM, drop, subidas).
3. Storyboard com: lista de planos de 1–2,5 s, claro/escuro de cada plano, palavra de impacto de
   cada frase e tratamento dela (gigante / neon / serifa / faixa), objeto de cada plano e como ele
   vira o próximo.
4. Aprovação → produção → revisão → entrega (fluxo do SKILL.md).
