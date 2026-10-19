/* ===== ядро: холст, сохранение, сцены, ввод, UI ===== */
var cv=document.getElementById('c'),g=cv.getContext('2d');
var PQ={cap:2.5,ema:16.7,n:0,warm:0,raw:0},W=0,H=0,U=56,UB=56,WY=0,dpr=1,SAFE={t:0,b:0,l:0,r:0},TS=1.15,NOW=0,DEBUG=location.hash.indexOf('dbg')>=0;
var FT='Lora,Georgia,"Times New Roman",serif',FU='Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
function fz(px){return Math.round(Math.max(15,px*TS))}
function fzs(px){return Math.round(px*Math.min(TS,1.2))}   /* для HUD: слабее зависит от масштаба */
/* ---- сохранение ---- */
var SV0={v:7,fire:0,firetot:0,up:{h:0,e:0,p:0,s:0,m:0,g:0,r:0,w:0,t:0},cs:[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],nb:0,pb:0,nt:0,dayKey:0,dayBest:0,streak:0,lastDay:0,runs:0,seen:{},book:[],intro:0,fin:0,
 nick:'',race:{},missions:{day:0,list:[],done:{}},boards:{},cmp:0,part:[0,0,0,0,0],done:{},tries:{},
 set:{mu:.6,fx:.8,vo:1,ts:1,sc:0,hint:1,vib:1,lang:'ru',bl:1,nar:1,film:1}};
var sv=JSON.parse(JSON.stringify(SV0));
function mergeDef(a,b){for(var k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])){if(!a[k]||typeof a[k]!=='object')a[k]={};mergeDef(a[k],b[k])}else if(a[k]===undefined)a[k]=b[k]}return a}
function load(){try{var s=localStorage.getItem('sltv7');
  if(s){var o=JSON.parse(s);sv=mergeDef(o,JSON.parse(JSON.stringify(SV0)))}
  if(!Array.isArray(sv.cs))sv.cs=SV0.cs.slice();else{sv.cs=sv.cs.map(function(v){return typeof v==='number'?v:-1});while(sv.cs.length<15)sv.cs.push(-1);sv.cs.length=15}
  if(!Array.isArray(sv.part)||sv.part.length<5)sv.part=[0,0,0,0,0];
  if(!sv.race||typeof sv.race!=='object')sv.race={};if(!sv.tries||typeof sv.tries!=='object')sv.tries={};if(!sv.done||typeof sv.done!=='object')sv.done={}}catch(e){}applySettings()}
function save(){try{localStorage.setItem('sltv7',JSON.stringify(sv))}catch(e){}}
var TSV=[1,1.15,1.3,1.5];function applySettings(){TS=TSV[clamp(sv.set.ts|0,0,3)]||1.15}
function vib(ms){if(sv.set.vib&&navigator.vibrate){try{navigator.vibrate(ms)}catch(e){}}}
/* ---- холст ---- */
function rs(){dpr=Math.min(window.devicePixelRatio||1,PQ.cap);W=window.innerWidth;H=window.innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cv.style.width=W+'px';cv.style.height=H+'px';g.setTransform(dpr,0,0,dpr,0,0);
 var port=H>=W*1.05;UB=port?clamp(W/9.2,34,60):clamp(Math.min(W/14,H/7.4),34,64);U=UB;WY=Math.round(H*(port?.63:.72));
 try{var d=document.getElementById('sa');if(d){var cs=getComputedStyle(d);SAFE.t=parseFloat(cs.paddingTop)||0;SAFE.b=parseFloat(cs.paddingBottom)||0;SAFE.l=parseFloat(cs.paddingLeft)||0;SAFE.r=parseFloat(cs.paddingRight)||0}}catch(e){}
 if(SC[cur]&&SC[cur].resize)SC[cur].resize()}
