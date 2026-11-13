import React from 'react';
import { Composition } from 'remotion';
import { Video, DURACAO } from './Video';
import { W as LW, H, FPS } from './styles/tokens';
export const Root = () => (
  <>
    <Composition id="Campanha" component={Video} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={LW} height={H} defaultProps={{ comTrilha: true, comEfeitos: true }} />
    <Composition id="SoNarracao" component={Video} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={LW} height={H} defaultProps={{ comTrilha: false, comEfeitos: false }} />
  </>
);
