/* ===== g2: каркас головоломок — фон главы, рамка-поле, герои, подсказка, отмена, победа ===== */
var PZ={};          /* реестр видов: PZ[kind]={asp,init,snap,rest,draw,down,move,up,update,hint,won,theme} */
var P=null;         /* текущая страница-головоломка */
var PF=[];          /* частицы */
function icUndo(g,x,y,r){g.save();g.translate(x,y);g.strokeStyle='#fff';g.lineWidth=r*.26;g.lineCap='round';g.lineJoin='round';g.beginPath();g.arc(r*.05,r*.1,r*.62,PI*1.05,PI*2.15);g.stroke();
 g.beginPath();g.moveTo(-r*.74,-r*.38);g.lineTo(-r*.55,-r*.02);g.lineTo(-r*.95,.02);g.closePath();g.fillStyle='#fff';g.fill();g.stroke();g.restore()}
function icRestart(g,x,y,r){g.save();g.translate(x,y);g.strokeStyle='#fff';g.lineWidth=r*.26;g.lineCap='round';g.lineJoin='round';g.beginPath();g.arc(0,0,r*.62,-PI*.35,PI*1.4);g.stroke();
 g.beginPath();g.moveTo(r*.78,-r*.7);g.lineTo(r*.7,-r*.12);g.lineTo(r*.2,-r*.46);g.closePath();g.fillStyle='#fff';g.fill();g.stroke();g.restore()}
function icBulb(g,x,y,r,col){g.save();g.translate(x,y);glow(g,0,-r*.1,r*1.4,'#fff3a0',.55);g.beginPath();g.arc(0,-r*.2,r*.6,PI*.78,PI*2.22);g.lineTo(r*.3,r*.5);g.lineTo(-r*.3,r*.5);g.closePath();g.fillStyle=col||'#fff6c0';g.fill();g.lineWidth=r*.12;g.strokeStyle='#8a5a00';g.stroke();
 g.fillStyle='#8a5a00';g.fillRect(-r*.3,r*.58,r*.6,r*.14);g.fillRect(-r*.22,r*.78,r*.44,r*.12);g.restore()}
/* ---- частицы ---- */
function pfBurst(x,y,n,c,sp,life){sp=sp||160;for(var i=0;i<n;i++){var a=Math.random()*TAU,v=sp*(.3+Math.random()*.7);PF.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.25,g:260,t:0,life:(life||.8)*(.6+Math.random()*.6),r:2+Math.random()*3.2,c:c||'#ffe27a'})}}
function pfRing(x,y,r,c){PF.push({x:x,y:y,vx:0,vy:0,g:0,t:0,life:.6,r:r,c:c||'#ffffff',ring:1})}
function pfUpdate(dt){for(var i=PF.length-1;i>=0;i--){var q=PF[i];q.t+=dt;if(q.t>=q.life){PF.splice(i,1);continue}q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}}
function pfDraw(){g.save();g.globalCompositeOperation='lighter';for(var i=0;i<PF.length;i++){var q=PF[i],a=1-q.t/q.life;
  if(q.ring){g.strokeStyle=rgba(q.c,a*.7);g.lineWidth=2.5*a+.5;g.beginPath();g.ellipse(q.x,q.y,q.r*(.4+q.t/q.life*1.3),q.r*(.4+q.t/q.life*1.3)*.6,0,0,TAU);g.stroke()}
  else glow(g,q.x,q.y,q.r*(1.5+a*2),q.c,a*.9)}g.restore()}