/* ---- сцены ---- */
var SC={},cur='',nextScene=null,fade=0,fadeDir=0,fadeCol='#05101c',sceneT=0,PRE='';
function go(name,arg,quick){if(quick){setScene(name,arg);return}nextScene={n:name,a:arg};fadeDir=1}
function setScene(name,arg){if(SC[cur]&&SC[cur].leave)SC[cur].leave();PRE=cur;cur=name;sceneT=0;UI.hits=[];UI.press=null;if(SC[cur].enter)SC[cur].enter(arg)}
/* ---- ввод ---- */
var UI={hits:[],press:null,ptr:{}};
function pt(e){return{id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now()}}
function hitAt(x,y){for(var i=UI.hits.length-1;i>=0;i--){var h=UI.hits[i];if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)return h}return null}
cv.addEventListener('pointerdown',function(e){e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}
 var p=pt(e);UI.ptr[p.id]=p;audioUnlock();var h=hitAt(p.x,p.y);p.h=h;p.sx=p.x;p.sy=p.y;
 if(h){UI.press=h.id;p.onUI=true;if(h.down)h.down(p)}
 else if(SC[cur]&&SC[cur].down)SC[cur].down(p)},{passive:false});
cv.addEventListener('pointermove',function(e){var p=UI.ptr[e.pointerId];if(!p)return;p.x=e.clientX;p.y=e.clientY;if(SC[cur]&&SC[cur].move)SC[cur].move(p)},{passive:false});
function pup(e,cancel){var p=UI.ptr[e.pointerId];if(!p)return;p.x=e.clientX;p.y=e.clientY;delete UI.ptr[e.pointerId];
 if(p.onUI){var h=hitAt(p.x,p.y);UI.press=null;if(p.h&&p.h.up)p.h.up(p,cancel);if(!cancel&&h&&p.h&&h.id===p.h.id&&h.fn){sfx('ui');h.fn(p)}}
 else if(SC[cur]&&SC[cur].up)SC[cur].up(p,cancel)}
