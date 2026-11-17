# Guia do projeto — Capiá

(Salve como `CLAUDE.md` na raiz do projeto se você usa o Claude Code, ou como `AGENTS.md` se usa o Codex, o Cursor ou outro agente. O conteúdo é o mesmo.)

Landing page da Capiá, uma hamburgueria fictícia de Curitiba que tem uma capivara de mascote. Vite sem framework, Lenis, fontes Bricolage Grotesque e Mr Dafoe. **O cardápio é uma pilha de painéis de tela cheia, um por categoria, que sobem um sobre o outro com a borda de papel rasgado; em cada um, um seletor troca o prato, os ingredientes soltos em volta e as características.** O código já vem pronto em `arquivos/src/`, a página no `arquivos/index.html` e as imagens em `arquivos/public/`: o trabalho é montar, conferir e, depois, personalizar. A régua é site de marca grande de comida: se algo parece "ok", ainda não está pronto.

## Arquitetura
- **Uma seção por arquivo.** O `index.html` só tem o `<head>` e a ordem das seções (`<!-- @secao hero -->` etc.); o plugin `secoes` do `vite.config.js` monta a página no dev e no build:

  | marca no HTML | vira |
  |---|---|
  | `<!-- @secao nome -->` | o conteúdo de `src/sections/nome.html` |
  | `<!-- @paineis -->` | os painéis do cardápio, escritos por `src/marca/paineis.js` a partir do `src/config.js` |
  | `<!-- @faixa -->` | as duas linhas de palavras da faixa (lista `FAIXA` do `config.js`) |
  | `<!-- @menu-cardapio classe -->` | os links das categorias (no suspenso do cabeçalho e na gaveta do celular) |
  | `<!-- @mural-pilha -->` | os cartões da pilha do mural no celular (lista `MURAL` do `config.js`, a mesma do rastro do mouse) |
  | `%marca:campo%` | um dado de `MARCA` (`%marca:cidade%`, `%marca:horario%`, `%marca:instagram%`…) |
  | `<!-- @marca -->` | as quatro poses do mascote, como símbolos de SVG (`src/marca/mascote.js`) |
  | `<!-- @borda -->` | a variável `--borda`, a máscara do papel rasgado (`src/marca/borda.js`) |
  | `%caixa:pose%` | o `viewBox` da pose (para `<svg viewBox="%caixa:sentado%"><use href="#capi-sentado"/></svg>`) |