/* ---- макет ---- */
function pzLay(asp){var port=H>=W*1.05,sa=SAFE,m=Math.max(10,Math.round(Math.min(W,H)*.028)),Lo={port:port},bh=Math.max(60,Math.round(fz(17)*3.2)),barH=Math.max(44,Math.round(fz(15)*2.5)),ip=Math.max(8,Math.round(Math.min(W,H)*.022));
 var k=asp.k||1,c=asp.c,r=asp.r;
 if(port){var x0=sa.l+m,wA=W-sa.l-sa.r-2*m;
  Lo.bar={x:x0,y:sa.t+6,w:wA,h:barH};Lo.goal={x:x0,y:sa.t+6+barH+4,w:wA,h:0};
  Lo.gH=pzGoalH(Lo.goal.w);Lo.goal.h=Lo.gH;
  var cy=Lo.goal.y+Lo.goal.h+8,btnY=H-sa.b-bh-10,stMin=Math.max(110,H*.15),ah=btnY-8-stMin-cy;
  var cell=Math.min((wA-2*ip)/c,(ah-2*ip)/(r*k));cell=Math.floor(Math.max(cell,20));var cw=c*cell+2*ip,chh=Math.round(r*cell*k+2*ip);
  var slack=Math.max(0,ah-chh),cy2=cy+Math.round(slack*.3);Lo.card={x:Math.round(W/2-cw/2),y:cy2,w:cw,h:chh,cell:cell,ip:ip,k:k};
  Lo.stage={x:sa.l,y:cy2+chh+6,w:W-sa.l-sa.r,h:btnY-6-(cy2+chh+6)};
  Lo.btn={x:x0,y:btnY,w:wA,h:bh}}
 else{var ah2=H-sa.t-sa.b-2*m,aw2=Math.min(W*.58,ah2*1.25);var cell2=Math.floor(Math.min((aw2-2*ip)/c,(ah2-2*ip)/(r*k)));cell2=Math.max(cell2,20);var cw2=c*cell2+2*ip,ch2=Math.round(r*cell2*k+2*ip);
  Lo.card={x:sa.l+m,y:Math.round(sa.t+m+(ah2-ch2)/2),w:cw2,h:ch2,cell:cell2,ip:ip,k:k};
  var rx=Lo.card.x+cw2+m,rw=W-sa.r-m-rx;Lo.bar={x:rx,y:sa.t+6,w:rw,h:barH};Lo.goal={x:rx,y:sa.t+6+barH+4,w:rw,h:0};Lo.gH=pzGoalH(rw);Lo.goal.h=Lo.gH;
  var btnY2=H-sa.b-bh-10;Lo.btn={x:rx,y:btnY2,w:rw,h:bh};Lo.stage={x:rx,y:Lo.goal.y+Lo.goal.h+4,w:rw,h:btnY2-6-(Lo.goal.y+Lo.goal.h+4)}}
 return Lo}
function pzGoalH(w){var px=fz(15),tpx=fz(17),pad=Math.round(px*.7),ls=wrapLines(P.page.g||'',w-pad*2-6,px,{w:500});return Math.round(pad*2+tpx*1.35+ls.length*px*1.28)}
/* ---- фон главы ---- */
function pzBG(Lo){var pi=P.pal,wy=Math.round(Lo.stage.y+Lo.stage.h*(Lo.port?.34:.4)),bg=stageBG(pi,wy),Pl=PAL[pi];
 drawBG(g,bg,P.t*.015,P.t,U);drawWater(g,bg,Pl,W,H,wy,P.t*.02,U,P.t);waterFade(g,Pl,W,H,wy);
 var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(4,8,22,.55)');gr.addColorStop(.5,'rgba(4,8,22,.32)');gr.addColorStop(1,'rgba(4,8,22,.38)');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(var i=0;i<9;i++){var fx=((i*97.3+P.t*(6+i%3*3))%(W+60))-30,fy=H*.12+((i*53.7)%1)*H*.72+Math.sin(P.t*.8+i*2)*14;drawFirefly(g,fx,fy,U*.18,P.t,i,.55)}
 return{wy:wy,pal:Pl}}
