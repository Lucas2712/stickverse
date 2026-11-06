/* Demo dos componentes: um uso de cada componente do estúdio (sem narração). */
(() => {
  const { cena, anim, IN, OUT, h, tipo, ui, info, trans, fundo } = MDS;
  fundo.grade({ z: 1, passo: 64 });

  cena({ id: "tipo", nome: "Tipografia", inicio: 0, fim: 3, z: 40, descricao: "bloco com escalas, marcador e risco",
    sfx: [["boom", .5], ["whoosh", 2.7]],
    montar(S) {
      const [a, b, c] = tipo.bloco(S, [
        { itens: [["Dados", .1]], size: 110, peso: 500, fonte: "var(--v-sans)" },
        { itens: [["contam", .3], ["histórias", .5, "ac"]], size: 128, peso: 850 },
        { itens: [["não", .9], ["achismos", 1.05]], size: 110, peso: 700 },
      ], { top: 560 });
      tipo.marcador(b.querySelectorAll(".mask")[1], .9);
      tipo.risco(c.querySelectorAll(".mask")[1], 1.5);
      anim(S, trans.saiZoom(2.75));
    } });

  cena({ id: "numeros", nome: "KPI e barras", inicio: 3, fim: 6, z: 41, descricao: "contador grande e barras com destaque",
    sfx: [["hit", 3.2], ["pop", 4.0]],
    montar(S) {
      trans.circulo(S, 2.85, { x: 540, y: 960, d: .6 });
      info.kpi(S, { x: 90, y: 300, rotulo: "Usuários ativos", ate: 128400, t: 3.1, d: 1.1, tamanho: 150 });
      info.barras(S, { x: 90, y: 680, w: 900, h: 620, t: 3.6, dados: [{ rotulo: "2022", valor: 40 }, { rotulo: "2023", valor: 62 }, { rotulo: "2024", valor: 81 }, { rotulo: "2025", valor: 128, destaque: true }] });
      anim(S, trans.chicoteSai(5.75));
    } });

  cena({ id: "mapa", nome: "Mapa", inicio: 6, fim: 9, z: 42, descricao: "câmera viaja ao Brasil, destaque, pino e arco",
    sfx: [["swoosh", 5.8], ["ding", 7.2]],
    montar(S) {
      MDS.mapa(S, { x: 0, y: 300, w: 1080, h: 1150, terra: "#DCE4F2",
        destaques: [{ pais: "Brasil", t: 6.9 }, { pais: "Portugal", t: 7.6 }],
        pinos: [{ lat: -23.55, lon: -46.63, t: 7.2, rotulo: "São Paulo" }],
        arcos: [{ de: [-23.55, -46.63], para: [38.72, -9.14], t: 7.7, d: 1 }],
        camera: [[6, { lat: 15, lon: 0, zoom: 1 }], [6.9, { lat: -12, lon: -48, zoom: 3 }], [7.7, { lat: -12, lon: -48, zoom: 3 }], [8.6, { lat: 10, lon: -25, zoom: 1.8 }]] });
      anim(S, [...trans.chicoteEntra(5.75), ...trans.saiFundo(8.75)]);
    } });

  cena({ id: "app", nome: "Celular e conversa", inicio: 9, fim: 12, z: 43, descricao: "notificação, chat, cursor e toast",
    sfx: [["ding", 9.3], ["send", 10.1], ["click", 11.0], ["chime", 11.1]],
    montar(S) {
      const { el, tela } = ui.celular(S, { x: 300, y: 380, w: 480, h: 960 });
      ui.chat(tela, [{ de: "eu", texto: "Quanto cresceu?", t: 9.6 }, { de: "ia", texto: "58% em um ano.", t: 10.2, digitar: 30 }], { top: 40, largura: 300 });
      const n = ui.notificacao(S, { x: 110, y: 280, w: 860, app: "Relatórios", letra: "R", texto: "Seu resumo semanal está pronto" });
      anim(n, [...IN(9.2, { dy: -120, s: .95 }), ...OUT(10.6, { dy: -120 })]);
      const bt = ui.botao(tela, { x: 30, y: 700, w: 364, h: 110, texto: "Ver relatório", cor: "var(--v-ac)", tamanho: 34 });
      anim(bt, [...IN(10.5, { dy: 30 }), ...ui.clique(bt, 11.0)]);
      ui.cursor(S, [[10.4, 900, 1500], [10.9, 520, 1140]], [11.0]);
      ui.toast(S, { x: 540, y: 1380, texto: "Relatório aberto", t: 11.1, ate: 11.8 });
      anim(el, [...trans.entraDeBaixo(8.85), ...trans.saiZoom(11.8)]);
    } });

  cena({ id: "graficos", nome: "Linha e donut", inicio: 12, fim: 15, z: 44, descricao: "gráfico de linha com área e donut",
    sfx: [["swell", 12.0], ["pop", 13.6]],
    montar(S) {
      info.linha(S, { x: 90, y: 300, w: 900, h: 520, t: 12.3, d: 1.2, pontos: [12, 18, 15, 26, 31, 29, 44], rotulos: ["jan", "", "mar", "", "mai", "", "jul"], final: "+267%" });
      info.donut(S, { x: 330, y: 940, r: 170, valor: 72, t: 13.5 });
      anim(S, [...trans.entraZoom(11.85), ...trans.saiParaCima(14.75)]);
    } });

  cena({ id: "ui", nome: "Janela, busca e lista", inicio: 15, fim: 18, z: 45, descricao: "busca digitando, checklist e progresso",
    sfx: [["whoosh", 14.8], ["tick", 16.3], ["tick", 16.6]],
    montar(S) {
      const sb = ui.busca(S, { x: 110, y: 300, w: 860, texto: "relatório trimestral", t: 15.2 });
      anim(sb, IN(14.9));
      const { el, corpo } = ui.janela(S, { x: 110, y: 500, w: 860, h: 520, titulo: "Checklist", direita: "3 itens", padding: "0" });
      ui.checklist(corpo, [["Coletar dados", 16.3, "ok"], ["Montar gráficos", 16.6], ["Revisar números", 17.0]]);
      anim(el, IN(15.6));
      const pr = info.progresso(S, { x: 110, y: 1090, w: 820, t: 16.2, d: 1, ate: 100, rotulo: "Progresso" });
      anim(pr, IN(16.0, { dy: 40 }));
      anim(S, trans.entraDeBaixo(14.75));
      const cmp = h("div", "", S); info.comparacao(cmp, { y: 1200, esquerda: { rotulo: "antes", valor: 3, sufixo: "h" }, direita: { rotulo: "depois", valor: 20, sufixo: "min" }, t: 17.0, h: 200 });
    } });
})();
