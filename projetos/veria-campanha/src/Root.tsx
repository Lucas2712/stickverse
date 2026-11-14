import React from "react";
import { Composition } from "remotion";
import { Veria } from "./Veria";
import { FPS, DURACAO } from "./tempos";
import { EstudoSimbolo, Fita3DStill } from "./branding/Apresentacao";

export const Root: React.FC = () => (
  <>
    <Composition id="Veria" component={Veria} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={1080} height={1920} />
    {/* peças da apresentação da marca */}
    <Composition id="SimboloAnimado" component={EstudoSimbolo} durationInFrames={150} fps={FPS} width={1080} height={1080} />
    <Composition id="Fita3D" component={Fita3DStill} durationInFrames={1} fps={FPS} width={1600} height={1600} />
  </>
);
