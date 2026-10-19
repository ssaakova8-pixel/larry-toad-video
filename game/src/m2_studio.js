/* ===== Студия голоса: читаешь реплики сам — игра говорит ТВОИМ голосом вместо синтезатора =====
   Запись хранится на этом телефоне (IndexedDB) в исходном виде; при проигрывании игра убирает шум, выравнивает громкость и обрезает паузы.
   «Отправить записи» сохраняет всё в один файл — его можно прислать, и голос навсегда встроят в игру. */
var UVOICE={};                      /* k -> {dur,raw:ArrayBuffer,mime,w,t} */
var IDBX=null,IDBFAIL=false,SD=null;
var SPK_ORDER=['nar','larry','krap','vyp','sher','bass','spider','captain'];
function idbOpen(cb){if(IDBX){cb(IDBX);return}if(IDBFAIL||!window.indexedDB){cb(null);return}
 try{var r=indexedDB.open('sltv7voice',1);r.onupgradeneeded=function(){try{r.result.createObjectStore('r',{keyPath:'k'})}catch(e){}};
  r.onsuccess=function(){IDBX=r.result;cb(IDBX)};r.onerror=function(){IDBFAIL=true;cb(null)};r.onblocked=function(){cb(null)}}catch(e){IDBFAIL=true;cb(null)}}
function idbPut(rec){idbOpen(function(db){if(!db)return;try{db.transaction('r','readwrite').objectStore('r').put(rec)}catch(e){}})}
function idbDel(k){idbOpen(function(db){if(!db)return;try{db.transaction('r','readwrite').objectStore('r').delete(k)}catch(e){}})}
function idbClear(){idbOpen(function(db){if(!db)return;try{db.transaction('r','readwrite').objectStore('r').clear()}catch(e){}})}
function idbLoadMeta(){idbOpen(function(db){if(!db)return;try{var q=db.transaction('r').objectStore('r').getAll();q.onsuccess=function(){(q.result||[]).forEach(function(r){if(r&&r.raw)UVOICE[r.k]={dur:r.dur,raw:r.raw,mime:r.mime,w:r.w,t:r.t}})}}catch(e){}})}
function uvCount(){var n=0,k;for(k in UVOICE)n++;return n}
/* ---- звукорежиссёр: фильтры, шумовые ворота, обрезка пауз, выравнивание громкости. Возвращает AudioBuffer ---- */
function engineerBuf(buf,cb){var OC=window.OfflineAudioContext||window.webkitOfflineAudioContext,sr=24000,len=Math.ceil(buf.duration*sr)+Math.ceil(sr*.2);
 try{var oc=new OC(1,len,sr),src=oc.createBufferSource();src.buffer=buf;
  function bq(t,f,gn,q){var n=oc.createBiquadFilter();n.type=t;n.frequency.value=f;if(gn!=null)n.gain.value=gn;if(q)n.Q.value=q;return n}
  var chain=[bq('highpass',90,null,.7),bq('lowshelf',180,1.8),bq('peaking',420,-2.2,1),bq('peaking',3200,2.4,.9),bq('highshelf',9000,-2.5)];
  var cmp=oc.createDynamicsCompressor();cmp.threshold.value=-26;cmp.knee.value=18;cmp.ratio.value=3.2;cmp.attack.value=.004;cmp.release.value=.14;chain.push(cmp);
  var prev=src;chain.forEach(function(n){prev.connect(n);prev=n});prev.connect(oc.destination);src.start();
  var done=function(r){try{var d=r.getChannelData(0),n=d.length,B=Math.round(sr*.02),nb=Math.floor(n/B),rms=[],i,j;
   for(i=0;i<nb;i++){var s=0;for(j=0;j<B;j++){var x=d[i*B+j];s+=x*x}rms.push(Math.sqrt(s/B))}
   var sorted=rms.slice().sort(function(a,b){return a-b}),floor=sorted[Math.floor(nb*.1)]||1e-4,thr=Math.max(floor*2.6,.004),gain=1,out=new Float32Array(n);
   for(i=0;i<nb;i++){var tg=rms[i]<thr?.2:1;gain+=(tg-gain)*(tg<gain?.5:.25);for(j=0;j<B;j++)out[i*B+j]=d[i*B+j]*gain}
   var a0=0,a1=nb-1;while(a0<nb&&rms[a0]<thr*1.6)a0++;while(a1>a0&&rms[a1]<thr*1.6)a1--;
   var s0=Math.max(0,(a0-3)*B),s1=Math.min(n,(a1+10)*B);if(s1-s0<sr*.15){s0=0;s1=n}
   var seg=out.subarray(s0,s1),pk=0,e=0;for(i=0;i<seg.length;i++){var v=Math.abs(seg[i]);if(v>pk)pk=v;e+=seg[i]*seg[i]}
   var rm=Math.sqrt(e/seg.length)||1e-4,g2=Math.min(.1/rm,.92/(pk||1)*1.6),fin=new Float32Array(seg.length);
   for(i=0;i<seg.length;i++){var y=seg[i]*g2;fin[i]=Math.tanh(y*1.05)*.95}
   var fi=Math.round(sr*.012),fo=Math.round(sr*.09);for(i=0;i<fi&&i<fin.length;i++)fin[i]*=i/fi;for(i=0;i<fo&&i<fin.length;i++)fin[fin.length-1-i]*=i/fo;
   var ab=AC.createBuffer(1,fin.length,sr);if(ab.copyToChannel)ab.copyToChannel(fin,0);else ab.getChannelData(0).set(fin);cb(ab)}catch(e){cb(null)}};
  var pr=oc.startRendering();if(pr&&pr.then)pr.then(done,function(){cb(null)});else oc.oncomplete=function(e){done(e.renderedBuffer)}}catch(e){cb(null)}}