- **O que é da marca mora em `src/config.js`**: nome, razão, cidade, horário, @ e o link do pedido (`MARCA`), o cardápio inteiro (`CARDAPIO`: categorias, itens, ingredientes, características e as sete peças de cada cena), as palavras da faixa (`FAIXA`) e os cartões do mural (`MURAL`). O build lê esse arquivo para escrever os painéis (a página já chega com o cardápio escrito) e o site lê o mesmo arquivo para trocar a cena. Os textos das outras seções, e as frases que levam o nome ("Meu Capiá,", "Conheça o Capiá"), ficam escritos nos HTML de `src/sections/`.
- **O terminal avisa quando falta imagem**: a cada montagem (no dev e no build) o `vite.config.js` confere se todo prato, miniatura, peça e cartão citado no `config.js` existe em `public/img/`, e se cada item tem sete peças. O aviso começa com `[cardápio]`. No navegador, um nome errado não quebra nada: a cena só não troca, e o console diz o arquivo.
- **O CSS é uma folha só**, `src/styles/site.css` (por `@import`, nesta ordem: as fontes, o CSS do Lenis, `tokens.css`, `base.css` e uma folha por seção), ligada por `<link>` no `<head>`. Antes dela, inline: a cor de fundo da primeira tela, a máscara da borda e o pré-carregamento das duas fontes do hero. Nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página pinta crua por um instante a cada recarregamento.
- **Módulos** (`src/motion/`; cada um explica o que faz no cabeçalho, e os números ficam em constantes com nome no começo do arquivo):

  | arquivo | o que faz |
  |---|---|
  | `src/main.js` | liga tudo, nesta ordem: rolagem, cabeçalho, adesivos, faixa, seletores, painéis, casa e mural |
  | `rolagem.js` | o Lenis (suaviza a roda do mouse; o dedo fica com a rolagem do aparelho) e o ponto único da rolagem: cada módulo registra uma função em `naRolagem()` e ela roda no máximo uma vez por quadro. Também `rolaPara()`, `trava()` e `solta()` |
  | `topo.js` | o suspenso "Cardápio" (mouse, teclado e toque) e a gaveta do menu no celular |
  | `apelidos.js` | os adesivos que se afastam do título (`FORCAS`) e a lambreta que cruza a tela (`VOO`) |
  | `faixa.js` | as duas linhas de palavras que deslizam com a rolagem (`BASES`, `ANDA`) |
  | `seletor.js` | a fila de itens de cada painel (laço sem fim, setas, teclado, arrasto) e a troca da cena (`TROCA`); as imagens de cada item são baixadas e decodificadas uma vez só |
  | `cardapio.js` | os painéis presos: a bolinha da vez (`LINHA`) e a cor dela (`data-cor`), a chegada do prato e do botão (`CHEGADA`), os ingredientes soltos, que derivam com a rolagem e flutuam (`JEITOS`, um jeito por vaga), e o `inert` do painel que ficou inteiro coberto |
  | `casa.js` | selos e fotos que entram presos à rolagem, com rebote (`COMECA`, `TERMINA`, `PASSA`, `SELOS`, `FOTOS`) |
  | `mural.js` | o rastro de cartões no mouse (e a etiqueta "mexa o mouse", que aparece também para quem chega rolando com o mouse parado), a pilha do celular e o recado do rodapé |
- **A marca** (`src/marca/`): `mascote.js` (as quatro poses), `borda.js` (o desenho do papel rasgado, sorteado com semente fixa: sai sempre igual) e `paineis.js` (o HTML dos painéis, da faixa e do menu).

## Design system
- **Cores** (`tokens.css`), tiradas do lanche: `--carvao` `#16130f`, `--carvao-2`, `--pao` `#f5eddf`, `--branco` `#fffaf1`, `--cheddar` `#f8b21b`, `--tomate` `#dc4126`, `--mate` `#3f8040`; `--tomate-claro` e `--mate-claro` para letra sobre o carvão. Cada painel escolhe a cor pela classe (`painel--cheddar`, `--tomate`, `--mate`, `--carvao`), que vem do campo `cor` da categoria no `config.js`, e define ali as cores do texto, dos itens e do item escolhido.
- **Tipos**: Bricolage Grotesque variável (`--fonte`: peso 800 e largura apertada, `'wdth' 88–94`, nos títulos; 600–700 no resto) e Mr Dafoe (`--fonte-mao`, só na letra de mão).
- **Foco**: o contorno fica **fora** do elemento, sobre o fundo da seção. Por isso a cor dele vem da superfície (`--foco`), nunca da letra do botão: amarelo sobre o escuro (cabeçalho, hero, rodapé, painel `carvao`), carvão sobre o claro e o amarelo, branco sobre o vermelho e o verde. Seção nova com fundo próprio define o seu `--foco`.
- **Formas**:
  - **o botão é um pãozinho** (`--pao-a`, `--pao-b`, `--pao-c`: cúpula em cima, base mais reta, um lado um nada maior). Os raios são em `em`: acompanham a letra. Botão novo usa a classe `botao`; nunca `border-radius` em porcentagem (vira elipse);
  - **o adesivo** (apelidos, características, selos): retângulo de cantos desiguais, com a pontinha de balão;
  - **o papel rasgado**: a máscara `--borda`. `.rasgo--topo` sobe por cima da seção de cima na cor desta; `.rasgo--pe` fica no pé, na cor da seção seguinte; nos painéis o rasgo fica **dentro** do topo (`.painel__borda`), com uma tira da cor do painel anterior por trás (`--cor-de-tras`, escrita pelo `paineis.js`): é ela que aparece pelas falhas, como uma folha por cima da outra;
  - **a pedra de rio** das fotos: três `clipPath` em `src/sections/casa.html`.
