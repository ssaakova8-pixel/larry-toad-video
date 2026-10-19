/* ===== g1: общие рисовалки для головоломок ===== */
function hash2(x,y,s){var h=Math.sin(x*127.1+y*311.7+(s||0)*74.7)*43758.5453;return h-Math.floor(h)}
/* подсказка: пульсирующее кольцо вокруг клетки */
function hintRing(x,y,r,t){var pu=.5+.5*Math.sin(t*6);g.save();g.lineWidth=4;g.strokeStyle='rgba(255,236,140,'+(.7+.3*pu)+')';g.beginPath();g.arc(x,y,r*(1+pu*.1),0,TAU);g.stroke();g.globalCompositeOperation='lighter';glow(g,x,y,r*1.6,'#fff0a0',.45+.2*pu);g.restore()}
/* стрелка подсказки: d — направление 0 вправо,1 влево,2 вниз,3 вверх */
function hintArrow(x,y,d,s,t){var ang=[0,PI,PI/2,-PI/2][d],mv=Math.sin(t*7)*s*.12;g.save();g.translate(x,y);g.rotate(ang);g.translate(mv,0);g.beginPath();g.moveTo(s*.55,0);g.lineTo(-s*.1,-s*.42);g.lineTo(-s*.1,-s*.16);g.lineTo(-s*.55,-s*.16);g.lineTo(-s*.55,s*.16);g.lineTo(-s*.1,s*.16);g.lineTo(-s*.1,s*.42);g.closePath();
 g.fillStyle='#ffe27a';g.fill();g.lineWidth=Math.max(2,s*.07);g.strokeStyle='#8a5a00';g.lineJoin='round';g.stroke();g.restore()}
/* дерево: ствол и пышная крона из трёх «облаков» */
function drawTree(x,y,r,seed){g.save();g.translate(x,y);
 g.fillStyle='rgba(0,25,10,.38)';g.beginPath();g.ellipse(r*.1,r*.62,r*.85,r*.3,0,0,TAU);g.fill();
 g.fillStyle=LG(g,-r*.14,0,r*.14,0,[0,'#8a5a30',1,'#4a2c14']);rr(-r*.14,r*.05,r*.28,r*.6,r*.08);g.fill();g.lineWidth=Math.max(1.5,r*.05);g.strokeStyle='#2a160a';g.stroke();
 var L=[[-.5,-.05,.46],[.5,-.05,.46],[0,-.52,.5],[0,-.12,.56],[-.28,-.38,.4],[.3,-.36,.4]],i;
 g.fillStyle='#14502a';L.forEach(function(c){g.beginPath();g.arc(c[0]*r,c[1]*r,c[2]*r+Math.max(1.5,r*.05),0,TAU);g.fill()});
 L.forEach(function(c,j){g.beginPath();g.arc(c[0]*r,c[1]*r,c[2]*r,0,TAU);g.fillStyle=RG(g,c[0]*r-c[2]*r*.3,c[1]*r-c[2]*r*.4,c[2]*r*.05,c[2]*r*1.05,[0,j%2?'#9be06a':'#b3ec78',.55,j%2?'#3f9a48':'#4aa84e',1,'#1f6a34']);g.fill()});
 g.strokeStyle='rgba(15,70,30,.45)';g.lineWidth=Math.max(1,r*.03);for(i=0;i<6;i++){var a=hash2(seed,i,1)*TAU,d=r*(.1+hash2(seed,i,2)*.5);g.beginPath();g.arc(Math.cos(a)*d,-r*.25+Math.sin(a)*d*.8,r*.1,.2,2.4);g.stroke()}
 g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.ellipse(-r*.3,-r*.62,r*.22,r*.1,-.5,0,TAU);g.fill();g.restore()}
function drawRock(x,y,r,seed,snow){g.save();g.translate(x,y);g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(r*.1,r*.5,r*.95,r*.4,0,0,TAU);g.fill();
 var pts=[],i,n=9;for(i=0;i<n;i++){var a=i/n*TAU,d=r*(.78+hash2(seed,i,5)*.28);pts.push([Math.cos(a)*d,Math.sin(a)*d*.78-r*.08])}
 g.beginPath();sp(g,pts,true,1);g.fillStyle=LG(g,-r,-r,r,r,[0,snow?'#eef6ff':'#9aa3b8',.5,snow?'#b9d0ea':'#6e7894',1,snow?'#7f9cc0':'#3f4862']);g.fill();g.lineWidth=Math.max(1.5,r*.07);g.strokeStyle=snow?'#4a6a90':'#272e44';g.lineJoin='round';g.stroke();
 g.strokeStyle='rgba(255,255,255,.3)';g.lineWidth=r*.06;g.beginPath();g.moveTo(-r*.5,-r*.3);g.quadraticCurveTo(-r*.1,-r*.55,r*.3,-r*.35);g.stroke();
 if(snow){g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.ellipse(-r*.05,-r*.38,r*.62,r*.26,-.1,0,TAU);g.fill()}g.restore()}
