/* ===== s2: симуляция забега =====
   Детерминированная: состояние = f(зерно, список нажатий). Здесь нет ни Math.random, ни обращений к экрану, звуку и камере.
   Всё, что игрок должен увидеть или услышать, выходит наружу событиями S.ev (их забирает сцена). Поэтому:
   • один и тот же код крутится и в игре, и в боте-тестере, и в «призраке», и при проверке рекордов;
   • запись забега — это всего несколько десятков чисел. */
var INP={down:1,up:2,cancel:3,strike:4,dash:5},INPN=['','down','up','cancel','strike','dash'];
var SINK_RATE=.62,SINK_RISE=.45,SINK_LAND=.8;                  /* тонущая кувшинка: за сколько тонет под героем, как всплывает, до какой глубины на неё ещё можно прыгнуть */
var DM={perfect:6,combo:2,fire:1.4,kill:8,parry:18,carrot:35};      /* наполнение шкалы Пороха */
function ev(S,t,x,y,a,b){if(S.ev.length<96)S.ev.push({t:t,x:x,y:y,a:a,b:b})}
function newFrog(){return{x:0,y:0,mode:'sit',pi:0,s:0,T:.5,D:2,H:1.5,x0:0,c:0,hold:false,holdT:0,pre:0,buf:null,sq:0,st:0,tilt:0,
 atk:0,atkHit:false,hurt:0,inv:0,stuck:0,slide:0,tongue:null,lastC:0,fs:0,rs:0,rx0:0,tx:0,lastX:0}}

/* cfg: {mode:'story'|'race'|'endless', seed, ch|river|custom, night, up, perks, carry, noFail} */
function newSim(cfg){
 var mode=cfg.mode,S={cfg:cfg,mode:mode,seed:cfg.seed|0,tick:0,t:0,ev:[],q:[],rec:[],pads:[],ents:[],en:[],proj:[],boss:null,F:newFrog(),
  phase:'play',phT:0,started:false,clock:0,pen:0,finishT:0,
  petals:3,maxP:3,shield:0,score:0,combo:0,bestCombo:0,perfects:0,landings:0,kills:0,parries:0,fire:0,fireN:0,fireTot:0,falls:0,hits:0,
  dm:0,dash:null,wind:0,windMax:0,windT:0,perks:{},up:cfg.up||UP0,check:0,rescueUsed:false,noHurt:true,padsDone:0,endPad:0,arenaX:0,arenaStart:0,
  night:cfg.night||1,ch:cfg.ch||0,cs:null,tier:TIERS[0],lastFireT:-9,fireStreak:0,prize:null,bossDone:false,fireNight:0,won:false,noFail:!!cfg.noFail};
 S.rnd=rng(S.seed^0x5bd1e995);
 if(cfg.perks){for(var k in cfg.perks)S.perks[k]=cfg.perks[k]}
 if(cfg.carry){S.perks=cfg.carry.perks||{};S.shield=cfg.carry.shield||0;S.petals=cfg.carry.petals;S.maxP=cfg.carry.maxP;S.score=cfg.carry.score||0;S.fire=cfg.carry.fire||0;S.kills=cfg.carry.kills||0;S.parries=cfg.carry.parries||0;S.perfects=cfg.carry.perfects||0;S.hits=cfg.carry.hits||0}
 else{S.maxP=maxPetals(S);S.petals=S.maxP}
 if(mode==='story')buildStory(S);else if(mode==='race')buildRace(S);else buildNight(S,true);
 return S}
function hasPerk(S,k){return S.perks[k]>0}
/* лагерные умения: щит Крапинки (g), звонкий клинок (r), крылья Выпи (w), трофейный мешок (t) */
function shieldStart(S){var l=S.up.g|0;return l>=3?2:l>=1?1:0}
function parryBonus(S,x,y){var l=S.up.r|0;if(l<1||S.mode==='race')return;S.parryN=(S.parryN||0)+1;var need=l===1?6:l===2?4:3;
 if(S.parryN>=need){S.parryN=0;if(S.petals<S.maxP){S.petals++;ev(S,'parryHeal',x,y)}else{S.fire+=2;ev(S,'fire3',x,y)}}}
function maxPetals(S){return 3+S.up.h+(S.perks.maxhp||0)+(S.cfg.assist||0)}
function reachX(S){return 2.4*(1+S.up.s*.08+(hasPerk(S,'sweep')?.4:0))}
function grabR(S){return .95*(1+S.up.m*.28+(hasPerk(S,'magnet')?.6:0))}
function tolMul(S){return 1+S.up.e*.08+(hasPerk(S,'lens')?.25:0)}
function slowMul(S){return hasPerk(S,'echo')?.8:1}
function padTol(S,p){return(p.r*(p.k==='log'?1.0:1)+S.tier.grace)*tolMul(S)}
function chargeTime(S){return JUMP.chargeT*(S.cs&&S.cs.chg||1)}

