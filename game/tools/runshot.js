// node runshot.js file.html out_prefix WxH mode(story|endless|race) ch seconds [shots...]  — играет автопилотом и снимает кадры
const {chromium}=require('playwright');
(async()=>{
 const [file,pre,vp,mode,ch,secs]=process.argv.slice(2);const [w,h]=vp.split('x').map(Number);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1500);await p.touchscreen.tap(w/2,h/2);await p.waitForTimeout(500);
 await p.evaluate(([m,c])=>{var cfg=m==='story'?{mode:'story',ch:+c,replay:true}:m==='race'?{mode:'race',river:+c}:{mode:'endless',night:1};go('run',cfg,true)},[mode,ch]);
 await p.waitForTimeout(1500);
 const n=+secs||6;
 for(let i=0;i<n;i++){await p.waitForTimeout(1000);
  // простой автопилот: нажать и отпустить, когда нужно
  await p.evaluate(()=>{try{if(window.AP)AP()}catch(e){}});
  await p.screenshot({path:pre+'_'+i+'.png'});}
 console.log(errs.length?errs:'ok');await b.close()})();
