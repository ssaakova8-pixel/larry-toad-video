/* ===== вид «Нити»: протяни нить между светляками одного цвета; нити не пересекаются ===== */
var FLCOL=['#ff5d6c','#4fc3ff','#ffd84a','#6be86b','#c77dff','#ff9a3c','#3df0d0','#ff7ad9'];
function flOrb(x,y,r,col,t,ph,on){g.save();g.translate(x,y);var f=.7+.3*Math.sin(t*4+ph);g.globalCompositeOperation='lighter';glow(g,0,0,r*(on?2.6:2),col,(on?.6:.38)*f);g.globalCompositeOperation='source-over';
 var w=Math.sin(t*30+ph)*.3;g.fillStyle='rgba(255,255,255,.55)';g.save();g.rotate(-.5+w);g.beginPath();g.ellipse(-r*.55,-r*.75,r*.5,r*.26,0,0,TAU);g.fill();g.restore();g.save();g.rotate(.5-w);g.beginPath();g.ellipse(r*.55,-r*.75,r*.5,r*.26,0,0,TAU);g.fill();g.restore();
 g.beginPath();g.arc(0,0,r,0,TAU);g.fillStyle=RG(g,-r*.3,-r*.3,r*.05,r*1.1,[0,'#ffffff',.35,col,1,sh(col,-.28)]);g.fill();g.lineWidth=Math.max(1.5,r*.12);g.strokeStyle='rgba(255,255,255,.85)';g.stroke();
 g.fillStyle='#1c1430';g.beginPath();g.arc(-r*.3,-r*.05,r*.13,0,TAU);g.arc(r*.3,-r*.05,r*.13,0,TAU);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(-r*.26,-r*.09,r*.045,0,TAU);g.arc(r*.34,-r*.09,r*.045,0,TAU);g.fill();
 g.restore()}
