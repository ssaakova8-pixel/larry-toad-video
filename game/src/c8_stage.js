/* ===== сцена: фон, герои, фонарь, диалоги ===== */
var STG={k:'',bg:null};
function stageBG(pi,wy){var k=pi+':'+W+':'+H+':'+wy;if(STG.k!==k){STG.k=k;STG.bg=makeBG(pi,W,H,wy,dpr)}return STG.bg}
function isPort(){return H>=W*1.05}
/* размеры героев на сцене */
function stageU(){return isPort()?Math.min(W*.14,H*.062):Math.min(H*.1,W*.08)}
/* ---- фонарь Рассвета: части по номерам 0..4 ---- */
function drawLantern(g,x,y,s,have,t,o){o=o||{};var all=have.length>=5&&have.every(function(v){return v}),lit=o.lit==null?(all?1:0):o.lit,newI=o.newI==null?-1:o.newI,na=o.newA==null?1:o.newA;
 g.save();g.translate(x,y);g.scale(s,s);
 if(lit>0)glow(g,0,-.2,2.4,'#ffe27a',.55*lit);
 function part(i,fn){var h=have[i];if(i===newI)h=na>0;g.save();if(!h){g.globalAlpha=.28;g.setLineDash([.08,.07])}else if(i===newI){g.globalAlpha=Math.min(1,na)}fn(h);g.restore()}
 /* масло */
 part(2,function(h){g.beginPath();g.moveTo(-.46,.42);g.lineTo(.46,.42);g.lineTo(.42,.7);g.lineTo(-.42,.7);g.closePath();g.fillStyle=h?LG(g,0,.4,0,.7,[0,'#ffe9a0',1,'#ffb43a']):'rgba(255,255,255,.1)';g.fill();g.lineWidth=.035;g.strokeStyle=h?'#a56000':'#aab';g.stroke()});
 /* стекло */
 part(1,function(h){g.beginPath();g.moveTo(-.5,.42);g.lineTo(-.54,-.9);g.quadraticCurveTo(0,-1.18,.54,-.9);g.lineTo(.5,.42);g.closePath();g.fillStyle=h?LG(g,-.5,-1,.5,.4,[0,'rgba(255,248,215,'+(.35+lit*.4)+')',1,'rgba(255,210,120,'+(.2+lit*.35)+')']):'rgba(255,255,255,.05)';g.fill();g.lineWidth=.035;g.strokeStyle=h?'rgba(255,255,255,.85)':'#aab';g.stroke();
  if(h){g.beginPath();g.moveTo(-.3,-.78);g.lineTo(-.33,.2);g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.045;g.lineCap='round';g.stroke()}});
 /* оправа */
 part(3,function(h){g.lineJoin='round';g.lineCap='round';g.lineWidth=.1;g.strokeStyle=h?'#e0b050':'#aab';g.beginPath();g.moveTo(-.62,.82);g.lineTo(.62,.82);g.moveTo(-.54,.82);g.lineTo(-.54,-.92);g.moveTo(.54,.82);g.lineTo(.54,-.92);g.moveTo(-.64,-.9);g.lineTo(0,-1.3);g.lineTo(.64,-.9);g.stroke();
  if(h){g.lineWidth=.03;g.strokeStyle='#fff2b0';g.beginPath();g.moveTo(-.54,.7);g.lineTo(-.54,-.8);g.stroke()}});
 /* фитиль */
 part(0,function(h){g.lineCap='round';g.lineWidth=.1;g.strokeStyle=h?'#e6d6a8':'#aab';g.beginPath();g.moveTo(0,.44);g.quadraticCurveTo(.06,.1,0,-.22);g.stroke();
  if(h&&lit>0){var f=1+Math.sin(t*9)*.08;g.beginPath();g.moveTo(0,-.2);g.bezierCurveTo(.3*f,-.45,.14,-.78,0,-.98*f);g.bezierCurveTo(-.14,-.78,-.3*f,-.45,0,-.2);g.fillStyle=LG(g,0,-1,0,-.2,[0,'#fff8c8',1,'#ff9a2a']);g.globalAlpha=lit;g.fill()}
  else if(h){g.beginPath();g.arc(0,-.25,.06,0,TAU);g.fillStyle='#ffe27a';g.fill()}});
 /* кольцо */
 part(4,function(h){g.lineWidth=.09;g.strokeStyle=h?'#ffd04a':'#aab';g.beginPath();g.arc(0,-1.5,.2,0,TAU);g.stroke();if(h){g.lineWidth=.025;g.strokeStyle='#fff6b0';g.beginPath();g.arc(0,-1.5,.2,.3,2.1);g.stroke()}});
 g.restore();
 if(lit>0){g.save();g.globalCompositeOperation='lighter';for(var i=0;i<8;i++){var a=i*TAU/8+t*.18,L1=s*(1.8+Math.sin(t*1.7+i)*.3);g.strokeStyle='rgba(255,236,150,'+.07*lit+')';g.lineWidth=s*.11;g.beginPath();g.moveTo(x+Math.cos(a)*s*.6,y-s*.3+Math.sin(a)*s*.6);g.lineTo(x+Math.cos(a)*L1,y-s*.3+Math.sin(a)*L1);g.stroke()}g.restore()}}
