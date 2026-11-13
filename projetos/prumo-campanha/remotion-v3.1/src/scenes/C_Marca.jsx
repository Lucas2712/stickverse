import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, lerp, inOut, expoIn, expoOut } from '../animations/motion';
import { W, WE } from '../audio/timeline';
import { BlueBg, LightBg } from '../components/Stage';
import { Compass } from '../components/Compass';
import { Wordmark, AppIcon } from '../components/Brand';
import { Phone } from '../components/Phone';
import { Home } from '../components/Screens';
import { DemoTag } from '../components/AppUI';

// A BÚSSOLA surge no caos congelado (≈24,8 s), procura a direção enquanto a frase do problema termina,
// trava apontando para baixo e vira o ícone; a íris azul revela a marca. Depois: organização → clareza → direção → app.
export const FB = () => {
  const a = W(2, 'entender') - 0.1;
  return { a, spin: a + 0.55, settle: WE(2, 'negócio') - 0.95, morph: WE(2, 'negócio') - 0.15 };
};
export const IRIS = () => FB().morph + 0.45;
const rnd = (i, k) => Math.sin(i * 127.1 + k * 311.7) * 0.5 + 0.5;
export const C_Marca = ({ a }) => {
  const t = useT(a);
  const f = FB(), tIris = IRIS();
  const iris = prog(t, tIris, 0.7, inOut);
  const wm = spr(t, tIris + 0.25, { damping: 14, stiffness: 130 });
  const up = prog(t, W(3, 'Foi') - 0.1, 0.8, inOut);            // logo sobe para dar lugar à demonstração
  const tOrg = W(3, 'organização'), tCla = W(3, 'clareza'), tDir = W(3, 'direção'), tPrumo = W(3, 'Prumo');
  const toPhone = prog(t, W(3, 'existe') - 0.35, 0.9, inOut);
  const phoneK = spr(t, W(3, 'existe') - 0.3, { damping: 16, stiffness: 110 });
  const light = prog(t, W(3, 'gestor') - 0.2, 0.7, inOut);       // azul → claro
  const pill1 = spr(t, W(3, 'gestor'), { damping: 13, stiffness: 150 });
  const pill2 = spr(t, W(3, 'pequenos'), { damping: 13, stiffness: 150 });
  const pillsOut = prog(t, W(4, 'Com') - 0.55, 0.35, expoIn);
  const pulse = t > tPrumo ? Math.exp(-(t - tPrumo) * 4) : 0;
  const lineK = prog(t, tDir - 0.05, 0.6, expoOut);
  const iconY = lerp(860, 300, up), iconS = lerp(1, 0.5, up);
  const sweep = (word) => prog(t, word - 0.08, 0.35);
  const wordOut = (next) => prog(t, next - 0.12, 0.2, expoIn);
  return (
    <AbsoluteFill>
      {/* íris azul a partir do ícone */}
      <AbsoluteFill style={{ clipPath: `circle(${iris * 130}% at 540px ${iconY}px)` }}>
        <BlueBg t={t}>
          {/* cards do caos voltam e se orientam numa coluna */}
          {Array.from({ length: 6 }, (_, i) => {
            const k = spr(t, tOrg - 0.25 + i * 0.09, { damping: 15, stiffness: 120 });
            const ali = spr(t, tDir + i * 0.05, { damping: 12, stiffness: 170 });
            const sx = rnd(i, 1) > 0.5 ? 1300 : -300, sy = 300 + rnd(i, 2) * 1300;
            const x = lerp(sx, 540 + (rnd(i, 3) - 0.5) * 60 * (1 - ali), k), y = lerp(sy, 640 + i * 118, k);
            const rot = lerp((rnd(i, 4) - 0.5) * 260, (rnd(i, 5) - 0.5) * 24, k) * (1 - ali);
            const blur = lerp(10, 0, prog(t, tCla - 0.05, 0.5));
            const intoPhone = toPhone;
            return (
              <div key={i} style={{ position: 'absolute', left: x - 230, top: lerp(y, 700 + i * 60, intoPhone) - 46, width: 460, height: 92, borderRadius: 26, background: 'rgba(255,255,255,0.16)', border: '2px solid rgba(255,255,255,0.4)', boxSizing: 'border-box', transform: `rotate(${rot}deg) scale(${lerp(1, 0.6, intoPhone)})`, filter: `blur(${blur}px)`, opacity: Math.min(1, k * 2) * (1 - intoPhone), display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ flex: 1, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.45)' }} />
              </div>
            );
          })}
          {/* fio de prumo descendo do ícone: a direção */}
          <div style={{ position: 'absolute', left: 538.5, top: iconY + 70 * iconS, width: 3, height: lineK * 1050 * (1 - toPhone), background: 'rgba(255,255,255,0.85)' }} />
          {/* palavras: organização → clareza → direção */}
          {[['organização', tOrg, tCla], ['clareza', tCla, tDir], ['direção', tDir, W(3, 'existe') - 0.2]].map(([w, s, n]) => {
            const k = sweep(s), o = wordOut(n);
            return <div key={w} style={{ position: 'absolute', top: 1400, width: 1080, textAlign: 'center', ...display(700), fontSize: 118, color: '#fff', opacity: k * (1 - o), transform: `translateY(${(1 - k) * 40 - o * 30}px)`, filter: `blur(${(1 - k) * 12 + o * 10}px)` }}>{w}</div>;
          })}
        </BlueBg>
      </AbsoluteFill>
      {/* claro: gestor financeiro (círculo a partir do celular) */}
      <AbsoluteFill style={{ clipPath: `circle(${light * 140}% at 540px 1000px)` }}>
        <LightBg>
          <div style={{ position: 'absolute', top: 250, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: 1 - pillsOut, transform: `translateY(${-pillsOut * 30}px)`, filter: `blur(${pillsOut * 8}px)` }}>
            <span style={{ ...display(700), fontSize: 64, color: '#fff', background: C.blue, padding: '16px 40px', borderRadius: 99, transform: `scale(${pill1})`, boxShadow: '0 14px 34px rgba(0,113,227,0.3)' }}>gestor financeiro</span>
            <span style={{ ...display(600), fontSize: 46, color: C.ink, transform: `scale(${pill2})`, opacity: Math.min(1, pill2 * 2) }}>para pequenos negócios</span>
          </div>
          <div style={{ position: 'absolute', top: 1560, width: 1080, display: 'flex', justifyContent: 'center', opacity: prog(t, W(3, 'gestor') + 0.4, 0.5) }}><DemoTag /></div>
        </LightBg>
      </AbsoluteFill>
      {/* celular com o app */}
      {phoneK > 0.001 && (
        <AbsoluteFill style={{ perspective: 2400 }}>
          <div style={{ position: 'absolute', left: 540 - 300 * 0.78, top: lerp(1900, 470, phoneK) + light * 20, transform: `scale(0.78) rotateY(${lerp(-24, -8, phoneK) + light * 8}deg) rotateX(${lerp(20, 4, phoneK) - light * 4}deg)`, transformOrigin: '0 0' }}>
            <Phone w={600} h={1240}><Home /></Phone>
          </div>
        </AbsoluteFill>
      )}
      {/* marca: bússola → ícone (sobre tudo); vira ícone branco ao entrar no azul */}
      <AbsoluteFill style={{ opacity: 1 - light }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${iconY - 860}px)` }}>
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${iconS * (1 + pulse * 0.12)})`, transformOrigin: '540px 860px', opacity: iris < 1 ? 1 : 0 }}>
            <Compass t={t} f={f} cx={540} cy={860} />
          </div>
          {iris > 0 && <div style={{ position: 'absolute', left: 540 - 115, top: 860 - 115, transform: `scale(${iconS * (1 + pulse * 0.12)})`, transformOrigin: '115px 115px', opacity: iris }}><AppIcon size={230} /></div>}
          <div style={{ position: 'absolute', top: 1030, width: 1080, display: 'flex', justifyContent: 'center', opacity: Math.min(1, wm * 1.6) * (1 - up), transform: `translateY(${(1 - wm) * 40}px)`, filter: `blur(${(1 - Math.min(1, wm)) * 12}px)` }}>
            <Wordmark size={210} color="#fff" />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
