/* ===== p2: интерфейс забега — шкалы, таймер гонки, кнопки, подсказки, окна ===== */
var MEDC=['#7d8596','#d38a4a','#d8dfee','#ffd24a'],MEDN=['Без медали','Бронза','Серебро','Золото'];
function medalOf(par,t){return t<=par[0]?3:t<=par[1]?2:t<=par[2]?1:0}
function fmtT(t){t=Math.max(0,t);var m=(t/60)|0,s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(2)}
function fmtD(d){return(d>=0?'+':'−')+Math.abs(d).toFixed(2)}
function plural(n,a,b,c){var m=n%100,k=n%10;if(m>10&&m<20)return c;if(k===1)return a;if(k>1&&k<5)return b;return c}
function icMedal(g,x,y,r,m){if(m<=0){g.beginPath();g.arc(x,y,r*.8,0,TAU);g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=Math.max(2,r*.12);g.setLineDash([r*.3,r*.3]);g.stroke();g.setLineDash([]);return}
 g.save();g.translate(x,y);g.fillStyle=m===3?'#c0392b':m===2?'#2f6fd0':'#2e8b57';g.beginPath();g.moveTo(-r*.7,-r*1.1);g.lineTo(-r*.1,-r*.1);g.lineTo(-r*.45,-r*.1);g.lineTo(-r*1.05,-r*1.1);g.closePath();g.fill();g.beginPath();g.moveTo(r*.7,-r*1.1);g.lineTo(r*.1,-r*.1);g.lineTo(r*.45,-r*.1);g.lineTo(r*1.05,-r*1.1);g.closePath();g.fill();
 g.beginPath();g.arc(0,r*.15,r*.82,0,TAU);g.fillStyle=LG(g,0,-r*.7,0,r,[0,'#fff',.35,MEDC[m],1,m===3?'#c98a10':m===2?'#8a95ac':'#8a4f22']);g.fill();g.lineWidth=Math.max(1.5,r*.12);g.strokeStyle=m===3?'#8a5200':m===2?'#58627a':'#5a2e10';g.stroke();icStar(g,0,r*.15,r*.5,'rgba(255,255,255,.55)','rgba(0,0,0,.2)');g.restore()}

/* цифры таймера одинаковой ширины — чтобы строка не дрожала */
function timerW(px){setFont(px,800,FU);return g.measureText('0').width}
function drawTimer(cx,y,px,col,t,sh){var s=fmtT(t),cw=timerW(px),tot=0,i,c;for(i=0;i<s.length;i++)tot+=(s[i]===':'||s[i]==='.')?cw*.52:cw;
 var x=cx-tot/2;for(i=0;i<s.length;i++){c=s[i];var w=(c===':'||c==='.')?cw*.52:cw;txt(c,x+w/2,y,px,col,{al:'center',fam:FU,w:800,sh:sh||'rgba(0,10,30,.75)'});x+=w}return tot}

function icUp(g,x,y,r){g.save();g.strokeStyle='#fff';g.lineWidth=r*.3;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(x-r*.75,y+r*.1);g.lineTo(x,y-r*.6);g.lineTo(x+r*.75,y+r*.1);g.stroke();g.beginPath();g.moveTo(x-r*.75,y+r*.8);g.lineTo(x,y+r*.1);g.lineTo(x+r*.75,y+r*.8);g.stroke();g.restore()}
/* ---------- раскладка кнопок ---------- */
function ctlLayout(){var sc=sv.set.sc|0,rb=clamp(UB*.98,44,58),bm=SAFE.b+18,cy=H-bm-rb,port=H>=W*1.05,Lx=SAFE.l+rb+16,Rx=W-SAFE.r-rb-16,rd=rb*.74,o={sc:sc,rb:rb,rd:rd,cy:cy};
 if(sc===1){o.dx=Rx;o.dy=cy-rb*.2;o.rd=rb*.86}
 else{var left=sc===2;o.jx=left?Rx:Lx;o.sx=left?Lx:Rx;o.dx=port?W/2:(left?o.sx+rb+rd+16:o.sx-rb-rd-16);o.dy=port?cy+rb*.12:cy+rb*.1}
 return o}
