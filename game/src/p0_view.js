/* ===== p0: представление забега — камера, частицы, события симуляции → картинка и звук =====
   S — симуляция (чистая), V — всё, что видит и слышит игрок (камера, частицы, реплики). Симуляция о V не знает. */
var S=null,V=null;
function PADY(){return WY+U*.28}
function SX(x){return(x-V.cam)*U}
function SY(h){return PADY()-h*U}
function VIS(){return W/U}
function runPal(sim){if(sim.mode==='story')return CHS[sim.ch].land;if(sim.mode==='race')return(sim.cfg.river!=null?RIVERS[sim.cfg.river].pal:(sim.cfg.custom&&sim.cfg.custom.pal)||0);return[0,2,3,1][(sim.night-1)%4]}
function newView(sim){
 V={cam:-VIS()*.3,zoom:1,zoomT:1,punch:0,shake:0,flash:0,hs:0,acc:0,t:0,parts:[],txts:[],rip:[],bub:null,blq:[],blT:0,said:{},paused:false,bg:null,palI:runPal(sim),
  krap:{x:-1.2,y:2.6,flap:0,mood:1},hold:false,pid:-1,lastFx:0,vx:0,failUI:false,winGo:false,perkOpen:false,pk:null,banner:3.2,bossBanner:0,dark:0,aimT:0,lockT:0,
  tip:null,tipT:0,ghost:null,comboFlash:0,flowK:0,dawnT:0,toast:null,trail:[],shk:{x:0,y:0}};
 V.camT=V.cam;return V}
function ensureBG(){var pi=V.palI||0;if(!V.bg||V.bg.pi!==pi||V.bg.W!==W||V.bg.H!==H||V.bg.WY!==WY)V.bg=makeBG(pi,W,H,WY,dpr);return V.bg}

/* ---------- камера ---------- */
function camUpdate(dt){var F=S.F,vis=W/(UB*V.zoom),port=H>=W*1.05,tgt=F.x-vis*(port?.30:.27);
 var look=0;if(F.mode==='sit'&&F.hold&&F.stuck<=0)look=F.c*(port?1.5:2.2);else if(F.mode==='air')look=.5+F.st*.3;else if(F.mode==='dash')look=1.2;
 var lock=S.phase==='boss'||S.phase==='prize'||(S.phase==='win'&&S.mode==='story');
 if(lock)tgt=S.arenaX-vis/2;else tgt+=look;
 tgt=Math.max(tgt,-vis*.3);V.camT=tgt;V.cam+=(tgt-V.cam)*(1-Math.exp(-dt*(F.mode==='dash'?9:lock?3:5.2)));
 /* масштаб: арена босса целиком; лёгкий отъезд на заряде; хлопок на идеальном прыжке */
 var zt=1;if(S.phase==='boss'||S.phase==='prize'){var need=11.6,have=W/UB;zt=Math.min(1,have/need)}
 else if(F.mode==='sit'&&F.hold)zt=1-.05*ease(F.c);else if(F.mode==='dash')zt=.94;
 V.zoomT=zt;V.zoom+=(V.zoomT-V.zoom)*(1-Math.exp(-dt*4));V.punch=Math.max(0,V.punch-dt*3.2);
 U=UB*(V.zoom+V.punch*.035)}

/* ---------- частицы, всплывающий текст ---------- */
function addTxt(x,y,s,c,big,life){var k,i,moved;
 /* надписи не налезают друг на друга: если рядом уже висит свежая — поднимаем новую выше */
 for(k=0;k<5;k++){moved=false;for(i=0;i<V.txts.length;i++){var q=V.txts[i];if(q.t<1&&Math.abs(q.x-x)<3.4&&Math.abs(q.y-y)<.8){y=q.y+.8;moved=true}}if(!moved)break}
 V.txts.push({x:x,y:y,s:s,c:c||'#fff',t:0,big:big,life:life||1.2,rise:life?.12:.9});if(V.txts.length>7)V.txts.shift()}
function burst(x,y,n,col,sp,gr){for(var i=0;i<n;i++){var a=Math.random()*TAU,v=(sp||2)*(.4+Math.random());V.parts.push({k:'sp',x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v+1,t:0,life:.45+Math.random()*.5,c:col||'#fff',r:.05+Math.random()*.06,g:gr==null?3:gr})}}
function splashFx(x,n){for(var i=0;i<(n||14);i++){var a=-PI/2+(Math.random()-.5)*1.6,v=2.4+Math.random()*3;V.parts.push({k:'dr',x:x,y:0,vx:Math.cos(a)*v*.6,vy:-Math.sin(a)*v,t:0,life:.8,c:'#cfeeff',r:.05+Math.random()*.05})}
 V.parts.push({k:'ring',x:x,y:0,t:0,life:.9,c:'#dff6ff',s:1});V.parts.push({k:'ring',x:x,y:0,t:-.12,life:1,c:'#bfe4ff',s:1.4})}