/* ---- рамка-поле ---- */
function pzCard(c,th){var x=c.x,y=c.y,w=c.w,h=c.h,r=Math.max(16,Math.round(c.ip*1.7));
 g.save();g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=24;g.shadowOffsetY=8;rr(x,y,w,h,r);g.fillStyle='#2b1a0e';g.fill();g.restore();
 /* рама: дерево */
 rr(x,y,w,h,r);g.fillStyle=LG(g,x,y,x,y+h,[0,'#9a6a3a',.5,'#6b4423',1,'#3f2610']);g.fill();
 rr(x+1.5,y+1.5,w-3,h-3,r-1);g.strokeStyle='rgba(255,220,150,.45)';g.lineWidth=1.5;g.stroke();
 var fw=Math.max(5,Math.round(c.ip*.75));rr(x+fw,y+fw,w-2*fw,h-2*fw,r-fw*.5);g.fillStyle='#1c1208';g.fill();
 /* заклёпки */
 [[x+fw*.5+3,y+fw*.5+3],[x+w-fw*.5-3,y+fw*.5+3],[x+fw*.5+3,y+h-fw*.5-3],[x+w-fw*.5-3,y+h-fw*.5-3]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],fw*.28,0,TAU);g.fillStyle=LG(g,p[0],p[1]-3,p[0],p[1]+3,[0,'#ffe9a0',1,'#b8801f']);g.fill()});
 /* внутреннее поле */
 var ix=x+fw+1,iy=y+fw+1,iw=w-2*fw-2,ih=h-2*fw-2,ir=Math.max(10,r-fw);
 g.save();rr(ix,iy,iw,ih,ir);g.clip();th&&th(g,ix,iy,iw,ih);return{ix:ix,iy:iy,iw:iw,ih:ih,ir:ir,rest:function(){g.restore();rr(ix,iy,iw,ih,ir);g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=3;g.stroke()}}}
/* плашка-счётчик под рамкой: b={n:всего,k:собрано,ic:'lotus'|'star'|'lamp',txt} */
function pzBadge(c,b){if(!b)return;var n=b.n,i,r=Math.max(9,fz(11)),w=n*r*2.3+r*1.8,h=r*2.6,x=c.x+c.w/2-w/2,y=c.y+c.h-h*.35;
 g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=8;g.shadowOffsetY=3;rr(x,y,w,h,h/2);g.fillStyle='#2b1a0e';g.fill();g.restore();g.lineWidth=2;g.strokeStyle='#c99a50';rr(x,y,w,h,h/2);g.stroke();
 for(i=0;i<n;i++){g.globalAlpha=i<b.k?1:.3;b.draw(x+r*1.5+i*r*2.3,y+h/2,r,i);g.globalAlpha=1}}
/* ---- сцена внизу: Ларри, Крапинка, Порох ---- */
function pzStage(Lo,bgi){var s=Lo.stage,u=clamp(Math.min(s.h*.27,W*.1),22,54),base=Math.round(s.y+s.h*(Lo.port?.80:.82)),cast=P.page.cast||['larry','krap'];
 var xs={larry:s.x+s.w*(cast.length>2?.2:.24),krap:s.x+s.w*.5,por:s.x+s.w*.8,vyp:s.x+s.w*.8,spider:s.x+s.w*.8};
 /* берег справа для Пороха */
 if(cast.indexOf('por')>=0){var bx=xs.por;g.fillStyle=LG(g,0,base-u*.3,0,H,[0,'#3a5a2a',1,'#142210']);g.beginPath();g.moveTo(bx-u*2.6,H);g.lineTo(bx-u*2.2,base-u*.15);g.quadraticCurveTo(bx,base-u*.55,W,base-u*.3);g.lineTo(W,H);g.closePath();g.fill();
  g.strokeStyle='rgba(180,230,120,.35)';g.lineWidth=2;g.beginPath();g.moveTo(bx-u*2.2,base-u*.15);g.quadraticCurveTo(bx,base-u*.55,W,base-u*.3);g.stroke()}
 var Pl=PAL[P.pal];
 drawLily(g,xs.larry,base+u*.12,u*1.5/U,U,{pal:Pl,t:P.t,lit:P.win?1:0});
 var lh=P.larryHop>0?Math.sin(P.larryHop*PI)*u*1.4:0;
 if(P.win){var wv=Math.abs(Math.sin(P.t*5))*u*.5;lh=Math.max(lh,wv)}
 drawActor('larry',xs.larry,base-lh,u,1,P.win?'laugh':(P.mood||'smile'),P.talk>0,P.t,{});
 if(cast.indexOf('por')>=0)drawActor('por',xs.por,base+u*.05,u,-1,P.talk>0&&P.who==='por'?'snort':null,false,P.t,{});
 if(cast.indexOf('vyp')>=0)drawActor('vyp',xs.vyp,base,u,-1,null,false,P.t,{});
 drawActor('krap',xs.krap+Math.sin(P.t*1.3)*u*.5,base-u*.1,u,1,P.win?'smile':(P.mood==='worry'?'worry':null),P.talk>0&&P.who!=='larry',P.t,{});
 /* пузырь с репликой */
 if(P.say&&P.sayT>0){var al=Math.min(1,P.sayT*4,(P.sayDur-(P.sayDur-P.sayT))*0+1);pzBubble(s,Lo,xs,u,base)}}
