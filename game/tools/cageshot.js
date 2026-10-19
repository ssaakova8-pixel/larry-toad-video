const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const [file,pre,vp]=process.argv.slice(2);const [w,h]=vp.split('x').map(Number);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1500);await p.touchscreen.tap(w/2,h/2);await p.waitForTimeout(500);
 await p.evaluate(()=>{go('run',{mode:'story',ch:14,replay:true},true)});
 await p.waitForTimeout(3500);
 await p.evaluate(()=>{var P=S.pads,i=S.arenaStart-3;S.F.x=P[i].x;S.F.pi=i;S.started=true;V.cam=S.F.x-3;window.__a=S.arenaX});
 await p.waitForTimeout(1500);await p.screenshot({path:pre+'_a.png'});
 console.log(await p.evaluate(()=>({caged:krapCaged(),kx:V.krap.x,ky:V.krap.y,ax:S.arenaX,phase:S.phase,boss:!!S.boss})));
 await p.evaluate(()=>{var P=S.pads,i=S.arenaStart;S.F.x=P[i].x;S.F.pi=i});
 await p.waitForTimeout(2500);await p.screenshot({path:pre+'_b.png'});
 console.log(await p.evaluate(()=>({phase:S.phase,boss:S.boss&&S.boss.k})));
 console.log(errs.length?errs:'ok');await b.close()})();
