/* ===== вид «Светляки в банках»: тап по банке будит её и соседей ===== */
PZ.lamps={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#3a2616',1,'#1a0f08']);g.fillRect(x,y,w,h);g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=2;for(var i=0;i<9;i++){var yy=y+h*i/9;g.beginPath();g.moveTo(x,yy);g.lineTo(x+w,yy+Math.sin(i)*3);g.stroke()}},
 asp:function(s){return{c:s.P.n,r:s.P.m,k:1}},
 init:function(L){var P0=LAMPS.parse(L);return{P:P0,st:LAMPS.clone(P0.st),lv:P0.st.on.slice(),hm:null,rip:[],busy:false}},
 snap:function(s){return{on:s.st.on.slice()}},
 rest:function(s,o){s.st.on=o.on.slice()},
 cxy:function(B,x,y){return[B.ox+(x+.5)*B.cell,B.oy+(y+.5)*B.cell]},
 update:function(s,dt){for(var i=0;i<s.lv.length;i++){var tg=s.st.on[i];s.lv[i]+=(tg-s.lv[i])*Math.min(1,dt*9);if(Math.abs(s.lv[i]-tg)<.01)s.lv[i]=tg}
  for(i=s.rip.length-1;i>=0;i--){s.rip[i].t+=dt;if(s.rip[i].t>.5)s.rip.splice(i,1)}},
 down:function(s,p,B,P){var P0=s.P,gx=Math.floor((p.x-B.ox)/B.cell),gy=Math.floor((p.y-B.oy)/B.cell);if(gx<0||gy<0||gx>=P0.n||gy>=P0.m)return;var i=gy*P0.n+gx;pzPush();var before=s.st.on.filter(Boolean).length;s.st=LAMPS.tap(P0,s.st,i);var after=s.st.on.filter(Boolean).length;sfx('tick');
  [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var a=gx+d[0],b=gy+d[1];if(a<0||b<0||a>=P0.n||b>=P0.m)return;var c=PZ.lamps.cxy(B,a,b);s.rip.push({x:c[0],y:c[1],t:0});if(s.st.on[b*P0.n+a])pfBurst(c[0],c[1],4,'#ffe27a',70,.5)});
  if(after>before)sfx('fire',Math.min(9,after-1))},
 hint:function(s){var sol=LAMPS.solve(s.P,s.st);if(!sol)return null;if(!sol.length)return{mark:null,say:'Все светляки уже проснулись!'};return{mark:{i:sol[0]},say:'Тапни по этой банке — проснётся она и соседи.'}},
 auto:function(s,B,L){var h=PZ.lamps.hint(s);if(!h||!h.mark)return null;var i=h.mark.i,c=PZ.lamps.cxy(B,i%s.P.n,(i/s.P.n)|0);return[{t:'tap',x:c[0],y:c[1]}]},
 won:function(s){return LAMPS.won(s.P,s.st)},
 draw:function(s,B,t){var P0=s.P,cell=B.cell,x,y,i;
  for(y=0;y<P0.m;y++)for(x=0;x<P0.n;x++){i=y*P0.n+x;var c=PZ.lamps.cxy(B,x,y);g.fillStyle='rgba(0,0,0,.28)';rr(c[0]-cell*.46,c[1]-cell*.46,cell*.92,cell*.92,cell*.16);g.fill();drawJar(c[0],c[1]-cell*.02,cell*.36,s.lv[i],t,i*1.7)}
  for(i=0;i<s.rip.length;i++){var q=s.rip[i],kk=q.t/.5;g.strokeStyle='rgba(255,240,170,'+(.7*(1-kk))+')';g.lineWidth=3;g.beginPath();g.arc(q.x,q.y,cell*(.25+kk*.3),0,TAU);g.stroke()}
  if(s.hm){var hc=PZ.lamps.cxy(B,s.hm.i%P0.n,(s.hm.i/P0.n)|0);hintRing(hc[0],hc[1],cell*.48,t)}}
};