function ringFx(x,col,s,delay){V.parts.push({k:'ring',x:x,y:0,t:-(delay||0),life:.7,c:col||'#dff6ff',s:s||1})}
function dustFx(x,n,dir){for(var i=0;i<n;i++){var v=1+Math.random()*2;V.parts.push({k:'dr',x:x+(Math.random()-.5)*.6,y:.05,vx:(dir||0)*v+(Math.random()-.5)*v,vy:1+Math.random()*1.8,t:0,life:.5,c:'#e6fff0',r:.04+Math.random()*.04})}}
function updateParts(dt){for(var i=V.parts.length-1;i>=0;i--){var p=V.parts[i];p.t+=dt;if(p.t>p.life){V.parts.splice(i,1);continue}
  if(p.k==='sp'||p.k==='dr'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=(p.k==='dr'?9:p.g==null?3:p.g)*dt;if(p.k==='dr'&&p.y<0)p.t=p.life}}
 for(i=V.txts.length-1;i>=0;i--){var q=V.txts[i];q.t+=dt;q.y+=dt*(q.rise==null?.9:q.rise);if(q.t>(q.life||1.2))V.txts.splice(i,1)}
 for(i=V.trail.length-1;i>=0;i--){V.trail[i].t+=dt;if(V.trail[i].t>.35)V.trail.splice(i,1)}}

/* ---------- реплики ---------- */
/* финал сказки: Крапинка заперта под стеклянным колпаком над ареной Императора, пока он не побеждён */
function krapCaged(){return S.mode==='story'&&S.cs&&S.cs.boss==='emperor'&&!V.krapFree}
function say(who,text,dur){var vd=voicePlay(who,text);V.bub={who:who,text:text,t:0,dur:Math.max(dur||3.4,vd>0?vd+.45:0)}}
/* ---- рассказчик ведёт игру: комментирует то, что происходит, но не болтает без умолку ---- */
var NARI={},NARP={perfect:.3,perfect3:.95,perfect6:1,perfect10:1,edge:.4,splash:.6,splash3:1,hurt:.4,hurtlast:.95,kill:.2,parry:.5,lamp:.45,dash:.5,dashEnd:.35,carrot:.55,petal:.5,fail:1,respawn:.5,bossHit:.28,bossParry:.5,dawn:1,night:.85,night1:1,perk:.5,raceStart:.9,raceGold:1,raceSilver:1,raceBronze:1,raceNone:1,raceBest:1,star1:1,star2:1,star3:1,title:1,nightEnd:1};
function narPick(kind){var a=NARB[kind];if(!a||!a.length)return null;var o=NARI[kind];if(!o||!o.q.length){var q=[],i;for(i=0;i<a.length;i++)q.push(i);for(i=q.length-1;i>0;i--){var j=(Math.random()*(i+1))|0,tq=q[i];q[i]=q[j];q[j]=tq}if(o&&q.length>1&&q[q.length-1]===o.last){q.unshift(q.pop())}o=NARI[kind]={q:q,last:-1}}
 var k=o.q.pop();o.last=k;return a[k]}
function narSay(kind,force){if(!sv.set.nar||!S||!V)return false;
 if(!force){if(V.bub||V.blq.length||voiceBusy())return false;if(V.t-(V.narT||-99)<9)return false;if(Math.random()>(NARP[kind]==null?.4:NARP[kind]))return false}
 var tx=narPick(kind);if(!tx)return false;if(!DEBUG&&!(audioHold()&&voiceHas('nar',tx)))return false;
 V.narT=V.t;say('nar',tx,3.6);return true}
