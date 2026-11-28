# Etapa 5 · Campanha de tráfego pago no Meta Ads

> Para iniciantes. Orçamento: R$ 20 a R$ 30 por dia. Produto: curso de R$ 37 (+ bump de R$ 14,90 e upsell de R$ 47).

## Quando começar a anunciar

Só ligue os anúncios quando:
1. O curso estiver **gravado e cadastrado** na Kiwify ou na Hotmart.
2. A **página de vendas** estiver no ar, com o link do checkout, a política de privacidade e os termos de uso.
3. O **Pixel da Meta** estiver instalado (veja abaixo).
4. Você já tiver alguns Reels orgânicos com bom resultado. Eles viram os melhores anúncios.

No plano de 30 dias, isso coincide com a **semana 4** (abertura das vendas).

## Antes de criar a campanha (preparação)

| Passo | Onde | Para quê |
|---|---|---|
| 1. Página do Facebook conectada ao Instagram | Meta Business Suite | Os anúncios saem em nome do seu perfil |
| 2. Conta de anúncios com forma de pagamento | Gerenciador de Anúncios | Pagar os anúncios |
| 3. Criar o Pixel (conjunto de dados) | Gerenciador de Eventos | Medir visitas e vendas |
| 4. Colar o Pixel na página de vendas | No `<head>` da página (já existe um comentário marcando o lugar) | Registrar quem visitou |
| 5. Colocar o ID do Pixel no produto da Kiwify/Hotmart | Configurações do produto → Pixel / Rastreamento | Registrar checkout iniciado e compra |
| 6. Verificar o domínio da página | Configurações do negócio → Domínios | Melhorar a medição das conversões |

> Se você publicar a página num endereço gratuito (como Netlify), a verificação de domínio pode não ser
> possível. Ter um domínio próprio (.com.br) ajuda, mas não é obrigatório para começar.

---

## Antes de tudo, a conta que importa: quanto você pode pagar por venda

Na venda de R$ 37 a plataforma desconta a taxa dela. **Confira a taxa atual** na Kiwify ou na Hotmart,
porque ela muda.

- **Valor líquido por venda** = preço − taxa da plataforma
- **Custo por venda máximo para empatar** = valor líquido médio por cliente (curso + bumps + upsells que costumam ser comprados)

Exemplo **ilustrativo** (os números não são reais, servem só para entender a conta):
se cada cliente deixar em média R$ 40 líquidos, você pode gastar **até R$ 40 em anúncio por venda** sem
ter prejuízo. Acima disso, você perde dinheiro em cada venda.

É por isso que o bump e o upsell importam: eles aumentam quanto você pode pagar por cliente.
A planilha da Etapa 6 faz essa conta para você, dia a dia.

> Com orçamento pequeno e produto barato, é **normal** os primeiros dias darem prejuízo enquanto você
> descobre qual anúncio funciona. Defina antes um limite de teste que você aceita perder (sugestão:
> **R$ 175 = 7 dias × R$ 25**) e só continue se os números melhorarem.

---

## Estrutura da campanha

### Fase 1 · Teste (dias 1 a 7)

```
Campanha: [VENDAS] Vídeos com IA do zero
│  Objetivo: Vendas
│  Evento de conversão: Compra (Pixel)
│  Orçamento: R$ 25/dia (no nível da campanha)
│
└── Conjunto: Brasil · Aberto · Advantage+
     │  Local: Brasil
     │  Idade: 18 a 65+
     │  Gênero: todos
     │  Público: Advantage+ (com sugestões de interesse, veja abaixo)
     │  Posicionamentos: Advantage+ (automáticos)
     │  Link de destino: página de vendas
     │
     ├── Anúncio 1: Vídeo "Resultado + processo"   + Texto A
     ├── Anúncio 2: Vídeo "Prompt ruim x bom"      + Texto B
     └── Anúncio 3: Vídeo "O que tem no curso"     + Texto C
```

**Por que assim:**
- **Uma campanha e um conjunto só:** com R$ 25 por dia, dividir em vários conjuntos deixa cada um com
  pouco dinheiro, e o sistema da Meta não consegue aprender.
- **Objetivo Vendas:** a Meta procura pessoas com maior chance de comprar, e não só de clicar.
- **Público aberto (Advantage+):** hoje o sistema da Meta costuma encontrar compradores melhor do que
  interesses muito fechados. As sugestões de interesse só dão uma direção inicial.
- **3 criativos diferentes:** você descobre qual mensagem funciona sem precisar adivinhar.

**Sugestões de interesse** (o sistema pode ir além delas):
Inteligência artificial · ChatGPT · CapCut · Edição de vídeo · Criação de conteúdo · Canva · Instagram Reels · Marketing digital

