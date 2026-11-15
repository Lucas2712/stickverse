// Cena 5 · Check-in (14,5–21,0 s) · "E com o check-in automático, você ganha ainda mais praticidade na hora de embarcar. Receba suas informações,"
import React from "react";
import {COR, Cheio, Cinetico, E, clamp, display, lerp, p, texto, useT, v} from "../lib";
import {LogoLinha} from "../componentes/Logo";
import {Rotulo, Selo} from "../componentes/App";
import {IcCheck, IcJanela, IcPin, IcSeta, IcVoo, IcCalendario} from "../componentes/Icones";

// padrão decorativo com cara de QR (não é um código legível)
const N = 21;
const olho = (x, y) => {
  for (const [ox, oy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
    const a = x - ox, b = y - oy;
    if (a >= 0 && a < 7 && b >= 0 && b < 7) return a === 0 || a === 6 || b === 0 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4) ? 1 : 0;
    if (a >= -1 && a < 8 && b >= -1 && b < 8) return 0;
  }
  return -1;
};
const ruido = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const MODS = [];
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const o = olho(x, y); if (o === 1 || (o === -1 && ruido(x, y) > 0.52)) MODS.push([x, y, ruido(y, x)]); }

export const QR = ({tam = 240, k = 1, cor = COR.tinta}) => {
  const c = tam / N;
  return (
    <svg width={tam} height={tam} style={{display: "block"}}>
      {MODS.map(([x, y, r], i) => (r <= k ? <rect key={i} x={x * c} y={y * c} width={c + 0.5} height={c + 0.5} rx={c * 0.18} fill={cor} /> : null))}
    </svg>
  );
};

const Rota = ({cor = COR.tinta, tam = 104}) => (
  <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
    <div>
      <div style={{...display, fontSize: tam, color: cor, lineHeight: 1}}>GRU</div>
      <div style={{...texto, fontSize: 28, color: COR.tinta2, marginTop: 6}}>São Paulo</div>
    </div>
    <div style={{flex: 1, margin: "0 26px 30px", height: 4, backgroundImage: `linear-gradient(90deg, ${COR.violetaClaro} 50%, transparent 50%)`, backgroundSize: "22px 4px", position: "relative"}}>
      <div style={{position: "absolute", left: "50%", top: -34, marginLeft: -36, width: 72, height: 72, borderRadius: 36, background: COR.violeta, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)"}}><IcVoo tam={42} /></div>
    </div>
    <div style={{textAlign: "right"}}>
      <div style={{...display, fontSize: tam, color: cor, lineHeight: 1}}>SSA</div>
      <div style={{...texto, fontSize: 28, color: COR.tinta2, marginTop: 6}}>Salvador</div>
    </div>
  </div>
);

const Dado = ({r, val, w}) => (
  <div style={{width: w}}>
    <Rotulo style={{fontSize: 21}}>{r}</Rotulo>
    <div style={{...display, fontSize: 40, fontWeight: 600, color: COR.tinta, marginTop: 6, whiteSpace: "nowrap"}}>{val}</div>
  </div>
);

const Etiqueta = ({t0, x, y, rot, Ic, r, val}) => {
  const t = useT();
  const k = p(t, t0, 0.55, E.back);
  if (t < t0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `scale(${k}) rotate(${rot}deg) translateY(${Math.sin(t * 2 + x) * 5}px)`, background: "#fff", borderRadius: 34, padding: "18px 28px 18px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 30px 60px rgba(60,4,60,.4)", color: COR.violeta}}>
      <div style={{width: 72, height: 72, borderRadius: 24, background: COR.lavanda, display: "flex", alignItems: "center", justifyContent: "center"}}><Ic tam={44} /></div>
      <div>
        <div style={{...texto, fontSize: 22, color: COR.tinta2}}>{r}</div>
        <div style={{...display, fontSize: 42, color: COR.tinta}}>{val}</div>
      </div>
    </div>
  );
};

