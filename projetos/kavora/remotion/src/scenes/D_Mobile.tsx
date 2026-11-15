// Cenas 05 (Experiência mobile) e 06 (Inteligência e controle).
// Fundo laranja com ícones de vidro em 3 camadas → "Tudo isso" → smartphone 3D com o app vivo →
// a câmera mergulha na tela → mundo branco do alerta: trilho de pontos, botão chave → relógio → check,
// carros 3D nas bordas. O check estoura em laranja e abre a cena 07.
import React from 'react';
import {C, FONT, SHADOW} from '../theme';
import {K} from '../timing';
import {Abs, Blur, Glass, GlassIcon, Icon, LightBg, OrangeBg, Scribble} from '../components/base';
import {drift, E, mix, pr, shutter, sp, SP, tw, clamp} from '../lib/anim';
import {Stage} from '../three/Stage';
import {Phone3D} from '../three/Phone3D';
import {Car3D} from '../three/objects';

const FLOAT = [
  // [ícone, x, y, tamanho, camada(0 longe, 1 meio, 2 perto)]
  ['calendar', 210, 360, 150, 1], ['fuel', 880, 300, 120, 0], ['shield', 120, 900, 110, 0], ['chart', 950, 820, 170, 2],
  ['wrench', 860, 1500, 150, 1], ['car', 180, 1560, 190, 2], ['bell', 560, 220, 100, 0], ['tax', 560, 1720, 120, 0], ['wallet', 60, 1240, 140, 1],
] as const;