var BARKT={};
function bark(kind,gap){var t=V.t;if(t-(BARKT[kind]||-99)<(gap||12)||V.bub)return;BARKT[kind]=t;var a=BARKS[kind];if(!a)return;var b=a[(Math.random()*a.length)|0];say(b[0],b[1],2.4)}
function viewTick(dt){V.t+=dt;if(V.shake>0)V.shake=Math.max(0,V.shake-dt);if(V.flash>0)V.flash=Math.max(0,V.flash-dt);if(V.comboFlash>0)V.comboFlash-=dt;if(V.penFlash>0)V.penFlash-=dt;
 if(V.blq.length&&!V.bub){V.blT-=dt;if(V.blT<=0){var bl=V.blq.shift();say(bl[0],bl[1],3.6);V.blT=.5}}
 if(V.bub){V.bub.t+=dt;if(V.bub.t>V.bub.dur)V.bub=null}
 if(V.banner>0)V.banner-=dt;if(V.bossBanner>0)V.bossBanner-=dt;if(V.tipT>0)V.tipT-=dt;
 var F=S.F,fl=(S.combo>=4)?1:0;V.flowK+=(fl-V.flowK)*Math.min(1,dt*3);
 V.vx=(F.x-V.lastFx)/Math.max(dt,.001);V.lastFx=F.x;
 /* первая встреча с новым бойцом: подсказка над головой */
 if(S.mode!=='race')for(var ei=0;ei<S.en.length;ei++){var en=S.en[ei];if(NEWEN[en.k]&&en.act&&!en.dead&&!SEEN_EN[en.k]&&Math.abs(en.x-S.F.x)<9&&en.y<6&&!V.txts.some(function(q){return q.life>2})){SEEN_EN[en.k]=1;addTxt(Math.max(S.F.x+2,en.x-1),Math.min(en.y+1.1,5.6),NEWTIP[en.k],'#fff0b0',0,3.2)}}
 /* кувшинки: пружина проседания и затухание свечения */
 for(var i=0;i<S.pads.length;i++){var p=S.pads[i];if(p.x<V.cam-4||p.x>V.cam+W/U+4)continue;
  var tg=(F.mode==='sit'&&F.pi===i)?.10+F.sq*.22:0;p.dv+=((tg-p.dip)*170-p.dv*13)*dt;p.dip+=p.dv*dt;
  if(p.lit>0&&!p.lampOn&&S.mode!=='story')p.lit=Math.max(0,p.lit-dt*.22)}
 /* Порох скачет: каждый раз, когда конь переходит на следующую кувшинку, — касание копыт: круги по воде, брызги, лист проседает */
 if(S.dash){var hk=hopSeg();if(hk>=0&&V.hopK!=null&&hk!==V.hopK){var lp=S.pads[hk];lp.dv+=4.2;ringFx(lp.x,'#dff6ff',.9);ringFx(lp.x,'#fff6c0',1.3,.07);splashFx(lp.x,5);dustFx(lp.x,4,1);sfx('hop');V.shake=Math.max(V.shake,.03)}V.hopK=hk}else V.hopK=null;
 /* Крапинка летит за героем */
 var K=V.krap,tx=F.x-.95+(F.mode==='dash'?-.5:0),ty=(F.mode==='sit'?F.y+2.75:F.y+3.0)+Math.sin(V.t*2.1)*.15;if(F.mode==='rescue'){tx=F.x;ty=F.y+2.7}
 K.x+=(tx-K.x)*(1-Math.exp(-dt*(F.mode==='rescue'?10:3.2)));K.y+=(ty-K.y)*(1-Math.exp(-dt*3.5));K.flap+=dt*38;
 if(krapCaged()){K.x=S.arenaX+4.4;K.y=2.05+Math.sin(V.t*1.7)*.1;K.mood=0}if(K.mood===3&&F.mode!=='rescue'&&V.t%3>.4)K.mood=1;
 if(F.mode==='air'&&V.t-(V.lastTr||0)>.03){V.lastTr=V.t;V.trail.push({x:F.x,y:F.y+.9,t:0})}}

