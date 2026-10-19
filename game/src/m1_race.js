/* ===== m1: Гонка — выбор реки, Лига реки, финиш, вызов другу ===== */
var TIERC=['#6fd06a','#ffd24a','#ff9a4a','#ff6a6a'];
function raceRec(i){return sv.race[i]||null}
function riverDone(i){var r=raceRec(i);return!!(r&&r.best)}
function riverOpen(i){return i===0||riverDone(i-1)||(i>1&&riverDone(i-2))}
function leagueMedals(L){var s=0;for(var k=0;k<5;k++){var r=raceRec(L*5+k);if(r)s+=r.medal||0}return s}
function totalMedals(){var s=0;for(var i=0;i<RIVERS.length;i++){var r=raceRec(i);if(r&&r.medal)s++}return s}
function nextRiver(){for(var i=0;i<RIVERS.length;i++)if(riverOpen(i)&&!riverDone(i))return i;return RIVERS.length-1}
function defaultGhost(river){var r=raceRec(river);if(r&&r.rec)return{kind:'me'};var gh=GH[river];if(gh&&gh.length)return{kind:'bot',i:Math.min(2,gh.length-1)};return null}
function startRace(river,ghost){go('run',{mode:'race',river:river,ghost:ghost===undefined?defaultGhost(river):ghost})}
function fmtRank(r){return r.rank+' из '+r.of}

/* ---- общий фон меню гонки ---- */
function raceBG(t,pi){var P=PAL[pi||0];g.fillStyle=LG(g,0,0,0,H,[0,P.sky[0],.55,P.sky[1],1,'#08142a']);g.fillRect(0,0,W,H);g.fillStyle='rgba(6,10,24,.55)';g.fillRect(0,0,W,H);
 for(var i=0;i<14;i++){var fx=((i*131+t*(7+i%4))%(W+60))-30,fy=H*.12+((i*79)%100)/100*H*.7+Math.sin(t*.8+i*1.9)*14;drawFirefly(g,fx,fy,U*.1,t,i,.7)}}
function nickChip(x,y,maxW){var px=fz(14);setFont(px,700,FU);var w=Math.min(maxW||999,g.measureText(myNick()).width+px*2.6),h=px*2.1;rr(x,y,w,h,h/2);g.fillStyle='rgba(8,14,32,.78)';g.fill();g.lineWidth=1.5;g.strokeStyle='rgba(159,232,255,.55)';g.stroke();
 g.beginPath();g.arc(x+h*.5,y+h/2,h*.22,0,TAU);g.fillStyle='#8de06a';g.fill();fitTxt(myNick(),x+h*.95,y+h/2+px*.36,w-h*1.2,px,'#e8f4ff',{fam:FU,w:700});UI.hits.push({id:'nick',x:x,y:y,w:w,h:h,fn:function(){nickReroll();toast('Теперь ты — '+myNick(),'#9fe8ff')}});return w}
function thumbRiver(x,y,r,i,locked){var q=PAL[RIVERS[i].pal];g.save();g.translate(x,y);g.beginPath();g.arc(0,0,r,0,TAU);g.fillStyle=LG(g,0,-r,0,r,[0,q.sky[0],.5,q.sky[1],1,q.sky[2]]);g.fill();g.save();g.beginPath();g.arc(0,0,r-1,0,TAU);g.clip();
 g.fillStyle=q.far;g.beginPath();g.ellipse(-r*.3,r*.55,r*.9,r*.5,0,0,TAU);g.fill();g.fillStyle=q.near;g.beginPath();g.ellipse(r*.4,r*.75,r,r*.5,0,0,TAU);g.fill();g.fillStyle=rgba(q.moon.g,.9);g.beginPath();g.arc(r*.35,-r*.35,r*.2,0,TAU);g.fill();
 if(locked){g.fillStyle='rgba(6,10,24,.62)';g.fillRect(-r,-r,r*2,r*2)}g.restore();g.lineWidth=2.5;g.strokeStyle=locked?'rgba(255,255,255,.35)':'#fff';g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();
 if(locked)icLock(g,0,-r*.06,r*.5);else txt(String(i%5+1),0,r*.28,Math.round(r*.9),'#fff',{al:'center',w:800,sh:'rgba(0,0,0,.65)'});g.restore()}