function drawCtl(){var F=S.F,L=ctlLayout(),ph=S.phase,live=!V.paused&&ph!=='fail'&&ph!=='win'&&ph!=='perk'&&ph!=='dawn',holdUI=F.hold&&F.mode==='sit';
 if(L.sc!==1){
  /* прыжок */
  var jb=function(g,x,y,r){icUp(g,x,y-r*.42,r*.78);txt('ПРЫЖОК',x,y+r*.98,13,'rgba(255,255,255,.95)',{al:'center',fam:FU,w:800})};
  circBtn('jump',L.jx,L.cy,L.rb,null,jb,{st:'green',ir:.5,down:function(p){if(live){V.pid=p.id;V.btnHold=true;holdStart()}},up:function(p){if(V.btnHold){V.btnHold=false;holdEnd(true)}}});
  if(holdUI&&F.c>0){g.beginPath();g.arc(L.jx,L.cy,L.rb*1.16,-PI/2,-PI/2+TAU*F.c);g.strokeStyle='#ffe27a';g.lineWidth=5;g.lineCap='round';g.stroke()}
  /* удар */
  circBtn('strike',L.sx,L.cy,L.rb,null,function(g,x,y,r){icSword(g,x,y-r*.36,r*.8);txt('УДАР',x,y+r*.98,13,'rgba(255,255,255,.95)',{al:'center',fam:FU,w:800})},{st:'red',ir:.5,down:function(){if(live)doStrike()}});
  if(F.atk>0){g.beginPath();g.arc(L.sx,L.cy,L.rb*1.16,-PI/2,-PI/2+TAU*(1-F.atk/STRIKE_T),false);g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=4;g.stroke()}}
 /* Порох */
 var full=S.dm>=100&&!S.dash&&!S.boss&&(ph==='play'||ph==='lead')&&F.mode==='sit',rd=L.rd;
 g.save();g.translate(L.dx,L.dy);var pul=full?1+Math.sin(V.t*7)*.07:1;g.scale(pul,pul);
 if(full)glow(g,0,0,rd*2,'#ffd25a',.55);
 g.beginPath();g.arc(0,0,rd,0,TAU);g.fillStyle='rgba(18,26,46,.82)';g.fill();
 g.beginPath();g.arc(0,0,rd-3,-PI/2,-PI/2+TAU*(S.dm/100));g.strokeStyle=full?'#ffe27a':'#8fa0c4';g.lineWidth=6;g.lineCap='round';g.stroke();
 g.save();g.beginPath();g.arc(0,0,rd-9,0,TAU);g.fillStyle=full?'rgba(255,214,120,.28)':'rgba(120,140,190,.2)';g.fill();g.clip();drawPorokh(g,-rd*.22,rd*.58,rd*.31,{t:V.t,gait:full?.6:0,saddle:0,face:1});g.restore();g.restore();
 txt('ПОРОХ',L.dx,L.dy+rd+16,14,full?'#ffe27a':'rgba(255,255,255,.7)',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.7)'});
 if(full)UI.hits.push({id:'dash',x:L.dx-rd,y:L.dy-rd,w:rd*2,h:rd*2,fn:null,down:doDash});
 else if(S.dm>=100)UI.hits.push({id:'dash',x:L.dx-rd,y:L.dy-rd,w:rd*2,h:rd*2});
 /* зоны экрана, в которые нельзя «нажимать мимо» — пусть касание под кнопкой не считается прыжком */
 return L}