/* ---- реплики ---- */
function sdItems(){if(window.SDL)return window.SDL;window.SDL=STL.map(function(l){return{w:l[0],t:l[1],sec:l[2],st:l[3],k:vkey(l[0],l[1])}});return window.SDL}
function sdWho(w){return w==='nar'?{n:'Рассказчик',c:'#ffe27a'}:(WHO[w]||{n:w,c:'#ffffff'})}
function sdSet(kind){var L=sdItems();return L.filter(function(l){return kind==='story'?l.st===1:kind==='nar'?l.w==='nar':true})}
function sdMine(arr){var n=0;for(var i=0;i<arr.length;i++)if(UVOICE[arr[i].k])n++;return n}
/* ---- запись ---- */
function studioSave(l,raw,mime,dur){UVOICE[l.k]={dur:dur,raw:raw,mime:mime,w:l.w,t:l.t};delete VOB[l.k];idbPut({k:l.k,w:l.w,t:l.t,raw:raw,mime:mime,dur:dur,ts:Date.now()});
 try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}}
function studioIngest(l,raw,mime,after){audioUnlock();if(!AC){SD.busy=0;toast('Звук не запущен — коснись экрана','#ffcf8a');return}
 var copy=raw.slice(0);
 try{AC.decodeAudioData(copy,function(buf){engineerBuf(buf,function(eb){SD.busy=0;if(!eb){toast('Не удалось обработать запись','#ff9a8a');return}
   if(eb.duration<.25){toast('Слишком тихо или коротко — попробуй ещё раз','#ffcf8a');return}
   studioSave(l,raw,mime,eb.duration);sfx('buy');toast('Записано · '+eb.duration.toFixed(1)+' с','#9cf0a8');if(after)after()})},
  function(){SD.busy=0;toast('Этот формат записи не поддерживается','#ff9a8a')})}catch(e){SD.busy=0;toast('Не удалось прочитать запись','#ff9a8a')}}