/* ---------- сборка трасс ---------- */
function adopt(S,tr){S.pads=tr.pads;S.ents=tr.ents;S.en=tr.en;S.endPad=S.pads.length-1;S.fireTot=0;for(var i=0;i<S.ents.length;i++)if(S.ents[i].k==='fire')S.fireTot++}
function buildStory(S){var cs=CHS[S.ch];S.cs=cs;S.land=cs.land;S.tier=TIERS[cs.tier];S.windMax=cs.wind;
 adopt(S,genTrack({seed:S.seed,tier:cs.tier,n:cs.n,d0:cs.d0,d1:cs.d1,kinds:cs.kinds,en:cs.en,en2:cs.en2,fire:cs.fire,lamps:cs.lamps,enFrom:cs.enFrom,dock:!cs.boss}));
 S.shield=Math.max(S.shield,shieldStart(S));
 if(cs.boss)addArena(S,cs.boss);else{S.arenaStart=S.pads.length;S.arenaX=S.pads[S.pads.length-1].x}
 S.pads[0].lit=1;S.F.pi=0;S.F.x=0}
function buildRace(S){var c=S.cfg.river!=null?RIVERS[S.cfg.river]:S.cfg.custom;S.cs={wind:c.wind,race:true};S.tier=TIERS[c.tier];S.windMax=c.wind||0;S.noFail=true;
 adopt(S,genTrack({seed:c.seed,tier:c.tier,n:c.n,d0:c.d0,d1:c.d1,kinds:c.kinds,en:c.en,fire:c.fire,enFrom:c.enFrom,dock:true}));
 S.pads[0].lit=1;S.F.pi=0;S.F.x=0;S.raceN=c.n}
function buildNight(S,first){var n=S.night,c=nightCfg(n);S.tier=TIERS[c.tier];S.cs={boss:c.boss,wind:c.wind,lamps:c.lamps,chg:clamp(1-n*.01,.8,1)};S.windMax=c.wind;
 var fire=c.fire+(hasPerk(S,'lucky')?.2:0);
 var tr=genTrack({seed:(S.seed+n*7919)|0,tier:c.tier,n:c.n,d0:c.d0,d1:c.d1,kinds:c.kinds,en:c.en,en2:c.en2,fire:fire,lamps:c.lamps,enFrom:c.enFrom}),off=first?0:S.F.x;
 tr.pads.forEach(function(p){p.x+=off;p.x0=p.x});tr.ents.forEach(function(e){e.x+=off});tr.en.forEach(function(e){e.x+=off;e.home+=off});
 S.proj=[];adopt(S,tr);S.padsDone=0;S.dawn=0;S.rescueUsed=false;S.bossDone=false;S.boss=null;S.prize=null;S.phase='play';S.phT=0;S.check=0;S.fireNight=0;
 S.shield=Math.max(S.shield,shieldStart(S));S.rescueN=0;
 addArena(S,c.boss);S.pads[0].lit=1;S.F.pi=0;if(first)S.F.x=0;S.F.mode='sit';S.F.y=0;
 if(!first){S.petals=Math.min(S.maxP,S.petals+1)}
 ev(S,'night',S.F.x,0,n)}
function addArena(S,boss){var last=S.pads[S.pads.length-1],ar=genArena(last.x,boss&&boss!=='wave'?3:1,S.rnd);
 if(boss==='wave'){ar[0].k='dock';ar[0].r=2.1}
 S.arenaStart=S.pads.length;S.pads=S.pads.concat(ar);S.arenaX=ar[ar.length>1?1:0].x}

/* ---------- ввод ---------- */
function simInput(S,type){S.q.push(type)}
function applyInput(S,ty){var F=S.F,ph=S.phase;
 if(ph==='fail'||ph==='win'||ph==='perk'||ph==='dawn'||ph==='done')return;
 if(ty==='down'){if(F.hold)return;F.hold=true;F.holdT=0;F.pre=0;if(!S.started){S.started=true;ev(S,'start',F.x,0)}}
 else if(ty==='up'){if(!F.hold)return;F.hold=false;
  if(F.mode==='sit'&&F.stuck<=0){doJump(S,Math.max(JUMP.minC,F.c))}
  else if(F.mode==='air'){var left=F.T*(1-F.s);if(left<=BUF_T)F.buf=Math.max(JUMP.minC,F.pre)}
  F.c=0;F.pre=0}
 else if(ty==='cancel'){F.hold=false;F.c=0;F.pre=0}
 else if(ty==='strike')strike(S);
 else if(ty==='dash')useDash(S)}

/* ---------- прыжок ---------- */
function jumpParams(S,c,wind){var T=lerp(JUMP.Tmin,JUMP.Tmax,c),D=JUMP.Dmin+(JUMP.Dmax-JUMP.Dmin)*c;
 return{D:D+(wind||0)*T*.45,T:T,H:lerp(JUMP.Hmin,JUMP.Hmax,c),base:D}}
function doJump(S,c){var F=S.F;if(F.mode!=='sit'||F.stuck>0)return;var j=jumpParams(S,c,S.wind);
 F.mode='air';F.s=0;F.T=j.T;F.H=j.H;F.D=j.D;F.x0=F.x;F.sq=0;F.st=0;F.lastC=c;F.c=0;ev(S,'jump',F.x,0,c)}
