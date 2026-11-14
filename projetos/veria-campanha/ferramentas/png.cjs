// Exporta cada SVG de marca/svg em PNG com fundo transparente (2400 px no lado maior).
const { chromium } = require("playwright"); const fs = require("fs"); const path = require("path");
(async () => {
  const dir = path.resolve(__dirname, "../marca/svg"), out = path.resolve(__dirname, "../marca/png");
  const b = await chromium.launch(); const p = await b.newPage();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".svg"))) {
    const svg = fs.readFileSync(path.join(dir, f), "utf8");
    const vb = svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
    const L = f.includes("icone") ? 1024 : 2400, k = L / Math.max(vb[2], vb[3]);
    const w = Math.round(vb[2] * k), h = Math.round(vb[3] * k);
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${w}" height="${h}" `)}</body></html>`);
    await p.screenshot({ path: path.join(out, f.replace(".svg", ".png")), omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  }
  await b.close(); console.log("ok");
})();