export const SceneD: React.FC<{t: number}> = ({t}) => {
  const tPhone = K.palma - 0.2;
  const tDive = K.alertas - 0.45;
  const tWhite = K.alertas + 0.08;
  const tBtn = K.revisao - 0.2;
  const tCheck = K.revisao + 0.32;
  const tBurst = K.kavora2 - 0.28;

  // ---- 05 ----
  const tudo = sp(t, K.tudo - 0.04, SP.bouncy);
  const tudoOut = pr(t, tPhone, 0.5, E.in);
  const circ = pr(t, K.tudo + 0.18, 0.55, E.draw);
  const phIn = sp(t, tPhone, SP.heavy);
  const dive = pr(t, tDive, 0.62, E.inOut);
  const screenP = clamp((t - tPhone - 0.1) / 1.25);
  const alert = pr(t, K.alertas - 0.3, 0.45, E.out);
  const white = pr(t, tWhite, 0.22, E.inOutSoft);

  // ---- 06 ----
  const notif = sp(t, tWhite - 0.02, SP.soft);
  const rail = pr(t, K.inteligentes - 0.1, 0.75, E.inOut);
  const railOut = pr(t, tBtn - 0.05, 0.35, E.in);
  const btn = sp(t, tBtn + 0.08, SP.bouncy);
  const toClock = pr(t, tBtn + 0.28, 0.2, E.inOut);
  const toCheck = pr(t, tCheck, 0.2, E.inOut);
  const burst = pr(t, tBurst, 0.42, E.in);
  const cars = sp(t, tWhite + 0.1, SP.settle);

  return (
    <Abs>
      {/* -------- laranja -------- */}
      {white < 1 && (
        <Abs>
          <OrangeBg t={t} />
          {FLOAT.map(([ic, x, y, s, layer], i) => {
            const p = sp(t, K.tudo - 0.35 + i * 0.045, SP.snappy);
            const par = [0.4, 0.75, 1.25][layer];
            const dy = drift(t, i, 18 * par, 0.22) - (t - K.tudo) * 40 * par - tudoOut * 260 * par;
            const dx = drift(t, i + 20, 12 * par, 0.18);
            const blur = layer === 0 ? 3.5 : layer === 2 ? 2.5 : 0;
            return (
              <div key={i} style={{position: 'absolute', left: x - s / 2 + dx, top: y - s / 2 + dy, transform: `scale(${p * (1 + dive * par * 1.6)}) rotate(${drift(t, i + 5, 10, 0.2) - 10 + i * 4}deg)`,
                filter: blur ? `blur(${blur + dive * 6}px)` : dive > 0 ? `blur(${dive * 6}px)` : undefined, opacity: Math.min(1, p * 1.4) * (1 - dive)}}>
                <GlassIcon icon={ic} size={s} />
              </div>
            );
          })}
          {/* "Tudo isso" circulado */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center',
            transform: `translateY(${-tudoOut * 520}px) scale(${(0.35 + 0.65 * tudo) * (1 - tudoOut * 0.45)}) rotate(${-4 + (1 - tudo) * 8}deg)`, opacity: Math.min(1, tudo * 2) * (1 - tudoOut)}}>
            <div style={{position: 'relative', display: 'inline-block'}}>
              <span style={{fontFamily: FONT, fontSize: 180, fontWeight: 700, color: C.white, letterSpacing: '-0.05em', textShadow: '0 20px 60px rgba(17,17,17,0.12)'}}>Tudo isso</span>
              <Scribble w={900} h={340} vb="0 0 900 340" p={circ} color={C.white} width={8} style={{left: -60, top: -50}}
                d="M690 52 C 560 10, 260 14, 110 70 C -10 118, 20 250, 210 290 C 420 334, 760 312, 850 220 C 920 150, 860 70, 640 40" />
            </div>
          </div>

          {/* smartphone 3D */}
          {t > tPhone - 0.05 && (
            <Stage cam={[0, 0, 16]} warm env={1}>
              <Phone3D
                p={screenP} t={t} alert={alert}
                position={[mix(0.4, 0, phIn) * (1 - dive), mix(-11, -0.35, phIn) * (1 - dive) + drift(t, 1, 0.06) * (1 - dive) - dive * 0.02, mix(0, 0, phIn) + dive * 8.6]}
                rotation={[
                  mix(-1.05, -0.1, phIn) * (1 - dive) + drift(t, 2, 0.035) * (1 - dive),
                  mix(0.75, -0.28, phIn) * (1 - dive) + (t - tPhone) * 0.06 * (1 - dive),
                  mix(0.25, 0.05, phIn) * (1 - dive),
                ]}
                scale={1.04}
              />
            </Stage>
          )}
        </Abs>
      )}

      {/* -------- mundo branco (dentro da tela) -------- */}
      {white > 0 && (
        <Abs style={{opacity: white}}>
          <LightBg t={t} rings={false} />
          {/* carros 3D nas bordas */}
          <Stage cam={[0, 0, 16]} style={{filter: 'blur(1.2px)'}}>
            <Car3D position={[mix(-6, -2.35, cars), 3.55 + drift(t, 1, 0.08), -1.5]} rotation={[0.35, mix(-1.8, -0.7, cars) + (t - tWhite) * 0.25, -0.12]} scale={0.66} />
            <Car3D body="pearl" position={[mix(6, 2.3, cars), -3.6 + drift(t, 2, 0.08), -0.5]} rotation={[0.3, mix(2.4, 0.75, cars) - (t - tWhite) * 0.22, 0.1]} scale={0.7} />
          </Stage>

          {/* notificação ampliada (continua a que chegou na tela do celular) */}
          <div style={{position: 'absolute', left: 90, top: 470, transform: `translateY(${mix(-120, 0, notif) - railOut * 60}px) scale(${mix(0.8, 1, notif)})`, opacity: Math.min(1, notif * 2) * (1 - burst)}}>
            <Glass w={900} h={196} r={52}>
              <div style={{display: 'flex', alignItems: 'center', gap: 30, height: '100%', padding: '0 36px'}}>
                <div style={{width: 124, height: 124, borderRadius: 36, background: `linear-gradient(150deg, ${C.orangeL}, ${C.orange})`, display: 'grid', placeItems: 'center', boxShadow: '0 16px 30px rgba(255,113,56,0.35)', flex: 'none'}}>
                  <Icon name="wrench" size={64} color={C.white} stroke={2} />
                </div>
                <div style={{fontFamily: FONT, flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 42, fontWeight: 700, color: C.graphite, letterSpacing: '-0.025em'}}>Revisão dos 30.000 km</div>
                  </div>
                  <div style={{fontSize: 32, fontWeight: 500, color: '#8A8B8F', marginTop: 6}}>Faltam 12 dias · toque para agendar</div>
                </div>
              </div>
            </Glass>
          </div>

          {/* trilho de pontos */}
          {railOut < 1 && (
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
              {(() => {
                const xs = [210, 430, 650, 870], y = 1000;
                const conv = (x: number) => mix(x, 540, railOut);
                return (
                  <>
                    <div style={{position: 'absolute', left: conv(xs[0]), top: y - 4, width: (conv(xs[3]) - conv(xs[0])), height: 8, borderRadius: 4, background: C.gray}} />
                    <div style={{position: 'absolute', left: conv(xs[0]), top: y - 4, width: (conv(xs[3]) - conv(xs[0])) * rail, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${C.orangeL}, ${C.orange})`}} />
                    {xs.map((x, i) => {
                      const lit = pr(t, K.inteligentes - 0.1 + i * 0.22, 0.2, E.out);
                      const d = 46 + lit * 10;
                      return (
                        <React.Fragment key={i}>
                          <div style={{position: 'absolute', left: conv(x) - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%',
                            background: lit > 0.5 ? `radial-gradient(circle at 35% 30%, ${C.orangeL}, ${C.orange})` : C.white,
                            boxShadow: lit > 0.5 ? `0 0 0 ${10 * lit}px rgba(255,113,56,0.15), 0 10px 24px rgba(255,113,56,0.35)` : 'inset 0 0 0 4px #E8E8E6',
                            transform: `scale(${1 - railOut})`}} />
                          <div style={{position: 'absolute', left: conv(x) - 100, width: 200, top: y + 50, textAlign: 'center', fontFamily: FONT, fontSize: 28, fontWeight: 500,
                            color: lit > 0.5 ? C.graphite : '#8A8B8F', opacity: (0.4 + 0.6 * lit) * (1 - railOut)}}>
                            {['Lembrete', 'Oficina', 'Agenda', 'Feito'][i]}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          )}

          {/* botão: chave → relógio → check */}
          {btn > 0 && (
            <div style={{position: 'absolute', left: 540 - 150, top: 1000 - 150, width: 300, height: 300}}>
              {[0, 1].map((k) => {
                const pp = pr(t, tCheck + k * 0.18, 0.9, E.out);
                return pp > 0 && pp < 1 ? (
                  <div key={k} style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${C.orange}`, transform: `scale(${1 + pp * 0.9})`, opacity: (1 - pp) * 0.7}} />
                ) : null;
              })}
              <div style={{position: 'absolute', inset: 0, borderRadius: '50%', transform: `scale(${btn * (1 + burst * burst * 13)})`,
                background: `radial-gradient(circle at 34% 28%, ${C.orangeL} 0%, ${C.orange} 58%, ${C.orange} 100%)`,
                boxShadow: `inset 0 6px 0 rgba(255,255,255,0.35), inset 0 -14px 30px rgba(17,17,17,0.12), 0 30px 60px rgba(255,113,56,0.45), 0 0 0 ${18 + 6 * Math.sin(t * 6)}px rgba(255,113,56,0.10)`}} />
              <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 1 - burst * burst}}>
                {/* chave */}
                <div style={{position: 'absolute', transform: `scale(${btn * (1 - toClock)}) rotate(${toClock * 90}deg)`, opacity: 1 - toClock}}>
                  <Icon name="wrench" size={140} color={C.white} stroke={2} />
                </div>
                {/* relógio */}
                <svg width={150} height={150} viewBox="-12 -12 24 24" style={{position: 'absolute', transform: `scale(${toClock * (1 - toCheck)})`, opacity: toClock * (1 - toCheck)}}>
                  <circle r={9} fill="none" stroke={C.white} strokeWidth={1.8} />
                  <line x1={0} y1={0} x2={0} y2={-6} stroke={C.white} strokeWidth={1.8} strokeLinecap="round" transform={`rotate(${(t - tBtn) * 260})`} />
                  <line x1={0} y1={0} x2={4} y2={0} stroke={C.white} strokeWidth={1.8} strokeLinecap="round" transform={`rotate(${(t - tBtn) * 40})`} />
                </svg>
                {/* check */}
                <div style={{position: 'absolute', transform: `scale(${0.6 + 0.4 * sp(t, tCheck, SP.bouncy)})`, opacity: toCheck}}>
                  <Icon name="check" size={150} color={C.white} stroke={2.4} draw={pr(t, tCheck, 0.35, E.draw)} />
                </div>
              </div>
            </div>
          )}
        </Abs>
      )}
    </Abs>
  );
};
