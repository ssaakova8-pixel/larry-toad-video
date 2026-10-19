/* ===== p1: отрисовка мира забега ===== */
var HS=1.0;                                   /* масштаб героя относительно U */
function drawPadAny(p,x,pal){var y=PADY()+(p.sink>0?p.sink*U*.55:0)+p.dip*U*.35,o={pal:pal,lit:p.lit,flower:p.flower,t:V.t,sink:0};
 if(p.sink>=1)return;
 if(p.k==='ice')drawIce(g,x,y,p.r,U,o);else if(p.k==='log')drawLog(g,x,y,p.r,U,o);else if(p.k==='dock')drawDock(g,x,y,p.r,U,o);
 else{if(p.k==='sink'){o.c1='#c9d36a';o.c2='#8a9a3a'}if(p.k==='move'){o.c1='#2fb59a';o.c2='#17756a'}drawLily(g,x,y,p.r,U,o);
  if(p.k==='sink'&&p.sink>.02){g.fillStyle='rgba(220,245,255,.7)';for(var i=0;i<3;i++){g.beginPath();g.arc(x+Math.sin(V.t*5+i*2)*p.r*U*.5,y-6-((V.t*30+i*20)%22),2+i*.6,0,TAU);g.fill()}}}
 if(p.k==='move'){g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=2;g.setLineDash([4,6]);g.beginPath();g.moveTo(SX(p.x0-p.amp),y);g.lineTo(SX(p.x0+p.amp),y);g.stroke();g.setLineDash([])}
 if(p.finish){drawFinishFlag(x,y,p)}
 if(p.lamp)drawLampPost(x-p.r*U*.62,y,p.lampOn)}
function drawFinishFlag(x,y,p){var h=U*2.3,px=x+p.r*U*.55;g.strokeStyle='#5a3a1c';g.lineWidth=U*.09;g.lineCap='round';g.beginPath();g.moveTo(px,y);g.lineTo(px,y-h);g.stroke();
 var w=U*1.5,hh=U*.9,n=6,cw=w/n;for(var i=0;i<n;i++)for(var j=0;j<3;j++){g.fillStyle=(i+j)%2?'#fff':'#1a1a22';g.fillRect(px+i*cw+Math.sin(V.t*5+i)*1.2,y-h+j*hh/3+Math.sin(V.t*5+i)*2,cw+.5,hh/3+.5)}
 g.strokeStyle='#1a1a22';g.lineWidth=2;g.strokeRect(px,y-h,w,hh)}
function drawLampPost(x,y,on){var h=U*1.7;g.strokeStyle='#4a3420';g.lineWidth=U*.07;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.lineTo(x,y-h);g.stroke();g.beginPath();g.moveTo(x,y-h);g.quadraticCurveTo(x+U*.35,y-h-U*.1,x+U*.35,y-h+U*.18);g.stroke();
 var lx=x+U*.35,ly=y-h+U*.2;g.beginPath();g.moveTo(lx-U*.14,ly);g.lineTo(lx+U*.14,ly);g.lineTo(lx+U*.11,ly+U*.32);g.lineTo(lx-U*.11,ly+U*.32);g.closePath();g.fillStyle=on?LG(g,0,ly,0,ly+U*.32,[0,'#fff6c0',1,'#ffb43a']):'#59616b';g.fill();g.strokeStyle='#2b323a';g.lineWidth=U*.04;g.stroke();
 if(on)glow(g,lx,ly+U*.16,U*1.6,'#ffd25a',.6+Math.sin(V.t*5)*.08)}

/* ---------- прицел: дуга, кольцо приземления, подсветка кувшинки ---------- */
function drawAim(){var F=S.F;if(F.mode!=='sit'||!F.hold||F.stuck>0||S.dash||(S.phase!=='play'&&S.phase!=='lead'&&S.phase!=='boss'))return;
 var c=Math.max(JUMP.minC,F.c),pr=predictLanding(S,c),j=pr.j,x1=pr.x1,col=pr.perfect?'#ffe27a':pr.good?'#8dffb0':pr.pi>=0?'#ffd8a0':'#ff9a7a',tier=S.tier;
 if(sv.set.hint&&tier.arc>=2){var n=16,i;for(i=1;i<n;i++){var s=i/n,wx=F.x+j.D*s,hy=4*j.H*s*(1-s),a=.2+.5*(1-Math.abs(s-.5)*1.2);g.beginPath();g.arc(SX(wx),SY(hy)-U*.9,Math.max(2.4,U*.055),0,TAU);g.fillStyle='rgba(255,255,255,'+a+')';g.fill()}}
 /* подсветка кувшинки-цели */
 if(pr.pi>=0){var tp=S.pads[pr.pi],px=SX(tp.x),py=PADY();g.save();g.translate(px,py);g.scale(1,.3);g.beginPath();g.arc(0,0,tp.r*U*1.04,0,TAU);g.strokeStyle=rgba(pr.perfect?'#ffe27a':'#8dffb0',.55+(pr.perfect?.25*Math.sin(V.t*14):0));g.lineWidth=U*.12;g.stroke();g.restore()}
 /* кольцо приземления */
 var mx=SX(x1),my=PADY()+U*.05,pulse=1+Math.sin(V.t*8)*.06;
 g.save();g.translate(mx,my);g.scale(1,.3);g.beginPath();g.arc(0,0,U*.55*pulse,0,TAU);g.lineWidth=U*.12;g.strokeStyle=col;g.globalAlpha=.95;g.stroke();g.beginPath();g.arc(0,0,U*.2,0,TAU);g.fillStyle=col;g.fill();g.restore();g.globalAlpha=1;
 if(pr.perfect){glow(g,mx,my,U*1.2,'#ffe27a',.5);if(!V.lockOn){V.lockOn=true;sfx('tick');vib(8)}}else V.lockOn=false;
 /* шкала заряда вокруг героя */
 var cx=SX(F.x),cy=SY(F.y)-U*1.05*HS;g.beginPath();g.arc(cx,cy,U*1.35,-PI/2,-PI/2+TAU*F.c);g.strokeStyle=pr.perfect?'#ffe27a':'rgba(255,255,255,.85)';g.lineWidth=Math.max(4,U*.1);g.lineCap='round';g.stroke();g.beginPath();g.arc(cx,cy,U*1.35,0,TAU);g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=Math.max(2,U*.05);g.stroke()}

