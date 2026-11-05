// Проверка звука в настоящем браузере: разблокировка, декодирование всех треков и голосов, реальный сигнал на выходе.
const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const file=process.argv[2];
 const lines=JSON.parse(fs.readFileSync(__dirname+'/../voice/lines.json','utf8'));
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(2500);
 console.log('до касания:',await p.evaluate(()=>({ac:AC?AC.state:'нет',ok:audioOK,st:AUD.st})));
 await p.touchscreen.tap(195,420);await p.waitForTimeout(1200);
 console.log('после касания:',await p.evaluate(()=>({ac:AC?AC.state:'нет',ok:audioOK,st:AUD.st,mus:musCur,want:wantMus})));
 // уровень на выходе
 await p.evaluate(()=>{window.AN=AC.createAnalyser();AN.fftSize=2048;AM.connect(AN);window.rms=function(){var a=new Float32Array(AN.fftSize);AN.getFloatTimeDomainData(a);var s=0;for(var i=0;i<a.length;i++)s+=a[i]*a[i];return Math.sqrt(s/a.length)}});
 // 1) все треки декодируются
 const dec=await p.evaluate(async()=>{const r={};for(const n of Object.keys(MUS)){r[n]=await new Promise(res=>{const t=performance.now();decodeMus(n,b=>res({d:+b.duration.toFixed(1),ch:b.numberOfChannels,sr:b.sampleRate,ms:Math.round(performance.now()-t)}));setTimeout(()=>res('timeout'),20000)})}return r});
 console.log('треки:',JSON.stringify(dec));
 // 2) все реплики озвучены
 const miss=await p.evaluate(L=>{const m=[];let n=0;for(const l of L){if(!VOICE[vkey(l.w,l.t)])m.push(l.w+': '+l.t.slice(0,40));else n++}return {ok:n,miss:m}},lines);
 console.log('озвучено',miss.ok,'из',lines.length,'не нашлось',miss.miss.length,miss.miss.slice(0,5));
 // 3) музыка реально звучит
 for(const n of ['m_menu','m_prolog','m_boss2','m_race']){
  await p.evaluate(n=>music(n,{force:true,fade:.3}),n);await p.waitForTimeout(1800);
  const r=await p.evaluate(()=>{const x=[];for(let i=0;i<6;i++)x.push(rms());return {cur:musCur,rms:+(x.reduce((a,b)=>a+b,0)/6).toFixed(4)}});
  console.log('музыка',n,JSON.stringify(r));
 }
 // 4) голос: длительность, сигнал, приглушение музыки
 const v=await p.evaluate(async()=>{const k=Object.keys(VOICE)[5];const L=null;let d=voicePlay('nar','Тихо плещет вода у Старой Заводи.',function(){});return {d:d}});
 console.log('voicePlay (нет в списке):',JSON.stringify(v));
 const first=lines.find(l=>l.w==='nar');
 const v2=await p.evaluate(l=>{const d=voicePlay(l.w,l.t,function(){window.vdone=1});return {d:d,has:voiceHas(l.w,l.t)}},first);
 await p.waitForTimeout(700);
 const v3=await p.evaluate(()=>({busy:voiceBusy(),rms:+rms().toFixed(4),duck:musDuck}));
 console.log('голос:',JSON.stringify(v2),JSON.stringify(v3));
 await p.waitForTimeout((v2.d||2)*1000+800);
 console.log('после реплики:',await p.evaluate(()=>({done:window.vdone,duck:musDuck,busy:voiceBusy()})));
 // 5) все роли по одной реплике
 const roles=[...new Set(lines.map(l=>l.w))];
 for(const w of roles){const l=lines.find(x=>x.w===w);const d=await p.evaluate(l=>voicePlay(l.w,l.t),l);console.log(' роль',w,'длит.',d);await p.waitForTimeout(300);await p.evaluate(()=>voiceStop())}
 // 6) звуковой тест из настроек
 console.log('soundTest:',typeof soundTest);
 // 7) SFX атлас
 console.log('атлас:',await p.evaluate(()=>({buf:!!SFXBUF,keys:Object.keys(SFXM).length})));
 console.log(errs.length?('ОШИБКИ '+JSON.stringify(errs.slice(0,6))):'ошибок в консоли нет');
 await b.close();
})();
