import React from 'react';
import { Composition } from 'remotion';
import { Video, DURACAO } from './Video';
import { W as LW, H, FPS } from './styles/tokens';
import { TesteCena } from './Teste';
import { Teste3D } from './Teste3D';
export const Root = () => (
  <>
    <Composition id="Campanha" component={Video} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={LW} height={H} defaultProps={{ comTrilha: true, comEfeitos: true }} />
    <Composition id="SoNarracao" component={Video} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={LW} height={H} defaultProps={{ comTrilha: false, comEfeitos: false }} />
    <Composition id="Teste" component={TesteCena} durationInFrames={Math.round(15 * FPS)} fps={FPS} width={LW} height={H} defaultProps={{ cena: 'V3_A1', a: 0 }} />
    <Composition id="Teste3D" component={Teste3D} durationInFrames={120} fps={30} width={LW} height={H} />
  </>
);
