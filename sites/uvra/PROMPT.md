# Uvra: landing page de vinícola em que a página inteira é um filme pintado, preso à rolagem

## Antes de começar: pergunte

Antes de escrever qualquer código, faça estas perguntas, uma por vez e em linguagem simples (a pessoa pode não ser programadora):

1. **O que você quer fazer com este site?**
   - **Montar a demo como ela é**, para ver funcionando e trocar depois.
   - **Fazer o site da minha vinícola** (ou do meu vinho, da minha adega, do meu enoturismo) com esta estrutura e este filme.
   - **Usar só algumas peças** num site que já tenho:
     - o filme em quadros preso à rolagem (o motor que toca qualquer sequência de clipes);
     - a vitrine dos produtos que abre por cima da página;
     - o menu do celular com o índice grande;
     - o freio da rolagem (a roda e o dedo nunca passam rápido demais).
2. **Se for a vinícola dela**, pergunte:
   - o nome e a frase da marca;
   - os rótulos que vende (nome, uva, safra, preço) e o link da loja;
   - as visitas que oferece (degustação, almoço, vindima) e o link para agendar;
   - se tem clube de assinatura e como funciona;
   - o e-mail, o WhatsApp e as redes;
   - **que material já tem**: fotos das garrafas, fotos da propriedade, o logo.

   Avise já aqui, com clareza, o que depende de material novo:
   - Nome, frases, rótulos, preços, visitas, clube e contatos mudam só com texto.
   - **O filme foi pintado por IA** (galeria, vinhedo, colheita, prensa, adega, taça, garrafas, banquete) e mostra uma vinícola inventada. Ele não se edita por prompt. Serve como está para muitas vinícolas, porque conta o caminho da uva até a taça sem marca nenhuma. Para contar outra história (a paisagem dela, o produto dela), é preciso gerar quadros e clipes novos com as receitas de `arquivos/receitas/`, com custo de geração de vídeo.
   - **As três garrafas da vitrine também foram pintadas por IA**, com rótulos inventados. Com os rótulos dela, entram fotos das garrafas reais (fundo escuro) ou novas pinturas pelas receitas.
   - **Os números (18 hectares, 1.100 metros, safra de 2009, 12 a 18 meses de barrica) e os preços são inventados**: só entram os reais.
3. **Se forem peças:** quais, e onde está o site que vai recebê-las.

Depois, em qualquer caminho, **monte primeiro a demo completa como descrita abaixo** e confira que ela roda: é o caminho testado e fica de referência. Só então aplique a marca ou extraia as peças, seguindo a seção "Personalizar" do guia. Termine com uma lista curta do que ainda é da demo e do que falta a pessoa mandar.

## A demo

Construa a landing page da **Uvra**, uma vinícola de altitude fictícia: vinhos em lotes pequenos, colhidos à mão e guardados em carvalho, com loja de três rótulos, visitas com degustação e um clube de assinatura.

Leia antes o guia do projeto desta pasta (`CLAUDE.md`, ou `AGENTS.md` no Codex e outros agentes). Ele traz a arquitetura, o design system, as regras do filme e do celular, como conferir e como personalizar.

Olhe também as imagens em `arquivos/conceito/`. São prints do site pronto, em `-desktop` (1456 × 840) e `-mobile` (390 de largura, em 2×):

- `01-hero` (a página recém-aberta);
- as cenas do filme, cada uma com a sua frase no lugar dela; cada print é a página aberta pela âncora entre parênteses:
  - `02-vinhedo` (`/#vinhedo`);
  - `03-colheita` (`/#colheita`);
  - `04-prensa` (`/#adega`: a sala "Adega" do índice começa na prensa);
  - `05-adega` (`/#barrica`: a adega de pedra);
  - `06-prova` (`/#prova`);
  - `07-rotulos` (`/#rotulos`);
- `08-vitrine` (a vitrine dos rótulos aberta por cima do filme, pelo "Ver os vinhos");
- `09-visitas` (`/#visitas`) e `10-clube` (`/#clube`: o fecho, na mesma galeria do começo);
- `11-rodape` (o fim da página);
- `12-menu-mobile` (o menu do celular aberto).

