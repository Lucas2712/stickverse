# O mascote

O Capiá é uma capivara de traço único, olho meio fechado e um hambúrguer equilibrado na cabeça. São quatro poses no
mesmo traço: **em pé** (o logo), **sentado** (o selo redondo), **deitado** (o retrato do rodapé e um cartão do mural)
e **de lambreta** (a que atravessa a tela).

No site, cada pose é um desenho de uma cor só, guardado em `src/marca/mascote.js` como um caminho de SVG (`d`) e a
caixa dele (`caixa`, o `viewBox`). A cor vem do texto em volta, então o mesmo desenho serve claro e escuro. Os SVG de
origem estão em `arquivos/fonte/mascote/`, para abrir num editor de vetor.

## Para trocar pelo seu

Qualquer desenho de uma cor só serve: o seu logo, um mascote que você já tem, um desenho feito à mão e vetorizado.

1. Salve cada pose como SVG com **um caminho preenchido só** (no editor de vetor: converter o traço em contorno e
   unir tudo).
2. Em `src/marca/mascote.js`, troque o `d` e a `caixa` da pose pelo `d` e pelo `viewBox` do seu arquivo.
3. Mantenha as quatro chaves (`em-pe`, `sentado`, `deitado`, `lambreta`). Só tem um desenho? Repita o mesmo nas
   quatro: o site não quebra, só perde a graça das poses.
4. A da lambreta precisa **olhar para a direita**: é para lá que ela atravessa a tela.

Proporções que encaixam sem mexer no CSS (largura : altura): em pé, um pouco mais largo que alto (perto de 6:5);
sentado, quase quadrado, um nada mais alto; deitado, bem largo (perto de 7:4); a lambreta, um pouco mais larga que
alta (perto de 6:5), com os riscos de velocidade à esquerda.

## Como este foi feito

Num gerador de vetor (o que desenha em SVG), numa conversa só, para o personagem não mudar de uma pose para a outra.
Os prompts, na ordem:

1. **O personagem, de lado** (saíram três poses de uma vez: em pé, sentado e deitado)

   > Monoline style with one bold uniform stroke weight. Draw the whole capybara from the side, facing right,
   > standing still on four short legs, so it is instantly recognizable as a capybara and not a pig or a bear: a long
   > barrel-shaped body like a loaf of bread, no tail, a big rectangular head with a blunt squared-off nose, a flat
   > forehead, one tiny rounded ear set far back on top of the head, one relaxed half-closed sleepy eye drawn as a
   > short arc, one small nostril dot at the top front of the nose and a short calm mouth line. Balanced on top of its
   > head sits a tiny simple hamburger (bun, patty, bun as three stacked rounded shapes). Pure black strokes
   > (#000000), rounded caps and joins, transparent background, no fills, no shading, very few lines, logo-level
   > simplicity. Centered in a square canvas with generous padding. No text, no ground line.

   De frente, uma capivara minimalista não se reconhece (sai com cara de porquinho): de lado, sim.

2. **De lambreta**

   > Same capybara character, same monoline style and the same bold uniform stroke weight: now it rides a small
   > classic delivery scooter towards the right, seen from the side. The capybara sits upright on the seat with its
   > front paws on the handlebar, same blocky head with the blunt nose, tiny ear, relaxed half-closed sleepy eye and
   > calm mouth, and the tiny hamburger still balanced on top of its head. Behind the seat there is a square delivery
   > box. Two simple round wheels. Five or six horizontal speed lines of different lengths trail behind the scooter on
   > the left side, to show it is moving fast while the capybara stays totally calm. Pure black strokes (#000000),
   > rounded caps and joins, transparent background, no fills, no shading, few lines, clean and simple. Wide landscape
   > composition, the scooter on the right two thirds and the speed lines on the left third. No text, no ground line.

Para outro bicho ou outro personagem, troque a descrição do corpo e mantenha o resto: traço de uma espessura só,
pontas redondas, preto puro, sem preenchimento. É esse traço que faz as quatro poses parecerem da mesma mão.