function pzBubble(s,Lo,xs,u,base){var who=P.who||'krap',px=fz(15),bw=Math.min(s.w-20,Math.max(240,s.w*.92)),pad=px*.7,ls=wrapLines(P.say,bw-pad*2,px,{w:500}),nm=(who!=='krap'&&who!=='larry'&&WHO[who]&&WHO[who].n)?WHO[who].n:null,bh=Math.round(pad*2+ls.length*px*1.28+(nm?px*1.35:0)),
  by=Math.max(s.y+2,base-u*3.3-bh-10),bx=clamp((who==='larry'?xs.larry:xs.krap)-bw*.35,s.x+8,s.x+s.w-bw-8),col=WHO[who]?WHO[who].c:'#ffe27a';
 var a=Math.min(1,P.sayT*5,P.sayHold>0?1:P.sayT*2);g.save();g.globalAlpha=Math.max(0,Math.min(1,a));g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=12;g.shadowOffsetY=4;rr(bx,by,bw,bh,16);g.fillStyle='#fbf1d6';g.fill();g.shadowColor='transparent';g.lineWidth=2.5;g.strokeStyle=col;g.stroke();
 if(who==='krap'||who==='larry'||who==='por'||who==='vyp'){var tx=clamp(xs[who]!=null?xs[who]:xs.krap,bx+24,bx+bw-24);g.beginPath();g.moveTo(tx-9,by+bh-1);g.lineTo(tx+3,by+bh+13);g.lineTo(tx+10,by+bh-1);g.closePath();g.fillStyle='#fbf1d6';g.fill();g.strokeStyle=col;g.stroke();g.fillStyle='#fbf1d6';g.fillRect(tx-7,by+bh-3,16,4)}
 var oy=nm?px*1.35:0;if(nm)txt(nm,bx+pad,by+pad+px*.95,px*.92,col==='#ffe27a'?'#8a5a10':sh(col,-.35),{w:800,fam:FU});for(var i=0;i<ls.length;i++)txt(ls[i],bx+pad,by+pad+px*.95+oy+i*px*1.28,px,'#3a2a14',{w:500});g.restore()}
