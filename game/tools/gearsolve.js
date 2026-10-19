// node gearsolve.js file WxH — проходит все страницы-шестерни по подсказке настоящими перетаскиваниями мышью
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const [file,vp]=process.argv.slice(2);const [w,h]=vp.split('x').map(Number);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1500);await p.touchscreen.tap(w/2,h/2);await p.waitForTimeout(500);
 const pages=await p.evaluate(()=>{var o=[];CAMP.forEach(function(c,ci){c.pages.forEach(function(pg,pi){if(pg.k==='gears')o.push([ci,pi,pg.lv])})});return o});
 for(const [ci,pi,lv] of pages){
  await p.evaluate(([c,g])=>{bookGo(c,g)},[ci,pi]);await p.waitForTimeout(900);
  let steps=0,ok=false;
  while(steps++<40){
   const st=await p.evaluate(()=>({win:P.win,won:PZ.gears.won(P.s)}));
   if(st.win){ok=true;break}
   const act=await p.evaluate(()=>{var s=P.s,B=P.B,hh=PZ.gears.hint(s);if(!hh||!hh.mark)return null;var m=hh.mark,geo=gearGeo(s,B);
    if(m.rm!=null){var it=s.items[m.rm],c=gearPeg(B,it.x,it.y);return{kind:'tap',x:c[0],y:c[1]}}
    var it2=s.items[m.id],from;if(gearPlaced(it2)){from=gearPeg(B,it2.x,it2.y)}else{var sl=geo.slots[it2.id];from=[sl.x,sl.y]}
    var to=gearPeg(B,m.x,m.y);return{kind:'drag',fx:from[0],fy:from[1],tx:to[0],ty:to[1]+B.cell*.9}});
   if(!act){await p.waitForTimeout(300);continue}
   if(act.kind==='tap'){await p.mouse.click(act.x,act.y)}
   else{await p.mouse.move(act.fx,act.fy);await p.mouse.down();await p.mouse.move((act.fx+act.tx)/2,(act.fy+act.ty)/2,{steps:4});await p.mouse.move(act.tx,act.ty,{steps:4});await p.mouse.up()}
   await p.waitForTimeout(120)}
  if(!ok){await p.waitForTimeout(1500);ok=await p.evaluate(()=>P.win)}
  console.log('ch',ci,'pg',pi,'lv',lv,ok?'РЕШЕНО':'НЕ РЕШЕНО','за',steps,'шагов');
 }
 console.log(errs.length?errs.slice(0,4):'ok');await b.close()})();