/* флажок-цель */
function drawFlag(x,y,s,t,on){g.save();g.translate(x,y);if(on!==false)glow(g,0,-s*.5,s*1.4,'#ffe27a',.35+.15*Math.sin(t*4));g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(s*.06,s*.05,s*.32,s*.1,0,0,TAU);g.fill();
 g.strokeStyle='#5a3a1c';g.lineWidth=Math.max(2,s*.08);g.lineCap='round';g.beginPath();g.moveTo(0,0);g.lineTo(0,-s*1.1);g.stroke();
 var w=Math.sin(t*5)*s*.05;g.beginPath();g.moveTo(0,-s*1.1);g.quadraticCurveTo(s*.4,-s*1.12+w,s*.7,-s*.98+w*2);g.quadraticCurveTo(s*.4,-s*.86-w,0,-s*.7);g.closePath();g.fillStyle=LG(g,0,-s*1.1,s*.7,-s*.7,[0,'#ffe27a',1,'#ff9a2a']);g.fill();g.lineWidth=Math.max(1.5,s*.05);g.strokeStyle='#8a4a00';g.stroke();
 g.beginPath();g.arc(0,-s*1.12,s*.07,0,TAU);g.fillStyle='#ffd04a';g.fill();g.stroke();g.restore()}
/* иглу */
function drawIgloo(x,y,r,t,on){g.save();g.translate(x,y);if(on)glow(g,0,-r*.2,r*1.8,'#fff0b0',.5);g.fillStyle='rgba(0,30,70,.35)';g.beginPath();g.ellipse(r*.1,r*.45,r*1.1,r*.35,0,0,TAU);g.fill();
 g.beginPath();g.arc(0,r*.35,r*.95,PI,TAU);g.lineTo(r*.95,r*.35);g.closePath();g.fillStyle=LG(g,-r,-r,r,r*.4,[0,'#ffffff',.6,'#d9ecfb',1,'#9ec6ea']);g.fill();g.lineWidth=Math.max(1.5,r*.06);g.strokeStyle='#4f7aa8';g.stroke();
 g.strokeStyle='rgba(90,130,175,.55)';g.lineWidth=Math.max(1,r*.04);for(var i=1;i<4;i++){g.beginPath();g.arc(0,r*.35,r*.95*i/4+r*.1,PI,TAU);g.stroke()}for(i=-2;i<=2;i++){g.beginPath();g.moveTo(i*r*.3,r*.35);g.lineTo(i*r*.2,-r*.4);g.stroke()}
 g.beginPath();g.arc(0,r*.35,r*.34,PI,TAU);g.lineTo(r*.34,r*.35);g.closePath();g.fillStyle=on?'#ffd86a':'#26324e';g.fill();g.strokeStyle='#4f7aa8';g.stroke();g.restore()}