/* ---------- герой ---------- */
function larryPose(){var F=S.F,o={t:V.t,face:1,lamp:1,sq:F.sq,st:F.st,tilt:F.tilt||0,bl:V.bl||0,mouth:1,lid:.06,tl:.35,fear:0,cape:V.t*3};
 if(F.mode==='air'){o.mouth=3;o.lid=0;o.tl=-.1;o.cape=V.t*10}
 if(F.mode==='sit'&&F.hold&&F.stuck<=0){o.mouth=F.c>.6?3:1;o.lid=.12;o.tl=.55}
 if(F.stuck>0){o.mouth=4;o.fear=1;o.sq=.25}
 if(F.mode==='fall'){o.mouth=2;o.fear=1;o.lid=0}
 if(F.mode==='rescue'){o.mouth=4;o.fear=1;o.lid=0;o.sq=0}
 if(F.hurt>0){o.mouth=2;o.lid=.55;o.tl=.2;o.fear=.8}
 if(F.mode==='dead'){o.mouth=2;o.lid=.9}
 if(F.mode==='dash'){o.mouth=3;o.lid=.2;o.tl=.7;o.cape=V.t*14}
 if(S.phase==='win'){o.mouth=3;o.lid=0}
 if(F.atk>0){var k=1-F.atk/STRIKE_T,e=easeOut(Math.min(1,k*1.6));o.sw=lerp(-2.3,.5,e);o.mouth=3}
 if(F.tongue){var tg=F.tongue,dx=(tg.x-F.x)*U,dy=(SY(F.y)-SY(tg.y));o.tongue=Math.sin((1-tg.t/.16)*PI);o.tang=Math.atan2(-(SY(tg.y)-(SY(F.y)-U*1.35)),(tg.x-F.x)*U);o.tlen=Math.min(3.2,Math.hypot(dx,dy)/(U*.85));o.mouth=2}
 if(F.mode==='sit'&&!F.hold&&F.atk<=0&&F.hurt<=0){if(S.boss||nearDanger()){o.fear=.7;o.mouth=4;o.lid=0}}
 return o}
function nearDanger(){for(var i=0;i<S.en.length;i++){var e=S.en[i];if(!e.dead&&Math.abs(e.x-S.F.x)<4&&e.act)return true}return false}
function drawLarryAll(refl){var F=S.F,o=larryPose(),x=SX(F.x),y=SY(F.y)-U*.04,hs=U*.85*HS;
 if(!refl&&F.mode==='sit'&&!S.dash){g.fillStyle='rgba(4,20,14,.3)';g.beginPath();g.ellipse(x+U*.05,PADY()+U*.035,U*.55,U*.11,0,0,TAU);g.fill()}
 if(S.dash){drawHopPorokh(x,o);return}
 if(F.mode==='fall'){g.save();g.beginPath();g.rect(0,0,W,PADY()+U*.1);g.clip();drawLarry(g,x,y,hs,o);g.restore();return}
 if(F.inv>0&&F.hurt<=0&&((V.t*20)|0)%2===0&&!refl)g.globalAlpha=.55;
 /* сочный след на идеальной серии */
 drawLarry(g,x,y,hs,o);g.globalAlpha=1}
function drawGhost(){var G=V.ghost;if(!G||!G.S)return;var F=G.S.F;if(G.S.phase==='win')return;var x=SX(F.x),y=SY(F.y)-U*.04,o={t:V.t,face:1,lamp:1,sq:F.sq,st:F.st,tilt:F.tilt||0,mouth:1,lid:.06,tl:.35};
 g.save();g.globalAlpha=.38;g.filter='none';if(F.mode==='air'){o.mouth=3;o.lid=0}if(F.mode==='sit'&&F.hold)o.lid=.12;
 if(x>-U*2&&x<W+U*2){drawLarry(g,x,y,U*.85*HS,o);txt(G.name||'Призрак',x,y-U*3.3,fzs(12),'rgba(255,255,255,.8)',{al:'center',fam:FU,w:700,sh:'rgba(0,0,0,.5)'})}
 g.restore()}
function drawKrapR(){var K=V.krap,F=S.F,o={t:V.t,fly:1,flap:K.flap,mouth:1,brow:0,lx:.5,tilt:Math.sin(V.t*2)*.05};
 if(K.mood===3){o.mouth=3;o.brow=-.6}else if(V.bub&&V.bub.who==='krap'){o.mouth=((V.t*8)|0)%2?2:1}else if(S.boss||nearDanger()){o.brow=.6;o.mouth=0}
 if(F.mode==='sit'&&F.hold)o.lx=.7;
 if(krapCaged()){var cx0=SX(K.x),cy0=SY(K.y);o.mouth=((V.t*3)|0)%2?2:0;o.brow=.7;o.tilt=0;glow(g,cx0,cy0,U*1.9,'#ffcf66',.45);drawKrap(g,cx0,cy0,U*.62*HS,o);drawBell(cx0,cy0);return}
 drawKrap(g,SX(K.x),SY(K.y),U*.62*HS,o)}