/* ---- список рек ---- */
var RV={scroll:0,max:0,drag:null,y0:0,s0:0,moved:0,rects:[],pt:null};
function riverListY(i){var ch=fz(78)+6,hh=fz(72),y=0;for(var L=0;L<5;L++){y+=hh;for(var k=0;k<5;k++){if(L*5+k===i)return y;y+=ch}y+=10}return y}
SC.rivers={
 enter:function(a){var n=nextRiver();RV.scroll=a&&a.scroll!=null?a.scroll:Math.max(0,riverListY(n)-H*.3);RV.drag=null;RV.rects=[];music('m_menu');ambient('water');netInit()},
 draw:function(g){var t=sceneT;raceBG(t,Math.min(4,(nextRiver()/5)|0));
  var hb=topBar('Гонка',function(){go('title')},true),pw=Math.min(W-20,540),px=(W-pw)/2,y0=hb+8,y1=H-SAFE.b-4;
  var cbw=fz(132),cb=Math.max(44,fz(19)*2);nickChip(px,y0+(cb-fz(14)*2.1)/2,pw-cbw-10);btn('chal',px+pw-cbw,y0,cbw,cb,'Принять вызов',function(){challengeOverlay()},{st:'gold',px:fz(14)});
  y0+=cb+10;g.save();g.beginPath();g.rect(0,y0,W,y1-y0);g.clip();
  var y=y0-RV.scroll,ch=fz(78)+6,hh=fz(72);RV.rects=[];
  for(var L=0;L<5;L++){var ld=LEAGUES[L],lm=leagueMedals(L);
   if(y+hh>y0-4&&y<y1){txt(ld.name.toUpperCase(),px+4,y+fz(24),fz(14),'#ffe27a',{fam:FU,w:800});setFont(fz(14),700,FU);var tw=g.measureText('★ '+lm+'/15').width;txt('★ '+lm+'/15',px+pw-4,y+fz(24),fz(14),'#ffe27a',{al:'right',fam:FU,w:800});
    para(ld.d,px+4,y+fz(44),pw-8,fz(13),'rgba(220,232,255,.85)',{fam:FU,w:500,lh:fz(15)})}
   y+=hh;
   for(var k=0;k<5;k++){var i=L*5+k,rv=RIVERS[i],open=riverOpen(i),rec=raceRec(i),h=ch-6;
    if(y+h>y0-4&&y<y1){panel(px,y,pw,h,{r:16,stroke:open?(rec&&rec.best?'rgba(255,214,120,.6)':'rgba(159,232,255,.5)'):'rgba(255,255,255,.14)',fill:open?undefined:'rgba(18,26,48,.9)'});
     thumbRiver(px+h*.5,y+h/2,h*.34,i,!open);
     var tx=px+h*.98,rw=(rec&&rec.best)?fz(78):(open?fz(44):10),aw=pw-h*.98-rw-8;fitTxt(rv.name,tx,y+fz(27),aw,fz(19),open?'#fff':'rgba(255,255,255,.5)',{w:700});
     txt(TIERS[rv.tier].name,tx,y+fz(50),fz(13),open?TIERC[rv.tier]:'rgba(255,255,255,.35)',{fam:FU,w:800});setFont(fz(13),800,FU);var twt=g.measureText(TIERS[rv.tier].name).width;
     fitTxt(' · '+rv.tag,tx+twt,y+fz(50),Math.max(40,aw-twt),fz(13),'rgba(210,224,250,.75)',{fam:FU,w:600});
     if(rec&&rec.best){var mcx=px+pw-fz(40);icMedal(g,mcx,y+h*.34,fz(11),rec.medal||0);txt(fmtT(rec.best),mcx,y+h*.8,fz(14),'#fff',{al:'center',fam:FU,w:800})}
     else if(open){var pr=fz(15),pcx=px+pw-pr-12,pcy=y+h/2;g.beginPath();g.arc(pcx,pcy,pr,0,TAU);g.fillStyle='#3fbf5a';g.fill();g.beginPath();g.moveTo(pcx-pr*.28,pcy-pr*.5);g.lineTo(pcx+pr*.55,pcy);g.lineTo(pcx-pr*.28,pcy+pr*.5);g.closePath();g.fillStyle='#fff';g.fill()}
     RV.rects.push({x:px,y:y,w:pw,h:h,i:i,open:open})}
    y+=ch}
   y+=10}
  RV.max=Math.max(0,y+RV.scroll-y1+6);g.restore();
  var gr=g.createLinearGradient(0,y1-24,0,y1);gr.addColorStop(0,'rgba(8,14,30,0)');gr.addColorStop(1,'rgba(8,14,30,.7)');g.fillStyle=gr;g.fillRect(0,y1-24,W,24);
  var gt=g.createLinearGradient(0,y0,0,y0+22);gt.addColorStop(0,'rgba(8,14,30,.85)');gt.addColorStop(1,'rgba(8,14,30,0)');g.fillStyle=gt;g.fillRect(0,y0,W,22)},
 down:function(p){RV.drag=p.id;RV.y0=p.y;RV.s0=RV.scroll;RV.moved=0;RV.pt={x:p.x,y:p.y}},
 move:function(p){if(RV.drag===p.id){RV.moved=Math.max(RV.moved,Math.abs(p.y-RV.y0));RV.scroll=clamp(RV.s0+(RV.y0-p.y),0,RV.max)}},
 up:function(p){if(RV.drag!==p.id)return;RV.drag=null;if(RV.moved>10)return;
  for(var k=0;k<RV.rects.length;k++){var r=RV.rects[k];if(p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h){
   if(!r.open){sfx('nope');toast('Сначала пройди предыдущую реку','#ffcf8a');return}
   sfx('ui');go('rprep',{river:r.i,scroll:RV.scroll});return}}}};

