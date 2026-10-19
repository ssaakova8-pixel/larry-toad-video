// node vpshots.js file outdir — снимает ключевые экраны на разных экранах
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const [file,out]=process.argv.slice(2);
 const VP=[[320,568],[844,390],[768,1024],[1920,1080]];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 const errs=[];
 for(const [w,h] of VP){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,hasTouch:true});
  p.on('pageerror',e=>errs.push(w+'x'+h+' '+String(e.stack||e).slice(0,200)));
  await p.goto('file://'+file);await p.waitForTimeout(1500);await p.screenshot({path:`${out}/vp_${w}_title.png`});
  await p.touchscreen.tap(w/2,h/2);await p.waitForTimeout(500);
  await p.evaluate(()=>{go('run',{mode:'story',ch:4,replay:true},true)});await p.waitForTimeout(3300);
  await p.evaluate(()=>{var F=S.F;S.started=true;S.en.length=0;V.txts.length=0;var p4=S.pads[5];F.pi=5;F.x=p4.x;F.mode='sit';F.y=0;F.inv=999;V.banner=0;
   S.en.push({k:'beetle',x:p4.x+1,y:.5,home:p4.x,pad:5,ox:1,ph:0,hp:2,st:'stun',t:-9,cool:9,act:true,dir:1,face:1});
   S.en.push({k:'mortar',x:p4.x+5,y:3.9,home:0,ph:0,hp:1,st:'idle',t:0,shots:0,cool:.1,act:true});
   S.en.push({k:'dropper',x:p4.x+2.4,y:7,home:p4.x,ph:0,hp:1,st:'hang',t:0,cool:0,act:true})});
  await p.waitForTimeout(1200);await p.screenshot({path:`${out}/vp_${w}_run.png`});
  await p.evaluate(()=>{sv.cmp=0;bookGo(4,10)});await p.waitForTimeout(1200);await p.screenshot({path:`${out}/vp_${w}_gears.png`});
  await p.evaluate(()=>{sv.fire=500;go('camp')});await p.waitForTimeout(900);await p.screenshot({path:`${out}/vp_${w}_camp.png`});
  await p.close()}
 console.log(errs.length?errs:'ok');await b.close()})();