/* стеклянный колпак на ржавой цепи: сквозь него видно Крапинку, а блики говорят, что стекло настоящее */
function drawBell(x,y){var r=U*.8,h=U*1.15,by=y+U*.52;
 g.save();g.lineCap='round';g.strokeStyle='rgba(70,56,40,.95)';g.lineWidth=Math.max(2,U*.055);g.setLineDash([U*.14,U*.08]);g.beginPath();g.moveTo(x,y-h-U*.12);g.lineTo(x,-12);g.stroke();g.setLineDash([]);
 g.beginPath();g.moveTo(x-r,by);g.bezierCurveTo(x-r*1.02,y-h*1.15,x+r*1.02,y-h*1.15,x+r,by);g.closePath();
 var gr=g.createLinearGradient(x-r,y-h,x+r,by);gr.addColorStop(0,'rgba(215,245,255,.34)');gr.addColorStop(.6,'rgba(170,220,240,.12)');gr.addColorStop(1,'rgba(150,210,235,.2)');g.fillStyle=gr;g.fill();
 g.strokeStyle='rgba(232,252,255,.85)';g.lineWidth=Math.max(1.5,U*.04);g.stroke();
 g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=Math.max(2,U*.06);g.beginPath();g.moveTo(x-r*.62,by-h*.28);g.bezierCurveTo(x-r*.7,y-h*.55,x-r*.4,y-h*.82,x-r*.12,y-h*.86);g.stroke();
 g.fillStyle='#b98a2a';g.fillRect(x-r*1.08,by,r*2.16,U*.17);g.fillStyle='#7a5a1c';g.fillRect(x-r*1.08,by+U*.12,r*2.16,U*.05);
 g.fillStyle='#b98a2a';g.beginPath();g.arc(x,y-h-U*.02,U*.13,0,TAU);g.fill();g.strokeStyle='#5a4210';g.lineWidth=Math.max(1,U*.025);g.stroke();
 g.restore()}
function drawNewEnemy(e){var x=SX(e.x),y=SY(e.y),t=V.t+(e.ph||0),dead=e.dead,al=dead?Math.max(0,1-e.dt*1.3):1,a=.5+.5*Math.sin(V.t*30);if(x<-U*3||x>W+U*3)return;
 g.save();if(al<1)g.globalAlpha=al;
 if(e.k==='beetle'){drawBeetle(g,x,y,U*.74,{t:t,face:e.face||1,st:dead?'stun':e.st,ang:(e.ox||0)/.58,guard:e.guard,tilt:dead?e.dt*7:0});
  if(!dead&&e.st==='tele'){g.fillStyle='rgba(255,70,70,'+(.45+.45*a)+')';setFont(Math.round(U*.8),900,FU);g.textAlign='center';g.fillText('!',x,y-U*1.05)}}
 else if(e.k==='saw'){drawSaw(g,x,y,U*.66,{t:t,refl:e.refl})}
 else if(e.k==='dropper'){drawDropper(g,x,y,U*.74,{t:e.t,st:dead?'dangle':e.st});
  if(!dead&&e.st==='tele'){g.fillStyle='rgba(255,70,70,'+(.45+.45*a)+')';setFont(Math.round(U*.8),900,FU);g.textAlign='center';g.fillText('!',x,y+U*1.0)}}
 else if(e.k==='mortar'){var F=S.F,tx=SX(F.x),ty=SY(F.y+.6),ang=Math.max(PI*.52,Math.min(PI*.98,Math.atan2(ty-y,tx-x)+(ty-y<0?TAU:0)));
  var tele=e.st==='tele'&&!dead;
  drawBug(g,x,y,U*.58,{k:'mortar',t:V.t,face:-1,ph:e.ph,mood:dead?3:0,tilt:dead?e.dt*6:0});
  g.save();g.translate(x-U*.05,y+U*.3);g.rotate(ang);var L=U*.66,Wd=U*.27;
  g.beginPath();g.rect(0,-Wd/2,L,Wd);g.fillStyle=LG(g,0,-Wd/2,0,Wd/2,[0,'#f0d27a',.5,'#b88a2a',1,'#5a4410']);g.fill();g.strokeStyle='#2a1c06';g.lineWidth=U*.04;g.stroke();
  g.beginPath();g.rect(L-U*.05,-Wd*.62,U*.1,Wd*1.24);g.fillStyle='#8a6a1c';g.fill();g.stroke();
  if(tele){var k=Math.min(1,e.t/.82);glow(g,L+U*.05,0,U*(.3+k*.9),'#ff6a3a',.4+k*.5)}
  g.restore();
  if(tele){var lx=F.x+(F.mode==='air'?F.D*(1-F.s):0),rx=SX(lx),ry=PADY(),r1=U*(.5+.25*a);
   g.strokeStyle='rgba(255,70,70,'+(.4+.4*a)+')';g.lineWidth=U*.07;g.beginPath();g.ellipse(rx,ry+U*.05,r1,r1*.28,0,0,TAU);g.stroke();
   g.fillStyle='rgba(255,70,70,'+(.45+.45*a)+')';setFont(Math.round(U*.8),900,FU);g.textAlign='center';g.fillText('!',x,y-U*.95)}}
 g.restore()}
function drawEnemy(e){if(NEWEN[e.k]){drawNewEnemy(e);return}var ey=e.k==='gnat'?e.yy:e.y,x=SX(e.x),y=SY(ey||0);if(x<-U*3||x>W+U*3)return;
 var o={k:e.k==='gnat'?'gnat':'soldier',t:V.t,face:-1,ph:e.ph,mood:0,atk:e.st==='dive'?1:0};
 if(e.dead){o.mood=3;o.tilt=e.dt*6}
 if(e.k==='soldier'&&e.st==='tele'){x+=Math.sin(V.t*60)*2}
 if(e.k==='soldier'&&e.st==='tele'&&!e.dead){var a=.5+.5*Math.sin(V.t*30);
  /* предупреждение: красный знак и линия пикирования */
  var tx=SX(S.F.x),ty=SY(S.F.y+.7);g.strokeStyle='rgba(255,70,70,'+(a*.35)+')';g.lineWidth=U*.12;g.setLineDash([U*.18,U*.22]);g.beginPath();g.moveTo(x,y);g.lineTo(tx,ty);g.stroke();g.setLineDash([]);
  g.fillStyle='rgba(255,70,70,'+(.45+.45*a)+')';setFont(Math.round(U*.8),900,FU);g.textAlign='center';g.fillText('!',x,y-U*.85)}
 drawBug(g,x,y,e.k==='gnat'?U*.64:U*.58,o)}
