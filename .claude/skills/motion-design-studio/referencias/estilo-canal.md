# Estilo do Studio Matteu

Regra principal: **a qualidade, a energia e a velocidade são sempre as mesmas; a cara do vídeo nunca é
a mesma.** As preferências permanentes estão no `CLAUDE.md` da raiz do repositório; se algo aqui divergir,
vale o `CLAUDE.md`. Separe sempre três camadas:

| | O que é | Muda por vídeo? |
|---|---|---|
| **Linguagem de edição** | ritmo, velocidade, movimento, transições, tipografia cinética, sincronia voz/imagem/efeitos | **Não.** Padrão fixo do estúdio (seção 1) |
| **Tipografia** | famílias e pesos das fontes | **Não precisa.** Preferência permanente (seção 2) |
| **Direção de arte** | cores, fundos, composições, elementos gráficos, layouts, animações, tratamento de imagem, assinatura de transição | **Sim, sempre.** Criada do zero para o tema (seção 3) |

**Referências de vídeo** servem principalmente para orientar ritmo, velocidade, dinâmica de edição e
qualidade das animações. Não copie delas (nem de vídeos anteriores do estúdio) a identidade visual nem a
composição: paleta, fundos, layouts, elementos gráficos ou sequência de animações.

## 1. Linguagem de edição (fixa)

Medido nas referências: a energia não vem de cortar muito, vem de **algo novo entrando a cada 0,5–1 s**,
de **transições contínuas** (o objeto de uma cena vira o da próxima) e de **pulsos** (rajada rápida na troca
de ideia, ~1 s de respiro para ler). Só 10–15% dos quadros ficam parados.

- Plano novo a cada 1–2,5 s; nenhum plano acima de 3 s sem mudança forte.
- Movimento constante: câmera sempre empurrando, recuando ou derivando; nada parado.
- Tipografia cinética sincronizada palavra por palavra; uma palavra de impacto por frase.
- Variedade de enquadramento: alternar plano aberto / detalhe / tipografia / objeto / imagem.
- Transições criativas e motivadas (o tema sugere a transição); corte seco só em impacto.
- **Narração:** preservar o áudio original. Não acelerar, não reescrever e não cortar palavras
  automaticamente. Não remover silêncios sem necessidade e sem a aprovação do usuário.
- **Sem música de fundo (padrão de todos os vídeos).** Só narração e **muitos efeitos sonoros**, todos
  presos a um evento visual, com a voz em primeiro plano. Impacto forte (`boom`/`hit`) no máximo a cada ~4 s.
  O canal de música do estúdio continua existindo, mas só é usado quando o usuário pedir expressamente.
- Sem legenda automática: o texto animado já acompanha a narração.
- **Assinatura:** Studio Matteu é a identidade oficial; não use nomes antigos ou provisórios nem invente
  um @. A cartela com a logo (`imagens/logo.png`, máscara que aceita qualquer cor) e o nome Studio Matteu
  (`projeto.json → perfil`) **não é obrigatória**: onde e como a assinatura entra segue a direção criativa
  de cada projeto.

## 2. Tipografia (preferência permanente)

- **SF Pro Display** nos títulos e textos de impacto; **SF Pro Text** nas legendas e textos explicativos.
- Pesos **Regular (400), Medium (500), Semibold (600) e Bold (700)**, conforme a hierarquia.
- **Inter** como alternativa quando a SF Pro não estiver disponível no ambiente ou não puder ser usada
  legalmente: Inter Display (eixo de tamanho óptico no alto) nos títulos, Inter Text no corpo, mesmos pesos.
  A licença da Apple restringe a SF Pro a maquetes de interfaces dos sistemas da Apple; sem licença que
  permita vídeo publicado, use o Inter e avise o usuário. Exemplo pronto: `projetos/tutorial-claude/fontes/`
  (Inter 4 variável + licença OFL).
- A tipografia pode ser a mesma em todos os vídeos. Uma fonte de apoio (ex.: uma mono para código ou
  rótulos técnicos) só entra se a direção de arte pedir. Fontes extras vêm do npm (`@fontsource/<nome>` ou
  `@fontsource-variable/<nome>`), sempre com licença que permita vídeo publicado; ficam em
  `projetos/<nome>/fontes/` com o arquivo de licença e entram em `projeto.json → fontesProjeto`.

## 3. Direção de arte (nova a cada vídeo)

Antes do storyboard, escreva uma **direção de arte** própria, derivada do assunto e da mensagem:

1. **Conceito** em uma frase: que mundo visual o tema pede e por quê (ex.: notícia → editorial com manchetes
   e fotos; tutorial de Claude → interfaces reais, janelas e cursor; descoberta científica → experimental e
   cinematográfico; IA → futurista e digital). São exemplos, não um cardápio fechado.
2. **Paleta**: 3 a 5 cores com papel definido. Pode haver arco de cor que acompanha a narrativa.
3. **Fundos e composição**: como o quadro é ocupado (grade, papel, profundidade, espaço negativo).
4. **Sistema gráfico**: os elementos recorrentes desse vídeo (ex.: linhas de cota, carimbos, manchetes, janelas, partículas).
5. **Tratamento de imagem**: como fotos, imagens geradas ou capturas entram (duotone, recorte, halftone, moldura, máscara).
6. **Animações e assinatura de transição**: 1 ou 2 transições que nascem do conceito (ex.: folha de papel, varredura, zoom num detalhe).

Confira `direcoes-usadas.md` e **não reutilize automaticamente** paleta, fundo, sistema gráfico, layouts ou
assinatura de transição de vídeos anteriores (a tipografia pode se repetir). Depois de aprovada, registre a
nova direção lá.

## 4. Imagens, interfaces e marcas

- Imagens geradas no OpenArt (conta conectada; o ambiente "stickverse" libera `cdn.openart.ai`). Plano Starter:
  4 imagens por vez. Nano Banana 2: 20 créditos (1K) ou 30 (2K, para tela cheia). Consulte o usuário antes
  de gastar créditos.
- Gere já na direção de arte do vídeo (paleta e luz no prompt), ou trate depois (duotone, recorte) para que
  as imagens pertençam ao vídeo e não pareçam bancos de imagem.
- Imagens geradas: sem logotipos, marcas reais ou pessoas reconhecíveis. Guarde em `projetos/<nome>/imagens/`
  (JPG ~1200 px); `montar.py` embute tudo e o código usa `MDS.img("nome")`.
- **Tutoriais:** use capturas de tela e gravações reais das ferramentas (como o Claude) quando necessário;
  o usuário grava a tela no iPhone e envia. Nunca invente interfaces, botões ou funcionalidades, e nunca
  use logotipos ou identidades visuais de terceiros como se fossem a identidade do Studio Matteu.
- Não invente dados: números e fatos vêm do roteiro ou de fonte do usuário.

## 5. Fluxo para cada vídeo

1. Conferir se as ferramentas e dependências existem no ambiente; transcrever a narração (sem alterar a voz).
2. Escrever a direção de arte (seção 3) + storyboard (`storyboard.json` → `storyboard.py`).
3. Apresentar os dois e **esperar aprovação**.
4. Gerar imagens → produzir → revisar → entregar (fluxo do SKILL.md; efeitos reais com `sfx_real.py`).
