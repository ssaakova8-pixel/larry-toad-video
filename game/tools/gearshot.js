// node gearshot.js file out WxH ch pg
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const [file,out,vp,ch,pg]=process.argv.slice(2);const [w,h]=vp.split('x').map(Number);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1500);await p.touchscreen.tap(w/2,h/2);await p.waitForTimeout(500);
 await p.evaluate(([c,g])=>{sv.cmp=0;bookGo(+c,+g)},[ch,pg]);await p.waitForTimeout(1800);
 await p.screenshot({path:out+'_0.png'});
 /* перетащить первую шестерню из ящика на первый колышек решения мышью */
 const info=await p.evaluate(()=>{var s=P.s,B=P.B,geo=gearGeo(s,B),sol=s.G.chain[0],it=s.items.filter(function(i){return i.id>1&&i.r===sol.r})[0],sl=geo.slots[it.id],pc=gearPeg(B,sol.x,sol.y);return{from:[sl.x,sl.y],to:[pc[0],pc[1]+B.cell*.9]}});
 await p.mouse.move(info.from[0],info.from[1]);await p.mouse.down();await p.mouse.move((info.from[0]+info.to[0])/2,(info.from[1]+info.to[1])/2,{steps:5});await p.screenshot({path:out+'_drag.png'});
 await p.mouse.move(info.to[0],info.to[1],{steps:5});await p.mouse.up();await p.waitForTimeout(300);
 const st1=await p.evaluate(()=>({placed:P.s.items.filter(gearPlaced).length,hist:P.hist.length}));console.log('after drag',JSON.stringify(st1));
 await p.screenshot({path:out+'_1.png'});
 /* поставить остальное решение прямо */
 await p.evaluate(()=>{var s=P.s;s.G.chain.forEach(function(c){var it=s.items.filter(function(i){return i.id>1&&i.r===c.r&&i.x==null})[0];if(it){it.x=c.x;it.y=c.y}})});
 await p.waitForTimeout(900);await p.screenshot({path:out+'_2.png'});
 await p.waitForTimeout(1500);await p.screenshot({path:out+'_3.png'});
 console.log(await p.evaluate(()=>({win:P.win,won:PZ.gears.won(P.s),jam:P.s.net.jam})));
 console.log(errs.length?errs:'ok');await b.close()})();