/* банка со светляком: lit 0..1 */
function drawJar(x,y,r,lit,t,seed){g.save();g.translate(x,y);var f=.65+.35*Math.sin(t*4+seed);
 if(lit>0){g.globalCompositeOperation='lighter';glow(g,0,0,r*2.1,'#ffe27a',.55*lit*f);g.globalCompositeOperation='source-over'}
 g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(r*.05,r*.92,r*.8,r*.2,0,0,TAU);g.fill();
 g.beginPath();g.moveTo(-r*.5,-r*.6);g.quadraticCurveTo(-r*.95,-r*.2,-r*.8,r*.45);g.quadraticCurveTo(-r*.7,r*.92,0,r*.92);g.quadraticCurveTo(r*.7,r*.92,r*.8,r*.45);g.quadraticCurveTo(r*.95,-r*.2,r*.5,-r*.6);g.closePath();
 g.fillStyle=lit>0?RG(g,0,0,r*.05,r*1.05,[0,'rgba(255,248,190,'+(.55+.4*lit)+')',1,'rgba(255,190,70,'+(.35+.3*lit)+')']):RG(g,-r*.2,-r*.2,r*.05,r*1.1,[0,'rgba(200,220,255,.28)',1,'rgba(60,80,130,.55)']);g.fill();
 g.lineWidth=Math.max(1.5,r*.07);g.strokeStyle=lit>0?'#d9902a':'#5a6a96';g.stroke();
 /* светляк */
 var bx=Math.sin(t*1.7+seed)*r*.12*lit,by=Math.cos(t*2.1+seed)*r*.08*lit+r*.1;g.save();g.translate(bx,by);g.globalAlpha=lit>0?1:.55;
 g.fillStyle=lit>0?'#fff6b0':'#8a96b8';g.beginPath();g.ellipse(0,0,r*.2,r*.14,.3,0,TAU);g.fill();g.fillStyle='#3a3426';g.beginPath();g.ellipse(-r*.16,-r*.02,r*.1,r*.1,0,0,TAU);g.fill();
 g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(r*.04,-r*.2,r*.22,r*.1,.5,0,TAU);g.ellipse(r*.04,-r*.2,r*.22,r*.1,-.5,0,TAU);g.fill();
 if(lit<=0){g.fillStyle='#fff';g.font='600 '+r*.28+'px Inter';g.fillText('z',r*.18,-r*.3)}g.restore();
 /* крышка */
 g.fillStyle='#8a5a30';rr(-r*.52,-r*.8,r*1.04,r*.26,r*.1);g.fill();g.lineWidth=Math.max(1,r*.05);g.strokeStyle='#3a220e';g.stroke();
 g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(-r*.45,-r*.05,r*.1,r*.32,.25,0,TAU);g.fill();g.restore()}
function hexA(c,a){var r=hex2rgb(c)||[255,255,255];return'rgba('+r[0]+','+r[1]+','+r[2]+','+a+')'}

/* части Фонаря (картинки для пролога и награды) */
function drawLanternPart_v6(g,x,y,s,ch,t){g.save();g.translate(x,y);g.rotate(Math.sin(t*1.6)*.08);var k=ch;
 if(k===0){/* фитиль */g.strokeStyle='#e6d6a8';g.lineWidth=s*.22;g.lineCap='round';g.beginPath();g.moveTo(-s*.5,s*.4);g.quadraticCurveTo(0,-s*.1,s*.5,-s*.6);g.stroke();g.strokeStyle='#8a6a3a';g.lineWidth=s*.07;g.beginPath();g.moveTo(-s*.5,s*.4);g.quadraticCurveTo(0,-s*.1,s*.5,-s*.6);g.stroke();g.beginPath();g.arc(s*.5,-s*.65,s*.12,0,TAU);g.fillStyle='#ffe27a';g.fill()}
 else if(k===1){/* стекло */g.beginPath();g.moveTo(-s*.45,s*.55);g.lineTo(-s*.5,-s*.3);g.quadraticCurveTo(0,-s*.8,s*.5,-s*.3);g.lineTo(s*.45,s*.55);g.closePath();g.fillStyle=LG(g,-s,-s,s,s,[0,'rgba(240,252,255,.95)',1,'rgba(150,200,235,.6)']);g.fill();g.strokeStyle='#8ac';g.lineWidth=s*.06;g.stroke();g.beginPath();g.moveTo(-s*.25,-s*.25);g.lineTo(-s*.28,s*.3);g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=s*.07;g.stroke()}
 else if(k===2){/* масло */g.beginPath();g.moveTo(0,-s*.7);g.bezierCurveTo(s*.6,-s*.1,s*.5,s*.55,0,s*.6);g.bezierCurveTo(-s*.5,s*.55,-s*.6,-s*.1,0,-s*.7);g.fillStyle=LG(g,0,-s,0,s,[0,'#fff4b0',1,'#ffb43a']);g.fill();g.strokeStyle='#a56000';g.lineWidth=s*.07;g.stroke()}
 else if(k===3){/* оправа */g.strokeStyle='#e0b050';g.lineWidth=s*.14;g.lineJoin='round';g.beginPath();g.moveTo(-s*.5,s*.5);g.lineTo(-s*.5,-s*.3);g.lineTo(0,-s*.7);g.lineTo(s*.5,-s*.3);g.lineTo(s*.5,s*.5);g.closePath();g.stroke();g.strokeStyle='#fff2b0';g.lineWidth=s*.04;g.stroke()}
 else{/* кольцо */g.strokeStyle='#ffd04a';g.lineWidth=s*.2;g.beginPath();g.arc(0,0,s*.5,0,TAU);g.stroke();g.strokeStyle='#fff6b0';g.lineWidth=s*.05;g.beginPath();g.arc(0,0,s*.5,.4,2.2);g.stroke()}
 g.restore()}
