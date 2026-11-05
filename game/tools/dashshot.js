// node dashshot.js file.html out_prefix WxH ch  — запускает Зов Пороха и снимает кадры скачка
const {chromium}=require('playwright');
(async()=>{
 const [file,pre,vp,ch]=process.argv.slice(2);const [w,h]=vp.split('x').map(Number);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1500);await p.touchscreen.tap(w/2,h/2);await p.waitForTimeout(500);
 await p.evaluate((c)=>{go('run',{mode:'story',ch:+c,replay:true},true)},ch);
 await p.waitForTimeout(4000);
 await p.evaluate(()=>{S.dm=100;S.started=true;useDash(S)});
 for(let i=0;i<10;i++){await p.waitForTimeout(230);await p.screenshot({path:pre+'_'+i+'.png'});}
 console.log(await p.evaluate(()=>({mode:S.F.mode,x:S.F.x,dash:!!S.dash,phase:S.phase})));
 console.log(errs.length?errs:'ok');await b.close()})();
