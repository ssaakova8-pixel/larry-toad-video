/* ===== вид «Шестерни»: передай вращение синего колеса золотому =====
   Колышки лежат на целочисленной сетке. Две шестерни сцепляются, когда расстояние между центрами равно сумме радиусов,
   и налезают друг на друга, когда меньше. Соседние колёса крутятся в разные стороны: у золотого колеса стрелка показывает,
   куда оно должно вращаться, — так что считать колёса в цепочке придётся. Каждая доска строится случайной цепочкой по зерну,
   поэтому решение есть всегда (его же и показывает подсказка). */
var GEAR_W=1.25;
LV.gears=[
 {w:6,h:3,n:1,rad:[1],dec:0,hole:0,need:0,seed:11},
 {w:7,h:3,n:2,rad:[1,2],dec:1,hole:0,need:0,seed:23},
 {w:7,h:4,n:2,rad:[1,2],dec:1,hole:1,need:1,seed:37},
 {w:8,h:4,n:3,rad:[1,2],dec:1,hole:2,need:1,seed:41},
 {w:8,h:4,n:3,rad:[1,2],dec:2,hole:2,need:1,seed:59},
 {w:8,h:5,n:3,rad:[1,2,3],dec:2,hole:2,need:1,seed:61},
 {w:9,h:5,n:4,rad:[1,2,3],dec:2,hole:3,need:1,seed:73},
 {w:9,h:5,n:4,rad:[1,2,3],dec:3,hole:3,need:1,seed:89},
 {w:9,h:6,n:4,rad:[1,2,3],dec:3,hole:4,need:1,seed:97},
 {w:9,h:6,n:5,rad:[1,2,3],dec:3,hole:4,need:1,seed:101},
 {w:9,h:6,n:5,rad:[1,2,3],dec:4,hole:5,need:1,seed:113},
 {w:9,h:6,n:5,rad:[1,2,2,3],dec:5,hole:6,need:1,seed:131}];
var GEAR_EPS=1e-6;
function gearOk(L,x,y,rd){return x>=rd-1&&x<=L.w-rd&&y>=rd-1&&y<=L.h-rd}
/* доска строится цепочкой: мотор → n колёс → золотое колесо; решение хранится в sol */
function gearsGen(L){
 var r=rng(L.seed*7919+13),tries=0,W=L.w,H=L.h,out=null,i,k;
 function pickR(){return L.rad[(r()*L.rad.length)|0]}
 while(tries++<2500&&!out){
  var rm=L.rad[(r()*Math.min(2,L.rad.length))|0],M={x:0,y:0,r:rm};
  M.x=rm-1+((r()*2)|0);M.y=rm-1+((r()*(H-2*rm+2))|0);if(!gearOk(L,M.x,M.y,rm))continue;
  var pl=[M],cur=M,ok=true;
  for(k=0;k<=L.n&&ok;k++){
   var rd=pickR(),dirs=[[1,0],[1,0],[1,0],[0,1],[0,-1],[-1,0]],j,placed=false;
   for(j=dirs.length-1;j>0;j--){var q=(r()*(j+1))|0,tmp=dirs[j];dirs[j]=dirs[q];dirs[q]=tmp}
   for(j=0;j<dirs.length&&!placed;j++){var nx=cur.x+dirs[j][0]*(cur.r+rd),ny=cur.y+dirs[j][1]*(cur.r+rd);if(!gearOk(L,nx,ny,rd))continue;
    var bad=false;for(i=0;i<pl.length;i++){var o=pl[i];if(o===cur)continue;if(Math.hypot(o.x-nx,o.y-ny)<o.r+rd+GEAR_EPS){bad=true;break}}
    if(bad)continue;var ng={x:nx,y:ny,r:rd};pl.push(ng);cur=ng;placed=true}
   if(!placed)ok=false}
  if(!ok)continue;
  var T=pl[pl.length-1],chain=pl.slice(1,pl.length-1);
  if(tries<1200&&Math.abs(T.x-M.x)+Math.abs(T.y-M.y)<(L.n>1?5:3))continue;
  var holes=[],hg=0;
  while(holes.length<L.hole&&hg++<200){var hx=(r()*W)|0,hy=(r()*H)|0,bad2=false;
   for(i=0;i<pl.length;i++)if(pl[i].x===hx&&pl[i].y===hy)bad2=true;
   for(i=0;i<holes.length;i++)if(holes[i][0]===hx&&holes[i][1]===hy)bad2=true;
   if(!bad2)holes.push([hx,hy])}
  var tray=chain.map(function(c){return c.r}),d0;for(d0=0;d0<L.dec;d0++)tray.push(pickR());
  for(i=tray.length-1;i>0;i--){var q2=(r()*(i+1))|0,t2=tray[i];tray[i]=tray[q2];tray[q2]=t2}
  out={M:M,T:T,chain:chain,holes:holes,tray:tray,need:L.need?((L.n+1)%2===0?1:-1):0}}
 if(!out){var yy=Math.min(1,H-1);out={M:{x:0,y:yy,r:1},T:{x:2*(L.n+1),y:yy,r:1},chain:[],holes:[],tray:[],need:0};
  for(i=1;i<=L.n;i++){out.chain.push({x:2*i,y:yy,r:1});out.tray.push(1)}
  if(out.T.x>W-1){out.T.x=W-1}}
 return out}
