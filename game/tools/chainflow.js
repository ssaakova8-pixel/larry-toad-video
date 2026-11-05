// Проходит всю цепочку Сказки по интерфейсу: сцены листаются, этапы и головоломки завершаются принудительно. Проверяет порядок событий и что нигде нет тупика.
const {chromium}=require('playwright');
(async()=>{
 const file=process.argv[2],vp=(process.argv[3]||'390x844').split('x').map(Number),start=+process.argv[4]||0;
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1,hasTouch:true});
 const errs=[];p.on('pageerror',e=>errs.push(String(e.stack||e).slice(0,400)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+file);await p.waitForTimeout(1800);
 await p.evaluate(()=>{sv.cmp=0;});
 await p.evaluate(s=>{sv.cmp=s;chainContinue()},start);
 const seq=[];let guard=0,last='';
 while(guard++<2000){
  await p.waitForTimeout(40);
  const st=await p.evaluate(()=>({cur:cur,fade:fadeDir,cmp:sv.cmp,id:(typeof SS!=='undefined'&&SS&&cur==='story')?SS.id:null,fin:sv.fin}));
  if(st.fade!==0)continue;
  const key=st.cur+':'+(st.id||'');
  if(st.cur==='story'){await p.evaluate(()=>{if(SS.done)storyTap();else storyTap()});if(key!==last){seq.push(key);last=key}}
  else if(st.cur==='run'){await p.waitForTimeout(500);const r=await p.evaluate(()=>{if(!S)return 'nosim';if(S.phase==='win'){if(S.cs.boss&&!V.done){V.done=true;runDone()}return 'win'}if(S.cs.boss){S.phase='win';S.phT=3;V.done=true;S.fireN=5;S.fireTot=10;runDone();return 'boss'}S.phase='win';S.phT=3;return 'forced'});if(key!==last){seq.push('R'+(await p.evaluate(()=>S.ch)));last=key}}
  else if(st.cur==='puz'){await p.waitForTimeout(200);const k=await p.evaluate(()=>{const k=P.ch+'.'+P.pg;if(!P.win)pzWin();campNext();return k});seq.push('Z'+k);last=key}
  else if(st.cur==='stageres'){await p.waitForTimeout(300);await p.evaluate(()=>{chainNext(RS2.a.chain)});seq.push('res');last=key}
  else if(st.cur==='part'){await p.waitForTimeout(300);const c=await p.evaluate(()=>{const c=RW.ch;chainNext(RW.chain);return c});seq.push('W'+c);last=key}
  else if(st.cur==='end'){seq.push('E');break}
  else if(st.cur==='title'){seq.push('TITLE?');break}
  else {seq.push('??'+st.cur);break}
 }
 const fin=await p.evaluate(()=>({cmp:sv.cmp,len:CHAIN.length,fin:sv.fin,part:sv.part,cs:sv.cs}));
 console.log(seq.join(' '));console.log(JSON.stringify(fin));if(errs.length)console.log('ERRORS',errs.slice(0,6));
 await b.close();
})();