PZ.flow={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#1c1650',1,'#0a0828']);g.fillRect(x,y,w,h);for(var i=0;i<30;i++){g.fillStyle='rgba(190,180,255,'+(.08+hash2(i,5,1)*.14)+')';g.beginPath();g.arc(x+hash2(i,1,7)*w,y+hash2(i,2,8)*h,.6+hash2(i,3,9)*1.3,0,TAU);g.fill()}},
 asp:function(s){return{c:s.P.n,r:s.P.n,k:1}},
 init:function(L){var P0=FLOW.parse(L);return{P:P0,st:FLOW.clone(P0.st),drag:-1,head:-1,pushed:false,hm:null,busy:false,done:{},fx:[],lt:0}},
 snap:function(s){return{p:s.st.p.map(function(a){return a.slice()})}},
 rest:function(s,o){s.st.p=o.p.map(function(a){return a.slice()});s.drag=-1;s.done={};for(var k=0;k<s.st.p.length;k++)if(FLOW.done(s.P,s.st,k))s.done[k]=1},
 cell:function(s,B,p){var n=s.P.n,gx=Math.floor((p.x-B.ox)/B.cell),gy=Math.floor((p.y-B.oy)/B.cell);gx=Math.max(0,Math.min(n-1,gx));gy=Math.max(0,Math.min(n-1,gy));return gy*n+gx},
 cxy:function(B,i,n){return[B.ox+((i%n)+.5)*B.cell,B.oy+(((i/n)|0)+.5)*B.cell]},
 update:function(s,dt,P){for(var i=s.fx.length-1;i>=0;i--){s.fx[i].t+=dt;if(s.fx[i].t>.7)s.fx.splice(i,1)}},
 ensurePush:function(s){if(!s.pushed){pzPush();s.pushed=true}},
 down:function(s,p,B,P){var n=s.P.n,c=PZ.flow.cell(s,B,p),st=s.st,k=s.P.ep[c];s.pushed=false;s.drag=-1;
  if(k>=0){var path=st.p[k];if(!(path.length===1&&path[0]===c)){PZ.flow.ensurePush(s);st.p[k]=[c];delete s.done[k]}s.drag=k;s.head=c;sfx('tick');return}
  for(k=0;k<st.p.length;k++){var ix=st.p[k].indexOf(c);if(ix>=0){if(ix<st.p[k].length-1){PZ.flow.ensurePush(s);st.p[k].length=ix+1;delete s.done[k]}s.drag=k;s.head=c;return}}},
 step:function(s,B,k,nc){var P0=s.P,st=s.st,path=st.p[k],j,ix;
  if(path.length>=2&&path[path.length-2]===nc){PZ.flow.ensurePush(s);path.pop();delete s.done[k];return true}
  if(FLOW.done(P0,st,k))return false;
  var ep=P0.ep[nc];if(ep>=0&&ep!==k)return false;
  ix=path.indexOf(nc);if(ix>=0){PZ.flow.ensurePush(s);path.length=ix+1;return true}
  PZ.flow.ensurePush(s);
  for(j=0;j<st.p.length;j++){if(j===k)continue;ix=st.p[j].indexOf(nc);if(ix>=0){st.p[j].length=ix;delete s.done[j];var cc=PZ.flow.cxy(B,nc,P0.n);pfBurst(cc[0],cc[1],6,FLCOL[j%8],70,.4);sfx('nope')}}
  path.push(nc);
  if(ep===k&&FLOW.done(P0,st,k)){s.done[k]=1;var a=PZ.flow.cxy(B,FLOW.cell(P0,k,0),P0.n),b=PZ.flow.cxy(B,FLOW.cell(P0,k,1),P0.n);pfBurst(a[0],a[1],14,FLCOL[k%8],120,.8);pfBurst(b[0],b[1],14,FLCOL[k%8],120,.8);s.fx.push({k:k,t:0});sfx('perfect')}
  else if(performance.now()-s.lt>45){s.lt=performance.now();sfx('tick')}
  return true},
 move:function(s,p,B,P){if(s.drag<0)return;var n=s.P.n,t=PZ.flow.cell(s,B,p),guard=0;
  while(s.head!==t&&guard++<12){var hx=s.head%n,hy=(s.head/n)|0,tx=t%n,ty=(t/n)|0,dx=tx-hx,dy=ty-hy,nc;
   if(Math.abs(dx)>=Math.abs(dy))nc=hy*n+hx+(dx>0?1:-1);else nc=(hy+(dy>0?1:-1))*n+hx;
   if(!PZ.flow.step(s,B,s.drag,nc))break;s.head=nc}},
 up:function(s){s.drag=-1;s.pushed=false},
 pick:function(s){var P0=s.P,k,sol=P0.sol;if(!sol)return -1;
  for(k=0;k<sol.length;k++){if(!FLOW.done(P0,s.st,k))return k}
  for(k=0;k<sol.length;k++){if(s.st.p[k].join()!==sol[k].join()&&s.st.p[k].slice().reverse().join()!==sol[k].join())return k}
  return -1},
 hint:function(s){var k=PZ.flow.pick(s);if(k<0)return null;return{mark:{k:k},say:'Вот как провести нить этого цвета. Веди пальцем от светляка по точкам.'}},
 auto:function(s,B){var k=PZ.flow.pick(s);if(k<0)return null;var n=s.P.n,pts=s.P.sol[k].map(function(i){return PZ.flow.cxy(B,i,n)});return[{t:'drag',pts:pts}]},
 won:function(s){return FLOW.won(s.P,s.st)},
 badge:function(s){var P0=s.P;return{n:P0.pairs.length,k:Object.keys(s.done).length,draw:function(x,y,r,i){flOrb(x,y,r*.9,FLCOL[i%8],P?P.t:0,i,FLOW.done(P0,s.st,i))}}},
 draw:function(s,B,t,PP){var P0=s.P,n=P0.n,cell=B.cell,st=s.st,i,k,j;
  var cov={};for(k=0;k<st.p.length;k++)for(j=0;j<st.p[k].length;j++)cov[st.p[k][j]]=k;
  for(i=0;i<n*n;i++){var c=PZ.flow.cxy(B,i,n),x0=c[0]-cell/2,y0=c[1]-cell/2;rr(x0+2,y0+2,cell-4,cell-4,cell*.16);g.fillStyle=cov[i]!=null?hexA(FLCOL[cov[i]%8],.2):'rgba(255,255,255,.05)';g.fill();g.lineWidth=1;g.strokeStyle='rgba(190,180,255,.18)';g.stroke()}
  g.lineCap='round';g.lineJoin='round';
  for(k=0;k<st.p.length;k++){var pa=st.p[k];if(pa.length<2)continue;var col=FLCOL[k%8];
   g.beginPath();for(j=0;j<pa.length;j++){var q=PZ.flow.cxy(B,pa[j],n);j?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])}
   g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=cell*.38;g.stroke();g.strokeStyle=col;g.lineWidth=cell*.3;g.stroke();g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=cell*.08;g.stroke()}
  if(s.hm&&s.hm.k>=0&&P0.sol){var hp=P0.sol[s.hm.k],pu=.5+.5*Math.sin(t*6);g.save();g.setLineDash([cell*.12,cell*.16]);g.lineDashOffset=-t*cell*.6;g.beginPath();for(j=0;j<hp.length;j++){var q2=PZ.flow.cxy(B,hp[j],n);j?g.lineTo(q2[0],q2[1]):g.moveTo(q2[0],q2[1])}g.strokeStyle='rgba(255,255,255,'+(.6+.35*pu)+')';g.lineWidth=cell*.14;g.stroke();g.restore();var h0=PZ.flow.cxy(B,hp[0],n);hintRing(h0[0],h0[1],cell*.5,t)}
  for(k=0;k<P0.pairs.length;k++){for(var e=0;e<2;e++){var q3=PZ.flow.cxy(B,FLOW.cell(P0,k,e),n);flOrb(q3[0],q3[1],cell*.3,FLCOL[k%8],t,k+e*2,!!s.done[k])}}
  if(s.drag>=0&&s.head>=0){var hc=PZ.flow.cxy(B,s.head,n);g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=3;g.beginPath();g.arc(hc[0],hc[1],cell*.36,0,TAU);g.stroke()}
  for(i=0;i<s.fx.length;i++){var f=s.fx[i],a=P0.sol?0:0;var kk=f.t/.7;var p0=st.p[f.k];if(!p0||!p0.length)continue;for(j=0;j<2;j++){var ee=PZ.flow.cxy(B,FLOW.cell(P0,f.k,j),n);g.strokeStyle='rgba(255,255,255,'+(.8*(1-kk))+')';g.lineWidth=3;g.beginPath();g.arc(ee[0],ee[1],cell*(.3+kk*.4),0,TAU);g.stroke()}}}
};
