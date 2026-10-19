/* ===== вид «Зеркала»: луч от лампы Крапинки; кристаллы поворачиваются тапом; зажечь все фонарики ===== */
PZ.mirror={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#241a4a',1,'#0c0824']);g.fillRect(x,y,w,h);for(var i=0;i<40;i++){g.fillStyle='rgba(200,190,255,'+(.08+hash2(i,3,1)*.18)+')';g.beginPath();g.arc(x+hash2(i,1,2)*w,y+hash2(i,2,3)*h,.6+hash2(i,4,4)*1.4,0,TAU);g.fill()}},
 asp:function(s){return{c:s.P.w,r:s.P.h,k:1}},
 init:function(L){var P0=MIR.parse(L);var ang=[];P0.kind.forEach(function(k,i){ang[i]=P0.st.o[i]});return{P:P0,st:MIR.clone(P0.st),ang:ang,hm:null,lit:{},busy:false,lc:0,rip:[]}},
 snap:function(s){return{o:s.st.o.slice()}},
 rest:function(s,o){s.st.o=o.o.slice();s.lit={}},
 cxy:function(B,x,y){return[B.ox+(x+.5)*B.cell,B.oy+(y+.5)*B.cell]},
 update:function(s,dt,P){var P0=s.P,i;for(i=0;i<P0.kind.length;i++){if(P0.kind[i]===2||P0.kind[i]===3){var tg=s.st.o[i];s.ang[i]+=(tg-s.ang[i])*Math.min(1,dt*16);if(Math.abs(tg-s.ang[i])<.01)s.ang[i]=tg}}
  var tr=MIR.trace(P0,s.st),n=0,B=P.B;for(i=0;i<P0.tg.length;i++){var ti=P0.tg[i];if(tr.lit[ti]){n++;if(!s.lit[ti]){s.lit[ti]=1;if(B){var c=PZ.mirror.cxy(B,ti%P0.w,(ti/P0.w)|0);pfBurst(c[0],c[1],12,'#ffe27a',130,.8);sfx('fire',Math.min(9,n-1))}}}else if(s.lit[ti])delete s.lit[ti]}
  for(i=s.rip.length-1;i>=0;i--){s.rip[i].t+=dt;if(s.rip[i].t>.6)s.rip.splice(i,1)}},
 down:function(s,p,B,P){var P0=s.P,gx=Math.floor((p.x-B.ox)/B.cell),gy=Math.floor((p.y-B.oy)/B.cell);if(gx<0||gy<0||gx>=P0.w||gy>=P0.h)return;var i=gy*P0.w+gx,c=PZ.mirror.cxy(B,gx,gy);
  if(P0.kind[i]===2){pzPush();s.st.o[i]^=1;sfx('tick');s.rip.push({x:c[0],y:c[1],t:0})}
  else if(P0.kind[i]===3){sfx('nope');pzSay('krap','Этот кристалл приварен к стене — его не повернуть.',3.2)}
  else{s.rip.push({x:c[0],y:c[1],t:0})}},
 hint:function(s,L){var sol=MIR.solve(s.P,s.st);if(!sol)return null;if(!sol.length)return{mark:null,say:'Всё уже горит!'};var i=sol[0];return{mark:{x:i%s.P.w,y:(i/s.P.w)|0},say:'Поверни вот этот кристалл — тапни по нему.'}},
 auto:function(s,B,L){var h=PZ.mirror.hint(s,L);if(!h||!h.mark)return null;var c=PZ.mirror.cxy(B,h.mark.x,h.mark.y);return[{t:'tap',x:c[0],y:c[1]}]},
 won:function(s){return MIR.won(s.P,s.st)},
 badge:function(s){return{n:s.P.tg.length,k:Object.keys(s.lit).length,draw:function(x,y,r,i){drawLanternMini(x,y+r*.4,r*1.5,(i<Object.keys(s.lit).length),P?P.t:0)}}},
 draw:function(s,B,t,PP){var P0=s.P,cell=B.cell,x,y,i;
  /* сетка */
  g.strokeStyle='rgba(180,160,255,.1)';g.lineWidth=1;for(x=0;x<=P0.w;x++){g.beginPath();g.moveTo(B.ox+x*cell,B.oy);g.lineTo(B.ox+x*cell,B.oy+P0.h*cell);g.stroke()}for(y=0;y<=P0.h;y++){g.beginPath();g.moveTo(B.ox,B.oy+y*cell);g.lineTo(B.ox+P0.w*cell,B.oy+y*cell);g.stroke()}
  /* луч */
  var tr=MIR.trace(P0,s.st);g.save();g.globalCompositeOperation='lighter';g.lineCap='round';
  for(var pass=0;pass<3;pass++){g.lineWidth=[cell*.3,cell*.13,cell*.045][pass];g.strokeStyle=['rgba(255,220,120,.12)','rgba(255,225,140,.35)','rgba(255,255,235,.95)'][pass];
   g.beginPath();var sc=PZ.mirror.cxy(B,P0.sx,P0.sy);g.moveTo(sc[0],sc[1]);var lx=sc[0],ly=sc[1];
   tr.segs.forEach(function(sg){var a=PZ.mirror.cxy(B,sg[2],sg[3]),ex=a[0],ey=a[1];if(sg[5]===1){ex=lx+MIR.DX[sg[4]]*cell*.5;ey=ly+MIR.DY[sg[4]]*cell*.5}else if(sg[5]===2){ex=a[0]-MIR.DX[sg[4]]*cell*.5;ey=a[1]-MIR.DY[sg[4]]*cell*.5}g.lineTo(ex,ey);lx=a[0];ly=a[1]});g.stroke()}
  g.restore();
  /* клетки */
  for(y=0;y<P0.h;y++)for(x=0;x<P0.w;x++){i=y*P0.w+x;var k=P0.kind[i],c=PZ.mirror.cxy(B,x,y);
   if(k===1){g.save();g.translate(c[0],c[1]);rr(-cell*.46,-cell*.46,cell*.92,cell*.92,cell*.14);g.fillStyle=LG(g,0,-cell*.46,0,cell*.46,[0,'#5a4c86',1,'#2c2350']);g.fill();g.lineWidth=2;g.strokeStyle='#150f30';g.stroke();g.strokeStyle='rgba(255,255,255,.14)';g.beginPath();g.moveTo(-cell*.36,-cell*.3);g.lineTo(cell*.3,-cell*.36);g.stroke();g.beginPath();g.moveTo(-cell*.2,cell*.1);g.lineTo(cell*.1,cell*.2);g.lineTo(cell*.3,cell*.05);g.stroke();g.restore()}
   else if(k===2||k===3){PZ.mirror.crystal(c[0],c[1],cell,s.ang[i],k===3,t,i)}
   else if(k===4){var on=!!s.lit[i];drawLanternMini(c[0],c[1]+cell*.3,cell*.72,on,t)}
   else if(k===5){PZ.mirror.lamp(c[0],c[1],cell,P0.sd,t)}}
  for(i=0;i<s.rip.length;i++){var q=s.rip[i],kk=q.t/.6;g.strokeStyle='rgba(255,255,255,'+(.6*(1-kk))+')';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,cell*(.2+kk*.3),0,TAU);g.stroke()}
  if(s.hm){var hc=PZ.mirror.cxy(B,s.hm.x,s.hm.y);hintRing(hc[0],hc[1],cell*.52,t)}},
 crystal:function(x,y,cell,ang,fixed,t,i){var r=cell*.4;g.save();g.translate(x,y);
  rr(-r,-r,r*2,r*2,r*.3);g.fillStyle=fixed?LG(g,0,-r,0,r,[0,'#c89a58',1,'#6e4a22']):LG(g,-r,-r,r,r,[0,'#7a6cff',.5,'#4a3fb8',1,'#2a2270']);g.fill();g.lineWidth=Math.max(2,cell*.04);g.strokeStyle=fixed?'#3a220e':'#150f50';g.stroke();
  if(!fixed){g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=2;rr(-r*.82,-r*.82,r*1.64,r*1.64,r*.22);g.stroke()}
  var a=lerp(-PI/4,PI/4,1-ang)+(0);g.rotate(-PI/4*(ang===0?1:ang===1?-1:(1-2*ang)));
  g.lineCap='round';g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=cell*.17;g.beginPath();g.moveTo(-r*.86,0);g.lineTo(r*.86,0);g.stroke();
  g.strokeStyle=LG(g,-r,0,r,0,[0,'#e8f1ff',.5,'#ffffff',1,'#b9c8ee']);g.lineWidth=cell*.12;g.beginPath();g.moveTo(-r*.86,0);g.lineTo(r*.86,0);g.stroke();
  g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=cell*.03;g.beginPath();g.moveTo(-r*.6,-cell*.03);g.lineTo(r*.2,-cell*.03);g.stroke();
  if(fixed){g.rotate(PI/4);g.fillStyle='#ffe9a0';[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){g.beginPath();g.arc(q[0]*r*.78,q[1]*r*.78,r*.06,0,TAU);g.fill()})}g.restore()},
 lamp:function(x,y,cell,sd,t){var r=cell*.36,f=1+Math.sin(t*5)*.06;g.save();g.translate(x,y);glow(g,0,0,r*2.6,'#ffe27a',.55);g.beginPath();g.arc(0,0,r*1.05,0,TAU);g.fillStyle='#6b4423';g.fill();g.lineWidth=2;g.strokeStyle='#2a160a';g.stroke();
  g.beginPath();g.arc(0,0,r*.78,0,TAU);g.fillStyle=RG(g,-r*.2,-r*.2,r*.05,r*.9,[0,'#fff9d0',.5,'#ffd24a',1,'#e08a1a']);g.fill();g.beginPath();g.arc(0,0,r*.4*f,0,TAU);g.fillStyle='rgba(255,255,255,.9)';g.fill();
  g.rotate([0,-PI/2,PI,PI/2][sd]);g.fillStyle='#ffd24a';g.beginPath();g.moveTo(r*1.2,0);g.lineTo(r*.85,-r*.3);g.lineTo(r*.85,r*.3);g.closePath();g.fill();g.strokeStyle='#8a5a00';g.stroke();g.restore()}
};
