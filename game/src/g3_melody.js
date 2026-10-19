/* ===== вид «Мелодия»: Выпь играет на колокольчиках — повтори ===== */
LV.melody=[{seqs:[[0,2,1],[1,3,0,2],[2,0,3,1,2]]},{seqs:[[3,1,2],[0,2,3,1],[1,2,0,3,2]]},{seqs:[[0,1,2,3],[3,2,0,1,3],[1,0,3,2,1,2]]},{seqs:[[2,1,3],[0,3,1,2],[3,0,2,1,3,0]]}];
var MELCOL=['#ff6a6a','#ffd24a','#5fd16a','#5aa9ff'],MELF=[392,523.25,659.25,783.99];
function melBell(x,y,r,col,lit,t,sw){g.save();g.translate(x,y);
 if(lit>0){g.globalCompositeOperation='lighter';glow(g,0,0,r*2.3,col,.7*lit);g.globalCompositeOperation='source-over'}
 g.rotate(sw);var sc=1+.1*lit;g.scale(sc,sc);
 g.strokeStyle='#6b4423';g.lineWidth=r*.1;g.lineCap='round';g.beginPath();g.moveTo(0,-r*1.08);g.lineTo(0,-r*.82);g.stroke();g.beginPath();g.arc(0,-r*1.15,r*.1,0,TAU);g.stroke();
 g.beginPath();g.moveTo(-r*.3,-r*.78);g.quadraticCurveTo(-r*.36,-r*.15,-r*.88,r*.5);g.lineTo(-r*.95,r*.62);g.quadraticCurveTo(0,r*.82,r*.95,r*.62);g.lineTo(r*.88,r*.5);g.quadraticCurveTo(r*.36,-r*.15,r*.3,-r*.78);g.quadraticCurveTo(0,-r*.95,-r*.3,-r*.78);g.closePath();
 g.fillStyle=LG(g,-r,0,r,0,[0,sh(col,-.25),.35,lit>0?sh(col,.35):col,.7,col,1,sh(col,-.35)]);g.fill();g.lineWidth=Math.max(2,r*.07);g.strokeStyle=sh(col,-.55);g.lineJoin='round';g.stroke();
 g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(-r*.3,-r*.1,r*.09,r*.36,.18,0,TAU);g.fill();
 g.fillStyle='#f4e2a0';g.strokeStyle=sh(col,-.55);g.beginPath();g.arc(0,r*.78+Math.sin(t*14)*r*.04*lit,r*.17,0,TAU);g.fill();g.stroke();g.restore()}