**Tudo o que o site usa já vem pronto:**

- em `arquivos/site/`, o código inteiro: o `index.html`, o `vite.config.js`, o `package.json` com as versões travadas e o `package-lock.json`, o CSS de cada seção e os módulos de motion em `src/`, e em `public/` as fontes, a foto do hero (deitada e em pé), as três garrafas e o favicon;
- em `arquivos/filme/`, os nove clipes do filme (`c1.mp4` a `c9.mp4`) e `curvas.json`, com a curva de movimento de cada um. O script `scripts/quadros.mjs` do site transforma os clipes nos quadros que o site toca, em `public/filme/`.

Use tudo isso como está. Não gere imagem nem vídeo novo, não reescreva os módulos, não troque versão de biblioteca e não "melhore" nada na montagem da demo. A demo tem de sair idêntica aos prints.

A ideia da página: **a página inteira é um filme pintado, preso à rolagem.** O hero é o primeiro quadro: uma galeria escura, vista de trás do público, com um quadro iluminado. Rolando, a câmera atravessa o público, entra no quadro, e a pintura ganha vida. O filme segue a uva do vinhedo até a taça e, no fim, se afasta do banquete até ele virar outro quadro na mesma galeria. Cada cena tem uma frase curta, que mora no vazio da imagem. Nenhuma parte trava a rolagem.

Nível de acabamento: site de premiação.

---

## Parte 1 — O site

### Marca e tom
- **Público:** adultos de 30 a 65 anos que gostam de vinho e de saber de onde ele vem; quem dá vinho de presente; quem procura um passeio no vinhedo.
- **Tom:** calmo, sensorial e concreto. Frase curta, com o gesto, o lugar ou o número. Nada de "experiência única", "excelência" ou "o melhor vinho", e nenhuma cidade.
- **Cores** (tokens em `src/styles/tokens.css`):
  - fundo `#0c0705` (marrom quase preto, a galeria), parede `#150e0a`;
  - branco `#f0efee`, texto em branco a 88%, apoio a 62%, fraco a 34%, linha a 9%;
  - acento lilás-rosé `#e2d0dc` só nos itálicos das frases e no botão cheio, com a tinta `#1b1013` por cima;
  - a cor vem do filme: o site em volta é escuro.
- **Tipo** (em `public/fonts/`, livres, com as licenças): **Instrument Serif** nas frases e títulos, com a palavra-chave em itálico; **Inter Tight** variável no texto e na interface; **Geist Mono** nas legendas de acervo.
- **O filme:** nove clipes de 5 s, cada um com quadro inicial e final, pintados como pintura acadêmica do século XIX filmada com lente de cinema (pincelada visível, profundidade de campo, luz de tarde ou de vela). O quadro final de um clipe é o inicial do seguinte; as emendas fundem numa faixa curta.

### Regras de movimento (valem para a página inteira)
1. **O filme é preso à rolagem.** Uma tela fica presa (`sticky`) enquanto a trilha passa, e a posição da rolagem escolhe o quadro, numa curva que deixa a câmera em ritmo constante. Nada trava a rolagem.
2. **Texto por marco, com tempo fixo.** Cada frase sai do desfoque e sobe quando a imagem dela aparece, e some antes da emenda. Nunca texto preso ao scrub.
3. **Freio na rolagem** (`guia.js`): a roda e o trackpad têm teto de ~1,8 tela por segundo, sem paradas. No toque, o arrasto segue o dedo e a inércia ao soltar anda no máximo 2,4 telas; o filme persegue a rolagem e nunca pula partes.
4. **O texto mora no vazio do quadro:** no céu, ao lado da taça, ao lado do fio de mosto, como legenda embaixo da natureza-morta; só os quadros cheios levam a frase no pé.
5. **Link para longe corta por um véu escuro** em vez de passar o filme correndo.
6. **Nada de HUD**, contador "01/09", "role para..." ou linha decorativa.

