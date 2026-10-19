/* ===== s1: генератор трасс =====
   Чистая функция от зерна: одна и та же река у всех игроков одинакова (это основа честной гонки).
   Никакого Math.random() — только rng(seed). */
function arcPeak(D){var c=clamp((D-JUMP.Dmin)/(JUMP.Dmax-JUMP.Dmin),0,1);return lerp(JUMP.Hmin,JUMP.Hmax,c)}
function pick(rnd,w){var s=0,k;for(k in w)s+=w[k];var r=rnd()*s;for(k in w){r-=w[k];if(r<=0)return k}return Object.keys(w)[0]}
var KIND_R={lily:1,sink:1,log:1.32,ice:1.08,move:.95,dock:1};
function padRadius(T,d,k){return lerp(T.r0,T.r1,d)*(KIND_R[k]||1)}
function mkPad(i,x,r,k,rnd){return{i:i,x:x,x0:x,r:r,k:k,lit:0,sink:0,sunk:false,sinking:false,ph:rnd()*6.28,flower:false,lamp:false,lampOn:false,amp:0,sp:.5,dx:0,dip:0,dv:0,arena:false}}

/* o: {seed,tier,n,d0,d1,kinds,en,en2,fire,lamps,enFrom,enMul,dock} */
function genTrack(o){
 var rnd=rng(o.seed),T=TIERS[o.tier],N=o.n,pads=[],ents=[],en=[],x=0,i,prev='lily',D0=o.d0||0,D1=o.d1==null?D0:o.d1,
  levels=[],lastPh=-1,ph;
 /* ритм: склеиваем фразы просветов */
 while(levels.length<N+2){do{ph=(rnd()*PHRASES.length)|0}while(ph===lastPh&&PHRASES.length>1);lastPh=ph;for(var q=0;q<PHRASES[ph].length;q++)levels.push(PHRASES[ph][q])}
 var p0=mkPad(0,0,Math.max(1.3,T.r0+.15),'lily',rnd);p0.lit=1;pads.push(p0);
 for(i=1;i<=N;i++){
  var prog=N>1?(i-1)/(N-1):0,d=clamp(lerp(D0,D1,prog),0,1),kind=i<=2?'lily':pick(rnd,o.kinds);
  if((kind==='sink'||kind==='move')&&prev===kind)kind='lily';
  if(kind==='ice'&&i<=3)kind='lily';
  var lamp=!!(o.lamps&&o.lamps.indexOf(i)>=0);if(lamp&&kind!=='log')kind='lily';
  var a=pads[i-1],r=padRadius(T,d,kind),lvl=levels[i]+(rnd()-.5)*.14;
  if(i<=2)lvl=Math.min(lvl,.3);
  lvl=clamp(lvl*lerp(.55,1,d),0,1);
  var edge=lerp(T.g0,T.g1,lvl),dist=a.r+r+edge;
  /* прыжок обязан быть досягаемым, а вода между кувшинками — видна */
  var amp=0;
  if(kind==='move'){amp=1+rnd()*.35}
  var aAmp=a.amp||0;
  dist=Math.min(dist,JUMP.Dmax*.93-amp-aAmp);dist=Math.max(dist,a.r+r+.7+amp+aAmp);
  x+=dist;
  var p=mkPad(i,x,r,kind,rnd);p.flower=rnd()<.18;p.lamp=lamp;
  if(kind==='move'){p.amp=amp;p.sp=.5+rnd()*.4}
  pads.push(p);prev=kind;
  /* светляки лежат на настоящей дуге прыжка — собирая их, ты рисуешь идеальный прыжок */
  var cnt=rnd()<(o.fire==null?.6:o.fire)?(3+(rnd()*3|0)):0,H=arcPeak(dist),j;
  for(j=0;j<cnt;j++){var s=(j+1)/(cnt+1);ents.push({k:'fire',x:lerp(a.x,x,s),y:.95+4*H*s*(1-s),ph:rnd()*6,got:0})}
  if(rnd()<.07&&i>3)ents.push({k:'petal',x:x,y:1.7,ph:rnd()*6,got:0});
  if(rnd()<.05&&i>2)ents.push({k:'carrot',x:lerp(a.x,x,.5),y:2.5,ph:rnd()*6,got:0});
  /* враги */
  if(i>=(o.enFrom||5)&&!lamp){
   var er=rnd(),ek=null,cum=0,k2;
   for(k2 in o.en){cum+=o.en[k2]*(o.enMul||1);if(er<cum){ek=k2;break}}
   if(ek){
    if(ek==='gnat')en.push({k:'gnat',x:x+2.2,y:1.4+rnd()*1.2,home:x+2.2,ph:rnd()*6,hp:1,st:'fly',t:0,vx:-(1.1+rnd()*.5),act:false});
    else en.push({k:'soldier',x:x+.4,y:2.9,home:x+.4,ph:rnd()*6,hp:1,st:'patrol',t:0,pad:i,cool:0,act:false})}}
 }
 /* новые бойцы: отдельный генератор, чтобы гонка и старые зерна остались ровно такими же (только сказка и ночной дозор) */
 if(o.en2){var r2=rng(((o.seed|0)^0x2f6b9d1)|0),last2=-9,ci,k4,cu,er2,ek2,p2,j2;
  for(ci=Math.max(3,o.enFrom||5);ci<=N;ci++){p2=pads[ci];er2=r2();cu=0;ek2=null;
   for(k4 in o.en2){cu+=o.en2[k4]*(o.enMul||1);if(er2<cu){ek2=k4;break}}
   var ph2=r2()*6,v2=r2(),w2=r2();
   if(!ek2||p2.lamp||ci-last2<3||(o.dock&&ci>=N))continue;
   if(ek2==='beetle'){if(p2.k==='sink'||p2.k==='move'||p2.r<1.15)continue;
    en.push({k:'beetle',x:p2.x,y:.5,home:p2.x,pad:ci,ox:0,ph:ph2,hp:2,st:'walk',t:0,cool:.4,act:false,dir:1});last2=ci}
   else if(ek2==='saw'){var sx=lerp(pads[ci-1].x,p2.x,.5)+6+v2*2;
    en.push({k:'saw',x:sx,y:2.2,y0:1.9+v2*.8,amp:.95+w2*.35,home:sx,ph:ph2,hp:1,st:'fly',t:0,vx:-(2.8+w2*.9),act:false});last2=ci}
   else if(ek2==='mortar'){if(ci<6)continue;
    en.push({k:'mortar',x:p2.x+7,y:4.1,home:p2.x+7,ph:ph2,hp:1,st:'idle',t:0,cool:1.0+v2*.8,shots:0,act:false});last2=ci+2}
   else if(ek2==='dropper'){
    en.push({k:'dropper',x:p2.x+(v2<.5?.9:-.9)*Math.min(1.1,p2.r*.7),y:7,home:p2.x,ph:ph2,hp:1,st:'hang',t:0,cool:0,act:false});last2=ci}}}
 var end=pads[pads.length-1].x;
 if(o.dock){var dk=mkPad(N+1,end+pads[N].r+2.2+1.6,2.2,'dock',rnd);dk.lit=1;dk.finish=true;pads.push(dk);end=dk.x}
 return{pads:pads,ents:ents,en:en,end:end}}
/* арена босса: n брёвен после x0 */
function genArena(x0,n,rnd){var pads=[],i,x=x0,r=1.45;
 for(i=0;i<n;i++){x+=(i?4.4:5.0);var p=mkPad(-1,x,r,'log',rnd);p.arena=true;pads.push(p)}return pads}