- **Escala**: duas réguas. As **cenas** (hero, "Chame como quiser", painéis) acompanham a tela: o hero e os apelidos em `cqw` da própria tela (que para de crescer em 1920 px), os painéis na unidade `--u` (1 px num palco de 1440 × 750; no celular, 390 × 780). As **seções comuns** (a casa) usam `--su`, a escala de site: título de 58 px, corpo de 18, no celular 38 e 16.

## Regras de movimento
- **Os números moram em constantes com nome, no começo de cada módulo.** Para afinar um movimento, mexa ali; não espalhe número novo pelo código.
- **O que acompanha a rolagem não usa tempo, e o que usa tempo não acompanha a rolagem.** Adesivos, lambreta, faixa, chegada do prato, deriva dos ingredientes e a entrada da casa são função da posição da página (parou a rolagem, parou o movimento). A troca de item, o deslizar da fila e a vida dos cartões do mural são por tempo.
- **Tudo passa por `naRolagem()`**: nada de `addEventListener('scroll')` solto nem de laço de `requestAnimationFrame` novo para ler a rolagem. Só escreva `transform`, `translate`, `scale`, `rotate` e `opacity` (por variável CSS), nunca `top`, `left`, `width` ou `height` a cada quadro.
- **Painéis**: o empilhamento é do CSS (`position: sticky; top: 0` e `z-index` crescente). Não troque por `position: fixed` nem prenda a página com JS. O respiro depois de cada painel é a `.cardapio__folga`: a altura dela é o tempo que o painel fica parado. Painel inteiro coberto pelo seguinte fica `inert` (o foco do teclado não pode cair num botão que ninguém vê); não tire.
- **As cores do cardápio saem do `config.js`**, não do CSS: a classe do painel (`painel--<cor>`), a tira atrás do rasgo, o fundo do cardápio e o pé da faixa de palavras (`--primeiro-painel`, a cor da primeira categoria) e a bolinha da vez (`data-cor`). Trocar a cor ou a ordem das categorias não pede mexer em folha de estilo.
- **A cena tem sete vagas** (`.cena__peca--1` a `--7`, posições em `cardapio.css`); as vagas 2 e 7 são as desfocadas. Um item do cardápio escolhe sete peças, uma por vaga.
- **Troca de item**: as imagens novas são baixadas e decodificadas **antes** de a cena apagar (`carrega()` em `seletor.js`); por isso a cena nunca acende com imagem pela metade. Não troque o `src` direto.
- **Laço do seletor**: com mais de quatro itens, a fila tem cópias dos itens nas duas pontas; depois de deslizar até uma cópia, ela volta sem animação para o item de verdade (`normaliza()`). As cópias ficam fora do teclado e do leitor de tela.
- `prefers-reduced-motion`: sem Lenis, sem paralaxe, sem flutuação; as trocas viram corte seco. Qualquer movimento novo respeita `reduzido` (exportado por `rolagem.js`).

