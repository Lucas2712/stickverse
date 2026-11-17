# Capiá: hamburgueria com mascote, o cardápio em painéis de papel rasgado que sobem um sobre o outro e um seletor que troca o lanche e os ingredientes em volta

## Antes de começar: pergunte

Antes de escrever qualquer código, faça estas perguntas, uma por vez e em linguagem simples (a pessoa pode não ser programadora):

1. **O que você quer fazer com este site?**
   - **Montar a demo como ela é**, para ver funcionando e trocar depois.
   - **Fazer o site da minha hamburgueria** (ou da minha lanchonete, pizzaria, doceria, açaí: qualquer casa com cardápio) com esta estrutura e este movimento.
   - **Usar só algumas peças** (os painéis presos com a borda de papel rasgado, o seletor que troca o item e os ingredientes, o título com os adesivos que se afastam, o mascote que cruza a tela, a faixa de palavras, as fotos que entram com rebote, o mural de cartões no rastro do mouse) num site que já tenho.
2. Se for a casa dela: o nome, a cidade, o horário, o cardápio (as categorias, os itens de cada uma, os ingredientes e duas características curtas de cada item), para onde vai o botão de pedir (WhatsApp, iFood, cardápio digital), as redes e **que material já tem** (logo ou mascote, fotos dos lanches, fotos do lugar). Avise desde já:
   - cada item do cardápio aparece numa **foto recortada, com fundo transparente**, e todas precisam do mesmo ângulo e da mesma luz; sem isso ficam as da demo, ou geram-se novas com as receitas de `arquivos/receitas/`;
   - em volta de cada item flutuam **ingredientes soltos**, também recortados; se o cardápio é de hambúrguer, os trinta da demo servem;
   - o mascote é um **desenho de uma cor só, em quatro poses**; com o logo dela no lugar o site funciona, só perde a graça das poses;
   - o site não mostra preço em lugar nenhum; se ela quiser preço, entra como uma das duas características do item;
   - o formulário do rodapé e os botões de pedir não enviam nada na demo: precisam do link ou do serviço dela.
3. Se forem peças: quais, e onde está o site que vai recebê-las.

Depois, em qualquer caminho, **monte primeiro a demo completa como descrita abaixo** e confira que ela roda: é o caminho testado e fica de referência. Só então aplique a marca ou extraia as peças, seguindo a seção "Personalizar" do guia. Termine com uma lista curta do que ainda é da demo e do que falta a pessoa mandar.

## A demo

Construa a landing page da **Capiá** (marca fictícia), uma hamburgueria de bairro em Curitiba cujo mascote é uma capivara calma, com um hambúrguer equilibrado na cabeça. Leia antes o guia do projeto desta pasta (`CLAUDE.md`, ou `AGENTS.md` no Codex e outros agentes: arquitetura, design system, regras de movimento e do celular, como conferir e como personalizar) e olhe as imagens em `arquivos/conceito/`: são prints do site pronto, o alvo de cada momento, em `-desktop` e `-mobile` (`01-hero`, `02-chame-como-quiser`, `03-faixa`, `04-lanches`, `05-lanches-outro-item`, `06-painel-subindo`, `07-acompanhamentos`, `08-bebidas`, `09-sobremesas`, `10-casa`, `11-mural`, `12-rodape`, `13-menu`).

**Tudo o que o site usa já vem pronto em `arquivos/`:** o `index.html`, o `vite.config.js` (com o plugin que monta as seções, o mascote, a borda rasgada e os painéis do cardápio), o código inteiro em `arquivos/src/` (seções em HTML, as folhas de estilo, os oito módulos de movimento, a marca e o `config.js` com o cardápio) e as imagens em `arquivos/public/`. Use tudo isso como está: não gere imagem nova, não reescreva os módulos e não troque nada por uma versão "mais simples". O trabalho é montar o projeto, instalar as dependências com as versões certas, copiar os arquivos para o lugar e conferir.

A ideia da página: **um cardápio que se folheia como papel de embrulho.** O que impressiona é o cardápio vivo, e ele é o produto:
- Cada categoria (Lanches, Acompanhamentos, Bebidas, Sobremesas) é uma tela inteira de uma cor só, que **fica presa enquanto a seguinte sobe por cima**, com a borda de cima de **papel rasgado**; pelas falhas do rasgo aparece a cor do painel anterior, como uma folha por cima da outra.
- Em cada painel, uma fila de itens em forma de pãozinho, com a miniatura do prato. **Escolher um item apaga a cena em cascata e acende outra**: o prato no meio, sete ingredientes soltos flutuando em volta, dois adesivos com as características e a linha de ingredientes daquele item.
- Em volta disso, uma marca com humor: o título "Chame como quiser," cercado de adesivos com os apelidos do mascote, que se afastam conforme a página rola, enquanto a capivara **cruza a tela de lambreta**; uma faixa de palavras que desliza com a rolagem; fotos em forma de pedra de rio que entram com rebote; e um rodapé em que **mexer o mouse solta cartões** pelo caminho.