function pzSay(who,text,dur,cb){P.who=who||'krap';P.say=text;var vd=voicePlay(P.who,text,cb);P.sayT=Math.max(dur||4.2,vd>0?vd+.5:0);P.sayDur=P.sayT;P.talk=Math.min(2,vd>0?vd+.3:(text.length/22));P.sayHold=0}
/* ---- верх: кнопка назад, название, цель ---- */
function pzTop(Lo){var b=Lo.bar,bR=b.h*.5;circBtn('back',b.x+bR,b.y+bR,bR*.9,function(){sfx('back');pzLeave()},icBack,{st:'dark'});
 var ch=CAMP[P.ch];txt(ch.n,b.x+b.w/2,b.y+b.h*.42,fz(15),'#ffe9b0',{al:'center',fam:FT,w:700,sh:'rgba(0,0,0,.6)'});
 var n=ch.pages.length;txt('Страница '+(P.pg+1)+' из '+n,b.x+b.w/2,b.y+b.h*.82,fz(13),'rgba(255,255,255,.75)',{al:'center',fam:FU,w:600,sh:'rgba(0,0,0,.5)'});
 /* точки прогресса справа */
 var dx=Math.min(14,(b.w*.28)/n),x0=b.x+b.w-bR*.4-(n-1)*dx;for(var i=0;i<n;i++){var dn=sv.done[P.ch+'.'+i];g.beginPath();g.arc(x0+i*dx,b.y+b.h*.5,i===P.pg?5:3.2,0,TAU);g.fillStyle=dn?(dn===2?'#ffd24a':'#d8e4f4'):i===P.pg?'#fff':'rgba(255,255,255,.3)';g.fill()}
 var q=Lo.goal,px=fz(15),tpx=fz(17),pad=Math.round(px*.7);
 g.save();g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=10;g.shadowOffsetY=3;rr(q.x,q.y,q.w,q.h,14);g.fillStyle=LG(g,0,q.y,0,q.y+q.h,[0,'#f7ebc8',1,'#e6d3a0']);g.fill();g.restore();g.lineWidth=2;g.strokeStyle='#9a7536';rr(q.x,q.y,q.w,q.h,14);g.stroke();
 txt(P.page.t,q.x+pad+2,q.y+pad+tpx*.95,tpx,'#4a2a10',{w:700});
 var ls=wrapLines(P.page.g,q.w-pad*2-6,px,{w:500});for(var i2=0;i2<ls.length;i2++)txt(ls[i2],q.x+pad+2,q.y+pad+tpx*1.35+px*1.0+i2*px*1.28,px,'#3a2a14',{w:500})}
/* ---- нижние кнопки: значок сверху, подпись снизу ---- */
function pzBtn(id,x,y,w,h,label,fn,st,icon,dis,px,sc0){var S=BS[st],pr=UI.press===id&&!dis,sc=(pr?.95:1)*(sc0||1),r=Math.min(h*.3,20);
 g.save();g.translate(x+w/2,y+h/2);g.scale(sc,sc);g.translate(-w/2,-h/2);
 if(!dis){g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=10;g.shadowOffsetY=4}
 rr(0,0,w,h,r);g.fillStyle=dis?'#34404e':LG(g,0,0,0,h,[0,S[0],1,S[1]]);g.fill();g.shadowColor='transparent';g.lineWidth=Math.max(2,h*.045);g.strokeStyle=dis?'#222a36':S[2];g.stroke();
 if(!dis){rr(2,2,w-4,h*.46,r-2);g.fillStyle='rgba(255,255,255,.2)';g.fill()}
 g.globalAlpha=dis?.5:1;if(icon)icon(g,w/2,h*.38,h*.2);txt(label,w/2,h*.85,px,dis?'#cfd6e2':(st==='gold'?S[3]:'#fff'),{al:'center',fam:FU,w:700});g.restore();
 if(!dis)UI.hits.push({id:id,x:x,y:y,w:w,h:h,fn:fn})}
function pzBtns(Lo){var b=Lo.btn,gap=Math.round(b.h*.16),w3=(b.w-2*gap)/3,px=fz(14),dis=P.win;
 pzBtn('undo',b.x,b.y,w3,b.h,'Назад ход',pzUndo,'dark',icUndo,dis||!P.hist.length,px);
 pzBtn('rest',b.x+w3+gap,b.y,w3,b.h,'Заново',pzRestart,'dark',icRestart,dis,px);
 var pulse=(P.idle>22&&!P.win)?1+Math.sin(P.t*6)*.04:1;
 pzBtn('hint',b.x+2*(w3+gap),b.y,w3,b.h,'Подсказка',pzHint,'gold',function(g,x,y,r){icBulb(g,x,y,r*1.1)},dis,px,pulse)}
