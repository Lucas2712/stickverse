# Linguagem visual do estúdio

Inspiração: motion de tecnologia premium (interfaces limpas flutuando em profundidade, tipografia
cinética pesada, um fio condutor que costura as cenas, plano-sequência sem corte seco).
Cada vídeo tem identidade própria: o que se repete é o **método**, não a cara.

## 1. Identidade por projeto (definir no storyboard)

| Decisão | Como escolher |
|---|---|
| Fundo | claro (informativo, tecnologia, produto) ou escuro (cinema, urgência, luxo). Pode alternar: abertura escura → miolo claro, como um portal |
| Destaque | UMA cor, tirada do assunto (ex.: verde para finanças, azul-elétrico para dados, vermelho para alerta). Usada em ≤ 10% do quadro |
| Display | `geist` (técnico, neutro) · `archivo` (largura variável: condensa/expande, ótimo para cinética) · `bricolage` (personalidade, editorial) · `instrument-serif` (contraste elegante, citações) |
| Texto/UI | `geist`; dados e código em `geist-mono` |
| Fio condutor | traço com gradiente, ponto, linha do tempo, grade, um objeto do tema. Ele muda de forma entre cenas e aparece inteiro no final |

## 2. Catálogo de composições (alternar; nunca repetir duas seguidas)

1. **Tipografia central gigante**: 2 a 4 linhas, escalas diferentes, uma palavra na cor de destaque.
2. **Tipografia deslocada**: texto alinhado à esquerda, ocupando 2/3; elemento gráfico no 1/3.
3. **Card único central**: uma janela/UI grande, câmera bem perto, interação acontecendo.
4. **Constelação**: um elemento central com chips/nós ao redor, ligados por linhas.
5. **Mosaico em profundidade**: 3 a 5 cards sobrepostos em alturas diferentes, flutuando.
6. **Celular**: mockup de telefone com tela animada (feed, app, notificação).
7. **Infográfico dominante**: número gigante (KPI) ou gráfico ocupando o quadro.
8. **Comparação lado a lado**: antes/depois, nós/eles, dois números.
9. **Mapa**: mundo ou região, câmera viaja e dá zoom, pinos e arcos.
10. **Lista/checklist**: itens entrando e sendo marcados no ritmo da fala.
11. **Linha do tempo**: o fio condutor vira eixo horizontal; marcos passam.
12. **Grade/repetição**: muitos elementos iguais e UM diferente (destaque por contraste).
13. **Notificações empilhadas**: alertas chegando do topo (prova social, urgência).
14. **Cartela final**: marca/CTA, botão com clique, fio condutor contornando.

## 3. Movimento

| Uso | Curva | Duração |
|---|---|---|
| Entrada de card/elemento | `expo` (ou `back` para chips e botões) | 0,45–0,7 s |
| Saída | `in` / `inExpo` | 0,3–0,5 s |
| Palavra por máscara | `expo` | 0,5–0,7 s |
| Câmera (raiz da cena) | `expo` para empurrões, `out`/`sine` para derivas | 0,6–2 s |
| Contadores e gráficos | `expo` (números) · `inOut` (traços) | 0,8–1,2 s |
| Escalonamento (stagger) | 0,04–0,1 s entre letras/linhas/itens | |

- Entrada típica: opacidade 0 → 1, y +110 → 0, escala 0,9 → 1, blur 18 → 0.
- Tudo deriva: flutuação de 8 a 12 px, câmera com 2 a 3% de zoom por cena.
- Profundidade: elementos de trás menores, mais lentos e levemente desfocados.

## 4. Transições (catálogo)

| Nome | Como | Quando |
|---|---|---|
| Íris | ponto cresce e vira a tela nova (`trans.circulo`) | mudança de mundo (escuro → claro), abertura |
| Zoom através | a cena cresce e desfoca, a próxima vem de dentro (`saiZoom` + `entraZoom`) | aprofundar um assunto |
| Recuo | a câmera se afasta revelando contexto (`saiFundo`) | "isso é só uma parte" |
| Chicote | deslocamento lateral rápido com blur (`chicoteSai` + `chicoteEntra`) | listas, sequência de exemplos |
| Convergência | elementos voam para um ponto que vira o próximo elemento | síntese, "tudo isso vira…" |
| Morph | um elemento muda de forma e vira outro (card → botão, ponto → pino) | continuidade |
| Cortina/diagonal | recorte varre a tela (`trans.cortina`, `trans.diagonal`) | capítulos, virada de tom |
| Corte no tempo | troca seca sincronizada com batida ou impacto + efeito `hit` | só com música ou impacto forte |
| Flash | lampejo curto (`trans.flash`) | impacto, revelação |

Regra: a próxima cena entra 0,15–0,3 s antes da anterior terminar de sair.

## 5. Tipografia

- Títulos: peso 800–900, `letter-spacing` de −0,04 a −0,07 em, entrelinha 1.
- Contraste de escala: palavra-chave 2 a 4× maior. Ex.: "A pergunta é," (60 px) → "você" (250 px).
- Máximo de ~5 palavras grandes na tela ao mesmo tempo.
- Legenda: 56 a 68 px, peso 600, 1 linha, até 4 palavras, 1 destaque.
- Texto de UI: 26 a 34 px (legível no celular). Nada abaixo de 22 px.

## 6. Zona segura (Reels / TikTok / Shorts)

Nada importante em: topo 0–220 px · base 1580–1920 px · direita x > 950 abaixo de y = 1000.
A legenda fica em y ≈ 1430.