function findPad(S,x){var best=-1,bd=1e9;for(var i=0;i<S.pads.length;i++){var p=S.pads[i];if(p.sink>=SINK_LAND)continue;var d=Math.abs(x-p.x);if(d<=padTol(S,p)&&d<bd){bd=d;best=i}}return best}
function predictLanding(S,c){var j=jumpParams(S,c,S.wind),x1=S.F.x+j.D,pi=findPad(S,x1),good=false,perfect=false;
 if(pi>=0){var p=S.pads[pi],d=Math.abs(x1-p.x);good=d<=p.r*tolMul(S);perfect=d<=p.r*S.tier.perfect*(p.k==='move'?1.2:1)}
 return{x1:x1,pi:pi,good:good,perfect:perfect,j:j}}
function land(S,j){var F=S.F,p=S.pads[j],d=Math.abs(F.x-p.x),T=S.tier,edge=d>p.r*tolMul(S),perfect=!edge&&d<=p.r*T.perfect*(p.k==='move'?1.2:1);
 F.mode='sit';F.y=0;F.pi=j;F.sq=.5;F.st=0;F.tilt=0;p.lit=1;S.landings++;
 if(p.i>=0)S.padsDone=Math.max(S.padsDone,p.i);
 /* подхват: кувшинка слегка подтягивает героя к центру (сила — по уровню сложности) */
 if(edge){F.x=p.x+(F.x<p.x?-1:1)*p.r*.8;S.combo=0;ev(S,'edge',F.x,0,d,j)}
 else if(p.k!=='ice')F.x+=(p.x-F.x)*(perfect?.6:T.assist);
 if(perfect){S.combo++;S.perfects++;S.bestCombo=Math.max(S.bestCombo,S.combo);
  var b=S.combo>=2?Math.min(S.combo,5):0;if(b){S.fire+=b;S.dm=Math.min(100,S.dm+DM.combo*b)}
  S.dm=Math.min(100,S.dm+(DM.perfect+(hasPerk(S,'dash')?2.5:0))*(1+S.up.p*.15));
  F.x+=(p.x-F.x)*.4;ev(S,'perfect',F.x,0,S.combo,j)}
 else if(!edge){S.combo=0;ev(S,'land',F.x,0,d,j)}
 else ev(S,'land',F.x,0,d,j);
 if(p.k==='ice'&&F.lastC>.5)F.slide=.8;
 if(p.lamp&&!p.lampOn)lampLight(S,p);
 var sc=S.combo>0?Math.min(S.combo,8):0;if(S.mode!=='race'&&p.i>0)S.score+=Math.round(10*(1+.25*sc));
 if(S.mode==='race'&&p.finish&&S.phase==='play'){raceFinish(S);return}
 if(S.mode==='story'&&p.finish&&S.phase==='play'){S.phase='win';S.phT=0;S.won=true;ev(S,'win',F.x,0);return}
 if(j===S.endPad&&S.phase==='play'&&S.mode!=='race')S.phase='lead';
 if(p.arena&&(S.phase==='play'||S.phase==='lead')&&!S.boss&&!S.bossDone)bossStart(S);
 if(S.mode==='story')ev(S,'cue',F.x,0,F.pi);
 /* запомненный прыжок — стартует сразу */
 if(F.buf!=null&&F.stuck<=0){var bc=F.buf;F.buf=null;F.hold=false;doJump(S,bc);return}
 if(F.hold){F.c=Math.min(1,F.pre*1);F.holdT=0;F.pre=0}}
function lampLight(S,p){p.lampOn=true;S.check=S.pads.indexOf(p);if((S.up.g|0)>=2&&S.shield<shieldStart(S)){S.shield++;ev(S,'shieldUp',p.x,3)}if(S.petals<S.maxP&&S.mode==='story'){S.petals++;ev(S,'txt',p.x,3,'+♥','#ff9ab8')}ev(S,'lamp',p.x,0)}
function raceFinish(S){S.phase='win';S.phT=0;S.finishT=S.clock+S.pen;ev(S,'finish',S.F.x,0,S.finishT)}
function startFall(S){var F=S.F;F.mode='fall';F.fs=0;F.lastX=F.x;S.falls++;S.combo=0;ev(S,'splash',F.x,0)}
function rescueStart(S){var F=S.F,free=hasPerk(S,'rescue')&&!S.rescueUsed&&S.mode==='endless',wFree=!free&&S.mode!=='race'&&(S.up.w|0)>(S.rescueN|0);
 if(S.mode==='race'){S.pen+=FALL_PEN;ev(S,'penalty',F.x,2,FALL_PEN)}
 else if(free){S.rescueUsed=true;ev(S,'freeRescue',F.x,0)}
 else if(wFree){S.rescueN=(S.rescueN|0)+1;ev(S,'freeRescue',F.x,0,1)}
 else{S.petals--;S.noHurt=false;if(S.petals<=0){failRun(S);return}}
 F.mode='rescue';F.rs=0;F.rx0=F.x;var pj=F.pi,tgt=S.pads[pj];
 if(!tgt||tgt.sink>=SINK_LAND){for(var i=pj;i>=0;i--)if(S.pads[i].sink<SINK_LAND){tgt=S.pads[i];pj=i;break}}
 F.pi=pj;F.tx=tgt.x;ev(S,'rescue',F.x,0)}