/* ---- сессия ---- */
function pzOpen(ch,pg,ctx,chain){var page=CAMP[ch].pages[pg],K=PZ[page.k],L=LV[page.k][page.lv];
 P={ctx:ctx||'book',chain:chain,ch:ch,pg:pg,page:page,K:K,L:L,pal:CAMP[ch].bg,t:0,hist:[],s:null,win:false,winT:0,hinted:false,hintN:0,say:'',sayT:0,sayHold:0,who:'krap',talk:0,idle:0,moves:0,larryHop:0,mood:null,B:null,Lo:null,auto:0};
 P.s=K.init(L,page);sv.cur={c:ch,p:pg};save()}
function pzPush(){P.hist.push(P.K.snap(P.s));if(P.hist.length>400)P.hist.shift();P.s.hm=null;P.idle=0;P.moves++}
function pzUndo(){if(P.win||!P.hist.length||(P.s.busy))return;var o=P.hist.pop();P.K.rest(P.s,o);P.s.hm=null;sfx('back');P.idle=0;P.say=''}
function pzRestart(){if(P.win||P.s.busy)return;if(P.hist.length||P.moves){P.hist=[];P.s=P.K.init(P.L,P.page);P.moves=0;sfx('back');P.say='';P.s.hm=null}}
function pzHint(){if(P.win||P.s.busy)return;P.hinted=true;P.hintN++;P.idle=0;var h=P.K.hint(P.s,P.L);
 if(!h){pzSay('krap','Хм… Сейчас не вижу выхода. Нажми «Назад ход» или «Заново».',4.5);P.mood='worry';return}
 P.s.hm=h.mark||null;P.s.hmT=0;pzSay('krap',h.say||'Попробуй сюда!',4.4);P.mood=null;sfx('bell')}
function pzLeave(){voiceStop();go(P.ctx==='chain'?'title':'pbook')}
function pzSkip(){if(P.win)return;sv.done[P.ch+'.'+P.pg]=Math.max(sv.done[P.ch+'.'+P.pg]||0,1);save();campNext()}
/* ---- сцена ---- */
SC.puz={
 leave:function(){voiceStop()},
 enter:function(arg){pzOpen(arg.ch,arg.pg,arg.ctx,arg.chain);PF=[];music(arg.ctx==='chain'?['m_ch1','m_ch2','m_ch3','m_ch4','m_ch5'][CAMP[arg.ch].bg]:'m_puz');ambient('water');
  /* вопрос загадки читает тот, кто её загадывает: сначала короткое вступление, потом сама загадка */
  var q=P.page.k==='riddle'&&P.L&&P.L.q?P.L.q.replace(/\n/g,' '):null,who=P.page.who||'krap',askq=q?function(){setTimeout(function(){if(P&&!P.win)voicePlay(who,q)},250)}:null;
  if(P.page.say)pzSay(who,P.page.say,6,askq);else if(askq)setTimeout(function(){if(P&&!P.win)voicePlay(who,q)},700)},
 update:function(dt){P.t+=dt;P.idle+=dt;if(P.sayT>0){P.sayT-=dt;if(P.sayT<=0)P.say=''}if(P.talk>0)P.talk-=dt;if(P.larryHop>0)P.larryHop=Math.max(0,P.larryHop-dt*1.6);
  if(P.s.hm)P.s.hmT=(P.s.hmT||0)+dt;
  if(P.K.update)P.K.update(P.s,dt,P);
  pfUpdate(dt);
  if(!P.win&&!P.s.busy&&P.K.won(P.s,P.L)){pzWin()}
  if(P.win)P.winT+=dt;
  if(!P.win&&P.moves===0&&P.idle>4.5&&!P.s.hm&&!P.s.busy&&P.page.auto!==0&&P.auto<3){P.auto++;var h=P.K.hint(P.s,P.L);if(h){P.s.hm=h.mark;P.s.hmT=0;if(h.say&&P.auto===1)pzSay('krap',h.say,5)}P.idle=0}},
 draw:function(g){var asp=P.K.asp(P.s,P.L),Lo=pzLay(asp);P.Lo=Lo;pzBG(Lo);pzTop(Lo);
  var c=Lo.card,fr=pzCard(c,P.K.theme);var B={x:fr.ix,y:fr.iy,w:fr.iw,h:fr.ih,cell:c.cell,k:c.k,ox:Math.round(c.x+(c.w-asp.c*c.cell)/2),oy:Math.round(c.y+(c.h-asp.r*c.cell*c.k)/2),ip:c.ip};P.B=B;
  P.K.draw(P.s,B,P.t,P);fr.rest();if(P.K.badge)pzBadge(Lo.card,P.K.badge(P.s,P.L));
  pzStage(Lo);pzBtns(Lo);pfDraw();if(!P.win&&P.hintN>=4){var skw=fz(150),skh=Math.max(38,fz(14)*2.5);btn('skip',Lo.stage.x+Lo.stage.w-skw-12,Lo.stage.y+Lo.stage.h*.38,skw,skh,'Пропустить',pzSkip,{st:'ghost',px:fz(14),r:skh*.45})}
  if(P.win)pzWinDraw(Lo,fr)},
 down:function(p){if(P.win||P.s.busy&&!P.K.allowBusy)return;if(P.B&&P.K.down)P.K.down(P.s,p,P.B,P)},
 move:function(p){if(P.win)return;if(P.B&&P.K.move)P.K.move(P.s,p,P.B,P)},
 up:function(p,c){if(P.win)return;if(P.B&&P.K.up)P.K.up(P.s,p,P.B,P,c)},
 key:function(e,dn){if(!dn)return false;if(e.code==='KeyZ'||e.code==='Backspace'){pzUndo();return true}if(e.code==='KeyR'){pzRestart();return true}if(e.code==='KeyH'){pzHint();return true}if(e.code==='Escape'){pzLeave();return true}return false}};
