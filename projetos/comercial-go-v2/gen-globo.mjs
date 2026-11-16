// Pré-calcula os pontos de terra do globo (Natural Earth 1:110m, via studio/dados/paises-110m.json)
import fs from 'fs'; import { feature, merge } from 'topojson-client'; import { geoContains } from 'd3-geo';
const topo = JSON.parse(fs.readFileSync('../../studio/dados/paises-110m.json', 'utf8'));
const land = merge(topo, topo.objects[Object.keys(topo.objects)[0]].geometries);
const N = 16000, pts = [], g = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i;
  const x = Math.cos(th) * r, z = Math.sin(th) * r;
  const lat = Math.asin(y) * 180 / Math.PI, lon = Math.atan2(x, z) * 180 / Math.PI;
  if (geoContains(land, [lon, lat])) pts.push(+x.toFixed(4), +y.toFixed(4), +z.toFixed(4));
}
fs.writeFileSync('src/globo-pontos.json', JSON.stringify(pts));
console.log(pts.length / 3, 'pontos de terra');
