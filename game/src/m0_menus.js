/* ===== меню v4: заглавный экран (3 режима), карта Сказки, лагерь, итоги, настройки, дневник ===== */
/* ---- общие данные меню ---- */
var UPG=[
 {k:'h',n:'Сердце Ларри',s:'Палатка Ларри',cost:[90,260,600],d:function(l){return 'Лепестков: '+(3+l)+(l<3?' → '+(4+l):'')}},
 {k:'e',n:'Зоркий глаз',s:'Тележка Крапинки',cost:[70,200,460],d:function(l){return 'Кувшинки принимают шире: +'+l*8+'%'+(l<3?' → +'+(l+1)*8+'%':'')}},
 {k:'p',n:'Счастливая подкова',s:'Конюшня Пороха',cost:[80,230,520],d:function(l){return 'Зов Пороха копится быстрее: +'+l*15+'%'+(l<3?' → +'+(l+1)*15+'%':'')}},
 {k:'s',n:'Заточка меча',s:'Наковальня',cost:[80,240,540],d:function(l){return 'Удар достаёт дальше: +'+l*8+'%'+(l<3?' → +'+(l+1)*8+'%':'')}},
 {k:'m',n:'Магнит света',s:'Фонарь у входа',cost:[70,200,460],d:function(l){return 'Светляки слетаются издалека: уровень '+l+(l<3?' → '+(l+1):'')}},
 {k:'g',n:'Щит Крапинки',s:'Мастерская Крапинки',cost:[110,300,680],d:function(l){var a=['нет щита','1 щит на этап','1 щит, чинится у ламп','2 щита, чинятся у ламп'];return 'Крылышко гасит удар: '+a[l]+(l<3?' → '+a[l+1]:'')}},
 {k:'r',n:'Звонкий клинок',s:'Звонница на причале',cost:[100,280,640],d:function(l){var a=['—','каждое 6-е парирование лечит','каждое 4-е парирование лечит','каждое 3-е парирование лечит'];return 'Отбитое обращается в тепло: '+a[l]+(l<3?' → '+a[l+1]:'')}},
 {k:'w',n:'Крылья Выпи',s:'Гнездо Выпи',cost:[120,320,700],d:function(l){var a=['нет','1 раз за этап','2 раза за этап','3 раза за этап'];return 'Выпь подхватит над водой без потери лепестка: '+a[l]+(l<3?' → '+a[l+1]:'')}},
 {k:'t',n:'Трофейный мешок',s:'Походный обоз',cost:[90,240,560],d:function(l){return 'С побеждённых врагов падает светляков больше: '+(l?'+'+l:'как обычно')+(l<3?' → +'+(l+1):'')}}];
var TIPS=['Не прыгай сразу: дождись, когда золотое кольцо совпадёт с кувшинкой.','Парирование — это удар в миг, когда враг уже летит на тебя.','Лампы — контрольные точки. Зажигай их: упадёшь — вернёшься к лампе.','Накопил подкову — свистни Пороху. Он домчит через шесть кувшинок.','Ветер сносит прыжок — кольцо уже учитывает его.','Идеальная посадка копит Зов Пороха быстрее.','Заря приходит к тем, кто несёт свет. Выбирай дары с умом.'];
var PARTN=['Фитиль','Стекло','Лунное масло','Оправа','Кольцо'];
function nrm(n){return n>=1000?(n/1000).toFixed(1).replace('.0','')+'k':''+n}
function stageOpen(c){return c===0||sv.cs[c-1]>=0}
function stagesDone(){var n=0;for(var i=0;i<15;i++)if(sv.cs[i]>=0)n++;return n}
function nextStage(){for(var i=0;i<15;i++)if(stageOpen(i)&&sv.cs[i]<0)return i;return 14}
function progressPI(){return Math.min(4,(nextStage()/3)|0)}
function haveParts(){return sv.part}
function totalStars(){var n=0;for(var i=0;i<15;i++)if(sv.cs[i]>0)n+=sv.cs[i];return n}
function nightOpen(){return true}
function stageTime(c){var s=CHS[c],t=s.n*1.1;return Math.max(1,Math.round(t/30)/2)}
/* этап можно сыграть заново с карты — без сцен, с вступлением рассказчика */
function playStage(c){go('run',{mode:'story',ch:c,replay:true})}
function storyAfter(ch,res){res.ch=ch;if(res.chain!=null){sv.cmp=Math.max(sv.cmp|0,res.chain+1);save()}go('stageres',res)}
/* поделиться текстом */
function shareText(msg,okMsg){if(navigator.share){navigator.share({text:msg}).catch(function(){})}else copyText(msg,okMsg||'Скопировано')}
/* ---- общие куски ---- */
function fireCounter(x,y,al){var px=fz(18);var s=nrm(sv.fire);setFont(px,800,FU);var w=g.measureText(s).width+px*2.4;var h=px*1.9;var xx=al==='r'?x-w:x;rr(xx,y,w,h,h/2);g.fillStyle='rgba(8,14,32,.8)';g.fill();g.lineWidth=1.5;g.strokeStyle='rgba(255,226,122,.55)';g.stroke();icFire(g,xx+h*.55,y+h/2,h*.34);txt(s,xx+h*1.0,y+h/2+px*.35,px,'#ffe27a',{fam:FU,w:800});return w}
function starsRow(cx,cy,r,n,max,al){max=max||3;var gap=r*2.3,x0=cx-(max-1)*gap/2;for(var i=0;i<max;i++){if(i<n)icStar(g,x0+i*gap,cy,r);else icStar(g,x0+i*gap,cy,r,'rgba(90,100,130,.55)','#3a4260')}}
function icBook(g,x,y,r){g.save();g.translate(x,y);g.fillStyle='#ffe27a';rr(-r*.8,-r*.9,r*1.6,r*1.8,r*.18);g.fill();g.fillStyle='#8a5a30';g.fillRect(-r*.8,-r*.9,r*.28,r*1.8);g.strokeStyle='#8a5a30';g.lineWidth=r*.12;g.beginPath();for(var i=0;i<3;i++){g.moveTo(-r*.25,-r*.4+i*r*.4);g.lineTo(r*.5,-r*.4+i*r*.4)}g.stroke();g.restore()}
function icFlag(g,x,y,r){g.save();g.translate(x,y);g.strokeStyle='#fff';g.lineWidth=r*.2;g.lineCap='round';g.beginPath();g.moveTo(-r*.55,r*.95);g.lineTo(-r*.55,-r*.95);g.stroke();
 var n=4,cw=r*.34;for(var j=0;j<3;j++)for(var i=0;i<n;i++){g.fillStyle=(i+j)%2?'#fff':'#10182a';g.fillRect(-r*.45+i*cw,-r*.95+j*cw,cw,cw)}g.restore()}