function drawProj(q){var x=SX(q.x),y=SY(q.y);
 if(q.k==='sting'){g.save();g.translate(x,y);g.rotate(Math.atan2(-q.vy,q.vx));glow(g,0,0,U*.6,q.own==='pl'?'#9fe8ff':'#ffb84a',.55);g.beginPath();g.moveTo(U*.3,0);g.lineTo(-U*.25,-U*.1);g.lineTo(-U*.25,U*.1);g.closePath();g.fillStyle=q.own==='pl'?'#d8f6ff':'#ffd23a';g.fill();g.strokeStyle='#3a2a1a';g.lineWidth=U*.05;g.stroke();g.restore()}
 else if(q.k==='web'){glow(g,x,y,U*.7,'#ffffff',.5);g.beginPath();g.arc(x,y,U*.3,0,TAU);g.fillStyle='rgba(245,250,255,.95)';g.fill();g.strokeStyle='rgba(130,150,190,.9)';g.lineWidth=U*.04;g.stroke();for(var i=0;i<5;i++){var a=i*TAU/5+V.t*3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*U*.3,y+Math.sin(a)*U*.3);g.stroke()}}
 else if(q.k==='hex'){g.save();g.translate(x,y);glow(g,0,0,U*1.0,'#ffd04a',.6);g.beginPath();for(var k=0;k<6;k++){var an=k*PI/3+V.t*2;g.lineTo(Math.cos(an)*U*.42,Math.sin(an)*U*.42)}g.closePath();g.fillStyle=LG(g,0,-U*.4,0,U*.4,[0,'#fff1a0',1,'#e0a010']);g.fill();g.strokeStyle='#7a4a00';g.lineWidth=U*.05;g.stroke();g.restore();
  g.fillStyle='rgba(255,60,60,.25)';g.beginPath();g.ellipse(x,PADY()+U*.05,U*.5,U*.15,0,0,TAU);g.fill()}}
function drawParts(){for(var i=0;i<V.parts.length;i++){var p=V.parts[i];if(p.t<0)continue;var a=1-p.t/p.life,x=SX(p.x),y=SY(p.y);
  if(p.k==='sp'){glow(g,x,y,U*(p.r*7+.2)*a,p.c,.8*a)}
  else if(p.k==='dr'){g.fillStyle='rgba(215,240,255,'+(a*.9)+')';g.beginPath();g.arc(x,y,Math.max(1.5,U*p.r),0,TAU);g.fill()}
  else if(p.k==='ring'){var rr0=U*(.3+(1-a)*1.6*(p.s||1));g.strokeStyle=rgba(p.c.length===7?p.c:'#dff6ff',a*.8);g.lineWidth=2;g.beginPath();g.ellipse(x,PADY()+U*.06,rr0,rr0*.28,0,0,TAU);g.stroke()}}
 for(i=0;i<V.txts.length;i++){var q=V.txts[i],al=Math.min(1,((q.life||1.2)-q.t)*2.2),px=q.big?fz(26):fz(20);var ppx=px*(q.t<.15?q.t/.15:1);setFont(px,800,FU);var hw=g.measureText(q.s).width/2+10,qx=Math.max(SAFE.l+hw,Math.min(W-SAFE.r-hw,SX(q.x)));txt(q.s,qx,SY(q.y),ppx,q.c,{al:'center',fam:FU,w:800,sh:'rgba(10,20,40,'+al*.9+')'})}}
function drawWindStreaks(){if(Math.abs(S.wind)<.12)return;var n=14,dir=S.wind>0?1:-1;g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=2;g.lineCap='round';for(var i=0;i<n;i++){var sp=60+(i*37%50),x=((i*131+V.t*sp*dir*Math.abs(S.wind)*2.2)%(W+200)+W+200)%(W+200)-100,y=H*.1+(i*53%100)/100*(WY-H*.1),l=30+(i*17%40);g.beginPath();g.moveTo(x,y);g.lineTo(x+l*dir,y+2);g.stroke()}}
function drawDark(){var P=PAL[V.palI||0],a=P.dark;if(S.mode==='race')a=P.dark*.55;if(S.mode==='endless')a=lerp(.5,.06,S.dawn||0);if(S.dark)a=Math.max(a,S.dark*.82);
 if(S.phase==='dawn'||S.phase==='perk')a*=Math.max(0,1-V.dawnT*.6);if(S.phase==='win')a*=Math.max(0,1-S.phT*.5);
 if(a<=.01)return;var F=S.F,cx=SX(F.x),cy=SY(F.y)-U*1,r0=U*(S.dark?1.4:2.4),r1=U*(S.dark?5.2:9.5);
 var q=g.createRadialGradient(cx,cy,r0,cx,cy,r1);q.addColorStop(0,'rgba(4,8,22,0)');q.addColorStop(1,'rgba(4,8,22,'+a+')');g.fillStyle=q;g.fillRect(0,0,W,H);
 g.globalCompositeOperation='lighter';var gl=g.createRadialGradient(cx,cy,0,cx,cy,U*4.2);gl.addColorStop(0,'rgba(255,214,120,.22)');gl.addColorStop(1,'rgba(255,214,120,0)');g.fillStyle=gl;g.fillRect(cx-U*5,cy-U*5,U*10,U*10);g.globalCompositeOperation='source-over'}