cv.addEventListener('pointerup',function(e){e.preventDefault();pup(e,false)},{passive:false});
cv.addEventListener('pointercancel',function(e){pup(e,true)});
cv.addEventListener('contextmenu',function(e){e.preventDefault()});
window.addEventListener('keydown',function(e){if(SC[cur]&&SC[cur].key&&SC[cur].key(e,true))e.preventDefault()});
window.addEventListener('keyup',function(e){if(SC[cur]&&SC[cur].key&&SC[cur].key(e,false))e.preventDefault()});
document.addEventListener('visibilitychange',function(){if(document.hidden&&SC[cur]&&SC[cur].hide)SC[cur].hide()});
/* ---- примитивы UI ---- */
function rr(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function setFont(px,wt,fam,it){g.font=(it?'italic ':'')+(wt||400)+' '+px+'px '+(fam||FT)}
function txt(s,x,y,px,col,o){o=o||{};setFont(px,o.w||(o.fam===FU?700:500),o.fam||FT,o.it);g.textAlign=o.al||'left';g.textBaseline=o.bl||'alphabetic';
 if(o.sh){g.lineJoin='round';g.lineWidth=o.shw||Math.max(3,px*.18);g.strokeStyle=o.sh;g.strokeText(s,x,y)}
 g.fillStyle=col||'#fff';g.fillText(s,x,y)}
function wrapLines(s,maxW,px,o){o=o||{};setFont(px,o.w||500,o.fam||FT,o.it);var out=[],par=String(s).split('\n'),i,j,w,line,test;
 for(i=0;i<par.length;i++){var words=par[i].split(' ');line='';for(j=0;j<words.length;j++){test=line?line+' '+words[j]:words[j];if(g.measureText(test).width>maxW&&line){out.push(line);line=words[j]}else line=test}out.push(line)}return out}
function para(s,x,y,maxW,px,col,o){o=o||{};var lh=o.lh||px*1.32,ls=wrapLines(s,maxW,px,o),i;for(i=0;i<ls.length;i++){var xx=x;txt(ls[i],xx,y+i*lh,px,col,o)}return ls.length*lh}
function ellip(s,maxW,px,o){o=o||{};setFont(px,o.w||500,o.fam||FT,o.it);if(g.measureText(s).width<=maxW)return s;while(s.length>1&&g.measureText(s+'…').width>maxW)s=s.slice(0,-1);return s.replace(/\s+$/,'')+'…'}
function fitTxt(s,x,y,maxW,px,col,o){o=o||{};setFont(px,o.w||(o.fam===FU?700:500),o.fam||FT,o.it);var w=g.measureText(s).width;if(w>maxW)px=Math.max(15,px*maxW/w);txt(s,x,y,px,col,o)}
/* кнопки */
var BS={
 gold:['#ffe27a','#f2a91b','#8a5200','#4a2a00'],green:['#8de06a','#3fa84a','#1f6a30','#0f3a1a'],red:['#ff8a7a','#e0463f','#8a1f24','#4a0c10'],blue:['#8ac8ff','#3f86e0','#1c4a96','#0c2250'],
 dark:['#4a5a7a','#2a3650','#141c2e','#0a0f1a'],ghost:['rgba(255,255,255,.16)','rgba(255,255,255,.08)','rgba(255,255,255,.35)','#fff'],ok:['#9cf0a8','#3fbf5a','#1f7a38','#0a3a1a']};
function btn(id,x,y,w,h,label,fn,o){o=o||{};var st=BS[o.st||'gold'],pr=UI.press===id,sc=pr?.96:1,px=o.px||fz(20),dis=o.dis;
 g.save();g.translate(x+w/2,y+h/2);g.scale(sc,sc);g.translate(-w/2,-h/2);
 var r=o.r||Math.min(h*.36,22);
 if(!dis){g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=10;g.shadowOffsetY=4}
 rr(0,0,w,h,r);g.fillStyle=dis?'#3a4452':LG(g,0,0,0,h,[0,st[0],1,st[1]]);g.fill();g.shadowColor='transparent';
 if(st[0].indexOf('rgba')===0){g.lineWidth=2;g.strokeStyle=st[2];g.stroke()}else{g.lineWidth=Math.max(2,h*.05);g.strokeStyle=dis?'#222a36':st[2];g.stroke();
 rr(2,2,w-4,h*.48,r-2);g.fillStyle='rgba(255,255,255,.22)';g.fill()}
 var tc=dis?'rgba(255,255,255,.55)':(o.col||(o.st==='ghost'||o.st==='dark'?'#fff':st[3]));
 if(o.icon){o.icon(g,h*.52,h/2,Math.min(h*.3,w*.2))}
 var lx=w/2+(o.icon?h*.3:0),mw=w-h*.5-(o.icon?h*.6:0);
 if(label){if(o.sub){fitTxt(label,lx,h*.46,mw,px,tc,{al:'center',fam:FU,w:700});fitTxt(o.sub,lx,h*.76,mw,Math.max(15,px*.7),tc,{al:'center',fam:FU,w:600})}else fitTxt(label,lx,h/2+px*.36,mw,px,tc,{al:'center',fam:FU,w:700})}
 g.restore();
 if(!dis)UI.hits.push({id:id,x:x,y:y,w:w,h:h,fn:fn})}
function circBtn(id,cx,cy,r,fn,icon,o){o=o||{};var pr=UI.press===id,sc=pr?.93:1,st=BS[o.st||'dark'];
 g.save();g.translate(cx,cy);g.scale(sc,sc);g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=10;g.shadowOffsetY=3;
 g.beginPath();g.arc(0,0,r,0,TAU);g.fillStyle=o.fill||LG(g,0,-r,0,r,[0,st[0],1,st[1]]);g.fill();g.shadowColor='transparent';g.lineWidth=Math.max(2,r*.08);g.strokeStyle=o.ring||st[2];g.stroke();
 g.beginPath();g.arc(0,-r*.1,r*.86,PI*1.1,PI*1.9);g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=r*.07;g.stroke();
 if(icon)icon(g,0,0,r*(o.ir||.5));g.restore();
 UI.hits.push({id:id,x:cx-r*1.1,y:cy-r*1.1,w:r*2.2,h:r*2.2,fn:fn,down:o.down,up:o.up})}
function panel(x,y,w,h,o){o=o||{};var r=o.r||18;g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=18;g.shadowOffsetY=6;rr(x,y,w,h,r);g.fillStyle=o.fill||LG(g,0,y,0,y+h,[0,'rgba(36,52,86,.96)',1,'rgba(18,28,52,.97)']);g.fill();g.restore();
 g.lineWidth=2;g.strokeStyle=o.stroke||'rgba(255,214,120,.55)';rr(x,y,w,h,r);g.stroke()}
/* иконки */
function icStar(g,x,y,r,fill,ol){g.beginPath();for(var i=0;i<10;i++){var a=-PI/2+i*PI/5,rad=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rad,y+Math.sin(a)*rad)}g.closePath();g.fillStyle=fill||'#ffd24a';g.fill();g.lineWidth=Math.max(1,r*.12);g.strokeStyle=ol||'#8a5200';g.lineJoin='round';g.stroke()}
function icPetal(g,x,y,r,full){g.save();g.translate(x,y);for(var i=0;i<5;i++){g.save();g.rotate(i*TAU/5);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(r*.55,-r*.35,0,-r);g.quadraticCurveTo(-r*.55,-r*.35,0,0);g.fillStyle=full?LG(g,0,0,0,-r,[0,'#ffd1e0',1,'#ff5f93']):'rgba(90,100,130,.55)';g.fill();g.lineWidth=Math.max(1,r*.08);g.strokeStyle=full?'#a02050':'#3a4260';g.stroke();g.restore()}
 g.beginPath();g.arc(0,0,r*.22,0,TAU);g.fillStyle=full?'#ffe066':'#6a728c';g.fill();g.restore()}
