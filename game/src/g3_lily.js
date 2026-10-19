/* ===== вид «Кувшинки»: Ларри прыгает по кувшинкам, покинутая тонет ===== */
function padDraw(x,y,rx,o){o=o||{};var ry=rx*.62,t=o.t||0,c1=o.c1||'#58c070',c2=o.c2||'#1f7a46',a0=o.a0==null?.6:o.a0,al=o.al==null?1:o.al,sc=o.sc==null?1:o.sc,i;
 g.save();g.globalAlpha=al;g.translate(x,y);g.scale(sc,sc);
 g.fillStyle='rgba(0,25,40,.38)';g.beginPath();g.ellipse(rx*.05,ry*.32,rx*1.05,ry*1.08,0,0,TAU);g.fill();
 if(o.gold){g.beginPath();g.ellipse(0,0,rx*1.16,ry*1.2,0,0,TAU);g.fillStyle=o.open?'rgba(255,226,120,.55)':'rgba(255,226,120,.22)';g.fill()}
 g.beginPath();for(var a=a0+.2;a<=a0+TAU-.2;a+=.12)g.lineTo(Math.cos(a)*rx,Math.sin(a)*ry);g.lineTo(rx*.04*Math.cos(a0),ry*.04*Math.sin(a0));g.closePath();
 g.fillStyle=RG(g,-rx*.2,-ry*.35,rx*.06,rx*1.1,[0,sh(c1,.35),.55,c1,1,c2],0,0);g.fill();
 g.lineWidth=Math.max(1.5,rx*.07);g.strokeStyle=o.gold?'#d9a62a':sh(c2,-.5);g.lineJoin='round';g.stroke();
 g.strokeStyle='rgba(10,60,30,.3)';g.lineWidth=Math.max(1,rx*.035);for(a=a0+.5;a<a0+TAU-.3;a+=.62){g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*rx*.9,Math.sin(a)*ry*.9);g.stroke()}
 g.beginPath();g.ellipse(0,-ry*.06,rx*.86,ry*.8,0,PI*1.08,PI*1.7);g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=rx*.07;g.lineCap='round';g.stroke();
 if(o.lives>1){g.strokeStyle='rgba(255,230,140,.8)';g.lineWidth=rx*.06;g.beginPath();g.ellipse(0,0,rx*.74,ry*.7,0,0,TAU);g.stroke();for(i=0;i<o.lives;i++){g.beginPath();g.arc((i-(o.lives-1)/2)*rx*.26,ry*.55,rx*.07,0,TAU);g.fillStyle='#ffe27a';g.fill()}}
 g.restore()}
function lotus(x,y,r,t,k){g.save();g.translate(x,y);var br=1+Math.sin(t*2.4+k)*.04;g.scale(br,br);for(var j=0;j<2;j++){var n=j?6:8;for(var i=0;i<n;i++){g.save();g.rotate(i/n*TAU+(j?.3:0));g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(r*.5,-r*.45,0,-r*(j?.62:.95));g.quadraticCurveTo(-r*.5,-r*.45,0,0);
  g.fillStyle=LG(g,0,0,0,-r,[0,j?'#ffe3ee':'#ffc4d8',1,j?'#ff93b6':'#f0679a']);g.fill();g.lineWidth=Math.max(1,r*.06);g.strokeStyle='rgba(130,20,70,.55)';g.stroke();g.restore()}}
 g.beginPath();g.arc(0,0,r*.2,0,TAU);g.fillStyle='#ffe066';g.fill();glow(g,0,0,r*1.5,'#ffc8e0',.35);g.restore()}
