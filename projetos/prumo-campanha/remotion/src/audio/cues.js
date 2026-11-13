// Efeitos sonoros: [segundo, arquivo, ganho, evento visual, duração opcional]. Todos calculados a partir das palavras.
import { W, FIM, N, DURACAO, B, MUS } from './timeline';
import { interpolate } from 'remotion';
import { FB, IRIS } from '../scenes/C_Marca';
import { FH } from '../scenes/H_Final';
export const SFX = () => {
  const mas = W(1, 'Mas'), fb = FB(), fh = FH();
  const tTabMov = B(W(4, 'acompanhar') + 0.45), tRow = B(W(4, 'movimentações') + 1.25), tTabAg = B(W(4, 'visualizar') + 0.35);
  const tAviso = B(W(4, 'compromissos') + 0.75), tCta = FIM(7) + 0.25, tTap = tCta + 0.95;
  return [
    // ato 1 · a mesa
    [0.0, 'ambiente_escritorio', 0.55, 'ambiente da sala (luz de janela)'],
    [W(1, 'clientes') - 0.02, 'bolha_msg', 0.42, 'bolha de mensagem sai do notebook'],
    [W(1, 'vendas') - 0.02, 'cupom_impressora', 0.38, 'cupom sai da maquininha'],
    [W(1, 'pagamentos') - 0.02, 'celular_vibra', 0.42, 'celular vibra na madeira'],
    [W(1, 'operação') - 0.02, 'calendario', 0.40, 'página do calendário vira'],
    [mas + 0.35, 'papeis_pilha', 0.40, 'papéis começam a se acumular'],
    [mas + 1.6, 'papel_mesa', 0.28, 'mais papéis deslizam'],
    [W(1, 'manter'), 'calculadora', 0.32, 'teclas da calculadora'],
    [W(1, 'grande') - 0.05, 'peso_desafio', 0.48, '«um grande desafio»'],
    // ato 2 · o problema
    [W(2, 'Quando') - 0.35, 'papel_mesa', 0.32, 'mergulho nos papéis'],
    [W(2, 'entra') - 0.08, 'seta_entra', 0.40, 'setas azuis entram'],
    [W(2, 'sai') - 0.05, 'seta_sai', 0.40, 'setas escuras saem'],
    [W(2, 'precisa') - 0.02, 'carimbo', 0.42, 'boleto carimbado 1'],
    [W(2, 'precisa') + 0.2, 'carimbo', 0.30, 'boleto carimbado 2'],
    [W(2, 'precisa') + 0.42, 'carimbo', 0.24, 'boleto carimbado 3'],
    [W(2, 'precisa') + 0.58, 'documentos_tapa', 0.34, 'planilha 1 desliza por cima'],
    [W(2, 'precisa') + 0.88, 'documentos_tapa', 0.26, 'planilha 2 desliza por cima'],
    [W(2, 'fica') - 0.02, 'congelar', 0.46, 'a composição congela'],
    // a bússola (marca entre 22 e 25 s)
    [fb.a - 0.02, 'agulha_surge', 0.48, 'agulha surge no caos'],
    [fb.spin, 'agulha_gira', 0.42, 'agulha gira procurando a direção'],
    [W(2, 'negócio') - 0.72, 'lamina_limpa', 0.36, 'lâmina branca limpa a tela'],
    [fb.settle - 0.05, 'assinatura_logo', 0.62, 'ASSINATURA: agulha trava ↓ e vira o ícone'],
    // apresentação
    [W(3, 'organização') - 0.15, 'encaixe', 0.34, 'cards se encaixam 1'],
    [W(3, 'organização') + 0.2, 'encaixe', 0.26, 'cards se encaixam 2'],
    [W(3, 'clareza') - 0.05, 'foco', 0.40, 'desfoque some'],
    [W(3, 'direção') - 0.05, 'fio_desce', 0.42, 'fio de prumo desce pela coluna'],
    [W(3, 'existe') - 0.3, 'telas_flutuam', 0.32, 'celular sobe com o app'],
    [W(3, 'Prumo') - 0.02, 'cristal', 0.34, '«Prumo» · marca pulsa'],
    [W(3, 'gestor') - 0.2, 'revelacao', 0.34, 'abre para o claro'],
    [W(3, 'pequenos'), 'marcador', 0.30, 'pílula «para pequenos negócios»'],
    // demonstrações
    [tTabMov - 0.02, 'toque_ui', 0.55, 'toque: aba Movimentos'],
    [tTabMov + 0.08, 'card_desliza', 0.30, 'tela desliza'],
    [B(W(4, 'movimentações')), 'item_lista', 0.40, 'linha nova 1'],
    [B(W(4, 'movimentações')) + 0.302, 'item_lista', 0.32, 'linha nova 2'],
    [B(W(4, 'movimentações')) + 0.604, 'item_lista', 0.26, 'linha nova 3'],
    [tRow - 0.02, 'toque_ui', 0.45, 'toque: abre a linha'],
    [B(W(4, 'receitas')) - 0.02, 'toque_ui', 0.50, 'toque: Receitas'],
    [B(W(4, 'receitas')) + 0.05, 'card_desliza', 0.26, 'despesas saem da lista'],
    [B(W(4, 'despesas')) - 0.02, 'toque_ui', 0.50, 'toque: Despesas'],
    [B(W(4, 'despesas')) + 0.05, 'card_desliza', 0.26, 'receitas saem da lista'],
    [tTabAg - 0.02, 'toque_ui', 0.50, 'toque: aba Agenda'],
    [tTabAg + 0.08, 'card_desliza', 0.28, 'tela desliza'],
    [B(W(4, 'compromissos')), 'marcador', 0.34, 'compromisso 1 acende'],
    [B(W(4, 'compromissos')) + 0.302, 'marcador', 0.28, 'compromisso 2 acende'],
    [B(W(4, 'compromissos')) + 0.604, 'marcador', 0.24, 'compromisso 3 acende'],
    [tAviso, 'aviso_prumo', 0.46, 'lembrete do Prumo desce'],
    [B(W(4, 'simples')) - 0.05, 'bolha_msg', 0.32, '«simples»'],
    [B(W(4, 'clara')) - 0.05, 'foco', 0.32, '«clara»'],
    [B(W(4, 'organizada')) - 0.05, 'encaixe', 0.40, '«organizada»'],
    // clareza
    [B(N[4] - 0.25), 'telas_flutuam', 0.36, 'quatro telas entram em órbita'],
    [W(5, 'informações'), 'conexao', 0.34, 'linhas conectam as telas'],
    [W(5, 'acompanha') + 0.2, 'card_desliza', 0.28, 'Pessoal · Negócio se separam'],
    [B(W(5, 'responsabilidades')), 'liquido', 0.36, 'reserva de impostos enche'],
    [B(W(5, 'responsabilidades') + 1.1), 'cristal', 0.34, '✓ Reservado'],
    [B(W(5, 'enxergar') + 0.1), 'barras_sobem', 0.36, 'barras do relatório sobem'],
    [B(W(5, 'dinheiro') - 0.15), 'fluxo', 0.40, 'o dinheiro corre pelas categorias'],
    // transformação (efeitos reduzidos para valorizar a narração)
    [FIM(5) + 0.45, 'ambiente_escritorio', 0.45, 'a mesa, agora organizada'],
    [W(6, 'Acompanhar') + 0.6, 'fio_desce', 0.30, 'fio de prumo desce sobre a mesa'],
    [FIM(6) + 0.3, 'revelacao', 0.30, 'abre para o branco'],
    // final
    [fh.settle - 0.1, 'assinatura_bussola', 0.66, 'ASSINATURA: bússola gira, trava e vira o ícone'],
    [tCta, 'marcador', 0.30, 'botão entra'],
    [tTap - 0.02, 'toque_ui', 0.55, 'toque no botão'],
    [tTap + 0.02, 'ondulacao', 0.40, 'onda do toque'],
  ].sort((x, y) => x[0] - y[0]);
};
// Trilha (CC0, editada nos tempos fortes): volume conforme a história × ducking sob a voz
export const TRILHA = { arquivo: 'audio/trilha.wav' };
const FALAS = () => N.map((n, i) => [n, FIM(i + 1)]);
const arco = (t) => interpolate(t,
  [0, 22.9, MUS.freeze, MUS.V2 - 0.02, MUS.V2, N[4], MUS.V3 - 0.02, MUS.V3, MUS.V4, DURACAO],
  [0.62, 0.78, 0.6, 0.6, 1.0, 0.9, 1.05, 1.18, 1.12, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
export const volTrilha = (t) => {
  // distância até a fala mais próxima → ducking suave (0,25 s de rampa)
  let duck = 1;
  for (const [a, b] of FALAS()) {
    const d = t < a ? a - t : t > b ? t - b : 0;
    duck = Math.min(duck, interpolate(d, [0, 0.3], [0.36, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  }
  return 0.5 * arco(t) * duck;
};
