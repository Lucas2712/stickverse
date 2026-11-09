# Modo "cartoon narrativo" (série ilustrada em episódios)

Modo de edição **opcional**, usado quando o usuário pedir vídeos "no estilo da série do cara de boné"
(referência enviada em 2026-11-09: 5 episódios de uma série brasileira de Instagram, 66 a 132 s,
720×1280, 30 fps). Os vídeos novos são criados **do zero**; os projetos antigos não mudam.

Copiamos a **linguagem de edição e o formato** (medidos abaixo). **Não copiamos** o personagem, os
cenários, a paleta nem os desenhos da série: cada série nossa tem personagem, mundo e paleta próprios
(registrar em `direcoes-usadas.md`). Tipografia continua SF Pro / Inter (CLAUDE.md, regra 3).

## 1. Medições (feitas nos 5 episódios)

| Medida | Referência | Vídeos atuais do estúdio (ex.: tutorial-claude) |
|---|---|---|
| Narração | 2,2–2,8 palavras/s, frases de 2 a 6 palavras, quase sem pausa > 0,5 s | 3,1 palavras/s, frases longas |
| Duração do plano | **1–2,5 s** (mediana ~1,5 s nos trechos rápidos, nunca > 4 s sem nova pose ou objeto) | ~3,5 s por cena (20 cenas em 70 s) |
| Tipo de corte | **corte seco** em 1 quadro, sempre na fronteira de palavra/frase | builds e fades suaves dentro da mesma cena |
| Câmera | quase parada dentro do plano; o movimento vem do **corte de reenquadramento** (mesmo cenário, plano aberto → close, ou close → detalhe) | deriva lenta contínua |
| Ocupação do quadro | **100% preenchido**: cenário ilustrado de borda a borda, personagem em close ocupando 50–80% | objetos pequenos no centro de fundo liso; muito espaço vazio |
| Texto na tela | **legenda sempre presente**, 1–3 palavras por vez, CAIXA ALTA, peso Bold/Heavy, branco com contorno/sombra escura, 1 palavra-chave colorida; centro, y ≈ 62% da altura | texto pequeno e cinza; sem legenda |
| Palavras de impacto | onomatopeias gigantes no quadro (TZZZZ!, PÁ! PÁ!, PLOFT, CLAC), carimbos (ERRADO, CONFISCADO!, CENSURADO), rótulos de antes/depois | gradiente na palavra-chave |
| Elementos de série | HUD fixo de progresso (contagem regressiva "FALTAM 30 DIAS", barra "PARECIDO COM A FOTO 3% → 24%", "+4%" verde quando sobe), placas de etapa ("1ª TENTATIVA"), dinheiro/contadores que mudam | não há |
| Interfaces | telas de app genéricas e simples (chat, feed, recibo, carteira) com dedo ilustrado tocando | janelas genéricas |
| Expressão | personagem troca de expressão a cada frase (suor, olhos arregalados, sorriso); objetos entram com pop (overshoot) | — |
| Áudio | **sem música** (fundo a −50 dB entre falas); efeito em quase todo corte e em cada pop/onomatopeia | sem música, efeitos mais espaçados |
| Estrutura | gancho na 1ª frase ("Três da manhã."), história em episódios, pergunta de votação no fim com tela dividida ("BARBA ou DENTE? Comente uma palavra"), o próximo episódio abre com "Vocês escolheram ___" | abertura → explicação → cartela |

**Conclusão:** a energia da referência não vem de transições sofisticadas nem de câmera que flutua, e sim de
três coisas juntas: **corte seco a cada frase**, **quadro sempre cheio** (cenário + close) e **algo novo e
legível a cada 0,5–1 s** (legenda em blocos, expressão, pop de objeto, onomatopeia, HUD que muda).

## 2. Regras deste modo (substituem as da seção 1 de `estilo-canal.md` só neste modo)

1. **Plano novo a cada 1–2,5 s**, corte seco na fronteira de frase (tempo de `palavras.json`).
   Alternar: plano aberto do cenário → close do rosto → detalhe do objeto → tela de app → close de reação.
2. **Reenquadramento como transição**: o mesmo cenário em escala diferente (×1 → ×1,8 → ×3) vale como
   plano novo. Pequeno "punch" de 4–6% em 0,12 s no corte de impacto, tremor de 6–10 px em 0,2 s nos choques.
3. **Quadro cheio sempre**: nenhum fundo liso sem cenário; nada de objeto pequeno no meio do vazio.
4. **Legenda em blocos de 1–3 palavras**, CAIXA ALTA, SF Pro Display (ou Inter Display) Bold, branca com
   contorno escuro de 6–8 px + sombra, 1 palavra colorida por bloco, centralizada em y ≈ 1180–1250
   (dentro da zona segura). Troca no tempo exato da palavra. (Neste modo a legenda é obrigatória.)
5. **A cada frase, algo muda dentro do plano**: expressão, gota de suor, objeto com pop (`back`), carimbo,
   onomatopeia, contador ou HUD.
6. **Personagem**: um protagonista próprio da série, criado por nós (nunca o da referência), com 4–6
   expressões fixas (neutro, susto, sorriso, vergonha, determinado, choro) geradas no mesmo estilo e
   reaproveitadas entre planos e episódios.
7. **HUD de série** (se o roteiro tiver meta e prazo): contador + barra de progresso no topo
   (abaixo de y=220), sempre igual dentro da série.
8. **Áudio**: sem música. Efeito em cada corte importante (pop, swish curto, clique de UI, impacto),
   onomatopeia sempre com som próprio, voz em primeiro plano. Efeitos reais (`sfx_real.py`).
9. **Final**: pergunta de votação com tela dividida de duas cores e as duas opções, "Comente uma palavra".

## 3. Arte (ilustrações)

- Estilo de desenho **plano (flat), traço escuro grosso, sombras simples, cores chapadas**: é o gênero da
  referência, não uma cópia; o personagem, os cenários e a paleta são nossos e mudam por série.
- Gerar no OpenArt (consultar o usuário antes de gastar créditos): **folha do personagem** primeiro
  (expressões, mesmo traço) e depois cenários **sem personagem** (o personagem entra recortado por cima,
  para trocar expressão e reenquadrar sem gerar imagem nova). Orçamento típico por episódio de 60–90 s:
  6–10 cenários + 1 folha de personagem + 4–8 objetos ≈ 15–20 imagens ≈ 450–600 créditos (2K).
- Interfaces de app: desenhadas em código (genéricas, sem logotipo real).
