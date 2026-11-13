# Prumo · v3 — reconstrução da direção (diagnóstico e plano)

## Diagnóstico da v2 (medido no MP4, mesma régua para as referências)
| Métrica | Ref. 5 (original) | Refs. 1 e 3 | v2 |
|---|---|---|---|
| Energia de movimento média | 5,29 | 3,35–3,60 | 1,32 |
| Quadros parados | 25% | 26–33% | 62% |
| Segundos quase parados | 4/27 | 10/40 | 35/69 |
| Viradas visuais fortes | 8,7/10 s | 2,9–4,9/10 s | 1,0/10 s |

Causas: linguagem de slide (entra–fica–sai), câmera morta (zoom de 1–5%), fusões repetidas, texto separado da cena,
demonstração com celular parado e ponto cinza, trilha sem dramaturgia, narração acelerada (1,2×) e não nativa.

## Plano executado
- **Motor novo** (`animations/cam.js`, `components/Motion.jsx`): câmera por quadros-chave com easing por trecho
  (chicote, deslize, mergulho), **desfoque de movimento direcional** calculado da velocidade real da câmera,
  tipografia letra a letra com máscara, holofote, varredura de luz e cortina da agulha.
- **Ato 1** plano-sequência num canvas: título com órbita de ícones → 4 chicotes (Clientes, Vendas, Pagamentos,
  Operação), cada painel com animação própria → recuo que revela o todo em perspectiva → inundação → «finanças»
  atropelada → mergulho no caos → «um grande desafio.».
- **Ato 2** lente que tenta focar «claramente»; partículas que entram/saem/cobram em volta do negócio; carimbos com
  tremor de câmera; **congelamento**; a bússola procura; **trava ↓ no silêncio**; **queda** de tudo na direção do
  prumo com onda de choque; íris azul e «prumo» letra a letra.
- **Ato 3** marca vira selo; fragmentos sobem e se orientam no fio (organização/clareza/direção) com palavras
  gigantes em parallax e órbita de câmera; a coluna vira o celular; cortina da agulha; funções conectadas por linhas.
- **Ato 4** câmera macro DENTRO do app: mergulho até a aba, linhas chegando, toque abre o detalhe, chicote para o
  filtro, lista se divide fisicamente em Receitas/Despesas, chicote vertical para a Agenda, soco no lembrete;
  holofote e trilho de etapas; «simples/clara/organizada» com o celular girando em 3D.
- **Ato 5** a tela explode em 4 painéis em órbita 3D; conexões com pulsos de luz; voo para Pessoal/Negócio;
  chicote para a reserva; na virada da música, recuo para o **fluxo do dinheiro com partículas**.
- **Ato 6** retorno ao canvas da abertura com deslizes calmos (espelho dos chicotes): ✓ em cada frente,
  Finanças entra no centro, mergulho na bússola.
- **Ato 7** bússola em close com câmera girando em 3D, trava em «Prumo.» com logo sonoro, ícone, nome letra a
  letra, anéis girando, assinaturas e chamada.
- **Som**: trilha editada em atos (tensão com passa-alta → abafada → **0,6 s de silêncio** → queda no tempo forte
  → pulso → virada brilhante → resolução); 12 novos efeitos por família de movimento (chicote, mergulho, morfismo,
  estilhaço, onda de choque, partículas, letras, holofote…) e **logo sonoro** com o clique alinhado à trava.
- **Narração**: Sarah (eleven_v4) em velocidade natural, sem aceleração, com as pausas entre ideias.
