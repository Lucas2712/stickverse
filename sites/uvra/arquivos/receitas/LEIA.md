# Receitas do filme e das garrafas

O filme da Uvra são nove clipes de 5 segundos, encadeados por onze quadros-chave pintados um a um. As garrafas da vitrine são três pinturas no mesmo estilo. Tudo foi gerado por IA a partir destas receitas. Use-as para refazer uma peça, mudar a história ou pintar os rótulos de outra vinícola.

## O que tem aqui

- `quadros/`: os onze quadros-chave do filme (`k0` a `k10`), cada um com a imagem (`.jpg`) e o prompt (`.prompt.txt`). A foto do hero é a `k0-galeria-escura` (a `k0-galeria` com o cone de luz do topo escurecido).
- `clipes/`: o prompt de cada clipe (`c1` a `c9`).
- `garrafas/`: a imagem e o prompt de cada garrafa da vitrine.

## A ordem

1. **O estilo.** Todo prompt de quadro-chave termina com o mesmo parágrafo de estilo ("Style: the same 19th-century academic oil painting..."). Ele é o que mantém as onze imagens no mesmo mundo: copie-o igual em todos.
2. **Os quadros-chave, um por vez, em sequência.** Cada um leva o anterior como imagem de referência ("Image 1" no prompt); o `k10` leva também o `k0`, para o filme voltar à mesma galeria. Formato 16:9 (1920 × 1080). Ponha o assunto no terço do meio da largura: o celular mostra só uma faixa em pé do centro. Nas cenas que levam frase, deixe um vazio de propósito num terço da imagem (céu liso, parede ou fundo escuro): é ali que o texto vai morar.
3. **Os clipes.** Cada clipe vai de um quadro-chave ao seguinte, com os dois como quadro inicial e final: 5 s, 1080p, sem som, 16:9. O prompt descreve um movimento de câmera só e termina com "One continuous camera move, no cuts, no flash, no white frames, no zoom blur, no text, no letters, no logos."

   | clipe | quadro inicial → final |
   |---|---|
   | c1 | k0-galeria-escura → k1-dentro |
   | c2 | k1-dentro → k2-vinhedo |
   | c3 | k3-maos → k4-cesto (começa num corte seco) |
   | c4 | k4-cesto → k5-mosto |
   | c5 | k5-mosto → k6-adega |
   | c6 | k6-adega → k7-taca |
   | c7 | k7-taca → k8-natureza-morta |
   | c8 | k8-natureza-morta → k9-banquete |
   | c9 | k9-banquete → k10-galeria-final |

4. **Os quadros do site.** Salve os clipes como `arquivos/filme/c1.mp4`, `c2.mp4`... (1916 × 1080 ou 1920 × 1080, 24 fps) e rode `npm run quadros` no projeto. Sem `curvas.json`, cada clipe anda em ritmo linear na rolagem.
5. **O site.** Ajuste a lista `CAPITULOS` em `src/motion/filme.js` (um capítulo por clipe; `emenda: true` onde o clipe começa no quadro final do anterior) e as frases de cada cena no lugar e na janela em que a imagem tem vazio (veja "O filme" e "Personalizar" no guia).

## Ferramentas e custo

- **Quadros-chave e garrafas:** qualquer gerador de imagem que aceite imagem de referência.
- **Clipes:** qualquer gerador de vídeo que aceite quadro inicial e quadro final ("first and last frame"), em 1080p e 5 s.
- **Custo:** onze imagens e nove clipes de vídeo. O vídeo é o que pesa: some o preço de nove clipes de 5 s em 1080p no serviço escolhido antes de começar. Gere um clipe, confira, e só então siga com os outros.

## O que adaptar

- **Outra paisagem ou outro produto:** troque o assunto de cada prompt (o vinhedo, a prensa, a adega, a taça, o banquete) e mantenha o parágrafo de estilo, a câmera e o encadeamento.
- **Os rótulos de outra vinícola:** nos prompts de `garrafas/`, descreva o rótulo de verdade (as cores, a imagem, o formato da garrafa) no lugar do inventado. Pintura mostra o rótulo, não a garrafa: para vender, a foto da garrafa real é melhor.
- **Sem gerar nada:** o filme da demo serve para qualquer vinícola, porque não mostra marca. Troque só os textos.
