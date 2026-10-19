/* ===== Выпь: хранительница Фонаря (настоящая выпь!) ===== */
var VC={buf:'#c9a15a',buf2:'#a57a3a',dk:'#4a2d17',dk2:'#6b4423',cream:'#ecd9a8',bill:'#c9c552',bill2:'#8a8a2a',leg:'#b8c25a',ol:'#35200f',shawl:'#3b8f8a',shawl2:'#1f5a5f',gold:'#ffd04a'};
function streaks(g,x0,y0,x1,y1,n,len,w,seed,col,ang){var r=seed||1,i;g.strokeStyle=col;g.lineCap='round';
 for(i=0;i<n;i++){r=(r*9301+49297)%233280;var a=r/233280;r=(r*9301+49297)%233280;var b=r/233280;r=(r*9301+49297)%233280;var c=r/233280;
  var x=x0+(x1-x0)*a,y=y0+(y1-y0)*b,l=len*(.6+c*.7);g.lineWidth=w*(.7+c*.6);g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+Math.sin(ang||0)*l*.3+ (c-.5)*.04,y+l*.5,x+Math.sin(ang||0)*l*.5,y+l);g.stroke()}}
/* o: t, bl, bill(0..1 открыт), boom(0..1 надув горла), look, face, glasses(1), lantern(1: посох с фонарём) */
function drawVyp(g,x,y,s,o){o=o||{};var t=o.t||0,f=o.face||1,lw=.04,ol=VC.ol,br=Math.sin(t*1.6)*.012,bm=o.boom||0;
 g.save();g.translate(x,y);g.scale(s*f,s);
 /* посох с фонарём */
 if(o.lantern!==0){g.strokeStyle='#6b4423';g.lineWidth=.07;g.lineCap='round';g.beginPath();g.moveTo(1.0,0);g.lineTo(1.0,-2.5);g.stroke();
  g.beginPath();g.moveTo(1.0,-2.5);g.quadraticCurveTo(1.0,-2.78,.8,-2.76);g.stroke();
  g.beginPath();g.moveTo(.8,-2.76);g.lineTo(.8,-2.64);g.strokeStyle='#8a8a8a';g.lineWidth=.025;g.stroke();
  var lg=o.lamp==null?0:o.lamp;g.beginPath();sp(g,[[.72,-2.64],[.88,-2.64],[.92,-2.34],[.68,-2.34]],true,.4);fs(g,lg>0?LG(g,0,-2.64,0,-2.34,[0,'#fff6c0',1,'#ffb43a']):'#59616b','#2b323a',.03);
  g.beginPath();g.moveTo(.8,-2.64);g.lineTo(.8,-2.34);g.moveTo(.68,-2.48);g.lineTo(.92,-2.48);g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.02;g.stroke();
  g.fillStyle='#2b323a';g.fillRect(.69,-2.68,.22,.06);g.fillRect(.68,-2.36,.24,.05);if(lg>0)glow(g,.8,-2.48,.8,'#ffd25a',.6*lg)}
 /* ноги */
 g.strokeStyle=VC.leg;g.lineWidth=.1;g.lineCap='round';
 g.beginPath();g.moveTo(-.12,-.55);g.lineTo(-.14,-.08);g.stroke();g.beginPath();g.moveTo(.2,-.55);g.lineTo(.22,-.08);g.stroke();
 g.strokeStyle=ol;g.lineWidth=.025;
 g.fillStyle=VC.leg;
 [[-.14],[.22]].forEach(function(p){g.beginPath();g.moveTo(p[0]-.02,-.1);for(var k=-1;k<=1;k++){g.lineTo(p[0]+.24+k*.02,-.02+k*.03)}g.lineTo(p[0]-.18,-.0);g.closePath();g.fillStyle=VC.leg;g.fill();g.stroke()});
 /* хвост-подпушка */
 g.beginPath();sp(g,[[-.45,-.8],[-.7,-.62],[-.78,-.4],[-.5,-.45]],true);fs(g,VC.buf2,ol,lw);
 /* туловище */
 g.beginPath();sp(g,[[-.6,-.95+br],[-.52,-1.38+br],[-.1,-1.6+br],[.4,-1.48+br],[.58,-1.1],[.44,-.68],[-.1,-.52],[-.46,-.64]],true,1);
 g.fillStyle=RG(g,.0,-1.2,.05,1.1,[0,VC.buf,.7,VC.buf2,1,sh(VC.buf2,-.3)]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.stroke();
 g.save();g.clip();
 g.fillStyle=VC.cream;g.beginPath();ell(g,.32,-.95,.28,.5,.1);g.fill();
 streaks(g,.05,-1.4,.55,-.7,26,.28,.03,7,'rgba(74,45,23,.8)',.1);
 streaks(g,-.6,-1.5,.0,-.6,22,.3,.04,3,'rgba(74,45,23,.45)',.2);
 g.restore();
 /* крыло сложенное */
 g.beginPath();sp(g,[[-.5,-1.22],[-.2,-1.46],[.18,-1.36],[.34,-1.02],[.14,-.66],[-.2,-.5],[-.52,-.7]],true,1);
 g.fillStyle=LG(g,-.4,-1.4,.3,-.6,[0,VC.buf,.5,VC.buf2,1,VC.dk2]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 g.save();g.clip();streaks(g,-.5,-1.4,.3,-.8,34,.3,.035,11,'rgba(58,32,14,.75)',.35);g.strokeStyle='rgba(255,230,170,.35)';g.lineWidth=.03;g.beginPath();g.moveTo(-.4,-1.3);g.quadraticCurveTo(-.1,-1.5,.2,-1.25);g.stroke();g.restore();
 /* шея (вытянута вверх) */
 var nw=.24+bm*.09;
 g.beginPath();sp(g,[[.0,-1.45+br],[.02,-1.9],[.06,-2.3],[.16,-2.56],[.5,-2.56],[.56,-2.3],[.56+bm*.12,-1.95],[.54,-1.5+br],[.3,-1.25]],true,1);
 g.fillStyle=RG(g,.3,-2.0,.04,.9,[0,VC.buf,.6,VC.buf2,1,sh(VC.buf2,-.25)]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 g.save();g.clip();g.fillStyle=VC.cream;g.beginPath();ell(g,.44,-2.0,.16+bm*.06,.55,.0);g.fill();
 streaks(g,.28,-2.5,.58,-1.5,26,.34,.034,5,'rgba(74,45,23,.85)',0);g.restore();
 /* шаль */
 g.beginPath();sp(g,[[-.14,-1.42],[.2,-1.56],[.56,-1.46],[.66,-1.22],[.46,-1.0],[.1,-1.12],[-.2,-1.22]],true,1);
 g.fillStyle=LG(g,0,-1.6,.5,-1.0,[0,'#58b7b0',1,VC.shawl2]);g.fill();g.strokeStyle=sh(VC.shawl2,-.4);g.lineWidth=lw;g.stroke();
 g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=.025;g.beginPath();g.moveTo(-.05,-1.38);g.quadraticCurveTo(.28,-1.5,.56,-1.4);g.stroke();
 for(var k=0;k<6;k++){g.beginPath();g.moveTo(-.2+k*.12+.02,-1.2+Math.abs(k-2.5)*.01);g.lineTo(-.22+k*.12,-1.06+Math.abs(k-2.5)*.0);g.strokeStyle=VC.gold;g.lineWidth=.025;g.stroke()}
 /* голова */
 g.save();g.translate(.34,-2.62);g.rotate(-.1);
 /* клюв (вверх!) */
 var bo=o.bill||0;
 g.beginPath();g.moveTo(.02,-.08);g.quadraticCurveTo(.2,-.5,.3,-.92);g.quadraticCurveTo(.34,-.5,.26,0);g.closePath();g.fillStyle=LG(g,0,0,.3,-.9,[0,VC.bill2,1,VC.bill]);g.fill();g.strokeStyle=ol;g.lineWidth=.03;g.stroke();
 g.beginPath();g.moveTo(.06,-.1);g.quadraticCurveTo(.2,-.5,.29,-.86);g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=.02;g.stroke();
 if(bo>0){g.beginPath();g.moveTo(.1,-.02);g.quadraticCurveTo(.22,-.3,.3,-.5-bo*.1);g.lineTo(.26,-.1);g.closePath();g.fillStyle='#7a2a2a';g.fill()}
 /* затылок и макушка */
 g.beginPath();sp(g,[[-.26,.1],[-.24,-.2],[-.02,-.3],[.2,-.22],[.26,.0],[.2,.2],[-.04,.24]],true,1);
 g.fillStyle=RG(g,.0,-.05,.03,.4,[0,VC.buf,1,VC.buf2]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 g.beginPath();sp(g,[[-.24,-.12],[-.2,-.28],[.02,-.32],[.22,-.2],[.1,-.14],[-.08,-.12]],true,1);g.fillStyle=VC.dk;g.fill();
 /* усы-полоска у щёк */
 g.strokeStyle=VC.dk;g.lineWidth=.04;g.lineCap='round';g.beginPath();g.moveTo(.12,.02);g.quadraticCurveTo(.1,.14,.08,.22);g.stroke();
 /* очки */
 if(o.glasses!==0){g.beginPath();g.arc(.06,-.04,.14,0,TAU);g.fillStyle='rgba(220,240,255,.25)';g.fill();g.strokeStyle='#8a6a20';g.lineWidth=.035;g.stroke();
  g.beginPath();g.moveTo(-.08,-.06);g.lineTo(-.26,-.1);g.stroke()}
 eye(g,.06,-.04,.11,{lx:.5,ly:-.3,bl:o.bl,iris:'#f2b21b',lidc:VC.buf2,ol:'#1a0f05',pup:'#0a0605',ir:.78,sc:'#fff9de'});
 /* бровь седая */
 g.beginPath();g.moveTo(-.06,-.2);g.quadraticCurveTo(.08,-.26,.2,-.16);g.strokeStyle='#f3ead0';g.lineWidth=.045;g.stroke();
 g.restore();
 g.restore()}
