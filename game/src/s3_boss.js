/* ===== s3: боссы — Басс, Паутинья, Жало, Шестерон и комариная стая =====
   Арена не зависит от экрана: атаки приходят из точки arenaX+6.6, а сцена на время боя
   подгоняет масштаб так, чтобы вся арена была видна (поэтому в портретном режиме герои на арене чуть мельче). */
var BNAME={bass:'Здоровяк Басс',spider:'Госпожа Паутинья',captain:'Капитан Жало',emperor:'Император Шестерон',wave:'Комариная стая'};
var BHP={bass:6,spider:7,captain:8,emperor:14};
var ARENA_IN=6.6;
function bossStart(S){var k=S.cs&&S.cs.boss;if(!k)return;S.bossDone=false;S.phase='boss';S.phT=0;
 if(k==='wave'){S.boss={k:'wave',wave:0,left:0,t:0,st:'hover',hp:1,maxhp:1};ev(S,'bossStart',S.arenaX,0,k);return}
 var hp=BHP[k]+(S.mode!=='story'?Math.floor((S.night-1)/3)*2:0);
 S.boss={k:k,hp:hp,maxhp:hp,x:S.arenaX+ARENA_IN,y:4,st:'enter',t:0,inv:0,ph:1,q:[],n:0,stun:0,flash:0,vx:0,vy:0};
 if(k==='emperor')S.dark=0;ev(S,'bossStart',S.arenaX,0,k)}
function bossPhase(b){var f=b.hp/b.maxhp;return f>.66?1:f>.33?2:3}
function bossHurt(S,b,d,x,y){if(b.inv>0||b.st==='die')return;b.hp-=d;b.inv=.55;b.flash=.4;ev(S,'bossHit',x||b.x,y||b.y,d);
 var ph=bossPhase(b);if(ph!==b.ph){b.ph=ph;ev(S,'bossPhase',b.x,b.y,b.k,ph)}
 if(b.hp<=0){b.st='die';b.t=0;ev(S,'bossDie',b.x,b.y,b.k);for(var i=0;i<S.en.length;i++)killEnemy(S,S.en[i],false);S.proj=[]}}
function bossSpeed(S,b){return(1+(bossPhase(b)-1)*.22)*slowMul(S)}
function bossStrike(S,x0,x1,y0,y1){var b=S.boss;if(!b||b.k==='wave'||b.st==='die'||b.st==='enter')return;var bw=b.k==='spider'?1.3:1.1;
 var inx=b.x>x0-bw&&b.x<x1+bw,iny=b.y>y0-.6&&b.y<y1+.6;if(!inx||!iny)return;
 if(b.st==='atk'){S.parries++;parryBonus(S,b.x,b.y);ev(S,'bossParry',b.x,b.y);bossHurt(S,b,1,b.x,b.y);if(b.st!=='die')bossStun(S,b,2.8);S.dm=Math.min(100,S.dm+25)}
 else if(b.st==='stun'){bossHurt(S,b,2,b.x,b.y)}
 else ev(S,'bossBlock',b.x,b.y)}
function bossProjHit(S,q){var b=S.boss;if(!b||b.k==='wave'||b.st==='die')return;var dx=q.x-b.x,dy=q.y-b.y;if(dx*dx+dy*dy<1.2){q.dead=true;bossHurt(S,b,2,q.x,q.y);if(b.st!=='die')bossStun(S,b,2.4)}}
function bossStun(S,b,t){var F=S.F;b.st='stun';b.t=0;b.stun=t;b.tx=clamp(F.x+2.1,S.arenaX-3.2,S.arenaX+3.2);b.ty=(b.k==='spider'?1.5:1.2)}
function bossNext(S,b){var ph=bossPhase(b),a,F=S.F;
 if(!b.q.length){var pool;
  if(b.k==='bass')pool=ph===1?['cl','ch']:ph===2?['cl','ch','dbl']:['dbl','cl','ch','dbl'];
  else if(b.k==='spider')pool=ph===1?['web','drop']:ph===2?['web','drop','web3']:['web3','drop','drop2'];
  else if(b.k==='captain')pool=ph===1?['vol','lance']:ph===2?['vol','lance','vol5']:['vol5','lance','vol'];
  else pool=ph===1?['vol5','rain','lowc']:ph===2?['rain','sum','vol5','highc']:['rain','vol5','sum','dbl','lowc'];
  for(var k=0;k<3;k++)b.q.push(pool[(S.rnd()*pool.length)|0])}
 a=b.q.shift();b.cur=a;b.st='tele';b.t=0;b.n++;var sp=bossSpeed(S,b),inX=S.arenaX+ARENA_IN;
 switch(a){
  case'cl':case'lowc':b.h=1.0;b.tt=1.0/sp;b.fromX=inX;b.y=b.h;b.x=b.fromX;break;
  case'ch':case'highc':b.h=3.2;b.tt=1.0/sp;b.fromX=inX;b.y=b.h;b.x=b.fromX;break;
  case'dbl':b.h=(S.rnd()<.5?1.0:3.2);b.tt=.9/sp;b.fromX=inX;b.y=b.h;b.x=b.fromX;b.dbl=1;break;
  case'web':case'web3':b.tt=.8/sp;break;
  case'drop':case'drop2':b.tt=1.0/sp;b.dropX=clamp(nearPad(S,F.x).x,S.arenaX-3.5,S.arenaX+3.5);break;
  case'vol':case'vol5':b.tt=.8/sp;break;
  case'lance':b.tt=1.0/sp;b.tx2=F.x;b.ty2=F.y+.9;break;
  case'rain':b.tt=1.1/sp;b.rx=[];var cnt=ph>2?5:4;for(var i=0;i<cnt;i++)b.rx.push(S.arenaX-3.8+(i+S.rnd()*.7)*(7.6/cnt));break;
  case'sum':b.tt=.9/sp;break}
 ev(S,'bossTele',b.x,b.y,a)}
