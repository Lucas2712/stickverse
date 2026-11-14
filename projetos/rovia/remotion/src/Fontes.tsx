import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

const css = `@font-face{font-family:'Inter';src:url('${staticFile("fontes/inter.woff2")}') format('woff2');font-weight:100 900;font-display:block;}`;

/** carrega o Inter local (OFL) antes de renderizar qualquer quadro */
export const Fontes: React.FC = () => {
  const [h] = useState(() => delayRender("fonte Inter"));
  useEffect(() => {
    Promise.all([400, 500, 600, 700, 800].map((w) => document.fonts.load(`${w} 40px Inter`))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  return <style>{css}</style>;
};