var SEEN_EN={},NEWTIP={beetle:'ЖУК В БРОНЕ! Бей, когда катится',saw:'ПИЛА! Ударь — отобьёшь',mortar:'БОМБАРДИР! Уйди с красного круга',dropper:'ПАУЧОК! Бей, пока качается'};
/* ---------- события симуляции ---------- */
function drainEvents(){for(var i=0;i<S.ev.length;i++)handleEv(S.ev[i]);S.ev.length=0}
function padOf(j){return j!=null&&S.pads[j]?S.pads[j]:null}
function handleEv(e){var F=S.F;
 switch(e.t){
 case'start':break;
 case'jump':sfx('jump',e.a);ringFx(e.x,'#dff6ff',.8);dustFx(e.x,5,-1);break;
 case'land':{sfx('land');ghostMark(e.b);var p=padOf(e.b);if(p)p.dv+=3.2+F.lastC*2;dustFx(e.x,6,0);ringFx(e.x,'#dff6ff',.9);V.shake=Math.max(V.shake,.05);break}
 case'edge':addTxt(e.x,2.3,'ЕЛЕ-ЕЛЕ!','#ffcf8a');sfx('land');ghostMark(e.b);if(S.mode!=='race')narSay('edge');break;
 case'perfect':{var n=e.a;sfx('perfect',n);ghostMark(e.b);var p2=padOf(e.b);if(p2)p2.dv+=5;burst(e.x,.2,14+Math.min(n,6)*2,'#ffe27a',3.2);ringFx(e.x,'#ffe27a',1.1);ringFx(e.x,'#fff6c0',1.6,.08);V.punch=1;V.comboFlash=.5;
  addTxt(e.x,2.5,n>1?'ИДЕАЛЬНО ×'+n:'ИДЕАЛЬНО','#ffe27a',1);if(n===3||n===6||n===10){V.hs=.05}
  if(S.mode!=='race'){if(!narSay((n===3||n===6||n===10)?'perfect'+n:'perfect')&&n>=3)bark('perfect',16)}break}
 case'splash':sfx('splash');splashFx(e.x,16);V.shake=Math.max(V.shake,.22);vib(30);if(S.mode!=='race'){if(!narSay(S.falls>0&&S.falls%3===0?'splash3':'splash'))bark('splash',14)}break;
 case'penalty':addTxt(e.x,2.8,'+'+e.a+' с','#ff8a7a',1);sfx('nope');V.penFlash=1.2;break;
 case'rescue':if(S.mode==='race')break;{var rb=BARKS.rescue[(S.tick+S.falls)%BARKS.rescue.length];say(rb[0],rb[1],2.2)}V.krap.mood=3;break;
 case'freeRescue':toast(e.a?'Выпь подхватила!':'Ветерок Крапинки!','#9fe8ff');break;
 case'shieldUp':sfx('perk');addTxt(e.x,e.y,'+ЩИТ','#9fe8ff',1);burst(e.x,2,10,'#9fe8ff',2.5);break;
 case'parryHeal':sfx('perk');addTxt(e.x,e.y+1.4,'+♥ ЗВОН!','#ff9ab8',1);burst(e.x,e.y,12,'#ff9ab8',3);break;
 case'rescued':V.krap.mood=1;break;
 case'hurt':sfx('hit');V.shake=.45;V.flash=.3;V.hs=.06;burst(F.x,F.y+1,10,'#ff7a7a',3);vib(60);if(S.petals>0&&!narSay(S.petals===1?'hurtlast':'hurt'))bark('hurt',9);break;
 case'shield':sfx('parry');burst(F.x,F.y+1,14,'#9fe8ff',3);addTxt(F.x,F.y+2.2,'ЩИТ!','#9fe8ff');break;
 case'fail':sfx('fail');V.shake=.5;if(S.mode==='race')break;if(!narSay('fail',true)){var fb=BARKS.fail[0];say(fb[0],fb[1],2.4)}break;
 case'tele':sfx('tele');break;
 case'clang':sfx('parry');burst(e.x,e.y,8,'#e8eef8',3);addTxt(e.x,e.y+.8,'БРОНЯ!','#cfd8e6');break;
 case'sawBack':sfx('parry');V.hs=.08;V.shake=.2;burst(e.x,e.y,14,'#9fe8ff',4);addTxt(e.x,e.y+.9,'ПИЛА НАЗАД!','#9fe8ff',1);break;
 case'lob':sfx('zap');burst(e.x,e.y-.2,7,'#ffd04a',2.4);break;
 case'kill':sfx('kill');burst(e.x,e.y,10,'#ffe27a',3);if(!e.a){addTxt(e.x,e.y+.6,'ХРУМ!','#ffe27a');narSay('kill')}break;
 case'parry':sfx('parry');V.hs=.07;V.shake=.2;burst(e.x,e.y,12,'#9fe8ff',4);addTxt(e.x,e.y+.7,'ОТБИЛ!','#9fe8ff',1);narSay('parry');break;
 case'slash':sfx('slash');break;
 case'swing':burst(e.x,e.y,5,'#ffffff',2.2);break;
 case'bust':burst(e.x,e.y,8,'#ffffff',2);break;
 case'webbed':addTxt(F.x,F.y+2.2,'ПАУТИНА!','#ffffff');burst(F.x,F.y+1,10,'#ffffff',2);sfx('hit');break;
 case'fire':sfx('fire',e.a);burst(e.x,e.y,5,'#fff0a0',2);break;
 case'fire3':addTxt(e.x,e.y+.5,'+3','#fff0a0');sfx('perk');break;
 case'petal':addTxt(e.x,e.y+.5,'+♥','#ff9ab8',1);sfx('perk');narSay('petal');break;
 case'carrot':addTxt(e.x,e.y+.5,'МОРКОВКА! +Порох','#ffb25a');sfx('perk');narSay('carrot');break;
 case'lamp':sfx('bell');burst(e.x,.9,12,'#ffd27a',2.4);V.lampT=V.t;narSay('lamp');break;
 case'dashStart':sfx('snort');ringFx(e.x,'#dff6ff',1);dustFx(e.x,8,1);V.hopK=null;narSay('dash');break;
 case'dashEnd':ringFx(e.x,'#dff6ff',1.1);dustFx(e.x,10,-1);sfx('land');V.hopK=null;narSay('dashEnd');break;
 case'sunk':break;
 case'zap':sfx('zap');break;
 case'slam':sfx('hit');V.shake=.5;splashFx(e.x,10);break;
 case'bossStart':{var k=e.a;sfx('boom');music(k==='emperor'?'m_boss2':'m_boss');V.shake=.4;V.bossBanner=3.2;var bl=BOSSLINES[k];if(bl&&(S.mode==='story'||!sv.seen['bl_'+k])){V.blq=bl.slice();V.blT=1.2;if(S.mode!=='story')sv.seen['bl_'+k]=1}break}
 case'bossHit':sfx('hit');sfx('kill');V.hs=.1;V.shake=.35;burst(e.x,e.y,16,'#ffe27a',4);addTxt(e.x,e.y+1.2,'-'+e.a,'#ffe27a',1);narSay('bossHit');break;
 case'bossParry':addTxt(e.x,e.y+1.4,'ПАРИРОВАНО!','#9fe8ff',1);sfx('parry');V.hs=.12;burst(e.x,e.y,18,'#9fe8ff',5);narSay('bossParry');break;
 case'bossBlock':sfx('parry');burst(e.x,e.y,6,'#ffffff',2);addTxt(e.x,e.y+1.2,'Бдит!','#ffffff');break;
 case'bossPhase':{var L2=BOSSPH[e.a];if(L2)say(e.a==='emperor'?'sher':e.a,L2[e.b-2]||L2[0],3);break}
 case'bossDie':sfx('boom');V.shake=.8;V.flash=.8;break;
 case'bossDown':{music(runMusic());V.flash=.6;if(krapCaged()){V.krapFree=true;var Kk=V.krap;burst(Kk.x,Kk.y,40,'#dff6ff',5);burst(Kk.x,Kk.y,18,'#ffe27a',3.5);ringFx(Kk.x,'#ffe27a',1.4);sfx('bell');V.shake=Math.max(V.shake,.25)}if(S.mode==='story'){var bo=BOSSOUT[e.a];if(bo){V.blq=bo.slice();V.blT=.9}else{var bd=BARKS.bossdown[0];say(bd[0],bd[1],2.6)}}break}
 case'wave':{var wb=BARKS.wave[e.a-1]||BARKS.wave[0];say(wb[0],wb[1],2.2);break}
 case'win':sfx('win');V.flash=1;vib(80);break;
 case'finish':sfx('win');V.flash=.7;V.shake=.2;vib(80);break;
 case'dawn':sfx('dawn');V.flash=1;V.shake=.3;addTxt(F.x,3.2,'ЗАРЯ!','#ffe27a',1);save();narSay('dawn',true);break;
 case'night':V.banner=3;narSay(S.night===1?'night1':'night');break;
 case'respawn':{V.cam=F.x-VIS()*.27;V.krap.mood=1;var rp=BARKS.respawn[0];say(rp[0],rp[1],2.6);break}
 case'txt':addTxt(e.x,e.y,e.a,e.b);break;
 case'cue':if(sv.set.hint&&S.mode==='story'){var cs=STORY.ch[S.ch];if(cs&&cs.cues)for(var i=0;i<cs.cues.length;i++){var c=cs.cues[i];if(V.said[i])continue;if(e.a>=c.at){V.said[i]=1;say(c.w,c.t,c.d||3.6);break}}}break}}