## Celular: regras que não se quebram
- **Nunca rolar para o lado**, em nenhum momento (menu aberto, lambreta passando, cartão girado). Se algo vazar, conserte a origem; `overflow-x: clip` no `html` e no `body` é só a rede de segurança (`clip`, não `hidden`, que quebra o `sticky` dos painéis).
- **No toque, a rolagem é a do aparelho**: o Lenis fica sem `syncTouch`, e nenhum `scrollTo` roda enquanto o dedo ou a inércia rolam (as bolinhas, que usam `rolaPara()`, não existem no celular).
- **Alturas em `svh`**, nunca `100vh` nem `dvh` nas seções: a barra do Safari some e volta durante a rolagem, e o que estiver em `dvh` muda de tamanho no meio do caminho. Os painéis têm `100svh`.
- **Imagens**: tudo fora da primeira tela com `loading="lazy"` e `decoding="async"`, sempre com `width` e `height` (no hero, as medidas do arquivo; nos painéis a caixa é quadrada e a imagem se ajusta dentro); só a do hero tem `fetchpriority="high"`. O site abre com cerca de 1 MB; as imagens dos painéis chegam quando eles se aproximam. As cópias do laço do seletor nascem num documento à parte (`forno`, em `seletor.js`) justamente para as miniaturas não baixarem todas na abertura: `cloneNode` direto na página ignora o `loading="lazy"`.
- Composição própria: o cabeçalho com o botão redondo e a gaveta; o hero com o lanche embaixo e o texto em cima; o painel num palco em pé (390 × 780), com o item escolhido no centro da fila e os vizinhos espiando, sem as bolinhas; a casa em duas colunas; o mural como uma pilha de cartões que troca no toque; o nome gigante do pé em duas linhas, cabendo inteiro na largura.
- Hover só com mouse (`@media (hover: hover)`); alvos de toque de 44 px (a área clicável pode crescer com `::after` sem mudar o desenho); campo de formulário com fonte de 16 px.
- Conferir em 390 × 844 e numa tela baixa (390 × 664, o iPhone com as barras do Safari): no hero, o tomate e a alface nunca ficam atrás do botão.

## Como checar
- `npm run build` sem erro e sem aviso de arquivo faltando.
- `npx vite preview`: o hero com os ingredientes flutuando; recarregar nunca mostra a página crua; console limpo.
- Rolando de cima a baixo, devagar e depressa: cada cena faz o que o prompt descreve; entre dois painéis nunca aparece faixa de outra cor; a bolinha destacada é sempre a do painel da vez.
- Mouse e teclado: setas, clique num item, ← e → numa aba, as bolinhas, o suspenso do cabeçalho (abre ao encostar; clicar não fecha), o rastro do mural, o recado. Tab do começo ao fim: o contorno aparece em todas as paradas, numa cor que se vê sobre o fundo, e nunca num painel coberto.
- Depois de mexer no `config.js`: nenhum aviso `[cardápio]` no terminal, e cada item troca a cena. Se um item fica marcado por um instante e a cena não troca, é nome errado de prato ou de peça: o console diz o arquivo.
- Celular nos dois tamanhos e o `dist/` numa subpasta, com um servidor estático de verdade (o prompt diz como): sem 404.

## Personalizar

Vale para qualquer mudança, agora ou depois.

### As três perguntas
1. É a demo, a casa da pessoa, ou peças soltas?
2. Que material ela já tem (logo ou mascote, o cardápio com ingredientes, fotos dos pratos, fotos do lugar, o link de pedido, as redes) e o que falta?
3. O que ela quer manter da demo (os quatro painéis, os ingredientes flutuando, os apelidos e a lambreta, a faixa, as fotos, o mural)?

### O que muda e onde

