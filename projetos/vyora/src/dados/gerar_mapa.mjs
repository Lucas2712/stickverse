// Gera os pontos do mapa-múndi (Natural Earth 1:110m, via studio/dados/paises-110m.json) em projeção equirretangular.
import fs from "node:fs";
import {feature} from "topojson-client";
import {geoContains} from "d3-geo";
const topo = JSON.parse(fs.readFileSync(new URL("../../../../studio/dados/paises-110m.json", import.meta.url)));
const terra = feature(topo, topo.objects.land || topo.objects.countries);
const pts = [];
const passo = 2.25;
for (let lat = 78; lat >= -56; lat -= passo)
  for (let lon = -168; lon <= 180; lon += passo)
    if (geoContains(terra, [lon, lat])) pts.push([lon, lat]);
fs.writeFileSync(new URL("./mapa.json", import.meta.url), JSON.stringify(pts));
console.log(pts.length, "pontos");