function icMoon(g,x,y,r){g.save();g.translate(x,y);g.beginPath();g.rect(-r*2,-r*2,r*4,r*4);g.arc(r*.45,-r*.25,r*.78,0,TAU);g.clip('evenodd');g.beginPath();g.arc(0,0,r*.9,0,TAU);g.fillStyle='#fff4c0';g.fill();g.lineWidth=r*.1;g.strokeStyle='#a56000';g.stroke();g.restore()}
function icCamp(g,x,y,r){drawTent(g,x,y+r*.7,r*.8,'#e0704a')}
function iconBox(g,k,x,y,r){/* значки станций лагеря */g.save();g.translate(x,y);
 if(k==='h'){icPetal(g,0,0,r*.9,true)}else if(k==='e'){g.beginPath();g.ellipse(0,0,r,r*.62,0,0,TAU);g.fillStyle='#fff';g.fill();g.strokeStyle='#223';g.lineWidth=3;g.stroke();g.beginPath();g.arc(0,0,r*.34,0,TAU);g.fillStyle='#2f7fe0';g.fill();g.beginPath();g.arc(0,0,r*.16,0,TAU);g.fillStyle='#000';g.fill()}
 else if(k==='p'){g.strokeStyle='#e6edf8';g.lineWidth=r*.3;g.lineCap='round';g.beginPath();g.arc(0,r*.1,r*.6,-.4,PI+.4,false);g.stroke();g.fillStyle='#ffd04a';g.beginPath();g.arc(-r*.55,r*.35,r*.1,0,TAU);g.arc(r*.55,r*.35,r*.1,0,TAU);g.fill()}
 else if(k==='s'){icSword(g,0,0,r)}
 else if(k==='g'){g.beginPath();g.moveTo(0,-r*.95);g.bezierCurveTo(r*.9,-r*.8,r*.95,r*.1,0,r*.98);g.bezierCurveTo(-r*.95,r*.1,-r*.9,-r*.8,0,-r*.95);g.closePath();g.fillStyle='#e0463f';g.fill();g.strokeStyle='#fff';g.lineWidth=r*.12;g.stroke();g.fillStyle='#1a1018';g.beginPath();g.arc(-r*.3,-r*.2,r*.14,0,TAU);g.arc(r*.3,-r*.2,r*.14,0,TAU);g.arc(0,r*.35,r*.14,0,TAU);g.fill();g.fillRect(-r*.03,-r*.8,r*.06,r*1.7)}
 else if(k==='r'){g.beginPath();g.moveTo(-r*.85,r*.55);g.bezierCurveTo(-r*.8,-r*.1,-r*.5,-r*.9,0,-r*.9);g.bezierCurveTo(r*.5,-r*.9,r*.8,-r*.1,r*.85,r*.55);g.closePath();g.fillStyle=LG(g,0,-r,0,r*.6,[0,'#ffe27a',1,'#c98a10']);g.fill();g.strokeStyle='#fff';g.lineWidth=r*.1;g.stroke();g.beginPath();g.arc(0,r*.72,r*.2,0,TAU);g.fillStyle='#fff';g.fill();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=r*.1;g.beginPath();g.arc(0,-r*.1,r*1.15,-.5,.5);g.stroke();g.beginPath();g.arc(0,-r*.1,r*1.15,PI-.5,PI+.5);g.stroke()}
 else if(k==='w'){g.fillStyle='#e8f0ff';g.strokeStyle='#fff';g.lineWidth=r*.08;g.lineCap='round';g.beginPath();g.moveTo(-r*.7,r*.8);g.bezierCurveTo(-r*.9,-r*.2,-r*.2,-r*.95,r*.8,-r*.85);g.bezierCurveTo(r*.5,-r*.2,r*.2,r*.4,-r*.7,r*.8);g.closePath();g.fill();g.strokeStyle='#7a8fb8';g.beginPath();g.moveTo(-r*.7,r*.8);g.quadraticCurveTo(0,-r*.1,r*.75,-r*.8);g.stroke();for(var q=0;q<4;q++){g.beginPath();g.moveTo(-r*.4+q*r*.2,r*.4-q*r*.28);g.lineTo(-r*.2+q*r*.2,r*.05-q*r*.28);g.stroke()}}
 else if(k==='t'){g.beginPath();g.moveTo(-r*.35,-r*.55);g.quadraticCurveTo(-r*.95,r*.2,-r*.7,r*.8);g.lineTo(r*.7,r*.8);g.quadraticCurveTo(r*.95,r*.2,r*.35,-r*.55);g.closePath();g.fillStyle=LG(g,0,-r*.6,0,r*.8,[0,'#c8935a',1,'#7a5430']);g.fill();g.strokeStyle='#3a2410';g.lineWidth=r*.1;g.stroke();g.fillStyle='#e6c88a';g.fillRect(-r*.45,-r*.62,r*.9,r*.2);icFire(g,0,r*.2,r*.32)}
 else{g.strokeStyle='#e0463f';g.lineWidth=r*.38;g.beginPath();g.arc(0,0,r*.6,PI,0);g.lineTo(r*.6,r*.5);g.moveTo(-r*.6,0);g.lineTo(-r*.6,r*.5);g.stroke();g.fillStyle='#fff';g.fillRect(-r*.8,r*.4,r*.4,r*.2);g.fillRect(r*.4,r*.4,r*.4,r*.2)}
 g.restore()}
function slider(id,x,y,w,val,fn){var h=34;g.save();rr(x,y+h/2-5,w,10,5);g.fillStyle='rgba(255,255,255,.14)';g.fill();rr(x,y+h/2-5,Math.max(10,w*val),10,5);g.fillStyle=LG(g,x,0,x+w,0,[0,'#ffd24a',1,'#ff9a2a']);g.fill();
 g.beginPath();g.arc(x+w*val,y+h/2,15,0,TAU);g.fillStyle='#fff';g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=6;g.fill();g.shadowColor='transparent';g.lineWidth=3;g.strokeStyle='#e0961a';g.stroke();g.restore();
 var set=function(px){fn(clamp((px-x)/w,0,1))};UI.hits.push({id:id,x:x-16,y:y-8,w:w+32,h:h+16,down:function(p){set(p.x)},drag:function(px){set(px)}})}
function topBar(title,back,showFire){var bh=Math.max(46,fz(16)*2.5),y=SAFE.t+8;circBtn('back',SAFE.l+14+bh/2,y+bh/2,bh*.46,function(){sfx('back');back()},icBack,{ir:.5});
 if(title){if(showFire){var tx0=SAFE.l+14+bh*.92+16;fitTxt(title,tx0,y+bh*.68,W-tx0-SAFE.r-14-fz(18)*5.2-8,fz(26),'#fff',{w:700,sh:'rgba(0,0,0,.6)'})}else fitTxt(title,W/2,y+bh*.68,W-2*(bh+36),fz(26),'#fff',{al:'center',w:700,sh:'rgba(0,0,0,.6)'})}
 if(showFire)fireCounter(W-SAFE.r-14,y+bh*.1,'r');return y+bh}
