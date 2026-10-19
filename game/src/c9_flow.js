/* ===== ход Сказки: цепочка событий (сцена → этап → головоломка → часть Фонаря → …), итоги этапа, Книга головоломок, финал ===== */
function lampN(){return sv.part.filter(Boolean).length}
function chDoneN(c){var n=0;for(var p=0;p<CAMP[c].pages.length;p++)if(sv.done[c+'.'+p])n++;return n}
function chStars(c){var n=0;for(var p=0;p<CAMP[c].pages.length;p++)n+=sv.done[c+'.'+p]||0;return n}
function pagesDone(){var n=0;for(var c=0;c<CAMP.length;c++)n+=chDoneN(c);return n}
function pagesTotal(){var n=0;for(var c=0;c<CAMP.length;c++)n+=CAMP[c].pages.length;return n}
/* глава открыта в Книге головоломок, когда Сказка дошла до неё */
function chUnlocked(c){if(c===0)return true;var i=CHAIN.indexOf('S:in'+c);return(sv.cmp|0)>=i||chDoneN(c-1)>=5}
function pgUnlocked(c,p){return chUnlocked(c)}
function chainDone(){return(sv.cmp|0)>=CHAIN.length}
function chainBeat(i){var b=CHAIN[i]||'E';return{k:b.charAt(0),v:b.slice(2)}}
function chainPlay(i){i=clamp(i|0,0,CHAIN.length-1);var b=chainBeat(i),land=beatLand(i);
 if(b.k==='S')go('story',{id:b.v,ch:land,chain:i});
 else if(b.k==='R')go('run',{mode:'story',ch:+b.v,chain:i});
 else if(b.k==='Z'){var q=b.v.split('.');go('puz',{ch:+q[0],pg:+q[1],ctx:'chain',chain:i})}
 else if(b.k==='W')go('part',{ch:+b.v,chain:i});
 else go('end',{chain:i})}