/* ---- иллюстрации для вступления и финала ---- */
function drawHillSil(g,pi,t,glowK){var P=PAL[pi];g.save();var y0=H*.62;g.beginPath();g.moveTo(0,H);g.lineTo(0,y0+H*.05);g.quadraticCurveTo(W*.5,y0-H*.1,W,y0+H*.04);g.lineTo(W,H);g.closePath();g.fillStyle=LG(g,0,y0-H*.1,0,H,[0,sh(P.near,-.1),1,sh(P.near,-.4)]);g.fill();g.restore()}
function drawIll(kind,t,k,lift){lift=lift||0;var pi=kind==='dawn'?4:0,wy=H*.62,bg=stageBG(pi,Math.round(wy));
 g.save();
 if(kind==='dawn'){var q=clamp(k*1.1,0,1);g.fillStyle=LG(g,0,0,0,wy,[0,mix('#1a2450','#5b88d8',q),.6,mix('#4a3a78','#ffb88a',q),1,mix('#a86a8a','#ffe6a0',q)]);g.fillRect(0,0,W,wy+4);
  var sy=wy-H*.04-q*H*.13;glow(g,W*.5,sy,H*.5,'#ffe9a0',.5+q*.4);g.beginPath();g.arc(W*.5,sy,H*.06,0,TAU);g.fillStyle='#fff6cf';g.fill();
  drawHillSil(g,4,t,q);for(var i=0;i<7;i++){var a=-PI+i*PI/6+.1;g.strokeStyle='rgba(255,236,160,'+(.1*q)+')';g.lineWidth=H*.03;g.beginPath();g.moveTo(W*.5,sy);g.lineTo(W*.5+Math.cos(a)*W,sy+Math.sin(a)*W);g.stroke()}
  /* маленькие лампы по камышам */for(i=0;i<14;i++){var fx=(i+.5)/14*W,fy=wy+H*.02+Math.sin(i*2.3)*H*.03+(i%3)*H*.045;if(q>(i%7)/9)drawFirefly(g,fx,fy,H*.012,t,i,1)}
  var lx=W*.5,ly=wy-H*.01;drawLantern(g,lx,ly-H*.09-lift,H*.075,[1,1,1,1,1],t,{lit:1}); g.restore();return}
 g.fillStyle=LG(g,0,0,0,wy,[0,'#0a1230',.6,'#1b2a5c',1,'#3a3a78']);g.fillRect(0,0,W,wy+4);
 var r=rng(5);for(var j=0;j<70;j++){g.fillStyle='rgba(255,255,255,'+(.25+r()*.5)+')';g.beginPath();g.arc(r()*W,r()*wy*.8,r()*1.4+.3,0,TAU);g.fill()}
 drawHillSil(g,0,t,0);
 var cx=W*.5,cy=H*.31,s=Math.min(W*.2,H*.12);
 if(kind==='lamp'){drawLantern(g,cx,cy,s,[1,1,1,1,1],t,{lit:1})}
 else if(kind==='broken'){var a0=clamp(k*1.2,0,1);for(var p=0;p<5;p++){var an=p*TAU/5+t*.35,rad=s*(.4+a0*1.5);drawLanternPartFree(g,cx+Math.cos(an)*rad*1.1,cy+Math.sin(an)*rad*.8+Math.sin(t*2+p)*4,s*.65,p,t)}
  glow(g,cx,cy,s*1.3,'#ffe27a',.18*(1-a0))}
 else if(kind==='dark'){var n=12;for(var q2=0;q2<n;q2++){var live=clamp(1-(k*1.3-q2/n*1.1),0,1);var fx2=cx+Math.cos(q2*2.4)*W*.36*(q2%2?.9:.5),fy2=cy-s*.4+Math.sin(q2*1.7)*H*.1+((q2%3)*s*.3);if(live>0.02)drawFirefly(g,fx2,fy2,s*.3,t,q2,live)}
  g.fillStyle='rgba(2,4,14,'+clamp(k*.45,0,.45)+')';g.fillRect(0,0,W,wy)}
 else if(kind==='lantern'){var have=[1,1,1,1,1];drawLantern(g,cx,cy,s*1.15,have,t,{lit:clamp(k*1.6,0,1)})}
 else if(kind==='tower'){drawTowerIll(t,wy)}
 else if(kind==='gather'){drawGatherIll(t,k,wy,ILLN)}
 g.restore()}
var ILLN=0;

