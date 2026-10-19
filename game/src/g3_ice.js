/* ===== вид «Лёд»: Ларри скользит до упора; нужно попасть в иглу ===== */
PZ.ice={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#d6eefc',1,'#8ec4ea']);g.fillRect(x,y,w,h)},
 asp:function(s){return{c:s.P.w,r:s.P.h,k:1}},
 init:function(L){var P0=ICE.parse(L);return{P:P0,st:{x:P0.st.x,y:P0.st.y},vx:P0.st.x,vy:P0.st.y,an:null,busy:false,face:1,hm:null,trail:[],sq:0,rip:[]}},
 snap:function(s){return{x:s.st.x,y:s.st.y,face:s.face}},
 rest:function(s,o){s.st={x:o.x,y:o.y};s.vx=o.x;s.vy=o.y;s.an=null;s.busy=false;s.face=o.face},
 cxy:function(B,x,y){return[B.ox+(x+.5)*B.cell,B.oy+(y+.5)*B.cell]},
 update:function(s,dt,P){if(s.an){var a=s.an;a.t+=dt;var k=Math.min(1,a.t/a.dur),e=k*(2-k);s.vx=lerp(a.fx,a.tx,e);s.vy=lerp(a.fy,a.ty,e);
   if(P.B&&Math.random()<.8){var c=PZ.ice.cxy(P.B,s.vx,s.vy);PF.push({x:c[0]-ICE.DX[a.d]*P.B.cell*.3,y:c[1]+P.B.cell*.25,vx:(Math.random()-.5)*30,vy:-20-Math.random()*20,g:40,t:0,life:.5,r:2.2,c:'#ffffff'})}
   if(k>=1){s.st={x:a.tx,y:a.ty};s.an=null;s.busy=false;s.sq=.6;sfx('land');if(P.B){var c2=PZ.ice.cxy(P.B,s.vx,s.vy);pfBurst(c2[0],c2[1]+P.B.cell*.2,8,'#ffffff',90,.5);if(s.P.gx===s.st.x&&s.P.gy===s.st.y)pfBurst(c2[0],c2[1],20,'#ffe27a',160,1)}}}
  s.sq=Math.max(0,s.sq-dt*3)},
 up:function(s,p,B,P,cancel){if(s.busy||cancel)return;var c=PZ.ice.cxy(B,s.vx,s.vy),dx=p.x-p.sx,dy=p.y-p.sy,d;
  if(Math.hypot(dx,dy)>16){d=Math.abs(dx)>Math.abs(dy)?(dx>0?0:1):(dy>0?2:3)}else{var ex=p.x-c[0],ey=p.y-c[1];if(Math.hypot(ex,ey)<B.cell*.3)return;d=Math.abs(ex)>Math.abs(ey)?(ex>0?0:1):(ey>0?2:3)}
  var r=ICE.slide(s.P,s.st,d);if(!r.n){sfx('nope');s.sq=.4;var q=PZ.ice.cxy(B,s.st.x,s.st.y);s.rip.push({x:q[0],y:q[1],t:0});if(!s.warned){s.warned=1;pzSay('krap','Туда не проскользить — сразу упор. Выбери другую сторону.',3.2)}return}
  pzPush();s.an={d:d,t:0,dur:.08*r.n+.14,fx:s.st.x,fy:s.st.y,tx:r.x,ty:r.y};s.face=d===1?-1:d===0?1:s.face;s.busy=true;sfx('slash')},
 hint:function(s){var sol=ICE.solve(s.P,s.st);if(!sol)return null;if(!sol.length)return{mark:null,say:'Ты уже в иглу!'};var d=sol[0],r=ICE.slide(s.P,s.st,d);return{mark:{d:d,x:r.x,y:r.y},say:'Скользни в эту сторону — свайп или тап с нужной стороны от Ларри.'}},
 auto:function(s,B,L){var h=PZ.ice.hint(s);if(!h||!h.mark)return null;var c=PZ.ice.cxy(B,s.vx,s.vy),d=h.mark.d;return[{t:'tap',x:c[0]+ICE.DX[d]*B.cell*1.2,y:c[1]+ICE.DY[d]*B.cell*1.2}]},
 won:function(s){return ICE.won(s.P,s.st)},
 draw:function(s,B,t){var P0=s.P,cell=B.cell,x,y,i;
  for(y=0;y<P0.h;y++)for(x=0;x<P0.w;x++){i=y*P0.w+x;var c=PZ.ice.cxy(B,x,y),x0=c[0]-cell/2,y0=c[1]-cell/2;
   g.fillStyle=LG(g,x0,y0,x0+cell,y0+cell,[0,((x+y)%2)?'#e6f6ff':'#d4eefc',1,((x+y)%2)?'#c4e2f6':'#b4d8f2']);g.fillRect(x0,y0,cell+.5,cell+.5);
   g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1.5;g.beginPath();g.moveTo(x0+cell*.15,y0+cell*.22);g.lineTo(x0+cell*.38,y0+cell*.12);g.moveTo(x0+cell*.6,y0+cell*.85);g.lineTo(x0+cell*.85,y0+cell*.7);g.stroke();
   g.strokeStyle='rgba(120,170,210,.4)';g.lineWidth=1;g.strokeRect(x0+.5,y0+.5,cell-1,cell-1)}
  var sc=PZ.ice.cxy(B,P0.st.x,P0.st.y);g.strokeStyle='rgba(90,150,200,.5)';g.setLineDash([4,4]);g.lineWidth=2;g.beginPath();g.arc(sc[0],sc[1],cell*.36,0,TAU);g.stroke();g.setLineDash([]);
  for(y=0;y<P0.h;y++){for(x=0;x<P0.w;x++){i=y*P0.w+x;var cc=PZ.ice.cxy(B,x,y);if(P0.rk[i])drawRock(cc[0],cc[1]+cell*.05,cell*.42,x*5+y*11,true);else if(x===P0.gx&&y===P0.gy)drawIgloo(cc[0],cc[1]+cell*.14,cell*.4,t,s.st.x===P0.gx&&s.st.y===P0.gy)}}
  if(s.hm){var hc=PZ.ice.cxy(B,s.hm.x,s.hm.y),lc0=PZ.ice.cxy(B,s.vx,s.vy);hintRing(hc[0],hc[1],cell*.4,t);hintArrow(lc0[0]+ICE.DX[s.hm.d]*cell*.7,lc0[1]+ICE.DY[s.hm.d]*cell*.7,s.hm.d,cell*.5,t)}
  var lc=PZ.ice.cxy(B,s.vx,s.vy),moving=!!s.an;g.fillStyle='rgba(30,70,110,.3)';g.beginPath();g.ellipse(lc[0],lc[1]+cell*.3,cell*.3,cell*.08,0,0,TAU);g.fill();
  drawLarry(g,lc[0],lc[1]+cell*.3,cell*.26,{t:t,face:s.face,sq:s.sq,st:moving?.9:0,mouth:moving?3:1,lamp:1});
  for(i=0;i<s.rip.length;i++){var q=s.rip[i];q.t+=.016}}
};