/* ---- карточка реки перед стартом: цель, медали, соперник ---- */
var RP=null;
SC.rprep={
 enter:function(a){RP={a:a,i:a.river,gh:defaultGhost(a.river)};music('m_menu');ambient('water');netInit()},
 draw:function(g){var t=sceneT,i=RP.i,rv=RIVERS[i],rec=raceRec(i),q=PAL[rv.pal],port=isPort();raceBG(t,rv.pal);
  var hb=topBar(rv.name,function(){go('rivers',{scroll:RP.a.scroll})},false),S=function(v){return port?fz(v):Math.round(fz(v)*.86)},
   pw=port?Math.min(W-24,520):Math.min((W-SAFE.l-SAFE.r-36)/2,440),pxA=port?(W-pw)/2:(W-2*pw-14)/2,pxB=port?pxA:pxA+pw+14,y=hb+(port?12:6),hA=S(176);
  panel(pxA,y,pw,hA,{r:20,stroke:'rgba(255,214,120,.7)'});
  thumbRiver(pxA+fz(46),y+S(52),Math.min(fz(32),S(40)),i,false);var tx=pxA+fz(96);
  txt('РЕКА '+(i%5+1)+' · '+LEAGUES[rv.league].name.toUpperCase(),tx,y+S(30),fz(12),'#ffe27a',{fam:FU,w:800});fitTxt(rv.name,tx,y+S(62),pw-fz(110),fz(28),'#fff',{w:700});
  txt(TIERS[rv.tier].name,tx,y+S(86),fz(14),TIERC[rv.tier],{fam:FU,w:800});setFont(fz(14),800,FU);var w1=g.measureText(TIERS[rv.tier].name).width;txt(' · '+rv.n+' кувшинок',tx+w1,y+S(86),fz(14),'rgba(220,232,255,.8)',{fam:FU,w:600});
  var par=rv.par,cw=(pw-36)/3;for(var m=0;m<3;m++){var cx=pxA+18+cw*m+cw/2,md=3-m,got=rec&&rec.medal>=md;icMedal(g,cx,y+S(122),fz(14),got?md:0);txt(fmtT(par[m]).replace(/\.\d+$/,''),cx,y+S(160),fz(15),got?MEDC[md]:'rgba(255,255,255,.6)',{al:'center',fam:FU,w:800})}
  var yN=port?y+hA+12:y;
  /* что ждёт */
  var tips=[];tips.push(TIERS[rv.tier].hint+'.');if(rv.wind>0)tips.push('Дует ветер: он сносит прыжок.');if(rv.kinds.sink)tips.push('Жёлтые кувшинки тонут, бирюзовые плывут.');if(rv.kinds.ice)tips.push('Лёд скользит — целься в начало льдины.');if(rv.en.soldier)tips.push('Осы пикируют: бей «Удар» в последний миг.');
  var tipS=tips.slice(0,3).join(' '),tlh=fz(14)*1.3,nl=wrapLines(tipS,pw-32,fz(14),{fam:FU,w:500}).length,hN=Math.max(S(98),S(40)+nl*tlh+14);
  panel(pxB,yN,pw,hN,{r:16});txt('ЧТО ЖДЁТ',pxB+16,yN+S(26),fz(12),'#ffe27a',{fam:FU,w:800});
  para(tipS,pxB+16,yN+S(46),pw-32,fz(14),'#dfe9ff',{fam:FU,w:500,lh:tlh});
  var yG=port?yN+hN+12:y+hA+10;
  /* соперник */
  var gh=RP.gh,gname=gh?(gh.kind==='me'?'Твой рекорд · '+fmtT(rec.best):(GH[i][gh.i].n+' · '+fmtT(GH[i][gh.i].t))):'Без призрака',hG=S(84);
  panel(pxA,yG,pw,hG,{r:16});txt('СОПЕРНИК-ПРИЗРАК',pxA+16,yG+S(26),fz(12),'#9fe8ff',{fam:FU,w:800});fitTxt(gname,pxA+16,yG+S(58),pw-fz(150),fz(19),'#fff',{fam:FU,w:700});
  btn('lg',pxA+pw-fz(126),yG+Math.round((hG-fz(48))/2),fz(112),fz(48),'Лига',function(){go('rleague',{river:i,back:'rprep',scroll:RP.a.scroll})},{st:'blue',px:fz(16)});
  var yR=port?yG+hG+14:yN+hN+14;
  if(rec&&rec.best){txt('Твой рекорд: '+fmtT(rec.best)+'  ·  '+(MEDN[rec.medal||0]),pxB+pw/2,yR+fz(8),fz(15),'#ffe9a0',{al:'center',fam:FU,w:700})}
  var bh=Math.max(58,fz(26)*2),bw=port?Math.min(W-40,420):pw;btn('go',port?(W-bw)/2:pxB,H-SAFE.b-16-bh,bw,bh,'Старт',function(){startRace(i,RP.gh)},{st:'green',px:fz(24)})}};

