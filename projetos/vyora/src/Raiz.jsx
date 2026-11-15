// VYORA · composição do Remotion (1080×1920, 30 fps, 39 s)
import React from "react";
import {Composition, continueRender, delayRender, staticFile} from "remotion";
import {Vyora} from "./Vyora";

const espera = delayRender("fonte Inter");
if (typeof document !== "undefined") {
  const f = new FontFace("Inter", `url(${staticFile("fontes/inter.woff2")}) format("woff2")`, {weight: "100 900", display: "block"});
  f.load().then((ff) => { document.fonts.add(ff); continueRender(espera); }).catch(() => continueRender(espera));
}

export const FPS = 30;
export const DURACAO = 39;

export const Raiz = () => <Composition id="Vyora" component={Vyora} width={1080} height={1920} fps={FPS} durationInFrames={DURACAO * FPS} />;