PZ.lily={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#2a8a95',.5,'#17607a',1,'#0a3350']);g.fillRect(x,y,w,h);
  g.save();g.globalAlpha=.5;for(var i=0;i<26;i++){var f=i/26,yy=y+((i*91.7)%h),xx=x+((i*173.3)%w),ln=20+(i%5)*14;g.strokeStyle='rgba(190,235,255,'+(.08+.08*((i%3)/2))+')';g.lineWidth=1.4;g.beginPath();g.moveTo(xx,yy);g.quadraticCurveTo(xx+ln*.5,yy-3,xx+ln,yy);g.stroke()}g.restore()},
 asp:function(s){return{c:s.P.w,r:s.P.h,k:.86}},
 init:function(L){var P0=LILY.parse(L);return{P:P0,st:LILY.clone(P0.st),lx:P0.st.x,ly:P0.st.y,busy:false,hop:null,sk:{},rip:[],hm:null,sq:0,face:1,collected:0,dead:false}},
 snap:function(s){return{st:LILY.clone(s.st),face:s.face}},
 rest:function(s,o){s.st=LILY.clone(o.st);s.lx=s.st.x;s.ly=s.st.y;s.hop=null;s.busy=false;s.sk={};s.face=o.face;s.dead=false},
 cellXY:function(B,x,y){return[B.ox+(x+.5)*B.cell,B.oy+(y+.5)*B.cell*B.k]},
 update:function(s,dt,P){var i;
  if(s.hop){s.hop.t+=dt;var k=Math.min(1,s.hop.t/s.hop.d);s.lx=lerp(s.hop.ax,s.hop.bx,ease(k));s.ly=lerp(s.hop.ay,s.hop.by,ease(k));
   if(!s.hop.sunk&&k>.3){s.hop.sunk=true;if(s.hop.sink)s.sk[s.hop.ai]=0}
   if(k>=1){var h=s.hop;s.hop=null;s.busy=false;s.lx=h.bx;s.ly=h.by;s.sq=.55;var B=P.B,c=PZ.lily.cellXY(B,h.bx,h.by);s.rip.push({x:c[0],y:c[1]+B.cell*B.k*.12,t:0});sfx('land');
    if(h.flower){sfx('fire',Math.min(9,s.collected));s.collected++;pfBurst(c[0],c[1]-B.cell*.4,14,'#ff9ec0',150,.8);pfBurst(c[0],c[1]-B.cell*.4,8,'#fff0a0',110,.7)}
    var P0=s.P;if(!LILY.won(P0,s.st)&&!LILY.moves(P0,s.st).length&&!s.dead){s.dead=true;pzSay('krap','Тупик: прыгать некуда. Нажми «Назад ход» — и попробуем другую дорогу.',5.5);P.mood='worry'}}}
  for(var k2 in s.sk){s.sk[k2]+=dt;if(s.sk[k2]>.9)delete s.sk[k2]}
  for(i=s.rip.length-1;i>=0;i--){s.rip[i].t+=dt;if(s.rip[i].t>.9)s.rip.splice(i,1)}
  s.sq=Math.max(0,s.sq-dt*2.4)},
 down:function(s,p,B,P){var P0=s.P,gx=Math.floor((p.x-B.ox)/B.cell),gy=Math.floor((p.y-B.oy)/(B.cell*B.k));if(gx<0||gy<0||gx>=P0.w||gy>=P0.h)return;
  var st=s.st;if(Math.abs(gx-st.x)+Math.abs(gy-st.y)!==1){if(gx===st.x&&gy===st.y)return;var c=PZ.lily.cellXY(B,gx,gy);s.rip.push({x:c[0],y:c[1],t:0});if(s.st.u[gy*P0.w+gx]>0)pzSay('krap','Прыгай только на соседние кувшинки — рядом с Ларри.',3.6);return}
  var nt=LILY.step(P0,st,gx,gy);if(!nt){var c2=PZ.lily.cellXY(B,gx,gy);s.rip.push({x:c2[0],y:c2[1],t:0});sfx('nope');if(P0.w)pzSay('krap','Тут пустая вода. Прыгай на кувшинку!',3.2);return}
  pzPush();var ai=st.y*P0.w+st.x,left=nt.u[ai];s.face=gx>st.x?1:gx<st.x?-1:s.face;
  s.hop={ax:st.x,ay:st.y,bx:gx,by:gy,t:0,d:.34,ai:ai,sink:(left<=0),flower:st.f[gy*P0.w+gx]>0,sunk:false};s.st=nt;s.busy=true;sfx('jump');P.larryHop=1;s.dead=false},
 hint:function(s,L){var P0=s.P,path=LILY.solve(P0,s.st);if(!path)return null;if(!path.length)return{mark:null,say:'Ты уже на месте!'};var m=path[0];
  var nf=s.st.f[m[1]*P0.w+m[0]]>0;return{mark:{x:m[0],y:m[1]},say:nf?'Сюда! На этой кувшинке цветок.':'Прыгай сюда — отсюда путь есть.'}},
 won:function(s){return LILY.won(s.P,s.st)},
 draw:function(s,B,t,PP){var P0=s.P,cell=B.cell,ck=cell*B.k,rx=cell*.43,x,y,i,a;
  /* камыши по углам */
  var rc=PAL[PP.pal].near;for(i=0;i<3;i++){reedTuft(g,B.x+B.w*(.02+i*.05),B.y+B.h*1.0,B.h*.2,sh(rc,-.2),i+4,i===1);reedTuft(g,B.x+B.w*(.98-i*.05),B.y+B.h*1.0,B.h*.18,sh(rc,-.2),i+9,i===0)}
  /* кувшинки (сверху вниз, чтобы нижние перекрывали верхние) */
  for(y=0;y<P0.h;y++)for(x=0;x<P0.w;x++){i=y*P0.w+x;var u=s.st.u[i],sk=s.sk[i],c=PZ.lily.cellXY(B,x,y),gold=(x===P0.gx&&y===P0.gy);
   if(u<=0&&sk==null)continue;var wob=Math.sin(t*1.4+i*1.7)*1.2,dip=(s.st.x===x&&s.st.y===y&&!s.hop)?ck*.05:0,al=1,sc=1,yy=c[1]+wob+dip;
   if(u<=0){var k=sk/.9;al=1-k;sc=1-k*.35;yy+=k*ck*.12}
   var open=gold&&s.st.n===0;
   padDraw(c[0],yy,rx*(gold?1.08:1),{t:t,c1:gold?'#c8e86a':'#58c070',c2:gold?'#6aa83a':'#1f7a46',a0:((x*7+y*13)%9)*.7,al:al,sc:sc,gold:gold,open:open,lives:u>1&&u<9?u:0});
   if(gold){var gl=open?.8+.2*Math.sin(t*4):.28;glow(g,c[0],yy-ck*.1,rx*1.7,'#ffe27a',gl*.6);
    g.save();g.translate(c[0],yy-ck*.1);g.globalAlpha=open?1:.55;var fh=rx*1.05;g.fillStyle=open?'#fff2b0':'#c9b27a';g.strokeStyle='#7a5200';g.lineWidth=2;g.beginPath();g.moveTo(0,-fh*.2);g.lineTo(fh*.22,0);g.lineTo(0,fh*.2);g.lineTo(-fh*.22,0);g.closePath();g.restore();
    drawLanternMini(c[0],yy-ck*.16,rx*.8,open,t)}
   if(s.st.f[i]){lotus(c[0]+rx*.1,yy-ck*.06,rx*.44,t,i)}}
  /* круги по воде */
  for(i=0;i<s.rip.length;i++){var q=s.rip[i],k2=q.t/.9;g.strokeStyle='rgba(220,245,255,'+(.55*(1-k2))+')';g.lineWidth=2;g.beginPath();g.ellipse(q.x,q.y,cell*(.2+k2*.55),cell*(.2+k2*.55)*.6,0,0,TAU);g.stroke()}
  /* подсказка: пульс на кувшинке */
  if(s.hm){var hc=PZ.lily.cellXY(B,s.hm.x,s.hm.y),pu=.5+.5*Math.sin(t*6);g.save();g.strokeStyle='rgba(255,236,140,'+(.65+.3*pu)+')';g.lineWidth=4;g.beginPath();g.ellipse(hc[0],hc[1],rx*(1.02+pu*.12),rx*.62*(1.02+pu*.12),0,0,TAU);g.stroke();g.globalCompositeOperation='lighter';glow(g,hc[0],hc[1]-ck*.2,rx*1.4,'#fff0a0',.5);
   var aw=ck*.5+Math.sin(t*6)*4;g.fillStyle='#ffe27a';g.strokeStyle='#8a5a00';g.lineWidth=2;g.globalCompositeOperation='source-over';g.beginPath();g.moveTo(hc[0],hc[1]-ck*.95-aw*.2);g.lineTo(hc[0]-ck*.2,hc[1]-ck*1.3-aw*.2);g.lineTo(hc[0]+ck*.2,hc[1]-ck*1.3-aw*.2);g.closePath();g.fill();g.stroke();g.restore()}
  /* Ларри */
  var lc=PZ.lily.cellXY(B,s.lx,s.ly),air=0,sq=s.sq,stt=0;if(s.hop){var kk=Math.min(1,s.hop.t/s.hop.d);air=Math.sin(kk*PI)*cell*.7;stt=Math.sin(kk*PI)*.7;sq=0}
  var base=lc[1]+ck*.02,dp=(!s.hop&&s.sq>0)?s.sq*cell*.03:0;
  g.fillStyle='rgba(0,30,20,'+(.3-air/cell*.2)+')';g.beginPath();g.ellipse(lc[0],base+ck*.06,cell*.3*(1-air/cell*.2),cell*.1,0,0,TAU);g.fill();
  drawLarry(g,lc[0],base-air+dp,cell*.27,{t:t,face:s.face,sq:sq,st:stt,mouth:s.hop?3:1,lamp:1});}
 ,auto:function(s,B,L){var h=PZ.lily.hint(s,L);if(!h||!h.mark)return null;var c=PZ.lily.cellXY(B,h.mark.x,h.mark.y);return[{t:'tap',x:c[0],y:c[1]}]}
 ,badge:function(s){return s.P.nf>0?{n:s.P.nf,k:s.P.nf-s.st.n,draw:function(x,y,r,i){lotus(x,y,r*.95,P?P.t:0,i)}}:null}
};
function drawLanternMini(x,y,r,on,t){g.save();g.translate(x,y);g.fillStyle='#6b4423';g.fillRect(-r*.04,-r*.1,r*.08,r*.5);g.beginPath();g.moveTo(-r*.22,-r*.1);g.lineTo(-r*.18,-r*.62);g.quadraticCurveTo(0,-r*.78,r*.18,-r*.62);g.lineTo(r*.22,-r*.1);g.closePath();g.fillStyle=on?LG(g,0,-r*.7,0,-r*.1,[0,'#fff8c8',1,'#ffb43a']):'rgba(210,200,170,.5)';g.fill();g.strokeStyle='#7a5200';g.lineWidth=Math.max(1,r*.06);g.stroke();
 if(on){g.globalCompositeOperation='lighter';glow(g,0,-r*.4,r*1.1,'#ffe27a',.6+.2*Math.sin(t*5))}g.restore()}