function drawPrize(){var pr=S.prize;if(!pr)return;var x=SX(pr.x),y=SY(2.1+Math.sin(V.t*2)*.2);glow(g,x,y,U*2.6,'#ffe27a',.75);drawLanternPart(g,x,y,U*.7,S.land,V.t)}
function drawLanternPart(g,x,y,s,ch,t){g.save();g.translate(x,y);g.rotate(Math.sin(t*1.6)*.08);var k=ch;
 if(k===0){g.strokeStyle='#e6d6a8';g.lineWidth=s*.22;g.lineCap='round';g.beginPath();g.moveTo(-s*.5,s*.4);g.quadraticCurveTo(0,-s*.1,s*.5,-s*.6);g.stroke();g.strokeStyle='#8a6a3a';g.lineWidth=s*.07;g.beginPath();g.moveTo(-s*.5,s*.4);g.quadraticCurveTo(0,-s*.1,s*.5,-s*.6);g.stroke();g.beginPath();g.arc(s*.5,-s*.65,s*.12,0,TAU);g.fillStyle='#ffe27a';g.fill()}
 else if(k===1){g.beginPath();g.moveTo(-s*.45,s*.55);g.lineTo(-s*.5,-s*.3);g.quadraticCurveTo(0,-s*.8,s*.5,-s*.3);g.lineTo(s*.45,s*.55);g.closePath();g.fillStyle=LG(g,-s,-s,s,s,[0,'rgba(240,252,255,.95)',1,'rgba(150,200,235,.6)']);g.fill();g.strokeStyle='#8ac';g.lineWidth=s*.06;g.stroke();g.beginPath();g.moveTo(-s*.25,-s*.25);g.lineTo(-s*.28,s*.3);g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=s*.07;g.stroke()}
 else if(k===2){g.beginPath();g.moveTo(0,-s*.7);g.bezierCurveTo(s*.6,-s*.1,s*.5,s*.55,0,s*.6);g.bezierCurveTo(-s*.5,s*.55,-s*.6,-s*.1,0,-s*.7);g.fillStyle=LG(g,0,-s,0,s,[0,'#fff4b0',1,'#ffb43a']);g.fill();g.strokeStyle='#a56000';g.lineWidth=s*.07;g.stroke()}
 else if(k===3){g.strokeStyle='#e0b050';g.lineWidth=s*.14;g.lineJoin='round';g.beginPath();g.moveTo(-s*.5,s*.5);g.lineTo(-s*.5,-s*.3);g.lineTo(0,-s*.7);g.lineTo(s*.5,-s*.3);g.lineTo(s*.5,s*.5);g.closePath();g.stroke();g.strokeStyle='#fff2b0';g.lineWidth=s*.04;g.stroke()}
 else{g.strokeStyle='#ffd04a';g.lineWidth=s*.2;g.beginPath();g.arc(0,0,s*.5,0,TAU);g.stroke();g.strokeStyle='#fff6b0';g.lineWidth=s*.05;g.beginPath();g.arc(0,0,s*.5,.4,2.2);g.stroke()}
 g.restore()}
function drawBoss(){var b=S.boss;if(!b||b.k==='wave')return;var x=SX(b.x),y=SY(b.y),fl=b.flash>0&&((V.t*30)|0)%2===0;
 if(b.st==='tele'){var a=.25+.25*Math.sin(V.t*26);
  if(b.cur==='cl'||b.cur==='ch'||b.cur==='lowc'||b.cur==='highc'||b.cur==='dbl'){g.fillStyle='rgba(255,60,60,'+a+')';g.fillRect(0,SY(b.h)-U*.55-U*.8,W,U*1.1);txt('!',W-U*.7,SY(b.h)-U*.2,Math.round(U*1.1),'#fff',{al:'center',fam:FU,w:900,sh:'#c01010'})}
  else if(b.cur==='drop'||b.cur==='drop2'){var px=SX(b.dropX);g.fillStyle='rgba(255,60,60,'+a+')';g.beginPath();g.ellipse(px,PADY(),U*1.5,U*.45,0,0,TAU);g.fill()}
  else if(b.cur==='rain'){b.rx.forEach(function(rx){g.fillStyle='rgba(255,80,60,'+a+')';g.beginPath();g.ellipse(SX(rx),PADY(),U*.7,U*.22,0,0,TAU);g.fill()})}
  else if(b.cur==='lance'){g.strokeStyle='rgba(255,60,60,'+(a+.2)+')';g.lineWidth=U*.3;g.beginPath();g.moveTo(x,y);g.lineTo(SX(b.tx2),SY(b.ty2));g.stroke()}}
 g.save();if(b.inv>0&&((V.t*24)|0)%2===0)g.globalAlpha=.55;
 if(b.k==='spider'){drawSpider(g,x,y,U*1.05,{t:V.t,mood:b.st==='tele'?1:0,stun:b.st==='stun'||b.st==='die',top:SAFE.t+60})}
 else{var kk=b.k==='bass'?'bass':b.k==='captain'?'captain':'emperor';var sc=U*(kk==='emperor'?.62:kk==='bass'?.58:.58);
  drawBug(g,x,y,sc,{k:kk,t:V.t,face:-1,mood:b.st==='stun'||b.st==='die'?3:b.st==='tele'?0:(kk==='emperor'?(bossPhase(b)>=3?2:1):0),tilt:b.st==='die'?b.t*2:0,wf:b.st==='stun'?V.t*8:undefined,atk:b.st==='atk'?1:0})}
 g.restore();
 if(b.st==='stun'){for(var i=0;i<3;i++){var a2=V.t*5+i*TAU/3;icStar(g,x+Math.cos(a2)*U*.8,y-U*1.3+Math.sin(a2)*U*.25,U*.18,'#ffe27a')}}
 if(fl)glow(g,x,y,U*2,'#ffffff',.6);
 glow(g,x,y,U*(b.k==='emperor'?2.4:1.6),b.k==='emperor'?'#ffd04a':'#ffd69a',.18)}
function drawSwing(){var F=S.F;if(F.atk<=0)return;var k=1-F.atk/STRIKE_T,a2=Math.sin(clamp(k,0,1)*PI)*.8,rx2=reachX(S)*U;g.save();g.translate(SX(F.x)+U*.3,SY(F.y)-U*1.1);g.beginPath();g.arc(0,0,rx2*.82,-1.0,.5);g.strokeStyle='rgba(255,255,255,'+a2+')';g.lineWidth=U*.28*(1-k*.5);g.lineCap='round';g.stroke();g.beginPath();g.arc(0,0,rx2*.82,-.7,.2);g.strokeStyle='rgba(180,230,255,'+a2+')';g.lineWidth=U*.12;g.stroke();g.restore()}
function drawTrail(){for(var i=0;i<V.trail.length;i++){var q=V.trail[i],a=1-q.t/.35;glow(g,SX(q.x),SY(q.y),U*(.35+.5*V.flowK)*a,V.flowK>.3?'#ffe27a':'#dff6ff',.35*a*(.4+V.flowK))}}