function failRun(S){if(S.phase==='fail')return;S.phase='fail';S.phT=0;S.F.mode='dead';ev(S,'fail',S.F.x,0)}
function hurt(S,srcx,dmg){var F=S.F;if(F.inv>0||F.mode==='dash'||S.phase==='win'||S.phase==='fail')return false;
 if(S.shield>0){S.shield--;F.inv=1;ev(S,'shield',F.x,F.y);return false}
 S.hits++;S.noHurt=false;F.inv=1.5;F.hurt=.5;S.combo=0;
 if(S.noFail){F.stuck=Math.max(F.stuck,.35);F.c=0}else S.petals-=(dmg||1);
 ev(S,'hurt',F.x,F.y,S.petals);
 if(S.petals<=0&&!S.noFail){failRun(S);return true}
 return true}

/* ---------- удар и Порох ---------- */
function strike(S){var F=S.F;if(S.phase==='fail'||S.phase==='win'||F.atk>0||F.mode==='fall'||F.mode==='rescue'||F.mode==='dead')return;F.atk=STRIKE_T;F.atkHit=false;ev(S,'slash',F.x,F.y)}
function useDash(S){var F=S.F;if(S.dm<100||S.dash||(S.phase!=='play'&&S.phase!=='lead')||F.mode!=='sit'||S.boss)return;
 var from=F.pi,to=Math.min(from+6,S.mode==='race'?S.pads.length-1:S.arenaStart-1);if(to<=from)return;
 S.dm=0;S.dash={t:0,dur:2.4,from:F.x,to:S.pads[to].x,toI:to};F.mode='dash';F.inv=3;F.hold=false;F.c=0;F.pre=0;ev(S,'dashStart',F.x,0)}

/* ---------- шаг ---------- */
function simStep(S){var dt=DT,F=S.F;
 while(S.q.length){var ty=S.q.shift();S.rec.push(S.tick,INP[ty]);applyInput(S,ty)}
 if(S.mode==='race'&&!S.started)return;      /* в гонке мир замирает до первого нажатия: ветер и плывущие кувшинки у всех стартуют одинаково */
 S.tick++;S.t+=dt;S.phT+=dt;
 if(S.started&&S.phase!=='win'&&S.phase!=='fail'&&S.phase!=='done')S.clock+=dt;
 if(S.windMax>0&&S.phase!=='boss'){S.windT+=dt;S.wind=S.windMax*Math.sin(S.windT*.22)*(.7+.3*Math.sin(S.windT*.07))}else S.wind+=(0-S.wind)*Math.min(1,dt*2);
 frogStep(S,dt);padsStep(S,dt);enemiesStep(S,dt);projStep(S,dt);entsStep(S,dt);if(S.boss)bossStep(S,dt);phaseStep(S,dt)}
function simRun(S,seconds){var n=Math.round(seconds*SIM_HZ);for(var i=0;i<n;i++)simStep(S)}

function frogStep(S,dt){var F=S.F,p;
 if(F.inv>0)F.inv-=dt;if(F.hurt>0)F.hurt-=dt;if(F.stuck>0)F.stuck-=dt;
 if(F.atk>0){F.atk-=dt;if(!F.atkHit&&1-F.atk/STRIKE_T>STRIKE_HIT){F.atkHit=true;strikeHit(S)}}
 if(F.tongue){F.tongue.t-=dt;if(F.tongue.t<=0)F.tongue=null}
 if(F.mode==='sit'){
  p=S.pads[F.pi];
  if(F.hold&&F.stuck<=0){F.holdT+=dt;F.c=Math.min(1,F.c+dt/chargeTime(S))}else if(!F.hold)F.c=0;
  var tsq=F.hold&&F.stuck<=0?ease(F.c)*.85:0;F.sq+=(tsq-F.sq)*Math.min(1,dt*18);
  if(p){
   if(p.k==='move')F.x+=p.dx;
   if(p.k==='sink'&&p.sink>=1){F.slide=0;startFall(S)}
   if(F.slide>0){F.x+=F.slide*dt*2.4;F.slide=Math.max(0,F.slide-dt*1.8);if(F.x>p.x+padTol(S,p)){F.slide=0;startFall(S)}}
   if(p.lamp&&!p.lampOn)lampLight(S,p)}
  F.y=0;F.tilt=0}
 else if(F.mode==='air'){
  F.s+=dt/F.T;var s=Math.min(1,F.s);F.x=F.x0+F.D*s;F.y=4*F.H*s*(1-s);F.tilt=-(1-2*s)*.28;F.st=Math.sin(s*PI);
  if(F.hold)F.pre=Math.min(.3,F.pre+dt/chargeTime(S)*.6);
  if(F.s>=1){F.x=F.x0+F.D;F.y=0;F.tilt=0;var j=findPad(S,F.x);if(j>=0)land(S,j);else startFall(S)}}
 else if(F.mode==='fall'){F.fs+=dt;F.y=-Math.min(1.6,F.fs*3)*.6;F.tilt=0;if(F.fs>.95)rescueStart(S)}
 else if(F.mode==='rescue'){F.rs+=dt/1.1;var u=Math.min(1,F.rs);F.x=lerp(F.rx0,F.tx,ease(u));F.y=Math.sin(u*PI)*3.2+(1-u)*-1*(1-Math.min(1,u*4));F.tilt=Math.sin(u*PI*3)*.1;
  if(u>=1){F.mode='sit';F.y=0;F.inv=1.5;F.tilt=0;F.sq=.4;var pp=S.pads[F.pi];if(pp)pp.sink=0;F.c=0;F.hold=false;ev(S,'rescued',F.x,0)}}
 else if(F.mode==='dash'){
  var D=S.dash;D.t+=dt;var u2=Math.min(1,D.t/D.dur),e=clamp(ease(u2)*.35+u2*.65,0,1);F.x=lerp(D.from,D.to,e);F.y=0;F.inv=2;
  for(var i=0;i<S.pads.length;i++){var pp2=S.pads[i];if(Math.abs(pp2.x-F.x)<1.1)pp2.lit=1}
  if(u2>=1){S.dash=null;F.mode='sit';F.x=S.pads[D.toI].x;F.inv=1.2;F.pi=D.toI;S.padsDone=Math.max(S.padsDone,S.pads[D.toI].i);
   ev(S,'dashEnd',F.x,0);
   if(S.mode==='race'&&S.pads[D.toI].finish&&S.phase==='play')raceFinish(S);
   else if(S.mode==='story'&&S.pads[D.toI].finish&&S.phase==='play'){S.phase='win';S.phT=0;S.won=true;ev(S,'win',F.x,0)}
   else if(D.toI===S.endPad&&S.mode!=='race'&&S.phase==='play')S.phase='lead'}}}