### 1 — Hero (`01-hero`)
- A foto da galeria cobre a tela: parede escura, o público de costas no pé, e no meio um quadro de moldura dourada, iluminado: uma moça de túnica branca erguendo um cacho de uvas contra o céu azul. Em cima da moldura, a legenda em mono "● Alegoria da vindima".
- À esquerda, sobre a parede escura: "Vinhos de altitude, colhidos à mão e guardados *o tempo que pedem*." (o fim em serifa itálica).
- No pé, **"Todo vinho tem uma *paisagem*"** gigante, de borda a borda, passando por cima das cabeças, com "paisagem" em itálico lilás.
- **Nav:** à esquerda, o índice das salas com o número romano à direita (A casa I, Vinhedo II, Colheita III, Adega IV, Rótulos V, Visitas VI, Clube VII); a sala atual fica branca. No meio, o cacho de seis bagos e "Uvra". À direita, "Loja" com o ícone de sacola, "Agendar visita" em pílula de contorno e "Clube Uvra" em pílula cheia lilás.
- O primeiro gesto tira os textos do hero e o filme começa.

### 2 — O filme e as cenas
| Clipe | O que a câmera faz | Frase e apoio | Onde fica |
|---|---|---|---|
| C1 | atravessa o público, a moldura passa pelas bordas e a pintura ganha vida | (o hero sai) | |
| C2 | sobe pelo braço da moça e voa por cima do vinhedo | **Começa no *alto*.** "Dezoito hectares a 1.100 metros, onde a noite fria guarda a acidez da uva." | no céu, centrada em cima, branca sobre um véu liso que escurece o topo durante a cena (`02-vinhedo`) |
| C3 | corte seco para duas mãos cortando o cacho; o cacho desce ao cesto | **Colhido *à mão*.** "Cacho por cacho, em caixas de 18 kg, nas primeiras horas da manhã." | no pé: a frase à esquerda, o apoio à direita (`03-colheita`) |
| C4 | o cesto vira na prensa e a câmera desce até o fio de mosto | **Prensado *devagar*.** "A prensa de cesto tira o mosto sem amargar as cascas." | à direita, no meio da altura, no escuro ao lado do fio de mosto (`04-prensa`) |
| C5 | mergulha no mosto e sai numa adega de pedra à luz de vela, o adegueiro tirando vinho com a pipeta | **Guardado *sem pressa*.** "De 12 a 18 meses em carvalho francês, numa adega de pedra a 14 °C." | no pé (`05-adega`) |
| C6 | a pipeta solta o vinho numa taça de cristal | **Provado *barrica a barrica*.** "Só vai para a garrafa quando o enólogo prova e diz que está pronto." | à esquerda da taça, grande, no escuro entre as velas (`06-prova`) |
| C7 | afasta da taça: as três garrafas entram e a mesa vira uma natureza-morta | **Três rótulos, *uma encosta*.** "Da mesma vindima, em lotes pequenos. Frete grátis a partir de duas garrafas." e o botão "Ver os vinhos" | a legenda centrada embaixo das garrafas, sobre um véu no pé (`07-rotulos`) |
| C8 | a mesa é a ponta de um banquete sob a pérgola, ao pôr do sol, gente brindando | **A mesa fica *no vinhedo*.** "Degustação guiada, almoço harmonizado sob a pérgola e a vindima aberta, em março." e "Agendar uma visita" | no pé (`09-visitas`) |
| C9 | afasta até o banquete virar um quadro na mesma galeria do hero | o fecho (abaixo) | (`10-clube`) |