/* ---- Лига реки ---- */
var RLG=null;
SC.rleague={
 enter:function(a){RLG={a:a,i:a.river,sel:-1,scroll:0,max:0,drag:null,rects:[],tab:0,net:null,netLoading:false};music('m_menu');netInit();RLG.list=riverLeague(a.river);
  for(var k=0;k<RLG.list.length;k++)if(RLG.list[k].kind==='me'){RLG.sel=k}
  if(Net.ok){RLG.netLoading=true;netTop(a.river,function(r){RLG.net=r;RLG.netLoading=false})}},
 draw:function(g){var t=sceneT,i=RLG.i,rv=RIVERS[i],rec=raceRec(i);raceBG(t,rv.pal);
  var hb=topBar('Лига · '+rv.name,function(){go(RLG.a.back||'rivers',RLG.a.back==='rprep'?{river:i,scroll:RLG.a.scroll}:{scroll:RLG.a.scroll})},false),pw=Math.min(W-24,520),px=(W-pw)/2,y=hb+8;
  var tw=(pw-8)/2,bh=Math.max(42,fz(18)*2);btn('t0',px,y,tw,bh,'Соперники',function(){RLG.tab=0;RLG.scroll=0},{st:RLG.tab===0?'gold':'dark',px:fz(16)});btn('t1',px+tw+8,y,tw,bh,'Мир',function(){RLG.tab=1;RLG.scroll=0},{st:RLG.tab===1?'gold':'dark',px:fz(16)});y+=bh+10;
  var y1=H-SAFE.b-(Math.max(54,fz(24)*2)*2+30);g.save();g.beginPath();g.rect(0,y,W,y1-y);g.clip();var yy=y-RLG.scroll,rh=fz(58);RLG.rects=[];
  if(RLG.tab===0){
   RLG.list=riverLeague(i);var l=RLG.list;
   for(var k=0;k<l.length;k++){var r=l[k],sel=RLG.sel===k,me=r.kind==='me';
    panel(px,yy,pw,rh-6,{r:14,stroke:me?'rgba(141,224,106,.95)':sel?'rgba(159,232,255,.9)':'rgba(255,255,255,.18)',fill:me?'rgba(30,70,40,.92)':undefined});
    txt(String(k+1),px+fz(24),yy+rh/2+fz(5),fz(19),k<3?'#ffd24a':'#cfe0ff',{al:'center',fam:FU,w:800});
    var ic=r.kind==='bot'?'🐸':r.kind==='friend'?'✉':'★';fitTxt(r.n+(me?' (ты)':''),px+fz(46),yy+rh/2-fz(3),pw-fz(46)-fz(110),fz(17),'#fff',{fam:FU,w:700});
    txt(r.kind==='bot'?'призрак-соперник':r.kind==='friend'?'призрак друга':'твой рекорд',px+fz(46),yy+rh/2+fz(15),fz(12),'rgba(200,215,245,.7)',{fam:FU,w:600});
    txt(fmtT(r.t),px+pw-14,yy+rh/2+fz(6),fz(18),'#fff',{al:'right',fam:FU,w:800});
    RLG.rects.push({x:px,y:yy,w:pw,h:rh-6,k:k});yy+=rh}
   if(!l.length)para('Пока никого. Пройди реку — и появятся соперники.',px+10,yy+fz(24),pw-20,fz(15),'#cfe0ff',{fam:FU,w:600});
   RLG.max=Math.max(0,yy+RLG.scroll-y1+4)}
  else{
   if(RLG.netLoading)txt('Загружаю рейтинг…',W/2,yy+fz(40),fz(16),'#cfe0ff',{al:'center',fam:FU,w:600});
   else if(RLG.net){var nl=RLG.net;for(var j=0;j<nl.length;j++){var x=nl[j];panel(px,yy,pw,rh-6,{r:14});txt(String(j+1),px+fz(24),yy+rh/2+fz(5),fz(19),j<3?'#ffd24a':'#cfe0ff',{al:'center',fam:FU,w:800});fitTxt(x.n,px+fz(46),yy+rh/2+fz(5),pw-fz(46)-fz(110),fz(17),'#fff',{fam:FU,w:700});txt(fmtT(x.t),px+pw-14,yy+rh/2+fz(6),fz(18),'#fff',{al:'right',fam:FU,w:800});yy+=rh}
    if(!nl.length)para('Здесь пока пусто. Будь первым!',px+10,yy+fz(24),pw-20,fz(15),'#cfe0ff',{fam:FU,w:600})}
   else{var hh=para('Мировой рейтинг появится, когда у игры будет сервер. Сейчас ты соревнуешься с призраками и с друзьями: нажми «Вызов другу» — и отправь код в любой мессенджер. Друг вставит его у себя и погонится за твоим призраком.',px+10,yy+fz(22),pw-20,fz(15),'#dfe9ff',{fam:FU,w:500});RLG.max=0}
   if(RLG.net)RLG.max=Math.max(0,yy+RLG.scroll-y1+4)}
  g.restore();
  /* нижние кнопки */
  var bh2=Math.max(54,fz(24)*2),by=H-SAFE.b-14-bh2*2-10,hw=(pw-10)/2,sel=RLG.tab===0&&RLG.list[RLG.sel];
  btn('chase',px,by,pw,bh2,sel&&sel.kind!=='me'?'Гнаться за '+sel.n:sel&&sel.kind==='me'?'Гнаться за своим рекордом':'Гонка',function(){var s=RLG.list[RLG.sel],gh=null;if(s){if(s.kind==='me')gh={kind:'me'};else if(s.kind==='bot')gh={kind:'bot',i:s.i};else gh={kind:'friend',i:s.i}}else gh=defaultGhost(i);startRace(i,gh)},{st:'green',px:fz(18)});
  btn('shr',px,by+bh2+10,hw,bh2,'Вызов другу',function(){shareChallenge(i)},{st:'gold',px:fz(16),dis:!(rec&&rec.rec)});
  btn('acc',px+hw+10,by+bh2+10,hw,bh2,'Принять вызов',function(){challengeOverlay()},{st:'blue',px:fz(16)})},
 down:function(p){RLG.drag=p.id;RLG.y0=p.y;RLG.s0=RLG.scroll;RLG.moved=0},move:function(p){if(RLG.drag===p.id){RLG.moved=Math.max(RLG.moved,Math.abs(p.y-RLG.y0));RLG.scroll=clamp(RLG.s0+(RLG.y0-p.y),0,RLG.max)}},
 up:function(p){if(RLG.drag!==p.id)return;RLG.drag=null;if(RLG.moved>10)return;for(var k=0;k<RLG.rects.length;k++){var r=RLG.rects[k];if(p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h){RLG.sel=r.k;sfx('ui');return}}}};

