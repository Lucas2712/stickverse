import {PROPOSTAS,contorno,uniformizar,larguraFita} from "../src/branding/compasso.js";
import fs from "fs";
const sym=(k,fill,size)=>{
 const g=PROPOSTAS[k]();
 if(g.fita){const d=contorno(uniformizar(g.pts,400),larguraFita);return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><path d="${d}" fill="${fill}"/></svg>`}
 return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><path d="${g.d}" fill="none" stroke="${fill}" stroke-width="${g.w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
let h=`<html><body style="margin:0;font-family:Inter;background:#F7F5FA">`;
for(const k of ["A","B","C"]){h+=`<div style="display:flex;gap:30px;align-items:center;padding:20px;border-bottom:1px solid #ccc"><b style="font-size:40px;width:50px">${k}</b><div style="outline:1px dashed #ccc">${sym(k,"#5423A8",360)}</div><div style="background:#24104B;padding:20px;border-radius:20px">${sym(k,"#fff",200)}</div>${sym(k,"#24104B",64)}${sym(k,"#24104B",24)}<div style="width:120px;height:120px;border-radius:28px;background:#5423A8;display:grid;place-items:center">${sym(k,"#fff",84)}</div></div>`}
fs.writeFileSync(process.argv[2],h+"</body></html>");