function padsStep(S,dt){for(var i=0;i<S.pads.length;i++){var p=S.pads[i];
 if(p.k==='move'){var nx=p.x0+Math.sin(S.t*p.sp+p.ph)*p.amp;p.dx=nx-p.x;p.x=nx}
 if(p.k==='sink'){var on=S.F.mode==='sit'&&S.F.pi===i;if(on)p.sink=Math.min(1,p.sink+dt*SINK_RATE);else if(p.sink>0)p.sink=Math.max(0,p.sink-dt*SINK_RISE)}}}

/* ---------- враги ---------- */
function enemySpeedMul(S){return slowMul(S)}
var NEWEN={beetle:1,saw:1,mortar:1,dropper:1};
function enemiesStep(S,dt){var sp=enemySpeedMul(S),F=S.F;
 for(var i=S.en.length-1;i>=0;i--){var e=S.en[i];
  if(e.dead){e.dt=(e.dt||0)+dt;e.x+=(e.vxd||0)*dt;e.y+=(e.vyd||0)*dt;e.vyd=(e.vyd||0)-14*dt;if(e.dt>1||e.y<-1.5)S.en.splice(i,1);continue}
  if(!e.act){if(e.x-F.x<ACT_DIST)e.act=true;else continue}
  e.t+=dt*sp;
  if(e.k==='gnat'){e.x+=e.vx*dt*sp;if(e.home0==null)e.home0=e.y;e.yy=e.home0+Math.sin(e.t*3+e.ph)*.35;if(e.x<F.x-14)S.en.splice(i,1)}
  else if(NEWEN[e.k]){newEnAI(S,e,dt,sp);if(e.gone){S.en.splice(i,1);continue}}
  else soldierAI(S,e,dt,sp);
  var ey=e.k==='gnat'?e.yy:e.y;
  if(!e.dead&&F.mode!=='dead'){var dx=e.x-F.x,dy=ey-(F.y+.8),rr=e.k==='gnat'?.42:e.k==='saw'?.5:.65;
   if(dx*dx+dy*dy<rr){
    if(F.mode==='dash')killEnemy(S,e,false,true);
    else if(NEWEN[e.k]){if(newEnDanger(e)&&hurt(S,e.x,1))newEnHurt(S,e)}
    else if(hurt(S,e.x,1)){e.vxd=-2;if(e.k==='gnat')killEnemy(S,e,false)}}}}}
/* --- новые бойцы ---
   Жук-бронник: в броне, удар по нему звенит. Бьёт катком, но только после замаха; в миг качения — отбей (мгновенная победа), после удара о край листа — оглушён.
   Пила-шестерёнка: летит волной; удар не рубит её, а ОТБИВАЕТ назад — и она косит всех на своём пути.
   Шмель-бомбардир: висит впереди и навесом кидает шестигранник туда, где ты приземлишься. Отбей снаряд мечом или смести прочь с пути.
   Паучок на нити: сидит над головой, замечает героя, падает на нити и качается. Бей, пока висит. */