/* ---- финиш ---- */
var RR=null;
SC.rresult={
 enter:function(a){RR={a:a,t:0,rank:riverRank(a.river,a.t),code:null,tick:0};music('m_menu');ambient(null);sfx(a.m>=2?'win':'dawn');if(a.m>0)vib(40);
  /* общая база: отправить время */
  netInit();if(a.newBest||a.m>0)setTimeout(function(){netSubmit(a.river,a.t,a.rec)},800)},
 draw:function(g){var a=RR.a,t=sceneT,rv=RIVERS[a.river];raceBG(t,rv.pal);
  var port=H>=W,cx=port?W/2:W*.27,y=SAFE.t+(port?H*.06:fz(24)),colW=port?Math.min(W-32,420):Math.min(W*.46-SAFE.r-8,420),colX=port?(W-colW)/2:W*.52+(W*.48-SAFE.r-colW)/2;
  txt(rv.name.toUpperCase(),cx,y,fz(14),'#ffe27a',{al:'center',fam:FU,w:800});y+=fz(10);
  /* медаль */
  var k=clamp((t-.3)/.7,0,1),r0=Math.min(W*.16,H*.1),ky=y+r0*1.5;
  if(a.m>0){glow(g,cx,ky,r0*3,MEDC[a.m],.5*k);g.save();g.translate(cx,ky);var s=.4+.6*easeOut(k);g.scale(s,s);icMedal(g,0,0,r0,a.m);g.restore()}else{icMedal(g,cx,ky,r0,0)}
  txt(a.m>0?MEDN[a.m]:'Финиш!',cx,ky+r0*1.55,fz(26),a.m>0?MEDC[a.m]:'#fff',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.6)'});
  /* время */
  var ty=ky+r0*1.55+fz(70),shown=Math.min(a.t,a.t*clamp((t-.2)/.9,0,1));drawTimer(cx,ty,fz(54),'#fff',shown);
  var dy=ty+fz(34);
  if(a.newBest&&a.prev){txt('НОВЫЙ РЕКОРД  '+fmtD(a.t-a.prev)+' с',cx,dy,fz(18),'#8dffb0',{al:'center',fam:FU,w:900,sh:'rgba(0,60,20,.7)'})}
  else if(a.newBest)txt('ПЕРВЫЙ РЕКОРД НА РЕКЕ',cx,dy,fz(18),'#8dffb0',{al:'center',fam:FU,w:900,sh:'rgba(0,60,20,.7)'});
  else if(a.prev)txt('Твой рекорд '+fmtT(a.prev)+'  ('+fmtD(a.t-a.prev)+' с)',cx,dy,fz(16),'#ffcf8a',{al:'center',fam:FU,w:700});
  if(a.ghost){dy+=fz(26);var gd=a.t-a.ghost.t;fitTxt(a.ghost.name+': '+fmtT(a.ghost.t)+'  ·  '+(gd<=0?'ты быстрее на '+Math.abs(gd).toFixed(2):'ты медленнее на '+gd.toFixed(2))+' с',cx,dy,port?W-20:W*.5-20,fz(14),gd<=0?'#8dffb0':'#ffb0a0',{al:'center',fam:FU,w:700})}
  /* карточка статистики */
  var bh=Math.max(52,fz(22)*2),bw=colW,bx=colX,by=H-SAFE.b-14-bh*3-20,nx=a.river+1<RIVERS.length;dy+=fz(18);var pw=colW,px=colX,rh=fz(30),rows=[['Место в лиге',fmtRank(RR.rank)],['Падений в воду',a.falls+(a.pen?'  (+'+a.pen.toFixed(0)+' с)':'')],['Идеальных прыжков',a.perf+'  ·  серия ×'+a.combo]];
  if(!port)dy=by-(rows.length*rh+16)-16;
  panel(px,dy,pw,rows.length*rh+16,{r:16});for(var i=0;i<rows.length;i++){txt(rows[i][0],px+16,dy+rh*.9+i*rh,fz(15),'#dfe6f5',{fam:FU,w:600});txt(rows[i][1],px+pw-16,dy+rh*.9+i*rh,fz(16),'#fff',{al:'right',fam:FU,w:800})}
  dy+=rows.length*rh+16;
  /* кнопки */
  btn('again',bx,by,bw,bh,'Ещё раз',function(){startRace(a.river,defaultGhost(a.river))},{st:'green',px:fz(21)});
  var hw=(bw-10)/2;btn('lg',bx,by+bh+10,hw,bh,'Лига',function(){go('rleague',{river:a.river,back:'rivers'})},{st:'blue',px:fz(17)});btn('shr',bx+hw+10,by+bh+10,hw,bh,'Вызов другу',function(){shareChallenge(a.river)},{st:'gold',px:fz(16)});
  btn('nx',bx,by+2*(bh+10),hw,bh,nx?'Следующая':'К рекам',function(){if(nx)go('rprep',{river:a.river+1});else go('rivers')},{st:'dark',px:fz(16)});btn('rv',bx+hw+10,by+2*(bh+10),hw,bh,'Реки',function(){go('rivers')},{st:'dark',px:fz(16)})}};