export const C5Checkin = () => {
  const t = useT();
  const abre = p(t, 14.25, 0.5, E.inOut);
  const entra = p(t, 14.55, 0.85, E.expo);
  const desl = p(t, 14.9, 1.0, E.inOut);
  const ok = p(t, 16.22, 0.45, E.back);
  const gira = p(t, 17.3, 0.8, E.inOut);
  const qr = p(t, 18.22, 0.85, E.linear);
  const luz = p(t, 19.0, 0.7, E.inOut);
  const zoom = p(t, 19.38, 0.7, E.out5);
  const rasga = p(t, 20.5, 0.4, E.out);
  const frente = gira < 0.5;
  const borra = Math.sin(gira * Math.PI) * 7;
  return (
    <Cheio style={{clipPath: `circle(${abre * 2400}px at 300px 1490px)`, background: "linear-gradient(165deg, #F52AA8 0%, #D2148E 45%, #8A0F78 100%)"}}>
      <div style={{position: "absolute", left: -200, top: 1200, width: 900, height: 900, borderRadius: 450, background: COR.violeta, opacity: 0.45, filter: "blur(140px)"}} />
      <div style={{position: "absolute", left: 700 + Math.sin(t) * 30, top: 100, width: 600, height: 600, borderRadius: 300, background: "#FF7CCB", opacity: 0.4, filter: "blur(120px)"}} />
      <div style={{position: "absolute", left: 80, top: 244}}>
        <Cinetico tam={108} saida={19.2} itens={[[14.6, "Check-in"], "\n", [14.8, "sem"], [14.96, "complicação."]]} />
      </div>
      <Cheio style={{perspective: 2200, overflow: "visible"}}>
        <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "540px 1500px", transform: `translateY(${(1 - entra) * 1200}px) scale(${1 + zoom * 0.05}) rotateZ(${(1 - entra) * 9}deg) rotateY(${gira * 180}deg) rotateX(${Math.sin(t * 1.1) * 1.5}deg)`, filter: borra > 0.3 ? `blur(${borra}px)` : "none"}}>
          {/* frente: card de check-in */}
          {frente && (
            <div style={{position: "absolute", left: 100, top: 720, width: 880, height: 640, borderRadius: 56, background: "#fff", boxShadow: "0 60px 120px rgba(70,0,60,.45)", padding: 50, boxSizing: "border-box", backfaceVisibility: "hidden"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40}}>
                <span style={{...display, fontSize: 46, fontWeight: 600, color: COR.tinta}}>Check-in</span>
                <Selo style={{fontSize: 28}}>VY 2718</Selo>
              </div>
              <Rota />
              <div style={{...texto, fontSize: 30, color: COR.tinta2, marginTop: 26}}>12 mar · 08:40 · Marina Costa</div>
              <div style={{position: "absolute", left: 50, bottom: 50, width: 780, height: 128, borderRadius: 64, background: COR.lavanda, overflow: "hidden"}}>
                <div style={{position: "absolute", left: 0, top: 0, height: 128, width: lerp(128, 780, Math.max(desl, 0)), borderRadius: 64, background: `linear-gradient(90deg, ${COR.violeta}, #9B3DFF)`}} />
                <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...texto, fontSize: 34, fontWeight: 600, color: COR.violeta, paddingLeft: 90, opacity: 1 - clamp(desl * 2.2)}}>Deslize para fazer check-in</div>
                <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, ...texto, fontSize: 38, fontWeight: 600, color: "#fff", opacity: clamp(ok * 2), transform: `scale(${0.8 + ok * 0.2})`}}>
                  <IcCheck tam={48} /> Check-in confirmado
                </div>
                <div style={{position: "absolute", left: lerp(10, 662, desl), top: 10, width: 108, height: 108, borderRadius: 54, background: "#fff", color: COR.violeta, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(60,20,140,.3)", opacity: 1 - clamp(ok * 2.5)}}>
                  <IcSeta tam={54} />
                </div>
              </div>
              {t >= 16.22 && ok < 1.05 && <div style={{position: "absolute", left: 50, bottom: 50, width: 780, height: 128, borderRadius: 64, border: `6px solid ${COR.violeta}`, boxSizing: "border-box", opacity: 1 - p(t, 16.22, 0.6, E.out), transform: `scale(${1 + p(t, 16.22, 0.6, E.out) * 0.14}, ${1 + p(t, 16.22, 0.6, E.out) * 0.6})`}} />}
            </div>
          )}
          {/* verso: cartão de embarque */}
          {!frente && (
            <div style={{position: "absolute", left: 100, top: 540, width: 880, transform: "rotateY(180deg)"}}>
              <div style={{position: "relative", height: 690, borderRadius: "56px 56px 30px 30px", background: "#fff", boxShadow: "0 60px 120px rgba(70,0,60,.45)", overflow: "hidden"}}>
                <div style={{height: 150, background: `linear-gradient(100deg, ${COR.violeta}, #5A17DB)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px"}}>
                  <LogoLinha altura={58} cor="#fff" corPonto="#FF6AC6" />
                  <span style={{...texto, fontSize: 28, color: "rgba(255,255,255,.85)", fontWeight: 600}}>Cartão de embarque</span>
                </div>
                <div style={{padding: "44px 50px 0"}}>
                  <Rota />
                  <div style={{display: "flex", marginTop: 40}}><Dado r="Passageira" val="Marina Costa" w={340} /><Dado r="Voo" val="VY 2718" w={240} /><Dado r="Data" val="12 MAR" w={200} /></div>
                  <div style={{display: "flex", marginTop: 30}}><Dado r="Embarque" val="08:40" w={340} /><Dado r="Portão" val="B12" w={240} /><Dado r="Assento" val="14A" w={200} /></div>
                </div>
              </div>
              {/* canhoto destacável */}
              <div style={{position: "relative", height: 320, borderRadius: "30px 30px 56px 56px", background: "#fff", boxShadow: "0 60px 120px rgba(70,0,60,.3)", transformOrigin: "0 0", transform: `translateY(${rasga * 34}px) rotate(${rasga * 2.6}deg)`, display: "flex", alignItems: "center", padding: "0 50px", gap: 44, boxSizing: "border-box"}}>
                <div style={{position: "absolute", left: 40, right: 40, top: -2, height: 4, backgroundImage: "linear-gradient(90deg, #C9BEE6 50%, transparent 50%)", backgroundSize: "24px 4px"}} />
                <div style={{position: "relative", width: 236, height: 236}}>
                  <QR tam={236} k={qr} />
                  {luz > 0 && luz < 1 && <div style={{position: "absolute", left: -14, width: 264, top: luz * 236 - 4, height: 8, borderRadius: 4, background: COR.magenta, boxShadow: `0 0 26px 8px ${COR.magenta}`}} />}
                </div>
                <div>
                  <Rotulo style={{fontSize: 22}}>Embarque até</Rotulo>
                  <div style={{...display, fontSize: 104, color: COR.tinta, lineHeight: 1.05}}>08:40</div>
                  <Selo cor="#fff" fundo={COR.violeta} style={{fontSize: 27, marginTop: 10, opacity: p(t, 19.5, 0.4, E.out)}}><IcCheck tam={30} /> Confirmado</Selo>
                </div>
              </div>
            </div>
          )}
        </div>
      </Cheio>
      <Etiqueta t0={19.38} x={70} y={250} rot={-5} Ic={IcPin} r="Portão" val="B12" />
      <Etiqueta t0={19.74} x={610} y={282} rot={5} Ic={IcJanela} r="Assento" val="14A" />
      <Etiqueta t0={19.94} x={300} y={376} rot={-2} Ic={IcCalendario} r="Embarque" val="08:40" />
    </Cheio>
  );
};