function chainNext(i){sv.cmp=Math.max(sv.cmp|0,(i|0)+1);save();if(sv.cmp>=CHAIN.length){go('title');return}chainPlay(sv.cmp)}
function chainContinue(){if(chainDone()){go('map');return}if(!sv.intro&&(sv.cmp|0)===0)sv.intro=1;chainPlay(sv.cmp|0)}
function chainTitle(){if(chainDone())return['Сказка','Пройдена · этапы можно сыграть заново'];var i=sv.cmp|0,L=beatLand(i);if(i===0)return['Сказка','Начни историю · пять глав'];return['Продолжить сказку','Глава '+ROM[L]+' · '+CAMP[L].n]}
/* головоломки: книга и вход со страницы */
function bookGo(c,p){go('puz',{ch:c,pg:p,ctx:'book'})}
function campNext(){if(P.ctx==='chain'){voiceStop();chainNext(P.chain);return}var c=P.ch,p=P.pg;if(p+1<CAMP[c].pages.length){bookGo(c,p+1)}else go('pbook')}
/* ---- общий ночной фон меню ---- */
function menuBG(t){var wy=H*.66,bg=stageBG(0,Math.round(wy));drawBG(g,bg,t*.1,t,U);drawWater(g,bg,PAL[0],W,H,Math.round(wy),t*.1,U,t);waterFade(g,PAL[0],W,H,Math.round(wy));
 var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(4,8,22,.7)');gr.addColorStop(1,'rgba(4,8,22,.45)');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(var i=0;i<10;i++){var fx=((i*97.3+t*(6+i%3*3))%(W+60))-30,fy=H*.15+((i*53.7)%1)*H*.7+Math.sin(t*.8+i*2)*14;drawFirefly(g,fx,fy,U*.18,t,i,.6)}}
function backBtn(fn){circBtn('back',SAFE.l+fz(14)+fz(24),SAFE.t+fz(10)+fz(24),fz(24),function(){sfx('back');fn()},icBack,{st:'dark'})}
/* ---- Книга головоломок ---- */
var BK2={sc:0,max:0,drag:null,t:0};
SC.pbook={enter:function(){music('m_puz');ambient('water');BK2.t=0;BK2.sc=0;BK2.drag=null;BK2.focus=0;for(var c=0;c<CAMP.length;c++)if(chUnlocked(c))BK2.focus=c;BK2.first=true},
 update:function(dt){BK2.t+=dt},
 down:function(p){BK2.drag={y:p.y,sc:BK2.sc,moved:false}},
 move:function(p){if(!BK2.drag)return;var dy=p.y-BK2.drag.y;if(Math.abs(dy)>10){BK2.drag.moved=true;if(p.onUI){p.h=null;UI.press=null}}if(BK2.drag.moved)BK2.sc=clamp(BK2.drag.sc-dy,0,BK2.max)},
 up:function(p){BK2.drag=null},
 draw:function(g){menuBG(BK2.t);var m=Math.max(10,Math.round(Math.min(W,H)*.03)),top=SAFE.t+fz(84),cw=Math.min(W-SAFE.l-SAFE.r-2*m,640),cx=W/2-cw/2,pad=fz(10),r2=Math.max(15,Math.min(fz(19),(cw-pad*2)/18)),ch=pad*2+fz(24)*2.1+r2*2+pad*.5+fz(6),y=top-BK2.sc;
  var total=CAMP.length*(ch+m)+fz(70);BK2.max=Math.max(0,total-(H-SAFE.b-top)+m);
  if(BK2.first){BK2.first=false;BK2.sc=clamp(BK2.focus*(ch+m)-m,0,BK2.max);y=top-BK2.sc}
  g.save();g.beginPath();g.rect(0,top-fz(6),W,H);g.clip();
  CAMP.forEach(function(C,c){var open=chUnlocked(c),yy=y+c*(ch+m);if(yy>H||yy+ch<top-fz(10))return;
   g.save();g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=12;g.shadowOffsetY=4;rr(cx,yy,cw,ch,18);g.fillStyle=open?LG(g,0,yy,0,yy+ch,[0,'rgba(54,70,108,.96)',1,'rgba(26,36,66,.97)']):'rgba(24,30,46,.9)';g.fill();g.restore();
   rr(cx,yy,cw,ch,18);g.lineWidth=2;g.strokeStyle=chDoneN(c)===C.pages.length?'rgba(255,214,120,.8)':'rgba(255,255,255,.18)';g.stroke();
   var br=fz(17);g.beginPath();g.arc(cx+pad+br,yy+pad+br+fz(2),br,0,TAU);g.fillStyle=open?'#3a5a9a':'#2a3040';g.fill();txt(ROM[c],cx+pad+br,yy+pad+br+fz(2),fz(14),'#fff',{al:'center',fam:FU,w:800,bl:'middle'});
   txt(C.n,cx+pad*2+br*2,yy+pad+fz(20),fz(19),open?'#fff':'rgba(255,255,255,.4)',{fam:FT,w:700});
   if(open)txt('Решено страниц: '+chDoneN(c)+' из '+C.pages.length,cx+pad*2+br*2,yy+pad+fz(20)+fz(19),fz(14),'rgba(255,255,255,.62)',{fam:FU,w:500});else fitTxt('Нужно 5 страниц главы '+ROM[c-1]+' или Сказка',cx+pad*2+br*2,yy+pad+fz(20)+fz(19),cw-pad*3-br*2-fz(26),fz(14),'rgba(255,255,255,.62)',{fam:FU,w:500});
   var st=chStars(c),sx=cx+cw-pad-fz(14);if(open){icStar(g,sx,yy+pad+fz(14),fz(11),'#ffd24a','#8a5200');txt(st+'/'+C.pages.length*2,sx-fz(16),yy+pad+fz(19),fz(14),'#ffe9b0',{al:'right',fam:FU,w:700})}
   else icLock(g,sx,yy+pad+fz(12),fz(10));
   var py=yy+ch-pad-r2-fz(2),gap=(cw-pad*2-r2*2)/(C.pages.length-1);
   C.pages.forEach(function(pg,p){var px=cx+pad+r2+p*gap,d=sv.done[c+'.'+p]||0,un=open;
    g.beginPath();g.arc(px,py,r2,0,TAU);g.fillStyle=d===2?'#ffd24a':d===1?'#c9d3e6':un?'#3b4f7c':'#222a3c';g.fill();g.lineWidth=2;g.strokeStyle=d?'rgba(0,0,0,.35)':'rgba(255,255,255,.25)';g.stroke();
    txt(String(p+1),px,py,fz(14),d?'#3a2400':un?'#fff':'rgba(255,255,255,.3)',{al:'center',fam:FU,w:800,bl:'middle'});
    if(d===2){icStar(g,px+r2*.62,py-r2*.62,r2*.36,'#fff6c0','#8a5200')}
    if(un)UI.hits.push({id:'pg'+c+'_'+p,x:px-r2*1.1,y:Math.max(py-r2*1.1,top),w:r2*2.2,h:r2*2.2,fn:function(){bookGo(c,p)}})})});
  txt('Золотая страница — пройдена без подсказок',W/2,y+CAMP.length*(ch+m)+fz(8),fz(13),'rgba(255,255,255,.55)',{al:'center',fam:FU,w:500});
  g.restore();
  var gr=g.createLinearGradient(0,0,0,top+fz(10));gr.addColorStop(0,'rgba(4,8,22,.95)');gr.addColorStop(1,'rgba(4,8,22,0)');g.fillStyle=gr;g.fillRect(0,0,W,top+fz(10));
  backBtn(function(){go('title')});var hx=SAFE.l+fz(14)+fz(48)+14;txt('Головоломки',hx,SAFE.t+fz(10)+fz(28),fz(22),'#ffe9b0',{fam:FT,w:700});
  txt('Решено '+pagesDone()+' из '+pagesTotal()+' страниц',hx,SAFE.t+fz(10)+fz(50),fz(14),'rgba(255,255,255,.7)',{fam:FU,w:500})}};
/* ---- часть Фонаря найдена ---- */
var RW=null;
SC.part={enter:function(a){RW={ch:a.ch,chain:a.chain,t:0};var c=a.ch;if(!sv.part[c]){sv.part[c]=1;save()}ambient('water');sfx('win');vib(40);if(c===4)music('m_dawn')},
 update:function(dt){RW.t+=dt;if(RW.t>1.1&&!RW.b){RW.b=1;sfx('perk');pfBurst(W/2,H*.32,26,'#ffe27a',240,1.1)}
  if(RW.t>1.9&&!RW.v){RW.v=1;RW.vd=voicePlay('nar',PART_TXT[RW.ch],function(){var d=voicePlay('nar',MAXIM[RW.ch])})}pfUpdate(dt)},
 draw:function(g){var t=RW.t,c=RW.ch,wy=H*.62;g.fillStyle=LG(g,0,0,0,H,[0,'#0b1236',.6,'#1f2a62',1,'#3a2e68']);g.fillRect(0,0,W,H);var r=rng(11);for(var i=0;i<70;i++){g.fillStyle='rgba(255,255,255,'+(.25+r()*.5)+')';g.beginPath();g.arc(r()*W,r()*H*.6,r()*1.4+.3,0,TAU);g.fill()}
  drawHillSil(g,0,t,0);for(i=0;i<10;i++)drawFirefly(g,W*((i*.173+t*.01)%1),H*(.4+(i%5)*.07)+Math.sin(t+i)*8,U*.2,t,i,.7);
  var s=Math.min(W*.27,H*.145),cy=H*.37;glow(g,W/2,cy,s*2.4,'#ffe27a',.25+.15*Math.min(1,t));
  drawLantern(g,W/2,cy,s,sv.part,t,{lit:0,newI:c,newA:Math.min(1,t/1.2)});
  var a=Math.min(1,Math.max(0,t-.5)*2.2);g.globalAlpha=a;
  fitTxt('Часть Фонаря вернулась!',W/2,H*.12,W-40,fz(26),'#ffe9b0',{al:'center',fam:FT,w:700,sh:'rgba(40,20,0,.8)',shw:6});
  txt(PART[c],W/2,H*.56,fz(34),'#fff6c0',{al:'center',fam:FT,w:700,sh:'rgba(60,30,0,.9)',shw:7});
  var ls=wrapLines(PART_TXT[c],Math.min(W-40,fz(380)),fz(17),{it:true,w:500});ls.forEach(function(l,j){txt(l,W/2,H*.56+fz(34)+j*fz(22),fz(17),'#f3e4c0',{al:'center',fam:FT,w:500,it:true})});
  var my=H*.56+fz(34)+ls.length*fz(22)+fz(28),ml=wrapLines('«'+MAXIM[c]+'»',Math.min(W-48,fz(340)),fz(18),{it:true,w:700});ml.forEach(function(l,j){txt(l,W/2,my+j*fz(24),fz(18),'#ffd98a',{al:'center',fam:FT,w:700,it:true,sh:'rgba(40,20,0,.7)',shw:5})});
  txt('Собрано частей: '+lampN()+' из 5',W/2,my+ml.length*fz(24)+fz(10),fz(15),'rgba(255,255,255,.7)',{al:'center',fam:FU,w:600});g.globalAlpha=1;
  pfDraw();
  if(t>1.4){var bw=Math.min(W*.7,fz(280)),bh=Math.max(54,fz(20)*2.8);btn('next',W/2-bw/2,H-SAFE.b-bh-fz(30),bw,bh,'Дальше',function(){voiceStop();chainNext(RW.chain)},{st:'green',px:fz(22)})}}};
/* ---- итоги этапа ---- */
var RS2=null;
SC.stageres={enter:function(a){RS2={a:a,t:0};sfx('win');var k='star'+clamp(a.stars,1,3);RS2.line=narPick(k);ambient('water');duckMusic(false)},
 update:function(dt){RS2.t+=dt;if(RS2.t>1.6&&!RS2.v){RS2.v=1;if(sv.set.nar&&RS2.line)voicePlay('nar',RS2.line)}},
 draw:function(g){var a=RS2.a,t=RS2.t,ch=a.ch,L=(ch/3)|0,P=PAL[L],port=isPort(),wy=Math.round(H*.4),bg=stageBG(L,wy),boss=ch%3===2;
  drawBG(g,bg,t*.1,t,U);drawWater(g,bg,P,W,H,wy,t*.1,U,t);waterFade(g,P,W,H,wy);g.fillStyle='rgba(6,10,24,.58)';g.fillRect(0,0,W,H);
  var np=lampN(),k=clamp((t-.4)/1.2,0,1);
  var cxL=port?W/2:W*.27,cxR=port?W/2:W*.73,top=SAFE.t+(port?H*.05:12);
  txt('ЭТАП '+(ch+1)+' ПРОЙДЕН',cxL,top+fz(14),fz(15),'#ffe27a',{al:'center',fam:FU,w:800});
  fitTxt(CHS[ch].name,cxL,top+fz(14)+fz(38),(port?W:W*.5)-30,fz(32),'#fff',{al:'center',w:700,sh:'rgba(0,0,0,.6)'});
  var ls=port?Math.min(W*.2,H*.095):Math.min(W*.14,H*.14),ly=port?H*.3:H*.52;
  drawLantern(g,cxL,ly,ls,sv.part,t,{lit:np>=5?1:0});
  txt('Части Фонаря: '+np+' из 5',cxL,ly+ls*1.3,fz(16),'#fff',{al:'center',fam:FU,w:700,sh:'rgba(0,0,0,.6)'});
  var sy=port?ly+ls*1.3+fz(50):top+fz(34),r=fz(17),st=a.stars,gap=r*2.5;
  for(var i=0;i<3;i++){var sx=cxR+(i-1)*gap,vis=t>.9+i*.35;if(vis&&i<st){var pp=clamp((t-.9-i*.35)*4,0,1);g.save();g.translate(sx,sy);g.scale(1+(1-pp)*.8,1+(1-pp)*.8);icStar(g,0,0,r);g.restore();if(pp<.05)sfx('perfect')}else icStar(g,sx,sy,r,'rgba(90,100,130,.5)','#3a4260')}
  var lab=['Прошёл этап','Без падений и потери лепестков','Собрал 80% светляков'];
  for(i=0;i<3;i++)txt((i<st?'✓ ':'· ')+lab[i],cxR,sy+fz(38)+i*fz(22),fz(15),i<st?'#ffe9a0':'rgba(255,255,255,.45)',{al:'center',fam:FU,w:600});
  var fy=sy+fz(38)+3*fz(22)+fz(22);setFont(fz(24),800,FU);var w1=g.measureText('+'+a.fire).width;setFont(fz(15),600,FU);var w2=g.measureText('светляков').width,tw3=fz(30)+w1+8+w2,x0=cxR-tw3/2;icFire(g,x0+fz(12),fy-fz(5),fz(14));txt('+'+a.fire,x0+fz(30),fy,fz(24),'#ffe27a',{fam:FU,w:800,sh:'rgba(0,0,0,.6)'});txt('светляков',x0+fz(30)+w1+8,fy,fz(15),'#fff',{fam:FU,w:600});
  var bh=Math.max(52,fz(24)*2),bw=Math.min(port?W-40:W*.42,380),bx=cxR-bw/2,by=H-SAFE.b-14-bh*2-12;
  if(a.chain!=null){
   btn('next',bx,by,bw,bh,'Дальше',function(){voiceStop();chainNext(a.chain)},{st:'green',px:fz(22)});
   btn('camp',bx,by+bh+12,(bw-12)/2,bh,'Лагерь',function(){go('camp',{back:{n:'stageres',a:a}})},{st:'gold',px:fz(17)});
   btn('again',bx+(bw-12)/2+12,by+bh+12,(bw-12)/2,bh,'Ещё раз',function(){go('run',{mode:'story',ch:ch,chain:a.chain,again:true})},{st:'dark',px:fz(17)})}
  else{var nxt=ch<14&&stageOpen(ch+1);
   btn('next',bx,by,bw,bh,nxt?'Дальше':'К этапам',function(){if(nxt)go('run',{mode:'story',ch:ch+1,replay:true});else go('map')},{st:'green',sub:nxt?'Этап '+(ch+2)+' · '+CHS[ch+1].name:null,px:fz(21)});
   btn('map',bx,by+bh+12,(bw-12)/2,bh,'К этапам',function(){go('map')},{st:'dark',px:fz(17)});
   btn('camp',bx+(bw-12)/2+12,by+bh+12,(bw-12)/2,bh,'Лагерь',function(){go('camp')},{st:'gold',px:fz(17)})}
  if(canBuyAny())dot(bx+bw-4,by+bh+16)}};
/* ---- финал: рассвет вернулся ---- */
var EN=null;
SC.end={enter:function(a){EN={t:0,chain:a&&a.chain};sv.fin=1;if(a&&a.chain!=null)sv.cmp=CHAIN.length;save();music('m_dawn');ambient('water');sfx('dawn')},
 update:function(dt){EN.t+=dt;if(EN.t>2.2&&!EN.v){EN.v=1;voicePlay('nar',END_TXT)}},
 draw:function(g){var t=EN.t,port=isPort();drawIll('dawn',t,Math.min(1,t/3),H*.02);
  var gr=g.createLinearGradient(0,H*.3,0,H);gr.addColorStop(0,'rgba(6,10,24,0)');gr.addColorStop(.4,'rgba(6,10,24,.7)');gr.addColorStop(1,'rgba(6,10,24,.9)');g.fillStyle=gr;g.fillRect(0,H*.3,W,H*.7);
  var a=Math.min(1,t/1.5);g.globalAlpha=a;var ty=SAFE.t+(port?H*.09:H*.1);
  txt('КОНЕЦ СКАЗКИ',W/2,ty,fz(16),'#ffe27a',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.6)'});
  fitTxt('Рассвет вернулся',W/2,ty+fz(46),W-30,Math.min(fz(40),W*.1),'#fff6c0',{al:'center',fam:FT,w:700,sh:'rgba(60,30,0,.9)',shw:8});
  var pw,bw,bh,by,bx,px0,py,gap=10;
  if(port){pw=Math.min(W-48,fz(420));bw=Math.min(W-40,fz(340));bh=Math.max(50,fz(19)*2.6);by=H-SAFE.b-14-bh*4-30;bx=W/2-bw/2;px0=W/2-pw/2}
  else{gap=8;var y0=ty+fz(80);bh=Math.max(38,Math.min(fz(52),(H-y0-SAFE.b-16-gap*3)/4));bw=Math.min(W*.38,fz(330));bx=W-bw-Math.max(SAFE.r,0)-28;by=y0;px0=Math.max(SAFE.l,0)+30;pw=bx-px0-30}
  var hh=wrapLines(END_TXT,pw,fz(18),{it:true,w:500}).length*fz(18)*1.32;
  py=port?Math.max(ty+fz(90),by-hh-fz(24)):Math.max(ty+fz(84),(H+ty)/2-hh/2);
  g.save();g.globalAlpha=a*.62;rr(px0-fz(14),py-fz(22),pw+fz(28),hh+fz(30),16);g.fillStyle='rgba(8,12,28,1)';g.fill();g.restore();
  para(END_TXT,px0,py,pw,fz(18),'#f6ead0',{it:true,w:500,al:'left',sh:'rgba(0,0,0,.7)'});
  g.globalAlpha=1;
  if(t>1.8){var x=bx;
   btn('night',x,by,bw,bh,'Ночной дозор',function(){voiceStop();go('run',{mode:'endless',night:1})},{st:'gold',sub:'Бесконечный · зажги все окна',px:fz(port?19:16)});
   btn('race',x,by+bh+gap,bw,bh,'Гонка',function(){voiceStop();go('rivers')},{st:'blue',sub:'25 рек · рекорды · рейтинг',px:fz(port?19:16)});
   btn('pz',x,by+2*(bh+gap),bw,bh,'Головоломки',function(){voiceStop();go('pbook')},{st:'green',sub:'Решено '+pagesDone()+' из '+pagesTotal(),px:fz(port?19:16)});
   btn('ti',x,by+3*(bh+gap),bw,bh*.9,'На главную',function(){voiceStop();go('title')},{st:'dark',px:fz(port?17:15)})}}};