function bossStep(S,dt){var b=S.boss,F=S.F;if(!b)return;b.t+=dt;if(b.inv>0)b.inv-=dt;if(b.flash>0)b.flash-=dt;
 if(b.k==='wave'){waveStep(S,b,dt);return}
 var sp=bossSpeed(S,b),cx=S.arenaX;
 if(b.st==='enter'){var k=Math.min(1,b.t/1.8);b.x=lerp(cx+ARENA_IN,cx+2.6,ease(k));b.y=lerp(5.5,b.k==='spider'?5.2:3.4,ease(k));if(b.t>1.9){b.st='hover';b.t=0;b.hv=.6}}
 else if(b.st==='hover'){var ty=b.k==='spider'?5.2:3.3,tx=cx+(b.k==='spider'?Math.sin(S.t*.7)*3:2.4+Math.sin(S.t*.9)*.9);b.x+=(tx-b.x)*Math.min(1,dt*2.5);b.y+=(ty+Math.sin(S.t*2.2)*.25-b.y)*Math.min(1,dt*2.5);b.hv-=dt*sp;if(b.hv<=0&&S.phase==='boss')bossNext(S,b)}
 else if(b.st==='tele'){var tt=b.tt;
  if(b.cur==='cl'||b.cur==='ch'||b.cur==='lowc'||b.cur==='highc'||b.cur==='dbl'){b.x=b.fromX;b.y=b.h+Math.sin(b.t*40)*.04;if(b.t>=tt){b.st='atk';b.t=0;ev(S,'zap',b.x,b.y)}}
  else if(b.cur==='web'||b.cur==='web3'){b.y+=(5.4-b.y)*Math.min(1,dt*5);if(b.t>=tt){var n=b.cur==='web3'?3:2;for(var i=0;i<n;i++){var tx2=F.x+(i-(n-1)/2)*1.8,dx=tx2-b.x,T2=1.25;S.proj.push({k:'web',own:'en',x:b.x,y:b.y-.4,vx:dx/T2,vy:(0-b.y)/T2+.5*5*T2,t:0,r:.35})}ev(S,'zap',b.x,b.y);b.st='after';b.t=0}}
  else if(b.cur==='drop'||b.cur==='drop2'){b.x+=(b.dropX-b.x)*Math.min(1,dt*4);if(b.t>=tt){b.st='atk';b.t=0;ev(S,'zap',b.x,b.y)}}
  else if(b.cur==='vol'||b.cur==='vol5'){b.x+=(cx+2.8-b.x)*Math.min(1,dt*3);b.y+=(3.6-b.y)*Math.min(1,dt*3);if(b.t>=tt){var n2=b.cur==='vol5'?5:3,ang0=Math.atan2((F.y+.8)-b.y,F.x-b.x);for(var j=0;j<n2;j++){var a2=ang0+(j-(n2-1)/2)*.22;S.proj.push({k:'sting',own:'en',x:b.x-.6,y:b.y,vx:Math.cos(a2)*7.2*sp,vy:Math.sin(a2)*7.2*sp,t:0,r:.28})}ev(S,'zap',b.x,b.y);b.st='after';b.t=0}}
  else if(b.cur==='lance'){b.x+=(cx+2.6-b.x)*Math.min(1,dt*2);if(b.t>=tt){b.st='atk';b.t=0;var dx2=b.tx2-b.x,dy2=b.ty2-b.y,d2=Math.hypot(dx2,dy2)||1;b.vx=dx2/d2*12.5*sp;b.vy=dy2/d2*12.5*sp;ev(S,'zap',b.x,b.y)}}
  else if(b.cur==='rain'){b.y+=(4.4-b.y)*Math.min(1,dt*3);if(b.t>=tt){b.rx.forEach(function(x,i){S.proj.push({k:'hex',own:'en',x:x,y:6+i*.5,vx:0,vy:-3,t:0,r:.5})});ev(S,'zap',b.x,b.y);b.st='after';b.t=0}}
  else if(b.cur==='sum'){b.y+=(4.2-b.y)*Math.min(1,dt*3);if(b.t>=tt){for(var s=0;s<2;s++)S.en.push({k:'soldier',x:cx+ARENA_IN+1+s*1.6,y:2.9,home:cx-1+s*3,ph:s,hp:1,st:'patrol',t:0,cool:0,act:true});ev(S,'zap',b.x,b.y);b.st='after';b.t=0}}}
 else if(b.st==='atk'){
  if(b.cur==='cl'||b.cur==='ch'||b.cur==='lowc'||b.cur==='highc'||b.cur==='dbl'){b.x-=14*sp*dt;
   if(F.mode!=='dead'){var ox=Math.abs(b.x-F.x)<1.0,oy=Math.abs((F.y+.8)-b.y)<1.05;if(ox&&oy&&F.inv<=0&&F.mode!=='dash')hurt(S,b.x,1)}
   if(b.x<cx-ARENA_IN-1){if(b.cur==='dbl'&&b.dbl===1){b.dbl=2;b.h=b.h<2?3.2:1.0;b.x=cx+ARENA_IN;b.y=b.h;b.st='tele';b.t=0;b.tt=.55/sp;b.fromX=b.x}else{b.st='after';b.t=0}}}
  else if(b.cur==='drop'||b.cur==='drop2'){var kk=Math.min(1,b.t/.28);b.y=lerp(5.2,1.0,kk*kk);
   if(b.t>=.28&&!b.slam){b.slam=true;ev(S,'slam',b.x,0);if(F.mode==='sit'&&Math.abs(F.x-b.x)<1.5&&F.y<1.8)hurt(S,b.x,1);if(F.mode==='air'&&F.y<1.4&&Math.abs(F.x-b.x)<1.2)hurt(S,b.x,1)}
   if(b.t>.4){b.slam=false;if(b.cur==='drop2'&&!b.again){b.again=1;b.dropX=clamp(nearPad(S,F.x).x,cx-3.5,cx+3.5);b.st='tele';b.t=0;b.tt=.8}else{b.again=0;bossStun(S,b,2.6);b.ty=1.2;b.tx=b.x}}}
  else if(b.cur==='lance'){b.x+=b.vx*dt;b.y+=b.vy*dt;if(F.mode!=='dead'){var dx3=b.x-F.x,dy3=b.y-(F.y+.8);if(dx3*dx3+dy3*dy3<1.1&&F.inv<=0&&F.mode!=='dash')hurt(S,b.x,1)}if(b.t>.7||b.y<.2||b.x<cx-ARENA_IN){b.st='after';b.t=0;b.x=clamp(b.x,cx-4,cx+4);b.y=Math.max(b.y,1.5)}}}
 else if(b.st==='after'){b.y+=(3.5-b.y)*Math.min(1,dt*3);b.x+=(cx+2.6-b.x)*Math.min(1,dt*2);if(b.t>(b.cur==='rain'?1.7:b.cur==='web'||b.cur==='web3'?1.6:.8)/sp){b.st='hover';b.t=0;b.hv=Math.max(.35,.9-bossPhase(b)*.18)}}
 else if(b.st==='stun'){b.x+=(b.tx-b.x)*Math.min(1,dt*6);b.y+=(b.ty-b.y)*Math.min(1,dt*6);if(b.t>=b.stun){b.st='after';b.t=0}}
 else if(b.st==='die'){b.y-=dt*(b.t>.8?3:-.3);b.x+=dt*.2;if(b.t>1.8&&!b.fin){b.fin=true;bossDown(S)}}
 if(b.k==='emperor'&&S.dark!=null){S.dark+=((bossPhase(b)>=2?1:0)-S.dark)*dt*1.5}}