function newEnDanger(e){return e.k==='beetle'?e.st==='roll':e.k==='saw'?!e.refl:e.k==='dropper'?(e.st==='drop'||e.st==='dangle'):true}
function newEnHurt(S,e){if(e.k==='beetle'){e.st='stun';e.t=0}else if(e.k==='dropper'){e.st='rise';e.t=0}else if(e.k==='mortar'){e.st='leave';e.t=0}}
function newEnAI(S,e,dt,sp){var F=S.F,p,i,o;
 if(e.cool>0)e.cool-=dt*sp;if(e.guard>0)e.guard-=dt;
 if(e.k==='beetle'){p=S.pads[e.pad];if(!p){e.gone=true;return}
  if(e.st==='walk'){e.ox=Math.sin(e.t*.9+e.ph)*p.r*.5;e.face=Math.cos(e.t*.9+e.ph)>0?1:-1;e.y=.5;
   if(e.cool<=0&&F.mode==='sit'&&F.pi===e.pad&&S.phase!=='fail'&&S.phase!=='win'){e.st='tele';e.t=0;e.dir=F.x>=p.x+e.ox?1:-1;ev(S,'tele',e.x,.9)}}
  else if(e.st==='tele'){e.face=e.dir;if(e.t>.78){e.st='roll';e.t=0;e.dir=F.x>=p.x+e.ox?1:-1;e.face=e.dir}}
  else if(e.st==='roll'){e.ox+=e.dir*6.4*dt*sp;if(Math.abs(e.ox)>=p.r*.92||e.t>1.4){e.ox=clamp(e.ox,-p.r*.92,p.r*.92);e.st='stun';e.t=0;ev(S,'bust',p.x+e.ox,.5)}}
  else if(e.st==='stun'){if(e.t>1.6){e.st='walk';e.t=0;e.cool=2.0}}
  e.x=p.x+e.ox}
 else if(e.k==='saw'){
  if(e.refl){e.x+=10*dt;for(i=0;i<S.en.length;i++){o=S.en[i];if(o===e||o.dead)continue;var oy=o.k==='gnat'?o.yy:o.y;if(Math.abs(o.x-e.x)<1&&Math.abs(oy-e.y)<1.3){killEnemy(S,o,false);ev(S,'bust',o.x,oy)}}
   if(e.x>F.x+20)e.gone=true}
  else{e.x+=e.vx*dt*sp;e.y=e.y0+Math.sin(e.t*2.3+e.ph)*e.amp;if(e.x<F.x-14)e.gone=true}}
 else if(e.k==='mortar'){
  if(e.st==='leave'){e.x+=2.6*dt;e.y+=2.2*dt;if(e.y>9)e.gone=true;return}
  var tx=F.x+5.2;e.x+=(tx-e.x)*Math.min(1,dt*(e.st==='tele'?.5:1.3));
  e.y=3.9+Math.sin(e.t*1.9+e.ph)*.25-(e.st==='tele'?.55*Math.min(1,e.t/.7):0);
  if(e.st==='idle'){if(e.cool<=0&&e.x-F.x<9&&F.mode!=='dead'&&F.mode!=='dash'&&S.phase!=='fail'){e.st='tele';e.t=0;ev(S,'tele',e.x,e.y)}}
  else if(e.st==='tele'&&e.t>.82){var T=1.15,lx=F.x+(F.mode==='air'?F.D*(1-F.s):0);
   S.proj.push({k:'hex',own:'en',x:e.x,y:e.y,vx:(lx-e.x)/T,vy:(4.5*T*T-e.y)/T,t:0,r:.34});ev(S,'lob',e.x,e.y);
   e.shots++;e.st=e.shots>=3?'leave':'idle';e.t=0;e.cool=2.4}}
 else if(e.k==='dropper'){
  if(e.st==='hang'){e.y=7+Math.sin(e.t*2+e.ph)*.1;e.sx=0;
   if(e.cool<=0&&Math.abs(F.x-e.x)<5.2&&F.x<e.x+3.4&&F.mode!=='dead'&&F.mode!=='dash'&&S.phase!=='fail'){e.st='tele';e.t=0;ev(S,'tele',e.x,5.6)}}
  else if(e.st==='tele'){e.y=6.6+Math.sin(e.t*40)*.12;if(e.t>.6){e.st='drop';e.t=0}}
  else if(e.st==='drop'){e.y-=17*dt*sp;if(e.y<=1.25){e.y=1.25;e.st='dangle';e.t=0;ev(S,'bust',e.x,1.5)}}
  else if(e.st==='dangle'){e.y=1.25+Math.sin(e.t*5)*.12;if(e.t>1.5){e.st='rise';e.t=0}}
  else if(e.st==='rise'){e.y+=4.2*dt*sp;if(e.y>=7){e.y=7;e.st='hang';e.t=0;e.cool=2.2}}}}
function soldierAI(S,e,dt,sp){var F=S.F;if(e.cool>0)e.cool-=dt;
 if(e.st==='patrol'){e.x=e.home+Math.sin(e.t*1.1+e.ph)*1.1;e.y=2.9+Math.sin(e.t*2.2)*.15;
  if(e.cool<=0&&Math.abs(F.x-e.x)<3.4&&F.mode!=='dead'&&F.mode!=='dash'&&S.phase!=='fail'){e.st='tele';e.t=0;ev(S,'tele',e.x,e.y)}}
 else if(e.st==='tele'){if(e.t>.62){e.st='dive';e.t=0;e.tx=F.x+(F.mode==='air'?F.D*(1-F.s)*.5:0);e.ty=F.y+.7;var dx=e.tx-e.x,dy=e.ty-e.y,d=Math.hypot(dx,dy)||1;e.vx=dx/d*7.8;e.vy=dy/d*7.8}}
 else if(e.st==='dive'){e.x+=e.vx*dt*sp;e.y+=e.vy*dt*sp;if(e.t>.6||e.y<-.2){e.st='back';e.t=0;e.cool=1.6}}
 else if(e.st==='back'){var tx=e.home,ty=2.9;e.x+=(tx-e.x)*Math.min(1,dt*2.2);e.y+=(ty-e.y)*Math.min(1,dt*2.2);if(e.t>.8){e.st='patrol';e.t=0}}}
