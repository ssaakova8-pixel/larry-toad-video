/* ===== Крапинка: божья коровка, вестовая болота ===== */
var KC={red:'#e8323c',red2:'#a0182b',blk:'#1b1620',blk2:'#3a3043',wh:'#fff6e8',blue:'#2f7fe0',blue2:'#174a9c',gold:'#ffc83d',scarf:'#2a8fe8',scarf2:'#14569e',cheek:'#ff9aa8'};
/* o: t, fly(0..1: крылья), flap(фаза), mouth(0..3), bl, lx, ly, brow(-1..1), face, tilt, goggles(0|1), scarf wave, talk(0..1 открытие рта) */
function drawKrap(g,x,y,s,o){o=o||{};var t=o.t||0,fl=o.fly==null?1:o.fly,f=o.face||1,lw=.04,ol=KC.blk,bob=Math.sin(t*3.2)*.04*fl,flap=o.flap==null?t*38:o.flap;
 g.save();g.translate(x,y+bob*s);g.scale(s*f,s);if(o.tilt)g.rotate(o.tilt);
 /* дальнее крыло */
 var wa=fl>0?Math.sin(flap)*.5:.0;
 function wing(dir,alpha){g.save();g.translate(-.08,-.42);g.rotate(-1.15+wa*dir-(fl>0?0:.9));
  g.beginPath();sp(g,[[0,0],[.35,-.22],[.9,-.2],[1.1,-.02],[.85,.12],[.3,.1]],true,1);g.fillStyle=LG(g,0,0,1,0,[0,'rgba(210,235,255,'+alpha+')',1,'rgba(240,250,255,'+alpha*.5+')']);g.fill();
  g.strokeStyle='rgba(120,160,210,'+alpha*.9+')';g.lineWidth=.025;g.stroke();
  g.beginPath();g.moveTo(.05,0);g.quadraticCurveTo(.5,-.13,1.0,-.03);g.strokeStyle='rgba(120,160,210,.5)';g.lineWidth=.015;g.stroke();g.restore()}
 wing(1,.55);
 /* ноги-ручки (дальние) */
 g.strokeStyle=ol;g.lineWidth=.06;g.lineCap='round';
 g.beginPath();g.moveTo(-.1,.12);g.quadraticCurveTo(-.2,.3,-.28,.4+(fl?.05:0));g.stroke();
 g.beginPath();g.moveTo(.1,.14);g.quadraticCurveTo(.12,.32,.06,.44);g.stroke();
 /* надкрылья (тело) */
 g.beginPath();sp(g,[[-.62,.05],[-.6,-.3],[-.3,-.58],[.14,-.62],[.5,-.38],[.58,-.02],[.4,.26],[-.1,.34],[-.5,.26]],true,1);
 g.fillStyle=RG(g,-.1,-.4,.04,.95,[0,'#ff7b72',.35,KC.red,1,KC.red2]);g.fill();g.strokeStyle=sh(KC.red2,-.5);g.lineWidth=lw;g.lineJoin='round';g.stroke();
 /* шов */
 g.save();g.clip();g.strokeStyle='rgba(30,10,20,.7)';g.lineWidth=.035;g.beginPath();g.moveTo(.0,-.66);g.quadraticCurveTo(-.06,-.1,-.05,.4);g.stroke();
 g.fillStyle=KC.blk;var pts=[[-.34,-.3,.1],[-.3,.04,.085],[.18,-.36,.09],[.28,-.04,.1],[-.1,-.1,.07],[-.52,-.1,.06],[.46,-.22,.06]];
 for(var i=0;i<pts.length;i++){g.beginPath();g.arc(pts[i][0],pts[i][1],pts[i][2],0,TAU);g.fill()}
 g.beginPath();g.moveTo(-.55,-.35);g.quadraticCurveTo(-.2,-.62,.2,-.58);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=.06;g.lineCap='round';g.stroke();
 g.restore();
 /* ближнее крыло */
 wing(-1,.62);
 /* ноги ближние */
 g.strokeStyle=ol;g.lineWidth=.06;g.lineCap='round';
 g.beginPath();g.moveTo(.22,.2);g.quadraticCurveTo(.3,.34,.26,.48+(fl?.02:0));g.stroke();
 g.beginPath();g.moveTo(-.28,.24);g.quadraticCurveTo(-.34,.36,-.4,.46);g.stroke();
 /* сумка */
 g.beginPath();sp(g,[[-.34,.0],[-.04,.0],[0,.26],[-.34,.28]],true,.6);fs(g,LG(g,0,0,0,.3,[0,'#d9a441',1,'#9a6a20']),'#4a2f10',.03);
 g.beginPath();g.moveTo(-.34,.02);g.lineTo(-.04,.04);g.strokeStyle='#4a2f10';g.lineWidth=.03;g.stroke();g.beginPath();g.arc(-.19,.13,.025,0,TAU);g.fillStyle=KC.gold;g.fill();
 g.beginPath();g.moveTo(-.34,.0);g.quadraticCurveTo(-.1,-.35,.3,.0);g.strokeStyle='#7a4a1a';g.lineWidth=.04;g.stroke();
 /* шарф */
 var sw=Math.sin(t*5)*.06*(fl?1:.4);
 g.beginPath();sp(g,[[.2,-.1],[-.1,-.0],[-.5,.04+sw],[-.88,.0-sw],[-.72,.16],[-.42,.14+sw],[-.1,.14],[.24,.08]],true,1);
 g.fillStyle=LG(g,-.8,0,.2,.1,[0,KC.scarf2,1,KC.scarf]);g.fill();g.strokeStyle=sh(KC.scarf2,-.4);g.lineWidth=.03;g.stroke();
 g.beginPath();g.moveTo(-.1,.02);g.quadraticCurveTo(-.5,.05+sw,-.8,.0-sw);g.strokeStyle='rgba(255,255,255,.3)';g.lineWidth=.03;g.stroke();
 /* голова */
 var hx=.5,hy=-.08;
 g.save();g.translate(hx,hy);
 /* усики */
 var aw=Math.sin(t*4)*.06;
 g.strokeStyle=ol;g.lineWidth=.04;g.lineCap='round';
 g.beginPath();g.moveTo(.06,-.3);g.quadraticCurveTo(.12,-.58+aw,.38,-.7+aw);g.stroke();g.beginPath();g.arc(.4,-.7+aw,.055,0,TAU);g.fillStyle=KC.gold;g.fill();g.stroke();
 g.beginPath();g.moveTo(-.1,-.32);g.quadraticCurveTo(-.2,-.6-aw,-.12,-.8-aw);g.stroke();g.beginPath();g.arc(-.12,-.82-aw,.055,0,TAU);g.fillStyle=KC.gold;g.fill();g.stroke();
 /* лицо */
 g.beginPath();g.arc(0,0,.42,0,TAU);g.fillStyle=RG(g,-.1,-.2,.03,.55,[0,KC.blk2,1,KC.blk]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 /* белые щёчки/пятна ладыбаг */
 g.fillStyle=KC.wh;g.beginPath();sp(g,[[-.34,.02],[-.28,-.2],[-.12,-.28],[-.1,-.1],[-.14,.1],[-.26,.16]],true);g.fill();
 g.beginPath();sp(g,[[.4,.0],[.34,-.2],[.2,-.28],[.18,-.08],[.22,.12],[.34,.16]],true);g.fill();
 /* румянец */
 g.fillStyle='rgba(255,120,150,.55)';ell(g,-.16,.2,.08,.05,0);g.fill();ell(g,.3,.2,.07,.045,0);g.fill();
 /* очки на лбу */
 if(o.goggles!==0){g.save();g.rotate(-.1);g.beginPath();g.moveTo(-.4,-.24);g.quadraticCurveTo(0,-.36,.42,-.24);g.strokeStyle='#6b3f1d';g.lineWidth=.07;g.stroke();
  g.beginPath();ell(g,-.14,-.3,.13,.1,0);fs(g,RG(g,-.17,-.34,.01,.14,[0,'#e8f6ff',1,KC.blue]),'#9a6a20',.04);g.beginPath();ell(g,.18,-.3,.13,.1,0);fs(g,RG(g,.15,-.34,.01,.14,[0,'#e8f6ff',1,KC.blue]),'#9a6a20',.04);g.restore()}
 /* глаза */
 var lid=o.lid||0,br=o.brow||0;
 eye(g,-.18,.0,.15,{lx:o.lx==null?.5:o.lx,ly:o.ly||0,bl:o.bl,lid:lid,iris:KC.blue,lidc:KC.blk2,ol:'#000',tilt:br*.6,ir:.7});
 eye(g,.24,.0,.15,{lx:o.lx==null?.5:o.lx,ly:o.ly||0,bl:o.bl,lid:lid,iris:KC.blue,lidc:KC.blk2,ol:'#000',tilt:-br*.6,ir:.7});
 /* ресницы */
 g.strokeStyle='#000';g.lineWidth=.035;g.lineCap='round';
 g.beginPath();g.moveTo(-.31,-.06);g.lineTo(-.4,-.12);g.moveTo(-.31,-.0);g.lineTo(-.42,-.02);g.stroke();
 g.beginPath();g.moveTo(.37,-.06);g.lineTo(.46,-.12);g.moveTo(.37,0);g.lineTo(.48,-.02);g.stroke();
 /* рот */
 var m=o.mouth==null?1:o.mouth,my=.26;
 g.strokeStyle='#ffb0b8';g.lineWidth=.035;g.lineCap='round';
 if(m===0){g.beginPath();g.moveTo(.0,my);g.lineTo(.18,my);g.stroke()}
 else if(m===1){g.beginPath();g.moveTo(-.02,my-.02);g.quadraticCurveTo(.1,my+.1,.22,my-.03);g.stroke()}
 else{var oo=m===3?.12:.07;g.beginPath();g.moveTo(-.02,my-.02);g.quadraticCurveTo(.1,my+oo*2,.22,my-.03);g.quadraticCurveTo(.1,my+.01,-.02,my-.02);g.fillStyle='#7a1830';g.fill();g.stroke()}
 g.restore();
 g.restore()}