function canBuyAny(){for(var i=0;i<UPG.length;i++){var u=UPG[i],l=sv.up[u.k];if(l<3&&sv.fire>=u.cost[l])return true}return false}
function dot(x,y){g.beginPath();g.arc(x,y,8,0,TAU);g.fillStyle='#ff5a4a';g.fill();g.lineWidth=2;g.strokeStyle='#fff';g.stroke()}
/* ---- заглавный экран: три режима ---- */
var NIGHT_GOALS=[3,6,10,15,22];
function nightGoal(){for(var i=0;i<NIGHT_GOALS.length;i++)if(sv.nb<NIGHT_GOALS[i])return NIGHT_GOALS[i];return null}
function pzSub(){return 'Решено '+pagesDone()+' из '+pagesTotal()+' · 10 видов'}
function raceSub(){var m=totalMedals(),d=0;for(var i=0;i<RIVERS.length;i++)if(riverDone(i))d++;return d===0?'25 рек · на время · рейтинг мира':'Пройдено '+d+' из 25 · медалей '+m}
function nightSub(){var g2=nightGoal();return sv.nb?'Рекорд '+sv.nb+' '+plural(sv.nb,'ночь','ночи','ночей')+(g2?' · цель '+g2:''):'Бесконечный · продержись до зари'}
SC.title={
 enter:function(){music('m_menu');ambient('water');netInit();this.nt=0},
 draw:function(g){var pi=progressPI(),port=isPort(),t=sceneT,wy=Math.round(H*(port?.45:.62)),bg=stageBG(pi,wy),P=PAL[pi],u=stageU()*(port?1.25:1.05);
  drawBG(g,bg,t*.25,t,U);drawWater(g,bg,P,W,H,wy,t*.25,U,t);waterFade(g,P,W,H,wy);
  for(var i=0;i<16;i++){var fx=((i*97+t*(6+i%5))%(W+60))-30,fy=wy-H*.18+Math.sin(t*.7+i*1.7)*H*.1+(i%4)*H*.06;drawFirefly(g,fx,fy,u*.12,t,i,.8)}
  var bw=Math.min(W-32,port?430:380),bx=port?(W-bw)/2:W-bw-20-SAFE.r,LW=port?W:bx-16-SAFE.l,LX=port?0:SAFE.l;
  var hx=port?W*.26:LX+LW*.2,fy=wy+u*(port?.7:.55),px2=port?W*.78:LX+LW*.8;
  drawLily(g,hx,fy+u*.12,u*1.5/U,U,{pal:P,t:t});drawShore(g,px2,fy,u,P,'water');
  drawActor('larry',hx,fy,u,1,'smile',false,t);drawActor('krap',port?W*.5:LX+LW*.5,fy-u*(port?.9:.5),u,1,'smile',false,t);drawActor('por',px2,fy,u,-1,null,false,t);
  var ty=SAFE.t+(port?Math.max(H*.1,fz(70)):H*.15),cx=port?W/2:LX+LW/2;
  txt('СЭР ЛАРРИ',cx,ty-fz(34),fz(17),'#ffe27a',{al:'center',fam:FU,w:800,sh:'rgba(0,0,0,.6)'});
  fitTxt('ТОП-ТОУТ',cx,ty+fz(12),LW-36,port?Math.min(fz(56),Math.round(H*.085)):fz(46),'#fff',{al:'center',w:800,sh:'rgba(30,20,60,.85)',shw:fz(10)});
  fitTxt('Фонарь Рассвета · спасти Крапинку',cx,ty+fz(48),LW-40,fz(18),'#ffd98a',{al:'center',it:true,w:500,sh:'rgba(30,20,60,.8)'});
  /* режимы */
  var gap=9,sm=Math.max(46,fz(20)*2),avail=H-SAFE.b-SAFE.t-20-sm-gap*4,bh=clamp(avail/4,50,Math.max(62,fz(26)*2.1)),total=bh*4+sm+gap*4,by0=port?H-SAFE.b-14-total:Math.max(SAFE.t+10,(H-total)/2);
  var ss=chainTitle();
  btn('story',bx,by0,bw,bh,ss[0],function(){chainContinue()},{st:'green',sub:ss[1],px:fz(21),icon:icBook});
  var y1=by0+bh+gap;
  btn('race',bx,y1,bw,bh,'Гонка',function(){go('rivers')},{st:'blue',sub:raceSub(),px:fz(21),icon:icFlag});
  var y2=y1+bh+gap;
  btn('night',bx,y2,bw,bh,'Ночной дозор',function(){go('run',{mode:'endless',night:1})},{st:'gold',sub:nightSub(),px:fz(21),icon:icMoon});
  var y25=y2+bh+gap;
  btn('pz',bx,y25,bw,bh,'Головоломки',function(){go('pbook')},{st:'dark',sub:pzSub(),px:fz(21),icon:icPuz});
  var y3=y25+bh+gap,hw=(bw-gap)/2,dk=dayNum(),done=sv.dayKey===dk;
  btn('daily',bx,y3,hw,sm,'Дозор дня',function(){go('run',{mode:'endless',night:1,daily:true,seed:dk*7919+13})},{st:'dark',sub:sv.streak>0&&sv.lastDay>=dk-1?'Серия '+sv.streak+' дн.':done?'Лучший: '+sv.dayBest:'Новый сегодня',px:fz(15)});
  btn('camp',bx+hw+gap,y3,hw,sm,'Лагерь',function(){go('camp')},{st:'dark',sub:nrm(sv.fire)+' светл.',px:fz(16)});
  if(canBuyAny())dot(bx+bw-6,y3+6);
  var r=Math.max(22,fz(10));circBtn('set',W-SAFE.r-14-r,SAFE.t+10+r,r,function(){go('settings')},icGear);circBtn('book',W-SAFE.r-14-r*3.3,SAFE.t+10+r,r,function(){go('book')},icBook,{ir:.62});
  if(sv.cmp>0||chainDone())circBtn('stages',W-SAFE.r-14-r*5.6,SAFE.t+10+r,r,function(){go('map')},icFlagMap,{ir:.6});
  fireCounter(SAFE.l+14,SAFE.t+10+r-fz(18)*.95,'l');
  txt('v7',W/2,H-SAFE.b-3,12,'rgba(255,255,255,.3)',{al:'center',fam:FU,w:600})}};