function killEnemy(S,e,parry,trample){if(e.dead)return;e.dead=true;e.dt=0;e.vxd=parry?3:2;e.vyd=parry?5:3;S.kills++;ev(S,'kill',e.x,e.k==='gnat'?e.yy:e.y,parry?1:0);
 S.dm=Math.min(100,S.dm+(parry?DM.parry:DM.kill));var drops=((parry||e.k==='mortar'||e.k==='beetle')?3:1)+(S.mode==='race'?0:(S.up.t|0));for(var i=0;i<drops;i++)S.ents.push({k:'fire',x:e.x+(i-1)*.4,y:(e.k==='gnat'?e.yy:e.y)+.2,ph:i,got:0,fly:1});
 S.score+=parry?50:25;
 if(parry){S.parries++;parryBonus(S,e.x,e.y);ev(S,'parry',e.x,e.y);if(hasPerk(S,'thorn'))for(var j=0;j<S.en.length;j++){var o=S.en[j];if(!o.dead&&o!==e&&Math.abs(o.x-e.x)<3.2)killEnemy(S,o,false)}}}
function strikeHit(S){var F=S.F,rx=reachX(S),x0=F.x-.3,x1=F.x+rx,y0=F.y-.9,y1=F.y+2.9,i;
 for(i=0;i<S.en.length;i++){var e=S.en[i];if(e.dead||e.gone)continue;var ey=e.k==='gnat'?e.yy:e.y;if(e.x>x0-.4&&e.x<x1+.4&&ey>y0&&ey<y1){
   if(e.k==='beetle'){if(e.st==='roll')killEnemy(S,e,true);else if(e.st==='stun')killEnemy(S,e,false);else{e.guard=.35;e.ox+=(e.x>F.x?.35:-.35);ev(S,'clang',e.x,e.y+.4)}}
   else if(e.k==='saw'){if(!e.refl){e.refl=true;e.t=0;S.parries++;parryBonus(S,e.x,e.y);S.dm=Math.min(100,S.dm+DM.parry);S.score+=40;ev(S,'sawBack',e.x,e.y)}}
   else killEnemy(S,e,e.st==='dive'||e.st==='tele'||e.st==='drop')}}
 for(i=0;i<S.proj.length;i++){var q=S.proj[i];if(q.own==='en'&&q.x>x0-.3&&q.x<x1+.5&&q.y>y0-.3&&q.y<y1+.3){
  if(q.k==='web'){q.dead=true;ev(S,'bust',q.x,q.y)}
  else{q.own='pl';q.vx=Math.abs(q.vx)*1.35+2;q.vy=q.vy*.3;S.parries++;parryBonus(S,q.x,q.y);ev(S,'parry',q.x,q.y)}}}
 if(S.boss)bossStrike(S,x0,x1,y0,y1);
 for(i=0;i<S.ents.length;i++){var f=S.ents[i];if(f.got||f.k==='petal')continue;if(f.x>x0&&f.x<x1+.8&&f.y>y0&&f.y<y1+.5)collect(S,f)}
 ev(S,'swing',F.x+reachX(S)*.7,F.y+1.2)}
function projStep(S,dt){var F=S.F;for(var i=S.proj.length-1;i>=0;i--){var q=S.proj[i];q.t+=dt;
 if(q.k==='web'||q.k==='hex'||q.grav)q.vy-=(q.k==='hex'?9:5)*dt;
 q.x+=q.vx*dt;q.y+=q.vy*dt;
 if(q.dead||q.t>7||q.x<F.x-16||q.x>F.x+22){S.proj.splice(i,1);continue}
 if(q.y<=0&&q.k!=='sting'){if(q.k==='hex'){ev(S,'bust',q.x,.2);if(Math.abs(q.x-F.x)<.8&&F.mode==='sit')hurt(S,q.x,1)}S.proj.splice(i,1);continue}
 if(q.y<-.3){S.proj.splice(i,1);continue}
 if(q.own==='en'&&F.mode!=='dead'){var dx=q.x-F.x,dy=q.y-(F.y+.8),rr2=(q.r||.3)+.42;
  if(dx*dx+dy*dy<rr2*rr2){if(q.k==='web'){F.stuck=1.1;F.c=0;q.dead=true;ev(S,'webbed',F.x,F.y)}else{if(hurt(S,q.x,1))q.dead=true}}}
 else if(q.own==='pl'&&S.boss)bossProjHit(S,q);
 else if(q.own==='pl'){for(var j=0;j<S.en.length;j++){var e=S.en[j];if(e.dead)continue;var ey=e.k==='gnat'?e.yy:e.y,ddx=e.x-q.x,ddy=ey-q.y;if(ddx*ddx+ddy*ddy<.5){killEnemy(S,e,false);q.dead=true}}}}}
