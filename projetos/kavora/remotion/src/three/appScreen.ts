// Tela do app KAVORA desenhada em canvas 2D, quadro a quadro (determinística).
// Vira textura do smartphone 3D. Os ícones são os mesmos Path2D dos cartões da cena.
import {ICON} from '../lib/icons';
import {GLYPHS, partD} from '../lib/glyphs';
import {clamp, E, brl} from '../lib/anim';

const F = 'InterK, sans-serif';
const OR = '#FF7138', ORL = '#FFA36B', GR = '#202124', OFF = '#F7F7F5', GY = '#E8E8E6', MUTED = '#8A8B8F';

const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
};

const icon = (c: CanvasRenderingContext2D, name: string, x: number, y: number, size: number, color: string, lw = 1.9) => {
  c.save();
  c.translate(x, y);
  c.scale(size / 24, size / 24);
  c.strokeStyle = color;
  c.lineWidth = lw;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke(new Path2D(ICON[name]));
  c.restore();
};

const kGlyph = (c: CanvasRenderingContext2D, x: number, y: number, h: number, color: string) => {
  c.save();
  c.translate(x, y);
  c.scale(h, h);
  c.fillStyle = color;
  for (const p of GLYPHS.K.parts) c.fill(new Path2D(partD(p)), 'evenodd');
  c.restore();
};

const ease = (x: number) => E.out(clamp(x));

export const ROWS = [
  {icon: 'fuel', label: 'Combustível', sub: '4 abastecimentos', v: 612.4, c: OR},
  {icon: 'wrench', label: 'Manutenção', sub: 'Troca de pastilhas', v: 389.0, c: ORL},
  {icon: 'shield', label: 'Seguro', sub: 'Parcela 8 de 12', v: 198.2, c: GR},
  {icon: 'tax', label: 'Impostos', sub: 'Licenciamento', v: 85.0, c: '#B9BAB8'},
];
export const TOTAL = 1284.6;
export const BUDGET = 1500;