/* ---------- весь мир ---------- */
function ensureVig(P){var k=W+'x'+H+'|'+(V.palI||0);if(V.vig&&V.vigK===k)return V.vig;
 var c=mkc(Math.ceil(W/3),Math.ceil(H/3)),x=c.getContext('2d');x.scale(1/3,1/3);x.translate(W/2,H/2);x.scale(1,H/W);
 x.fillStyle=RG(x,0,0,W*.34,W*.8,[0,rgba(P.sky[0],0),.55,rgba(P.sky[0],.1),1,rgba(P.sky[0],.64)]);x.fillRect(-W,-W,W*2,W*2);V.vig=c;V.vigK=k;return c}
/* кино-проход: цветокоррекция (тёплый верх, холодная вода) и мягкое свечение кадра, как светофильтр на объективе.
   Свечение — это уменьшенная копия кадра, наложенная режимом «экран»: светлое светится, тёмное нет. Отключается само, если телефон не тянет. */
var FILM={c:null,x:null,k:'',dead:false,on:false,cut:0};
function filmPass(P){if(FILM.dead||!sv.set.film)return;
 if(PQ.ema>(S.mode==='race'?18:20)){if(FILM.on){FILM.on=false;if(++FILM.cut>=2)FILM.dead=true}return}
 FILM.on=true;
 var gr=LG(g,0,0,0,H,[0,'rgba(255,196,120,.11)',.45,'rgba(255,170,120,0)',1,'rgba(10,60,90,.16)']);g.fillStyle=gr;g.fillRect(0,0,W,H);
 var bw=Math.max(80,Math.round(W/5)),bh=Math.max(48,Math.round(H/5)),k=bw+'x'+bh;
 if(!FILM.c||FILM.k!==k){FILM.c=mkc(bw,bh);FILM.x=FILM.c.getContext('2d');FILM.k=k}
 try{FILM.x.setTransform(1,0,0,1,0,0);FILM.x.globalCompositeOperation='copy';FILM.x.imageSmoothingEnabled=true;FILM.x.drawImage(cv,0,0,cv.width,cv.height,0,0,bw,bh);
  g.save();g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='screen';g.globalAlpha=.2;g.imageSmoothingEnabled=true;g.drawImage(FILM.c,0,0,bw,bh,0,0,cv.width,cv.height);g.restore();g.setTransform(dpr,0,0,dpr,0,0)}catch(e){sv.set.film=0}}
/* ---------- вехи пути: каждая земля узнаётся издалека (мост, улей, паутина, ледяная арка, шестерёнчатые ворота) ---------- */
function lmList(){if(V.lmP===S.pads&&V.lmA)return V.lmA;var n=S.pads.length,a=[],i,fr=S.mode==='story'?[.2,.5,.8]:[.3,.7];
 for(i=0;i<fr.length;i++){var pi=Math.max(3,Math.min(n-4,Math.round(n*fr[i]))),p=S.pads[pi],q=S.pads[pi+1]||p;a.push({x:(p.x+q.x)/2+.2*((pi*7)%3-1),v:(S.mode==='story'?S.land:((S.night||1)+i)%5),i:i})}
 V.lmP=S.pads;V.lmA=a;return a}