function bossDown(S){S.bossDone=true;var k=S.boss&&S.boss.k;S.boss=null;S.proj=[];S.phT=0;if(S.dark!=null)S.dark=0;
 ev(S,'bossDown',S.arenaX,0,k);
 if(S.mode==='story'){S.phase='prize';S.prize={x:S.arenaX,t:0}}else dawnStart(S)}
function waveStep(S,b,dt){var sizes=[3,4,5],F=S.F;
 if(b.st==='hover'&&b.t>1.2&&b.wave<3){var n=sizes[b.wave];for(var i=0;i<n;i++)S.en.push({k:'gnat',x:S.arenaX+ARENA_IN+i*1.5,y:1.3+(i%3)*.8,home:0,home0:1.2+(i%3)*.75,ph:i,hp:1,st:'fly',t:0,vx:-(1.4+b.wave*.3),act:true});
  b.wave++;b.st='run';b.t=0;b.left=n;ev(S,'wave',S.arenaX,0,b.wave)}
 else if(b.st==='run'){var alive=0;for(var j=0;j<S.en.length;j++)if(!S.en[j].dead&&S.en[j].k==='gnat')alive++;
  if(alive===0&&b.t>.8){if(b.wave>=3)bossDown(S);else{b.st='hover';b.t=0}}}}