/** p: 0..1 do "boot" da tela; t: segundos locais (para pulsos); alert: 0..1 da notificação. */
export const drawApp = (c: CanvasRenderingContext2D, W: number, H: number, p: number, t: number, alert = 0) => {
  const u = W / 390; // unidade = 1 ponto de iPhone
  c.save();
  c.clearRect(0, 0, W, H);
  c.fillStyle = OFF;
  c.fillRect(0, 0, W, H);
  c.scale(u, u);
  const w = 390;

  // barra de status + ilha
  c.fillStyle = GR;
  c.font = `600 15px ${F}`;
  c.textBaseline = 'middle';
  c.fillText('9:41', 34, 30);
  c.fillStyle = '#111';
  rr(c, w / 2 - 56, 14, 112, 33, 17);
  c.fill();
  c.fillStyle = GR;
  rr(c, w - 62, 24, 25, 12, 3.5);
  c.fill();
  c.fillRect(w - 36, 27.5, 2, 5);
  for (let i = 0; i < 4; i++) c.fillRect(w - 104 + i * 5, 34 - (i + 1) * 2.6, 3, (i + 1) * 2.6);

  // cabeçalho
  const hp = ease(p * 3);
  c.globalAlpha = hp;
  c.fillStyle = MUTED;
  c.font = `500 14px ${F}`;
  c.fillText('Meu veículo · Sedan 2022', 24, 82 + (1 - hp) * 10);
  c.fillStyle = GR;
  c.font = `700 30px ${F}`;
  c.fillText('Novembro', 24, 112 + (1 - hp) * 10);
  // avatar com K
  c.fillStyle = OR;
  rr(c, w - 68, 76, 44, 44, 12);
  c.fill();
  kGlyph(c, w - 68 + 22 - 0.74 * 22 * 0.5 + 0.5, 76 + 11, 22, '#fff');
  c.globalAlpha = 1;

  // cartão principal (grafite)
  const cp = ease(p * 2.2 - 0.15);
  const cy = 142 + (1 - cp) * 30;
  c.globalAlpha = cp;
  c.save();
  c.shadowColor = 'rgba(17,17,17,0.25)';
  c.shadowBlur = 24;
  c.shadowOffsetY = 10;
  const g = c.createLinearGradient(0, cy, 0, cy + 186);
  g.addColorStop(0, '#2a2b2f');
  g.addColorStop(1, GR);
  c.fillStyle = g;
  rr(c, 18, cy, w - 36, 186, 26);
  c.fill();
  c.restore();
  // brasa laranja no canto
  const rg = c.createRadialGradient(w - 40, cy + 186, 0, w - 40, cy + 186, 170);
  rg.addColorStop(0, 'rgba(255,113,56,0.45)');
  rg.addColorStop(1, 'rgba(255,113,56,0)');
  c.save();
  rr(c, 18, cy, w - 36, 186, 26);
  c.clip();
  c.fillStyle = rg;
  c.fillRect(0, cy, w, 200);
  c.restore();
  c.fillStyle = 'rgba(255,255,255,0.6)';
  c.font = `500 14px ${F}`;
  c.fillText('Gasto no mês', 40, cy + 34);
  const cnt = ease((p - 0.15) * 1.6);
  c.fillStyle = '#fff';
  c.font = `700 40px ${F}`;
  c.fillText(brl(TOTAL * cnt), 40, cy + 76);
  c.fillStyle = 'rgba(255,255,255,0.55)';
  c.font = `500 13px ${F}`;
  c.fillText(`de ${brl(BUDGET, 0)} planejados`, 40, cy + 108);
  // barra de orçamento
  c.fillStyle = 'rgba(255,255,255,0.12)';
  rr(c, 40, cy + 132, w - 80, 10, 5);
  c.fill();
  const bw = (w - 80) * (TOTAL / BUDGET) * cnt;
  const bg = c.createLinearGradient(40, 0, 40 + bw, 0);
  bg.addColorStop(0, ORL);
  bg.addColorStop(1, OR);
  c.fillStyle = bg;
  rr(c, 40, cy + 132, Math.max(10, bw), 10, 5);
  c.fill();
  c.fillStyle = ORL;
  c.font = `600 13px ${F}`;
  c.fillText(`${(85.6 * cnt).toFixed(1).replace('.', ',')}% do orçamento`, 40, cy + 164);
  c.globalAlpha = 1;

  // mini-gráfico de 6 meses
  const mp = ease(p * 2 - 0.45);
  const my = 346;
  c.globalAlpha = clamp(mp * 2);
  c.fillStyle = '#fff';
  c.save();
  c.shadowColor = 'rgba(32,33,36,0.08)';
  c.shadowBlur = 16;
  c.shadowOffsetY = 6;
  rr(c, 18, my, w - 36, 120, 22);
  c.fill();
  c.restore();
  c.fillStyle = GR;
  c.font = `600 14px ${F}`;
  c.fillText('Histórico', 36, my + 26);
  c.fillStyle = MUTED;
  c.font = `500 12px ${F}`;
  c.fillText('últimos 6 meses', 112, my + 26);
  const vals = [0.62, 0.8, 0.55, 0.92, 0.7, 0.86];
  const meses = ['jun', 'jul', 'ago', 'set', 'out', 'nov'];
  vals.forEach((v, i) => {
    const bx = 40 + i * 54, bh = 52 * v * ease(mp * 1.4 - i * 0.08);
    c.fillStyle = i === 5 ? OR : GY;
    rr(c, bx, my + 96 - bh, 26, Math.max(bh, 2), 7);
    c.fill();
    c.fillStyle = MUTED;
    c.font = `500 10px ${F}`;
    c.fillText(meses[i], bx + 3, my + 108);
  });
  c.globalAlpha = 1;

  // lista de categorias
  ROWS.forEach((r, i) => {
    const rp = ease(p * 2.2 - 0.7 - i * 0.12);
    if (rp <= 0) return;
    const y = 482 + i * 68 + (1 - rp) * 24;
    c.globalAlpha = rp;
    c.fillStyle = '#fff';
    rr(c, 18, y, w - 36, 58, 18);
    c.fill();
    c.fillStyle = 'rgba(255,113,56,0.12)';
    rr(c, 30, y + 9, 40, 40, 12);
    c.fill();
    icon(c, r.icon, 38, y + 17, 24, OR);
    c.fillStyle = GR;
    c.font = `600 15px ${F}`;
    c.fillText(r.label, 84, y + 22);
    c.fillStyle = MUTED;
    c.font = `500 12px ${F}`;
    c.fillText(r.sub, 84, y + 40);
    c.fillStyle = GR;
    c.font = `600 15px ${F}`;
    c.textAlign = 'right';
    c.fillText(brl(r.v), w - 34, y + 30);
    c.textAlign = 'left';
  });
  c.globalAlpha = 1;

  // notificação de revisão (desce do topo)
  if (alert > 0) {
    const a = ease(alert);
    const ny = -90 + a * 150;
    c.save();
    c.shadowColor = 'rgba(17,17,17,0.22)';
    c.shadowBlur = 30;
    c.shadowOffsetY = 12;
    c.fillStyle = 'rgba(255,255,255,0.97)';
    rr(c, 14, ny, w - 28, 76, 22);
    c.fill();
    c.restore();
    c.fillStyle = OR;
    rr(c, 26, ny + 14, 48, 48, 14);
    c.fill();
    icon(c, 'wrench', 38, ny + 26, 24, '#fff', 2);
    c.fillStyle = GR;
    c.font = `700 14px ${F}`;
    c.fillText('Revisão dos 30.000 km', 86, ny + 30);
    c.fillStyle = MUTED;
    c.font = `500 13px ${F}`;
    c.fillText('Faltam 12 dias · toque para agendar', 86, ny + 50);
    c.fillStyle = MUTED;
    c.font = `500 11px ${F}`;
    c.textAlign = 'right';
    c.fillText('agora', w - 30, ny + 28);
    c.textAlign = 'left';
  }

  // barra de abas
  c.fillStyle = 'rgba(255,255,255,0.96)';
  rr(c, 18, 772, w - 36, 64, 32);
  c.fill();
  ['home', 'chart', 'calendar', 'user'].forEach((n, i) => {
    const x = 48 + i * 86;
    if (i === 0) {
      c.fillStyle = 'rgba(255,113,56,0.14)';
      rr(c, x - 14, 784, 52, 40, 20);
      c.fill();
    }
    icon(c, n, x, 792, 24, i === 0 ? OR : MUTED);
  });
  c.fillStyle = '#111';
  rr(c, w / 2 - 67, 846, 134, 5, 2.5);
  c.fill();
  c.restore();
  void t;
};

// Altura lógica da tela: 390 × 856 pontos (proporção da tela do aparelho 3D)
export const SCREEN_RATIO = 856 / 390;