### 3 — A vitrine dos rótulos (`08-vitrine`)
- "Ver os vinhos", o "Loja" da nav e o do rodapé abrem a vitrine por cima do filme: o fundo escuro da marca translúcido e desfocado, com o filme esmaecido atrás. O filme não para.
- No alto: "● Loja Uvra", **"Três rótulos, *uma encosta*."** e o apoio. Embaixo, as três garrafas pintadas, grandes, recortadas no fundo da marca, sem card: **Branco** (R$ 89, Sauvignon Blanc · safra 2023, "Colhido de madrugada, fresco e mineral."), **Rosé** (R$ 99, Pinot Noir · safra 2023, "De prensa direta, leve e seco.") e **Reserva** (R$ 189, Cabernet Franc · safra 2021, "Doze meses em barrica. No rótulo, a nossa vindima."), cada uma com o nome em serifa, o preço, a uva e a safra em mono, uma linha e "Comprar".
- Fecha no ×, no Esc ou com um clique fora e volta ao mesmo ponto do filme. Aberta, a página não rola e fica inerte por trás; o foco fica preso nela e volta ao botão que abriu.

### 4 — O fecho: um lugar à mesa (`10-clube`)
- O fecho repete o hero: a galeria escura, agora com o banquete na moldura (larga), a legenda "● O banquete da vindima" em cima dela.
- À esquerda: "Três garrafas por estação, escolhidas pelo enólogo, e um convite para a vindima." e "Entrar no clube" em pílula cheia.
- No pé, **"Um lugar *à mesa*"** gigante, como o título do hero. A imagem fica parada um pouco antes do rodapé subir.

### 5 — Rodapé (`11-rodape`)
- Sobe por cima da galeria: o cacho e "Uvra", "Vinhos de altitude em lotes pequenos, desde a safra de 2009." em serifa, os links Loja, Visitas, Clube e contato@uvra.com.br, "Aprecie com moderação. Venda proibida para menores de 18 anos." e "© 2026 Uvra Vinhos". Sem endereço nem cidade.

### Interações (tudo que é clicável)
- **Índice:** clareia no hover; o clique leva à cena (perto, rola até lá; longe, corta pelo véu escuro).
- **Pílulas:** a de contorno ganha fundo no hover, a cheia clareia; o clique afunda (0,97); o foco tem contorno lilás.
- **Vitrine:** a garrafa sobe e acende no hover e no foco; o × gira no hover.
- **Barra de rolagem própria:** um fio fino que aparece ao rolar e engrossa no hover, arrastável. A nativa fica escondida.
- **Regras gerais:** hover só com o cursor de verdade (`@media (hover: hover)` e `.is-scrolling` enquanto a página rola com o cursor parado); alvos de toque de 44 px no celular; "Pular para o conteúdo" no Tab.

### Celular (`-mobile` e `12-menu-mobile`)
- **O filme vem em pé:** os mesmos clipes recortados no meio em 9:16 (608 × 1080). A tela do filme tem a altura grande do celular (`100lvh`) e os textos ficam numa camada da altura pequena (`100svh`): a barra do Safari nunca cobre o pé deles.
- **Nav:** a marca à esquerda; "Loja" e "Menu" à direita. O menu abre por baixo da barra, sobre o filme esmaecido: o índice das salas em serifa grande, com o número romano, "Agendar visita" e "Clube Uvra" no pé e o e-mail. "Menu" vira "Fechar" com os dois fios virando um ×.
- **Hero:** o parágrafo na parede escura acima do quadro, a legenda centrada em cima da moldura e o título em duas linhas no pé.
- **Cenas:** a frase (até duas linhas), o apoio e o botão empilhados no pé; o vinhedo continua no céu, em cima, e os rótulos continuam como legenda centrada. As cenas da direita e da esquerda descem para o pé, porque o recorte em pé não tem os lados escuros.
- **Vitrine:** as garrafas num trilho lateral (o arrasto é do navegador), uma por vez e grande, com a ponta da seguinte na borda; cabe inteira com as barras do Safari abertas.
- **Celular deitado:** os textos voltam para a coluna escura da esquerda, como no computador, e o menu fica em duas colunas.

### Movimento reduzido
Sem Lenis e sem a perseguição do filme: a rolagem é a nativa, o filme acompanha direto e os textos aparecem sem deslocamento.

---

## Parte 2 — Como construir (stack)