function icPuz(g,x,y,r){g.save();g.translate(x,y);g.fillStyle='#9fd0ff';rr(-r*.85,-r*.85,r*.82,r*.82,r*.15);g.fill();g.fillStyle='#ffe27a';rr(r*.03,-r*.85,r*.82,r*.82,r*.15);g.fill();g.fillStyle='#ff9ab8';rr(-r*.85,r*.03,r*.82,r*.82,r*.15);g.fill();g.fillStyle='#9cf0a8';rr(r*.03,r*.03,r*.82,r*.82,r*.15);g.fill();g.restore()}
function icFlagMap(g,x,y,r){g.save();g.translate(x,y);g.strokeStyle='#fff';g.lineWidth=r*.2;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(-r*.6,r*.9);g.lineTo(-r*.6,-r*.9);g.stroke();g.fillStyle='#ffe27a';g.beginPath();g.moveTo(-r*.5,-r*.85);g.lineTo(r*.8,-r*.4);g.lineTo(-r*.5,r*.05);g.closePath();g.fill();g.restore()}
SC.hub=SC.title;
/* ---- карта Сказки: 5 земель × 3 этапа ---- */
var MP=null;
function mapRows(){var ch=fz(34)+Math.max(fz(88),92)+10;return ch}
SC.map={
 enter:function(){var c=nextStage();MP={sel:c,scroll:-1,max:0,drag:null,y0:0,s0:0,moved:0};music('m_menu');ambient('water')},
 resize:function(){if(MP)MP.scroll=-1},
 draw:function(g){var t=sceneT,port=isPort(),sel=MP.sel,sL=(sel/3)|0,P=PAL[sL],wy=Math.round(H*.4),bg=stageBG(sL,wy);
  drawBG(g,bg,t*.1,t,U);drawWater(g,bg,P,W,H,wy,t*.1,U,t);waterFade(g,P,W,H,wy);g.fillStyle='rgba(6,10,24,.58)';g.fillRect(0,0,W,H);
  var hb=topBar('Этапы Сказки',function(){go('title')},true);
  var pw=port?Math.min(W-24,540):Math.min(W*.42,400),pnX=port?(W-pw)/2:W-SAFE.r-12-pw,L0=port?(W-pw)/2:SAFE.l+12,L1=port?L0+pw:pnX-14,lw=L1-L0;
  /* части Фонаря */
  var have=haveParts(),stripH=fz(34);
  {var bgd=g.createLinearGradient(0,hb,0,hb+stripH+10);bgd.addColorStop(0,'rgba(6,10,24,.8)');bgd.addColorStop(.75,'rgba(6,10,24,.7)');bgd.addColorStop(1,'rgba(6,10,24,0)');g.fillStyle=bgd;g.fillRect(L0-8,hb,lw+16,stripH+10)}
  {txt('Части Фонаря',L0,hb+fz(26),fz(14),'#ffe27a',{fam:FU,w:800});for(var q=0;q<5;q++){var qx=L1-fz(20)-(4-q)*fz(34),qy=hb+fz(20);g.beginPath();g.arc(qx,qy,fz(12),0,TAU);g.fillStyle=have[q]?'rgba(255,226,122,.95)':'rgba(255,255,255,.12)';g.fill();g.lineWidth=2;g.strokeStyle=have[q]?'#a56000':'rgba(255,255,255,.35)';g.stroke();txt(have[q]?'✓':ROM[q],qx,qy+fz(5),fz(12),have[q]?'#5a3200':'#cfe0ff',{al:'center',fam:FU,w:800})}}
  var pnH=port?Math.min(H*.37,fz(268)+16):H-SAFE.b-12-(hb+8),pnY=port?H-SAFE.b-12-pnH:hb+8;
  var ly0=hb+stripH+6,ly1=port?pnY-8:H-SAFE.b-8,blk=mapRows(),tot=5*blk+10;
  if(MP.scroll<0){MP.scroll=clamp(sL*blk-(ly1-ly0)/2+blk/2,0,Math.max(0,tot-(ly1-ly0)))}
  MP.max=Math.max(0,tot-(ly1-ly0));MP.scroll=clamp(MP.scroll,0,MP.max);
  g.save();g.beginPath();g.rect(L0-6,ly0,lw+12,ly1-ly0);g.clip();
  var rad=Math.max(24,Math.min(fz(26),(lw-20)/3/2.5));
  for(var L=0;L<5;L++){var y=ly0-MP.scroll+L*blk,lockedL=!stageOpen(L*3);
   if(y+blk<ly0-4||y>ly1+4)continue;
   var q2=PAL[L];
   /* заголовок земли */
   txt(ROM[L]+'  '+q2.n,L0+4,y+fz(22),fz(17),lockedL?'rgba(255,255,255,.5)':'#ffe27a',{fam:FU,w:800});
   var pr=PARTN[L];setFont(fz(13),700,FU);var pw2=g.measureText(pr).width+fz(26);
   rr(L1-pw2-2,y+fz(5),pw2,fz(24),fz(12));g.fillStyle=have[L]?'rgba(255,226,122,.92)':'rgba(255,255,255,.1)';g.fill();txt((have[L]?'✓ ':'')+pr,L1-pw2/2-2,y+fz(22),fz(13),have[L]?'#5a3200':'rgba(255,255,255,.65)',{al:'center',fam:FU,w:700});
   /* тропа */
   var yy=y+fz(34)+rad+4,xs=[];for(var k=0;k<3;k++)xs.push(L0+lw*(.18+k*.32));
   g.save();g.lineCap='round';g.strokeStyle='rgba(255,236,170,.4)';g.lineWidth=4;g.setLineDash([2,10]);g.beginPath();g.moveTo(xs[0],yy);g.lineTo(xs[2],yy);g.stroke();g.setLineDash([]);g.restore();
   for(k=0;k<3;k++){var c=L*3+k,locked=!stageOpen(c),done=sv.cs[c]>=0,isSel=c===sel,boss=k===2,x=xs[k],r2=rad*(boss?1.12:1),sc2=isSel?1.1+Math.sin(t*3)*.02:1;
    g.save();g.translate(x,yy);g.scale(sc2,sc2);
    glow(g,0,0,r2*2.1,done?'#ffe27a':isSel?'#ffffff':'#8aa0d8',isSel?.5:.2);
    g.beginPath();g.arc(0,0,r2,0,TAU);g.fillStyle=LG(g,0,-r2,0,r2,[0,q2.sky[0],.5,q2.sky[1],1,q2.sky[2]]);g.fill();
    g.save();g.beginPath();g.arc(0,0,r2-1,0,TAU);g.clip();g.fillStyle=q2.far;g.beginPath();g.ellipse(-r2*.3,r2*.55,r2*.9,r2*.5,0,0,TAU);g.fill();g.fillStyle=q2.near;g.beginPath();g.ellipse(r2*.4,r2*.75,r2,r2*.5,0,0,TAU);g.fill();g.fillStyle=rgba(q2.moon.g,.9);g.beginPath();g.arc(r2*.35,-r2*.35,r2*.2,0,TAU);g.fill();
    if(locked){g.fillStyle='rgba(6,10,24,.62)';g.fillRect(-r2,-r2,r2*2,r2*2)}g.restore();
    g.lineWidth=isSel?5:3.5;g.strokeStyle=done?'#ffd24a':isSel?'#fff':'rgba(255,255,255,.55)';g.beginPath();g.arc(0,0,r2,0,TAU);g.stroke();
    if(boss){g.lineWidth=2;g.strokeStyle=done?'#ffd24a':'rgba(255,214,120,.6)';g.beginPath();g.arc(0,0,r2+5,0,TAU);g.stroke()}
    if(locked)icLock(g,0,-r2*.08,r2*.55);else txt(''+(c+1),0,r2*.28,Math.round(r2*.8),'#fff',{al:'center',w:800,sh:'rgba(0,0,0,.7)'});
    g.restore();
    if(done)starsRow(x,yy+r2+fz(14),Math.max(7,rad*.24),sv.cs[c]);
    else if(!locked)txt(boss?'Босс':'Новый',x,yy+r2+fz(15),fz(12),boss?'#ff9a7a':'#9cf0a8',{al:'center',fam:FU,w:800});
    (function(c,locked,x,yy,r2){UI.hits.push({id:'n'+c,x:x-r2*1.15,y:Math.max(ly0,yy-r2*1.15),w:r2*2.3,h:Math.min(r2*2.3+fz(24),ly1-Math.max(ly0,yy-r2*1.15)),down:function(p){MP.drag=p.id;MP.y0=p.y;MP.s0=MP.scroll;MP.moved=0},fn:function(){if(MP.moved>12)return;if(locked){sfx('nope');toast('Сначала пройди предыдущий этап','#ffcf8a')}MP.sel=c}})})(c,locked,x,yy,r2)}}
  g.restore();
  /* панель этапа */
  var bh=Math.max(52,fz(24)*2),bh0=bh,c2=MP.sel,s2=CHS[c2],locked2=!stageOpen(c2),done2=sv.cs[c2]>=0,tr=TIERS[s2.tier];panel(pnX,pnY,pw,pnH);
  var ix=pnX+18,iy=pnY+fz(26);
  txt('ЭТАП '+(c2+1)+' ИЗ 15 · '+PAL[(c2/3)|0].n.toUpperCase(),ix,iy,fz(13),'#ffe27a',{fam:FU,w:800});
  if(done2)starsRow(pnX+pw-fz(46),iy-fz(4),fz(10),sv.cs[c2]);
  fitTxt(s2.name,ix,iy+fz(34),pw-36,fz(26),'#fff',{w:700});
  /* сложность + длина */
  var chipY=iy+fz(48),cw=fz(96);rr(ix,chipY,cw,fz(24),fz(12));g.fillStyle=TIERC[s2.tier];g.fill();txt(tr.name,ix+cw/2,chipY+fz(17),fz(13),'#10182a',{al:'center',fam:FU,w:800});
  txt('≈ '+stageTime(c2)+' мин',ix+cw+12,chipY+fz(17),fz(14),'#cfe0ff',{fam:FU,w:700});
  var yy2=chipY+fz(24)+fz(22);
  var h1=para('Цель: '+s2.goal,ix,yy2,pw-36,fz(15),'#fff',{fam:FU,w:600,lh:fz(15)*1.25}),h2=para('Новое — '+s2.new,ix,yy2+h1+fz(2),pw-36,fz(14),'#bfe0ff',{fam:FU,w:500,lh:fz(14)*1.25});
  if(yy2+h1+h2+fz(34)<pnY+pnH-bh0-18)para(tr.hint+'.',ix,yy2+h1+h2+fz(8),pw-36,fz(13),'rgba(220,232,255,.65)',{fam:FU,w:500,it:true,lh:fz(13)*1.25});
  btn('play',ix,pnY+pnH-bh-14,pw-36,bh,locked2?'Закрыто':done2?'Сыграть ещё раз':'В путь!',function(){if(locked2){sfx('nope');return}playStage(c2)},{st:locked2?'dark':'green',dis:locked2,px:fz(22)})},
 down:function(p){MP.drag=p.id;MP.y0=p.y;MP.s0=MP.scroll;MP.moved=0},
 move:function(p){if(MP.drag===p.id){MP.moved=Math.max(MP.moved,Math.abs(MP.y0-p.y));MP.scroll=clamp(MP.s0+(MP.y0-p.y),0,MP.max)}},
 up:function(p){if(MP.drag===p.id)MP.drag=null}};