function icFire(g,x,y,r){glow(g,x,y,r*1.5,'#fff0a0',.7);g.beginPath();g.ellipse(x,y,r*.5,r*.38,0,0,TAU);g.fillStyle='#fff6b0';g.fill();g.lineWidth=Math.max(1,r*.1);g.strokeStyle='#a86a00';g.stroke()}
function icSword(g,x,y,r){g.save();g.translate(x,y);g.rotate(-PI/4);g.fillStyle='#e6eefc';g.beginPath();g.moveTo(-r*.12,-r);g.lineTo(r*.12,-r);g.lineTo(r*.14,r*.35);g.lineTo(-r*.14,r*.35);g.closePath();g.fill();g.strokeStyle='#3a4660';g.lineWidth=r*.1;g.stroke();
 g.fillStyle='#ffd04a';g.fillRect(-r*.5,r*.35,r,r*.16);g.fillStyle='#8a5a30';g.fillRect(-r*.1,r*.5,r*.2,r*.45);g.restore()}
function icJump(g,x,y,r){g.save();g.translate(x,y);g.strokeStyle='#fff';g.lineWidth=r*.28;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(-r*.9,r*.5);g.quadraticCurveTo(-r*.2,-r*1.1,r*.8,-r*.1);g.stroke();g.beginPath();g.moveTo(r*.2,-r*.2);g.lineTo(r*.9,-r*.1);g.lineTo(r*.6,r*.6);g.stroke();g.restore()}
function icPause(g,x,y,r){g.fillStyle='#fff';rr(x-r*.7,y-r*.8,r*.5,r*1.6,r*.12);g.fill();rr(x+r*.2,y-r*.8,r*.5,r*1.6,r*.12);g.fill()}
function icGear(g,x,y,r){g.save();g.translate(x,y);g.fillStyle='#fff';g.beginPath();for(var i=0;i<16;i++){var a=i*TAU/16,rad=i%2?r*.78:r;g.lineTo(Math.cos(a)*rad,Math.sin(a)*rad)}g.closePath();g.fill();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(0,0,r*.38,0,TAU);g.fill();g.restore()}
function icBack(g,x,y,r){g.strokeStyle='#fff';g.lineWidth=r*.28;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(x+r*.4,y-r*.8);g.lineTo(x-r*.5,y);g.lineTo(x+r*.4,y+r*.8);g.stroke()}
function icSound(g,x,y,r,on){g.fillStyle='#fff';g.beginPath();g.moveTo(x-r*.8,y-r*.35);g.lineTo(x-r*.3,y-r*.35);g.lineTo(x+r*.2,y-r*.8);g.lineTo(x+r*.2,y+r*.8);g.lineTo(x-r*.3,y+r*.35);g.lineTo(x-r*.8,y+r*.35);g.closePath();g.fill();
 g.strokeStyle='#fff';g.lineWidth=r*.18;g.lineCap='round';if(on){g.beginPath();g.arc(x+r*.2,y,r*.5,-.9,.9);g.stroke();g.beginPath();g.arc(x+r*.2,y,r*.9,-.8,.8);g.stroke()}else{g.beginPath();g.moveTo(x+r*.5,y-r*.4);g.lineTo(x+r*1.1,y+r*.4);g.moveTo(x+r*1.1,y-r*.4);g.lineTo(x+r*.5,y+r*.4);g.stroke()}}
