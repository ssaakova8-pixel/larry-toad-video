/* ===== осиное войско: Шестерон, стражи, Басс, Жало, комары ===== */
var BK={
 soldier:{b1:'#ffd23a',b2:'#e0a010',st:'#2a2030',eye:'#ff5a2a',fz:0,wing:1,helm:1,spear:1,sc:1},
 emperor:{b1:'#ffdc4a',b2:'#c98a10',st:'#3a1d4a',eye:'#ff3a5a',fz:0,wing:1,crown:1,cape:1,stache:1,mono:1,armor:1,sc:1.5},
 captain:{b1:'#d7e8ff',b2:'#6f93c9',st:'#1d2c4a',eye:'#7ad0ff',fz:0,wing:1,helm:2,lance:1,armor:2,sc:1.35},
 bass:{b1:'#ffc933',b2:'#e08a10',st:'#3a2a1a',eye:'#222',fz:1,wing:2,gogg:1,sc:1.4,fat:1},
 gnat:{b1:'#b9b4a6',b2:'#7d776a',st:'#4a443a',eye:'#d83a3a',fz:0,wing:3,sc:.6,thin:1,prob:1}
};
/* o: t, face(-1 по умолчанию: враги смотрят влево), bl, mood(0 злой,1 надменный,2 испуг,3 ранен), stun, atk(0..1 замах), wf (фаза крыльев) */
function drawBug(g,x,y,s,o){o=o||{};var K=BK[o.k||'soldier'],t=o.t||0,f=o.face==null?-1:o.face,lw=.04,ol=sh(K.st,-.2),mood=o.mood||0,
 wf=o.wf==null?t*(K.wing===3?60:K.wing===2?52:34):o.wf,bob=Math.sin(t*(K.wing===3?9:4.5)+(o.ph||0))*.05;
 g.save();g.translate(x,y+bob*s);g.scale(s*K.sc*f,s*K.sc);if(o.tilt)g.rotate(o.tilt);
 var fat=K.fat?1.18:1,thin=K.thin?.55:1,k,i;
 /* плащ */
 if(K.cape){var cw=Math.sin(t*5)*.08;g.beginPath();sp(g,[[.1,-.2],[-.4,-.3+cw],[-.9,-.1+cw],[-1.1,.3],[-.85,.62-cw],[-.4,.5],[-.1,.28]],true,1);
  g.fillStyle=LG(g,0,-.5,-1.2,.6,[0,'#8c3fd0',1,'#3a1a6a']);g.fill();g.strokeStyle='#220f44';g.lineWidth=lw;g.lineJoin='round';g.stroke();
  g.strokeStyle='#ffd04a';g.lineWidth=.04;g.beginPath();g.moveTo(-.2,.5);g.quadraticCurveTo(-.7,.62-cw,-1.3,.2);g.stroke()}
 /* дальние ноги */
 g.strokeStyle=K.st;g.lineWidth=.04*thin*1.5+.02;g.lineCap='round';
 var lk=Math.sin(t*6)*.04;
 g.beginPath();g.moveTo(-.02,.2);g.quadraticCurveTo(-.2,.5,-.3+lk,.66);g.stroke();g.beginPath();g.moveTo(.18,.22);g.quadraticCurveTo(.12,.5,.02+lk,.7);g.stroke();
 /* крылья */
 var wa=Math.sin(wf)*.45;
 function wing(rot,len,al){g.save();g.translate(-.02,-.3);g.rotate(rot+wa*.9);g.beginPath();sp(g,[[0,0],[-.2,-.34*len],[-.65*len,-.55*len],[-.95*len,-.36*len],[-.8*len,-.1],[-.3,.02]],true,1);
  g.fillStyle=LG(g,0,0,-.9,-.5,[0,'rgba(235,245,255,'+al+')',1,'rgba(190,220,255,'+al*.55+')']);g.fill();g.strokeStyle='rgba(120,150,200,'+al+')';g.lineWidth=.025;g.stroke();
  g.beginPath();g.moveTo(-.05,-.02);g.quadraticCurveTo(-.4,-.3*len,-.85*len,-.34*len);g.strokeStyle='rgba(120,150,200,.45)';g.lineWidth=.014;g.stroke();g.restore()}
 if(K.wing===1){wing(-.35,1,.5);wing(.05,.8,.45)}else if(K.wing===2){wing(-.2,.62,.6)}else{wing(-.3,1.15,.4);wing(.1,1,.4)}
 /* брюшко */
 var ab=[[-.12,-.3*fat],[-.5,-.42*fat],[-.92,-.34*fat],[-1.2,-.08],[-1.0,.2*fat],[-.6,.36*fat],[-.16,.28*fat]];
 if(K.thin)ab=[[-.12,-.14],[-.5,-.2],[-.95,-.1],[-1.25,.0],[-.95,.12],[-.5,.18],[-.12,.12]];
 /* жало */
 if(!K.thin){g.beginPath();g.moveTo(-1.12,-.1);g.lineTo(-1.62-(o.atk||0)*.25,.12);g.lineTo(-1.1,.14);g.closePath();g.fillStyle='#3a2a2a';g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke()}
 g.beginPath();sp(g,ab,true,1);g.fillStyle=RG(g,-.5,-.2,.05,1,[0,sh(K.b1,.25),.6,K.b1,1,K.b2]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.stroke();
 g.save();g.clip();g.fillStyle=K.st;for(i=0;i<4;i++){var sx=-.3-i*.24;g.beginPath();g.moveTo(sx,-.6);g.quadraticCurveTo(sx-.1,0,sx,.6);g.lineTo(sx-.12,.6);g.quadraticCurveTo(sx-.22,0,sx-.12,-.6);g.closePath();g.fill()}
 if(K.fz){g.strokeStyle='rgba(255,240,180,.7)';g.lineWidth=.03;for(i=0;i<14;i++){var a=i/14*TAU;g.beginPath();g.moveTo(-.55+Math.cos(a)*.5,Math.sin(a)*.4);g.lineTo(-.55+Math.cos(a)*.62,Math.sin(a)*.5);g.stroke()}}
 g.beginPath();g.moveTo(-.3,-.38*fat);g.quadraticCurveTo(-.7,-.38*fat,-1.0,-.22);g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=.05;g.lineCap='round';g.stroke();g.restore();
 /* грудь (талия тонкая) */
 g.beginPath();ell(g,.08,-.04,.4*fat*(K.thin?.7:1),.38*fat*(K.thin?.7:1),0);g.fillStyle=RG(g,0,-.2,.04,.55,[0,K.fz?sh(K.b2,.3):'#4a3c58',1,K.fz?K.b2:'#241a30']);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 if(K.fz){g.save();ell(g,.08,-.04,.4*fat,.38*fat,0);g.clip();g.strokeStyle='rgba(255,240,180,.55)';g.lineWidth=.03;for(i=0;i<18;i++){var b=i/18*TAU;g.beginPath();g.moveTo(.08+Math.cos(b)*.3,-.04+Math.sin(b)*.3);g.lineTo(.08+Math.cos(b)*.5,-.04+Math.sin(b)*.5);g.stroke()}g.restore()}
 /* доспех (гексагональный) */
 if(K.armor){var ac=K.armor===2?['#e9f3ff','#9fbbe0','#5d7fb0']:['#ffe27a','#d9a21a','#8a5a00'];
  function hexa(cx,cy,r,rot){g.beginPath();for(var q=0;q<6;q++){var an=rot+q*PI/3;g.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r)}g.closePath()}
  g.save();ell(g,.08,-.04,.4,.38,0);g.clip();for(var hx=-.3;hx<.5;hx+=.26)for(var hy=-.4;hy<.4;hy+=.3){hexa(hx+(Math.round((hy+.4)/.3)%2)*.13,hy,.14,0);g.fillStyle=LG(g,hx,hy-.14,hx,hy+.14,[0,ac[0],1,ac[1]]);g.fill();g.strokeStyle=ac[2];g.lineWidth=.025;g.stroke()}g.restore()}
 /* голова */
 var hx=.62,hy=-.1;
 g.save();g.translate(hx,hy);if(mood===3)g.rotate(.2);
 /* усики */
 g.strokeStyle=K.st;g.lineWidth=.04;g.lineCap='round';var aw=Math.sin(t*5)*.05;
 g.beginPath();g.moveTo(.1,-.3);g.quadraticCurveTo(.22,-.6+aw,.5,-.66+aw);g.stroke();g.beginPath();g.moveTo(-.04,-.32);g.quadraticCurveTo(0,-.62-aw,.14,-.76-aw);g.stroke();
 g.beginPath();ell(g,0,0,.4*fat,.36*fat,0);g.fillStyle=RG(g,-.1,-.15,.04,.6,[0,sh(K.b1,.3),.6,K.b1,1,K.b2]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 /* глаза */
 var ex=.12,ey=-.04,er=.17*(K.thin?1.2:1);
 g.beginPath();ell(g,ex,ey,er,er*1.15,.2);g.fillStyle=RG(g,ex-.05,ey-.07,.01,.26,[0,'#fff',.25,sh(K.eye,.4),1,sh(K.eye,-.4)]);g.fill();g.strokeStyle='#150a10';g.lineWidth=.04;g.stroke();
 var py=mood===2?-.02:.0;g.beginPath();ell(g,ex+.03,ey+py,er*.4,er*(mood===2?.85:.55),.2);g.fillStyle='#120810';g.fill();
 g.beginPath();g.arc(ex-.02,ey-.08,er*.22,0,TAU);g.fillStyle='rgba(255,255,255,.9)';g.fill();
 if(o.bl>0.3){g.beginPath();ell(g,ex,ey,er*1.05,er*1.2,.2);g.fillStyle=K.b1;g.fill()}
 /* бровь */
 g.strokeStyle='#150a10';g.lineWidth=.06;g.lineCap='round';g.beginPath();
 if(mood===0){g.moveTo(ex-.2,ey-.2);g.lineTo(ex+.18,ey-.06)}else if(mood===1){g.moveTo(ex-.14,ey-.26);g.quadraticCurveTo(ex+.04,ey-.3,ex+.2,ey-.2)}else if(mood===2){g.moveTo(ex-.18,ey-.1);g.lineTo(ex+.16,ey-.3)}else{g.moveTo(ex-.18,ey-.06);g.lineTo(ex+.14,ey-.2)}
 g.stroke();
 /* рот/жвалы */
 g.strokeStyle='#150a10';g.lineWidth=.04;g.beginPath();
 if(K.prob){g.moveTo(.32,.06);g.lineTo(.8,.18)}
 else if(mood===2){g.moveTo(.24,.2);g.quadraticCurveTo(.3,.14,.36,.22)}else if(mood===1){g.moveTo(.2,.2);g.quadraticCurveTo(.34,.26,.4,.16)}else{g.moveTo(.2,.18);g.lineTo(.38,.22);g.moveTo(.3,.2);g.lineTo(.3,.3)}
 g.stroke();
 if(!K.prob&&mood!==2){g.beginPath();g.moveTo(.34,.12);g.lineTo(.44,.26);g.lineTo(.3,.2);g.closePath();g.fillStyle='#3a2a2a';g.fill()}
 /* пот страха */
 if(mood===2){g.fillStyle='rgba(150,210,255,.9)';g.beginPath();g.moveTo(-.18,-.34);g.quadraticCurveTo(-.26,-.2,-.18,-.14);g.quadraticCurveTo(-.1,-.2,-.18,-.34);g.fill()}
 /* очки/монокль/усы */
 if(K.gogg){g.beginPath();ell(g,ex,ey,er*1.35,er*1.4,.2);g.strokeStyle='#8a5a20';g.lineWidth=.06;g.stroke();g.beginPath();ell(g,ex,ey,er*1.3,er*1.35,.2);g.fillStyle='rgba(200,235,255,.25)';g.fill();
  g.beginPath();g.moveTo(-.2,-.02);g.lineTo(-.38,-.12);g.strokeStyle='#5a3a10';g.lineWidth=.06;g.stroke()}
 if(K.mono){g.beginPath();g.arc(ex+.02,ey,er*1.35,0,TAU);g.strokeStyle='#ffd04a';g.lineWidth=.045;g.stroke();g.beginPath();g.moveTo(ex+.02,ey+er*1.35);g.quadraticCurveTo(ex-.1,ey+.5,ex-.2,ey+.6);g.strokeStyle='#ffd04a';g.lineWidth=.02;g.stroke()}
 if(K.stache){g.fillStyle='#2a1a10';g.beginPath();g.moveTo(.3,.16);g.quadraticCurveTo(.5,.1,.72,.2);g.quadraticCurveTo(.8,.22,.8,.12);g.quadraticCurveTo(.84,.3,.66,.3);g.quadraticCurveTo(.46,.28,.3,.22);g.closePath();g.fill();
  g.strokeStyle='#2a1a10';g.lineWidth=.035;g.lineCap='round';g.beginPath();g.moveTo(.8,.12);g.quadraticCurveTo(.88,.04,.82,-.04);g.stroke()}
 /* шлем */
 if(K.helm){var hc=K.helm===2?['#f4faff','#a3bfe6','#4d6a98']:['#e5a84a','#b97a1a','#6b4410'];
  g.beginPath();sp(g,[[-.38,-.16],[-.36,-.38],[-.1,-.58],[.2,-.58],[.38,-.4],[.4,-.22]],false,1);g.lineTo(.4,-.17);g.lineTo(-.4,-.17);g.closePath();g.fillStyle=LG(g,-.3,-.5,.3,-.04,[0,hc[0],.5,hc[1],1,hc[2]]);g.fill();g.strokeStyle=sh(hc[2],-.3);g.lineWidth=lw;g.stroke();
  g.beginPath();g.moveTo(-.2,-.5);g.quadraticCurveTo(-.06,-.58,.1,-.54);g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.04;g.stroke();
  g.beginPath();g.moveTo(.05,-.58);g.quadraticCurveTo(-.02,-.88,.18,-.96);g.quadraticCurveTo(.22,-.78,.12,-.6);g.fillStyle=K.helm===2?'#6aa9ff':'#d83a44';g.fill();g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=.025;g.stroke()}
 /* корона из воска (шестигранная) */
 if(K.crown){g.beginPath();g.moveTo(-.28,-.26);g.lineTo(-.34,-.56);g.lineTo(-.16,-.44);g.lineTo(-.02,-.7);g.lineTo(.12,-.44);g.lineTo(.3,-.56);g.lineTo(.26,-.26);g.closePath();g.fillStyle=LG(g,0,-.7,0,-.26,[0,'#fff1a0',1,'#e0a010']);g.fill();g.strokeStyle='#7a4a00';g.lineWidth=lw;g.stroke();
  g.fillStyle='#d83a44';for(i=0;i<3;i++){g.beginPath();g.arc(-.18+i*.18,-.34,.04,0,TAU);g.fill()}}
 g.restore();
 /* копьё/пика */
 if(K.spear||K.lance){var ar=(o.atk||0)*.4;g.save();g.translate(.7,.26);g.rotate(-.3-ar);var L=K.lance?1.5:1.0;
  g.strokeStyle='#6b4423';g.lineWidth=.07;g.lineCap='round';g.beginPath();g.moveTo(-.4,0);g.lineTo(L,0);g.stroke();
  g.beginPath();g.moveTo(L,-.1);g.lineTo(L+.4,0);g.lineTo(L,.1);g.closePath();g.fillStyle=LG(g,L,-.1,L,.1,[0,'#fff',1,'#9fb0c4']);g.fill();g.strokeStyle='#3a4660';g.lineWidth=.03;g.stroke();
  if(K.lance){g.beginPath();g.moveTo(.1,0);g.lineTo(.0,.22);g.lineTo(.5,.12);g.closePath();g.fillStyle='#6aa9ff';g.fill()}
  g.restore()}
 /* ближние ноги */
 g.strokeStyle=K.st;g.lineWidth=.045*thin*1.5+.02;g.lineCap='round';
 g.beginPath();g.moveTo(.08,.28);g.quadraticCurveTo(.0,.55,-.1-lk,.76);g.stroke();g.beginPath();g.moveTo(.26,.2);g.quadraticCurveTo(.3,.5,.26+lk,.72);g.stroke();
 g.restore()}

/* ===== новые бойцы: Жук-бронник, Пила-шестерёнка, Шмель-бомбардир, Паучок на нити ===== */
BK.mortar={b1:'#c9d8ea',b2:'#5a7694',st:'#14202e',eye:'#ffcf4a',fz:0,wing:2,helm:1,armor:2,sc:1.12,fat:1};
function hexPath(g,cx,cy,r,rot){g.beginPath();for(var q=0;q<6;q++){var an=rot+q*PI/3;g.lineTo(cx+Math.cos(an)*r,cy+Math.sin(an)*r)}g.closePath()}
/* o: t, face(1 вправо,-1 влево), st, ang(качение), guard(0..1), dead, tilt */
function drawBeetle(g,x,y,s,o){var t=o.t||0,f=o.face||1,st=o.st||'walk',ol='#17220f',lw=.05,i,roll=st==='roll',gd=Math.max(0,o.guard||0)/.35;
 g.save();g.translate(x,y);g.scale(s,s);
 g.fillStyle='rgba(0,10,20,.3)';g.beginPath();g.ellipse(0,.54,roll?.62:.86,.13,0,0,TAU);g.fill();
 g.scale(f,1);if(o.tilt)g.rotate(o.tilt);
 if(roll){
  /* свернулся в шар и катится; искры из-под панциря */
  for(i=0;i<5;i++){var sx=-.7-i*.22-((t*6)%1)*.2,sy=.4-Math.abs(Math.sin(t*20+i))*.3;glow(g,sx,sy,.18,'#ffcf6a',.5-i*.08)}
  g.save();g.rotate((o.ang||0)*f);
  g.beginPath();g.arc(0,0,.58,0,TAU);g.fillStyle=RG(g,-.2,-.25,.04,.8,[0,'#f0d27a',.45,'#b88a2a',1,'#4a3a14']);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
  g.save();g.beginPath();g.arc(0,0,.58,0,TAU);g.clip();g.strokeStyle='rgba(60,40,10,.75)';g.lineWidth=.04;
  for(i=0;i<3;i++){hexPath(g,Math.cos(i*2.09)*.3,Math.sin(i*2.09)*.3,.24,.3);g.stroke()}
  g.beginPath();g.moveTo(-.6,0);g.lineTo(.6,0);g.stroke();g.restore();g.restore();
  glow(g,.35,-.1,.7,'#ff5a3a',.35+.2*Math.sin(t*30));
 }else{
  var rear=st==='tele'?-.34:st==='stun'?.14:0;
  if(st==='tele')g.translate(Math.sin(t*55)*.03,0);
  g.translate(0,.0);g.rotate(rear);
  /* ножки */
  g.strokeStyle='#1a1a12';g.lineWidth=.07;g.lineCap='round';
  for(i=0;i<3;i++){var ph=t*(st==='walk'?9:0)+i*2.1,lx=-.4+i*.36,sw=Math.sin(ph)*.1;
   g.beginPath();g.moveTo(lx,.3);g.quadraticCurveTo(lx+.12+sw,.46,lx+.14+sw*1.5,.56);g.stroke()}
  /* голова */
  var hy=st==='stun'?.18:.12;
  g.beginPath();ell(g,.74,hy,.27,.22,0);g.fillStyle=RG(g,.7,hy-.08,.03,.4,[0,'#4a4a3a',1,'#16160e']);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
  g.strokeStyle='#2a2418';g.lineWidth=.08;g.beginPath();g.moveTo(.86,hy-.1);g.quadraticCurveTo(1.1,hy-.28,1.12,hy-.52);g.stroke();
  g.beginPath();g.moveTo(.72,hy-.14);g.quadraticCurveTo(.88,hy-.4,.84,hy-.62);g.stroke();
  if(st==='stun'){g.strokeStyle='#ffffff';g.lineWidth=.05;g.beginPath();g.moveTo(.76,hy-.12);g.lineTo(.9,hy+.02);g.moveTo(.9,hy-.12);g.lineTo(.76,hy+.02);g.stroke()}
  else{var er=st==='tele';glow(g,.86,hy-.03,er?.5:.26,er?'#ff3a2a':'#ff7a3a',er?.9:.6);g.beginPath();g.arc(.86,hy-.03,.055,0,TAU);g.fillStyle=er?'#fff0d0':'#ffd0a0';g.fill()}
  /* панцирь */
  var lift=st==='tele'?.1:0;
  g.beginPath();g.moveTo(-.74,.36);g.bezierCurveTo(-.78,-.28-lift,-.1,-.62-lift,.4,-.4-lift);g.bezierCurveTo(.66,-.28,.7,.1,.66,.36);g.closePath();
  g.fillStyle=LG(g,-.3,-.62,.3,.4,[0,'#f3d98a',.35,'#c49a38',.75,'#6a5420',1,'#3a2e12']);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.stroke();
  g.save();g.clip();g.strokeStyle='rgba(70,48,12,.8)';g.lineWidth=.035;
  for(var hx=-.5;hx<.7;hx+=.27)for(var hy2=-.34;hy2<.4;hy2+=.3){hexPath(g,hx+(Math.round((hy2+.34)/.3)%2)*.13,hy2,.15,0);g.stroke()}
  g.strokeStyle='rgba(255,246,200,.5)';g.lineWidth=.07;g.lineCap='round';g.beginPath();g.moveTo(-.5,-.12);g.quadraticCurveTo(-.2,-.5,.25,-.46);g.stroke();g.restore();
  if(st==='tele'){g.globalCompositeOperation='lighter';g.strokeStyle='rgba(255,90,50,.85)';g.lineWidth=.06;g.beginPath();g.moveTo(-.7,.34);g.lineTo(.62,.34);g.stroke();g.globalCompositeOperation='source-over'}
  if(st==='stun'){for(i=0;i<3;i++){var a=t*5+i*2.09;g.fillStyle='#ffe27a';g.beginPath();g.arc(.2+Math.cos(a)*.42,-.74+Math.sin(a)*.12,.07,0,TAU);g.fill()}}
 }
 if(gd>0){g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,255,255,'+(gd*.6)+')';g.beginPath();g.arc(0,0,.7,0,TAU);g.fill();g.globalCompositeOperation='source-over'}
 g.restore()}
/* пила-шестерёнка */
function drawSaw(g,x,y,s,o){var t=o.t||0,refl=!!o.refl,c1=refl?'#c8f4ff':'#e6dcc2',c2=refl?'#4aa6d0':'#8a7a5a',n=11,i;
 g.save();g.translate(x,y);g.scale(s,s);
 glow(g,0,0,1.5,refl?'#6ad6ff':'#ff8a3a',refl?.55:.4);
 for(i=0;i<4;i++){var tx=(refl?-1:1)*(.8+i*.34);glow(g,tx,Math.sin(t*14+i*1.7)*.2,.2,refl?'#aeeaff':'#ffcf6a',.5-i*.1)}
 g.rotate(t*(refl?-13:13));
 g.beginPath();for(i=0;i<n*2;i++){var a=i*PI/n,r=i%2?.62:.98;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);if(i%2===0){var a2=a+PI/n*.5;g.lineTo(Math.cos(a2)*1.02,Math.sin(a2)*1.02)}}
 g.closePath();g.fillStyle=LG(g,-.8,-.8,.8,.8,[0,c1,.5,c2,1,sh(c2,-.4)]);g.fill();g.strokeStyle='#2a2216';g.lineWidth=.07;g.lineJoin='round';g.stroke();
 g.beginPath();g.arc(0,0,.5,0,TAU);g.strokeStyle='rgba(40,30,16,.8)';g.lineWidth=.06;g.stroke();
 for(i=0;i<5;i++){var b=i*TAU/5;g.beginPath();g.moveTo(Math.cos(b)*.2,Math.sin(b)*.2);g.lineTo(Math.cos(b)*.5,Math.sin(b)*.5);g.stroke()}
 g.rotate(-t*(refl?-13:13));
 g.beginPath();g.arc(0,0,.22,0,TAU);g.fillStyle=refl?'#bff2ff':'#ff4a2a';g.fill();g.strokeStyle='#2a1a10';g.lineWidth=.05;g.stroke();
 glow(g,0,0,.4,refl?'#e8fbff':'#ffb08a',.7);
 g.restore()}