function drawLandmarks(P){var L=lmList(),i,t=V.t;
 for(i=0;i<L.length;i++){var m=L[i],x=SX(m.x);if(x<-U*6||x>W+U*6)continue;var wy=WY+U*.1;
  g.save();g.translate(x,wy);
  if(m.v===0){ /* старый мост с фонарями */
   var pw=U*.5;for(var sd=-1;sd<=1;sd+=2){g.fillStyle=LG(g,0,-U*4.5,0,0,[0,'#6b4a2a',1,'#2e1c0e']);g.fillRect(sd*U*3.4-pw/2,-U*4.3,pw,U*4.4);g.fillStyle='#8a6038';g.fillRect(sd*U*3.4-pw*.7,-U*4.45,pw*1.4,U*.22)}
   g.strokeStyle='#4a3018';g.lineWidth=U*.36;g.lineCap='round';g.beginPath();g.moveTo(-U*3.4,-U*4.2);g.quadraticCurveTo(0,-U*5.3,U*3.4,-U*4.2);g.stroke();
   g.strokeStyle='rgba(255,214,150,.5)';g.lineWidth=U*.06;g.beginPath();g.moveTo(-U*3.4,-U*4.34);g.quadraticCurveTo(0,-U*5.44,U*3.4,-U*4.34);g.stroke();
   for(var k=-1;k<=1;k++){var lx=k*U*1.9,ly=-U*(4.75-(1-k*k)*.55),sw=Math.sin(t*1.3+k+m.i)*U*.12;g.strokeStyle='rgba(40,24,10,.9)';g.lineWidth=U*.05;g.beginPath();g.moveTo(lx,ly);g.lineTo(lx+sw*.5,ly+U*.55);g.stroke();
    glow(g,lx+sw*.5,ly+U*.9,U*1.4,'#ffc060',.5);g.fillStyle='#ffe9a8';g.beginPath();g.ellipse(lx+sw*.5,ly+U*.9,U*.2,U*.28,0,0,TAU);g.fill();g.strokeStyle='#7a4a10';g.lineWidth=U*.04;g.stroke()}
  }else if(m.v===1){ /* улей на камышах */
   g.strokeStyle='#3a4a1a';g.lineWidth=U*.1;for(var r=-1;r<=1;r+=2){g.beginPath();g.moveTo(r*U*1.6,0);g.quadraticCurveTo(r*U*1.9,-U*3,r*U*.6,-U*5.6);g.stroke()}
   glow(g,0,-U*4.6,U*3.2,'#ffb030',.32);
   for(var row=0;row<4;row++)for(var c=0;c<4-row%2;c++){var hx=(c-1.5+(row%2)*.5)*U*.62,hy=-U*3.5-row*U*.54;g.beginPath();for(var q=0;q<6;q++){var an=PI/6+q*PI/3;g.lineTo(hx+Math.cos(an)*U*.34,hy+Math.sin(an)*U*.34)}g.closePath();
    g.fillStyle=LG(g,hx,hy-U*.3,hx,hy+U*.3,[0,'#ffd870',1,'#c07818']);g.fill();g.strokeStyle='#6a3e08';g.lineWidth=U*.04;g.stroke()}
  }else if(m.v===2){ /* паутина между мёртвыми деревьями */
   g.strokeStyle='rgba(30,20,40,.95)';g.lineWidth=U*.28;g.lineCap='round';for(var d=-1;d<=1;d+=2){g.beginPath();g.moveTo(d*U*3.3,0);g.quadraticCurveTo(d*U*3.6,-U*2.5,d*U*3.1,-U*5.2);g.stroke();g.lineWidth=U*.08;g.beginPath();g.moveTo(d*U*3.2,-U*3);g.lineTo(d*U*2.2,-U*4.2);g.stroke();g.lineWidth=U*.28}
   g.strokeStyle='rgba(235,242,255,.55)';g.lineWidth=U*.025;var cx=0,cy=-U*3.2;
   for(var sp=0;sp<9;sp++){var a0=sp*TAU/9;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a0)*U*3.2,cy+Math.sin(a0)*U*2.1);g.stroke()}
   for(var rg=1;rg<=5;rg++){g.beginPath();for(var sp2=0;sp2<=9;sp2++){var a1=sp2*TAU/9,rr2=rg*.2+(sp2%2?-.02:0);var px=cx+Math.cos(a1)*U*3.2*rr2*(1+.06*Math.sin(t*.8+sp2)),py=cy+Math.sin(a1)*U*2.1*rr2;if(sp2===0)g.moveTo(px,py);else g.lineTo(px,py)}g.stroke()}
   for(var dw=0;dw<7;dw++){var da=dw*2.3+m.i,dr=(.25+(dw%4)*.2)*U*2.6,tw=.5+.5*Math.sin(t*3+dw*1.7);glow(g,cx+Math.cos(da)*dr,cy+Math.sin(da)*dr*.66,U*.35,'#dff6ff',.45*tw)}
  }else if(m.v===3){ /* ледяная арка */
   for(var e=-1;e<=1;e+=2){g.beginPath();g.moveTo(e*U*3.9,0);g.lineTo(e*U*3.1,-U*4.4);g.lineTo(e*U*2.4,-U*4.2);g.lineTo(e*U*2.9,0);g.closePath();g.fillStyle=LG(g,e*U*3,-U*4,e*U*3.4,0,[0,'rgba(220,245,255,.85)',1,'rgba(120,190,230,.45)']);g.fill();g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=U*.05;g.stroke()}
   g.beginPath();g.moveTo(-U*3.1,-U*4.4);g.quadraticCurveTo(0,-U*6.3,U*3.1,-U*4.4);g.lineTo(U*2.4,-U*4.2);g.quadraticCurveTo(0,-U*5.6,-U*2.4,-U*4.2);g.closePath();g.fillStyle='rgba(205,238,255,.8)';g.fill();g.stroke();
   for(var ic=-3;ic<=3;ic++){var ix=ic*U*.7,iy=-U*(5.05-Math.abs(ic)*.2),il=U*(.55+((ic*7)%3+3)%3*.22);g.beginPath();g.moveTo(ix-U*.12,iy);g.lineTo(ix,iy+il);g.lineTo(ix+U*.12,iy);g.closePath();g.fillStyle='rgba(235,250,255,.85)';g.fill()}
   var gl=.5+.5*Math.sin(t*2+m.i);glow(g,-U*2.9+gl*U*5.8,-U*3.2,U*.9,'#ffffff',.35)
  }else{ /* ворота Шестерона: две шестерни на столбах */
   for(var h2=-1;h2<=1;h2+=2){g.fillStyle=LG(g,0,-U*4,0,0,[0,'#6a5a48',1,'#2a2018']);g.fillRect(h2*U*3.3-U*.22,-U*3.6,U*.44,U*3.7);
    var gx=h2*U*3.3,gy=-U*3.9,gr=U*1.5,ga=t*.6*h2;g.save();g.translate(gx,gy);g.rotate(ga);g.beginPath();for(var tI=0;tI<20;tI++){var ta=tI*TAU/20;g.lineTo(Math.cos(ta-.07)*gr*.86,Math.sin(ta-.07)*gr*.86);g.lineTo(Math.cos(ta-.04)*gr,Math.sin(ta-.04)*gr);g.lineTo(Math.cos(ta+.04)*gr,Math.sin(ta+.04)*gr);g.lineTo(Math.cos(ta+.07)*gr*.86,Math.sin(ta+.07)*gr*.86)}
    g.closePath();g.fillStyle=RG(g,-gr*.3,-gr*.3,gr*.1,gr*1.2,[0,'#e8c878',.6,'#a87a28',1,'#4a3410']);g.fill();g.strokeStyle='#241808';g.lineWidth=U*.06;g.stroke();
    g.beginPath();g.arc(0,0,gr*.55,0,TAU);g.fillStyle='rgba(20,10,2,.55)';g.fill();g.strokeStyle='#c89a38';g.lineWidth=U*.14;for(var sk=0;sk<5;sk++){var sa=sk*TAU/5;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(sa)*gr*.55,Math.sin(sa)*gr*.55);g.stroke()}g.restore()}
   g.fillStyle='#3a2c1c';g.fillRect(-U*3.3,-U*5.5,U*6.6,U*.3);glow(g,0,-U*5.1,U*2.4,'#ff9a3a',.28);
   for(var wl=-2;wl<=2;wl++){glow(g,wl*U*1.1,-U*5.05,U*.6,'#ffb040',.5+.2*Math.sin(t*3+wl))}
  }
  g.restore()}}