function nearPad(S,x){var b=null,bd=1e9;for(var i=0;i<S.pads.length;i++){var d=Math.abs(S.pads[i].x-x);if(d<bd){bd=d;b=S.pads[i]}}return b}
function collect(S,f){if(f.got)return;f.got=1;var F=S.F;
 if(f.k==='fire'){var v=hasPerk(S,'gold')?2:1;S.fire+=v;S.fireN++;S.fireNight++;S.score+=3*v;S.fireStreak=(S.t-S.lastFireT<1.3)?S.fireStreak+1:0;S.lastFireT=S.t;
  S.dm=Math.min(100,S.dm+DM.fire*(hasPerk(S,'dash')?1.5:1));F.tongue={x:f.x,y:f.y,t:.16};ev(S,'fire',f.x,f.y,S.fireStreak)}
 else if(f.k==='petal'){if(S.petals<S.maxP){S.petals++;ev(S,'petal',f.x,f.y)}else{S.fire+=3;ev(S,'fire3',f.x,f.y)}}
 else if(f.k==='carrot'){S.dm=Math.min(100,S.dm+DM.carrot);ev(S,'carrot',f.x,f.y)}}
function entsStep(S,dt){var F=S.F,gr=grabR(S);
 for(var i=S.ents.length-1;i>=0;i--){var f=S.ents[i];if(f.got){S.ents.splice(i,1);continue}
  if(F.mode==='dead')continue;var dx=f.x-F.x,dy=f.y-(F.y+.9),d2=dx*dx+dy*dy;
  if(f.k==='fire'&&((gr>1.2&&d2<(gr*2.2)*(gr*2.2))||(S.up.m>0&&d2<(gr*1.6)*(gr*1.6)))){var d=Math.sqrt(d2)||1;f.x-=dx/d*dt*4.5;f.y-=dy/d*dt*4.5}
  if(d2<(f.k==='fire'?gr*gr:1.1))collect(S,f)}}

/* ---------- фазы ---------- */
function phaseStep(S,dt){
 if(S.phase==='prize'){var pr=S.prize;if(pr&&S.F.mode==='sit'&&Math.abs(S.F.x-pr.x)<2.2&&!S.won){S.won=true;S.phase='win';S.phT=0;ev(S,'win',S.F.x,0)}}
 else if(S.phase==='lead'&&S.mode==='endless'&&!(S.cs&&S.cs.boss))dawnStart(S);
 if(S.mode==='endless')S.dawn=clamp(S.padsDone/Math.max(1,S.arenaStart-1),0,1)}
function dawnStart(S){if(S.phase==='dawn'||S.phase==='perk')return;S.phase='dawn';S.phT=0;for(var i=0;i<S.en.length;i++)if(!S.en[i].dead)killEnemy(S,S.en[i],false);S.proj=[];ev(S,'dawn',S.F.x,0,S.night)}
/* выбор дара и переход к следующей ночи — вызывает сцена */
function pickPerk(S,k){if(k==='shield')S.shield=Math.min(2,S.shield+1);else if(k==='heal')S.petals=Math.min(S.maxP,S.petals+1);
 else if(k==='maxhp'){S.perks.maxhp=(S.perks.maxhp||0)+1;S.maxP++;S.petals=Math.min(S.maxP,S.petals+1)}else S.perks[k]=(S.perks[k]||0)+1;
 S.night++;buildNight(S,false)}
function perkChoices(S){var keys=Object.keys(PERK_DEF),pool=[],i;
 for(i=0;i<keys.length;i++){var k=keys[i];if(k==='heal'&&S.petals>=S.maxP&&S.rnd()<.7)continue;if(k==='shield'&&S.shield>=2)continue;if(k==='maxhp'&&S.maxP>=9)continue;if((S.perks[k]||0)>=3&&k!=='shield'&&k!=='heal')continue;pool.push(k)}
 var ch=[];while(ch.length<3&&pool.length){var tot=0;pool.forEach(function(k){tot+=PERK_DEF[k].w});var r=S.rnd()*tot,idx=0;for(i=0;i<pool.length;i++){r-=PERK_DEF[pool[i]].w;if(r<=0){idx=i;break}}ch.push(pool.splice(idx,1)[0])}
 return ch}
/* вернуться на последнюю зажжённую лампу после поражения */
function respawn(S){var F=S.F,cp=S.pads[S.check]||S.pads[0];F.x=cp.x;F.pi=S.check;F.y=0;F.mode='sit';F.inv=2;F.stuck=0;F.hold=false;F.c=0;F.pre=0;F.buf=null;S.petals=S.maxP;S.phase='play';S.phT=0;S.boss=null;S.proj=[];S.bossDone=false;S.dash=null;
 S.falls++;S.noHurt=false;for(var i=0;i<S.en.length;i++)if(!S.en[i].dead&&Math.abs(S.en[i].x-F.x)<5)S.en[i].dead=true;S.dark=0;ev(S,'respawn',F.x,0)}