Nível de acabamento: site de marca grande de comida. Cores chapadas, um traço só no mascote, nenhuma textura além do papel rasgado; texto calmo e bem-humorado, sem "o melhor da cidade".

---

## Parte 1 — O site

### Marca e tom
- Marca **Capiá** (fictícia; capivara + piá, o "guri" do curitibano), em português do Brasil. Assinatura: "Meu Capiá, minha calma." A casa trabalha no ritmo do bicho: pão do dia, carne moída no dia, lanche montado na hora.
- O mascote tem quatro poses no mesmo traço, cada uma num lugar: **em pé** (o logo, ao lado do nome), **sentado** (o selo redondo "feito na chapa · sem pressa · na calma"), **de lambreta** (a que cruza a tela) e **deitado** (o retrato do rodapé). São desenhos de uma cor só (`src/marca/mascote.js`), que pegam a cor do texto em volta.
- Cores, tiradas do lanche (`src/styles/tokens.css`): `--carvao` `#16130f` (a chapa), `--pao` `#f5eddf`, `--cheddar` `#f8b21b`, `--tomate` `#dc4126`, `--mate` `#3f8040`, mais `--branco` `#fffaf1`. Sobre o carvão, o tomate e o mate usam a versão clara (`--tomate-claro`, `--mate-claro`).
- Tipos (livres para uso comercial, pelo Fontsource): **Bricolage Grotesque** variável em tudo, com peso 800 e a largura apertada nos títulos; **Mr Dafoe** na letra de mão ("minha calma.", a frase sob o título dos apelidos e a marca-d'água dos painéis).
- **Os botões são pãezinhos**: a cúpula em cima, a base mais reta, um lado um nada maior que o outro (`--pao-a`, `--pao-b` e `--pao-c` em `tokens.css`). Nunca uma pílula perfeita e nunca uma elipse. A mesma forma serve ao botão do hero, aos itens do seletor, aos botões de pedir e ao "Enviar". No hover o botão sobe um pouco e a seta anda; no clique ele assenta.
- **O papel rasgado** é um desenho só (`src/marca/borda.js`, sorteio com semente fixa), usado como máscara em todas as passagens de seção.

### 01 — Cabeçalho e hero
- Cabeçalho sobre o hero, que sobe junto com a página (não gruda): o Capiá em pé e o nome; "Cardápio" (abre um suspenso com as quatro categorias), "O Capiá" e "Contato"; no celular, um botão redondo que abre uma gaveta com os mesmos links.
- Hero escuro, tudo em medidas que acompanham a largura da tela: à esquerda, "Meu Capiá," em peso 800 e "minha calma." em letra de mão amarela, os dois inclinados −2,4°, e o botão claro "Ver o cardápio ›", torto −3,6°. À direita, o Clássico da Casa com seis ingredientes soltos em volta (tomate, alface, cheddar, cebola roxa e picles, dois deles desfocados; no celular ficam quatro à vista), cada um subindo, descendo e girando no próprio ritmo (6,6 a 9,8 s por volta); a etiqueta vermelha "Clássico da Casa ›", que leva ao painel de lanches; e o selo redondo com o Capiá sentado. O pé do hero é uma onda da cor do pão, e o lanche passa na frente dela.

### 02 — "Chame como quiser,"
- Seção clara: o título em duas linhas com quatro adesivos de apelido em volta ("Capi", "Seu Capiá", "Capivarão", "O piá"), cada um de uma cor e com a pontinha de balão; a frase em letra de mão "ele sempre deu um jeito de deixar a fome de bom humor."; e o botão "Conheça o Capiá ›".
- Presos à rolagem (no meio da tela tudo está no lugar): os adesivos se afastam do título, cada um para um lado, até uns 45 px por eixo e 10°; e o Capiá cruza a tela de lambreta, da esquerda para a direita (de −106vw a +106vw), com um pulinho de 52 px no meio e o giro indo de +6,2° a −4,8°.

### 03 — Faixa de palavras
- Faixa escura com a borda rasgada em cima e embaixo e duas linhas de palavras grandes e coloridas ("Suculento", "Tostado", "Na chapa"… / "Caseiro", "Fresco", "Dourado"…). As linhas deslizam para a esquerda **conforme a seção atravessa a tela** (14,5vw para cada lado do meio; 30vw no celular): parada a rolagem, param as palavras. Não é um letreiro por tempo.

### 04 — O cardápio em painéis
- Quatro painéis de tela cheia, um por categoria: **Lanches** (amarelo, 6 itens), **Acompanhamentos** (vermelho, 4), **Bebidas** (verde, 4) e **Sobremesas** (escuro, 4). Cada um fica preso no topo (`position: sticky`) e o seguinte sobe por cima; depois de cada painel há um respiro de 56% da altura da tela (32% no celular) em que a página rola e ele fica parado. Atrás do rasgo de cada painel há uma tira da cor do anterior: é ela que aparece pelas falhas, na subida e com o painel já preso.
- Cada painel é um **palco de 1440 × 750** que encolhe ou cresce para caber na largura e na altura da tela (no celular, 390 × 780): o título da categoria; a fila de itens; a cena (a marca-d'água "Capiá" em letra de mão, o prato no meio, sete ingredientes soltos em volta, dois deles desfocados, e dois adesivos de característica); a linha de ingredientes; e o botão "Pedir lanches ›" (ou "acompanhamentos", "bebidas", "sobremesas").
- **A chegada**: enquanto o painel sobe, o prato sobe 132 px e cresce de 0,88 a 1, e o botão sobe 186 px. Os ingredientes soltos derivam com a rolagem (26 a 72 px) e ainda flutuam sozinhos (4,7 a 7,1 s por volta), cada um com o seu jeito.
- **O seletor**: quatro itens à vista. Com mais de quatro (os Lanches), a fila é um laço sem fim com setas, e o item escolhido fica sempre na **segunda casa**, com o anterior à vista; no celular, o escolhido fica no centro, com os vizinhos espiando. Clique, setas, teclado (← →) e arrasto trocam de item; a fila desliza em 410 ms.
- **A troca de cena**: sai em 145 ms, em cascata de 12 ms; trocam as imagens e os textos, já carregados; entra em 440 ms de opacidade e 560 ms crescendo de 0,95 a 1, em cascata de 32 ms: primeiro os ingredientes soltos, depois o prato e, por fim, os adesivos e a linha de ingredientes. Passar o mouse num item já busca as imagens dele. Se a imagem de um item não existe, a cena fica como está, a fila volta ao item da tela e o console diz qual arquivo faltou.
- **As bolinhas** à esquerda (só no computador): uma por painel, numa cápsula translúcida; a do painel da vez fica escura (amarela, no painel escuro), e clicar leva até ele. O painel que fica inteiro coberto pelo seguinte sai do teclado e do leitor de tela (`inert`), para o foco nunca cair onde ninguém vê.

### 05 — A casa ("Deixa a chapa falar por si")
- Seção clara, na escala comum de site: cinco selos em fila (Pão do dia, Carne fresca, Feito na chapa, Pinhão da serra, Sem pressa), o título, um parágrafo e cinco fotos recortadas em forma de pedra de rio, cada uma com uma sombra de cor chapada e um pouco torta; sobre a foto da chapa, o selo redondo do Capiá.
- Selos e fotos entram **presos à rolagem**: cada um começa quando o topo dele passa de 97% da altura da tela e termina em 58%, aparecendo, subindo (112 e 168 px) com um leve rebote e crescendo até o tamanho final, em fila.

### 06 — Mural, recado e rodapé
- Rodapé escuro, com o rasgo no topo. Título "Momentos de calma no @capia.burger" e o rabisco "toca aqui".
- **Com mouse**: mexer o cursor sobre o mural solta cartões no caminho (um a cada 52 px, no máximo um a cada 70 ms); cada um nasce pequeno e torto, assenta e vai apagando devagar enquanto desce (3,8 s de vida, até 22 de uma vez), o que deixa uma cauda de cartões atrás do cursor. Parado, antes do primeiro cartão, uma etiqueta "mexa o mouse" acompanha o cursor. **No celular**: uma pilha de cartões que troca a cada toque.
- O recado: o Capiá deitado num círculo, "Vem pra turma da calma.", o campo de e-mail e o botão "Enviar ›" (na demo só confere o e-mail e agradece). Depois as linhas miúdas e, no pé, **o nome gigante** "meu Capiá. minha calma." de margem a margem, cortado na linha de base; no celular, em duas linhas.

### Rolagem, interações e acessibilidade
- No computador, rolagem suave (Lenis, `lerp` 0,094); no toque, a rolagem é a do aparelho. Tudo o que acompanha a rolagem passa por um ponto só (`src/motion/rolagem.js`), no máximo uma vez por quadro.
- Tudo o que é clicável tem hover (só com mouse), foco visível e estado de clique. O contorno do foco fica fora do elemento, então a cor dele vem da superfície (`--foco`: amarelo sobre o escuro, carvão sobre o claro e o amarelo, branco sobre o vermelho e o verde), nunca da letra do botão. O seletor é uma lista de abas de verdade (`role="tablist"`), com as setas do teclado. O suspenso "Cardápio" abre ao encostar o mouse (clicar não fecha) e, pelo teclado, com Enter.
- `prefers-reduced-motion`: sem rolagem suave, sem paralaxe, sem flutuação; a troca de item vira corte seco.

---

## Parte 2 — Como construir (stack)

- **Node 20.19 ou mais novo** (na linha 22, 22.12 ou mais novo): é o que o Vite 8 pede. Confira com `node -v` antes de instalar; se for mais antigo, avise a pessoa em vez de trocar a versão do Vite.
- **Vite sem framework**: HTML, CSS e JS puros. Crie o arquivo `package.json` escrevendo-o direto (não use `npm init` nem um template do `npm create`, que trazem campos e arquivos a mais), com `"type": "module"`, `"private": true` e os scripts `"dev": "vite"`, `"build": "vite build"` e `"preview": "vite preview"` (nome e versão à sua escolha), e instale com versão travada, escrito por extenso (`npm install`, não `npm i`), um comando por linha:
  - `npm install -E lenis@1.3.27 @fontsource-variable/bricolage-grotesque@5.3.0 @fontsource/mr-dafoe@5.3.0`;
  - `npm install -E -D vite@8.3.8` (dependência de desenvolvimento).
- **Copie os arquivos** com `cp` (as pastas inteiras de uma vez, um comando por linha, sem encadear com `&&`: em sessões com permissões restritas, comando composto pede aprovação):

  | de | para |
  |---|---|
  | `arquivos/index.html` | a raiz |
  | `arquivos/vite.config.js` | a raiz (o plugin `secoes` monta a página: troca cada `<!-- @secao nome -->` por `src/sections/nome.html`, escreve o mascote, a borda rasgada e os painéis do cardápio a partir do `src/config.js`; `base: './'`: o `dist/` abre em qualquer pasta da hospedagem) |
  | `arquivos/src/` (a pasta inteira) | `src/` |
  | `arquivos/public/` (a pasta inteira) | `public/` |

  Os comandos, da raiz do projeto: `cp arquivos/index.html .`, `cp arquivos/vite.config.js .`, `cp -R arquivos/src src` e `cp -R arquivos/public public` (sem barra no fim do nome da pasta). Copie antes de existir uma pasta `src/` ou `public/` na raiz (senão o `cp -R` cria `src/src/`); se alguma já existir de uma tentativa anterior, apague-a antes de copiar. A pasta `arquivos/` continua onde está: não entra no site nem no `dist/`. (No Windows sem WSL nem Git Bash, use os equivalentes do PowerShell: `Copy-Item` e `Copy-Item -Recurse`.)

  Confira depois da cópia: `src/main.js` e `src/config.js`; `src/motion/` com 8 módulos (`apelidos.js`, `cardapio.js`, `casa.js`, `faixa.js`, `mural.js`, `rolagem.js`, `seletor.js`, `topo.js`); `src/marca/` com 3 (`borda.js`, `mascote.js`, `paineis.js`); `src/sections/` com 6 HTML (`topo`, `hero`, `apelidos`, `faixa`, `casa`, `rodape`; os painéis do cardápio não têm HTML próprio: o `paineis.js` os escreve a partir do `config.js`); `src/styles/` com 10 folhas (`site.css`, `tokens.css`, `base.css` e sete de página: `topo`, `hero`, `apelidos`, `faixa`, `cardapio`, `casa` e `rodape`); `public/favicon.svg`; e `public/img/` com 83 imagens (`produtos/` com 37: o `hero.webp` e, para cada um dos 18 itens, o recorte e a miniatura `-p`; `pecas/` com 30; `fotos/` com 10, as cinco fotos em duas larguras; `mural/` com 6).
- **CSS numa folha só, por `<link>`**: o `arquivos/index.html` já traz, no `<head>`, a cor de fundo da primeira tela inline, o pré-carregamento das duas fontes do hero e depois `<link rel="stylesheet" href="/src/styles/site.css">` (as fontes, o CSS do Lenis, os tokens e as seções por `@import`). Mantenha assim e nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página aparece crua por um instante a cada recarregamento.
- **O cardápio mora em `src/config.js`**: o `vite.config.js` lê esse arquivo para escrever o HTML dos painéis na hora do build (a página já chega com o cardápio escrito, sem depender do JS), e o site lê o mesmo arquivo para trocar a cena. Não duplique esses dados em outro lugar. A cada montagem o terminal avisa (`[cardápio] …`) se o `config.js` cita uma imagem que não está em `public/img/`: na demo, não deve aparecer aviso nenhum.
- Leia o cabeçalho dos módulos antes de mexer em qualquer coisa: `src/main.js` liga a rolagem, o cabeçalho, os adesivos, a faixa, os seletores, os painéis, a casa e o mural, nessa ordem. O mapa de cada arquivo está no guia.
- `arquivos/conceito/` e `arquivos/receitas/` não entram no site; `arquivos/fonte/` só serve para converter imagens novas e refazer os cartões do mural (ver o guia).
- No fim:
  - `npm run build` passa sem erro e sem aviso de arquivo faltando;
  - `npx vite preview` serve o site (o comando não termina sozinho: rode em segundo plano, pegue o endereço na saída, em geral `http://localhost:4173/`, e derrube no fim): o hero com os ingredientes flutuando, o console limpo, e recarregar nunca mostra a página sem estilo;
  - rolando devagar e depressa: os adesivos se afastam do título e a lambreta cruza a tela; as palavras da faixa deslizam e param junto com a rolagem; cada painel fica preso e o seguinte sobe por cima com a borda rasgada, e pelas falhas do rasgo só aparece a cor do painel anterior (no primeiro, a dele mesmo); o prato sobe e cresce na chegada; as bolinhas acompanham o painel da vez; na casa, selos e fotos entram com rebote e ficam inteiros;
  - com o mouse e o teclado: as setas e o clique num item trocam a cena (o prato, os sete ingredientes, os dois adesivos e a linha de ingredientes) sem imagem quebrada; passando do último lanche, a fila volta ao primeiro sem pulo; ← e → trocam de item com o foco numa aba; as bolinhas levam ao painel; "Cardápio" abre o suspenso ao passar o mouse (e com Tab e Enter), e clicar nele não fecha; no rodapé, mexer o mouse solta os cartões e eles somem sozinhos; o recado recusa um e-mail torto e agradece um certo; Tab, do começo ao fim da página, mostra o contorno do foco em todas as paradas, sempre numa cor que se vê sobre o fundo;
  - nada rola para o lado no celular (390 × 844, e também numa tela baixa, 390 × 664): o botão redondo abre a gaveta do menu, o item escolhido fica no centro da fila, as bolinhas somem, a casa vira duas colunas, o mural vira a pilha de cartões e o nome gigante do pé cabe inteiro, em duas linhas;
  - o `dist/` sobe em qualquer hospedagem estática, inclusive numa subpasta. Confira com um servidor estático de verdade, não com o `vite preview` (ele devolve o `index.html` para qualquer caminho e esconde arquivo faltando): da raiz do projeto, rode `python3 -m http.server 8765` em segundo plano (ou outra porta, se essa estiver ocupada; no Windows, `python`) e abra `http://localhost:8765/dist/`. Ali o site já está numa subpasta. Confira o console sem nenhum 404, o hero completo e, depois de trocar de item em cada painel, as imagens de todos. Um `ERR_CONNECTION_RESET` solto é o servidor simples do Python engasgando com muitos pedidos de uma vez, não arquivo faltando: recarregue e siga; 404 é que não pode haver. Depois derrube o servidor;
  - as conferências de tela (rolagem, mouse e teclado, celular) pedem um navegador. Se você não tiver como ver a página, não dê por conferido: abra o site para a pessoa e peça que ela olhe estes pontos, um por vez: (1) os ingredientes do hero se mexem; (2) rolando, a capivara cruza a tela de lambreta e os apelidos se afastam do título; (3) cada painel do cardápio sobe por cima do anterior, com a borda rasgada; (4) clicar num item da fila troca o prato, os ingredientes em volta e os adesivos; (5) no rodapé, mexer o mouse solta os cartões; (6) no celular, nada fica cortado nem escorrega para o lado.
