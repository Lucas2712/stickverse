// VÉRIA · O Compasso
// Geometria única do símbolo. Tudo (logo plana, ícone, fita 3D, linha de ritmo, acento do É) sai daqui.
// Construção por "tartaruga": retas e arcos com raios da mesma família, num quadro de 100 × 100.
// Ângulos em graus, sentido da tela (y para baixo): rumo 0 = direita, 90 = para baixo.

const rad = (g) => (g * Math.PI) / 180;

// Um traço = lista de passos: ["reta", comprimento] ou ["arco", raio, giro] (giro > 0 = horário na tela)
export function construir(inicio, rumo, passos) {
  let [x, y] = inicio, h = rumo;
  let d = `M${x.toFixed(3)} ${y.toFixed(3)}`;
  const pts = [[x, y]];
  for (const p of passos) {
    if (p[0] === "reta") {
      const nx = x + Math.cos(rad(h)) * p[1], ny = y + Math.sin(rad(h)) * p[1];
      for (let k = 1; k <= 40; k++) pts.push([x + (nx - x) * (k / 40), y + (ny - y) * (k / 40)]);
      x = nx; y = ny;
      d += ` L${x.toFixed(3)} ${y.toFixed(3)}`;
    } else {
      const [, r, giro] = p;
      const lado = giro > 0 ? 90 : -90; // centro do arco fica à direita (horário) ou à esquerda
      const cx = x + Math.cos(rad(h + lado)) * r, cy = y + Math.sin(rad(h + lado)) * r;
      const a0 = Math.atan2(y - cy, x - cx);
      const n = Math.max(8, Math.round(Math.abs(giro) / 3));
      for (let k = 1; k <= n; k++) {
        const a = a0 + rad(giro) * (k / n);
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      x = pts[pts.length - 1][0]; y = pts[pts.length - 1][1];
      h += giro;
      d += ` A${r} ${r} 0 ${Math.abs(giro) > 180 ? 1 : 0} ${giro > 0 ? 1 : 0} ${x.toFixed(3)} ${y.toFixed(3)}`;
    }
  }
  return { d, pts };
}

// caixa que contém os pontos
const caixa = (pts) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

// centraliza a construção no quadro 100 × 100 (com margem óptica)
function centralizar(inicio, rumo, passos, w) {
  const bruto = construir(inicio, rumo, passos);
  const [x0, y0, x1, y1] = caixa(bruto.pts);
  const dx = 50 - (x0 + x1) / 2, dy = 50 - (y0 + y1) / 2 + 1.2; // leve descida óptica: o peso fica no vértice
  const c = construir([inicio[0] + dx, inicio[1] + dy], rumo, passos);
  return { ...c, w, caixa: caixa(c.pts) };
}

// ---------- As três propostas do estudo ----------
// A · COMPASSO (escolhida): V de hastes retas, vértice em arco, e a haste direita se resolve numa
//     onda de dois arcos (crista + vale) com o mesmo raio. Ritmo visual: grande V, pequeno pulso.
const A = () =>
  centralizar([0, 0], 68, [
    ["reta", 54], ["arco", 11, -136], ["reta", 46], ["arco", 9, 124], ["arco", 9, -100],
  ], 10.5);

// B · BATIDA: V mais aberto e baixo; o pulso final é mais longo e se deita, apontando para a frente.
const B = () =>
  centralizar([0, 0], 58, [
    ["reta", 44], ["arco", 10, -116], ["reta", 30], ["arco", 7.5, 100], ["arco", 7.5, -100], ["reta", 10],
  ], 10.5);

// C · FITA: espinha da A desenhada como fita de espessura variável (fina no começo, cheia no vértice,
//     afinando na onda como a ponta de uma fita de cetim).
const C = () => ({ ...A(), fita: true });

export const PROPOSTAS = { A, B, C };
export const ESCOLHIDA = "A";
export const compasso = () => PROPOSTAS[ESCOLHIDA]();

// ---------- utilidades ----------
// reamostra com espaçamento uniforme (N pontos): base dos morphs da linha de ritmo
export function uniformizar(pts, N = 240) {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1], out = [];
  let j = 0;
  for (let i = 0; i < N; i++) {
    const dd = (i / (N - 1)) * tot;
    while (j < L.length - 2 && L[j + 1] < dd) j++;
    const f = (dd - L[j]) / (L[j + 1] - L[j] || 1);
    out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f]);
  }
  return out;
}

// contorno de uma fita de largura variável w(t) (t = 0..1 ao longo da linha); pontas redondas à parte
export function contorno(pts, w) {
  const E = [], D = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const n = Math.hypot(nx, ny) || 1;
    nx /= n; ny /= n;
    const h = w(i / (pts.length - 1)) / 2;
    E.push([pts[i][0] + nx * h, pts[i][1] + ny * h]);
    D.push([pts[i][0] - nx * h, pts[i][1] - ny * h]);
  }
  const f = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const cap = (p, r) => `M${(p[0] - r).toFixed(2)} ${p[1].toFixed(2)} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return `M${E.map(f).join(" L")} L${D.reverse().map(f).join(" L")} Z ` + cap(pts[0], w(0) / 2) + " " + cap(pts[pts.length - 1], w(1) / 2);
}

// O PULSO: o trecho final do símbolo (subida curta + crista + vale) isolado.
// É o acento do É, o marcador de gráficos e o "batimento" da linha de ritmo.
export function pulso() {
  return construir([0, 0], -56, [["reta", 7], ["arco", 9, 124], ["arco", 9, -100]]);
}

// O ACENTO: um agudo (sobe para a direita, inclinação de acento) desenhado como uma onda delicada:
// o traço faz um S suave ao longo do eixo. Lê-se como É, mas carrega o pulso.
export function acentoOnda() {
  return construir([0, 0], -30, [["arco", 16, -26], ["arco", 16, 26]]);
}

export const larguraFita = (t) => {
  const entra = Math.sin(Math.min(1, t / 0.22) * Math.PI / 2);
  const sai = t > 0.72 ? 1 - 0.62 * ((t - 0.72) / 0.28) ** 1.3 : 1;
  return 3 + 9 * entra * sai;
};
