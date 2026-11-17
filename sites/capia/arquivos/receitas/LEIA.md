# Receitas das imagens

Tudo o que aparece na demo já vem pronto em `arquivos/public/img/`. Estas receitas servem para quando o cardápio é
outro: são os prompts que geraram cada imagem e o caminho para refazer com os seus lanches.

Não depende de nenhuma conta nossa. Serve qualquer gerador de imagem que entregue **fundo transparente** (ou um
gerador comum mais um removedor de fundo). Os prompts estão em inglês porque os geradores entendem melhor assim.

## O que existe e como é usado

| Imagem | Quantas | Formato | Onde entra |
|---|---|---|---|
| O lanche do hero | 1 | recorte em fundo transparente, visto de frente | a primeira tela |
| Os itens do cardápio | 18 (6 lanches, 4 acompanhamentos, 4 bebidas, 4 sobremesas) | recorte em fundo transparente, visto de frente | o meio de cada painel e a miniatura da pílula |
| As peças soltas | 30 ingredientes | recorte em fundo transparente, meio de cima | flutuam em volta do item (7 por cena) e do lanche do hero |
| As fotos da casa | 5 | foto 3:2 | a seção "Deixa a chapa falar por si" |
| Os cartões do mural | 6 | imagem em pé, 9:16 | o rastro do mouse no rodapé (e a pilha, no celular) |
| O mascote | 4 poses | desenho de uma cor só (SVG) | logo, selo, lambreta e rodapé |

## A ordem

1. **O estilo.** `prompts/_estilo.txt` é o parágrafo que abre todo prompt de comida (luz, fundo transparente, nada de
   texto nem logo). É ele que faz dezoito imagens parecerem do mesmo ensaio: mude nele, não em cada prompt.
   `prompts/_estilo-foto.txt` faz o mesmo papel para as cinco fotos da casa.
2. **Os itens do cardápio.** Cada prompt pede uma **folha** com dois a quatro itens lado a lado, bem separados
   (`lanches-a`, `lanches-b`, `lanches-c`, `acomp`, `bebidas`, `sobremesas`), mais o `hero`, sozinho. Gerar em folha
   mantém a luz e o ângulo iguais entre os itens e sai mais barato que um por um.
3. **As peças soltas.** Folhas de seis ingredientes (`pecas-a`, `pecas-b`, `acomp-pecas`, `bebidas-pecas`,
   `sobremesas-pecas`). Mande junto, como referência, a folha dos itens da mesma categoria: os ingredientes saem
   com a mesma cara dos que estão dentro do lanche.
4. **As fotos da casa** (`foto-chapa`, `foto-pao`, `foto-pinhao`, `foto-casa`, `foto-parque`). São as únicas que
   vale trocar por foto de verdade: a chapa, o pão, a fachada e a turma do seu lugar convencem mais que qualquer
   imagem gerada.
5. **Os cartões do mural** não são gerados: são montados com as peças do site (ver "Cartões do mural", abaixo).
6. **O mascote** tem receita própria: `mascote.md`.

## Do arquivo gerado para o site

O `arquivos/fonte/imagens.mjs` converte tudo para o formato e os tamanhos que o site usa. Da raiz do projeto, uma vez:
`npm install -D -E sharp@0.35.5`. Depois, um comando por imagem (os exemplos são os da demo):

