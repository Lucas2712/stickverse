// Câmera lenta para gravar o site: injetado (só na gravação) antes de qualquer script da página, faz todos os relógios
// andarem a K da velocidade real (Date.now, que o GSAP usa; performance.now; o tempo do requestAnimationFrame;
// setTimeout/setInterval), e também as transições e animações de CSS e os vídeos. Gravando a ~38 quadros/s reais com
// K = 0,5, cada segundo do site vira ~76 quadros; o ffmpeg depois acelera de volta e entrega 60 fps.
(() => {
  const K = Number(window.__CAMERA_LENTA__ || 0.5);
  const pn = performance.now.bind(performance);
  const p0 = pn();
  performance.now = () => p0 + (pn() - p0) * K;
  const dn = Date.now;
  const d0 = dn();
  Date.now = () => Math.round(d0 + (dn() - d0) * K);
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((ts) => cb(p0 + (ts - p0) * K));
  const st = window.setTimeout.bind(window);
  window.setTimeout = (f, d = 0, ...a) => st(f, d / K, ...a);
  const si = window.setInterval.bind(window);
  window.setInterval = (f, d = 0, ...a) => si(f, d / K, ...a);
  const ajusta = () => {
    for (const an of document.getAnimations?.() ?? []) if (an.playbackRate !== K) an.playbackRate = K;
    for (const v of document.querySelectorAll('video')) if (v.playbackRate !== K) { v.defaultPlaybackRate = K; v.playbackRate = K; }
    raf(ajusta);
  };
  raf(ajusta);
})();
