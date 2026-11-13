// v3 · efeitos presos a cada movimento: [segundo, arquivo, ganho, evento]
import { interpolate } from 'remotion';
import { W, WE, FIM, N, DURACAO, B, MUS } from './timeline';
import { FB3 } from '../scenes/V3_A2';
import { FH3 } from '../scenes/V3_A7';
export const SFX = () => {
  const wp = 0.36, f2 = FB3(), f7 = FH3();
  const a4 = { tab: B(W(4, 'acompanhar') + 0.25), mov: B(W(4, 'movimentações')), row: B(B(W(4, 'movimentações')) + 1.1), rec: B(W(4, 'receitas')), des: B(W(4, 'despesas')), ag: B(W(4, 'visualizar') + 0.1), comp: B(W(4, 'compromissos')) };
  a4.aviso = B(a4.comp + 0.6);
  const tCta = FIM(7) + 0.1;
  const all = [
    // ato 1 · plano-sequência
    [W(1, 'Empreender') - 0.02, 'cascata_letras', 0.42, 'letras de «Empreender» caem'],
    [W(1, 'muita') - 0.1, 'telas_flutuam', 0.30, 'ícones começam a orbitar'],
    [W(1, 'clientes') - wp, 'chicote_a', 0.50, 'chicote → Clientes'],
    [W(1, 'clientes') + 0.02, 'bolha_msg', 0.36, 'bolhas de conversa'],
    [W(1, 'vendas') - wp, 'chicote_b', 0.46, 'chicote → Vendas'],
    [W(1, 'vendas') + 0.1, 'barras_sobem', 0.34, 'barras e linha sobem'],
    [W(1, 'pagamentos') - wp, 'chicote_a', 0.46, 'chicote → Pagamentos'],
    [W(1, 'pagamentos') - 0.02, 'virar_card', 0.40, 'cartão gira'],
    [W(1, 'operação') - wp, 'chicote_b', 0.44, 'chicote → Operação'],
    [W(1, 'operação') + 0.15, 'ticks', 0.36, 'checklist marcando'],
    [W(1, 'Mas') - 0.1, 'revelacao', 0.36, 'recuo revela as 4 frentes'],
    [W(1, 'Mas') + 0.5, 'papeis_pilha', 0.34, 'inundação de tarefas'],
    [W(1, 'responsabilidades'), 'card_desliza', 0.26, 'mais tarefas'],
    [W(1, 'finanças') - 0.05, 'morfismo', 0.32, 'card «finanças» surge'],
    [W(1, 'organizadas'), 'encaixe', 0.36, 'finanças tenta se alinhar'],
    [W(1, 'também'), 'documentos_tapa', 0.40, 'atropelada pelas tarefas'],
    [W(1, 'grande') - 0.75, 'mergulho', 0.50, 'mergulho no caos'],
    [W(1, 'grande') - 0.02, 'slam_texto', 0.46, '«grande desafio.»'],
    // ato 2 · fluxos, congelamento, bússola, silêncio, queda
    [W(2, 'claramente') - 0.2, 'foco', 0.36, 'lente procurando foco'],
    [W(2, 'entra') - 0.1, 'particulas', 0.30, 'fluxo que entra'],
    [W(2, 'sai') - 0.1, 'seta_sai', 0.36, 'fluxo que sai'],
    [W(2, 'precisa'), 'carimbo', 0.44, 'cobrança 1 (tremor)'],
    [W(2, 'precisa') + 0.22, 'carimbo', 0.32, 'cobrança 2'],
    [W(2, 'precisa') + 0.44, 'carimbo', 0.26, 'cobrança 3'],
    [MUS.freeze - 0.02, 'congelar', 0.48, 'o mundo congela'],
    [f2.a - 0.02, 'agulha_surge', 0.46, 'a bússola surge'],
    [f2.settle - 1.07, 'logo_prumo', 0.62, 'LOGO SONORO: giro → clique na trava (início do silêncio) → acorde no silêncio'],
    [MUS.V2 - 0.02, 'onda_choque', 0.62, 'QUEDA: onda de choque'],
    [MUS.V2 + 0.02, 'estilhaco_queda', 0.44, 'tudo cai na direção do prumo'],
    [MUS.V2 + 0.25, 'revelacao', 0.34, 'luz azul (light leak) na revelação'],
    [f2.a + 0.1, 'particulas', 0.22, 'poeira de luz orbitando a bússola 3D'],
    [MUS.V2 + 0.4, 'cascata_letras', 0.36, 'letras «prumo»'],
    // ato 3
    [W(3, 'Foi') - 0.15, 'morfismo', 0.30, 'marca vira selo'],
    [W(3, 'organização') - 0.1, 'encaixe', 0.36, 'organização (encaixe)'],
    [W(3, 'clareza') - 0.05, 'foco', 0.34, 'clareza (foco + brilho)'],
    [W(3, 'direção') - 0.1, 'fio_desce', 0.42, 'direção (fio do prumo)'],
    [W(3, 'existe') - 0.25, 'morfismo', 0.36, 'coluna vira o celular'],
    [W(3, 'Prumo') - 0.02, 'cristal', 0.32, 'selo pulsa em «Prumo»'],
    [W(3, 'gestor') - 0.35, 'chicote_b', 0.40, 'cortina da agulha → claro'],
    [B(W(3, 'gestor') + 0.45, 0.12), 'marcador', 0.30, 'função 1'],
    [B(W(3, 'gestor') + 0.75, 0.12), 'marcador', 0.26, 'função 2'],
    [B(W(3, 'gestor') + 1.05, 0.12), 'marcador', 0.24, 'função 3'],
    [B(W(3, 'gestor') + 1.35, 0.12), 'marcador', 0.22, 'função 4'],
    // ato 4 · demonstração
    [W(4, 'acompanhar') - 0.3, 'mergulho', 0.40, 'mergulho na tela'],
    [a4.tab - 0.02, 'toque_ui', 0.55, 'toque: Movimentos'],
    [a4.tab + 0.35, 'chicote_a', 0.30, 'câmera sobe para a lista'],
    [a4.mov, 'item_lista', 0.42, 'linha nova 1'],
    [a4.mov + 0.3, 'item_lista', 0.34, 'linha nova 2'],
    [a4.mov + 0.6, 'item_lista', 0.28, 'linha nova 3'],
    [a4.row - 0.02, 'toque_ui', 0.48, 'toque: abre o detalhe'],
    [a4.row + 0.05, 'holofote', 0.30, 'detalhe expande'],
    [W(4, 'organizar') - 0.2, 'chicote_b', 0.34, 'chicote → filtro'],
    [a4.rec - 0.02, 'toque_ui', 0.50, 'toque: Receitas'],
    [a4.rec + 0.05, 'tela_divide', 0.40, 'lista se divide em colunas'],
    [a4.des - 0.02, 'toque_ui', 0.48, 'toque: Despesas'],
    [W(4, 'visualizar') - 0.25, 'chicote_a', 0.36, 'chicote vertical → agenda'],
    [a4.comp, 'marcador', 0.34, 'compromisso 1'],
    [a4.comp + 0.3, 'marcador', 0.28, 'compromisso 2'],
    [a4.comp + 0.6, 'marcador', 0.24, 'compromisso 3'],
    [a4.aviso, 'aviso_prumo', 0.46, 'lembrete desce (soco de câmera)'],
    [W(4, 'Tudo') - 0.2, 'chicote_b', 0.36, 'recuo rápido'],
    [B(W(4, 'simples')) - 0.04, 'papeis_pilha', 0.30, '«simples»: o excesso voa'],
    [B(W(4, 'clara')) - 0.04, 'foco', 0.34, '«clara»: luz atravessa'],
    [B(W(4, 'organizada')) - 0.04, 'encaixe', 0.44, '«organizada.»'],
    // ato 5
    [FIM(4) + 0.32, 'tela_divide', 0.46, 'a tela explode em 4 painéis'],
    [B(W(5, 'informações')), 'conexao', 0.36, 'conexões com pulsos de luz'],
    [W(5, 'acompanha') - 0.35, 'chicote_a', 0.42, 'voo → Pessoal · Negócio'],
    [W(5, 'acompanha') + 0.15, 'card_desliza', 0.30, 'itens se separam'],
    [B(W(5, 'responsabilidades')) - 0.35, 'chicote_b', 0.40, 'chicote → reserva'],
    [B(W(5, 'responsabilidades')), 'liquido', 0.36, 'reserva enche'],
    [B(B(W(5, 'responsabilidades')) + 1.0), 'cristal', 0.36, '✓ Reservado'],
    [MUS.V3 - 0.25, 'mergulho', 0.40, 'recuo para o fluxo (virada)'],
    [MUS.V3, 'particulas', 0.40, 'dinheiro em movimento'],
    [MUS.V3 + 0.1, 'chicote_b', 0.30, 'câmera mergulha em Entradas'],
    ...[0, 1, 2, 3].flatMap((c) => { const tc = B(MUS.V3 + 1.35 + c * 0.75); return [[tc - 0.35, 'card_desliza', 0.24, `câmera segue o fluxo → categoria ${c + 1}`], [tc, 'marcador', 0.30 - c * 0.03, `chega na categoria ${c + 1}`]]; }),
    [B(MUS.V3 + 4.6) - 0.2, 'chicote_a', 0.26, 'câmera recua'],
    [B(W(5, 'dinheiro')), 'fluxo', 0.36, 'fluxo se intensifica'],
    // ato 6 (efeitos mais discretos)
    [N[5] - 0.05, 'chicote_b', 0.28, 'volta ao canvas da abertura'],
    [W(6, 'Acompanhar') + 0.15, 'morfismo', 0.36, 'finanças entra no centro'],
    [MUS.V4 - 0.75, 'mergulho', 0.40, 'mergulho na bússola'],
    // ato 7 · assinatura
    [f7.settle - 1.07, 'logo_prumo', 0.72, 'LOGO SONORO: clique na trava em «Prumo.»'],
    [f7.settle + 0.72, 'cascata_letras', 0.36, 'letras «prumo»'],
    [W(7, 'organização') - 0.05, 'chicote_a', 0.30, 'palavras chegam em arco pelos lados'],
    [W(7, 'organização') + 0.4, 'slam_texto', 0.24, '«direção.» assenta'],
    [W(7, 'Mais', 2) + 0.1, 'encaixe', 0.34, '«no lugar.» encaixa'],
    [tCta - 0.1, 'fio_desce', 0.40, 'o fio do prumo desce do ícone'],
    [tCta + 0.22, 'tela_divide', 0.36, 'o fio se abre e vira o botão'],
    [tCta + 0.98, 'toque_ui', 0.55, 'toque'],
    [tCta + 1.02, 'ondulacao', 0.40, 'onda do toque'],
  ].sort((x, y) => x[0] - y[0]);
  // v6 · limpeza: dois sons a menos de 0,2 s → fica só o mais forte; sons fracos (<0,25) só se estiverem isolados por 0,4 s
  const out = [];
  for (const c of all) {
    const near = out.filter((o) => Math.abs(o[0] - c[0]) < 0.2);
    if (near.length && near.some((o) => o[2] >= c[2])) continue;
    for (const o of near) out.splice(out.indexOf(o), 1);
    if (c[2] < 0.25 && out.some((o) => Math.abs(o[0] - c[0]) < 0.4)) continue;
    out.push(c);
  }
  return out;
};
// Trilha: a edição (filtros, silêncio, cortes) já está no arquivo; aqui só o arco de volume × ducking sob a voz
export const TRILHA = { arquivo: 'audio/trilha.wav' };
const FALAS = () => N.map((n, i) => [n, FIM(i + 1)]);
const arco = (t) => interpolate(t, [0, MUS.freeze, MUS.V2, MUS.V2 + 0.01, N[3], MUS.V3, MUS.V4, DURACAO], [0.7, 0.95, 0.95, 1.15, 0.95, 1.2, 1.1, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
export const volTrilha = (t) => {
  let duck = 1;
  for (const [a, b] of FALAS()) { const d = t < a ? a - t : t > b ? t - b : 0; duck = Math.min(duck, interpolate(d, [0, 0.3], [0.38, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })); }
  return 0.5 * arco(t) * duck;
};
