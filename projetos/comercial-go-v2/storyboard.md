# Storyboard: Comercial GO · gobank · v2 vertical

> Aguardando aprovação. Nada é programado antes dela.

Versão 2.0: 22 s, 1080×1920 (9:16) a 60 fps, H.264, Three.js. Composição pensada para o vertical, não recortada da v1. Trilha original em Web Audio a 120 BPM (1 compasso = 2 s) + efeitos reais da biblioteca, em menor número e só onde têm propósito. Cada mensagem fica legível de 1,5 a 2,2 s, com entrada e saída suaves. O cartão nunca teleporta: um único movimento contínuo de câmera e cartão atravessa o filme, e a luz de uma cena vira a luz da seguinte.

## Direção de arte

| | |
|---|---|
| Conceito | <b>Fotografia de produto em movimento.</b> Estúdio preto profundo; o cartão é esculpido por duas luzes: uma <b>dourada</b> rasante (calor, material, chip) e uma <b>turquesa</b> de recorte (tecnologia). A luz turquesa é o fio condutor: nasce como reflexo no cartão, ocupa a tela, vira a onda do pagamento e depois o horizonte da cena 6. |
| Paleta | Preto profundo <code>#050607</code> · turquesa <code>#19C79B</code> (luz, nunca mais fundo chapado) · dourado quente <code>#E2B866</code> (luz e chip) · grafite do cartão <code>#16181C</code> · branco quente <code>#F4F1EA</code> nos textos. |
| Vertical | Cartão sempre inteiro, ocupando ~78% da largura no hero (margem lateral ≥ 90 px). Textos no terço inferior (y 1180–1520) ou superior (y 300–560), fora das zonas de interface do Reels/TikTok. Nenhuma palavra encosta nas laterais (margem 90 px). |
| Tipografia | Inter Display ExtraBold nos títulos (88–120 px), Inter Medium no apoio (40–48 px); sem a SF Pro por licença. Entrada: linha sobe 40 px com fade e desfoque leve em 0,7 s (ease in‑out), permanece parada, sai em 0,5 s. Nada de letra por letra rápido. |
| Cartão | Bisel mais largo e arredondado (perfil em quarto de círculo), espessura visível, preto acetinado com microtextura, chip dourado com contatos em relevo, símbolo de aproximação, GO em relevo prateado escovado. Exposição equilibrada: o preto do cartão nunca vira silhueta. |
| Movimento | Uma curva contínua para câmera e cartão (splines com aceleração/desaceleração), giros com mola amortecida (antecipação e assentamento), parallax entre cartão, textos e luzes. Sem cortes: as passagens de cena são movimentos de câmera. |
| Render | PBR, sombras suaves, oclusão de ambiente, profundidade de campo com foco animado, bloom contido, motion blur por acumulação de 8 a 20 subquadros (como na v1). |

## Mapa de ritmo

| # | Tempo | Fundo | Composição | Imagem |
|---|---|---|---|---|
| 1 | 0,0–3,0 | escuro | macro vertical: chip ocupa o centro, superfície do cartão em diagonal |  |
| 2 | 3,0–6,0 | escuro | cartão inteiro centralizado (78% da largura), GO grande abaixo |  |
| 3 | 6,0–9,0 | escuro | cartão no alto, inclinado, fora de foco leve; texto no terço inferior |  |
| 4 | 9,0–12,0 | escuro | espelho da cena 3: texto no alto, cartão no terço inferior |  |
| 5 | 12,0–15,0 | escuro | maquininha genérica (sem marca) na base, cartão descendo por cima, câmera em 3/4 |  |
| 6 | 15,0–18,0 | escuro | cartão flutuando no centro, horizonte de pontos turquesa na base |  |
| 7 | 18,0–20,0 | escuro | hero centralizado; tagline acima e abaixo do cartão |  |
| 8 | 20,0–22,0 | escuro | cartão no terço superior + logo oficial da gobank abaixo |  |

### 1 · O detalhe · 0,0–3,0 s

**Narração:** "(sem texto · trilha: grave + texturas, sem bateria)"

**Fundo:** escuro · **Composição:** macro vertical: chip ocupa o centro, superfície do cartão em diagonal

Sem texto. A câmera avança lentamente rumo ao chip, em leve arco. Luz dourada rasante revela a microtextura e o relevo dos contatos; uma linha de luz percorre o chip de 1,0 a 2,6 s. Foco raso que corre dos contatos para a borda do chip.

**Sincronização:**
- 0,0–0,8 s sobe do preto
- 0,6 s tinido metálico (efeito real)
- 1,0 s linha de luz começa a percorrer o chip
- 2,0 s riser suave prepara o recuo

**Transição:** a câmera não corta: começa a recuar em 2,8 s

---

### 2 · A revelação · 3,0–6,0 s

**Narração:** "(trilha: entra o kick em 4,0)"

**Fundo:** escuro · **Composição:** cartão inteiro centralizado (78% da largura), GO grande abaixo

A câmera recua com inércia (2,8–4,4 s) e revela o cartão inteiro, que gira meia volta no ar e assenta de frente com uma mola suave (antecipação → giro → assentamento). Em 4,0 «GO» surge abaixo do cartão, subindo 40 px com fade, e fica parado até 5,6 s. O cartão respira (deriva lenta) de 4,8 a 6,0.

