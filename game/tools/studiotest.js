const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const file=process.argv[2];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,permissions:['microphone'],acceptDownloads:true});
 const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/vibrate/.test(m.text()))errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1800);
 await p.touchscreen.tap(195,420);await p.waitForTimeout(800);
 async function tapHit(id){const h=await p.evaluate(id=>{const h=UI.hits.slice().reverse().find(h=>h.id===id);return h?{x:h.x+h.w/2,y:h.y+h.h/2}:null},id);if(!h)throw new Error('нет кнопки '+id);await p.mouse.click(h.x,h.y);await p.waitForTimeout(350)}
 await p.evaluate(()=>go('studio',null,true));await p.waitForTimeout(900);
 await p.screenshot({path:'shots2/studio_home.png'});
 await tapHit('rs');await p.waitForTimeout(500);
 console.log('режим:',await p.evaluate(()=>SD.mode+' '+SD.set.length));
 await p.screenshot({path:'shots2/studio_read0.png'});
 await tapHit('rec');await p.waitForTimeout(2200);
 console.log('запись идёт:',await p.evaluate(()=>!!SD.rec));
 await p.screenshot({path:'shots2/studio_recording.png'});
 await tapHit('rec');await p.waitForTimeout(2500);
 console.log('после записи:',await p.evaluate(()=>({n:uvCount(),i:SD.i,busy:SD.busy})));
 // слушаем себя
 await tapHit('bk');await p.waitForTimeout(300);
 await p.evaluate(()=>{window.AN=AC.createAnalyser();AN.fftSize=2048;AM.connect(AN);window.rms=function(){var a=new Float32Array(AN.fftSize);AN.getFloatTimeDomainData(a);var s=0;for(var i=0;i<a.length;i++)s+=a[i]*a[i];return Math.sqrt(s/a.length)}});
 await p.screenshot({path:'shots2/studio_read1.png'});
 await tapHit('ls');await p.waitForTimeout(600);
 let mx=0;for(let q=0;q<30;q++){const r=await p.evaluate(()=>rms());if(r>mx)mx=r;await p.waitForTimeout(100)}
 console.log('голос играет: макс rms',mx.toFixed(4));
 await p.waitForTimeout(500);
 // экспорт
 await p.evaluate(()=>{SD.mode='home'});await p.waitForTimeout(300);
 const [dl]=await Promise.all([p.waitForEvent('download',{timeout:8000}).catch(()=>null),tapHit('ex')]);
 if(dl){await dl.saveAs('/tmp/golos_test.bin');console.log('экспорт:',fs.statSync('/tmp/golos_test.bin').size,'байт')}else console.log('экспорт: скачивания нет');
 // стереть и вернуть
 await p.evaluate(()=>{UVOICE={};VOB={};idbClear()});await p.waitForTimeout(300);
 const [fc]=await Promise.all([p.waitForEvent('filechooser',{timeout:8000}),tapHit('im')]);await fc.setFiles('/tmp/golos_test.bin');await p.waitForTimeout(1200);
 console.log('после импорта:',await p.evaluate(()=>uvCount()));
 // сохранность после перезагрузки (IndexedDB)
 await p.reload();await p.waitForTimeout(1800);console.log('после перезагрузки:',await p.evaluate(()=>uvCount()));
 // список
 await p.touchscreen.tap(195,420);await p.waitForTimeout(400);
 await p.evaluate(()=>{go('studio',null,true)});await p.waitForTimeout(700);await p.evaluate(()=>{SD.mode='list'});await p.waitForTimeout(600);await p.screenshot({path:'shots2/studio_list.png'});
 console.log(errs.length?'ОШИБКИ '+JSON.stringify(errs.slice(0,6)):'ошибок нет');
 await b.close();
})();
