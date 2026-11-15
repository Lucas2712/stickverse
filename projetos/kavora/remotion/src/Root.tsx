import React from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {Kavora} from './Kavora';
import {DURATION} from './timing';
import {FPS, H, W} from './theme';

// Inter 4 variável (OFL, arquivo e licença em public/fonts) carregada antes do primeiro quadro.
const handle = delayRender('fonte Inter');
const face = new FontFace('InterK', `url(${staticFile('fonts/inter.woff2')}) format('woff2')`, {weight: '100 900'});
face
  .load()
  .then((f) => {
    document.fonts.add(f);
    return Promise.all([400, 500, 600, 700].map((w) => document.fonts.load(`${w} 40px InterK`)));
  })
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });

export const Root: React.FC = () => (
  <>
    <style>{`* { font-optical-sizing: auto; -webkit-font-smoothing: antialiased; } body { font-family: InterK, sans-serif; }`}</style>
    <Composition id="Kavora" component={Kavora} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
  </>
);
