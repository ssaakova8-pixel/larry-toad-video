/* ===== Госпожа Паутинья ===== */
function drawSpider(g,x,y,s,o){o=o||{};var t=o.t||0,lw=.045,ol='#1d1030',mood=o.mood||0,top=o.top==null?-9999:o.top;
 g.save();
 /* нить */
 if(top>-9000){g.strokeStyle='rgba(235,240,255,.85)';g.lineWidth=Math.max(1.5,s*.04);g.beginPath();g.moveTo(x,top);g.lineTo(x,y-s*.9);g.stroke()}
 g.translate(x,y);g.scale(s,s);if(o.tilt)g.rotate(o.tilt);
 var sw=Math.sin(t*3)*.08,k;
 /* ноги */
 g.strokeStyle='#3a2458';g.lineCap='round';g.lineJoin='round';
 for(k=0;k<4;k++){var a=-.4+k*.34,up=(k%2?1:-1)*sw;
  [-1,1].forEach(function(sd){g.lineWidth=.09;g.beginPath();g.moveTo(sd*.28,-.05+k*.02);g.quadraticCurveTo(sd*(.9+k*.12),-.5-k*.08+up,sd*(1.15+k*.16),.35+k*.2+up*.5);g.stroke();g.lineWidth=.05;g.strokeStyle='#5a3a80';g.beginPath();g.moveTo(sd*.28,-.05+k*.02);g.quadraticCurveTo(sd*(.9+k*.12),-.52-k*.08+up,sd*(1.15+k*.16),.33+k*.2+up*.5);g.stroke();g.strokeStyle='#3a2458'})}
 /* брюшко */
 g.beginPath();ell(g,0,.4,.55,.6,0);g.fillStyle=RG(g,-.15,.2,.05,.9,[0,'#9a7ad0',.6,'#5a3a90',1,'#2e1a56']);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 g.save();ell(g,0,.4,.55,.6,0);g.clip();g.strokeStyle='rgba(255,235,255,.7)';g.lineWidth=.04;for(k=0;k<4;k++){g.beginPath();g.ellipse(0,.4,.12+k*.12,.14+k*.13,0,0,TAU);g.stroke()}g.fillStyle='rgba(255,230,120,.8)';g.beginPath();g.moveTo(0,.12);g.lineTo(.1,.4);g.lineTo(0,.68);g.lineTo(-.1,.4);g.closePath();g.fill();g.restore();
 /* голова */
 g.beginPath();ell(g,0,-.22,.46,.4,0);g.fillStyle=RG(g,-.12,-.4,.04,.7,[0,'#b89ae6',.6,'#6a46a8',1,'#3a2266']);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 /* кружевной воротник */
 g.fillStyle='#fffaf0';for(k=-3;k<=3;k++){g.beginPath();g.arc(k*.12,.1+Math.abs(k)*.02,.07,0,PI);g.fill()}
 g.beginPath();g.moveTo(-.4,.08);g.quadraticCurveTo(0,.2,.4,.08);g.strokeStyle='#e0d6c0';g.lineWidth=.03;g.stroke();
 /* глаза в очках */
 var st=o.stun;for(k=-1;k<=1;k+=2){var ex=k*.2,ey=-.24;g.beginPath();g.arc(ex,ey,.17,0,TAU);g.fillStyle='rgba(235,248,255,.35)';g.fill();
  if(st){g.strokeStyle='#150a24';g.lineWidth=.05;g.lineCap='round';g.beginPath();g.moveTo(ex-.07,ey-.07);g.lineTo(ex+.07,ey+.07);g.moveTo(ex+.07,ey-.07);g.lineTo(ex-.07,ey+.07);g.stroke()}
  else{eye(g,ex,ey,.12,{lx:o.lx||0,ly:.1,iris:'#7a2a9a',lidc:'#6a46a8',lid:mood===1?.3:0,tilt:mood===1?k*.7:0,ol:'#150a24',sc:'#fff'});}
  g.beginPath();g.arc(ex,ey,.17,0,TAU);g.strokeStyle='#d0a020';g.lineWidth=.045;g.stroke()}
 g.beginPath();g.moveTo(-.04,-.24);g.lineTo(.04,-.24);g.strokeStyle='#d0a020';g.lineWidth=.04;g.stroke();
 /* малые глазки */
 g.fillStyle='#150a24';g.beginPath();g.arc(-.08,-.46,.03,0,TAU);g.arc(.08,-.46,.03,0,TAU);g.fill();
 /* рот и румянец */
 g.fillStyle='rgba(255,130,170,.4)';ell(g,-.3,-.08,.07,.04,0);g.fill();ell(g,.3,-.08,.07,.04,0);g.fill();
 g.strokeStyle='#150a24';g.lineWidth=.035;g.lineCap='round';g.beginPath();if(mood===1){g.moveTo(-.1,.0);g.quadraticCurveTo(0,-.05,.1,.0)}else{g.moveTo(-.1,-.04);g.quadraticCurveTo(0,.06,.1,-.04)}g.stroke();
 /* бантик */
 g.fillStyle='#ff6fa0';g.beginPath();g.moveTo(.3,-.52);g.lineTo(.5,-.62);g.lineTo(.5,-.4);g.closePath();g.fill();g.beginPath();g.moveTo(.3,-.52);g.lineTo(.1,-.62);g.lineTo(.1,-.4);g.closePath();g.fill();g.beginPath();g.arc(.3,-.52,.05,0,TAU);g.fillStyle='#ffd0e0';g.fill();
 g.restore()}