function worldDraw(){var bg=ensureBG(),P=PAL[V.palI||0],F=S.F,i;
 g.save();if(V.shake>0)g.translate((Math.random()-.5)*V.shake*16,(Math.random()-.5)*V.shake*12);
 drawBG(g,bg,V.cam,V.t,U);
 if(S.mode==='endless'&&S.dawn>0){var a=S.dawn*.34;g.fillStyle=LG(g,0,0,0,WY,[0,rgba('#ff8a6a',a*.5),1,rgba('#ffd27a',a)]);g.fillRect(0,0,W,WY)}
 drawWater(g,bg,P,W,H,WY,V.cam,U,V.t);
 /* отражения */
 g.save();g.beginPath();g.rect(0,PADY(),W,H);g.clip();g.globalAlpha=.2;g.translate(0,2*PADY());g.scale(1,-1);drawLarryAll(true);drawKrapR();for(i=0;i<S.en.length;i++)drawEnemy(S.en[i]);g.restore();
 waterFade(g,P,W,H,WY);drawLandmarks(P);
 for(i=0;i<S.pads.length;i++){var p=S.pads[i],x=SX(p.x);if(x<-U*3||x>W+U*3)continue;drawPadAny(p,x,P)}
 for(i=0;i<S.ents.length;i++){var f=S.ents[i];if(f.got)continue;var fx=SX(f.x),fy=SY(f.y+Math.sin(V.t*2+f.ph)*.12);if(fx<-U||fx>W+U)continue;
  if(f.k==='fire')drawFirefly(g,fx,fy,U*.5,V.t,f.ph);
  else if(f.k==='petal'){glow(g,fx,fy,U*.9,'#ff9ab8',.5);icPetal(g,fx,fy,U*.32,true)}
  else if(f.k==='carrot'){glow(g,fx,fy,U*.8,'#ffb25a',.5);g.save();g.translate(fx,fy);g.rotate(.5);g.beginPath();g.moveTo(0,-U*.3);g.lineTo(U*.14,U*.3);g.lineTo(-U*.14,U*.3);g.closePath();g.fillStyle='#ff8a2a';g.fill();g.strokeStyle='#8a3a00';g.lineWidth=2;g.stroke();g.fillStyle='#5aa83a';g.beginPath();g.ellipse(0,-U*.36,U*.12,U*.1,0,0,TAU);g.fill();g.restore()}}
 drawPrize();
 for(i=0;i<S.en.length;i++)drawEnemy(S.en[i]);
 drawBoss();
 for(i=0;i<S.proj.length;i++)drawProj(S.proj[i]);
 drawTrail();drawGhost();
 if(F.mode!=='dead'||V.t%1<.8)drawKrapR();
 drawLarryAll(false);
 drawAim();drawSwing();drawParts();drawWindStreaks();drawDark();
 if(bg.fore){var fo=((V.cam*.9*U)%bg.TW+bg.TW)%bg.TW,w1=Math.min(W,bg.TW-fo),D=Math.min(bg.dpr,2.5);g.globalAlpha=.95;g.drawImage(bg.fore,fo*D,0,w1*D,bg.fore.height,0,H-bg.fore.height/D,w1,bg.fore.height/D);if(w1<W)g.drawImage(bg.fore,0,0,(W-w1)*D,bg.fore.height,w1,H-bg.fore.height/D,W-w1,bg.fore.height/D);g.globalAlpha=1}
 g.restore();
 g.drawImage(ensureVig(P),0,0,W,H);filmPass(P);
 if(V.flash>0){g.fillStyle='rgba(255,246,210,'+Math.min(.9,V.flash)+')';g.fillRect(0,0,W,H)}}

/* Порох скачет по кувшинкам: настоящий конный прыжок дугой от листа к листу. Копыта касаются листа — лист проседает, расходятся круги;
   в полёте ноги вытянуты вперёд и назад, грива и хвост летят. Физика не затронута: это только картинка поверх ровного бега героя. */
function hopSeg(){var P=S.pads,x=S.F.x,i;for(i=0;i<P.length-1;i++){if(x>=P[i].x&&x<P[i+1].x)return i}return -1}
function drawHopPorokh(x,o){var ps=U*1.1,t=V.t,P=S.pads,k=hopSeg(),u=0,hh=0,L=3,gy=PADY(),dipy=0;
 if(k>=0){var a=P[k],b=P[k+1];L=b.x-a.x;u=clamp((S.F.x-a.x)/L,0,1);hh=Math.sin(PI*Math.pow(u,.92))*Math.min(2.5,.55+L*.2)*U;
  var pd=u<.5?a:b;dipy=(pd.dip||0)*U*.35*(1-Math.min(1,hh/(U*.4)))}
 var ph=PI*u,bob=Math.abs(Math.sin(ph))*.08*ps,hy=gy+dipy-hh-U*.02;
 /* тень на листе: мельче и бледнее, когда конь высоко */
 var sh=1-Math.min(1,hh/(U*2.2));g.save();g.fillStyle='rgba(4,20,14,'+(.12+.2*sh)+')';g.beginPath();g.ellipse(x+U*.05,gy+U*.035+dipy,U*(.35+.55*sh),U*.08*(.6+.4*sh),0,0,TAU);g.fill();g.restore();
 /* золотой свет Фонаря за хвостом */
 g.save();g.globalCompositeOperation='lighter';for(var i=0;i<5;i++){var q=(t*2.6+i*.2)%1;g.globalAlpha=.5*(1-q);g.fillStyle='#ffd987';g.beginPath();g.arc(x-ps*(.8+q*1.8),hy-ps*(.9+Math.sin(q*6+i)*.25),Math.max(1.5,U*.07*(1-q)),0,TAU);g.fill()}g.restore();
 /* конь; в полёте голова чуть вперёд, на приземлении — вниз */
 var sq=hh<U*.2?1-hh/(U*.2):0;
 g.save();g.translate(x,hy+sq*ps*.05);g.scale(1,1-sq*.06);g.translate(-x,-(hy+sq*ps*.05));
 drawPorokh(g,x,hy,ps,{t:t,gait:1,ph:ph,saddle:1,mouth:3,head:.1+Math.sin(ph)*.1});
 o.sq=.3+sq*.4;o.mouth=3;o.lid=.15;o.tl=.7;o.cape=t*16;
 drawLarry(g,x-ps*.04,hy-1.3*ps-bob,U*.62*HS,o);g.restore()}