**Atenção:** não use segmentações ou textos que deduzam características pessoais da pessoa (saúde,
situação financeira, religião etc.). Isso é proibido pelas políticas de publicidade da Meta.

### Fase 2 · Otimização (a partir do dia 8)

Depois de 7 dias, olhe os números por anúncio:

| Situação | O que fazer |
|---|---|
| Anúncio gastou mais que **2× o custo por venda máximo** sem nenhuma venda | Pausar |
| Anúncio com vendas e custo por venda **abaixo** do máximo | Manter e criar variações dele (outro gancho, outra capa) |
| Anúncio com cliques, mas sem vendas | O problema pode estar na página: revise o título e o preço, e teste no celular |
| Anúncio com poucos cliques (CTR baixo) | O problema é o começo do vídeo: troque o gancho |
| Campanha com custo por venda abaixo do máximo por 5 a 7 dias | Aumentar o orçamento em no máximo 20% a cada 3 dias |

**Remarketing (opcional, depois de ~2 semanas):** se a campanha já tiver tido visitas suficientes, crie
um segundo conjunto com **R$ 5/dia** (tirando da campanha principal, para manter o total entre R$ 20 e
R$ 30) para quem visitou a página ou iniciou o checkout nos últimos 14 dias e não comprou. Use o
anúncio que mais vendeu, ou o vídeo da garantia (dia 27 do plano).

**Regra de ouro:** não mexa na campanha todo dia. Cada edição grande reinicia o aprendizado.
Olhe todo dia, mas só mude algo a cada 3 ou 4 dias.

---

## Os 3 textos de anúncio

Os campos do Meta Ads: **texto principal** (acima do vídeo), **título** (abaixo do vídeo) e **botão**.

### Texto A · Direto ao processo
**Texto principal:**
> Esse vídeo foi feito com IA, do roteiro à voz. 🎬
>
> No curso **Vídeos com IA do zero** você aprende o passo a passo completo, em aulas curtas mostrando a tela:
> ✔️ Roteiro com IA
> ✔️ Imagens e vídeos com IA
> ✔️ Narração com voz de IA
> ✔️ Edição no CapCut
> ✔️ Postagem no Instagram
>
> Feito para iniciantes. R$ 37, com garantia de 7 dias.

**Título:** Vídeos com IA do zero · R$ 37
**Botão:** Saiba mais

### Texto B · A dor do iniciante
> Você tenta fazer vídeo com IA e o resultado sai estranho? Personagem mudando de rosto, voz robótica,
> e nenhuma ideia de como juntar tudo?
>
> O problema quase nunca é a ferramenta. É a falta de um passo a passo em ordem.
>
> No **Vídeos com IA do zero** você segue 26 aulas curtas, da ideia ao vídeo postado, com prompts e
> checklists para repetir sozinho.
>
> Sem promessa milagrosa: é um curso para aprender a fazer. Garantia de 7 dias.

**Título:** Aprenda a criar vídeos com IA
**Botão:** Saiba mais

### Texto C · Honesto e pessoal
> Comecei a fazer vídeos com IA há pouco tempo e mostro tudo no meu perfil, até os erros.
>
> Muita gente perguntou como eu faço, então organizei o meu processo num curso simples:
> roteiro, imagens, movimento, voz, edição no CapCut e postagem.
>
> 📚 8 módulos · 26 aulas curtas · materiais de apoio
> 💳 R$ 37 · garantia de 7 dias
>
> Não é curso de ganhar dinheiro. É curso de fazer vídeo.

**Título:** Da ideia ao vídeo postado
**Botão:** Saiba mais

> Os números (26 aulas, 8 módulos) precisam ser os mesmos do curso publicado. Se mudar o curso, mude os anúncios.

---

## Os 3 roteiros de criativo em vídeo

Formato: **vertical 9:16 (1080×1920)**, 20 a 35 segundos, legenda na tela o tempo todo (muita gente
assiste sem som) e o mais importante nos **primeiros 3 segundos**.

### Criativo 1 · "Resultado + processo" (usar com o Texto A)

| Tempo | Imagem | Texto na tela | Fala / narração |
|---|---|---|---|
| 0–3 s | O seu melhor vídeo feito com IA (a cena mais bonita) | "Esse vídeo foi feito 100% com IA" | "Esse vídeo foi feito inteiro com IA." |
| 3–8 s | Tela: o prompt de roteiro sendo enviado | "1. Roteiro" | "Primeiro, o roteiro com IA…" |
| 8–13 s | Tela: as imagens sendo geradas | "2. Imagens" | "…depois as imagens…" |
| 13–17 s | Imagem ganhando movimento | "3. Movimento" | "…o movimento…" |
| 17–21 s | Tela da narração | "4. Voz" | "…a voz…" |
| 21–26 s | Linha do tempo do CapCut | "5. Edição no CapCut" | "…e a edição no CapCut." |
| 26–32 s | Você (ou a tela da página) | "Vídeos com IA do zero · R$ 37" | "Ensino esse passo a passo completo no curso. Link aqui embaixo." |