function icLock(g,x,y,r){g.fillStyle='#cfd6e6';rr(x-r*.7,y-r*.1,r*1.4,r*1.0,r*.2);g.fill();g.strokeStyle='#cfd6e6';g.lineWidth=r*.24;g.beginPath();g.arc(x,y-r*.1,r*.45,PI,TAU);g.stroke();g.fillStyle='#3a4252';g.beginPath();g.arc(x,y+r*.4,r*.14,0,TAU);g.fill()}
/* ---- главный цикл ---- */
var lastT=0;
function pqTick(ts){var d=ts-PQ.raw;PQ.raw=ts;if(d<=0||d>120||document.hidden){PQ.n=0;PQ.warm=40;return}
 if(PQ.warm>0){PQ.warm--;return}
 PQ.ema+=(d-PQ.ema)*.06;if(PQ.ema>27&&PQ.cap>1.01){if(++PQ.n>50){PQ.cap=Math.max(1,PQ.cap*.78);PQ.n=0;PQ.ema=16.7;PQ.warm=60;rs()}}else PQ.n=0}
function frame(ts){requestAnimationFrame(frame);pqTick(ts);if(!lastT)lastT=ts;var dt=Math.min((ts-lastT)/1000,.05);lastT=ts;NOW+=dt;sceneT+=dt;
 var sc0=SC[cur];UI.hits=[];
 if(sc0){if(sc0.update)sc0.update(dt);g.setTransform(dpr,0,0,dpr,0,0);sc0.draw(g)}
 if(fadeDir!==0){fade+=fadeDir*dt*4.2;if(fadeDir>0&&fade>=1){fade=1;fadeDir=-1;if(nextScene){setScene(nextScene.n,nextScene.a);nextScene=null}}else if(fadeDir<0&&fade<=0){fade=0;fadeDir=0}}
 if(fade>0){g.fillStyle='rgba(5,12,24,'+fade+')';g.fillRect(0,0,W,H)}
 toastDraw(dt)}
var toasts=[];function toast(s,col){toasts.push({s:s,t:0,c:col||'#fff'})}
function toastDraw(dt){for(var i=toasts.length-1;i>=0;i--){var q=toasts[i];q.t+=dt;if(q.t>2.6){toasts.splice(i,1);continue}var a=Math.min(1,q.t*5,(2.6-q.t)*3);
 var px=fz(18),y=SAFE.t+H*.14+i*(px*2);setFont(px,700,FU);var w=g.measureText(q.s).width+px*2;g.globalAlpha=a;rr(W/2-w/2,y-px*1.1,w,px*1.9,px*.95);g.fillStyle='rgba(10,18,36,.88)';g.fill();g.strokeStyle='rgba(255,214,120,.6)';g.lineWidth=1.5;g.stroke();txt(q.s,W/2,y+px*.28,px,q.c,{al:'center',fam:FU,w:700});g.globalAlpha=1}}
