// Human-like bot: skill = timing noise, reaction time, lapses. Drives a Sim instance through its public input API.
module.exports=`
function mkBot(o){
 var rnd=rng((o.seed||7)|0),B={o:o,wait:0,hold:-1,planned:false,strikeAt:-1,tgt:null,lastMode:'',lastPi:-1,jumps:0};
 function gauss(){return(rnd()+rnd()+rnd()+rnd()-2)*1.7}

 var HITD=STRIKE_T*STRIKE_HIT,CH=['cl','ch','lowc','highc','dbl'];
 B.bp=null;
 B.bossAI=function(S,F,rx){var b=S.boss,now=S.t,xt=F.x+rx*.5,sp=bossSpeed(S,b),dt=null,key=null,i,q;
  if(b.st==='stun'&&b.inv<=0&&Math.abs(b.x-F.x)<rx+.3){B.strikeAt=now+Math.max(.05,o.react*.45+gauss()*.03);return}
  if(b.st==='tele'||b.st==='atk'){
   var left=b.st==='tele'?Math.max(0,b.tt-b.t):0;
   if(CH.indexOf(b.cur)>=0){var v=14*sp,x0=b.st==='tele'?b.fromX:b.x;dt=left+(x0-xt)/v;key='c'+b.n+(b.dbl||0)}
   else if(b.cur==='drop'||b.cur==='drop2'){if(Math.abs((b.st==='tele'?b.dropX:b.x)-F.x)<rx+.6){dt=left+Math.max(0,.2-(b.st==='atk'?b.t:0));key='d'+b.n+(b.again||0)}}
   else if(b.cur==='lance'){var bx=b.st==='tele'?S.arenaX+2.6:b.x,by=b.st==='tele'?3.5:b.y,d0=Math.hypot(b.tx2-bx,b.ty2-by);dt=left+Math.max(0,d0-rx*.5-.6)/(12.5*sp);key='l'+b.n}}
  if(dt!=null){if(!B.bp||B.bp.key!==key){B.bp={key:key,at:now+Math.max(o.react,dt-HITD+gauss()*(o.sigma*1.2+.01))}}
   if(B.bp.key===key&&now<=B.bp.at+1.0){B.strikeAt=B.bp.at;return}}
  /* снаряды: жало отбиваем, паутину рубим; гексы над головой тоже */
  var bestT=null;
  for(i=0;i<S.proj.length;i++){q=S.proj[i];if(q.own!=='en'||q.dead)continue;
   var dx=q.x-xt,tA=null;
   if(q.k==='sting'){if(q.vx<-.5&&dx>-.5){tA=dx/-q.vx;var yy=q.y+q.vy*tA;if(yy<F.y-.7||yy>F.y+2.7)tA=null}}
   else if(q.k==='hex'){if(Math.abs(q.x-F.x)<1.0){var yt=F.y+2.2,a=-4.5,bb=q.vy,c=q.y-yt,disc=bb*bb-4*a*c;if(disc>=0){var tt1=(-bb-Math.sqrt(disc))/(2*a),tt2=(-bb+Math.sqrt(disc))/(2*a);tA=Math.max(tt1,tt2);if(tA<0)tA=null}}}
   if(tA!=null){if(q.bt==null)q.bt=now+Math.max(o.react,tA-HITD+gauss()*(o.sigma*1.2+.01));if(bestT==null||q.bt<bestT)bestT=q.bt}}
  if(bestT!=null)B.strikeAt=Math.max(now,bestT)};

 B.projAI=function(S,F,rx){var now=S.t,xt=F.x+rx*.5,i,q,bestT=null;
  for(i=0;i<S.proj.length;i++){q=S.proj[i];if(q.own!=='en'||q.dead)continue;
   var dx=q.x-xt,tA=null;
   if(q.k==='hex'){if(Math.abs(q.x-F.x)<1.3&&q.vy<0){var yt=F.y+2.2,a=-4.5,bb=q.vy,c=q.y-yt,disc=bb*bb-4*a*c;if(disc>=0){var tt1=(-bb-Math.sqrt(disc))/(2*a),tt2=(-bb+Math.sqrt(disc))/(2*a);tA=Math.max(tt1,tt2);if(tA<0)tA=null}}}
   if(tA!=null){if(q.bt==null)q.bt=now+Math.max(o.react,tA-HITD+gauss()*(o.sigma*1.2+.01));if(bestT==null||q.bt<bestT)bestT=q.bt}}
  if(bestT!=null)B.strikeAt=Math.max(now,bestT)};
 B.newAI=function(S,F,rx){var i,e;
  for(i=0;i<S.en.length;i++){e=S.en[i];if(e.dead||!e.act||e.gone)continue;var dx2=e.x-F.x,tt=null;
   if(e.k==='beetle'){if(e.st==='roll'&&Math.abs(dx2)<rx+3){tt=Math.max(0,(Math.abs(dx2)-rx*.6)/6.4)}else if(e.st==='stun'&&Math.abs(dx2)<rx*.9){tt=0}}
   else if(e.k==='saw'&&!e.refl&&dx2>0&&dx2<rx+1.4&&Math.abs(e.y-(F.y+.8))<1.5){tt=Math.max(0,(dx2-rx*.7)/3.1)}
   else if(e.k==='dropper'&&(e.st==='drop'||e.st==='dangle')&&Math.abs(dx2)<rx*.85){tt=0}
   else if(e.k==='mortar'&&dx2>-.5&&dx2<rx*.8&&e.y<F.y+2.7&&e.y>F.y-.5){tt=0}
   if(tt!=null&&B.strikeAt<0){B.strikeAt=S.t+Math.max(.04,o.react*.5+gauss()*.03,tt-HITD)}}};
 B.step=function(S){var F=S.F,i,e;
  if(S.phase==='fail'||S.phase==='win'||S.phase==='done')return;
  if(S.phase==='dawn'||S.phase==='perk')return;
  /* порох */
  if(S.dm>=100&&F.mode==='sit'&&!S.boss&&(S.phase==='play'||S.phase==='lead')&&!F.hold&&B.wait<=0&&o.dash!==false){simInput(S,'dash');return}
  /* удар по осам и мошкам */
  if(F.atk<=0&&F.mode!=='fall'&&F.mode!=='rescue'){
   var rx=reachX(S);
   for(i=0;i<S.en.length;i++){e=S.en[i];if(e.dead||!e.act)continue;var ey=e.k==='gnat'?e.yy:e.y,dx=e.x-F.x;
    if(e.k==='soldier'&&(e.st==='tele')&&dx>-.5&&dx<rx&&B.strikeAt<0){B.strikeAt=S.t+Math.max(.05,o.react*.5+gauss()*.03)}
    if(e.k==='gnat'&&dx>0&&dx<rx*.85&&ey>F.y-.6&&ey<F.y+2.6&&B.strikeAt<0&&o.react<.5){B.strikeAt=S.t+Math.max(.04,o.react*.4)}}
   if(B.strikeAt<0)B.newAI(S,F,rx);
   if(!S.boss&&B.strikeAt<0)B.projAI(S,F,rx);
   if(S.boss&&S.boss.k!=='wave'&&B.strikeAt<0)B.bossAI(S,F,rx)}
  if(B.strikeAt>=0&&S.t>=B.strikeAt){B.strikeAt=-1;simInput(S,'strike')}
  if(F.mode==='sit'&&!F.hold){
   if(B.lastMode!=='sit'||B.lastPi!==F.pi){B.wait=Math.max(0,o.react+gauss()*o.react*.3);B.planned=false;B.lastPi=F.pi}
   var p=S.pads[F.pi];if(p&&p.k==='sink')B.wait=Math.min(B.wait,.05);
   B.wait-=DT;if(F.stuck>0||B.wait>0){B.lastMode=F.mode;return}
   /* цель */
   var ni=F.pi+1;while(ni<S.pads.length&&S.pads[ni].sink>=SINK_LAND)ni++;if(S.mode!=='race'&&S.phase==='boss'){B.lastMode=F.mode;return}
   if(ni>=S.pads.length){B.lastMode=F.mode;return}
   var np=S.pads[ni],c=0.5,ht=0,k;
   for(k=0;k<4;k++){var j=jumpParams(S,c,S.wind),tau=ht+j.T,tx=np.x0!=null&&np.k==='move'?np.x0+Math.sin((S.t+tau)*np.sp+np.ph)*np.amp:np.x;
    if(np.k==='ice')tx-=.25;
    var D=tx-F.x;c=clamp(((D-S.wind*j.T*.45)-JUMP.Dmin)/(JUMP.Dmax-JUMP.Dmin),JUMP.minC,1);ht=c*chargeTime(S)}
   var lapse=rnd()<o.lapse,err=gauss()*(o.sigma+.03*ht)+(lapse?(rnd()-.5)*.5:0);
   B.hold=Math.max(.02,ht+err);simInput(S,'down');B.lastMode='sit';return}
  if(F.mode==='sit'&&F.hold){if(F.holdT>=B.hold){simInput(S,'up');B.jumps++}}
  B.lastMode=F.mode};
 return B}
`;
