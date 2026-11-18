// Capturas do site para o case (desktop e mobile), sem a abertura.
const { chromium } = require('playwright'); const path=require('path');
const OUT=process.argv[2];
(async()=>{
  const b=await chromium.launch();
  const url='file://'+path.resolve(__dirname,'../08-Website/index.html');
  async function shot(vp,name,hash,scrollTo,full){
    const p=await b.newPage({viewport:vp,deviceScaleFactor:2});
    await p.goto(url+(hash||''));
    await p.evaluate(()=>{const i=document.getElementById('intro');i&&i.classList.add('gone');document.querySelectorAll('.reveal').forEach(e=>e.classList.remove('pre'))});
    await p.waitForTimeout(1600);
    if(scrollTo) await p.evaluate(s=>{const el=document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top+scrollY-68)},scrollTo);
    if(hash&&!scrollTo) await p.evaluate(()=>{});
    await p.evaluate(()=>document.querySelectorAll('.reveal').forEach(e=>e.classList.remove('pre')));
    await p.waitForTimeout(900);
    await p.screenshot({path:`${OUT}/${name}.jpg`,type:'jpeg',quality:88,fullPage:!!full});
    await p.close();
  }
  const D={width:1440,height:900}, M={width:390,height:844};
  await shot(D,'site-desktop-home');
  await shot(D,'site-desktop-colecao',null,'#colecao');
  await shot(D,'site-desktop-fragrancia','#heritage');
  await shot(D,'site-desktop-essencia',null,'#essencia');
  await shot(D,'site-desktop-full',null,null,true);
  await shot(M,'site-mobile-home');
  await shot(M,'site-mobile-colecao',null,'#colecao');
  await shot(M,'site-mobile-fragrancia','#rosee');
  await shot(M,'site-mobile-corpo',null,'#corpo');
  await b.close();
})();