/* ---- железная башня: все окна горят, у подножия факелы, в верхнем окне ходит маленький силуэт ---- */
function drawTowerIll(t,wy){var tx=W*.5,tw=Math.min(W*.2,H*.1),th=Math.min(H*.46,W*.95),by=wy-H*.012,ty=by-th,i,j;
 /* факелы у подножия */
 for(i=0;i<11;i++){var fx=tx+(i-5)*tw*.36,fy=by+H*.012+(i%2)*H*.014;g.strokeStyle='#2a2018';g.lineWidth=2;g.beginPath();g.moveTo(fx,fy);g.lineTo(fx,fy-H*.02);g.stroke();var fl=1+Math.sin(t*9+i*1.7)*.15;g.save();g.globalCompositeOperation='lighter';glow(g,fx,fy-H*.024,H*.032,'#ff9a3a',.42);g.restore();g.beginPath();g.ellipse(fx,fy-H*.026,H*.0046*fl,H*.0105*fl,0,0,TAU);g.fillStyle='#ffc060';g.fill()}
 /* корпус */
 g.beginPath();g.moveTo(tx-tw*.68,by+H*.01);g.lineTo(tx-tw*.5,ty+th*.1);g.lineTo(tx+tw*.5,ty+th*.1);g.lineTo(tx+tw*.68,by+H*.01);g.closePath();g.fillStyle=LG(g,tx-tw,0,tx+tw,0,[0,'#1b1a2e',.5,'#2e2a45',1,'#1b1a2e']);g.fill();g.lineWidth=1.5;g.strokeStyle='rgba(120,110,160,.35)';g.stroke();
 /* заклёпочные пояса */
 g.strokeStyle='rgba(120,110,160,.3)';g.lineWidth=1.5;for(i=1;i<5;i++){var yb=ty+th*(.1+i*.19);g.beginPath();g.moveTo(tx-tw*(.5+.18*(yb-ty)/th),yb);g.lineTo(tx+tw*(.5+.18*(yb-ty)/th),yb);g.stroke()}
 /* крыша и шестерня-флюгер */
 g.beginPath();g.moveTo(tx-tw*.62,ty+th*.12);g.lineTo(tx,ty-tw*.75);g.lineTo(tx+tw*.62,ty+th*.12);g.closePath();g.fillStyle='#14121f';g.fill();g.strokeStyle='rgba(120,110,160,.35)';g.stroke();
 drawGear(g,tx,ty-tw*.78,tw*.17,8,t*.8,'#a88a44');
 /* окна: два столбца по пять */
 for(j=0;j<5;j++)for(i=-1;i<=1;i+=2){var wxx=tx+i*tw*.2,wyy=ty+th*(.3+j*.14),ww=tw*.17,wh=tw*.28;g.save();g.globalCompositeOperation='lighter';glow(g,wxx,wyy,tw*.5,'#ffb050',.2+Math.sin(t*3+j+i)*.03);g.restore();rr(wxx-ww/2,wyy-wh/2,ww,wh,ww*.4);g.fillStyle=LG(g,0,wyy-wh/2,0,wyy+wh/2,[0,'#fff0b0',1,'#ffb040']);g.fill()}
 /* верхнее окно с силуэтом */
 var ww2=tw*.5,wh2=tw*.62,wx2=tx-ww2/2,wy2=ty+th*.1+wh2*.15;
 g.save();g.globalCompositeOperation='lighter';glow(g,tx,wy2+wh2*.5,tw*1.1,'#ffb050',.34);g.restore();
 rr(wx2,wy2,ww2,wh2,ww2*.35);g.fillStyle=LG(g,0,wy2,0,wy2+wh2,[0,'#ffe9a0',1,'#ffa838']);g.fill();
 g.save();rr(wx2,wy2,ww2,wh2,ww2*.35);g.clip();var px=tx+Math.sin(t*.7)*ww2*.2,pr=ww2*.11;g.fillStyle='#0a0814';
 g.beginPath();g.moveTo(px-pr*1.3,wy2+wh2);g.lineTo(px-pr*.9,wy2+wh2*.55);g.lineTo(px+pr*.9,wy2+wh2*.55);g.lineTo(px+pr*1.3,wy2+wh2);g.closePath();g.fill();
 g.beginPath();g.arc(px,wy2+wh2*.42,pr,0,TAU);g.fill();for(i=-1;i<=1;i++){g.beginPath();g.moveTo(px+i*pr*.55-pr*.2,wy2+wh2*.42-pr*.8);g.lineTo(px+i*pr*.55,wy2+wh2*.42-pr*1.5);g.lineTo(px+i*pr*.55+pr*.2,wy2+wh2*.42-pr*.8);g.closePath();g.fill()}
 g.restore();
 /* свеча в руке */
 var cx2=px+pr*1.4,cy2=wy2+wh2*.62,cf=1+Math.sin(t*10)*.14;g.fillStyle='#fff6dc';g.fillRect(cx2-1.5,cy2,3,pr*.9);g.beginPath();g.ellipse(cx2,cy2-pr*.18,pr*.2*cf,pr*.42*cf,0,0,TAU);g.fillStyle='#fffbe0';g.fill();
 g.strokeStyle='#5a4a30';g.lineWidth=Math.max(2,tw*.04);rr(wx2,wy2,ww2,wh2,ww2*.35);g.stroke()}

/* ---- перед рассветом на Холме: все собрались, огоньки по одному летят к Фонарю ---- */
var HY0=0;function hillY(fx){var y0=HY0||H*.62,s1=fx;return(1-s1)*(1-s1)*(y0+H*.05)+2*(1-s1)*s1*(y0-H*.1)+s1*s1*(y0+H*.04)}
function lightOrb(x,y,r,col,a,t,i){if(a<=0)return;g.save();g.globalAlpha=a;g.globalCompositeOperation='lighter';glow(g,x,y,r*3.4,col,.5);g.restore();var f=1+Math.sin(t*8+i*2)*.1;g.beginPath();g.arc(x,y,r*f,0,TAU);g.fillStyle='#fffbe8';g.fill();g.beginPath();g.arc(x,y,r*f*1.5,0,TAU);g.strokeStyle=col;g.lineWidth=Math.max(1.5,r*.35);g.globalAlpha=a*.7;g.stroke();g.globalAlpha=1}
function drawGatherIll(t,k,wy,n){var port=isPort(),u0=port?Math.min(W*.085,H*.046):Math.min(W*.075,H*.066),lcx=W*.5,lcy=H*(port?.27:.25),ls=Math.min(W*.17,H*(port?.1:.12)),i,mv=n>=6?easeOut(clamp(k*1.1,0,1)):0;HY0=port?H*.62:H*.5;
 if(!port){var P0=PAL[0];g.beginPath();g.moveTo(0,H);g.lineTo(0,HY0+H*.05);g.quadraticCurveTo(W*.5,HY0-H*.1,W,HY0+H*.04);g.lineTo(W,H);g.closePath();g.fillStyle=LG(g,0,HY0-H*.1,0,H,[0,sh(P0.near,-.1),1,sh(P0.near,-.4)]);g.fill()}
 var A=[{w:'vyp',x:.08,r:0,hh:3.1},{w:'bass',x:.22,r:0,hh:2.6},{w:'captain',x:.34,r:0,hh:2.7},{w:'por',x:.86,r:0,hh:2.9},{w:'larry',x:.44,r:1,hh:2.3},{w:'krap',x:.6,r:1,hh:3.3}];
 g.save();g.globalCompositeOperation='lighter';glow(g,lcx,lcy,ls*(1.8+n*.15),'#ffe27a',.04+n*.025);g.restore();
 drawLantern(g,lcx,lcy,ls,[1,1,1,1,1],t,{lit:0});
 var pts={};
 /* паучок висит под Фонарём на своей нити */
 var sp_y=lcy+ls*.85+u0*2.2;pts.spider=[lcx+u0*1.5,sp_y-u0*.4];drawActor('spider',lcx,sp_y+u0*1.05,u0,1,null,false,t,{top:lcy+ls*.85});
 A.forEach(function(a){var u=u0*(a.r?1.12:.95),x=W*a.x,face=x<W*.5?1:-1,fy=hillY(a.x)+H*(a.r?.062:.004);pts[a.w]=[x,fy-u*a.hh-u*.7,u];drawActor(a.w,x,fy,u,face,null,false,t,{klit:0})});
 var ux=u0*1.12,exx=lerp(.88,.64,mv),ex=W*exx,ey=hillY(exx)+H*.095;pts.sher=[ex,ey-ux*1.9-ux*.7,ux];drawActor('sher',ex,ey,ux,-1,null,false,t,{});
 g.fillStyle=LG(g,0,wy-H*.2,0,H,[0,'rgba(8,10,34,0)',1,'rgba(8,10,34,.4)']);g.fillRect(0,wy-H*.2,W,H);
 var order=['krap','bass','spider','captain','vyp','sher'],cols=['#ffd86a','#8fe4ff','#d8c8ff','#ff9a3a','#ffe27a','#fff0c0'];
 for(i=0;i<n&&i<6;i++){var p=pts[order[i]],a2=(i===n-1)?clamp(k*2.5,0,1):1,ur=p[2]||u0;
  g.save();g.globalCompositeOperation='lighter';g.strokeStyle=cols[i];g.globalAlpha=.32*a2;g.lineWidth=Math.max(1.5,u0*.06);g.beginPath();g.moveTo(p[0],p[1]);g.quadraticCurveTo((p[0]+lcx)/2,Math.min(p[1],lcy)-H*.05,lcx,lcy+ls*.1);g.stroke();g.restore();
  if(order[i]==='bass'){for(var q=0;q<4;q++)lightOrb(p[0]+(q-1.5)*u0*.55,p[1]-Math.abs(q-1.5)*u0*.22,u0*.14,cols[i],a2,t,q+i)}else lightOrb(p[0],p[1],u0*(order[i]==='captain'?.26:.22),cols[i],a2,t,i)}}