/* ---- лагерь ---- */
var CP=null;
SC.camp={
 enter:function(a){CP={scroll:0,max:0,drag:null,flash:{},back:a&&a.back};music('m_camp');ambient('water')},
 draw:function(g){var t=sceneT,port=isPort(),pi=progressPI(),P=PAL[pi],u=stageU()*.85;
  var artH=port?H*.36:H*.9,wy=Math.round(port?H*.2:H*.4),bg=stageBG(pi,wy);
  g.save();drawBG(g,bg,t*.08,t,U);g.fillStyle=LG(g,0,wy,0,H,[0,'#2d4a2a',1,'#10200f']);g.fillRect(0,wy,W,H-wy);drawVillage(g,wy+4,sv.nt,t);
  var gy=port?H*.3:H*.7,lx=port?W*.5:W*.22,ax=port?1:1;
  g.fillStyle=LG(g,0,gy-u*.4,0,H,[0,'#35582f',1,'#14260f']);g.beginPath();g.moveTo(0,gy+u*.1);g.quadraticCurveTo(W*(port?.5:.22),gy-u*.45,port?W:W*.45,gy+u*.1);g.lineTo(port?W:W*.45,H);g.lineTo(0,H);g.closePath();g.fill();
  drawTent(g,port?W*.84:W*.4,gy-u*.1,u*1.1);drawFire(g,lx,gy+u*.28,u*.5,t);
  drawActor('larry',lx-u*1.5,gy+u*.1,u*.95,1,'smile',false,t);drawActor('krap',lx-u*.55,gy-u*.15,u*.92,1,'smile',false,t);drawActor('por',lx+u*1.6,gy+u*.14,u*.9,-1,null,false,t);
  g.restore();
  /* список улучшений */
  var lx0=port?10:W*.46,lw=port?W-20:W-lx0-10-SAFE.r,ly0=port?H*.36+8:SAFE.t+Math.max(46,fz(16)*2.5)+22,ly1=H-SAFE.b-6,ch=Math.max(fz(88)+6,98),gp=8;
  g.save();g.beginPath();g.rect(lx0-4,ly0,lw+8,ly1-ly0);g.clip();
  var tot=UPG.length*(ch+gp),visH=ly1-ly0;CP.max=Math.max(0,tot-visH+8);CP.scroll=clamp(CP.scroll,0,CP.max);
  for(var i=0;i<UPG.length;i++){var up=UPG[i],lv=sv.up[up.k],y=ly0+i*(ch+gp)-CP.scroll,mx=lv>=3,cost=mx?0:up.cost[lv],can=!mx&&sv.fire>=cost;
   if(y+ch<ly0-4||y>ly1)continue;
   var fl=CP.flash[up.k]||0;if(fl>0)CP.flash[up.k]=fl-.016;
   panel(lx0,y,lw,ch,{r:16,stroke:fl>0?'rgba(255,255,160,'+(.4+fl)+')':'rgba(255,214,120,.4)'});
   g.beginPath();g.arc(lx0+ch*.46,y+ch/2,ch*.32,0,TAU);g.fillStyle='rgba(255,255,255,.1)';g.fill();iconBox(g,up.k,lx0+ch*.46,y+ch/2,ch*.22);
   var bw2=Math.max(96,fz(88)),tx=lx0+ch*.92,tw=lw-ch*.92-bw2-18;
   fitTxt(up.n,tx,y+fz(22),tw,fz(18),'#ffe27a',{w:700});para(up.d(lv),tx,y+fz(22)+fz(19),tw,fz(14),'#dfe6f5',{w:500,lh:fz(14)*1.2});
   var bx2=lx0+lw-bw2-12,bh2=Math.min(ch-40,fz(52));
   for(var k=0;k<3;k++){g.beginPath();g.arc(bx2+bw2/2+(k-1)*17,y+ch-14,5.5,0,TAU);g.fillStyle=k<lv?'#ffd24a':'rgba(255,255,255,.18)';g.fill();g.lineWidth=1.5;g.strokeStyle='rgba(0,0,0,.4)';g.stroke()}
   if(y>=ly0-2&&y+ch<=ly1+2){(function(up,cost,can,mx){btn('buy'+up.k,bx2,y+10,bw2,bh2,mx?'Макс.':cost+'',function(){if(mx||!can){sfx('nope');if(!mx)toast('Не хватает '+(cost-sv.fire)+' светляков','#ffcf8a');return}sv.fire-=cost;sv.up[up.k]++;CP.flash[up.k]=.9;sfx('buy');save()},{st:mx?'dark':can?'gold':'dark',dis:mx,px:fz(19),icon:mx?null:icFire})})(up,cost,can,mx)}}
  g.restore();
  var gr=g.createLinearGradient(0,0,0,Math.max(60,SAFE.t+70));gr.addColorStop(0,'rgba(0,0,0,.5)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,W,SAFE.t+70);
  topBar('Лагерь',function(){if(CP.back)go(CP.back.n,CP.back.a);else go('title')},true);
  if(sv.nt>0){fitTxt('Окон горит: '+Math.min(14,sv.nt)+'. Каждая заря зажигает ещё одно.',port?W/2:lx0+4,port?H*.36-6:SAFE.t+Math.max(46,fz(16)*2.5)+16,lw-8,fz(14),'rgba(255,255,255,.85)',{al:port?'center':'left',fam:FU,w:600})}},
 down:function(p){CP.drag=p.id;CP.y0=p.y;CP.s0=CP.scroll},
 move:function(p){if(CP.drag===p.id&&!p.onUI)CP.scroll=clamp(CP.s0+(CP.y0-p.y),0,CP.max)},
 up:function(p){if(CP.drag===p.id)CP.drag=null}};
/* ---- итоги ночного дозора ---- */
var RS=null;
SC.result={
 enter:function(a){RS={a:a,t:0};music('m_menu');ambient(null);if(a.newBest)sfx('dawn')},
 draw:function(g){var a=RS.a,t=sceneT,port=isPort(),pi=progressPI(),P=PAL[pi],wy=Math.round(H*.34),bg=stageBG(pi,wy);
  drawBG(g,bg,t*.1,t,U);drawWater(g,bg,P,W,H,wy,t*.1,U,t);waterFade(g,P,W,H,wy);g.fillStyle='rgba(6,10,24,.62)';g.fillRect(0,0,W,H);
  var k=port?clamp((H-SAFE.t-SAFE.b)/820,.8,1):1;function F(px){return Math.max(15,Math.round(px*TS*k))}
  var lw=port?Math.min(W-32,420):W*.44,lx=port?(W-lw)/2:SAFE.l+W*.04,cx=lx+lw/2,rw=port?lw:W*.46-SAFE.r,rx=port?lx:W*.5,y=SAFE.t+(port?H*.05:F(24));
  txt(a.mode==='daily'?'ДОЗОР ДНЯ':'НОЧНОЙ ДОЗОР',cx,y,F(15),'#ffe27a',{al:'center',fam:FU,w:800});
  var big=port?F(84):F(52),nn=clamp(t*8,0,a.night)|0;txt(''+nn,cx,y+big*.95,big,'#fff',{al:'center',w:700,sh:'rgba(0,0,0,.6)'});y+=big*.95+F(30);txt(plural(a.night,'ночь','ночи','ночей')+' ты нёс свет',cx,y,F(19),'#cfe0ff',{al:'center',fam:FU,w:600});
  if(a.newBest){var pu=1+Math.sin(t*6)*.05;y+=F(34);g.save();g.translate(cx,y);g.scale(pu,pu);fitTxt('НОВЫЙ РЕКОРД!',0,0,lw,F(22),'#ffd24a',{al:'center',fam:FU,w:900,sh:'rgba(120,60,0,.8)'});g.restore()}
  var rows=[['Кувшинок пройдено',a.pads],['Парирований',a.parries||0],['Светляков',a.fire,1],['Рекорд',sv.nb+' '+plural(sv.nb,'ночь','ночи','ночей')]],rh=F(33);
  y+=F(18);panel(lx,y,lw,rows.length*rh+16,{r:16});
  for(var i=0;i<rows.length;i++){var r=rows[i],yy=y+rh*.85+i*rh;txt(r[0],lx+16,yy,F(17),'#dfe6f5',{fam:FU,w:600});if(r[2]){icFire(g,lx+lw-16-F(54),yy-F(6),F(11))}txt(r[2]?'+'+r[1]:''+r[1],lx+lw-16,yy,F(19),'#fff',{al:'right',fam:FU,w:800})}
  y+=rows.length*rh+16+12;
  var ny=port?y:SAFE.t+F(24),bh=Math.max(48,Math.round(fz(24)*2*k)),nbtn=port?bh*2+12:bh*2+12;
  if(a.mode==='daily'){txt('Серия: '+sv.streak+' '+plural(sv.streak,'день','дня','дней')+' подряд',port?cx:rx+rw/2,ny+F(16),F(17),'#ffe27a',{al:'center',fam:FU,w:700});ny+=F(32)}
  if(a.page){var ph=F(50)+para0(a.page.t,rw-36,F(15))+F(14);panel(rx,ny,rw,ph,{stroke:'rgba(255,226,122,.9)'});txt('Новая страница дневника Крапинки',rx+18,ny+F(26),F(15),'#ffe27a',{fam:FU,w:800});para(a.page.t,rx+18,ny+F(26)+F(24),rw-36,F(15),'#f3e4c0',{it:true,w:500});ny+=ph+10}
  else{var nb=null;for(var j=0;j<BOOK.length;j++)if(BOOK[j].n>sv.nb){nb=BOOK[j];break}var gl=nightGoal(),gi=gl?NIGHT_GOALS.indexOf(gl):-1,tip=gl?'Цель: «'+NG_N[gi]+'» — продержись '+gl+' '+plural(gl,'ночь','ночи','ночей')+(nb?'. Страница дневника — на '+nb.n+'-й':''):nb?'До новой страницы дневника — ещё '+(nb.n-sv.nb)+' '+plural(nb.n-sv.nb,'ночь','ночи','ночей'):TIPS[(sv.runs*3)%TIPS.length];para(tip,rx+rw/2,ny+F(16),rw,F(15),'#cfe0ff',{al:'center',fam:FU,w:600,lh:F(15)*1.3});ny+=F(48)}
  var by=H-SAFE.b-14-nbtn,bw=port?Math.min(W-40,380):rw,bx=port?(W-bw)/2:rx;
  btn('again',bx,by,bw,bh,'Ещё дозор',function(){go('run',a.mode==='daily'?{mode:'endless',night:1,daily:true,seed:dayNum()*7919+13}:{mode:'endless',night:1})},{st:'green',px:fz(21)});
  var w3=(bw-24)/3;btn('camp',bx,by+bh+12,w3,bh,'Лагерь',function(){go('camp')},{st:'gold',px:fz(15)});btn('shr',bx+w3+12,by+bh+12,w3,bh,'Похвастать',function(){shareText(nightShare(a),'Текст скопирован')},{st:'blue',px:fz(14)});btn('menu',bx+2*(w3+12),by+bh+12,w3,bh,'В меню',function(){go('title')},{st:'dark',px:fz(15)});
  if(canBuyAny())dot(bx+w3-4,by+bh+16)}};
var NG_N=['Бронзовый дозор','Серебряный дозор','Золотой дозор','Платиновый дозор','Мастер дозора'];
function nightShare(a){return (a.mode==='daily'?'Дозор дня':'Ночной дозор')+' в игре «Топ-Тоут»: я продержался '+a.night+' '+plural(a.night,'ночь','ночи','ночей')+' и прошёл '+a.pads+' кувшинок. Сможешь больше?'}
function para0(s,w,px){return wrapLines(s,w,px,{it:true}).length*px*1.32}
/* ---- дневник Крапинки ---- */
var BKS=null;
SC.book={
 enter:function(){BKS={scroll:0,max:0,drag:null};music('m_menu')},
 draw:function(g){var t=sceneT;g.fillStyle=LG(g,0,0,0,H,[0,'#2a1c12',1,'#140c08']);g.fillRect(0,0,W,H);
  var hb=topBar('Дневник Крапинки',function(){go('title')},false),pw=Math.min(W-24,520),px=(W-pw)/2,y0=hb+14,y1=H-SAFE.b-8;
  g.save();g.beginPath();g.rect(0,y0,W,y1-y0);g.clip();var y=y0-BKS.scroll,have=BOOK.filter(function(b){return sv.book.indexOf(b.n)>=0});
  var hh=para('Записано страниц: '+have.length+' из '+BOOK.length+'. Новые открываются в Ночном дозоре.',px,y+fz(16),pw,fz(15),'rgba(255,230,180,.75)',{fam:FU,w:600});y+=hh+10;
  for(var i=0;i<BOOK.length;i++){var b=BOOK[i],ok=sv.book.indexOf(b.n)>=0,h=ok?para0(b.t,pw-40,fz(17))+fz(52):fz(62);
   g.save();g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=10;rr(px,y,pw,h,14);g.fillStyle=ok?'#efe0bc':'rgba(60,44,30,.9)';g.fill();g.restore();g.lineWidth=2;g.strokeStyle=ok?'#b88a4a':'rgba(255,214,120,.2)';rr(px,y,pw,h,14);g.stroke();
   if(ok){txt('Ночь '+b.n,px+20,y+fz(28),fz(15),'#8a4a1a',{fam:FU,w:800});para(b.t,px+20,y+fz(28)+fz(24),pw-40,fz(17),'#3a2412',{it:true,w:500})}
   else{icLock(g,px+30,y+h/2-4,12);txt('Ночь '+b.n+' — страница запечатана',px+54,y+h/2+fz(6),fz(16),'rgba(255,230,180,.55)',{fam:FU,w:600})}
   y+=h+12}
  BKS.max=Math.max(0,y+BKS.scroll-y1+12);g.restore()},
 down:function(p){BKS.drag=p.id;BKS.y0=p.y;BKS.s0=BKS.scroll},move:function(p){if(BKS.drag===p.id)BKS.scroll=clamp(BKS.s0+(BKS.y0-p.y),0,BKS.max)},up:function(p){if(BKS.drag===p.id)BKS.drag=null}};
/* ---- настройки ---- */
var ST=null,SCH=[['Кнопки + весь экран','Зажми кнопку ПРЫЖОК слева или любое место экрана и отпусти. УДАР и ПОРОХ — отдельные кнопки.'],['Одно касание','Зажми — прыжок, быстрый тап — удар. Кнопок нет, экран чистый.'],['Для левши','Зеркально: ПРЫЖОК справа, УДАР слева.']];
SC.settings={
 enter:function(){ST={scroll:0,max:0,drag:null,conf:0}},
 draw:function(g){var t=sceneT;g.fillStyle=LG(g,0,0,0,H,[0,'#1a2444',1,'#0a1020']);g.fillRect(0,0,W,H);
  var hb=topBar('Настройки',function(){save();go(PRE==='run'?'title':'title')},false),pw=Math.min(W-24,520),px=(W-pw)/2,y0=hb+10,y1=H-SAFE.b-4;
  g.save();g.beginPath();g.rect(0,y0,W,y1-y0);g.clip();var y=y0-ST.scroll+6,s=sv.set,lh=fz(24);
  function head(s2){txt(s2,px+4,y+fz(18),fz(15),'#ffe27a',{fam:FU,w:800});y+=fz(30)}
  function sl(label,key,id){txt(label,px+4,y+fz(18),fz(17),'#fff',{fam:FU,w:600});txt(Math.round(s[key]*100)+'%',px+pw-4,y+fz(18),fz(15),'#ffe27a',{al:'right',fam:FU,w:700});y+=fz(26);slider(id,px+10,y,pw-20,s[key],function(v){s[key]=v;audioVol();if(id==='sv')ST.vd=1});y+=fz(46)}
  head('ЗВУК');sl('Музыка','mu','sm');sl('Звуки','fx','sf');sl('Голоса героев и рассказчика','vo','sv');
  {var bh1=Math.max(50,fz(22)*2),on1=!!s.nar;panel(px,y,pw,bh1,{r:14,stroke:'rgba(255,255,255,.2)'});txt('Рассказчик ведёт игру',px+16,y+bh1/2,fz(17),'#fff',{fam:FU,w:600,bl:'middle'});var tw1=58,tx1=px+pw-tw1-14,ty1=y+bh1/2-16;rr(tx1,ty1,tw1,32,16);g.fillStyle=on1?'#3fbf5a':'#4a5266';g.fill();g.beginPath();g.arc(on1?tx1+tw1-16:tx1+16,ty1+16,12,0,TAU);g.fillStyle='#fff';g.fill();UI.hits.push({id:'tnar',x:px,y:y,w:pw,h:bh1,fn:function(){s.nar=on1?0:1;if(!s.nar)voiceStop();save()}});y+=bh1+8}
  {var bh2=Math.max(62,fz(24)*2.5),ok=audioHold();btn('stest',px,y,pw,bh2,'Проверить звук',function(){soundTest()},{st:'blue',sub:ok?'Звук включён · должен прозвучать колокольчик и голос':'Звук ещё закрыт · нажми, чтобы включить',px:fz(17)});y+=bh2+10}
  {var bh4=Math.max(62,fz(24)*2.5);btn('studio',px,y,pw,bh4,'Студия голоса',function(){go('studio')},{st:'gold',sub:'прочитай реплики — игра заговорит твоим голосом',px:fz(17)});y+=bh4+10}
  head('ТЕКСТ');var seg=['Мелкий','Обычный','Крупный','Огромный'],sw=(pw-24)/4,bh=Math.max(46,fz(20)*2);
  for(var i=0;i<4;i++){(function(i){btn('ts'+i,px+i*(sw+8),y,sw,bh,seg[i],function(){s.ts=i;applySettings();save()},{st:s.ts===i?'gold':'dark',px:fz(16)})})(i)}y+=bh+10;
  y+=para('Так выглядит текст истории при выбранном размере.',px+4,y+fz(18),pw-8,fz(19),'#e8eefc',{w:500})+10;
  head('УПРАВЛЕНИЕ');for(i=0;i<3;i++){var nl=wrapLines(SCH[i][1],pw-64,fz(14),{fam:FU,w:500}).length,ch=Math.max(fz(70),84,fz(24)+fz(20)+nl*fz(14)*1.25+16),on=s.sc===i;(function(i){panel(px,y,pw,ch,{r:14,stroke:on?'rgba(255,226,122,.95)':'rgba(255,255,255,.2)',fill:on?'rgba(60,80,40,.9)':undefined});
   g.beginPath();g.arc(px+26,y+ch/2,10,0,TAU);g.lineWidth=2.5;g.strokeStyle=on?'#ffe27a':'#8a96b0';g.stroke();if(on){g.beginPath();g.arc(px+26,y+ch/2,5.5,0,TAU);g.fillStyle='#ffe27a';g.fill()}
   txt(SCH[i][0],px+50,y+fz(24),fz(18),'#fff',{fam:FU,w:700});para(SCH[i][1],px+50,y+fz(24)+fz(20),pw-64,fz(14),'#c8d4ee',{fam:FU,w:500,lh:fz(14)*1.25});UI.hits.push({id:'sc'+i,x:px,y:y,w:pw,h:ch,fn:function(){s.sc=i;save()}})})(i);y+=ch+8}
  head('ПРОЧЕЕ');function tg(label,key,id){var bh2=Math.max(50,fz(22)*2);panel(px,y,pw,bh2,{r:14,stroke:'rgba(255,255,255,.2)'});txt(label,px+16,y+bh2/2+fz(6),fz(17),'#fff',{fam:FU,w:600});var on=!!s[key],tw=58,tx=px+pw-tw-14,ty=y+bh2/2-16;rr(tx,ty,tw,32,16);g.fillStyle=on?'#3fbf5a':'#4a5266';g.fill();g.beginPath();g.arc(on?tx+tw-16:tx+16,ty+16,12,0,TAU);g.fillStyle='#fff';g.fill();UI.hits.push({id:id,x:px,y:y,w:pw,h:bh2,fn:function(){s[key]=on?0:1;save()}});y+=bh2+8}
  tg('Подсказки Крапинки','hint','th');tg('Вибрация','vib','tv');tg('Кино-свечение (мягкий блеск кадра)','film','tfilm');
  btn('nick',px,y+2,pw,Math.max(50,fz(22)*2),'Ник гонщика: '+myNick(),function(){nickReroll();toast('Новый ник: '+sv.nick,'#9cf0a8')},{st:'dark',sub:'Нажми, чтобы выбрать другой',px:fz(16)});y+=Math.max(50,fz(22)*2)+10;
  
  var bh3=Math.max(50,fz(22)*2);btn('fb',px,y+2,pw,bh3,'Отправить отзыв',function(){sendFeedback()},{st:'dark',sub:'Поделись впечатлением — что улучшить',px:fz(17)});y+=bh3+12;
  btn('reset',px,y+6,pw,bh3,ST.conf?'Точно стереть всё? Нажми ещё раз':'Стереть прогресс',function(){if(!ST.conf){ST.conf=1;setTimeout(function(){if(ST)ST.conf=0},3500)}else{try{localStorage.removeItem('sltv7')}catch(e){}sv=JSON.parse(JSON.stringify(SV0));applySettings();save();go('title')}},{st:ST.conf?'red':'ghost',px:fz(16)});y+=bh3+30;
  txt('Топ-Тоут · v8 · Сказка, Гонка, Дозор, Головоломки',W/2,y,fz(13),'rgba(255,255,255,.35)',{al:'center',fam:FU,w:600});y+=30;
  ST.max=Math.max(0,y+ST.scroll-y1);g.restore()},
 down:function(p){ST.drag=p.id;ST.y0=p.y;ST.s0=ST.scroll},move:function(p){if(p.h&&p.h.drag){p.h.drag(p.x);return}if(ST.drag===p.id&&!p.onUI)ST.scroll=clamp(ST.s0+(ST.y0-p.y),0,ST.max)},up:function(p){if(ST.drag===p.id)ST.drag=null;save();if(ST.vd){ST.vd=0;voicePlay('nar',TEST_TXT)}}};

/* ---- отзыв: сообщение + отчёт о прогрессе -> меню «Поделиться» (или буфер обмена) ---- */
function fbReport(msg){var cs=sv.cs.join(',')+' · глава сказки: '+(sv.cmp|0)+'/'+CHAIN.length+' · головоломок: '+pagesDone();return 'Отзыв: Топ-Тоут v8\n'+(msg||'(без текста)')+'\n\nЭтапы (звёзды): '+cs+' · лучший дозор: '+sv.nb+' ночей · реки: '+Object.keys(sv.race||{}).length+' · светляков: '+sv.firetot+' · забегов: '+sv.runs+'\nУправление: '+sv.set.sc+' · текст: '+sv.set.ts+'\nЭкран: '+W+'x'+H+' · '+(navigator.userAgent||'').slice(0,120)}
function sendFeedback(){
 if(document.getElementById('fbov'))return;
 var ov=document.createElement('div');ov.id='fbov';ov.style.cssText='position:fixed;inset:0;z-index:50;background:rgba(4,8,24,.82);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif';
 var bx=document.createElement('div');bx.style.cssText='width:100%;max-width:440px;background:#16224a;border:2px solid #ffd98a;border-radius:18px;padding:18px;color:#f3f6ff;box-shadow:0 10px 40px rgba(0,0,0,.6);-webkit-user-select:text;user-select:text';
 var h=document.createElement('div');h.textContent='Отзыв об игре';h.style.cssText='font:700 22px Lora,serif;color:#ffd98a;margin-bottom:6px';
 var d=document.createElement('div');d.textContent='Что понравилось, что не так, что добавить? Коротко, как другу.';d.style.cssText='font-size:16px;line-height:1.35;color:#cfe0ff;margin-bottom:10px';
 var ta=document.createElement('textarea');ta.id='fbta';ta.rows=5;ta.style.cssText='width:100%;box-sizing:border-box;font:16px/1.35 Inter,system-ui,sans-serif;padding:10px;border-radius:12px;border:2px solid #3a4a86;background:#0b1535;color:#fff;resize:none;-webkit-user-select:text;user-select:text';
 var st=document.createElement('div');st.style.cssText='min-height:20px;font-size:15px;color:#9cf0a8;margin:8px 0 2px';
 var row=document.createElement('div');row.style.cssText='display:flex;gap:10px;margin-top:8px';
 function mk(t,bg,fg){var b=document.createElement('button');b.textContent=t;b.style.cssText='flex:1;min-height:52px;font:800 17px Inter,system-ui,sans-serif;border:0;border-radius:14px;background:'+bg+';color:'+fg+';cursor:pointer';return b}
 var bs=mk('Отправить','#7ed957','#12300a'),bc=mk('Закрыть','#2b3a72','#fff'),sent=false;
 function close(){try{document.body.removeChild(ov)}catch(e){}}
 bc.onclick=close;
 bs.onclick=function(){var msg=ta.value.trim(),rep=fbReport(msg);
  try{var q=JSON.parse(localStorage.getItem('sltv3fb')||'[]');q.push({t:Date.now(),m:msg});localStorage.setItem('sltv3fb',JSON.stringify(q.slice(-20)))}catch(e){}
  function manual(){ta.value=rep;ta.rows=9;ta.focus();ta.select();st.style.color='#ffcf8a';st.textContent='Скопируй текст и отправь разработчику.'}
  if(navigator.share){navigator.share({title:'Отзыв: Топ-Тоут',text:rep}).then(function(){st.textContent='Спасибо!'}).catch(function(){manual()})}
  else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(rep).then(function(){st.textContent='Скопировано. Отправь это разработчику.'},manual)}
  else manual()};
 ov.addEventListener('pointerdown',function(e){e.stopPropagation()});ov.addEventListener('touchstart',function(e){e.stopPropagation()},{passive:true});
 row.appendChild(bs);row.appendChild(bc);bx.appendChild(h);bx.appendChild(d);bx.appendChild(ta);bx.appendChild(st);bx.appendChild(row);ov.appendChild(bx);document.body.appendChild(ov)}
