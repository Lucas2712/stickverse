import { useState } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';
// Carrega a Inter variável (OFL) antes de renderizar qualquer quadro
let carregada = false;
export const useFonte = () => {
  const [h] = useState(() => (carregada ? null : delayRender('fonte Inter')));
  useState(() => {
    if (carregada) return;
    const f = new FontFace('InterVar', `url(${staticFile('fontes/inter-var-opsz.woff2')}) format('woff2')`, { weight: '100 900' });
    f.load().then((ff) => { document.fonts.add(ff); carregada = true; continueRender(h); }).catch((e) => { console.error(e); continueRender(h); });
  });
};