function gearHole(s,x,y){for(var i=0;i<s.holes.length;i++)if(s.holes[i][0]===x&&s.holes[i][1]===y)return true;return false}
function gearPlaced(it){return it.x!=null}
/* можно ли поставить шестерню it в колышек (x,y)? */
function gearCan(s,it,x,y){if(!gearOk(s.L,x,y,it.r)||gearHole(s,x,y))return false;
 for(var i=0;i<s.items.length;i++){var o=s.items[i];if(o===it||!gearPlaced(o))continue;if(Math.hypot(o.x-x,o.y-y)<o.r+it.r-GEAR_EPS)return false}return true}
/* сеть сцепленных колёс от мотора: направления, порядок обхода, заклинивание */
function gearsNet(s){var dir={},par={},order=[],jam=false,M=s.items[0],T=s.items[1],q=[M],pl=s.items.filter(gearPlaced),i;
 dir[M.id]=1;order.push(M);
 while(q.length){var a=q.shift();for(i=0;i<pl.length;i++){var b=pl[i];if(b===a)continue;
  if(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-(a.r+b.r))<GEAR_EPS){
   if(dir[b.id]===undefined){dir[b.id]=-dir[a.id];par[b.id]=a;order.push(b);q.push(b)}else if(dir[b.id]===dir[a.id])jam=true}}}
 return{dir:dir,par:par,order:order,jam:jam,tOn:dir[T.id]!==undefined,td:dir[T.id]||0}}
function gearsAngles(s,net,tm){var ang={},i;ang[s.items[0].id]=GEAR_W*tm;
 for(i=1;i<net.order.length;i++){var b=net.order[i],a=net.par[b.id],ph=Math.atan2(b.y-a.y,b.x-a.x),nA=8*a.r,nB=8*b.r;ang[b.id]=ph+PI-PI/nB-(nA/nB)*(ang[a.id]-ph)}
 return ang}
function gearBody(cx,cy,R,n,a,h){var p=TAU/n,Ro=R+h*.5,Ri=R-h*.5,i;g.beginPath();
 for(i=0;i<n;i++){var t0=a+i*p;
  g.lineTo(cx+Math.cos(t0-.32*p)*Ri,cy+Math.sin(t0-.32*p)*Ri);g.lineTo(cx+Math.cos(t0-.15*p)*Ro,cy+Math.sin(t0-.15*p)*Ro);
  g.lineTo(cx+Math.cos(t0+.15*p)*Ro,cy+Math.sin(t0+.15*p)*Ro);g.lineTo(cx+Math.cos(t0+.32*p)*Ri,cy+Math.sin(t0+.32*p)*Ri)}
 g.closePath()}