function drawLanternPartFree(g,x,y,s,ch,t){glow(g,x,y,s*.9,'#ffe27a',.22);drawLanternPart(g,x,y,s,ch,t)}
/* ---- сценические площадки ---- */
function drawTent(g,x,y,s,col){g.save();g.translate(x,y);g.scale(s,s);g.beginPath();g.moveTo(-1.1,0);g.lineTo(0,-1.3);g.lineTo(1.1,0);g.closePath();g.fillStyle=LG(g,0,-1.3,0,0,[0,sh(col||'#c8553d',.12),1,sh(col||'#c8553d',-.22)]);g.fill();g.lineWidth=.04;g.strokeStyle='#4a1d12';g.stroke();
 g.beginPath();g.moveTo(-.28,0);g.lineTo(0,-.78);g.lineTo(.28,0);g.closePath();g.fillStyle='#2a1410';g.fill();g.beginPath();g.moveTo(0,-1.3);g.lineTo(0,-1.62);g.lineTo(.3,-1.5);g.lineTo(0,-1.42);g.fillStyle='#ffd04a';g.fill();g.restore()}
function drawFire(g,x,y,s,t,k){k=k==null?1:k;glow(g,x,y-s*.3,s*3.2,'#ff9a3a',.5*k);g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#4a3420';g.beginPath();g.ellipse(-.3,0,.4,.1,.3,0,TAU);g.ellipse(.3,0,.4,.1,-.3,0,TAU);g.fill();
 for(var i=0;i<3;i++){var f=1+Math.sin(t*9+i*2)*.12,w=.3-i*.07;g.beginPath();g.moveTo(-w,0);g.bezierCurveTo(-w*1.2,-.4*f,-w*.3,-.6*f,0,-(.95-i*.2)*f);g.bezierCurveTo(w*.3,-.6*f,w*1.2,-.4*f,w,0);g.closePath();g.fillStyle=['#ff7a2a','#ffb030','#fff0a0'][i];g.globalAlpha=k;g.fill()}g.restore()}
function drawVillage(g,y,lit,t){/* домики-грибы вдоль горизонта; lit — сколько окон горит */
 var n=Math.max(7,Math.round(W/62)),r=rng(11);for(var i=0;i<n;i++){var x=(i+.5)/n*W,hw=22+r()*14,hh=26+r()*18,on=((i*5)%14)<lit&&lit>0;
  g.save();g.translate(x,y);g.fillStyle='rgba(8,12,30,.92)';rr(-hw*.5,-hh*.55,hw,hh*.55,3);g.fill();g.beginPath();g.ellipse(0,-hh*.55,hw*.85,hh*.45,0,PI,TAU);g.fill();
  g.beginPath();g.rect(-hw*.18,-hh*.4,hw*.36,hh*.34);g.fillStyle=on?'#ffd870':'rgba(60,70,100,.55)';g.fill();if(on){glow(g,0,-hh*.22,hw*1.1,'#ffd870',.45+Math.sin(t*3+i)*.08)}g.restore()}}
/* ---- герои на сцене ---- */
var CAST_S={larry:1,krap:.78,por:1.15,vyp:.82,bass:.62,spider:.7,captain:.5,sher:.55,wasp:.5};
var EMO_L={worry:4,smile:1,laugh:3,shock:2,smirk:1,calm:1,angry:1,snort:1};
function drawActor(w,x,fy,u,face,e,talk,t,extra){extra=extra||{};var tk=talk?(((t*10)|0)%2?1:0):0,bob=talk?Math.abs(Math.sin(t*8))*u*.045:0,s=u*(CAST_S[w]||1)*(extra.k||1);
 switch(w){
 case'larry':{var m=EMO_L[e];if(m==null)m=1;if(tk)m=m===4?4:3;drawLarry(g,x,fy-bob,s*1.15,{t:t,face:face,mouth:m,fear:e==='worry'?.7:e==='shock'?1:0,lamp:extra.lamp==null?1:extra.lamp,sq:talk?.04:0});break}
 case'krap':{var km=e==='angry'||e==='worry'?0:1;if(tk)km=3;var ky=fy-u*(2.7+Math.sin(t*2.4)*.1)-bob;drawKrap(g,x,ky,s*1.15,{t:t,face:face,mouth:km,brow:e==='angry'?-.8:e==='worry'?.7:e==='smirk'?-.3:0,fly:1,goggles:1});drawMiniLamp(g,x-face*s*.78,ky+s*.5+Math.sin(t*2.1)*s*.03,s*.62,t,extra.klit==null?1:extra.klit);break}
 case'por':drawPorokh(g,x,fy,s*1.15,{t:t,face:face,gait:0,saddle:1,mouth:tk?1:0,head:e==='snort'&&talk?.12:0});break;
 case'vyp':drawVyp(g,x,fy-bob*.5,s*1.2,{t:t,face:face,bill:tk?1:0,boom:e==='boom'&&talk?1:0,glasses:1,lantern:1,lamp:extra.lamp==null?0:extra.lamp});break;
 case'spider':{drawSpider(g,x,fy-u*(1.05+Math.sin(t*1.6)*.05),s*1.3,{t:t,mood:e==='angry'?0:1,top:extra.top==null?0:extra.top});break}
 default:{var k=w==='sher'?'emperor':w==='wasp'?'soldier':w;drawBug(g,x,fy-u*(.75+Math.sin(t*3)*.06),s*1.3,{k:k,face:-1,t:t,mood:e==='dizzy'?3:e==='scared'?2:e==='angry'?0:1,wf:t*40});break}}}
