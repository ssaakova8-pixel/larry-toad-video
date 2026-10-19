const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const file=process.argv[2];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1800);await p.touchscreen.tap(195,420);await p.waitForTimeout(800);
 await p.evaluate(()=>go('studio',null,true));await p.waitForTimeout(700);
 await p.evaluate(()=>{window.AN=AC.createAnalyser();AN.fftSize=2048;AM.connect(AN);window.rms=function(){var a=new Float32Array(AN.fftSize);AN.getFloatTimeDomainData(a);var s=0;for(var i=0;i<a.length;i++)s+=a[i]*a[i];return Math.sqrt(s/a.length)}});
 const h=await p.evaluate(()=>{const h=UI.hits.slice().reverse().find(h=>h.id==='au');return h?{x:h.x+h.w/2,y:h.y+h.h/2}:null});
 if(!h){await p.evaluate(()=>{SD.scroll=200});await p.waitForTimeout(300)}
 const h2=await p.evaluate(()=>{const h=UI.hits.slice().reverse().find(h=>h.id==='au');return h?{x:h.x+h.w/2,y:h.y+h.h/2}:null});
 await p.touchscreen.tap(h2.x,h2.y);
 let mx=0,t0=Date.now();while(Date.now()-t0<4000){const r=await p.evaluate(()=>rms());if(r>mx)mx=r;await p.waitForTimeout(100)}
 console.log('слово автора: макс rms',mx.toFixed(4),'busy',await p.evaluate(()=>voiceBusy()),'dur',await p.evaluate(()=>voiceDur('author','')));
 console.log(errs.length?errs:'ошибок нет');await b.close()})();
