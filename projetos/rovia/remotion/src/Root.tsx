import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { FPS, W, H, DURACAO } from "./lib";

export const Root: React.FC = () => (
  <Composition id="Rovia" component={Video} durationInFrames={Math.round(DURACAO * FPS)} fps={FPS} width={W} height={H} />
);
