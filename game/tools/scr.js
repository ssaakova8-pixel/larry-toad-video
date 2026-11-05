const {chromium}=require('playwright');
(async()=>{
 const file=process.argv[2],vp=(process.argv[3]||'390x844').split('x').map(Number),tag=process.argv[4]||'';
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:2,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/vibrate/.test(m.text()))errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1800);
 console.log('scenes:',await p.evaluate(()=>Object.keys(SC).join(' ')));
 const shots=[['settings',"go('settings')"],['rivers',"go('rivers')"],['camp',"go('camp',{back:'title'})"],['mapok',"sv.cmp=30;go('map')"],
  ['pause',"go('title');setTimeout(function(){setScene('run',{mode:'endless',night:1})},50)"]];
 for(const [n,js] of shots){try{await p.evaluate(js);await p.waitForTimeout(1600);if(n==='pause'){await p.evaluate(()=>{if(typeof pauseGame==='function')pauseGame();else if(typeof V!=='undefined')V.paused=true});await p.waitForTimeout(500)}await p.screenshot({path:`shots2/${n}${tag}.png`});console.log('ok',n)}catch(e){console.log('ERR',n,String(e).slice(0,120))}}
 // экран результата этапа
 try{await p.evaluate(()=>{sv.cmp=0;chainContinue()});await p.waitForTimeout(500);}catch(e){}
 console.log(errs.length?'ERRORS '+JSON.stringify(errs.slice(0,5)):'ошибок нет');
 await b.close();
})();