function studioRecord(l,after){if(SD.rec){studioStop();return}
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){toast('Микрофон здесь недоступен — выбери готовую запись кнопкой «Файл»','#ffcf8a');return}
 audioUnlock();voiceStop();
 navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:true,autoGainControl:true}}).then(function(st){
  var mr;try{mr=new MediaRecorder(st)}catch(e){st.getTracks().forEach(function(t){t.stop()});toast('Запись не поддерживается','#ffcf8a');return}
  var chunks=[];mr.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data)};
  var an=null,dat=null;try{var src=AC.createMediaStreamSource(st);an=AC.createAnalyser();an.fftSize=512;src.connect(an);dat=new Float32Array(512)}catch(e){}
  mr.onstop=function(){st.getTracks().forEach(function(t){t.stop()});var mime=mr.mimeType||'audio/mp4',blob=new Blob(chunks,{type:mime});SD.rec=null;SD.busy=1;
   blob.arrayBuffer().then(function(ab){studioIngest(l,ab,mime,after)})};
  SD.rec={k:l.k,mr:mr,an:an,dat:dat,t:0,lv:0};mr.start()}).catch(function(){toast('Нет доступа к микрофону — разреши его в настройках Safari или выбери файл','#ffcf8a')})}
function studioStop(){if(SD.rec&&SD.rec.mr&&SD.rec.mr.state!=='inactive')SD.rec.mr.stop()}
function studioFile(l,after){var inp=document.createElement('input');inp.type='file';inp.accept='audio/*';inp.onchange=function(){var f=inp.files&&inp.files[0];if(!f)return;SD.busy=1;f.arrayBuffer().then(function(ab){studioIngest(l,ab,f.type||'audio/mp4',after)})};inp.click()}
function studioPlay(l){voiceStop();var d=voicePlay(l.w,l.t);if(!d)toast('Звук ещё закрыт: коснись экрана и попробуй снова','#ffcf8a')}
function studioPlaySynth(l){voiceStop();var d=voicePlayK(l.k,null,true);if(!d)toast('Образец синтезатора есть только в полной версии','#ffcf8a')}
function studioDel(l){if(UVOICE[l.k]){delete UVOICE[l.k];delete VOB[l.k];idbDel(l.k);toast('Запись удалена')}}
/* ---- файл с записями: отправить / вернуть ---- */
function studioExport(){var ks=Object.keys(UVOICE);if(!ks.length){toast('Пока нет записей','#ffcf8a');return}
 var idx=[],parts=[];ks.forEach(function(k){var u=UVOICE[k];idx.push({k:k,w:u.w,t:u.t,mime:u.mime,dur:u.dur,len:u.raw.byteLength});parts.push(u.raw)});
 var head=new TextEncoder().encode('SLTV1\n'+JSON.stringify(idx)+'\n'),blob=new Blob([head].concat(parts),{type:'application/octet-stream'});
 try{var file=new File([blob],'golos_anri.bin',{type:'application/octet-stream'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:'Мои записи голоса'}).catch(function(){});return}}catch(e){}
 try{var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='golos_anri.bin';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a)},500);toast('Файл golos_anri.bin сохранён','#9cf0a8')}catch(e){toast('Не получилось сохранить файл','#ff9a8a')}}
function studioImport(){var inp=document.createElement('input');inp.type='file';inp.onchange=function(){var f=inp.files&&inp.files[0];if(!f)return;f.arrayBuffer().then(function(ab){
  try{var u8=new Uint8Array(ab),p=0,nl=0,i;for(i=0;i<u8.length&&nl<2;i++){if(u8[i]===10){nl++;if(nl===1)p=i+1;else{var js=new TextDecoder().decode(u8.subarray(p,i)),idx=JSON.parse(js),off=i+1,n=0;
    idx.forEach(function(e){var raw=ab.slice(off,off+e.len);off+=e.len;UVOICE[e.k]={dur:e.dur,raw:raw,mime:e.mime,w:e.w,t:e.t};idbPut({k:e.k,w:e.w,t:e.t,raw:raw,mime:e.mime,dur:e.dur,ts:Date.now()});delete VOB[e.k];n++});
    toast('Возвращено записей: '+n,'#9cf0a8');return}}}toast('Это не файл с записями','#ff9a8a')}catch(e){toast('Не удалось прочитать файл','#ff9a8a')}})};inp.click()}