- **Vite sem framework.** As bibliotecas, com as versões travadas no `package.json` e no `package-lock.json`: GSAP 3.15.0, Lenis 1.3.26 e Vite 8.3.3. Para refazer o filme: sharp 0.35.5 e @ffmpeg-installer/ffmpeg 1.1.0 (o ffmpeg vem dentro do pacote; não precisa instalar nada no sistema).
- **Node 20.19 ou mais novo** (o 22 LTS é o recomendado): o Vite 8 e o sharp não rodam em versões anteriores.
- **Monte assim, nesta ordem:**
  1. **Copie todo o conteúdo de `arquivos/site/`** para a raiz do projeto, mantendo as pastas (`index.html`, `vite.config.js`, `package.json`, `package-lock.json`, `src/`, `public/`, `scripts/` e o `.gitignore`, que é um arquivo oculto: `cp -R arquivos/site/. .` copia todos).
     - Copie, não reescreva: o motor do filme, as janelas de cada frase e os véus foram acertados quadro a quadro.
     - Deixe `arquivos/` onde está: o passo 3 lê os clipes de `arquivos/filme/`. Não copie `arquivos/conceito/` nem `arquivos/receitas/` para o site.
  2. **Rode `npm ci`**, que instala exatamente as versões do `package-lock.json`. Se ele falhar, use `npm install` sem mudar nenhuma versão. O npm 11 pode avisar que o pacote do ffmpeg tem um script de instalação "not yet covered by allowScripts": ignore, o `npm run quadros` dá ao ffmpeg a permissão que esse script daria.
  3. **Rode `npm run quadros`.** Ele transforma os nove clipes em quadros WebP, deitados (1440 × 812) e em pé (608 × 1080), com a curva de movimento de cada capítulo, em `public/filme/` (~125 MB em ~2.200 arquivos), e refaz a foto do hero (`public/img/galeria.webp` e `galeria-retrato.webp`) a partir do quadro 0 do filme: ela fica igual à vista, com outros bytes. Leva de 1 a 5 minutos, conforme o computador, e termina com "pronto: public/filme/". Se os clipes estiverem em outro lugar: `npm run quadros -- <pasta dos clipes>`.
  4. **Rode `npm run build`**, que tem de passar sem erro.
  5. **Rode `npm run dev`** e abra o endereço que o Vite mostrar em "Local:" (normalmente `http://localhost:5360`). Se outro programa já usar essa porta, rode `npx vite --port 5370` e abra o endereço que ele mostrar.
     - Para abrir no celular, na mesma rede Wi-Fi, use `npm run dev -- --host` e o endereço de rede que o Vite mostrar.
- O CSS entra por `<link>` no `<head>` do `index.html` (nunca importado pelo JS), com as fontes pré-carregadas: assim a página nunca aparece crua ao recarregar. Mantenha assim.
- **Confira contra os prints de `arquivos/conceito/`**, na tela de 1456 × 840 e na de 390 × 844:
  - o hero, e a entrada no quadro no primeiro gesto;
  - cada frase no lugar dela: no céu do vinhedo, à direita da prensa, à esquerda da taça, como legenda das garrafas;
  - a vitrine abrindo e fechando no mesmo ponto;
  - o fecho na galeria e o rodapé;
  - no celular, o filme em pé, o menu e a vitrine em trilho.

  Para chegar ao ponto de cada print, abra a página pela âncora dele (a lista acima) ou clique no índice. O console fica sem erros, nada rola para o lado no celular (nem com a vitrine aberta) e nenhuma cena mostra quadro em branco. Se algo não bater, o erro está na cópia (arquivo faltando ou alterado) ou nos quadros (rode `npm run quadros` de novo): compare com `arquivos/site/` (só as duas fotos do hero mudam de bytes, porque o `npm run quadros` as refaz).
- **No fim:** `npm run build` gera o `dist/`, que sobe em qualquer hospedagem estática (Netlify, Hostinger, Vercel). Ele leva os quadros do filme (~130 MB em ~2.200 arquivos pequenos): confira se a hospedagem aceita esse tamanho.
