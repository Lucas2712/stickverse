// O guia: o freio da rolagem. A página sempre rola presa ao gesto e nunca para sozinha, mas nunca voa.
// Roda (mouse e trackpad): o alvo da rolagem nunca fica mais que AVANCO telas à frente de onde a página está; por mais
// forte que seja o gesto, a página anda no máximo ~1,8 tela por segundo e cada cena tem tempo de tocar.
// Toque (o Lenis conduz o toque, com syncTouch): o dedo arrastando move a página junto, e o filme segue o dedo; ao
// soltar, a inércia é feita aqui, com teto de INERCIA telas. A inércia nativa do celular passaria várias telas de
// filme num piparote; com teto curto demais, cansa o dedo. No meio: o dobro da inércia do Lenis, até 2,4 telas, mais
// ou menos um piparote por cena.
// O toque sem arrasto (um clique) e o de dois dedos (pinça) passam direto, sem preventDefault: cancelar o touchend
// mataria o clique de todo botão, e a pinça é do navegador.

const AVANCO = 0.3; // telas de folga entre o alvo e a página (o Lenis amortece a 6/s: ~1,8 tela/s no máximo)
const INERCIA = 2.4; // telas, no máximo, que a página anda sozinha depois de o dedo soltar
const GANHO = 2; // a inércia do toque rende o dobro da do Lenis (|v|^1,7)

export function criarGuia({ lenis }) {
  if (!lenis) return null;

  function roda(data) {
    const { deltaY, event } = data;
    if (event.ctrlKey || !deltaY) return true;
    const alvo = lenis.targetScroll;
    const dir = Math.sign(deltaY);
    const lim = lenis.animatedScroll + dir * AVANCO * innerHeight;
    const novo = dir > 0 ? Math.max(alvo, Math.min(alvo + deltaY, lim)) : Math.min(alvo, Math.max(alvo + deltaY, lim));
    data.deltaY = novo - alvo;
    if (Math.abs(data.deltaY) < 0.5) { if (event.cancelable) event.preventDefault(); return false; }
    return true;
  }

  function toque(data) {
    const { deltaY, event } = data;
    if (event.touches?.length > 1) return false; // pinça: o navegador faz o zoom
    if (event.type !== 'touchend' || !deltaY) return true; // arrasto e clique: o Lenis cuida (o clique passa direto)
    // soltou depois de arrastar: a inércia, com teto (o Lenis faria |v|^1,7 sem limite)
    const v = Math.abs(lenis.velocity);
    if (v < 0.5) return false;
    const d = Math.sign(deltaY) * Math.min(GANHO * v ** lenis.options.touchInertiaExponent, INERCIA * innerHeight);
    lenis.scrollTo(lenis.targetScroll + d, { lerp: lenis.options.syncTouchLerp, programmatic: false });
    return false;
  }

  lenis.options.virtualScroll = (data) => (data.event.type.includes('touch') ? toque(data) : roda(data));
  return {};
}