/* ---------- верхняя панель ---------- */
function hudBar(x,y,w,h,f,c0,c1){rr(x,y,w,h,h/2);g.fillStyle='rgba(0,0,0,.45)';g.fill();if(f>0){rr(x,y,Math.max(h,w*f),h,h/2);g.fillStyle=LG(g,0,y,0,y+h,[0,c0,1,c1]);g.fill()}g.lineWidth=1.5;g.strokeStyle='rgba(255,255,255,.35)';rr(x,y,w,h,h/2);g.stroke()}
function nextTarget(){var par=RIVERS[S.cfg.river!=null?S.cfg.river:0].par,t=S.clock+S.pen;for(var m=0;m<3;m++)if(t<par[m])return{m:3-m,t:par[m],left:par[m]-t};return null}
function hudDraw(){var top=SAFE.t+10,lf=SAFE.l+14,rt=W-SAFE.r-14,F=S.F,i,mode=S.mode,bx=lf+2,bw=W-lf-SAFE.r-16;
 circBtn('pause',rt-22,top+26,22,function(){runPause(true)},icPause,{st:'dark'});
 if(mode==='race'){
  var r=S.cfg.river!=null?RIVERS[S.cfg.river]:S.cfg.custom,t=S.started?S.clock+S.pen:0;
  txt(S.cfg.river!=null?'РЕКА '+(S.cfg.river+1):'ГОНКА',lf,top+19,fzs(12),'#ffe27a',{fam:FU,w:800,sh:'rgba(0,0,0,.7)'});txt(TIERS[r.tier].name,lf,top+38,fzs(13),'rgba(255,255,255,.8)',{fam:FU,w:700,sh:'rgba(0,0,0,.7)'});
  var px=fzs(34),tw=drawTimer(W/2+8,top+42,px,S.pen>0&&V.penFlash>0?'#ffb0a0':'#ffffff',t);
  if(S.pen>0)txt('+'+S.pen.toFixed(1),W/2+8+tw/2+6,top+42,fzs(15),'#ff9a8a',{fam:FU,w:800,sh:'rgba(0,0,0,.7)'});
  var by=top+58;hudBar(bx,by,bw,10,clamp(S.padsDone/Math.max(1,S.endPad),0,1),'#8de06a','#3fa84a');
  var fxp=bx+bw,fy=by+5;g.strokeStyle='#e8e8e8';g.lineWidth=2;g.beginPath();g.moveTo(fxp-2,fy+8);g.lineTo(fxp-2,fy-14);g.stroke();g.fillStyle='#fff';g.fillRect(fxp-2,fy-14,12,8);g.fillStyle='#222';g.fillRect(fxp-2,fy-14,6,4);g.fillRect(fxp+4,fy-10,6,4);
  var mk=bx+bw*clamp(S.padsDone/Math.max(1,S.endPad),0,1);g.beginPath();g.arc(mk,by+5,9,0,TAU);g.fillStyle='#7fd24a';g.fill();g.lineWidth=2;g.strokeStyle='#16301c';g.stroke();
  if(V.ghost&&V.ghost.S){var gp=clamp(V.ghost.S.padsDone/Math.max(1,S.endPad),0,1);g.beginPath();g.arc(bx+bw*gp,by+5,6,0,TAU);g.fillStyle='rgba(255,255,255,.55)';g.fill()}
  var y3=by+34,nt=S.started?nextTarget():null;
  if(S.phase==='play'&&S.started){
   if(nt)txt(MEDN[nt.m]+' ещё '+nt.left.toFixed(1)+' с',lf+2,y3,fzs(14),MEDC[nt.m],{fam:FU,w:800,sh:'rgba(0,0,0,.7)'});
   else txt('Медали ушли — доберись до финиша!',lf+2,y3,fzs(14),'rgba(255,255,255,.8)',{fam:FU,w:700,sh:'rgba(0,0,0,.7)'});
   if(V.ghost&&V.delta!=null)txt('призрак '+fmtD(V.delta)+' с',rt,y3,fzs(14),V.delta<=0?'#8dffb0':'#ff9a8a',{al:'right',fam:FU,w:800,sh:'rgba(0,0,0,.7)'})}
  else if(!S.started){txt('Таймер включится с первого прыжка',W/2,y3,fzs(14),'rgba(255,255,255,.85)',{al:'center',fam:FU,w:700,sh:'rgba(0,0,0,.7)'})}}
 else{
  for(i=0;i<S.maxP;i++)icPetal(g,lf+16+i*34,top+22,15,i<S.petals);
  if(S.shield>0){var sx=lf+16+S.maxP*34+6;g.beginPath();g.arc(sx,top+22,13,0,TAU);g.fillStyle='rgba(120,220,255,.35)';g.fill();g.strokeStyle='#9fe8ff';g.lineWidth=2.5;g.stroke();txt(String(S.shield),sx,top+28,fzs(16),'#fff',{al:'center',fam:FU,w:800})}
  var fx=rt-62;icFire(g,fx-6,top+26,12);txt(String(S.fire),fx-20,top+34,fzs(24),'#fff6c0',{al:'right',fam:FU,w:800,sh:'rgba(0,0,0,.7)'});
  var by2=top+58;
  if(mode==='story'){var pr=clamp(S.padsDone/Math.max(1,S.endPad),0,1);if(S.phase==='boss'||S.phase==='prize'||S.phase==='win')pr=1;hudBar(bx,by2,bw,10,pr,'#ffe27a','#f2a91b');
   (S.cs.lamps||[]).forEach(function(l){var lx=bx+bw*l/Math.max(1,S.endPad);g.beginPath();g.arc(lx,by2+5,5,0,TAU);g.fillStyle=S.padsDone>=l?'#fff6c0':'#6a7288';g.fill()});
   g.beginPath();g.arc(bx+bw*pr,by2+5,9,0,TAU);g.fillStyle='#7fd24a';g.fill();g.lineWidth=2;g.strokeStyle='#16301c';g.stroke();
   var ex=bx+bw;glow(g,ex,by2+5,16,'#ffd25a',.6*(pr>.95?1:.4));g.fillStyle='#fff3b0';g.fillRect(ex-6,by2-3,12,16);g.strokeStyle='#4a3a20';g.lineWidth=2;g.strokeRect(ex-6,by2-3,12,16);
   var ltxt='Этап '+(S.ch+1)+' из 15';setFont(fzs(15),700,FU);var lw0=g.measureText(ltxt).width;txt(ltxt,lf+4,by2+34,fzs(15),'rgba(255,255,255,.9)',{fam:FU,w:700,sh:'rgba(0,0,0,.6)'});
   if(S.cs.goal&&(S.phase==='play'||S.phase==='lead')){var gx0=lf+4+lw0+14,gw=rt-gx0;if(gw>60){var gp=fzs(13),gt=ellip(S.cs.goal,gw,gp,{fam:FU,w:700});txt(gt,rt,by2+34,gp,'rgba(255,230,160,.95)',{al:'right',fam:FU,w:700,sh:'rgba(0,0,0,.6)'})}}}
  else{hudBar(bx,by2,bw,10,S.dawn||0,'#a8d8ff','#ff9a5a');glow(g,bx+bw,by2+5,16,'#ffd25a',.6*(S.dawn||0)+.2);g.beginPath();g.arc(bx+bw,by2+5,9,0,TAU);g.fillStyle='#ffe27a';g.fill();g.strokeStyle='#a56000';g.lineWidth=2;g.stroke();
   g.beginPath();g.arc(bx+bw*(S.dawn||0),by2+5,9,0,TAU);g.fillStyle='#7fd24a';g.fill();g.strokeStyle='#16301c';g.stroke();
   txt('Ночь '+S.night,lf+4,by2+34,fzs(15),'rgba(255,255,255,.95)',{fam:FU,w:800,sh:'rgba(0,0,0,.6)'});
   txt('Кувшинок: '+S.score,rt,by2+34,fzs(15),'rgba(255,255,255,.9)',{al:'right',fam:FU,w:700,sh:'rgba(0,0,0,.6)'})}}
 if(Math.abs(S.wind)>.12&&S.phase!=='boss')txt(S.wind>0?'ветер →':'← ветер',rt,top+(mode==='race'?134:116),fzs(14),'#cfeaff',{al:'right',fam:FU,w:700,sh:'rgba(0,0,0,.6)'});
 if(S.boss)bossBarDraw();
 /* серия идеальных прыжков */
 if(S.combo>=2){var cx=W/2,cy=top+(mode==='race'?136:116),sc=1+Math.max(0,V.comboFlash)*.5;g.save();g.translate(cx,cy);g.scale(sc,sc);txt('×'+S.combo,0,0,fzs(26),'#ffe27a',{al:'center',fam:FU,w:900,sh:'rgba(120,60,0,.8)'});g.restore()}
 drawCtl()}