**Sincronização:**
- 2,9 s whoosh suave do recuo
- 4,0 s impacto grave + GO aparece
- 5,3 s o reflexo turquesa começa a cruzar o cartão

**Transição:** o reflexo turquesa cresce até ocupar a tela e vira a luz de fundo da cena 3 (5,5–6,2 s)

---

### 3 · Benefício 01 · 6,0–9,0 s

**Narração:** "(trilha: drop suave, batida completa)"

**Fundo:** escuro · **Composição:** cartão no alto, inclinado, fora de foco leve; texto no terço inferior

«Tudo no seu» (apoio) + «controle.» (título). Visível de 6,4 a 8,6 s. O cartão sobe para o terço superior em deriva lenta, com o brilho turquesa atrás.

**Sincronização:**
- 6,0 s pulso da trilha (sem efeito extra)
- 6,3 s título entra
- 8,5 s título sai suave

**Transição:** o cartão inicia uma rotação de borda (8,6 s) e a câmera a acompanha

---

### 4 · Benefício 02 · 9,0–12,0 s

**Narração:** "(trilha: hats)"

**Fundo:** escuro · **Composição:** espelho da cena 3: texto no alto, cartão no terço inferior

Durante a rotação de borda a espessura do cartão vira um fio de luz; a câmera gira junto e o cartão assenta embaixo. «Pague em» + «segundos.» no alto, visível de 9,6 a 11,6 s.

**Sincronização:**
- 8,7 s whoosh discreto da rotação
- 9,5 s título entra
- 11,4 s riser curto prepara o pagamento

**Transição:** o cartão desce e sai pela base, a câmera desce com ele e encontra a maquininha

---

### 5 · Pagamento por aproximação · 12,0–15,0 s

**Narração:** "(trilha: respiro, só kick e grave)"

**Fundo:** escuro · **Composição:** maquininha genérica (sem marca) na base, cartão descendo por cima, câmera em 3/4

O cartão desacelera e para a ~1 cm da tela da maquininha em 13,5 s. Uma onda turquesa sai do ponto de contato e percorre o ambiente; a tela da maquininha mostra um visto genérico. Sem texto (a cena 4 já anunciou).

**Sincronização:**
- 12,2 s aproximação (efeito real suave)
- 13,5 s toque: som de confirmação + onda
- 14,4 s a onda se abre e vira o horizonte

**Transição:** a onda vira um horizonte curvo de luz e pontos (o planeta visto de perto) na base da tela

---

### 6 · Benefícios adicionais · 15,0–18,0 s

**Narração:** "(trilha: arpejo leve)"

**Fundo:** escuro · **Composição:** cartão flutuando no centro, horizonte de pontos turquesa na base

Dois benefícios, um por vez (o briefing permite priorizar): «Alertas em tempo real» (15,2–16,6 s) e «Compras no mundo todo» (16,6–17,9 s), cada um com cerca de 1,4 s parado, trocando por fusão de 0,3 s. «Cartão virtual» e «Bloqueio pelo app» ficam fora desta versão.

**Sincronização:**
- 15,0 s transição de luz (sem impacto)
- 16,6 s troca de texto
- 17,4 s riser para a assinatura

**Transição:** o horizonte afunda e as luzes apagam; o cartão vem ao centro

---

### 7 · Assinatura · 18,0–20,0 s

**Narração:** "(trilha: queda, grave e reverberação)"

**Fundo:** escuro · **Composição:** hero centralizado; tagline acima e abaixo do cartão

«SEU DINHEIRO.» acima e «SEU RITMO.» abaixo, frase completa, 96 px, com margem de 90 px. Entram em 18,2 e 18,7 s e ficam até 20,6 s.

**Sincronização:**
- 18,0 s queda grave, o fundo escurece
- 18,2 / 18,7 s entradas da tagline (sem efeito extra)

**Transição:** a tagline sobe e some, o cartão sobe levemente

---

### 8 · Encerramento · 20,0–22,0 s

**Narração:** "(trilha: assinatura sonora)"

**Fundo:** escuro · **Composição:** cartão no terço superior + logo oficial da gobank abaixo

Logo oficial da gobank (SVG que você enviar), entrando com fade e leve subida em 20,4 s; composição parada de 21,0 a 22,0 s para leitura.

**Sincronização:**
- 20,4 s impacto sutil + logo
- 21,0–22,0 s composição segura

**Transição:** fim em 22,0 s

---

## Pontos de atenção

- Logo: não há SVG da gobank no projeto. Preciso do arquivo para a cena 8 (não vou escrever «LOGO GOBANK» nem desenhar uma aproximação).
- Benefícios: uso os genéricos da v1 com prioridade a quatro (controle, pagamento, alertas, compras no mundo). Cada um fica 1,4 a 2,2 s na tela.
- Turquesa vira luz (reflexos, onda, horizonte) e o fundo é sempre preto profundo, como você pediu; dourado entra como segunda luz.
- Música: trilha nova em Web Audio a 120 BPM, com arco: intro → drop em 6 s → respiro no pagamento → queda em 18 s → assinatura em 20 s. Efeitos reais: cerca de 14 (antes 31).
- Tempo de render: 1320 quadros com motion blur, cerca de 3 horas neste servidor; antes disso, prévia rápida para revisão.