| o quê | onde | precisa de material novo? |
|---|---|---|
| Nome, cidade, horário, @ | `MARCA` em `src/config.js`: `nome` (a marca-d'água dos painéis e o ©), `razao`, `cidade` e `horario` (a linha miúda do rodapé) e `instagram` (o título do mural). O nome escrito à mão: `topo.html` (o logo, no cabeçalho e na gaveta, e os rótulos de acessibilidade), `hero.html` (o título e o texto para leitor de tela), `apelidos.html` (os adesivos e o botão), `casa.html` (o parágrafo), `rodape.html` (o nome gigante e os rótulos das redes), o `<title>` e a `description` do `index.html`, e os cartões do mural | não. O nome gigante do pé é medido: com outra frase, ajuste o tamanho (ver "Regras ao trocar") |
| Para onde vai o "Pedir" | `MARCA.pedido` em `config.js` (hoje `#contato`, o rodapé) | o link do WhatsApp (`https://wa.me/55...`), do iFood ou do cardápio digital |
| Categorias do cardápio | os blocos de `CARDAPIO`: `id` (vira a âncora e o link do menu), `titulo`, `cor` (`cheddar`, `tomate`, `mate` ou `carvao`) e `itens`. Pode ter de um a seis painéis; tirar um é apagar o bloco, e a ordem e as cores podem mudar à vontade (o fundo, o pé da faixa, o rasgo e as bolinhas acompanham) | não |
| Itens | em cada categoria: `id`, `nome`, `linha` (a segunda linha do item na fila, curta), `ingredientes` (a frase sob a cena), `selos` (as duas características, curtas) e `pecas` (sete nomes, um por vaga) | o recorte do prato (`public/img/produtos/<id>.webp` e a miniatura `<id>-p.webp`) e as peças que ainda não existem |
| Ingredientes soltos | `public/img/pecas/<nome>.webp`; o nome é o que vai na lista `pecas` | um recorte por ingrediente novo |
| Hero | `hero.html`: o título, a frase, o botão, a etiqueta, os seis ingredientes (`hero__peca--1` a `--6`) e a imagem `produtos/hero.webp`. Trocou uma imagem daqui? Acerte o `width` e o `height` dela no HTML com as medidas do arquivo novo | o recorte do prato principal |
| Apelidos | `apelidos.html`: o título, os quatro adesivos, a frase e o botão. A posição de cada adesivo é `--t` e `--l` em `apelidos.css` | não. Texto mais comprido pede outra posição: confira no computador e no celular |
| Faixa de palavras | `FAIXA` em `config.js` (duas linhas, sete palavras cada) | não |
| A casa | `casa.html`: os cinco selos, o título, o parágrafo e as cinco fotos | as fotos do lugar (3:2) |
| Mural | `MURAL` em `config.js` (a lista serve ao rastro do mouse e à pilha do celular) e as imagens `public/img/mural/01.webp`…; o título em `rodape.html` e o @ em `MARCA.instagram` | os cartões (9:16) |
| Recado e rodapé | `rodape.html` (título, linhas miúdas, links, redes) e o envio em `src/motion/mural.js` (hoje só confere o e-mail) | o serviço de e-mail ou o link dela |
| Mascote | `src/marca/mascote.js` (o `d` e a `caixa` de cada pose) | o desenho dela, numa cor só (`arquivos/receitas/mascote.md`) |
| Cores e fontes | `tokens.css` (cor nova de painel: uma variável ali, uma classe `painel--<nome>` em `cardapio.css` com as cores do texto e dos itens, e o `--foco` dela); a cor do fundo inline e o `theme-color` no `index.html`; os `@import` das fontes em `site.css` e os dois `preload` do `index.html` | não |

### O cardápio de outra casa
- **Menos de quatro categorias**: apague os blocos. Com uma só, os painéis deixam de empilhar e a seção vira uma tela; funciona, mas perde o efeito. Duas já dão a subida de um sobre o outro.
- **Categoria com até quatro itens**: a fila fica parada, sem setas, no computador. **Com mais de quatro**: vira o laço com setas. No celular, sempre laço.
- **Nomes compridos**: o nome do item cabe em duas linhas na fila; `linha` fica em uma. Acima de uns 18 caracteres por linha, encurte.
- **Um prato que não é hambúrguer** (pizza, açaí, pastel, sushi, bolo): a estrutura é a mesma. Troque o recorte do prato e os ingredientes soltos; se o prato é visto de cima, use o mesmo ângulo em toda a categoria. Os painéis `mate` e `carvao` já mostram como bebida alta e sobremesa se comportam na cena.
- **Preço**: o site não tem campo de preço de propósito (cardápio muda de preço toda hora). Se a pessoa quiser, o preço entra como um dos dois `selos` do item ("R$ 32") ou no fim da `linha`.

### Material da pessoa

Para cada imagem, do mais simples ao mais trabalhoso: (1) manter a da demo; (2) usar a foto dela, recortada; (3) gerar com os prompts de `arquivos/receitas/` (o `LEIA.md` dá a ordem, o que vai com referência e o comando de cada folha). Para converter qualquer imagem nova, da raiz do projeto: uma vez `npm install -D -E sharp@0.35.5`, depois `node arquivos/fonte/imagens.mjs` (o começo do arquivo lista os modos: `produto`, `hero`, `peca`, `foto`, `mural` e `folha`). Ele grava em `public/img/` no formato, no tamanho e com o nome que o site já usa.

- **Toda imagem nova passa pelo `imagens.mjs`.** Nunca solte um PNG grande direto em `public/img/`: um recorte de 3 MB por item deixa a troca de cena lenta, no celular principalmente.
- **Pratos** (`produtos/`): recorte em **fundo transparente**, o prato inteiro, visto de frente e levemente de cima, a luz vindo do mesmo lado em todos. É isso que deixa a troca de item limpa. Foto com fundo fica com um quadrado em volta: tire o fundo antes.
- **Ingredientes** (`pecas/`): recortes pequenos, em fundo transparente, meio de cima. Três ou quatro bons por categoria enchem as sete vagas (um item pode repetir a mesma peça).
- **Fotos da casa** (`fotos/`): 3:2, o assunto no meio (a forma de pedra corta os cantos). São as que mais valem trocar por foto de verdade.
- **Cartões do mural** (`mural/`): 9:16. Ou monte os da marca dela em `arquivos/fonte/cartoes.html` e fotografe com `arquivos/fonte/cartoes.mjs`, ou converta qualquer imagem em pé (prints dos stories) com `imagens.mjs mural`.
- **Mascote**: `arquivos/receitas/mascote.md`. Sem mascote, o logo dela (numa cor só) nas quatro poses resolve; a lambreta pode sair de cena apagando o bloco `apelidos__voo` em `apelidos.html` (o código não sente falta).
- **Só algumas peças num site que já existe**: cada seção leva o HTML dela, a folha de estilo dela, `tokens.css` e `base.css`, e o módulo de `src/motion/` com o `rolagem.js`. Os painéis levam também `config.js`, `paineis.js`, `seletor.js` e `cardapio.js`; o mascote só aparece onde a página tem os símbolos (`<!-- @marca -->`); o papel rasgado precisa da variável `--borda` (`borda.js`).

### Regras ao trocar
- Nada de dado inventado como se fosse da pessoa: preço, peso, telefone, endereço, horário, número de unidades e nomes de ingredientes que ela não mandou ficam `[preencher]` (nunca no título do hero nem no nome de um item).
- Mantenha o que dá o efeito: os painéis presos com o rasgo por dentro, as sete vagas de cada cena, o prato sempre no mesmo ângulo, a troca que espera as imagens e a rolagem passando por `naRolagem()`.
- **O nome gigante do pé é medido, não chutado.** O tamanho da letra é a largura disponível dividida pela largura do texto em `em` (o comentário em `rodape.css` tem a conta da demo). Com outra frase, meça de novo no navegador (largura do texto ÷ tamanho da fonte), para o nome ir de margem a margem sem cortar; no celular, em duas linhas, cabendo inteiro.
- **O selo redondo** tem o texto ajustado à volta do círculo (`textLength="452"` em `hero.html` e `casa.html`): mantenha a frase perto de 40 caracteres, terminando em " ·", ou ajuste o `textLength`.
- Os botões de pedir e o recado são demonstração: não enviam nada. Para valer, ponha o link em `MARCA.pedido` e ligue o formulário a um serviço de e-mail (ou troque por um botão de WhatsApp), e diga isso à pessoa.
- Depois de qualquer troca: `npm run build`, o site no computador e no celular, e a troca de item em **todos** os itens (um nome de peça errado no `config.js` só aparece quando o item é escolhido).
- Termine com a lista do que ainda é da demo: imagens dos pratos, ingredientes, fotos da casa, cartões do mural, mascote, apelidos, palavras da faixa, textos da casa, o link de pedido, o recado e as redes.