var GCOL={M:['#cfe6ff','#5f93d0','#2a4a78'],T:['#fff1b0','#f0b92e','#8a5a00'],C:['#f6c995','#c47f45','#6a3a18']};
/* одна шестерня: cx,cy — центр, R — радиус по делительной окружности, k — 'M'|'T'|'C' */
function gzDraw(cx,cy,R,n,a,k,o){o=o||{};var C=GCOL[k],h,i;
 h=Math.min(R*.28,Math.max(5,(o.cell||40)*.2));
 g.save();
 if(o.shadow){g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=o.shadow;g.shadowOffsetY=o.shadow*.35}
 gearBody(cx,cy,R,n,a,h);g.fillStyle=RG(g,cx-R*.35,cy-R*.4,R*.05,R*1.25,[0,C[0],.55,C[1],1,C[2]]);g.fill();g.shadowColor='transparent';
 g.lineWidth=Math.max(1.5,R*.04);g.strokeStyle=o.jam?'#ff5a4a':'rgba(30,16,4,.85)';g.lineJoin='round';g.stroke();
 /* внутренний венец и спицы */
 var rin=R*.72;g.beginPath();g.arc(cx,cy,rin,0,TAU);g.fillStyle='rgba(20,10,2,.55)';g.fill();g.strokeStyle='rgba(255,240,200,.35)';g.lineWidth=Math.max(1,R*.03);g.stroke();
 var sp=R>(o.cell||40)*1.5?6:R>(o.cell||40)*.8?5:4;g.strokeStyle=C[1];g.lineWidth=Math.max(3,R*.17);g.lineCap='round';
 for(i=0;i<sp;i++){var sa=a+i*TAU/sp;g.beginPath();g.moveTo(cx+Math.cos(sa)*R*.2,cy+Math.sin(sa)*R*.2);g.lineTo(cx+Math.cos(sa)*rin*.95,cy+Math.sin(sa)*rin*.95);g.stroke()}
 g.strokeStyle='rgba(255,255,255,.3)';g.lineWidth=Math.max(1,R*.04);
 for(i=0;i<sp;i++){var sb=a+i*TAU/sp;g.beginPath();g.moveTo(cx+Math.cos(sb)*R*.2-R*.04,cy+Math.sin(sb)*R*.2-R*.04);g.lineTo(cx+Math.cos(sb)*rin*.9-R*.04,cy+Math.sin(sb)*rin*.9-R*.04);g.stroke()}
 /* втулка */
 g.beginPath();g.arc(cx,cy,R*.24,0,TAU);g.fillStyle=RG(g,cx-R*.07,cy-R*.07,R*.02,R*.3,[0,C[0],1,C[2]]);g.fill();g.strokeStyle='rgba(30,16,4,.9)';g.lineWidth=Math.max(1.5,R*.04);g.stroke();
 g.beginPath();g.arc(cx+Math.cos(a)*R*.1,cy+Math.sin(a)*R*.1,R*.05,0,TAU);g.fillStyle='rgba(30,16,4,.8)';g.fill();
 if(k==='M'){/* рукоять мотора */g.strokeStyle='#d8b060';g.lineWidth=Math.max(2,R*.07);g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*R*.5,cy+Math.sin(a)*R*.5);g.stroke();g.beginPath();g.arc(cx+Math.cos(a)*R*.5,cy+Math.sin(a)*R*.5,R*.09,0,TAU);g.fillStyle='#ffe9a0';g.fill()}
 g.restore()}
function gearArrow(cx,cy,R,dir,col,lw){g.save();g.strokeStyle=col;g.fillStyle=col;g.lineWidth=lw;g.lineCap='round';var a0=-2.35,a1=.35,ar=R*.48;
 g.beginPath();if(dir>0)g.arc(cx,cy,ar,a0,a1);else g.arc(cx,cy,ar,a1,a0,true);g.stroke();
 var ea=dir>0?a1:a0,ex=cx+Math.cos(ea)*ar,ey=cy+Math.sin(ea)*ar,tg=ea+(dir>0?PI/2:-PI/2),hs=lw*1.9;
 g.beginPath();g.moveTo(ex+Math.cos(tg)*hs,ey+Math.sin(tg)*hs);g.lineTo(ex+Math.cos(tg+2.5)*hs,ey+Math.sin(tg+2.5)*hs);g.lineTo(ex+Math.cos(tg-2.5)*hs,ey+Math.sin(tg-2.5)*hs);g.closePath();g.fill();g.restore()}