/* ---- вызов другу: код → в мессенджер; принять код ---- */
function shareChallenge(river){var r=raceRec(river);if(!r||!r.rec){toast('Сначала пройди реку','#ffcf8a');return}
 var code=makeChallenge(river,r.best,myNick(),r.rec),msg='Брось мне вызов! Река «'+RIVERS[river].name+'» — моё время '+fmtT(r.best)+'. Вставь код в игре «Топ-Тоут» (Гонка → Принять вызов) и догони мой призрак:\n'+code;
 if(navigator.share){navigator.share({title:'Вызов в «Топ-Тоут»',text:msg}).catch(function(){copyText(msg,'Код вызова скопирован')})}else copyText(msg,'Код вызова скопирован')}
function copyText(s,ok){function man(){toast('Не удалось скопировать','#ffcf8a')}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(s).then(function(){toast(ok,'#9cf0a8')},man)}else{try{var ta=document.createElement('textarea');ta.value=s;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast(ok,'#9cf0a8')}catch(e){man()}}}
function challengeOverlay(){if(document.getElementById('chov'))return;
 var ov=document.createElement('div');ov.id='chov';ov.style.cssText='position:fixed;inset:0;z-index:50;background:rgba(4,8,24,.84);display:flex;align-items:center;justify-content:center;padding:12px;overflow:auto;font-family:Inter,system-ui,sans-serif';
 var bx=document.createElement('div');bx.style.cssText='width:100%;max-width:440px;background:#16224a;border:2px solid #ffd98a;border-radius:18px;padding:18px;color:#f3f6ff;box-shadow:0 10px 40px rgba(0,0,0,.6);box-sizing:border-box;max-height:100%;overflow:auto;-webkit-user-select:text;user-select:text';
 var h=document.createElement('div');h.textContent='Принять вызов';h.style.cssText='font:700 22px Lora,serif;color:#ffd98a;margin-bottom:6px';
 var d=document.createElement('div');d.textContent='Вставь сообщение с кодом от друга — призрак друга появится в Лиге этой реки.';d.style.cssText='font-size:16px;line-height:1.35;color:#cfe0ff;margin-bottom:10px';
 var ta=document.createElement('textarea');ta.rows=window.innerHeight<520?2:4;ta.placeholder='ЛАРРИ.3.5521.…';ta.style.cssText='width:100%;box-sizing:border-box;font:16px/1.35 Inter,system-ui,sans-serif;padding:10px;border-radius:12px;border:2px solid #3a4a86;background:#0b1535;color:#fff;resize:none;-webkit-user-select:text;user-select:text';
 var st=document.createElement('div');st.style.cssText='min-height:22px;font-size:15px;color:#9cf0a8;margin:8px 0 2px';
 var row=document.createElement('div');row.style.cssText='display:flex;gap:10px;margin-top:8px';
 function mk(t,bg,fg){var b=document.createElement('button');b.textContent=t;b.style.cssText='flex:1;min-height:52px;font:800 17px Inter,system-ui,sans-serif;border:0;border-radius:14px;background:'+bg+';color:'+fg+';cursor:pointer';return b}
 var bo=mk('Принять','#7ed957','#12300a'),bc=mk('Закрыть','#2b3a72','#fff'),bp=mk('Вставить','#ffd98a','#4a2a00');
 function close(){try{document.body.removeChild(ov)}catch(e){}}
 bc.onclick=close;
 bp.onclick=function(){if(navigator.clipboard&&navigator.clipboard.readText){navigator.clipboard.readText().then(function(s){ta.value=s;bo.onclick()},function(){st.style.color='#ffcf8a';st.textContent='Нажми и удерживай в поле — «Вставить».'})}else{st.style.color='#ffcf8a';st.textContent='Нажми и удерживай в поле — «Вставить».'}};
 bo.onclick=function(){var c=parseChallenge(ta.value);if(!c.ok){st.style.color='#ffb0a0';st.textContent=c.err;return}
  var isNew=addFriendGhost(c);st.style.color='#9cf0a8';st.textContent=(isNew?'Принято: ':'Уже есть: ')+c.name+' · '+fmtT(c.t)+' · '+RIVERS[c.river].name;
  setTimeout(function(){close();go('rleague',{river:c.river,back:'rivers'})},700)};
 ov.addEventListener('pointerdown',function(e){e.stopPropagation()});ov.addEventListener('touchstart',function(e){e.stopPropagation()},{passive:true});
 row.appendChild(bo);row.appendChild(bp);row.appendChild(bc);bx.appendChild(h);bx.appendChild(d);bx.appendChild(ta);bx.appendChild(st);bx.appendChild(row);ov.appendChild(bx);document.body.appendChild(ov)}
