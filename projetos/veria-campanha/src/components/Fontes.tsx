// Carrega Inter Display (títulos) e Inter (texto/interface) do próprio projeto, licença OFL em public/fonts.
import React, { useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

const PESOS: [string, number][] = [["Regular", 400], ["Medium", 500], ["SemiBold", 600], ["Bold", 700]];
const css = PESOS.map(([n, w]) => `@font-face{font-family:'VDisplay';src:url('${staticFile(`fonts/InterDisplay-${n}.otf`)}') format('opentype');font-weight:${w};}
@font-face{font-family:'VText';src:url('${staticFile(`fonts/Inter-${n}.otf`)}') format('opentype');font-weight:${w};}`).join("\n");

export const Fontes: React.FC = () => {
  const [h] = useState(() => delayRender("fontes"));
  React.useEffect(() => {
    const fams = PESOS.flatMap(([, w]) => [`${w} 40px VDisplay`, `${w} 40px VText`]);
    Promise.all(fams.map((f) => document.fonts.load(f))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  return <style>{css + "\n*{box-sizing:border-box}"}</style>;
};