PZ.melody={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#16324a',1,'#0a1830']);g.fillRect(x,y,w,h);for(var i=0;i<40;i++){g.fillStyle='rgba(190,230,255,'+(.08+hash2(i,6,1)*.2)+')';g.beginPath();g.arc(x+hash2(i,1,3)*w,y+hash2(i,2,4)*h,.5+hash2(i,3,5)*1.4,0,TAU);g.fill()}},
 asp:function(){return{c:3,r:3,k:1}},
 init:function(L){return{P:L,round:0,phase:'wait',tw:.9,shown:0,st:0,idx:0,lit:-1,litT:0,busy:true,done:false,hm:null,swing:[0,0,0,0],sv:[0,0,0,0],fx:[],t0:0}},
 snap:function(s){return{}},rest:function(){},
 note:function(s,i,B){s.lit=i;s.litT=.42;s.sv[i]=.35;(typeof bell==='function'&&AC&&audioOK&&bell(MELF[i],.22));
  if(B){var c=PZ.melody.pos(B,i);pfBurst(c[0],c[1],6,MELCOL[i],90,.5)}},
 pos:function(B,i){var c=B.cell,ox=B.ox,oy=B.oy,p=[[1.5,.7],[.68,1.5],[2.32,1.5],[1.5,2.3]][i];return[ox+p[0]*c,oy+p[1]*c]},
 update:function(s,dt,P){var seq=s.P.seqs[s.round],B=P.B,i;s.t0+=dt;for(i=0;i<4;i++){s.sv[i]=Math.max(0,s.sv[i]-dt*.9);s.swing[i]=Math.sin(s.t0*16)*s.sv[i]*.5}
  if(s.litT>0){s.litT-=dt;if(s.litT<=0)s.lit=-1}for(i=s.fx.length-1;i>=0;i--){s.fx[i].t+=dt;if(s.fx[i].t>.7)s.fx.splice(i,1)}
  if(s.phase==='wait'||s.phase==='show'||s.phase==='ok'||s.phase==='bad')P.idle=0;
  if(s.phase==='wait'){s.tw-=dt;if(s.tw<=0){s.phase='show';s.shown=0;s.st=.15}}
  else if(s.phase==='show'){s.st-=dt;if(s.st<=0){if(s.shown<seq.length){PZ.melody.note(s,seq[s.shown],B);s.shown++;s.st=s.shown<seq.length?Math.max(.46,.74-s.round*.05):.6}else{s.phase='input';s.idx=0;s.busy=false}}}
  else if(s.phase==='ok'){s.tw-=dt;if(s.tw<=0){s.round++;if(s.round>=s.P.seqs.length){s.done=true;s.busy=false}else{s.phase='wait';s.tw=.35}}}
  else if(s.phase==='bad'){s.tw-=dt;if(s.tw<=0){s.phase='wait';s.tw=.25}}},
 down:function(s,p,B,P){if(s.phase!=='input')return;var seq=s.P.seqs[s.round],cell=B.cell,i,best=-1,bd=1e9;
  for(i=0;i<4;i++){var c=PZ.melody.pos(B,i),d=Math.hypot(p.x-c[0],p.y-c[1]);if(d<cell*.55&&d<bd){bd=d;best=i}}
  var cc=[B.ox+1.5*cell,B.oy+1.5*cell];if(best<0&&Math.hypot(p.x-cc[0],p.y-cc[1])<cell*.38){s.phase='wait';s.tw=.1;s.busy=true;sfx('ui');return}
  if(best<0)return;P.idle=0;PZ.melody.note(s,best,B);
  if(best===seq[s.idx]){s.idx++;if(s.idx>=seq.length){s.phase='ok';s.tw=1;s.busy=true;sfx('perk');pfBurst(cc[0],cc[1],26,'#fff3a0',200,1);s.fx.push({t:0})}}
  else{s.phase='bad';s.tw=1.1;s.busy=true;s.sv[best]=.9;sfx('nope');pzSay('krap','Не та нота! Послушаем ещё раз — без спешки.',3.4)}},
 hint:function(s){if(s.phase!=='input')return null;s.phase='wait';s.tw=.2;s.busy=true;return{mark:null,say:'Слушай внимательно — сыграю ещё раз.'}},
 auto:function(s,B){if(s.phase!=='input')return null;var seq=s.P.seqs[s.round],c=PZ.melody.pos(B,seq[s.idx]);return[{t:'tap',x:c[0],y:c[1],w:30}]},
 won:function(s){return s.done},
 badge:function(s){var n=s.P.seqs.length;return{n:n,k:Math.min(n,s.round),draw:function(x,y,r,i){melBell(x,y+r*.15,r*.7,MELCOL[i%4],i<s.round?1:0,0,0)}}},
 draw:function(s,B,t,PP){var cell=B.cell,seq=s.P.seqs[s.round]||[],i,cx=B.ox+1.5*cell,cy=B.oy+1.5*cell;
  var msg=s.phase==='input'?'Твой черёд! Повтори мелодию':(s.phase==='ok'?'Верно!':(s.phase==='bad'?'Ой, мимо…':'Слушай…'));
  txt(msg,cx,B.oy+cell*.09,fz(16),'#d8ecff',{al:'center',fam:FT,w:600,bl:'middle'});
  /* центральная кнопка «ещё раз» */
  var pu=s.phase==='input'&&s.idx===0?1+.05*Math.sin(t*5):1;g.save();g.translate(cx,cy);g.scale(pu,pu);g.beginPath();g.arc(0,0,cell*.3,0,TAU);g.fillStyle=LG(g,0,-cell*.3,0,cell*.3,[0,'#35577a',1,'#14284a']);g.fill();g.lineWidth=3;g.strokeStyle='rgba(180,220,255,.6)';g.stroke();
  g.fillStyle='#dff0ff';g.beginPath();g.moveTo(-cell*.08,-cell*.12);g.lineTo(cell*.15,0);g.lineTo(-cell*.08,cell*.12);g.closePath();g.fill();g.restore();
  txt('ещё раз',cx,cy+cell*.47,fz(11),'rgba(200,230,255,.8)',{al:'center',fam:FU,w:600});
  for(i=0;i<4;i++){var c=PZ.melody.pos(B,i);melBell(c[0],c[1]+cell*.05,cell*.33,MELCOL[i],s.lit===i?Math.min(1,s.litT/.3):0,t,s.swing[i])}
  /* точки прогресса */
  var n=seq.length,dr=Math.max(5,cell*.06),tw=n*dr*3,x0=cx-tw/2+dr*1.5,yy=B.oy+3*cell-cell*.12;
  for(i=0;i<n;i++){g.beginPath();g.arc(x0+i*dr*3,yy,dr,0,TAU);g.fillStyle=(s.phase==='input'||s.phase==='ok')&&i<(s.phase==='ok'?n:s.idx)?'#ffe27a':'rgba(255,255,255,.22)';g.fill()}
  for(i=0;i<s.fx.length;i++){var f=s.fx[i],kk=f.t/.7;g.strokeStyle='rgba(255,243,160,'+(.8*(1-kk))+')';g.lineWidth=3;g.beginPath();g.arc(cx,cy,cell*(.3+kk*1.2),0,TAU);g.stroke()}}
};
