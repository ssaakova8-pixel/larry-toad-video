// node enshot.js file.html out_prefix WxH kind[,kind..] [ch] — ставит нового бойца рядом с героем и снимает кадры
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const [file,pre,vp,kinds,ch='3']=process.argv.slice(2);const [w,h]=vp.split('x').map(Number);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1500);await p.touchscreen.tap(w/2,h/2);await p.waitForTimeout(500);
 for(const kind of kinds.split(',')){
  await p.evaluate((c)=>{go('run',{mode:'story',ch:+c,replay:true},true)},ch);
  await p.waitForTimeout(3500);
  await p.evaluate((kind)=>{var F=S.F;S.started=true;S.en.length=0;S.ents.length=0;V.txts.length=0;for(var k in SEEN_EN)delete SEEN_EN[k];F.pi=4;F.x=S.pads[4].x;F.mode='sit';F.y=0;F.inv=999;var p4=S.pads[4];
   var base={ph:0,hp:1,t:0,act:true,cool:0};
   if(kind==='beetle')S.en.push(Object.assign(base,{k:'beetle',x:p4.x+1.2,y:.5,home:p4.x,pad:4,ox:1.2,st:'walk',dir:1,hp:2}));
   if(kind==='saw')S.en.push(Object.assign(base,{k:'saw',x:p4.x+7,y:2.6,y0:2.6,amp:.5,home:p4.x+7,vx:-2.8,st:'fly'}));
   if(kind==='mortar')S.en.push(Object.assign(base,{k:'mortar',x:p4.x+5.5,y:3.9,home:0,st:'idle',shots:0,cool:.3}));
   if(kind==='dropper')S.en.push(Object.assign(base,{k:'dropper',x:p4.x+1.6,y:7,home:p4.x,st:'hang'}));
  },kind);
  for(let i=0;i<7;i++){await p.waitForTimeout(i<2?250:420);await p.screenshot({path:pre+'_'+kind+'_'+i+'.png'});}
  console.log(kind,await p.evaluate(()=>S.en.map(e=>e.k+':'+e.st+':'+e.x.toFixed(1)+','+e.y.toFixed(1)).join(' ')+' hits='+S.hits));
 }
 console.log(errs.length?errs:'ok');await b.close()})();
