# Estilo do canal (@matteu.ia)

Regra principal do usuário: **a qualidade, a energia e a velocidade são sempre as mesmas; a cara do
vídeo nunca é a mesma.** Separe sempre duas coisas:

| | O que é | Muda por vídeo? |
|---|---|---|
| **Linguagem de edição** | ritmo, velocidade, movimento, transições, tipografia cinética, sincronia voz/imagem/efeitos | **Não.** Padrão fixo do canal (seção 1) |
| **Direção de arte** | paleta, fontes, fundos, layouts, sistema gráfico, tratamento de imagem, assinatura de transição | **Sim, sempre.** Criada do zero para o tema (seção 2) |

Os vídeos de referência que o usuário enviou servem **só** como referência de dinâmica e ritmo.
Não copie deles (nem de vídeos anteriores do canal) paleta, fundos, layouts, fontes ou sequência de animações.

## 1. Linguagem de edição (fixa)

Medido nas referências: a energia não vem de cortar muito, vem de **algo novo entrando a cada 0,5–1 s**,
de **transições contínuas** (o objeto de uma cena vira o da próxima) e de **pulsos** (rajada rápida na troca
de ideia, ~1 s de respiro para ler). Só 10–15% dos quadros ficam parados.

- Plano novo a cada 1–2,5 s; nenhum plano acima de 3 s sem mudança forte.
- Movimento constante: câmera sempre empurrando, recuando ou derivando; nada parado.
- Tipografia cinética sincronizada palavra por palavra; uma palavra de impacto por frase.
- Variedade de enquadramento: alternar plano aberto / detalhe / tipografia / objeto / imagem.
- Transições criativas e motivadas (o tema sugere a transição); corte seco só em impacto.
- **Áudio: sem música de fundo.** Só narração (intacta, a menos que o usuário peça mudança) e
  **muitos efeitos sonoros**, todos presos a um evento visual. Impacto forte (`boom`/`hit`) no máximo a cada ~4 s.
- Sem legenda automática: o texto animado já acompanha a narração.
- Cartela final com a logo do perfil (`imagens/logo.png`, máscara que aceita qualquer cor) e @matteu.ia.

## 2. Direção de arte (nova a cada vídeo)

Antes do storyboard, escreva uma **direção de arte** própria, derivada do assunto e da mensagem:

1. **Conceito** em uma frase: que mundo visual o tema pede e por quê (ex.: notícia → editorial com manchetes
   e fotos; tutorial de Claude → interfaces, janelas e cursor; descoberta científica → experimental e cinematográfico;
   IA → futurista e digital). São exemplos, não um cardápio fechado.
2. **Paleta**: 3 a 5 cores com papel definido. Pode haver arco de cor que acompanha a narrativa.
3. **Tipografia**: par de fontes escolhido para o tema. Além das fontes do estúdio, há fontes no npm
   (`@fontsource/<nome>` ou `@fontsource-variable/<nome>`, ex.: Martian Mono, Unbounded, Syne, Fraunces,
   Big Shoulders Display, IBM Plex Mono, Instrument Sans, Dela Gothic One). Fontes do projeto ficam em
   `projetos/<nome>/fontes/` e entram em `projeto.json → fontesProjeto`.
4. **Sistema gráfico**: os elementos recorrentes desse vídeo (ex.: linhas de cota, carimbos, manchetes, janelas, partículas).
5. **Tratamento de imagem**: como fotos/imagens geradas entram (duotone, recorte, halftone, moldura, máscara).
6. **Assinatura de transição**: 1 ou 2 transições que nascem do conceito (ex.: folha de papel, varredura, zoom num detalhe).

Confira `direcoes-usadas.md` e **não repita** paleta, par de fontes, fundo ou assinatura de transição de vídeos anteriores.
Depois de aprovada, registre a nova direção lá.

## 3. Imagens

- Imagens geradas no OpenArt (conta conectada; o ambiente "stickverse" libera `cdn.openart.ai`). Plano Starter:
  4 imagens por vez. Nano Banana 2: 20 créditos (1K) ou 30 (2K, para tela cheia).
- Gere já na direção de arte do vídeo (paleta e luz no prompt), ou trate depois (duotone, recorte) para que
  as imagens pertençam ao vídeo e não pareçam bancos de imagem.
- Sem logotipos, marcas reais ou pessoas reconhecíveis. Guarde em `projetos/<nome>/imagens/` (JPG ~1200 px);
  `montar.py` embute tudo e o código usa `MDS.img("nome")`.

## 4. Fluxo para cada vídeo

1. Transcrever a narração (sem alterar a voz).
2. Escrever a direção de arte (seção 2) + storyboard (`storyboard.json` → `storyboard.py`).
3. Apresentar os dois e **esperar aprovação**.
4. Gerar imagens → produzir → revisar → entregar (fluxo do SKILL.md).