var SLOT={larry:.2,krap:.4,por:.78,vyp:.8,bass:.76,spider:.76,captain:.76,sher:.76,wasp:.8};
function castX(w,cast,pos){if(pos&&pos[w]!=null)return W*pos[w];var k=cast.indexOf(w),n=cast.length;if(w==='larry')return W*(n===1?.5:.24);if(w==='krap')return W*(cast.indexOf('larry')>=0?.5:.3);return W*(n===1?.5:SLOT[w]||.76)}
/* ---- площадка: вода / лагерь / холм ---- */
function drawStage(sc,t,speaker,talk,e){var cur=sc.cur||{},pi=sc.bg,P=PAL[pi],u=stageU(),fy=Math.round(H*(isPort()?.60:.56)),wy=Math.round(fy-u*.42),bg=stageBG(pi,wy),cast=cur.cast||sc.cast||[],pos=sc.pos,room=sc.st==='room',dk=room&&cur.dark?cur.dark:0,klit=room&&cur.lamp===0?0:1;
 if(room){drawRoom(cur,t,u,fy,dk>0?0:1,(pos&&pos.sher)||.8)}
 else{drawBG(g,bg,t*.12,t,U);
 if(sc.st==='water'||sc.st==='sky'){drawWater(g,bg,P,W,H,wy,t*.12,U,t);waterFade(g,P,W,H,wy);
  cast.forEach(function(w){var x=castX(w,cast,pos);if(w==='por'){drawShore(g,x,fy,u,P,sc.st);return}if(w==='krap'||w==='spider'||w==='wasp'||w==='bass'||w==='captain'||w==='sher')return;drawLily(g,x,fy+u*.12,u*1.45/U,U,{pal:P,t:t,lit:0})})}
 else if(sc.st==='camp'){drawVillage(g,wy+4,sv.part.filter(Boolean).length*2,t);var gy=fy-u*.04;g.fillStyle=LG(g,0,gy,0,H,[0,'#2d4a2a',1,'#10200f']);g.beginPath();g.moveTo(0,gy+u*.1);g.quadraticCurveTo(W*.5,gy-u*.35,W,gy+u*.1);g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fill();
  drawTent(g,W*.8,gy-u*.1,u*1.15);drawFire(g,W*.5,gy+u*.34,u*.55,t,1)}
 else{/* hill */var gy2=fy-u*.04;g.fillStyle=LG(g,0,gy2-u,0,H,[0,'#5a7a3a',1,'#243a1a']);g.beginPath();g.moveTo(0,gy2+u*.4);g.quadraticCurveTo(W*.5,gy2-u*.5,W,gy2+u*.3);g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fill()}}
 /* герои */
 var order=['por','vyp','bass','spider','captain','wasp','sher','larry','krap'],kl=null;
 order.forEach(function(w){if(cast.indexOf(w)<0)return;var x=castX(w,cast,pos),face=x<W*.5?1:-1,isS=w===speaker;
  var yy=fy+(sc.st==='water'?u*.0:u*.12);
  if(w==='krap')kl={x:x-face*u*.78*1.15*.78,y:yy-u*2.7+u*.78*1.15*.5};
  drawActor(w,x,yy,u,face,isS?e:null,isS&&talk,t,{lamp:(sc.cur&&sc.cur.spark)?1:undefined,klit:klit,k:(sc.sz&&sc.sz[w])||1})});
 /* тьма в комнате: светится только вокруг лампы Крапинки */
 if(dk>0){var lx=kl?kl.x:W*.45,ly=kl?kl.y:fy-u*2.5,r=klit?u*5.2:u*.7;
  g.save();var q=g.createRadialGradient(lx,ly,r*.1,lx,ly,r);q.addColorStop(0,'rgba(2,3,12,0)');q.addColorStop(.5,'rgba(2,3,12,'+(dk*.4)+')');q.addColorStop(1,'rgba(2,3,12,'+(dk*.9)+')');g.fillStyle=q;g.fillRect(0,0,W,H);
  if(klit){g.globalCompositeOperation='lighter';glow(g,lx,ly,u*3.4,'#ffd070',.28+Math.sin(t*7)*.03)}g.restore()}
 return{fy:fy,wy:wy,u:u}}