/* паучок на нити: тонкая нить к верху экрана, злые жёлтые глаза */
function drawDropper(g,x,y,s,o){var t=o.t||0,st=o.st||'hang',sway=st==='dangle'?Math.sin(t*5)*.25:0,i;
 g.save();
 g.strokeStyle='rgba(240,246,255,.85)';g.lineWidth=Math.max(1.2,s*.05);g.beginPath();g.moveTo(x-sway*s*.3,-10);g.lineTo(x,y-s*.5);g.stroke();
 g.translate(x,y);g.scale(s,s);if(st==='dangle')g.rotate(sway*.25);
 var spread=st==='tele'?.12:st==='drop'?.22:st==='dangle'?.1+Math.sin(t*9)*.04:.05;
 g.strokeStyle='#14101c';g.lineWidth=.07;g.lineCap='round';g.lineJoin='round';
 for(i=0;i<4;i++){for(var sd=-1;sd<=1;sd+=2){var yy=-.1+i*.14,k=(i-1.5)*.18+spread*(i-1.5);
   g.beginPath();g.moveTo(sd*.18,yy);g.quadraticCurveTo(sd*(.62+i*.04),yy-.34-spread,sd*(.78+k),yy+.34+spread*.8);g.stroke()}}
 g.beginPath();ell(g,0,.18,.34,.38,0);g.fillStyle=RG(g,-.1,.05,.03,.5,[0,'#7a3ea8',.6,'#3a1c5a',1,'#1a0c2a']);g.fill();g.strokeStyle='#0e0818';g.lineWidth=.05;g.stroke();
 g.fillStyle='#e8c24a';g.beginPath();g.moveTo(0,.06);g.lineTo(.09,.2);g.lineTo(0,.34);g.lineTo(-.09,.2);g.closePath();g.fill();
 g.beginPath();ell(g,0,-.2,.26,.23,0);g.fillStyle=RG(g,-.08,-.28,.03,.4,[0,'#5a3a7a',1,'#1a0c2a']);g.fill();g.strokeStyle='#0e0818';g.lineWidth=.05;g.stroke();
 var ec=st==='tele'||st==='drop'?'#ff4a3a':'#ffd23a';
 glow(g,-.1,-.22,.3,ec,.8);glow(g,.1,-.22,.3,ec,.8);g.fillStyle='#fff6d0';g.beginPath();g.arc(-.1,-.22,.05,0,TAU);g.arc(.1,-.22,.05,0,TAU);g.fill();
 g.strokeStyle='#e8d0a0';g.lineWidth=.04;g.beginPath();g.moveTo(-.07,-.05);g.lineTo(-.05,.04);g.moveTo(.07,-.05);g.lineTo(.05,.04);g.stroke();
 g.restore()}