function bossBarDraw(){var b=S.boss;if(!b)return;var bw=Math.min(W*.8,400),bx=(W-bw)/2,by=SAFE.t+112;
 if(b.k==='wave'){txt('Комариная стая · волна '+Math.min(3,b.wave)+' из 3',W/2,by+6,fzs(16),'#fff',{al:'center',fam:FU,w:700,sh:'rgba(0,0,0,.7)'});return}
 txt(BNAME[b.k],W/2,by,fzs(16),'#fff',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.75)'});
 rr(bx,by+8,bw,16,8);g.fillStyle='rgba(0,0,0,.55)';g.fill();var f=clamp(b.hp/b.maxhp,0,1);rr(bx+2,by+10,Math.max(10,(bw-4)*f),12,6);g.fillStyle=LG(g,0,by+10,0,by+22,[0,'#ffb27a',1,'#e0463f']);g.fill();g.lineWidth=2;g.strokeStyle='#fff';rr(bx,by+8,bw,16,8);g.stroke()}

/* ---------- карточки: начало, подсказки ---------- */
function introCard(){if(V.introGone)return;var a=1;if(S.started){V.introFade=(V.introFade||0)+.016;a=1-V.introFade*1.6;if(a<=0){V.introGone=true;return}}
 var land=W>H,kk=land?.8:1,K=function(v){return Math.round(fz(v)*kk)},pw=Math.min(W-32,land?520:400),px=(W-pw)/2,py=SAFE.t+H*(land?.1:.17),r=S.mode==='race'?(S.cfg.river!=null?RIVERS[S.cfg.river]:S.cfg.custom):null,ph=K(168),ttl;
 g.globalAlpha=a;
 if(S.mode==='race'){ttl=r.name;var par=r.par||[0,0,0];
  panel(px,py,pw,ph,{r:20,stroke:'rgba(255,214,120,.8)'});txt('ГОНКА · '+TIERS[r.tier].name.toUpperCase(),W/2,py+K(26),fz(13),'#ffe27a',{al:'center',fam:FU,w:800});fitTxt(ttl,W/2,py+K(62),pw-30,fz(32),'#fff',{al:'center',w:700});
  fitTxt('Кто быстрее пересечёт реку — тот и первый',W/2,py+K(88),pw-30,fz(14),'rgba(235,242,255,.9)',{al:'center',fam:FU,w:600});
  var cw=(pw-36)/3;for(var i=0;i<3;i++){var cx=px+18+cw*i+cw/2,m=3-i;icMedal(g,cx,py+K(112),fz(13),m);txt(fmtT(par[i]).replace(/\.\d+$/,''),cx,py+K(150),fz(15),MEDC[m],{al:'center',fam:FU,w:800})}}
 else if(S.mode==='story'){ttl=S.cs.name;panel(px,py,pw,ph-8,{r:20,stroke:'rgba(255,214,120,.8)'});txt(LANDN[S.land].toUpperCase()+' · ЭТАП '+S.cs.act+' ИЗ 3',W/2,py+K(26),fz(13),'#ffe27a',{al:'center',fam:FU,w:800});fitTxt(ttl,W/2,py+K(62),pw-30,fz(32),'#fff',{al:'center',w:700});
  para('Цель: '+S.cs.goal,px+20,py+K(90),pw-40,fz(15),'#e8eefc',{w:500,lh:fz(15)*1.3});txt('Новое: '+S.cs.new,W/2,py+ph-K(26),fz(13),'#ffd98a',{al:'center',fam:FU,w:700});
  if((S.cfg.assist|0)>0)txt('Крапинка помогает: +'+S.cfg.assist+' '+plural(S.cfg.assist,'лепесток','лепестка','лепестков'),W/2,py+ph+K(10)+fz(8),fz(14),'#9fe8a0',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.7)'})}
 g.globalAlpha=1}
function coachDraw(){if(V.paused||S.phase!=='play')return;var F=S.F,cy=H*(H>=W?.44:.62),px=fz(19),st=sv.seen;
 if(S.mode==='story'&&S.ch===0&&!st.jump){
  if(!F.hold&&F.mode==='sit'&&V.t>1.2){var a=.65+.35*Math.sin(V.t*5);g.globalAlpha=a;txt('Зажми — прицелься — отпусти',W/2,cy,px,'#fff',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.85)'});g.globalAlpha=1;
   g.save();g.translate(W/2,cy+px*2.4);var k=(V.t*1.1)%1.6;g.beginPath();g.arc(0,0,UB*.5*(k>.8?1:.7+k*.35),0,TAU);g.fillStyle='rgba(255,255,255,.3)';g.fill();g.strokeStyle='#fff';g.lineWidth=3;g.stroke();g.restore()}
  else if(F.hold&&F.mode==='sit'){txt('Отпусти, когда золотое кольцо',W/2,cy,px,'#fff',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.85)'});txt('ляжет на кувшинку',W/2,cy+px*1.4,px,'#fff',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.85)'})}}
 else if(S.mode==='race'&&!S.started&&!st.rjump){cy=H*(H>=W?.52:.64);txt('Зажми экран и держи',W/2,cy,px,'#fff',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.85)'});txt('отпусти — прыжок',W/2,cy+px*1.4,px,'#fff',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.85)'})}
 if(!st.strike&&S.mode!=='race'&&nearDanger()){var a2=.7+.3*Math.sin(V.t*8);g.globalAlpha=a2;txt('Оса! Жми УДАР',W/2,cy,px,'#ffb0a0',{al:'center',fam:FU,w:900,sh:'rgba(0,0,0,.85)'});g.globalAlpha=1}}
function bannerDraw(){
 if(S.mode==='endless'&&V.banner>0){var b=V.banner,al2=Math.min(1,b*1.2,(3.2-b)*2);g.globalAlpha=Math.max(0,al2);txt('НОЧЬ '+S.night,W/2,H*.26,fz(18),'#ffe27a',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.7)'});fitTxt(S.night===1?'Ночной дозор':(S.cs.boss?'Приходит '+BNAME[S.cs.boss]:'Свети до зари'),W/2,H*.26+fz(42),W-40,fz(34),'#fff',{al:'center',w:700,sh:'rgba(0,0,0,.7)'});g.globalAlpha=1}
 if(V.bossBanner>0&&S.boss){var b3=V.bossBanner,al3=Math.min(1,b3*1.4,(3.2-b3)*3);g.globalAlpha=Math.max(0,al3);fitTxt(BNAME[S.boss.k]||'',W/2,H*(H>=W?.4:.34),W-30,fz(38),'#ff9a7a',{al:'center',w:800,sh:'rgba(0,0,0,.8)'});g.globalAlpha=1}}
function drawBubble(){var b=V.bub;if(!b)return;var a=Math.min(1,b.t*6,(b.dur-b.t)*4),px=fz(17),F=S.F,who=b.who;
 if(who==='nar'){/* рассказчик: подпись курсивом на тёплой плашке, без имени */
  var mw=Math.min(W-28,460),ls0=wrapLines(b.text,mw-34,fz(17),{w:500,it:true}),lh0=fz(17)*1.32,h0=ls0.length*lh0+fz(17)*1.5,x0=(W-mw)/2,y0=SAFE.t+H*.2+(S.mode==='race'?24:8);
  g.globalAlpha=a;g.save();g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=14;g.shadowOffsetY=4;rr(x0,y0,mw,h0,18);g.fillStyle='rgba(38,28,18,.92)';g.fill();g.restore();g.lineWidth=2;g.strokeStyle='rgba(236,200,120,.75)';rr(x0,y0,mw,h0,18);g.stroke();
  for(var j=0;j<ls0.length;j++)txt(ls0[j],x0+17,y0+fz(17)*1.25+j*lh0,fz(17),'#f6e8c4',{w:500,it:true});g.globalAlpha=1;return}
 var col={krap:'#ff9a9a',larry:'#9fe8a0',por:'#ffd29a',sher:'#c8a0ff',bass:'#ffd69a',spider:'#e0d0ff',captain:'#ffb0a0',vyp:'#bfe6ff'}[who]||'#fff',nm={krap:'Крапинка',larry:'Ларри',por:'Порох',sher:'Шестерон',bass:'Басс',spider:'Паутинья',captain:'Жало',vyp:'Выпь'}[who]||'';
 var maxW=Math.min(W-36,380),ls=wrapLines(b.text,maxW-28,px,{w:600,fam:FU}),lh=px*1.3,h=ls.length*lh+px*2+(nm?px*.9:0),x=(W-maxW)/2,y=SAFE.t+H*.2+(S.mode==='race'?24:8);
 g.globalAlpha=a;rr(x,y,maxW,h,16);g.fillStyle='rgba(10,18,36,.86)';g.fill();g.lineWidth=2;g.strokeStyle=col;g.stroke();
 if(nm)txt(nm,x+14,y+px*1.05,px*.8,col,{fam:FU,w:800});for(var i=0;i<ls.length;i++)txt(ls[i],x+14,y+px*1.15+(nm?px*.9:0)+i*lh+px*.2,px,'#fff',{fam:FU,w:600});g.globalAlpha=1}

/* ---------- окна: пауза, поражение, победа, заря ---------- */
function runPause(on){if(S.phase==='fail'||S.phase==='win')return;V.paused=on;if(on){S.F.hold&&simInput(S,'cancel');V.btnHold=false;chargeStop();duckMusic(true)}else duckMusic(false)}
function pauseDraw(){g.fillStyle='rgba(6,10,26,.8)';g.fillRect(0,0,W,H);var pw=Math.min(W-40,380),bh=Math.max(52,fz(30)),ph=bh*(S.mode==='race'?4:3)+fz(120),px=(W-pw)/2,py=H*.5-ph/2;panel(px,py,pw,ph);
 txt('Привал',W/2,py+fz(46),fz(30),'#ffe27a',{al:'center',w:700});var by=py+fz(68);
 btn('resume',px+20,by,pw-40,bh,'Продолжить',function(){runPause(false)},{st:'green'});
 if(S.mode==='race'){btn('restart',px+20,by+bh+12,pw-40,bh,'Начать заново',function(){V.paused=false;runStart(V.cfg)},{st:'dark'});by+=bh+12}
 var w3=(pw-40-16)/3;
 btn('muteM',px+20,by+bh+12,w3,bh,sv.set.mu>0?'Музыка':'Музыка ✕',function(){sv.set.mu=sv.set.mu>0?0:.6;audioVol();save()},{st:sv.set.mu>0?'dark':'ghost',px:fz(13)});
 btn('muteF',px+28+w3,by+bh+12,w3,bh,sv.set.fx>0?'Звуки':'Звуки ✕',function(){sv.set.fx=sv.set.fx>0?0:.8;audioVol();save()},{st:sv.set.fx>0?'dark':'ghost',px:fz(13)});
 btn('muteN',px+36+2*w3,by+bh+12,w3,bh,sv.set.nar?'Рассказчик':'Рассказчик ✕',function(){sv.set.nar=sv.set.nar?0:1;if(!sv.set.nar)voiceStop();save()},{st:sv.set.nar?'dark':'ghost',px:fz(13)});
 btn('quit',px+20,by+2*(bh+12),pw-40,bh,S.mode==='story'?(V.cfg&&V.cfg.chain!=null?'В главное меню':'К этапам'):S.mode==='race'?'К рекам':'Закончить дозор',function(){runQuit()},{st:'red'})}
function failDraw(){g.fillStyle='rgba(6,10,26,.7)';g.fillRect(0,0,W,H);var pw=Math.min(W-36,400),ph=fz(S.mode==='story'?300:260),px=(W-pw)/2,py=H*.5-ph/2,bh=Math.max(52,fz(30));panel(px,py,pw,ph);
 if(S.mode==='story'){fitTxt('Ночь пока сильнее',W/2,py+fz(46),pw-30,fz(30),'#ffe27a',{al:'center',w:700});para(V.assistUp?'Ничего. Крапинка пришила Ларри лишний лепесток — теперь их '+S.maxP+'. Давай ещё раз?':'Ничего. Крапинка уже штопает Ларри плащ, а лампа ещё тёплая. Давай ещё раз?',px+24,py+fz(84),pw-48,fz(17),'#e8eefc',{w:500});
  var by=py+ph-bh*2-36;btn('retry',px+20,by,pw-40,bh,S.check>0?'С последней лампы':'Ещё раз',function(){respawn(S);V.failUI=false;chargeStop()},{st:'green'});btn('toMap',px+20,by+bh+12,pw-40,bh,V.cfg&&V.cfg.chain!=null?'В главное меню':'К этапам',function(){runQuit()},{st:'dark'})}
 else{fitTxt('Дозор окончен',W/2,py+fz(46),pw-30,fz(30),'#ffe27a',{al:'center',w:700});para('Ты продержался '+S.night+' '+plural(S.night,'ночь','ночи','ночей')+'. Свет, который ты нёс, согрел многих.',px+24,py+fz(84),pw-48,fz(17),'#e8eefc',{w:500});
  btn('res',px+20,py+ph-bh-22,pw-40,bh,'Подвести итог',function(){nightEnd()},{st:'gold'})}}
function lanternName(){return['Фитиль','Стекло','Лунное масло','Оправа','Кольцо'][S.land]}
function winDraw(){var t=Math.max(0,S.phT-.6),al=Math.min(1,t*1.5);if(al<=0)return;g.fillStyle='rgba(8,14,30,'+al*.55+')';g.fillRect(0,0,W,H);g.globalAlpha=al;
 if(S.cs.boss){txt('ЧАСТЬ ФОНАРЯ НАЙДЕНА',W/2,H*.34,fz(18),'#ffe27a',{al:'center',fam:FU,w:800});fitTxt(lanternName(),W/2,H*.34+fz(46),W-30,fz(42),'#fff',{al:'center',w:700});
  glow(g,W/2,H*.5,UB*4,'#ffe27a',.6*al);drawLanternPart(g,W/2,H*.5+Math.sin(V.t*2)*6,UB*1.4,S.land,V.t)}
 else{var pp=Math.min(1,t*2.2);g.save();g.translate(W/2,H*.3);g.scale(.8+pp*.25,.8+pp*.25);txt('ФИНИШ!',0,0,fz(58),'#ffe27a',{al:'center',w:800,sh:'rgba(120,60,0,.75)'});g.restore()}
 g.globalAlpha=1;
 if(S.cs.boss&&S.phT>2.4)btn('cont',W/2-110,H*.7,220,Math.max(54,fz(30)),'Дальше',function(){runDone()},{st:'gold',px:fz(22)})}
function dawnDraw(){var t=S.phT;if(S.phase==='dawn'&&t<2.4){var a=Math.min(1,t*1.4,(2.4-t)*1.4);g.globalAlpha=Math.max(0,a);txt('ЗАРЯ!',W/2,H*.3,fz(54),'#ffe27a',{al:'center',w:800,sh:'rgba(120,40,0,.7)'});txt('Ночь '+S.night+' позади',W/2,H*.3+fz(36),fz(22),'#fff',{al:'center',fam:FU,w:700,sh:'rgba(0,0,0,.6)'});g.globalAlpha=1}
 if(S.phase==='perk'&&V.pk)perkDraw()}
function perkIcon(g,k,x,y,r){var d=PERK_DEF[k],ic=d.ic;g.save();g.translate(x,y);
 if(ic==='heart'||ic==='heart2'){icPetal(g,0,0,r*.9,true);if(ic==='heart2'){txt('+',r*.5,r*.5,Math.round(r),'#fff',{al:'center',fam:FU,w:900,sh:'#000'})}}
 else if(ic==='shield'){g.beginPath();g.moveTo(0,-r);g.quadraticCurveTo(r,-r*.7,r*.9,0);g.quadraticCurveTo(r*.6,r*.8,0,r);g.quadraticCurveTo(-r*.6,r*.8,-r*.9,0);g.quadraticCurveTo(-r,-r*.7,0,-r);g.fillStyle=LG(g,0,-r,0,r,[0,'#bff0ff',1,'#4aa6d6']);g.fill();g.strokeStyle='#1d5a8e';g.lineWidth=3;g.stroke()}
 else if(ic==='magnet'){g.strokeStyle='#e0463f';g.lineWidth=r*.38;g.lineCap='butt';g.beginPath();g.arc(0,0,r*.6,PI,0);g.lineTo(r*.6,r*.5);g.moveTo(-r*.6,0);g.lineTo(-r*.6,r*.5);g.stroke();g.fillStyle='#fff';g.fillRect(-r*.8,r*.4,r*.4,r*.2);g.fillRect(r*.4,r*.4,r*.4,r*.2)}
 else if(ic==='sword')icSword(g,0,0,r);
 else if(ic==='eye'){g.beginPath();g.ellipse(0,0,r,r*.6,0,0,TAU);g.fillStyle='#fff';g.fill();g.strokeStyle='#223';g.lineWidth=3;g.stroke();g.beginPath();g.arc(0,0,r*.34,0,TAU);g.fillStyle='#2f7fe0';g.fill();g.beginPath();g.arc(0,0,r*.16,0,TAU);g.fillStyle='#000';g.fill()}
 else if(ic==='boom'){g.strokeStyle='#ffd27a';g.lineWidth=3;for(var i=0;i<3;i++){g.beginPath();g.arc(0,0,r*(.4+i*.3),-.9,.9);g.stroke();g.beginPath();g.arc(0,0,r*(.4+i*.3),PI-.9,PI+.9);g.stroke()}g.fillStyle='#ffd27a';g.beginPath();g.arc(0,0,r*.18,0,TAU);g.fill()}
 else if(ic==='wind'){g.strokeStyle='#bfe8ff';g.lineWidth=4;g.lineCap='round';for(i=0;i<3;i++){g.beginPath();g.moveTo(-r,-r*.5+i*r*.5);g.quadraticCurveTo(0,-r*.8+i*r*.5,r*.7,-r*.5+i*r*.5);g.quadraticCurveTo(r,-r*.3+i*r*.5,r*.6,-r*.15+i*r*.5);g.stroke()}}
 else if(ic==='gold'){g.beginPath();g.arc(0,0,r*.8,0,TAU);g.fillStyle=LG(g,0,-r,0,r,[0,'#fff1a0',1,'#e0a010']);g.fill();g.strokeStyle='#8a5200';g.lineWidth=3;g.stroke();txt('×2',0,r*.3,Math.round(r*.9),'#7a4a00',{al:'center',fam:FU,w:900})}
 else if(ic==='shoe'){g.strokeStyle='#cfd6e6';g.lineWidth=r*.3;g.lineCap='round';g.beginPath();g.arc(0,r*.1,r*.6,-.4,PI+.4,false);g.stroke();g.fillStyle='#ffd04a';g.beginPath();g.arc(-r*.55,r*.35,r*.1,0,TAU);g.arc(r*.55,r*.35,r*.1,0,TAU);g.fill()}
 else if(ic==='fire')icFire(g,0,0,r*.8);
 else if(ic==='thorn'){g.fillStyle='#e0463f';g.beginPath();for(var j=0;j<8;j++){var an=j*TAU/8,rad=j%2?r*.45:r;g.lineTo(Math.cos(an)*rad,Math.sin(an)*rad)}g.closePath();g.fill();g.strokeStyle='#6a1018';g.lineWidth=3;g.stroke()}
 g.restore()}
function perkDraw(){g.fillStyle='rgba(6,10,26,.74)';g.fillRect(0,0,W,H);var port=H>=W,pw=Math.min(W-28,460),px=(W-pw)/2,y=SAFE.t+(port?Math.max(H*.12,fz(110)):fz(26));
 txt('ЗАРЯ ПРИШЛА',W/2,y,fz(16),'#ffe27a',{al:'center',fam:FU,w:800});fitTxt('Выбери дар рассвета',W/2,y+fz(38),W-30,port?fz(32):fz(28),'#fff',{al:'center',w:700});
 var ch=V.pk||[],n=ch.length||3,i,k,d;
 if(port){var ch0=Math.min(120+(TS-1)*70,150),gap=14,y0=y+fz(70);
  for(i=0;i<ch.length;i++){k=ch[i];d=PERK_DEF[k];var cy=y0+i*(ch0+gap),pr=UI.press==='perk'+i;g.save();g.translate(W/2,cy+ch0/2);if(pr)g.scale(.97,.97);g.translate(-W/2,-(cy+ch0/2));
   panel(px,cy,pw,ch0,{stroke:'rgba(255,214,120,.8)',r:20});g.beginPath();g.arc(px+ch0*.5,cy+ch0/2,ch0*.34,0,TAU);g.fillStyle='rgba(255,255,255,.08)';g.fill();perkIcon(g,k,px+ch0*.5,cy+ch0/2,ch0*.24);
   fitTxt(d.n,px+ch0*.92,cy+ch0*.32+fz(4),pw-ch0*.92-14,fz(22),'#ffe27a',{w:700});para(d.d,px+ch0*.92,cy+ch0*.32+fz(30),pw-ch0*.92-16,fz(16),'#dfe6f5',{w:500,lh:fz(16)*1.25});g.restore();
   (function(k,i){UI.hits.push({id:'perk'+i,x:px,y:cy,w:pw,h:ch0,fn:function(){choosePerk(k)}})})(k,i)}
  fitTxt('Всё, что соберёшь, действует до конца дозора',W/2,y0+ch.length*(ch0+gap)+fz(10),W-24,fz(15),'rgba(255,255,255,.65)',{al:'center',fam:FU,w:600})}
 else{var gp=12,cw=Math.min((W-SAFE.l-SAFE.r-24-(n-1)*gp)/n,290),x0=(W-(cw*n+gp*(n-1)))/2,y1=y+fz(58),hc=Math.max(120,H-SAFE.b-y1-fz(34));
  for(i=0;i<ch.length;i++){k=ch[i];d=PERK_DEF[k];var cx0=x0+i*(cw+gp),pr2=UI.press==='perk'+i,mx=cx0+cw/2;g.save();g.translate(mx,y1+hc/2);if(pr2)g.scale(.97,.97);g.translate(-mx,-(y1+hc/2));
   panel(cx0,y1,cw,hc,{stroke:'rgba(255,214,120,.8)',r:18});g.beginPath();g.arc(mx,y1+hc*.25,hc*.16,0,TAU);g.fillStyle='rgba(255,255,255,.08)';g.fill();perkIcon(g,k,mx,y1+hc*.25,hc*.12);
   fitTxt(d.n,mx,y1+hc*.55,cw-16,fz(19),'#ffe27a',{al:'center',w:700});para(d.d,mx,y1+hc*.55+fz(24),cw-24,fz(14),'#dfe6f5',{al:'center',w:500,lh:fz(14)*1.25});g.restore();
   (function(k,i){UI.hits.push({id:'perk'+i,x:cx0,y:y1,w:cw,h:hc,fn:function(){choosePerk(k)}})})(k,i)}
  fitTxt('Всё, что соберёшь, действует до конца дозора',W/2,H-SAFE.b-fz(12),W-24,fz(14),'rgba(255,255,255,.65)',{al:'center',fam:FU,w:600})}}