/* ---- сцена ---- */
function sdMic(g,x,y,r,col){g.save();g.fillStyle=col;g.strokeStyle=col;g.lineWidth=r*.16;rr(x-r*.3,y-r*.62,r*.6,r*.95,r*.3);g.fill();g.beginPath();g.arc(x,y+r*.02,r*.52,.1*PI,.9*PI);g.stroke();g.beginPath();g.moveTo(x,y+r*.54);g.lineTo(x,y+r*.8);g.moveTo(x-r*.28,y+r*.8);g.lineTo(x+r*.28,y+r*.8);g.stroke();g.restore()}
function sdRecBadge(g,t){var r=SD.rec;if(!r)return;if(r.an){r.an.getFloatTimeDomainData(r.dat);var s=0,i;for(i=0;i<r.dat.length;i++)s+=r.dat[i]*r.dat[i];r.lv+=(Math.min(1,Math.sqrt(s/r.dat.length)*7)-r.lv)*.3}else r.lv=.4+.3*Math.sin(t*9);r.t+=.016}
function sdStartRead(kind){var set=sdSet(kind),i=0;while(i<set.length-1&&UVOICE[set[i].k])i++;SD.mode='read';SD.set=set;SD.i=i;SD.kind=kind}
SC.studio={
 enter:function(){SD={mode:'home',set:[],i:0,kind:'',flt:'all',scroll:0,max:0,drag:null,rec:null,busy:0,conf:0};fadeMusic();ambient(null)},
 leave:function(){if(SD.rec)studioStop();voiceStop();music('m_menu')},
 draw:function(g){var t=sceneT,i;g.fillStyle=LG(g,0,0,0,H,[0,'#1c1a3a',1,'#0a0c1c']);g.fillRect(0,0,W,H);
  var pw=Math.min(W-24,560),px=(W-pw)/2,all=sdItems(),y0,y1=H-SAFE.b-6;
  if(SD.mode==='home'){
   var hb=topBar('Студия голоса',function(){go('settings')},false);y0=hb+8;
   g.save();g.beginPath();g.rect(0,y0,W,y1-y0);g.clip();var y=y0-SD.scroll+4,bh=Math.max(58,fz(24)*2.4);
   var lines=wrapLines('Прочитай реплики своим голосом. Игра сама уберёт шум, выровняет громкость и будет говорить ТВОИМ голосом вместо синтезатора. Читай спокойно, как сказку на ночь. Запись хранится на этом телефоне.',pw-4,fz(15),{fam:FU,w:500});
   for(i=0;i<lines.length;i++)txt(lines[i],px+2,y+fz(16)+i*fz(15)*1.3,fz(15),'#d6def2',{fam:FU,w:500});y+=lines.length*fz(15)*1.3+fz(14);
   var st1=sdSet('story'),n1=sdMine(st1),n2=sdMine(all);
   txt('Записано твоим голосом: '+n2+' из '+all.length,px+2,y+fz(15),fz(16),'#ffe27a',{fam:FU,w:800});y+=fz(26);
   txt('Рассказчик, сюжет: '+n1+' из '+st1.length,px+2,y+fz(15),fz(15),'#9cf0a8',{fam:FU,w:700});y+=fz(30);
   function B(id,label,sub,fn,sty){if(y+bh>y0&&y<y1)btn(id,px,y,pw,bh,label,fn,{st:sty||'dark',sub:sub,px:fz(18)});y+=bh+9}
   B('rs','Читать сюжет за рассказчика',st1.length+' реплик · около 10 минут',function(){sdStartRead('story')},'gold');
   B('rn','Все реплики рассказчика',sdSet('nar').length+' реплик · с комментатором',function(){sdStartRead('nar')},'blue');
   B('ra','Вообще все реплики игры',all.length+' реплик · и герои тоже',function(){sdStartRead('all')},'green');
   B('rl','Список реплик','выбрать любую и записать',function(){SD.mode='list';SD.scroll=0},'dark');
   B('au','Слово автора ▶','твоя запись из начала работы',function(){audioUnlock();setTimeout(function(){if(!voicePlayK('author'))toast('Слово автора есть только в полной версии','#ffcf8a')},120)},'dark');
   B('ex','Отправить мои записи','пришли мне файл — голос встроят в игру',function(){studioExport()},'dark');
   B('im','Вернуть записи из файла','если ставишь новую версию игры',function(){studioImport()},'dark');
   B('cl',SD.conf?'Точно стереть все записи? Нажми ещё раз':'Стереть мои записи',SD.conf?'':'вернётся голос рассказчика-синтезатора',function(){if(!SD.conf){SD.conf=1;setTimeout(function(){if(SD)SD.conf=0},3500)}else{UVOICE={};VOB={};idbClear();SD.conf=0;toast('Записи стёрты')}},SD.conf?'red':'ghost');
   y+=10;SD.max=Math.max(0,y+SD.scroll-y1);g.restore()}
  else if(SD.mode==='read'){
   var hb2=topBar('Чтение реплик',function(){if(SD.rec)studioStop();SD.mode='home';SD.scroll=0},false),set=SD.set,l=set[SD.i],has=!!UVOICE[l.k],who=sdWho(l.w),rec=SD.rec&&SD.rec.k===l.k;
   var land=W>H*1.15,m0=Math.max(16,(SAFE.l||0)+8),LX=px,LW=pw,RX=px,RW=pw;if(land){LX=m0;LW=W*.5-m0-8;RX=W*.5+8;RW=W-RX-Math.max(16,(SAFE.r||0)+8)}
   var y2=hb2+6;sdRecBadge(g,t);
   txt('Реплика '+(SD.i+1)+' из '+set.length+' · записано '+sdMine(set),LX+4,y2+fz(15),fz(14),'#aab6d6',{fam:FU,w:700});y2+=fz(22);
   rr(LX+4,y2,LW-8,8,4);g.fillStyle='rgba(255,255,255,.12)';g.fill();rr(LX+4,y2,Math.max(8,(LW-8)*(SD.i+1)/set.length),8,4);g.fillStyle='#ffe27a';g.fill();y2+=fz(22);
   setFont(fz(13),800,FU);var nm=who.n,tw=g.measureText(nm).width+fz(20);rr(LX+4,y2,tw,fz(24),fz(12));g.fillStyle=who.c;g.fill();txt(nm,LX+4+tw/2,y2+fz(17),fz(13),'#10182a',{al:'center',fam:FU,w:800});
   txt(l.sec,LX+4+tw+10,y2+fz(17),fz(13),'#8f9cc0',{fam:FU,w:600});y2+=fz(36);
   var bh2=Math.max(50,fz(22)*2),fh=Math.round(bh2*.74),by=y1-bh2-fz(4),fy=by-fh-fz(10),rr0=land?fz(32):fz(38),zone=fz(22)+rr0*2+16+fz(44),
    ph=land?Math.max(fz(90),y1-y2-6):Math.max(fz(110),fy-4-zone-y2-fz(8)),pxs=fz(26),ls=[],lh;
   while(pxs>fz(15)){ls=wrapLines(l.t,LW-48,pxs,{it:true,w:500});lh=pxs*1.34;if(ls.length*lh<ph-34)break;pxs-=1}
   panel(LX,y2,LW,ph,{r:18,stroke:has?'rgba(120,230,150,.85)':'rgba(255,255,255,.22)'});
   var ty=y2+(ph-ls.length*lh)/2+pxs*.8;for(i=0;i<ls.length;i++)txt(ls[i],LX+24,ty+i*lh,pxs,'#fff',{it:true,w:500});
   var cy=land?hb2+10:y2+ph+fz(8),rcx=RX+RW/2,rcy=cy+fz(22)+rr0+8,hy=rcy+rr0+16+fz(8),fy2=land?hy+fz(8)+6+fz(12):fy,by2=land?fy2+fh+fz(8):by;
   if(has)txt('✓ твой голос · '+UVOICE[l.k].dur.toFixed(1)+' с',rcx,cy+fz(14),fz(15),'#9cf0a8',{al:'center',fam:FU,w:800});
   else txt('пока читает синтезатор',rcx,cy+fz(14),fz(15),'#8f9cc0',{al:'center',fam:FU,w:600});
   g.save();g.beginPath();g.arc(rcx,rcy,rr0+(rec?4+Math.sin(t*8)*3:0),0,TAU);g.fillStyle=rec?'#ff3a2c':'#e0463f';g.shadowColor='rgba(255,60,50,.6)';g.shadowBlur=rec?24:10;g.fill();g.restore();
   g.beginPath();g.arc(rcx,rcy,rr0,0,TAU);g.lineWidth=4;g.strokeStyle='rgba(255,255,255,.85)';g.stroke();
   if(rec){rr(rcx-rr0*.3,rcy-rr0*.3,rr0*.6,rr0*.6,6);g.fillStyle='#fff';g.fill()}else sdMic(g,rcx,rcy,rr0*.72,'#fff');
   UI.hits.push({id:'rec',x:rcx-rr0*1.1,y:rcy-rr0*1.1,w:rr0*2.2,h:rr0*2.2,fn:function(){if(SD.busy)return;studioRecord(l,function(){if(SD.set===set&&SD.i===set.indexOf(l)&&SD.i<set.length-1)setTimeout(function(){if(SD&&SD.mode==='read'&&!SD.rec&&SD.set===set){SD.i++}},650)})}});
   if(rec){var r=SD.rec;fitTxt('Идёт запись · '+r.t.toFixed(1)+' с · нажми ещё раз',rcx,hy,RW-8,fz(14),'#ffb3ab',{al:'center',fam:FU,w:700});rr(rcx-(RW-80)/2,hy+fz(8),(RW-80)*r.lv,6,3);g.fillStyle='#9cf0a8';g.fill()}
   else fitTxt(SD.busy?'Обрабатываю запись…':'Нажми, прочитай, нажми ещё раз',rcx,hy,RW-8,fz(14),SD.busy?'#ffe27a':'#aab6d6',{al:'center',fam:FU,w:700});
   var bw=(RW-16)/3;
   btn('bk',RX,by2,bw,bh2,'◀ Назад',function(){if(SD.rec)studioStop();if(SD.i>0)SD.i--},{st:'dark',px:fz(15),dis:SD.i<=0});
   btn('ls',RX+bw+8,by2,bw,bh2,has?'Мой голос':'Образец',function(){has?studioPlay(l):studioPlaySynth(l)},{st:has?'green':'blue',px:fz(15)});
   btn('nx',RX+(bw+8)*2,by2,bw,bh2,SD.i>=set.length-1?'Готово':'Дальше ▶',function(){if(SD.rec)studioStop();if(SD.i<set.length-1)SD.i++;else{SD.mode='home';SD.scroll=0;toast('Это была последняя реплика','#9cf0a8')}},{st:'gold',px:fz(15)});
   btn('fl',RX,fy2,bw,fh,'Файл',function(){studioFile(l)},{st:'ghost',px:fz(14)});
   btn('de',RX+(bw+8)*2,fy2,bw,fh,'Стереть',function(){studioDel(l)},{st:'ghost',px:fz(14),dis:!has})}
  else{ /* список */
   var hb3=topBar('Список реплик',function(){if(SD.rec)studioStop();SD.mode='home';SD.scroll=0},false);y0=hb3+6;
   var fs=[['all','Все'],['mine','Мои']].concat(SPK_ORDER.map(function(s){return[s,sdWho(s).n]})),cx=px,cy2=y0,chh=Math.max(38,fz(15)*2.1);
   for(i=0;i<fs.length;i++){setFont(fz(14),700,FU);var cw=g.measureText(fs[i][1]).width+fz(24);if(cx+cw>px+pw){cx=px;cy2+=chh+6}
    (function(f){var on=SD.flt===f[0];rr(cx,cy2,cw,chh,chh/2);g.fillStyle=on?(f[0]==='all'||f[0]==='mine'?'#ffe27a':sdWho(f[0]).c):'rgba(255,255,255,.1)';g.fill();txt(f[1],cx+cw/2,cy2+chh/2,fz(14),on?'#10182a':'#dfe6f5',{al:'center',fam:FU,w:700,bl:'middle'});UI.hits.push({id:'f'+f[0],x:cx,y:cy2,w:cw,h:chh,fn:function(){SD.flt=f[0];SD.scroll=0}})})(fs[i]);cx+=cw+6}
   y0=cy2+chh+8;g.save();g.beginPath();g.rect(0,y0,W,y1-y0);g.clip();
   var yy=y0-SD.scroll,lst=all.filter(function(l){return SD.flt==='all'||(SD.flt==='mine'?!!UVOICE[l.k]:l.w===SD.flt)}),px2=fz(15),bh3=Math.max(42,fz(16)*2.2);
   for(i=0;i<lst.length;i++){var l2=lst[i],h2=!!UVOICE[l2.k],ls2=wrapLines(l2.t,pw-32,px2,{}),ch=fz(46)+ls2.length*px2*1.3+bh3+20;
    if(yy+ch>y0-4&&yy<y1+4){var w2=sdWho(l2.w);panel(px,yy,pw,ch,{r:14,stroke:h2?'rgba(120,230,150,.85)':'rgba(255,255,255,.2)'});
     setFont(fz(13),800,FU);var tw2=g.measureText(w2.n).width+fz(18);rr(px+12,yy+fz(10),tw2,fz(22),fz(11));g.fillStyle=w2.c;g.fill();txt(w2.n,px+12+tw2/2,yy+fz(10)+fz(16),fz(13),'#10182a',{al:'center',fam:FU,w:800});
     if(h2)txt('✓ '+UVOICE[l2.k].dur.toFixed(1)+' с',px+pw-14,yy+fz(26),fz(13),'#9cf0a8',{al:'right',fam:FU,w:700});
     for(var q=0;q<ls2.length;q++)txt(ls2[q],px+16,yy+fz(48)+q*px2*1.3,px2,'#fff',{w:500});
     var bw3=(pw-24-16)/3,b3=yy+ch-bh3-10,recOn=SD.rec&&SD.rec.k===l2.k;
     if(b3>y0-bh3&&b3<y1){(function(l){btn('p'+l.k,px+12,b3,bw3,bh3,'Слушать',function(){studioPlay(l)},{st:'dark',px:fz(14)});
      btn('r'+l.k,px+12+bw3+8,b3,bw3,bh3,recOn?'Стоп':'Запись',function(){if(!SD.busy)studioRecord(l)},{st:recOn?'red':'gold',px:fz(14)});
      btn('d'+l.k,px+12+(bw3+8)*2,b3,bw3,bh3,'Стереть',function(){studioDel(l)},{st:'ghost',px:fz(14),dis:!UVOICE[l.k]})})(l2)}}
    yy+=ch+10}
   SD.max=Math.max(0,yy+SD.scroll-y1+8);g.restore();
   if(SD.rec){sdRecBadge(g,t);var r2=SD.rec,bw2=Math.min(W-30,420),bx=(W-bw2)/2,by2=H-SAFE.b-fz(70);panel(bx,by2,bw2,fz(56),{stroke:'rgba(255,120,110,.9)'});g.beginPath();g.arc(bx+26,by2+fz(28),7+Math.sin(t*8)*2,0,TAU);g.fillStyle='#ff4a3a';g.fill();
    txt('Идёт запись · '+r2.t.toFixed(1)+' с — нажми «Стоп»',bx+44,by2+fz(24),fz(15),'#fff',{fam:FU,w:700});rr(bx+44,by2+fz(34),(bw2-60)*r2.lv,8,4);g.fillStyle='#9cf0a8';g.fill()}
   if(SD.busy)txt('Обрабатываю запись…',W/2,H-SAFE.b-fz(14),fz(16),'#ffe27a',{al:'center',fam:FU,w:700,sh:'rgba(0,0,0,.7)'})}},
 down:function(p){SD.drag=p.id;SD.y0=p.y;SD.s0=SD.scroll},move:function(p){if(SD.drag===p.id&&!p.onUI&&SD.mode!=='read')SD.scroll=clamp(SD.s0+(SD.y0-p.y),0,SD.max)},up:function(p){if(SD.drag===p.id)SD.drag=null}};
