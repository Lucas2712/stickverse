/* Cenas do vídeo. Uma chamada MDS.cena por cena do storyboard aprovado.
 * Tempos são absolutos (segundos do vídeo) e vêm de palavras.json / transcricao.md.
 * Referência rápida dos componentes: .claude/skills/motion-design-studio/referencias/componentes.md
 */
(() => {
  const { cena, anim, IN, OUT, h, tipo, ui, info, trans, fundo } = MDS;

  fundo.molduras({ z: 1 });

  cena({
    id: "abertura", nome: "Abertura", inicio: 0, fim: 3,
    descricao: "Descrição curta da direção da cena (aparece na lista ao lado do player).",
    sfx: [["whoosh", 2.7]],
    montar(S) {
      tipo.bloco(S, [
        { itens: [["Exemplo", .1]], size: 150 },
        { itens: [["de", .4], ["cena", .55, "ac"]], size: 150 },
      ], { top: 700 });
      anim(S, trans.saiZoom(2.75));
    },
  });
})();