/* ---- маленький фонарик Крапинки ---- */
/* берег под Порохом: конь стоит на траве, а не на кувшинке */
function drawShore(g,x,fy,u,P,st){var w=u*3.1,y=fy+u*.1;g.save();g.beginPath();g.moveTo(x-w,H);g.lineTo(x-w,y+u*.35);g.quadraticCurveTo(x-w*.55,y-u*.05,x,y-u*.02);g.quadraticCurveTo(x+w*.6,y-u*.06,x+w*1.3,y+u*.3);g.lineTo(x+w*1.3,H);g.closePath();
 g.fillStyle=LG(g,0,y-u*.1,0,y+u*1.4,[0,st==='sky'?'#6a7a58':'#4d7a35',1,'#1c2e16']);g.fill();g.lineWidth=2;g.strokeStyle='rgba(190,235,130,.4)';g.beginPath();g.moveTo(x-w*.98,y+u*.33);g.quadraticCurveTo(x-w*.55,y-u*.05,x,y-u*.02);g.quadraticCurveTo(x+w*.6,y-u*.06,x+w*1.3,y+u*.3);g.stroke();
 g.strokeStyle='rgba(120,190,90,.55)';g.lineWidth=1.5;for(var i=0;i<9;i++){var gx=x-w*.7+i*w*.2,gy=y+u*.02+Math.sin(i*2.1)*u*.05;g.beginPath();g.moveTo(gx,gy);g.lineTo(gx-u*.04,gy-u*.2);g.moveTo(gx+u*.05,gy);g.lineTo(gx+u*.1,gy-u*.16);g.stroke()}g.restore()}
function drawMiniLamp(g,x,y,s,t,lit){g.save();g.translate(x,y);
 if(lit>0)glow(g,0,s*.05,s*(1.5+lit*.9),'#ffe27a',.3+.25*lit);
 g.strokeStyle='#5a4020';g.lineWidth=Math.max(1,s*.07);g.lineCap='round';g.beginPath();g.moveTo(0,-s*.7);g.lineTo(0,-s*.46);g.stroke();
 rr(-s*.2,-s*.46,s*.4,s*.56,s*.1);g.fillStyle=lit>0?LG(g,0,-s*.46,0,s*.1,[0,'#fff6c0',1,'#ffc040']):'#6a5a40';g.fill();g.lineWidth=Math.max(1,s*.06);g.strokeStyle='#8a5a10';g.stroke();
 if(lit>0){var f=1+Math.sin(t*9)*.1;g.beginPath();g.ellipse(0,-s*.18,s*.07*f,s*.14*f,0,0,TAU);g.fillStyle='#fffbe0';g.fill()}
 rr(-s*.24,s*.08,s*.48,s*.1,s*.04);g.fillStyle='#8a5a10';g.fill();g.restore()}
/* ---- комната в башне ---- */
var RM={rot:0};
function drawGear(g,x,y,r,n,rot,col){g.save();g.translate(x,y);g.rotate(rot);g.beginPath();for(var i=0;i<n*2;i++){var a=i/(n*2)*TAU,q=(i%2)?r*.8:r;g.lineTo(Math.cos(a)*q,Math.sin(a)*q)}g.closePath();g.fillStyle=col;g.fill();g.lineWidth=Math.max(1,r*.06);g.strokeStyle='rgba(0,0,0,.45)';g.stroke();g.beginPath();g.arc(0,0,r*.3,0,TAU);g.fillStyle='rgba(20,10,0,.55)';g.fill();g.beginPath();g.arc(0,0,r*.12,0,TAU);g.fillStyle=col;g.fill();g.restore()}
function drawRoom(cur,t,u,fy,lit,scx){var wf=fy+u*.02,i,x,y;
 g.fillStyle=LG(g,0,0,0,wf,[0,'#2d2342',1,'#191326']);g.fillRect(0,0,W,wf);
 g.strokeStyle='rgba(255,255,255,.045)';g.lineWidth=1;for(y=wf-u*1.25,i=0;y>0;y-=u*1.25,i++){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();var off=(i%2)?u*1.1:0;for(x=-off;x<W;x+=u*2.2){g.beginPath();g.moveTo(x,y);g.lineTo(x,y-u*1.25);g.stroke()}}
 g.fillStyle=LG(g,0,wf,0,H,[0,'#3c2b27',1,'#130d0e']);g.fillRect(0,wf,W,H-wf);
 g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=2;for(i=-6;i<=14;i++){g.beginPath();g.moveTo(W*.5+(i-4)*u*.55,wf);g.lineTo(W*.5+(i-4)*u*2.1,H);g.stroke()}
 /* окно */
 var wb=wf-u*2.3,wh=Math.min(u*3.6,wb-H*.08),ww=wh/1.45,wx=W*.2-ww/2,wt=wb-wh;
 g.save();g.beginPath();g.moveTo(wx,wb);g.lineTo(wx,wt+ww/2);g.arc(wx+ww/2,wt+ww/2,ww/2,PI,0);g.lineTo(wx+ww,wb);g.closePath();
 g.fillStyle=LG(g,0,wt,0,wb,[0,'#090d2a',1,'#27306e']);g.fill();g.clip();
 for(i=0;i<14;i++){g.fillStyle='rgba(255,255,255,'+(.3+hash2(i,2,1)*.6)+')';g.beginPath();g.arc(wx+hash2(i,1,3)*ww,wt+hash2(i,2,4)*wh,.6+hash2(i,3,5)*1.1,0,TAU);g.fill()}
 g.fillStyle='#fff3c8';g.beginPath();g.arc(wx+ww*.68,wt+ww*.62,ww*.1,0,TAU);g.fill();g.fillStyle='#27306e';g.beginPath();g.arc(wx+ww*.73,wt+ww*.58,ww*.09,0,TAU);g.fill();g.restore();
 g.strokeStyle='#6b4a2e';g.lineWidth=Math.max(3,u*.1);g.beginPath();g.moveTo(wx,wb);g.lineTo(wx,wt+ww/2);g.arc(wx+ww/2,wt+ww/2,ww/2,PI,0);g.lineTo(wx+ww,wb);g.closePath();g.stroke();
 g.lineWidth=Math.max(2,u*.06);g.beginPath();g.moveTo(wx+ww/2,wt);g.lineTo(wx+ww/2,wb);g.moveTo(wx,wt+wh*.55);g.lineTo(wx+ww,wt+wh*.55);g.stroke();
 /* шестерёнки на стене */
 var gx=W*.7,gy=wf-u*5.6;if(gy<H*.2)gy=H*.2;var sp=RM.rot;
 drawGear(g,gx,gy,u*.95,12,sp,'#7c5c30');drawGear(g,gx-u*1.55,gy+u*.6,u*.66,9,-sp*1.45,'#9a7a3c');drawGear(g,gx+u*.25,gy+u*1.6,u*.5,8,sp*1.8,'#6a4a28');
 /* подсвечник со свечой над Императором */
 var sx=W*scx,sy=wf-u*3.1;
 g.strokeStyle='#4a3a2a';g.lineWidth=Math.max(2,u*.08);g.lineCap='round';g.beginPath();g.moveTo(sx-u*.4,sy+u*.32);g.lineTo(sx,sy+u*.22);g.lineTo(sx+u*.4,sy+u*.32);g.stroke();
 rr(sx-u*.1,sy-u*.3,u*.2,u*.52,u*.03);g.fillStyle='#f3e6c4';g.fill();
 if(lit>0){var f2=1+Math.sin(t*11)*.12;g.save();g.globalCompositeOperation='lighter';glow(g,sx,sy-u*.5,u*(4.4+Math.sin(t*3)*.2),'#ffb050',.5*lit);g.restore();g.beginPath();g.ellipse(sx,sy-u*.52,u*.08*f2,u*.2*f2,0,0,TAU);g.fillStyle='#ff9a3a';g.fill();g.beginPath();g.ellipse(sx,sy-u*.48,u*.045,u*.11,0,0,TAU);g.fillStyle='#fff3b0';g.fill()}
 else{g.strokeStyle='rgba(210,210,230,.28)';g.lineWidth=Math.max(1.5,u*.05);g.beginPath();for(i=0;i<=10;i++){var yy2=sy-u*.34-i*u*.12;g.lineTo(sx+Math.sin(t*2+i*.7)*u*.1*(i/10+.2),yy2)}g.stroke()}}
