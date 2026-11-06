# Componentes do estúdio (API)

Tudo está em `window.MDS`. Palco 1080×1920 px; tempos em segundos absolutos do vídeo.
Projeto de referência completo: `projetos/comercial-ia/cenas.js`.

## Motor (`studio/motor/motor.js`)

```js
const { cena, anim, IN, OUT, VIS, h, fx, prog, svg, sel, path, draw, typeText, counter, floaty, classAt, at, palco,
        tipo, ui, info, trans, fundo } = MDS;

cena({ id, nome, inicio, fim, descricao, z: 40, margem: .8, sfx: [["whoosh", 2.6]], montar(S) { ... } });
// S = raiz da cena (a "câmera"). Fica no DOM só entre inicio-margem e fim+margem.

anim(el, [[t, {x, y, s, sx, sy, r, rx, ry, o, b}, "curva"], ...])   // UMA chamada por elemento; some chaves: [...IN(t), ...OUT(t2)]
IN(t, {dy, dx, s, b, d, r, e})     OUT(t, {dy, dx, s, b, d, e})     VIS(a, b)
h(tag, classe, pai, html, css)     // cria elemento
fx(t => ...)                       // efeito por quadro (texto, cor, SVG); deve ser função pura do tempo
draw(pathSVG, a, b)  typeText(el, texto, t0, cps, cursor, esconderEm)  counter(el, de, ate, a, b, formato)
floaty(el, amp, vel, fase)  classAt(el, "classe", a, b)  at(a, on => ..., b)
MDS.sfx(tipo, t, ganho)            // efeito sonoro avulso
```
Curvas: `lin out out5 expo in inExpo inOut inOutExpo sine back backSoft elastic`.

## Tipografia (`tipo`)
```js
tipo.palavra(pai, "texto", t, { size, cls: "ac", d, de: "baixo"|"cima" })
tipo.linha(pai, [["O", 20.5], ["futuro", 20.64, "ac"]], { top, size, peso, fonte, cor, alinhar, left, width })
tipo.bloco(pai, [{ itens, size, peso, gap }, ...], { top })      // linhas com escalas diferentes
tipo.letras(pai, "tudo", t, { size, stagger })
tipo.marcador(spanEl, t, { cor })   tipo.risco(spanEl, t)
```
Classes úteis: `.hl` (linha centralizada absoluta), `.ac` (cor de destaque), `.mute`.

## Interface (`ui`)
```js
const { el, corpo } = ui.janela(S, { x, y, w, h, titulo, direita })
ui.chip(S, { x, y, texto, variante: "soft"|"ink"|"line", centro, tamanho })
ui.notificacao(S, { x, y, w, app, cor, letra, titulo, texto, hora })
const { el, tela } = ui.celular(S, { x, y, w, h })
ui.checklist(contêiner, [["Item", tMarcar, "detalhe"], ...])
ui.chat(contêiner, [{ de: "eu"|"ia", texto, t, digitar: cps, altura }])
ui.busca(S, { x, y, w, texto, t, cps })
ui.botao(S, { x, y, w, h, texto, cor })      ui.clique(el, t) → chaves para anim
ui.cursor(S, [[t, x, y], ...], [tClique])    ui.toast(S, { x, y, texto, t, ate })
```
A entrada do contêiner é sempre sua: `anim(el, [...IN(t), ...OUT(t2)])`.

## Infográficos (`info`)
```js
info.kpi(S, { x, y, w, rotulo, de, ate, t, d, prefixo, sufixo, casas, tamanho, alinhar })
info.barras(S, { x, y, w, h, dados: [{ rotulo, valor, destaque }], t, stagger, max, formato })
info.ranking(S, { x, y, w, dados, t, stagger, larguraRotulo })
info.linha(S, { x, y, w, h, pontos: [..], rotulos: [..], t, d, min, max, final: "texto" })
info.donut(S, { x, y, r, valor, t, d, centro })
info.progresso(S, { x, y, w, t, d, ate, rotulo })
info.comparacao(S, { y, esquerda: { rotulo, valor, sufixo }, direita: {...}, t })
```

## Mapa (`MDS.mapa`)
```js
MDS.mapa(S, { x: 0, y: 300, w: 1080, h: 1100,
  destaques: [{ pais: "Brasil", t: 3.2 }],                  // PT, inglês ou código ISO numérico
  pinos: [{ lat: -23.55, lon: -46.63, t: 3.6, rotulo: "São Paulo" }],
  arcos: [{ de: [-23.5, -46.6], para: [38.7, -9.1], t: 4, d: 1.2 }],
  camera: [[3, { lat: 10, lon: 0, zoom: 1 }], [4, { lat: -15, lon: -52, zoom: 3.2 }]] })
```

## Transições (`trans`)
Chaves de câmera (somar em um `anim(S, [...])`): `entraZoom saiZoom entraFundo saiFundo chicoteEntra chicoteSai entraDeBaixo saiParaCima`.
Recortes (independentes): `trans.circulo(S, t, {x, y, d})`, `trans.cortina(S, t, {lado})`, `trans.diagonal(S, t)`. Camada: `trans.flash(t)`.

## Fundos e fio condutor (`fundo`, `MDS.traco`)
```js
fundo.molduras({ z: 1, n, seed })  fundo.grade({ passo })  fundo.manchas({ cores })  fundo.grao({ opac })
MDS.traco({ z: 30, largura: 46, cores: [[0, "#FFFFFF"], [.4, "#00C2FF"], ...], poses: { a: [[x,y] ×9], b: MDS.traco.anel(540, 1080, 280, 280) },
            roteiro: [[0, "a"], [2.5, "a"], [3.4, "b"]], desenho: [0, 1.2] })
```

## Legendas (`projeto.json → legendas`)
`{ ativo, y: 1430, tamanho: 64, peso: 600, destaques: ["palavra", ...], ocultar: [[de, ate], ...], maxPalavras: 4 }`
Agrupamento automático por pontuação, pausas e tamanho. Linhas largas encolhem para caber.