| Folha gerada | Comando |
|---|---|
| `hero.png` | `node arquivos/fonte/imagens.mjs hero hero.png` |
| `lanches-a.png` | `node arquivos/fonte/imagens.mjs folha lanches-a.png produtos 2x1 classico,bacon` |
| `lanches-b.png` | `node arquivos/fonte/imagens.mjs folha lanches-b.png produtos 2x1 pinhao,bravo` |
| `lanches-c.png` | `node arquivos/fonte/imagens.mjs folha lanches-c.png produtos 2x1 guria,frango` |
| `acomp.png` | `node arquivos/fonte/imagens.mjs folha acomp.png produtos 2x2 fritas,aneis,polenta,bolinho` |
| `bebidas.png` | `node arquivos/fonte/imagens.mjs folha bebidas.png produtos 4x1 shake-morango,shake-chocolate,mate,soda` |
| `sobremesas.png` | `node arquivos/fonte/imagens.mjs folha sobremesas.png produtos 2x2 brownie,cookie,pudim,banoffee` |
| `pecas-a.png` | `node arquivos/fonte/imagens.mjs folha pecas-a.png pecas 3x2 pao,carne,cheddar,bacon,alface,tomate` |
| `pecas-b.png` | `node arquivos/fonte/imagens.mjs folha pecas-b.png pecas 3x2 cebola-roxa,picles,jalapeno,pinhao,rucula,cogumelo` |
| `acomp-pecas.png` | `node arquivos/fonte/imagens.mjs folha acomp-pecas.png pecas 3x2 batata,anel,molho-rose,maionese-verde,alecrim,limao` |
| `bebidas-pecas.png` | `node arquivos/fonte/imagens.mjs folha bebidas-pecas.png pecas 3x2 morango,morango-meio,chocolate,limao-rodela,hortela,framboesa` |
| `sobremesas-pecas.png` | `node arquivos/fonte/imagens.mjs folha sobremesas-pecas.png pecas 3x2 banana,sorvete,nozes,chocolate-gotas,brownie-peca,doce-de-leite` |
| `foto-chapa.png` (e as outras quatro) | `node arquivos/fonte/imagens.mjs foto chapa foto-chapa.png` |

Os nomes depois da grade vão da esquerda para a direita, de cima para baixo, na ordem em que o prompt pede os itens.
O nome de um item do cardápio é o `id` dele em `src/config.js`; o de uma peça é o que aparece na lista `pecas`.

Imagem solta (uma foto sua, já sem fundo) dispensa a folha:
`node arquivos/fonte/imagens.mjs produto classico meu-lanche.png` e `node arquivos/fonte/imagens.mjs peca tomate tomate.png`.

Confira sempre o resultado: se dois itens da folha encostaram, o corte junta os dois (gere de novo pedindo mais
espaço entre eles); se sobrou fundo, o recorte sai com um quadrado em volta.

## O que adaptar quando o produto é outro

- **Outro lanche:** troque só o parágrafo do item (os ingredientes, de cima para baixo) e mantenha o resto do
  prompt: a câmera de frente, o lanche inteiro, o pão brilhante. É o que deixa a troca de item limpa, sem pulo de
  tamanho nem de ângulo.
- **Outro tipo de comida** (pizza, açaí, pastel, sushi): reescreva a frase do item e a do enquadramento ("visto de
  frente", "visto de cima"), e use o mesmo enquadramento em todos os itens da categoria. As peças soltas viram os
  ingredientes desse prato.
- **Um item, sete vagas:** cada cena tem sete peças em volta do produto, e as vagas 2 e 7 ficam desfocadas, no
  fundo. Um item pode repetir a mesma peça em várias vagas (a demo faz isso). Três ou quatro ingredientes bons
  bastam para uma cena cheia.
- **Fotografou de verdade?** Melhor ainda. Tire o fundo, deixe a luz vindo do mesmo lado em todas e passe pelo
  `imagens.mjs`.

## Cartões do mural

Os seis cartões do rodapé são páginas pequenas montadas com o que o site já tem (as cores, as fontes, o mascote,
os recortes e as fotos): `arquivos/fonte/cartoes.html`. Com `npm run dev` rodando, abra
`http://localhost:5173/arquivos/fonte/cartoes.html`, troque os textos e as imagens e, quando estiver bom,
`node arquivos/fonte/cartoes.mjs` fotografa cada um (o começo do arquivo explica a instalação, que baixa um
navegador). Sem isso, qualquer imagem em pé vira cartão:
`node arquivos/fonte/imagens.mjs mural 1 minha-foto.jpg` (prints dos seus stories, por exemplo).

## Quanto custa

Dezessete imagens de comida e de lugar (doze folhas e cinco fotos). Dentro de uma assinatura que gera imagens, sai
de graça; pela API de um gerador, são centavos de dólar por imagem, poucos reais no total. O mascote, se for refeito
num gerador de vetor, custa mais ou menos o mesmo. Conte com uma ou duas repetições por folha: nem sempre o fundo
vem limpo de primeira.

## Sem gerar nada

O site funciona inteiro com as imagens da demo. O caminho mais curto para a sua marca é trocar os textos e o
cardápio em `src/config.js`, manter as imagens enquanto o cardápio for parecido e ir substituindo aos poucos: uma
imagem trocada não obriga a trocar as outras.
