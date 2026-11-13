import React from 'react';
import { Composition } from 'remotion';
import { Video, DURACAO } from './Video';
import { W, H, FPS } from './styles/tokens';

export const Root = () => (
  <>
    <Composition id="Prumo" component={Video} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={W} height={H} defaultProps={{ comTrilha: true }} />
    <Composition id="PrumoSemTrilha" component={Video} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={W} height={H} defaultProps={{ comTrilha: false }} />
  </>
);