function gearGeo(s,B){var cell=B.cell,c=s.L.w+1.3,gw=c*cell,ty0=B.oy+(s.L.h+1.3)*cell,th=2.3*cell,tr=s.items.filter(function(it){return !gearPlaced(it)&&it.id>1&&!(s.drag&&s.drag.it===it)}),tot=0,i;
 var all=s.items.filter(function(it){return it.id>1&&(!gearPlaced(it)||(s.drag&&s.drag.it===it&&s.drag.fromTray))});
 for(i=0;i<all.length;i++)tot+=2*all[i].r+.7;
 var u=Math.min(cell*.36,gw*.94/Math.max(1,tot)),x=B.ox+(gw-tot*u)/2,slots={};
 for(i=0;i<all.length;i++){var w=(2*all[i].r+.7)*u;slots[all[i].id]={x:x+w/2,y:ty0+th*.5,r:all[i].r*u};x+=w}
 return{ty0:ty0,th:th,gw:gw,slots:slots,u:u}}
function gearPeg(B,x,y){return[B.ox+(x+1.15)*B.cell,B.oy+(y+1.15)*B.cell]}
PZ.gears={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#2e3138',1,'#14161a']);g.fillRect(x,y,w,h);g.strokeStyle='rgba(255,255,255,.04)';g.lineWidth=1;for(var i=0;i<w;i+=14){g.beginPath();g.moveTo(x+i,y);g.lineTo(x+i,y+h);g.stroke()}},
 asp:function(s){return{c:s.L.w+1.3,r:s.L.h+1.3+2.3,k:1}},
 init:function(L){var G=gearsGen(L),items=[],id=2,i;
  items.push({id:0,r:G.M.r,x:G.M.x,y:G.M.y,fx:'M'});items.push({id:1,r:G.T.r,x:G.T.x,y:G.T.y,fx:'T'});
  for(i=0;i<G.tray.length;i++)items.push({id:id++,r:G.tray[i],x:null,y:null,fx:null});
  var s={L:L,G:G,items:items,holes:G.holes,need:G.need,tm:0,t:0,drag:null,hm:null,net:null,ang:{},wasOn:false,said:0,wrongT:0};
  s.net=gearsNet(s);return s},
 snap:function(s){return{p:s.items.map(function(it){return[it.x,it.y]})}},
 rest:function(s,o){for(var i=0;i<s.items.length;i++){s.items[i].x=o.p[i][0];s.items[i].y=o.p[i][1]}s.drag=null;s.net=gearsNet(s)},
 update:function(s,dt,P){s.t+=dt;s.net=gearsNet(s);if(!s.net.jam)s.tm+=dt;s.ang=gearsAngles(s,s.net,s.tm);
  var on=s.net.tOn&&!s.net.jam;
  if(on&&!s.wasOn){sfx('bell');var T=s.items[1],B=P.B;if(B){var c=gearPeg(B,T.x,T.y);pfBurst(c[0],c[1],10,'#ffe27a',160,.8)}
   if(s.need&&s.net.td!==s.need&&!P.win&&s.said<3){s.said++;pzSay('krap','Золотое колесо крутится не в ту сторону. Помни: каждое следующее колесо вращается наоборот.',5.5);P.mood='worry'}}
  if(!on&&s.net.jam&&!s.jamSaid){s.jamSaid=1;pzSay('krap','Колёса заклинило: три колеса не могут вращать друг друга по кругу. Убери лишнее.',5)}
  if(!s.net.jam)s.jamSaid=0;
  s.wasOn=on;if(s.wrongT>0)s.wrongT-=dt},
 pegAt:function(s,B,px,py){var gx=Math.round((px-B.ox)/B.cell-1.15),gy=Math.round((py-B.oy)/B.cell-1.15);return[gx,gy]},
 down:function(s,p,B,P){var geo=gearGeo(s,B),i,best=null,bd=1e9;
  for(i=2;i<s.items.length;i++){var it=s.items[i],cx,cy,rad;
   if(gearPlaced(it)){var c=gearPeg(B,it.x,it.y);cx=c[0];cy=c[1];rad=it.r*B.cell}else{var sl=geo.slots[it.id];if(!sl)continue;cx=sl.x;cy=sl.y;rad=Math.max(sl.r*1.35,B.cell*.72)}
   var d=Math.hypot(p.x-cx,p.y-cy);if(d<rad&&d<bd){bd=d;best=it}}
  if(!best)return;
  var snap=PZ.gears.snap(s),fromTray=!gearPlaced(best);
  s.drag={it:best,x:p.x,y:p.y,x0:p.x,y0:p.y,moved:false,fromTray:fromTray,snap:snap,px:best.x,py:best.y};
  if(!fromTray){best.x=null;best.y=null}
  s.hm=null;sfx('tick')},
 move:function(s,p,B,P){if(!s.drag)return;s.drag.x=p.x;s.drag.y=p.y;if(Math.hypot(p.x-s.drag.x0,p.y-s.drag.y0)>B.cell*.2)s.drag.moved=true},
 up:function(s,p,B,P){var d=s.drag;if(!d)return;s.drag=null;var it=d.it,pg=PZ.gears.pegAt(s,B,d.x,d.y-B.cell*.9),geo=gearGeo(s,B);
  if(!d.moved&&!d.fromTray){/* тап по поставленной шестерне — убрать в ящик */P.hist.push(d.snap);P.moves++;P.idle=0;sfx('back');s.net=gearsNet(s);return}
  if(d.y>geo.ty0+B.cell*.1){/* отпустили над ящиком — шестерня возвращается */if(!d.fromTray){P.hist.push(d.snap);P.moves++}sfx('back');s.net=gearsNet(s);return}
  if(gearCan(s,it,pg[0],pg[1])){it.x=pg[0];it.y=pg[1];P.hist.push(d.snap);if(P.hist.length>400)P.hist.shift();P.moves++;P.idle=0;sfx('tick');
   var c=gearPeg(B,it.x,it.y);pfBurst(c[0],c[1],6,'#ffd9a0',90,.5);s.net=gearsNet(s)}
  else{/* вернуть: на прежний колышек, если не двигали; иначе в ящик */
   if(!d.fromTray){it.x=d.px;it.y=d.py;if(d.moved)sfx('nope')}
   else sfx('nope');
   s.net=gearsNet(s)}},
 hint:function(s){var sol=s.G.chain,i,j,it;
  for(i=0;i<sol.length;i++){var g0=sol[i],have=null;
   for(j=2;j<s.items.length;j++){it=s.items[j];if(gearPlaced(it)&&it.x===g0.x&&it.y===g0.y&&it.r===g0.r)have=it}
   if(have)continue;
   /* занято чужой шестернёй? */
   for(j=2;j<s.items.length;j++){it=s.items[j];if(gearPlaced(it)&&it!==have&&Math.hypot(it.x-g0.x,it.y-g0.y)<it.r+g0.r-GEAR_EPS&&!(it.x===g0.x&&it.y===g0.y&&it.r===g0.r))return{mark:{rm:it.id},say:'Эта шестерня мешает. Убери её — тапни по ней.'}}
   var cand=null;for(j=2;j<s.items.length;j++){it=s.items[j];if(it.r===g0.r&&!gearPlaced(it)){cand=it;break}}
   if(!cand)for(j=2;j<s.items.length;j++){it=s.items[j];if(it.r===g0.r&&gearPlaced(it)&&!sol.some(function(q){return q.x===it.x&&q.y===it.y&&q.r===it.r})){cand=it;break}}
   if(cand)return{mark:{id:cand.id,x:g0.x,y:g0.y,r:g0.r},say:'Поставь шестерню такого размера сюда: зубцы должны сцепиться с соседними.'}}
  return{mark:null,say:'Всё стоит верно. Подожди, пока колесо раскрутится.'}},
 won:function(s){var n=s.net;return !!(n&&n.tOn&&!n.jam&&(!s.need||n.td===s.need))},
 draw:function(s,B,t,P){var cell=B.cell,W=s.L.w,H=s.L.h,i,j,geo=gearGeo(s,B),win=P&&P.win;
  /* колышки и ржавые заглушки */
  for(j=0;j<H;j++)for(i=0;i<W;i++){var c=gearPeg(B,i,j);
   if(gearHole(s,i,j)){g.beginPath();g.arc(c[0],c[1],cell*.2,0,TAU);g.fillStyle='#3a1c10';g.fill();g.strokeStyle='#7a4020';g.lineWidth=2;g.stroke();g.strokeStyle='#a05a2a';g.lineWidth=2;g.beginPath();g.moveTo(c[0]-cell*.08,c[1]-cell*.08);g.lineTo(c[0]+cell*.08,c[1]+cell*.08);g.moveTo(c[0]+cell*.08,c[1]-cell*.08);g.lineTo(c[0]-cell*.08,c[1]+cell*.08);g.stroke()}
   else{g.beginPath();g.arc(c[0],c[1],cell*.07,0,TAU);g.fillStyle='rgba(230,200,140,.45)';g.fill();g.beginPath();g.arc(c[0],c[1],cell*.1,0,TAU);g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1.5;g.stroke()}}
  /* шестерни: большие снизу */
  var pl=s.items.filter(gearPlaced).sort(function(a,b){return b.r-a.r}),net=s.net;
  for(i=0;i<pl.length;i++){var it=pl[i],c2=gearPeg(B,it.x,it.y),on=net.dir[it.id]!==undefined,a=on?s.ang[it.id]:(it.id*.7);
   var jit=net.jam&&on?Math.sin(t*50+it.id)*1.5:0,k=it.fx||'C';
   if(it.fx==='T'&&on&&!net.jam&&(win||(s.need===0||net.td===s.need)))glow(g,c2[0],c2[1],cell*it.r*2.2,'#ffe27a',.55+.2*Math.sin(t*6));
   gzDraw(c2[0]+jit,c2[1],it.r*cell,8*it.r,a,k,{cell:cell,jam:net.jam&&on});
   if(it.fx==='T'&&s.need){var okd=on&&net.td===s.need&&!net.jam,bad=on&&net.td!==s.need,col=okd?'#7dff9a':bad?'#ff6a5a':'rgba(40,24,6,.9)';
    gearArrow(c2[0],c2[1],it.r*cell,s.need,'rgba(0,0,0,.6)',Math.max(4,cell*.12));gearArrow(c2[0],c2[1],it.r*cell,s.need,okd||bad?col:'#fff6c8',Math.max(2.5,cell*.075))}}
  /* ящик с шестернями */
  var tx=B.ox,ty=geo.ty0,tw=geo.gw,th=geo.th;
  g.save();rr(tx+4,ty+4,tw-8,th-8,cell*.25);g.fillStyle='rgba(8,6,4,.62)';g.fill();g.strokeStyle='rgba(200,150,80,.55)';g.lineWidth=2.5;g.stroke();
  g.beginPath();g.rect(tx+10,ty+th*.5-1,tw-20,2);g.fillStyle='rgba(255,220,150,.08)';g.fill();g.restore();
  for(var id in geo.slots){var sl=geo.slots[id],itm=s.items[+id];if(!itm||gearPlaced(itm))continue;if(s.drag&&s.drag.it===itm)continue;
   gzDraw(sl.x,sl.y,sl.r,8*itm.r,t*.6*(itm.id%2?1:-1),'C',{cell:sl.r/itm.r})}
  /* подсказка */
  if(s.hm){var h=s.hm;
   if(h.rm!=null){var rit=s.items[h.rm];if(rit&&gearPlaced(rit)){var rc=gearPeg(B,rit.x,rit.y);hintRing(rc[0],rc[1],rit.r*cell*.9,t)}}
   else if(h.x!=null){var hc=gearPeg(B,h.x,h.y);g.save();g.setLineDash([6,6]);g.strokeStyle='rgba(255,240,170,.85)';g.lineWidth=2.5;g.beginPath();g.arc(hc[0],hc[1],h.r*cell,0,TAU);g.stroke();g.restore();hintRing(hc[0],hc[1],cell*.5,t);
    var sl2=geo.slots[h.id];if(sl2)hintRing(sl2.x,sl2.y,Math.max(sl2.r,cell*.45)*1.05,t)}}
  /* перетаскиваемая шестерня: полупрозрачная тень на ближайшем колышке и сама шестерня над пальцем */
  if(s.drag){var d=s.drag,dit=d.it,vy=d.y-cell*.9,pg=PZ.gears.pegAt(s,B,d.x,vy),can=gearCan(s,dit,pg[0],pg[1]);
   if(pg[0]>=0&&pg[1]>=0&&pg[0]<W&&pg[1]<H){var pc=gearPeg(B,pg[0],pg[1]);g.save();g.globalAlpha=.55;g.setLineDash([5,5]);g.strokeStyle=can?'#9dffb0':'#ff7a6a';g.lineWidth=2.5;g.beginPath();g.arc(pc[0],pc[1],dit.r*cell,0,TAU);g.stroke();g.restore()}
   gzDraw(d.x,vy,dit.r*cell,8*dit.r,t*2,'C',{cell:cell,shadow:14})}}
};