### Criativo 2 · "Prompt ruim x prompt bom" (usar com o Texto B)

| Tempo | Imagem | Texto na tela | Fala / narração |
|---|---|---|---|
| 0–3 s | Tela dividida: imagem ruim x imagem boa | "Mesmo pedido. Resultados diferentes." | "Por que a sua imagem de IA sai assim… e a minha sai assim?" |
| 3–9 s | Prompt curto sendo digitado → imagem fraca | "❌ Prompt vago" | "Quando o pedido é vago, a IA adivinha." |
| 9–18 s | Prompt completo sendo digitado → imagem boa | "✅ Assunto + ação + lugar + estilo + luz" | "Quando você descreve o assunto, o lugar, o estilo e a luz, ela acerta." |
| 18–24 s | A imagem boa ganha movimento e entra no vídeo final | "E vira vídeo 🎬" | "E dá para transformar isso num vídeo completo." |
| 24–30 s | Lista de módulos rolando | "Curso Vídeos com IA do zero" | "Ensino isso e o processo inteiro no curso. Garantia de 7 dias." |

### Criativo 3 · "O que tem no curso" (usar com o Texto C)

| Tempo | Imagem | Texto na tela | Fala / narração |
|---|---|---|---|
| 0–3 s | Você falando para a câmera (ou avatar avisado), com o vídeo de IA ao fundo | "Muita gente me perguntou como eu faço esses vídeos" | "Muita gente me perguntou como eu faço esses vídeos com IA." |
| 3–10 s | Gravação da área de membros | "8 módulos · 26 aulas" | "Então eu organizei tudo num curso: 8 módulos, aulas curtas, mostrando a tela." |
| 10–18 s | Cortes rápidos de 3 aulas | "Roteiro · Imagem · Voz · CapCut" | "Do roteiro à postagem, com prompts e checklists." |
| 18–24 s | Você de novo | "Não é curso de ganhar dinheiro" | "Não é curso de ganhar dinheiro. É para aprender a fazer vídeo." |
| 24–30 s | Selo de 7 dias + preço | "R$ 37 · Garantia de 7 dias" | "São R$ 37, com 7 dias de garantia. O link está aqui embaixo." |

**Dicas de produção:**
- Use **gravações de tela reais** e vídeos que você fez de verdade.
- Um Reel orgânico que foi bem (mais salvamentos e compartilhamentos) pode virar anúncio. Coloque no
  final só a parte do curso, com o preço.
- Se usar música, use só faixas com licença para uso em anúncio (a biblioteca de sons da própria Meta é segura).

---

## Regras para o anúncio não ser reprovado (políticas da Meta)

- ❌ Promessa de ganho, renda ou "trabalhe de casa e ganhe…".
- ❌ "Você está…?" para apontar características pessoais ("Você está desempregado?", "Você tem dívidas?").
- ❌ Antes e depois de resultado financeiro ou de números de seguidores.
- ❌ Botões falsos de "play" ou de notificação desenhados na imagem.
- ❌ Usar logotipos da Meta, do Instagram ou do CapCut como se fossem parceiros.
- ❌ Preço, número de aulas ou garantia diferentes dos da página de vendas.
- ✅ Página de destino funcionando, com política de privacidade, contato e o mesmo produto do anúncio.
- ✅ Conteúdo com imagens ou vozes realistas feitas com IA: a Meta pode exigir ou aplicar automaticamente
  o aviso de IA. Como o tema é justamente "vídeo com IA", deixar isso claro no vídeo ajuda.

## O que acompanhar (todo dia, na planilha da Etapa 6)

| Métrica | O que mostra |
|---|---|
| Valor gasto | Quanto saiu do bolso |
| CTR (taxa de cliques no link) | Se o começo do vídeo e o texto chamam a atenção |
| Custo por clique no link | Quanto custa levar alguém até a página |
| Visualizações da página de destino | Quantos realmente abriram a página |
| Checkouts iniciados | Quantos se interessaram pelo preço |
| Compras e custo por compra | Se está dando lucro ou prejuízo |

> Não existe número "certo" universal para essas métricas: varia muito por produto e por época.
> A sua referência é o **custo por venda máximo** calculado lá em cima.