/* ---- победа ---- */
function pzWin(){P.win=true;P.winT=0;var key=P.ch+'.'+P.pg,old=sv.done[key]||0,v=P.hinted?1:2;sv.done[key]=Math.max(old,v);save();P.mood='laugh';
 sfx('win');vib(40);var B=P.B;if(B){for(var i=0;i<4;i++)pfBurst(B.x+B.w*(.2+i*.2),B.y+B.h*.5,14,['#ffe27a','#fff6c0','#ffb86a','#9fe8ff'][i],220,1.1)}
 var wt=P.page.win||(P.L&&P.L.win)||CAMP[P.ch].wins[P.pg%CAMP[P.ch].wins.length];pzSay('krap',wt,Math.max(5,wt.length/11));P.sayHold=1}
function pzWinDraw(Lo,fr){var c=Lo.card,a=Math.min(1,P.winT*3);g.save();g.globalAlpha=a*.35;g.fillStyle='#fff6c0';rr(c.x,c.y,c.w,c.h,18);g.fill();g.restore();
 var st=Lo.stage,bw=Math.min(W*.7,fz(250)),bh=Math.max(54,fz(19)*2.7),bx=Lo.port?W/2-bw/2:Lo.btn.x+Lo.btn.w/2-bw/2,by=Lo.btn.y-bh*.05;
 var sc=easeOut(Math.min(1,P.winT*2.4));
 var last=P.pg===CAMP[P.ch].pages.length-1;pzBtn('next',bx,by,bw,bh,P.ctx==='chain'?'Дальше':last?'К главам':'Дальше',function(){campNext()},'green',null,false,fz(20),sc);
 /* звёзды-оценка */
 var sx=c.x+c.w/2,sy=c.y+c.h*.5,n=P.hinted?1:2,k=easeOut(Math.min(1,Math.max(0,P.winT*2-.3)));
 if(k>0){g.save();g.translate(sx,sy);g.scale(k,k);txt(P.hinted?'Готово!':'Без подсказок!',0,-fz(20),fz(34),'#fff6c0',{al:'center',fam:FT,w:700,sh:'rgba(60,30,0,.85)',shw:7});for(var i=0;i<2;i++)icStar(g,(i-.5)*fz(46),fz(26),fz(19),i<n?'#ffd24a':'rgba(255,255,255,.25)','#8a5200');g.restore()}}