/* ---- SC.story: диалог ---- */
var SS=null;
function storyLines(id){var sc=SCENES[id];return sc?sc.l:[]}
SC.story={
 enter:function(arg){var sc=SCENES[arg.id];SS={arg:arg,id:arg.id,sc:sc,i:0,ty:0,done:false,lastB:0,t:0,fl:0,lt0:0,tk:0};if(arg.id==='prolog'){sv.intro=1;save()}if(typeof sv.set.nar==='undefined')sv.set.nar=1;
  SS.sc.cur=SS.sc.l[0];lineStart();music(sc.mu||['m_ch1','m_ch2','m_ch3','m_ch4','m_ch5'][clamp(sc.bg,0,4)]);ambient(sc.st==='room'?null:'water');SS.fx=.3},
 leave:function(){voiceStop()},
 update:function(dt){SS.t+=dt;var ln=SS.sc.l[SS.i],n=ln.t.length;if(!SS.done){var prev=SS.ty;SS.ty+=dt*SS.cps;if(SS.ty>=n){SS.ty=n;SS.done=true}}
  if(SS.fl>0)SS.fl-=dt;
  RM.rot+=dt*(ln.tick?.1/ln.tick:.3);
  if(ln.tick){SS.tk-=dt;if(SS.tk<=0){SS.tk=ln.tick;if(typeof AC!=='undefined'&&AC&&audioOK&&sv.set.fx>0)tone(2300,.02,'square',.014)}}},
 draw:function(g){var ln=SS.sc.l[SS.i];SS.sc.cur=ln;var talking=!SS.done&&ln.w!=='nar';
  g.fillStyle='#050a18';g.fillRect(0,0,W,H);
  var ill=ln.ill,lay;ILLN=ln.n||0;
  if(ln.card){storyCard(ln)}
  else{
   if(ill||(!SS.sc.cast&&SS.sc.st==='sky')){drawIll(ill||'dark',SS.t,clamp((SS.t-SS.lt0)/3,0,1)||0);lay={fy:H*.6}}
   else lay=drawStage(SS.sc,SS.t,ln.w==='nar'?null:ln.w,talking,ln.e);
   /* затемнение сверху под кнопку */
   var gr=g.createLinearGradient(0,0,0,H*.16);gr.addColorStop(0,'rgba(0,0,0,.45)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,W,H*.16);
   storyBox(ln)}
  /* кнопки */
  var bh=Math.max(40,fz(16)*2.2);btn('skip',W-SAFE.r-12-fz(120),SAFE.t+10,fz(120),bh,'Пропустить',function(){storyEnd(true)},{st:'ghost',px:fz(15),r:bh*.45});
  /* прогресс */
  var tot=SS.sc.l.length,dx=Math.min(14,(W-SAFE.l-SAFE.r-fz(120)-60)/Math.max(1,tot)),x0=SAFE.l+16;for(var i=0;i<tot;i++){g.beginPath();g.arc(x0+i*dx,SAFE.t+10+bh/2,i===SS.i?4.5:3,0,TAU);g.fillStyle=i<=SS.i?'#ffe27a':'rgba(255,255,255,.3)';g.fill()}},
 down:function(p){},
 up:function(p,c){if(c)return;storyTap()},
 key:function(e,dn){if(dn&&(e.code==='Space'||e.code==='Enter'||e.code==='ArrowRight')){storyTap();return true}if(dn&&e.code==='Escape'){storyEnd(true);return true}return false}};
SS=null;
function lineStart(){var ln=SS.sc.l[SS.i];SS.ty=0;SS.done=false;SS.lt0=SS.t;SS.tk=0;
 if(ln.mu)music(ln.mu);
 if(ln.song)playSong(ln.song);if(ln.sfx)sfx(ln.sfx);if(ln.card)sfx('page');
 /* голос: рассказчик читает карточки и описания, герои говорят сами; текст печатается в такт голосу */
 var vt=ln.card?ln.t.replace(/[«»]/g,''):ln.t;SS.vd=voicePlay(ln.w,vt,function(){SS.vend=true});SS.vend=false;
 SS.cps=SS.vd>0?Math.max(12,ln.t.length/(SS.vd*.86)):(ln.card?16:44);
 var nx=SS.sc.l[SS.i+1];if(nx&&nx.w!=='por')voicePre(nx.w,nx.card?nx.t.replace(/[«»]/g,''):nx.t)}
function playSong(seq){if(typeof AC==='undefined'||!AC||!audioOK||typeof bell!=='function')return;for(var i=0;i<seq.length;i++)bell(MELF[seq[i]],.2,{at:.15+i*.5})}
/* титульная карточка главы */
function storyCard(ln){var t=SS.t,c=ln.ch,C=CAMP[c],a=clamp((t-SS.lt0)*1.8,0,1);
 drawStage({bg:C.bg,st:'water',cast:[]},t,null,false,null);
 var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(4,8,22,.78)');gr.addColorStop(.5,'rgba(4,8,22,.62)');gr.addColorStop(1,'rgba(4,8,22,.82)');g.fillStyle=gr;g.fillRect(0,0,W,H);
 var cw=Math.min(W-40,fz(420)),nm=Math.min(fz(40),W*.1),mp=fz(21),ml=wrapLines(ln.t.substr(0,SS.ty|0)||' ',cw,mp,{it:true,w:500}),full=wrapLines(ln.t,cw,mp,{it:true,w:500});
 var ls=Math.min(W*.13,H*.075,fz(46)),block=fz(18)+fz(10)+nm*1.1+fz(14)+ls*2.7+fz(28)+full.length*mp*1.35,y=Math.max(SAFE.t+fz(60),(H-block)/2);
 g.globalAlpha=a;
 txt('ГЛАВА '+ROM[c],W/2,y+fz(16),fz(16),'#ffd98a',{al:'center',fam:FU,w:700});y+=fz(18)+fz(10);
 txt(C.n,W/2,y+nm*.85,nm,'#fff6c0',{al:'center',fam:FT,w:700,sh:'rgba(60,30,0,.9)',shw:8});y+=nm*1.1+fz(14);
 /* фонарь: что ищем в этой главе */
 glow(g,W/2,y+ls*1.3,ls*2.6,'#ffe27a',.2);drawLanternPart(g,W/2,y+ls*1.35,Math.min(W*.2,H*.12)*.75,c,t);y+=ls*2.7;
 txt('Ищем: '+PART[c],W/2,y+fz(2),fz(15),'#ffe9b0',{al:'center',fam:FU,w:600});y+=fz(28);
 for(var i=0;i<ml.length;i++)txt(ml[i],W/2,y+mp+i*mp*1.35,mp,'#f3e4c0',{al:'center',fam:FT,w:500,it:true});
 g.globalAlpha=1;
 if(SS.done){var aa=.5+.5*Math.sin(SS.t*5);g.globalAlpha=aa;txt('нажми, чтобы идти дальше',W/2,H-SAFE.b-fz(34),fz(14),'rgba(255,255,255,.7)',{al:'center',fam:FU,w:500});g.globalAlpha=1}}
function storyTap(){var ln=SS.sc.l[SS.i];if(!SS.done){SS.ty=ln.t.length;SS.done=true;return}
 voiceStop();if(SS.i<SS.sc.l.length-1){SS.i++;sfx('page');lineStart()}else{storyEnd()}}
function storyEnd(skip){voiceStop();var a=SS.arg,n=SS.sc.next;
 if(skip){while(n&&n.charAt(0)!=='@'&&SCENES[n])n=SCENES[n].next}
 if(a.chain!=null){if(!n||n==='@next'||n.charAt(0)==='@'||!SCENES[n]){chainNext(a.chain);return}go('story',{id:n,ch:a.ch,chain:a.chain});return}
 if(!n||n.charAt(0)==='@'||!SCENES[n]){go(a.back||'title');return}
 go('story',{id:n,ch:a.ch,back:a.back})}
function storyBox(ln){var nar=ln.w==='nar',who=WHO[ln.w]||WHO.nar,bw=Math.min(W-20,640),bx=(W-bw)/2,pad=Math.max(14,fz(8)),px=fz(19),maxH=H*(isPort()?.36:.5),lh,ls,bh,tagH=nar?0:fz(16)*1.8;
 for(;;){ls=wrapLines(ln.t,bw-pad*2-(nar?10:0),px,{it:nar});lh=px*1.34;bh=pad*2+tagH+ls.length*lh+px*1.0;if(bh<=maxH||px<=15)break;px-=1}
 var by=H-SAFE.b-14-bh;
 g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=18;g.shadowOffsetY=5;rr(bx,by,bw,bh,20);g.fillStyle=nar?'rgba(34,26,18,.94)':LG(g,0,by,0,by+bh,[0,'rgba(34,48,84,.96)',1,'rgba(16,26,50,.97)']);g.fill();g.restore();
 g.lineWidth=2.5;g.strokeStyle=nar?'rgba(236,200,120,.6)':who.c;rr(bx,by,bw,bh,20);g.stroke();
 if(!nar){var tpx=fz(16);setFont(tpx,800,FU);var tw=g.measureText(who.n).width+tpx*1.6;rr(bx+16,by-tpx*.95,tw,tpx*1.9,tpx*.95);g.fillStyle=who.c;g.fill();g.lineWidth=2;g.strokeStyle='rgba(0,0,0,.4)';g.stroke();txt(who.n,bx+16+tw/2,by+tpx*.35,tpx,'#10182a',{al:'center',fam:FU,w:800})}
 var shown=ln.t.substr(0,SS.ty|0),tx=bx+pad+(nar?5:0),ty=by+pad+tagH+px*.95,cnt=0;
 for(var i=0;i<ls.length;i++){var seg=ls[i],take=Math.max(0,Math.min(seg.length,(SS.ty|0)-cnt));if(take>0)txt(seg.substr(0,take),tx,ty+i*lh,px,nar?'#f3e4c0':'#fff',{it:nar,w:500});cnt+=seg.length+1}
 if(SS.done){var a=.5+.5*Math.sin(SS.t*5);g.globalAlpha=a;g.beginPath();var ax=bx+bw-pad-8,ay=by+bh-pad-4;g.moveTo(ax-8,ay-7);g.lineTo(ax+8,ay-7);g.lineTo(ax,ay+3);g.closePath();g.fillStyle=nar?'#f3d27a':who.c;g.fill();g.globalAlpha=1}}
