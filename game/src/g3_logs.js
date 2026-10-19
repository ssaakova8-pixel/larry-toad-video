/* ===== вид «Брёвна»: Порох двигает брёвна и засыпает ими воду ===== */
PZ.logs={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#2f5a2a',1,'#1a3818']);g.fillRect(x,y,w,h)},
 asp:function(s){return{c:s.P.w,r:s.P.h,k:1}},
 init:function(L){var P0=LOGS.parse(L);P0.wat=P0.st.g.map(function(v){return v===1});return{P:P0,st:LOGS.clone(P0.st),q:[],an:null,busy:false,face:1,rip:[],hm:null,fa:{},gait:0,ph:0}},
 snap:function(s){return{st:LOGS.clone(s.st),face:s.face}},
 rest:function(s,o){s.st=LOGS.clone(o.st);s.q=[];s.an=null;s.busy=false;s.face=o.face;s.fa={}},
 cxy:function(B,x,y){return[B.ox+(x+.5)*B.cell,B.oy+(y+.5)*B.cell]},
 update:function(s,dt,P){var P0=s.P,B=P.B;
  if(!s.an&&s.q.length){var d=s.q.shift(),r=LOGS.step(P0,s.st,d);if(!r){s.q.length=0}else{s.an={d:d,t:0,dur:r.push?.3:.2,r:r};s.face=d===1?-1:d===0?1:s.face;if(r.push)sfx('snort')}}
  if(s.an){var a=s.an;a.t+=dt;s.gait=1;s.ph+=dt*13;if(a.t>=a.dur){var r2=a.r;s.st=r2.s;s.an=null;var c=PZ.logs.cxy(B,s.st.x,s.st.y);
    if(r2.push){var bc=PZ.logs.cxy(B,r2.bx,r2.by);if(r2.fill){s.fa[r2.by*P0.w+r2.bx]=0;sfx('splash');pfBurst(bc[0],bc[1],16,'#bfe9ff',140,.9);pfRing(bc[0],bc[1],B.cell*.45,'#bfe9ff');pzSay('krap','Мост готов — Порох пройдёт!',3)}else{sfx('perfect');pfBurst(bc[0],bc[1],6,'#d9b070',70,.5)}}
    else sfx('tick')}}
  else s.gait=Math.max(0,s.gait-dt*5);
  s.busy=!!s.an||s.q.length>0;
  for(var k in s.fa)s.fa[k]+=dt;for(var i=s.rip.length-1;i>=0;i--){s.rip[i].t+=dt;if(s.rip[i].t>.8)s.rip.splice(i,1)}},
 /* ближайшая клетка рядом с бревном, куда Порох дойдёт, не толкая ничего */
 approach:function(s,lx,ly){var P0=s.P,best=null;for(var d=0;d<4;d++){var ax=lx-LOGS.D[d][0],ay=ly-LOGS.D[d][1];if(ax<0||ay<0||ax>=P0.w||ay>=P0.h)continue;var ai=ay*P0.w+ax;if(s.st.g[ai]!==0||s.st.l[ai])continue;
   var w=(s.st.x===ax&&s.st.y===ay)?[]:LOGS.walk(P0,s.st,ax,ay);if(w&&(!best||w.length<best.length))best=w}return best},
 down:function(s,p,B,P){if(s.busy)return;var P0=s.P,gx=Math.floor((p.x-B.ox)/B.cell),gy=Math.floor((p.y-B.oy)/B.cell);if(gx<0||gy<0||gx>=P0.w||gy>=P0.h)return;var i=gy*P0.w+gx,st=s.st;
  if(gx===st.x&&gy===st.y)return;var path=null,dx=gx-st.x,dy=gy-st.y,c=PZ.logs.cxy(B,gx,gy);
  function nope(msg){sfx('nope');s.rip.push({x:c[0],y:c[1],t:0});if(msg)pzSay('krap',msg,3.8)}
  if(Math.abs(dx)+Math.abs(dy)===1){var d=dx===1?0:dx===-1?1:dy===1?2:3,r=LOGS.step(P0,st,d);
   if(!r){nope(st.g[i]===1?'В воду Порох не пойдёт. Засыпь её брёвнами!':st.g[i]===2?'Тут дерево — не пройти.':st.l[i]?'Это бревно не сдвинуть: за ним преграда.':null);return}
   path=[d]}
  else if(st.l[i]){path=PZ.logs.approach(s,gx,gy);if(!path||!path.length){nope('К бревну не подойти. Попробуй сначала сдвинуть другое.');return}pzSay('krap','Теперь тапни по бревну ещё раз — Порох подтолкнёт.',3.2)}
  else{path=LOGS.walk(P0,st,gx,gy);if(!path){nope(st.g[i]===1?'В воду Порох не пойдёт. Засыпь её брёвнами!':st.g[i]===2?'Тут дерево — не пройти.':'Туда не дойти — что-то мешает.');return}}
  pzPush();s.q=path.slice();s.busy=true;P.larryHop=0},
 hint:function(s,L){var P0=s.P,sol=LOGS.solve(P0,s.st);if(!sol)return null;var c=s.st;
  for(var i=0;i<sol.length;i++){var r=LOGS.step(P0,c,sol[i]);if(r.push){var d=sol[i],lx=c.x+LOGS.D[d][0],ly=c.y+LOGS.D[d][1],at=(c.x===s.st.x&&c.y===s.st.y);
    return{mark:{sx:c.x,sy:c.y,lx:lx,ly:ly,d:d,at:at},say:at?'Тапни по бревну — Порох подтолкнёт его по стрелке.':'Сначала встань сюда (тапни по клетке), потом подтолкни бревно по стрелке.'}}c=r.s}
  return{mark:{sx:P0.ex,sy:P0.ey,lx:-1,ly:-1,d:-1,at:false,fin:true},say:'Путь свободен — иди к флажку!'}},
 won:function(s){return LOGS.won(s.P,s.st)&&!s.busy},
 draw:function(s,B,t,PP){var P0=s.P,cell=B.cell,x,y,i,st=s.st,an=s.an;
  /* плитки */
  for(y=0;y<P0.h;y++)for(x=0;x<P0.w;x++){i=y*P0.w+x;var c=PZ.logs.cxy(B,x,y),x0=c[0]-cell/2,y0=c[1]-cell/2,gv=st.g[i],wat=P0.wat[i];
   if(wat){g.fillStyle=LG(g,x0,y0,x0,y0+cell,[0,'#3f9ab8',1,'#1d6a8e']);g.fillRect(x0,y0,cell+.5,cell+.5);g.strokeStyle='rgba(220,245,255,.35)';g.lineWidth=1.5;for(var k=0;k<2;k++){var wy=y0+cell*(.3+k*.35)+Math.sin(t*1.6+x+k)*2;g.beginPath();g.moveTo(x0+cell*.15,wy);g.quadraticCurveTo(x0+cell*.5,wy-4,x0+cell*.85,wy);g.stroke()}
    if(gv===0){var ga=s.fa[i]==null?1:Math.min(1,s.fa[i]*3);g.save();g.globalAlpha=ga;drawLog(g,c[0],c[1]+cell*.05,cell*.4/U,U,{});g.restore()}}
   else{var sh0=((x+y)%2)?.04:0;g.fillStyle=LG(g,x0,y0,x0,y0+cell,[0,sh('#5aa04a',sh0),1,sh('#3c7a34',sh0)]);g.fillRect(x0,y0,cell+.5,cell+.5);
    for(k=0;k<3;k++){var hx=x0+hash2(x,y,k)*cell*.8+cell*.1,hy=y0+hash2(x,y,k+9)*cell*.8+cell*.1;g.strokeStyle='rgba(20,70,25,.45)';g.lineWidth=1.4;g.beginPath();g.moveTo(hx,hy);g.lineTo(hx-2,hy-cell*.1);g.moveTo(hx,hy);g.lineTo(hx+2,hy-cell*.09);g.stroke()}
    if(hash2(x,y,4)>.8){g.fillStyle='#ffe9a8';g.beginPath();g.arc(x0+cell*.2,y0+cell*.75,cell*.04,0,TAU);g.fill()}}
   g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=1;g.strokeRect(x0+.5,y0+.5,cell-1,cell-1)}
  /* цель */
  var ec=PZ.logs.cxy(B,P0.ex,P0.ey);drawFlag(ec[0]-cell*.08,ec[1]+cell*.3,cell*.7,t,true);
  /* порядок: брёвна и деревья по строкам, конь вставляется в свою строку */
  var hrow=an?(an.r.s.y>st.y?an.r.s.y:st.y):st.y;
  for(y=0;y<P0.h;y++){for(x=0;x<P0.w;x++){i=y*P0.w+x;var cc=PZ.logs.cxy(B,x,y);
    if(st.g[i]===2){if(hash2(x,y,2)>.5)drawTree(cc[0],cc[1]+cell*.05,cell*.44,x*7+y);else drawRock(cc[0],cc[1]+cell*.08,cell*.4,x*5+y*3,false)}
    else if(st.l[i]){var skip=an&&an.r.push&&x===st.x+LOGS.D[an.d][0]&&y===st.y+LOGS.D[an.d][1];if(!skip)drawLog(g,cc[0],cc[1]+cell*.08,cell*.4/U,U,{})}}
   if(y===hrow)PZ.logs.horse(s,B,t)}
  /* движущееся бревно */
  if(an&&an.r.push){var k2=ease(Math.min(1,an.t/an.dur)),fx=st.x+LOGS.D[an.d][0],fy=st.y+LOGS.D[an.d][1],tx=an.r.bx,ty=an.r.by,lx=lerp(fx,tx,k2),ly=lerp(fy,ty,k2),lc=PZ.logs.cxy(B,lx,ly);g.save();if(an.r.fill&&k2>.7)g.globalAlpha=1-(k2-.7)/.3*.5;drawLog(g,lc[0],lc[1]+cell*.08,cell*.4/U,U,{});g.restore()}
  /* рябь */
  for(i=0;i<s.rip.length;i++){var q=s.rip[i],kk=q.t/.8;g.strokeStyle='rgba(255,255,255,'+(.6*(1-kk))+')';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,cell*(.15+kk*.4),0,TAU);g.stroke()}
  /* подсказка */
  if(s.hm){var m=s.hm,sc=PZ.logs.cxy(B,m.sx,m.sy),standing=(st.x===m.sx&&st.y===m.sy);
   if(m.fin){hintRing(sc[0],sc[1],cell*.5,t)}
   else{var lc2=PZ.logs.cxy(B,m.lx,m.ly);if(!standing)hintRing(sc[0],sc[1],cell*.42,t);hintRing(lc2[0],lc2[1],cell*.5,t);hintArrow(lc2[0]+LOGS.D[m.d][0]*cell*.62,lc2[1]+LOGS.D[m.d][1]*cell*.62,m.d,cell*.5,t)}}},
 auto:function(s,B,L){var h=PZ.logs.hint(s,L);if(!h||!h.mark)return null;var m=h.mark,c;if(m.fin||!m.at&&!(s.st.x===m.sx&&s.st.y===m.sy))c=PZ.logs.cxy(B,m.sx,m.sy);else c=PZ.logs.cxy(B,m.lx,m.ly);return[{t:'tap',x:c[0],y:c[1]}]},
 horse:function(s,B,t){var cell=B.cell,st=s.st,an=s.an,px=st.x,py=st.y;if(an){var k=ease(Math.min(1,an.t/an.dur));px=lerp(st.x,an.r.s.x,k);py=lerp(st.y,an.r.s.y,k)}
  var c=PZ.logs.cxy(B,px,py),hy=c[1]+cell*.32,hop=an?Math.abs(Math.sin(s.ph))*cell*.04:0;
  g.fillStyle='rgba(0,20,0,.35)';g.beginPath();g.ellipse(c[0],hy+cell*.02,cell*.36,cell*.09,0,0,TAU);g.fill();
  drawPorokh(g,c[0],hy-hop,cell*.36,{t:t,face:s.face,gait:an?1:0,ph:s.ph,saddle:1,mouth:0})}
};
